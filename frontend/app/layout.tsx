import "./globals.css"
import BackgroundParticles from "@/components/BackgroundParticles"

export default function RootLayout({ children }: { children: React.ReactNode }) {

return (

```
<html lang="en">

  <body>

    <div className="bg-glow"></div>

    <BackgroundParticles />

    {children}

  </body>

</html>
```

)

}
