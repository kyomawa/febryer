import { MapPin, Phone } from "lucide-react";
export default function Banner() {
  return (
    <div className="absolute bottom-0 left-0 w-full bg-primary-500 p-4 text-white">
      <div className="mt-2 flex flex-col gap-4 divide-x-0 divide-y sm:flex-row sm:divide-x sm:divide-y-0">
        <div>
          <p>Contactez-nous maintenant</p>
          <div className="flex flex-row items-center">
            <Phone className="mr-1 w-4" />
            <p className="text-sm">+33 6 30 56 90 33</p>
          </div>
        </div>
        <div>
          <p className="ml-4 mt-4 sm:mt-0">Localisation</p>
          <div className="ml-4 flex flex-row items-center">
            <MapPin className="w-4" />

            <p className="text-sm">Secteur - Roannais</p>
          </div>
        </div>
      </div>
    </div>
  );
}
