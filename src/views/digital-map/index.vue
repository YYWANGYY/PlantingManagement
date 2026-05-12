<template>
  <div class="relative -m-6 h-[calc(100vh-3.5rem)] overflow-hidden">
    <!-- 地图底图 -->
    <div ref="mapContainerRef" class="absolute inset-0 z-0">
      <div v-if="!mapReady" class="flex h-full items-center justify-center bg-muted/30">
        <div class="flex flex-col items-center gap-2 text-muted-foreground">
          <Layers class="h-8 w-8 animate-pulse" />
          <p class="text-sm">地图加载中...</p>
        </div>
      </div>
    </div>

    <!-- 顶部筛选+统计卡片 -->
    <div class="absolute inset-x-0 top-3 z-20 flex flex-col gap-2 px-3">
      <!-- 筛选栏 -->
      <div class="flex w-full max-w-4xl items-center gap-3">
        <div class="flex h-8 items-center gap-2 rounded-md border bg-background/90 px-3 shadow-sm backdrop-blur-sm">
          <Search class="h-3.5 w-3.5 text-muted-foreground" />
          <select v-model="currentYear" class="h-full border-0 bg-transparent text-xs outline-none">
            <option v-for="y in yearOptions" :key="y" :value="y">{{ y }}年</option>
          </select>
        </div>
        <!-- 所属单位树形选择 -->
        <div ref="treeSelectContainerRef" class="relative">
          <button
            type="button"
            @click="treeOpen = !treeOpen"
            class="flex h-8 w-56 items-center justify-between rounded-md border bg-background/90 px-3 text-xs shadow-sm backdrop-blur-sm hover:border-primary/50"
          >
            <span class="truncate">{{ selectedOrgLabel }}</span>
            <ChevronDown class="h-3.5 w-3.5 shrink-0 text-muted-foreground transition-transform" :class="{ 'rotate-180': treeOpen }" />
          </button>
          <div
            v-if="treeOpen"
            class="absolute center top-full z-50 mt-1 max-h-64 w-64 overflow-y-auto rounded-md border bg-background shadow-lg"
          >
            <template v-for="node in orgTree" :key="node.value">
              <TreeSelectNode
                :node="node"
                :level="0"
                :selected-value="orgValue"
                :expanded-keys="expandedKeys"
                @select="handleOrgSelect"
                @toggle="toggleExpand"
              />
            </template>
          </div>
        </div>
      </div>
    </div>
      <!-- 统计卡片 -->
    <div class="absolute  items-center  inset-x-0 top-15 z-20 flex flex-col gap-2 px-3">
      <div class="grid w-full  max-w-4xl grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-6">
        <div
          v-for="stat in currentStats"
          :key="stat.label"
          class="flex items-center gap-2.5 rounded-lg border bg-background/90 px-3 py-2 shadow-md backdrop-blur-sm"
        >
          <div :class="['flex h-8 w-8 shrink-0 items-center justify-center rounded-md', stat.bgClass]">
            <component :is="getIcon(stat.icon)" :class="['h-4 w-4', stat.iconColor]" />
          </div>
          <div class="min-w-0">
            <p class="truncate text-[11px] text-muted-foreground">{{ stat.label }}</p>
            <p class="text-base font-bold leading-tight">
              {{ stat.value }}
              <span class="ml-0.5 text-[11px] font-normal text-muted-foreground">{{ stat.unit }}</span>
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- 左侧种植图层面板 -->
    <div
      class="absolute bottom-3 left-3 z-10 w-56 rounded-lg border bg-background/90 shadow-md backdrop-blur-sm"
      :style="{ top: '160px' }"
    >
      <div class="border-b px-3 py-2">
        <h3 class="text-sm font-semibold">种植图层</h3>
      </div>
      <div class="space-y-1 p-2">
        <button
          @click="setActiveMode('field')"
          :class="[
            'flex w-full items-center gap-2.5 rounded-md px-3 py-2 text-left text-sm transition-colors',
            activeMode === 'field' ? 'bg-primary text-primary-foreground' : 'hover:bg-muted text-foreground'
          ]"
        >
          <Sprout class="h-4 w-4 shrink-0" />
          <div class="min-w-0 flex-1">
            <div class="font-medium">大田种植</div>
            <div v-if="activeMode === 'field'" class="mt-0.5 flex gap-2 text-[10px] opacity-80">
              <span>5个农场</span>
              <span>8个分场</span>
              <span>{{ fieldPlots.length }}块地块</span>
            </div>
          </div>
        </button>
        <button
          @click="setActiveMode('facility')"
          :class="[
            'flex w-full items-center gap-2.5 rounded-md px-3 py-2 text-left text-sm transition-colors',
            activeMode === 'facility' ? 'bg-primary text-primary-foreground' : 'hover:bg-muted text-foreground'
          ]"
        >
          <Leaf class="h-4 w-4 shrink-0" />
          <div class="min-w-0 flex-1">
            <div class="font-medium">设施种植</div>
            <div v-if="activeMode === 'facility'" class="mt-0.5 flex gap-2 text-[10px] opacity-80">
              <span>4个农场</span>
              <span>6个分场</span>
              <span>{{ facilityPlots.length }}块地块</span>
            </div>
          </div>
        </button>
      </div>
      <!-- 作物面积排行 -->
      <div class="border-t px-3 py-2">
        <p class="mb-2 text-xs font-medium text-muted-foreground">
          {{ activeMode === 'field' ? '大田' : '设施' }}种植作物面积 TOP{{ currentCropRank.length }}
        </p>
        <div class="max-h-[calc(100vh-420px)] space-y-2 overflow-y-auto">
          <button
            v-for="crop in currentCropRank"
            :key="crop.name"
            type="button"
            @click="handleCropClick(crop.name)"
            :class="[
              'w-full space-y-0.5 rounded p-1 text-left transition-colors hover:bg-muted/60',
              selectedCrop === crop.name && panelOpen ? 'bg-muted/80 ring-1 ring-primary/30' : ''
            ]"
          >
            <div class="flex items-center justify-between text-xs">
              <div class="flex items-center gap-1.5">
                <span class="inline-block h-2.5 w-2.5 rounded-sm" :style="{ backgroundColor: crop.color }" />
                <span class="font-medium">{{ crop.name }}</span>
              </div>
              <span class="text-muted-foreground">{{ crop.area.toLocaleString() }}亩</span>
            </div>
            <div class="h-1.5 w-full overflow-hidden rounded-full bg-muted">
              <div
                class="h-full rounded-full transition-all"
                :style="{ width: `${(crop.area / maxArea) * 100}%`, backgroundColor: crop.color }"
              />
            </div>
          </button>
        </div>
      </div>
    </div>

    <!-- 图例 -->
    <div class="absolute bottom-3 left-[244px] z-10 rounded-lg border bg-background/90 px-4 py-3 shadow-md backdrop-blur-sm">
      <p class="mb-2 text-xs font-medium text-muted-foreground">图例</p>
      <div class="grid grid-cols-2 gap-x-6 gap-y-1.5">
        <div v-for="item in legendItems" :key="item.crop" class="flex items-center gap-1.5 text-xs">
          <span class="inline-block h-3 w-3 rounded-sm border border-black/10" :style="{ backgroundColor: item.color }" />
          <span>{{ item.crop }}</span>
        </div>
      </div>
    </div>

    <!-- 地图缩放控件 -->
    <div
      class="absolute bottom-3 z-10 flex flex-col overflow-hidden rounded-lg border bg-background/90 shadow-md backdrop-blur-sm"
      :style="{ right: panelOpen ? '352px' : '12px' }"
    >
      <button
        @click="zoomIn"
        class="flex h-9 w-9 items-center justify-center text-foreground transition-colors hover:bg-muted"
        title="放大"
      >
        <Plus class="h-4 w-4" />
      </button>
      <div class="h-px bg-border"></div>
      <button
        @click="zoomOut"
        class="flex h-9 w-9 items-center justify-center text-foreground transition-colors hover:bg-muted"
        title="缩小"
      >
        <Minus class="h-4 w-4" />
      </button>
    </div>

    <!-- 选中地块详情 -->
    <div
      v-if="selectedPlot"
      class="absolute bottom-3 z-10 w-64 rounded-lg border bg-background/90 p-3 shadow-md backdrop-blur-sm"
      :style="{ right: panelOpen ? '352px' : '12px' }"
    >
      <div class="mb-1 flex items-center justify-between">
        <h4 class="text-sm font-semibold">{{ selectedPlot.name }}</h4>
        <button @click="selectedPlot = null" class="text-muted-foreground hover:text-foreground">&times;</button>
      </div>
      <div class="space-y-1 text-xs text-muted-foreground">
        <div class="flex items-center gap-1.5">
          <span class="inline-block h-2.5 w-2.5 rounded-sm" :style="{ backgroundColor: selectedPlot.color }" />
          <span>作物：{{ selectedPlot.crop }}</span>
        </div>
        <p>面积：{{ selectedPlot.area }}亩</p>
      </div>
    </div>

    <!-- 右侧种植列表面板 -->
    <div
      class="absolute right-0 top-0 z-30 h-full w-[440px] border-l bg-background/95 shadow-xl backdrop-blur-sm transition-transform duration-300"
      :style="{ transform: panelOpen ? 'translateX(0)' : 'translateX(100%)' }"
    >
      <div v-if="panelOpen && selectedCrop" class="flex h-full flex-col">
        <!-- 面板头部 -->
        <div class="flex items-center justify-between border-b px-4 py-3">
          <div class="flex items-center gap-2">
            <button
              v-if="drillDownId"
              @click="drillDownId = null"
              class="flex items-center gap-1 text-xs text-primary hover:underline"
            >
              <ArrowLeft class="h-3.5 w-3.5" />
              <span>种植列表</span>
            </button>
            <h3 class="text-sm font-semibold">
              {{ drillDownId ? '种植单元列表' : `${selectedCrop} - 种植列表` }}
            </h3>
          </div>
          <button @click="closePanel" class="text-muted-foreground hover:text-foreground">
            <X class="h-4 w-4" />
          </button>
        </div>
        <!-- 面板内容 -->
        <div class="flex-1 overflow-y-auto">
          <!-- 大田种植列表 -->
          <table v-if="!drillDownId && activeMode === 'field'" class="w-full text-xs">
            <thead class="sticky top-0 bg-muted/80 backdrop-blur-sm">
              <tr class="border-b">
                <th class="px-3 py-2 text-left font-medium">所属单位</th>
                <th class="px-2 py-2 text-left font-medium">种植作物</th>
                <th class="px-2 py-2 text-left font-medium">作物品种</th>
                <th class="px-2 py-2 text-right font-medium">计划面积</th>
                <th class="px-2 py-2 text-right font-medium">实际面积</th>
                <th class="px-2 py-2 text-center font-medium">任务数</th>
                <th class="px-2 py-2 text-center font-medium">完成率</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="rec in (cropRecords as FieldPlantRecord[])"
                :key="rec.id"
                @click="handleRecordClick(rec.id)"
                class="cursor-pointer border-b hover:bg-muted/50 transition-colors"
              >
                <td class="px-3 py-2">
                  <div>{{ rec.regionCompany }}</div>
                  <div class="text-muted-foreground">{{ rec.farm }} · {{ rec.branch }}</div>
                </td>
                <td class="px-2 py-2">
                  <div class="flex items-center gap-1">
                    <span class="inline-block h-2 w-2 rounded-sm" :style="{ backgroundColor: cropColors[rec.crop] || '#888' }" />
                    {{ rec.crop }}
                  </div>
                </td>
                <td class="px-2 py-2">{{ rec.variety }}</td>
                <td class="px-2 py-2 text-right">{{ rec.plannedArea }}亩</td>
                <td class="px-2 py-2 text-right">{{ rec.actualArea }}亩</td>
                <td class="px-2 py-2 text-center">{{ rec.taskCount }}</td>
                <td class="px-2 py-2 text-center">
                  <CompletionBadge :rate="rec.completionRate" />
                </td>
              </tr>
            </tbody>
          </table>
          <!-- 设施种植列表 -->
          <table v-else-if="!drillDownId && activeMode === 'facility'" class="w-full text-xs">
            <thead class="sticky top-0 bg-muted/80 backdrop-blur-sm">
              <tr class="border-b">
                <th class="px-3 py-2 text-left font-medium">所属单位</th>
                <th class="px-2 py-2 text-left font-medium">种植作物</th>
                <th class="px-2 py-2 text-left font-medium">作物品种</th>
                <th class="px-2 py-2 text-right font-medium">大棚面积</th>
                <th class="px-2 py-2 text-right font-medium">棚间地</th>
                <th class="px-2 py-2 text-right font-medium">耕地面积</th>
                <th class="px-2 py-2 text-right font-medium">实际面积</th>
                <th class="px-2 py-2 text-center font-medium">任务</th>
                <th class="px-2 py-2 text-center font-medium">完成率</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="rec in (cropRecords as FacilityPlantRecord[])"
                :key="rec.id"
                @click="handleRecordClick(rec.id)"
                class="cursor-pointer border-b hover:bg-muted/50 transition-colors"
              >
                <td class="px-3 py-2">
                  <div>{{ rec.regionCompany }}</div>
                  <div class="text-muted-foreground">{{ rec.farm }} · {{ rec.branch }}</div>
                </td>
                <td class="px-2 py-2">
                  <div class="flex items-center gap-1">
                    <span class="inline-block h-2 w-2 rounded-sm" :style="{ backgroundColor: cropColors[rec.crop] || '#888' }" />
                    {{ rec.crop }}
                  </div>
                </td>
                <td class="px-2 py-2">{{ rec.variety }}</td>
                <td class="px-2 py-2 text-right">{{ rec.greenhouseArea }}亩</td>
                <td class="px-2 py-2 text-right">{{ rec.interGreenArea }}亩</td>
                <td class="px-2 py-2 text-right">{{ rec.arableArea }}亩</td>
                <td class="px-2 py-2 text-right">{{ rec.actualArea }}亩</td>
                <td class="px-2 py-2 text-center">{{ rec.taskCount }}</td>
                <td class="px-2 py-2 text-center">
                  <CompletionBadge :rate="rec.completionRate" />
                </td>
              </tr>
            </tbody>
          </table>
          <!-- 大田子列表 -->
          <table v-else-if="drillDownId && activeMode === 'field' && subRecords.length > 0" class="w-full text-xs">
            <thead class="sticky top-0 bg-muted/80 backdrop-blur-sm">
              <tr class="border-b">
                <th class="px-3 py-2 text-left font-medium">所属单位</th>
                <th class="px-2 py-2 text-left font-medium">种植单元</th>
                <th class="px-2 py-2 text-left font-medium">作物品种</th>
                <th class="px-2 py-2 text-right font-medium">计划面积</th>
                <th class="px-2 py-2 text-right font-medium">实际面积</th>
                <th class="px-2 py-2 text-center font-medium">任务数</th>
                <th class="px-2 py-2 text-center font-medium">完成率</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="rec in (subRecords as FieldSubRecord[])"
                :key="rec.id"
                @click="handleSubRecordClick(rec.id, rec.plotId)"
                :class="[
                  'cursor-pointer border-b transition-colors',
                  selectedSubRecordId === rec.id ? 'bg-primary/15 ring-1 ring-inset ring-primary/30' : 'hover:bg-primary/10'
                ]"
              >
                <td class="px-3 py-2">
                  <div>{{ rec.regionCompany }}</div>
                  <div class="text-muted-foreground">{{ rec.farm }} · {{ rec.branch }}</div>
                </td>
                <td class="px-2 py-2 font-medium text-primary">{{ rec.unit }}</td>
                <td class="px-2 py-2">{{ rec.variety }}</td>
                <td class="px-2 py-2 text-right">{{ rec.plannedArea }}亩</td>
                <td class="px-2 py-2 text-right">{{ rec.actualArea }}亩</td>
                <td class="px-2 py-2 text-center">{{ rec.taskCount }}</td>
                <td class="px-2 py-2 text-center">
                  <CompletionBadge :rate="rec.completionRate" />
                </td>
              </tr>
            </tbody>
          </table>
          <!-- 设施子列表 -->
          <table v-else-if="drillDownId && activeMode === 'facility' && subRecords.length > 0" class="w-full text-xs">
            <thead class="sticky top-0 bg-muted/80 backdrop-blur-sm">
              <tr class="border-b">
                <th class="px-3 py-2 text-left font-medium">所属单位</th>
                <th class="px-2 py-2 text-left font-medium">种植单元</th>
                <th class="px-2 py-2 text-left font-medium">作物品种</th>
                <th class="px-2 py-2 text-right font-medium">大棚面积</th>
                <th class="px-2 py-2 text-right font-medium">棚间地</th>
                <th class="px-2 py-2 text-right font-medium">耕地面积</th>
                <th class="px-2 py-2 text-right font-medium">实际面积</th>
                <th class="px-2 py-2 text-center font-medium">完成率</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="rec in (subRecords as FacilitySubRecord[])"
                :key="rec.id"
                @click="handleSubRecordClick(rec.id, rec.plotId)"
                :class="[
                  'cursor-pointer border-b transition-colors',
                  selectedSubRecordId === rec.id ? 'bg-primary/15 ring-1 ring-inset ring-primary/30' : 'hover:bg-primary/10'
                ]"
              >
                <td class="px-3 py-2">
                  <div>{{ rec.regionCompany }}</div>
                  <div class="text-muted-foreground">{{ rec.farm }} · {{ rec.branch }}</div>
                </td>
                <td class="px-2 py-2 font-medium text-primary">{{ rec.unit }}</td>
                <td class="px-2 py-2">{{ rec.variety }}</td>
                <td class="px-2 py-2 text-right">{{ rec.greenhouseArea }}亩</td>
                <td class="px-2 py-2 text-right">{{ rec.interGreenArea }}亩</td>
                <td class="px-2 py-2 text-right">{{ rec.arableArea }}亩</td>
                <td class="px-2 py-2 text-right">{{ rec.actualArea }}亩</td>
                <td class="px-2 py-2 text-center">
                  <CompletionBadge :rate="rec.completionRate" />
                </td>
              </tr>
            </tbody>
          </table>
          <!-- 空状态 -->
          <div v-else class="flex flex-col items-center justify-center py-16 text-muted-foreground">
            <Layers class="mb-2 h-8 w-8" />
            <p class="text-sm">暂无种植单元数据</p>
          </div>
        </div>
        <!-- 底部提示 -->
        <div class="border-t px-4 py-2 text-[11px] text-muted-foreground">
          {{ drillDownId ? `共 ${subRecords.length} 个种植单元 · 点击行可定位到地图` : `共 ${cropRecords.length} 条记录 · 点击行可查看种植单元` }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch, nextTick } from 'vue'
