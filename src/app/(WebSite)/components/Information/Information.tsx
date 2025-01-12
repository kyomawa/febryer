import Image from "next/image";
import { Information as InformationData } from "@/constants/data";
export default function Information() {
  return (
    <div className="mx-12 flex flex-col items-center justify-center gap-16 p-4 font-semibold text-gray-900 md:mx-44 md:flex-row">
      <Image
        src="/img/Logo-without-text.svg"
        alt="Logo febryer"
        height={200}
        width={200}
      />
      <p className="max-w-screen-md text-justify">
        {InformationData.description}
      </p>
    </div>
  );
}
