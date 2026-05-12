<template>
  <div class="space-y-6">
    <!-- 页头 -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold tracking-tight">需求计划</h1>
        <p class="mt-1 text-sm text-muted-foreground">根据已生效的种植计划生成农资需求计划，支持调整、审批与推送</p>
      </div>
      <button
        class="flex h-9 items-center gap-2 rounded-md border px-4 text-sm font-medium hover:bg-muted transition-colors"
        @click="handleExport"
      >
        <DownloadIcon class="h-4 w-4" />
        导出
      </button>
    </div>

    <!-- 查询条件 -->
    <div class="rounded-lg border bg-card p-4 shadow-sm">
      <div class="flex flex-wrap items-end gap-4">
        <div class="flex flex-col gap-1.5">
          <label class="text-sm font-medium text-muted-foreground">年份</label>
          <select
            v-model="queryYear"
            class="h-9 rounded-md border bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
          >
            <option v-for="y in yearOptions" :key="y" :value="y">{{ y }}年</option>
          </select>
        </div>
        <div class="flex flex-col gap-1.5">
          <label class="text-sm font-medium text-muted-foreground">所属单位</label>
          <div class="relative" ref="queryUnitRef">
            <button
              type="button"
              class="flex h-9 min-w-[200px] items-center justify-between rounded-md border bg-background px-3 text-sm hover:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/30"
              :class="queryUnit ? '' : 'text-muted-foreground'"
              @click="queryUnitOpen = !queryUnitOpen"
            >
              <span class="truncate">{{ queryUnit || '全部' }}</span>
              <ChevronDownIcon class="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </button>
            <div v-if="queryUnitOpen" class="absolute left-0 top-full z-50 mt-1 max-h-80 w-80 overflow-auto rounded-md border bg-popover shadow-lg">
              <div class="p-2">
                <button
                  class="w-full rounded px-3 py-1.5 text-left text-sm hover:bg-primary/10"
                  :class="queryUnit === '' ? 'bg-primary/10 font-medium text-primary' : ''"
                  @click="queryUnit = ''; queryUnitOpen = false"
                >全部</button>
                <template v-for="l1 in orgTree" :key="l1.label">
                  <div class="mt-1">
                    <div class="flex items-center gap-1">
                      <button class="flex h-7 w-7 shrink-0 items-center justify-center rounded hover:bg-primary/10" @click="toggleOrgNode(l1.label)">
                        <component :is="expandedOrgNodes.has(l1.label) ? ChevronDownIcon : ChevronRightIcon" class="h-3.5 w-3.5" />
                      </button>
                      <button class="flex flex-1 items-center gap-1 rounded px-2 py-1.5 text-left text-sm font-medium hover:bg-primary/10" :class="queryUnit === l1.label ? 'bg-primary/10 text-primary' : ''" @click="queryUnit = l1.label; queryUnitOpen = false">
                        <Building2Icon class="h-3.5 w-3.5 shrink-0 text-primary" />
                        <span class="truncate">{{ l1.label }}</span>
                      </button>
                    </div>
                    <div v-if="expandedOrgNodes.has(l1.label)" class="ml-4">
                      <template v-for="l2 in l1.children" :key="l2.label">
                        <div class="flex items-center gap-1">
                          <button class="flex h-7 w-7 shrink-0 items-center justify-center rounded hover:bg-primary/10" @click="toggleOrgNode(l1.label + '.' + l2.label)">
                            <component :is="expandedOrgNodes.has(l1.label + '.' + l2.label) ? ChevronDownIcon : ChevronRightIcon" class="h-3.5 w-3.5" />
                          </button>
                          <button class="flex flex-1 items-center gap-1 rounded px-2 py-1.5 text-left text-sm hover:bg-primary/10" :class="queryUnit === l2.label ? 'bg-primary/10 text-primary' : ''" @click="queryUnit = l2.label; queryUnitOpen = false">
                            <Building2Icon class="h-3.5 w-3.5 shrink-0 text-amber-500" />
                            <span class="truncate">{{ l2.label }}</span>
                          </button>
                        </div>
                        <div v-if="expandedOrgNodes.has(l1.label + '.' + l2.label)" class="ml-4">
                          <template v-for="l3 in l2.children" :key="l3.label">
                            <div class="flex items-center gap-1">
                              <button class="flex h-7 w-7 shrink-0 items-center justify-center rounded hover:bg-primary/10" @click="toggleOrgNode(l1.label + '.' + l2.label + '.' + l3.label)">
                                <component :is="expandedOrgNodes.has(l1.label + '.' + l2.label + '.' + l3.label) ? ChevronDownIcon : ChevronRightIcon" class="h-3.5 w-3.5" />
                              </button>
                              <button class="flex flex-1 items-center gap-1 rounded px-2 py-1.5 text-left text-sm hover:bg-primary/10" :class="queryUnit === l3.label ? 'bg-primary/10 text-primary' : ''" @click="queryUnit = l3.label; queryUnitOpen = false">
                                <Building2Icon class="h-3.5 w-3.5 shrink-0 text-green-600" />
                                <span class="truncate">{{ l3.label }}</span>
                              </button>
                            </div>
                            <div v-if="expandedOrgNodes.has(l1.label + '.' + l2.label + '.' + l3.label)" class="ml-4">
                              <button
                                v-for="l4 in l3.children" :key="l4.label"
                                class="flex w-full items-center gap-1 rounded px-3 py-1.5 text-left text-sm hover:bg-primary/10"
                                :class="queryUnit === l4.label ? 'bg-primary/10 font-medium text-primary' : ''"
                                @click="queryUnit = l4.label; queryUnitOpen = false"
                              >
                                <span class="ml-1 truncate">{{ l4.label }}</span>
                              </button>
                            </div>
                          </template>
                        </div>
                      </template>
                    </div>
                  </div>
                </template>
              </div>
            </div>
          </div>
        </div>
        <div class="flex flex-col gap-1.5">
          <label class="text-sm font-medium text-muted-foreground">种植计划名称</label>
          <input
            v-model="queryPlanName"
            type="text"
            placeholder="请输入种植计划名称"
            class="h-9 min-w-[200px] rounded-md border bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
        </div>
        <div class="flex flex-col gap-1.5">
          <label class="text-sm font-medium text-muted-foreground">时间段</label>
          <div class="flex items-center gap-2">
            <input
              v-model="queryStartDate"
              type="date"
              class="h-9 rounded-md border bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
            <span class="text-muted-foreground">~</span>
            <input
              v-model="queryEndDate"
              type="date"
              class="h-9 rounded-md border bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
          </div>
        </div>
        <div class="flex gap-2">
          <button
            class="h-9 rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground hover:bg-primary/90"
            @click="handleQuery"
          >
            查询
          </button>
          <button
            class="h-9 rounded-md border px-4 text-sm font-medium hover:bg-muted"
            @click="resetQuery"
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
              <th class="h-10 px-4 text-left font-medium text-muted-foreground">需求计划编号</th>
              <th class="h-10 px-4 text-left font-medium text-muted-foreground">所属单位</th>
              <th class="h-10 px-4 text-left font-medium text-muted-foreground">关联种植计划名称</th>
              <th class="h-10 px-4 text-right font-medium text-muted-foreground">需求总量</th>
              <th class="h-10 px-4 text-right font-medium text-muted-foreground">缺口量</th>
              <th class="h-10 px-4 text-center font-medium text-muted-foreground">审批状态</th>
              <th class="h-10 px-4 text-center font-medium text-muted-foreground">推送状态</th>              
              <th class="h-10 px-4 text-center font-medium text-muted-foreground">执行状态</th>
              <th class="h-10 px-4 text-center font-medium text-muted-foreground">操作</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="item in filteredList"
              :key="item.id"
              class="border-b transition-colors hover:bg-muted/30"
            >
              <td class="h-12 px-4">{{ item.year }}</td>
              <td class="h-12 px-4">{{ item.demandPlanId }}</td>
              <td class="h-12 px-4">{{ item.unit }}</td>
              <td class="h-12 px-4">
                <button
                  class="text-primary hover:underline"
                  @click="goDetail(item.id)"
                >
                  {{ item.planName }}
                </button>
              </td>
              <td class="h-12 px-4 text-right font-medium">{{ item.totalDemand }}</td>
              <td class="h-12 px-4 text-right">
                <span :class="item.gap > 0 ? 'font-medium text-red-600' : 'text-emerald-600'">
                  {{ item.gap > 0 ? item.gap : '无缺口' }}
                </span>
              </td>
              <td class="h-12 px-4 text-center">
                <span :class="statusClass(item.approvalStatus)">
                  {{ item.approvalStatus }}
                </span>
              </td>
                <td class="h-12 px-4 text-center">
                <span :class="pushClass(item.pushStatus)">
                  {{ item.pushStatus }}
                </span>
              </td>
                <td class="h-12 px-4 text-center">
                <span :class="executeClass(item.executeStatus)">
                  {{ item.executeStatus }}
                </span>
              </td>
              <td class="h-12 px-4 text-center">
                <div class="flex items-center justify-center gap-2">
                  <button
                    v-if="item.approvalStatus === '草稿' || item.approvalStatus === '已退回' || item.approvalStatus === '已撤回'"
                    class="text-primary hover:underline"
                    @click="router.push(`/material-demand/${item.id}?mode=edit`)"
                  >
                    调整
                  </button>
                  <button
                    v-if="item.approvalStatus === '草稿' || item.approvalStatus === '已退回'"
                    class="text-amber-600 hover:underline"
                    @click="handleApprove(item)"
                  >
                    发起审批
                  </button>
                  <button
                    v-if="item.approvalStatus === '已完成' && item.pushStatus==='未推送'"
                    class="text-emerald-600 hover:underline"
                    @click="handlePush(item)"
                  >
                    推送
                  </button>
                </div>
              </td>
            </tr>
            <tr v-if="filteredList.length === 0">
              <td colspan="7" class="h-24 text-center text-muted-foreground">暂无数据</td>
            </tr>
          </tbody>
        </table>
      </div>
      <!-- 分页 -->
      <div class="flex items-center justify-between border-t px-4 py-3">
        <p class="text-sm text-muted-foreground">共 {{ filteredList.length }} 条记录</p>
        <div class="flex items-center gap-1">
          <button
            class="h-8 rounded border px-3 text-sm hover:bg-muted disabled:opacity-50"
            :disabled="currentPage === 1"
            @click="currentPage--"
          >
            上一页
          </button>
          <button
            v-for="p in totalPages"
            :key="p"
            class="h-8 min-w-[32px] rounded border px-2 text-sm"
            :class="p === currentPage ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'"
            @click="currentPage = p"
          >
            {{ p }}
          </button>
          <button
            class="h-8 rounded border px-3 text-sm hover:bg-muted disabled:opacity-50"
            :disabled="currentPage === totalPages"
            @click="currentPage++"
          >
            下一页
          </button>
        </div>
      </div>
    </div>


  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { X, ChevronDown as ChevronDownIcon, ChevronRight as ChevronRightIcon, Building2 as Building2Icon, Download as DownloadIcon } from 'lucide-vue-next'
