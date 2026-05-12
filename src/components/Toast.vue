<template>
  <Transition name="toast-fade">
    <div
      v-if="visible"
      class="fixed right-6 top-6 z-[9999] flex max-w-md items-start gap-3 rounded-lg border bg-card p-4 shadow-lg"
      :class="typeClass"
    >
      <div class="mt-0.5 shrink-0">
        <CheckCircle2 v-if="type === 'success'" class="h-5 w-5 text-emerald-500" />
        <AlertCircle v-else-if="type === 'warning'" class="h-5 w-5 text-amber-500" />
        <XCircle v-else-if="type === 'error'" class="h-5 w-5 text-red-500" />
        <Info v-else class="h-5 w-5 text-blue-500" />
      </div>
      <div class="flex-1 min-w-0">
        <p v-if="title" class="text-sm font-semibold text-foreground">{{ title }}</p>
        <p class="text-sm text-muted-foreground whitespace-pre-wrap">{{ message }}</p>
      </div>
      <button
        class="shrink-0 text-muted-foreground hover:text-foreground"
        @click="close"
      >
        <X class="h-4 w-4" />
      </button>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { CheckCircle2, AlertCircle, XCircle, Info, X } from 'lucide-vue-next'

const props = withDefaults(defineProps<{
  title?: string
  message: string
  type?: 'success' | 'warning' | 'error' | 'info'
  duration?: number
}>(), {
  title: '',
  type: 'success',
  duration: 4000,
})

const emit = defineEmits<{
  close: []
}>()

const visible = ref(false)

const typeClass = computed(() => {
  const map: Record<string, string> = {
    success: 'border-emerald-200',
    warning: 'border-amber-200',
    error: 'border-red-200',
    info: 'border-blue-200',
  }
  return map[props.type] || map.success
})

function close() {
  visible.value = false
  setTimeout(() => {
    emit('close')
  }, 200)
}

onMounted(() => {
  visible.value = true
  if (props.duration > 0) {
    setTimeout(() => {
      close()
    }, props.duration)
  }
})
</script>

<style scoped>
.toast-fade-enter-active {
  transition: all 0.3s ease-out;
}
.toast-fade-leave-active {
  transition: all 0.2s ease-in;
}
.toast-fade-enter-from {
  opacity: 0;
  transform: translateX(100%);
}
.toast-fade-leave-to {
  opacity: 0;
  transform: translateX(100%);
}
</style>
