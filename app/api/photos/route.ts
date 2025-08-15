import { NextResponse, NextRequest } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { promises as fs } from "fs";
import path from "path";

const prisma = new PrismaClient();

// Définition des emplacements possibles pour les photos
const PLACEMENTS = [
  { key:'hero', label:'Image Héro (accueil)', multiple:false },
  { key:'gallery', label:'Galerie (accueil)', multiple:true },
  { key:'badge', label:'Vignette "FB" du héro', multiple:false },
  { key:'testimonials', label:'Avatars témoignages', multiple:true },
  { key:'social_cover', label:'Bannière réseaux', multiple:false },
  { key:'footer_logo', label:'Logo pied de page', multiple:false }
];

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const context = searchParams.get('context');

  try {
    const photos = await prisma.photo.findMany({
      where: context ? { context } : undefined,
      orderBy: {
        createdAt: 'desc',
      },
    });
    
    return NextResponse.json(photos || []);
  } catch (error) {
    console.error('Error fetching photos:', error);
    return NextResponse.json({ error: "Failed to fetch photos" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const data = await req.formData();
    const file = data.get('file') as File;
    const context = data.get('context') as string;
    const altText = data.get('altText') as string;
    const featured = data.get('featured') === 'true';

    if (!file || !context) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Pour les emplacements uniques, supprimer l'ancienne photo
    const placement = PLACEMENTS.find(p => p.key === context);
    if (placement && !placement.multiple) {
      const existingPhoto = await prisma.photo.findFirst({
        where: { context }
      });
      
      if (existingPhoto) {
        try {
          const oldFilePath = path.join(process.cwd(), "/public", existingPhoto.url);
          await fs.unlink(oldFilePath);
        } catch (error) {
          console.error("Failed to delete old file:", error);
        }
        
        await prisma.photo.delete({
          where: { id: existingPhoto.id }
        });
      }
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Créer le dossier uploads s'il n'existe pas
    const uploadDir = path.join(process.cwd(), "/public/uploads");
    await fs.mkdir(uploadDir, { recursive: true });

    // Générer un nom de fichier unique
    const timestamp = Date.now();
    const fileExt = path.extname(file.name);
    const fileName = `${context}-${timestamp}${fileExt}`;
    const filePath = path.join(uploadDir, fileName);
    
    // Sauvegarder le fichier
    await fs.writeFile(filePath, buffer);

    // Créer l'entrée dans la base de données
    const photo = await prisma.photo.create({
      data: {
        url: `/uploads/${fileName}`,
        alt: altText,
        context,
        featured
      }
    });

    return NextResponse.json(photo);
  } catch (error) {
    console.error('Error uploading photo:', error);
    return NextResponse.json({ error: "Failed to upload photo" }, { status: 500 });
  }
}
