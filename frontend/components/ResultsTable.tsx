"use client"

import { useEffect,useState } from "react"
import { getBeats,Beat } from "@/lib/beatsStore"

export default function ResultsTable(){

  const [beats,setBeats] = useState<Beat[]>([])
  const [search,setSearch] = useState("")

  useEffect(()=>{

    setBeats(getBeats())

  },[])

  const filtered = beats.filter(b=>

    b.title.toLowerCase().includes(search.toLowerCase()) ||
    b.artist.toLowerCase().includes(search.toLowerCase()) ||
    b.isrc.toLowerCase().includes(search.toLowerCase())

  )

  return(

    <div className="bg-[#151515] rounded-xl p-6">

      <input
        placeholder="Search by beat, song, ISRC or status"
        className="w-full mb-6 bg-[#222] p-3 rounded-lg outline-none"
        value={search}
        onChange={(e)=>setSearch(e.target.value)}
      />

      <table className="w-full text-sm">

        <thead className="text-gray-400 text-left">

          <tr>
            <th>Song</th>
            <th>ISRC</th>
            <th>Release</th>
            <th>Beat</th>
            <th>Status</th>
          </tr>

        </thead>

        <tbody>

          {filtered.map((b)=>(
            <tr key={b.id} className="border-t border-[#222]">

              <td className="py-4">

                <div className="flex items-center gap-3">

                  <img
                    src={b.cover}
                    className="w-10 h-10 rounded"
                  />

                  <div>

                    <div>{b.title}</div>

                    <div className="text-xs text-gray-500">
                      {b.artist}
                    </div>

                  </div>

                </div>

              </td>

              <td>{b.isrc}</td>

              <td>{b.date}</td>

              <td>{b.beat}</td>

              <td>

                <span className="bg-gray-700 px-3 py-1 rounded-lg text-xs">
                  {b.status}
                </span>

              </td>

            </tr>
          ))}

        </tbody>

      </table>

    </div>

  )

}