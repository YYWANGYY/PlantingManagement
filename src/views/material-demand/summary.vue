<template>
  <div class="space-y-6">
    <!-- 页头 -->
    <div>
      <h1 class="text-2xl font-bold tracking-tight">需求汇总</h1>
      <p class="mt-1 text-sm text-muted-foreground">农资需求的分类汇总与采购进度总览</p>
    </div>

    <!-- 总览统计 -->
    <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <!-- 统计-物资总类 -->
      <div class="rounded-lg border bg-card text-card-foreground shadow-sm">
        <div class="flex items-center gap-4 p-5">
          <div class="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-green-100">
            <Package class="h-5 w-5 text-green-600" />
          </div>
          <div>
            <p class="text-sm text-muted-foreground">农资总类</p>
            <p class="text-2xl font-bold">
              {{ totalItems }}
              <span class="text-sm font-normal text-muted-foreground">项</span>
            </p>
            <p class="mt-0.5 text-xs text-muted-foreground/60">= 各类别农资项数之和</p>
          </div>
        </div>
      </div>
      <!-- 统计-预算总额 -->
      <div class="rounded-lg border bg-card text-card-foreground shadow-sm">
        <div class="flex items-center gap-4 p-5">
          <div class="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-amber-100">
            <DollarSign class="h-5 w-5 text-amber-600" />
          </div>
          <div>
            <p class="text-sm text-muted-foreground">预算总额</p>
            <p class="text-2xl font-bold">
              {{ (totalBudget / 10000).toFixed(1) }}
              <span class="text-sm font-normal text-muted-foreground">万元</span>
            </p>
            <p class="mt-0.5 text-xs text-muted-foreground/60">= 各类别预算总额求和 ÷ 10000</p>
          </div>
        </div>
      </div>
      <!-- 统计-满足率 -->
      <div class="rounded-lg border bg-card text-card-foreground shadow-sm">
        <div class="flex items-center gap-4 p-5">
          <div class="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-blue-100">
            <ChartPie class="h-5 w-5 text-blue-600" />
          </div>
          <div>
            <p class="text-sm text-muted-foreground">满足率</p>
            <p class="text-2xl font-bold">{{ totalFulfillRate }}%</p>
            <p class="mt-0.5 text-xs text-muted-foreground/60">= 已满足项数 ÷ 农资总项数 × 100%</p>
          </div>
        </div>
      </div>
     
      <!-- 统计-已采购额 -->
      <div class="rounded-lg border bg-card text-card-foreground shadow-sm">
        <div class="flex items-center gap-4 p-5">
          <div class="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-emerald-100">
            <TrendingUp class="h-5 w-5 text-emerald-600" />
          </div>
          <div>
            <p class="text-sm text-muted-foreground">已采购额</p>
            <p class="text-2xl font-bold">
              {{ (totalPurchased / 10000).toFixed(1) }}
              <span class="text-sm font-normal text-muted-foreground">/ {{ (totalBudget / 10000).toFixed(1) }}万</span>
            </p>
            <p class="mt-0.5 text-xs text-muted-foreground/60">= 各类别已采购额求和 ÷ 10000</p>
          </div>
        </div>
      </div>
    </div>

    <!-- 分类汇总 -->
    <div class="rounded-lg border bg-card text-card-foreground shadow-sm">
      <div class="flex flex-col space-y-1.5 p-6">
        <h3 class="text-lg font-semibold leading-none tracking-tight">分类汇总</h3>
        <p class="text-sm text-muted-foreground">按维度统计采购进度和预算执行情况，点击卡片查看明细</p>
      </div>
      <!-- 选项卡 -->
      <div class="border-b px-6">
        <div class="flex gap-6">
          <button
            class="relative pb-3 text-sm font-medium transition-colors"
            :class="summaryTab === 'region' ? 'text-primary' : 'text-muted-foreground hover:text-foreground'"
            @click="summaryTab = 'region'"
          >
            按区域公司
            <span v-if="summaryTab === 'region'" class="absolute inset-x-0 -bottom-px h-0.5 bg-primary" />
          </button>
          <button
            class="relative pb-3 text-sm font-medium transition-colors"
            :class="summaryTab === 'category' ? 'text-primary' : 'text-muted-foreground hover:text-foreground'"
            @click="summaryTab = 'category'"
          >
            按农资大类
            <span v-if="summaryTab === 'category'" class="absolute inset-x-0 -bottom-px h-0.5 bg-primary" />
          </button>
        </div>
      </div>
      <div class="p-6 pt-4">
        <!-- 按区域公司汇总 -->
        <div v-if="summaryTab === 'region'" class="space-y-4">
          <div
            v-for="(region, idx) in regionSummaries"
            :key="region.region"
            class="cursor-pointer rounded-lg border p-4 transition-colors hover:border-primary/40 hover:bg-muted/20"
            @click="goSummaryDetail('region', region.region)"
          >
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-3">
                <span
                  class="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold"
                  :class="regionStyles[idx]?.badge"
                >{{ region.region }}</span>
                <span class="text-sm text-muted-foreground">{{ region.totalItems }} 项物资</span>
              </div>
              <div class="flex items-center gap-4">
                <span class="text-sm text-muted-foreground">农资总类 <span class="font-semibold text-foreground">{{ region.categoryCount }}</span> 项</span>
                <span class="text-sm font-medium">{{ region.fulfilledItems }}/{{ region.totalItems }} 已满足</span>
              </div>
            </div>
            <div class="mt-3 grid grid-cols-2 gap-4">
              <div>
                <div class="flex items-center justify-between text-xs text-muted-foreground">
                  <span>采购进度</span>
                  <span>{{ getFulfillRate(region) }}%</span>
                </div>
                <div class="mt-1 h-2 overflow-hidden rounded-full bg-muted">
                  <div
                    class="h-full rounded-full transition-all"
                    :class="regionStyles[idx]?.bar"
                    :style="{ width: getFulfillRate(region) + '%' }"
                  />
                </div>
                <p class="mt-1 text-xs text-muted-foreground/60">= 已满足项数 ÷ 物资总项数 × 100%</p>
              </div>
              <div>
                <div class="flex items-center justify-between text-xs text-muted-foreground">
                  <span>预算执行</span>
                  <span>{{ getCostRate(region) }}% · ¥{{ region.purchasedCost.toLocaleString() }}/{{ region.totalCost.toLocaleString() }}</span>
                </div>
                <div class="mt-1 h-2 overflow-hidden rounded-full bg-muted">
                  <div
                    class="h-full rounded-full transition-all"
                    :class="regionStyles[idx]?.bar"
                    :style="{ width: getCostRate(region) + '%' }"
                  />
                </div>
                <p class="mt-1 text-xs text-muted-foreground/60">= 已采购额 ÷ 预算总额 × 100%</p>
              </div>
            </div>
          </div>
        </div>
        <!-- 按农资大类汇总 -->
        <div v-if="summaryTab === 'category'" class="space-y-4">
          <div
            v-for="(cat, idx) in categorySummaries"
            :key="cat.category"
            class="cursor-pointer rounded-lg border p-4 transition-colors hover:border-primary/40 hover:bg-muted/20"
            @click="goSummaryDetail('category', cat.category)"
          >
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-3">
                <span
                  class="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold"
                  :class="categoryStyles[idx]?.badge"
                >{{ cat.category }}</span>
                <span class="text-sm text-muted-foreground">{{ cat.totalItems }} 项物资</span>
              </div>
              <span class="text-sm font-medium">{{ cat.fulfilledItems }}/{{ cat.totalItems }} 已满足</span>
            </div>
            <div class="mt-3 grid grid-cols-2 gap-4">
              <div>
                <div class="flex items-center justify-between text-xs text-muted-foreground">
                  <span>采购进度</span>
                  <span>{{ getFulfillRate(cat) }}%</span>
                </div>
                <div class="mt-1 h-2 overflow-hidden rounded-full bg-muted">
                  <div
                    class="h-full rounded-full bg-primary transition-all"
                    :style="{ width: getFulfillRate(cat) + '%' }"
                  />
                </div>
                <p class="mt-1 text-xs text-muted-foreground/60">= 已满足项数 ÷ 物资总项数 × 100%</p>
              </div>
              <div>
                <div class="flex items-center justify-between text-xs text-muted-foreground">
                  <span>预算执行</span>
                  <span>{{ getCostRate(cat) }}% · ¥{{ cat.purchasedCost.toLocaleString() }}/{{ cat.totalCost.toLocaleString() }}</span>
                </div>
                <div class="mt-1 h-2 overflow-hidden rounded-full bg-muted">
                  <div
                    class="h-full rounded-full bg-primary transition-all"
                    :style="{ width: getCostRate(cat) + '%' }"
                  />
                </div>
                <p class="mt-1 text-xs text-muted-foreground/60">= 已采购额 ÷ 预算总额 × 100%</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 采购紧急优先级 -->
    <div class="rounded-lg border bg-card text-card-foreground shadow-sm">
      <div class="flex flex-col space-y-1.5 p-6">
        <h3 class="text-lg font-semibold leading-none tracking-tight">采购紧急优先级</h3>
        <p class="text-sm text-muted-foreground">缺口农资按采购紧急优先级等级分类展示，排序依据：需求使用时间（同农资品类最早的需用时间） + 推送时间同农资品类最早的推送时间）；</p>
      </div>
      <div class="p-6 pt-0">
        <div class="grid grid-cols-1 gap-4 lg:grid-cols-3">
          <div
            v-for="priority in priorityGroups"
            :key="priority.level"
            class="rounded-lg border p-4"
            :class="priority.cardClass"
          >
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-2">
                <span
                  class="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold"
                  :class="priority.badgeClass"
                >{{ priority.level }}</span>
                <span class="text-sm text-muted-foreground">{{ priority.items.length }} 项</span>
              </div>
            </div>
            <p class="mt-1 text-xs text-muted-foreground/60">{{ priority.rule }}</p>
            <div class="mt-3 space-y-2">
              <div
                v-for="item in priority.items"
                :key="item.name"
                class="flex items-center justify-between rounded-md bg-white/60 px-3 py-2"
              >
                <div class="flex items-center gap-2">
                  <span
                    class="inline-flex items-center rounded px-1.5 py-0.5 text-xs font-medium"
                    :class="getCategoryBadgeClass(item.category)"
                  >{{ item.category }}</span>
                  <span class="text-sm font-medium">{{ item.name }}</span>
                </div>
                <div class="flex items-center gap-3 text-xs text-muted-foreground">
                  <span>需用: {{ item.useTime }}</span>
                  <span>推送: {{ item.pushTime }}</span>
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
import { useRouter } from 'vue-router'
import { Package, ChartPie, DollarSign, TrendingUp } from 'lucide-vue-next'

