import { getConnectedUser } from "@/actions/users/actions";
import Navbar from "./Navbar/Navbar";

export default async function Header() {
  const user = await getConnectedUser();

  if (!user) {
    throw new Error("Cette utilisateur n'existe pas.");
  }

  const { name, image } = user;

  return <Navbar name={name} image={image} />;
}
