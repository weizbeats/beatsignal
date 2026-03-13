"use client"

export default function TopBar(){

  return(

    <div className="flex justify-end items-center mb-8">

      <button className="bg-pink-500 text-white px-4 py-2 rounded-lg mr-4">
        Upgrade Plan
      </button>

      <div className="flex items-center gap-2">

        <div className="w-8 h-8 bg-pink-400 rounded-full"></div>

        <span className="text-sm text-gray-300">
          andresreyes.01
        </span>

      </div>

    </div>

  )
}