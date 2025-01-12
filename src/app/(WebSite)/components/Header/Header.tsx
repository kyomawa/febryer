import Image from "next/image";
import CallToAction from "../CallToAction/CallToAction";

export default function Header() {
  return (
    <header className="absolute z-10 w-full">
      <div className="flex flex-row items-center justify-between p-2 text-white">
        <Image src="img/logo-light.svg" alt="Logo" width={120} height={120} />
        <nav>
          <ul className="flex flex-row space-x-4 text-base font-semibold">
            <li className="duration-200 hover:text-primary-500">Accueil</li>
            <li className="duration-200 hover:text-primary-500">Services</li>
            <li className="duration-200 hover:text-primary-500">A Propos</li>
            <li className="duration-200 hover:text-primary-500">Contact</li>
          </ul>
        </nav>
        <CallToAction size="md" />
      </div>
    </header>
  );
}
