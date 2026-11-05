import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import {Plus_Jakarta_Sans} from "next/font/google"
import { Provider } from "@/components/provider";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { Suspense } from "react";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  display: "swap"
})

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

// AI theme-script

const themeScript = `(function(){try{var t=localStorage.getItem('twc-theme');if(t==='dark'||(!t&&window.matchMedia('(prefers-color-scheme: dark)').matches)){document.documentElement.classList.add('dark');}}catch(e){}})();`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${jakarta.variable} `}
    >
      <body 
      className="min-h-screen bg-[#fafaf9] text-neutral-900 antialiased dark:bg-neutral-950 dark:text-neutral-100"
      >
        <Provider>
          <Suspense fallback={<div className="sticky top-0 z-50 h-16 border-b border-neutral-200/70 bg-white/75 backdrop-blur-xl dark:border-neutral-800/80 dark:bg-neutral-950/75" />}>
            <Navbar/>
          </Suspense>
          <main
          className="min-h-[70vh]"
          >
            {children}
          </main>
          <Footer />
        </Provider>
      
      </body>
    </html>
  );
}