import { showToast } from '@/lib/toast'

const router = useRouter()

// 查询条件
const queryYear = ref(new Date().getFullYear().toString())
const queryUnit = ref('')
const queryPlanName = ref('')
const queryStartDate = ref('')
const queryEndDate = ref('')
const currentPage = ref(1)
const pageSize = 10

const yearOptions = ['2026', '2025', '2024', '2023', '2022']

// 组织树数据
interface OrgNode { label: string; children: OrgNode[] }
const orgTree: OrgNode[] = [
  { label: '中国融通农业发展集团有限公司', children: [
    { label: '哈尔滨公司', children: [
      { label: '华康农场', children: [
        { label: '华山分场', children: [] },
        { label: '雨林分场', children: [] },
        { label: '康保分场', children: [] },
      ]},
      { label: '北安农场', children: [
        { label: '红星分场', children: [] },
        { label: '兴安分场', children: [] },
        { label: '永丰分场', children: [] },
      ]},
      { label: '嫩江农场', children: [
        { label: '合发分场', children: [] },
        { label: '白云分场', children: [] },
      ]},
    ]},
    { label: '沈阳公司', children: [
      { label: '盘锦农场', children: [
        { label: '兴城分场', children: [] },
        { label: '红海滩分场', children: [] },
      ]},
      { label: '长春农场', children: [
        { label: '九台分场', children: [] },
        { label: '梅河口分场', children: [] },
      ]},
    ]},
  ]}
]

