"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

export default function LoginPage(){

  const router = useRouter()

  const [email,setEmail] = useState("")
  const [password,setPassword] = useState("")
  const [error,setError] = useState("")

  async function handleLogin(e:any){

    e.preventDefault()

    setError("")

    try{

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/login`,
        {
          method:"POST",
          headers:{
            "Content-Type":"application/json"
          },
          body:JSON.stringify({
            email,
            password
          })
        }
      )

      const data = await res.json()

      if(!data.success){
        setError("Invalid credentials")
        return
      }

      localStorage.setItem("session","true")
      localStorage.setItem("user",email)

      router.push("/dashboard")

    }catch(err){

      setError("Login failed")

    }

  }

  return(

    <div className="h-screen bg-[#0b0b0b] flex items-center justify-center">

      <div className="bg-[#111] w-[420px] p-10 rounded-xl border border-[#222]">

        <h1 className="text-white text-2xl mb-8 text-center">
          Login to BeatSignal
        </h1>

        <form onSubmit={handleLogin}>

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e)=>setEmail(e.target.value)}
            className="w-full p-4 mb-4 rounded bg-black border border-[#333] text-white"
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e)=>setPassword(e.target.value)}
            className="w-full p-4 mb-6 rounded bg-black border border-[#333] text-white"
          />

          {error && (
            <p className="text-red-400 mb-4">
              {error}
            </p>
          )}

          <button
            type="submit"
            className="w-full bg-pink-500 p-4 rounded text-white"
          >
            Login
          </button>

        </form>

        <p className="text-gray-400 text-sm mt-6 text-center">
          Don't have an account?

          <span
            onClick={()=>router.push("/register")}
            className="text-pink-500 cursor-pointer ml-2"
          >
            Register
          </span>

        </p>

      </div>

    </div>

  )

}