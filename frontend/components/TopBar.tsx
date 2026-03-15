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

return(

<div className="w-full flex justify-between items-start px-16 pt-4">

<div className="flex flex-col gap-2">

<span className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-black text-xs font-semibold px-3 py-1 rounded-md">
ADMIN
</span>

<p className="text-sm text-white/60">
Unlimited scans
</p>

</div>

<div ref={ref} className="relative">

<button
onClick={()=>setOpen(!open)}
className="flex items-center gap-2 bg-black/40 border border-white/10 px-4 py-1.5 rounded-md text-sm"
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
onClick={logout}
className="w-full text-left px-4 py-2 text-sm text-red-400"
>
Logout
</button>

</div>

)}

</div>

</div>

)

}