const queryUnitOpen = ref(false)
const queryUnitRef = ref<HTMLElement | null>(null)
const expandedOrgNodes = ref<Set<string>>(new Set())

function toggleOrgNode(key: string) {
  const s = new Set(expandedOrgNodes.value)
  if (s.has(key)) s.delete(key); else s.add(key)
  expandedOrgNodes.value = s
}

// 点击外部关闭
onMounted(() => {
  document.addEventListener('click', (e: MouseEvent) => {
    if (queryUnitRef.value && !queryUnitRef.value.contains(e.target as Node)) {
      queryUnitOpen.value = false
    }
  })
})

// 列表数据
interface DemandPlan {
  id: string
  year: string
  demandPlanId:string
  unit: string
  subUnit: string
  approvers: string
  planName: string
  planCode: string
  code: string
  totalDemand: number
  gap: number
  approvalStatus: string
  pushStatus: string
  executeStatus: string
  priority: string
  remark: string
}

const demandPlans = ref<DemandPlan[]>([
  { id: 'dp1', year: '2026', demandPlanId:'XQ2026-001',unit: '华康农场', subUnit: '华山分场', approvers: '张建国、李伟', planName: '华康农场2026年水稻种植计划', planCode: 'ZP2026-001', code: 'XQ2026-001', totalDemand: 1250, gap: 380, approvalStatus: '草稿', pushStatus: '未推送',executeStatus:'待执行', priority: '高', remark: '' },
  { id: 'dp2', year: '2026',demandPlanId:'XQ2026-002', unit: '华康农场', subUnit: '雨林分场', approvers: '王志强、刘洋', planName: '华康农场2026年小麦种植计划', planCode: 'ZP2026-002', code: 'XQ2026-002', totalDemand: 860, gap: 120, approvalStatus: '审批中', pushStatus: '未推送', executeStatus:'待执行',priority: '中', remark: '' },
  { id: 'dp3', year: '2026', demandPlanId:'XQ2026-003',unit: '北安农场', subUnit: '红星分场', approvers: '赵刚、孙磊', planName: '北安农场2026年玉米种植计划', planCode: 'ZP2026-003', code: 'XQ2026-003', totalDemand: 1580, gap: 0, approvalStatus: '已完成', pushStatus: '已推送', executeStatus:'执行中',priority: '低', remark: '' },
  { id: 'dp4', year: '2026',demandPlanId:'XQ2026-004', unit: '嫩江农场', subUnit: '合发分场', approvers: '陈红、马丽', planName: '嫩江农场2026年大豆种植计划', planCode: 'ZP2026-004', code: 'XQ2026-004', totalDemand: 620, gap: 250, approvalStatus: '已退回', pushStatus: '未推送', executeStatus:'待执行', priority: '高', remark: '退回原因：预算超标' },
  { id: 'dp5', year: '2026',demandPlanId:'XQ2026-005', unit: '盘锦农场', subUnit: '兴城分场', approvers: '周立、吴芳', planName: '盘锦农场2026年水稻种植计划', planCode: 'ZP2026-005', code: 'XQ2026-005', totalDemand: 980, gap: 340, approvalStatus: '草稿', pushStatus: '未推送', executeStatus:'待执行',priority: '中', remark: '' },
  { id: 'dp6', year: '2025',demandPlanId:'XQ2026-006', unit: '华康农场', subUnit: '康保分场', approvers: '张建国、李伟', planName: '华康农场2025年水稻种植计划', planCode: 'ZP2025-001', code: 'XQ2025-001', totalDemand: 1100, gap: 0, approvalStatus: '已完成', pushStatus: '已推送',  executeStatus:'执行中',priority: '低', remark: '' },
  { id: 'dp7', year: '2025', demandPlanId:'XQ2026-007',unit: '北安农场', subUnit: '兴安分场', approvers: '赵刚、孙磊', planName: '北安农场2025年玉米种植计划', planCode: 'ZP2025-002', code: 'XQ2025-002', totalDemand: 1400, gap: 0, approvalStatus: '已完成', pushStatus: '已推送',  executeStatus:'已完成',priority: '低', remark: '' },
  { id: 'dp8', year: '2026',demandPlanId:'XQ2026-008', unit: '长春农场', subUnit: '九台分场', approvers: '韩超、郑伟', planName: '长春农场2026年番茄种植计划', planCode: 'ZP2026-006', code: 'XQ2026-006', totalDemand: 420, gap: 180, approvalStatus: '审批中', pushStatus: '未推送', executeStatus:'待执行',priority: '高', remark: '' },
  { id: 'dp9', year: '2026', demandPlanId:'XQ2026-009',unit: '华康农场', subUnit: '华山分场', approvers: '张建国、李伟', planName: '华康农场2026年花生种植计划', planCode: 'ZP2026-007', code: 'XQ2026-007', totalDemand: 530, gap: 90, approvalStatus: '已撤回', pushStatus: '未推送', executeStatus:'待执行',priority: '中', remark: '' },
  { id: 'dp10', year: '2026', demandPlanId:'XQ2026-010',unit: '嫩江农场', subUnit: '白云分场', approvers: '陈红、马丽', planName: '嫩江农场2026年油菜种植计划', planCode: 'ZP2026-008', code: 'XQ2026-008', totalDemand: 380, gap: 0, approvalStatus: '强制结束', pushStatus: '未推送', executeStatus:'待执行',priority: '低', remark: '计划终止' },
  { id: 'dp11', year: '2025', demandPlanId:'XQ2026-011',unit: '盘锦农场', subUnit: '红海滩分场', approvers: '周立、吴芳', planName: '盘锦农场2025年水稻种植计划', planCode: 'ZP2025-003', code: 'XQ2025-003', totalDemand: 950, gap: 0, approvalStatus: '已完成', pushStatus: '已推送',  executeStatus:'已完成',priority: '低', remark: '' },
  { id: 'dp12', year: '2026', demandPlanId:'XQ2026-012',unit: '华康农场', subUnit: '雨林分场', approvers: '王志强、刘洋', planName: '华康农场2026年棉花种植计划', planCode: 'ZP2026-009', code: 'XQ2026-009', totalDemand: 720, gap: 310, approvalStatus: '已完成', pushStatus: '已推送',  executeStatus:'已完成',priority: '高', remark: '' },
])

