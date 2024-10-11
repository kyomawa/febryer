import { User } from "@prisma/client";
import ContentHeader from "../../components/ContentHeader";
import SettingsDeleteProfilForm from "./SettingsDeleteProfilForm";
import SettingsProfilePasswordForm from "./SettingsProfilePasswordForm";
import SettingsProfileEmailForm from "./SettingsProfileEmailForm";
import SettingsProfileNameForm from "./SettingsProfileNameForm";
import SettingsProfileImageForm from "./SettingsProfileImageForm";

// ===================================================================================================

type SettingsProps = {
  connectedUser: User;
};

export default function Settings({ connectedUser }: SettingsProps) {
  const { name, email } = connectedUser;

  return (
    <section className="relative flex min-h-[calc(100vh-7rem)] flex-col gap-y-6">
      {/* Header */}
      <ContentHeader
        title="Paramètres"
        modal={<SettingsDeleteProfilForm />}
        refreshTagNameButton="connectedUser"
      />
      {/* Content */}
      <div className="flex flex-col gap-y-4">
        <UserProfileForm connectedUser={connectedUser} />
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          <UserProfileName name={name} />
          <UserProfileEmail email={email} />
          <UserProfilePassword />
        </div>
      </div>
    </section>
  );
}

// ===================================================================================================

type UserProfileFormProps = {
  connectedUser: User;
};

function UserProfileForm({ connectedUser }: UserProfileFormProps) {
  return (
    <div className="relative flex flex-1 items-center gap-6 rounded-lg bg-black/5 p-3 dark:bg-white/10 max-md:flex-col">
      {/* ImageProfile + Profile Forms */}
      <SettingsProfileImageForm connectedUser={connectedUser} />
      {/* Description  */}
      <div className="flex flex-1 flex-col gap-y-1">
        <span className="text-lg">Image</span>
        <p className="text-sm text-black/85 dark:text-white/50">
          Choisissez un avatar qui correspond à votre profil.
        </p>
      </div>
    </div>
  );
}

// ===================================================================================================

type UserProfileNameProps = {
  name: User["name"];
};

function UserProfileName({ name }: UserProfileNameProps) {
  return (
    <div className="flex flex-col gap-y-5 rounded-lg bg-black/5 p-5 dark:bg-white/10">
      <span className="text-lg">Nom</span>
      <div className="flex flex-col gap-y-3">
        <SettingsProfileNameForm name={name} />
        <p className="text-sm text-black/85 dark:text-white/50">
          Cliquez pour modifier votre nom.
        </p>
      </div>
    </div>
  );
}

// ===================================================================================================

type UserProfileEmailProps = {
  email: User["email"];
};

function UserProfileEmail({ email }: UserProfileEmailProps) {
  return (
    <div className="flex flex-col gap-y-5 rounded-lg bg-black/5 p-5 dark:bg-white/10">
      <span className="text-lg">Email</span>
      <div className="flex flex-col gap-y-3">
        <SettingsProfileEmailForm email={email} />
        <p className="text-sm text-black/85 dark:text-white/50">
          Cliquez pour modifier votre mail.
        </p>
      </div>
    </div>
  );
}

// ===================================================================================================

function UserProfilePassword() {
  return (
    <div className="flex flex-col gap-y-5 rounded-lg bg-black/5 p-5 dark:bg-white/10">
      <span className="text-lg">Mot de passe</span>
      <div className="flex flex-col gap-y-3">
        <SettingsProfilePasswordForm />
        <p className="text-sm text-black/85 dark:text-white/50">
          Cliquez pour modifier votre mot de passe.
        </p>
      </div>
    </div>
  );
}

// ===================================================================================================
