export function getToken(): string | null {
  if (typeof window === "undefined") return null

  return (
    localStorage.getItem("token") ||
    sessionStorage.getItem("token")
  )
}

export function saveToken(token: string, remember: boolean) {
  if (remember) {
    localStorage.setItem("token", token)
  } else {
    sessionStorage.setItem("token", token)
  }
}

export function clearSession() {
  localStorage.removeItem("token")
  localStorage.removeItem("user")

  sessionStorage.removeItem("token")
}

export function isAuthenticated(): boolean {
  return !!getToken()
}