import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()
export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET() {
  const items = await prisma.service.findMany({
    where: { active: true },
    orderBy: [{ group: 'asc' }, { order: 'asc' }, { name: 'asc' }],
  })
  // Groupage des services par catégorie pour l'interface client
  const grouped = items.reduce((acc: Record<string, any[]>, s) => {
    (acc[s.group] ||= []).push({
      id: s.id, name: s.name, price: Math.round(s.price/100), group: s.group
    })
    return acc
  }, {})
  return NextResponse.json({ groups: grouped })
}
