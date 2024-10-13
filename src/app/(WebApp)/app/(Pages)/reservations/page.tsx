import { reservationsMetadata } from "@/constants/metadatas";
import Reservations from "./components/Reservations";

export const metadata = reservationsMetadata;

export default function page() {
  return <Reservations />;
}
