
import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

const prisma = new PrismaClient();

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const tariffs = await prisma.tariff.findMany();
  return NextResponse.json(tariffs);
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const data = await request.json();
  const { name, price, features, packSlug } = data;

  const newTariff = await prisma.tariff.create({
    data: {
      name,
      price: typeof price === 'number' ? price : Math.round(parseFloat(price) * 100),
      features: typeof features === 'string' ? features : JSON.stringify(features),
      packSlug: packSlug || null,
    },
  });

  return NextResponse.json(newTariff, { status: 201 });
}
