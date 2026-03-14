"use client"

import { useState,useEffect } from "react"
import { useRouter } from "next/navigation"

export default function LoginPage(){

const router = useRouter()

const [email,setEmail] = useState("")
const [password,setPassword] = useState("")
const [error,setError] = useState("")
const [loading,setLoading] = useState(false)

useEffect(()=>{

const token = localStorage.getItem("token")

if(token){
router.push("/dashboard")
}

},[])

async function handleLogin(e:any){

e.preventDefault()

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

localStorage.setItem("token",data.token)
localStorage.setItem("user",email)

router.push("/dashboard")

}catch{

setError("Login failed")
setLoading(false)

}

}

return(

<form onSubmit={handleLogin}>

<input
value={email}
onChange={(e)=>setEmail(e.target.value)}
placeholder="Email"
/>

<input
type="password"
value={password}
onChange={(e)=>setPassword(e.target.value)}
placeholder="Password"
/>

<button type="submit">
{loading ? "Logging in..." : "Login"}
</button>

{error && <p>{error}</p>}

</form>

)

}