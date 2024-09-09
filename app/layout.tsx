import type { Metadata } from "next";
import "@/app/globals.css";
import { StoreProvider } from "@/app/_redux/storeProvider";
import localFont from "next/font/local";

const myFont = localFont({
  src: "../public/fonts/Inter-VariableFont_opsz,wght.ttf",
  weight: "300",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "CarChronicle",
  icons: [
    {
      rel: "icon",
      type: "image/png",
      sizes: "16x16",
      url: "/public/favicon/favicon-16x16.png",
    },
    {
      rel: "icon",
      type: "image/png",
      sizes: "32x32",
      url: "../public/favicon/favicon-32x32.png",
    },
    {
      rel: "apple-touch-icon",
      sizes: "180x180",
      url: "../public/favicon/apple-touch-icon.png",
    },
    {
      rel: "android-chrome-192x192",
      sizes: "180x180",
      url: "../public/favicon/android-chrome-192x192.png",
    },
    {
      rel: "android-chrome-512x512",
      sizes: "180x180",
      url: "../public/favicon/android-chrome-512x512.png",
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <StoreProvider>
      <html lang="en" className={myFont.className}>
        <body>
          <div className="page-container">{children}</div>
        </body>
      </html>
    </StoreProvider>
  );
}
