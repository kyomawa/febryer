// app/api/admin/appointments/[id]/reject_onsite/route.ts
import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()
export const runtime = 'nodejs'; export const dynamic = 'force-dynamic';

export async function POST(_req: Request, ctx: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await ctx.params
    const session = await getServerSession(authOptions)
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const appt = await prisma.appointment.findUnique({ where: { id } })
    if (!appt) {
      return NextResponse.json({ error: 'Rendez-vous introuvable' }, { status: 404 })
    }

    if (appt.paymentStatus !== 'pending_onsite') {
      return NextResponse.json({ error: 'Ce rendez-vous n\'est pas en attente de paiement sur place' }, { status: 400 })
    }

    // Refuser le paiement sur place - marquer comme annulé
    await prisma.appointment.update({
      where: { id },
      data: { 
        paymentStatus: 'rejected_onsite'
      },
    })

    return NextResponse.json({ 
      success: true,
      message: 'Paiement sur place refusé. Le client sera notifié.'
    })
  } catch (e: any) {
    console.error('Error rejecting onsite payment:', e)
    return NextResponse.json({ error: e.message || 'Erreur lors du refus' }, { status: 500 })
  }
}
