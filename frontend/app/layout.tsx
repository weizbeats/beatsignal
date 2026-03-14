import "./globals.css"
import BackgroundParticles from "@/components/BackgroundParticles"

export default function RootLayout({
children,
}:{
children:React.ReactNode
}){

return(

<html lang="en">

<body className="bg-background text-foreground">

{/* GLOW BACKGROUND */}

<div className="bg-glow"></div>

{/* PARTICLES */}

<BackgroundParticles/>

{/* CONTENT */}

<div className="relative z-10 min-h-screen flex flex-col">

{children}

</div>

</body>

</html>

)

}