import type { Metadata } from "next";
import "./globals.css";
import { StoreProvider } from "./_redux/storeProvider";
import localFont from "next/font/local";

const myFont = localFont({
  src: "../public/fonts/Inter-VariableFont_opsz,wght.ttf",
  weight: "300",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "CarChronicle",
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
