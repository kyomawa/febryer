import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding MongoDB...')

  // Services
  console.log('Creating services...')
  const services = [
    // Extérieur
    { id: 'lavage-ext', name: 'Lavage extérieur', price: 1500, group: 'extérieur' },
    { id: 'cire', name: 'Cire de protection', price: 800, group: 'extérieur' },
    { id: 'jantes', name: 'Nettoyage jantes', price: 500, group: 'extérieur' },
    
    // Intérieur
    { id: 'aspirateur', name: 'Aspiration complète', price: 1000, group: 'intérieur' },
    { id: 'nettoyage-sieges', name: 'Nettoyage sièges', price: 1200, group: 'intérieur' },
    { id: 'tableau-bord', name: 'Nettoyage tableau de bord', price: 600, group: 'intérieur' },
    
    // Options
    { id: 'shampoing-moquette', name: 'Shampoing moquettes', price: 2000, group: 'options' },
    { id: 'polish', name: 'Polish carrosserie', price: 3000, group: 'options' },
  ]

  for (const service of services) {
    await prisma.service.upsert({
      where: { id: service.id },
      update: {
        name: service.name,
        price: service.price,
        group: service.group,
      },
      create: service,
    })
  }

  // Sizes
  console.log('Creating sizes...')
  const sizes = [
    { id: 'city', label: 'Citadine', mult: 1.0 },
    { id: 'berline', label: 'Berline', mult: 1.1 },
    { id: 'suv', label: 'SUV', mult: 1.2 },
    { id: 'van', label: 'Van/Utilitaire', mult: 1.3 },
  ]

  for (const size of sizes) {
    await prisma.size.upsert({
      where: { id: size.id },
      update: {
        label: size.label,
        mult: size.mult,
      },
      create: size,
    })
  }

  // Packs
  console.log('Creating packs...')
  const packEssentiel = await prisma.pack.upsert({
    where: { slug: 'essentiel' },
    update: {},
    create: {
      slug: 'essentiel',
      name: 'Pack Essentiel',
      desc: 'Nettoyage de base pour votre véhicule',
      order: 1,
    },
  })

  const packConfort = await prisma.pack.upsert({
    where: { slug: 'confort' },
    update: {},
    create: {
      slug: 'confort',
      name: 'Pack Confort',
      desc: 'Nettoyage complet intérieur et extérieur',
      order: 2,
    },
  })

  const packPro = await prisma.pack.upsert({
    where: { slug: 'pro' },
    update: {},
    create: {
      slug: 'pro',
      name: 'Pack Pro',
      desc: 'Service premium avec finitions haut de gamme',
      order: 3,
    },
  })

  // Pack Items
  console.log('Creating pack items...')
  // Pack Essentiel
  const essItems = ['lavage-ext', 'aspirateur', 'jantes']
  for (const [index, serviceId] of essItems.entries()) {
    await prisma.packItem.upsert({
      where: { packId_serviceId: { packId: packEssentiel.id, serviceId } },
      update: { order: index },
      create: { packId: packEssentiel.id, serviceId, order: index },
    })
  }

  // Pack Confort  
  const confortItems = ['lavage-ext', 'aspirateur', 'jantes', 'nettoyage-sieges', 'tableau-bord', 'cire']
  for (const [index, serviceId] of confortItems.entries()) {
    await prisma.packItem.upsert({
      where: { packId_serviceId: { packId: packConfort.id, serviceId } },
      update: { order: index },
      create: { packId: packConfort.id, serviceId, order: index },
    })
  }

  // Pack Pro
  const proItems = ['lavage-ext', 'aspirateur', 'jantes', 'nettoyage-sieges', 'tableau-bord', 'cire', 'shampoing-moquette', 'polish']
  for (const [index, serviceId] of proItems.entries()) {
    await prisma.packItem.upsert({
      where: { packId_serviceId: { packId: packPro.id, serviceId } },
      update: { order: index },
      create: { packId: packPro.id, serviceId, order: index },
    })
  }

  // ReviewsCache par défaut
  console.log('Creating reviews cache...')
  await prisma.reviewsCache.upsert({
    where: { id: 'google' },
    update: {},
    create: {
      id: 'google',
      payload: {
        rating: 4.8,
        total: 127,
        mapsUrl: 'https://maps.google.com',
        reviews: []
      },
    },
  })

  // Photos par défaut
  console.log('Creating photos...')
  // Photo héro
  await prisma.photo.create({
    data: {
      url: '/uploads/hero-1754923758328.jpeg',
      context: 'hero',
      alt: 'Image héro par défaut',
      featured: true,
    },
  })

  // Photos galerie
  const galleryPhotos = [
    { filename: 'gallery-1754923773929.webp', alt: 'Photo de galerie 1' },
    { filename: 'gallery-1754923777917.jpg', alt: 'Photo de galerie 2' },
    { filename: 'gallery-1754923786539.webp', alt: 'Photo de galerie 3' },
    { filename: 'gallery-1754923791334.jpeg', alt: 'Photo de galerie 4' },
  ]

  for (const photo of galleryPhotos) {
    await prisma.photo.create({
      data: {
        url: `/uploads/${photo.filename}`,
        context: 'gallery',
        alt: photo.alt,
        featured: false,
      },
    })
  }

  console.log('✅ Seeding completed!')
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
