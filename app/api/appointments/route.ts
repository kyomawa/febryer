import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { quote, customer, paymentMethod } = body

    if (!quote || !customer) {
      return NextResponse.json({ error: 'Données manquantes' }, { status: 400 })
    }

    // Créer le rendez-vous/demande
    const appointment = await prisma.appointment.create({
      data: {
        name: customer.fullName,
        email: customer.email,
        phone: customer.phone || '',
        addressLine: customer.addressLine || '',
        postcode: customer.postcode || '',
        city: customer.city || '',
        when: customer.when || '',
        note: customer.note || '',
        pack: quote.pack,
        size: quote.size,
        items: quote.items ? quote.items : undefined,
        amountTotal: Math.round(quote.total * 100), // en centimes
        currency: 'eur',
        paymentStatus: paymentMethod === 'onsite' ? 'pending_onsite' : null,
        date: new Date(), // Date par défaut, sera mise à jour lors de la planification
      }
    })

    return NextResponse.json({ 
      success: true, 
      appointmentId: appointment.id,
      message: paymentMethod === 'onsite' 
        ? 'Demande enregistrée. Nous vous recontacterons pour planifier le créneau et le paiement.'
        : 'Rendez-vous créé avec succès.'
    })

  } catch (error) {
    console.error('Error creating appointment:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
