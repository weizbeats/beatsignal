"use client"

import { useRouter } from "next/navigation"

export default function Plans(){

const router = useRouter()

async function buyPlan(plan:string){

const token = localStorage.getItem("token")

const res = await fetch(
process.env.NEXT_PUBLIC_API_URL + "/create-paypal-order",
{
method:"POST",
headers:{
"Content-Type":"application/json"
},
body:JSON.stringify({plan})
})

const data = await res.json()

if(!data.orderID){
alert("Payment error")
return
}

window.location.href =
"https://www.sandbox.paypal.com/checkoutnow?token=" + data.orderID

}

return(

<div className="min-h-screen flex flex-col items-center justify-center px-6">

<h1 className="text-4xl font-semibold mb-2">
Pricing
</h1>

<p className="text-gray-400 mb-12">
Choose the plan that fits you
</p>

<div className="grid grid-cols-1 md:grid-cols-3 gap-10">

{/* PLAN 50 */}

<div className="bg-[#111] p-8 rounded-xl border border-white/10 w-[260px]">

<h2 className="text-4xl font-bold mb-2">
50
</h2>

<p className="text-gray-400 mb-6">
monthly credit plan
</p>

<p className="text-xl mb-6">
$2.49 / month
</p>

<button
onClick={()=>buyPlan("50")}
className="bg-[#14E6C3] text-black px-6 py-2 rounded-lg w-full"
>
Subscribe
</button>

</div>


{/* PLAN 100 */}

<div className="bg-[#111] p-8 rounded-xl border border-[#14E6C3] w-[260px]">

<h2 className="text-4xl font-bold mb-2">
100
</h2>

<p className="text-gray-400 mb-6">
monthly credit plan
</p>

<p className="text-xl mb-6">
$4.99 / month
</p>

<button
onClick={()=>buyPlan("100")}
className="bg-[#14E6C3] text-black px-6 py-2 rounded-lg w-full"
>
Subscribe
</button>

</div>

a{/* PLAN UNLIMITED */}

<div className="bg-[#111] p-8 rounded-xl border border-white/10 w-[260px]">

<h2 className="text-4xl font-bold mb-2">
Unlimited
</h2>

<p className="text-gray-400 mb-6">
Unlimited scans
</p>

<p className="text-xl mb-6">
$9.99 / month
</p>

<button
onClick={()=>buyPlan("unlimited")}
className="bg-[#14E6C3] text-black px-6 py-2 rounded-lg w-full"
>
Subscribe
</button>

</div>

</div>

</div>

)

}