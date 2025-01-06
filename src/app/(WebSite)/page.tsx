import { homeMetadata } from "@/constants/metadatas";
import Image from "next/image";
export const metadata = homeMetadata;

export default function HomePage() {
  return (
    <main className="">
      {/* Image and Banner Container */}
      <div className="absolute left-0 top-0 h-full w-full">
        <Image
          src="/img/Bg-wip-cloudinary.png"
          alt="Background Image"
          className="h-full w-full object-cover"
          layout="fill"
          priority
        />
        {/* Banner positioned at the bottom of the image */}
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
      </div>

      {/* Content */}
      <div className="relative z-10 my-0 p-4 uppercase text-white transition-all duration-700 sm:my-12 md:my-16 lg:my-20 xl:my-24">
        <h1 className="text-4xl font-bold sm:text-5xl md:text-6xl">
          <span className="text-primary-500">Toujours</span> brillant
        </h1>
        <h2 className="mt-4 text-2xl font-bold sm:text-3xl md:text-4xl">
          <span className="text-primary-500">Toujours</span> prêt à rouler
        </h2>
        <button className="mt-4 bg-primary-500 p-2 md:p-4 md:text-xl">
          Rendez-vous
        </button>
      </div>

      {/* Footer Text */}
      <h1 className="relative z-10 text-white">
        Febryer en cours de construction...
      </h1>
    </main>
  );
}