const filteredList = computed(() => {
  let list = demandPlans.value
  if (queryYear.value) list = list.filter(i => i.year === queryYear.value)
  if (queryUnit.value) list = list.filter(i => i.unit === queryUnit.value)
  if (queryPlanName.value) list = list.filter(i => i.planName.includes(queryPlanName.value))
  return list
})

const totalPages = computed(() => Math.max(1, Math.ceil(filteredList.value.length / pageSize)))

// 状态样式
function statusClass(status: string): string {
  const map: Record<string, string> = {
    '草稿': 'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-gray-100 text-gray-700',
    '审批中': 'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-blue-100 text-blue-700',
    '已退回': 'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-red-100 text-red-700',
    '已撤回': 'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-amber-100 text-amber-700',
    '强制结束': 'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-purple-100 text-purple-700',
    '已完成': 'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-emerald-100 text-emerald-700',
  }
  return map[status] || 'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-gray-100 text-gray-700'
}

function pushClass(status: string): string {
  const map: Record<string, string> = {
    '未推送': 'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-gray-100 text-gray-700',
    '已推送': 'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-emerald-100 text-emerald-700',
  }
  return map[status] || 'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-gray-100 text-gray-700'
}


  function executeClass(status: string): string {
     const map: Record<string, string> = {
    '待执行': 'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-gray-100 text-gray-700',
    '执行中': 'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-blue-100 text-blue-700',
    '已完成': 'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-emerald-100 text-emerald-700',
  }
  return map[status] || 'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-gray-100 text-gray-700'
  }
