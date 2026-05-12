<template>
  <div class="space-y-6">
    <!-- 页面标题 + 操作 -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold tracking-tight">计划清单</h1>
        <p class="mt-1 text-sm text-muted-foreground">跟踪和管理各作物种植进度与农事安排</p>
      </div>
      <button
        class="inline-flex items-center justify-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
        @click="showSchemeDialog = true"
      >
        <Plus class="h-4 w-4" />
        新建计划
      </button>
    </div>

    <!-- 查询条件 -->
    <div class="rounded-lg border bg-card p-4 shadow-sm">
      <div class="flex flex-wrap items-end gap-4">
        <!-- 年份 -->
        <div class="flex flex-col gap-1.5">
          <label class="text-sm font-medium text-muted-foreground">年份</label>
          <select
            v-model="filters.year"
            class="h-9 w-36 rounded-md border bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
          >
            <option value="">全部</option>
            <option v-for="y in yearOptions" :key="y" :value="y">{{ y }}</option>
          </select>
        </div>

        <!-- 所属单位（树形） -->
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

        <!-- 种植模式 -->
        <div class="flex flex-col gap-1.5">
          <label class="text-sm font-medium text-muted-foreground">种植模式</label>
          <select
            v-model="filters.plantingMode"
            class="h-9 w-32 rounded-md border bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
          >
            <option value="">全部</option>
            <option value="大田种植">大田种植</option>
            <option value="设施种植">设施种植</option>
          </select>
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
       

        <!-- 进度状态 -->
        <div class="flex flex-col gap-1.5">
          <label class="text-sm font-medium text-muted-foreground">进度状态</label>
          <select
            v-model="filters.progressStatus"
            class="h-9 w-32 rounded-md border bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
          >
            <option value="">全部</option>
            <option value="not_effective">未生效</option>
            <option value="executing">执行中</option>
            <option value="partial_done">部分完成</option>
            <option value="all_done">全部完成</option>
            <option value="archived">已归档</option>
            <option value="voided">已作废</option>
          </select>
        </div>

        <!-- 操作按钮 -->
        <div class="flex gap-2">
          <button
            class="h-9 rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90"
            @click="currentPage = 1"
          >
            查询
          </button>
          <button
            class="h-9 rounded-md border bg-background px-4 text-sm font-medium text-foreground shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground"
            @click="resetFilters"
          >
            重置
          </button>
        </div>
      </div>
    </div>

    <!-- 列表 -->
    <div class="rounded-lg border bg-card shadow-sm">
      <div class="overflow-x-auto">
        <table class="w-full text-sm">
          <thead>
            <tr class="border-b bg-muted/50">
              <th class="h-10 px-4 text-left font-medium text-muted-foreground">年份</th>
              <th class="h-10 px-4 text-left font-medium text-muted-foreground">种植计划编号</th>
              <th class="h-10 px-4 text-left font-medium text-muted-foreground">种植计划名称</th>
              <th class="h-10 px-4 text-left font-medium text-muted-foreground">所属单位</th>
              <th class="h-10 px-4 text-left font-medium text-muted-foreground">种植模式</th>
              <th class="h-10 px-4 text-left font-medium text-muted-foreground">种植作物大类</th>
              <th class="h-10 px-4 text-left font-medium text-muted-foreground">种植品种</th>
              <th class="h-10 px-4 text-right font-medium text-muted-foreground">计划种植总面积</th>
              <th class="h-10 px-4 text-center font-medium text-muted-foreground">资源信息</th>
              <th class="h-10 px-4 text-left font-medium text-muted-foreground">执行负责人</th>
              <th class="h-10 px-4 text-center font-medium text-muted-foreground">审批状态</th>
              <th class="h-10 px-4 text-left font-medium text-muted-foreground">生效时间</th>
              <th class="h-10 px-4 text-center font-medium text-muted-foreground">进度状态</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="item in paginatedItems"
              :key="item.id"
              class="border-b transition-colors hover:bg-muted/30"
            >
              <td class="h-12 px-4">{{ item.year }}</td>
              <td class="h-12 px-4 font-mono text-xs">{{ item.planCode }}</td>
              <td class="h-12 px-4 font-medium">{{ item.planName }}</td>
              <td class="h-12 px-4">{{ item.unit }}</td>
              <td class="h-12 px-4">{{ item.plantingMode }}</td>
              <td class="h-12 px-4">{{ item.cropCategory }}</td>
              <td class="h-12 px-4">{{ item.cropVariety }}</td>
              <td class="h-12 px-4 text-right">{{ item.totalArea.toLocaleString() }} 亩</td>
              <td class="h-12 px-4 text-center">
                <span class="inline-flex items-center rounded-md bg-blue-50 px-1.5 py-0.5 text-xs font-medium text-blue-700">
                  {{ item.resourceCount }} 项
                </span>
              </td>
              <td class="h-12 px-4">{{ item.execLeader }}</td>
              <td class="h-12 px-4 text-center">
                <span :class="approvalBadgeClass(item.approvalStatus)">
                  {{ approvalStatusLabel(item.approvalStatus) }}
                </span>
              </td>
              <td class="h-12 px-4">{{ item.effectiveTime || '-' }}</td>
              <td class="h-12 px-4 text-center">
                <span :class="progressBadgeClass(item.progressStatus)">
                  {{ progressStatusLabel(item.progressStatus) }}
                </span>
              </td>
            </tr>
            <tr v-if="filteredItems.length === 0">
              <td colspan="13" class="h-24 text-center text-muted-foreground">暂无数据</td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- 分页 -->
      <div class="flex items-center justify-between px-4 py-3 border-t">
        <span class="text-sm text-muted-foreground">共 {{ filteredItems.length }} 条</span>
        <div class="flex items-center gap-1">
          <button
            class="inline-flex h-8 w-8 items-center justify-center rounded-md border text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            :disabled="currentPage === 1"
            @click="currentPage = 1"
          >
            <ChevronsLeft class="h-4 w-4" />
          </button>
          <button
            class="inline-flex h-8 w-8 items-center justify-center rounded-md border text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            :disabled="currentPage === 1"
            @click="currentPage--"
          >
            <ChevronLeft class="h-4 w-4" />
          </button>
          <template v-for="page in visiblePages" :key="page">
            <span v-if="page === '...'" class="px-1 text-sm text-muted-foreground">...</span>
            <button
              v-else
              class="inline-flex h-8 w-8 items-center justify-center rounded-md border text-sm"
              :class="currentPage === page ? 'bg-primary text-primary-foreground border-primary' : ''"
              @click="currentPage = page as number"
            >
              {{ page }}
            </button>
          </template>
          <button
            class="inline-flex h-8 w-8 items-center justify-center rounded-md border text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            :disabled="currentPage === totalPages"
            @click="currentPage++"
          >
            <ChevronRight class="h-4 w-4" />
          </button>
          <button
            class="inline-flex h-8 w-8 items-center justify-center rounded-md border text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            :disabled="currentPage === totalPages"
            @click="currentPage = totalPages"
          >
            <ChevronsRight class="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  </div>

  <!-- 选择种植方案对话框 -->
  <div
    v-if="showSchemeDialog"
    class="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
    @click.self="closeSchemeDialog"
  >
    <div class="w-[680px] max-h-[80vh] rounded-lg border bg-card shadow-xl flex flex-col">
      <!-- 对话框标题 -->
      <div class="flex items-center justify-between border-b px-6 py-4">
        <div>
          <h3 class="text-lg font-semibold">选择种植方案</h3>
          <p class="text-sm text-muted-foreground mt-0.5">引用已生效的种植方案，代入至种植计划中</p>
        </div>
        <button class="rounded-md p-1 hover:bg-muted" @click="closeSchemeDialog">
          <X class="h-5 w-5 text-muted-foreground" />
        </button>
      </div>
      <!-- 搜索 -->
      <div class="px-6 py-3 border-b">
        <div class="relative">
          <Search class="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            v-model="schemeSearch"
            type="text"
            placeholder="搜索方案编号、名称、作物、单位..."
            class="h-9 w-full rounded-md border bg-background pl-9 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
        </div>
      </div>
      <!-- 方案列表 -->
      <div class="flex-1 overflow-y-auto px-6 py-3">
        <div
          v-for="scheme in filteredSchemes"
          :key="scheme.id"
          class="mb-2 rounded-lg border p-4 cursor-pointer transition-colors hover:bg-muted/50"
          :class="selectedSchemeId === scheme.id ? 'border-primary bg-primary/5 ring-1 ring-primary/30' : 'border-border'"
          @click="selectScheme(scheme)"
        >
          <div class="flex items-start justify-between">
            <div>
              <div class="flex items-center gap-2">
                <span class="font-mono text-xs text-muted-foreground">{{ scheme.id }}</span>
                <span class="inline-flex items-center rounded-md bg-green-100 px-1.5 py-0.5 text-xs font-medium text-green-700">已生效</span>
              </div>
              <div class="mt-1 font-medium">{{ scheme.name }}</div>
            </div>
            <span class="text-xs text-muted-foreground">版本号：v{{ scheme.version }}</span>
          </div>
          <div class="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground">
            <span>种植模式：{{ scheme.plantingMode }}</span>
            <span>作物：{{ scheme.cropCategory }} · {{ scheme.cropVariety }}</span>
            <span>单位：{{ scheme.unit }}</span>
            <span>生育周期：{{ scheme.totalDays }}天</span>
            <span>生效时间：{{ scheme.effectiveTime }}</span>
          </div>
        </div>
        <div v-if="filteredSchemes.length === 0" class="py-8 text-center text-sm text-muted-foreground">
          未找到已生效的种植方案
        </div>
      </div>
      <!-- 底部操作 -->
      <div class="flex items-center justify-end gap-3 border-t px-6 py-4">
        <button
          class="rounded-md border bg-background px-4 py-2 text-sm font-medium shadow-sm transition-colors hover:bg-muted"
          @click="closeSchemeDialog"
        >
          取消
        </button>
        <button
          class="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
          :disabled="!selectedSchemeId"
          @click="confirmCreatePlan"
        >
          确认引用
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import {
  ChevronDown, ChevronLeft, ChevronRight, ChevronRight as ChevronRightIcon,
  ChevronsLeft, ChevronsRight, Minus, Plus, X, Search,
} from 'lucide-vue-next'

