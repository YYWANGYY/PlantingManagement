<template>
  <div class="space-y-6">
    <!-- 页头 -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold tracking-tight">{{ pageTitle }}</h1>
        <p class="mt-1 text-sm text-muted-foreground">{{ pageDesc }}</p>
      </div>
      <button
        class="inline-flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium transition-colors hover:bg-muted"
        @click="goBack"
      >
        <ChevronLeft class="h-4 w-4" />
        返回汇总
      </button>
    </div>

    <!-- 汇总统计 -->
    <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <div class="rounded-lg border bg-card p-4 shadow-sm">
        <p class="text-sm text-muted-foreground">物资总项数</p>
        <p class="mt-1 text-2xl font-bold">{{ filteredItems.length }}<span class="text-sm font-normal text-muted-foreground"> 项</span></p>
      </div>
      <div class="rounded-lg border bg-card p-4 shadow-sm">
        <p class="text-sm text-muted-foreground">缺口品类</p>
        <p class="mt-1 text-2xl font-bold text-red-600">{{ filteredItems.filter(i => i.gap > 0).length }}<span class="text-sm font-normal text-muted-foreground"> 项</span></p>
      </div>
      <div class="rounded-lg border bg-card p-4 shadow-sm">
        <p class="text-sm text-muted-foreground">预算总额</p>
        <p class="mt-1 text-2xl font-bold">{{ (filteredItems.reduce((s, i) => s + i.totalDemand * i.planPrice, 0) / 10000).toFixed(1) }}<span class="text-sm font-normal text-muted-foreground"> 万元</span></p>
      </div>
      <div class="rounded-lg border bg-card p-4 shadow-sm">
        <p class="text-sm text-muted-foreground">满足率</p>
        <p class="mt-1 text-2xl font-bold">{{ fulfillRate }}%</p>
      </div>
    </div>

    <!-- 明细列表 -->
    <div class="rounded-lg border bg-card shadow-sm">
      <div class="overflow-x-auto">
        <table class="w-full text-sm">
          <thead>
            <tr class="border-b bg-muted/50">
              <th class="h-10 px-4 text-left font-medium text-muted-foreground whitespace-nowrap">所属单位</th>
              <th class="h-10 px-4 text-left font-medium text-muted-foreground whitespace-nowrap">农资大类</th>
              <th class="h-10 px-4 text-left font-medium text-muted-foreground whitespace-nowrap">农资品类</th>
              <th class="h-10 px-4 text-left font-medium text-muted-foreground whitespace-nowrap">规格型号</th>
              <th class="h-10 px-4 text-center font-medium text-muted-foreground whitespace-nowrap">计量单位</th>
              <th class="h-10 px-4 text-right font-medium text-muted-foreground whitespace-nowrap">需求总量</th>
              <th class="h-10 px-4 text-right font-medium text-muted-foreground whitespace-nowrap">现有库存</th>
              <th class="h-10 px-4 text-right font-medium text-muted-foreground whitespace-nowrap">在途库存</th>
              <th class="h-10 px-4 text-right font-medium text-muted-foreground whitespace-nowrap">缺口量</th>
              <th class="h-10 px-4 text-right font-medium text-muted-foreground whitespace-nowrap">计划投入预算</th>
              <th class="h-10 px-4 text-center font-medium text-muted-foreground whitespace-nowrap">需求使用时间</th>
              <th class="h-10 px-4 text-center font-medium text-muted-foreground whitespace-nowrap">采购优先级</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(item, idx) in paginatedItems"
              :key="idx"
              class="border-b transition-colors hover:bg-muted/30"
            >
              <td class="h-12 px-4 whitespace-nowrap">{{ item.unit }}</td>
              <td class="h-12 px-4 whitespace-nowrap">
                <span class="inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium" :class="categoryBadgeClass(item.category)">{{ item.category }}</span>
              </td>
              <td class="h-12 px-4 whitespace-nowrap">{{ item.type }}</td>
              <td class="h-12 px-4 whitespace-nowrap text-muted-foreground">{{ item.ingredient }}</td>
              <td class="h-12 px-4 text-center whitespace-nowrap">{{ item.unitMeasure }}</td>
              <td class="h-12 px-4 text-right font-medium whitespace-nowrap">{{ item.totalDemand.toLocaleString() }}</td>
              <td class="h-12 px-4 text-right whitespace-nowrap">{{ item.currentStock.toLocaleString() }}</td>
              <td class="h-12 px-4 text-right whitespace-nowrap">{{ item.inTransit.toLocaleString() }}</td>
              <td class="h-12 px-4 text-right whitespace-nowrap">
                <span :class="item.gap > 0 ? 'font-medium text-red-600' : 'text-emerald-600'">
                  {{ item.gap > 0 ? item.gap.toLocaleString() : '无缺口' }}
                </span>
              </td>
              <td class="h-12 px-4 text-right whitespace-nowrap">¥{{ (item.totalDemand * item.planPrice).toLocaleString() }}</td>
              <td class="h-12 px-4 text-center whitespace-nowrap text-muted-foreground">{{ item.demandTime }}</td>
              <td class="h-12 px-4 text-center whitespace-nowrap">
                <span class="inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium" :class="priorityClass(item.priority)">{{ item.priority }}</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- 分页 -->
      <div class="flex items-center justify-between border-t px-4 py-3">
        <p class="text-sm text-muted-foreground">
          共 {{ filteredItems.length }} 条，每页 {{ pageSize }} 条
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
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ChevronLeft, ChevronRight } from 'lucide-vue-next'

