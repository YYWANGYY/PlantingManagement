<template>
  <div class="space-y-6">
    <!-- 页面标题 -->
    <div>
      <h1 class="text-2xl font-bold tracking-tight">种植结构表</h1>
      <p class="mt-1 text-sm text-muted-foreground">当前种植季各作物面积占比与结构分析</p>
    </div>

    <!-- 统计卡片 -->
    <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <!-- 统计-种植总面积 -->
      <div class="rounded-lg border bg-card text-card-foreground shadow-sm">
        <div class="flex items-center gap-4 p-5">
          <div class="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-green-100">
            <Table2 class="h-5 w-5 text-green-600" />
          </div>
          <div>
            <p class="text-sm text-muted-foreground">种植总面积</p>
            <p class="text-2xl font-bold">{{ totalArea }} <span class="text-sm font-normal text-muted-foreground">亩</span></p>
          </div>
        </div>
      </div>
      <!-- 统计-作物种类 -->
      <div class="rounded-lg border bg-card text-card-foreground shadow-sm">
        <div class="flex items-center gap-4 p-5">
          <div class="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-amber-100">
            <PieChart class="h-5 w-5 text-amber-600" />
          </div>
          <div>
            <p class="text-sm text-muted-foreground">作物种类</p>
            <p class="text-2xl font-bold">{{ cropTypes }} <span class="text-sm font-normal text-muted-foreground">种</span></p>
          </div>
        </div>
      </div>
      <!-- 统计-主要作物占比 -->
      <div class="rounded-lg border bg-card text-card-foreground shadow-sm">
        <div class="flex items-center gap-4 p-5">
          <div class="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-blue-100">
            <Layers class="h-5 w-5 text-blue-600" />
          </div>
          <div>
            <p class="text-sm text-muted-foreground">主要作物占比</p>
            <p class="text-2xl font-bold">{{ mainCropPct }}%</p>
          </div>
        </div>
      </div>
      <!-- 统计-休耕比例 -->
      <div class="rounded-lg border bg-card text-card-foreground shadow-sm">
        <div class="flex items-center gap-4 p-5">
          <div class="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-emerald-100">
            <Percent class="h-5 w-5 text-emerald-600" />
          </div>
          <div>
            <p class="text-sm text-muted-foreground">休耕比例</p>
            <p class="text-2xl font-bold">{{ fallowPct }}%</p>
          </div>
        </div>
      </div>
    </div>

    <!-- 种植结构分布（面积占比可视化） -->
    <div class="rounded-lg border bg-card text-card-foreground shadow-sm">
      <div class="flex flex-col space-y-1.5 p-6">
        <h3 class="text-lg font-semibold leading-none tracking-tight">种植结构分布</h3>
        <p class="text-sm text-muted-foreground">各作物面积占比一览</p>
      </div>
      <div class="p-6 pt-0">
        <div class="space-y-3">
          <!-- 分布-水稻 -->
          <div class="flex items-center gap-4">
            <div class="w-16 text-sm font-medium">水稻</div>
            <div class="h-4 flex-1 overflow-hidden rounded-full bg-muted">
              <div class="h-full rounded-full bg-primary transition-all" :style="{ width: '26.3%' }" />
            </div>
            <div class="w-20 text-right text-sm tabular-nums">250亩 (26.3%)</div>
          </div>
          <!-- 分布-小麦 -->
          <div class="flex items-center gap-4">
            <div class="w-16 text-sm font-medium">小麦</div>
            <div class="h-4 flex-1 overflow-hidden rounded-full bg-muted">
              <div class="h-full rounded-full bg-primary transition-all" :style="{ width: '18.4%' }" />
            </div>
            <div class="w-20 text-right text-sm tabular-nums">175亩 (18.4%)</div>
          </div>
          <!-- 分布-棉花 -->
          <div class="flex items-center gap-4">
            <div class="w-16 text-sm font-medium">棉花</div>
            <div class="h-4 flex-1 overflow-hidden rounded-full bg-muted">
              <div class="h-full rounded-full bg-primary transition-all" :style="{ width: '11.6%' }" />
            </div>
            <div class="w-20 text-right text-sm tabular-nums">110亩 (11.6%)</div>
          </div>
          <!-- 分布-玉米 -->
          <div class="flex items-center gap-4">
            <div class="w-16 text-sm font-medium">玉米</div>
            <div class="h-4 flex-1 overflow-hidden rounded-full bg-muted">
              <div class="h-full rounded-full bg-primary transition-all" :style="{ width: '10.0%' }" />
            </div>
            <div class="w-20 text-right text-sm tabular-nums">95亩 (10.0%)</div>
          </div>
          <!-- 分布-茶叶 -->
          <div class="flex items-center gap-4">
            <div class="w-16 text-sm font-medium">茶叶</div>
            <div class="h-4 flex-1 overflow-hidden rounded-full bg-muted">
              <div class="h-full rounded-full bg-primary transition-all" :style="{ width: '8.4%' }" />
            </div>
            <div class="w-20 text-right text-sm tabular-nums">80亩 (8.4%)</div>
          </div>
          <!-- 分布-休耕 -->
          <div class="flex items-center gap-4">
            <div class="w-16 text-sm font-medium">休耕</div>
            <div class="h-4 flex-1 overflow-hidden rounded-full bg-muted">
              <div class="h-full rounded-full bg-muted-foreground/40 transition-all" :style="{ width: '7.9%' }" />
            </div>
            <div class="w-20 text-right text-sm tabular-nums">75亩 (7.9%)</div>
          </div>
          <!-- 分布-油菜 -->
          <div class="flex items-center gap-4">
            <div class="w-16 text-sm font-medium">油菜</div>
            <div class="h-4 flex-1 overflow-hidden rounded-full bg-muted">
              <div class="h-full rounded-full bg-primary transition-all" :style="{ width: '7.4%' }" />
            </div>
            <div class="w-20 text-right text-sm tabular-nums">70亩 (7.4%)</div>
          </div>
          <!-- 分布-大豆 -->
          <div class="flex items-center gap-4">
            <div class="w-16 text-sm font-medium">大豆</div>
            <div class="h-4 flex-1 overflow-hidden rounded-full bg-muted">
              <div class="h-full rounded-full bg-primary transition-all" :style="{ width: '6.3%' }" />
            </div>
            <div class="w-20 text-right text-sm tabular-nums">60亩 (6.3%)</div>
          </div>
          <!-- 分布-花生 -->
          <div class="flex items-center gap-4">
            <div class="w-16 text-sm font-medium">花生</div>
            <div class="h-4 flex-1 overflow-hidden rounded-full bg-muted">
              <div class="h-full rounded-full bg-primary transition-all" :style="{ width: '5.8%' }" />
            </div>
            <div class="w-20 text-right text-sm tabular-nums">55亩 (5.8%)</div>
          </div>
          <!-- 分布-红薯 -->
          <div class="flex items-center gap-4">
            <div class="w-16 text-sm font-medium">红薯</div>
            <div class="h-4 flex-1 overflow-hidden rounded-full bg-muted">
              <div class="h-full rounded-full bg-primary transition-all" :style="{ width: '4.7%' }" />
            </div>
            <div class="w-20 text-right text-sm tabular-nums">45亩 (4.7%)</div>
          </div>
        </div>
      </div>
    </div>

    <!-- 种植结构明细 -->
    <div class="rounded-lg border bg-card text-card-foreground shadow-sm">
      <div class="flex flex-col space-y-1.5 p-6">
        <h3 class="text-lg font-semibold leading-none tracking-tight">种植结构明细</h3>
        <p class="text-sm text-muted-foreground">各作物种植面积、地块分布及同比变化</p>
      </div>
      <div class="p-6 pt-0">
        <div class="relative w-full overflow-auto">
          <table class="w-full caption-bottom text-sm">
            <thead class="[&_tr]:border-b">
              <tr class="border-b transition-colors hover:bg-muted/50">
                <th class="h-10 px-2 text-left align-middle font-medium text-muted-foreground">作物</th>
                <th class="h-10 px-2 text-left align-middle font-medium text-muted-foreground">种植季节</th>
                <th class="h-10 px-2 text-left align-middle font-medium text-muted-foreground">地块</th>
                <th class="h-10 px-2 text-right align-middle font-medium text-muted-foreground">面积(亩)</th>
                <th class="h-10 px-2 text-right align-middle font-medium text-muted-foreground">占比</th>
                <th class="h-10 px-2 text-left align-middle font-medium text-muted-foreground">同比变化</th>
              </tr>
            </thead>
            <tbody class="[&_tr:last-child]:border-0">
              <!-- 列表-水稻 -->
              <tr class="border-b transition-colors hover:bg-muted/50">
                <td class="p-2 align-middle font-medium">水稻</td>
                <td class="p-2 align-middle">
                  <span class="inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium bg-green-100 text-green-700 hover:bg-green-100">春季</span>
                </td>
                <td class="p-2 align-middle text-xs text-muted-foreground">A1区/C1区</td>
                <td class="p-2 align-middle text-right">250</td>
                <td class="p-2 align-middle text-right tabular-nums">26.3%</td>
                <td class="p-2 align-middle">
                  <span class="text-xs font-medium text-green-600">+5.2%</span>
                </td>
              </tr>
              <!-- 列表-小麦 -->
              <tr class="border-b transition-colors hover:bg-muted/50">
                <td class="p-2 align-middle font-medium">小麦</td>
                <td class="p-2 align-middle">
                  <span class="inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium bg-sky-100 text-sky-700 hover:bg-sky-100">冬季</span>
                </td>
                <td class="p-2 align-middle text-xs text-muted-foreground">A2区/D2区</td>
                <td class="p-2 align-middle text-right">175</td>
                <td class="p-2 align-middle text-right tabular-nums">18.4%</td>
                <td class="p-2 align-middle">
                  <span class="text-xs font-medium text-red-600">-2.1%</span>
                </td>
              </tr>
              <!-- 列表-玉米 -->
              <tr class="border-b transition-colors hover:bg-muted/50">
                <td class="p-2 align-middle font-medium">玉米</td>
                <td class="p-2 align-middle">
                  <span class="inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium bg-amber-100 text-amber-700 hover:bg-amber-100">夏季</span>
                </td>
                <td class="p-2 align-middle text-xs text-muted-foreground">A3区</td>
                <td class="p-2 align-middle text-right">95</td>
                <td class="p-2 align-middle text-right tabular-nums">10.0%</td>
                <td class="p-2 align-middle">
                  <span class="text-xs font-medium text-gray-500">0%</span>
                </td>
              </tr>
              <!-- 列表-棉花 -->
              <tr class="border-b transition-colors hover:bg-muted/50">
                <td class="p-2 align-middle font-medium">棉花</td>
                <td class="p-2 align-middle">
                  <span class="inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium bg-green-100 text-green-700 hover:bg-green-100">春季</span>
                </td>
                <td class="p-2 align-middle text-xs text-muted-foreground">B2区</td>
                <td class="p-2 align-middle text-right">110</td>
                <td class="p-2 align-middle text-right tabular-nums">11.6%</td>
                <td class="p-2 align-middle">
                  <span class="text-xs font-medium text-green-600">+8.3%</span>
                </td>
              </tr>
              <!-- 列表-大豆 -->
              <tr class="border-b transition-colors hover:bg-muted/50">
                <td class="p-2 align-middle font-medium">大豆</td>
                <td class="p-2 align-middle">
                  <span class="inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium bg-green-100 text-green-700 hover:bg-green-100">春季</span>
                </td>
                <td class="p-2 align-middle text-xs text-muted-foreground">B1区</td>
                <td class="p-2 align-middle text-right">60</td>
                <td class="p-2 align-middle text-right tabular-nums">6.3%</td>
                <td class="p-2 align-middle">
                  <span class="text-xs font-medium text-green-600">+15.0%</span>
                </td>
              </tr>
              <!-- 列表-油菜 -->
              <tr class="border-b transition-colors hover:bg-muted/50">
                <td class="p-2 align-middle font-medium">油菜</td>
                <td class="p-2 align-middle">
                  <span class="inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium bg-orange-100 text-orange-700 hover:bg-orange-100">秋季</span>
                </td>
                <td class="p-2 align-middle text-xs text-muted-foreground">C2区</td>
                <td class="p-2 align-middle text-right">70</td>
                <td class="p-2 align-middle text-right tabular-nums">7.4%</td>
                <td class="p-2 align-middle">
                  <span class="text-xs font-medium text-red-600">-5.0%</span>
                </td>
              </tr>
              <!-- 列表-花生 -->
              <tr class="border-b transition-colors hover:bg-muted/50">
                <td class="p-2 align-middle font-medium">花生</td>
                <td class="p-2 align-middle">
                  <span class="inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium bg-green-100 text-green-700 hover:bg-green-100">春季</span>
                </td>
                <td class="p-2 align-middle text-xs text-muted-foreground">C3区</td>
                <td class="p-2 align-middle text-right">55</td>
                <td class="p-2 align-middle text-right tabular-nums">5.8%</td>
                <td class="p-2 align-middle">
                  <span class="text-xs font-medium text-green-600">+10.0%</span>
                </td>
              </tr>
              <!-- 列表-红薯 -->
              <tr class="border-b transition-colors hover:bg-muted/50">
                <td class="p-2 align-middle font-medium">红薯</td>
                <td class="p-2 align-middle">
                  <span class="inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium bg-green-100 text-green-700 hover:bg-green-100">春季</span>
                </td>
                <td class="p-2 align-middle text-xs text-muted-foreground">D1区</td>
                <td class="p-2 align-middle text-right">45</td>
                <td class="p-2 align-middle text-right tabular-nums">4.7%</td>
                <td class="p-2 align-middle">
                  <span class="text-xs font-medium text-gray-500">0%</span>
                </td>
              </tr>
              <!-- 列表-茶叶 -->
              <tr class="border-b transition-colors hover:bg-muted/50">
                <td class="p-2 align-middle font-medium">茶叶</td>
                <td class="p-2 align-middle">
                  <span class="inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium bg-purple-100 text-purple-700 hover:bg-purple-100">全年</span>
                </td>
                <td class="p-2 align-middle text-xs text-muted-foreground">D3区</td>
                <td class="p-2 align-middle text-right">80</td>
                <td class="p-2 align-middle text-right tabular-nums">8.4%</td>
                <td class="p-2 align-middle">
                  <span class="text-xs font-medium text-green-600">+3.1%</span>
                </td>
              </tr>
              <!-- 列表-休耕 -->
              <tr class="border-b transition-colors hover:bg-muted/50">
                <td class="p-2 align-middle font-medium">休耕</td>
                <td class="p-2 align-middle">
                  <span class="inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium bg-gray-100 text-gray-500 hover:bg-gray-100">-</span>
                </td>
                <td class="p-2 align-middle text-xs text-muted-foreground">B3区</td>
                <td class="p-2 align-middle text-right">75</td>
                <td class="p-2 align-middle text-right tabular-nums">7.9%</td>
                <td class="p-2 align-middle">
                  <span class="text-xs font-medium text-red-600">-12.0%</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { Table2, PieChart, Layers, Percent } from 'lucide-vue-next'

