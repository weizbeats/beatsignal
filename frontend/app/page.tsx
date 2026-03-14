"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

export default function Login(){

const router = useRouter()

const [email,setEmail] = useState("")
const [password,setPassword] = useState("")
const [error,setError] = useState("")

async function handleLogin(e:any){

e.preventDefault()

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

if(!data.token){
setError("Invalid login")
return
}

localStorage.setItem("token",data.token)
localStorage.setItem("user",email)

router.push("/dashboard")

}catch{
setError("Login failed")
}

}

return(

<div className="min-h-screen flex items-center justify-center px-6">

<form
onSubmit={handleLogin}
className="card-glow bg-black/40 border border-white/10 backdrop-blur-xl rounded-xl p-8 flex flex-col gap-4 w-[340px]"
>

<h1 className="text-2xl font-semibold text-center mb-2">

Beat<span className="text-[var(--accent)]">Signal</span>

</h1>

<input
className="bg-black/40 border border-white/10 rounded-lg px-3 py-2 outline-none focus:border-[var(--accent)]"
placeholder="Email"
value={email}
onChange={(e)=>setEmail(e.target.value)}
/>

<input
type="password"
className="bg-black/40 border border-white/10 rounded-lg px-3 py-2 outline-none focus:border-[var(--accent)]"
placeholder="Password"
value={password}
onChange={(e)=>setPassword(e.target.value)}
/>

{error && <p className="text-red-400 text-sm">{error}</p>}

<button
type="submit"
className="bg-[var(--accent)] text-black py-2 rounded-lg font-medium hover:opacity-90"
>
Login
</button>

<p
className="text-sm text-white/50 text-center cursor-pointer hover:text-white"
onClick={()=>router.push("/register")}
>
Register
</p>

</form>

</div>

)

}