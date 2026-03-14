"use client"

import { useState,useEffect } from "react"
import { useRouter } from "next/navigation"
import ScanProgress from "../../components/ScanProgress"

export default function Dashboard(){

const router = useRouter()

const [url,setUrl] = useState("")
const [loading,setLoading] = useState(false)
const [progress,setProgress] = useState(0)
const [result,setResult] = useState<any[]>([])

const [user,setUser] = useState("")
const [isAdmin,setIsAdmin] = useState(false)

useEffect(()=>{

const token = localStorage.getItem("token")
const savedUser = localStorage.getItem("user")

if(!token || !savedUser){
window.location.href="/"
return
}

setUser(savedUser)

if(savedUser==="weizbeat@gmail.com"){
setIsAdmin(true)
}

},[])

function logout(){

localStorage.clear()
window.location.href="/"

}

async function handleScan(){

if(!url) return

setLoading(true)

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

console.log(data)

if(Array.isArray(data)){
setResult(data)
}

}catch(err){
console.log(err)
}

setLoading(false)

}

return(

<div className="min-h-screen flex flex-col items-center justify-center">

<h1 className="text-5xl text-white mb-6">
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

</div>

{loading && <ScanProgress progress={progress}/>}

{result.map((r,i)=>(
<div key={i}>
<p>{r.song}</p>
<p>{r.artist}</p>
</div>
))}

</div>

)

}