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

<h1 className="text-5xl font-semibold mb-10 tracking-tight bg-gradient-to-r from-white to-[#14E6C3] bg-clip-text text-transparent">
Results
</h1>


<input
placeholder="Search by song or artist"
value={search}
onChange={(e)=>setSearch(e.target.value)}
className="w-full max-w-3xl bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white mb-10"
/>


<div className="w-full max-w-6xl">

<table className="w-full text-left">

<thead className="border-b border-white/10 text-white/60 text-sm">

<tr>

<th className="py-3">Cover</th>
<th>Song</th>
<th>Artist</th>
<th>Release</th>
<th>Match</th>
<th>Usage</th>

</tr>

</thead>

<tbody>

{filtered.map((r:any,i:number)=>{

return(

<tr
key={i}
className="border-b border-white/5 hover:bg-white/5 transition"
>

<td className="py-4">

{r.cover &&(

<img
src={r.cover}
className="w-12 h-12 rounded"
/>

)}

</td>

<td className="font-medium text-white">
{r.title || "Unknown"}
</td>

<td className="text-white/60">
{r.artist || "-"}
</td>

<td className="text-white/50 text-sm">
{r.release_date || "-"}
</td>

<td className="text-[#14E6C3] text-sm">

{r.score ? `${r.score}%` : "-"}

</td>

<td>

<a
href={r.url}
target="_blank"
className="text-[#14E6C3] text-sm hover:underline"
>

View usage

</a>

</td>

</tr>

)

})}

</tbody>

</table>

</div>

</div>

</div>

)

}