const router = useRouter()

// ==================== 类型定义 ====================
type ApprovalStatus = 'draft' | 'review' | 'returned' | 'revoked' | 'forced_end' | 'completed'
type ProgressStatus = 'not_effective' | 'executing' | 'partial_done' | 'all_done' | 'archived' | 'voided'

interface ScheduleItem {
  id: string
  year: number
  planCode: string
  planName: string
  unit: string
  plantingMode: string
  cropCategory: string
  cropVariety: string
  totalArea: number
  resourceCount: number
  execLeader: string
  approvalStatus: ApprovalStatus
  effectiveTime: string
  progressStatus: ProgressStatus
  planProgress: number
}

// ==================== 组织树数据（与种植方案一致） ====================
const orgTree = [
  {
    label: '哈尔滨公司',
    children: ['松北农场', '呼兰农场', '阿城农场', '双城分场', '五常分场']
  },
  {
    label: '沈阳公司',
    children: ['苏家屯农场', '新民农场', '辽中分场', '法库分场']
  }
]
// ==================== 年份选项 ====================
const yearOptions = [2026, 2025, 2024, 2023]

// ==================== 查询条件 ====================
const filters = ref({
  year: '',
  org: '',
  plantingMode: '',
  cropCategory: '',
  cropVariety: '',
  progressStatus: '',
})
const expandedOrgs = ref<string[]>([])
const showOrgTree = ref(false)

