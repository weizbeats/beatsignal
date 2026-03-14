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

useEffect(()=>{

const token = localStorage.getItem("token")
const savedUser = localStorage.getItem("user")

if(!token || !savedUser){
router.push("/")
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

localStorage.removeItem("session")
localStorage.removeItem("user")
localStorage.removeItem("token")

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
const token = localStorage.getItem("token")

const res = await fetch(apiUrl + "/scan",{

method:"POST",

headers:{
"Content-Type":"application/json"
},

body:JSON.stringify({
url,
token
})

})

const data = await res.json()

if(data.error === "invalid_token"){
logout()
return
}

if(data.error === "no_credits"){
alert("No credits left")
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

{/* TOP BAR */}

<div className="flex justify-between items-start px-10 pt-8">

{/* LEFT PANEL */}

<div className="flex flex-col gap-2">

<div className={`text-sm font-semibold px-3 py-1 rounded-md w-fit
${isAdmin
? "bg-yellow-400 text-black shadow-[0_0_20px_rgba(255,215,0,0.7)]"
: "text-[#14E6C3]"
}`}>

{isAdmin ? "ADMIN" : `Plan: ${plan}`}

</div>

<div className="text-xs text-gray-400">
{isAdmin ? "Unlimited scans" : `Credits: ${credits}`}
</div>

<button
className="bg-[#14E6C3] hover:bg-[#0FD4B5] text-black text-xs font-semibold px-4 py-1 rounded-md w-fit"
>
Upgrade Plan
</button>

</div>


{/* USER MENU */}

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

<button className="w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-[#1b1b1b]">
Account
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

</motion.div>

)}

</AnimatePresence>

</div>

</div>


{/* MAIN */}

<div className="w-full flex justify-center">

<div className="w-full max-w-5xl px-8 py-16">

{/* LOGO SECTION */}

<div className="text-center mb-16 flex flex-col items-center">

<h1 className="text-5xl font-semibold mb-3 bg-gradient-to-r from-white via-[#14E6C3] to-emerald-400 bg-clip-text text-transparent
drop-shadow-[0_0_6px_rgba(20,230,195,0.25)]
animate-pulse">

BeatSignal

</h1>

<p className="text-gray-400">
Detect stolen beats on YouTube
</p>

</div>


{/* SEARCH */}

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

</div>

</div>

</div>

)

}