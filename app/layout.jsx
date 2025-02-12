import "./globals.css";
import Navbar from "./component/Navbar";
import { Inter } from "next/font/google"
import ClientProvider from "./component/ClientProvider";
import { Toaster } from "@/components/ui/toaster";

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "Dashboard",
  description: "Client_Admin",
};

export default function RootLayout({ children }) {
  return (
    <ClientProvider>
    <html lang="en">
      <body className={inter.className}>
        <main className=" flex flex-col justify-center items-center">
       
          <Navbar />
          {children}
          <Toaster richColors position="top-right" />

        </main>
      </body>
    </html>
    </ClientProvider>

  )
}
