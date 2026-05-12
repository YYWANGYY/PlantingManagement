<template>
  <div>
    <button
      @click.stop="emit('select', node.value, node.label)"
      :class="[
        'flex w-full items-center gap-1.5 rounded-sm px-2 py-1.5 text-xs transition-colors',
        isSelected ? 'bg-primary/10 text-primary font-medium' : 'hover:bg-muted'
      ]"
      :style="{ paddingLeft: `${level * 16 + 8}px` }"
    >
      <span
        v-if="node.children?.length"
        @click.stop="emit('toggle', node.value)"
        class="flex h-4 w-4 shrink-0 items-center justify-center rounded hover:bg-muted"
      >
        <ChevronRight :size="12" :class="{ 'rotate-90': isExpanded }" class="transition-transform" />
      </span>
      <span v-else class="w-4 shrink-0" />
      <span class="truncate">{{ node.label }}</span>
    </button>
    <div v-if="node.children?.length && isExpanded">
      <TreeSelectNode
        v-for="child in node.children"
        :key="child.value"
        :node="child"
        :level="level + 1"
        :selected-value="selectedValue"
        :expanded-keys="expandedKeys"
        @select="emit('select', $event[0], $event[1])"
        @toggle="emit('toggle', $event)"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { ChevronRight } from 'lucide-vue-next'
import type { TreeNode } from './data'

const props = defineProps<{
  node: TreeNode
  level: number
  selectedValue: string
  expandedKeys: Set<string>
}>()

const emit = defineEmits<{
  select: [value: string, label: string]
  toggle: [key: string]
}>()

const isSelected = computed(() => props.selectedValue === props.node.value)
const isExpanded = computed(() => props.expandedKeys.has(props.node.value))
</script>
