import Image from "next/image";

export default function Footer() {
  return (
    <footer className="bg-primary-500 pt-8 text-justify text-white">
      <div className="flex flex-col justify-between gap-8 px-8 md:flex-row">
        <div className="flex flex-col border-r-2 border-white pr-8">
          <Image
            src="/img/logo-light.svg"
            alt="Logo"
            width={120}
            height={120}
            className="mb-2"
          />
          <div>
            Spécialiste du nettoyage intérieur et extérieur, Febryer vous offre
            un service professionnel, personnalisé et respectueux de
            l&apos;environnement. Votre satisfaction est notre priorité !
          </div>
        </div>

        <div className="flex w-full flex-col">
          <div className="mt-2 font-semibold"> NOUS SUIVRE </div>
          <div className="my-auto flex flex-row justify-evenly">
            <Image
              src="/icons/facebook-icon.svg"
              alt="Facebook"
              width={34}
              height={34}
              className="transition-transform duration-300 hover:rotate-12 hover:scale-110"
            />
            <Image
              src="icons/instagram-icon.svg"
              alt="Instagram"
              width={34}
              height={34}
              className="transition-transform duration-300 hover:-rotate-12 hover:scale-110"
            />
            <Image
              src="icons/snapchat-icon.svg"
              alt="Snapchat"
              width={34}
              height={34}
              className="transition-transform duration-300 hover:rotate-12 hover:scale-110"
            />
            <Image
              src="icons/tiktok-icon.svg"
              alt="Tiktok"
              width={34}
              height={34}
              className="transition-transform duration-300 hover:-rotate-12 hover:scale-110"
            />
          </div>
        </div>
        <div className="flex w-full flex-col">
          <div className="mt-2 font-semibold"> SITEMAP </div>
          <div className="my-auto flex justify-center gap-4">
            <ul className="flex flex-col gap-2">
              <li className="underline-offset-4 hover:underline">Accueil</li>
              <li className="underline-offset-4 hover:underline">Services</li>
            </ul>
            <ul className="flex flex-col gap-2">
              <li className="underline-offset-4 hover:underline"> A Propos</li>
              <li className="underline-offset-4 hover:underline"> Contact </li>
            </ul>
          </div>
        </div>
      </div>
      <div className="my-auto mt-4 flex items-center justify-center bg-primary-700 py-2">
        Made with ❤️ by{" "}
        <a
          href="https://www.kanzoto.com"
          className="ml-1 font-semibold text-blue-200"
        >
          Kanzoto
        </a>
      </div>
    </footer>
  );
}
