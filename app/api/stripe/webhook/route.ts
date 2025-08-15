// app/api/stripe/webhook/route.ts
import { NextResponse } from 'next/server'
import { headers } from 'next/headers'
import { PrismaClient } from '@prisma/client'
import { stripe } from '@/lib/stripe'

const prisma = new PrismaClient()

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'
export const maxDuration = 60

function getTextCF(sess: any, key: string): string | null {
  const f = (sess?.custom_fields || []).find((x: any) => x?.key === key)
  return f?.text?.value ?? null
}

export async function POST(req: Request) {
  const sig = (await headers()).get('stripe-signature')
  if (!sig) return NextResponse.json({ error: 'Missing stripe-signature' }, { status: 400 })

  const buf = Buffer.from(await req.arrayBuffer())
  let event
  try {
    event = stripe.webhooks.constructEvent(buf, sig, process.env.STRIPE_WEBHOOK_SECRET as string)
  } catch (err: any) {
    return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 })
  }

  try {
    switch (event.type as string) {
      // Checkout terminé → on enregistre infos + on pousse when/note dans PI.metadata
      case 'checkout.session.completed': {
        const s: any = event.data.object
        const appointmentId = s?.metadata?.appointmentId as string | undefined
        if (appointmentId) {
          const bill = s.customer_details?.address
          const ship = s.shipping_details?.address
          const addr = ship || bill

          const when = getTextCF(s, 'when')
          const note = getTextCF(s, 'note')
          const extraAddr = getTextCF(s, 'intervention_address')

          // MàJ Appointment
          await prisma.appointment.update({
            where: { id: appointmentId },
            data: {
              name: s.customer_details?.name || 'Client Stripe',
              email: s.customer_details?.email || '',
              phone: s.customer_details?.phone || null,
              addressLine: extraAddr || [addr?.line1, addr?.line2].filter(Boolean).join(' ') || null,
              postcode: addr?.postal_code || null,
              city: addr?.city || null,
              when,
              note,
              stripePaymentIntentId: typeof s.payment_intent === 'string' ? s.payment_intent : null,
              paymentStatus: 'checkout_completed',
            },
          })

          // Pousser when/note dans le PaymentIntent.metadata (utile pour les events suivants)
          if (typeof s.payment_intent === 'string' && (when || note)) {
            await stripe.paymentIntents.update(s.payment_intent, {
              metadata: {
                ...(when ? { when } : {}),
                ...(note ? { note } : {}),
                appointmentId,
              },
            })
          }
        }
        break
      }

      // Autorisé (capture manuelle dispo)
      case 'payment_intent.amount_capturable_updated': {
        const pi: any = event.data.object

        // tenter par PI id, sinon par metadata.appointmentId
        let appt = await prisma.appointment.findFirst({ where: { stripePaymentIntentId: pi.id } })
        if (!appt) {
          const appointmentId = pi?.metadata?.appointmentId as string | undefined
          if (appointmentId) {
            appt = await prisma.appointment.findUnique({ where: { id: appointmentId } })
            if (appt && !appt.stripePaymentIntentId) {
              await prisma.appointment.update({
                where: { id: appt.id },
                data: { stripePaymentIntentId: pi.id },
              })
            }
          }
        }

        if (appt) {
          await prisma.appointment.update({
            where: { id: appt.id },
            data: {
              paymentStatus: 'requires_capture',
              authorizedAt: new Date(),
              amountTotal: typeof pi.amount === 'number' ? pi.amount : appt.amountTotal,
              currency: (pi.currency ?? 'eur') as any,
              // Récupération des données depuis la session si disponible
              when: (appt.when ?? pi.metadata?.when) || appt.when,
              note: (appt.note ?? pi.metadata?.note) || appt.note,
            },
          })
        }
        break
      }

      case 'payment_intent.succeeded': {
        const pi: any = event.data.object
        const appt = await prisma.appointment.findFirst({ where: { stripePaymentIntentId: pi.id } })
        if (appt) {
          await prisma.appointment.update({
            where: { id: appt.id },
            data: { paymentStatus: 'succeeded', capturedAt: new Date() },
          })
        }
        break
      }

      case 'payment_intent.canceled': {
        const pi: any = event.data.object
        const appt = await prisma.appointment.findFirst({ where: { stripePaymentIntentId: pi.id } })
        if (appt) {
          await prisma.appointment.update({
            where: { id: appt.id },
            data: { paymentStatus: 'canceled', canceledAt: new Date() },
          })
        }
        break
      }

      case 'payment_intent.capture_failed': {
        const pi: any = event.data.object
        const appt = await prisma.appointment.findFirst({ where: { stripePaymentIntentId: pi.id } })
        if (appt) {
          await prisma.appointment.update({
            where: { id: appt.id },
            data: { paymentStatus: 'capture_failed' },
          })
        }
        break
      }
    }

    return NextResponse.json({ received: true })
  } catch (e: any) {
    console.error('Webhook handler failed:', e)
    return NextResponse.json({ error: e.message ?? 'hook failed' }, { status: 500 })
  }
}