const route = useRoute()
const router = useRouter()

const tab = route.params.tab as string  // 'region' | 'category'
const key = decodeURIComponent(route.params.key as string)

const currentPage = ref(1)
const pageSize = 10

// 页面标题
const pageTitle = computed(() => {
  if (tab === 'region') return `${key} - 农资明细`
  return `${key}类 - 农资明细`
})
const pageDesc = computed(() => {
  if (tab === 'region') return `${key}下辖所有需求计划的农资明细清单`
  return `农资大类为"${key}"的所有物资明细清单`
})

// 完整农资明细数据
interface SummaryItem {
  unit: string
  category: string
  type: string
  ingredient: string
  unitMeasure: string
  totalDemand: number
  currentStock: number
  inTransit: number
  gap: number
  planPrice: number
  demandTime: string
  priority: string
}

const allItems: SummaryItem[] = [
  // 哈尔滨公司 - 华康农场
  { unit: '华康农场（华山分场）', category: '种子', type: '杂交水稻种', ingredient: 'Y两优900', unitMeasure: 'kg', totalDemand: 1000, currentStock: 400, inTransit: 200, gap: 600, planPrice: 45.0, demandTime: '2026-04-01 ~ 2026-04-15', priority: '高' },
  { unit: '华康农场（华山分场）', category: '肥料', type: '复合肥', ingredient: 'NPK 15-15-15', unitMeasure: 'kg', totalDemand: 20000, currentStock: 12000, inTransit: 3000, gap: 8000, planPrice: 3.2, demandTime: '2026-04-01 ~ 2026-04-10', priority: '中' },
  { unit: '华康农场（华山分场）', category: '肥料', type: '尿素', ingredient: 'N 46%', unitMeasure: 'kg', totalDemand: 7500, currentStock: 5000, inTransit: 0, gap: 2500, planPrice: 2.8, demandTime: '2026-05-10 ~ 2026-05-20', priority: '低' },
  { unit: '华康农场（华山分场）', category: '农药', type: '杀虫剂', ingredient: '阿维菌素 1.8%EC', unitMeasure: 'ml', totalDemand: 25000, currentStock: 18000, inTransit: 5000, gap: 7000, planPrice: 0.15, demandTime: '2026-05-15 ~ 2026-06-15', priority: '中' },
  { unit: '华康农场（华山分场）', category: '农药', type: '杀菌剂', ingredient: '井冈霉素 5%WP', unitMeasure: 'g', totalDemand: 50000, currentStock: 30000, inTransit: 10000, gap: 20000, planPrice: 0.08, demandTime: '2026-06-01 ~ 2026-07-01', priority: '低' },
  { unit: '华康农场（华山分场）', category: '农具', type: '灌溉设备', ingredient: '水泵+管道', unitMeasure: '套', totalDemand: 5, currentStock: 5, inTransit: 0, gap: 0, planPrice: 2800.0, demandTime: '2026-04-10 ~ 2026-04-20', priority: '低' },
  { unit: '华康农场（雨林分场）', category: '种子', type: '小麦种子', ingredient: '济麦22', unitMeasure: 'kg', totalDemand: 2000, currentStock: 1500, inTransit: 300, gap: 500, planPrice: 5.2, demandTime: '2026-03-10 ~ 2026-03-20', priority: '高' },
  { unit: '华康农场（雨林分场）', category: '肥料', type: '有机肥', ingredient: '腐熟农家肥', unitMeasure: 'kg', totalDemand: 500000, currentStock: 400000, inTransit: 0, gap: 100000, planPrice: 0.8, demandTime: '2026-03-15 ~ 2026-03-25', priority: '中' },
  { unit: '华康农场（雨林分场）', category: '农药', type: '除草剂', ingredient: '苄嘧磺隆 10%WP', unitMeasure: 'g', totalDemand: 12000, currentStock: 8000, inTransit: 2000, gap: 4000, planPrice: 0.12, demandTime: '2026-04-05 ~ 2026-04-15', priority: '中' },
  { unit: '华康农场（康保分场）', category: '种子', type: '花生种子', ingredient: '花育33', unitMeasure: 'kg', totalDemand: 800, currentStock: 600, inTransit: 0, gap: 200, planPrice: 18.0, demandTime: '2026-04-20 ~ 2026-05-10', priority: '低' },
  // 哈尔滨公司 - 北安农场
  { unit: '北安农场（红星分场）', category: '种子', type: '玉米种子', ingredient: '先玉335', unitMeasure: 'kg', totalDemand: 1500, currentStock: 1500, inTransit: 0, gap: 0, planPrice: 32.0, demandTime: '2026-04-20 ~ 2026-05-01', priority: '低' },
  { unit: '北安农场（红星分场）', category: '肥料', type: '复合肥', ingredient: 'NPK 15-15-15', unitMeasure: 'kg', totalDemand: 15000, currentStock: 10000, inTransit: 5000, gap: 5000, planPrice: 3.2, demandTime: '2026-04-15 ~ 2026-04-25', priority: '中' },
  { unit: '北安农场（红星分场）', category: '农药', type: '杀虫剂', ingredient: '吡虫啉 10%WP', unitMeasure: 'g', totalDemand: 8000, currentStock: 6000, inTransit: 2000, gap: 2000, planPrice: 0.35, demandTime: '2026-06-01 ~ 2026-06-15', priority: '低' },
  { unit: '北安农场（兴安分场）', category: '肥料', type: '钾肥', ingredient: 'K₂O 60%', unitMeasure: 'kg', totalDemand: 3000, currentStock: 2000, inTransit: 500, gap: 1000, planPrice: 4.5, demandTime: '2026-05-01 ~ 2026-05-10', priority: '中' },
  { unit: '北安农场（兴安分场）', category: '农具', type: '收割机', ingredient: '联合收割机', unitMeasure: '台', totalDemand: 2, currentStock: 2, inTransit: 0, gap: 0, planPrice: 15000.0, demandTime: '2026-09-01 ~ 2026-09-15', priority: '低' },
  // 哈尔滨公司 - 嫩江农场
  { unit: '嫩江农场（合发分场）', category: '种子', type: '大豆种子', ingredient: '中黄13', unitMeasure: 'kg', totalDemand: 1200, currentStock: 400, inTransit: 0, gap: 800, planPrice: 12.5, demandTime: '2026-04-05 ~ 2026-04-10', priority: '高' },
  { unit: '嫩江农场（合发分场）', category: '肥料', type: '磷肥', ingredient: 'P₂O₅ 18%', unitMeasure: 'kg', totalDemand: 8000, currentStock: 5000, inTransit: 0, gap: 3000, planPrice: 3.5, demandTime: '2026-04-10 ~ 2026-04-20', priority: '中' },
  { unit: '嫩江农场（白云分场）', category: '种子', type: '油菜种子', ingredient: '中油杂12', unitMeasure: 'kg', totalDemand: 500, currentStock: 300, inTransit: 100, gap: 200, planPrice: 22.0, demandTime: '2026-03-20 ~ 2026-04-01', priority: '中' },
  { unit: '嫩江农场（白云分场）', category: '肥料', type: '叶面肥', ingredient: '磷酸二氢钾', unitMeasure: 'kg', totalDemand: 600, currentStock: 400, inTransit: 0, gap: 200, planPrice: 12.0, demandTime: '2026-05-01 ~ 2026-05-10', priority: '低' },
  // 沈阳公司 - 盘锦农场
  { unit: '盘锦农场（兴城分场）', category: '种子', type: '杂交水稻种', ingredient: '盐丰47', unitMeasure: 'kg', totalDemand: 900, currentStock: 500, inTransit: 200, gap: 400, planPrice: 42.0, demandTime: '2026-04-10 ~ 2026-04-20', priority: '高' },
  { unit: '盘锦农场（兴城分场）', category: '肥料', type: '复合肥', ingredient: 'NPK 15-15-15', unitMeasure: 'kg', totalDemand: 18000, currentStock: 10000, inTransit: 3000, gap: 8000, planPrice: 3.2, demandTime: '2026-04-15 ~ 2026-04-25', priority: '高' },
  { unit: '盘锦农场（兴城分场）', category: '农药', type: '杀菌剂', ingredient: '三环唑 75%WP', unitMeasure: 'g', totalDemand: 10000, currentStock: 8000, inTransit: 2000, gap: 2000, planPrice: 0.25, demandTime: '2026-06-15 ~ 2026-07-15', priority: '中' },
  { unit: '盘锦农场（红海滩分场）', category: '农具', type: '烘干设备', ingredient: '循环式烘干机', unitMeasure: '台', totalDemand: 3, currentStock: 2, inTransit: 0, gap: 1, planPrice: 12000.0, demandTime: '2026-09-15 ~ 2026-10-01', priority: '低' },
  { unit: '盘锦农场（红海滩分场）', category: '肥料', type: '有机肥', ingredient: '腐熟农家肥', unitMeasure: 'kg', totalDemand: 300000, currentStock: 200000, inTransit: 0, gap: 100000, planPrice: 0.8, demandTime: '2026-04-01 ~ 2026-04-10', priority: '中' },
  // 沈阳公司 - 长春农场
  { unit: '长春农场（九台分场）', category: '种子', type: '番茄种子', ingredient: '中杂105', unitMeasure: 'g', totalDemand: 200, currentStock: 50, inTransit: 0, gap: 150, planPrice: 85.0, demandTime: '2026-03-15 ~ 2026-03-25', priority: '高' },
  { unit: '长春农场（九台分场）', category: '农药', type: '杀虫剂', ingredient: '噻虫嗪 25%WG', unitMeasure: 'g', totalDemand: 5000, currentStock: 2000, inTransit: 0, gap: 3000, planPrice: 0.28, demandTime: '2026-05-10 ~ 2026-05-20', priority: '中' },
  { unit: '长春农场（梅河口分场）', category: '肥料', type: '硅肥', ingredient: '硅钙肥', unitMeasure: 'kg', totalDemand: 4000, currentStock: 2500, inTransit: 500, gap: 1500, planPrice: 2.2, demandTime: '2026-05-20 ~ 2026-06-01', priority: '低' },
  { unit: '长春农场（梅河口分场）', category: '农具', type: '运输车', ingredient: '农用三轮车', unitMeasure: '辆', totalDemand: 4, currentStock: 3, inTransit: 0, gap: 1, planPrice: 4500.0, demandTime: '2026-06-01 ~ 2026-06-15', priority: '低' },
]

