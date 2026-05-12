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
            <p class="text-sm text-muted-foreground">物资总类</p>
            <p class="text-2xl font-bold">
              {{ totalItems }}
              <span class="text-sm font-normal text-muted-foreground">项</span>
            </p>
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
          </div>
        </div>
      </div>
    </div>

    <!-- 按类别汇总 -->
    <div class="rounded-lg border bg-card text-card-foreground shadow-sm">
      <div class="flex flex-col space-y-1.5 p-6">
        <h3 class="text-lg font-semibold leading-none tracking-tight">分类汇总</h3>
        <p class="text-sm text-muted-foreground">按物资类别统计采购进度和预算执行情况</p>
      </div>
      <div class="p-6 pt-0">
        <div class="space-y-4">
          <!-- 列表-种子 -->
          <div class="rounded-lg border p-4">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-3">
                <span class="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold bg-green-100 text-green-700 hover:bg-green-100">种子</span>
                <span class="text-sm text-muted-foreground">{{ categorySummaries[0].totalItems }} 项物资</span>
              </div>
              <span class="text-sm font-medium">{{ categorySummaries[0].fulfilledItems }}/{{ categorySummaries[0].totalItems }} 已满足</span>
            </div>
            <div class="mt-3 grid grid-cols-2 gap-4">
              <div>
                <div class="flex items-center justify-between text-xs text-muted-foreground">
                  <span>采购进度</span>
                  <span>{{ getFulfillRate(categorySummaries[0]) }}%</span>
                </div>
                <div class="mt-1 flex items-center gap-3">
                  <div class="h-2 flex-1 overflow-hidden rounded-full bg-muted">
                    <div
                      class="h-full rounded-full bg-primary transition-all"
                      :style="{ width: getFulfillRate(categorySummaries[0]) + '%' }"
                    />
                  </div>
                </div>
              </div>
              <div>
                <div class="flex items-center justify-between text-xs text-muted-foreground">
                  <span>预算执行</span>
                  <span>{{ getCostRate(categorySummaries[0]) }}% · ¥{{ categorySummaries[0].purchasedCost.toLocaleString() }}/{{ categorySummaries[0].totalCost.toLocaleString() }}</span>
                </div>
                <div class="mt-1 flex items-center gap-3">
                  <div class="h-2 flex-1 overflow-hidden rounded-full bg-muted">
                    <div
                      class="h-full rounded-full bg-primary transition-all"
                      :style="{ width: getCostRate(categorySummaries[0]) + '%' }"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <!-- 列表-肥料 -->
          <div class="rounded-lg border p-4">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-3">
                <span class="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold bg-amber-100 text-amber-700 hover:bg-amber-100">肥料</span>
                <span class="text-sm text-muted-foreground">{{ categorySummaries[1].totalItems }} 项物资</span>
              </div>
              <span class="text-sm font-medium">{{ categorySummaries[1].fulfilledItems }}/{{ categorySummaries[1].totalItems }} 已满足</span>
            </div>
            <div class="mt-3 grid grid-cols-2 gap-4">
              <div>
                <div class="flex items-center justify-between text-xs text-muted-foreground">
                  <span>采购进度</span>
                  <span>{{ getFulfillRate(categorySummaries[1]) }}%</span>
                </div>
                <div class="mt-1 flex items-center gap-3">
                  <div class="h-2 flex-1 overflow-hidden rounded-full bg-muted">
                    <div
                      class="h-full rounded-full bg-primary transition-all"
                      :style="{ width: getFulfillRate(categorySummaries[1]) + '%' }"
                    />
                  </div>
                </div>
              </div>
              <div>
                <div class="flex items-center justify-between text-xs text-muted-foreground">
                  <span>预算执行</span>
                  <span>{{ getCostRate(categorySummaries[1]) }}% · ¥{{ categorySummaries[1].purchasedCost.toLocaleString() }}/{{ categorySummaries[1].totalCost.toLocaleString() }}</span>
                </div>
                <div class="mt-1 flex items-center gap-3">
                  <div class="h-2 flex-1 overflow-hidden rounded-full bg-muted">
                    <div
                      class="h-full rounded-full bg-primary transition-all"
                      :style="{ width: getCostRate(categorySummaries[1]) + '%' }"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <!-- 列表-农药 -->
          <div class="rounded-lg border p-4">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-3">
                <span class="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold bg-red-100 text-red-700 hover:bg-red-100">农药</span>
                <span class="text-sm text-muted-foreground">{{ categorySummaries[2].totalItems }} 项物资</span>
              </div>
              <span class="text-sm font-medium">{{ categorySummaries[2].fulfilledItems }}/{{ categorySummaries[2].totalItems }} 已满足</span>
            </div>
            <div class="mt-3 grid grid-cols-2 gap-4">
              <div>
                <div class="flex items-center justify-between text-xs text-muted-foreground">
                  <span>采购进度</span>
                  <span>{{ getFulfillRate(categorySummaries[2]) }}%</span>
                </div>
                <div class="mt-1 flex items-center gap-3">
                  <div class="h-2 flex-1 overflow-hidden rounded-full bg-muted">
                    <div
                      class="h-full rounded-full bg-primary transition-all"
                      :style="{ width: getFulfillRate(categorySummaries[2]) + '%' }"
                    />
                  </div>
                </div>
              </div>
              <div>
                <div class="flex items-center justify-between text-xs text-muted-foreground">
                  <span>预算执行</span>
                  <span>{{ getCostRate(categorySummaries[2]) }}% · ¥{{ categorySummaries[2].purchasedCost.toLocaleString() }}/{{ categorySummaries[2].totalCost.toLocaleString() }}</span>
                </div>
                <div class="mt-1 flex items-center gap-3">
                  <div class="h-2 flex-1 overflow-hidden rounded-full bg-muted">
                    <div
                      class="h-full rounded-full bg-primary transition-all"
                      :style="{ width: getCostRate(categorySummaries[2]) + '%' }"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <!-- 列表-农具 -->
          <div class="rounded-lg border p-4">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-3">
                <span class="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold bg-blue-100 text-blue-700 hover:bg-blue-100">农具</span>
                <span class="text-sm text-muted-foreground">{{ categorySummaries[3].totalItems }} 项物资</span>
              </div>
              <span class="text-sm font-medium">{{ categorySummaries[3].fulfilledItems }}/{{ categorySummaries[3].totalItems }} 已满足</span>
            </div>
            <div class="mt-3 grid grid-cols-2 gap-4">
              <div>
                <div class="flex items-center justify-between text-xs text-muted-foreground">
                  <span>采购进度</span>
                  <span>{{ getFulfillRate(categorySummaries[3]) }}%</span>
                </div>
                <div class="mt-1 flex items-center gap-3">
                  <div class="h-2 flex-1 overflow-hidden rounded-full bg-muted">
                    <div
                      class="h-full rounded-full bg-primary transition-all"
                      :style="{ width: getFulfillRate(categorySummaries[3]) + '%' }"
                    />
                  </div>
                </div>
              </div>
              <div>
                <div class="flex items-center justify-between text-xs text-muted-foreground">
                  <span>预算执行</span>
                  <span>{{ getCostRate(categorySummaries[3]) }}% · ¥{{ categorySummaries[3].purchasedCost.toLocaleString() }}/{{ categorySummaries[3].totalCost.toLocaleString() }}</span>
                </div>
                <div class="mt-1 flex items-center gap-3">
                  <div class="h-2 flex-1 overflow-hidden rounded-full bg-muted">
                    <div
                      class="h-full rounded-full bg-primary transition-all"
                      :style="{ width: getCostRate(categorySummaries[3]) + '%' }"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <!-- 列表-其他 -->
          <div class="rounded-lg border p-4">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-3">
                <span class="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold bg-gray-100 text-gray-700 hover:bg-gray-100">其他</span>
                <span class="text-sm text-muted-foreground">{{ categorySummaries[4].totalItems }} 项物资</span>
              </div>
              <span class="text-sm font-medium">{{ categorySummaries[4].fulfilledItems }}/{{ categorySummaries[4].totalItems }} 已满足</span>
            </div>
            <div class="mt-3 grid grid-cols-2 gap-4">
              <div>
                <div class="flex items-center justify-between text-xs text-muted-foreground">
                  <span>采购进度</span>
                  <span>{{ getFulfillRate(categorySummaries[4]) }}%</span>
                </div>
                <div class="mt-1 flex items-center gap-3">
                  <div class="h-2 flex-1 overflow-hidden rounded-full bg-muted">
                    <div
                      class="h-full rounded-full bg-primary transition-all"
                      :style="{ width: getFulfillRate(categorySummaries[4]) + '%' }"
                    />
                  </div>
                </div>
              </div>
              <div>
                <div class="flex items-center justify-between text-xs text-muted-foreground">
                  <span>预算执行</span>
                  <span>{{ getCostRate(categorySummaries[4]) }}% · ¥{{ categorySummaries[4].purchasedCost.toLocaleString() }}/{{ categorySummaries[4].totalCost.toLocaleString() }}</span>
                </div>
                <div class="mt-1 flex items-center gap-3">
                  <div class="h-2 flex-1 overflow-hidden rounded-full bg-muted">
                    <div
                      class="h-full rounded-full bg-primary transition-all"
                      :style="{ width: getCostRate(categorySummaries[4]) + '%' }"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 按紧急度汇总 -->
    <div class="rounded-lg border bg-card text-card-foreground shadow-sm">
      <div class="flex flex-col space-y-1.5 p-6">
        <h3 class="text-lg font-semibold leading-none tracking-tight">紧急度分布</h3>
        <p class="text-sm text-muted-foreground">按采购紧急程度分类的物资统计</p>
      </div>
      <div class="p-6 pt-0">
        <div class="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <!-- 紧急度-紧急 -->
          <div class="rounded-lg border border-red-200 bg-red-50/30 p-4">
            <div class="flex items-center justify-between">
              <span class="text-sm font-semibold text-red-700">紧急</span>
              <span class="text-2xl font-bold">{{ urgencySummaries[0].count }}</span>
            </div>
            <div class="mt-2 space-y-1">
              <p class="text-xs text-muted-foreground">· 大豆种子</p>
              <p class="text-xs text-muted-foreground">· 氯化钾</p>
              <p class="text-xs text-muted-foreground">· 磷酸二铵</p>
            </div>
          </div>
          <!-- 紧急度-一般 -->
          <div class="rounded-lg border border-amber-200 bg-amber-50/30 p-4">
            <div class="flex items-center justify-between">
              <span class="text-sm font-semibold text-amber-700">一般</span>
              <span class="text-2xl font-bold">{{ urgencySummaries[1].count }}</span>
            </div>
            <div class="mt-2 space-y-1">
              <p class="text-xs text-muted-foreground">· 尿素</p>
              <p class="text-xs text-muted-foreground">· 吡虫啉</p>
              <p class="text-xs text-muted-foreground">· 柴油</p>
              <p class="text-xs text-muted-foreground">· 油菜种子</p>
            </div>
          </div>
          <!-- 紧急度-低优先 -->
          <div class="rounded-lg border border-gray-200 p-4">
            <div class="flex items-center justify-between">
              <span class="text-sm font-semibold text-gray-600">低优先</span>
              <span class="text-2xl font-bold">{{ urgencySummaries[2].count }}</span>
            </div>
            <div class="mt-2 space-y-1">
              <p class="text-xs text-muted-foreground">· 杂交水稻种</p>
              <p class="text-xs text-muted-foreground">· 玉米杂交种</p>
              <p class="text-xs text-muted-foreground">· 复合肥</p>
              <p class="text-xs text-muted-foreground">· 草甘膦</p>
              <p class="text-xs text-muted-foreground">· 农膜</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { Package, ChartPie, DollarSign, TrendingUp } from 'lucide-vue-next'

