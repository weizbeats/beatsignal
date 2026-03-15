"use client"

import { useEffect,useState } from "react"
import { getToken, clearSession } from "@/lib/auth"
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

setResults(data.results || [])

}

}catch(e){

console.log("results error",e)

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

<div style={{padding:"40px"}}>

<h2 style={{marginBottom:"20px"}}>Results</h2>

<input
placeholder="Search by song or artist"
value={search}
onChange={(e)=>setSearch(e.target.value)}
style={{
marginBottom:"30px",
width:"500px",
padding:"12px",
background:"#0b0b0b",
border:"1px solid #222",
color:"#fff",
borderRadius:"6px"
}}
/>

<table
style={{
width:"100%",
borderCollapse:"collapse"
}}
>

<thead>

<tr style={{
borderBottom:"1px solid #222",
textAlign:"left"
}}>
<th>Song</th>
<th>Artist</th>
<th>Video</th>
<th>Date</th>
</tr>

</thead>

<tbody>

{filtered.map((r:any,i:number)=>{

return(

<tr key={i} style={{borderBottom:"1px solid #111"}}>

<td style={{padding:"14px 0"}}>
{r.title}
</td>

<td>
{r.artist}
</td>

<td>

<a
href={r.url}
target="_blank"
style={{color:"#14E6C3"}}
>
Open Video
</a>

</td>

<td>
{new Date(r.date).toLocaleString()}
</td>

</tr>

)

})}

</tbody>

</table>

</div>

)

}