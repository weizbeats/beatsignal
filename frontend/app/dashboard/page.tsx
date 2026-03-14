"use client"

import { useState,useEffect } from "react"
import TopBar from "@/components/TopBar"

export default function Dashboard(){

const [url,setUrl]=useState("")
const [results,setResults]=useState<any[]>([])
const [loading,setLoading]=useState(false)
const [progress,setProgress]=useState(0)

useEffect(()=>{

const token=localStorage.getItem("token")

if(!token){
window.location.href="/"
}

},[])



/* PROGRESS ANIMATION */

useEffect(()=>{

let interval:any

if(loading){

setProgress(0)

interval=setInterval(()=>{

setProgress(prev=>{

if(prev>=95) return prev
return prev+3

})

},350)

}

return ()=>clearInterval(interval)

},[loading])



async function handleScan(){

const token=localStorage.getItem("token")

setLoading(true)
setResults([])

const res=await fetch(
`${process.env.NEXT_PUBLIC_API_URL}/scan`,
{
method:"POST",
headers:{ "Content-Type":"application/json"},
body:JSON.stringify({url,token})
}
)

const data=await res.json()

setProgress(100)
setLoading(false)

if(data.results){
setResults(data.results)
}

}



function progressMessage(){

if(progress < 20) return `Initializing scan engine... ${progress}%`
if(progress < 40) return `Searching global music indexes... ${progress}%`
if(progress < 60) return `Analyzing patterns with AI... ${progress}%`
if(progress < 80) return `Matching tracks worldwide... ${progress}%`
if(progress < 100) return `Finalizing results... ${progress}%`

return `Match found`
}



return(

<div className="flex flex-col flex-1">

<TopBar/>

<div className="w-full flex flex-col items-center px-6 pt-16">

<h1 className="text-6xl font-semibold mb-3 tracking-tight bg-gradient-to-r from-white to-[#14E6C3] bg-clip-text text-transparent drop-shadow-[0_0_30px_rgba(20,230,195,0.45)]">
BeatSignal
</h1>

<p className="text-sm text-white/60 mb-10">
Detect stolen beats on YouTube
</p>



{/* SEARCH BAR */}

<div className="w-full max-w-5xl">

<div className="relative">

<div className="absolute inset-0 bg-[#14E6C3] opacity-20 blur-3xl rounded-xl"></div>

<div className="relative bg-black/50 border border-white/10 backdrop-blur-xl rounded-xl flex p-2">

<input
value={url}
onChange={(e)=>setUrl(e.target.value)}
placeholder="Paste YouTube link"
className="flex-1 bg-black/40 border border-white/10 rounded-lg px-4 py-2.5 text-white outline-none focus:border-[#14E6C3]"
/>

<button
onClick={handleScan}
className="ml-3 bg-[#14E6C3] text-black px-8 py-2.5 rounded-lg font-medium hover:scale-105 hover:shadow-[0_0_20px_rgba(20,230,195,0.7)] transition"
>
Scan
</button>

</div>

</div>

</div>



{/* PROGRESS BAR */}

{loading &&(

<div className="w-full max-w-5xl mt-8">

<div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">

<div
style={{width:`${progress}%`}}
className="h-full bg-[#14E6C3] transition-all duration-500"
></div>

</div>

<p className="text-white/50 text-sm mt-2">
{progressMessage()}
</p>

</div>

)}



{/* RESULTS */}

{results.length>0 &&(

<div className="mt-10 w-full max-w-5xl grid gap-4 pb-20">

{results.map((r,i)=>{

const confidence=Math.min(Math.round(r.score || 0),100)

return(

<div
key={i}
className="relative group flex gap-4 bg-black/40 border border-white/10 rounded-lg p-4 backdrop-blur-xl transition hover:border-[#14E6C3] hover:shadow-[0_0_30px_rgba(20,230,195,0.25)] overflow-hidden"
>


{/* BLUR BACKGROUND */}

{r.cover &&(

<img
src={r.cover}
className="absolute inset-0 w-full h-full object-cover opacity-10 blur-3xl"
/>

)}


{/* COVER */}

<div className="w-16 h-16 rounded-md overflow-hidden flex-shrink-0 z-10">

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

<div className="flex flex-col flex-1 z-10">

<h2 className="text-lg text-white font-semibold leading-tight">
{r.song}
</h2>

<p className="text-white/60 text-sm">
{r.artist}
</p>



{/* CONFIDENCE BAR */}

<div className="mt-2">

<div className="flex justify-between text-xs text-white/50 mb-1">

<span>Match confidence</span>
<span>{confidence}%</span>

</div>

<div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">

<div
style={{width:`${confidence}%`}}
className="h-full bg-[#14E6C3] transition-all duration-700"
></div>

</div>

</div>



{/* META */}

<div className="flex flex-wrap gap-3 mt-2 text-xs text-white/50">

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

</div>

</div>



{/* SPOTIFY */}

{r.spotify_url &&(

<a
href={r.spotify_url}
target="_blank"
className="self-center bg-[#14E6C3] text-black px-3 py-1.5 rounded-md text-xs font-medium hover:scale-105 hover:shadow-[0_0_15px_rgba(20,230,195,0.7)] transition z-10"
>
Spotify
</a>

)}

</div>

)

})}

</div>

)}

</div>

</div>

)
}