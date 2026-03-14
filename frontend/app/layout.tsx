import "./globals.css"
import dynamic from "next/dynamic"

const BackgroundParticles = dynamic(
() => import("@/components/BackgroundParticles"),
{ ssr: false }
)

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
