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

console.log(data)

if(Array.isArray(data)){
setResult(data)
}

}

return(

<div className="min-h-screen flex flex-col items-center justify-center px-6">

<h1 className="text-5xl font-semibold mb-8 tracking-tight">

Beat<span className="text-[var(--accent)]">Signal</span>

</h1>

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
className="mt-6 text-sm text-white/50 hover:text-white"
>
Logout
</button>

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

)

}