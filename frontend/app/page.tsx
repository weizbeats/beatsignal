"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"

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

    <div className="h-screen bg-[#0a0a0a] flex items-center justify-center">

      <motion.div
        initial={{opacity:0,y:40}}
        animate={{opacity:1,y:0}}
        transition={{duration:0.4}}
        className="bg-[#111] w-[420px] p-10 rounded-2xl border border-[#1f1f1f] shadow-xl"
      >

        <h1 className="text-white text-3xl font-semibold mb-2 text-center">
          Welcome back
        </h1>

        <p className="text-gray-400 text-center mb-8 text-sm">
          Login to BeatSignal
        </p>

        <form onSubmit={handleLogin}>

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e)=>setEmail(e.target.value)}
            className="w-full p-4 mb-4 rounded-lg bg-[#0b0b0b] border border-[#222] text-white focus:outline-none focus:border-[#3b82f6] transition"
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e)=>setPassword(e.target.value)}
            className="w-full p-4 mb-6 rounded-lg bg-[#0b0b0b] border border-[#222] text-white focus:outline-none focus:border-[#3b82f6] transition"
          />

          {error && (
            <p className="text-red-400 mb-4 text-sm">
              {error}
            </p>
          )}

          <button
            type="submit"
            className="w-full bg-[#2563eb] hover:bg-[#1d4ed8] transition p-4 rounded-lg text-white font-medium"
          >
            Login
          </button>

        </form>

        <p className="text-gray-400 text-sm mt-6 text-center">
          Don't have an account?

          <span
            onClick={()=>router.push("/register")}
            className="text-blue-400 cursor-pointer ml-2 hover:text-blue-300"
          >
            Register
          </span>

        </p>

      </motion.div>

    </div>

  )

}