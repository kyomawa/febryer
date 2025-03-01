import type { Metadata } from "next";
import { montserrat, roboto } from "../../fonts/fonts";
import { commonMetadata, jsonLd } from "@/constants/metadatas";
import "../globals.css";
import NextTopLoader from "nextjs-toploader";
import SmoothScroll from "@/components/SmoothScroll";
import { ViewTransitions } from "next-view-transitions";
import Header from "./components/Header/Header";
import Footer from "./components/Footer/Footer";
import { ThemeProvider } from "@/components/ThemeProvider";

export const metadata: Metadata = commonMetadata;

export default function WebsiteLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ViewTransitions>
      <html lang="fr">
        <body
          className={`${montserrat.variable} ${roboto.variable} ${montserrat.className} bg-neutral-50 antialiased`}
        >
          {/* Manifest of the website */}
          <link rel="manifest" href="/manifests/manifest.json" />
          {/* Loading Bar */}
          <NextTopLoader color="#6a72c1" speed={225} showSpinner={false} />
          {/* Content of the website */}
          <SmoothScroll>
            <div className="flex min-h-screen flex-col gap-y-8">
              <ThemeProvider>
                <Header />
                <div className="flex-1">{children}</div>
                <Footer />
              </ThemeProvider>
            </div>
          </SmoothScroll>
          {/* JSON-LD of the website */}
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
          />
        </body>
      </html>
    </ViewTransitions>
  );
}
