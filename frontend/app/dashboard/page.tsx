"use client"

import { useState,useEffect } from "react"
import { useRouter } from "next/navigation"
import TopBar from "@/components/TopBar"
import { getToken } from "@/lib/auth"

export default function Dashboard(){

const router = useRouter()

const [url,setUrl] = useState("")
const [results,setResults] = useState<any[]>([])
const [history,setHistory] = useState<any[]>([])
const [loading,setLoading] = useState(false)
const [progress,setProgress] = useState(0)
const [authChecked,setAuthChecked] = useState(false)
const [message,setMessage] = useState("")

const [credits,setCredits] = useState(0)

/* AUTH CHECK */

useEffect(()=>{

const token = getToken()

if(!token){
router.replace("/")
return
}

setAuthChecked(true)

loadHistory()
loadUser()

},[])



/* LOAD USER INFO */

async function loadUser(){

const token = getToken()

const res = await fetch(
`${process.env.NEXT_PUBLIC_API_URL}/user-info`,
{
method:"POST",
headers:{ "Content-Type":"application/json"},
body:JSON.stringify({token})
}
)

const data = await res.json()

if(data.success){
setCredits(data.credits)
}

}



/* LOAD HISTORY */

async function loadHistory(){

const token = getToken()

if(!token) return

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

if(data.success){
setHistory(data.results || [])
}

}catch(e){

console.log("history error",e)

}

}



/* PROGRESS */

useEffect(()=>{

let interval:any

if(loading){

setProgress(0)

interval=setInterval(()=>{

setProgress(prev=>{
if(prev>=95) return prev
return prev+3
})

},350)

}

return ()=>clearInterval(interval)

},[loading])



/* HANDLE SCAN */

async function handleScan(){

if(loading) return

if(!url.includes("youtube.com") && !url.includes("youtu.be")){
setMessage("Please enter a valid YouTube URL")
return
}

const token = getToken()

if(!token){
router.replace("/")
return
}

setLoading(true)
setResults([])
setMessage("")

try{

const res = await fetch(
`${process.env.NEXT_PUBLIC_API_URL}/scan`,
{
method:"POST",
headers:{ "Content-Type":"application/json"},
body:JSON.stringify({url,token})
}
)

const data = await res.json()

setProgress(100)

if(data.error){
setMessage(data.error)
setLoading(false)
return
}

if(data.results && data.results.length > 0){

setResults(data.results)

}else{

setMessage("No matches found")

}

await loadHistory()
await loadUser()

}catch(e){

console.error(e)
setMessage("Scan error")

}

setLoading(false)

}



/* PROGRESS MESSAGE */

function progressMessage(){

if(progress < 20) return `Initializing scan engine... ${progress}%`
if(progress < 40) return `Searching global music indexes... ${progress}%`
if(progress < 60) return `Analyzing patterns with AI... ${progress}%`
if(progress < 80) return `Matching tracks worldwide... ${progress}%`
if(progress < 100) return `Finalizing results... ${progress}%`

return `Scan complete`

}



if(!authChecked) return null



return(

<div className="flex flex-col flex-1">

<TopBar/>

<div className="w-full flex flex-col items-center px-6 pt-16">

<h1 className="text-6xl font-semibold mb-3 tracking-tight bg-gradient-to-r from-white to-[#14E6C3] bg-clip-text text-transparent drop-shadow-[0_0_30px_rgba(20,230,195,0.45)]">
BeatSignal
</h1>

<p className="text-sm text-white/60 mb-10">
Detect stolen beats on YouTube
</p>



{/* STATS BAR */}

<div className="grid grid-cols-3 gap-6 w-full max-w-5xl mb-10">

<div className="bg-black/40 border border-white/10 rounded-xl p-4 text-center backdrop-blur-xl">
<p className="text-white/50 text-xs">Scans Today</p>
<p className="text-xl font-semibold text-white">{history.length}</p>
</div>

<div className="bg-black/40 border border-white/10 rounded-xl p-4 text-center backdrop-blur-xl">
<p className="text-white/50 text-xs">Detections</p>
<p className="text-xl font-semibold text-white">{history.length}</p>
</div>

<div className="bg-black/40 border border-white/10 rounded-xl p-4 text-center backdrop-blur-xl">
<p className="text-white/50 text-xs">Credits</p>
<p className="text-xl font-semibold text-white">{credits}</p>
</div>

</div>



{/* SEARCH */}

<div className="w-full max-w-5xl">

<div className="relative">

<div className="absolute inset-0 bg-[#14E6C3] opacity-20 blur-3xl rounded-xl"></div>

<div className="relative bg-black/50 border border-white/10 backdrop-blur-xl rounded-xl flex p-2">

<input
value={url}
onChange={(e)=>setUrl(e.target.value)}
placeholder="Paste YouTube link"
disabled={loading}
className="flex-1 bg-black/40 border border-white/10 rounded-lg px-4 py-2.5 text-white outline-none focus:border-[#14E6C3]"
/>

<button
onClick={handleScan}
disabled={loading}
className="ml-3 px-8 py-2.5 rounded-lg font-medium bg-[#14E6C3] text-black hover:scale-105 transition"
>
{loading ? "Scanning..." : "Scan"}
</button>

</div>

</div>

</div>



{/* PROGRESS */}

{loading &&(

<div className="w-full max-w-5xl mt-8">

<div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">

<div
style={{width:`${progress}%`}}
className="h-full bg-[#14E6C3] transition-all duration-500"
/>

</div>

<p className="text-white/50 text-sm mt-2">
{progressMessage()}
</p>

</div>

)}



{/* RESULTS */}

{results.length>0 &&(

<div className="mt-12 w-full max-w-5xl grid gap-4 pb-20">

<h2 className="text-white/70 text-sm uppercase tracking-wider">
Scan Results
</h2>

{results.map((r,i)=>{

const confidence=Math.min(Math.round(r.score || 0),100)

return(

<div
key={i}
className="bg-black/40 border border-white/10 rounded-xl p-5 backdrop-blur-xl"
>

<h2 className="text-lg text-white font-semibold">
{r.song}
</h2>

<p className="text-white/60 text-sm">
{r.artist}
</p>

<div className="mt-3 w-full h-2 bg-white/10 rounded-full">

<div
style={{width:`${confidence}%`}}
className="h-full bg-[#14E6C3]"
/>

</div>

<p className="text-xs text-white/40 mt-1">
Confidence {confidence}%
</p>

</div>

)

})}

</div>

)}

</div>

</div>

)

}