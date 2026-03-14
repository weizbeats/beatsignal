"use client"

import {useState} from "react"

export default function Debug(){

const [url,setUrl] = useState("")
const [logs,setLogs] = useState([])
const [loading,setLoading] = useState(false)

async function runDebug(){

setLoading(true)

setLogs([])

const r = await fetch(
"https://beatsignal-production.up.railway.app/debug-scan",
{
method:"POST",
headers:{
"Content-Type":"application/json"
},
body:JSON.stringify({url})
}
)

const data = await r.json()

setLogs(data.logs)

setLoading(false)

}

return(

<div style={{padding:40}}>

<h1>BeatSignal Debug Scanner</h1>

<input
value={url}
onChange={(e)=>setUrl(e.target.value)}
placeholder="youtube url"
/>

<button onClick={runDebug}>
Run Debug
</button>

<div style={{marginTop:20}}>

{logs.map((l,i)=>(
<div key={i}>{l}</div>
))}

</div>

</div>

)

}