const router = useRouter()

// 分类汇总选项卡
const summaryTab = ref<'region' | 'category'>('region')

interface CategorySummary {
  category: string
  totalItems: number
  fulfilledItems: number
  totalCost: number
  purchasedCost: number
}

interface RegionSummary {
  region: string
  totalItems: number
  fulfilledItems: number
  totalCost: number
  purchasedCost: number
  categoryCount: number
}

interface PriorityItem {
  name: string
  category: string
  useTime: string
  pushTime: string
}

interface PriorityGroup {
  level: string
  rule: string
  cardClass: string
  badgeClass: string
  items: PriorityItem[]
}

// 区域公司汇总数据
const regionSummaries: RegionSummary[] = [
  { region: '哈尔滨公司', totalItems: 17, fulfilledItems: 8, totalCost: 83400, purchasedCost: 51200, categoryCount: 5 },
  { region: '沈阳公司', totalItems: 8, fulfilledItems: 4, totalCost: 56200, purchasedCost: 35800, categoryCount: 4 },
]

const regionStyles = [
  { badge: 'bg-blue-100 text-blue-700', bar: 'bg-blue-500' },
  { badge: 'bg-indigo-100 text-indigo-700', bar: 'bg-indigo-500' },
]

// 农资大类汇总数据
const categorySummaries: CategorySummary[] = [
  { category: '种子', totalItems: 4, fulfilledItems: 2, totalCost: 27900, purchasedCost: 20900 },
  { category: '肥料', totalItems: 4, fulfilledItems: 1, totalCost: 26400, purchasedCost: 14700 },
  { category: '农药', totalItems: 2, fulfilledItems: 1, totalCost: 4100, purchasedCost: 2500 },
  { category: '农具', totalItems: 1, fulfilledItems: 1, totalCost: 3600, purchasedCost: 3600 },
  { category: '其他', totalItems: 1, fulfilledItems: 0, totalCost: 16000, purchasedCost: 9600 },
]

