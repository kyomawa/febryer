import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()
export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET() {
  const sizes = await prisma.size.findMany({
    orderBy: [{ order: 'asc' }, { label: 'asc' }]
  })
  const out = sizes.map(s => ({ id: s.id, label: s.label, mult: s.mult }))
  return NextResponse.json({ sizes: out })
}
