"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"

export default function CheckEmail(){

const router = useRouter()

const [loading,setLoading] = useState(false)
const [message,setMessage] = useState("")

async function resendEmail(){

if(loading) return

setLoading(true)
setMessage("Sending email...")

try{

const email = localStorage.getItem("user")

const res = await fetch(
`${process.env.NEXT_PUBLIC_API_URL}/resend-verification`,
{
method:"POST",
headers:{ "Content-Type":"application/json" },
body:JSON.stringify({ email })
}
)

const data = await res.json()

if(data.success){
setMessage("Verification email sent again")
}else{
setMessage("Failed to send email")
}

}catch{
setMessage("Server error")
}

setLoading(false)

}

return(

<div className="min-h-screen flex items-center justify-center px-6">

<div
className="
card-glow
bg-black/40
border border-white/10
backdrop-blur-xl
rounded-xl
p-10
flex flex-col items-center gap-5
w-[420px]
text-center
"
>

<h1 className="text-2xl font-semibold">
Beat<span className="text-[#14E6C3]">Signal</span>
</h1>

<div className="text-5xl">
📧
</div>

<h2 className="text-lg font-medium">
Check your email
</h2>

<p className="text-sm text-white/60 leading-relaxed">
We sent you a verification link.
Please check your inbox and click the link to activate your account.
</p>

<p className="text-xs text-white/40">
If you don't see the email check your spam folder.
</p>

<button
onClick={resendEmail}
disabled={loading}
className="
bg-[#14E6C3]
text-black
px-6
py-2
rounded-lg
font-medium
hover:scale-[1.02]
hover:shadow-[0_0_20px_rgba(20,230,195,0.6)]
transition
"
>
{loading ? "Sending..." : "Resend email"}
</button>

{message && (

<p className="text-xs text-white/60">
{message}
</p>

)}

<button
onClick={()=>router.push("/")}
className="
text-sm text-white/50
hover:text-white
transition
"
>
Back to login
</button>

</div>

</div>

)

}