import type { Metadata } from "next";
import { Open_Sans, Montserrat, Epilogue, Monoton } from "next/font/google";
import "./globals.css";

const open_sans = Open_Sans({
  variable: "--font-open-sans",
  subsets: ["latin"],
});
const monoton = Monoton({
  variable: "--font-monoton",
  subsets: ["latin"],
  weight: "400"
});
const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
});
const epilogue = Epilogue({
  variable: "--font-epilogue",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Area | Automate your workflow",
  description: "Automate and reclaim your time",
};

import { AuthProvider } from "@/contexts/AuthContext";

// ... (imports)

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body
        className={`${monoton.variable} ${open_sans.variable} ${epilogue.variable} ${montserrat.variable} antialiased bg-white min-h-screen w-full overflow-x-hidden`}
        suppressHydrationWarning
      >
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
