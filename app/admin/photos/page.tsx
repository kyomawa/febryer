'use client'
import React from 'react'

type Photo = { id:string; url:string; altText?:string|null; context:string; featured?:boolean }
type Placement = { key:string; label:string; multiple:boolean; hint?:string; description?:string }

const PLACEMENTS: Placement[] = [
  { 
    key:'hero', 
    label:'Image Héro', 
    multiple:false, 
    hint:'Image principale de la page d\'accueil (16:9 recommandé, 1920×1080+)',
    description:'Cette image apparaît en grand dans la section héro de la page d\'accueil'
  },
  { 
    key:'gallery', 
    label:'Avant / Après', 
    multiple:true, 
    hint:'Galerie des réalisations (format libre, 800×600+ recommandé)',
    description:'Ces images sont affichées dans la galerie des réalisations'
  },
  { 
    key:'logo', 
    label:'Logo principal', 
    multiple:false, 
    hint:'Logo affiché dans le header (PNG transparent recommandé)',
    description:'Logo affiché dans la navigation en haut du site'
  },
  { 
    key:'badge', 
    label:'Badge héro', 
    multiple:false, 
    hint:'Petit badge décoratif du héro (carré 1:1, 200×200+)',
    description:'Petite image décorative affichée dans la section héro'
  },
  { 
    key:'testimonials', 
    label:'Avatars clients', 
    multiple:true, 
    hint:'Photos des témoignages (carré 1:1, 150×150+)',
    description:'Photos des clients pour accompagner leurs témoignages'
  },
  { 
    key:'footer_logo', 
    label:'Logo pied de page', 
    multiple:false, 
    hint:'Version du logo pour le footer (PNG transparent)',
    description:'Logo affiché dans le pied de page du site'
  },
]

export default function AdminMediaPage(){
  const [tab, setTab] = React.useState<string>(PLACEMENTS[0].key)
  const activeSection = PLACEMENTS.find(p => p.key === tab)
  
  return (
    <div className="space-y-6">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-100">Gestion des images</h1>
          <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-400">Gérez toutes les images du site organisées par section.</p>
        </div>
      </header>

      {/* Navigation par sections */}
      <div className="rounded-2xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 shadow-sm overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-0">
          {PLACEMENTS.map(p => {
            const active = tab === p.key
            return (
              <button 
                key={p.key} 
                onClick={() => setTab(p.key)}
                className={`p-4 text-left border-b md:border-b-0 md:border-r border-neutral-200 dark:border-neutral-700 last:border-r-0 hover:bg-neutral-50 dark:hover:bg-neutral-700 transition ${active ? 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800' : ''}`}
              >
                <div className={`text-sm font-medium ${active ? 'text-red-600 dark:text-red-400' : 'text-neutral-900 dark:text-neutral-100'}`}>
                  {p.label}
                </div>
                <div className="text-xs text-neutral-600 dark:text-neutral-400 mt-1">
                  {p.description}
                </div>
                <div className={`text-xs mt-2 px-2 py-1 rounded-full ${p.multiple ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400' : 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400'}`}>
                  {p.multiple ? 'Multiples images' : 'Image unique'}
                </div>
              </button>
            )
          })}
        </div>
      </div>

      {/* Section active */}
      {activeSection && (
        <div className="rounded-2xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 p-6 shadow-sm">
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-2">
              {activeSection.label}
            </h2>
            <p className="text-sm text-neutral-600 dark:text-neutral-400">
              {activeSection.description}
            </p>
            {activeSection.hint && (
              <p className="text-xs text-neutral-500 dark:text-neutral-500 mt-1">
                💡 {activeSection.hint}
              </p>
            )}
          </div>
          <PlacementPanel placement={activeSection} />
        </div>
      )}
    </div>
  )
}

