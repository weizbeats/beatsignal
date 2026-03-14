"use client"

import { useState } from "react"

export default function DebugPage(){

const [logs,setLogs] = useState<string[]>([])
const [loading,setLoading] = useState(false)

async function runDebug(){

setLogs([])
setLoading(true)

function log(msg:string){
setLogs(prev => [...prev,msg])
}

log("Starting system diagnostic...")

try{

log("Testing backend connection")

const start = Date.now()

const r = await fetch(
"https://beatsignal-production.up.railway.app/scan",
{
method:"POST",
headers:{
"Content-Type":"application/json"
},
body:JSON.stringify({
url:"https://www.youtube.com/watch?v=jNQXAC9IVRw"
})
}
)

const time = Date.now() - start

log("Backend responded")

log("Status: "+r.status)

log("Response time: "+time+"ms")

const data = await r.json()

log("Response received")

log("Response size: "+JSON.stringify(data).length+" bytes")

}catch(e:any){

log("ERROR: "+e.message)

}

setLoading(false)

}

return(

<div style={{padding:40}}>

<h1>BeatSignal System Diagnostic</h1>

<button onClick={runDebug}>
Run Scan Test
</button>

<div style={{marginTop:20}}>

{logs.map((l,i)=>(
<div key={i}>{l}</div>
))}

</div>

</div>

)

}