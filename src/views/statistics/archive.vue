<template>
  <div class="space-y-6">
    <!-- 页面标题 -->
    <div>
      <h1 class="text-2xl font-bold tracking-tight">种植档案</h1>
      <p class="mt-1 text-sm text-muted-foreground">以种植单元为维度，查看<span class="font-semibold">当前种植数据</span>及执行进度</p>
    </div>

    <!-- 查询条件 -->
    <div class="rounded-lg border bg-card p-4 shadow-sm">
      <div class="flex flex-wrap items-end gap-4">

        <!-- 所属单位 -->
        <div class="flex flex-col gap-1.5">
          <label class="text-sm font-medium text-muted-foreground">所属单位</label>
          <div class="relative unit-tree-dropdown">
            <button
              class="flex h-9 w-48 items-center justify-between rounded-md border bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
              @click="showOrgTree = !showOrgTree"
            >
              <span :class="filters.org ? 'text-foreground' : 'text-muted-foreground'">
                {{ filters.org || '全部' }}
              </span>
              <ChevronDown class="h-4 w-4 text-muted-foreground" />
            </button>
            <div
              v-if="showOrgTree"
              class="absolute left-0 top-full z-50 mt-1 w-56 rounded-md border bg-card shadow-lg"
            >
              <div class="p-1">
                <button
                  class="w-full rounded-sm px-3 py-1.5 text-left text-sm hover:bg-accent"
                  :class="filters.org === '' ? 'bg-primary/10 text-primary font-medium' : ''"
                  @click="selectOrg('')"
                >
                  全部
                </button>
                <div v-for="org in orgTree" :key="org.label">
                  <button
                    class="flex w-full items-center gap-1 rounded-sm px-3 py-1.5 text-left text-sm font-medium hover:bg-accent"
                    :class="filters.org === org.label ? 'bg-primary/10 text-primary' : ''"
                    @click.stop="selectOrg(org.label)"
                  >
                    <component
                      :is="expandedOrgs.includes(org.label) ? Minus : ChevronRightIcon"
                      class="h-3.5 w-3.5 shrink-0 text-muted-foreground"
                      @click.stop="toggleOrgNode(org.label)"
                    />
                    {{ org.label }}
                  </button>
                  <div v-if="expandedOrgs.includes(org.label)" class="ml-5">
                    <button
                      v-for="child in org.children"
                      :key="child"
                      class="w-full rounded-sm px-3 py-1 text-left text-sm hover:bg-accent"
                      :class="filters.org === child ? 'bg-primary/10 text-primary font-medium' : ''"
                      @click="selectOrg(child)"
                    >
                      {{ child }}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 作物大类 + 作物品种 -->
        <div class="flex flex-col gap-1.5">
          <label class="text-sm font-medium text-muted-foreground">作物大类 / 品种</label>
          <div class="flex gap-1">
            <select
              v-model="filters.cropCategory"
              class="h-9 rounded-md border bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
              @change="filters.cropVariety = ''"
            >
              <option value="">全部大类</option>
              <option v-for="c in cropCategories" :key="c" :value="c">{{ c }}</option>
            </select>
            <select
              v-model="filters.cropVariety"
              class="h-9 rounded-md border bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
              :disabled="!filters.cropCategory"
            >
              <option value="">全部品种</option>
              <option v-for="v in cropVarietyOptions" :key="v" :value="v">{{ v }}</option>
            </select>
          </div>
        </div>

        <!-- 种植计划 -->
        <div class="flex flex-col gap-1.5">
          <label class="text-sm font-medium text-muted-foreground">种植计划</label>
          <select
            v-model="filters.planId"
            class="h-9 w-52 rounded-md border bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
          >
            <option value="">全部</option>
            <option v-for="p in planOptions" :key="p.id" :value="p.id">{{ p.id }} - {{ p.name }}</option>
          </select>
        </div>

        <!-- 时间段 -->
        <div class="flex flex-col gap-1.5">
          <label class="text-sm font-medium text-muted-foreground">时间段（任务预计执行时间）</label>
          <div class="flex items-center gap-2">
            <input
              v-model="filters.startDate"
              type="date"
              class="h-9 w-36 rounded-md border bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
            <span class="text-sm text-muted-foreground">至</span>
            <input
              v-model="filters.endDate"
              type="date"
              class="h-9 w-36 rounded-md border bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
          </div>
        </div>

        <!-- 查询/重置 -->
        <div class="flex gap-2">
          <button
            class="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90"
            @click="handleSearch"
          >
            查询
          </button>
          <button
            class="inline-flex items-center justify-center rounded-md border bg-background px-4 py-2 text-sm font-medium text-foreground shadow-sm transition-colors hover:bg-accent"
            @click="handleReset"
          >
            重置
          </button>
        </div>
      </div>
    </div>

    <!-- 地块卡片列表 -->
    <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      <div
        v-for="item in paginatedData"
        :key="item.plotCode"
        class="group relative overflow-hidden rounded-lg border bg-card text-card-foreground shadow-sm transition-shadow hover:shadow-md"
      >
        <!-- 顶部色条 - 按进度着色 -->
        <div
          class="absolute left-0 top-0 h-1.5 w-full"
          :class="getProgressColorClass(item.progress)"
        />

        <!-- 卡片头部 -->
        <div class="flex items-center justify-between pb-1 pt-4 px-5">
          <div class="flex items-center gap-2">
            <span class="text-base font-semibold">{{ item.plotName }}</span>
            <!-- 农事作业处置方角标 -->
            <span
              class="inline-flex items-center rounded px-1.5 py-0.5 text-[10px] font-medium"
              :class="getExecutorBadgeClass(item.executor)"
            >
              {{ getExecutorLabel(item.executor) }}
            </span>
          </div>
          <span
            class="inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium"
            :class="getStatusBadgeClass(item.status)"
          >
            {{ item.status }}
          </span>
        </div>

        <!-- 基本信息 -->
        <div class="space-y-2 pb-3 px-5">
          <div class="flex items-center gap-1 text-xs text-muted-foreground">
            <FileText class="h-3.5 w-3.5" />
            <span>{{ item.planCode }}</span>
          </div>
          <div class="flex items-center gap-3 text-sm">
            <span class="inline-flex items-center rounded bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
              {{ item.cropCategory }}
            </span>
            <span class="text-sm text-foreground">{{ item.cropVariety }}</span>
          </div>
          <div class="flex items-center gap-1 text-xs text-muted-foreground">
            <MapPin class="h-3.5 w-3.5" />
            <span>{{ item.area }}亩</span>
            <span class="mx-1">·</span>
            <span>{{ item.orgName }}</span>
          </div>
        </div>

        <!-- 分割线 -->
        <div class="border-t" />

        <!-- 进度区域 -->
        <div class="space-y-2 p-4 pt-3">
          <!-- 进度条 -->
          <div class="space-y-1">
            <div class="flex items-center justify-between text-xs">
              <span class="text-muted-foreground">执行进度</span>
              <span class="font-medium">{{ item.completedTasks }}/{{ item.totalTasks }}任务</span>
            </div>
            <div class="h-2 w-full overflow-hidden rounded-full bg-primary/15">
              <div
                class="h-full rounded-full transition-all duration-500"
                :class="getProgressBarClass(item.progress)"
                :style="{ width: item.progress + '%' }"
              />
            </div>
            <div class="text-right text-xs font-medium" :class="getProgressTextClass(item.progress)">
              {{ item.progress }}%
            </div>
          </div>

          <!-- 当前执行信息 -->
          <div class="flex items-center justify-between text-xs text-muted-foreground">
            <span>第{{ item.currentDay }}天 · {{ item.growthStage }}</span>
            <span>{{ item.completedTasks }}/{{ item.totalTasks }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 分页 -->
    <div v-if="totalPages > 1" class="flex items-center justify-between">
      <span class="text-sm text-muted-foreground">
        第 {{ currentPage }} / {{ totalPages }} 页，共 <span class="font-medium">{{ filteredData.length }}</span> 条记录
      </span>
      <div class="flex items-center gap-1">
        <button
          class="inline-flex h-8 w-8 items-center justify-center rounded-md border bg-background text-sm transition-colors hover:bg-accent disabled:opacity-50 disabled:cursor-not-allowed"
          :disabled="currentPage === 1"
          @click="currentPage = 1"
        >
          <ChevronsLeft class="h-4 w-4" />
        </button>
        <button
          class="inline-flex h-8 w-8 items-center justify-center rounded-md border bg-background text-sm transition-colors hover:bg-accent disabled:opacity-50 disabled:cursor-not-allowed"
          :disabled="currentPage === 1"
          @click="currentPage--"
        >
          <ChevronLeft class="h-4 w-4" />
        </button>
        <template v-for="page in visiblePages" :key="page">
          <button
            v-if="page !== '...'"
            class="inline-flex h-8 w-8 items-center justify-center rounded-md border text-sm transition-colors"
            :class="page === currentPage ? 'bg-primary text-primary-foreground border-primary' : 'bg-background hover:bg-accent'"
            @click="currentPage = page as number"
          >
            {{ page }}
          </button>
          <span v-else class="inline-flex h-8 w-8 items-center justify-center text-sm text-muted-foreground">...</span>
        </template>
        <button
          class="inline-flex h-8 w-8 items-center justify-center rounded-md border bg-background text-sm transition-colors hover:bg-accent disabled:opacity-50 disabled:cursor-not-allowed"
          :disabled="currentPage === totalPages"
          @click="currentPage++"
        >
          <ChevronRight class="h-4 w-4" />
        </button>
        <button
          class="inline-flex h-8 w-8 items-center justify-center rounded-md border bg-background text-sm transition-colors hover:bg-accent disabled:opacity-50 disabled:cursor-not-allowed"
          :disabled="currentPage === totalPages"
          @click="currentPage = totalPages"
        >
          <ChevronsRight class="h-4 w-4" />
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import {
  MapPin, FileText, ChevronDown, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight,
  ChevronRight as ChevronRightIcon, Minus
} from 'lucide-vue-next'

// ===== 查询条件 =====

interface Filters {
  year: string
  org: string
  cropCategory: string
  cropVariety: string
  planId: string
  startDate: string
  endDate: string
}

const filters = ref<Filters>({
  year: '',
  org: '',
  cropCategory: '',
  cropVariety: '',
  planId: '',
  startDate: '',
  endDate: ''
})

const showOrgTree = ref(false)
const expandedOrgs = ref<string[]>([])

const yearOptions = [2025, 2024, 2023, 2022]

const orgTree = [
  { label: '哈尔滨区域公司', children: ['五大连池农场', '双城农场'] },
  { label: '沈阳区域公司', children: ['法库农场', '新民农场'] }
]

// ==================== 作物数据 ====================
// 数据来源：基础管理→作物管理
const cropMajors = [
  { name: '水稻', code: 'rice', plantingMode: 'field' },
  { name: '小麦', code: 'wheat', plantingMode: 'field' },
  { name: '玉米', code: 'corn', plantingMode: 'field' },
  { name: '大豆', code: 'soybean', plantingMode: 'field' }
] as const

const cropVarieties = [
  // 水稻
  { name: '籼稻', code: 'indica_rice', majorCode: 'rice', majorName: '水稻' },
  { name: '粳稻', code: 'japonica_rice', majorCode: 'rice', majorName: '水稻' },
  { name: '糯稻', code: 'glutinous_rice', majorCode: 'rice', majorName: '水稻' },
  { name: '杂交稻', code: 'hybrid_rice', majorCode: 'rice', majorName: '水稻' },
  // 小麦
  { name: '强筋小麦', code: 'strong_gluten_wheat', majorCode: 'wheat', majorName: '小麦' },
  { name: '中筋小麦', code: 'medium_gluten_wheat', majorCode: 'wheat', majorName: '小麦' },
  { name: '弱筋小麦', code: 'weak_gluten_wheat', majorCode: 'wheat', majorName: '小麦' },
  // 玉米
  { name: '甜玉米', code: 'sweet_corn', majorCode: 'corn', majorName: '玉米' },
  { name: '糯玉米', code: 'waxy_corn', majorCode: 'corn', majorName: '玉米' },
  // 大豆
  { name: '高蛋白大豆', code: 'high_protein_soybean', majorCode: 'soybean', majorName: '大豆' },
  { name: '高油大豆', code: 'high_oil_soybean', majorCode: 'soybean', majorName: '大豆' }
] as const

const cropCategories = cropMajors.map(m => m.name)

const cropVarietyOptions = computed(() => {
  if (!filters.value.cropCategory) return []
  const major = cropMajors.find(m => m.name === filters.value.cropCategory)
  if (!major) return []
  return cropVarieties.filter(v => v.majorCode === major.code).map(v => v.name)
})

const planOptions = [
  { id: 'ZJ2025-001', name: '哈尔滨玉米种植计划' },
  { id: 'ZJ2025-002', name: '五大连池大豆种植计划' },
  { id: 'ZJ2025-003', name: '双城水稻种植计划' },
  { id: 'ZJ2025-004', name: '法库小麦种植计划' },
  { id: 'ZJ2025-005', name: '新民马铃薯种植计划' },
  { id: 'ZJ2025-006', name: '五大连池花生种植计划' }
]

function selectOrg(org: string) {
  filters.value.org = org
  showOrgTree.value = false
}

function toggleOrgNode(label: string) {
  const idx = expandedOrgs.value.indexOf(label)
  if (idx >= 0) expandedOrgs.value.splice(idx, 1)
  else expandedOrgs.value.push(label)
}

// 点击外部关闭下拉
if (typeof document !== 'undefined') {
  document.addEventListener('click', (e: MouseEvent) => {
    const target = e.target as HTMLElement
    if (!target.closest('.unit-tree-dropdown')) {
      showOrgTree.value = false
    }
  })
}

function handleSearch() {
  currentPage.value = 1
}

function handleReset() {
  filters.value = { year: '', org: '', cropCategory: '', cropVariety: '', planId: '', startDate: '', endDate: '' }
  currentPage.value = 1
}

// ===== 数据模型 =====

interface ArchiveItem {
  plotCode: string
  plotName: string
  orgName: string
  planCode: string
  year: number
  cropCategory: string
  cropVariety: string
  area: number
  executor: 'machine' | 'facility' | 'manual'
  status: string
  progress: number
  completedTasks: number
  totalTasks: number
  currentDay: number
  growthStage: string
  startDate: string
  endDate: string
}

// 模拟数据 - 以地块为维度，当前种植数据
const allData: ArchiveItem[] = [
  { plotCode: 'WDC-LQ-A01', plotName: '龙泉分场A01', orgName: '五大连池农场', planCode: 'ZJ2025-001', year: 2025, cropCategory: '玉米', cropVariety: '先玉335', area: 5000, executor: 'machine', status: '执行中', progress: 65, completedTasks: 8, totalTasks: 12, currentDay: 78, growthStage: '拔节期', startDate: '2025-04-20', endDate: '2025-09-30' },
  { plotCode: 'WDC-LQ-A02', plotName: '龙泉分场A02', orgName: '五大连池农场', planCode: 'ZJ2025-002', year: 2025, cropCategory: '大豆', cropVariety: '黑河43', area: 5000, executor: 'manual', status: '执行中', progress: 52, completedTasks: 6, totalTasks: 11, currentDay: 62, growthStage: '开花期', startDate: '2025-05-01', endDate: '2025-09-25' },
  { plotCode: 'WDC-LQ-B01', plotName: '龙泉分场B01', orgName: '五大连池农场', planCode: 'ZJ2025-001', year: 2025, cropCategory: '玉米', cropVariety: '郑单958', area: 3200, executor: 'machine', status: '执行中', progress: 48, completedTasks: 5, totalTasks: 12, currentDay: 55, growthStage: '苗期', startDate: '2025-04-25', endDate: '2025-10-05' },
  { plotCode: 'WDC-LQ-B02', plotName: '龙泉分场B02', orgName: '五大连池农场', planCode: 'ZJ2025-006', year: 2025, cropCategory: '花生', cropVariety: '花育33', area: 1800, executor: 'manual', status: '执行中', progress: 35, completedTasks: 3, totalTasks: 9, currentDay: 40, growthStage: '苗期', startDate: '2025-05-10', endDate: '2025-09-20' },
  { plotCode: 'SC-SC-C01', plotName: '双城农场C01', orgName: '双城农场', planCode: 'ZJ2025-003', year: 2025, cropCategory: '水稻', cropVariety: '龙粳31', area: 6000, executor: 'facility', status: '执行中', progress: 72, completedTasks: 8, totalTasks: 11, currentDay: 85, growthStage: '抽穗期', startDate: '2025-04-15', endDate: '2025-09-20' },
  { plotCode: 'SC-SC-C02', plotName: '双城农场C02', orgName: '双城农场', planCode: 'ZJ2025-003', year: 2025, cropCategory: '水稻', cropVariety: '五优稻4号', area: 4500, executor: 'facility', status: '执行中', progress: 58, completedTasks: 7, totalTasks: 12, currentDay: 68, growthStage: '分蘖期', startDate: '2025-04-18', endDate: '2025-09-25' },
  { plotCode: 'SC-SC-D01', plotName: '双城农场D01', orgName: '双城农场', planCode: 'ZJ2025-001', year: 2025, cropCategory: '玉米', cropVariety: '京科968', area: 2800, executor: 'machine', status: '执行中', progress: 42, completedTasks: 5, totalTasks: 12, currentDay: 50, growthStage: '苗期', startDate: '2025-05-01', endDate: '2025-10-10' },
  { plotCode: 'FK-FK-E01', plotName: '法库农场E01', orgName: '法库农场', planCode: 'ZJ2025-004', year: 2025, cropCategory: '小麦', cropVariety: '龙麦35', area: 4000, executor: 'machine', status: '执行中', progress: 88, completedTasks: 7, totalTasks: 8, currentDay: 95, growthStage: '灌浆期', startDate: '2025-03-10', endDate: '2025-07-15' },
  { plotCode: 'FK-FK-E02', plotName: '法库农场E02', orgName: '法库农场', planCode: 'ZJ2025-004', year: 2025, cropCategory: '小麦', cropVariety: '克春4号', area: 3500, executor: 'machine', status: '执行中', progress: 82, completedTasks: 6, totalTasks: 8, currentDay: 90, growthStage: '成熟期', startDate: '2025-03-15', endDate: '2025-07-20' },
  { plotCode: 'XM-XM-F01', plotName: '新民农场F01', orgName: '新民农场', planCode: 'ZJ2025-005', year: 2025, cropCategory: '马铃薯', cropVariety: '大西洋', area: 2500, executor: 'manual', status: '执行中', progress: 55, completedTasks: 5, totalTasks: 9, currentDay: 60, growthStage: '块茎膨大期', startDate: '2025-04-20', endDate: '2025-09-01' },
  { plotCode: 'XM-XM-F02', plotName: '新民农场F02', orgName: '新民农场', planCode: 'ZJ2025-002', year: 2025, cropCategory: '大豆', cropVariety: '中黄13', area: 3800, executor: 'manual', status: '执行中', progress: 38, completedTasks: 4, totalTasks: 11, currentDay: 45, growthStage: '苗期', startDate: '2025-05-05', endDate: '2025-09-30' },
  { plotCode: 'XM-XM-F03', plotName: '新民农场F03', orgName: '新民农场', planCode: 'ZJ2025-005', year: 2025, cropCategory: '马铃薯', cropVariety: '费乌瑞它', area: 2000, executor: 'facility', status: '执行中', progress: 62, completedTasks: 6, totalTasks: 9, currentDay: 70, growthStage: '块茎形成期', startDate: '2025-04-15', endDate: '2025-08-25' },
  { plotCode: 'WDC-LQ-C01', plotName: '龙泉分场C01', orgName: '五大连池农场', planCode: 'ZJ2025-002', year: 2025, cropCategory: '大豆', cropVariety: '合丰50', area: 2600, executor: 'manual', status: '执行中', progress: 45, completedTasks: 5, totalTasks: 11, currentDay: 53, growthStage: '分枝期', startDate: '2025-05-08', endDate: '2025-10-01' },
  { plotCode: 'SC-SC-E01', plotName: '双城农场E01', orgName: '双城农场', planCode: 'ZJ2025-001', year: 2025, cropCategory: '玉米', cropVariety: '先玉335', area: 5500, executor: 'machine', status: '执行中', progress: 70, completedTasks: 8, totalTasks: 12, currentDay: 82, growthStage: '抽雄期', startDate: '2025-04-22', endDate: '2025-09-28' },
  { plotCode: 'FK-FK-F01', plotName: '法库农场F01', orgName: '法库农场', planCode: 'ZJ2025-002', year: 2025, cropCategory: '大豆', cropVariety: '黑河43', area: 3000, executor: 'manual', status: '执行中', progress: 30, completedTasks: 3, totalTasks: 11, currentDay: 35, growthStage: '苗期', startDate: '2025-05-15', endDate: '2025-10-05' },
  { plotCode: 'XM-XM-G01', plotName: '新民农场G01', orgName: '新民农场', planCode: 'ZJ2025-006', year: 2025, cropCategory: '花生', cropVariety: '白沙1016', area: 1500, executor: 'manual', status: '执行中', progress: 25, completedTasks: 2, totalTasks: 9, currentDay: 30, growthStage: '苗期', startDate: '2025-05-20', endDate: '2025-09-15' },
]

// ===== 过滤逻辑 =====

const filteredData = computed(() => {
  let data = allData

  if (filters.value.year) {
    data = data.filter(item => item.year === Number(filters.value.year))
  }

  if (filters.value.org) {
    data = data.filter(item => {
      const orgNames: string[] = []
      for (const org of orgTree) {
        orgNames.push(org.label)
        orgNames.push(...org.children)
      }
      return item.orgName === filters.value.org || 
        orgTree.some(o => o.label === filters.value.org && o.children.includes(item.orgName))
    })
  }

  if (filters.value.cropCategory) {
    data = data.filter(item => item.cropCategory === filters.value.cropCategory)
  }

  if (filters.value.cropVariety) {
    data = data.filter(item => item.cropVariety === filters.value.cropVariety)
  }

  if (filters.value.planId) {
    data = data.filter(item => item.planCode === filters.value.planId)
  }

  if (filters.value.startDate) {
    data = data.filter(item => item.startDate >= filters.value.startDate)
  }

  if (filters.value.endDate) {
    data = data.filter(item => item.endDate <= filters.value.endDate)
  }

  return data
})

// ===== 分页 =====

const currentPage = ref(1)
const pageSize = 12 // 卡片模式每页12条（3行×4列）

const totalPages = computed(() => Math.max(1, Math.ceil(filteredData.value.length / pageSize)))

const paginatedData = computed(() => {
  const start = (currentPage.value - 1) * pageSize
  return filteredData.value.slice(start, start + pageSize)
})

const visiblePages = computed(() => {
  const total = totalPages.value
  const current = currentPage.value
  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1)
  }
  const pages: (number | string)[] = []
  pages.push(1)
  if (current > 3) pages.push('...')
  const start = Math.max(2, current - 1)
  const end = Math.min(total - 1, current + 1)
  for (let i = start; i <= end; i++) pages.push(i)
  if (current < total - 2) pages.push('...')
  pages.push(total)
  return pages
})

