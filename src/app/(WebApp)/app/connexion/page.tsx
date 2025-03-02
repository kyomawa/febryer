import { Metadata } from "next";
import ConnexionForm from "./components/ConnexionForm";
import { connexionMetadata } from "@/constants/metadatas";

export const metadata: Metadata = connexionMetadata;

export default function page() {
  return (
    <main className="grid h-screen grid-cols-1 p-4 lg:grid-cols-2">
      {/* Form */}
      <div className="flex items-center justify-center">
        <div className="flex max-w-[95%] flex-col gap-y-12 sm:max-w-[80%] md:max-w-[65%] 2xl:max-w-[50%]">
          <div className="flex justify-center">
            {/* LOGO */}
            <span className="text-6xl font-medium">FB</span>
          </div>
          <div className="flex flex-col items-center gap-y-3">
            <h1 className="text-3xl font-bold sm:text-4xl">Se Connecter</h1>
            <p className="text-center font-roboto leading-6 text-neutral-400 dark:text-primary-200/65 sm:text-lg">
              Connectez-vous à votre compte pour accéder à votre espace
              personnel.
            </p>
          </div>
          <ConnexionForm />
          <div className="flex justify-center border-t border-neutral-200 py-4 dark:border-white/15">
            <p className="font-roboto text-sm text-neutral-400 dark:text-primary-200/65">
              © 2024 Fé bryer. Tous droits réservés.
            </p>
          </div>
        </div>
      </div>
      {/* Banner */}
      <Banner />
    </main>
  );
}

// ==================================================================================================================================

function Banner() {
  return (
    <div className="relative rounded-xl bg-primary-700 dark:bg-primary-800 max-lg:hidden" />
  );
}

// ==================================================================================================================================
