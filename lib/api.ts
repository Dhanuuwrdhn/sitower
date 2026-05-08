import axios from 'axios'
import Cookies from 'js-cookie'

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
})

api.interceptors.request.use((config) => {
  const token = Cookies.get('sitower_token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      // Only redirect to login if not already on login page
      if (typeof window !== 'undefined' && !window.location.pathname.startsWith('/login')) {
        Cookies.remove('sitower_token')
        Cookies.remove('sitower_user')
        window.location.href = '/login'
      }
    }
    return Promise.reject(err)
  },
)

export const authApi = {
  login: (nik: string, password: string) => api.post('/auth/login', { nik, password }),
  profile: () => api.get('/auth/profile'),
  changePassword: (data: any) => api.put('/auth/password', data),
}

export const towersApi = {
  getAll: (params?: any) => api.get('/towers', { params }),
  getMap: () => api.get('/towers/map'),
  getDropdown: () => api.get('/towers/dropdown'),
  getById: (id: string) => api.get(`/towers/${id}`),
  create: (data: any) => api.post('/towers', data),
  update: (id: string, data: any) => api.put(`/towers/${id}`, data),
  delete: (id: string) => api.delete(`/towers/${id}`),
}

export const laporanApi = {
  getAll: (params?: any) => api.get('/laporan', { params }),
  getStats: () => api.get('/laporan/stats'),
  getById: (id: string) => api.get(`/laporan/${id}`),
  create: (data: any) => api.post('/laporan', data),
  update: (id: string, data: any) => api.put(`/laporan/${id}`, data),
  delete: (id: string) => api.delete(`/laporan/${id}`),
  uploadFoto: (files: File[]) => {
    const form = new FormData()
    files.forEach((f) => form.append('foto', f))
    return api.post('/laporan/upload-foto', form, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
  },
}

export const sertifikatApi = {
  getAll: (params?: any) => api.get('/sertifikat', { params }),
  create: (data: any) => api.post('/sertifikat', data),
  uploadFile: (id: string, file: File) => {
    const form = new FormData()
    form.append('file', file)
    return api.post(`/sertifikat/${id}/upload`, form, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
  },
}

export const asBuiltApi = {
  getAll: (params?: any) => api.get('/as-built-drawing', { params }),
  create: (data: any) => api.post('/as-built-drawing', data),
  uploadFile: (id: string, file: File) => {
    const form = new FormData()
    form.append('file', file)
    return api.post(`/as-built-drawing/${id}/upload`, form, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
  },
}

export const pegawaiApi = {
  getAll: () => api.get('/pegawai'),
  create: (data: any) => api.post('/pegawai', data),
  update: (id: string, data: any) => api.put(`/pegawai/${id}`, data),
  delete: (id: string) => api.delete(`/pegawai/${id}`),
  toggleAktif: (id: string) => api.put(`/pegawai/${id}/toggle-aktif`),
}

export const importApi = {
  import: (type: string, file: File) => {
    const form = new FormData()
    form.append('file', file)
    return api.post(`/import/${type}`, form, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
  },
}
