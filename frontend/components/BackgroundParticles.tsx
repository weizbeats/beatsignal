"use client"

import Particles from "react-tsparticles"
import { loadFull } from "tsparticles"

export default function BackgroundParticles(){

  async function particlesInit(engine:any){
    await loadFull(engine)
  }

  return(

    <Particles
      id="tsparticles"
      init={particlesInit}
      className="fixed inset-0 -z-10"
      options={{

        background:{
          color:"#050505"
        },

        fpsLimit:60,

        particles:{

          number:{
            value:40
          },

          color:{
            value:"#22c55e"
          },

          opacity:{
            value:0.15
          },

          size:{
            value:2
          },

          move:{
            enable:true,
            speed:0.4,
            direction:"none",
            random:true,
            outModes:{
              default:"out"
            }
          }

        }

      }}
    />

  )

}