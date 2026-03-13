"use client"

import { useEffect,useState } from "react"

export default function BeatsPage(){

  const [beats,setBeats] = useState<any[]>([])
  const [name,setName] = useState("")
  const [producer,setProducer] = useState("")

  async function loadBeats(){

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/beats`
    )

    const data = await res.json()

    setBeats(Array.isArray(data) ? data : [])

  }

  useEffect(()=>{

    loadBeats()

  },[])

  async function addBeat(){

    await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/add-beat`,
      {
        method:"POST",
        headers:{
          "Content-Type":"application/json"
        },
        body:JSON.stringify({
          name,
          producer
        })
      }
    )

    setName("")
    setProducer("")

    loadBeats()

  }

  return(

    <div className="max-w-5xl mx-auto">

      <h1 className="text-3xl font-bold mb-8">
        My Beats
      </h1>

      <div className="bg-zinc-900 p-6 rounded-xl mb-8">

        <div className="flex gap-4">

          <input
          placeholder="Beat name"
          value={name}
          onChange={(e)=>setName(e.target.value)}
          className="flex-1 p-3 bg-black border border-zinc-700 rounded"
          />

          <input
          placeholder="Producer"
          value={producer}
          onChange={(e)=>setProducer(e.target.value)}
          className="flex-1 p-3 bg-black border border-zinc-700 rounded"
          />

          <button
          onClick={addBeat}
          className="bg-green-500 text-black px-6 rounded font-semibold"
          >
            Add Beat
          </button>

        </div>

      </div>

      <div className="bg-zinc-900 rounded-xl overflow-hidden">

        <table className="w-full">

          <thead className="bg-zinc-800">

            <tr>

              <th className="p-4 text-left">Beat</th>
              <th className="p-4 text-left">Producer</th>

            </tr>

          </thead>

          <tbody>

            {beats.map((b,i)=>(

              <tr key={i} className="border-t border-zinc-800">

                <td className="p-4">{b.name}</td>

                <td className="p-4 text-gray-400">
                  {b.producer}
                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

    </div>

  )

}