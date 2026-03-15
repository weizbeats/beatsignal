"use client"

import { useState,useRef,useEffect } from "react"
import { useRouter } from "next/navigation"
import { clearSession } from "@/lib/auth"

export default function TopBar(){

const router = useRouter()

const [open,setOpen]=useState(false)
const ref=useRef<any>(null)

const user =
typeof window!=="undefined"
?localStorage.getItem("user")||"user"
:"user"


/* ROLE DETECTION */

let role="free"

if(user==="weizbeat@gmail.com"){
role="admin"
}



/* LOGOUT */

function logout(){

clearSession()

router.replace("/")

}


/* CLICK OUTSIDE */

useEffect(()=>{

function handleClick(e:any){

if(ref.current && !ref.current.contains(e.target)){
setOpen(false)
}

}

document.addEventListener("mousedown",handleClick)

return()=>document.removeEventListener("mousedown",handleClick)

},[])



return(

<div className="w-full flex justify-between items-start px-16 pt-4 relative">


{/* ROLE BADGE CENTER */}

<div className="absolute left-1/2 -translate-x-1/2 flex flex-col items-center gap-1">

{role==="admin" &&(

<div className="
px-4 py-1
text-xs font-semibold
rounded-full
bg-yellow-400/10
text-yellow-400
border border-yellow-400/30
tracking-wider
transition-all duration-300
hover:scale-110
hover:-translate-y-0.5
hover:shadow-[0_0_20px_rgba(255,215,0,0.7)]
cursor-default
">

ADMIN

</div>

)}

{role==="admin" &&(

<p className="text-xs text-yellow-300/70">
Unlimited scans
</p>

)}

</div>



{/* RIGHT USER MENU */}

<div ref={ref} className="relative ml-auto">

<button
onClick={()=>setOpen(!open)}
className="
flex items-center gap-2
bg-black/40
border border-white/10
px-4 py-1.5
rounded-md
text-sm
transition
hover:border-[#14E6C3]
"
>

<span className="text-gray-200">
{user}
</span>

<span className={`transition ${open?"rotate-180":""}`}>
▼
</span>

</button>


{open &&(

<div className="
absolute right-0 mt-2 w-44
bg-black/40
backdrop-blur-xl
border border-white/10
rounded-lg
overflow-hidden
">

<button
onClick={logout}
className="
w-full text-left
px-4 py-2
text-sm
text-red-400
hover:bg-red-500/10
"
>
Logout
</button>

</div>

)}

</div>

</div>

)

}