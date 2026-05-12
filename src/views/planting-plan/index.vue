<template>
  <div class="space-y-6">
    <!-- 页面标题 + 操作 -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold tracking-tight">种植方案</h1>
        <p class="mt-1 text-sm text-muted-foreground">管理和制定不同作物的农艺技术规程（SOP），形成可复用的标准化方案</p>
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
            v-model="filters.effectiveStatus"
            class="h-9 min-w-[120px] rounded-md border bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
          >
            <option value="">全部</option>
            <option value="active">已生效</option>
            <option value="inactive">未生效</option>
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
              <th class="h-10 px-4 text-left font-medium text-muted-foreground">方案编码</th>
              <th class="h-10 px-4 text-left font-medium text-muted-foreground">方案名称</th>
              <th class="h-10 px-4 text-left font-medium text-muted-foreground">所属单位</th>
              <th class="h-10 px-4 text-left font-medium text-muted-foreground">种植模式</th>
              <th class="h-10 px-4 text-left font-medium text-muted-foreground">种植作物大类</th>
              <th class="h-10 px-4 text-left font-medium text-muted-foreground">种植品种</th>
              <th class="h-10 px-4 text-left font-medium text-muted-foreground">适用区域</th>
              <th class="h-10 px-4 text-center font-medium text-muted-foreground">全生育周期总天数</th>
              <th class="h-10 px-4 text-left font-medium text-muted-foreground">编制人</th>
              <th class="h-10 px-4 text-left font-medium text-muted-foreground">编制时间</th>
              <th class="h-10 px-4 text-center font-medium text-muted-foreground">审批状态</th>
              <th class="h-10 px-4 text-left font-medium text-muted-foreground">生效时间</th>
              <th class="h-10 px-4 text-center font-medium text-muted-foreground">生效状态</th>
              <th class="h-10 px-4 text-center font-medium text-muted-foreground">版本号</th>
              <th class="h-10 px-4 text-center font-medium text-muted-foreground">操作</th>
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
              <td class="h-12 px-4 text-muted-foreground text-xs">{{ item.scheme.applicableArea }}</td>
              <td class="h-12 px-4 text-center">{{ item.scheme.totalDays }}</td>
              <td class="h-12 px-4 text-muted-foreground">{{ item.scheme.author }}</td>
              <td class="h-12 px-4 text-muted-foreground text-xs">{{ item.scheme.compiledAt }}</td>
              <td class="h-12 px-4 text-center">
                <span :class="approvalBadgeClass(item.scheme.approvalStatus)">
                  {{ approvalStatusLabel(item.scheme.approvalStatus) }}
                </span>
              </td>
              <td class="h-12 px-4 text-muted-foreground text-xs">{{ item.scheme.effectiveTime || '-' }}</td>
              <td class="h-12 px-4 text-center">
                <span :class="effectiveBadgeClass(item.scheme.effectiveStatus)">
                  {{ effectiveStatusLabel(item.scheme.effectiveStatus) }}
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
              <td class="h-12 px-4 text-center">
                <div class="flex items-center justify-center gap-3">
                  <button
                    v-if="item.scheme.approvalStatus === 'returned' || item.scheme.approvalStatus === 'revoked'"
                    class="text-primary hover:underline text-xs font-medium"
                    @click.stop="handleEdit(item.scheme)"
                  >
                    编辑
                  </button>
                  <button
                    v-if="item.scheme.approvalStatus === 'completed' && item.scheme.effectiveStatus === 'active'"
                    class="text-primary hover:underline text-xs font-medium"
                    @click.stop="handleIterate(item.scheme)"
                  >
                    迭代新版本
                  </button>
                  <span
                    v-if="item.scheme.approvalStatus !== 'returned' && item.scheme.approvalStatus !== 'revoked' && !(item.scheme.approvalStatus === 'completed' && item.scheme.effectiveStatus === 'active')"
                    class="text-muted-foreground text-xs"
                  >
                    -
                  </span>
                </div>
              </td>
            </tr>
            <tr v-if="paginatedItems.length === 0">
              <td colspan="15" class="h-24 text-center text-muted-foreground">暂无数据</td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- 分页 -->
      <div v-if="totalPages > 1" class="flex items-center justify-between border-t px-4 py-3">
        <p class="text-sm text-muted-foreground">
          第 {{ currentPage }} / {{ totalPages }} 页，共 <span class="font-medium">{{ filteredSchemes.length }}</span> 条记录
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
                <span :class="approvalBadgeClass(ver.approvalStatus)" class="text-xs">
                  {{ approvalStatusLabel(ver.approvalStatus) }}
                </span>
              </div>
              <div class="mt-2 space-y-1 text-xs text-muted-foreground">
                <p>编制人：{{ ver.author }}</p>
                <p>编制时间：{{ ver.compiledAt }}</p>
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
  Plus, ChevronDown, ChevronLeft, ChevronRight, ChevronRight as ChevronRightIcon, X, Minus,
} from 'lucide-vue-next'
import { showToast } from '@/lib/toast'

