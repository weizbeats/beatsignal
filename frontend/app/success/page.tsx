"use client"

import { Suspense } from "react"
import { useSearchParams } from "next/navigation"

function SuccessContent() {

  const params = useSearchParams()
  const plan = params.get("plan")

  return (
    <div style={{padding:"40px", textAlign:"center"}}>
      <h1>Payment successful 🎉</h1>
      <p>Your plan: {plan}</p>

      <a href="/dashboard">
        Go to dashboard
      </a>
    </div>
  )

}

export default function Page(){

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SuccessContent/>
    </Suspense>
  )

}