function toggleOrgNode(label: string) {
  const idx = expandedOrgs.value.indexOf(label)
  if (idx === -1) {
    expandedOrgs.value.push(label)
  } else {
    expandedOrgs.value.splice(idx, 1)
  }
}

function selectOrg(name: string) {
  filters.value.org = name
  showOrgTree.value = false
  currentPage.value = 1
}

function handleClickOutside(e: MouseEvent) {
  const target = e.target as HTMLElement
  if (!target.closest('.unit-tree-dropdown')) {
    showOrgTree.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})

// ==================== 作物数据（与种植方案一致，来源：基础管理→作物管理） ====================
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

watch(() => filters.value.cropCategory, () => {
  filters.value.cropVariety = ''
})



function resetFilters() {
  filters.value = { year: '', org: '', plantingMode: '', cropCategory: '', cropVariety: '', progressStatus: '' }
  currentPage.value = 1
}

// ==================== 审批状态样式 ====================
function approvalStatusLabel(status: ApprovalStatus): string {
  const map: Record<ApprovalStatus, string> = {
    draft: '草稿',
    review: '审批中',
    returned: '已退回',
    revoked: '已撤回',
    forced_end: '强制结束',
    completed: '已完成',
  }
  return map[status] || status
}

function approvalBadgeClass(status: ApprovalStatus): string {
  const base = 'inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium'
  const map: Record<ApprovalStatus, string> = {
    draft: 'bg-gray-100 text-gray-700',
    review: 'bg-amber-100 text-amber-700',
    returned: 'bg-red-100 text-red-700',
    revoked: 'bg-orange-100 text-orange-700',
    forced_end: 'bg-purple-100 text-purple-700',
    completed: 'bg-green-100 text-green-700',
  }
  return `${base} ${map[status] || ''}`
}

