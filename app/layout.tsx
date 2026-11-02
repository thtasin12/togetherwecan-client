import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import {Plus_Jakarta_Sans} from "next/font/google"

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
        {children}
      
      </body>
    </html>
  );
}
