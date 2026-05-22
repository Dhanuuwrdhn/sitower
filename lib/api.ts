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
    // Only treat 401 (invalid/expired token) as session-end.
    // 403 (forbidden) means the role lacks permission for THIS resource — keep session.
    if (err.response?.status === 401) {
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
  requestChangePassword: (data: { passwordLama: string; passwordBaru: string; konfirmasiPasswordBaru: string }) =>
    api.post('/auth/request-change-password', data),
  listPasswordChangeRequests: () => api.get('/auth/password-change-requests'),
  approvePasswordChangeRequest: (id: string) => api.post(`/auth/password-change-requests/${id}/approve`),
  rejectPasswordChangeRequest: (id: string) => api.post(`/auth/password-change-requests/${id}/reject`),
  deletePasswordChangeRequest: (id: string) => api.delete(`/auth/password-change-requests/${id}`),
}

export const unitsApi = {
  list:   ()                                  => api.get('/units'),
  create: (nama: string)                      => api.post('/units', { nama }),
  update: (id: string, nama: string)          => api.patch(`/units/${id}`, { nama }),
  delete: (id: string)                        => api.delete(`/units/${id}`),
}

export const towersApi = {
  getAll:    (params?: any) => api.get('/aset/towers', { params }),
  getMap:    ()             => api.get('/aset/towers/map'),
  getDropdown: ()           => api.get('/aset/towers/dropdown'),
  getById:  (id: string)    => api.get(`/aset/towers/${encodeURIComponent(id)}`),
  create:   (data: any)     => api.post('/aset/towers', data, { headers: { 'Content-Type': 'multipart/form-data' } }),
  update:   (id: string, data: any) => api.put(`/aset/towers/${encodeURIComponent(id)}`, data, { headers: { 'Content-Type': 'multipart/form-data' } }),
  delete:   (id: string)    => api.delete(`/aset/towers/${encodeURIComponent(id)}`),
}

export const asetApi = {
  getStats:    ()             => api.get('/aset/stats'),
  getLineTypes: ()            => api.get('/aset/line-types'),
  getGardu:    ()             => api.get('/aset/gardu-induk'),
  getGarduById: (id: number)  => api.get(`/aset/gardu-induk/${id}`),
  getRoutes:   ()             => api.get('/aset/routes'),
  getRouteById: (id: number)  => api.get(`/aset/routes/${id}`),
  getTowers:   (params?: any) => api.get('/aset/towers', { params }),
  getTowerById: (id: string)  => api.get(`/aset/towers/${encodeURIComponent(id)}`),
  getMapOverview: ()          => api.get('/aset/map/overview'),
  getMapRoutes: ()            => api.get('/aset/map/routes'),
  getMapFilter: (type: string) => api.get('/aset/map/filter', { params: { type } }),
  importExcel: (file: File) => {
    const fd = new FormData()
    fd.append('file', file)
    return api.post('/aset/import', fd, { headers: { 'Content-Type': 'multipart/form-data' } })
  },
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
  getProgress:   (id: string) => api.get(`/laporan/${id}/progress`),
  uploadProgress: (id: string, tipe: string, file: File) => {
    const form = new FormData()
    form.append('tipe', tipe)
    form.append('file', file)
    return api.post(`/laporan/${id}/progress`, form, { headers: { 'Content-Type': 'multipart/form-data' } })
  },
  deleteProgress: (id: string, progressId: string) => api.delete(`/laporan/${id}/progress/${progressId}`),
  getFotoHistory: (id: string) => api.get(`/laporan/${id}/foto-history`),
  uploadFotoUpdate: (id: string, files: File[]) => {
    const form = new FormData()
    files.forEach((f) => form.append('foto', f))
    return api.post(`/laporan/${id}/foto-update`, form, { headers: { 'Content-Type': 'multipart/form-data' } })
  },
  getRiwayat:    (id: string) => api.get(`/laporan/${id}/riwayat`),
  addRiwayat:    (id: string, data: FormData) => api.post(`/laporan/${id}/riwayat`, data, { headers: { 'Content-Type': 'multipart/form-data' } }),
  deleteRiwayat: (id: string, riwayatId: string) => api.delete(`/laporan/${id}/riwayat/${riwayatId}`),
}

export const cuiApi = {
  getAll: (params?: { search?: string; status?: string; jalur?: string; tglMulai?: string; tglAkhir?: string; page?: number; limit?: number }) =>
    api.get('/cui', { params }),
  getById: (id: string) => api.get(`/cui/${id}`),
  create: (data: { towerId: string; tanggal: string; keterangan?: string; status?: string }) =>
    api.post('/cui', data),
  update: (id: string, data: Partial<{ towerId: string; tanggal: string; keterangan: string; status: string }>) =>
    api.patch(`/cui/${id}`, data),
  delete: (id: string) => api.delete(`/cui/${id}`),
}

