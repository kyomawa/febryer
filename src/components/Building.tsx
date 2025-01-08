import Image from "next/image";
export default function Building() {
  return (
    <div className="relative h-screen w-full">
      <div className="absolute right-1 top-1 flex h-screen flex-col text-start text-3xl font-bold">
        <p>Site en construction</p>
        <p className="text-lg font-light">
          Le site Febryer sera disponible très prochainement !{" "}
        </p>
      </div>
      <Image
        src="/img/crane-5207098.svg"
        alt="Grue site en construction "
        width={200}
        height={200}
        className="absolute h-full w-full object-cover"
      />
    </div>
  );
}
