"use client"

import { useState,useEffect } from "react"
import { useRouter } from "next/navigation"
import { saveToken,getToken } from "@/lib/auth"

export default function Login(){

const router = useRouter()

const [email,setEmail] = useState("")
const [password,setPassword] = useState("")
const [remember,setRemember] = useState(false)

const [error,setError] = useState("")
const [loading,setLoading] = useState(false)
const [status,setStatus] = useState("")

useEffect(()=>{

if(getToken()){
router.replace("/dashboard")
}

},[])

async function handleLogin(e:any){

e.preventDefault()

if(loading) return

setError("")
setStatus("")
setLoading(true)

try{

const res = await fetch(
`${process.env.NEXT_PUBLIC_API_URL}/login`,
{
method:"POST",
headers:{ "Content-Type":"application/json" },
body:JSON.stringify({ email,password })
}
)

const data = await res.json()

if(!data.success){

if(data.error==="user_not_found") setError("User not found")
else if(data.error==="wrong_password") setError("Wrong password")
else if(data.error==="email_not_verified") setError("Verify your email first")
else setError("Login failed")

setLoading(false)
return
}

saveToken(data.token,remember)

localStorage.setItem("user",email)

router.replace("/dashboard")

}catch{

setError("Server error")
setLoading(false)

}

}

return(

<div className="min-h-screen flex items-center justify-center px-6">

<form
onSubmit={handleLogin}
className="card-glow bg-black/40 border border-white/10 backdrop-blur-xl rounded-xl p-10 flex flex-col gap-4 w-[380px]"
>

<h1 className="text-2xl font-semibold text-center">
Beat<span className="text-[#14E6C3]">Signal</span>
</h1>

<input
placeholder="Email"
value={email}
onChange={(e)=>setEmail(e.target.value)}
className="bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-white"
/>

<input
type="password"
placeholder="Password"
value={password}
onChange={(e)=>setPassword(e.target.value)}
className="bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-white"
/>

<label className="flex items-center gap-2 text-sm text-white/60">

<input
type="checkbox"
checked={remember}
onChange={()=>setRemember(!remember)}
className="accent-[#14E6C3]"
/>

Remember me

</label>

{error && (
<p className="text-red-400 text-sm text-center">{error}</p>
)}

<button
type="submit"
className="py-2 rounded-lg bg-[#14E6C3] text-black font-medium"
>
{loading ? "Loading..." : "Login"}
</button>

</form>

</div>

)

}