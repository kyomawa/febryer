'use client'
import React from 'react'
import { CardsEditor } from '@/components/admin-cards-editor'

/* ——— Types de config builder ——— */
type Group = 'Extérieur'|'Intérieur'|'Options'
type Service = { id:string; name:string; price:number; group:Group }
type Pack    = { id:string; name:string; items:string[]; desc?:string }
type Size    = { id:'city'|'berline'|'suv'|'van'|string; label:string; mult:number }

type PricingConfig = { services:Service[]; packs:Pack[]; sizes:Size[] }

/* ——— Configuration par défaut ——— */
const DEFAULT_CONFIG: PricingConfig = {
  services: [
    { id:'ext_wash', name:'Lavage extérieur complet', price:29, group:'Extérieur' },
    { id:'wheels', name:'Jantes & pneus', price:8, group:'Extérieur' },
    { id:'glass_out', name:'Vitres extérieures', price:6, group:'Extérieur' },
    { id:'vacuum', name:'Aspiration complète', price:20, group:'Intérieur' },
    { id:'plastics', name:'Plastiques + dressing', price:14, group:'Intérieur' },
    { id:'glass_in', name:'Vitres intérieures', price:6, group:'Intérieur' },
    { id:'odor', name:'Désodorisation légère', price:5, group:'Intérieur' },
    { id:'decon', name:'Décontamination carrosserie', price:39, group:'Options' },
    { id:'polish', name:'Polish mono-étape', price:119, group:'Options' },
    { id:'wax', name:'Protection cire 3 mois', price:25, group:'Options' },
  ],
  packs: [
    { id:'essentiel', name:'Essentiel', desc:'Extérieur rapide', items:['ext_wash','wheels','glass_out'] },
    { id:'confort', name:'Confort', desc:'Intérieur + extérieur', items:['ext_wash','wheels','vacuum','plastics','glass_out','glass_in','odor'] },
    { id:'pro', name:'Pro+', desc:'Brillance & protection', items:['ext_wash','wheels','glass_out','decon','polish','wax'] },
  ],
  sizes: [
    { id:'city', label:'Citadine', mult:1 },
    { id:'berline', label:'Berline/Compacte', mult:1.1 },
    { id:'suv', label:'SUV/Monospace', mult:1.2 },
    { id:'van', label:'Utilitaire/VAN', mult:1.3 },
  ],
}

