const VISITOR_COOKIE_NAME = 'flower_visitor_id'
const MAX_AGE = 315360000 // 10 años en segundos

export function generateVisitorId(): string {
  return crypto.randomUUID()
}

export function getVisitorCookie(): string | null {
  if (typeof document === 'undefined') return null
  
  const name = VISITOR_COOKIE_NAME + '='
  const decodedCookie = decodeURIComponent(document.cookie)
  const cookieArray = decodedCookie.split(';')
  
  for (let cookie of cookieArray) {
    cookie = cookie.trim()
    if (cookie.indexOf(name) === 0) {
      return cookie.substring(name.length)
    }
  }
  return null
}

export function setVisitorCookie(visitorId: string): void {
  if (typeof document === 'undefined') return
  
  const date = new Date()
  date.setTime(date.getTime() + (MAX_AGE * 1000))
  const expires = 'expires=' + date.toUTCString()
  
  document.cookie = `${VISITOR_COOKIE_NAME}=${visitorId};${expires};path=/;SameSite=Lax`
}

export function clearVisitorCookie(): void {
  if (typeof document === 'undefined') return
  document.cookie = `${VISITOR_COOKIE_NAME}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/`
}
