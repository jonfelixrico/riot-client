import { AxiosInstance } from 'axios'
import { inject, InjectionKey } from 'vue'
import axios from 'axios'

export const API_AXIOS: InjectionKey<AxiosInstance> = Symbol('axios')

export function useApi() {
  return inject(API_AXIOS, axios)
}
