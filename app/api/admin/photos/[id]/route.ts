
import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { promises as fs } from "fs";
import path from "path";

const prisma = new PrismaClient();

export async function DELETE(request: Request, context: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await context.params;

  const photo = await prisma.photo.findUnique({ where: { id } });

  if (!photo) {
    return NextResponse.json({ error: "Photo not found" }, { status: 404 });
  }

  const filePath = path.join(process.cwd(), "/public", photo.url);

  try {
    await fs.unlink(filePath);
  } catch (error) {
    console.error("Failed to delete file:", error);
    // You might want to decide if you still want to delete the DB record
  }

  await prisma.photo.delete({
    where: { id },
  });

  return NextResponse.json({ message: "Photo deleted" }, { status: 200 });
}