// 查询
function handleQuery() {
  currentPage.value = 1
}
function resetQuery() {
  queryYear.value = new Date().getFullYear().toString()
  queryUnit.value = ''
  queryPlanName.value = ''
  queryStartDate.value = ''
  queryEndDate.value = ''
  currentPage.value = 1
}

// 调整 - 跳转详情页
function openEditDialog(item: DemandPlan) {
  router.push(`/material-demand/${item.id}`)
}

// 发起审批
function handleApprove(item: DemandPlan) {
  const idx = demandPlans.value.findIndex(i => i.id === item.id)
  if (idx >= 0) {
    demandPlans.value[idx].approvalStatus = '审批中'
  }
  showToast({
    title: '审批已发起',
    message: `已发送至：${item.subUnit}负责人进行审批\n审批人：${item.approvers}`,
    type: 'success',
    duration: 5000,
  })
}

// 推送
function handlePush(item: DemandPlan) {
  const idx = demandPlans.value.findIndex(i => i.id === item.id)
  if (idx >= 0) {
    demandPlans.value[idx].pushStatus = '已推送'
  }
}

// 导出
function handleExport() {
  const list = filteredList.value
  if (list.length === 0) {
    showToast({ title: '导出失败', message: '当前筛选结果为空，无数据可导出', type: 'warning', duration: 3000 })
    return
  }
  const headers = ['年份', '所属单位', '种植计划名称', '需求计划编号', '种植计划编号', '需求总量', '缺口量', '审批状态', '推送状态', '执行状态', '优先级', '备注']
  const keys: (keyof DemandPlan)[] = ['year', 'unit', 'planName', 'code', 'planCode', 'totalDemand', 'gap', 'approvalStatus', 'pushStatus', 'executeStatus', 'priority', 'remark']
  const csvRows: string[] = [headers.join(',')]
  for (const item of list) {
    const row = keys.map(k => {
      const val = String(item[k] ?? '')
      return val.includes(',') || val.includes('"') ? `"${val.replace(/"/g, '""')}"` : val
    })
    csvRows.push(row.join(','))
  }
  const bom = '\uFEFF'
  const blob = new Blob([bom + csvRows.join('\n')], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `需求计划_${queryYear.value || '全部'}.csv`
  link.click()
  URL.revokeObjectURL(url)
  showToast({ title: '导出成功', message: `已导出 ${list.length} 条需求计划数据`, type: 'success', duration: 3000 })
}

// 进入详情
function goDetail(id: string) {
  router.push(`/material-demand/${id}`)
}

onMounted(() => {
  queryYear.value = new Date().getFullYear().toString()
})
</script>
