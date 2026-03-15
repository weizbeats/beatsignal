"use client"

import { useEffect,useState } from "react"
import TopBar from "@/components/TopBar"
import { getToken } from "@/lib/auth"
import { useRouter } from "next/navigation"

export default function CatalogPage(){

const router = useRouter()

const [tracks,setTracks] = useState([])

useEffect(()=>{

loadTracks()

},[])

async function loadTracks(){

const token = getToken()

if(!token){
router.replace("/")
return
}

const res = await fetch(
`${process.env.NEXT_PUBLIC_API_URL}/catalog`,
{
method:"POST",
headers:{ "Content-Type":"application/json"},
body:JSON.stringify({token})
}
)

const data = await res.json()

if(data.success){
setTracks(data.tracks)
}

}

return(

<div className="flex flex-col flex-1">

<TopBar/>

<div className="w-full flex flex-col items-center px-6 pt-16">

<h1 className="text-5xl font-semibold mb-10 bg-gradient-to-r from-white to-[#14E6C3] bg-clip-text text-transparent">
Catalog
</h1>

<div className="w-full max-w-6xl">

<table className="w-full text-left">

<thead className="border-b border-white/10 text-white/60 text-sm">

<tr>
<th>Beat</th>
<th>Artist</th>
<th>Last Scan</th>
<th>Autopilot</th>
<th>Link</th>
</tr>

</thead>

<tbody>

{tracks.map((r,i)=>(

<tr key={i} className="border-b border-white/5">

<td className="text-white">{r.title}</td>
<td className="text-white/60">{r.artist}</td>

<td className="text-white/50 text-sm">
{r.last_scan}
</td>

<td>
<span className="bg-[#14E6C3]/10 text-[#14E6C3] px-2 py-1 rounded text-xs">
{r.autopilot ? "ON" : "OFF"}
</span>
</td>

<td>
<a href={r.url} target="_blank" className="text-[#14E6C3] text-sm">
Open
</a>
</td>

</tr>

))}

</tbody>

</table>

</div>

</div>

</div>

)

}