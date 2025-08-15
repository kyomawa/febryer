
import { Prisma  const { name, price, features, packSlug } = body;

  const updatedTariff = await prisma.tariff.update({
    where: { id },
    data: {
      name,
      price: typeof price === 'number' ? price : Math.round(parseFloat(price) * 100),
      features: typeof features === 'string' ? features : JSON.stringify(features),
      packSlug: packSlug || null,
    },
  });om "@prisma/client";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

const prisma = new PrismaClient();

export async function PUT(request: Request, context: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await context.params;
  const data = await request.json();
  const { name, price, features, description } = data;

  const updatedTariff = await prisma.tariff.update({
    where: { id },
    data: {
      name,
      price: parseFloat(price),
      features,
      description,
    },
  });

  return NextResponse.json(updatedTariff);
}

export async function DELETE(request: Request, context: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await context.params;

  await prisma.tariff.delete({
    where: { id },
  });

  return NextResponse.json({ message: "Tariff deleted" }, { status: 200 });
}
