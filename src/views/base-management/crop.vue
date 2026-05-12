<template>
  <div class="space-y-6">
    <!-- 页面标题 + 操作 -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold tracking-tight">作物管理</h1>
        <p class="mt-1 text-sm text-muted-foreground">管理农场种植的作物品种信息与属性</p>
      </div>
      <button
        id="btn-new-crop"
        class="inline-flex items-center justify-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
        @click="goToForm()"
      >
        <Plus class="h-4 w-4" />
        新增作物
      </button>
    </div>

    <!-- 统计卡片 -->
    <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <div class="rounded-lg border bg-card text-card-foreground shadow-sm">
        <div class="flex items-center gap-4 p-5">
          <div class="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-green-100">
            <Wheat class="h-5 w-5 text-green-600" />
          </div>
          <div>
            <p class="text-sm text-muted-foreground">作物品种</p>
            <p class="text-2xl font-bold">{{ crops.length }} <span class="text-sm font-normal text-muted-foreground">种</span></p>
          </div>
        </div>
      </div>
      <div class="rounded-lg border bg-card text-card-foreground shadow-sm">
        <div class="flex items-center gap-4 p-5">
          <div class="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-amber-100">
            <Layers class="h-5 w-5 text-amber-600" />
          </div>
          <div>
            <p class="text-sm text-muted-foreground">作物大类</p>
            <p class="text-2xl font-bold">{{ categoryCount }} <span class="text-sm font-normal text-muted-foreground">类</span></p>
          </div>
        </div>
      </div>
      <div class="rounded-lg border bg-card text-card-foreground shadow-sm">
        <div class="flex items-center gap-4 p-5">
          <div class="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-blue-100">
            <MapPin class="h-5 w-5 text-blue-600" />
          </div>
          <div>
            <p class="text-sm text-muted-foreground">种植区域</p>
            <p class="text-2xl font-bold">{{ regionCount }} <span class="text-sm font-normal text-muted-foreground">个</span></p>
          </div>
        </div>
      </div>
      <div class="rounded-lg border bg-card text-card-foreground shadow-sm">
        <div class="flex items-center gap-4 p-5">
          <div class="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-emerald-100">
            <CheckCircle class="h-5 w-5 text-emerald-600" />
          </div>
          <div>
            <p class="text-sm text-muted-foreground">已启用</p>
            <p class="text-2xl font-bold">{{ enabledCount }} <span class="text-sm font-normal text-muted-foreground">种</span></p>
          </div>
        </div>
      </div>
    </div>

    <!-- 作物列表 -->
    <div class="rounded-lg border bg-card text-card-foreground shadow-sm">
      <div class="flex flex-col space-y-1.5 p-6">
        <h3 class="text-lg font-semibold leading-none tracking-tight">作物列表</h3>
        <p class="text-sm text-muted-foreground">所有作物的品种信息和种植属性</p>
      </div>
      <div class="p-6 pt-0">
        <div class="relative w-full overflow-auto">
          <table class="w-full caption-bottom text-sm">
            <thead class="[&_tr]:border-b">
              <tr class="border-b transition-colors hover:bg-muted/50">
                <th class="h-10 px-3 text-left align-middle font-medium text-muted-foreground">作物大类</th>
                <th class="h-10 px-3 text-left align-middle font-medium text-muted-foreground">作物类别</th>
                <th class="h-10 px-3 text-left align-middle font-medium text-muted-foreground">作物品种</th>
                <th class="h-10 px-3 text-left align-middle font-medium text-muted-foreground">生长周期</th>
                <th class="h-10 px-3 text-left align-middle font-medium text-muted-foreground">适宜季节</th>
                <th class="h-10 px-3 text-left align-middle font-medium text-muted-foreground">种植区域</th>
                <th class="h-10 px-3 text-left align-middle font-medium text-muted-foreground">土壤类型</th>
                <th class="h-10 px-3 text-left align-middle font-medium text-muted-foreground w-20">状态</th>
                <th class="h-10 px-3 text-right align-middle font-medium text-muted-foreground w-24">操作</th>
              </tr>
            </thead>
            <tbody class="[&_tr:last-child]:border-0">
              <tr
                v-for="crop in paginatedCrops"
                :key="crop.id"
                class="border-b transition-colors hover:bg-muted/50 cursor-pointer"
                @click="goToForm(crop.categoryCode)"
              >
                <td class="p-2 px-3 align-middle text-muted-foreground">{{ crop.type }}</td>
                <td class="p-2 px-3 align-middle">
                  <span class="inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium" :class="categoryClass(crop.categoryCode)">{{ crop.category }}</span>
                </td>

                <td class="p-2 px-3 align-middle font-medium">{{ crop.variety }}</td>
                <td class="p-2 px-3 align-middle">{{ crop.growthCycle }}</td>
                <td class="p-2 px-3 align-middle">{{ crop.season }}</td>
                <td class="p-2 px-3 align-middle">{{ crop.region }}</td>
                <td class="p-2 px-3 align-middle">{{ crop.soilType }}</td>
                <td class="p-2 px-3 align-middle">
                  <span class="inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium" :class="crop.status === '启用' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'">
                    {{ crop.status }}
                  </span>
                </td>
                <td class="p-2 px-3 align-middle text-right">
                  <div class="flex items-center justify-end gap-1">
                    <Pencil class="h-4 w-4 text-muted-foreground hover:text-primary cursor-pointer" @click.stop="goToForm(crop.categoryCode)" />
                    <Trash2 class="h-4 w-4 text-muted-foreground hover:text-destructive cursor-pointer" @click.stop />
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <!-- 分页 -->
        <div class="flex items-center justify-between border-t px-2 py-3">
          <p class="text-sm text-muted-foreground">
            共 <span class="font-medium">{{ crops.length }}</span> 条记录，第 {{ currentPage }} / {{ totalPages }} 页
          </p>
          <div class="flex items-center gap-1">
            <button
              class="inline-flex h-8 w-8 items-center justify-center rounded-md border text-sm transition-colors hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed"
              :disabled="currentPage <= 1"
              @click="currentPage = 1"
            >
              <ChevronsLeft class="h-4 w-4" />
            </button>
            <button
              class="inline-flex h-8 w-8 items-center justify-center rounded-md border text-sm transition-colors hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed"
              :disabled="currentPage <= 1"
              @click="currentPage--"
            >
              <ChevronLeft class="h-4 w-4" />
            </button>
            <button
              v-for="page in visiblePages"
              :key="page"
              class="inline-flex h-8 w-8 items-center justify-center rounded-md border text-sm transition-colors"
              :class="page === currentPage ? 'bg-primary text-primary-foreground border-primary' : 'hover:bg-muted'"
              @click="currentPage = page"
            >
              {{ page }}
            </button>
            <button
              class="inline-flex h-8 w-8 items-center justify-center rounded-md border text-sm transition-colors hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed"
              :disabled="currentPage >= totalPages"
              @click="currentPage++"
            >
              <ChevronRight class="h-4 w-4" />
            </button>
            <button
              class="inline-flex h-8 w-8 items-center justify-center rounded-md border text-sm transition-colors hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed"
              :disabled="currentPage >= totalPages"
              @click="currentPage = totalPages"
            >
              <ChevronsRight class="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { Plus, Wheat, Layers, MapPin, CheckCircle, Pencil, Trash2, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-vue-next'

