export type Beat = {
  id:string
  title:string
  artist:string
  cover:string
  isrc:string
  date:string
  beat:string
  status:string
}

export function getBeats():Beat[]{

  if(typeof window === "undefined") return []

  const data = localStorage.getItem("beats")

  return data ? JSON.parse(data) : []

}

export function saveBeat(beat:Beat){

  const beats = getBeats()

  beats.unshift(beat)

  localStorage.setItem("beats",JSON.stringify(beats))

}