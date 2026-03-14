"use client"

import "./globals.css"

export default function RootLayout({
children,
}:{
children:React.ReactNode
}){

return(

<html lang="en">

<body>

{/* GLOBAL BACKGROUND */}

<div className="bg-glow"></div>

{/* APP */}

<div className="relative z-10">

{children}

</div>

</body>

</html>

)

}