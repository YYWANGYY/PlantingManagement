<template>
  <div class="space-y-6">
    <!-- 页头 -->
    <div class="flex items-center justify-between">
      <div class="flex items-center gap-3">
        <button class="text-muted-foreground hover:text-foreground" @click="goBack">
          <ArrowLeft class="h-5 w-5" />
        </button>
        <div>
          <h1 class="text-2xl font-bold tracking-tight">需求计划详情</h1>
          <p class="mt-1 text-sm text-muted-foreground">{{ currentPlan.code }}</p>
        </div>
      </div>
      <div class="flex gap-2">
        <span :class="statusClass(currentPlan.approvalStatus)">{{ currentPlan.approvalStatus }}</span>
      </div>
    </div>

    <!-- Tab 切换 -->
    <div class="border-b">
      <div class="flex gap-6">
        <button
          v-for="tab in tabs"
          :key="tab.key"
          class="border-b-2 pb-3 text-sm font-medium transition-colors"
          :class="activeTab === tab.key ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground'"
          @click="activeTab = tab.key"
        >
          {{ tab.label }}
        </button>
      </div>
    </div>

    <!-- 基本信息 Tab -->
    <div v-if="activeTab === 'basic'" class="space-y-6">
      <div class="rounded-lg border bg-card p-6 shadow-sm">
        <h3 class="mb-4 text-base font-semibold">基础信息</h3>
        <div class="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          <div>
            <p class="text-sm text-muted-foreground">需求计划编号</p>
            <p class="mt-1 font-medium">{{ currentPlan.code }}</p>
          </div>
          <div>
            <p class="text-sm text-muted-foreground">关联种植计划编号</p>
            <p class="mt-1 font-medium text-primary">{{ currentPlan.planCode }}</p>
          </div>
          <div>
            <p class="text-sm text-muted-foreground">种植计划名称</p>
            <p class="mt-1 font-medium">{{ currentPlan.planName }}</p>
          </div>
          <div>
            <p class="text-sm text-muted-foreground">所属单位</p>
            <p class="mt-1 font-medium">{{ currentPlan.unit }}</p>
          </div>
          <div>
            <p class="text-sm text-muted-foreground">审批人</p>
            <p class="mt-1 font-medium">{{ currentPlan.approver }}</p>
          </div>
          <div>
            <p class="text-sm text-muted-foreground">当前状态</p>
            <p class="mt-1"><span :class="statusClass(currentPlan.approvalStatus)">{{ currentPlan.approvalStatus }}</span></p>
          </div>
          <div>
            <p class="text-sm text-muted-foreground">推送状态</p>
            <p class="mt-1"><span :class="pushStatusClass(currentPlan.pushStatus)">{{ currentPlan.pushStatus }}</span></p>
          </div>
          <div>
            <p class="text-sm text-muted-foreground">审批完成时间</p>
            <p class="mt-1 font-medium">{{ currentPlan.approvalTime || '—' }}</p>
          </div>
          <div>
            <p class="text-sm text-muted-foreground">需求状态</p>
            <p class="mt-1"><span :class="demandStatusClass(currentPlan.demandStatus)">{{ currentPlan.demandStatus }}</span></p>
          </div>
        </div>
      </div>

      <!-- 成本预算 -->
      <div class="rounded-lg border bg-card p-6 shadow-sm">
        <h3 class="mb-4 text-base font-semibold">成本预算</h3>
        <div class="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          <div class="rounded-lg bg-muted/50 p-4">
            <p class="text-sm text-muted-foreground">计划单价（均价）</p>
            <p class="mt-1 text-xl font-bold">{{ avgPlanPrice }}<span class="text-sm font-normal text-muted-foreground"> 元</span></p>
          </div>
          <div class="rounded-lg bg-muted/50 p-4">
            <p class="text-sm text-muted-foreground">计划投入预算</p>
            <p class="mt-1 text-xl font-bold">{{ totalBudget }}<span class="text-sm font-normal text-muted-foreground"> 万元</span></p>
          </div>
          <div class="rounded-lg bg-muted/50 p-4">
            <p class="text-sm text-muted-foreground">实际单价（均价）</p>
            <p class="mt-1 text-xl font-bold">{{ currentPlan.avgActualPrice || '—' }}<span class="text-sm font-normal text-muted-foreground"> 元</span></p>
          </div>
          <div class="rounded-lg bg-muted/50 p-4">
            <p class="text-sm text-muted-foreground">实际耗用总金额</p>
            <p class="mt-1 text-xl font-bold">{{ currentPlan.actualCost || '—' }}<span class="text-sm font-normal text-muted-foreground"> 万元</span></p>
          </div>
        </div>
      </div>

      <!-- 时间与责任人 -->
      <div class="rounded-lg border bg-card p-6 shadow-sm">
        <h3 class="mb-4 text-base font-semibold">时间与责任人</h3>
        <div class="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div>
            <p class="text-sm text-muted-foreground">需求使用时间</p>
            <p class="mt-1 font-medium">{{ currentPlan.demandTime }}</p>
          </div>
          <div>
            <p class="text-sm text-muted-foreground">责任人</p>
            <p class="mt-1 font-medium">{{ currentPlan.responsible }}</p>
          </div>
          <div>
            <p class="text-sm text-muted-foreground">采购优先级</p>
            <p class="mt-1"><span :class="priorityClass(currentPlan.priority)">{{ currentPlan.priority }}</span></p>
          </div>
        </div>
      </div>

      <!-- 备注 -->
      <div v-if="currentPlan.remark" class="rounded-lg border bg-card p-6 shadow-sm">
        <h3 class="mb-4 text-base font-semibold">备注</h3>
        <p class="text-sm text-muted-foreground whitespace-pre-wrap">{{ currentPlan.remark }}</p>
      </div>
    </div>

    <!-- 农资信息 Tab -->
    <div v-if="activeTab === 'material'" class="space-y-6">
      <!-- 可编辑提示 -->
      <div v-if="canEdit" class="flex items-center gap-2 rounded-lg border border-primary/20 bg-primary/5 px-4 py-2.5">
        <span class="inline-flex items-center rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">提示</span>
        <p class="text-sm text-muted-foreground">当前状态可调整需求总量，修改后的值不可小于原始值，修改后缺口量和预算将自动重新计算</p>
      </div>
      <div class="rounded-lg border bg-card shadow-sm">
        <div class="overflow-x-auto">
          <table class="w-full text-sm">
            <thead>
              <tr class="border-b bg-muted/50">
                <th class="h-10 px-3 text-left font-medium text-muted-foreground">生育时期</th>
                <th class="h-10 px-3 text-left font-medium text-muted-foreground">生产流程</th>
                <th class="h-10 px-3 text-left font-medium text-muted-foreground">作业环节</th>
                <th class="h-10 px-3 text-left font-medium text-muted-foreground">农资大类</th>
                <th class="h-10 px-3 text-left font-medium text-muted-foreground">农资品类</th>
                <th class="h-10 px-3 text-left font-medium text-muted-foreground">有效成分/含量</th>
                <th class="h-10 px-3 text-center font-medium text-muted-foreground">计量单位</th>
                <th class="h-10 px-3 text-right font-medium text-muted-foreground">标准用量</th>
                <th class="h-10 px-3 text-right font-medium text-muted-foreground">计划作业面积</th>
                <th class="h-10 px-3 text-right font-medium text-muted-foreground">需求总量</th>
                <th class="h-10 px-3 text-left font-medium text-muted-foreground">施用方式</th>
                <th class="h-10 px-3 text-right font-medium text-muted-foreground">现有库存</th>
                <th class="h-10 px-3 text-right font-medium text-muted-foreground">在途库存</th>
                <th class="h-10 px-3 text-right font-medium text-muted-foreground">缺口量</th>
                <th class="h-10 px-3 text-center font-medium text-muted-foreground">库存预留</th>
                <th class="h-10 px-3 text-right font-medium text-muted-foreground">计划单价</th>
                <th class="h-10 px-3 text-right font-medium text-muted-foreground">计划预算</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="{ item: row, realIndex: idx } in paginatedItems"
                :key="idx"
                class="border-b transition-colors hover:bg-muted/30"
              >
                <td class="h-12 px-3">{{ row.growthStage }}</td>
                <td class="h-12 px-3">{{ row.process }}</td>
                <td class="h-12 px-3">{{ row.workStage }}</td>
                <td class="h-12 px-3">
                  <span class="inline-flex items-center rounded-md px-1.5 py-0.5 text-xs font-medium" :class="categoryClass(row.category)">{{ row.category }}</span>
                </td>
                <td class="h-12 px-3 font-medium">{{ row.type }}</td>
                <td class="h-12 px-3 text-muted-foreground">{{ row.ingredient }}</td>
                <td class="h-12 px-3 text-center">{{ row.unit }}</td>
                <td class="h-12 px-3 text-right">{{ row.standardDosage }}</td>
                <td class="h-12 px-3 text-right">{{ row.planArea }}</td>
                <td class="h-12 px-3 text-right font-medium">
                  <template v-if="canEdit">
                    <div class="flex items-center justify-end gap-1">
                      <input
                        type="text"
                        :value="row.totalDemand"
                        class="w-24 rounded border px-2 py-1 text-right text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/30"
                        :class="editingErrors[idx] ? 'border-red-400 bg-red-50' : 'border-input bg-background'"
                        @input="onDemandChange(idx, ($event.target as HTMLInputElement).value)"
                        @blur="onDemandBlur(idx, ($event.target as HTMLInputElement).value)"
                      />
                      <span class="text-xs text-muted-foreground">{{ row.unit }}</span>
                    </div>
                    <p v-if="editingErrors[idx]" class="mt-0.5 text-xs text-red-500">{{ editingErrors[idx] }}</p>
                  </template>
                  <template v-else>
                    {{ row.totalDemand }}
                  </template>
                </td>
                <td class="h-12 px-3 text-muted-foreground">{{ row.applicationMethod }}</td>
                <td class="h-12 px-3 text-right">{{ row.currentStock }}</td>
                <td class="h-12 px-3 text-right">{{ row.inTransit }}</td>
                <td class="h-12 px-3 text-right">
                  <span :class="row.gap > 0 ? 'font-medium text-red-600' : 'text-emerald-600'">
                    {{ row.gap > 0 ? row.gap : '0' }}
                  </span>
                </td>
                <td class="h-12 px-3 text-center">
                  <span class="inline-flex items-center rounded-full px-2 py-0.5 text-xs" :class="row.reserved ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-600'">
                    {{ row.reserved ? '已预留' : '未预留' }}
                  </span>
                </td>
                <td class="h-12 px-3 text-right">{{ row.planPrice.toFixed(2) }}</td>
                <td class="h-12 px-3 text-right font-medium">{{ (row.totalDemand * row.planPrice / 10000).toFixed(2) }}万</td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- 分页 -->
        <div class="flex items-center justify-between border-t px-4 py-3">
          <p class="text-sm text-muted-foreground">
            共 {{ materialItems.length }} 条，每页 {{ pageSize }} 条
          </p>
          <div class="flex items-center gap-1">
            <button
              class="inline-flex h-8 w-8 items-center justify-center rounded text-sm transition-colors disabled:cursor-not-allowed disabled:opacity-40"
              :disabled="currentPage <= 1"
              @click="currentPage--"
            >
              <ChevronLeft class="h-4 w-4" />
            </button>
            <template v-for="p in visiblePages" :key="p">
              <span v-if="p === '...'" class="inline-flex h-8 w-8 items-center justify-center text-sm text-muted-foreground">...</span>
              <button
                v-else
                class="inline-flex h-8 w-8 items-center justify-center rounded text-sm transition-colors"
                :class="currentPage === p ? 'bg-primary text-primary-foreground font-medium' : 'hover:bg-muted'"
                @click="currentPage = p as number"
              >
                {{ p }}
              </button>
            </template>
            <button
              class="inline-flex h-8 w-8 items-center justify-center rounded text-sm transition-colors disabled:cursor-not-allowed disabled:opacity-40"
              :disabled="currentPage >= totalPages"
              @click="currentPage++"
            >
              <ChevronRight class="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      <!-- 农资汇总 -->
      <div class="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div class="rounded-lg border bg-card p-5 shadow-sm">
          <p class="text-sm text-muted-foreground">农资品类总数</p>
          <p class="mt-1 text-2xl font-bold">{{ materialItems.length }}<span class="text-sm font-normal text-muted-foreground"> 项</span></p>
        </div>
        <div class="rounded-lg border bg-card p-5 shadow-sm">
          <p class="text-sm text-muted-foreground">缺口品类</p>
          <p class="mt-1 text-2xl font-bold text-red-600">{{ materialItems.filter(i => i.gap > 0).length }}<span class="text-sm font-normal text-muted-foreground"> 项</span></p>
        </div>
        <div class="rounded-lg border bg-card p-5 shadow-sm">
          <p class="text-sm text-muted-foreground">计划总预算</p>
          <p class="mt-1 text-2xl font-bold">{{ totalBudget }}<span class="text-sm font-normal text-muted-foreground"> 万元</span></p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, reactive } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ArrowLeft, ChevronLeft, ChevronRight } from 'lucide-vue-next'

