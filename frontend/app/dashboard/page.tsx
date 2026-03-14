"use client"

import { useState,useEffect } from "react"
import TopBar from "@/components/TopBar"

export default function Dashboard(){

const [url,setUrl] = useState("")

useEffect(()=>{

const token = localStorage.getItem("token")

if(!token){
window.location.href="/"
}

},[])

async function handleScan(){

const token = localStorage.getItem("token")

await fetch(
`${process.env.NEXT_PUBLIC_API_URL}/scan`,
{
method:"POST",
headers:{ "Content-Type":"application/json" },
body:JSON.stringify({ url,token })
}
)

}

return(

<div className="min-h-screen flex flex-col">

<TopBar/>

<div className="flex-1 flex flex-col items-center justify-center px-6">

<h1 className="
text-6xl
font-semibold
mb-4
tracking-tight
bg-gradient-to-r
from-white
to-[#14E6C3]
bg-clip-text
text-transparent
drop-shadow-[0_0_25px_rgba(20,230,195,0.25)]
">
BeatSignal
</h1>

<p className="text-sm text-white/60 mb-10">
Detect stolen beats on YouTube
</p>

<div className="
card-glow
bg-black/40
border border-white/10
backdrop-blur-xl
rounded-xl
flex
w-full
max-w-3xl
p-3
">

<input
value={url}
onChange={(e)=>setUrl(e.target.value)}
placeholder="Paste YouTube link"
className="
flex-1
bg-black/40
border border-white/10
rounded-lg
px-4
py-3
text-white
outline-none
"
/>

<button
onClick={handleScan}
className="
ml-3
bg-[#14E6C3]
text-black
px-7
py-3
rounded-lg
font-medium
hover:scale-105
hover:shadow-[0_0_20px_rgba(20,230,195,0.5)]
transition
"
>
Scan
</button>

</div>

</div>

</div>

)

}