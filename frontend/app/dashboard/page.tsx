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

<div className="relative bg-black/40 border border-white/10 backdrop-blur-xl rounded-xl flex p-3">

<input
value={url}
onChange={(e)=>setUrl(e.target.value)}
placeholder="Paste YouTube link"
className="flex-1 bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white outline-none focus:border-[#14E6C3]"
/>

<button
onClick={handleScan}
className="ml-3 bg-[#14E6C3] text-black px-10 py-3 rounded-lg font-medium hover:scale-105 hover:shadow-[0_0_25px_rgba(20,230,195,0.7)] transition"
>
Scan
</button>

</div>

</div>

{/* SCANNING */}

{loading &&(

<div className="mt-16 animate-pulse text-white/60">
Scanning YouTube audio...
</div>

)}

{/* RESULTS */}

{results.length>0 &&(

<div className="mt-16 w-full max-w-5xl grid gap-6">

{results.map((r,i)=>(

<div
key={i}
className="
group
flex
gap-6
bg-black/40
border border-white/10
rounded-xl
p-6
backdrop-blur-xl
transition
hover:border-[#14E6C3]
hover:shadow-[0_0_40px_rgba(20,230,195,0.25)]
"
>

{/* COVER */}

<div className="w-24 h-24 rounded-lg overflow-hidden flex-shrink-0">

{r.cover ? (

<img
src={r.cover}
className="w-full h-full object-cover"
/>

):(

<div className="w-full h-full bg-black flex items-center justify-center text-white/40 text-xs">
No Cover
</div>

)}

</div>

{/* INFO */}

<div className="flex flex-col flex-1">

<h2 className="text-xl text-white font-semibold">
{r.song}
</h2>

<p className="text-white/60">
{r.artist}
</p>

<div className="flex flex-wrap gap-4 mt-3 text-sm text-white/50">

{r.release_date &&(
<span>
Release: {r.release_date}
</span>
)}

{r.isrc &&(
<span>
ISRC: {r.isrc}
</span>
)}

{r.score &&(
<span>
Score: {r.score}
</span>
)}

</div>

</div>

{/* SPOTIFY */}

{r.spotify_url &&(

<a
href={r.spotify_url}
target="_blank"
className="
self-center
bg-[#14E6C3]
text-black
px-4
py-2
rounded-md
text-sm
font-medium
hover:scale-105
hover:shadow-[0_0_20px_rgba(20,230,195,0.7)]
transition
"
>
Open Spotify
</a>

)}

</div>

))}

</div>

)}

</div>

</div>

)
}