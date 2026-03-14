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
        fullScreen:false,

        background:{
          color:"transparent"
        },

        particles:{
          number:{
            value:60
          },

          color:{
            value:"#14E6C3"
          },

          links:{
            enable:true,
            color:"#14E6C3",
            distance:150,
            opacity:0.2
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

      className="fixed inset-0 -z-10"
    />

  )

}