"use client"


import ClientProvider from "./component/ClientProvider"
import Homepage from "./component/Homepage"

export default function Home() {
  return(
    <html lang="en">
          <body>
            <ClientProvider>
            <Homepage/>
            </ClientProvider>
          </body>
        </html>
  )
}