// 按筛选条件过滤
const filteredItems = computed(() => {
  if (tab === 'region') {
    // 按区域公司过滤：unit 字段以区域公司下属农场开头
    const regionFarmMap: Record<string, string[]> = {
      '哈尔滨公司': ['华康农场', '北安农场', '嫩江农场'],
      '沈阳公司': ['盘锦农场', '长春农场'],
    }
    const farms = regionFarmMap[key] || []
    return allItems.filter(item => farms.some(farm => item.unit.startsWith(farm)))
  }
  // 按农资大类过滤
  return allItems.filter(item => item.category === key)
})

// 满足率
const fulfillRate = computed(() => {
  const total = filteredItems.value.length
  if (total === 0) return 0
  const fulfilled = filteredItems.value.filter(i => i.gap === 0).length
  return Math.round((fulfilled / total) * 100)
})

// 分页
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
  const start = Math.max(2, current - 1)
  const end = Math.min(total - 1, current + 1)
  for (let i = start; i <= end; i++) pages.push(i)
  if (current < total - 2) pages.push('...')
  pages.push(total)
  return pages
})

// 返回汇总页
function goBack() {
  router.push('/material-demand/summary')
}

// 农资大类徽章样式
function categoryBadgeClass(category: string): string {
  const map: Record<string, string> = {
    '种子': 'bg-green-100 text-green-700',
    '肥料': 'bg-amber-100 text-amber-700',
    '农药': 'bg-red-100 text-red-700',
    '农具': 'bg-blue-100 text-blue-700',
    '其他': 'bg-gray-100 text-gray-700',
  }
  return map[category] || 'bg-gray-100 text-gray-700'
}

// 采购优先级样式
function priorityClass(priority: string): string {
  const map: Record<string, string> = {
    '高': 'bg-red-100 text-red-700',
    '中': 'bg-amber-100 text-amber-700',
    '低': 'bg-gray-100 text-gray-700',
  }
  return map[priority] || 'bg-gray-100 text-gray-700'
}
</script>
