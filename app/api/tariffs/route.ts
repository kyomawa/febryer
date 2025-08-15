import { NextResponse, NextRequest } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
  try {
    const tariffs = await prisma.tariff.findMany({
      orderBy: { createdAt: 'desc' }
    });
    
    return NextResponse.json(tariffs);
  } catch (error) {
    console.error('Error fetching tariffs:', error);
    return NextResponse.json({ message: 'An error occurred while fetching tariffs.' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { packs } = body;

    if (!Array.isArray(packs)) {
      return NextResponse.json({ message: 'Invalid data format: packs must be an array' }, { status: 400 });
    }

    // Valider et transformer les données
    const validPacks = packs.map((pack: any) => {
      const price = typeof pack.price === 'string' ? 
        parseFloat(pack.price.replace(/[^\d.-]/g, '')) : // Enlever tout sauf les chiffres et le point
        typeof pack.price === 'number' ? pack.price : 0;

      if (isNaN(price)) {
        throw new Error(`Invalid price for pack "${pack.name}"`);
      }

      return {
        name: pack.name || 'Sans nom',
        price: Math.round(price * 100), // Convertir en centimes
        features: Array.isArray(pack.features) ? JSON.stringify(pack.features) : '[]',
        packSlug: pack.packSlug || null
      };
    });

    // Supprimer tous les tarifs existants
    await prisma.tariff.deleteMany();

    // Créer les nouveaux tarifs
    const tariffs = await prisma.tariff.createMany({
      data: validPacks
    });

    return NextResponse.json(tariffs);
  } catch (error) {
    console.error('Error updating tariffs:', error);
    return NextResponse.json({ message: 'An error occurred while updating tariffs.' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, price, features, packSlug } = body;

    if (!name || price === undefined || !features) {
      return NextResponse.json({ message: 'Name, price, and features are required' }, { status: 400 });
    }

    const tariff = await prisma.tariff.create({
      data: {
        name,
        price: typeof price === 'number' ? price : Math.round(parseFloat(price) * 100),
        features: typeof features === 'string' ? features : JSON.stringify(features),
        packSlug: packSlug || null,
      },
    });

    return NextResponse.json(tariff, { status: 201 });
  } catch (error) {
    console.error('Error creating tariff:', error);
    return NextResponse.json({ message: 'An error occurred while creating the tariff.' }, { status: 500 });
  }
}