export const cleanupApi = {
  getAll: (params?: { search?: string; status?: string; sirkit?: string; jalur?: string; tglMulai?: string; tglAkhir?: string; page?: number; limit?: number }) =>
    api.get('/cleanup', { params }),
  getById: (id: string) => api.get(`/cleanup/${id}`),
  create: (data: { towerId: string; sirkit: string; tanggal: string; keterangan?: string; status?: string }) =>
    api.post('/cleanup', data),
  update: (id: string, data: Partial<{ towerId: string; sirkit: string; tanggal: string; keterangan: string; status: string }>) =>
    api.patch(`/cleanup/${id}`, data),
  delete: (id: string) => api.delete(`/cleanup/${id}`),
}

export const sertifikatApi = {
  getByTower: (towerId: string) => api.get(`/aset/towers/${encodeURIComponent(towerId)}/sertifikat`),
  create: (towerId: string, data: any, files?: File[]) => {
    const fd = new FormData()
    Object.keys(data).forEach(key => {
      if (data[key] !== undefined && data[key] !== null) fd.append(key, data[key])
    })
    if (files) files.forEach(f => fd.append('files', f))
    return api.post(`/aset/towers/${encodeURIComponent(towerId)}/sertifikat`, fd, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
  },
  update: (id: string, data: any, files?: File[]) => {
    const fd = new FormData()
    Object.keys(data).forEach(key => {
      if (data[key] !== undefined && data[key] !== null) fd.append(key, data[key])
    })
    if (files) files.forEach(f => fd.append('files', f))
    return api.put(`/aset/sertifikat/${id}`, fd, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
  },
  delete: (id: string) => api.delete(`/aset/sertifikat/${id}`),
  deleteDokumen: (id: string) => api.delete(`/aset/sertifikat/dokumen/${id}`),
  previewDokumen: async (id: string): Promise<string> => {
    const token = Cookies.get('sitower_token')
    const base  = process.env.NEXT_PUBLIC_API_URL ?? ''
    const res   = await fetch(`${base}/aset/sertifikat/dokumen/${id}/preview`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    if (!res.ok) throw new Error('File tidak ditemukan')
    const blob = await res.blob()
    return URL.createObjectURL(blob)
  },
}

export const asBuiltApi = {
  getAll:      (params?: any) => api.get('/as-built-drawing', { params }),
  getBreadcrumb: (id: string) => api.get(`/as-built-drawing/breadcrumb/${id}`),
  getFolder:   (id: string)   => api.get(`/as-built-drawing/${id}`),
  create:      (data: any)    => api.post('/as-built-drawing', data),
  deleteFolder:(id: string)   => api.delete(`/as-built-drawing/${id}`),
  uploadRootFiles: (files: File[]) => {
    const form = new FormData()
    files.forEach((f) => form.append('files', f))
    return api.post('/as-built-drawing/dokumen', form, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
  },
  uploadFiles: (id: string, files: File[]) => {
    const form = new FormData()
    files.forEach((f) => form.append('files', f))
    return api.post(`/as-built-drawing/${id}/dokumen`, form, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
  },
  /** @deprecated use uploadFiles */
  uploadFile: (id: string, file: File) => {
    const form = new FormData()
    form.append('files', file)
    return api.post(`/as-built-drawing/${id}/dokumen`, form, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
  },
  deleteDokumen: (id: string) => api.delete(`/as-built-drawing/dokumen/${id}`),
  bulkDelete: (folderIds: string[], dokumenIds: string[]) =>
    api.post('/as-built-drawing/bulk-delete', { folderIds, dokumenIds }),
  previewDokumen: async (id: string): Promise<string> => {
    const token = Cookies.get('sitower_token')
    const base  = process.env.NEXT_PUBLIC_API_URL ?? ''
    const res   = await fetch(`${base}/as-built-drawing/dokumen/${id}/preview`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    if (!res.ok) throw new Error('File tidak ditemukan')
    const blob = await res.blob()
    return URL.createObjectURL(blob)
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
  downloadTemplate: (type: string) =>
    api.get(`/import/template/${type}`, { responseType: 'blob' }),
}

export const jalurKmlApi = {
  getAll: () => api.get('/jalur-kml'),
  upload: (file: File) => {
    const fd = new FormData()
    fd.append('file', file)
    return api.post('/jalur-kml/upload', fd, { headers: { 'Content-Type': 'multipart/form-data' } })
  },
  importSktt: (file: File) => {
    const fd = new FormData()
    fd.append('file', file)
    return api.post('/jalur-kml/import-sktt', fd, { headers: { 'Content-Type': 'multipart/form-data' } })
  },
  remove: (id: number) => api.delete(`/jalur-kml/${id}`),
}