const route = useRoute()
const router = useRouter()
const planId = route.params.id as string

const activeTab = ref('basic')
const tabs = [
  { key: 'basic', label: '基本信息' },
  { key: 'material', label: '农资信息' },
]

// 模拟详情数据
interface PlanDetail {
  id: string
  code: string
  planCode: string
  planName: string
  unit: string
  approver: string
  approvalStatus: string
  pushStatus: string
  approvalTime: string
  demandStatus: string
  priority: string
  demandTime: string
  responsible: string
  remark: string
  avgPlanPrice: number
  planBudget: string
  avgActualPrice: string
  actualCost: string
}

const planMap: Record<string, PlanDetail> = {
  dp1: { id: 'dp1', code: 'XQ2026-001', planCode: 'ZP2026-001', planName: '华康农场2026年水稻种植计划', unit: '华康农场', approver: '—', approvalStatus: '草稿', pushStatus: '未推送', approvalTime: '', demandStatus: '待采购', priority: '高', demandTime: '2026-04-15', responsible: '张建国', remark: '', avgPlanPrice: 35.6, planBudget: '44.50', avgActualPrice: '—', actualCost: '—' },
  dp2: { id: 'dp2', code: 'XQ2026-002', planCode: 'ZP2026-002', planName: '华康农场2026年小麦种植计划', unit: '华康农场', approver: '李明', approvalStatus: '审批中', pushStatus: '未推送', approvalTime: '', demandStatus: '待采购', priority: '中', demandTime: '2026-03-20', responsible: '王志强', remark: '', avgPlanPrice: 28.3, planBudget: '24.34', avgActualPrice: '—', actualCost: '—' },
  dp3: { id: 'dp3', code: 'XQ2026-003', planCode: 'ZP2026-003', planName: '北安农场2026年玉米种植计划', unit: '北安农场', approver: '赵刚', approvalStatus: '已完成', pushStatus: '已推送', approvalTime: '2026-01-10', demandStatus: '已关闭', priority: '低', demandTime: '2026-05-01', responsible: '刘大伟', remark: '', avgPlanPrice: 42.1, planBudget: '66.52', avgActualPrice: '41.8', actualCost: '63.24' },
  dp4: { id: 'dp4', code: 'XQ2026-004', planCode: 'ZP2026-004', planName: '嫩江农场2026年大豆种植计划', unit: '嫩江农场', approver: '—', approvalStatus: '已退回', pushStatus: '未推送', approvalTime: '', demandStatus: '待采购', priority: '高', demandTime: '2026-04-10', responsible: '陈红', remark: '退回原因：预算超标', avgPlanPrice: 31.5, planBudget: '19.53', avgActualPrice: '—', actualCost: '—' },
  dp5: { id: 'dp5', code: 'XQ2026-005', planCode: 'ZP2026-005', planName: '盘锦农场2026年水稻种植计划', unit: '盘锦农场', approver: '—', approvalStatus: '草稿', pushStatus: '未推送', approvalTime: '', demandStatus: '待采购', priority: '中', demandTime: '2026-04-20', responsible: '周立', remark: '', avgPlanPrice: 36.2, planBudget: '35.48', avgActualPrice: '—', actualCost: '—' },
}

