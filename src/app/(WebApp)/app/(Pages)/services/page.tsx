import { servicesMetadata } from "@/constants/metadatas";
import Services from "./components/Services";

export const metadata = servicesMetadata;

export default function page() {
  return <Services />;
}
