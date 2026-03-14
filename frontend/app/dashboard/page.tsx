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
const [result,setResult] = useState<any[]>([])
const [menuOpen,setMenuOpen] = useState(false)

const [showPlans,setShowPlans] = useState(false)
const [billing,setBilling] = useState("monthly")

useEffect(()=>{

const savedUser = localStorage.getItem("user")

if(savedUser){
setUser(savedUser)
}

},[])

function logout(){

localStorage.removeItem("session")
localStorage.removeItem("user")

router.push("/login")

}

async function handleScan(){

if(!url) return

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
body:JSON.stringify({url})
})

const data = await res.json()

console.log("SCAN RESULT:",data)

if(Array.isArray(data)){
setResult(data)
}else if(data.results){
setResult(data.results)
}else{
setResult([])
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

return(

<div className="w-full min-h-screen">

{/* MODAL */}

<AnimatePresence>

{showPlans && (

<motion.div
initial={{opacity:0}}
animate={{opacity:1}}
exit={{opacity:0}}
className="fixed inset-0 bg-black/40 backdrop-blur-md flex items-center justify-center z-50"
>

<motion.div
initial={{scale:0.9,opacity:0}}
animate={{scale:1,opacity:1}}
exit={{scale:0.9,opacity:0}}
transition={{duration:0.25}}
className="w-full max-w-6xl px-10"
>

<h2 className="text-4xl text-white text-center mb-3 font-semibold">
Pricing
</h2>

<p className="text-center text-gray-400 mb-8">
Choose the plan that fits your needs
</p>

<div className="grid md:grid-cols-3 gap-8">

<div className="bg-white/5 border border-white/10 rounded-2xl p-8 text-center backdrop-blur-lg">

<h3 className="text-5xl font-bold text-white mb-2">
50
</h3>

<p className="text-gray-400 mb-4">
monthly scans
</p>

<p className="text-white font-semibold text-lg mb-6">
$2.49 / month
</p>

<button className="w-full bg-white text-black py-3 rounded-lg font-semibold hover:scale-105 transition">
Subscribe
</button>

</div>

<div className="bg-white/5 border border-[#14E6C3] rounded-2xl p-8 text-center shadow-[0_0_40px_rgba(20,230,195,0.35)] backdrop-blur-lg">

<h3 className="text-5xl font-bold text-white mb-2">
100
</h3>

<p className="text-gray-400 mb-4">
monthly scans
</p>

<p className="text-white font-semibold text-lg mb-6">
$4.99 / month
</p>

<button className="w-full bg-[#14E6C3] text-black py-3 rounded-lg font-semibold hover:scale-105 transition">
Subscribe
</button>

</div>

<div className="bg-white/5 border border-white/10 rounded-2xl p-8 text-center backdrop-blur-lg">

<h3 className="text-5xl font-bold text-white mb-2">
Unlimited
</h3>

<p className="text-gray-400 mb-4">
Unlimited scans
</p>

<p className="text-white font-semibold text-lg mb-6">
$9.99 / month
</p>

<button className="w-full bg-white text-black py-3 rounded-lg font-semibold hover:scale-105 transition">
Subscribe
</button>

</div>

</div>

<div className="flex justify-center mt-12">

<button
onClick={()=>setShowPlans(false)}
className="text-gray-400 hover:text-white"
>
Close
</button>

</div>

</motion.div>

</motion.div>

)}

</AnimatePresence>


{/* TOP BAR */}

<div className="flex justify-between items-start px-10 pt-8">

<div className="flex flex-col gap-2">

<div className="text-sm text-[#14E6C3] font-medium">
Plan: Free
</div>

<button
onClick={()=>setShowPlans(true)}
className="bg-[#14E6C3] hover:bg-[#0FD4B5] text-black text-xs font-semibold px-4 py-1 rounded-md w-fit transition hover:scale-105"
>
Update Plan
</button>

</div>

<div className="relative">

<button
onClick={()=>setMenuOpen(!menuOpen)}
className="flex items-center gap-2 text-sm text-gray-300 hover:text-white border border-white/10 px-4 py-1 rounded-md transition"
>

{user}

<span className="text-xs opacity-70">
▼
</span>

</button>

{menuOpen && (

<div className="absolute right-0 mt-2 w-44 bg-[#111] border border-white/10 rounded-lg shadow-xl overflow-hidden">

<button className="w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-[#1b1b1b]">
Settings
</button>

<button className="w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-[#1b1b1b]">
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

<div className="relative bg-[#0b0b0b]/70 backdrop-blur-md border border-[#14E6C3]/20 rounded-xl p-6 mb-8 shadow-[0_0_40px_rgba(20,230,195,0.08)]">

<div className="flex gap-4">

<input
placeholder="Paste YouTube link..."
value={url}
onChange={(e)=>setUrl(e.target.value)}
className="flex-1 bg-black/40 border border-white/10 text-white p-4 rounded-lg outline-none focus:border-[#14E6C3]"
/>

<button
onClick={handleScan}
className="bg-[#14E6C3] hover:bg-[#0FD4B5] text-black font-semibold px-6 rounded-lg"
>
Scan
</button>

</div>

</div>

{loading && (

<div className="mb-12">
<ScanProgress progress={progress}/>
</div>

)}

{/* RESULTS */}

{result.length > 0 && (

<div className="grid md:grid-cols-2 gap-6 mt-10">

{result.map((track:any,index:number)=>(

<div
key={index}
className="flex gap-4 bg-black/40 border border-white/10 rounded-xl p-4 hover:border-[#14E6C3]"
>

<img
src={track.cover}
className="w-20 h-20 rounded-lg object-cover"
/>

<div className="flex flex-col justify-between flex-1">

<div>

<h3 className="text-white font-semibold">
{track.song}
</h3>

<p className="text-gray-400 text-sm">
{track.artist}
</p>

</div>

<div className="text-xs text-gray-500 mt-2">

<p>
Release: {track.release_date}
</p>

<p>
ISRC: {track.isrc}
</p>

</div>

</div>

<a
href={track.spotify_url}
target="_blank"
className="flex items-center justify-center bg-[#1DB954] hover:bg-[#1ed760] px-3 rounded-lg text-black text-sm font-semibold"
>
Spotify
</a>

</div>

))}

</div>

)}

</div>

</div>

</div>

)

}