import { type AxiosInstance } from 'axios'

export const setCommonHeaders = (instance: AxiosInstance): void => {
  const customInstace = instance
  customInstace.defaults.headers.common.Authorization = `Bearer ${localStorage.getItem('authorization') ?? null}`
  // Cache-Control: no-cache
  // Pragma = 'no-cache'
  customInstace.defaults.headers.common.Accept = 'application/json'
}
