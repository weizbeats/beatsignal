"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

export default function RegisterPage(){

const router = useRouter()

const [email,setEmail] = useState("")
const [password,setPassword] = useState("")
const [error,setError] = useState("")
const [loading,setLoading] = useState(false)

async function handleRegister(e:any){

e.preventDefault()

setLoading(true)

try{

const res = await fetch(
`${process.env.NEXT_PUBLIC_API_URL}/register`,
{
method:"POST",
headers:{ "Content-Type":"application/json" },
body:JSON.stringify({ email,password })
})

const data = await res.json()

if(!data.success){
setError("Registration failed")
setLoading(false)
return
}

router.push("/")

}catch{

setError("Registration failed")

}

setLoading(false)

}

return(

<div className="min-h-screen flex items-center justify-center">

<form onSubmit={handleRegister} className="flex flex-col gap-4">

<input
placeholder="Email"
value={email}
onChange={(e)=>setEmail(e.target.value)}
/>

<input
type="password"
placeholder="Password"
value={password}
onChange={(e)=>setPassword(e.target.value)}
/>

{error && <p>{error}</p>}

<button type="submit">
{loading ? "Creating..." : "Create account"}
</button>

<p onClick={()=>router.push("/")}>
Login
</p>

</form>

</div>

)

}