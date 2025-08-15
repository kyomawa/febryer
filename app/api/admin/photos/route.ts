
import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { promises as fs } from "fs";
import path from "path";
import { IncomingForm } from 'formidable';
import { NextApiRequest } from "next";

const prisma = new PrismaClient();

export const config = {
  api: {
    bodyParser: false,
  },
};

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const photos = await prisma.photo.findMany();
  return NextResponse.json(photos);
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const data = await req.formData();
  const file = data.get('file') as File;
  const altText = data.get('altText') as string;

  if (!file) {
    return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
  }

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  const uploadDir = path.join(process.cwd(), "/public/uploads");
  await fs.mkdir(uploadDir, { recursive: true });

  const filePath = path.join(uploadDir, file.name);
  await fs.writeFile(filePath, buffer);

  const newPhoto = await prisma.photo.create({
    data: {
      url: `/uploads/${file.name}`,
      alt: altText,
      context: 'gallery', // Par défaut
    },
  });

  return NextResponse.json(newPhoto, { status: 201 });
}
