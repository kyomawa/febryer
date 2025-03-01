"use client";

import { Highlights } from "@/constants/data";
import CallToAction from "../CallToAction/CallToAction";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { InViewParagraph } from "@/components/ui/InViewParagraph";

export default function Highlight() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "start start"],
  });

  const translateX = useTransform(scrollYProgress, [0, 1], [500, -300]);

  return (
    <div ref={ref} className="bg-primary flex flex-col text-white">
      {/* Section du titre principal avec effet de scroll */}
      <section className="flex justify-center overflow-hidden text-nowrap border-b border-white px-4 py-24">
        <motion.h1
          style={{ x: translateX }}
          className="text-center text-6xl font-bold uppercase md:text-8xl"
        >
          {Highlights.title}
        </motion.h1>
      </section>

      {/* Section centrée avec sous-titre, titre et paragraphe */}
      <section className="flex justify-center border-b border-white px-4 py-24">
        <div className="w-full max-w-3xl">
          <h2 className="text-xl font-semibold uppercase md:text-2xl">
            {Highlights.centered.subtitle}
          </h2>
          <h1 className="mt-4 text-3xl font-bold uppercase md:text-4xl">
            {Highlights.centered.title}
          </h1>
          <InViewParagraph>{Highlights.centered.paragraph}</InViewParagraph>
        </div>
      </section>
      <div className="grid md:grid-cols-2">
        <div className="border-b border-white py-24 md:border-b-0 md:border-r md:py-0">
          <div className="m-16 flex flex-col items-center justify-center text-justify">
            <InViewParagraph>{Highlights.bottomLeft.paragraph}</InViewParagraph>
          </div>
        </div>
        <div className="mx-8 my-24 flex flex-col items-center justify-center text-justify md:my-0">
          <InViewParagraph>
            {Highlights.bottomRight.paragraph}
            <div className="mt-2 flex items-center justify-center">
              <CallToAction size="md" isGray />
            </div>
          </InViewParagraph>
        </div>
      </div>
    </div>
  );
}
