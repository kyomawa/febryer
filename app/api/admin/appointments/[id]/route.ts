// app/api/admin/appointments/[id]/route.ts
import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { PrismaClient } from '@prisma/client'
import { stripe } from '@/lib/stripe'

const prisma = new PrismaClient()

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function DELETE(
  _req: Request,
  ctx: { params: Promise<{ id: string }> }
) {
  const { id } = await ctx.params
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const appt = await prisma.appointment.findUnique({ where: { id } })
  if (!appt) return NextResponse.json({ error: 'Appointment not found' }, { status: 404 })

  // Si un PaymentIntent est autorisé mais pas capturé, on l’annule proprement
  if (appt.stripePaymentIntentId && appt.paymentStatus === 'requires_capture') {
    try { await stripe.paymentIntents.cancel(appt.stripePaymentIntentId) } catch { /* ignore */ }
  }

  await prisma.appointment.delete({ where: { id } })
  return NextResponse.json({ ok: true })
}

// (facultatif) utile en dev pour éviter un 405 sur preflight
export async function OPTIONS() {
  return NextResponse.json({}, { status: 200 })
}
