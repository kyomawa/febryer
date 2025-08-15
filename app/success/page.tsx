// app/success/page.tsx
export default function SuccessPage() {
  return (
    <div className="mx-auto max-w-2xl p-8">
      <h1 className="text-2xl font-bold">Merci !</h1>
      <p className="mt-2 text-neutral-700">
        Votre paiement a été **autorisé**. Nous vérifions votre demande et vous recontactons pour valider le créneau.
      </p>
    </div>
  )
}
