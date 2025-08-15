import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()
export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET() {
  const packs = await prisma.pack.findMany({
    where: { active: true },
    orderBy: [{ order: 'asc' }, { name: 'asc' }],
    include: {
      items: {
        orderBy: { order: 'asc' },
        include: { service: true }
      }
    }
  })
  const out = packs.map(p => ({
    id: p.id,
    slug: p.slug,
    name: p.name,
    desc: p.desc,
    items: p.items.map(i => i.serviceId), // juste les ids de service
  }))
  return NextResponse.json({ packs: out })
}
