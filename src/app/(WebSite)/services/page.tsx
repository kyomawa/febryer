import CardService from "../components/CardService/CardService";

export default function page() {
  return (
    <div className="relative mt-24">
      <div className="flex justify-center gap-4">
        <CardService />
        <CardService isMostPopular />
      </div>
    </div>
  );
}
