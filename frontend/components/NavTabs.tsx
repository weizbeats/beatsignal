"use client"

import { useRouter, usePathname } from "next/navigation"

export default function NavTabs(){

const router = useRouter()
const path = usePathname()

function tabStyle(route:string){

return `text-sm font-medium transition ${
path===route
? "text-[#14E6C3] drop-shadow-[0_0_10px_rgba(20,230,195,0.6)]"
: "text-white/50 hover:text-white"
}`

}

return(

<div className="w-full flex justify-center mt-6">

<div className="flex gap-10">

<button
onClick={()=>router.push("/dashboard")}
className={tabStyle("/dashboard")}
>
Dashboard
</button>

<button
onClick={()=>router.push("/results")}
className={tabStyle("/results")}
>
Results
</button>

</div>

</div>

)

}