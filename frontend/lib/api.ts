export async function scanBeat(url: string) {

  const response = await fetch("http://localhost:8000/scan", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ url })
  })

  if (!response.ok) {
    throw new Error("Scan failed")
  }

  return response.json()
}