import localFont from "next/font/local";

export const montserrat = localFont({
  src: [
    {
      path: "./Montserrat/Montserrat-Italic-VariableFont_wght.ttf",
      weight: "100 900",
      style: "italic",
    },
    {
      path: "./Montserrat/Montserrat-VariableFont_wght.ttf",
      weight: "100 900",
      style: "normal",
    },
  ],
  variable: "--font-montserrat",
});

export const roboto = localFont({
  src: [
    {
      path: "./Roboto/Roboto-Black.ttf",
      weight: "900",
      style: "normal",
    },
    {
      path: "./Roboto/Roboto-BlackItalic.ttf",
      weight: "900",
      style: "italic",
    },
    {
      path: "./Roboto/Roboto-Bold.ttf",
      weight: "700",
      style: "normal",
    },
    {
      path: "./Roboto/Roboto-BoldItalic.ttf",
      weight: "700",
      style: "italic",
    },
    {
      path: "./Roboto/Roboto-Italic.ttf",
      weight: "400",
      style: "italic",
    },
    {
      path: "./Roboto/Roboto-Light.ttf",
      weight: "300",
      style: "normal",
    },
    {
      path: "./Roboto/Roboto-LightItalic.ttf",
      weight: "300",
      style: "italic",
    },
    {
      path: "./Roboto/Roboto-Medium.ttf",
      weight: "500",
      style: "normal",
    },
    {
      path: "./Roboto/Roboto-MediumItalic.ttf",
      weight: "500",
      style: "italic",
    },
    {
      path: "./Roboto/Roboto-Regular.ttf",
      weight: "400",
      style: "normal",
    },
    {
      path: "./Roboto/Roboto-Thin.ttf",
      weight: "100",
      style: "normal",
    },
    {
      path: "./Roboto/Roboto-ThinItalic.ttf",
      weight: "100",
      style: "italic",
    },
  ],
  variable: "--font-roboto",
});
