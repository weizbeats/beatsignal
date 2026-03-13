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

    setError("")
    setLoading(true)

    try{

      const res = await fetch(
        "http://127.0.0.1:8000/register",
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

      if(data.detail){
        setError(data.detail)
        setLoading(false)
        return
      }

      if(!data.token){
        setError("Registration failed")
        setLoading(false)
        return
      }

      // guardar token
      localStorage.setItem("token",data.token)

      router.push("/dashboard")

    }catch(err){

      setError("Registration failed")

    }

    setLoading(false)

  }

  return(

    <div className="h-screen bg-[#0b0b0b] flex items-center justify-center">

      <div className="bg-[#111] w-[420px] p-10 rounded-xl border border-[#222]">

        <h1 className="text-white text-2xl mb-8 text-center">
          Create BeatSignal Account
        </h1>

        <form onSubmit={handleRegister}>

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
            disabled={loading}
            className="w-full bg-pink-500 p-4 rounded text-white"
          >
            {loading ? "Creating account..." : "Register"}
          </button>

        </form>

        <p className="text-gray-400 text-sm mt-6 text-center">
          Already have an account?

          <span
            onClick={()=>router.push("/")}
            className="text-pink-500 cursor-pointer ml-2"
          >
            Login
          </span>

        </p>

      </div>

    </div>

  )

}