const categoryStyles = [
  { badge: 'bg-green-100 text-green-700 hover:bg-green-100' },
  { badge: 'bg-amber-100 text-amber-700 hover:bg-amber-100' },
  { badge: 'bg-red-100 text-red-700 hover:bg-red-100' },
  { badge: 'bg-blue-100 text-blue-700 hover:bg-blue-100' },
  { badge: 'bg-gray-100 text-gray-700 hover:bg-gray-100' },
]

const priorityGroups: PriorityGroup[] = [
  {
    level: '高优先级',
    rule: '需求使用时间 < 7天 或 缺口量 > 库存50%',
    cardClass: 'border-red-200 bg-red-50/30',
    badgeClass: 'bg-red-100 text-red-700',
    items: [
      { name: '大豆种子', category: '种子', useTime: '2025-03-20', pushTime: '2025-03-10' },
      { name: '氯化钾', category: '肥料', useTime: '2025-03-18', pushTime: '2025-03-12' },
      { name: '磷酸二铵', category: '肥料', useTime: '2025-03-22', pushTime: '2025-03-14' },
    ],
  },
  {
    level: '中优先级',
    rule: '需求使用时间 7-30天',
    cardClass: 'border-amber-200 bg-amber-50/30',
    badgeClass: 'bg-amber-100 text-amber-700',
    items: [
      { name: '尿素', category: '肥料', useTime: '2025-04-05', pushTime: '2025-03-15' },
      { name: '吡虫啉', category: '农药', useTime: '2025-04-10', pushTime: '2025-03-18' },
      { name: '柴油', category: '其他', useTime: '2025-04-08', pushTime: '2025-03-20' },
      { name: '油菜种子', category: '种子', useTime: '2025-04-15', pushTime: '2025-03-22' },
    ],
  },
  {
    level: '低优先级',
    rule: '需求使用时间 > 30天',
    cardClass: 'border-gray-200',
    badgeClass: 'bg-gray-100 text-gray-700',
    items: [
      { name: '杂交水稻种', category: '种子', useTime: '2025-05-10', pushTime: '2025-03-25' },
      { name: '玉米杂交种', category: '种子', useTime: '2025-05-15', pushTime: '2025-03-25' },
      { name: '复合肥', category: '肥料', useTime: '2025-05-20', pushTime: '2025-03-28' },
      { name: '草甘膦', category: '农药', useTime: '2025-06-01', pushTime: '2025-04-01' },
      { name: '农膜', category: '其他', useTime: '2025-05-25', pushTime: '2025-04-02' },
    ],
  },
]