interface CropStructure {
  crop: string
  area: number
  percentage: number
  plots: string
  season: string
  comparedToLastYear: number
}

const cropStructures: CropStructure[] = [
  { crop: '水稻', area: 250, percentage: 26.3, plots: 'A1区/C1区', season: '春季', comparedToLastYear: 5.2 },
  { crop: '小麦', area: 175, percentage: 18.4, plots: 'A2区/D2区', season: '冬季', comparedToLastYear: -2.1 },
  { crop: '玉米', area: 95, percentage: 10.0, plots: 'A3区', season: '夏季', comparedToLastYear: 0 },
  { crop: '棉花', area: 110, percentage: 11.6, plots: 'B2区', season: '春季', comparedToLastYear: 8.3 },
  { crop: '大豆', area: 60, percentage: 6.3, plots: 'B1区', season: '春季', comparedToLastYear: 15.0 },
  { crop: '油菜', area: 70, percentage: 7.4, plots: 'C2区', season: '秋季', comparedToLastYear: -5.0 },
  { crop: '花生', area: 55, percentage: 5.8, plots: 'C3区', season: '春季', comparedToLastYear: 10.0 },
  { crop: '红薯', area: 45, percentage: 4.7, plots: 'D1区', season: '春季', comparedToLastYear: 0 },
  { crop: '茶叶', area: 80, percentage: 8.4, plots: 'D3区', season: '全年', comparedToLastYear: 3.1 },
  { crop: '休耕', area: 75, percentage: 7.9, plots: 'B3区', season: '-', comparedToLastYear: -12.0 },
]

const totalArea = computed(() => cropStructures.reduce((sum, c) => sum + c.area, 0))

const cropTypes = computed(() => cropStructures.filter((c) => c.crop !== '休耕').length)

const mainCropPct = computed(() => {
  const total = cropStructures.reduce((sum, c) => sum + c.area, 0)
  const mainArea = cropStructures.filter((c) => c.percentage >= 10).reduce((s, c) => s + c.area, 0)
  return Math.round((mainArea / total) * 100)
})

const fallowPct = computed(() => cropStructures.find((c) => c.crop === '休耕')?.percentage ?? 0)
</script>
