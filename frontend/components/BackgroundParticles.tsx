"use client"

import { useCallback } from "react"
import Particles from "react-tsparticles"
import { loadFull } from "tsparticles"

export default function BackgroundParticles(){

  const particlesInit = useCallback(async (engine:any)=>{
    await loadFull(engine)
  },[])

  return(

    <Particles
      id="tsparticles"
      init={particlesInit}
      options={{
        background:{color:"transparent"},

        fpsLimit:60,

        particles:{
          number:{
            value:70,
            density:{enable:true,area:800}
          },

          color:{value:"#14E6C3"},

          links:{
            enable:true,
            color:"#14E6C3",
            distance:160,
            opacity:0.15,
            width:1
          },

          move:{
            enable:true,
            speed:0.6
          },

          opacity:{
            value:0.3
          },

          size:{
            value:{min:1,max:3}
          }
        }
      }}

      className="fixed top-0 left-0 w-full h-full -z-10"
    />

  )

}