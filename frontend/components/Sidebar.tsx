"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

export default function Sidebar(){

  const pathname = usePathname()

  return(

    <div
      style={{
        width:"220px",
        background:"#050505",
        height:"100vh",
        padding:"25px",
        borderRight:"1px solid #111",
        display:"flex",
        flexDirection:"column",
        justifyContent:"space-between"
      }}
    >

      <div>

        <h2 style={{
          color:"#00e676",
          marginBottom:"30px"
        }}>
          BeatSignal
        </h2>

        <nav style={{display:"flex",flexDirection:"column",gap:"12px"}}>

          <Link href="/dashboard">
            <div style={{
              padding:"10px",
              borderRadius:"6px",
              background: pathname==="/dashboard" ? "#111" : "transparent"
            }}>
              Dashboard
            </div>
          </Link>

          <Link href="/dashboard/results">
            <div style={{
              padding:"10px",
              borderRadius:"6px",
              background: pathname==="/dashboard/results" ? "#111" : "transparent"
            }}>
              Results
            </div>
          </Link>

        </nav>

      </div>

      <div
        style={{
          background:"#0b0b0b",
          padding:"15px",
          borderRadius:"8px",
          fontSize:"13px"
        }}
      >
        <div>Plan</div>
        <div style={{color:"#00e676"}}>Free</div>
      </div>

    </div>

  )

}