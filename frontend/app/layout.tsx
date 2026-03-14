import "./globals.css"
import BackgroundParticles from "@/components/BackgroundParticles"

export const metadata = {
  title: "BeatSignal",
  description: "Detect stolen beats on YouTube"
}

export default function RootLayout({ children }: { children: React.ReactNode }) {

  return (

    <html lang="en">

      <body>

        <BackgroundParticles />

        <div className="bg-glow"></div>

        {children}

      </body>

    </html>

  )

}