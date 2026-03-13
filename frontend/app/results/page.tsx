"use client"

import { useEffect, useState } from "react"

export default function ResultsPage(){

  const [results,setResults] = useState<any[]>([])
  const [search,setSearch] = useState("")

  useEffect(()=>{

    const stored = localStorage.getItem("scanResults")

    if(stored){

      try{
        const parsed = JSON.parse(stored)

        if(Array.isArray(parsed)){
          setResults(parsed)
        }

      }catch(e){
        console.log("Error parsing results")
      }

    }

  },[])

  const filtered = results.filter((r:any)=>{

    const text = (
      (r.song || "") +
      (r.artist || "") +
      (r.isrc || "")
    ).toLowerCase()

    return text.includes(search.toLowerCase())

  })

  return(

    <div style={{padding:"40px"}}>

      <h2 style={{marginBottom:"20px"}}>Results</h2>

      {/* SEARCH BAR */}

      <input
        placeholder="Search by song, artist or ISRC"
        value={search}
        onChange={(e)=>setSearch(e.target.value)}
        style={{
          marginBottom:"30px",
          width:"500px",
          padding:"12px",
          background:"#0b0b0b",
          border:"1px solid #222",
          color:"#fff",
          borderRadius:"6px"
        }}
      />

      <table
        style={{
          width:"100%",
          borderCollapse:"collapse"
        }}
      >

        <thead>

          <tr style={{
            borderBottom:"1px solid #222",
            textAlign:"left"
          }}>
            <th>Song</th>
            <th>ISRC</th>
            <th>Release Date</th>
            <th>Score</th>
            <th>Spotify</th>
          </tr>

        </thead>

        <tbody>

          {filtered.map((r:any,i:number)=>{

            return(

              <tr key={i} style={{borderBottom:"1px solid #111"}}>

                <td style={{
                  display:"flex",
                  alignItems:"center",
                  gap:"12px",
                  padding:"14px 0"
                }}>

                  {r.cover && (

                    <img
                      src={r.cover}
                      style={{
                        width:"42px",
                        height:"42px",
                        borderRadius:"6px"
                      }}
                    />

                  )}

                  <div>

                    <div style={{fontWeight:600}}>
                      {r.song}
                    </div>

                    <div style={{
                      fontSize:"13px",
                      opacity:0.6
                    }}>
                      {r.artist}
                    </div>

                  </div>

                </td>

                <td>{r.isrc || "-"}</td>

                <td>{r.release_date || "-"}</td>

                <td>{r.score}</td>

                <td>

                  {r.spotify_url ? (

                    <a
                      href={r.spotify_url}
                      target="_blank"
                      style={{color:"#1DB954"}}
                    >
                      Open
                    </a>

                  ) : "-"}

                </td>

              </tr>

            )

          })}

        </tbody>

      </table>

    </div>

  )

}