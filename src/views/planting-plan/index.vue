<template>
  <div class="space-y-6">
    <!-- 页面标题 + 操作 -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold tracking-tight">种植方案</h1>
        <p class="mt-1 text-sm text-muted-foreground">管理和制定各类作物种植技术方案</p>
      </div>
      <button
        class="inline-flex items-center justify-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
        @click="handleCreate"
      >
        <Plus class="h-4 w-4" />
        新建方案
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
              type="button"
              class="flex h-9 min-w-[200px] items-center justify-between rounded-md border bg-background px-3 text-sm hover:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/30"
              :class="filters.org ? '' : 'text-muted-foreground'"
              @click="showOrgTree = !showOrgTree"
            >
              <span class="truncate">{{ filters.org || '全部' }}</span>
              <ChevronDown class="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </button>
            <div
              v-if="showOrgTree"
              class="absolute left-0 top-full z-50 mt-1 w-full min-w-[260px] overflow-auto rounded-md border bg-card shadow-lg"
            >
              <div class="p-2">
                <div
                  class="cursor-pointer rounded px-2 py-1.5 text-sm hover:bg-muted"
                  :class="filters.org === '' ? 'bg-primary/10 font-medium text-primary' : ''"
                  @click="selectOrg('')"
                >
                  全部
                </div>
                <template v-for="org in orgTree" :key="org.label">
                  <div
                    class="cursor-pointer rounded px-2 py-1.5 text-sm font-medium hover:bg-muted flex items-center gap-1"
                    @click.stop="toggleOrgNode(org.label)"
                  >
                    <ChevronRight
                      class="h-3.5 w-3.5 transition-transform shrink-0"
                      :class="expandedOrgs.includes(org.label) ? 'rotate-90' : ''"
                    />
                    <span class="truncate" :class="filters.org === org.label ? 'text-primary' : ''">{{ org.label }}</span>
                  </div>
                  <template v-if="expandedOrgs.includes(org.label)">
                    <div
                      v-for="child in org.children"
                      :key="child"
                      class="cursor-pointer rounded py-1.5 pl-8 pr-2 text-sm hover:bg-muted"
                      :class="filters.org === child ? 'bg-primary/10 text-primary font-medium' : ''"
                      @click="selectOrg(child)"
                    >
                      {{ child }}
                    </div>
                  </template>
                </template>
              </div>
            </div>
          </div>
        </div>
        <!-- 种植模式 -->
        <div class="flex flex-col gap-1.5">
          <label class="text-sm font-medium text-muted-foreground">种植模式</label>
          <select
            v-model="filters.plantingMode"
            class="h-9 min-w-[120px] rounded-md border bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
          >
            <option value="">全部</option>
            <option value="露地种植">露地种植</option>
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
        <!-- 生效状态 -->
        <div class="flex flex-col gap-1.5">
          <label class="text-sm font-medium text-muted-foreground">生效状态</label>
          <select
            v-model="filters.status"
            class="h-9 min-w-[120px] rounded-md border bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
          >
            <option value="">全部</option>
            <option value="active">执行中</option>
            <option value="review">审核中</option>
            <option value="draft">草稿</option>
            <option value="returned">已退回</option>
            <option value="archived">已归档</option>
          </select>
        </div>
        <div class="flex gap-2">
          <button
            class="h-9 rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground hover:bg-primary/90"
            @click="currentPage = 1"
          >
            查询
          </button>
          <button
            class="h-9 rounded-md border px-4 text-sm font-medium hover:bg-muted"
            @click="resetFilters"
          >
            重置
          </button>
        </div>
      </div>
    </div>

    <!-- 方案列表 -->
    <div class="rounded-lg border bg-card shadow-sm">
      <div class="overflow-x-auto">
        <table class="w-full text-sm">
          <thead>
            <tr class="border-b bg-muted/50">
              <th class="h-10 px-4 text-left font-medium text-muted-foreground">编号</th>
              <th class="h-10 px-4 text-left font-medium text-muted-foreground">方案名称</th>
              <th class="h-10 px-4 text-left font-medium text-muted-foreground">所属单位</th>
              <th class="h-10 px-4 text-left font-medium text-muted-foreground">种植模式</th>
              <th class="h-10 px-4 text-left font-medium text-muted-foreground">作物大类</th>
              <th class="h-10 px-4 text-left font-medium text-muted-foreground">作物品种</th>
              <th class="h-10 px-4 text-left font-medium text-muted-foreground">季节</th>
              <th class="h-10 px-4 text-right font-medium text-muted-foreground">面积(亩)</th>
              <th class="h-10 px-4 text-left font-medium text-muted-foreground">产量目标</th>
              <th class="h-10 px-4 text-center font-medium text-muted-foreground">生效状态</th>
              <th class="h-10 px-4 text-center font-medium text-muted-foreground">版本</th>
              <th class="h-10 px-4 text-left font-medium text-muted-foreground">创建人</th>
              <th class="h-10 px-4 text-left font-medium text-muted-foreground">创建日期</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="item in paginatedItems"
              :key="item.scheme.id + '-v' + item.scheme.version"
              class="border-b transition-colors hover:bg-muted/30 cursor-pointer"
              @click="handleViewVersion(item.scheme)"
            >
              <td class="h-12 px-4 font-mono text-xs">{{ item.scheme.id }}</td>
              <td class="h-12 px-4 font-medium">{{ item.scheme.name }}</td>
              <td class="h-12 px-4 text-muted-foreground text-xs">{{ item.scheme.unit }}</td>
              <td class="h-12 px-4 text-muted-foreground">{{ item.scheme.plantingMode }}</td>
              <td class="h-12 px-4">
                <span class="inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-normal">{{ item.scheme.cropCategory }}</span>
              </td>
              <td class="h-12 px-4 text-muted-foreground">{{ item.scheme.cropVariety }}</td>
              <td class="h-12 px-4 text-muted-foreground">{{ item.scheme.season }}</td>
              <td class="h-12 px-4 text-right">{{ item.scheme.area }}</td>
              <td class="h-12 px-4">{{ item.scheme.yieldTarget }}</td>
              <td class="h-12 px-4 text-center">
                <span :class="statusBadgeClass(item.scheme.status)">
                  <component :is="statusIcon(item.scheme.status)" class="h-3 w-3" />
                  {{ statusLabel(item.scheme.status) }}
                </span>
              </td>
              <td class="h-12 px-4 text-center">
                <button
                  class="inline-flex items-center gap-1 text-primary hover:underline text-xs font-medium"
                  @click.stop="openVersionPanel(item.scheme)"
                >
                  v{{ item.scheme.version }}
                  <component :is="item.versions.length > 1 ? ChevronDown : Minus" class="h-3 w-3" />
                </button>
              </td>
              <td class="h-12 px-4 text-muted-foreground">{{ item.scheme.creator }}</td>
              <td class="h-12 px-4 text-muted-foreground text-xs">{{ item.scheme.createdAt }}</td>
            </tr>
            <tr v-if="paginatedItems.length === 0">
              <td colspan="13" class="h-24 text-center text-muted-foreground">暂无数据</td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- 分页 -->
      <div v-if="totalPages > 1" class="flex items-center justify-between border-t px-4 py-3">
        <p class="text-sm text-muted-foreground">
          第 {{ currentPage }} / {{ totalPages }} 页，共 <span class="font-medium">{{ filteredSchemes.length }} </span> 条记录
        </p>
        <div class="flex items-center gap-1">
          <button
            class="inline-flex h-8 w-8 items-center justify-center rounded-md border border-input text-sm hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed"
            :disabled="currentPage === 1"
            @click="currentPage--"
          >
            <ChevronLeft class="h-4 w-4" />
          </button>
          <template v-for="p in visiblePages" :key="p">
            <button
              v-if="p !== '...'"
              class="inline-flex h-8 w-8 items-center justify-center rounded-md border text-sm transition-colors"
              :class="p === currentPage ? 'border-primary bg-primary text-primary-foreground' : 'border-input hover:bg-muted'"
              @click="currentPage = p as number"
            >
              {{ p }}
            </button>
            <span v-else class="px-1 text-muted-foreground">...</span>
          </template>
          <button
            class="inline-flex h-8 w-8 items-center justify-center rounded-md border border-input text-sm hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed"
            :disabled="currentPage === totalPages"
            @click="currentPage++"
          >
            <ChevronRight class="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>

    <!-- 版本查看面板 -->
    <div
      v-if="versionPanelVisible"
      class="fixed inset-0 z-50 flex justify-end bg-black/40"
      @click.self="versionPanelVisible = false"
    >
      <div class="w-[420px] bg-background shadow-xl h-full overflow-auto">
        <div class="flex items-center justify-between border-b px-6 py-4">
          <h3 class="text-lg font-semibold">版本记录</h3>
          <button class="text-muted-foreground hover:text-foreground" @click="versionPanelVisible = false">
            <X class="h-5 w-5" />
          </button>
        </div>
        <div class="p-6">
          <p class="mb-4 text-sm text-muted-foreground">
            {{ versionPanelScheme?.name }} - 历史版本
          </p>
          <div class="space-y-3">
            <div
              v-for="ver in versionPanelVersions"
              :key="ver.version"
              class="rounded-lg border p-4 hover:bg-muted/50 cursor-pointer transition-colors"
              @click="handleViewVersion(ver)"
            >
              <div class="flex items-center justify-between">
                <span class="font-medium text-primary">v{{ ver.version }}</span>
                <span :class="statusBadgeClass(ver.status)" class="text-xs">
                  <component :is="statusIcon(ver.status)" class="h-3 w-3" />
                  {{ statusLabel(ver.status) }}
                </span>
              </div>
              <div class="mt-2 space-y-1 text-xs text-muted-foreground">
                <p>创建人：{{ ver.creator }}</p>
                <p>创建日期：{{ ver.createdAt }}</p>
                <p>修改说明：{{ ver.changeNote || '无' }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import {
  Plus, FileText, CheckCircle2, Clock, AlertCircle,
  ChevronDown, ChevronLeft, ChevronRight, ChevronRight as ChevronRightIcon, X, Minus,
  Send, CornerDownLeft
} from 'lucide-vue-next'
import { showToast } from '@/lib/toast'

// ==================== 类型定义 ====================
interface SchemeVersion {
  id: string
  name: string
  unit: string
  plantingMode: string
  cropCategory: string
  cropVariety: string
  season: string
  area: number
  yieldTarget: string
  status: 'active' | 'draft' | 'review' | 'returned' | 'archived'
  creator: string
  createdAt: string
  version: number
  changeNote: string
  year: number
}

interface SchemeGroup {
  baseId: string
  versions: SchemeVersion[]
}

// ==================== 组织树数据 ====================
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
}

