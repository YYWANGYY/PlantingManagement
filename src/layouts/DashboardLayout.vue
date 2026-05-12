<template>
  <div class="flex h-screen overflow-hidden">
    <!-- Sidebar -->
    <aside
      :class="[
        'flex flex-col transition-all duration-300 bg-sidebar text-sidebar-foreground',
        collapsed ? 'w-16' : 'w-56'
      ]"
    >
      <!-- Logo -->
      <div class="flex items-center gap-2.5 px-4 h-14 border-b border-sidebar-border shrink-0">
        <div class="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground">
          <Sprout class="h-5 w-5" />
        </div>
        <div v-if="!collapsed" class="flex flex-col min-w-0">
          <span class="text-sm font-bold tracking-wide text-white truncate">种植管理系统</span>
          <span class="text-[10px] text-sidebar-foreground/50 leading-tight truncate">Planting Management</span>
        </div>
      </div>
      <!-- Menu -->
      <nav class="flex-1 overflow-y-auto py-2 px-2 space-y-0.5">
        <template v-for="item in menuItems" :key="item.title">
          <!-- Single item -->
          <router-link
            v-if="!item.children"
            :to="item.href!"
            :class="[
              'flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm transition-colors',
              isActive(item.href!)
                ? 'bg-sidebar-active text-primary-200 font-medium'
                : 'text-sidebar-foreground/70 hover:bg-sidebar-muted hover:text-sidebar-foreground'
            ]"
          >
            <component :is="item.icon" class="h-4.5 w-4.5 shrink-0" />
            <span v-if="!collapsed" class="truncate">{{ item.title }}</span>
          </router-link>
          <!-- Group item -->
          <div v-else>
            <button
              @click="collapsed ? (collapsed = false, openGroups[item.title] = true) : toggleGroup(item.title)"
              :class="[
                'w-full flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm transition-colors',
                isGroupActive(item)
                  ? 'bg-sidebar-active text-primary-200 font-medium'
                  : 'text-sidebar-foreground/70 hover:bg-sidebar-muted hover:text-sidebar-foreground'
              ]"
              :title="collapsed ? item.title : ''"
            >
              <component :is="item.icon" class="h-4.5 w-4.5 shrink-0" />
              <span v-if="!collapsed" class="truncate flex-1 text-left">{{ item.title }}</span>
              <ChevronRight
                v-if="!collapsed"
                :class="['h-3.5 w-3.5 transition-transform', openGroups[item.title] ? 'rotate-90' : '']"
              />
            </button>
            <div v-if="openGroups[item.title] && !collapsed" class="ml-3.5 mt-0.5 space-y-0.5 border-l border-sidebar-border pl-2.5">
              <router-link
                v-for="child in item.children"
                :key="child.href"
                :to="child.href"
                :class="[
                  'flex items-center gap-2 rounded-lg px-2.5 py-1.5 text-[13px] transition-colors',
                  isActive(child.href)
                    ? 'bg-sidebar-active text-primary-200 font-medium'
                    : 'text-sidebar-foreground/60 hover:bg-sidebar-muted hover:text-sidebar-foreground'
                ]"
              >
                <component :is="child.icon" class="h-3.5 w-3.5 shrink-0" />
                <span class="truncate">{{ child.title }}</span>
              </router-link>
            </div>
          </div>
        </template>
      </nav>
    </aside>

    <!-- Main content -->
    <div class="flex flex-1 flex-col overflow-hidden">
      <!-- Top bar -->
      <header class="flex h-14 items-center border-b bg-white px-4 shrink-0">
        <!-- Collapse toggle -->
        <button
          @click="collapsed = !collapsed"
          class="mr-2 flex h-8 w-8 items-center justify-center rounded-md hover:bg-primary-50 transition-colors"
          :title="collapsed ? '展开菜单' : '收起菜单'"
        >
          <component :is="collapsed ? PanelLeftOpen : PanelLeftClose" class="h-4.5 w-4.5 text-foreground/60" />
        </button>
        <!-- Breadcrumb -->
        <nav class="flex items-center gap-1.5 text-sm">
          <router-link to="/" class="text-muted-foreground hover:text-primary transition-colors">首页</router-link>
          <template v-if="currentParent">
            <ChevronRight class="h-3.5 w-3.5 text-muted-foreground" />
            <span class="text-muted-foreground">{{ currentParent }}</span>
          </template>
          <ChevronRight class="h-3.5 w-3.5 text-muted-foreground" />
          <span class="font-medium text-foreground">{{ currentTitle }}</span>
        </nav>
        <!-- Right actions -->
        <div class="ml-auto flex items-center gap-1">
          <!-- Notifications -->
          <div class="relative" ref="notifRef">
            <button @click="showNotif = !showNotif" class="relative p-2 rounded-md hover:bg-primary-50 transition-colors">
              <Bell class="h-5 w-5 text-foreground/60" />
              <span
                v-if="unreadCount > 0"
                class="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-medium text-white"
              >
                {{ unreadCount }}
              </span>
            </button>
            <div
              v-if="showNotif"
              class="absolute right-0 top-full mt-1 w-80 rounded-lg border border-border bg-white shadow-lg z-50"
            >
              <div class="flex items-center justify-between border-b px-4 py-3">
                <span class="text-sm font-semibold">消息通知</span>
                <button v-if="unreadCount > 0" @click="markAllRead" class="text-xs text-primary hover:underline">全部已读</button>
              </div>
              <div class="max-h-80 overflow-y-auto">
                <div
                  v-for="n in notifications"
                  :key="n.id"
                  :class="['flex gap-3 border-b px-4 py-3 transition-colors last:border-b-0 hover:bg-primary-50/50', !n.read ? 'bg-primary-50/30' : '']"
                >
                  <div v-if="!n.read" class="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-primary"></div>
                  <div :class="!n.read ? '' : 'ml-5'">
                    <div class="text-sm font-medium">{{ n.title }}</div>
                    <div class="mt-0.5 text-xs text-muted-foreground">{{ n.content }}</div>
                    <div class="mt-1 text-xs text-muted-foreground/60">{{ n.time }}</div>
                  </div>
                </div>
              </div>
              <div class="border-t px-4 py-2">
                <button class="w-full text-center text-xs text-primary hover:underline">查看全部消息</button>
              </div>
            </div>
          </div>
          <div class="mx-1 h-4 w-px bg-border"></div>
          <!-- User -->
          <div class="flex items-center gap-2">
            <div class="flex items-center gap-1.5">
              <div class="flex h-7 w-7 items-center justify-center rounded-full bg-primary-100">
                <UserIcon class="h-4 w-4 text-primary" />
              </div>
              <span class="text-sm font-medium">管理员</span>
            </div>
            <button class="p-1.5 rounded-md text-muted-foreground hover:text-destructive transition-colors" title="退出登录">
              <LogOut class="h-4 w-4" />
            </button>
          </div>
        </div>
      </header>
      <!-- Page Content -->
      <main class="flex-1 overflow-auto bg-background p-6">
        <router-view />
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'
import {
  Sprout, ChevronRight, Bell, LogOut, User as UserIcon,
  Map, FileText, CalendarDays, Package, BarChart3, Database, Settings,
  ListChecks, Activity, ClipboardList, ChartPie, BookOpen, Table2,
  Wheat, Building2, Users, Shield, Lock, BookMarked,
  PanelLeftClose, PanelLeftOpen,
} from 'lucide-vue-next'