import {
  Layers, Search, Sprout, Leaf, ChevronDown, ChevronRight, ArrowLeft, X,
  Building2, LandPlot, Map as MapIcon, Wheat, AreaChart, Cpu, Warehouse, Home, Fence,
  Plus, Minus
} from 'lucide-vue-next'
import {
  type PlantingMode, type StatCard, type PlotData, type FieldPlantRecord, type FacilityPlantRecord,
  type FieldSubRecord, type FacilitySubRecord, type TreeNode,
  cropColors, fieldStats, facilityStats, fieldCropRank, facilityCropRank,
  fieldPlots, facilityPlots, fieldPlantList, facilityPlantList,
  fieldSubList, facilitySubList, orgTree
} from './data'
import TreeSelectNode from './TreeSelectNode.vue'
import CompletionBadge from './CompletionBadge.vue'

declare const T: any
const TIANDITU_TK = '1ebd244a490b1631a36f0c6feda5a830'

const mapContainerRef = ref<HTMLDivElement | null>(null)
const mapRef = ref<any>(null)
const overlaysRef = ref<any[]>([])
const treeSelectContainerRef = ref<HTMLDivElement | null>(null)

const activeMode = ref<PlantingMode>('field')
const mapReady = ref(false)
const selectedPlot = ref<PlotData | null>(null)
const currentYear = ref(2025)
const orgValue = ref('root')
const selectedOrgLabel = ref('中国融通农业发展集团有限公司')
const treeOpen = ref(false)
const expandedKeys = ref(new Set(['root', 'hrb', 'sy']))
const panelOpen = ref(false)
const selectedCrop = ref<string | null>(null)
const drillDownId = ref<string | null>(null)
const highlightedPlotId = ref<string | null>(null)
const selectedSubRecordId = ref<string | null>(null)

