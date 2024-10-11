import "../globals.css";
import type { Metadata } from "next";
import { montserrat, roboto } from "../../fonts/fonts";
import { commonWebAppMetadata } from "@/constants/metadatas";
import { ViewTransitions } from "next-view-transitions";
import NextTopLoader from "nextjs-toploader";
import { ThemeProvider } from "./components/ThemeProvider";
import { Toaster } from "react-hot-toast";

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
          className={`${montserrat.variable} ${roboto.variable} ${montserrat.className} bg-neutral-50 text-black antialiased dark:bg-primary-1050 dark:text-white`}
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
            content="#0A0B12"
          />
          {/* Loading Bar */}
          <NextTopLoader color="#6a72c1" zIndex={10} showSpinner={false} />
          {/* Content of the website */}
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            {children}
            <Toaster
              toastOptions={{
                className:
                  "dark:bg-primary-900 bg-neutral-50 dark:text-white text-black",
              }}
            />
          </ThemeProvider>
        </body>
      </html>
    </ViewTransitions>
  );
}
