// app/api/admin/appointments/[id]/refresh/route.ts
import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { PrismaClient } from '@prisma/client'
import { stripe } from '@/lib/stripe'

const prisma = new PrismaClient()
export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function POST(_req: Request, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const appt = await prisma.appointment.findUnique({ where: { id } })
  if (!appt) return NextResponse.json({ error: 'Appointment not found' }, { status: 404 })

  // 1) Session Checkout → infos + custom_fields
  if (appt.stripeSessionId) {
    const s:any = await stripe.checkout.sessions.retrieve(appt.stripeSessionId)
    const bill = s.customer_details?.address
    const ship = s.shipping_details?.address
    const addr = ship || bill

    const getCF = (key: string) =>
      (s.custom_fields as any[])?.find((f: any) => f.key === key)?.text?.value || null

    const when = getCF('when')
    const note = getCF('note')
    const extraAddr = getCF('intervention_address')

    await prisma.appointment.update({
      where: { id: appt.id },
      data: {
        name: s.customer_details?.name || appt.name,
        email: s.customer_details?.email || appt.email,
        phone: s.customer_details?.phone || appt.phone,
        addressLine: extraAddr || [addr?.line1, addr?.line2].filter(Boolean).join(' ') || appt.addressLine,
        postcode: addr?.postal_code || appt.postcode,
        city: addr?.city || appt.city,
        when: when ?? appt.when,
        note: note ?? appt.note,
        stripePaymentIntentId: typeof s.payment_intent === 'string'
          ? s.payment_intent
          : appt.stripePaymentIntentId,
      },
    })
  }

  // 2) PaymentIntent → statut + fallback metadata.when
  const fresh = await prisma.appointment.findUnique({ where: { id } })
  if (fresh?.stripePaymentIntentId) {
    const pi = await stripe.paymentIntents.retrieve(fresh.stripePaymentIntentId)
    const status =
      pi.status === 'requires_capture' ? 'requires_capture'
      : pi.status === 'succeeded'     ? 'succeeded'
      : pi.status === 'canceled'      ? 'canceled'
      : pi.status

    await prisma.appointment.update({
      where: { id: fresh.id },
      data: {
        paymentStatus: status,
        amountTotal: pi.amount ?? undefined,
        currency: (pi.currency ?? 'eur') as any,
        authorizedAt: pi.status === 'requires_capture' ? new Date() : undefined,
        capturedAt:  pi.status === 'succeeded' ? new Date() : undefined,
        canceledAt:  pi.status === 'canceled'  ? new Date() : undefined,
        when: fresh.when ?? (pi.metadata?.when || null),
        note: fresh.note ?? (pi.metadata?.note || null),
      },
    })
  }

  return NextResponse.json({ ok: true })
}