// 点击外部关闭树形下拉
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

// ==================== 作物数据 ====================
const cropCategoryMap: Record<string, string[]> = {
  '粮食作物': ['水稻-松粳22', '小麦-济麦22', '玉米-郑单958', '大豆-中黄13'],
  '经济作物': ['棉花-鲁棉研28', '油菜-秦油10号', '花生-花育33'],
  '园艺作物': ['茶叶-龙井43', '苹果-红富士', '番茄-中杂9号'],
  '饲草作物': ['紫花苜蓿-阿尔冈金', '饲用玉米-雅玉8号'],
}

const cropCategories = Object.keys(cropCategoryMap)

const cropVarietyOptions = computed(() => {
  if (!filters.value.cropCategory) return []
  return cropCategoryMap[filters.value.cropCategory] || []
})

// ==================== 年份选项 ====================
const yearOptions = [2026, 2025, 2024, 2023]

// ==================== 查询条件 ====================
const filters = ref({
  year: '',
  org: '',
  plantingMode: '',
  cropCategory: '',
  cropVariety: '',
  status: '',
})

function resetFilters() {
  filters.value = { year: '', org: '', plantingMode: '', cropCategory: '', cropVariety: '', status: '' }
  currentPage.value = 1
}

// ==================== 模拟数据 ====================
const allSchemes: SchemeVersion[] = [
  { id: 'SP-2024-001', name: '春季水稻高产方案', unit: '松北农场', plantingMode: '露地种植', cropCategory: '粮食作物', cropVariety: '水稻-松粳22', season: '春季', area: 250, yieldTarget: '650kg/亩', status: 'active', creator: '张农技', createdAt: '2024-02-15', version: 2, changeNote: '调整施肥配比', year: 2024 },
  { id: 'SP-2024-001', name: '春季水稻高产方案', unit: '松北农场', plantingMode: '露地种植', cropCategory: '粮食作物', cropVariety: '水稻-松粳22', season: '春季', area: 250, yieldTarget: '630kg/亩', status: 'archived', creator: '张农技', createdAt: '2024-01-10', version: 1, changeNote: '初始版本', year: 2024 },
  { id: 'SP-2024-002', name: '冬小麦越冬方案', unit: '呼兰农场', plantingMode: '露地种植', cropCategory: '粮食作物', cropVariety: '小麦-济麦22', season: '冬季', area: 175, yieldTarget: '500kg/亩', status: 'active', creator: '李规划', createdAt: '2024-01-20', version: 1, changeNote: '初始版本', year: 2024 },
  { id: 'SP-2024-003', name: '夏玉米密植方案', unit: '苏家屯农场', plantingMode: '露地种植', cropCategory: '粮食作物', cropVariety: '玉米-郑单958', season: '夏季', area: 95, yieldTarget: '700kg/亩', status: 'review', creator: '王技术', createdAt: '2024-03-10', version: 1, changeNote: '初始版本', year: 2024 },
  { id: 'SP-2024-004', name: '大豆轮作方案', unit: '阿城农场', plantingMode: '露地种植', cropCategory: '粮食作物', cropVariety: '大豆-中黄13', season: '春季', area: 60, yieldTarget: '200kg/亩', status: 'draft', creator: '赵助理', createdAt: '2024-03-18', version: 1, changeNote: '草稿', year: 2024 },
  { id: 'SP-2024-005', name: '棉花管理方案', unit: '新民农场', plantingMode: '露地种植', cropCategory: '经济作物', cropVariety: '棉花-鲁棉研28', season: '春季', area: 110, yieldTarget: '300kg/亩', status: 'active', creator: '张农技', createdAt: '2024-02-28', version: 3, changeNote: '增加病虫害防治', year: 2024 },
  { id: 'SP-2024-005', name: '棉花管理方案', unit: '新民农场', plantingMode: '露地种植', cropCategory: '经济作物', cropVariety: '棉花-鲁棉研28', season: '春季', area: 110, yieldTarget: '280kg/亩', status: 'archived', creator: '张农技', createdAt: '2024-02-01', version: 2, changeNote: '调整密度', year: 2024 },
  { id: 'SP-2024-005', name: '棉花管理方案', unit: '新民农场', plantingMode: '露地种植', cropCategory: '经济作物', cropVariety: '棉花-鲁棉研28', season: '春季', area: 100, yieldTarget: '260kg/亩', status: 'archived', creator: '张农技', createdAt: '2024-01-15', version: 1, changeNote: '初始版本', year: 2024 },
  { id: 'SP-2024-006', name: '油菜秋播方案', unit: '辽中分场', plantingMode: '露地种植', cropCategory: '经济作物', cropVariety: '油菜-秦油10号', season: '秋季', area: 70, yieldTarget: '180kg/亩', status: 'draft', creator: '李规划', createdAt: '2024-03-22', version: 1, changeNote: '草稿', year: 2024 },
  { id: 'SP-2024-007', name: '花生覆膜方案', unit: '双城分场', plantingMode: '露地种植', cropCategory: '经济作物', cropVariety: '花生-花育33', season: '春季', area: 55, yieldTarget: '350kg/亩', status: 'active', creator: '王技术', createdAt: '2024-03-05', version: 1, changeNote: '初始版本', year: 2024 },
  { id: 'SP-2024-008', name: '茶叶精细方案', unit: '法库分场', plantingMode: '设施种植', cropCategory: '园艺作物', cropVariety: '茶叶-龙井43', season: '秋季', area: 80, yieldTarget: '120kg/亩', status: 'archived', creator: '赵助理', createdAt: '2023-09-10', version: 1, changeNote: '初始版本', year: 2023 },
  { id: 'SP-2025-001', name: '春季水稻高产方案(25)', unit: '松北农场', plantingMode: '露地种植', cropCategory: '粮食作物', cropVariety: '水稻-松粳22', season: '春季', area: 260, yieldTarget: '680kg/亩', status: 'active', creator: '张农技', createdAt: '2025-02-10', version: 1, changeNote: '新年度方案', year: 2025 },
  { id: 'SP-2025-002', name: '小麦冬灌方案', unit: '呼兰农场', plantingMode: '露地种植', cropCategory: '粮食作物', cropVariety: '小麦-济麦22', season: '冬季', area: 180, yieldTarget: '520kg/亩', status: 'review', creator: '李规划', createdAt: '2025-01-05', version: 1, changeNote: '初始版本', year: 2025 },
  { id: 'SP-2025-003', name: '大棚番茄种植方案', unit: '阿城农场', plantingMode: '设施种植', cropCategory: '园艺作物', cropVariety: '番茄-中杂9号', season: '春季', area: 30, yieldTarget: '8000kg/亩', status: 'active', creator: '王技术', createdAt: '2025-02-20', version: 2, changeNote: '优化温控参数', year: 2025 },
  { id: 'SP-2025-003', name: '大棚番茄种植方案', unit: '阿城农场', plantingMode: '设施种植', cropCategory: '园艺作物', cropVariety: '番茄-中杂9号', season: '春季', area: 30, yieldTarget: '7500kg/亩', status: 'archived', creator: '王技术', createdAt: '2025-01-15', version: 1, changeNote: '初始版本', year: 2025 },
  { id: 'SP-2025-004', name: '苜蓿种植方案', unit: '五常分场', plantingMode: '露地种植', cropCategory: '饲草作物', cropVariety: '紫花苜蓿-阿尔冈金', season: '春季', area: 200, yieldTarget: '5000kg/亩', status: 'draft', creator: '赵助理', createdAt: '2025-03-01', version: 1, changeNote: '草稿', year: 2025 },
  { id: 'SP-2025-005', name: '苹果矮化密植方案', unit: '苏家屯农场', plantingMode: '设施种植', cropCategory: '园艺作物', cropVariety: '苹果-红富士', season: '春季', area: 45, yieldTarget: '4000kg/亩', status: 'returned', creator: '张农技', createdAt: '2025-03-10', version: 1, changeNote: '已退回修改', year: 2025 },
  { id: 'SP-2025-006', name: '玉米青贮方案', unit: '新民农场', plantingMode: '露地种植', cropCategory: '饲草作物', cropVariety: '饲用玉米-雅玉8号', season: '夏季', area: 150, yieldTarget: '4500kg/亩', status: 'review', creator: '李规划', createdAt: '2025-02-15', version: 1, changeNote: '初始版本', year: 2025 },
  { id: 'SP-2026-001', name: '水稻智能灌溉方案', unit: '松北农场', plantingMode: '露地种植', cropCategory: '粮食作物', cropVariety: '水稻-松粳22', season: '春季', area: 300, yieldTarget: '700kg/亩', status: 'draft', creator: '张农技', createdAt: '2026-02-01', version: 1, changeNote: '草稿', year: 2026 },
  { id: 'SP-2026-002', name: '大豆窄行密植方案', unit: '双城分场', plantingMode: '露地种植', cropCategory: '粮食作物', cropVariety: '大豆-中黄13', season: '春季', area: 80, yieldTarget: '250kg/亩', status: 'draft', creator: '王技术', createdAt: '2026-03-05', version: 1, changeNote: '草稿', year: 2026 },
  { id: 'SP-2026-003', name: '油菜机械化方案', unit: '辽中分场', plantingMode: '露地种植', cropCategory: '经济作物', cropVariety: '油菜-秦油10号', season: '秋季', area: 90, yieldTarget: '200kg/亩', status: 'active', creator: '赵助理', createdAt: '2026-01-20', version: 1, changeNote: '初始版本', year: 2026 },
  { id: 'SP-2026-004', name: '棉花滴灌方案', unit: '法库分场', plantingMode: '设施种植', cropCategory: '经济作物', cropVariety: '棉花-鲁棉研28', season: '春季', area: 120, yieldTarget: '350kg/亩', status: 'review', creator: '李规划', createdAt: '2026-02-10', version: 1, changeNote: '初始版本', year: 2026 },
  { id: 'SP-2026-005', name: '番茄无土栽培方案', unit: '阿城农场', plantingMode: '设施种植', cropCategory: '园艺作物', cropVariety: '番茄-中杂9号', season: '春季', area: 20, yieldTarget: '12000kg/亩', status: 'active', creator: '张农技', createdAt: '2026-02-25', version: 1, changeNote: '初始版本', year: 2026 },
]

