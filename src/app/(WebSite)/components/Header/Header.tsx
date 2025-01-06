import Image from "next/image";

export default function Header() {
  return (
    <header className="z-10 flex flex-row items-center justify-between p-2 text-white">
      <Image src="img/logo-light.svg" alt="Logo" width={100} height={100} />
      <nav>
        <ul className="flex flex-row space-x-4">
          <li>Accueil</li>
          <li>Services</li>
          <li>A Propos</li>
          <li>Contact</li>
        </ul>
      </nav>
      <button className="bg-primary-500 p-2">Rendez-vous</button>
    </header>
  );
}
