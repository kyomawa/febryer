"use client";

import React from "react";
import ContentHeader from "../../components/ContentHeader";
import { getServices } from "@/actions/gestion/action";

export default function Services() {
  const [services, setServices] = React.useState<
    {
      id: string;
      name: string;
      price: number;
      duration: string;
      createdAt: Date;
    }[]
  >([]);
  const [loading, setLoading] = React.useState<boolean>(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    const fetchServices = async () => {
      try {
        const data = await getServices();
        setServices(data);
      } catch (err) {
        setError("Une erreur est survenue lors du chargement des services.");
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  return (
    <section className="relative flex min-h-[calc(100vh-7rem)] flex-col gap-y-6">
      <ContentHeader title="Services" refreshTagNameButton="services" />
      <div className="flex flex-col gap-y-4">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {loading ? (
            <p>Chargement des services...</p>
          ) : error ? (
            <p className="text-red-500">{error}</p>
          ) : services.length > 0 ? (
            services.map((service) => (
              <div
                key={service.id}
                className="rounded-lg border border-gray-300 p-4 shadow-sm"
              >
                <h3 className="text-lg font-bold">{service.name}</h3>
                <p>Prix : {service.price}€</p>
                <p>Durée : {service.duration}</p>
                <p>
                  Créé le : {new Date(service.createdAt).toLocaleDateString()}
                </p>
              </div>
            ))
          ) : (
            <p>Aucun service disponible. Créez-en un pour commencer !</p>
          )}
        </div>
      </div>
    </section>
  );
}