const currentPlan = computed(() => planMap[planId] || planMap['dp1'])

// 是否可编辑：仅草稿、已退回状态可修改需求总量
const canEdit = computed(() => {
  const status = currentPlan.value.approvalStatus
  return status === '草稿' || status === '已退回'
})

// 农资信息数据
interface MaterialItem {
  growthStage: string
  process: string
  workStage: string
  category: string
  type: string
  ingredient: string
  unit: string
  standardDosage: number
  planArea: number
  totalDemand: number
  originalTotalDemand: number
  applicationMethod: string
  currentStock: number
  inTransit: number
  gap: number
  reserved: boolean
  planPrice: number
}

// 编辑校验错误信息
const editingErrors = reactive<Record<number, string>>({})

// 计算缺口量：需求总量 - 现有库存量，最小为0
function calcGap(totalDemand: number, currentStock: number): number {
  return Math.max(0, totalDemand - currentStock)
}

const materialItems = ref<MaterialItem[]>([
  { growthStage: '播种期', process: '整地播种', workStage: '播种', category: '种子', type: '杂交水稻种', ingredient: 'Y两优900', unit: 'kg', standardDosage: 2, planArea: 500, totalDemand: 1000, originalTotalDemand: 1000, applicationMethod: '机械直播', currentStock: 400, inTransit: 200, gap: 0, reserved: false, planPrice: 45.0 },
  { growthStage: '播种期', process: '整地播种', workStage: '施肥', category: '肥料', type: '复合肥', ingredient: 'NPK 15-15-15', unit: 'kg', standardDosage: 40, planArea: 500, totalDemand: 20000, originalTotalDemand: 20000, applicationMethod: '撒施', currentStock: 12000, inTransit: 3000, gap: 0, reserved: true, planPrice: 3.2 },
  { growthStage: '播种期', process: '整地播种', workStage: '施肥', category: '肥料', type: '有机肥', ingredient: '腐熟农家肥', unit: 'kg', standardDosage: 2000, planArea: 500, totalDemand: 1000000, originalTotalDemand: 1000000, applicationMethod: '基肥深施', currentStock: 800000, inTransit: 0, gap: 0, reserved: false, planPrice: 0.8 },
  { growthStage: '分蘖期', process: '田间管理', workStage: '施肥', category: '肥料', type: '尿素', ingredient: 'N 46%', unit: 'kg', standardDosage: 15, planArea: 500, totalDemand: 7500, originalTotalDemand: 7500, applicationMethod: '追施', currentStock: 5000, inTransit: 0, gap: 0, reserved: false, planPrice: 2.8 },
  { growthStage: '分蘖期', process: '田间管理', workStage: '植保', category: '农药', type: '杀虫剂', ingredient: '阿维菌素 1.8%EC', unit: 'ml', standardDosage: 50, planArea: 500, totalDemand: 25000, originalTotalDemand: 25000, applicationMethod: '喷雾', currentStock: 18000, inTransit: 5000, gap: 0, reserved: true, planPrice: 0.15 },
  { growthStage: '拔节期', process: '田间管理', workStage: '施肥', category: '肥料', type: '钾肥', ingredient: 'K₂O 60%', unit: 'kg', standardDosage: 10, planArea: 500, totalDemand: 5000, originalTotalDemand: 5000, applicationMethod: '撒施', currentStock: 5000, inTransit: 0, gap: 0, reserved: true, planPrice: 4.5 },
  { growthStage: '拔节期', process: '田间管理', workStage: '植保', category: '农药', type: '杀菌剂', ingredient: '井冈霉素 5%WP', unit: 'g', standardDosage: 100, planArea: 500, totalDemand: 50000, originalTotalDemand: 50000, applicationMethod: '喷雾', currentStock: 30000, inTransit: 10000, gap: 0, reserved: false, planPrice: 0.08 },
  { growthStage: '抽穗期', process: '田间管理', workStage: '植保', category: '农药', type: '杀菌剂', ingredient: '三环唑 75%WP', unit: 'g', standardDosage: 30, planArea: 500, totalDemand: 15000, originalTotalDemand: 15000, applicationMethod: '喷雾', currentStock: 15000, inTransit: 0, gap: 0, reserved: true, planPrice: 0.25 },
  { growthStage: '灌浆期', process: '田间管理', workStage: '灌溉', category: '农具', type: '灌溉设备', ingredient: '水泵+管道', unit: '套', standardDosage: 1, planArea: 500, totalDemand: 5, originalTotalDemand: 5, applicationMethod: '浅水灌溉', currentStock: 5, inTransit: 0, gap: 0, reserved: true, planPrice: 2800.0 },
  { growthStage: '成熟期', process: '收获', workStage: '收获', category: '农具', type: '收割机', ingredient: '联合收割机', unit: '台', standardDosage: 1, planArea: 500, totalDemand: 3, originalTotalDemand: 3, applicationMethod: '机械收割', currentStock: 3, inTransit: 0, gap: 0, reserved: true, planPrice: 15000.0 },
  { growthStage: '分蘖期', process: '田间管理', workStage: '植保', category: '农药', type: '除草剂', ingredient: '苄嘧磺隆 10%WP', unit: 'g', standardDosage: 30, planArea: 500, totalDemand: 15000, originalTotalDemand: 15000, applicationMethod: '喷雾', currentStock: 8000, inTransit: 2000, gap: 0, reserved: false, planPrice: 0.12 },
  { growthStage: '拔节期', process: '田间管理', workStage: '施肥', category: '肥料', type: '磷肥', ingredient: 'P₂O₅ 18%', unit: 'kg', standardDosage: 20, planArea: 500, totalDemand: 10000, originalTotalDemand: 10000, applicationMethod: '撒施', currentStock: 6000, inTransit: 0, gap: 0, reserved: false, planPrice: 3.5 },
  { growthStage: '抽穗期', process: '田间管理', workStage: '施肥', category: '肥料', type: '叶面肥', ingredient: '磷酸二氢钾', unit: 'kg', standardDosage: 2, planArea: 500, totalDemand: 1000, originalTotalDemand: 1000, applicationMethod: '喷施', currentStock: 500, inTransit: 0, gap: 0, reserved: true, planPrice: 12.0 },
  { growthStage: '灌浆期', process: '田间管理', workStage: '植保', category: '农药', type: '杀虫剂', ingredient: '吡蚜酮 50%WP', unit: 'g', standardDosage: 20, planArea: 500, totalDemand: 10000, originalTotalDemand: 10000, applicationMethod: '喷雾', currentStock: 6000, inTransit: 1000, gap: 0, reserved: false, planPrice: 0.35 },
  { growthStage: '成熟期', process: '收获', workStage: '烘干', category: '农具', type: '烘干设备', ingredient: '循环式烘干机', unit: '台', standardDosage: 1, planArea: 500, totalDemand: 2, originalTotalDemand: 2, applicationMethod: '烘干', currentStock: 1, inTransit: 0, gap: 0, reserved: true, planPrice: 12000.0 },
  { growthStage: '播种期', process: '整地播种', workStage: '整地', category: '农具', type: '旋耕机', ingredient: '旋耕机', unit: '台', standardDosage: 1, planArea: 500, totalDemand: 2, originalTotalDemand: 2, applicationMethod: '旋耕', currentStock: 2, inTransit: 0, gap: 0, reserved: true, planPrice: 8500.0 },
  { growthStage: '分蘖期', process: '田间管理', workStage: '灌溉', category: '农具', type: '输水管道', ingredient: 'PE管', unit: 'm', standardDosage: 50, planArea: 500, totalDemand: 25000, originalTotalDemand: 25000, applicationMethod: '渠灌', currentStock: 20000, inTransit: 0, gap: 0, reserved: false, planPrice: 1.5 },
  { growthStage: '拔节期', process: '田间管理', workStage: '植保', category: '农药', type: '杀虫剂', ingredient: '噻虫嗪 25%WG', unit: 'g', standardDosage: 15, planArea: 500, totalDemand: 7500, originalTotalDemand: 7500, applicationMethod: '喷雾', currentStock: 3000, inTransit: 0, gap: 0, reserved: false, planPrice: 0.28 },
  { growthStage: '抽穗期', process: '田间管理', workStage: '植保', category: '农药', type: '杀菌剂', ingredient: '嘧菌酯 25%SC', unit: 'ml', standardDosage: 40, planArea: 500, totalDemand: 20000, originalTotalDemand: 20000, applicationMethod: '喷雾', currentStock: 15000, inTransit: 3000, gap: 0, reserved: true, planPrice: 0.42 },
  { growthStage: '灌浆期', process: '田间管理', workStage: '施肥', category: '肥料', type: '叶面肥', ingredient: '硼肥', unit: 'kg', standardDosage: 0.5, planArea: 500, totalDemand: 250, originalTotalDemand: 250, applicationMethod: '喷施', currentStock: 100, inTransit: 0, gap: 0, reserved: false, planPrice: 18.0 },
  { growthStage: '成熟期', process: '收获', workStage: '运输', category: '农具', type: '运输车', ingredient: '农用三轮车', unit: '辆', standardDosage: 1, planArea: 500, totalDemand: 5, originalTotalDemand: 5, applicationMethod: '运输', currentStock: 3, inTransit: 0, gap: 0, reserved: true, planPrice: 4500.0 },
  { growthStage: '播种期', process: '整地播种', workStage: '浸种', category: '农药', type: '种子处理剂', ingredient: '咪鲜胺 25%EC', unit: 'ml', standardDosage: 5, planArea: 500, totalDemand: 2500, originalTotalDemand: 2500, applicationMethod: '浸种', currentStock: 1000, inTransit: 500, gap: 0, reserved: false, planPrice: 0.38 },
  { growthStage: '分蘖期', process: '田间管理', workStage: '植保', category: '农药', type: '杀螺剂', ingredient: '四聚乙醛 6%GR', unit: 'kg', standardDosage: 2, planArea: 500, totalDemand: 1000, originalTotalDemand: 1000, applicationMethod: '撒施', currentStock: 500, inTransit: 0, gap: 0, reserved: false, planPrice: 8.5 },
  { growthStage: '拔节期', process: '田间管理', workStage: '施肥', category: '肥料', type: '硅肥', ingredient: '硅钙肥', unit: 'kg', standardDosage: 15, planArea: 500, totalDemand: 7500, originalTotalDemand: 7500, applicationMethod: '撒施', currentStock: 4000, inTransit: 1000, gap: 0, reserved: false, planPrice: 2.2 },
  { growthStage: '抽穗期', process: '田间管理', workStage: '施肥', category: '肥料', type: '锌肥', ingredient: '硫酸锌', unit: 'kg', standardDosage: 1, planArea: 500, totalDemand: 500, originalTotalDemand: 500, applicationMethod: '喷施', currentStock: 200, inTransit: 0, gap: 0, reserved: true, planPrice: 6.0 },
])

