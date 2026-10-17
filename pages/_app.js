import "@/styles/globals.css";
import "@/styles/concepts.css";
import DesignSwitcher from "@/components/DesignSwitcher";
import { Inter } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export default function App({ Component, pageProps }) {
  return (
    <div className={`${inter.variable} ${inter.className}`}>
      <Component {...pageProps} />
      <DesignSwitcher />
      <Analytics />
    </div>
  );
}
