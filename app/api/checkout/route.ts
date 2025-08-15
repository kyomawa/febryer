// app/api/checkout/route.ts
import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { stripe } from '@/lib/stripe'

const prisma = new PrismaClient()

type Quote = {
  pack: 'essentiel'|'confort'|'pro'
  size: 'city'|'berline'|'suv'|'van'
  items: { id: string; name: string; price: number }[]
  subtotal: number
  multiplier: number
  total: number
}

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'
export const maxDuration = 60

export async function POST(req: Request) {
  try {
    const { quote }: { quote: Quote } = await req.json()
    if (!quote?.items?.length || !quote.total) {
      return NextResponse.json({ error: 'Devis incomplet' }, { status: 400 })
    }

    const appt = await prisma.appointment.create({
      data: {
        name: '—', email: '', date: new Date(),
        pack: quote.pack, size: quote.size, 
        items: JSON.stringify(quote.items), // Sérialiser les items du devis
        amountTotal: Math.round(quote.total * 100), currency: 'eur',
        paymentStatus: 'checkout_created',
        message: `Pack ${quote.pack.toUpperCase()} • ${quote.size} • ${quote.items.map(i=>i.name).join(', ')}`
      },
    })

    const successUrl = `${process.env.NEXT_PUBLIC_URL}/success?session_id={CHECKOUT_SESSION_ID}`
    const cancelUrl  = `${process.env.NEXT_PUBLIC_URL}/cancel`
    const name = `Fé Bryer – ${quote.pack.toUpperCase()} (${quote.size})`
    const description = quote.items.map(i => `• ${i.name} (${i.price}€)`).join('\n')

    // app/api/checkout/route.ts  (extrait)
const session = await stripe.checkout.sessions.create({
  mode: 'payment',
  payment_method_types: ['card'],
  payment_intent_data: {
    capture_method: 'manual',
    metadata: { appointmentId: appt.id },
  },

  // Laisser Checkout créer le client
  customer_creation: 'always',

  // Configuration de la session sans mise à jour automatique du client
  // customer_update: { name: 'auto', address: 'auto', shipping: 'auto' },

  phone_number_collection: { enabled: true },
  billing_address_collection: 'required',
  shipping_address_collection: { allowed_countries: ['FR'] },

  custom_fields: [
    { key: 'when', label: { type: 'custom', custom: 'Préférence de créneau' }, type: 'text', optional: false },
    { key: 'note', label: { type: 'custom', custom: 'Infos accès / parking' }, type: 'text', optional: true },
    { key: 'intervention_address', label: { type: 'custom', custom: "Adresse d’intervention (si différente)" }, type: 'text', optional: true },
  ],

  line_items: [
    {
      price_data: {
        currency: 'eur',
        product_data: { name, description },
        unit_amount: Math.round(quote.total * 100),
      },
      quantity: 1,
    },
  ],
  metadata: { appointmentId: appt.id },
  success_url: successUrl,
  cancel_url: cancelUrl,
})


    await prisma.appointment.update({
      where: { id: appt.id },
      data: { stripeSessionId: session.id },
    })

    return NextResponse.json({ id: session.id, url: session.url })
  } catch (e: any) {
    console.error('checkout error:', e)
    return NextResponse.json({ error: e.message ?? 'Erreur Stripe' }, { status: 500 })
  }
}
