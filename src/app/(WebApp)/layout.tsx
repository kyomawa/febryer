import type { Metadata } from "next";
import "../globals.css";
import { montserrat, roboto } from "../../fonts/fonts";
import { commonWebAppMetadata } from "@/constants/metadatas";
import { Toaster } from "react-hot-toast";
import { ViewTransitions } from "next-view-transitions";
import NextTopLoader from "nextjs-toploader";
import { ThemeProvider } from "./components/ThemeProvider";

export const metadata: Metadata = commonWebAppMetadata;

export default function WebAppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ViewTransitions>
      <html lang="fr">
        <body
          className={`${montserrat.variable} ${roboto.variable} ${montserrat.className} dark:bg-primary-1050 bg-neutral-50 text-black antialiased dark:text-white`}
        >
          {/* Manifest of the website */}
          <link rel="manifest" href="/manifests/manifestapp.json" />
          <meta
            name="theme-color"
            media="(prefers-color-scheme: light)"
            content="#fafafa"
          />
          <meta
            name="theme-color"
            media="(prefers-color-scheme: dark)"
            content="#190808"
          />
          {/* Loading Bar */}
          <NextTopLoader color="#c24040" zIndex={10} showSpinner={false} />
          {/* Content of the website */}
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            {children}
            <Toaster />
          </ThemeProvider>
        </body>
      </html>
    </ViewTransitions>
  );
}
