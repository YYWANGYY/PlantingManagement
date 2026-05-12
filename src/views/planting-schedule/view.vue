<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ArrowLeft } from 'lucide-vue-next'
import { showToast } from '@/lib/toast'

const route = useRoute()
const router = useRouter()
const planId = computed(() => route.params.id as string)

const activeTab = ref('basic')

interface PlanInfo {
  planCode: string
  schemeCode: string
  planName: string
  unit: string
  plantingMode: string
  cropCategory: string
  cropVariety: string
  assetArea: number
  planArea: number
  planStartTime: string
  planEndTime: string
  planLeader: string
  execLeader: string
  creator: string
  effectiveTime: string
  approvalStatus: string
  progressStatus: string
  remark: string
  resources: { code: string; name: string; type: string; area: number; status: string }[]
}

interface FarmingExecItem {
  id: string
  growthStage: string
  productionProcess: string
  workStep: string
  minLeafAge: number | null
  maxLeafAge: number | null
  coreStandard: string
  facilityEnv: string
  paramRequirement: string
  workMethod: string
  planStartTime: string
  planEndTime: string
  planArea: number
  equipment: string
  execStatus: string
  leader: string
  executor: string
  actualEndTime: string
  execRecordCode: string
  remark: string
}

interface MaterialItem {
  id: string
  growthStage: string
  productionProcess: string
  workStep: string
  materialCategory: string
  materialType: string
  specification: string
  standardDosage: number
  unit: string
  safetyInterval: number | null
  remark: string
  // 耗用明细特有
  actualUsage?: number
  usageUnit?: string
  usageTime?: string
  responsiblePerson?: string
  unitPrice?: number
  totalCost?: number
}

const planInfo = ref<PlanInfo>({
  planCode: 'ZJ2025-001',
  schemeCode: 'FA2025-001',
  planName: '2025年良乡园区冬小麦种植计划',
  unit: '良乡园区',
  plantingMode: '大田种植',
  cropCategory: '粮食',
  cropVariety: '冬小麦',
  assetArea: 500,
  planArea: 450,
  planStartTime: '2025-03-01',
  planEndTime: '2025-09-15',
  planLeader: '张建国',
  execLeader: '李明',
  creator: '王管理',
  effectiveTime: '2025-02-20',
  approvalStatus: '已完成',
  progressStatus: '执行中',
  remark: '',
  resources: [
    { code: '京号0077', name: '良乡东地块A', type: '大田', area: 120, status: '可用' },
    { code: '京号0077', name: '良乡东地块B', type: '大田', area: 100, status: '可用' },
    { code: '京号0078', name: '良乡西地块A', type: '大田', area: 80, status: '可用' },
    { code: '京号0078', name: '良乡西地块B', type: '大田', area: 60, status: '可用' },
    { code: '京号0079', name: '良乡南地块', type: '大田', area: 90, status: '可用' },
  ],
})

const farmingItems = ref<FarmingExecItem[]>([])
const materialItems = ref<MaterialItem[]>([])

// ==================== 计划完成情况总表 ====================
interface CompletionSummary {
  growthStage: string
  totalTasks: number
  completedTasks: number
  completionRate: number
  planStartTime: string
  planEndTime: string
  actualEndTime: string
  status: string
}

const completionSummary = computed<CompletionSummary[]>(() => {
  // 按生育时期分组统计
  const stageMap = new Map<string, { total: number; completed: number; startTime: string; endTime: string; actualEnd: string; status: string }>()
  for (const item of farmingItems.value) {
    const existing = stageMap.get(item.growthStage)
    const isCompleted = item.execStatus === '已完成'
    if (existing) {
      existing.total++
      if (isCompleted) existing.completed++
    } else {
      stageMap.set(item.growthStage, {
        total: 1,
        completed: isCompleted ? 1 : 0,
        startTime: item.planStartTime,
        endTime: item.planEndTime,
        actualEnd: item.actualEndTime || '',
        status: item.execStatus,
      })
    }
  }
  const result: CompletionSummary[] = []
  for (const [stage, data] of stageMap) {
    result.push({
      growthStage: stage,
      totalTasks: data.total,
      completedTasks: data.completed,
      completionRate: data.total > 0 ? Math.round((data.completed / data.total) * 100) : 0,
      planStartTime: data.startTime,
      planEndTime: data.endTime,
      actualEndTime: data.actualEnd,
      status: data.completed >= data.total ? '已完成' : data.completed > 0 ? '执行中' : '待执行',
    })
  }
  return result
})

