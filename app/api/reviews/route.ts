import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET() {
  const row = await prisma.reviewsCache.findUnique({ where: { id: 'google' } })
  const payload = row?.payload ?? { rating: null, total: null, mapsUrl: null, reviews: [] }
  return NextResponse.json(payload, {
    headers: { 'Cache-Control': 's-maxage=900, stale-while-revalidate=3600' }
  })
}
