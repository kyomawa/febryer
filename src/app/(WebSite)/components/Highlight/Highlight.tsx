import { Highlights } from "@/constants/data";
import CallToAction from "../CallToAction/CallToAction";

export default function Highlight() {
  return (
    <div className="flex flex-col bg-primary-500 text-white">
      {/* Section du titre principal */}
      <section className="flex justify-center border-b border-white px-4 py-8">
        <h1 className="truncate text-center text-6xl font-bold uppercase md:text-8xl">
          {Highlights.title}
        </h1>
      </section>

      {/* Section centrée avec sous-titre, titre et paragraphe */}
      <section className="flex justify-center border-b border-white px-4 py-12">
        <div className="w-full max-w-3xl">
          <h2 className="text-xl font-semibold uppercase md:text-2xl">
            {Highlights.centered.subtitle}
          </h2>
          <h1 className="mt-4 text-3xl font-bold uppercase md:text-4xl">
            {Highlights.centered.title}
          </h1>
          <p className="mt-4 text-justify text-base md:text-lg">
            {Highlights.centered.paragraph}
          </p>
        </div>
      </section>
      <div className="grid md:grid-cols-2">
        <div className="border-b border-white py-16 md:border-b-0 md:border-r md:py-0">
          <div className="m-8 flex flex-col items-center justify-center text-justify">
            <div> {Highlights.bottomLeft.paragraph}</div>
          </div>
        </div>
        <div className="m-8 my-16 flex flex-col items-center justify-center text-justify md:my-0">
          <div>{Highlights.bottomRight.paragraph}</div>
          <div className="mt-2">
            <CallToAction size="md" isGray />
          </div>
        </div>
      </div>
    </div>
  );
}
