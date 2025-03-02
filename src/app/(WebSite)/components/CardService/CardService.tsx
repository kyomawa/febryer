import Image from "next/image";

interface CardServiceProps {
  isMostPopular?: boolean;
}
export default function CardService({ isMostPopular }: CardServiceProps) {
  return (
    <div className="rounded-lg bg-white pb-8 shadow-lg">
      <Image
        src="/img/webappimg.png"
        alt="service"
        width={200}
        height={200}
        className="w-full rounded-t-lg"
      />
      {isMostPopular && (
        <div className="bg-primary p-1 text-center text-sm text-white">
          {" "}
          Le plus populaire
        </div>
      )}

      <h1 className="ml-4 mt-4 text-start text-2xl font-bold">Service 1</h1>
      <div className="ml-4 text-4xl font-bold text-primary">99.99 €</div>
      <ul className="ml-4 mt-4">
        <li className="flex items-center gap-2"> - Test 1</li>
        <li className="flex items-center gap-2"> - Test 2</li>
        <li className="flex items-center gap-2"> - Test 3</li>
      </ul>
    </div>
  );
}
