"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

export default function Login(){

const router = useRouter()

const [email,setEmail] = useState("")
const [password,setPassword] = useState("")
const [error,setError] = useState("")
const [loading,setLoading] = useState(false)

async function handleLogin(e:any){

e.preventDefault()

if(loading) return

setError("")
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
else setError("Login failed")

setLoading(false)
return
}

localStorage.setItem("token",data.token)
localStorage.setItem("user",email)

router.push("/dashboard")

}catch{

setError("Server error")
setLoading(false)

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

<h1 className="text-2xl font-semibold text-center">
Beat<span className="text-[#14E6C3]">Signal</span>
</h1>

<p className="text-xs text-center text-white/60 -mt-1">
Detect stolen beats on YouTube
</p>

<p className="text-xs text-center text-[#14E6C3] mb-3">
Login to continue
</p>

<input
placeholder="Email"
value={email}
onChange={(e)=>setEmail(e.target.value)}
disabled={loading}
className="
bg-black/40
border border-white/10
rounded-lg
px-3 py-2
outline-none
text-white
focus:border-[#14E6C3]
transition
"
/>

<input
type="password"
placeholder="Password"
value={password}
onChange={(e)=>setPassword(e.target.value)}
disabled={loading}
className="
bg-black/40
border border-white/10
rounded-lg
px-3 py-2
outline-none
text-white
focus:border-[#14E6C3]
transition
"
/>

{error && (
<p className="text-red-400 text-sm text-center">
{error}
</p>
)}

<button
type="submit"
disabled={loading}
className={`
py-2 rounded-lg font-medium transition flex items-center justify-center gap-2
${loading
? "bg-gray-600 cursor-not-allowed"
: "bg-[#14E6C3] text-black hover:scale-[1.02] hover:shadow-[0_0_20px_rgba(20,230,195,0.6)]"
}
`}
>

{loading ? (
<>
<div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
Loading...
</>
) : "Login"}

</button>

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