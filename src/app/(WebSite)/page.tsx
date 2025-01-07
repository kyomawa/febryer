import { homeMetadata } from "@/constants/metadatas";
import Image from "next/image";
import Banner from "./components/Banner/Banner";
import CallToAction from "./components/CallToAction/CallToAction";
import Title from "./components/Title/Title";
import Card from "./components/Card/Card";
import Information from "./components/Information/Information";
import Highlight from "./components/Highlight/Highlight";
import Testimonial from "./components/Testimonial/Testimonial";
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

      <div className="z-10 my-16 flex flex-col justify-center p-4 text-black">
        <Title title="Nos services" paragraph="Plus qu’un simple lavage auto" />
        <div className="flex w-full flex-row justify-center gap-8">
          <Card />
        </div>
      </div>
      <div className="my-44">
        <Information />
      </div>
      <div className="my-44">
        <Highlight />
      </div>
      <div className="mb-32 p-4">
        <Title
          title="Ce que nos clients disent de nous"
          paragraph="Des témoignages qui reflètent la qualité de nos services"
        />
        <div className="mx-16 flex flex-row justify-center gap-8">
          <Testimonial />
        </div>
      </div>

      <div className="my-16 flex justify-center">
        <div>
          <Title
            title="Prêt à redonner à votre voiture tout son éclat ?"
            paragraph="Ne perdez plus de temps"
          />
          <p>
            faites confiance à Febryer pour un entretien professionnel et
            personnalisé. Cliquez ci-dessous pour réserver votre créneau dès
            aujourd'hui !
          </p>
          <div>
            <CallToAction size="lg" />
          </div>
        </div>
      </div>
      <h1 className="z-10 text-black">Febryer en cours de construction...</h1>
    </main>
  );
}
