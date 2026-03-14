"use client"

import { useState,useRef,useEffect } from "react"

export default function TopBar(){

const [open,setOpen] = useState(false)
const ref = useRef<HTMLDivElement>(null)

const user =
typeof window !== "undefined"
? localStorage.getItem("user") || "user"
: "user"

const plan = "ADMIN"
const credits = "Unlimited scans"

function logout(){
localStorage.clear()
window.location.href="/"
}

useEffect(()=>{

function handleClick(e:any){
if(ref.current && !ref.current.contains(e.target)){
setOpen(false)
}
}

document.addEventListener("mousedown",handleClick)

return ()=>document.removeEventListener("mousedown",handleClick)

},[])

return(

<div className="flex justify-between items-start mb-10 px-4">

{/* LEFT SIDE */}

<div className="flex flex-col gap-2">

<span className="
bg-gradient-to-r
from-yellow-400
to-yellow-500
text-black
text-xs
font-semibold
px-3 py-1
rounded-md
shadow-[0_0_10px_rgba(255,200,0,0.5)]
w-fit
">
{plan}
</span>

<p className="text-sm text-white/60">
{credits}
</p>

<button className="
bg-[#14E6C3]
text-black
text-sm
px-3 py-1
rounded-md
w-fit
hover:scale-105
hover:shadow-[0_0_12px_rgba(20,230,195,0.6)]
transition
">
Upgrade Plan
</button>

</div>


{/* RIGHT SIDE */}

<div ref={ref} className="relative flex items-center gap-3">

<button
onClick={()=>setOpen(!open)}
className="
flex items-center
gap-2
bg-black/40
border border-white/10
px-3 py-1
rounded-md
text-sm
hover:border-[#14E6C3]
transition
"
>

<div className="w-8 h-8 bg-[#14E6C3]/60 rounded-full"></div>

<span className="text-gray-300">
{user}
</span>

</button>


{/* DROPDOWN */}

{open && (

<div className="
absolute
right-0
top-10
w-44
bg-black/40
backdrop-blur-xl
border border-white/10
rounded-lg
shadow-lg
overflow-hidden
animate-fade
">

<button className="w-full text-left px-4 py-2 hover:bg-white/5 text-sm">
Billing
</button>

<button className="w-full text-left px-4 py-2 hover:bg-white/5 text-sm">
Account
</button>

<button
onClick={logout}
className="w-full text-left px-4 py-2 hover:bg-white/5 text-sm text-red-400"
>
Logout
</button>

</div>

)}

</div>

</div>

)

}