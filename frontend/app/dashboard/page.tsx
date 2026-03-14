"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Search, Loader2 } from "lucide-react"

export default function Dashboard(){

  const [url,setUrl] = useState("")
  const [loading,setLoading] = useState(false)
  const [step,setStep] = useState(0)

  const steps = [
    "Analyzing audio...",
    "Matching database...",
    "Detecting samples..."
  ]

  useEffect(()=>{

    if(!loading) return

    const interval = setInterval(()=>{

      setStep((prev)=> (prev + 1) % steps.length)

    },1500)

    return ()=> clearInterval(interval)

  },[loading])

  async function handleScan(){

    if(!url) return

    setLoading(true)

    try{

      await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/scan`,
        {
          method:"POST",
          headers:{
            "Content-Type":"application/json"
          },
          body:JSON.stringify({url})
        }
      )

    }catch(e){
      console.log(e)
    }

    setLoading(false)

  }

  return(

    <div className="p-12 max-w-5xl">

      <motion.div
        initial={{opacity:0,y:20}}
        animate={{opacity:1,y:0}}
        transition={{duration:0.4}}
      >

        <h1 className="text-3xl font-semibold mb-2">
          BeatSignal Dashboard
        </h1>

        <p className="text-gray-400 mb-10">
          Detect stolen beats on YouTube
        </p>

      </motion.div>


      <motion.div
        initial={{opacity:0,y:20}}
        animate={{opacity:1,y:0}}
        transition={{delay:0.1}}
        className="bg-[#0f0f0f] border border-[#1a1a1a] rounded-xl p-6 mb-12"
      >

        <div className="flex gap-3">

          <div className="flex items-center bg-[#0b0b0b] border border-[#222] rounded-lg px-3 flex-1">

            <Search size={18} className="text-gray-400 mr-2"/>

            <input
              value={url}
              onChange={(e)=>setUrl(e.target.value)}
              placeholder="Paste YouTube link..."
              className="flex-1 p-4 bg-transparent outline-none"
            />

          </div>

          <button
            onClick={handleScan}
            disabled={loading}
            className="bg-[#22c55e] hover:bg-[#16a34a] px-8 rounded-lg font-medium transition"
          >

            {loading ? "Scanning..." : "Scan"}

          </button>

        </div>

      </motion.div>


      {loading && (

        <motion.div
          initial={{opacity:0}}
          animate={{opacity:1}}
          className="bg-[#0f0f0f] border border-[#1a1a1a] rounded-xl p-10 mb-12 flex flex-col items-center"
        >

          <Loader2 className="animate-spin text-green-400 mb-4" size={40}/>

          <p className="text-gray-300 text-lg">
            {steps[step]}
          </p>

        </motion.div>

      )}


      <motion.div
        initial={{opacity:0}}
        animate={{opacity:1}}
        transition={{delay:0.3}}
        className="grid grid-cols-3 gap-6 mb-12"
      >

        <div className="bg-[#0f0f0f] border border-[#1a1a1a] rounded-xl p-6">

          <p className="text-gray-400 text-sm">
            Scans today
          </p>

          <h2 className="text-2xl font-semibold mt-2">
            0
          </h2>

        </div>

        <div className="bg-[#0f0f0f] border border-[#1a1a1a] rounded-xl p-6">

          <p className="text-gray-400 text-sm">
            Matches found
          </p>

          <h2 className="text-2xl font-semibold mt-2">
            0
          </h2>

        </div>

        <div className="bg-[#0f0f0f] border border-[#1a1a1a] rounded-xl p-6">

          <p className="text-gray-400 text-sm">
            Current plan
          </p>

          <h2 className="text-2xl font-semibold mt-2 text-green-400">
            Free
          </h2>

        </div>

      </motion.div>


      <motion.div
        initial={{opacity:0}}
        animate={{opacity:1}}
        transition={{delay:0.3}}
      >

        <h2 className="text-xl font-semibold mb-6">
          Recent scans
        </h2>

        <div className="bg-[#0f0f0f] border border-[#1a1a1a] rounded-xl p-6 text-gray-400">

          No scans yet

        </div>

      </motion.div>

    </div>

  )

}