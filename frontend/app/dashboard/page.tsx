"use client"

import { useState,useEffect } from "react"
import { useRouter } from "next/navigation"
import ScanProgress from "../../components/ScanProgress"

export default function Dashboard(){

  const router = useRouter()

  const [url,setUrl] = useState("")
  const [loading,setLoading] = useState(false)
  const [progress,setProgress] = useState(0)
  const [user,setUser] = useState("")

  useEffect(()=>{

    const savedUser = localStorage.getItem("user")

    if(savedUser){
      setUser(savedUser)
    }

  },[])

  function logout(){

    localStorage.removeItem("session")
    localStorage.removeItem("user")

    router.push("/login")

  }

  async function handleScan(){

    if(!url) return

    setLoading(true)
    setProgress(0)

    let fakeProgress = 0

    const interval = setInterval(()=>{

      fakeProgress += 8

      if(fakeProgress > 95) return

      setProgress(fakeProgress)

    },400)

    try{

      const apiUrl = process.env.NEXT_PUBLIC_API_URL

      await fetch(apiUrl + "/scan",{
        method:"POST",
        headers:{
          "Content-Type":"application/json"
        },
        body:JSON.stringify({url})
      })

    }catch(e){

      console.log(e)

    }

    clearInterval(interval)

    setProgress(100)

    setTimeout(()=>{
      setLoading(false)
      setProgress(0)
    },1200)

  }

  return(

    <div className="w-full min-h-screen">

      <div className="flex justify-between items-center px-10 pt-8">

        <div className="text-sm text-[#14E6C3] font-medium">
          Plan: Free
        </div>

        <div className="flex items-center gap-4">

          <p className="text-gray-300 text-sm">
            {user}
          </p>

          <button
            onClick={logout}
            className="text-sm text-gray-400 border border-white/10 px-4 py-1 rounded-md"
          >
            Logout
          </button>

        </div>

      </div>

      <div className="w-full flex justify-center">

        <div className="w-full max-w-5xl px-8 py-16">

          <div className="text-center mb-14">

            <h1 className="text-5xl font-semibold mb-3 text-white">
              BeatSignal
            </h1>

            <p className="text-gray-400">
              Detect stolen beats on YouTube
            </p>

          </div>

          <div className="bg-[#0b0b0b] border border-white/5 rounded-xl p-6 mb-8">

            <div className="flex gap-4">

              <input
                placeholder="Paste YouTube link..."
                value={url}
                onChange={(e)=>setUrl(e.target.value)}
                className="flex-1 bg-black border border-white/10 text-white p-4 rounded-lg"
              />

              <button
                onClick={handleScan}
                className="bg-[#14E6C3] text-black font-semibold px-6 rounded-lg"
              >
                Scan
              </button>

            </div>

          </div>

          {loading && (
            <ScanProgress progress={progress}/>
          )}

        </div>

      </div>

    </div>

  )

}