const yearOptions = computed(() => {
  const y = currentYear.value
  return Array.from({ length: 10 }, (_, i) => y - i)
})

const currentStats = computed<StatCard[]>(() => activeMode.value === 'field' ? fieldStats : facilityStats)
const currentCropRank = computed(() => activeMode.value === 'field' ? fieldCropRank : facilityCropRank)
const currentPlots = computed(() => activeMode.value === 'field' ? fieldPlots : facilityPlots)
const maxArea = computed(() => Math.max(...currentCropRank.value.map(c => c.area)))

const legendItems = computed(() => {
  const seen = new Map<string, string>()
  for (const p of currentPlots.value) {
    if (!seen.has(p.crop)) seen.set(p.crop, p.color)
  }
  return Array.from(seen.entries()).map(([crop, color]) => ({ crop, color }))
})

const cropRecords = computed(() => {
  const list = activeMode.value === 'field' ? fieldPlantList : facilityPlantList
  return selectedCrop.value ? list[selectedCrop.value] || [] : []
})

const subRecords = computed(() => {
  const list = activeMode.value === 'field' ? fieldSubList : facilitySubList
  return drillDownId.value ? list[drillDownId.value] || [] : []
})

function getIcon(name: string) {
  const icons: Record<string, any> = {
    Building2, LandPlot, Map: MapIcon, Sprout, Wheat, AreaChart, Cpu, Warehouse, Home, Fence
  }
  return icons[name] || Layers
}

