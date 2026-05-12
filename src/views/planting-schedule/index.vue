<template>
  <div class="space-y-6">
    <!-- 页面标题 -->
    <div>
      <h1 class="text-2xl font-bold tracking-tight">计划清单</h1>
      <p class="mt-1 text-sm text-muted-foreground">跟踪和管理各作物种植进度与农事安排</p>
    </div>

    <!-- 统计卡片 -->
    <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <!-- 统计-总体进度 -->
      <div class="rounded-xl border bg-card text-card-foreground shadow">
        <div class="flex items-center gap-4 p-5">
          <div class="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-blue-100">
            <TrendingUp class="h-5 w-5 text-blue-600" />
          </div>
          <div>
            <p class="text-sm text-muted-foreground">总体进度</p>
            <p class="text-2xl font-bold">{{ overallProgress }}%</p>
          </div>
        </div>
      </div>
      <!-- 统计-进行中 -->
      <div class="rounded-xl border bg-card text-card-foreground shadow">
        <div class="flex items-center gap-4 p-5">
          <div class="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-green-100">
            <CheckCircle2 class="h-5 w-5 text-green-600" />
          </div>
          <div>
            <p class="text-sm text-muted-foreground">进行中</p>
            <p class="text-2xl font-bold">{{ inProgressTasks.length }}</p>
          </div>
        </div>
      </div>
      <!-- 统计-待开始 -->
      <div class="rounded-xl border bg-card text-card-foreground shadow">
        <div class="flex items-center gap-4 p-5">
          <div class="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-gray-100">
            <Clock class="h-5 w-5 text-gray-600" />
          </div>
          <div>
            <p class="text-sm text-muted-foreground">待开始</p>
            <p class="text-2xl font-bold">{{ pendingTasks.length }}</p>
          </div>
        </div>
      </div>
      <!-- 统计-已延期 -->
      <div class="rounded-xl border bg-card text-card-foreground shadow">
        <div class="flex items-center gap-4 p-5">
          <div class="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-red-100">
            <CalendarDays class="h-5 w-5 text-red-600" />
          </div>
          <div>
            <p class="text-sm text-muted-foreground">已延期</p>
            <p class="text-2xl font-bold">{{ delayedTasks.length }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- 任务列表 - 按状态分类 Tab -->
    <div>
      <!-- Tab 导航 -->
      <div class="inline-flex h-10 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground">
        <button
          v-for="tab in tabs"
          :key="tab.value"
          @click="activeTab = tab.value"
          :class="[
            'inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
            activeTab === tab.value
              ? 'bg-background text-foreground shadow-sm'
              : 'hover:bg-background/50'
          ]"
        >
          {{ tab.label }}
        </button>
      </div>

      <!-- Tab 内容 - 进行中 -->
      <div v-if="activeTab === 'in_progress'" class="mt-4">
        <div class="rounded-xl border bg-card text-card-foreground shadow">
          <div class="flex flex-col space-y-1.5 p-6">
            <h3 class="text-lg font-semibold leading-none tracking-tight">进行中的任务</h3>
            <p class="text-sm text-muted-foreground">当前正在执行的种植任务</p>
          </div>
          <div class="p-6 pt-0 space-y-3">
            <!-- 列表-任务4: 棉花灌溉 -->
            <div
              v-for="task in inProgressTasks"
              :key="task.id"
              class="flex items-start gap-4 rounded-lg border p-4 transition-colors hover:bg-accent/50"
            >
              <div class="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-accent">
                <CalendarDays class="h-4 w-4 text-accent-foreground" />
              </div>
              <div class="flex-1 space-y-2">
                <div class="flex items-center justify-between">
                  <div class="flex items-center gap-2">
                    <span class="font-medium">{{ task.name }}</span>
                    <div
                      :class="['h-2 w-2 rounded-full', typeConfig[task.type].color]"
                      :title="typeConfig[task.type].label"
                    />
                  </div>
                  <span
                    :class="[
                      'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors',
                      statusConfig[task.status].badgeClass
                    ]"
                  >
                    {{ statusConfig[task.status].label }}
                  </span>
                </div>
                <div class="flex items-center gap-3 text-xs text-muted-foreground">
                  <span>{{ task.plot }}</span>
                  <span>·</span>
                  <span>{{ task.crop }}</span>
                  <span>·</span>
                  <span>{{ task.startDate }} ~ {{ task.endDate }}</span>
                </div>
                <div class="flex items-center gap-3">
                  <div class="h-1.5 flex-1 overflow-hidden rounded-full bg-primary/20">
                    <div
                      class="h-full rounded-full bg-primary transition-all"
                      :style="{ width: `${task.progress}%` }"
                    />
                  </div>
                  <span class="text-xs font-medium tabular-nums">{{ task.progress }}%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Tab 内容 - 待开始 -->
      <div v-if="activeTab === 'pending'" class="mt-4">
        <div class="rounded-xl border bg-card text-card-foreground shadow">
          <div class="flex flex-col space-y-1.5 p-6">
            <h3 class="text-lg font-semibold leading-none tracking-tight">待开始的任务</h3>
            <p class="text-sm text-muted-foreground">尚未启动的种植任务</p>
          </div>
          <div class="p-6 pt-0 space-y-3">
            <!-- 列表-待开始任务 -->
            <div
              v-for="task in pendingTasks"
              :key="task.id"
              class="flex items-start gap-4 rounded-lg border p-4 transition-colors hover:bg-accent/50"
            >
              <div class="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-accent">
                <CalendarDays class="h-4 w-4 text-accent-foreground" />
              </div>
              <div class="flex-1 space-y-2">
                <div class="flex items-center justify-between">
                  <div class="flex items-center gap-2">
                    <span class="font-medium">{{ task.name }}</span>
                    <div
                      :class="['h-2 w-2 rounded-full', typeConfig[task.type].color]"
                      :title="typeConfig[task.type].label"
                    />
                  </div>
                  <span
                    :class="[
                      'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors',
                      statusConfig[task.status].badgeClass
                    ]"
                  >
                    {{ statusConfig[task.status].label }}
                  </span>
                </div>
                <div class="flex items-center gap-3 text-xs text-muted-foreground">
                  <span>{{ task.plot }}</span>
                  <span>·</span>
                  <span>{{ task.crop }}</span>
                  <span>·</span>
                  <span>{{ task.startDate }} ~ {{ task.endDate }}</span>
                </div>
                <div class="flex items-center gap-3">
                  <div class="h-1.5 flex-1 overflow-hidden rounded-full bg-primary/20">
                    <div
                      class="h-full rounded-full bg-primary transition-all"
                      :style="{ width: `${task.progress}%` }"
                    />
                  </div>
                  <span class="text-xs font-medium tabular-nums">{{ task.progress }}%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Tab 内容 - 已完成 -->
      <div v-if="activeTab === 'completed'" class="mt-4">
        <div class="rounded-xl border bg-card text-card-foreground shadow">
          <div class="flex flex-col space-y-1.5 p-6">
            <h3 class="text-lg font-semibold leading-none tracking-tight">已完成的任务</h3>
            <p class="text-sm text-muted-foreground">已顺利完成的种植任务</p>
          </div>
          <div class="p-6 pt-0 space-y-3">
            <!-- 列表-已完成任务 -->
            <div
              v-for="task in completedTasks"
              :key="task.id"
              class="flex items-start gap-4 rounded-lg border p-4 transition-colors hover:bg-accent/50"
            >
              <div class="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-accent">
                <CalendarDays class="h-4 w-4 text-accent-foreground" />
              </div>
              <div class="flex-1 space-y-2">
                <div class="flex items-center justify-between">
                  <div class="flex items-center gap-2">
                    <span class="font-medium">{{ task.name }}</span>
                    <div
                      :class="['h-2 w-2 rounded-full', typeConfig[task.type].color]"
                      :title="typeConfig[task.type].label"
                    />
                  </div>
                  <span
                    :class="[
                      'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors',
                      statusConfig[task.status].badgeClass
                    ]"
                  >
                    {{ statusConfig[task.status].label }}
                  </span>
                </div>
                <div class="flex items-center gap-3 text-xs text-muted-foreground">
                  <span>{{ task.plot }}</span>
                  <span>·</span>
                  <span>{{ task.crop }}</span>
                  <span>·</span>
                  <span>{{ task.startDate }} ~ {{ task.endDate }}</span>
                </div>
                <div class="flex items-center gap-3">
                  <div class="h-1.5 flex-1 overflow-hidden rounded-full bg-primary/20">
                    <div
                      class="h-full rounded-full bg-primary transition-all"
                      :style="{ width: `${task.progress}%` }"
                    />
                  </div>
                  <span class="text-xs font-medium tabular-nums">{{ task.progress }}%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Tab 内容 - 已延期 -->
      <div v-if="activeTab === 'delayed'" class="mt-4">
        <div class="rounded-xl border bg-card text-card-foreground shadow">
          <div class="flex flex-col space-y-1.5 p-6">
            <h3 class="text-lg font-semibold leading-none tracking-tight">已延期的任务</h3>
            <p class="text-sm text-muted-foreground">需要关注的延期任务，请及时处理</p>
          </div>
          <div class="p-6 pt-0 space-y-3">
            <!-- 列表-已延期任务 -->
            <div
              v-for="task in delayedTasks"
              :key="task.id"
              class="flex items-start gap-4 rounded-lg border p-4 transition-colors hover:bg-accent/50"
            >
              <div class="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-accent">
                <CalendarDays class="h-4 w-4 text-accent-foreground" />
              </div>
              <div class="flex-1 space-y-2">
                <div class="flex items-center justify-between">
                  <div class="flex items-center gap-2">
                    <span class="font-medium">{{ task.name }}</span>
                    <div
                      :class="['h-2 w-2 rounded-full', typeConfig[task.type].color]"
                      :title="typeConfig[task.type].label"
                    />
                  </div>
                  <span
                    :class="[
                      'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors',
                      statusConfig[task.status].badgeClass
                    ]"
                  >
                    {{ statusConfig[task.status].label }}
                  </span>
                </div>
                <div class="flex items-center gap-3 text-xs text-muted-foreground">
                  <span>{{ task.plot }}</span>
                  <span>·</span>
                  <span>{{ task.crop }}</span>
                  <span>·</span>
                  <span>{{ task.startDate }} ~ {{ task.endDate }}</span>
                </div>
                <div class="flex items-center gap-3">
                  <div class="h-1.5 flex-1 overflow-hidden rounded-full bg-primary/20">
                    <div
                      class="h-full rounded-full bg-primary transition-all"
                      :style="{ width: `${task.progress}%` }"
                    />
                  </div>
                  <span class="text-xs font-medium tabular-nums">{{ task.progress }}%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { CalendarDays, TrendingUp, Clock, CheckCircle2 } from 'lucide-vue-next'

