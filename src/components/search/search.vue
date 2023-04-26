<script setup>
import { NIcon, NModal, NCard, NCheckbox, NCheckboxGroup } from 'naive-ui'
import { CaretDownOutline, SearchOutline, AddCircleOutline } from '@vicons/ionicons5'
import { ref } from 'vue';
import { computed } from '@vue/reactivity';
import { useSearch } from '../../base/services/search'
import { useNLS } from '../../base/hooks/nls';
import cls from 'classnames'

const { search, doSearch, getActiveEngine } = useSearch()
const { localize } = useNLS()

const active = ref(false)
const listRef = ref()
const inputValue = ref()
const cardRef = ref()
const showEngineModal = ref(false)

const showList = () => active.value = true
const hideList = () => active.value = false

const engines = computed(() => search.engine.filter(engine => engine.selected))
const activeEngine = computed(() => getActiveEngine())
const checked = computed(() => {
  const value = []
  for (let engine of search.engine) {
    if (engine.selected) {
      value.push(engine.key)
    }
  }

  return value
})

const handleEngineCheck = (value) => {
  if (!value.length) {
    return
  }

  if (value.length > 8) {
    return
  }
  for (let engine of search.engine) {
    if (value.includes(engine.key)) {
      engine.selected = true
    } else {
      engine.selected = false
    }
  }
}

const onEngineClick = () => {
  showList()

  const onDocumentClick = (event) => {
    const target = event.target

    if (listRef.value) {
      if (active.value) {
        if (cardRef.value) {
          if (!cardRef.value.contains(target)) {
            hideList()
          }
        }
      }
      if (!listRef.value.contains(target)) {
        hideList()
      }
    }

    window.removeEventListener('click', onDocumentClick)
  }

  document.addEventListener('click', onDocumentClick, true)
}

const listClassName = computed(() => cls('search-engine-list', { active: active.value }))

const handleSearch = () => {
  const query = inputValue.value || ''
  doSearch(query)
}

const changeEngine = (engine) => {
  const { key } = engine

  search.active = key

  hideList()
}

const showAddEngineModal = () => {
  showEngineModal.value = true
}

const iconUrl = (engine) => {
  if (!engine) {
    return
  }
  if (engine.icon) {
    return engine.icon
  }

  return `https://files.codelife.cc/itab/search/${engine.key}.svg`
}


</script>

<template>
  <div class="search">
    <div class="search-box">
      <div class="search-engine" @click="onEngineClick">
        <img :src="iconUrl(activeEngine)" alt="">
        <n-icon :component="CaretDownOutline" class="search-engine-arrow" />
      </div>
      <div class="search-input">
        <input type="text" :placeholder="localize('search.placeholder')" v-model="inputValue"
          @keydown.enter="handleSearch">
      </div>
      <div class="search-icon" @click="handleSearch">
        <n-icon :component="SearchOutline" />
      </div>
    </div>
    <div :class="listClassName" ref="listRef">
      <ul class="search-engine-all">
        <li class="search-engine-item" v-for="engine of engines" @click="() => changeEngine(engine)">
          <div class="search-engine-icon" :style="{ backgroundColor: engine.backgroundColor }">
            <img :src="iconUrl(engine)" alt="">
          </div>
          <div class="search-engine-name">{{ engine.name }}</div>
        </li>
        <li class="search-engine-item" @click="showAddEngineModal">
          <div class="search-engine-icon add">
            <n-icon :component="AddCircleOutline" />
          </div>
          <div class="search-engine-name">{{ localize('search.engine.add') }}</div>
        </li>
      </ul>
    </div>
    <n-modal v-model:show="showEngineModal">
      <n-card :style="{ width: '1000px' }" ref="cardRef">
        <div class="engine-add-title">{{ localize('search.engine.add.title') }}</div>
        <div class="engine-add-desc">{{ localize('search.engine.add.desc') }}</div>

        <n-checkbox-group :value="checked" @update-value="handleEngineCheck">
          <ul class="engine-list">
            <li v-for="engine of search.engine" :key="engine.key">
              <div class="engine-item">
                <n-checkbox :value="engine.key" class="engine-item-checkbox">
                  <div class="engine-item-wrapper">
                    <div class="engine-item-icon" :style="{ backgroundColor: engine.backgroundColor }">
                      <img :src="iconUrl(engine)" alt="">
                    </div>
                    <div :style="{ flexGrow: 1 }">
                      <div class="engine-item-name">{{ engine.name }}</div>
                      <div class="engine-item-url">{{ engine.url }}</div>
                    </div>
                  </div>
                </n-checkbox>
              </div>
            </li>

          </ul>
        </n-checkbox-group>
      </n-card>
    </n-modal>
  </div>
