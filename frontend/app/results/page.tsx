"use client"

import { useEffect,useState } from "react"
import TopBar from "@/components/TopBar"
import { getToken } from "@/lib/auth"
import { useRouter } from "next/navigation"

export default function ResultsPage(){

const router = useRouter()

const [results,setResults] = useState<any[]>([])
const [search,setSearch] = useState("")

useEffect(()=>{

loadResults()

},[])

async function loadResults(){

const token = getToken()

if(!token){
router.replace("/")
return
}

const res = await fetch(
`${process.env.NEXT_PUBLIC_API_URL}/scan-history`,
{
method:"POST",
headers:{ "Content-Type":"application/json"},
body:JSON.stringify({token})
}
)

const data = await res.json()

if(data.success){

setResults(data.results)

}

}

const filtered = results.filter((r:any)=>{

const text = (
(r.title || "") +
(r.artist || "")
).toLowerCase()

return text.includes(search.toLowerCase())

})

return(

<div className="flex flex-col flex-1">

<TopBar/>

<div className="w-full flex flex-col items-center px-6 pt-16">

<h1 className="text-6xl font-semibold mb-10 tracking-tight bg-gradient-to-r from-white to-[#14E6C3] bg-clip-text text-transparent drop-shadow-[0_0_30px_rgba(20,230,195,0.45)]">
Results
</h1>

{/* SEARCH */}

<input
placeholder="Search by song or artist"
value={search}
onChange={(e)=>setSearch(e.target.value)}
className="w-full max-w-3xl bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white mb-10"
/>

{/* RESULTS */}

<div className="w-full max-w-5xl grid gap-4">

{filtered.map((r:any,i:number)=>{

return(

<div
key={i}
className="bg-black/40 border border-white/10 rounded-xl p-5 backdrop-blur-xl flex justify-between items-center"
>

<div>

<h2 className="text-white font-semibold">
{r.title}
</h2>

<p className="text-white/50 text-sm">
{r.artist}
</p>

</div>

<div>

<a
href={r.url}
target="_blank"
className="text-[#14E6C3]"
>
Open Video
</a>

</div>

<div className="text-white/40 text-sm">

{new Date(r.date).toLocaleString()}

</div>

</div>

)

})}

</div>

</div>

</div>

)

}