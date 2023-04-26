import { defineStore } from 'pinia'
import { useStorage } from './storage'

const Target = {
  blank: '_blank',
  self: '_self'
}

const useSearch = defineStore('search', () => {

  const { value: search } = useStorage('search_config', {
    active: 'google',
    target: Target.blank,
    engine: [
      { name: 'Google', key: 'google', url: 'https://www.google.com/search?q=', selected: true },
      { name: '百度', key: 'baidu', url: 'https://www.baidu.com/s?wd=', selected: false },
      { name: '必应', key: 'bing', url: 'https://www.bing.com/search?q=', selected: false },
      { name: 'StackOverflow', key: 'stackoverflow', url: 'https://stackoverflow.com/nocaptcha?s=', selected: false },
      { name: 'Yahoo', key: 'yahoo', url: 'https://hk.search.yahoo.com/search?p=', selected: false },
      { name: 'Argos', key: 'Argos', url: 'https://www.argos.co.uk/search/', selected: false, icon: 'https://files.codelife.cc/icons/5834b512f2066c5c.png', backgroundColor: 'rgb(212, 32, 20)' },
    ]
  })

  const getActiveEngine = () => {
    for (let engine of search.engine) {
      if (engine.key === search.active) {
        return engine
      }
    }
  }

  const doSearch = (query) => {
    const engine = getActiveEngine()

    if (engine) {
      const { url } = engine

      window.open(`${url}${query}`, search.target)
    }

  }


  return { search, doSearch, getActiveEngine }


})

export { useSearch }