// ===== 样式辅助 =====

function getExecutorBadgeClass(executor: string): string {
  switch (executor) {
    case 'machine': return 'bg-blue-100 text-blue-700'
    case 'facility': return 'bg-purple-100 text-purple-700'
    case 'manual': return 'bg-orange-100 text-orange-700'
    default: return 'bg-gray-100 text-gray-700'
  }
}

function getExecutorLabel(executor: string): string {
  switch (executor) {
    case 'machine': return '农机'
    case 'facility': return '设施'
    case 'manual': return '人工'
    default: return executor
  }
}

function getStatusBadgeClass(status: string): string {
  switch (status) {
    case '执行中': return 'bg-green-100 text-green-800'
    case '已完成': return 'bg-amber-100 text-amber-800'
    case '待执行': return 'bg-sky-100 text-sky-800'
    default: return 'bg-gray-100 text-gray-700'
  }
}

function getProgressColorClass(progress: number): string {
  if (progress >= 80) return 'bg-green-500'
  if (progress >= 50) return 'bg-blue-500'
  if (progress >= 30) return 'bg-amber-500'
  return 'bg-red-400'
}

function getProgressBarClass(progress: number): string {
  if (progress >= 80) return 'bg-green-500'
  if (progress >= 50) return 'bg-blue-500'
  if (progress >= 30) return 'bg-amber-500'
  return 'bg-red-400'
}

function getProgressTextClass(progress: number): string {
  if (progress >= 80) return 'text-green-600'
  if (progress >= 50) return 'text-blue-600'
  if (progress >= 30) return 'text-amber-600'
  return 'text-red-500'
}
</script>
