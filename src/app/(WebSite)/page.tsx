import Building from "@/components/Building";
import { homeMetadata } from "@/constants/metadatas";
export const metadata = homeMetadata;

export default function HomePage() {
  return (
    <main>
      <Building />
    </main>
  );
}
