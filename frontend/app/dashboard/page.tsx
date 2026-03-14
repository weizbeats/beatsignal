"use client"

import { useState,useEffect } from "react"
import TopBar from "@/components/TopBar"

export default function Dashboard(){

const [url,setUrl]=useState("")
const [results,setResults]=useState([])
const [loading,setLoading]=useState(false)

useEffect(()=>{

const token=localStorage.getItem("token")

if(!token){
window.location.href="/"
}

},[])

async function handleScan(){

const token=localStorage.getItem("token")

setLoading(true)

const res=await fetch(
`${process.env.NEXT_PUBLIC_API_URL}/scan`,
{
method:"POST",
headers:{ "Content-Type":"application/json"},
body:JSON.stringify({url,token})
}
)

const data=await res.json()

setLoading(false)

if(data.results){
setResults(data.results)
}

}

return(

<div className="flex flex-col flex-1">

<TopBar/>

<div className="w-full flex flex-col items-center px-6 pt-32">

<h1 className="text-6xl font-semibold mb-4 tracking-tight bg-gradient-to-r from-white to-[#14E6C3] bg-clip-text text-transparent drop-shadow-[0_0_30px_rgba(20,230,195,0.45)]">
BeatSignal
</h1>

<p className="text-sm text-white/60 mb-14">
Detect stolen beats on YouTube
</p>

<div className="relative w-full max-w-5xl">

<div className="absolute inset-0 bg-[#14E6C3] opacity-20 blur-3xl rounded-xl"></div>

<div className="relative card-glow bg-black/40 border border-white/10 backdrop-blur-xl rounded-xl flex p-3">

<input
value={url}
onChange={(e)=>setUrl(e.target.value)}
placeholder="Paste YouTube link"
className="flex-1 bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white outline-none focus:border-[#14E6C3]"
/>

<button
onClick={handleScan}
className="ml-3 bg-[#14E6C3] text-black px-10 py-3 rounded-lg font-medium"
>
Scan
</button>

</div>

</div>

{loading && (
<p className="mt-10 text-white/60">Scanning...</p>
)}

{results.length>0 &&(

<div className="mt-16 w-full max-w-4xl space-y-4">

{results.map((r,i)=>(

<div
key={i}
className="bg-black/40 border border-white/10 rounded-lg p-6 backdrop-blur-xl"
>

<p className="text-white text-lg font-semibold">
{r.song}
</p>

<p className="text-white/60">
{r.artist}
</p>

</div>

))}

</div>

)}

</div>

</div>

)
}