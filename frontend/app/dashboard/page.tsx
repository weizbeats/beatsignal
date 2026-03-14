"use client"

import { useState } from "react"
import ScanProgress from "@/components/ScanProgress"

export default function Dashboard(){

const [url,setUrl] = useState("")
const [loading,setLoading] = useState(false)
const [progress,setProgress] = useState(0)

async function handleScan(){

```
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

clearInterval(interval)

setProgress(100)

setTimeout(()=>{
  setLoading(false)
  setProgress(0)
},1200)
```

}

return(

```
<div className="w-full flex justify-center">

  <div className="w-full max-w-5xl px-8 py-16">

    {/* TITLE */}

    <div className="text-center mb-14">

      <h1 className="
      text-5xl font-semibold mb-3
      bg-gradient-to-r
      from-white
      to-[#14E6C3]
      bg-clip-text
      text-transparent
      ">

        BeatSignal

      </h1>

      <p className="text-gray-400">
        Detect stolen beats on YouTube
      </p>

    </div>


    {/* SCAN BAR */}

    <div className="card-glow bg-[#0b0b0b]/80 backdrop-blur-md border border-white/5 rounded-xl p-6 mb-8">

      <div className="flex gap-4">

        <input
          placeholder="Paste YouTube link..."
          value={url}
          onChange={(e)=>setUrl(e.target.value)}
          className="
          flex-1
          bg-black/40
          border border-white/10
          text-white
          p-4
          rounded-lg
          outline-none
          focus:border-[#14E6C3]
          focus:shadow-[0_0_20px_rgba(20,230,195,0.25)]
          transition
          "
        />

        <button
          onClick={handleScan}
          className="
          bg-[#14E6C3]
          hover:bg-[#0FD4B5]
          text-black
          font-semibold
          px-6
          rounded-lg
          hover:scale-105
          hover:shadow-[0_0_25px_rgba(20,230,195,0.5)]
          transition
          "
        >
          Scan
        </button>

      </div>

    </div>


    {/* PROGRESS BAR */}

    {loading && (

      <div className="mb-12">

        <ScanProgress progress={progress}/>

      </div>

    )}


    {/* STATS */}

    <div className="grid grid-cols-3 gap-6 mb-14">

      <div className="card-glow bg-[#0b0b0b]/80 backdrop-blur-md border border-white/5 rounded-xl p-6">

        <p className="text-gray-400 text-sm mb-2">
          Scans today
        </p>

        <p className="text-white text-3xl font-semibold">
          0
        </p>

      </div>


      <div className="card-glow bg-[#0b0b0b]/80 backdrop-blur-md border border-white/5 rounded-xl p-6">

        <p className="text-gray-400 text-sm mb-2">
          Matches found
        </p>

        <p className="text-white text-3xl font-semibold">
          0
        </p>

      </div>


      <div className="card-glow bg-[#0b0b0b]/80 backdrop-blur-md border border-white/5 rounded-xl p-6">

        <p className="text-gray-400 text-sm mb-2">
          Current plan
        </p>

        <p className="text-[#14E6C3] text-2xl font-semibold">
          Free
        </p>

      </div>

    </div>


    {/* RECENT SCANS */}

    <div className="card-glow bg-[#0b0b0b]/80 backdrop-blur-md border border-white/5 rounded-xl p-6">

      <h2 className="text-white mb-4 text-lg">
        Recent scans
      </h2>

      <p className="text-gray-500">
        No scans yet
      </p>

    </div>

  </div>

</div>
```

)

}
