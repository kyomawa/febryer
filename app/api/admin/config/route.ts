import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    // Récupérer les services, tailles et packs pour la configuration dynamique
    const [services, sizes, packs] = await Promise.all([
      prisma.service.findMany({ orderBy: { id: 'asc' } }),
      prisma.size.findMany({ orderBy: { id: 'asc' } }),
      prisma.pack.findMany({ 
        include: { items: { include: { service: true } } },
        orderBy: { order: 'asc' }
      })
    ]);

    return NextResponse.json({
      services,
      sizes,
      packs
    });
  } catch (error) {
    console.error('Error fetching config:', error);
    return NextResponse.json({ message: 'Error fetching configuration' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { services, sizes, packs } = body;

    // Transaction pour mettre à jour toute la configuration
    await prisma.$transaction(async (tx) => {
      // Mettre à jour les services si fournis
      if (services && Array.isArray(services)) {
        await tx.service.deleteMany();
        await tx.service.createMany({
          data: services.map((service: any) => ({
            id: service.id,
            name: service.name,
            price: typeof service.price === 'number' ? service.price : Math.round(parseFloat(service.price) * 100),
            group: service.group || 'default'
          }))
        });
      }

      // Mettre à jour les tailles si fournies
      if (sizes && Array.isArray(sizes)) {
        await tx.size.deleteMany();
        await tx.size.createMany({
          data: sizes.map((size: any) => ({
            id: size.id,
            label: size.label,
            mult: typeof size.mult === 'number' ? size.mult : parseFloat(size.mult)
          }))
        });
      }

      // Mettre à jour les packs si fournis
      if (packs && Array.isArray(packs)) {
        // Supprimer les relations existantes
        await tx.packItem.deleteMany();
        await tx.pack.deleteMany();

        // Créer les nouveaux packs
        for (const pack of packs) {
          const createdPack = await tx.pack.create({
            data: {
              id: pack.id,
              slug: pack.slug,
              name: pack.name,
              desc: pack.desc || null,
              active: pack.active ?? true,
              order: pack.order ?? 0
            }
          });

          // Créer les relations pack-service
          if (pack.services && Array.isArray(pack.services)) {
            await tx.packItem.createMany({
              data: pack.services.map((serviceId: string, index: number) => ({
                packId: createdPack.id,
                serviceId: serviceId,
                order: index
              }))
            });
          }
        }
      }
    });

    return NextResponse.json({ message: 'Configuration updated successfully' });
  } catch (error) {
    console.error('Error updating config:', error);
    return NextResponse.json({ message: 'Error updating configuration' }, { status: 500 });
  }
}
