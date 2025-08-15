'use client';

import { Photo } from '@prisma/client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface PhotoListProps {
  initialPhotos: Photo[];
}

export function PhotoList({ initialPhotos }: PhotoListProps) {
  const [photos, setPhotos] = useState<Photo[]>(initialPhotos);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/photos/${id}`, {
        method: 'DELETE',
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || 'Failed to delete photo');
      }

      // Filter out the deleted photo from the state
      setPhotos(photos.filter((p) => p.id !== id));
      // Or you can refresh the whole page
      // router.refresh();

    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div>
      {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {photos.map((photo) => (
          <div key={photo.id} className="relative group">
            <img src={photo.url} alt={photo.alt || ''} className="w-full h-32 object-cover rounded-lg" />
            <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white text-xs p-1 truncate">{photo.context}</div>
            <button 
              onClick={() => handleDelete(photo.id)}
              className="absolute top-2 right-2 bg-red-600 text-white rounded-full p-1.5 text-xs opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
