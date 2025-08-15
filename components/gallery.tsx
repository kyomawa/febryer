import { Photo } from '@prisma/client';

interface GalleryProps {
  photos: Photo[];
}

export function Gallery({ photos }: GalleryProps) {
    return (
        <div>
          <div className="flex items-end justify-between gap-4">
            <div className="max-w-2xl">
              <h2 className="text-3xl font-bold tracking-tight text-neutral-900 dark:text-white">Nos réalisations</h2>
              <p className="mt-3 text-neutral-600 dark:text-neutral-300">Quelques transformations récentes réalisées par l'équipe Fé Bryer.</p>
            </div>
            <a href="#contact" className="hidden md:inline-flex items-center rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 px-4 py-2 text-sm font-medium text-neutral-900 dark:text-neutral-100 hover:border-neutral-300 dark:hover:border-neutral-600 hover:bg-neutral-50 dark:hover:bg-neutral-700 transition">Réserver ou devis</a>
          </div>
          <div className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-4">
            {photos.map((photo) => (
              <img key={photo.id} src={photo.url} alt={photo.alt || `Détail véhicule ${photo.id}`} className="h-44 w-full object-cover rounded-2xl ring-1 ring-neutral-100 dark:ring-neutral-800"/>
            ))}
          </div>
        </div>
    )
}