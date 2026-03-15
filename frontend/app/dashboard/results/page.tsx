"use client"

import { useEffect,useState } from "react"
import { useRouter } from "next/navigation"
import TopBar from "@/components/TopBar"
import { getToken,clearSession } from "@/lib/auth"

export default function Results(){

const router = useRouter()

const [history,setHistory] = useState<any[]>([])
const [loading,setLoading] = useState(true)



useEffect(()=>{

const token = getToken()

if(!token){
router.replace("/")
return
}

loadHistory()

},[])



async function loadHistory(){

const token = getToken()

try{

const res = await fetch(
`${process.env.NEXT_PUBLIC_API_URL}/scan-history`,
{
method:"POST",
headers:{ "Content-Type":"application/json"},
body:JSON.stringify({token})
}
)

const data = await res.json()

if(data.error === "invalid_token"){

clearSession()
router.replace("/")
return

}

if(data.success){

setHistory(data.results || [])

}

}catch(e){

console.error("history error",e)

}

setLoading(false)

}



return(

<div className="flex flex-col flex-1">

<TopBar/>

<div className="w-full flex flex-col items-center px-6 pt-16">

<h1 className="text-4xl font-semibold text-white mb-10">
Scan History
</h1>



{loading &&(

<p className="text-white/60">
Loading results...
</p>

)}



{!loading && history.length === 0 &&(

<p className="text-white/60">
No scans yet
</p>

)}



{history.length > 0 &&(

<div className="w-full max-w-5xl grid gap-4">

{history.map((r,i)=>(

<div
key={i}
className="bg-black/40 border border-white/10 rounded-xl p-5 backdrop-blur-xl"
>

<h2 className="text-lg text-white font-semibold">
{r.title}
</h2>

<p className="text-white/60 text-sm">
{r.artist}
</p>

<a
href={r.url}
target="_blank"
className="text-[#14E6C3] text-sm mt-1 inline-block"
>
Open YouTube
</a>

<p className="text-xs text-white/40 mt-2">
Detected: {new Date(r.date).toLocaleDateString()}
</p>

</div>

))}

</div>

)}

</div>

</div>

)

}