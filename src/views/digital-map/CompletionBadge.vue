<template>
  <span :class="badgeClass">{{ percentage }}%</span>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{ rate: number }>()

const percentage = computed(() => Math.round(props.rate * 100))

const badgeClass = computed(() => {
  const p = percentage.value
  if (p >= 85) return 'inline-flex items-center rounded-full bg-green-100 px-1.5 py-0.5 text-[10px] font-medium text-green-700'
  if (p >= 70) return 'inline-flex items-center rounded-full bg-amber-100 px-1.5 py-0.5 text-[10px] font-medium text-amber-700'
  return 'inline-flex items-center rounded-full bg-red-100 px-1.5 py-0.5 text-[10px] font-medium text-red-700'
})
</script>
