import React from "react";

function CarrouselComponents({title}) {
  return (
    <div className="CarrouselComponents">
<div class="w-41 h-48  bg-black rounded-md"></div>
{/*  <img src={src} alt={alt} />*/}
      <div><h3>{title}</h3></div>
    </div>
  );
}

export default CarrouselComponents;
