"use client"

import { useState,useEffect } from "react"

export default function Dashboard(){

const [url,setUrl] = useState("")
const [result,setResult] = useState<any[]>([])

useEffect(()=>{

const token = localStorage.getItem("token")

if(!token){
window.location.href="/"
}

},[])

function logout(){

localStorage.clear()
window.location.href="/"

}

async function handleScan(){

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

}

const user = typeof window !== "undefined"
? localStorage.getItem("user")
: ""

return(

<div className="min-h-screen flex flex-col">

{/* TOP BAR */}

<div className="flex justify-between items-start p-6">

{/* LEFT SIDE */}

<div className="flex flex-col gap-2">

<span className="bg-yellow-400 text-black text-xs font-semibold px-3 py-1 rounded-md w-fit">
ADMIN
</span>

<p className="text-sm text-white/60">
Unlimited scans
</p>

<button className="bg-emerald-400 text-black text-sm px-3 py-1 rounded-md w-fit hover:opacity-90">
Upgrade Plan
</button>

</div>

{/* RIGHT SIDE */}

<div className="flex items-center gap-3">

<div className="bg-black/40 border border-white/10 px-3 py-1 rounded-md text-sm">
{user}
</div>

</div>

</div>

{/* CENTER */}

<div className="flex-1 flex flex-col items-center justify-center px-6">

<h1 className="text-5xl font-semibold mb-4 tracking-tight">

Beat<span className="text-[var(--accent)]">Signal</span>

</h1>

<p className="text-sm text-white/60 mb-8">
Detect stolen beats on YouTube
</p>

<div className="card-glow bg-black/40 border border-white/10 backdrop-blur-xl rounded-xl flex w-full max-w-2xl p-2">

<input
value={url}
onChange={(e)=>setUrl(e.target.value)}
placeholder="Paste YouTube link"
className="flex-1 bg-transparent outline-none px-4 py-3 text-white placeholder-white/40"
/>

<button
onClick={handleScan}
className="bg-[var(--accent)] text-black px-6 py-3 rounded-lg font-medium hover:opacity-90"
>
Scan
</button>

</div>

<button
onClick={logout}
className="mt-6 text-sm text-white/40 hover:text-white"
>
Logout
</button>

{/* RESULTS */}

<div className="mt-10 space-y-4 w-full max-w-2xl">

{result.map((r,i)=>(

<div
key={i}
className="card-glow bg-black/40 border border-white/10 rounded-lg p-4"
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