function setActiveMode(mode: PlantingMode) {
  activeMode.value = mode
  selectedCrop.value = null
  panelOpen.value = false
  drillDownId.value = null
  highlightedPlotId.value = null
}

function handleCropClick(cropName: string) {
  selectedCrop.value = cropName
  drillDownId.value = null
  panelOpen.value = true
}

function handleRecordClick(recordId: string) {
  drillDownId.value = recordId
  selectedSubRecordId.value = null
}

function handleSubRecordClick(recordId: string, plotId: string) {
  selectedSubRecordId.value = recordId
  locatePlot(plotId)
}

function closePanel() {
  panelOpen.value = false
  selectedCrop.value = null
  drillDownId.value = null
  highlightedPlotId.value = null
  selectedSubRecordId.value = null
}

function handleOrgSelect(val: string, label: string) {
  orgValue.value = val
  selectedOrgLabel.value = label
  treeOpen.value = false
}

function toggleExpand(key: string) {
  const next = new Set(expandedKeys.value)
  if (next.has(key)) next.delete(key)
  else next.add(key)
  expandedKeys.value = next
}

function locatePlot(plotId: string) {
  const allPlots = [...fieldPlots, ...facilityPlots]
  const plot = allPlots.find(p => p.id === plotId)
  if (!plot || !mapRef.value) return
  const coords = plot.coordinates
  const centerLng = coords.reduce((s, c) => s + c[0], 0) / coords.length
  const centerLat = coords.reduce((s, c) => s + c[1], 0) / coords.length
  mapRef.value.panTo(new T.LngLat(centerLng, centerLat), 15)
  selectedPlot.value = plot
  highlightedPlotId.value = plotId
  drawPolygons(currentPlots.value)
}

