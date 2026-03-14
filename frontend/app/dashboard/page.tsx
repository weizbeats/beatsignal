"use client"

import { useState,useEffect } from "react"
import { useRouter } from "next/navigation"

export default function Dashboard(){

const router = useRouter()

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

<div className="min-h-screen flex flex-col items-center justify-center">

<h1 className="text-5xl mb-6">
BeatSignal
</h1>

<div className="flex gap-4">

<input
value={url}
onChange={(e)=>setUrl(e.target.value)}
placeholder="Paste YouTube link"
/>

<button onClick={handleScan}>
Scan
</button>

<button onClick={logout}>
Logout
</button>

</div>

{result.map((r,i)=>(
<div key={i}>
<p>{r.song}</p>
<p>{r.artist}</p>
</div>
))}

</div>

)

}