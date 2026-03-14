"use client"

import { useState } from "react"

export default function Dashboard(){

  const [url,setUrl] = useState("")
  const [loading,setLoading] = useState(false)

  async function handleScan(){

    if(!url) return

    setLoading(true)

    try{

      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/scan`,{
        method:"POST",
        headers:{
          "Content-Type":"application/json"
        },
        body:JSON.stringify({url})
      })

    }catch(e){
      console.log(e)
    }

    setLoading(false)

  }

  return(

    <div className="w-full flex justify-center">

      <div className="w-full max-w-5xl px-8 py-16">

        {/* TITLE */}

        <div className="text-center mb-12">

          <h1 className="text-4xl font-semibold text-white mb-2">
            BeatSignal
          </h1>

          <p className="text-gray-400">
            Detect stolen beats on YouTube
          </p>

        </div>


        {/* SCAN BAR */}

        <div className="bg-[#0d0d0d] border border-[#1c1c1c] rounded-xl p-6 mb-12">

          <div className="flex gap-4">

            <input
              placeholder="Paste YouTube link..."
              value={url}
              onChange={(e)=>setUrl(e.target.value)}
              className="flex-1 bg-black border border-[#262626] text-white p-4 rounded-lg outline-none focus:border-[#14E6C3] transition"
            />

            <button
              onClick={handleScan}
              className="bg-[#14E6C3] hover:bg-[#0FD4B5] text-black font-semibold px-6 rounded-lg transition"
            >
              {loading ? "Scanning..." : "Scan"}
            </button>

          </div>

        </div>


        {/* STATS */}

        <div className="grid grid-cols-3 gap-6 mb-12">

          <div className="bg-[#0d0d0d] border border-[#1c1c1c] rounded-xl p-6">

            <p className="text-gray-400 text-sm mb-2">
              Scans today
            </p>

            <p className="text-white text-2xl font-semibold">
              0
            </p>

          </div>


          <div className="bg-[#0d0d0d] border border-[#1c1c1c] rounded-xl p-6">

            <p className="text-gray-400 text-sm mb-2">
              Matches found
            </p>

            <p className="text-white text-2xl font-semibold">
              0
            </p>

          </div>


          <div className="bg-[#0d0d0d] border border-[#1c1c1c] rounded-xl p-6">

            <p className="text-gray-400 text-sm mb-2">
              Current plan
            </p>

            <p className="text-[#14E6C3] text-xl font-semibold">
              Free
            </p>

          </div>

        </div>


        {/* RECENT SCANS */}

        <div className="bg-[#0d0d0d] border border-[#1c1c1c] rounded-xl p-6">

          <h2 className="text-white mb-4">
            Recent scans
          </h2>

          <p className="text-gray-500">
            No scans yet
          </p>

        </div>

      </div>

    </div>

  )

}