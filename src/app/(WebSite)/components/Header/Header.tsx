import Image from "next/image";
import CallToAction from "../CallToAction/CallToAction";

export default function Header() {
  return (
    <header className="absolute z-10 w-full">
      <div className="flex flex-row items-center justify-between p-2 text-white">
        <Image src="img/logo-light.svg" alt="Logo" width={100} height={100} />
        <nav>
          <ul className="flex flex-row space-x-4">
            <li>Accueil</li>
            <li>Services</li>
            <li>A Propos</li>
            <li>Contact</li>
          </ul>
        </nav>
        <CallToAction size="md" />
      </div>
    </header>
  );
}
