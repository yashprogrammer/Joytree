import type { Metadata } from "next";
import { Geist_Mono, Jost, Sacramento } from "next/font/google";
import "./globals.css";
import ClientMocks from "./mocks-provider";
import OrientationGuard from "./orientation-guard";
import Image from "next/image";
import Link from "next/link";

const jost = Jost({
  variable: "--font-jost",
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
});

const sacramento = Sacramento({
  variable: "--font-sacramento",
  subsets: ["latin"],
  weight: "400",
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Joytree",
  description: "Choose your desired gift",
  icons: {
    icon: [
      { url: "https://joytreeglobal.com/wp-content/uploads/Fav_250X250-50x50.png", sizes: "32x32", type: "image/png" },
      { url: "https://joytreeglobal.com/wp-content/uploads/Fav_250X250.png", sizes: "192x192", type: "image/png" },
    ],
    apple: "https://joytreeglobal.com/wp-content/uploads/Fav_250X250.png",
  },
  other: {
    "msapplication-TileImage": "https://joytreeglobal.com/wp-content/uploads/Fav_250X250.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${jost.variable} ${sacramento.variable} ${geistMono.variable} antialiased`}>
        <ClientMocks />
        <OrientationGuard />
        <div className="px-2 pt-2">
          <Link href="/" aria-label="Joytree Home">
            <Image src="/JoytreeLogo.png" alt="Joytree" width={96} height={24} priority />
          </Link>
        </div>
        <main className="min-h-[100dvh]">
          {children}
        </main>
      </body>
    </html>
  );
}
