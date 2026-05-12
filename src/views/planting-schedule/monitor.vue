<template>
  <div class="space-y-6">
    <!-- 页面标题 -->
    <div>
      <h1 class="text-2xl font-bold tracking-tight">计划监控</h1>
      <p class="mt-1 text-sm text-muted-foreground">实时监控种植计划执行进度，及时发现异常和延期风险</p>
    </div>

    <!-- 概览统计 -->
    <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <!-- 统计卡片-平均进度 -->
      <div class="rounded-xl border bg-card text-card-foreground shadow-sm">
        <div class="flex items-center gap-4 p-5">
          <div class="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-blue-100">
            <BarChart3 class="h-5 w-5 text-blue-600" />
          </div>
          <div>
            <p class="text-sm text-muted-foreground">平均进度</p>
            <p class="text-2xl font-bold">{{ avgProgress }}%</p>
          </div>
        </div>
      </div>
      <!-- 统计卡片-正常执行 -->
      <div class="rounded-xl border bg-card text-card-foreground shadow-sm">
        <div class="flex items-center gap-4 p-5">
          <div class="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-green-100">
            <CheckCircle2 class="h-5 w-5 text-green-600" />
          </div>
          <div>
            <p class="text-sm text-muted-foreground">正常执行</p>
            <p class="text-2xl font-bold">{{ normalCount }}</p>
          </div>
        </div>
      </div>
      <!-- 统计卡片-预警任务 -->
      <div class="rounded-xl border bg-card text-card-foreground shadow-sm">
        <div class="flex items-center gap-4 p-5">
          <div class="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-amber-100">
            <AlertTriangle class="h-5 w-5 text-amber-600" />
          </div>
          <div>
            <p class="text-sm text-muted-foreground">预警任务</p>
            <p class="text-2xl font-bold">{{ warningCount }}</p>
          </div>
        </div>
      </div>
      <!-- 统计卡片-延期任务 -->
      <div class="rounded-xl border bg-card text-card-foreground shadow-sm">
        <div class="flex items-center gap-4 p-5">
          <div class="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-red-100">
            <Clock class="h-5 w-5 text-red-600" />
          </div>
          <div>
            <p class="text-sm text-muted-foreground">延期任务</p>
            <p class="text-2xl font-bold">{{ delayedCount }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- 预警/延期任务 -->
    <div
      v-if="(warningCount + delayedCount) > 0"
      class="rounded-xl border border-amber-200 bg-amber-50/30 text-card-foreground shadow-sm"
    >
      <div class="flex flex-col space-y-1.5 p-6">
        <h3 class="flex items-center gap-2 text-lg font-semibold text-amber-700">
          <AlertTriangle class="h-5 w-5" />
          异常任务提醒
        </h3>
        <p class="text-sm text-amber-600/70">以下任务存在进度风险，请及时处理</p>
      </div>
      <div class="px-6 pb-6">
        <div class="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <!-- 异常任务-玉米拔节期追肥 -->
          <div
            v-for="task in abnormalTasks"
            :key="task.id"
            class="rounded-lg border border-amber-200 bg-white p-4"
          >
            <div class="flex items-center justify-between">
              <span class="font-medium">{{ task.taskName }}</span>
              <span
                :class="[
                  'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors',
                  statusConfig[task.status].bgClass
                ]"
              >
                {{ statusConfig[task.status].label }}
              </span>
            </div>
            <p class="mt-1 text-xs text-muted-foreground">{{ task.plot }} · {{ task.crop }}</p>
            <div class="mt-3 flex items-center gap-3">
              <div class="h-2 flex-1 overflow-hidden rounded-full bg-muted">
                <div
                  class="h-full rounded-full transition-all"
                  :class="progressBarColor(task.status)"
                  :style="{ width: `${task.progress}%` }"
                />
              </div>
              <span class="text-xs font-medium">{{ task.progress }}%</span>
            </div>
            <div class="mt-2 flex items-center justify-between text-xs">
              <span class="text-muted-foreground">预计完成：{{ task.expectedEnd }}</span>
              <span :class="task.daysRemaining < 0 ? 'font-medium text-red-600' : 'text-muted-foreground'">
                {{ task.daysRemaining < 0 ? `已超期${Math.abs(task.daysRemaining)}天` : `剩余${task.daysRemaining}天` }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 全部任务监控列表 -->
    <div class="rounded-xl border bg-card text-card-foreground shadow-sm">
      <div class="flex flex-col space-y-1.5 p-6">
        <h3 class="text-lg font-semibold">任务监控详情</h3>
        <p class="text-sm text-muted-foreground">所有执行中任务的实时进度跟踪</p>
      </div>
      <div class="px-6 pb-6">
        <div class="space-y-4">
          <!-- 列表-水稻分蘖期管理 -->
          <div
            v-for="task in monitorData"
            :key="task.id"
            class="flex items-center gap-4 rounded-lg border p-4 transition-colors hover:bg-accent/50"
          >
            <div
              :class="[
                'flex h-10 w-10 shrink-0 items-center justify-center rounded-full',
                task.status === 'normal' ? 'bg-green-100' : task.status === 'warning' ? 'bg-amber-100' : 'bg-red-100'
              ]"
            >
              <component
                :is="statusConfig[task.status].icon"
                :class="['h-5 w-5', statusConfig[task.status].color]"
              />
            </div>
            <div class="flex-1 space-y-1.5">
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-2">
                  <span class="font-medium">{{ task.taskName }}</span>
                  <span
                    :class="[
                      'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors',
                      statusConfig[task.status].bgClass
                    ]"
                  >
                    {{ statusConfig[task.status].label }}
                  </span>
                </div>
                <div class="flex items-center gap-4 text-xs text-muted-foreground">
                  <span>{{ task.plot }}</span>
                  <span>·</span>
                  <span>{{ task.crop }}</span>
                </div>
              </div>
              <div class="flex items-center gap-3">
                <div class="h-2 flex-1 overflow-hidden rounded-full bg-muted">
                  <div
                    class="h-full rounded-full transition-all"
                    :class="progressBarColor(task.status)"
                    :style="{ width: `${task.progress}%` }"
                  />
                </div>
                <span class="text-sm font-medium tabular-nums">{{ task.progress }}%</span>
              </div>
              <div class="flex items-center justify-between text-xs">
                <span class="text-muted-foreground">预计完成：{{ task.expectedEnd }}</span>
                <span :class="task.daysRemaining < 0 ? 'font-medium text-red-600' : 'text-muted-foreground'">
                  {{ task.daysRemaining < 0 ? `已超期${Math.abs(task.daysRemaining)}天` : `剩余${task.daysRemaining}天` }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, type Component } from 'vue'
