'use client'
import React from 'react'

export function CardsEditor({tariffs,setTariffs}:{tariffs:any[];setTariffs:(t:any[])=>void}){
  const [editing,setEditing]=React.useState<any>(null)
  const [draft,setDraft]=React.useState({name:'',price:'',features:'',description:''})

  const saveTariff = async (tariff: any) => {
    try {
      const method = tariff.id ? 'PUT' : 'POST'
      const url = tariff.id ? `/api/admin/tariffs/${tariff.id}` : '/api/admin/tariffs'
      
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: tariff.name,
          price: parseFloat(tariff.price) * 100, // Convertir en centimes
          features: tariff.features,
          description: tariff.description
        })
      })
      
      if (!res.ok) throw new Error('Erreur serveur')
      
      const updated = await res.json()
      
      if (tariff.id) {
        // Mise à jour
        setTariffs(tariffs.map(t => t.id === tariff.id ? updated : t))
      } else {
        // Création
        setTariffs([...tariffs, updated])
      }
      
      setEditing(null)
      alert('Tarif sauvegardé !')
    } catch (e: any) {
      alert('Erreur : ' + e.message)
    }
  }

  const deleteTariff = async (id: string) => {
    if (!confirm('Supprimer ce tarif ?')) return
    
    try {
      const res = await fetch(`/api/admin/tariffs/${id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error('Erreur serveur')
      
      setTariffs(tariffs.filter(t => t.id !== id))
      alert('Tarif supprimé !')
    } catch (e: any) {
      alert('Erreur : ' + e.message)
    }
  }

  const startEdit = (tariff: any) => {
    setEditing({
      ...tariff,
      price: (tariff.price / 100).toString() // Convertir en euros pour l'affichage
    })
  }

  const startNew = () => {
    setEditing(draft)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">Cartes affichées sur le site</p>
          <p className="text-xs text-neutral-600 dark:text-neutral-400">Ces cartes sont visibles dans la section "Nos prestations" du site public.</p>
        </div>
        <button onClick={startNew}
          className="rounded-lg bg-red-500 px-3 py-2 text-sm font-medium text-white hover:bg-red-600">
          Nouveau tarif
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {tariffs.map((tariff) => (
          <div key={tariff.id} className="rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 p-4 shadow-sm">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-semibold text-neutral-900 dark:text-neutral-100">{tariff.name}</h3>
                <p className="text-2xl font-bold text-red-600 dark:text-red-400">{(tariff.price/100).toFixed(0)}€</p>
              </div>
              <div className="flex gap-2">
                <button onClick={() => startEdit(tariff)}
                  className="rounded-md bg-neutral-100 dark:bg-neutral-700 p-2 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-200 dark:hover:bg-neutral-600">
                  ✏️
                </button>
                <button onClick={() => deleteTariff(tariff.id)}
                  className="rounded-md bg-red-100 dark:bg-red-900/30 p-2 text-red-600 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-900/50">
                  🗑️
                </button>
              </div>
            </div>
            {tariff.description && (
              <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">{tariff.description}</p>
            )}
            <ul className="mt-3 space-y-1 text-xs text-neutral-500 dark:text-neutral-500">
              {JSON.parse(tariff.features || '[]').map((feature: string, i: number) => (
                <li key={i}>• {feature}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Modal d'édition */}
      {editing && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-neutral-800 rounded-xl p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-4">
              {editing.id ? 'Modifier le tarif' : 'Nouveau tarif'}
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">Nom</label>
                <input value={editing.name} onChange={e => setEditing({...editing, name: e.target.value})}
                  className="w-full rounded-lg border border-neutral-200 dark:border-neutral-600 bg-white dark:bg-neutral-700 text-neutral-900 dark:text-neutral-100 px-3 py-2 text-sm outline-none focus:border-neutral-300 dark:focus:border-neutral-500"/>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">Prix (€)</label>
                <input type="number" value={editing.price} onChange={e => setEditing({...editing, price: e.target.value})}
                  className="w-full rounded-lg border border-neutral-200 dark:border-neutral-600 bg-white dark:bg-neutral-700 text-neutral-900 dark:text-neutral-100 px-3 py-2 text-sm outline-none focus:border-neutral-300 dark:focus:border-neutral-500"/>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">Description</label>
                <input value={editing.description || ''} onChange={e => setEditing({...editing, description: e.target.value})}
                  className="w-full rounded-lg border border-neutral-200 dark:border-neutral-600 bg-white dark:bg-neutral-700 text-neutral-900 dark:text-neutral-100 px-3 py-2 text-sm outline-none focus:border-neutral-300 dark:focus:border-neutral-500"/>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">Fonctionnalités (JSON)</label>
                <textarea value={editing.features || ''} onChange={e => setEditing({...editing, features: e.target.value})} rows={3}
                  placeholder='["Fonctionnalité 1", "Fonctionnalité 2"]'
                  className="w-full rounded-lg border border-neutral-200 dark:border-neutral-600 bg-white dark:bg-neutral-700 text-neutral-900 dark:text-neutral-100 px-3 py-2 text-sm outline-none focus:border-neutral-300 dark:focus:border-neutral-500"/>
              </div>
            </div>
            
            <div className="flex gap-3 mt-6">
              <button onClick={() => setEditing(null)}
                className="flex-1 rounded-lg border border-neutral-200 dark:border-neutral-600 px-3 py-2 text-sm hover:bg-neutral-50 dark:hover:bg-neutral-700">
                Annuler
              </button>
              <button onClick={() => saveTariff(editing)}
                className="flex-1 rounded-lg bg-red-500 px-3 py-2 text-sm font-medium text-white hover:bg-red-600">
                Sauvegarder
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
