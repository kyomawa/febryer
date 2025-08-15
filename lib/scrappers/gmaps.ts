// lib/scrapers/gmaps.ts
import fs from 'node:fs'
import chromiumLambda from '@sparticuz/chromium'
import playwrightCore from 'playwright-core'
import type { Page, Browser } from 'playwright-core' // Lecture de la note et du total dans l'entête // Lecture des données de l'entête (note et total)

export type Review = { author: string; rating: number | null; text: string; time: string | null }
export type ScrapeResult = { cid: string; rating: number | null; total: number | null; mapsUrl: string; reviews: Review[] }

const isServerless =
  !!process.env.VERCEL && process.platform === 'linux' && process.env.FORCE_LOCAL_BROWSER !== '1'

async function openBrowser(debug = false): Promise<Browser> {
  if (isServerless) {
    const executablePath = await chromiumLambda.executablePath()
    return await playwrightCore.chromium.launch({
      headless: true,
      args: chromiumLambda.args,
      executablePath,
      ignoreDefaultArgs: ['--disable-dev-shm-usage'],
    })
  }
  try {
    // @ts-ignore local dev import
    const { chromium } = await import('playwright')
    return await chromium.launch({ headless: !debug })
  } catch {
    const executablePath = findLocalChrome()
    return await playwrightCore.chromium.launch({ headless: !debug, executablePath })
  }
}

function findLocalChrome(): string {
  const candidates = [
    process.env.CHROME_PATH,
    'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
    'C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe',
    'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
    '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    '/usr/bin/google-chrome',
    '/usr/bin/chromium-browser',
  ].filter(Boolean) as string[]
  for (const p of candidates) { try { if (p && fs.existsSync(p)) return p } catch {} }
  throw new Error(
    'Chrome/Edge introuvable. Installe Chrome/Edge OU `npm i -D playwright && npx playwright install chromium`, OU définis CHROME_PATH.'
  )
}

async function waitStable(page: Page) {
  await page.waitForLoadState('domcontentloaded').catch(() => {})
  await page.waitForTimeout(400)
}
async function clickAndWait(page: Page, target: string | ReturnType<Page['locator']>) {
  const loc = typeof target === 'string' ? page.locator(target).first() : target
  await Promise.all([
    page.waitForLoadState('domcontentloaded').catch(() => {}),
    loc.click({ timeout: 5000 }).catch(() => {}),
  ])
  await page.waitForTimeout(400)
}

async function acceptConsent(page: Page) {
  if (/consent\./i.test(page.url())) {
    const choices = [
      'button:has-text("Tout accepter")','button:has-text("Accepter tout")','button:has-text("J’accepte")',
      'button:has-text("I agree")','button:has-text("Accept all")','form[action*="consent"] button[type="submit"]',
    ]
    for (const sel of choices) {
      const btn = page.locator(sel).first()
      if (await btn.count().catch(() => 0)) {
        await Promise.all([
          page.waitForNavigation({ waitUntil: 'domcontentloaded', timeout: 8000 }).catch(() => {}),
          btn.click().catch(() => {}),
        ])
        break
      }
    }
    await waitStable(page)
  }
  const overlayChoices = [
    'button:has-text("Tout accepter")','button:has-text("Tout refuser")','button:has-text("J’accepte")',
    'button:has-text("Accept all")','button:has-text("Reject all")',
  ]
  for (const sel of overlayChoices) {
    const btn = page.locator(sel).first()
    if (await btn.count().catch(() => 0)) { await clickAndWait(page, btn); break }
  }
}

/** Extrait la note et le total d’avis depuis l’entête (rapide & fiable). */
async function readHeaderSummary(page: Page) {
  // total via <span class="Rq4Jaf GtjMxb" role="listitem">7 avis</span>
  let total: number | null = null
  const totalSpan = page.locator('span.Rq4Jaf.GtjMxb[role="listitem"]').first()
  if (await totalSpan.count().catch(() => 0)) {
    const t = (await totalSpan.innerText().catch(() => '')).trim()
    const m = t.match(/(\d[\d\s]*)\s*avis/i)
    if (m) total = parseInt(m[1].replace(/\D+/g, ''), 10)
  }
  // fallback total via lien lrd s’il existe
  if (total == null) {
    const lrd = page.locator('a[href*="lrd"]').first()
    if (await lrd.count().catch(() => 0)) {
      const t = (await lrd.innerText().catch(() => '')).trim()
      const m = t.match(/(\d[\d\s]*)\s*avis/i)
      if (m) total = parseInt(m[1].replace(/\D+/g, ''), 10)
    }
  }

  // note globale : aria-label "* étoiles" proche du header (hors cartes d’avis)
  let rating: number | null = null
  const ratingVal = await page.evaluate(() => {
    function isInsideCard(el: Element | null) {
      while (el) { if (el.matches?.('div[class*="jftiEf"]')) return true; el = el.parentElement! }
      return false
    }
    const cands = Array.from(document.querySelectorAll<HTMLElement>(
      '[aria-label*="étoile"],[aria-label*="étoiles"],div[role="img"][aria-label*="étoile"]'
    ))
    for (const el of cands) {
      if (isInsideCard(el)) continue
      const lab = el.getAttribute('aria-label') || ''
      const n = (lab.match(/([\d.,]+)/)?.[1] || '').replace(',', '.')
      if (n) return parseFloat(n)
    }
    return null
  })
  if (typeof ratingVal === 'number' && !Number.isNaN(ratingVal)) rating = ratingVal

  return { rating, total }
}

