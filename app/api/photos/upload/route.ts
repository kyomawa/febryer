import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import formidable from 'formidable';
import fs from 'fs/promises';
import path from 'path';

const prisma = new PrismaClient();

// Disable the default body parser
export const config = {
  api: {
    bodyParser: false,
  },
};

export async function POST(req: NextRequest) {
  const formidableReq = req as any;
  const form = formidable({
    uploadDir: path.join(process.cwd(), 'public', 'uploads'),
    keepExtensions: true,
    filename: (name, ext, part, form) => {
        return `${Date.now()}_${part.originalFilename}`;
    }
  });

  try {
    const [fields, files] = await form.parse(formidableReq);
    
    const uploadedFile = files.file?.[0];

    if (!uploadedFile) {
      return NextResponse.json({ message: 'No file uploaded.' }, { status: 400 });
    }

    const photo = await prisma.photo.create({
      data: {
        url: `/uploads/${uploadedFile.newFilename}`,
        alt: fields.alt?.[0] || 'Uploaded photo',
        context: fields.context?.[0] || 'gallery',
      },
    });

    return NextResponse.json(photo, { status: 201 });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json({ message: 'An error occurred during file upload.' }, { status: 500 });
  }
}
