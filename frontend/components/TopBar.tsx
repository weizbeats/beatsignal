"use client"

import { useState,useRef,useEffect } from "react"
import { useRouter,usePathname } from "next/navigation"
import { clearSession } from "@/lib/auth"

export default function TopBar(){

const router = useRouter()
const pathname = usePathname()

const [open,setOpen]=useState(false)
const ref=useRef<any>(null)

const user =
typeof window!=="undefined"
?localStorage.getItem("user")||"user"
:"user"

/* LOCAL STORAGE PLAN */

const [plan,setPlan] = useState("free")
const [admin,setAdmin] = useState(false)

useEffect(()=>{

const p = localStorage.getItem("plan")
const a = localStorage.getItem("admin")

if(p) setPlan(p)
if(a==="true") setAdmin(true)

},[])

function logout(){
clearSession()
router.replace("/")
}

useEffect(()=>{

function handleClick(e:any){
if(ref.current && !ref.current.contains(e.target)){
setOpen(false)
}
}

document.addEventListener("mousedown",handleClick)
return()=>document.removeEventListener("mousedown",handleClick)

},[])



/* PLAN STYLE */

function planStyle(){

if(admin){
return "bg-gradient-to-r from-yellow-400 to-yellow-500 text-black shadow-[0_0_12px_rgba(255,200,0,0.6)]"
}

switch(plan){

case "starter":
return "bg-blue-500/90 text-white shadow-[0_0_12px_rgba(80,140,255,0.5)]"

case "studio":
return "bg-purple-500/90 text-white shadow-[0_0_12px_rgba(180,80,255,0.5)]"

case "pro":
return "bg-[#14E6C3] text-black shadow-[0_0_14px_rgba(20,230,195,0.6)]"

default:
return "bg-gray-500/80 text-white"

}

}

function planLabel(){

if(admin) return "ADMIN"

switch(plan){

case "starter":
return "STARTER"

case "studio":
return "STUDIO"

case "pro":
return "PRO"

default:
return "FREE"

}

}

function planSubtitle(){

if(admin) return "Unlimited scans"
if(plan==="pro") return "Unlimited scans"

return "Limited scans"

}

function navStyle(route:string){

return `text-sm font-medium transition ${
pathname === route
? "text-[#14E6C3] drop-shadow-[0_0_10px_rgba(20,230,195,0.6)]"
: "text-white/50 hover:text-white"
}`

}



return(

<div className="w-full flex items-start justify-between px-16 pt-4">


{/* LEFT PLAN */}

<div className="flex flex-col items-start gap-1">

<span
className={`text-xs font-semibold px-4 py-1 rounded-md transition duration-300 hover:scale-105 ${planStyle()}`}
>
{planLabel()}
</span>

<p className="text-sm text-white/60">
{planSubtitle()}
</p>

</div>



{/* CENTER NAVIGATION */}

<div className="flex items-center gap-10 mt-1">

<button
onClick={()=>router.push("/dashboard")}
className={navStyle("/dashboard")}
>
Dashboard
</button>

<button
onClick={()=>router.push("/results")}
className={navStyle("/results")}
>
Results
</button>

</div>



{/* USER MENU */}

<div ref={ref} className="relative">

<button
onClick={()=>setOpen(!open)}
className="flex items-center gap-2 bg-black/40 border border-white/10 px-4 py-1.5 rounded-md text-sm hover:border-[#14E6C3] transition"
>

<span className="text-gray-200">
{user}
</span>

<span className={`transition ${open?"rotate-180":""}`}>
▼
</span>

</button>

{open &&(

<div className="absolute right-0 mt-2 w-44 bg-black/40 backdrop-blur-xl border border-white/10 rounded-lg">

<button
onClick={()=>router.push("/results")}
className="w-full text-left px-4 py-2 text-sm text-white hover:bg-white/5"
>
Results
</button>

<button
onClick={logout}
className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-white/5"
>
Logout
</button>

</div>

)}

</div>

</div>

)

}