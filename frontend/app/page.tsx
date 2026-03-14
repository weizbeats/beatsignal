"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import ScanProgress from "../components/ScanProgress"

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

useEffect(()=>{

const token = localStorage.getItem("token")
const savedUser = localStorage.getItem("user")

if(!token || !savedUser){
window.location.href = "/"
return
}

setUser(savedUser)

if(savedUser === "weizbeat@gmail.com"){
setIsAdmin(true)
setPlan("admin")
setCredits(-1)
}

},[])

function logout(){

localStorage.removeItem("token")
localStorage.removeItem("user")

window.location.href = "/"

}

async function handleScan(){

if(!url || loading) return

const token = localStorage.getItem("token")

if(!token){
logout()
return
}

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
url:url,
token:token
})

})

const data = await res.json()

console.log("SCAN RESULTS:",data)

if(data.error === "invalid_token"){
logout()
return
}

if(data.error === "no_credits"){
alert("No credits left")
router.push("/plans")
setLoading(false)
return
}

if(Array.isArray(data)){
setResult(data)
}
else if(data && Array.isArray(data.results)){
setResult(data.results)
}
else{
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

<div className="flex justify-between items-start px-10 pt-8">

<div className="flex flex-col gap-2">

<div className={`text-sm font-semibold px-3 py-1 rounded-md w-fit
${isAdmin ? "bg-yellow-400 text-black" : "text-[#14E6C3]"}`}>

{isAdmin ? "ADMIN" : `Plan: ${plan}`}

</div>

<div className="text-xs text-gray-400">
{isAdmin ? "Unlimited scans" : `Credits: ${credits}`}
</div>

<button
onClick={()=>router.push("/plans")}
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

<AnimatePresence>

{menuOpen && (

<motion.div
initial={{opacity:0,y:-10}}
animate={{opacity:1,y:0}}
exit={{opacity:0,y:-10}}
className="absolute right-0 mt-2 w-44 bg-[#111] border border-white/10 rounded-lg shadow-xl"
>

<button
onClick={logout}
className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-[#1b1b1b]"
>
Logout
</button>

</motion.div>

)}

</AnimatePresence>

</div>

</div>

<div className="w-full flex justify-center">

<div className="w-full max-w-5xl px-8 py-16">

<div className="text-center mb-16">

<h1 className="text-5xl font-semibold mb-3 bg-gradient-to-r from-white via-[#14E6C3] to-emerald-400 bg-clip-text text-transparent">
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
className={`px-6 rounded-lg font-semibold transition
${loading
? "bg-gray-600 cursor-not-allowed"
: "bg-[#14E6C3] hover:bg-[#0FD4B5] text-black"
}`}
>

{loading ? "Scanning..." : "Scan"}

</button>

</div>

</div>

{loading && (
<div className="mb-12">
<ScanProgress progress={progress}/>
</div>
)}

{result.length > 0 && (

<div className="mt-10 space-y-4">

<h2 className="text-xl text-white mb-4">
Matches found
</h2>

{result.map((r,i)=>(

<div
key={i}
className="bg-[#0b0b0b]/70 border border-[#14E6C3]/20 p-4 rounded-lg"
>

<div className="text-lg font-semibold text-white">
{r.song || "Unknown song"}
</div>

<div className="text-gray-400 text-sm">
{r.artist || "Unknown artist"}
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