// 初始化所有行的缺口量：需求总量 - 现有库存量
materialItems.value.forEach(item => {
  item.gap = calcGap(item.totalDemand, item.currentStock)
})

// 分页
const currentPage = ref(1)
const pageSize = 10

const totalPages = computed(() => Math.ceil(materialItems.value.length / pageSize))

const paginatedItems = computed(() => {
  const start = (currentPage.value - 1) * pageSize
  const end = start + pageSize
  const result: { item: MaterialItem; realIndex: number }[] = []
  for (let i = start; i < end && i < materialItems.value.length; i++) {
    result.push({ item: materialItems.value[i], realIndex: i })
  }
  return result
})

// 分页：可见页码
const visiblePages = computed(() => {
  const total = totalPages.value
  const current = currentPage.value
  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1)
  }
  const pages: (number | string)[] = [1]
  if (current > 3) pages.push('...')
  const start = Math.max(2, current - 1)
  const end = Math.min(total - 1, current + 1)
  for (let i = start; i <= end; i++) pages.push(i)
  if (current < total - 2) pages.push('...')
  pages.push(total)
  return pages
})

const totalBudget = computed(() => {
  return (materialItems.value.reduce((sum, i) => sum + i.totalDemand * i.planPrice, 0) / 10000).toFixed(2)
})

