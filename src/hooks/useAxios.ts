// ¿Por qué Axios?
/*
1. abort controller
2. timeout
3. axios.create({ baseUrl: '....' })
4. interceptors
 */

import { AxiosError, type AxiosInstance, type AxiosRequestConfig } from 'axios'
import * as React from 'react'
import useDeepCompareEffect from 'use-deep-compare-effect'

import { setCommonHeaders } from '../utils/headers'
import { useLiveRef } from './useLiveRef'

interface Config extends AxiosRequestConfig {
  instance: AxiosInstance
  method: 'get' | 'post' | 'put' | 'patch' | 'delete'
  url: string
  enabled: boolean // controlar en que momento (ciclo de vida) debe ejecutarse el hook
  onErrorCallback?: () => void
}

interface UseAxios<T> {
  data: T | null
  error: string | AxiosError
  loading: boolean
  // fetcher?: (config) => Promise<void>
}

function newAbortSignal (to: number): AbortSignal {
  const abortController = new AbortController()
  setTimeout(() => { abortController.abort() }, to)
  return abortController.signal
}

export const useAxios = <T>(config: Config): UseAxios<T> => {
  const configRef = useLiveRef(config)
  const { instance } = configRef.current
  // Percentil -> P95: 200ms -> 95% de los usuarios el servicio le respondió en 200ms O MENOS
  // P99 -> Mayor P99 es de 300ms -> al 99% de los usuarios el servicio le respondió en 300ms o menos
  instance.defaults.timeout = 300 // P95 de latencia de la aplicación
  setCommonHeaders(instance)
  const [response, setResponse] = React.useState<T | null>(null)
  const [error, setError] = React.useState<AxiosError | string>('')
  const [loading, setLoading] = React.useState(configRef.current.enabled)

  instance.interceptors.response.use((response) => {
    if (response.status === 200) {
      // sendMetricToDD() // envia una métrica con información del servidor (tiempo de respuesta, mensaje)
    }
    // next()
    return response
  }, async (error) => {
    if (error.response !== null && error.response.status === 500) {
      error.config?.onErrorCallback()
    }
    return await Promise.reject(error)
  })

  const fetch = React.useCallback(async (config: Config): Promise<void> => {
    try {
      const enabled = config.enabled ?? true
      if (!enabled) return
      setLoading(true)

      const res = await instance.request<T>({
        ...config,
        method: config.method.toLowerCase() ?? 'get',
        signal: newAbortSignal(300), // timeout para request,
        headers: {
          ...config.headers,
          ...instance.defaults.headers.common
        }
      })

      setResponse(res.data)
    } catch (err) {
      if (err instanceof AxiosError) {
        setError(err.message)
      } else {
        setError('unknown error at fetch')
      }
    } finally {
      setLoading(false)
    }
  }, [instance, config])

  function pickProps<T> (value: T, keys: Array<keyof T>): Partial<T> {
    return keys.reduce<Partial<T>>(
      (acc, key) => {
        acc[key] = value[key]
        return acc
      }, {}
    )
  }

  const watchedConfigProps = pickProps(config, ['enabled', 'url', 'headers'])
  useDeepCompareEffect(() => {
    // ¿Qué tipo de dato es headers? -> Objeto
    void fetch(configRef.current)
  }, [watchedConfigProps])

  return {
    data: response,
    error,
    loading
  }
}
