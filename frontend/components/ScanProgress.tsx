"use client"

export default function ScanProgress({progress}:{progress:number}){

  return(

    <div className="w-full">

      <div className="w-full h-3 bg-[#0d0d0d] border border-[#1c1c1c] rounded-full overflow-hidden">

        <div
          className="h-full bg-[#14E6C3] transition-all duration-500"
          style={{width:`${progress}%`}}
        />

      </div>

      <div className="text-sm text-gray-400 mt-2 text-center">
        {progress}% analyzing audio fingerprint
      </div>

    </div>

  )

}