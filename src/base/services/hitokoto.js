import { defineStore } from 'pinia'
import { useStorage } from './storage'
import { request } from '../common/request'

const useHitokoto = defineStore('hitokoto', () => {
  const { value: config } = useStorage('hitokoto_config', {
    content: 'Do not go gentle into that good night.',
    author: ''
  })

  // const update = async () => {
  //   const response = await request({ method: 'get', url: 'https://v1.hitokoto.cn/?encode=json&lang=en' })
  //
  //   const data = response.data
  //
  //   config.content = data.hitokoto
  //   config.author = data.from
  // }

  return { config}
})

export { useHitokoto }