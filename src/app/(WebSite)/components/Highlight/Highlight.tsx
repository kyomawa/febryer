import { Highlights } from "@/constants/data";
import CallToAction from "../CallToAction/CallToAction";
export default function Highlight() {
  return (
    <div className="flex flex-col bg-primary-500 text-white">
      <section className="flex gap-4 border-b border-white py-8">
        <h1 className="mx-0 overflow-hidden text-clip text-nowrap text-8xl font-bold uppercase">
          {Highlights.title}
        </h1>
      </section>

      <section className="flex w-full flex-col justify-center border-b border-white">
        <div className="mx-auto w-1/2 py-16">
          <h2>{Highlights.centered.subtitle}</h2>
          <h1>{Highlights.centered.title}</h1>
          <p>{Highlights.centered.paragraph}</p>
        </div>
      </section>

      <div className="mx-32 flex flex-row">
        <section className="flex h-full w-1/2 flex-col border-r border-white">
          <div className="flex max-w-lg justify-center p-2 py-8">
            {Highlights.bottomLeft.paragraph}
          </div>
        </section>

        <section className="my-8 flex w-1/2 flex-col py-8">
          <div className="flex justify-center">
            {Highlights.bottomRight.paragraph}
          </div>
          <div className="mt-4 flex justify-center">
            <CallToAction size="md" isGray />
          </div>
        </section>
      </div>
    </div>
  );
}
