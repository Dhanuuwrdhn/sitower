import Cookies from 'js-cookie'

export const getUser = () => {
  try {
    const raw = Cookies.get('sitower_user')
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

export const getToken = () => Cookies.get('sitower_token')
export const isAdmin = () => getUser()?.role === 'admin'
export const isSuperadmin = () => getUser()?.role === 'superadmin'
export const isAdminOrSuperadmin = () => isAdmin() || isSuperadmin()
export const isTeknisi = () => getUser()?.role === 'teknisi'
export const isLoggedIn = () => !!getToken()

export const saveAuth = (token: string, user: any) => {
  Cookies.set('sitower_token', token, { expires: 7 })
  Cookies.set('sitower_user', JSON.stringify(user), { expires: 7 })
}

export const logout = () => {
  Cookies.remove('sitower_token')
  Cookies.remove('sitower_user')
  window.location.href = '/login'
}
