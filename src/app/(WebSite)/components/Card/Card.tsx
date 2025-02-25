"use client";
import { useEffect, useState } from "react";
import { getServices } from "@/actions/gestion/action";
import Image from "next/image";

export default function Card() {
  const [services, setServices] = useState<
    {
      id: string;
      name: string;
      description: string;
      price: number;
      duration: string;
      createdAt: Date;
      image: string | null;
    }[]
  >([]);

  useEffect(() => {
    getServices().then((data) => setServices(data));
  }, []);

  return (
    <div className="mt-4 flex flex-wrap justify-center gap-8">
      {services.map((item) => (
        <div
          key={item.id}
          className="relative w-72 transition-transform duration-300 ease-in-out hover:scale-105"
        >
          <Image
            src={item.image ?? "/placeholder.jpg"}
            alt={item.name}
            className="h-[400px] w-full rounded-lg object-cover object-center"
            width={300}
            height={400}
          />
          <div className="mt-2">
            <h3 className="truncate text-lg font-bold">{item.name}</h3>
            <div className="line-clamp-3 text-sm">{item.description}</div>
          </div>
        </div>
      ))}
    </div>
  );
}