// ==================== 进度状态样式 ====================
function progressStatusLabel(status: ProgressStatus): string {
  const map: Record<ProgressStatus, string> = {
    not_effective: '未生效',
    executing: '执行中',
    partial_done: '部分完成',
    all_done: '全部完成',
    archived: '已归档',
    voided: '已作废',
  }
  return map[status] || status
}

function progressBadgeClass(status: ProgressStatus): string {
  const base = 'inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium'
  const map: Record<ProgressStatus, string> = {
    not_effective: 'bg-gray-100 text-gray-600',
    executing: 'bg-blue-100 text-blue-700',
    partial_done: 'bg-amber-100 text-amber-700',
    all_done: 'bg-green-100 text-green-700',
    archived: 'bg-purple-100 text-purple-700',
    voided: 'bg-red-100 text-red-700',
  }
  return `${base} ${map[status] || ''}`
}

// ==================== 模拟数据 ====================
const allItems: ScheduleItem[] = [
  { id: '1', year: 2026, planCode: 'ZJ-2026-001', planName: '水稻智能灌溉计划', unit: '松北农场', plantingMode: '大田种植', cropCategory: '水稻', cropVariety: '籼稻', totalArea: 5000, resourceCount: 8, execLeader: '刘场长', approvalStatus: 'draft', effectiveTime: '', progressStatus: 'not_effective', planProgress: 0 },
  { id: '2', year: 2026, planCode: 'ZJ-2026-002', planName: '大豆窄行密植计划', unit: '双城分场', plantingMode: '大田种植', cropCategory: '水稻', cropVariety: '杂交稻',totalArea: 3200, resourceCount: 5, execLeader: '陈主管', approvalStatus: 'draft', effectiveTime: '', progressStatus: 'not_effective', planProgress: 0 },
  { id: '3', year: 2026, planCode: 'ZJ-2026-003', planName: '油菜机械化种植计划', unit: '辽中分场', plantingMode: '大田种植', cropCategory: '小麦', cropVariety: '强筋小麦',totalArea: 2800, resourceCount: 6, execLeader: '孙经理', approvalStatus: 'completed', effectiveTime: '2026-03-01', progressStatus: 'executing', planProgress: 35 },
  { id: '4', year: 2026, planCode: 'ZJ-2026-004', planName: '棉花滴灌种植计划', unit: '法库分场', plantingMode: '设施种植', cropCategory: '小麦', cropVariety: '中筋小麦',totalArea: 4500, resourceCount: 9, execLeader: '周场长', approvalStatus: 'review', effectiveTime: '', progressStatus: 'not_effective', planProgress: 0 },
  { id: '5', year: 2026, planCode: 'ZJ-2026-005', planName: '番茄无土栽培计划', unit: '阿城农场', plantingMode: '设施种植', cropCategory: '玉米',cropVariety: '甜玉米', totalArea: 1200, resourceCount: 7, execLeader: '吴主管', approvalStatus: 'completed', effectiveTime: '2026-03-10', progressStatus: 'partial_done', planProgress: 60 },
  { id: '6', year: 2025, planCode: 'ZJ-2025-001', planName: '春季水稻高产计划', unit: '松北农场', plantingMode: '大田种植', cropCategory: '水稻', cropVariety: '籼稻', totalArea: 5500, resourceCount: 10, execLeader: '刘场长', approvalStatus: 'completed', effectiveTime: '2025-03-01', progressStatus: 'all_done', planProgress: 100 },
  { id: '7', year: 2025, planCode: 'ZJ-2025-002', planName: '小麦冬灌计划', unit: '呼兰农场', plantingMode: '大田种植', cropCategory: '水稻', cropVariety: '糯稻', totalArea: 4000, resourceCount: 6, execLeader: '马经理', approvalStatus: 'review', effectiveTime: '', progressStatus: 'not_effective', planProgress: 0 },
  { id: '8', year: 2025, planCode: 'ZJ-2025-003', planName: '大棚番茄种植计划', unit: '阿城农场', plantingMode: '设施种植', cropCategory: '玉米',cropVariety: '甜玉米', totalArea: 800, resourceCount: 5, execLeader: '吴主管', approvalStatus: 'completed', effectiveTime: '2025-03-01', progressStatus: 'archived', planProgress: 100 },
  { id: '9', year: 2025, planCode: 'ZJ-2025-004', planName: '苜蓿种植计划', unit: '五常分场', plantingMode: '大田种植', cropCategory: '大豆', cropVariety: '高油大豆', totalArea: 6000, resourceCount: 4, execLeader: '钱主管', approvalStatus: 'draft', effectiveTime: '', progressStatus: 'not_effective', planProgress: 0 },
  { id: '10', year: 2025, planCode: 'ZJ-2025-005', planName: '苹果矮化密植计划', unit: '苏家屯农场', plantingMode: '设施种植', cropCategory: '玉米', cropVariety: '糯玉米', totalArea: 2000, resourceCount: 8, execLeader: '冯场长', approvalStatus: 'returned', effectiveTime: '', progressStatus: 'not_effective', planProgress: 0 },
  { id: '11', year: 2025, planCode: 'ZJ-2025-006', planName: '玉米青贮计划', unit: '新民农场', plantingMode: '大田种植', cropCategory: '大豆',cropVariety: '高蛋白大豆', totalArea: 3800, resourceCount: 5, execLeader: '魏经理', approvalStatus: 'revoked', effectiveTime: '', progressStatus: 'voided', planProgress: 0 },
  { id: '12', year: 2024, planCode: 'ZJ-2024-001', planName: '春季水稻高产计划', unit: '松北农场', plantingMode: '大田种植', cropCategory: '水稻', cropVariety: '籼稻', totalArea: 5200, resourceCount: 9, execLeader: '刘场长', approvalStatus: 'completed', effectiveTime: '2024-03-01', progressStatus: 'archived', planProgress: 100 },
  { id: '13', year: 2024, planCode: 'ZJ-2024-002', planName: '冬小麦越冬计划', unit: '呼兰农场', plantingMode: '大田种植', cropCategory: '水稻', cropVariety: '糯稻', totalArea: 4500, resourceCount: 6, execLeader: '马经理', approvalStatus: 'completed', effectiveTime: '2024-02-01', progressStatus: 'archived', planProgress: 100 },
  { id: '14', year: 2024, planCode: 'ZJ-2024-003', planName: '夏玉米密植计划', unit: '苏家屯农场', plantingMode: '大田种植', cropCategory: '水稻', cropVariety: '玉米', totalArea: 3600, resourceCount: 6, execLeader: '冯场长', approvalStatus: 'completed', effectiveTime: '2024-05-01', progressStatus: 'all_done', planProgress: 100 },
  { id: '15', year: 2024, planCode: 'ZJ-2024-004', planName: '大豆轮作计划', unit: '阿城农场', plantingMode: '大田种植', cropCategory: '水稻', cropVariety: '杂交稻',totalArea: 2800, resourceCount: 4, execLeader: '陈主管', approvalStatus: 'completed', effectiveTime: '2024-04-10', progressStatus: 'partial_done', planProgress: 75 },
  { id: '16', year: 2024, planCode: 'ZJ-2024-005', planName: '棉花管理计划', unit: '新民农场', plantingMode: '大田种植', cropCategory: '小麦', cropVariety: '中筋小麦',totalArea: 4200, resourceCount: 8, execLeader: '魏经理', approvalStatus: 'completed', effectiveTime: '2024-03-15', progressStatus: 'executing', planProgress: 85 },
  { id: '17', year: 2024, planCode: 'ZJ-2024-006', planName: '油菜秋播计划', unit: '辽中分场', plantingMode: '大田种植', cropCategory: '小麦', cropVariety: '强筋小麦',totalArea: 2200, resourceCount: 5, execLeader: '孙经理', approvalStatus: 'returned', effectiveTime: '', progressStatus: 'not_effective', planProgress: 0 },
  { id: '18', year: 2024, planCode: 'ZJ-2024-007', planName: '花生覆膜计划', unit: '双城分场', plantingMode: '大田种植', cropCategory: '小麦', cropVariety: '弱筋小麦',totalArea: 1800, resourceCount: 4, execLeader: '钱主管', approvalStatus: 'completed', effectiveTime: '2024-03-20', progressStatus: 'all_done', planProgress: 100 },
  { id: '19', year: 2024, planCode: 'ZJ-2024-008', planName: '黄瓜精细管理计划', unit: '法库分场', plantingMode: '设施种植', cropCategory: '玉米', cropVariety: '糯玉米', totalArea: 1000, resourceCount: 6, execLeader: '周场长', approvalStatus: 'forced_end', effectiveTime: '', progressStatus: 'voided', planProgress: 20 },
  { id: '20', year: 2023, planCode: 'ZJ-2023-001', planName: '水稻常规种植计划', unit: '松北农场', plantingMode: '大田种植', cropCategory: '水稻', cropVariety: '籼稻', totalArea: 5000, resourceCount: 8, execLeader: '刘场长', approvalStatus: 'completed', effectiveTime: '2023-03-01', progressStatus: 'archived', planProgress: 100 },
  { id: '21', year: 2023, planCode: 'ZJ-2023-002', planName: '玉米示范田计划', unit: '苏家屯农场', plantingMode: '大田种植', cropCategory: '水稻', cropVariety: '玉米', totalArea: 1500, resourceCount: 5, execLeader: '冯场长', approvalStatus: 'completed', effectiveTime: '2023-05-01', progressStatus: 'archived', planProgress: 100 },
  { id: '22', year: 2023, planCode: 'ZJ-2023-003', planName: '棉花试种计划', unit: '新民农场', plantingMode: '大田种植', cropCategory: '小麦', cropVariety: '中筋小麦',totalArea: 800, resourceCount: 3, execLeader: '魏经理', approvalStatus: 'completed', effectiveTime: '2023-04-01', progressStatus: 'archived', planProgress: 100 },
  { id: '23', year: 2025, planCode: 'ZJ-2025-007', planName: '小麦良种繁育计划', unit: '呼兰农场', plantingMode: '大田种植', cropCategory: '水稻', cropVariety: '糯稻', totalArea: 3000, resourceCount: 6, execLeader: '马经理', approvalStatus: 'completed', effectiveTime: '2025-09-15', progressStatus: 'executing', planProgress: 40 },
  { id: '24', year: 2025, planCode: 'ZJ-2025-008', planName: '花生高产示范计划', unit: '双城分场', plantingMode: '大田种植', cropCategory: '小麦', cropVariety: '弱筋小麦',totalArea: 1500, resourceCount: 4, execLeader: '钱主管', approvalStatus: 'completed', effectiveTime: '2025-04-20', progressStatus: 'partial_done', planProgress: 70 },
]