const router = useRouter()

interface CropItem {
  id: string
  category: string
  categoryCode: string
  type: string
  variety: string
  growthCycle: string
  season: string
  region: string
  soilType: string
  status: '启用' | '停用'
}

const crops: CropItem[] = [
  { id: '1', category: '粮食作物', categoryCode: 'grain', type: '水稻', variety: 'Y两优900', growthCycle: '150-170天', season: '春季/夏季', region: '东北地区', soilType: '黑土/黏土', status: '启用' },
  { id: '2', category: '粮食作物', categoryCode: 'grain', type: '水稻', variety: '湘早籼45号', growthCycle: '110-120天', season: '春季', region: '长江中下游', soilType: '黏土', status: '启用' },
  { id: '3', category: '粮食作物', categoryCode: 'grain', type: '小麦', variety: '郑麦9023', growthCycle: '220-240天', season: '秋季/冬季', region: '黄淮海地区', soilType: '黄土/沙壤土', status: '启用' },
  { id: '4', category: '粮食作物', categoryCode: 'grain', type: '玉米', variety: '先玉335', growthCycle: '100-120天', season: '春季/夏季', region: '东北地区/华北地区', soilType: '黑土/沙壤土', status: '启用' },
  { id: '5', category: '粮食作物', categoryCode: 'grain', type: '玉米', variety: '登海605', growthCycle: '95-110天', season: '夏季', region: '黄淮海地区', soilType: '沙壤土', status: '启用' },
  { id: '6', category: '粮食作物', categoryCode: 'grain', type: '大豆', variety: '中黄13', growthCycle: '120-140天', season: '春季/夏季', region: '东北地区', soilType: '黑土', status: '启用' },
  { id: '7', category: '经济作物', categoryCode: 'cash', type: '棉花', variety: '新陆早45号', growthCycle: '150-180天', season: '春季', region: '新疆地区', soilType: '沙壤土/盐碱地', status: '启用' },
  { id: '8', category: '经济作物', categoryCode: 'cash', type: '油菜', variety: '中油杂12', growthCycle: '200-220天', season: '秋季/冬季', region: '长江中下游', soilType: '红壤/黏土', status: '启用' },
  { id: '9', category: '经济作物', categoryCode: 'cash', type: '花生', variety: '花育33号', growthCycle: '130-150天', season: '春季/夏季', region: '黄淮海地区', soilType: '沙壤土', status: '停用' },
  { id: '10', category: '蔬菜', categoryCode: 'vegetable', type: '番茄', variety: '金棚1号', growthCycle: '90-120天', season: '春季/秋季', region: '华北地区/设施', soilType: '沙壤土/黏土', status: '启用' },
  { id: '11', category: '蔬菜', categoryCode: 'vegetable', type: '黄瓜', variety: '津春4号', growthCycle: '60-80天', season: '春季/夏季/秋季', region: '东北地区/设施', soilType: '沙壤土', status: '启用' },
  { id: '12', category: '蔬菜', categoryCode: 'vegetable', type: '白菜', variety: '北京新3号', growthCycle: '70-90天', season: '秋季/冬季', region: '华北地区/东北地区', soilType: '沙壤土/黏土', status: '启用' },
  { id: '13', category: '水果', categoryCode: 'fruit', type: '苹果', variety: '红富士', growthCycle: '180-210天', season: '春季', region: '黄土高原/渤海湾', soilType: '黄土/沙壤土', status: '启用' },
  { id: '14', category: '水果', categoryCode: 'fruit', type: '葡萄', variety: '巨峰', growthCycle: '140-160天', season: '春季', region: '华北地区/西北地区', soilType: '沙壤土', status: '启用' },
  { id: '15', category: '牧草', categoryCode: 'forage', type: '紫花苜蓿', variety: '中苜1号', growthCycle: '30-40天/茬', season: '春季/夏季/秋季', region: '西北地区/东北地区', soilType: '沙壤土/盐碱地', status: '启用' },
  { id: '16', category: '花卉', categoryCode: 'flower', type: '玫瑰', variety: '卡罗拉', growthCycle: '60-90天', season: '春季/夏季/秋季', region: '设施', soilType: '沙壤土', status: '停用' },
]