// ==================== 按最新版本分组 ====================
const schemeGroups = computed<SchemeGroup[]>(() => {
  const map = new Map<string, SchemeVersion[]>()
  for (const s of allSchemes) {
    const key = s.id
    if (!map.has(key)) {
      map.set(key, [])
    }
    map.get(key)!.push(s)
  }
  const groups: SchemeGroup[] = []
  for (const [baseId, versions] of map) {
    const sorted = [...versions].sort((a, b) => b.version - a.version)
    groups.push({ baseId, versions: sorted })
  }
  return groups
})

// ==================== 筛选逻辑 ====================
function matchOrg(unit: string, filterOrg: string): boolean {
  if (!filterOrg) return true
  if (unit === filterOrg) return true
  // 检查是否是父级公司
  for (const org of orgTree) {
    if (org.label === filterOrg && org.children.includes(unit)) return true
  }
  return false
}

const filteredSchemes = computed(() => {
  return schemeGroups.value
    .map(group => {
      const latest = group.versions[0] // 已按版本倒序
      return { scheme: latest, versions: group.versions }
    })
    .filter(({ scheme }) => {
      if (filters.value.year && scheme.year !== Number(filters.value.year)) return false
      if (filters.value.org && !matchOrg(scheme.unit, filters.value.org)) return false
      if (filters.value.plantingMode && scheme.plantingMode !== filters.value.plantingMode) return false
      if (filters.value.cropCategory && scheme.cropCategory !== filters.value.cropCategory) return false
      if (filters.value.cropVariety && scheme.cropVariety !== filters.value.cropVariety) return false
      if (filters.value.status && scheme.status !== filters.value.status) return false
      return true
    })
})

