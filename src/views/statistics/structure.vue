<template>
  <div class="space-y-6">
    <!-- 页面标题 -->
    <div>
      <h1 class="text-2xl font-bold tracking-tight">种植结构表</h1>
      <p class="mt-1 text-sm text-muted-foreground">当前种植季各作物面积占比与结构分析</p>
    </div>

    <!-- 查询条件 -->
    <div class="rounded-lg border bg-card p-4 shadow-sm">
      <div class="flex flex-wrap items-end gap-4">
        <!-- 年度 -->
        <div class="flex flex-col gap-1.5">
          <label class="text-sm font-medium text-muted-foreground">年度</label>
          <select
            v-model="filters.year"
            class="h-9 w-36 rounded-md border bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
          >
            <option value="">全部</option>
            <option v-for="y in yearOptions" :key="y" :value="y">{{ y }}</option>
          </select>
        </div>

        <!-- 所属单位 -->
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

        <!-- 种植作物 -->
        <div class="flex flex-col gap-1.5">
          <label class="text-sm font-medium text-muted-foreground">种植作物</label>
          <select
            v-model="filters.cropCategory"
            class="h-9 w-32 rounded-md border bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
          >
            <option value="">全部</option>
            <option v-for="c in cropCategories" :key="c" :value="c">{{ c }}</option>
          </select>
        </div>

        <!-- 作物品种 -->
        <div class="flex flex-col gap-1.5">
          <label class="text-sm font-medium text-muted-foreground">作物品种</label>
          <select
            v-model="filters.cropVariety"
            class="h-9 w-32 rounded-md border bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
            :disabled="!filters.cropCategory"
          >
            <option value="">全部</option>
            <option v-for="v in cropVarietyOptions" :key="v" :value="v">{{ v }}</option>
          </select>
        </div>

        <!-- 操作按钮 -->
        <div class="flex gap-2">
          <button
            class="inline-flex items-center justify-center gap-1.5 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            @click="handleQuery"
          >
            <Search class="h-4 w-4" />
            查询
          </button>
          <button
            class="inline-flex items-center justify-center gap-1.5 rounded-md border px-4 py-2 text-sm font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            @click="handleReset"
          >
            <RotateCcw class="h-4 w-4" />
            重置
          </button>
        </div>
      </div>
    </div>

    <!-- 种植结构统计表 -->
    <div class="rounded-lg border bg-card text-card-foreground shadow-sm">
      <!-- 表头标题行 -->
      <div class="flex items-center justify-between border-b px-6 py-4">
        <div>
          <h3 class="text-lg font-semibold leading-none tracking-tight">表1-1：种植结构统计表</h3>
        </div>
        <div class="text-sm text-muted-foreground">单位：亩</div>
      </div>

      <!-- 统计表格 -->
      <div class="p-6 pt-0">
        <div class="relative w-full overflow-auto">
          <table class="w-full caption-bottom text-sm">
            <thead>
              <tr class="border-b bg-muted/50">
                <th class="h-10 whitespace-nowrap px-3 text-left align-middle font-medium text-muted-foreground">区域公司</th>
                <th class="h-10 whitespace-nowrap px-3 text-left align-middle font-medium text-muted-foreground">农场/园区</th>
                <th class="h-10 whitespace-nowrap px-3 text-left align-middle font-medium text-muted-foreground">分场/分园</th>
                <th class="h-10 whitespace-nowrap px-3 text-left align-middle font-medium text-muted-foreground">作物大类</th>
                <th class="h-10 whitespace-nowrap px-3 text-left align-middle font-medium text-muted-foreground">作物品类</th>
                <th class="h-10 whitespace-nowrap px-3 text-right align-middle font-medium text-muted-foreground">计划种植面积</th>
                <th class="h-10 whitespace-nowrap px-3 text-right align-middle font-medium text-muted-foreground">实际种植面积</th>
                <th class="h-10 whitespace-nowrap px-3 text-right align-middle font-medium text-muted-foreground">占比（%）</th>
                <th class="h-10 whitespace-nowrap px-3 text-right align-middle font-medium text-muted-foreground">同比增减（亩）</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="(row, idx) in filteredData"
                :key="idx"
                class="border-b transition-colors hover:bg-muted/50"
              >
                <td class="whitespace-nowrap px-3 py-2.5 align-middle">{{ row.regionCompany }}</td>
                <td class="whitespace-nowrap px-3 py-2.5 align-middle">{{ row.farm }}</td>
                <td class="whitespace-nowrap px-3 py-2.5 align-middle">{{ row.subFarm }}</td>
                <td class="whitespace-nowrap px-3 py-2.5 align-middle font-medium">{{ row.cropCategory }}</td>
                <td class="whitespace-nowrap px-3 py-2.5 align-middle">{{ row.cropVariety }}</td>
                <td class="whitespace-nowrap px-3 py-2.5 text-right align-middle tabular-nums">{{ row.plannedArea.toLocaleString() }}</td>
                <td class="whitespace-nowrap px-3 py-2.5 text-right align-middle tabular-nums">{{ row.actualArea.toLocaleString() }}</td>
                <td class="whitespace-nowrap px-3 py-2.5 text-right align-middle tabular-nums">{{ row.percentage.toFixed(2) }}%</td>
                <td class="whitespace-nowrap px-3 py-2.5 text-right align-middle tabular-nums">
                  <span
                    :class="row.yoyChange > 0 ? 'text-green-600' : row.yoyChange < 0 ? 'text-red-600' : 'text-muted-foreground'"
                    class="font-medium"
                  >
                    {{ row.yoyChange > 0 ? '+' : '' }}{{ row.yoyChange.toLocaleString() }}
                  </span>
                </td>
              </tr>
              <!-- 无数据 -->
              <tr v-if="filteredData.length === 0">
                <td colspan="9" class="py-12 text-center text-muted-foreground">暂无数据</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- 汇总行 -->
      <div v-if="filteredData.length > 0" class="border-t bg-muted/30 px-6 py-3">
        <div class="flex items-center gap-8 text-sm">
          <div>
            <span class="text-muted-foreground">合计计划面积：</span>
            <span class="font-semibold tabular-nums">{{ totalPlannedArea.toLocaleString() }} 亩</span>
          </div>
          <div>
            <span class="text-muted-foreground">合计实际面积：</span>
            <span class="font-semibold tabular-nums">{{ totalActualArea.toLocaleString() }} 亩</span>
          </div>
          <div>
            <span class="text-muted-foreground">完成率：</span>
            <span class="font-semibold tabular-nums">{{ completionRate }}%</span>
          </div>
          <div>
            <span class="text-muted-foreground">同比增减合计：</span>
            <span
              class="font-semibold tabular-nums"
              :class="totalYoyChange > 0 ? 'text-green-600' : totalYoyChange < 0 ? 'text-red-600' : ''"
            >
              {{ totalYoyChange > 0 ? '+' : '' }}{{ totalYoyChange.toLocaleString() }} 亩
            </span>
          </div>
        </div>
      </div>

      <!-- 说明区 -->
      <div class="border-t px-6 py-4">
        <div class="text-xs text-muted-foreground space-y-1">
          <div class="font-medium text-foreground/70">说明：</div>
          <div>"占比" = 该行作物实际种植面积 / 当前查询结果中同单位实际种植总面积之和 x 100%</div>
          <div>"同比增减" = 当前年份面积 - 上一年同作物面积（同单位）</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { ChevronDown, Minus, ChevronRight as ChevronRightIcon, Search, RotateCcw } from 'lucide-vue-next'