// 总体完成率
const overallCompletionRate = computed(() => {
  const total = farmingItems.value.length
  const completed = farmingItems.value.filter(i => i.execStatus === '已完成').length
  return total > 0 ? Math.round((completed / total) * 100) : 0
})

// ==================== 作业执行明细分页 ====================
const farmCurrentPage = ref(1)
const farmPageSize = 10
const farmTotalPages = computed(() => Math.max(1, Math.ceil(farmingItems.value.length / farmPageSize)))
const paginatedFarmItems = computed(() => {
  const start = (farmCurrentPage.value - 1) * farmPageSize
  return farmingItems.value.slice(start, start + farmPageSize)
})
const farmVisiblePages = computed(() => {
  const total = farmTotalPages.value
  const current = farmCurrentPage.value
  const pages: (number | string)[] = []
  if (total <= 7) {
    for (let i = 1; i <= total; i++) pages.push(i)
  } else {
    pages.push(1)
    if (current > 3) pages.push('...')
    const start = Math.max(2, current - 1)
    const end = Math.min(total - 1, current + 1)
    for (let i = start; i <= end; i++) pages.push(i)
    if (current < total - 2) pages.push('...')
    pages.push(total)
  }
  return pages
})

// ==================== 农资耗用明细分页 ====================
const matCurrentPage = ref(1)
const matPageSize = 10
const matTotalPages = computed(() => Math.max(1, Math.ceil(materialItems.value.length / matPageSize)))
const paginatedMaterialItems = computed(() => {
  const start = (matCurrentPage.value - 1) * matPageSize
  return materialItems.value.slice(start, start + matPageSize)
})
const matVisiblePages = computed(() => {
  const total = matTotalPages.value
  const current = matCurrentPage.value
  const pages: (number | string)[] = []
  if (total <= 7) {
    for (let i = 1; i <= total; i++) pages.push(i)
  } else {
    pages.push(1)
    if (current > 3) pages.push('...')
    const start = Math.max(2, current - 1)
    const end = Math.min(total - 1, current + 1)
    for (let i = start; i <= end; i++) pages.push(i)
    if (current < total - 2) pages.push('...')
    pages.push(total)
  }
  return pages
})

