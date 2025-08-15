// app/cancel/page.tsx
export default function CancelPage() {
  return (
    <div className="mx-auto max-w-2xl p-8">
      <h1 className="text-2xl font-bold">Paiement annulé</h1>
      <p className="mt-2 text-neutral-700">
        Aucune somme n’a été débitée. Vous pouvez réessayer quand vous voulez.
      </p>
    </div>
  )
}
