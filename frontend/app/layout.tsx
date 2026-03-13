"use client"

import "./globals.css"
import Sidebar from "../components/Sidebar"
import { usePathname } from "next/navigation"
import { useEffect } from "react"

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {

  const pathname = usePathname()

  const hideSidebar =
    pathname === "/" ||
    pathname === "/register"

  useEffect(()=>{

    const user = localStorage.getItem("user")

    if(!user) return

    const interval = setInterval(()=>{

      fetch(`${process.env.NEXT_PUBLIC_API_URL}/heartbeat`,{
        method:"POST",
        headers:{
          "Content-Type":"application/json"
        },
        body:JSON.stringify({
          user
        })
      })

    },10000)

    return ()=>clearInterval(interval)

  },[])

  return (

    <html>

      <body className="bg-black text-white">

        {hideSidebar ? (

          <main>
            {children}
          </main>

        ) : (

          <div className="flex">

            <Sidebar />

            <main className="flex-1 p-10">
              {children}
            </main>

          </div>

        )}

      </body>

    </html>

  )
}