interface SubMenuItem {
  title: string
  href: string
  icon: any
}

interface MenuItem {
  title: string
  href?: string
  icon: any
  children?: SubMenuItem[]
}

const menuItems: MenuItem[] = [
  { title: '数字地图', href: '/digital-map', icon: Map },
  { title: '种植方案', href: '/planting-plan', icon: FileText },
  {
    title: '种植计划', icon: CalendarDays,
    children: [
      { title: '计划清单', href: '/planting-schedule', icon: ListChecks },
      { title: '计划监控', href: '/planting-schedule/monitor', icon: Activity },
    ],
  },
  {
    title: '农资需求', icon: Package,
    children: [
      { title: '需求计划', href: '/material-demand', icon: ClipboardList },
      { title: '需求汇总', href: '/material-demand/summary', icon: ChartPie },
    ],
  },
  {
    title: '统计分析', icon: BarChart3,
    children: [
      { title: '种植档案', href: '/statistics/archive', icon: BookOpen },
      { title: '种植结构表', href: '/statistics/structure', icon: Table2 },
    ],
  },
  {
    title: '基础管理', icon: Database,
    children: [
      { title: '作物管理', href: '/base-management/crop', icon: Wheat },
    ],
  },
  {
    title: '系统管理', icon: Settings,
    children: [
      { title: '部门管理', href: '/system/department', icon: Building2 },
      { title: '人员管理', href: '/system/personnel', icon: Users },
      { title: '角色管理', href: '/system/role', icon: Shield },
      { title: '权限管理', href: '/system/permission', icon: Lock },
      { title: '字典管理', href: '/system/dictionary', icon: BookMarked },
    ],
  },
]

const route = useRoute()
const collapsed = ref(false)
const openGroups = ref<Record<string, boolean>>({})
const showNotif = ref(false)
const notifRef = ref<HTMLElement | null>(null)

const notifications = ref([
  { id: '1', title: '任务提醒', content: '东区3号地块灌溉任务即将到期', time: '10分钟前', read: false },
  { id: '2', title: '预警通知', content: '西区温室湿度异常，当前湿度85%', time: '30分钟前', read: false },
  { id: '3', title: '审批通知', content: '2025年春季种植方案已通过审批', time: '2小时前', read: false },
  { id: '4', title: '采购通知', content: '复合肥采购订单已发货', time: '昨天', read: true },
  { id: '5', title: '系统通知', content: '系统将于今晚22:00进行维护升级', time: '昨天', read: true },
])

const unreadCount = computed(() => notifications.value.filter(n => !n.read).length)
const currentTitle = computed(() => (route.meta.title as string) || '首页')
const currentParent = computed(() => (route.meta.parent as string) || '')

function isActive(href: string): boolean {
  return route.path === href
}

function isGroupActive(item: MenuItem): boolean {
  return !!item.children?.some(c => route.path === c.href)
}

function toggleGroup(title: string) {
  openGroups.value[title] = !openGroups.value[title]
}

function markAllRead() {
  notifications.value = notifications.value.map(n => ({ ...n, read: true }))
}

function handleClickOutside(e: MouseEvent) {
  if (notifRef.value && !notifRef.value.contains(e.target as Node)) {
    showNotif.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
  for (const item of menuItems) {
    if (item.children && isGroupActive(item)) {
      openGroups.value[item.title] = true
    }
  }
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>