// ============ 查询条件 ============

const filters = ref({
  year: '2025',
  org: '',
  cropCategory: '',
  cropVariety: '',
})

const yearOptions = ['2025', '2024', '2023', '2022']

const orgTree = [
  {
    label: '哈尔滨区域公司',
    children: ['五大连池农场', '松北农场', '呼兰农场', '阿城农场', '双城分场']
  },
  {
    label: '沈阳区域公司',
    children: ['苏家屯农场', '新民农场', '辽中分场', '法库分场']
  }
]

const showOrgTree = ref(false)
const expandedOrgs = ref<string[]>([])

const toggleOrgNode = (label: string) => {
  const idx = expandedOrgs.value.indexOf(label)
  if (idx >= 0) {
    expandedOrgs.value.splice(idx, 1)
  } else {
    expandedOrgs.value.push(label)
  }
}

const selectOrg = (org: string) => {
  filters.value.org = org
  showOrgTree.value = false
}

// 点击外部关闭下拉
const handleClickOutside = (e: MouseEvent) => {
  const target = e.target as HTMLElement
  if (!target.closest('.unit-tree-dropdown')) {
    showOrgTree.value = false
  }
}

if (typeof document !== 'undefined') {
  document.addEventListener('click', handleClickOutside)
}

// ============ 作物数据（来源：基础管理→作物管理） ============

