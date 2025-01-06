import React from "react";
import CarrouselComponents from "./Carrouselcomponent"
import Image from "next/image";

const images = [
  { src: './raph/LavagePROf.png', alt: 'Lavage extérieur', title: 'Lavage extérieur' },
  { src: './raph/LavageINt.png', alt: "Lavage intérieur", title: 'Lavage intérieur' },
  { src: './raph/LavagePROf.png', alt: "Lavage en profondeur", title: 'Lavage en profondeur' },
];
export default function Carrousel() {
  
  return (
    <Image alt=""src="" />
      <div className="caroussel-conteneur">
        <h2>Nos Services</h2>
      <div className="flex-row flex">
        {images.map((image, index) => (
          <CarrouselComponents 
            key={index}
            src={image.src} 
            alt={image.alt} 
            title={image.title}
          />
        ))}
      </div>
      </div>
    );
  }
  