interface ScheduleTask {
  id: number
  name: string
  plot: string
  crop: string
  startDate: string
  endDate: string
  progress: number
  status: 'pending' | 'in_progress' | 'completed' | 'delayed'
  type: 'sow' | 'fertilize' | 'irrigate' | 'pest' | 'harvest'
}

type TaskType = ScheduleTask['type']
type TaskStatus = ScheduleTask['status']

const typeConfig: Record<TaskType, { label: string; color: string }> = {
  sow: { label: '播种', color: 'bg-green-500' },
  fertilize: { label: '施肥', color: 'bg-amber-500' },
  irrigate: { label: '灌溉', color: 'bg-sky-500' },
  pest: { label: '植保', color: 'bg-red-500' },
  harvest: { label: '收获', color: 'bg-orange-500' },
}

const statusConfig: Record<TaskStatus, { label: string; badgeClass: string }> = {
  pending: { label: '待开始', badgeClass: 'bg-gray-100 text-gray-700' },
  in_progress: { label: '进行中', badgeClass: 'bg-blue-100 text-blue-700' },
  completed: { label: '已完成', badgeClass: 'bg-green-100 text-green-700' },
  delayed: { label: '已延期', badgeClass: 'bg-red-100 text-red-700' },
}

const tasks: ScheduleTask[] = [
  { id: 1, name: '水稻播种', plot: 'A1区', crop: '水稻', startDate: '2024-03-20', endDate: '2024-03-25', progress: 100, status: 'completed', type: 'sow' },
  { id: 2, name: '水稻追肥', plot: 'A1区', crop: '水稻', startDate: '2024-04-15', endDate: '2024-04-18', progress: 100, status: 'completed', type: 'fertilize' },
  { id: 3, name: '玉米播种', plot: 'A3区', crop: '玉米', startDate: '2024-04-01', endDate: '2024-04-05', progress: 100, status: 'completed', type: 'sow' },
  { id: 4, name: '棉花灌溉', plot: 'B2区', crop: '棉花', startDate: '2024-04-10', endDate: '2024-04-12', progress: 75, status: 'in_progress', type: 'irrigate' },
  { id: 5, name: '大豆播种', plot: 'B1区', crop: '大豆', startDate: '2024-04-20', endDate: '2024-04-25', progress: 30, status: 'in_progress', type: 'sow' },
  { id: 6, name: '花生植保', plot: 'C3区', crop: '花生', startDate: '2024-04-18', endDate: '2024-04-22', progress: 60, status: 'in_progress', type: 'pest' },
  { id: 7, name: '水稻灌溉', plot: 'C1区', crop: '水稻', startDate: '2024-04-22', endDate: '2024-04-25', progress: 0, status: 'pending', type: 'irrigate' },
  { id: 8, name: '油菜追肥', plot: 'C2区', crop: '油菜', startDate: '2024-04-25', endDate: '2024-04-28', progress: 0, status: 'pending', type: 'fertilize' },
  { id: 9, name: '小麦收获', plot: 'A2区', crop: '小麦', startDate: '2024-05-15', endDate: '2024-05-20', progress: 0, status: 'pending', type: 'harvest' },
  { id: 10, name: '红薯植保', plot: 'D1区', crop: '红薯', startDate: '2024-04-08', endDate: '2024-04-12', progress: 40, status: 'delayed', type: 'pest' },
  { id: 11, name: '小麦收获', plot: 'D2区', crop: '小麦', startDate: '2024-05-10', endDate: '2024-05-15', progress: 0, status: 'pending', type: 'harvest' },
  { id: 12, name: '茶叶追肥', plot: 'D3区', crop: '茶叶', startDate: '2024-04-16', endDate: '2024-04-19', progress: 85, status: 'in_progress', type: 'fertilize' },
]

const activeTab = ref<TaskStatus>('in_progress')

const inProgressTasks = computed(() => tasks.filter(t => t.status === 'in_progress'))
const pendingTasks = computed(() => tasks.filter(t => t.status === 'pending'))
const completedTasks = computed(() => tasks.filter(t => t.status === 'completed'))
const delayedTasks = computed(() => tasks.filter(t => t.status === 'delayed'))

const overallProgress = computed(() =>
  Math.round(tasks.reduce((sum, t) => sum + t.progress, 0) / tasks.length)
)

const tabs = computed(() => [
  { value: 'in_progress' as TaskStatus, label: `进行中 (${inProgressTasks.value.length})` },
  { value: 'pending' as TaskStatus, label: `待开始 (${pendingTasks.value.length})` },
  { value: 'completed' as TaskStatus, label: `已完成 (${completedTasks.value.length})` },
  { value: 'delayed' as TaskStatus, label: `已延期 (${delayedTasks.value.length})` },
])
</script>
