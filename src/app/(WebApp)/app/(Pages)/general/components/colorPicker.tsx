"use client";
import {
  changeColor,
  changeSecondaryColor,
  getColor,
  getSecondaryColor,
} from "@/actions/gestion/action";
import React, { useState, useEffect } from "react";

interface ColorPickerProps {
  type: "primary" | "secondary";
  default_value?: string;
}

const ColorPicker: React.FC<ColorPickerProps> = ({
  default_value,
  ...colorPickerProps
}) => {
  const [color, setColor] = useState<{
    h: number;
    s: number;
    l: number;
    hex: string;
  } | null>(null);
  const [initialColor, setInitialColor] = useState<string | null>(null);

  // Charger la couleur initiale
  useEffect(() => {
    const fetchColor = async () => {
      const resolvedValue =
        default_value ||
        (colorPickerProps.type === "primary"
          ? await getColor()
          : await getSecondaryColor());
      const sanitizedHex = sanitizeHex(resolvedValue);
      const hsl = hexToHsl({ hex: sanitizedHex });

      if (sanitizedHex !== initialColor) {
        setColor({ ...hsl, hex: sanitizedHex });
        setInitialColor(sanitizedHex);
      }
    };
    fetchColor();
  }, [default_value, colorPickerProps.type, initialColor]); // Correction de la dépendance useEffect

  const handleSave = async () => {
    try {
      if (colorPickerProps.type === "primary") {
        await changeColor({ color: color?.hex });
      } else {
        await changeSecondaryColor({ color: color?.hex });
      }
      alert("Couleur enregistrée avec succès !");
    } catch (error) {
      console.error("Erreur lors de l'enregistrement :", error);
      alert("Erreur lors de l'enregistrement de la couleur");
    }
  };

  return (
    <div className="flex flex-col items-center gap-3 rounded-lg border bg-white p-4 shadow-md dark:bg-zinc-900">
      <p>
        {colorPickerProps.type === "primary"
          ? "Choisissez une couleur primaire"
          : "Choisissez une couleur secondaire"}
      </p>
      <input
        type="color"
        value={`#${color?.hex ?? "000000"}`} // Valeur par défaut pour éviter une erreur
        onChange={(e) => {
          const hex = sanitizeHex(e.target.value);
          setColor({ ...hexToHsl({ hex }), hex });
        }}
        className="h-16 w-16 border"
      />
      <input
        type="text"
        value={color?.hex ?? ""}
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

// Fonction pour nettoyer un code hexadécimal
function sanitizeHex(val: string) {
  return val.replace(/[^a-fA-F0-9]/g, "").toUpperCase();
}

// Fonction de conversion HEX -> HSL
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
  const r = parseInt(hex.slice(0, 2), 16) / 255;
  const g = parseInt(hex.slice(2, 4), 16) / 255;
  const b = parseInt(hex.slice(4, 6), 16) / 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  /* eslint-disable prefer-const */
  let h = 0,
    s,
    l = (max + min) / 2;
  if (max === min) {
    h = s = 0;
  } else {
    const d = max - min;
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
