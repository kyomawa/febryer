// app/api/admin/appointments/[id]/capture/route.ts
import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { PrismaClient } from '@prisma/client'
import { stripe } from '@/lib/stripe'
const prisma = new PrismaClient()
export const runtime = 'nodejs'; export const dynamic = 'force-dynamic';

export async function POST(_req: Request, ctx: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await ctx.params
    const session = await getServerSession(authOptions)
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const appt = await prisma.appointment.findUnique({ where: { id } })
    if (!appt?.stripePaymentIntentId) {
      return NextResponse.json({ error: 'PaymentIntent manquant' }, { status: 400 })
    }
    const pi = await stripe.paymentIntents.capture(appt.stripePaymentIntentId)
    await prisma.appointment.update({
      where: { id },
      data: { paymentStatus: 'succeeded', capturedAt: new Date(), amountTotal: pi.amount ?? appt.amountTotal },
    })
    return NextResponse.json({ ok: true })
  } catch (e:any) {
    return NextResponse.json({ error: e.message || 'capture failed' }, { status: 500 })
  }
}