// 获取农资大类对应的徽章样式
function getCategoryBadgeClass(category: string): string {
  const map: Record<string, string> = {
    '种子': 'bg-green-100 text-green-700',
    '肥料': 'bg-amber-100 text-amber-700',
    '农药': 'bg-red-100 text-red-700',
    '农具': 'bg-blue-100 text-blue-700',
    '其他': 'bg-gray-100 text-gray-700',
  }
  return map[category] || 'bg-gray-100 text-gray-700'
}

// 总览统计（基于区域公司汇总）
const totalBudget = computed(() =>
  regionSummaries.reduce((sum, r) => sum + r.totalCost, 0)
)

const totalPurchased = computed(() =>
  regionSummaries.reduce((sum, r) => sum + r.purchasedCost, 0)
)

const totalItems = computed(() =>
  regionSummaries.reduce((s, r) => s + r.totalItems, 0)
)

const totalFulfilledItems = computed(() =>
  regionSummaries.reduce((s, r) => s + r.fulfilledItems, 0)
)

const totalFulfillRate = computed(() =>
  Math.round((totalFulfilledItems.value / totalItems.value) * 100)
)

function getFulfillRate(item: CategorySummary | RegionSummary): number {
  return Math.round((item.fulfilledItems / item.totalItems) * 100)
}

function getCostRate(item: CategorySummary | RegionSummary): number {
  return Math.round((item.purchasedCost / item.totalCost) * 100)
}

// 点击卡片跳转汇总详情列表
function goSummaryDetail(tab: string, key: string) {
  router.push(`/material-demand/summary/${tab}/${encodeURIComponent(key)}`)
}
</script>
