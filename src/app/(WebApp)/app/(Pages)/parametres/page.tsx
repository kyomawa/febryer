import { getConnectedUser } from "@/actions/users/actions";
import { settingsMetadata } from "@/constants/metadatas";
import Settings from "./components/Settings";

export const metadata = settingsMetadata;

export default async function page() {
  const connectedUser = await getConnectedUser();

  if (!connectedUser) {
    throw new Error("Vous devez être connecté.");
  }

  return <Settings connectedUser={connectedUser} />
}