const cropMajors = [
  { name: '水稻', code: 'rice' },
  { name: '小麦', code: 'wheat' },
  { name: '玉米', code: 'corn' },
  { name: '大豆', code: 'soybean' }
] as const

const cropVarieties = [
  { name: '籼稻', code: 'indica_rice', majorCode: 'rice', majorName: '水稻' },
  { name: '粳稻', code: 'japonica_rice', majorCode: 'rice', majorName: '水稻' },
  { name: '糯稻', code: 'glutinous_rice', majorCode: 'rice', majorName: '水稻' },
  { name: '杂交稻', code: 'hybrid_rice', majorCode: 'rice', majorName: '水稻' },
  { name: '强筋小麦', code: 'strong_gluten_wheat', majorCode: 'wheat', majorName: '小麦' },
  { name: '中筋小麦', code: 'medium_gluten_wheat', majorCode: 'wheat', majorName: '小麦' },
  { name: '弱筋小麦', code: 'weak_gluten_wheat', majorCode: 'wheat', majorName: '小麦' },
  { name: '甜玉米', code: 'sweet_corn', majorCode: 'corn', majorName: '玉米' },
  { name: '糯玉米', code: 'waxy_corn', majorCode: 'corn', majorName: '玉米' },
  { name: '先玉335', code: 'xianyu335', majorCode: 'corn', majorName: '玉米' },
  { name: '高蛋白大豆', code: 'high_protein_soybean', majorCode: 'soybean', majorName: '大豆' },
  { name: '高油大豆', code: 'high_oil_soybean', majorCode: 'soybean', majorName: '大豆' },
  { name: '黑河43', code: 'heihe43', majorCode: 'soybean', majorName: '大豆' }
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

// ============ 统计表数据 ============

interface StructureRow {
  regionCompany: string
  farm: string
  subFarm: string
  cropCategory: string
  cropVariety: string
  plannedArea: number
  actualArea: number
  percentage: number
  yoyChange: number
  year: string
}

const mockData: StructureRow[] = [
  // 哈尔滨区域公司 - 五大连池农场 - 龙泉分场
  { regionCompany: '哈尔滨区域公司', farm: '五大连池农场', subFarm: '龙泉分场', cropCategory: '玉米', cropVariety: '先玉335', plannedArea: 5000, actualArea: 4980, percentage: 52.53, yoyChange: 200, year: '2025' },
  { regionCompany: '哈尔滨区域公司', farm: '五大连池农场', subFarm: '龙泉分场', cropCategory: '大豆', cropVariety: '黑河43', plannedArea: 5000, actualArea: 4500, percentage: 47.46, yoyChange: 200, year: '2025' },
  // 哈尔滨区域公司 - 五大连池农场 - 兴安分场
  { regionCompany: '哈尔滨区域公司', farm: '五大连池农场', subFarm: '兴安分场', cropCategory: '水稻', cropVariety: '粳稻', plannedArea: 3200, actualArea: 3100, percentage: 55.36, yoyChange: 150, year: '2025' },
  { regionCompany: '哈尔滨区域公司', farm: '五大连池农场', subFarm: '兴安分场', cropCategory: '大豆', cropVariety: '高蛋白大豆', plannedArea: 2500, actualArea: 2500, percentage: 44.64, yoyChange: -50, year: '2025' },
  // 哈尔滨区域公司 - 松北农场 - 松北分场
  { regionCompany: '哈尔滨区域公司', farm: '松北农场', subFarm: '松北分场', cropCategory: '水稻', cropVariety: '杂交稻', plannedArea: 4500, actualArea: 4400, percentage: 62.86, yoyChange: 300, year: '2025' },
  { regionCompany: '哈尔滨区域公司', farm: '松北农场', subFarm: '松北分场', cropCategory: '玉米', cropVariety: '甜玉米', plannedArea: 2600, actualArea: 2600, percentage: 37.14, yoyChange: -100, year: '2025' },
  // 哈尔滨区域公司 - 呼兰农场 - 利民分场
  { regionCompany: '哈尔滨区域公司', farm: '呼兰农场', subFarm: '利民分场', cropCategory: '小麦', cropVariety: '强筋小麦', plannedArea: 3800, actualArea: 3700, percentage: 48.68, yoyChange: 100, year: '2025' },
  { regionCompany: '哈尔滨区域公司', farm: '呼兰农场', subFarm: '利民分场', cropCategory: '玉米', cropVariety: '糯玉米', plannedArea: 3900, actualArea: 3900, percentage: 51.32, yoyChange: 50, year: '2025' },
  // 哈尔滨区域公司 - 阿城农场 - 亚沟分场
  { regionCompany: '哈尔滨区域公司', farm: '阿城农场', subFarm: '亚沟分场', cropCategory: '大豆', cropVariety: '高油大豆', plannedArea: 2200, actualArea: 2100, percentage: 40.38, yoyChange: -80, year: '2025' },
  { regionCompany: '哈尔滨区域公司', farm: '阿城农场', subFarm: '亚沟分场', cropCategory: '水稻', cropVariety: '糯稻', plannedArea: 3100, actualArea: 3100, percentage: 59.62, yoyChange: 200, year: '2025' },
  // 沈阳区域公司 - 苏家屯农场 - 红菱分场
  { regionCompany: '沈阳区域公司', farm: '苏家屯农场', subFarm: '红菱分场', cropCategory: '水稻', cropVariety: '籼稻', plannedArea: 6000, actualArea: 5850, percentage: 58.50, yoyChange: 500, year: '2025' },
  { regionCompany: '沈阳区域公司', farm: '苏家屯农场', subFarm: '红菱分场', cropCategory: '玉米', cropVariety: '先玉335', plannedArea: 4150, actualArea: 4150, percentage: 41.50, yoyChange: 150, year: '2025' },
  // 沈阳区域公司 - 新民农场 - 柳河分场
  { regionCompany: '沈阳区域公司', farm: '新民农场', subFarm: '柳河分场', cropCategory: '小麦', cropVariety: '中筋小麦', plannedArea: 3500, actualArea: 3400, percentage: 50.00, yoyChange: -200, year: '2025' },
  { regionCompany: '沈阳区域公司', farm: '新民农场', subFarm: '柳河分场', cropCategory: '大豆', cropVariety: '黑河43', plannedArea: 3400, actualArea: 3400, percentage: 50.00, yoyChange: 100, year: '2025' },
  // 沈阳区域公司 - 辽中分场 - 茨榆坨分园
  { regionCompany: '沈阳区域公司', farm: '辽中分场', subFarm: '茨榆坨分园', cropCategory: '玉米', cropVariety: '甜玉米', plannedArea: 2800, actualArea: 2700, percentage: 45.00, yoyChange: 300, year: '2025' },
  { regionCompany: '沈阳区域公司', farm: '辽中分场', subFarm: '茨榆坨分园', cropCategory: '小麦', cropVariety: '弱筋小麦', plannedArea: 3300, actualArea: 3300, percentage: 55.00, yoyChange: -150, year: '2025' },
  // 2024年数据（用于同比参照）
  { regionCompany: '哈尔滨区域公司', farm: '五大连池农场', subFarm: '龙泉分场', cropCategory: '玉米', cropVariety: '先玉335', plannedArea: 4800, actualArea: 4780, percentage: 53.11, yoyChange: 100, year: '2024' },
  { regionCompany: '哈尔滨区域公司', farm: '五大连池农场', subFarm: '龙泉分场', cropCategory: '大豆', cropVariety: '黑河43', plannedArea: 4600, actualArea: 4300, percentage: 46.89, yoyChange: -50, year: '2024' },
  { regionCompany: '哈尔滨区域公司', farm: '松北农场', subFarm: '松北分场', cropCategory: '水稻', cropVariety: '杂交稻', plannedArea: 4200, actualArea: 4100, percentage: 60.29, yoyChange: 200, year: '2024' },
  { regionCompany: '哈尔滨区域公司', farm: '松北农场', subFarm: '松北分场', cropCategory: '玉米', cropVariety: '甜玉米', plannedArea: 2700, actualArea: 2700, percentage: 39.71, yoyChange: 0, year: '2024' },
  { regionCompany: '沈阳区域公司', farm: '苏家屯农场', subFarm: '红菱分场', cropCategory: '水稻', cropVariety: '籼稻', plannedArea: 5800, actualArea: 5350, percentage: 57.30, yoyChange: 300, year: '2024' },
  { regionCompany: '沈阳区域公司', farm: '苏家屯农场', subFarm: '红菱分场', cropCategory: '玉米', cropVariety: '先玉335', plannedArea: 4000, actualArea: 4000, percentage: 42.70, yoyChange: 200, year: '2024' },
]

// 过滤后的数据
const filteredData = computed(() => {
  let data = mockData.filter(d => d.year === filters.value.year)

  // 所属单位过滤
  if (filters.value.org) {
    data = data.filter(d =>
      d.regionCompany === filters.value.org ||
      d.farm === filters.value.org ||
      d.subFarm === filters.value.org
    )
  }

  // 作物大类过滤
  if (filters.value.cropCategory) {
    data = data.filter(d => d.cropCategory === filters.value.cropCategory)
  }

  // 作物品种过滤
  if (filters.value.cropVariety) {
    data = data.filter(d => d.cropVariety === filters.value.cropVariety)
  }

  // 重新计算占比（基于过滤后的数据，按单位分组）
  if (data.length > 0) {
    // 按区域公司+农场+分场分组计算总面积
    const groupTotalMap = new Map<string, number>()
    for (const row of data) {
      const key = `${row.regionCompany}|${row.farm}|${row.subFarm}`
      groupTotalMap.set(key, (groupTotalMap.get(key) || 0) + row.actualArea)
    }
    // 重新赋值占比
    return data.map(row => {
      const key = `${row.regionCompany}|${row.farm}|${row.subFarm}`
      const groupTotal = groupTotalMap.get(key) || 1
      return {
        ...row,
        percentage: (row.actualArea / groupTotal) * 100
      }
    })
  }

  return data
})

// 汇总统计
const totalPlannedArea = computed(() =>
  filteredData.value.reduce((sum, r) => sum + r.plannedArea, 0)
)

const totalActualArea = computed(() =>
  filteredData.value.reduce((sum, r) => sum + r.actualArea, 0)
)

const completionRate = computed(() => {
  if (totalPlannedArea.value === 0) return '0.00'
  return ((totalActualArea.value / totalPlannedArea.value) * 100).toFixed(2)
})

const totalYoyChange = computed(() =>
  filteredData.value.reduce((sum, r) => sum + r.yoyChange, 0)
)

// ============ 操作 ============

const handleQuery = () => {
  // 触发查询（computed 自动响应）
}

const handleReset = () => {
  filters.value = {
    year: '2025',
    org: '',
    cropCategory: '',
    cropVariety: '',
  }
}
</script>
