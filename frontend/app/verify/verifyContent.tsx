"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"

export default function VerifyContent(){

const router = useRouter()
const searchParams = useSearchParams()

const token = searchParams.get("token")

const [status,setStatus] = useState("Verifying your account...")

useEffect(()=>{

if(!token){

setStatus("Invalid verification link")
return

}

async function verify(){

try{

const res = await fetch(
`${process.env.NEXT_PUBLIC_API_URL}/verify-email?token=${token}`
)

const data = await res.json()

if(data.success){

setStatus("Account verified! Redirecting to login...")

setTimeout(()=>{

router.push("/login")

},2000)

}else{

setStatus("Verification failed")

}

}catch{

setStatus("Server error")

}

}

verify()

},[token,router])


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
{status}
</p>

</div>

</div>

)

}