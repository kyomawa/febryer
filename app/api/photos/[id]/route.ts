import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import fs from 'fs/promises';
import path from 'path';

const prisma = new PrismaClient();

export async function DELETE(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;

  try {
    const photo = await prisma.photo.findUnique({
      where: { id },
    });

    if (!photo) {
      return NextResponse.json({ message: 'Photo not found' }, { status: 404 });
    }

    // Delete the file from the filesystem
    const filePath = path.join(process.cwd(), 'public', photo.url);
    try {
      await fs.unlink(filePath);
    } catch (fileError: any) {
      // If the file doesn't exist, we can still proceed to delete the DB record
      if (fileError.code !== 'ENOENT') {
        console.error('Error deleting file:', fileError);
        // Decide if you want to stop or continue if file deletion fails
      }
    }

    // Delete the photo record from the database
    await prisma.photo.delete({
      where: { id },
    });

    return NextResponse.json({ message: 'Photo deleted successfully' }, { status: 200 });

  } catch (error) {
    console.error('Error deleting photo:', error);
    return NextResponse.json({ message: 'An error occurred during photo deletion.' }, { status: 500 });
  }
}
