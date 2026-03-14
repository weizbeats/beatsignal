"use client"

import Particles from "react-tsparticles"
import { loadSlim } from "tsparticles-slim"

export default function BackgroundParticles(){

async function particlesInit(engine:any){
await loadSlim(engine)
}

return(

```
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
        value:80
      },

      color:{
        value:"#14E6C3"
      },

      links:{
        enable:false
      },

      move:{
        enable:true,
        speed:0.2
      },

      size:{
        value:{
          min:1,
          max:2
        }
      },

      opacity:{
        value:{
          min:0.05,
          max:0.3
        }
      }

    }

  }}

  className="fixed top-0 left-0 w-full h-full -z-10"

/>
```

)

}
