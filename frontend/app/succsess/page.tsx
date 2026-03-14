"use client"

import { useEffect } from "react"
import { useSearchParams, useRouter } from "next/navigation"

export default function SuccessPage(){

const params = useSearchParams()
const router = useRouter()

useEffect(()=>{

async function confirmPayment(){

const orderID = params.get("token")

if(!orderID){
router.push("/dashboard")
return
}

const token = localStorage.getItem("token")
const plan = localStorage.getItem("selectedPlan")

const res = await fetch(
process.env.NEXT_PUBLIC_API_URL + "/capture-paypal-order",
{
method:"POST",
headers:{
"Content-Type":"application/json"
},
body:JSON.stringify({
token,
orderID,
plan
})
})

const data = await res.json()

if(data.success){

localStorage.removeItem("selectedPlan")

router.push("/dashboard")

}else{

alert("Payment verification failed")

router.push("/plans")

}

}

confirmPayment()

},[])

return(

<div className="min-h-screen flex items-center justify-center">

<div className="text-center">

<h1 className="text-3xl font-semibold mb-4">
Confirming payment...
</h1>

<p className="text-gray-400">
Please wait while we activate your plan.
</p>

</div>

</div>

)

}