// ==================== 筛选逻辑 ====================
function matchOrg(unit: string, filterOrg: string): boolean {
  if (!filterOrg) return true
  if (unit === filterOrg) return true
  for (const org of orgTree) {
    if (org.label === filterOrg && org.children.includes(unit)) return true
  }
  return false
}

const filteredItems = computed(() => {
  return allItems.filter(item => {
    if (filters.value.year && item.year !== Number(filters.value.year)) return false
    if (filters.value.org && !matchOrg(item.unit, filters.value.org)) return false
    if (filters.value.plantingMode && item.plantingMode !== filters.value.plantingMode) return false
    if (filters.value.cropCategory && item.cropCategory !== filters.value.cropCategory) return false
    if (filters.value.cropVariety && item.cropVariety !== filters.value.cropVariety) return false
    if (filters.value.progressStatus && item.progressStatus !== filters.value.progressStatus) return false
    return true
  })
})

// ==================== 分页 ====================
const currentPage = ref(1)
const pageSize = 10

const totalPages = computed(() => Math.max(1, Math.ceil(filteredItems.value.length / pageSize)))

const paginatedItems = computed(() => {
  const start = (currentPage.value - 1) * pageSize
  return filteredItems.value.slice(start, start + pageSize)
})

const visiblePages = computed(() => {
  const total = totalPages.value
  const current = currentPage.value
  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1)
  }
  const pages: (number | string)[] = [1]
  if (current > 3) pages.push('...')
  for (let i = Math.max(2, current - 1); i <= Math.min(total - 1, current + 1); i++) {
    pages.push(i)
  }
  if (current < total - 2) pages.push('...')
  pages.push(total)
  return pages
})

