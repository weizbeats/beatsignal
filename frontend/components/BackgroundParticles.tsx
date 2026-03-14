"use client"

import Particles from "react-tsparticles"
import { loadSlim } from "tsparticles-slim"

export default function BackgroundParticles(){

  async function particlesInit(engine:any){
    await loadSlim(engine)
  }

  return(

    <Particles
      id="tsparticles"
      init={particlesInit}
      options={{
        background:{
          color:"#000000"
        },

        fpsLimit:60,

        particles:{
          number:{
            value:60
          },

          color:{
            value:"#14E6C3"
          },

          links:{
            enable:true,
            distance:150,
            color:"#14E6C3",
            opacity:0.25,
            width:1
          },

          move:{
            enable:true,
            speed:1,
            direction:"none",
            outModes:"bounce"
          },

          size:{
            value:{min:1,max:3}
          },

          opacity:{
            value:0.6
          }
        }
      }}

      className="fixed top-0 left-0 w-full h-full -z-10"
    />

  )

}