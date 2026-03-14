"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

export default function Register(){

const router = useRouter()

const [email,setEmail] = useState("")
const [password,setPassword] = useState("")
const [error,setError] = useState("")

async function handleRegister(e:any){

e.preventDefault()

try{

const res = await fetch(
`${process.env.NEXT_PUBLIC_API_URL}/register`,
{
method:"POST",
headers:{ "Content-Type":"application/json" },
body:JSON.stringify({ email,password })
}
)

if(res.ok){
router.push("/")
}

}catch{
setError("Register failed")
}

}

return(

<div className="min-h-screen flex items-center justify-center">

<form
onSubmit={handleRegister}
className="card-glow bg-black/40 border border-white/10 backdrop-blur-xl rounded-xl p-8 flex flex-col gap-4 w-[340px]"
>

<h1 className="text-2xl font-semibold text-center mb-2">

Beat<span className="text-[#14E6C3]">Signal</span>

</h1>

<input
placeholder="Email"
value={email}
onChange={(e)=>setEmail(e.target.value)}
className="bg-black/40 border border-white/10 rounded-lg px-3 py-2"
/>

<input
type="password"
placeholder="Password"
value={password}
onChange={(e)=>setPassword(e.target.value)}
className="bg-black/40 border border-white/10 rounded-lg px-3 py-2"
/>

{error && <p className="text-red-400 text-sm">{error}</p>}

<button className="bg-[#14E6C3] text-black py-2 rounded-lg">
Create account
</button>

<p
className="text-sm text-white/50 text-center cursor-pointer"
onClick={()=>router.push("/")}
>
Login
</p>

</form>

</div>

)

}