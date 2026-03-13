"use client"

import { useState } from "react"

export default function ScanPage(){

  const [url,setUrl] = useState("")
  const [result,setResult] = useState<any>(null)
  const [loading,setLoading] = useState(false)

  async function scan(){

    setLoading(true)

    const res = await fetch("http://127.0.0.1:8000/scan",{
      method:"POST",
      headers:{
        "Content-Type":"application/json"
      },
      body: JSON.stringify({url})
    })

    const data = await res.json()

    setResult(data)
    setLoading(false)

  }

  return(

    <div>

      <h1 className="text-3xl font-bold mb-6">
        Scan YouTube
      </h1>

      <div className="bg-zinc-900 p-6 rounded-xl w-[500px]">

        <input
        className="w-full p-3 rounded bg-zinc-800 mb-4"
        placeholder="Paste YouTube URL"
        value={url}
        onChange={(e)=>setUrl(e.target.value)}
        />

        <button
        onClick={scan}
        className="w-full bg-green-500 text-black font-bold p-3 rounded"
        >
          {loading ? "Scanning..." : "Scan"}
        </button>

      </div>

      {result && (

        <div className="bg-zinc-900 p-6 rounded-xl mt-6 w-[500px]">

          <h2 className="font-bold mb-4">
            Result
          </h2>

          {result.cover && (
            <img src={result.cover} className="w-32 mb-4"/>
          )}

          <p><b>Song:</b> {result.song}</p>
          <p><b>Artist:</b> {result.artist}</p>
          <p><b>ISRC:</b> {result.isrc}</p>
          <p><b>Score:</b> {result.score}</p>

        </div>

      )}

    </div>

  )

}