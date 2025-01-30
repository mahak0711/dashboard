"use client"


import Homepage from "./component/Homepage"
import ClientProvider from "./component/ClientProvider"

export default function Home() {
  return(
    <html lang="en">
          <body>
            <ClientProvider>
              <Homepage />
              </ClientProvider>
              
          </body>
        </html>
  )
}
