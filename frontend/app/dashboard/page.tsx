"use client"

import { useState } from "react"

export default function Dashboard(){

  const [url,setUrl] = useState("")
  const [results,setResults] = useState<any[]>([])
  const [loading,setLoading] = useState(false)

  async function scan(){

    if(!url) return

    setLoading(true)

    try{

      const res = await fetch("http://127.0.0.1:8000/scan",{
        method:"POST",
        headers:{
          "Content-Type":"application/json"
        },
        body:JSON.stringify({
          url:url
        })
      })

      const data = await res.json()

      setResults(data)

    }catch(err){
      console.log(err)
    }

    setLoading(false)

  }

  return(

    <div style={{padding:"40px"}}>

      <h2>BeatSignal Dashboard</h2>

      {/* INPUT */}

      <div style={{
        display:"flex",
        gap:"10px",
        marginTop:"20px"
      }}>

        <input
          value={url}
          onChange={(e)=>setUrl(e.target.value)}
          placeholder="Paste YouTube link"
          style={{
            width:"600px",
            padding:"12px",
            background:"#111",
            border:"1px solid #333",
            color:"#fff"
          }}
        />

        <button
          onClick={scan}
          style={{
            background:"#00e676",
            border:"none",
            padding:"12px 20px",
            fontWeight:600
          }}
        >
          {loading ? "Scanning..." : "Scan"}
        </button>

      </div>

      {/* RESULTS */}

      <div style={{marginTop:"40px"}}>

        {results.map((r:any,i:number)=>{

          return(

            <div
              key={i}
              style={{
                display:"flex",
                alignItems:"center",
                gap:"20px",
                padding:"20px",
                borderBottom:"1px solid #111"
              }}
            >

              {r.cover && (

                <img
                  src={r.cover}
                  style={{
                    width:"70px",
                    borderRadius:"6px"
                  }}
                />

              )}

              <div style={{flex:1}}>

                <div style={{fontWeight:600,fontSize:"18px"}}>
                  {r.song}
                </div>

                <div style={{opacity:0.7}}>
                  {r.artist}
                </div>

                <div style={{marginTop:"6px",fontSize:"13px"}}>

                  ISRC: {r.isrc || "-"}

                  {" | "}

                  Release: {r.release_date || "-"}

                  {" | "}

                  Score: {r.score}

                </div>

              </div>

              {r.spotify_url && (

                <a
                  href={r.spotify_url}
                  target="_blank"
                  style={{
                    color:"#1DB954"
                  }}
                >
                  Spotify
                </a>

              )}

            </div>

          )

        })}

      </div>

    </div>

  )

}