function PlacementPanel({ placement }: { placement: Placement }) {
  const { key, multiple } = placement
  const [loading, setLoading] = React.useState(true)
  const [photos, setPhotos] = React.useState<Photo[]>([])
  const [file, setFile] = React.useState<File | null>(null)
  const [altText, setAltText] = React.useState('')
  const [dragOver, setDragOver] = React.useState(false)

  React.useEffect(() => { void fetchList() }, [key])

  async function fetchList() {
    try {
      setLoading(true)
      const res = await fetch(`/api/photos?context=${key}`, { cache: 'no-store' })
      const list = res.ok ? await res.json() as Photo[] : []
      setPhotos(list)
    } finally { 
      setLoading(false) 
    }
  }

  async function upload(e: React.FormEvent) {
    e.preventDefault()
    if (!file) return
    const fd = new FormData()
    fd.append('file', file)
    fd.append('context', key)
    if (altText) fd.append('altText', altText)
    const res = await fetch('/api/photos', { method: 'POST', body: fd })
    if (!res.ok) { alert('Échec upload'); return }
    setFile(null); setAltText(''); await fetchList()
  }

  // Gestion drag & drop
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
    const files = e.dataTransfer.files
    if (files.length > 0) setFile(files[0])
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
  }

  async function markFeatured(id: string, featured: boolean) {
    const res = await fetch(`/api/photos/${id}`, {
      method: 'PATCH', 
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ featured })
    })
    if (!res.ok) { alert('Échec'); return }
    await fetchList()
  }

  async function remove(id: string) {
    if (!confirm('Supprimer cette image ?')) return
    const res = await fetch(`/api/photos/${id}`, { method: 'DELETE' })
    if (!res.ok) { alert('Échec suppression'); return }
    await fetchList()
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Zone d'upload avec drag & drop */}
      <div className="space-y-4">
        <h3 className="font-medium text-neutral-900 dark:text-neutral-100">Ajouter une image</h3>
        
        <form onSubmit={upload}>
          <div
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            className={`border-2 border-dashed rounded-xl p-8 text-center transition relative ${
              dragOver
                ? 'border-red-400 bg-red-50 dark:bg-red-900/20'
                : 'border-neutral-300 dark:border-neutral-600 hover:border-neutral-400 dark:hover:border-neutral-500'
            }`}
          >
            {file ? (
              <div className="space-y-3">
                <div className="w-32 h-32 mx-auto rounded-lg overflow-hidden border border-neutral-200 dark:border-neutral-700">
                  <img
                    src={URL.createObjectURL(file)}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                </div>
                <p className="text-sm font-medium text-neutral-900 dark:text-neutral-100">{file.name}</p>
                <button
                  type="button"
                  onClick={() => setFile(null)}
                  className="text-sm text-red-600 dark:text-red-400 hover:underline"
                >
                  Changer de fichier
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="w-16 h-16 mx-auto rounded-full bg-neutral-100 dark:bg-neutral-700 flex items-center justify-center">
                  <svg className="w-8 h-8 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
                    Glissez-déposez votre image ici
                  </p>
                  <p className="text-xs text-neutral-500 dark:text-neutral-500">
                    ou cliquez pour parcourir
                  </p>
                </div>
              </div>
            )}
            
            <input
              type="file"
              accept="image/*"
              onChange={e => setFile(e.target.files?.[0] ?? null)}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
          </div>

          {file && (
            <div className="mt-4 space-y-3">
              <input
                type="text"
                placeholder="Description de l'image (optionnel)"
                value={altText}
                onChange={e => setAltText(e.target.value)}
                className="w-full rounded-lg border border-neutral-200 dark:border-neutral-600 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 px-3 py-2 text-sm"
              />
              <button
                type="submit"
                disabled={!file}
                className="w-full rounded-lg bg-red-500 px-4 py-2 text-sm font-medium text-white hover:bg-red-600 disabled:opacity-50"
              >
                Uploader l'image
              </button>
            </div>
          )}
        </form>
      </div>

      {/* Aperçu et gestion des images existantes */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-medium text-neutral-900 dark:text-neutral-100">Images actuelles</h3>
          {photos.length > 0 && (
            <span className="text-xs bg-neutral-100 dark:bg-neutral-700 text-neutral-600 dark:text-neutral-400 px-2 py-1 rounded-full">
              {photos.length} image{photos.length > 1 ? 's' : ''}
            </span>
          )}
        </div>

        {loading ? (
          <div className="text-center py-8 text-neutral-500 dark:text-neutral-500">
            <div className="animate-spin w-6 h-6 border-2 border-red-500 border-t-transparent rounded-full mx-auto mb-2"></div>
            Chargement...
          </div>
        ) : photos.length === 0 ? (
          <div className="text-center py-8 text-neutral-500 dark:text-neutral-500">
            <svg className="w-12 h-12 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <p>Aucune image pour cette section</p>
          </div>
        ) : (
          <div className="space-y-3">
            {photos.map(photo => (
              <div
                key={photo.id}
                className={`rounded-lg border p-3 ${
                  photo.featured && !multiple
                    ? 'border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20'
                    : 'border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800'
                }`}
              >
                <div className="flex gap-3">
                  <img
                    src={photo.url}
                    alt={photo.altText || ''}
                    className="w-16 h-16 rounded-md object-cover border border-neutral-200 dark:border-neutral-600"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-neutral-900 dark:text-neutral-100 truncate">
                      {photo.altText || 'Sans description'}
                    </p>
                    <p className="text-xs text-neutral-500 dark:text-neutral-500 mt-1">
                      {photo.featured && !multiple && '✨ Image principale'}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    {!multiple && (
                      <button
                        onClick={() => markFeatured(photo.id, !photo.featured)}
                        className={`px-2 py-1 text-xs rounded ${
                          photo.featured
                            ? 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400'
                            : 'bg-neutral-100 dark:bg-neutral-700 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-200 dark:hover:bg-neutral-600'
                        }`}
                      >
                        {photo.featured ? 'Principal' : 'Définir'}
                      </button>
                    )}
                    <button
                      onClick={() => remove(photo.id)}
                      className="px-2 py-1 text-xs rounded bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-900/50"
                    >
                      Supprimer
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
