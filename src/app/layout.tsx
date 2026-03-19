import type { Metadata } from "next";
import { Bebas_Neue, Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "@/components/auth-provider";

const bebasNeue = Bebas_Neue({
  variable: "--font-bebas",
  subsets: ["latin"],
  weight: ["400"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "FICAV - Fédération Ivoirienne du Cinéma et de l'Audiovisuel",
  description: "La plateforme numérique du cinéma ivoirien. Hub professionnel pour l'écosystème audiovisuel de Côte d'Ivoire.",
  keywords: ["FICAV", "cinéma ivoirien", "audiovisuel", "Côte d'Ivoire", "film", "production", "réalisation"],
  authors: [{ name: "FICAV" }],
  icons: {
    icon: "/logo.svg",
  },
  openGraph: {
    title: "FICAV - Fédération Ivoirienne du Cinéma et de l'Audiovisuel",
    description: "La plateforme numérique du cinéma ivoirien",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className="dark" suppressHydrationWarning>
      <body
        className={`${bebasNeue.variable} ${inter.variable} font-sans antialiased bg-background text-foreground min-h-screen`}
        suppressHydrationWarning
      >
        <AuthProvider>
          <div className="relative min-h-screen flex flex-col">
            {children}
          </div>
        </AuthProvider>
        <Toaster />
      </body>
    </html>
  );
}