export default function AdminPricingPage(){
  const [tab,setTab]=React.useState<'cards'|'packs'|'services'|'sizes'|'export'>('cards')
  const [cfg,setCfg]=React.useState<PricingConfig>(DEFAULT_CONFIG)
  const [loading,setLoading]=React.useState(true)
  const [saving,setSaving]=React.useState(false)
  const [tariffs,setTariffs]=React.useState<any[]>([])

  // Charger la config du back si dispo ET les tarifs classiques
  React.useEffect(()=>{ (async()=>{
    try{
      // Config dynamique
      const res = await fetch('/api/admin/config', { cache:'no-store' })
      if(res.ok){ 
        const config = await res.json();
        setCfg(config)
      }
      
      // Tarifs classiques (cartes)
      const tariffsRes = await fetch('/api/admin/tariffs', { cache:'no-store' })
      if(tariffsRes.ok){
        const tariffsData = await tariffsRes.json();
        setTariffs(tariffsData)
      }
    }catch(e){ console.warn('Configuration par défaut utilisée',e) }
    finally{ setLoading(false) }
  })()},[])

  const save=async()=>{
    setSaving(true)
    try{
      const res = await fetch('/api/admin/config',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify(cfg)})
      if(!res.ok) throw new Error('Erreur serveur')
      alert('Config enregistrée !')
    }catch(e:any){ alert('Erreur: '+e.message) }
    finally{ setSaving(false) }
  }

  if(loading) return <p className="text-sm text-neutral-600 dark:text-neutral-400">Chargement de la configuration…</p>

  return (
    <div className="space-y-6">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-100">Gestion des tarifs</h1>
          <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-400">Cartes du site et configuration du pricing builder.</p>
        </div>
        <button onClick={save} disabled={saving}
          className="rounded-xl bg-red-500 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-red-600 disabled:opacity-50">
          {saving?'Enregistrement…':'Enregistrer'}
        </button>
      </header>

      <div className="rounded-2xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 p-4 shadow-sm">
        {/* Onglets */}
        <div className="overflow-x-auto">
          <div className="inline-flex gap-2 rounded-full bg-neutral-100 dark:bg-neutral-700 p-1 ring-1 ring-neutral-200 dark:ring-neutral-600">
            {(['cards','packs','services','sizes','export'] as const).map(k=>{
              const active=tab===k
              return (
                <button key={k} onClick={()=>setTab(k)}
                  className={`rounded-full px-3 py-1.5 text-sm transition ${active?'bg-white dark:bg-neutral-800 text-red-600 dark:text-red-400 shadow-sm':'text-neutral-700 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-neutral-100'}`}>
                  {k==='cards'?'Cartes du site':k==='packs'?'Packs':k==='services'?'Services':k==='sizes'?'Tailles':'Export'}
                </button>
              )
            })}
          </div>
        </div>

        <div className="mt-6">
          {/* Cartes du site */}
          {tab==='cards' && <CardsEditor tariffs={tariffs} setTariffs={setTariffs} />}

          {/* Packs */}
          {tab==='packs' && <PacksEditor cfg={cfg} setCfg={setCfg} />}

          {/* Services */}
          {tab==='services' && <ServicesEditor cfg={cfg} setCfg={setCfg} />}

          {/* Sizes */}
          {tab==='sizes' && <SizesEditor cfg={cfg} setCfg={setCfg} />}

          {/* Export */}
          {tab==='export' && (
            <div className="rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-700 p-4 ring-1 ring-neutral-100 dark:ring-neutral-600">
              <p className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">JSON de configuration</p>
              <textarea readOnly value={JSON.stringify(cfg,null,2)}
                className="mt-3 h-72 w-full rounded-lg border border-neutral-200 dark:border-neutral-600 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 p-3 font-mono text-xs"/>
              <p className="mt-2 text-xs text-neutral-600 dark:text-neutral-400">
                Ce JSON sera consommé par la modale de tarifs côté public. Tu peux aussi l'exporter pour versionner.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

/* ——————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————— */
/*                                                     PACKS EDITOR                                                           */
/* ——————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————— */
function PacksEditor({cfg,setCfg}:{cfg:PricingConfig;setCfg:(c:PricingConfig)=>void}){
  const [draft,setDraft]=React.useState({id:'',name:'',desc:'',items:[] as string[]})

  const add=()=>{
    if(!draft.id||!draft.name) return
    setCfg({...cfg,packs:[...(cfg.packs || []),{...draft,items:[...draft.items]}]})
    setDraft({id:'',name:'',desc:'',items:[]})
  }
  const remove=(id:string)=>setCfg({...cfg,packs:(cfg.packs || []).filter(p=>p.id!==id)})
  const updatePack=(id:string,field:'name'|'desc',value:string)=>{
    setCfg({...cfg,packs:(cfg.packs || []).map(p=>p.id===id?{...p,[field]:value}:p)})
  }
  const toggleItem=(pid:string,sid:string)=>{
    setCfg({...cfg,packs:(cfg.packs || []).map(p=>p.id===pid?{...p,items:p.items.includes(sid)?p.items.filter(x=>x!==sid):[...p.items,sid]}:p)})
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 p-4 shadow-sm">
        <p className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">Packs</p>
        <div className="mt-3 space-y-4">
          {(cfg.packs || []).map((p,i)=>(
            <div key={p.id||i} className="space-y-3">
              <div className="flex gap-2">
                <input value={p.name} onChange={e=>updatePack(p.id,'name',e.target.value)}
                  className="rounded-lg border border-neutral-200 dark:border-neutral-600 bg-white dark:bg-neutral-700 text-neutral-900 dark:text-neutral-100 px-3 py-2 text-sm outline-none focus:border-neutral-300 dark:focus:border-neutral-500"/>
                <input value={p.desc||''} onChange={e=>updatePack(p.id,'desc',e.target.value)} placeholder="Description…"
                  className="min-w-[220px] flex-1 rounded-lg border border-neutral-200 dark:border-neutral-600 bg-white dark:bg-neutral-700 text-neutral-900 dark:text-neutral-100 px-3 py-2 text-sm outline-none focus:border-neutral-300 dark:focus:border-neutral-500"/>
                <button onClick={()=>remove(p.id)} className="ml-auto rounded-lg border border-neutral-200 dark:border-neutral-600 px-3 py-2 text-sm hover:bg-neutral-50 dark:hover:bg-neutral-700 text-red-600 dark:text-red-400">
                  Suppr.
                </button>
              </div>
              <div className="pl-4 border-l-2 border-neutral-100 dark:border-neutral-700">
                <p className="text-xs font-medium text-neutral-700 dark:text-neutral-300">Prestations incluses</p>
                <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {(cfg.services || []).map(s=>(
                    <label key={s.id} className="flex items-center gap-2 rounded-lg border border-neutral-200 dark:border-neutral-600 bg-neutral-50 dark:bg-neutral-700 px-3 py-2 text-sm">
                      <input type="checkbox" checked={p.items.includes(s.id)} onChange={()=>toggleItem(p.id,s.id)} className="accent-red-500"/>
                      <span className="flex-1 text-neutral-900 dark:text-neutral-100">{s.name}</span>
                      <span className="ml-auto text-xs text-neutral-500 dark:text-neutral-400">{s.price}€</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-700 p-4 ring-1 ring-neutral-100 dark:ring-neutral-600">
        <p className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">Nouveau pack</p>
        <div className="mt-3 space-y-3">
          <input value={draft.id} onChange={e=>setDraft({...draft,id:e.target.value})} placeholder="ID (ex: premium)"
            className="w-full rounded-lg border border-neutral-200 dark:border-neutral-600 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 px-3 py-2 text-sm outline-none focus:border-neutral-300 dark:focus:border-neutral-500"/>
          <input value={draft.name} onChange={e=>setDraft({...draft,name:e.target.value})} placeholder="Nom affiché"
            className="w-full rounded-lg border border-neutral-200 dark:border-neutral-600 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 px-3 py-2 text-sm outline-none focus:border-neutral-300 dark:focus:border-neutral-500"/>
          <input value={draft.desc} onChange={e=>setDraft({...draft,desc:e.target.value})} placeholder="Description courte"
            className="w-full rounded-lg border border-neutral-200 dark:border-neutral-600 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 px-3 py-2 text-sm outline-none focus:border-neutral-300 dark:focus:border-neutral-500"/>
          <button onClick={add} disabled={!draft.id||!draft.name}
            className="w-full rounded-lg bg-red-500 px-3 py-2 text-sm font-medium text-white hover:bg-red-600 disabled:opacity-50">
            Ajouter
          </button>
        </div>
      </div>
    </div>
  )
}

/* ——————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————— */
/*                                                   SERVICES EDITOR                                                          */
/* ——————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————— */
function ServicesEditor({cfg,setCfg}:{cfg:PricingConfig;setCfg:(c:PricingConfig)=>void}){
  const [draft,setDraft]=React.useState({id:'',name:'',price:0,group:'Extérieur' as Group})

  const add=()=>{
    if(!draft.id||!draft.name) return
    setCfg({...cfg,services:[...(cfg.services || []),{...draft}]})
    setDraft({id:'',name:'',price:0,group:'Extérieur'})
  }
  const remove=(id:string)=>setCfg({...cfg,services:(cfg.services || []).filter(s=>s.id!==id)})
  const updateService=(id:string,field:'name'|'price'|'group',value:string|number)=>{
    setCfg({...cfg,services:(cfg.services || []).map(s=>s.id===id?{...s,[field]:value}:s)})
  }

  const groups = ['Extérieur','Intérieur','Options'] as const

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-6">
        {groups.map(group=>(
          <div key={group} className="rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 p-4 shadow-sm">
            <p className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">{group}</p>
            <div className="mt-3 space-y-2">
              {(cfg.services || []).filter(s=>s.group===group).map((s,i)=>(
                <div key={s.id||i} className="flex gap-2">
                  <input value={s.name} onChange={e=>updateService(s.id,'name',e.target.value)}
                    className="flex-1 rounded-lg border border-neutral-200 dark:border-neutral-600 bg-white dark:bg-neutral-700 text-neutral-900 dark:text-neutral-100 px-3 py-2 text-sm outline-none focus:border-neutral-300 dark:focus:border-neutral-500"/>
                  <input type="number" value={s.price} onChange={e=>updateService(s.id,'price',+e.target.value)}
                    className="w-20 rounded-lg border border-neutral-200 dark:border-neutral-600 bg-white dark:bg-neutral-700 text-neutral-900 dark:text-neutral-100 px-3 py-2 text-sm outline-none focus:border-neutral-300 dark:focus:border-neutral-500"/>
                  <button onClick={()=>remove(s.id)} className="rounded-lg border border-neutral-200 dark:border-neutral-600 px-3 py-2 text-sm hover:bg-neutral-50 dark:hover:bg-neutral-700 text-red-600 dark:text-red-400">
                    Suppr.
                  </button>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-700 p-4 ring-1 ring-neutral-100 dark:ring-neutral-600">
        <p className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">Nouvelle prestation</p>
        <div className="mt-3 space-y-3">
          <input value={draft.id} onChange={e=>setDraft({...draft,id:e.target.value})} placeholder="ID (ex: wax_premium)"
            className="w-full rounded-lg border border-neutral-200 dark:border-neutral-600 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 px-3 py-2 text-sm outline-none focus:border-neutral-300 dark:focus:border-neutral-500"/>
          <input value={draft.name} onChange={e=>setDraft({...draft,name:e.target.value})} placeholder="Nom affiché"
            className="w-full rounded-lg border border-neutral-200 dark:border-neutral-600 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 px-3 py-2 text-sm outline-none focus:border-neutral-300 dark:focus:border-neutral-500"/>
          <input type="number" value={draft.price} onChange={e=>setDraft({...draft,price:+e.target.value})} placeholder="Prix (€)"
            className="w-full rounded-lg border border-neutral-200 dark:border-neutral-600 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 px-3 py-2 text-sm outline-none focus:border-neutral-300 dark:focus:border-neutral-500"/>
          <select value={draft.group} onChange={e=>setDraft({...draft,group:e.target.value as Group})}
            className="w-full rounded-lg border border-neutral-200 dark:border-neutral-600 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 px-3 py-2 text-sm outline-none focus:border-neutral-300 dark:focus:border-neutral-500">
            {groups.map(g=><option key={g} value={g}>{g}</option>)}
          </select>
          <button onClick={add} disabled={!draft.id||!draft.name}
            className="w-full rounded-lg bg-red-500 px-3 py-2 text-sm font-medium text-white hover:bg-red-600 disabled:opacity-50">
            Ajouter
          </button>
        </div>
      </div>
    </div>
  )
}

/* ——————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————— */
/*                                                    SIZES EDITOR                                                            */
/* ——————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————— */
function SizesEditor({cfg,setCfg}:{cfg:PricingConfig;setCfg:(c:PricingConfig)=>void}){
  const [draft,setDraft]=React.useState({id:'',label:'',mult:1})

  const add=()=>{
    if(!draft.id||!draft.label) return
    setCfg({...cfg,sizes:[...(cfg.sizes || []),{...draft}]})
    setDraft({id:'',label:'',mult:1})
  }
  const remove=(id:string)=>setCfg({...cfg,sizes:(cfg.sizes || []).filter(s=>s.id!==id)})
  const updateSize=(id:string,field:'label'|'mult',value:string|number)=>{
    setCfg({...cfg,sizes:(cfg.sizes || []).map(s=>s.id===id?{...s,[field]:value}:s)})
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 p-4 shadow-sm">
        <p className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">Tailles de véhicule</p>
        <div className="mt-3 space-y-2">
          {(cfg.sizes || []).map((s,i)=>(
            <div key={s.id||i} className="flex gap-2">
              <input value={s.label} onChange={e=>updateSize(s.id,'label',e.target.value)} placeholder="Label (ex: Berline)"
                className="flex-1 rounded-lg border border-neutral-200 dark:border-neutral-600 bg-white dark:bg-neutral-700 text-neutral-900 dark:text-neutral-100 px-3 py-2 text-sm outline-none focus:border-neutral-300 dark:focus:border-neutral-500"/>
              <div className="flex items-center gap-1">
                <span className="text-sm text-neutral-700 dark:text-neutral-300">×</span>
                <input type="number" step="0.1" value={s.mult} onChange={e=>updateSize(s.id,'mult',+e.target.value)}
                  className="w-20 rounded-lg border border-neutral-200 dark:border-neutral-600 bg-white dark:bg-neutral-700 text-neutral-900 dark:text-neutral-100 px-3 py-2 text-sm outline-none focus:border-neutral-300 dark:focus:border-neutral-500"/>
              </div>
              <button onClick={()=>remove(s.id)} className="rounded-lg border border-neutral-200 dark:border-neutral-600 px-3 py-2 text-sm hover:bg-neutral-50 dark:hover:bg-neutral-700 text-red-600 dark:text-red-400">
                Suppr.
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-700 p-4 ring-1 ring-neutral-100 dark:ring-neutral-600">
        <p className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">Nouvelle taille</p>
        <div className="mt-3 space-y-3">
          <input value={draft.id} onChange={e=>setDraft({...draft,id:e.target.value})} placeholder="ID (ex: truck)"
            className="w-full rounded-lg border border-neutral-200 dark:border-neutral-600 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 px-3 py-2 text-sm outline-none focus:border-neutral-300 dark:focus:border-neutral-500"/>
          <input value={draft.label} onChange={e=>setDraft({...draft,label:e.target.value})} placeholder="Label affiché"
            className="w-full rounded-lg border border-neutral-200 dark:border-neutral-600 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 px-3 py-2 text-sm outline-none focus:border-neutral-300 dark:focus:border-neutral-500"/>
          <div className="flex items-center gap-2">
            <span className="text-sm text-neutral-700 dark:text-neutral-300">Multiplicateur ×</span>
            <input type="number" step="0.1" value={draft.mult} onChange={e=>setDraft({...draft,mult:+e.target.value})} placeholder="1.0"
              className="w-full rounded-lg border border-neutral-200 dark:border-neutral-600 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 px-3 py-2 text-sm outline-none focus:border-neutral-300 dark:focus:border-neutral-500"/>
          </div>
          <button onClick={add} disabled={!draft.id||!draft.label}
            className="w-full rounded-lg bg-red-500 px-3 py-2 text-sm font-medium text-white hover:bg-red-600 disabled:opacity-50">
            Ajouter
          </button>
        </div>
      </div>
    </div>
  )
}