// ==================== 加载模拟数据 ====================
function loadMockData() {
  const growthStages = ['播种期', '出苗期', '分蘖期', '越冬期', '返青期', '拔节期', '抽穗期', '灌浆期', '成熟期', '收获期']
  const processes = ['备耕', '播种', '田间管理', '田间管理', '田间管理', '田间管理', '田间管理', '田间管理', '田间管理', '收获']
  const steps = [
    '翻地整地作业', '机械播种作业', '查苗补苗作业', '冬灌作业',
    '追肥作业', '病虫害防治作业', '叶面追肥作业', '水分管理作业',
    '脱肥防治作业', '机械收割作业',
  ]
  const execStatuses = ['已完成', '已完成', '已完成', '已完成', '已完成', '执行中', '待执行', '待执行', '待执行', '待执行']
  const leaders = ['王建国', '赵大伟', '刘军', '孙伟', '周明', '吴强', '郑磊', '钱涛', '陈刚', '杨辉']
  const executors = ['张三', '李四', '王五', '赵六', '钱七', '孙八', '周九', '吴十', '郑十一', '冯十二']

  const baseDate = new Date('2025-03-01')

  farmingItems.value = growthStages.map((stage, i) => {
    const startDate = new Date(baseDate)
    startDate.setDate(startDate.getDate() + i * 18)
    const endDate = new Date(startDate)
    endDate.setDate(endDate.getDate() + 15)
    return {
      id: `F${String(i + 1).padStart(3, '0')}`,
      growthStage: stage,
      productionProcess: processes[i],
      workStep: steps[i],
      minLeafAge: [0, 1, 2, null, 3, 4, 5, 6, 7, null][i],
      maxLeafAge: [0, 2, 4, null, 5, 6, 7, 8, 9, null][i],
      coreStandard: `${stage}核心操作标准要求`,
      facilityEnv: '',
      paramRequirement: `${steps[i]}参数标准`,
      workMethod: ['机械', '机械', '人工', '机械', '机械', '无人机', '机械', '智能设备', '人工', '机械'][i],
      planStartTime: startDate.toISOString().split('T')[0],
      planEndTime: endDate.toISOString().split('T')[0],
      planArea: 450,
      equipment: ['大型拖拉机', '播种机', '-', '灌溉设备', '施肥机', '植保无人机', '喷雾机', '智能灌溉', '-', '联合收割机'][i],
      execStatus: execStatuses[i],
      leader: leaders[i],
      executor: executors[i],
      actualEndTime: execStatuses[i] === '已完成' ? endDate.toISOString().split('T')[0] : '',
      execRecordCode: execStatuses[i] === '已完成' ? `REC${String(i + 1).padStart(5, '0')}` : '',
      remark: '',
    }
  })

  // 农资耗用明细
  const materialCategories = ['肥料', '肥料', '农药', '农药', '肥料', '农药', '肥料', '农药', '肥料', '种子']
  const materialTypes = ['复合肥', '尿素', '除草剂', '杀虫剂', '磷酸二氢钾', '杀菌剂', '叶面肥', '杀虫剂', '复合肥', '冬小麦种子']
  const materialStages = ['播种期', '播种期', '出苗期', '分蘖期', '返青期', '拔节期', '抽穗期', '灌浆期', '灌浆期', '播种期']

  materialItems.value = materialStages.map((stage, i) => {
    const dosage = [30, 20, 2, 1.5, 15, 1, 5, 1.5, 25, 15][i]
    const price = [3.5, 2.8, 45, 52, 4.2, 48, 8.5, 52, 3.5, 6][i]
    const actual = execStatuses[i] === '已完成' ? dosage * (0.9 + Math.random() * 0.2) : 0
    return {
      id: `M${String(i + 1).padStart(3, '0')}`,
      growthStage: stage,
      productionProcess: processes[growthStages.indexOf(stage)],
      workStep: steps[growthStages.indexOf(stage)],
      materialCategory: materialCategories[i],
      materialType: materialTypes[i],
      specification: ['45%(15-15-15)', '含氮≥46%', '10%乳油', '20%悬浮剂', '98%粉剂', '25%可湿性粉剂', '氨基酸≥10%', '20%悬浮剂', '45%(15-15-15)', '芽率≥95%'][i],
      standardDosage: dosage,
      unit: ['kg/亩', 'kg/亩', 'L/亩', 'L/亩', 'kg/亩', 'g/亩', 'kg/亩', 'L/亩', 'kg/亩', 'kg/亩'][i],
      safetyInterval: i >= 2 && i <= 7 ? [0, 0, 15, 21, 0, 14, 0, 21, 0, 0][i] : null,
      remark: '',
      actualUsage: Math.round(actual * 100) / 100,
      usageUnit: ['kg/亩', 'kg/亩', 'L/亩', 'L/亩', 'kg/亩', 'g/亩', 'kg/亩', 'L/亩', 'kg/亩', 'kg/亩'][i],
      usageTime: execStatuses[i] === '已完成' ? `2025-0${3 + i}-${10 + i}` : '',
      responsiblePerson: leaders[i],
      unitPrice: price,
      totalCost: Math.round(actual * price * 450 * 100) / 100,
    }
  })
}

onMounted(() => {
  loadMockData()
})

// 标签页定义
const tabs = [
  { key: 'basic', label: '基本信息' },
  { key: 'completion', label: '计划完成情况总表' },
  { key: 'farming', label: '作业执行明细' },
  { key: 'material', label: '农资耗用明细' },
]

function goBack() {
  router.push('/planting-schedule')
}