</template>

<style>
.search {
  margin: 3vh auto 20px;
  width: 600px;
  height: 48px;

  position: relative;
}

.search-box {
  box-shadow: 0 0 10px 3px #0000001a;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  border-radius: 26px;
  overflow: hidden;
  background-color: rgba(255, 255, 255, 0.6);
}

.search-engine {
  width: 50px;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  transition: all 0.3s;
  transform-origin: top;
}

.search-engine:hover {
  background-color: rgba(255, 255, 255, 0.4);
}

.search-engine-list {
  position: absolute;
  left: 0;
  right: 0;
  top: 100%;
  height: 200px;
  z-index: 10;
  transform: scaleY(0);
  transition: all 0.3s;
  transform-origin: top;
}

.search-engine-list.active {
  transform: scaleY(1);

}

.search-engine-all {
  list-style: none;
  border-radius: 26px;
  background-color: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(8px);
  margin: 8px 0;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  padding: 8px 16px;
}

.search-engine-item {
  width: 64px;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  cursor: pointer;
  transition: all 0.3s;
  border-radius: 8px;
  padding: 8px 0;
}

.search-engine-item:hover {
  background-color: rgba(255, 255, 255, 0.4);

}

.search-engine-icon {
  height: 36px;
  width: 36px;
  border-radius: 4px;
  background-color: #fff;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 12px;
}

.search-engine-icon.add {
  font-size: 24px;
  color: var(--primary-color);
}

.search-engine-icon img {
  width: 20px;
  height: 20px;
  margin: auto;
}

.search-engine-arrow {
  position: absolute;
  right: 2px;
  top: 50%;
  margin-top: -5px;
  color: rgba(0, 0, 0, 0.2);
  font-size: 12px;
}

.search-engine img {
  height: 20px;
  width: 20px;
}


.search-input {
  flex-grow: 1;
  height: 100%;
  display: flex;
  align-items: stretch;
}

.search-input input {
  width: 100%;
  height: 100%;
  outline: none;
  border: 0;
  background-color: transparent;
}

.search-icon {
  width: 50px;
  height: 100%;
  font-size: 16px;
  display: flex;
  justify-content: center;
  align-items: center;
  color: rgba(0, 0, 0, 0.52);
  transition: all 0.3s;
  cursor: pointer;
}

.search-engine-name {
  width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  text-align: center;
}

.search-icon:hover {
  background-color: rgba(255, 255, 255, 0.4)
}

.engine-list {
  list-style: none;
  display: flex;
  flex-wrap: wrap;
  padding-left: 10px;
  padding-bottom: 10px;

}

.engine-list li {
  width: 50%;
  padding-right: 10px;
  padding-top: 10px;
  box-sizing: border-box;
}

.engine-item {
  height: 52px;
  border-radius: 4px;
  cursor: pointer;
  padding-left: 8px;
  display: flex;
  align-items: center;
  width: 100%;
  background-color: #f5f5f5;
  box-sizing: border-box;
}

.engine-item-checkbox {
  display: flex;
  align-items: center;
  width: 100%;

}

.engine-item-wrapper {
  display: flex;
  align-items: center;
}

.engine-item-icon {
  width: 28px;
  height: 28px;
  margin-right: 8px;
  border-radius: 4px;
  background-color: #fff;
  display: flex;
  justify-content: center;
  align-items: center;
}

.engine-item-icon img {
  height: 80%;
  width: 80%;
}

.engine-item-name {
  font-size: 13px;
}

.engine-item-url {
  color: var(--sub-color);
  font-size: 12px;
}

.engine-add-title {
  color: #222;
}

.engine-add-desc {
  font-size: 12px;
  color: var(--sub-color);
}
</style>