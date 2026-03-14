"use client"

import { useState,useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion,AnimatePresence } from "framer-motion"
import ScanProgress from "../../components/ScanProgress"

export default function Dashboard(){

const router = useRouter()

const [url,setUrl] = useState("")
const [loading,setLoading] = useState(false)
const [progress,setProgress] = useState(0)

const [user,setUser] = useState("")
const [plan,setPlan] = useState("trial")
const [credits,setCredits] = useState(0)
const [isAdmin,setIsAdmin] = useState(false)

const [result,setResult] = useState<any[]>([])
const [menuOpen,setMenuOpen] = useState(false)

const [showPlans,setShowPlans] = useState(false)
const [showNoCredits,setShowNoCredits] = useState(false)

useEffect(()=>{

const savedUser = localStorage.getItem("user")

if(!savedUser){
router.push("/")
return
}

setUser(savedUser)
loadUser(savedUser)

},[])

async function loadUser(email:string){

try{

const res = await fetch(
process.env.NEXT_PUBLIC_API_URL + "/login",
{
method:"POST",
headers:{
"Content-Type":"application/json"
},
body:JSON.stringify({
email,
password:""
})
})

const data = await res.json()

setPlan(data.plan || "trial")
setCredits(data.credits || 0)
setIsAdmin(data.admin || false)

}catch(e){
console.log(e)
}

}

function logout(){

localStorage.removeItem("session")
localStorage.removeItem("user")

router.push("/")

}

async function handleScan(){

if(!url || loading) return

setLoading(true)
setProgress(0)
setResult([])

let fakeProgress = 0

const interval = setInterval(()=>{

fakeProgress += 8

if(fakeProgress > 95) return

setProgress(fakeProgress)

},400)

try{

const apiUrl = process.env.NEXT_PUBLIC_API_URL

const res = await fetch(apiUrl + "/scan",{

method:"POST",

headers:{
"Content-Type":"application/json"
},

body:JSON.stringify({
url,
user
})

})

const data = await res.json()

if(data.error === "no_credits"){

setShowNoCredits(true)
setLoading(false)
return
}

if(Array.isArray(data)){
setResult(data)
}
else if(Array.isArray(data.results)){
setResult(data.results)
}
else{
setResult([])
}

if(plan !== "unlimited"){
setCredits((prev)=>Math.max(prev-1,0))
}

}catch(e){
console.log(e)
}

clearInterval(interval)

setProgress(100)

setTimeout(()=>{
setLoading(false)
},1200)

}

async function startCheckout(plan:string){

try{

const res = await fetch(
process.env.NEXT_PUBLIC_API_URL + "/create-paypal-order",
{
method:"POST",
headers:{
"Content-Type":"application/json"
},
body:JSON.stringify({ plan })
}
)

const data = await res.json()

if(!data.orderID){
alert("Payment error")
return
}

window.location.href =
"https://www.sandbox.paypal.com/checkoutnow?token=" + data.orderID

}catch(e){

console.log(e)
alert("Payment failed")

}

}

return(

<div className="w-full min-h-screen">

{/* TOP BAR */}

<div className="flex justify-between items-start px-10 pt-8">

<div className="flex flex-col gap-2">

<div className={`text-sm font-semibold px-3 py-1 rounded-md w-fit
${isAdmin
? "bg-yellow-400 text-black shadow-[0_0_15px_rgba(255,215,0,0.7)]"
: "text-[#14E6C3]"
}`}>

{isAdmin ? "ADMIN" : `Plan: ${plan}`}

</div>

<div className="text-xs text-gray-400">
Credits: {credits}
</div>

<button
onClick={()=>setShowPlans(true)}
className="bg-[#14E6C3] hover:bg-[#0FD4B5] text-black text-xs font-semibold px-4 py-1 rounded-md w-fit"
>
Upgrade Plan
</button>

</div>

<div className="relative">

<button
onClick={()=>setMenuOpen(!menuOpen)}
className="flex items-center gap-2 text-sm text-gray-300 hover:text-white border border-white/10 px-4 py-1 rounded-md"
>

{user}

<span className="text-xs opacity-70">▼</span>

</button>

{menuOpen && (

<div className="absolute right-0 mt-2 w-44 bg-[#111] border border-white/10 rounded-lg shadow-xl">

<button className="w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-[#1b1b1b]">
Settings
</button>

<button
onClick={()=>setShowPlans(true)}
className="w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-[#1b1b1b]"
>
Billing
</button>

<button
onClick={logout}
className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-[#1b1b1b]"
>
Logout
</button>

</div>

)}

</div>

</div>

{/* MAIN */}

<div className="w-full flex justify-center">

<div className="w-full max-w-5xl px-8 py-16">

<div className="text-center mb-14">

<h1 className="text-5xl font-semibold mb-3 bg-gradient-to-r from-white to-[#14E6C3] bg-clip-text text-transparent">
BeatSignal
</h1>

<p className="text-gray-400">
Detect stolen beats on YouTube
</p>

</div>

<div className="bg-[#0b0b0b]/70 backdrop-blur-md border border-[#14E6C3]/20 rounded-xl p-6 mb-8">

<div className="flex gap-4">

<input
placeholder="Paste YouTube link..."
value={url}
onChange={(e)=>setUrl(e.target.value)}
className="flex-1 bg-black/40 border border-white/10 text-white p-4 rounded-lg outline-none focus:border-[#14E6C3]"
/>

<button
onClick={handleScan}
disabled={loading}
className={`px-6 rounded-lg font-semibold flex items-center gap-2 transition
${loading
? "bg-gray-600 cursor-not-allowed"
: "bg-[#14E6C3] hover:bg-[#0FD4B5] text-black"
}`}
>

{loading && (

<motion.div
animate={{rotate:360}}
transition={{repeat:Infinity,duration:1,ease:"linear"}}
className="w-4 h-4 border-2 border-black border-t-transparent rounded-full"
/>

)}

{loading ? "Scanning..." : "Scan"}

</button>

</div>

</div>

{loading && (

<div className="mb-12">
<ScanProgress progress={progress}/>
</div>

)}

{!loading && result.length > 0 && (

<div className="mt-12 space-y-6">

<h2 className="text-2xl font-semibold text-white">
Matches Found
</h2>

{result.map((match,i)=>(

<div
key={i}
className="bg-[#0b0b0b]/70 border border-white/10 rounded-xl p-6 flex gap-6"
>

{match.cover && (

<img
src={match.cover}
className="w-24 h-24 rounded-lg object-cover"
/>

)}

<div className="flex flex-col gap-1">

<p className="text-white font-semibold text-lg">
{match.song}
</p>

<p className="text-gray-400">
{match.artist}
</p>

<p className="text-sm text-gray-500">
Confidence: {match.score}
</p>

<p className="text-xs text-gray-500">
ISRC: {match.isrc}
</p>

<p className="text-xs text-gray-500">
Release date: {match.release_date}
</p>

<a
href={match.spotify_url}
target="_blank"
className="text-sm text-[#14E6C3] hover:underline mt-2"
>
Open on Spotify
</a>

</div>

</div>

))}

</div>

)}

</div>

</div>

</div>

)

}