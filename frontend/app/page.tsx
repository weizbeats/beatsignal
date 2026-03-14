"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"

export default function LoginPage(){

const router = useRouter()

const [email,setEmail] = useState("")
const [password,setPassword] = useState("")
const [error,setError] = useState("")
const [loading,setLoading] = useState(false)

async function handleLogin(e:any){

e.preventDefault()

setError("")
setLoading(true)

try{

const res = await fetch(
process.env.NEXT_PUBLIC_API_URL + "/login",
{
method:"POST",
headers:{
"Content-Type":"application/json"
},
body:JSON.stringify({
email,
password
})
})

const data = await res.json()

if(!data.success){

setError("Invalid credentials")
setLoading(false)
return

}

localStorage.setItem("session","true")
localStorage.setItem("user",email)

router.push("/dashboard")

}catch(e){

setError("Login failed")
setLoading(false)

}

}

return(

<div className="min-h-screen flex items-center justify-center px-6">

<motion.div
initial={{opacity:0,y:30}}
animate={{opacity:1,y:0}}
transition={{duration:0.4}}
className="w-full max-w-md bg-[#0b0b0b]/70 backdrop-blur-xl border border-white/10 rounded-2xl p-10 shadow-[0_0_60px_rgba(20,230,195,0.08)]"
>

{/* TITLE */}

<div className="text-center mb-8">

<h1 className="text-3xl font-semibold mb-2 bg-gradient-to-r from-white to-[#14E6C3] bg-clip-text text-transparent">
Welcome back
</h1>

<p className="text-gray-400 text-sm">
Login to BeatSignal
</p>

</div>

{/* FORM */}

<form onSubmit={handleLogin}>

<input
type="email"
placeholder="Email"
value={email}
onChange={(e)=>setEmail(e.target.value)}
className="w-full p-4 mb-4 rounded-lg bg-black/40 border border-white/10 text-white outline-none focus:border-[#14E6C3] focus:shadow-[0_0_20px_rgba(20,230,195,0.35)] transition"
/>

<input
type="password"
placeholder="Password"
value={password}
onChange={(e)=>setPassword(e.target.value)}
className="w-full p-4 mb-6 rounded-lg bg-black/40 border border-white/10 text-white outline-none focus:border-[#14E6C3] focus:shadow-[0_0_20px_rgba(20,230,195,0.35)] transition"
/>

{error && (

<p className="text-red-400 text-sm mb-4">
{error}
</p>

)}

<button
type="submit"
disabled={loading}
className="w-full bg-[#14E6C3] hover:bg-[#0FD4B5] text-black font-semibold p-4 rounded-lg transition hover:scale-[1.02]"
>
{loading ? "Logging in..." : "Login"}
</button>

</form>

{/* REGISTER */}

<p className="text-gray-400 text-sm mt-6 text-center">

Don't have an account?

<span
onClick={()=>router.push("/register")}
className="text-[#14E6C3] cursor-pointer ml-2 hover:underline"
>
Register
</span>

</p>

</motion.div>

</div>

)

}