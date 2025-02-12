"use client"


import ClientProvider from "./component/ClientProvider"
import Homepage from "./component/Homepage"
export default function Home() {
  return(
    
            <ClientProvider>
            <Homepage/>
            </ClientProvider>
          
  )
}