// ==================== 类型定义 ====================
type ApprovalStatus = 'draft' | 'review' | 'returned' | 'revoked' | 'forced_end' | 'completed'
type EffectiveStatus = 'active' | 'inactive'

interface SchemeVersion {
  id: string
  name: string
  unit: string
  plantingMode: string
  cropCategory: string
  cropVariety: string
  applicableArea: string
  totalDays: number
  author: string
  compiledAt: string
  approvalStatus: ApprovalStatus
  effectiveTime: string
  effectiveStatus: EffectiveStatus
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
  effectiveStatus: '',
})

function resetFilters() {
  filters.value = { year: '', org: '', plantingMode: '', cropCategory: '', cropVariety: '', effectiveStatus: '' }
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

// ==================== 生效状态样式 ====================
function effectiveStatusLabel(status: EffectiveStatus): string {
  return status === 'active' ? '已生效' : '未生效'
}

function effectiveBadgeClass(status: EffectiveStatus): string {
  const base = 'inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium'
  return status === 'active'
    ? `${base} bg-green-100 text-green-700`
    : `${base} bg-gray-100 text-gray-500`
}

// ==================== 模拟数据 ====================
const allSchemes: SchemeVersion[] = [
  { id: 'SP-2024-001', name: '春季水稻高产方案', unit: '松北农场', plantingMode: '露地种植', cropCategory: '粮食作物', cropVariety: '水稻-松粳22', applicableArea: '松北平原', totalDays: 135, author: '张农技', compiledAt: '2024-02-15', approvalStatus: 'completed', effectiveTime: '2024-03-01', effectiveStatus: 'active', version: 2, changeNote: '调整施肥配比', year: 2024 },
  { id: 'SP-2024-001', name: '春季水稻高产方案', unit: '松北农场', plantingMode: '露地种植', cropCategory: '粮食作物', cropVariety: '水稻-松粳22', applicableArea: '松北平原', totalDays: 130, author: '张农技', compiledAt: '2024-01-10', approvalStatus: 'completed', effectiveTime: '2024-01-20', effectiveStatus: 'inactive', version: 1, changeNote: '初始版本', year: 2024 },
  { id: 'SP-2024-002', name: '冬小麦越冬方案', unit: '呼兰农场', plantingMode: '露地种植', cropCategory: '粮食作物', cropVariety: '小麦-济麦22', applicableArea: '呼兰流域', totalDays: 230, author: '李规划', compiledAt: '2024-01-20', approvalStatus: 'completed', effectiveTime: '2024-02-01', effectiveStatus: 'active', version: 1, changeNote: '初始版本', year: 2024 },
  { id: 'SP-2024-003', name: '夏玉米密植方案', unit: '苏家屯农场', plantingMode: '露地种植', cropCategory: '粮食作物', cropVariety: '玉米-郑单958', applicableArea: '苏家屯产区', totalDays: 110, author: '王技术', compiledAt: '2024-03-10', approvalStatus: 'review', effectiveTime: '', effectiveStatus: 'inactive', version: 1, changeNote: '初始版本', year: 2024 },
  { id: 'SP-2024-004', name: '大豆轮作方案', unit: '阿城农场', plantingMode: '露地种植', cropCategory: '粮食作物', cropVariety: '大豆-中黄13', applicableArea: '阿城产区', totalDays: 120, author: '赵助理', compiledAt: '2024-03-18', approvalStatus: 'draft', effectiveTime: '', effectiveStatus: 'inactive', version: 1, changeNote: '草稿', year: 2024 },
  { id: 'SP-2024-005', name: '棉花管理方案', unit: '新民农场', plantingMode: '露地种植', cropCategory: '经济作物', cropVariety: '棉花-鲁棉研28', applicableArea: '新民产区', totalDays: 180, author: '张农技', compiledAt: '2024-02-28', approvalStatus: 'completed', effectiveTime: '2024-03-15', effectiveStatus: 'active', version: 3, changeNote: '增加病虫害防治', year: 2024 },
  { id: 'SP-2024-005', name: '棉花管理方案', unit: '新民农场', plantingMode: '露地种植', cropCategory: '经济作物', cropVariety: '棉花-鲁棉研28', applicableArea: '新民产区', totalDays: 175, author: '张农技', compiledAt: '2024-02-01', approvalStatus: 'completed', effectiveTime: '2024-02-15', effectiveStatus: 'inactive', version: 2, changeNote: '调整密度', year: 2024 },
  { id: 'SP-2024-005', name: '棉花管理方案', unit: '新民农场', plantingMode: '露地种植', cropCategory: '经济作物', cropVariety: '棉花-鲁棉研28', applicableArea: '新民产区', totalDays: 170, author: '张农技', compiledAt: '2024-01-15', approvalStatus: 'completed', effectiveTime: '2024-01-25', effectiveStatus: 'inactive', version: 1, changeNote: '初始版本', year: 2024 },
  { id: 'SP-2024-006', name: '油菜秋播方案', unit: '辽中分场', plantingMode: '露地种植', cropCategory: '经济作物', cropVariety: '油菜-秦油10号', applicableArea: '辽中产区', totalDays: 200, author: '李规划', compiledAt: '2024-03-22', approvalStatus: 'returned', effectiveTime: '', effectiveStatus: 'inactive', version: 1, changeNote: '已退回修改', year: 2024 },
  { id: 'SP-2024-007', name: '花生覆膜方案', unit: '双城分场', plantingMode: '露地种植', cropCategory: '经济作物', cropVariety: '花生-花育33', applicableArea: '双城产区', totalDays: 140, author: '王技术', compiledAt: '2024-03-05', approvalStatus: 'completed', effectiveTime: '2024-03-20', effectiveStatus: 'active', version: 1, changeNote: '初始版本', year: 2024 },
  { id: 'SP-2024-008', name: '茶叶精细方案', unit: '法库分场', plantingMode: '设施种植', cropCategory: '园艺作物', cropVariety: '茶叶-龙井43', applicableArea: '法库茶区', totalDays: 210, author: '赵助理', compiledAt: '2023-09-10', approvalStatus: 'forced_end', effectiveTime: '', effectiveStatus: 'inactive', version: 1, changeNote: '强制结束', year: 2023 },
  { id: 'SP-2025-001', name: '春季水稻高产方案(25)', unit: '松北农场', plantingMode: '露地种植', cropCategory: '粮食作物', cropVariety: '水稻-松粳22', applicableArea: '松北平原', totalDays: 140, author: '张农技', compiledAt: '2025-02-10', approvalStatus: 'completed', effectiveTime: '2025-03-01', effectiveStatus: 'active', version: 1, changeNote: '新年度方案', year: 2025 },
  { id: 'SP-2025-002', name: '小麦冬灌方案', unit: '呼兰农场', plantingMode: '露地种植', cropCategory: '粮食作物', cropVariety: '小麦-济麦22', applicableArea: '呼兰流域', totalDays: 235, author: '李规划', compiledAt: '2025-01-05', approvalStatus: 'review', effectiveTime: '', effectiveStatus: 'inactive', version: 1, changeNote: '初始版本', year: 2025 },
  { id: 'SP-2025-003', name: '大棚番茄种植方案', unit: '阿城农场', plantingMode: '设施种植', cropCategory: '园艺作物', cropVariety: '番茄-中杂9号', applicableArea: '阿城设施区', totalDays: 160, author: '王技术', compiledAt: '2025-02-20', approvalStatus: 'completed', effectiveTime: '2025-03-01', effectiveStatus: 'active', version: 2, changeNote: '优化温控参数', year: 2025 },
  { id: 'SP-2025-003', name: '大棚番茄种植方案', unit: '阿城农场', plantingMode: '设施种植', cropCategory: '园艺作物', cropVariety: '番茄-中杂9号', applicableArea: '阿城设施区', totalDays: 155, author: '王技术', compiledAt: '2025-01-15', approvalStatus: 'completed', effectiveTime: '2025-01-25', effectiveStatus: 'inactive', version: 1, changeNote: '初始版本', year: 2025 },
  { id: 'SP-2025-004', name: '苜蓿种植方案', unit: '五常分场', plantingMode: '露地种植', cropCategory: '饲草作物', cropVariety: '紫花苜蓿-阿尔冈金', applicableArea: '五常产区', totalDays: 90, author: '赵助理', compiledAt: '2025-03-01', approvalStatus: 'draft', effectiveTime: '', effectiveStatus: 'inactive', version: 1, changeNote: '草稿', year: 2025 },
  { id: 'SP-2025-005', name: '苹果矮化密植方案', unit: '苏家屯农场', plantingMode: '设施种植', cropCategory: '园艺作物', cropVariety: '苹果-红富士', applicableArea: '苏家屯果区', totalDays: 200, author: '张农技', compiledAt: '2025-03-10', approvalStatus: 'returned', effectiveTime: '', effectiveStatus: 'inactive', version: 1, changeNote: '已退回修改', year: 2025 },
  { id: 'SP-2025-006', name: '玉米青贮方案', unit: '新民农场', plantingMode: '露地种植', cropCategory: '饲草作物', cropVariety: '饲用玉米-雅玉8号', applicableArea: '新民产区', totalDays: 105, author: '李规划', compiledAt: '2025-02-15', approvalStatus: 'revoked', effectiveTime: '', effectiveStatus: 'inactive', version: 1, changeNote: '已撤回', year: 2025 },
  { id: 'SP-2026-001', name: '水稻智能灌溉方案', unit: '松北农场', plantingMode: '露地种植', cropCategory: '粮食作物', cropVariety: '水稻-松粳22', applicableArea: '松北平原', totalDays: 130, author: '张农技', compiledAt: '2026-02-01', approvalStatus: 'draft', effectiveTime: '', effectiveStatus: 'inactive', version: 1, changeNote: '草稿', year: 2026 },
  { id: 'SP-2026-002', name: '大豆窄行密植方案', unit: '双城分场', plantingMode: '露地种植', cropCategory: '粮食作物', cropVariety: '大豆-中黄13', applicableArea: '双城产区', totalDays: 115, author: '王技术', compiledAt: '2026-03-05', approvalStatus: 'draft', effectiveTime: '', effectiveStatus: 'inactive', version: 1, changeNote: '草稿', year: 2026 },
  { id: 'SP-2026-003', name: '油菜机械化方案', unit: '辽中分场', plantingMode: '露地种植', cropCategory: '经济作物', cropVariety: '油菜-秦油10号', applicableArea: '辽中产区', totalDays: 195, author: '赵助理', compiledAt: '2026-01-20', approvalStatus: 'completed', effectiveTime: '2026-02-01', effectiveStatus: 'active', version: 1, changeNote: '初始版本', year: 2026 },
  { id: 'SP-2026-004', name: '棉花滴灌方案', unit: '法库分场', plantingMode: '设施种植', cropCategory: '经济作物', cropVariety: '棉花-鲁棉研28', applicableArea: '法库产区', totalDays: 185, author: '李规划', compiledAt: '2026-02-10', approvalStatus: 'review', effectiveTime: '', effectiveStatus: 'inactive', version: 1, changeNote: '初始版本', year: 2026 },
  { id: 'SP-2026-005', name: '番茄无土栽培方案', unit: '阿城农场', plantingMode: '设施种植', cropCategory: '园艺作物', cropVariety: '番茄-中杂9号', applicableArea: '阿城设施区', totalDays: 165, author: '张农技', compiledAt: '2026-02-25', approvalStatus: 'completed', effectiveTime: '2026-03-10', effectiveStatus: 'active', version: 1, changeNote: '初始版本', year: 2026 },
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
  for (const org of orgTree) {
    if (org.label === filterOrg && org.children.includes(unit)) return true
  }
  return false
}

const filteredSchemes = computed(() => {
  return schemeGroups.value
    .map(group => {
      const latest = group.versions[0]
      return { scheme: latest, versions: group.versions }
    })
    .filter(({ scheme }) => {
      if (filters.value.year && scheme.year !== Number(filters.value.year)) return false
      if (filters.value.org && !matchOrg(scheme.unit, filters.value.org)) return false
      if (filters.value.plantingMode && scheme.plantingMode !== filters.value.plantingMode) return false
      if (filters.value.cropCategory && scheme.cropCategory !== filters.value.cropCategory) return false
      if (filters.value.cropVariety && scheme.cropVariety !== filters.value.cropVariety) return false
      if (filters.value.effectiveStatus && scheme.effectiveStatus !== filters.value.effectiveStatus) return false
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

// ==================== 路由与操作 ====================
const router = useRouter()

function handleCreate() {
  router.push('/planting-plan/form')
}

function handleViewVersion(scheme: SchemeVersion) {
  router.push(`/planting-plan/form?id=${scheme.id}&version=${scheme.version}`)
}

function handleEdit(scheme: SchemeVersion) {
  router.push(`/planting-plan/form?id=${scheme.id}&version=${scheme.version}&edit=1`)
}

function handleIterate(scheme: SchemeVersion) {
  router.push(`/planting-plan/form?id=${scheme.id}&version=${scheme.version}&iterate=1`)
}
</script>
