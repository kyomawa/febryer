export default function Banner() {
  return (
    <div className="absolute bottom-0 left-0 w-full bg-primary-500 p-4 text-white">
      <div className="flex flex-row gap-4 divide-x">
        <div>
          <p>Contactez-nous maintenant</p>
          <p className="text-sm">+33 6 30 56 90 33</p>
        </div>
        <div>
          <p className="ml-4">Localisation</p>
          <p className="ml-4 text-sm">Secteur - Roannais</p>
        </div>
      </div>
    </div>
  );
}