// ==================== 新建计划 - 引用种植方案 ====================
interface EffectiveScheme {
  id: string
  name: string
  plantingMode: string
  cropCategory: string
  cropVariety: string
  unit: string
  applicableArea: string
  totalDays: number
  version: number
  effectiveTime: string
}

const showSchemeDialog = ref(false)
const schemeSearch = ref('')
const selectedSchemeId = ref('')

// 已生效的种植方案（审批完成 + 生效状态=已生效）
const effectiveSchemes: EffectiveScheme[] = [
  { id: 'SP-2024-001', name: '春季水稻高产方案', plantingMode: '大田种植', cropCategory: '水稻', cropVariety: '籼稻', unit: '松北农场', applicableArea: '松北平原', totalDays: 135, version: 2, effectiveTime: '2024-03-01' },
  { id: 'SP-2024-002', name: '冬小麦越冬方案', plantingMode: '大田种植', cropCategory: '小麦', cropVariety: '强筋小麦', unit: '呼兰农场', applicableArea: '呼兰流域', totalDays: 230, version: 1, effectiveTime: '2024-02-01' },
  { id: 'SP-2024-005', name: '棉花管理方案', plantingMode: '大田种植', cropCategory: '小麦', cropVariety: '强筋小麦', unit: '新民农场', applicableArea: '新民产区', totalDays: 180, version: 3, effectiveTime: '2024-03-15' },
  { id: 'SP-2024-007', name: '花生覆膜方案', plantingMode: '大田种植', cropCategory: '小麦', cropVariety: '强筋小麦', unit: '双城分场', applicableArea: '双城产区', totalDays: 140, version: 1, effectiveTime: '2024-03-20' },
  { id: 'SP-2025-001', name: '春季水稻高产方案(25)', plantingMode: '大田种植', cropCategory: '玉米', cropVariety: '甜玉米', unit: '松北农场', applicableArea: '松北平原', totalDays: 140, version: 1, effectiveTime: '2025-03-01' },
  { id: 'SP-2025-003', name: '大棚番茄种植方案', plantingMode: '设施种植', cropCategory: '大豆', cropVariety: '高蛋白大豆', unit: '阿城农场', applicableArea: '阿城设施区', totalDays: 160, version: 2, effectiveTime: '2025-03-01' },
  { id: 'SP-2026-003', name: '油菜机械化方案', plantingMode: '大田种植', cropCategory: '玉米', cropVariety: '糯玉米', unit: '辽中分场', applicableArea: '辽中产区', totalDays: 195, version: 1, effectiveTime: '2026-02-01' },
  { id: 'SP-2026-005', name: '番茄无土栽培方案', plantingMode: '设施种植', cropCategory: '大豆', cropVariety: '高油大豆', unit: '阿城农场', applicableArea: '阿城设施区', totalDays: 165, version: 1, effectiveTime: '2026-03-10' },
]

const filteredSchemes = computed(() => {
  if (!schemeSearch.value) return effectiveSchemes
  const kw = schemeSearch.value.toLowerCase()
  return effectiveSchemes.filter(s =>
    s.name.toLowerCase().includes(kw) ||
    s.id.toLowerCase().includes(kw) ||
    s.cropCategory.includes(kw) ||
    s.cropVariety.includes(kw) ||
    s.unit.includes(kw)
  )
})

function selectScheme(scheme: EffectiveScheme): void {
  selectedSchemeId.value = scheme.id
}

function confirmCreatePlan(): void {
  if (!selectedSchemeId.value) return
  router.push({
    path: '/planting-schedule/form',
    query: { schemeId: selectedSchemeId.value },
  })
}

function closeSchemeDialog(): void {
  showSchemeDialog.value = false
  schemeSearch.value = ''
  selectedSchemeId.value = ''
}
</script>
