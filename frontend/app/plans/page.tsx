"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

export default function Plans(){

const router = useRouter()
const [billing,setBilling] = useState("monthly")

async function buyPlan(plan:string){

localStorage.setItem("selectedPlan",plan)

const res = await fetch(
process.env.NEXT_PUBLIC_API_URL + "/create-paypal-order",
{
method:"POST",
headers:{
"Content-Type":"application/json"
},
body:JSON.stringify({plan,billing})
})

const data = await res.json()

if(!data.orderID){
alert("Payment error")
return
}

window.location.href =
"https://www.paypal.com/checkoutnow?token=" + data.orderID

}

const prices = {

monthly:{
50:2.49,
100:4.99,
unlimited:9.99
},

yearly:{
50:17.93,
100:35.93,
unlimited:71.93
}

}

const price = prices[billing]

return(

<div className="min-h-screen flex flex-col items-center justify-center px-6">

{/* BACK BUTTON */}

<div className="absolute top-6 left-6">

<button
onClick={()=>router.back()}
className="bg-[#111] hover:bg-[#14E6C3] hover:text-black transition-all duration-300 px-4 py-2 rounded-lg border border-white/10"

>

← Back </button>

</div>

<h1 className="text-4xl font-semibold mb-2">
Pricing
</h1>

<p className="text-gray-400 mb-8">
Choose the plan that fits you
</p>

{/* BILLING TOGGLE */}

<div className="flex items-center gap-4 mb-12">

<button
onClick={()=>setBilling("monthly")}
className={`px-5 py-2 rounded-lg transition-all duration-300 ${billing==="monthly" ? "bg-[#14E6C3] text-black" : "bg-[#111] hover:bg-[#1a1a1a]"}`}

>

Monthly </button>

<button
onClick={()=>setBilling("yearly")}
className={`px-5 py-2 rounded-lg transition-all duration-300 ${billing==="yearly" ? "bg-[#14E6C3] text-black" : "bg-[#111] hover:bg-[#1a1a1a]"}`}

>

Yearly (40% off) </button>

</div>

{/* PLANS */}

<div className="grid grid-cols-1 md:grid-cols-3 gap-10">

{/* PLAN 50 */}

<div className="bg-[#111] p-8 rounded-xl border border-white/10 w-[270px] transition-all duration-300 hover:scale-105 hover:border-[#14E6C3]">

<h2 className="text-4xl font-bold mb-2">
50
</h2>

<p className="text-gray-400 mb-6">
monthly credit plan
</p>

<p className="text-2xl mb-6">
${price[50]} {billing==="monthly" ? "/ month" : "/ year"}
</p>

<ul className="text-gray-400 text-sm mb-6 space-y-2">
<li>Upload unlimited beats</li>
<li>Automatic scanning</li>
<li>Unlimited results</li>
</ul>

<button
onClick={()=>buyPlan("50")}
className="bg-[#14E6C3] text-black px-6 py-2 rounded-lg w-full transition-all duration-300 hover:scale-105 active:scale-95"

>

Subscribe </button>

</div>

{/* PLAN 100 */}

<div className="bg-[#111] p-8 rounded-xl border border-[#14E6C3] w-[270px] relative scale-105 transition-all duration-300 hover:scale-110">

<div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#14E6C3] text-black text-xs px-3 py-1 rounded-full">
Most Popular
</div>

<h2 className="text-4xl font-bold mb-2">
100
</h2>

<p className="text-gray-400 mb-6">
monthly credit plan
</p>

<p className="text-2xl mb-6">
${price[100]} {billing==="monthly" ? "/ month" : "/ year"}
</p>

<ul className="text-gray-400 text-sm mb-6 space-y-2">
<li>Upload unlimited beats</li>
<li>Automatic scanning</li>
<li>Unlimited results</li>
</ul>

<button
onClick={()=>buyPlan("100")}
className="bg-[#14E6C3] text-black px-6 py-2 rounded-lg w-full transition-all duration-300 hover:scale-105 active:scale-95"

>

Subscribe </button>

</div>

{/* PLAN UNLIMITED */}

<div className="bg-[#111] p-8 rounded-xl border border-white/10 w-[270px] transition-all duration-300 hover:scale-105 hover:border-[#14E6C3]">

<h2 className="text-4xl font-bold mb-2">
Unlimited
</h2>

<p className="text-gray-400 mb-6">
Unlimited scans
</p>

<p className="text-2xl mb-6">
${price.unlimited} {billing==="monthly" ? "/ month" : "/ year"}
</p>

<ul className="text-gray-400 text-sm mb-6 space-y-2">
<li>Upload unlimited beats</li>
<li>Automatic scanning</li>
<li>Unlimited results</li>
</ul>

<button
onClick={()=>buyPlan("unlimited")}
className="bg-[#14E6C3] text-black px-6 py-2 rounded-lg w-full transition-all duration-300 hover:scale-105 active:scale-95"

>

Subscribe </button>

</div>

</div>

</div>

)

}
