import { defineStore } from 'pinia'
import { computed, reactive, toRef, watch } from 'vue'
import { useStorage } from './storage'
import { useNLS } from '../hooks/nls'
import dayjs from 'dayjs'
import 'dayjs/locale/en'
import 'dayjs/locale/zh-cn'

const useTime = defineStore('time', () => {

  const { config: nlsConfig } = useNLS()
  const local = toRef(nlsConfig, 'local')

  const dates = ['日', ' 一', '二', '三', '四', '五', '六']

  const { value: config } = useStorage('time_config', {
    formatted: '',
    format: {
      month: false,
      week: false,
      hour: false,
      second: false,
    },
    date: '',
    week: ''
  })

  const time = reactive({
    ...config,
    current: undefined
  })

  const format = computed(() => {
    let base = time.format.hour ? 'HH:mm' : 'hh:mm'

    if (time.format.second) {
      base += ':ss'
    }

    return base
  })

  const start = () => {
    const updateTime = () => {
      doUpdateCurrentTime()

      requestAnimationFrame(updateTime)
    }

    requestAnimationFrame(updateTime)
  }

  const doUpdateCurrentTime = () => {
    const current = dayjs().millisecond(0)
    if (!current.isSame(time.current)) {
      time.current = current
    }
    time.formatted = current.format(format.value)
    time.date = `${current.format('MMMM')} ${current.format('DD')}`
    time.week = `${current.format('dddd')}`
  }

  const init = () => {
    doUpdateCurrentTime()
  }

  watch(local, (local) => {
    const dayjsLocal = local === 'en-us' ? 'en' : 'zh-cn'
    dayjs.locale(dayjsLocal)
  }, { immediate: true })

  init()

  return { time, init, start }
})

export { useTime }