// 计划单价（均价）= 所有明细的计划投入金额总和 / 所有明细的需求总量总和
const avgPlanPrice = computed(() => {
  const totalDemandSum = materialItems.value.reduce((sum, i) => sum + i.totalDemand, 0)
  const totalCostSum = materialItems.value.reduce((sum, i) => sum + i.totalDemand * i.planPrice, 0)
  if (totalDemandSum === 0) return '0.00'
  return (totalCostSum / totalDemandSum).toFixed(2)
})

// 需求总量变更处理
function onDemandChange(idx: number, value: string) {
  const item = materialItems.value[idx]
  const trimmed = value.trim()

  // 空值允许输入中
  if (trimmed === '') {
    editingErrors[idx] = '需求总量不能为空'
    return
  }

  const num = Number(trimmed)

  // 验证：必须为数值
  if (isNaN(num)) {
    editingErrors[idx] = '请输入有效数值'
    return
  }

  // 验证：必须 >= 原始值
  if (num < item.originalTotalDemand) {
    editingErrors[idx] = `不能小于原值 ${item.originalTotalDemand}`
    return
  }

  // 验证：必须为正数
  if (num <= 0) {
    editingErrors[idx] = '需求总量必须大于0'
    return
  }

  // 验证通过
  delete editingErrors[idx]
  item.totalDemand = num
  // 重新计算缺口量：需求总量 - 现有库存，最小为0
  item.gap = calcGap(num, item.currentStock)
}