function clearOverlays() {
  if (!mapRef.value) return
  overlaysRef.value.forEach(o => mapRef.value.removeOverLay(o))
  overlaysRef.value = []
}

function drawPolygons(plots: PlotData[]) {
  if (!mapRef.value || typeof T === 'undefined') return
  clearOverlays()
  const hlId = highlightedPlotId.value
  for (const plot of plots) {
    const isHighlighted = plot.id === hlId
    const points = plot.coordinates.map(([lng, lat]) => new T.LngLat(lng, lat))
    const polygon = new T.Polygon(points, {
      color: isHighlighted ? '#FFFFFF' : plot.color,
      weight: isHighlighted ? 4 : 2,
      opacity: isHighlighted ? 1 : 0.8,
      fillColor: isHighlighted ? plot.color : plot.color,
      fillOpacity: isHighlighted ? 0.75 : 0.45
    })
    polygon.addEventListener('click', () => {
      selectedPlot.value = plot
      highlightedPlotId.value = plot.id
      drawPolygons(currentPlots.value)
    })
    mapRef.value.addOverLay(polygon)
    overlaysRef.value.push(polygon)
  }
}

function zoomIn() {
  if (mapRef.value) {
    const zoom = mapRef.value.getZoom()
    mapRef.value.setZoom(zoom + 1)
  }
}

