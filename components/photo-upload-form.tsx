'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from './ui/button';

export function PhotoUploadForm() {
  const [file, setFile] = useState<File | null>(null);
  const [altText, setAltText] = useState('');
  const [context, setContext] = useState('gallery');
  const [error, setError] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const router = useRouter();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      setError('Please select a file to upload.');
      return;
    }

    setIsUploading(true);
    setError('');

    const formData = new FormData();
    formData.append('file', file);
    formData.append('altText', altText);
    formData.append('context', context);

    try {
      const res = await fetch('/api/photos/upload', {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || 'Upload failed');
      }

      // Refresh the page to show the new photo
      router.refresh();
      // Reset form
      setFile(null);
      setAltText('');

    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4 border rounded-lg">
      <div>
        <label htmlFor="file" className="block text-sm font-medium mb-1">Photo</label>
        <input id="file" type="file" onChange={handleFileChange} required className="w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file-font-semibold file:bg-red-50 file:text-red-700 hover:file:bg-red-100"/>
      </div>
      <div>
        <label htmlFor="altText" className="block text-sm font-medium mb-1">Alt Text (optional)</label>
        <input id="altText" type="text" value={altText} onChange={(e) => setAltText(e.target.value)} placeholder="e.g., A shiny red car" className="w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500"/>
      </div>
      <div>
        <label htmlFor="context" className="block text-sm font-medium mb-1">Context</label>
        <select id="context" value={context} onChange={(e) => setContext(e.target.value)} className="w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500">
          <option value="gallery">Gallery</option>
          <option value="hero">Hero</option>
        </select>
      </div>
      {error && <p className="text-red-500 text-sm">{error}</p>}
      <Button type="submit" disabled={isUploading || !file}>
        {isUploading ? 'Uploading...' : 'Upload Photo'}
      </Button>
    </form>
  );
}