import {
  BarChart3,
  CheckCircle2,
  AlertTriangle,
  Clock
} from 'lucide-vue-next'

interface MonitorItem {
  id: number
  taskName: string
  plot: string
  crop: string
  progress: number
  status: 'normal' | 'warning' | 'delayed'
  daysRemaining: number
  expectedEnd: string
}

interface StatusConfig {
  label: string
  color: string
  icon: Component
  bgClass: string
}

// Mock 数据
const monitorData: MonitorItem[] = [
  { id: 1, taskName: '水稻分蘖期管理', plot: 'A1区', crop: '水稻', progress: 75, status: 'normal', daysRemaining: 8, expectedEnd: '2024-05-05' },
  { id: 2, taskName: '玉米拔节期追肥', plot: 'A3区', crop: '玉米', progress: 45, status: 'warning', daysRemaining: 3, expectedEnd: '2024-04-30' },
  { id: 3, taskName: '棉花现蕾期管理', plot: 'B2区', crop: '棉花', progress: 72, status: 'normal', daysRemaining: 10, expectedEnd: '2024-05-08' },
  { id: 4, taskName: '大豆苗期管理', plot: 'B1区', crop: '大豆', progress: 30, status: 'delayed', daysRemaining: -2, expectedEnd: '2024-04-25' },
  { id: 5, taskName: '花生开花期植保', plot: 'C3区', crop: '花生', progress: 60, status: 'normal', daysRemaining: 5, expectedEnd: '2024-05-02' },
  { id: 6, taskName: '水稻晒田', plot: 'C1区', crop: '水稻', progress: 85, status: 'normal', daysRemaining: 2, expectedEnd: '2024-04-28' },
  { id: 7, taskName: '红薯伸蔓期管理', plot: 'D1区', crop: '红薯', progress: 35, status: 'delayed', daysRemaining: -1, expectedEnd: '2024-04-26' },
  { id: 8, taskName: '茶叶春采', plot: 'D3区', crop: '茶叶', progress: 90, status: 'normal', daysRemaining: 1, expectedEnd: '2024-04-27' },
]

const statusConfig: Record<MonitorItem['status'], StatusConfig> = {
  normal: { label: '正常', color: 'text-green-600', icon: CheckCircle2, bgClass: 'bg-green-100 text-green-700 hover:bg-green-100' },
  warning: { label: '预警', color: 'text-amber-600', icon: AlertTriangle, bgClass: 'bg-amber-100 text-amber-700 hover:bg-amber-100' },
  delayed: { label: '延期', color: 'text-red-600', icon: Clock, bgClass: 'bg-red-100 text-red-700 hover:bg-red-100' },
}

// 计算属性
const normalCount = computed(() => monitorData.filter(t => t.status === 'normal').length)
const warningCount = computed(() => monitorData.filter(t => t.status === 'warning').length)
const delayedCount = computed(() => monitorData.filter(t => t.status === 'delayed').length)
const avgProgress = computed(() => Math.round(monitorData.reduce((sum, t) => sum + t.progress, 0) / monitorData.length))
const abnormalTasks = computed(() => monitorData.filter(t => t.status !== 'normal'))

// 进度条颜色根据状态返回
function progressBarColor(status: MonitorItem['status']): string {
  switch (status) {
    case 'normal': return 'bg-green-500'
    case 'warning': return 'bg-amber-500'
    case 'delayed': return 'bg-red-500'
    default: return 'bg-primary'
  }
}
</script>
