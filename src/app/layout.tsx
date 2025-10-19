import type { Metadata } from "next";
import { Vazirmatn } from "next/font/google";
import "./globals.css";

const vazirmatn = Vazirmatn({
  variable: "--font-vazirmatn",
  subsets: ["latin", "arabic"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "نمایشگر پانارومای 360 درجه - BINA",
  description: "نمایش تصاویر پانارومای 360 درجه با قابلیت چرخش و زوم",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fa" dir="rtl">
      <head>
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/pannellum@2.5.6/build/pannellum.css"/>
        <script async src="https://cdn.jsdelivr.net/npm/pannellum@2.5.6/build/pannellum.js"></script>
      </head>
      <body className={`${vazirmatn.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
