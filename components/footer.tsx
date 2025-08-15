import { IconFB, IconIG, IconX } from "./icons";
import { Social } from "./social";

export function Footer() {
    return(
      <footer className="border-t border-neutral-100 dark:border-neutral-800 bg-white dark:bg-neutral-900">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-2xl bg-red-500 flex items-center justify-center shadow-sm">
                  <svg viewBox="0 0 24 24" className="h-5 w-5 text-white" aria-hidden>
                    <path d="M4 12c0-4.418 3.582-8 8-8 2.761 0 5.2 1.4 6.681 3.524a1 1 0 0 1-.316 1.43l-2.01 1.206A6 6 0 1 0 18 16.5h2A8 8 0 0 1 4 12Z" fill="currentColor"/>
                  </svg>
                </div>
                <span className="font-semibold tracking-tight text-neutral-900 dark:text-white">Fé Bryer</span>
              </div>
              <p className="mt-4 text-sm text-neutral-600 dark:text-neutral-400 max-w-xs">Lavage et detailing auto premium à domicile. Lyon & alentours.</p>
            </div>
            <div className="text-sm">
              <p className="font-semibold text-neutral-900 dark:text-white">Coordonnées</p>
              <p className="mt-2 text-neutral-600 dark:text-neutral-400">contact@febryer.fr</p>
              <p className="text-neutral-600 dark:text-neutral-400">07 12 34 56 78</p>
              <p className="text-neutral-600 dark:text-neutral-400">Lyon, France</p>
            </div>
            <div className="text-sm">
              <p className="font-semibold text-neutral-900 dark:text-white">Suivez-nous</p>
              <div className="mt-2 flex items-center gap-3">
                <Social icon={<IconX/>} label="X"/>
                <Social icon={<IconIG/>} label="Instagram"/>
                <Social icon={<IconFB/>} label="Facebook"/>
              </div>
            </div>
          </div>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-between border-t border-neutral-100 dark:border-neutral-800 pt-6 text-xs text-neutral-500 dark:text-neutral-400">
            <p>© {new Date().getFullYear()} Fé Bryer. Tous droits réservés.</p>
            <div className="flex items-center gap-4 mt-2 sm:mt-0">
              <a href="#" className="hover:text-neutral-700 dark:hover:text-neutral-300">Mentions légales</a>
              <a href="#" className="hover:text-neutral-700 dark:hover:text-neutral-300">CGV</a>
              <a href="#" className="hover:text-neutral-700 dark:hover:text-neutral-300">RGPD</a>
            </div>
          </div>
        </div>
    </footer>
    )
}