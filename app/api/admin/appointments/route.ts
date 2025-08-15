import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { PrismaClient, Prisma } from '@prisma/client'

const prisma = new PrismaClient()
export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const appts = await prisma.appointment.findMany({ orderBy: { createdAt: 'desc' } })

  const packSlugs = new Set<string>()
  const sizeIds = new Set<string>()

  for (const a of appts) {
    const packSlug = a.pack as string | undefined
    if (packSlug) packSlugs.add(packSlug)
    const sizeId = a.size as string | undefined
    if (sizeId) sizeIds.add(sizeId)
  }

  const packs = packSlugs.size
    ? await prisma.pack.findMany({
        where: { slug: { in: [...packSlugs] } },
        include: { items: { include: { service: true }, orderBy: { order: 'asc' } } },
      })
    : []
  const packBySlug = new Map<string, (typeof packs)[number]>()
  packs.forEach((p: any) => packBySlug.set(p.slug, p))

  const sizes = sizeIds.size
    ? await prisma.size.findMany({ where: { id: { in: [...sizeIds] } } })
    : []
  const sizeById = new Map(sizes.map((s: any) => [s.id, s]))

  const enriched = appts.map((a: any) => {
    const packSlug = a.pack as string | undefined
    const sizeId = a.size as string | undefined
    
    // Analyse des items depuis le JSON
    let servicesResolved: { id: string; name: string; price: number }[] = []
    try {
      const items = a.items ? JSON.parse(a.items as string) : []
      if (Array.isArray(items)) {
        servicesResolved = items.map((item: any) => ({
          id: item.id || '',
          name: item.name || 'Service inconnu',
          price: typeof item.price === 'number' ? item.price : 0 // Prix déjà en euros dans le JSON
        }))
      }
    } catch (error) {
      // Si pas d'items dans le JSON, essayer de récupérer depuis le pack
      if (packSlug && packBySlug.get(packSlug)) {
        const p = packBySlug.get(packSlug)!
        servicesResolved = p.items.map((pi: any) => ({
          id: pi.service.id,
          name: pi.service.name,
          price: Math.round(pi.service.price / 100), // Prix BDD en centimes → euros
        }))
      }
    }

    let packName: string | null = null
    let isCustom = false
    
    if (packSlug && packBySlug.get(packSlug)) {
      const p = packBySlug.get(packSlug)!
      packName = p.name
      
      // Détermine si c'est un pack custom en comparant les services
      const baseServices = p.items.map((pi: any) => pi.service.id).sort()
      const currentServices = servicesResolved.map(s => s.id).sort()
      isCustom = JSON.stringify(baseServices) !== JSON.stringify(currentServices)
    } else if (servicesResolved.length > 0) {
      // Pas de pack défini mais des services = pack custom
      isCustom = true
      packName = null
    }

    const sizeLabel = sizeId ? ((sizeById.get(sizeId) as any)?.label ?? sizeId) : null
    const amountTotal = a.amountTotal ? Math.round(a.amountTotal / 100) : null

    return {
      id: a.id,
      createdAt: a.createdAt,
      name: a.name ?? null,
      email: a.email ?? null,
      phone: a.phone ?? null,
      packSlug: packSlug ?? null,
      packName,
      sizeId: sizeId ?? null,
      sizeLabel,
      isCustom,
      services: servicesResolved,
      servicesCount: servicesResolved.length,
      stripePaymentIntentId: a.stripePaymentIntentId ?? null,
      stripeSessionId: a.stripeSessionId ?? null,
      paymentStatus: a.paymentStatus ?? null,
      amountTotal,
      when: a.when ?? null,
      note: a.note ?? null,
      interventionAddress: a.addressLine ?? null,
    }
  })

  return NextResponse.json(enriched)
}
