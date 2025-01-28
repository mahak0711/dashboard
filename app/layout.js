import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ClientProvider from "./component/ClientProvider";
export const metadata = {
  title: "Dashboard",
  description: "Client_Admin",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <ClientProvider>
          {children}
          </ClientProvider>
      </body>
    </html>
  );
}
