import { homeMetadata } from "@/constants/metadatas";
import Image from "next/image";
import Banner from "./components/Banner/Banner";
import CallToAction from "./components/CallToAction/CallToAction";
export const metadata = homeMetadata;

export default function HomePage() {
  return (
    <main>
      <div className="relative h-screen">
        <div className="absolute left-0 top-0 flex h-full w-full items-center">
          <Image
            src="/img/Bg-wip-cloudinary.png"
            alt="Background Image"
            className="h-full w-full object-cover"
            layout="fill"
            priority
          />
          <div className="relative z-10 my-0 p-4 uppercase text-white transition-all duration-700 sm:my-12 md:my-16 lg:my-20 xl:my-24">
            <h1 className="text-4xl font-bold sm:text-5xl md:text-6xl">
              <span className="text-primary-500">Toujours</span> brillant
            </h1>
            <h2 className="mt-4 text-2xl font-bold sm:text-3xl md:text-4xl">
              <span className="text-primary-500">Toujours</span> prêt à rouler
            </h2>
            <div className="mt-4">
              <CallToAction size="lg" />
            </div>
          </div>
          <Banner />
        </div>
      </div>

      <div className="z-10 mt-4 p-4 text-black">
        <h1 className="text-2xl font-bold">toto</h1>
      </div>

      <h1 className="z-10 text-black">Febryer en cours de construction...</h1>
    </main>
  );
}