const currentPage = ref(1)
const pageSize = 10

const totalPages = computed(() => Math.max(1, Math.ceil(crops.length / pageSize)))
const paginatedCrops = computed(() => {
  const start = (currentPage.value - 1) * pageSize
  return crops.slice(start, start + pageSize)
})

const visiblePages = computed(() => {
  const total = totalPages.value
  const current = currentPage.value
  const pages: number[] = []
  const maxVisible = 5
  let start = Math.max(1, current - Math.floor(maxVisible / 2))
  const end = Math.min(total, start + maxVisible - 1)
  start = Math.max(1, end - maxVisible + 1)
  for (let i = start; i <= end; i++) {
    pages.push(i)
  }
  return pages
})

// 当数据变化时重置页码
watch(() => crops.length, () => { currentPage.value = 1 })

const categoryCount = computed(() => new Set(crops.map(c => c.category)).size)
const regionCount = computed(() => new Set(crops.flatMap(c => c.region.split('/'))).size)
const enabledCount = computed(() => crops.filter(c => c.status === '启用').length)

function categoryClass(code: string): string {
  const map: Record<string, string> = {
    grain: 'bg-amber-100 text-amber-700',
    cash: 'bg-emerald-100 text-emerald-700',
    vegetable: 'bg-green-100 text-green-700',
    fruit: 'bg-red-100 text-red-700',
    forage: 'bg-teal-100 text-teal-700',
    flower: 'bg-pink-100 text-pink-700',
  }
  return map[code] ?? 'bg-gray-100 text-gray-700'
}

function goToForm(categoryCode?: string) {
  const query: Record<string, string> = {}
  if (categoryCode) query.category = categoryCode
  router.push({ path: '/base-management/crop/form', query })
}
</script>
