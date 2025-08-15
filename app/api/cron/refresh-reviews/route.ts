import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { scrapeReviewsByCid } from '@/lib/scrappers/gmaps'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'
export const maxDuration = 60

function unauthorized() { return NextResponse.json({ error: 'Unauthorized' }, { status: 401 }) }

export async function GET(req: Request) {
  const url = new URL(req.url)
  const key = url.searchParams.get('key')
  if (!process.env.CRON_SECRET) return unauthorized()
  if (key !== process.env.CRON_SECRET) return unauthorized()

  const cid = process.env.GOOGLE_CID
  if (!cid) return NextResponse.json({ error: 'GOOGLE_CID manquant' }, { status: 400 })

  try {
    const data = await scrapeReviewsByCid(cid, { limit: 3, max: 9, locale: 'fr-FR' })
    await prisma.reviewsCache.upsert({
      where: { id: 'google' },
      update: { payload: data },
      create: { id: 'google', payload: data },
    })
    return NextResponse.json({ ok: true, updatedAt: new Date().toISOString() })
  } catch (e:any) {
    return NextResponse.json({ error: e.message ?? 'Scrape failed' }, { status: 500 })
  }
  
}
