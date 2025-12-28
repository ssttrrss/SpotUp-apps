import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "sonner";

export const metadata: Metadata = {
  title: "Let's Go - نظام إدارة مساحات العمل",
  description: "نظام إدارة متكامل لمساحات العمل المشتركة - إدارة الحجوزات والغرف والعملاء والكافيتيريا",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl">
      <body>
        {children}
        <Toaster
          position="top-center"
          richColors
          closeButton
          toastOptions={{
            style: {
              fontFamily: 'Cairo, sans-serif',
            },
          }}
        />
      </body>
    </html>
  );
}
