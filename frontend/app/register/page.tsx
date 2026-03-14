"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

export default function Register(){

const router = useRouter()

const [email,setEmail] = useState("")
const [password,setPassword] = useState("")
const [error,setError] = useState("")
const [loading,setLoading] = useState(false)
const [status,setStatus] = useState("")


function validate(){

if(!email.includes("@")){
setError("Invalid email")
return false
}

if(password.length < 6){
setError("Password must be at least 6 characters")
return false
}

return true

}


async function handleRegister(e:any){

e.preventDefault()

if(loading) return

setError("")
setStatus("")

if(!validate()) return

setLoading(true)
setStatus("Creating account...")

try{

const res = await fetch(
`${process.env.NEXT_PUBLIC_API_URL}/register`,
{
method:"POST",
headers:{ "Content-Type":"application/json" },
body:JSON.stringify({ email,password })
}
)

const data = await res.json()

if(!data.success){

if(data.error==="email_exists"){
setError("Email already registered")
}else{
setError("Registration failed")
}

setLoading(false)
setStatus("")
return

}

localStorage.setItem("token",data.token)
localStorage.setItem("user",email)

router.push("/dashboard")

}catch{

setError("Server error")
setLoading(false)
setStatus("")

}

}



return(

<div className="min-h-screen flex items-center justify-center px-6">

<form
onSubmit={handleRegister}
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
Create Account
</h1>

<p className="text-xs text-center text-white/60 -mt-1">
Start using BeatSignal
</p>

<p className="text-xs text-center text-[#14E6C3] mb-3">
Free trial includes 5 scans
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

<p className="text-red-400 text-sm text-center animate-pulse">
{error}
</p>

)}

{status && (

<p className="text-[#14E6C3] text-xs text-center">
{status}
</p>

)}


<button
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

<div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>

) : "Create account"}

</button>


<p
className="text-sm text-white/50 text-center cursor-pointer hover:text-white transition"
onClick={()=>router.push("/")}
>
Already have an account? <span className="text-[#14E6C3]">Login</span>
</p>

</form>

</div>

)

}