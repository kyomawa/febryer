"use client";
import React, { useCallback, useEffect, useRef, useState } from "react";

const ColorPicker = ({ default_value = "#1C9488" }) => {
  const [color, setColor] = useState(() => {
    const sanitizedHex = sanitizeHex(default_value);
    const hsl = hexToHsl({ hex: sanitizedHex });
    return { ...hsl, hex: sanitizedHex };
  });

  const handleSave = async () => {
    try {
      const response = await fetch("/api/save-color", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ color: color.hex }),
      });
      if (!response.ok) {
        throw new Error("Failed to save color");
      }
      alert("Couleur enregistrée avec succès !");
    } catch (error) {
      console.error("Erreur lors de l'enregistrement :", error);
      alert("Erreur lors de l'enregistrement de la couleur");
    }
  };

  return (
    <div className="flex flex-col items-center gap-3 rounded-lg border bg-white p-4 shadow-md dark:bg-zinc-900">
      <input
        type="color"
        value={`#${color.hex}`}
        onChange={(e) => {
          const hex = sanitizeHex(e.target.value);
          setColor({ ...hexToHsl({ hex }), hex });
        }}
        className="h-16 w-16 border"
      />
      <input
        type="text"
        value={color.hex}
        onChange={(e) => {
          const hex = sanitizeHex(e.target.value);
          if (hex.length <= 6) {
            setColor({ ...hexToHsl({ hex }), hex });
          }
        }}
        className="rounded-md border p-2"
      />
      <button
        onClick={handleSave}
        className="rounded-md bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
      >
        OK
      </button>
    </div>
  );
};

function sanitizeHex(val: string) {
  return val.replace(/[^a-fA-F0-9]/g, "").toUpperCase();
}

function hexToHsl({ hex }: { hex: string }) {
  hex = hex.replace(/^#/, "");
  if (hex.length === 3) {
    hex = hex
      .split("")
      .map((char) => char + char)
      .join("");
  }
  while (hex.length < 6) {
    hex += "0";
  }
  let r = parseInt(hex.slice(0, 2), 16) / 255;
  let g = parseInt(hex.slice(2, 4), 16) / 255;
  let b = parseInt(hex.slice(4, 6), 16) / 255;
  let max = Math.max(r, g, b),
    min = Math.min(r, g, b);
  let h = 0,
    s,
    l = (max + min) / 2;
  if (max === min) {
    h = s = 0;
  } else {
    let d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }
    h /= 6;
  }
  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100),
  };
}

export default ColorPicker;
