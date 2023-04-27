<script setup>
import { toRefs, defineProps, inject, ref, onMounted } from 'vue';
import { useStyle } from '../../base/services/style'
import { computed } from '@vue/reactivity';
import { arrayMoveImmutable } from 'array-move'
import { remove } from 'lodash'
import { IconsInjectKey } from './interface'
import { IconType } from '../../base/services/icons'
import { useGlobal } from '../../base/hooks/global';
import { ContextMenuType } from '../../base/services/contextmenu/contextmenu';
import Icon from './icon.vue'
import Note from './note.vue'
//Drag and drop
import Sortable from 'sortablejs'
import cls from 'classnames'


const props = defineProps({
  icons: Object
})

//Get contextmenu api from contextmenu
const { contextmenu } = useGlobal()
//Injecting values already provided from ancestor components
const { showModal } = inject(IconsInjectKey)

//Two responsive variables for the drag-and-drop sorting function.
const gridRef = ref()
const sorting = ref()

//apply the style to the icon container.
const classname = computed(() => cls('icons-grid', { sorting: sorting.value }))
//Convert to a responsive object
const { icons: group } = toRefs(props)

// Drag and drop (Start and end)
const onDragEnd = (event) => {
  const { oldIndex, newIndex } = event

  group.value.icons = arrayMoveImmutable(group.value.icons, oldIndex, newIndex)

  sorting.value = false
}
const onDragStart = () => {
  sorting.value = true
}
//When click show. If is "add" icon show add model, if url show website
const onIconClick = (icon) => {
  if (icon.key === IconType.Add) {
    showModal()
  } else if (icon.type === IconType.Link && icon.url) {
    let url = icon.url
    if (!/https?:\/\//.exec(icon.url)) {
      url = `https://${icon.url}`
    }
    window.open(url)
  }
}



// Ready to show menu when right click
const onMouseup = (event, icon) => {
  contextmenu.updatePosition(event)
  setTimeout(contextmenu.show, 0, ContextMenuType.Icon, icon)
}

onMounted(() => {
  if (gridRef.value) {
    Sortable.create(gridRef.value, {
      animation: 300,
      onEnd: onDragEnd,
      onStart: onDragStart
    })
  }
})


</script>

<template>
  <div ref="gridRef" :class="classname">
    <transition-group name="flip" @before-leave="onBeforeLeave">
      <template v-for="icon of group.icons" :key="icon.name">
        <Icon v-if="icon.type === IconType.Link || icon.type === IconType.Add" :icon="icon" @icon-click="onIconClick"
          v-model:size="icon.size" @mouseup.right.capture.stop="(event) => onMouseup(event, icon)" />
        <Note v-else-if="icon.type === IconType.Note" :icon="icon" v-model:size="icon.size"
          @mouseup.right.capture.stop="(event) => onMouseup(event, icon)" />
      </template>

    </transition-group>
  </div>
</template>

<style>
.icons-grid {
  padding-top: 2vh;
  width: 100%;
  display: grid;
  grid-template-columns: repeat(auto-fill, var(--icon-size));
  grid-template-rows: repeat(auto-fill, var(--icon-size));
  grid-auto-flow: dense;
  grid-gap: var(--icon-gap-x) var(--icon-gap-y);
  justify-content: center;
}

.sorting .icons-item {
  transition-duration: 0s;
}
</style>