function zoomOut() {
  if (mapRef.value) {
    const zoom = mapRef.value.getZoom()
    mapRef.value.setZoom(zoom - 1)
  }
}

function initMap() {
  if (!mapContainerRef.value || typeof T === 'undefined' || !T.Map) return
  const map = new T.Map(mapContainerRef.value)
  map.centerAndZoom(new T.LngLat(116.40769, 39.89945), 12)
  const win = window as unknown as Record<string, unknown>
  const hybrid = win.TMAP_HYBRID_MAP
  if (hybrid) {
    map.setMapType(hybrid as number)
  } else {
    const satellite = win.TMAP_SATELLITE_MAP
    if (satellite) map.setMapType(satellite as number)
  }
  mapRef.value = map
}

watch(currentPlots, (plots) => {
  highlightedPlotId.value = null
  drawPolygons(plots)
  selectedPlot.value = null
})

watch(mapReady, (ready) => {
  if (ready && !mapRef.value) initMap()
})

onMounted(() => {
  currentYear.value = new Date().getFullYear()

  // 加载天地图 API
  const existingScript = document.querySelector('script[data-tianditu]')
  if (existingScript) {
    if (typeof T !== 'undefined' && T.Map) mapReady.value = true
    return
  }
  const script = document.createElement('script')
  script.setAttribute('data-tianditu', 'true')
  script.src = `https://api.tianditu.gov.cn/api?v=4.0&tk=${TIANDITU_TK}`
  script.onload = () => { mapReady.value = true }
  script.onerror = () => { console.error('Failed to load Tianditu API'); mapReady.value = true }
  document.head.appendChild(script)

  // 点击外部关闭树选择器
  const handleClickOutside = (e: MouseEvent) => {
    if (treeSelectContainerRef.value && !treeSelectContainerRef.value.contains(e.target as Node)) {
      treeOpen.value = false
    }
  }
  document.addEventListener('mousedown', handleClickOutside)
  onUnmounted(() => document.removeEventListener('mousedown', handleClickOutside))
})

onUnmounted(() => {
  if (mapRef.value) {
    if (typeof mapRef.value.destroy === 'function') mapRef.value.destroy()
    mapRef.value = null
  }
})
</script>
