export async function scanBeat(url: string) {

const token =
localStorage.getItem("token") ||
sessionStorage.getItem("token")

const response = await fetch(
`${process.env.NEXT_PUBLIC_API_URL}/scan`,
{
method: "POST",
headers: {
"Content-Type": "application/json"
},
body: JSON.stringify({
url,
token
})
}
)

if (!response.ok) {
throw new Error("Scan failed")
}

return response.json()

}