async function goToReviews(page: Page) {
  const btn = page.getByRole('button', { name: /avis/i }).first()
  if (await btn.count().catch(() => 0)) await clickAndWait(page, btn)
  else {
    const link = page.getByText(/^Avis\b/i).first()
    if (await link.count().catch(() => 0)) await clickAndWait(page, link)
  }
  await page.waitForSelector('div[class*="jftiEf"]', { timeout: 8000 }).catch(() => {})
  await waitStable(page)
}

async function setSortNewest(page: Page) {
  const sortBtn = page.getByRole('button', { name: /(trier|sort)/i }).first()
  if (await sortBtn.count().catch(() => 0)) await sortBtn.click().catch(() => {})
  else {
    const alt = page.locator('button:has-text("Trier"), div[role="button"]:has-text("Trier"), button:has-text("Sort")').first()
    if (await alt.count().catch(() => 0)) await alt.click().catch(() => {})
  }
  const newest = page
    .locator('div[role="menu"] div:has-text("Les plus récents"), div[role="menu"] div:has-text("Plus récents"), div[role="menu"] div:has-text("Newest")')
    .first()
  if (await newest.count().catch(() => 0)) await clickAndWait(page, newest)
  await waitStable(page)
}

async function slowScroll(page: Page, steps: number, px = 1400) {
  for (let i = 0; i < steps; i++) {
    await page.mouse.wheel(0, px)
    await page.waitForTimeout(450)
  }
}

export async function scrapeReviewsByCid(
  cid: string,
  { max = 12, limit = 3, locale = 'fr-FR', debug = false }: { max?: number; limit?: number; locale?: string; debug?: boolean } = {}
): Promise<ScrapeResult> {
  if (!cid) throw new Error('CID manquant')

  const browser = await openBrowser(debug)
  const ctx = await browser.newContext({ locale, viewport: { width: 1280, height: 900 } })
  const page = await ctx.newPage()

  const mapsUrl = `https://www.google.com/maps?hl=fr&cid=${cid}`
  await page.goto(mapsUrl, { waitUntil: 'domcontentloaded' })
  await waitStable(page)
  await acceptConsent(page)

  // ✅ lis la note & le total directement dans l’entête
  const header = await readHeaderSummary(page)

  // onglet Avis + tri “Les plus récents”
  await goToReviews(page)
  await setSortNewest(page)
  await slowScroll(page, Math.max(1, Math.ceil((limit ?? 3) / 3)))

  // cartes d’avis
  const cardSel = 'div[class*="jftiEf"]'
  const nameSel = 'a[class*="d4r55"], div[class*="d4r55"]'
  const noteSel = 'span[class*="kvMYJc"]'
  const textSel = 'span[class*="wiI7pd"], div[class*="MyEned"]'
  const dateSel = 'span[class*="rsqaWe"], span[class*="bp9Aid"]'

  const cards = await page.locator(cardSel).all().catch(() => [])
  const reviews: Review[] = []
  for (const card of cards) {
    if (reviews.length >= Math.max(limit ?? 3, max ?? 12)) break
    const author = (await card.locator(nameSel).first().innerText().catch(() => null))?.trim() || 'Utilisateur Google'
    const noteLabel = await card.locator(noteSel).first().getAttribute('aria-label').catch(() => null)
    const rating = noteLabel ? parseFloat((noteLabel.match(/([\d.,]+)/)?.[1] || '').replace(',', '.')) : null
    const text = (await card.locator(textSel).first().innerText().catch(() => ''))?.replace(/\s+\n/g, ' ').trim() || ''
    const time = (await card.locator(dateSel).first().innerText().catch(() => null))?.trim() || null
    if (author || text) reviews.push({ author, rating, text, time })
  }

  // finalisation rating/total + fallbacks doux
  let rating: number | null = header.rating ?? null
  let total: number | null = header.total ?? null

  if (rating == null) {
    const vals = reviews.map(r => r.rating).filter((n): n is number => typeof n === 'number' && !Number.isNaN(n))
    if (vals.length) rating = Math.round((vals.reduce((a,b)=>a+b,0) / vals.length) * 10) / 10
  }
  if (total == null) total = reviews.length || null

  await browser.close()
  return { cid, rating, total, mapsUrl, reviews: reviews.slice(0, limit ?? 3) }
}
