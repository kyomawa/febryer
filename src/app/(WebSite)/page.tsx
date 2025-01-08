import Building from "@/components/Building";
import { homeMetadata } from "@/constants/metadatas";
import Image from "next/image";
export const metadata = homeMetadata;

export default function HomePage() {
  return (
    <main>
      <Building />
    </main>
  );
}
