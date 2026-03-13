"use client"

import "./globals.css"
import Sidebar from "../components/Sidebar"
import { usePathname } from "next/navigation"

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {

  const pathname = usePathname()

  const hideSidebar =
    pathname === "/" ||
    pathname === "/register"

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