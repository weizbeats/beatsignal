"use client"

import { useEffect, useState } from "react"
import { getBeats, Beat } from "@/lib/beatsStore"

export default function BeatsTable(){

  const [beats,setBeats] = useState<Beat[]>([])
  const [search,setSearch] = useState("")
  const [selected,setSelected] = useState<string[]>([])

  useEffect(()=>{
    setBeats(getBeats())
  },[])

  const filtered = beats.filter(b =>
    b.title.toLowerCase().includes(search.toLowerCase())
  )

  function toggleSelect(id:string){

    if(selected.includes(id)){

      setSelected(selected.filter(s => s !== id))

    }else{

      setSelected([...selected,id])

    }

  }

  function deleteSelected(){

    const remaining = beats.filter(b => !selected.includes(b.id))

    localStorage.setItem("beatsignal_beats", JSON.stringify(remaining))

    setBeats(remaining)

    setSelected([])

  }

  return(

    <div className="bg-zinc-900 rounded-xl p-6 mt-6">

      {/* SEARCH + DELETE */}

      <div className="flex gap-4 mb-6">

        <input
          placeholder="Search a beat"
          value={search}
          onChange={(e)=>setSearch(e.target.value)}
          className="flex-1 bg-zinc-800 p-3 rounded-lg outline-none"
        />

        {selected.length > 0 && (

          <button
            onClick={deleteSelected}
            className="bg-red-500 px-4 py-2 rounded-lg"
          >
            Delete
          </button>

        )}

      </div>

      <table className="w-full text-left">

        <thead className="text-zinc-400 text-sm border-b border-zinc-800">

          <tr>

            <th></th>
            <th>Track</th>
            <th>Artist</th>
            <th>Last Check</th>
            <th>Next Check</th>
            <th>Autopilot</th>
            <th>Share</th>

          </tr>

        </thead>

        <tbody>

          {filtered.map((beat)=>(

            <tr
              key={beat.id}
              className="border-b border-zinc-800 hover:bg-zinc-800"
            >

              <td>

                <input
                  type="checkbox"
                  checked={selected.includes(beat.id)}
                  onChange={()=>toggleSelect(beat.id)}
                />

              </td>

              <td className="flex items-center gap-3 py-3">

                <img
                  src={beat.cover}
                  className="w-10 h-10 rounded"
                />

                {beat.title}

              </td>

              <td className="text-zinc-400">

                {beat.artist}

              </td>

              <td className="text-zinc-500">

                {beat.lastScan}

              </td>

              <td className="text-zinc-500">

                None

              </td>

              <td>

                <button className="bg-zinc-800 px-3 py-1 rounded">
                  OFF
                </button>

              </td>

              <td>

                <button className="bg-zinc-800 px-3 py-1 rounded">
                  Share
                </button>

              </td>

            </tr>

          ))}

        </tbody>

      </table>

    </div>

  )

}