import ContentHeader from "../../components/ContentHeader";

export default function Services() {
  return (
    <section className="relative flex min-h-[calc(100vh-7rem)] flex-col gap-y-6">
      {/* Header */}
      <ContentHeader title="Services" refreshTagNameButton="services" />
      {/* Content */}
      <div className="flex flex-col gap-y-4">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3"></div>
      </div>
    </section>
  );
}
