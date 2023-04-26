<script setup>
import { defineProps, toRefs, computed } from 'vue'
import { NSlider } from 'naive-ui'
//Parent to child variable
const props = defineProps({
  title: String,
  valueFormatter: Function,
  value: Number,
  max: Number,
  min: Number
})

const emit = defineEmits(['update:value'])
//Responsive
const { title, valueFormatter, value, max } = toRefs(props)
//Value formatter format unification
const formatted = computed(() => {
  const formatter = valueFormatter.value ? valueFormatter.value : id => id

  return formatter(value.value)
})

//Update value
const onValueChange = (value) => emit('update:value', value)

</script>

<template>
  <div class="slider">
    <div class="slider-label" v-if="title">{{ title }}</div>
    <n-slider :tooltip="false" :value="value" @update-value="onValueChange" :max="max" :min="min"></n-slider>
    <div class="slider-value">{{ formatted }}</div>
  </div>
</template>

<style>
.slider {
  height: 36px;
  display: flex;
  align-items: center;
}

.slider .slider-label {
  flex-shrink: 0;
  margin-right: 4px;
  width: 60px;
}

.slider .slider-value {
  flex-shrink: 0;
  width: 52px;
  margin-left: 4px;
  text-align: right;
  font-size: 12px;
}
</style>