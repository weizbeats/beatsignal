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

setLoading(true)

try{

const res = await fetch(
`${process.env.NEXT_PUBLIC_API_URL}/login`,
{
method:"POST",
headers:{ "Content-Type":"application/json" },
body:JSON.stringify({ email,password })
})

const data = await res.json()

if(!data.token){
setError("Invalid login")
setLoading(false)
return
}

localStorage.setItem("token",data.token)
localStorage.setItem("user",email)

router.push("/dashboard")

}catch{

setError("Login failed")

}

setLoading(false)

}

return(

<div className="min-h-screen flex items-center justify-center">

<form onSubmit={handleLogin} className="flex flex-col gap-4">

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
{loading ? "Loading..." : "Login"}
</button>

<p onClick={()=>router.push("/register")}>
Register
</p>

</form>

</div>

)

}