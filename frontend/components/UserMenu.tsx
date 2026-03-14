"use client"

import { useState,useRef,useEffect } from "react"

export default function UserMenu(){

const [open,setOpen] = useState(false)
const ref = useRef<HTMLDivElement>(null)

const user =
typeof window !== "undefined"
? localStorage.getItem("user")
: ""

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

<div ref={ref} className="relative">

<button
onClick={()=>setOpen(!open)}
className="
bg-black/40
border border-white/10
px-3 py-1
rounded-md
text-sm
hover:border-[#14E6C3]
transition
"
>
{user}
</button>

{open && (

<div className="
absolute
right-0
mt-2
w-48
bg-black/40
backdrop-blur-xl
border border-white/10
rounded-lg
shadow-lg
overflow-hidden
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

)

}