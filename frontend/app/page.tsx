"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function Home(){

const router = useRouter()

useEffect(()=>{

const token =
localStorage.getItem("token") ||
sessionStorage.getItem("token")

if(token){
router.push("/dashboard")
}

},[])

return(

<div className="min-h-screen flex flex-col items-center justify-center px-6 text-white">

<h1 className="text-6xl font-semibold mb-3 tracking-tight bg-gradient-to-r from-white to-[#14E6C3] bg-clip-text text-transparent drop-shadow-[0_0_30px_rgba(20,230,195,0.45)]">
BeatSignal
</h1>

<p className="text-sm text-white/60 mb-4 text-center max-w-xl">
Detect stolen beats on YouTube using advanced audio fingerprint analysis.
</p>

<p className="text-[#14E6C3] mb-10 font-medium">
5 free scans included
</p>

<div className="flex gap-4">

<button
onClick={()=>router.push("/login")}
className="
bg-[#14E6C3]
text-black
px-8
py-3
rounded-lg
font-medium
transition
hover:scale-105
hover:shadow-[0_0_20px_rgba(20,230,195,0.6)]
"

>

Login </button>

<button
onClick={()=>router.push("/register")}
className="
border
border-white/20
px-8
py-3
rounded-lg
transition
hover:border-[#14E6C3]
"

>

Register </button>

</div>

</div>

)

}
