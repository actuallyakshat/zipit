import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Zipit",
  description: "Share files across the web without compromising on the quality",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className}}`}>
        <Toaster
          position="bottom-left"
          reverseOrder={true}
          toastOptions={{
            style: {
              border: "1px solid #007bff",
              padding: "16px",
              color: "#007bff",
              fontWeight: "500",
            },
            iconTheme: {
              primary: "#007bff",
              secondary: "#FFFAEE",
            },
          }}
        />
        {children}
      </body>
    </html>
  );
}
