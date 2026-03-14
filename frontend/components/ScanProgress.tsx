"use client"

export default function ScanProgress({ progress }: { progress:number }){

  return(

    <div className="w-full">

      <div className="w-full h-3 bg-black/40 rounded-full overflow-hidden">

        <div
          className="h-full bg-[#14E6C3] transition-all duration-300"
          style={{width:`${progress}%`}}
        />

      </div>

      <p className="text-gray-400 text-sm mt-2">
        Scanning... {progress}%
      </p>

    </div>

  )

}