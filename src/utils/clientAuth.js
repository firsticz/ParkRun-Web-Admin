import jwtDecode from 'jwt-decode'

const clientAuth = {
  login () {
    let authUser = {}
    const token = localStorage.getItem('token')
    if (!token) {
      return authUser
    }
    try {
      authUser = jwtDecode(token)
    }
    catch (e) {
      console.error(e.message)
      localStorage.clear()
    }
    return authUser
  },

  logout () {
    localStorage.removeItem('token')
  }
}

export default clientAuth