function onDemandBlur(idx: number, value: string) {
  const item = materialItems.value[idx]
  const trimmed = value.trim()

  // 失焦时如果值无效，恢复为原始值
  if (trimmed === '' || isNaN(Number(trimmed)) || Number(trimmed) < item.originalTotalDemand) {
    item.totalDemand = item.originalTotalDemand
    item.gap = calcGap(item.originalTotalDemand, item.currentStock)
    delete editingErrors[idx]
  }
}

// 样式函数
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
function pushStatusClass(s: string): string {
  const map: Record<string, string> = {
    '未推送': 'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-gray-100 text-gray-700',
    '已推送': 'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-emerald-100 text-emerald-700',
    '推送失败': 'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-red-100 text-red-700',
  }
  return map[s] || 'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-gray-100 text-gray-700'
}
function demandStatusClass(s: string): string {
  const map: Record<string, string> = {
    '待采购': 'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-amber-100 text-amber-700',
    '已关闭': 'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-gray-100 text-gray-700',
  }
  return map[s] || 'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-gray-100 text-gray-700'
}
function priorityClass(p: string): string {
  const map: Record<string, string> = {
    '高': 'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-red-100 text-red-700',
    '中': 'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-amber-100 text-amber-700',
    '低': 'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-emerald-100 text-emerald-700',
  }
  return map[p] || ''
}
function categoryClass(c: string): string {
  const map: Record<string, string> = {
    '种子': 'bg-green-100 text-green-700',
    '肥料': 'bg-amber-100 text-amber-700',
    '农药': 'bg-red-100 text-red-700',
    '农具': 'bg-blue-100 text-blue-700',
    '其他': 'bg-gray-100 text-gray-700',
  }
  return map[c] || 'bg-gray-100 text-gray-700'
}

function goBack() {
  router.push('/material-demand')
}
</script>
