import { defineStore } from 'pinia'
import { ref } from 'vue'
import axios from 'axios'

export const useAdStore = defineStore('ad', () => {
  const currentAd = ref(null)
  const isLoading = ref(false)
  const error = ref(null)

  async function fetchRandomAd() {
    isLoading.value = true
    error.value = null
    
    try {
      const response = await axios.get('http://ads.wztj.net:8000/Servletclass-1.0-SNAPSHOT/randomAd')
      currentAd.value = response.data
    } catch (e) {
      error.value = '获取广告失败'
      console.error('Error fetching ad:', e)
    } finally {
      isLoading.value = false
    }
  }

  function clearAd() {
    currentAd.value = null
  }

  return {
    currentAd,
    isLoading,
    error,
    fetchRandomAd,
    clearAd
  }
}) 