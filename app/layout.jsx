import "./globals.css";
import Navbar from "./component/Navbar";
import { Inter } from "next/font/google"
import ClientProvider from "./component/ClientProvider";

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "Dashboard",
  description: "Client_Admin",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
      <ClientProvider>

        <main className=" flex flex-col justify-center items-center">
       
          <Navbar />
          {children}

        </main>
        </ClientProvider>

      </body>
    </html>

  )
}
