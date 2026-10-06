import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ProjectTransitionProvider } from "./project-transition";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "2И3Д — независимая креативная студия",
    template: "%s — 2И3Д",
  },
  description: "Независимая креативная студия 2И3Д. Айдентика, цифровые проекты, моушн и визуальные коммуникации.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="ru" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body>
        <ProjectTransitionProvider>{children}</ProjectTransitionProvider>
      </body>
    </html>
  );
}
