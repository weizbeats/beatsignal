"use client"

import { useState,useEffect } from "react"
import UserMenu from "@/components/UserMenu"
import ScanProgress from "@/components/ScanProgress"
import BackgroundParticles from "@/components/BackgroundParticles"

export default function Dashboard(){

const [url,setUrl] = useState("")
const [result,setResult] = useState<any[]>([])
const [progress,setProgress] = useState(0)
const [loading,setLoading] = useState(false)

useEffect(()=>{

const token = localStorage.getItem("token")

if(!token){
window.location.href="/"
}

},[])

async function handleScan(){

setLoading(true)
setProgress(5)

const fakeProgress = setInterval(()=>{
setProgress((p)=>p<90 ? p+5 : p)
},500)

try{

const token = localStorage.getItem("token")

const res = await fetch(
`${process.env.NEXT_PUBLIC_API_URL}/scan`,
{
method:"POST",
headers:{ "Content-Type":"application/json" },
body:JSON.stringify({ url,token })
}
)

const data = await res.json()

if(Array.isArray(data)){
setResult(data)
}

}catch(e){
console.log(e)
}

clearInterval(fakeProgress)

setProgress(100)

setTimeout(()=>{
setLoading(false)
setProgress(0)
},800)

}

return(

<div className="min-h-screen flex flex-col">

<BackgroundParticles/>

{/* TOP BAR */}

<div className="flex justify-between items-start p-6">

<div className="flex flex-col gap-2">

<span className="
bg-gradient-to-r
from-yellow-400
to-yellow-500
text-black
text-xs
font-semibold
px-3 py-1
rounded-md
shadow-[0_0_10px_rgba(255,200,0,0.4)]
w-fit
">
ADMIN
</span>

<p className="text-sm text-white/60">
Unlimited scans
</p>

<button className="
bg-emerald-400
text-black
text-sm
px-3 py-1
rounded-md
w-fit
hover:scale-105
hover:shadow-[0_0_10px_rgba(20,230,195,0.5)]
transition
">
Upgrade Plan
</button>

</div>

<div className="flex items-center gap-3">

<UserMenu/>

</div>

</div>

{/* CENTER */}

<div className="flex-1 flex flex-col items-center justify-center px-6">

<h1 className="
text-5xl
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

<p className="text-sm text-white/60 mb-8">
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
max-w-2xl
p-2
">

<input
value={url}
onChange={(e)=>setUrl(e.target.value)}
placeholder="Paste YouTube link"
className="flex-1 bg-transparent outline-none px-4 py-3 text-white placeholder-white/40"
/>

<button
onClick={handleScan}
className="
bg-[var(--accent)]
text-black
px-6 py-3
rounded-lg
font-medium
hover:scale-105
hover:shadow-[0_0_20px_rgba(20,230,195,0.4)]
transition
"
>
Scan
</button>

</div>

{loading && (

<div className="w-full max-w-2xl mt-6">

<ScanProgress progress={progress}/>

</div>

)}

{/* RESULTS */}

<div className="mt-10 space-y-4 w-full max-w-2xl">

{result.map((r,i)=>(

<div
key={i}
className="
card-glow
bg-black/40
border border-white/10
rounded-lg
p-4
hover:border-[var(--accent)]
transition
"
>

<p className="font-semibold">{r.song}</p>

<p className="text-sm text-white/60">{r.artist}</p>

</div>

))}

</div>

</div>

</div>

)

}