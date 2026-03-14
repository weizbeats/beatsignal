"use client"

import { Suspense } from "react"
import VerifyContent from "./verifyContent"

export default function VerifyPage(){

return(

<Suspense fallback={<Loading/>}>
<VerifyContent/>
</Suspense>

)

}

function Loading(){

return(

<div className="min-h-screen flex items-center justify-center px-6">

<div
className="
card-glow
bg-black/40
border border-white/10
backdrop-blur-xl
rounded-xl
p-10
flex flex-col items-center gap-4
w-[380px]
"
>

<h1 className="text-2xl font-semibold text-center">
Beat<span className="text-[#14E6C3]">Signal</span>
</h1>

<div className="w-6 h-6 border-2 border-[#14E6C3] border-t-transparent rounded-full animate-spin"></div>

<p className="text-sm text-white/70 text-center">
Verifying your account...
</p>

</div>

</div>

)

}
