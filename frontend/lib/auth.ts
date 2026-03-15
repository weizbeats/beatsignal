export function getToken(): string | null {

  if (typeof window === "undefined") return null

  return (
    localStorage.getItem("token") ||
    sessionStorage.getItem("token")
  )

}

export function saveToken(token: string, remember: boolean) {

  if (typeof window === "undefined") return

  if (remember) {
    localStorage.setItem("token", token)
  } else {
    sessionStorage.setItem("token", token)
  }

}

export function clearSession() {

  if (typeof window === "undefined") return

  localStorage.removeItem("token")
  localStorage.removeItem("user")
  localStorage.removeItem("plan")
  localStorage.removeItem("admin")

  sessionStorage.removeItem("token")

}

export function isAuthenticated(): boolean {
  return !!getToken()
}