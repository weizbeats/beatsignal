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

setError("")

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
setError("Invalid email or password")
return
}

localStorage.setItem("token",data.token)
localStorage.setItem("user",email)

router.push("/dashboard")

}catch{
setError("Server error")
}

}

return(

<div className="min-h-screen flex items-center justify-center px-6">

<form
onSubmit={handleLogin}
className="
card-glow
bg-black/40
border border-white/10
backdrop-blur-xl
rounded-xl
p-10
flex flex-col gap-4
w-[380px]
"
>

{/* TITLE */}

<h1 className="text-2xl font-semibold text-center">

Beat<span className="text-[#14E6C3]">Signal</span>

</h1>

<p className="text-xs text-center text-white/60 -mt-1">
Detect stolen beats on YouTube
</p>

<p className="text-xs text-center text-[#14E6C3] mb-3">
Login to continue
</p>


{/* EMAIL */}

<input
placeholder="Email"
value={email}
onChange={(e)=>setEmail(e.target.value)}
className="
bg-black/40
border border-white/10
rounded-lg
px-3 py-2
outline-none
text-white
focus:border-[#14E6C3]
focus:shadow-[0_0_10px_rgba(20,230,195,0.4)]
transition
"
/>


{/* PASSWORD */}

<input
type="password"
placeholder="Password"
value={password}
onChange={(e)=>setPassword(e.target.value)}
className="
bg-black/40
border border-white/10
rounded-lg
px-3 py-2
outline-none
text-white
focus:border-[#14E6C3]
focus:shadow-[0_0_10px_rgba(20,230,195,0.4)]
transition
"
/>


{/* ERROR */}

{error && (

<p className="text-red-400 text-sm text-center">
{error}
</p>

)}


{/* LOGIN BUTTON */}

<button
type="submit"
className="
bg-[#14E6C3]
text-black
py-2
rounded-lg
font-medium
hover:scale-[1.02]
hover:shadow-[0_0_20px_rgba(20,230,195,0.6)]
transition
"
>
Login
</button>


{/* REGISTER LINK */}

<p
className="text-sm text-white/50 text-center cursor-pointer hover:text-white transition"
onClick={()=>router.push("/register")}
>
Don't have an account? <span className="text-[#14E6C3]">Create account</span>
</p>

</form>

</div>

)

}