const execStatusMap: Record<string, { label: string; cls: string }> = {
  pending_issue: { label: '待下发', cls: 'bg-blue-50 text-blue-600' },
  issued: { label: '已下发', cls: 'bg-indigo-50 text-indigo-600' },
  executing: { label: '执行中', cls: 'bg-yellow-50 text-yellow-600' },
  completed: { label: '已完成', cls: 'bg-green-50 text-green-600' },
  overdue: { label: '已逾期', cls: 'bg-red-50 text-red-600' },
  cancelled: { label: '已取消', cls: 'bg-gray-50 text-gray-500' },
}
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <!-- 顶部 -->
    <div class="bg-white border-b border-gray-200 px-6 py-4 flex items-center gap-3">
      <button @click="goBack" class="text-gray-500 hover:text-gray-700 transition-colors">
        <ArrowLeft class="w-5 h-5" />
      </button>
      <h1 class="text-lg font-semibold text-gray-900">计划详情</h1>
    </div>

    <!-- 页签 -->
    <div class="bg-white border-b border-gray-200 px-6">
      <div class="flex gap-0">
        <button
          v-for="tab in tabs"
          :key="tab.key"
          @click="activeTab = tab.key"
          :class="[
            'px-5 py-3 text-sm font-medium border-b-2 transition-colors',
            activeTab === tab.key
              ? 'border-blue-500 text-blue-600'
              : 'border-transparent text-gray-500 hover:text-gray-700',
          ]"
        >
          {{ tab.label }}
        </button>
      </div>
    </div>

    <div class="p-6">
      <!-- ==================== 基本信息 ==================== -->
      <div v-if="activeTab === 'basic'" class="space-y-6">
        <!-- 基本信息卡片 -->
        <div class="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div class="px-6 py-3 bg-gray-50 border-b border-gray-200">
            <h3 class="text-sm font-semibold text-gray-700">基本信息</h3>
          </div>
          <div class="p-6 grid grid-cols-4 gap-x-8 gap-y-4">
            <div>
              <span class="text-xs text-gray-400">计划编号</span>
              <p class="text-sm text-gray-900 mt-0.5">{{ planInfo.planCode }}</p>
            </div>
            <div>
              <span class="text-xs text-gray-400">关联种植方案编号</span>
              <p class="text-sm text-gray-900 mt-0.5">{{ planInfo.schemeCode }}</p>
            </div>
            <div>
              <span class="text-xs text-gray-400">种植计划名称</span>
              <p class="text-sm text-gray-900 mt-0.5">{{ planInfo.planName }}</p>
            </div>
            <div>
              <span class="text-xs text-gray-400">所属单位</span>
              <p class="text-sm text-gray-900 mt-0.5">{{ planInfo.unit }}</p>
            </div>
            <div>
              <span class="text-xs text-gray-400">种植模式</span>
              <p class="text-sm text-gray-900 mt-0.5">{{ planInfo.plantingMode }}</p>
            </div>
            <div>
              <span class="text-xs text-gray-400">种植作物大类</span>
              <p class="text-sm text-gray-900 mt-0.5">{{ planInfo.cropCategory }}</p>
            </div>
            <div>
              <span class="text-xs text-gray-400">种植品种</span>
              <p class="text-sm text-gray-900 mt-0.5">{{ planInfo.cropVariety }}</p>
            </div>
            <div>
              <span class="text-xs text-gray-400">资产面积(亩)</span>
              <p class="text-sm text-gray-900 mt-0.5">{{ planInfo.assetArea }}</p>
            </div>
            <div>
              <span class="text-xs text-gray-400">计划种植总面积(亩)</span>
              <p class="text-sm text-gray-900 mt-0.5">{{ planInfo.planArea }}</p>
            </div>
            <div>
              <span class="text-xs text-gray-400">计划播种/定植开始时间</span>
              <p class="text-sm text-gray-900 mt-0.5">{{ planInfo.planStartTime }}</p>
            </div>
            <div>
              <span class="text-xs text-gray-400">计划收获结束时间</span>
              <p class="text-sm text-gray-900 mt-0.5">{{ planInfo.planEndTime }}</p>
            </div>
            <div>
              <span class="text-xs text-gray-400">计划负责人</span>
              <p class="text-sm text-gray-900 mt-0.5">{{ planInfo.planLeader }}</p>
            </div>
            <div>
              <span class="text-xs text-gray-400">执行负责人</span>
              <p class="text-sm text-gray-900 mt-0.5">{{ planInfo.execLeader }}</p>
            </div>
            <div>
              <span class="text-xs text-gray-400">创建人</span>
              <p class="text-sm text-gray-900 mt-0.5">{{ planInfo.creator }}</p>
            </div>
            <div>
              <span class="text-xs text-gray-400">生效时间</span>
              <p class="text-sm text-gray-900 mt-0.5">{{ planInfo.effectiveTime }}</p>
            </div>
            <div>
              <span class="text-xs text-gray-400">审批状态</span>
              <p class="text-sm text-gray-900 mt-0.5">{{ planInfo.approvalStatus }}</p>
            </div>
            <div>
              <span class="text-xs text-gray-400">进度状态</span>
              <p class="text-sm text-gray-900 mt-0.5">{{ planInfo.progressStatus }}</p>
            </div>
            <div v-if="planInfo.remark" class="col-span-4">
              <span class="text-xs text-gray-400">备注</span>
              <p class="text-sm text-gray-900 mt-0.5">{{ planInfo.remark }}</p>
            </div>
          </div>
        </div>

        <!-- 资源信息 -->
        <div class="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div class="px-6 py-3 bg-gray-50 border-b border-gray-200">
            <h3 class="text-sm font-semibold text-gray-700">种植资源信息</h3>
          </div>
          <table class="w-full text-sm">
            <thead>
              <tr class="bg-gray-50 text-gray-500 text-xs">
                <th class="px-4 py-3 text-left font-medium">序号</th>
                <th class="px-4 py-3 text-left font-medium">地块编号</th>
                <th class="px-4 py-3 text-left font-medium">地块名称</th>
                <th class="px-4 py-3 text-left font-medium">地块类型</th>
                <th class="px-4 py-3 text-left font-medium">地块面积(亩)</th>
                <th class="px-4 py-3 text-left font-medium">状态</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(res, idx) in planInfo.resources" :key="idx" class="border-t border-gray-100">
                <td class="px-4 py-3 text-gray-500">{{ idx + 1 }}</td>
                <td class="px-4 py-3 text-gray-900">{{ res.code }}</td>
                <td class="px-4 py-3 text-gray-900">{{ res.name }}</td>
                <td class="px-4 py-3 text-gray-900">{{ res.type }}</td>
                <td class="px-4 py-3 text-gray-900">{{ res.area }}</td>
                <td class="px-4 py-3">
                  <span class="inline-flex px-2 py-0.5 text-xs rounded-full"
                    :class="res.status === '可用' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-500'">
                    {{ res.status }}
                  </span>
                </td>
              </tr>
            </tbody>
            <tfoot>
              <tr class="border-t border-gray-200 bg-gray-50">
                <td colspan="4" class="px-4 py-2 text-xs text-gray-500">共 {{ planInfo.resources.length }} 个地块</td>
                <td colspan="2" class="px-4 py-2 text-xs text-gray-500">资产面积合计：{{ planInfo.resources.reduce((s, r) => s + r.area, 0) }} 亩</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      <!-- ==================== 计划完成情况总表 ==================== -->
      <div v-if="activeTab === 'completion'" class="space-y-6">
        <!-- 总览卡片 -->
        <div class="grid grid-cols-4 gap-4">
          <div class="bg-white rounded-lg border border-gray-200 p-4">
            <p class="text-xs text-gray-400">总任务数</p>
            <p class="text-2xl font-bold text-gray-900 mt-1">{{ farmingItems.length }}</p>
          </div>
          <div class="bg-white rounded-lg border border-gray-200 p-4">
            <p class="text-xs text-gray-400">已完成</p>
            <p class="text-2xl font-bold text-green-600 mt-1">{{ farmingItems.filter(i => i.execStatus === '已完成').length }}</p>
          </div>
          <div class="bg-white rounded-lg border border-gray-200 p-4">
            <p class="text-xs text-gray-400">执行中</p>
            <p class="text-2xl font-bold text-yellow-600 mt-1">{{ farmingItems.filter(i => i.execStatus === '执行中').length }}</p>
          </div>
          <div class="bg-white rounded-lg border border-gray-200 p-4">
            <p class="text-xs text-gray-400">总体完成率</p>
            <p class="text-2xl font-bold text-blue-600 mt-1">{{ overallCompletionRate }}%</p>
          </div>
        </div>

        <!-- 总表 -->
        <div class="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <table class="w-full text-sm">
            <thead>
              <tr class="bg-gray-50 text-gray-500 text-xs">
                <th class="px-4 py-3 text-left font-medium">生育时期</th>
                <th class="px-4 py-3 text-left font-medium">总任务数</th>
                <th class="px-4 py-3 text-left font-medium">已完成数</th>
                <th class="px-4 py-3 text-left font-medium">完成率</th>
                <th class="px-4 py-3 text-left font-medium">计划开始时间</th>
                <th class="px-4 py-3 text-left font-medium">计划结束时间</th>
                <th class="px-4 py-3 text-left font-medium">实际完成时间</th>
                <th class="px-4 py-3 text-left font-medium">状态</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="row in completionSummary" :key="row.growthStage" class="border-t border-gray-100">
                <td class="px-4 py-3 text-gray-900 font-medium">{{ row.growthStage }}</td>
                <td class="px-4 py-3 text-gray-900">{{ row.totalTasks }}</td>
                <td class="px-4 py-3 text-gray-900">{{ row.completedTasks }}</td>
                <td class="px-4 py-3">
                  <div class="flex items-center gap-2">
                    <div class="flex-1 bg-gray-100 rounded-full h-2 max-w-[100px]">
                      <div class="h-2 rounded-full transition-all" :class="row.completionRate >= 100 ? 'bg-green-500' : row.completionRate > 0 ? 'bg-blue-500' : 'bg-gray-300'"
                        :style="{ width: Math.min(row.completionRate, 100) + '%' }"></div>
                    </div>
                    <span class="text-xs text-gray-500">{{ row.completionRate }}%</span>
                  </div>
                </td>
                <td class="px-4 py-3 text-gray-900">{{ row.planStartTime }}</td>
                <td class="px-4 py-3 text-gray-900">{{ row.planEndTime }}</td>
                <td class="px-4 py-3 text-gray-900">{{ row.actualEndTime || '-' }}</td>
                <td class="px-4 py-3">
                  <span class="inline-flex px-2 py-0.5 text-xs rounded-full"
                    :class="row.status === '已完成' ? 'bg-green-50 text-green-600' : row.status === '执行中' ? 'bg-yellow-50 text-yellow-600' : 'bg-gray-50 text-gray-500'">
                    {{ row.status }}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- ==================== 作业执行明细 ==================== -->
      <div v-if="activeTab === 'farming'" class="space-y-4">
        <div class="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div class="overflow-x-auto">
            <table class="w-full text-sm">
              <thead>
                <tr class="bg-gray-50 text-gray-500 text-xs whitespace-nowrap">
                  <th class="px-4 py-3 text-left font-medium">序号</th>
                  <th class="px-4 py-3 text-left font-medium">生育时期</th>
                  <th class="px-4 py-3 text-left font-medium">生产流程</th>
                  <th class="px-4 py-3 text-left font-medium">作业环节</th>
                  <th v-if="planInfo.plantingMode === '大田种植'" class="px-4 py-3 text-left font-medium">最小叶龄</th>
                  <th v-if="planInfo.plantingMode === '大田种植'" class="px-4 py-3 text-left font-medium">最大叶龄</th>
                  <th class="px-4 py-3 text-left font-medium">核心农事操作标准</th>
                  <th v-if="planInfo.plantingMode === '设施种植'" class="px-4 py-3 text-left font-medium">设施环境管控要求</th>
                  <th class="px-4 py-3 text-left font-medium">作业参数要求</th>
                  <th class="px-4 py-3 text-left font-medium">作业方式</th>
                  <th class="px-4 py-3 text-left font-medium">计划开始时间</th>
                  <th class="px-4 py-3 text-left font-medium">计划结束时间</th>
                  <th class="px-4 py-3 text-left font-medium">计划作业面积</th>
                  <th class="px-4 py-3 text-left font-medium">计划作业设备/农机</th>
                  <th class="px-4 py-3 text-left font-medium">执行状态</th>
                  <th class="px-4 py-3 text-left font-medium">作业负责人</th>
                  <th class="px-4 py-3 text-left font-medium">作业执行人</th>
                  <th class="px-4 py-3 text-left font-medium">实际完成时间</th>
                  <th class="px-4 py-3 text-left font-medium">执行记录编号</th>
                  <th class="px-4 py-3 text-left font-medium">备注</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(item, idx) in paginatedFarmItems" :key="item.id" class="border-t border-gray-100 hover:bg-gray-50">
                  <td class="px-4 py-3 text-gray-500">{{ (farmCurrentPage - 1) * farmPageSize + idx + 1 }}</td>
                  <td class="px-4 py-3 text-gray-900">{{ item.growthStage }}</td>
                  <td class="px-4 py-3 text-gray-900">{{ item.productionProcess }}</td>
                  <td class="px-4 py-3 text-gray-900">{{ item.workStep }}</td>
                  <td v-if="planInfo.plantingMode === '大田种植'" class="px-4 py-3 text-gray-900">{{ item.minLeafAge ?? '-' }}</td>
                  <td v-if="planInfo.plantingMode === '大田种植'" class="px-4 py-3 text-gray-900">{{ item.maxLeafAge ?? '-' }}</td>
                  <td class="px-4 py-3 text-gray-900">{{ item.coreStandard }}</td>
                  <td v-if="planInfo.plantingMode === '设施种植'" class="px-4 py-3 text-gray-900">{{ item.facilityEnv || '-' }}</td>
                  <td class="px-4 py-3 text-gray-900">{{ item.paramRequirement }}</td>
                  <td class="px-4 py-3 text-gray-900">{{ item.workMethod }}</td>
                  <td class="px-4 py-3 text-gray-900 whitespace-nowrap">{{ item.planStartTime }}</td>
                  <td class="px-4 py-3 text-gray-900 whitespace-nowrap">{{ item.planEndTime }}</td>
                  <td class="px-4 py-3 text-gray-900">{{ item.planArea }}</td>
                  <td class="px-4 py-3 text-gray-900">{{ item.equipment }}</td>
                  <td class="px-4 py-3">
                    <span class="inline-flex px-2 py-0.5 text-xs rounded-full"
                      :class="(execStatusMap[item.execStatus] || { cls: 'bg-gray-50 text-gray-500' }).cls">
                      {{ (execStatusMap[item.execStatus] || { label: item.execStatus }).label }}
                    </span>
                  </td>
                  <td class="px-4 py-3 text-gray-900">{{ item.leader }}</td>
                  <td class="px-4 py-3 text-gray-900">{{ item.executor }}</td>
                  <td class="px-4 py-3 text-gray-900 whitespace-nowrap">{{ item.actualEndTime || '-' }}</td>
                  <td class="px-4 py-3 text-gray-900">{{ item.execRecordCode || '-' }}</td>
                  <td class="px-4 py-3 text-gray-900">{{ item.remark || '-' }}</td>
                </tr>
              </tbody>
            </table>
          </div>
          <!-- 分页 -->
          <div class="px-4 py-3 border-t border-gray-200 flex items-center justify-between">
            <span class="text-xs text-gray-500">共 {{ farmingItems.length }} 条</span>
            <div class="flex items-center gap-1">
              <button @click="farmCurrentPage = 1" :disabled="farmCurrentPage === 1"
                class="px-2 py-1 text-xs rounded border border-gray-200 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed">首页</button>
              <button @click="farmCurrentPage--" :disabled="farmCurrentPage === 1"
                class="px-2 py-1 text-xs rounded border border-gray-200 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed">上一页</button>
              <template v-for="page in farmVisiblePages" :key="page">
                <span v-if="page === '...'" class="px-1 text-xs text-gray-400">...</span>
                <button v-else @click="farmCurrentPage = page as number"
                  :class="['px-2.5 py-1 text-xs rounded border', farmCurrentPage === page ? 'bg-blue-500 text-white border-blue-500' : 'border-gray-200 hover:bg-gray-50']">
                  {{ page }}
                </button>
              </template>
              <button @click="farmCurrentPage++" :disabled="farmCurrentPage === farmTotalPages"
                class="px-2 py-1 text-xs rounded border border-gray-200 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed">下一页</button>
              <button @click="farmCurrentPage = farmTotalPages" :disabled="farmCurrentPage === farmTotalPages"
                class="px-2 py-1 text-xs rounded border border-gray-200 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed">末页</button>
            </div>
          </div>
        </div>
      </div>

      <!-- ==================== 农资耗用明细 ==================== -->
      <div v-if="activeTab === 'material'" class="space-y-4">
        <div class="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div class="overflow-x-auto">
            <table class="w-full text-sm">
              <thead>
                <tr class="bg-gray-50 text-gray-500 text-xs whitespace-nowrap">
                  <th class="px-4 py-3 text-left font-medium">序号</th>
                  <th class="px-4 py-3 text-left font-medium">生育时期</th>
                  <th class="px-4 py-3 text-left font-medium">生产流程</th>
                  <th class="px-4 py-3 text-left font-medium">作业环节</th>
                  <th class="px-4 py-3 text-left font-medium">农资大类</th>
                  <th class="px-4 py-3 text-left font-medium">农资品类</th>
                  <th class="px-4 py-3 text-left font-medium">有效成分/规格</th>
                  <th class="px-4 py-3 text-left font-medium">标准用量</th>
                  <th class="px-4 py-3 text-left font-medium">计量单位</th>
                  <th class="px-4 py-3 text-left font-medium">实际耗用数量</th>
                  <th class="px-4 py-3 text-left font-medium">耗用单位</th>
                  <th class="px-4 py-3 text-left font-medium">耗用时间</th>
                  <th class="px-4 py-3 text-left font-medium">责任人</th>
                  <th class="px-4 py-3 text-left font-medium">计划单价(元)</th>
                  <th class="px-4 py-3 text-left font-medium">费用合计(元)</th>
                  <th class="px-4 py-3 text-left font-medium">安全间隔期(天)</th>
                  <th class="px-4 py-3 text-left font-medium">备注</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(item, idx) in paginatedMaterialItems" :key="item.id" class="border-t border-gray-100 hover:bg-gray-50">
                  <td class="px-4 py-3 text-gray-500">{{ (matCurrentPage - 1) * matPageSize + idx + 1 }}</td>
                  <td class="px-4 py-3 text-gray-900">{{ item.growthStage }}</td>
                  <td class="px-4 py-3 text-gray-900">{{ item.productionProcess }}</td>
                  <td class="px-4 py-3 text-gray-900">{{ item.workStep }}</td>
                  <td class="px-4 py-3 text-gray-900">{{ item.materialCategory }}</td>
                  <td class="px-4 py-3 text-gray-900">{{ item.materialType }}</td>
                  <td class="px-4 py-3 text-gray-900">{{ item.specification }}</td>
                  <td class="px-4 py-3 text-gray-900">{{ item.standardDosage }}</td>
                  <td class="px-4 py-3 text-gray-900">{{ item.unit }}</td>
                  <td class="px-4 py-3 text-gray-900">{{ item.actualUsage || '-' }}</td>
                  <td class="px-4 py-3 text-gray-900">{{ item.usageUnit || '-' }}</td>
                  <td class="px-4 py-3 text-gray-900 whitespace-nowrap">{{ item.usageTime || '-' }}</td>
                  <td class="px-4 py-3 text-gray-900">{{ item.responsiblePerson || '-' }}</td>
                  <td class="px-4 py-3 text-gray-900">{{ item.unitPrice || '-' }}</td>
                  <td class="px-4 py-3 text-gray-900">{{ item.totalCost || '-' }}</td>
                  <td class="px-4 py-3 text-gray-900">{{ item.safetyInterval != null ? item.safetyInterval : '-' }}</td>
                  <td class="px-4 py-3 text-gray-900">{{ item.remark || '-' }}</td>
                </tr>
              </tbody>
            </table>
          </div>
          <!-- 分页 -->
          <div class="px-4 py-3 border-t border-gray-200 flex items-center justify-between">
            <span class="text-xs text-gray-500">共 {{ materialItems.length }} 条</span>
            <div class="flex items-center gap-1">
              <button @click="matCurrentPage = 1" :disabled="matCurrentPage === 1"
                class="px-2 py-1 text-xs rounded border border-gray-200 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed">首页</button>
              <button @click="matCurrentPage--" :disabled="matCurrentPage === 1"
                class="px-2 py-1 text-xs rounded border border-gray-200 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed">上一页</button>
              <template v-for="page in matVisiblePages" :key="page">
                <span v-if="page === '...'" class="px-1 text-xs text-gray-400">...</span>
                <button v-else @click="matCurrentPage = page as number"
                  :class="['px-2.5 py-1 text-xs rounded border', matCurrentPage === page ? 'bg-blue-500 text-white border-blue-500' : 'border-gray-200 hover:bg-gray-50']">
                  {{ page }}
                </button>
              </template>
              <button @click="matCurrentPage++" :disabled="matCurrentPage === matTotalPages"
                class="px-2 py-1 text-xs rounded border border-gray-200 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed">下一页</button>
              <button @click="matCurrentPage = matTotalPages" :disabled="matCurrentPage === matTotalPages"
                class="px-2 py-1 text-xs rounded border border-gray-200 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed">末页</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