interface CategorySummary {
  category: string
  totalItems: number
  fulfilledItems: number
  totalCost: number
  purchasedCost: number
}

interface UrgencySummary {
  level: string
  count: number
  items: string[]
}

const categorySummaries: CategorySummary[] = [
  { category: '种子', totalItems: 4, fulfilledItems: 2, totalCost: 27900, purchasedCost: 20900 },
  { category: '肥料', totalItems: 4, fulfilledItems: 1, totalCost: 26400, purchasedCost: 14700 },
  { category: '农药', totalItems: 2, fulfilledItems: 1, totalCost: 4100, purchasedCost: 2500 },
  { category: '农具', totalItems: 1, fulfilledItems: 1, totalCost: 3600, purchasedCost: 3600 },
  { category: '其他', totalItems: 1, fulfilledItems: 0, totalCost: 16000, purchasedCost: 9600 },
]

const urgencySummaries: UrgencySummary[] = [
  { level: '紧急', count: 3, items: ['大豆种子', '氯化钾', '磷酸二铵'] },
  { level: '一般', count: 4, items: ['尿素', '吡虫啉', '柴油', '油菜种子'] },
  { level: '低优先', count: 5, items: ['杂交水稻种', '玉米杂交种', '复合肥', '草甘膦', '农膜'] },
]

const totalBudget = computed(() =>
  categorySummaries.reduce((sum, c) => sum + c.totalCost, 0)
)

const totalPurchased = computed(() =>
  categorySummaries.reduce((sum, c) => sum + c.purchasedCost, 0)
)

const totalItems = computed(() =>
  categorySummaries.reduce((s, c) => s + c.totalItems, 0)
)

const totalFulfilledItems = computed(() =>
  categorySummaries.reduce((s, c) => s + c.fulfilledItems, 0)
)

const totalFulfillRate = computed(() =>
  Math.round((totalFulfilledItems.value / totalItems.value) * 100)
)

function getFulfillRate(cat: CategorySummary): number {
  return Math.round((cat.fulfilledItems / cat.totalItems) * 100)
}

function getCostRate(cat: CategorySummary): number {
  return Math.round((cat.purchasedCost / cat.totalCost) * 100)
}
</script>
