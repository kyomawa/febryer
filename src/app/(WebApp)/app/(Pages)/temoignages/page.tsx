import { servicesMetadata } from "@/constants/metadatas";
import Temoignages from "./component/Temoignage";

export const metadata = servicesMetadata;

export default function page() {
  return <Temoignages />;
}
