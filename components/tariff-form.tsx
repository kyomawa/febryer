'use client';

import { Tariff } from '@prisma/client';
import { useState, useEffect } from 'react';
import { Button } from './ui/button';

interface TariffFormProps {
  tariff?: Tariff | null;
  onSave: (tariff: Omit<Tariff, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onClose: () => void;
}

export function TariffForm({ tariff, onSave, onClose }: TariffFormProps) {
  const [name, setName] = useState('');
  const [price, setPrice] = useState(0);
  const [features, setFeatures] = useState<string[]>([]);
  const [featureInput, setFeatureInput] = useState('');
  const [packSlug, setPackSlug] = useState('');

  useEffect(() => {
    if (tariff) {
      setName(tariff.name);
      setPrice(tariff.price);
      setFeatures(JSON.parse(tariff.features));
      setPackSlug(tariff.packSlug || '');
    } else {
      // Réinitialiser le formulaire pour un nouveau tarif
      setName('');
      setPrice(0);
      setFeatures([]);
      setPackSlug('');
    }
  }, [tariff]);

  const handleAddFeature = () => {
    if (featureInput.trim()) {
      setFeatures([...features, featureInput.trim()]);
      setFeatureInput('');
    }
  };

  const handleRemoveFeature = (index: number) => {
    setFeatures(features.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      name,
      price,
      features: JSON.stringify(features),
      packSlug,
    });
  };

  return (
    <div className="fixed inset-0 bg-black/40 dark:bg-black/60 flex justify-center items-center">
      <div className="bg-white dark:bg-neutral-800 p-8 rounded-lg shadow-lg w-full max-w-md border dark:border-neutral-700">
        <h2 className="text-xl font-bold mb-4 text-neutral-900 dark:text-neutral-100">{tariff ? 'Edit Tariff' : 'Add Tariff'}</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">Name</label>
            <input 
              type="text" 
              value={name} 
              onChange={(e) => setName(e.target.value)} 
              required 
              className="w-full border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-700 text-neutral-900 dark:text-neutral-100 placeholder-neutral-500 dark:placeholder-neutral-400 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500 dark:focus:ring-red-400" 
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">Price (€)</label>
            <input 
              type="number" 
              value={price} 
              onChange={(e) => setPrice(parseFloat(e.target.value))} 
              required 
              className="w-full border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-700 text-neutral-900 dark:text-neutral-100 placeholder-neutral-500 dark:placeholder-neutral-400 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500 dark:focus:ring-red-400" 
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">Pack Slug</label>
            <input 
              type="text" 
              value={packSlug} 
              onChange={(e) => setPackSlug(e.target.value)} 
              className="w-full border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-700 text-neutral-900 dark:text-neutral-100 placeholder-neutral-500 dark:placeholder-neutral-400 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500 dark:focus:ring-red-400" 
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">Features</label>
            <div className="flex gap-2">
              <input 
                type="text" 
                value={featureInput} 
                onChange={(e) => setFeatureInput(e.target.value)} 
                className="w-full border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-700 text-neutral-900 dark:text-neutral-100 placeholder-neutral-500 dark:placeholder-neutral-400 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500 dark:focus:ring-red-400" 
              />
              <Button type="button" onClick={handleAddFeature}>Add</Button>
            </div>
            <ul className="mt-2 space-y-1">
              {features.map((f, i) => (
                <li key={i} className="flex justify-between items-center bg-neutral-100 dark:bg-neutral-700 px-2 py-1 rounded">
                  <span className="text-neutral-900 dark:text-neutral-100">{f}</span>
                  <button type="button" onClick={() => handleRemoveFeature(i)} className="text-red-500 hover:text-red-600">X</button>
                </li>
              ))}
            </ul>
          </div>
          <div className="flex justify-end gap-4">
            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
            <Button type="submit">Save</Button>
          </div>
        </form>
      </div>
    </div>
  );
}
