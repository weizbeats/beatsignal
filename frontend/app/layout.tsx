import "./globals.css"
import BackgroundParticles from "@/components/BackgroundParticles"

export default function RootLayout({children}:{children:React.ReactNode}){

  return(

    <html lang="en">

      <body className="bg-black text-white">

        <BackgroundParticles/>

        {children}

      </body>

    </html>

  )

}