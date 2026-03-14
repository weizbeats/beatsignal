"use client"

import { useEffect, useState } from "react"

export default function ScanProgress({progress}:{progress:number}){

  const [particles,setParticles] = useState<number[]>([])

  useEffect(()=>{

    const interval = setInterval(()=>{

      setParticles((p)=>[...p,Math.random()])

      setTimeout(()=>{
        setParticles((p)=>p.slice(1))
      },800)

    },120)

    return ()=>clearInterval(interval)

  },[])

  return(

    <div className="w-full">

      <div className="w-full h-3 bg-[#0d0d0d] border border-[#1c1c1c] rounded-full overflow-hidden relative">

        {/* PROGRESS BAR */}

        <div
          className="h-full bg-[#14E6C3] transition-all duration-500 relative"
          style={{width:`${progress}%`}}
        >

          {/* PARTICLES */}

          {particles.map((p,i)=>(
            <span
              key={i}
              className="absolute w-2 h-2 bg-[#2AF5D2] rounded-full opacity-70 animate-ping"
              style={{
                left:`${Math.random()*100}%`,
                top:`${Math.random()*100}%`
              }}
            />
          ))}

        </div>

      </div>

      <div className="text-sm text-gray-400 mt-2 text-center">
        {progress}% analyzing audio fingerprint
      </div>

    </div>

  )

}