// ==================== 分页 ====================
const currentPage = ref(1)
const pageSize = 10

const totalPages = computed(() => Math.max(1, Math.ceil(filteredSchemes.value.length / pageSize)))

const paginatedItems = computed(() => {
  const start = (currentPage.value - 1) * pageSize
  return filteredSchemes.value.slice(start, start + pageSize)
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

// ==================== 统计 ====================
const activeCount = computed(() => filteredSchemes.value.filter(({ scheme }) => scheme.status === 'active').length)
const totalArea = computed(() => filteredSchemes.value.filter(({ scheme }) => scheme.status === 'active').reduce((sum, { scheme }) => sum + scheme.area, 0))
const draftCount = computed(() => filteredSchemes.value.filter(({ scheme }) => scheme.status === 'draft').length)
const reviewCount = computed(() => filteredSchemes.value.filter(({ scheme }) => scheme.status === 'review').length)

// ==================== 状态样式 ====================
function statusLabel(status: string): string {
  const map: Record<string, string> = { active: '执行中', review: '审核中', draft: '草稿', returned: '已退回', archived: '已归档' }
  return map[status] || status
}

function statusIcon(status: string) {
  const map: Record<string, typeof CheckCircle2> = { active: CheckCircle2, review: Clock, draft: FileText, returned: CornerDownLeft, archived: AlertCircle }
  return map[status] || FileText
}

function statusBadgeClass(status: string): string {
  const base = 'inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-xs font-medium'
  const map: Record<string, string> = {
    active: 'bg-green-100 text-green-700',
    review: 'bg-amber-100 text-amber-700',
    draft: 'bg-gray-100 text-gray-700',
    returned: 'bg-red-100 text-red-700',
    archived: 'bg-muted text-muted-foreground',
  }
  return `${base} ${map[status] || ''}`
}

// ==================== 版本面板 ====================
const versionPanelVisible = ref(false)
const versionPanelScheme = ref<SchemeVersion | null>(null)
const versionPanelVersions = ref<SchemeVersion[]>([])

function openVersionPanel(scheme: SchemeVersion) {
  const group = schemeGroups.value.find(g => g.baseId === scheme.id)
  if (!group || group.versions.length <= 1) {
    showToast({ message: '该方案仅有一个版本', type: 'info' })
    return
  }
  versionPanelScheme.value = scheme
  versionPanelVersions.value = group.versions
  versionPanelVisible.value = true
}

// ==================== 路由 ====================
const router = useRouter()

function handleCreate() {
  router.push('/planting-plan/form')
}

function handleViewVersion(scheme: SchemeVersion) {
  router.push(`/planting-plan/form?id=${scheme.id}&version=${scheme.version}`)
}
</script>
