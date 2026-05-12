<template>
  <div class="space-y-6">
    <!-- 页面标题 + 操作 -->
    <div class="flex items-center justify-between">
      <div class="flex items-center gap-3">
        <button class="text-muted-foreground hover:text-foreground" @click="goBack">
          <ArrowLeft class="h-5 w-5" />
        </button>
        <div>
          <h1 class="text-2xl font-bold tracking-tight">新建种植计划</h1>
          <p class="mt-0.5 text-sm text-muted-foreground">
            引用种植方案：{{ schemeInfo.name }}（{{ schemeInfo.id }}）
          </p>
        </div>
      </div>
      <div class="flex items-center gap-2">
        <button
          class="inline-flex items-center justify-center gap-1.5 rounded-md border border-input bg-background px-4 py-2 text-sm font-medium shadow-sm transition-colors hover:bg-muted"
          @click="handleSave"
        >
          <Save class="h-4 w-4" />
          保存
        </button>
        <button
          class="inline-flex items-center justify-center gap-1.5 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90"
          @click="handleSubmit"
        >
          <Send class="h-4 w-4" />
          发起流程
        </button>
      </div>
    </div>

    <!-- 选项卡 -->
    <div class="border-b">
      <nav class="flex gap-6">
        <button
          v-for="tab in tabs"
          :key="tab.key"
          class="relative pb-3 text-sm font-medium transition-colors"
          :class="activeTab === tab.key ? 'text-primary' : 'text-muted-foreground hover:text-foreground'"
          @click="activeTab = tab.key"
        >
          {{ tab.label }}
          <span
            v-if="activeTab === tab.key"
            class="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full"
          />
        </button>
      </nav>
    </div>

    <!-- Tab 1: 基本信息 -->
    <div v-if="activeTab === 'basic'" class="space-y-6">
      <!-- 引用方案信息（只读） -->
      <div class="rounded-lg border bg-muted/30 p-4">
        <h3 class="text-sm font-semibold text-muted-foreground mb-3">引用种植方案</h3>
        <div class="grid grid-cols-1 gap-4 lg:grid-cols-4">
          <div>
            <span class="text-xs text-muted-foreground">方案编码</span>
            <p class="mt-0.5 font-mono text-sm">{{ schemeInfo.id }}</p>
          </div>
          <div>
            <span class="text-xs text-muted-foreground">方案名称</span>
            <p class="mt-0.5 text-sm font-medium">{{ schemeInfo.name }}</p>
          </div>
          <div>
            <span class="text-xs text-muted-foreground">种植模式</span>
            <p class="mt-0.5 text-sm">{{ schemeInfo.plantingMode }}</p>
          </div>
          <div>
            <span class="text-xs text-muted-foreground">作物 / 品种</span>
            <p class="mt-0.5 text-sm">{{ schemeInfo.cropCategory }} · {{ schemeInfo.cropVariety }}</p>
          </div>
          <div>
            <span class="text-xs text-muted-foreground">所属单位</span>
            <p class="mt-0.5 text-sm">{{ schemeInfo.unit }}</p>
          </div>
          <div>
            <span class="text-xs text-muted-foreground">适用区域</span>
            <p class="mt-0.5 text-sm">{{ schemeInfo.applicableArea }}</p>
          </div>
          <div>
            <span class="text-xs text-muted-foreground">全生育周期总天数</span>
            <p class="mt-0.5 text-sm">{{ schemeInfo.totalDays }} 天</p>
          </div>
          <div>
            <span class="text-xs text-muted-foreground">方案版本</span>
            <p class="mt-0.5 text-sm">v{{ schemeInfo.version }}</p>
          </div>
        </div>
      </div>

      <!-- 第1行：计划编号 + 计划名称 -->
      <div class="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div>
          <label class="mb-1.5 block text-sm font-medium">
            种植计划编号 <span class="text-red-500">*</span>
            <span class="ml-2 text-xs text-muted-foreground font-normal">系统生成</span>
          </label>
          <input
            :value="form.planCode"
            type="text"
            readonly
            class="h-9 w-full rounded-md border border-input bg-muted px-3 py-1 text-sm text-muted-foreground cursor-not-allowed"
          />
        </div>
        <div>
          <label class="mb-1.5 block text-sm font-medium">
            种植计划名称 <span class="text-red-500">*</span>
          </label>
          <input
            v-model="form.planName"
            type="text"
            placeholder="请输入计划名称"
            class="h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus:outline-none focus:ring-1 focus:ring-ring"
          />
        </div>
      </div>

      <!-- 第2行：年份 + 所属单位 -->
      <div class="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div>
          <label class="mb-1.5 block text-sm font-medium">年份 <span class="text-red-500">*</span></label>
          <select
            v-model="form.year"
            class="h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus:outline-none focus:ring-1 focus:ring-ring"
          >
            <option value="">请选择</option>
            <option v-for="y in yearOptions" :key="y" :value="y">{{ y }}</option>
          </select>
        </div>
        <div>
          <label class="mb-1.5 block text-sm font-medium">所属单位 <span class="text-red-500">*</span></label>
          <input
            :value="form.unit"
            type="text"
            readonly
            class="h-9 w-full rounded-md border border-input bg-muted px-3 py-1 text-sm text-muted-foreground cursor-not-allowed"
          />
          <p class="mt-1 text-xs text-muted-foreground">来源于引用的种植方案</p>
        </div>
      </div>

      <!-- 第3行：种植模式 + 作物大类 + 作物品种 -->
      <div class="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div>
          <label class="mb-1.5 block text-sm font-medium">种植模式</label>
          <input
            :value="form.plantingMode"
            type="text"
            readonly
            class="h-9 w-full rounded-md border border-input bg-muted px-3 py-1 text-sm text-muted-foreground cursor-not-allowed"
          />
        </div>
        <div>
          <label class="mb-1.5 block text-sm font-medium">种植作物大类</label>
          <input
            :value="form.cropCategory"
            type="text"
            readonly
            class="h-9 w-full rounded-md border border-input bg-muted px-3 py-1 text-sm text-muted-foreground cursor-not-allowed"
          />
        </div>
        <div>
          <label class="mb-1.5 block text-sm font-medium">种植品种</label>
          <input
            :value="form.cropVariety"
            type="text"
            readonly
            class="h-9 w-full rounded-md border border-input bg-muted px-3 py-1 text-sm text-muted-foreground cursor-not-allowed"
          />
        </div>
      </div>

      <!-- 第4行：计划种植面积 + 执行负责人 -->
      <div class="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div>
          <label class="mb-1.5 block text-sm font-medium">计划种植总面积（亩）<span class="text-red-500">*</span></label>
          <input
            v-model.number="form.totalArea"
            type="number"
            min="0"
            placeholder="请输入计划种植面积"
            class="h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus:outline-none focus:ring-1 focus:ring-ring"
          />
        </div>
        <div>
          <label class="mb-1.5 block text-sm font-medium">执行负责人 <span class="text-red-500">*</span></label>
          <input
            v-model="form.execLeader"
            type="text"
            placeholder="请输入执行负责人"
            class="h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus:outline-none focus:ring-1 focus:ring-ring"
          />
        </div>
      </div>

      <!-- 第5行：计划开始时间 + 计划结束时间 -->
      <div class="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div>
          <label class="mb-1.5 block text-sm font-medium">计划开始时间 <span class="text-red-500">*</span></label>
          <input
            v-model="form.planStartDate"
            type="date"
            class="h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus:outline-none focus:ring-1 focus:ring-ring"
          />
        </div>
        <div>
          <label class="mb-1.5 block text-sm font-medium">计划结束时间 <span class="text-red-500">*</span></label>
          <input
            v-model="form.planEndDate"
            type="date"
            class="h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus:outline-none focus:ring-1 focus:ring-ring"
          />
        </div>
      </div>

      <!-- 第6行：编制人 + 编制时间 -->
      <div class="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div>
          <label class="mb-1.5 block text-sm font-medium">编制人 <span class="text-xs text-muted-foreground font-normal">自动代入</span></label>
          <input
            :value="form.author"
            type="text"
            readonly
            class="h-9 w-full rounded-md border border-input bg-muted px-3 py-1 text-sm text-muted-foreground cursor-not-allowed"
          />
        </div>
        <div>
          <label class="mb-1.5 block text-sm font-medium">编制时间 <span class="text-xs text-muted-foreground font-normal">自动代入</span></label>
          <input
            :value="form.compiledAt"
            type="text"
            readonly
            class="h-9 w-full rounded-md border border-input bg-muted px-3 py-1 text-sm text-muted-foreground cursor-not-allowed"
          />
        </div>
      </div>

      <!-- 第7行：审批状态 + 生效时间 -->
      <div class="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div>
          <label class="mb-1.5 block text-sm font-medium">审批状态</label>
          <div class="flex items-center h-9">
            <span class="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-gray-100 text-gray-700">草稿</span>
          </div>
        </div>
        <div>
          <label class="mb-1.5 block text-sm font-medium">生效时间</label>
          <input
            v-model="form.effectiveTime"
            type="date"
            class="h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus:outline-none focus:ring-1 focus:ring-ring"
          />
        </div>
      </div>

      <!-- 备注 -->
      <div>
        <label class="mb-1.5 block text-sm font-medium">备注</label>
        <textarea
          v-model="form.remark"
          rows="3"
          placeholder="请输入备注信息"
          class="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm transition-colors focus:outline-none focus:ring-1 focus:ring-ring resize-none"
        />
      </div>
    </div>

    <!-- Tab 2: 种植作业执行计划明细表 -->
    <div v-if="activeTab === 'farming'" class="space-y-4">
      <div class="flex items-center justify-between">
        <p class="text-sm text-muted-foreground">基于种植方案的农事作业标准，制定执行计划的时间安排</p>
        <button
          class="inline-flex items-center justify-center gap-1.5 rounded-md bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90"
          @click="addFarmingRow"
        >
          <Plus class="h-3.5 w-3.5" />
          添加明细
        </button>
      </div>
      <div class="rounded-lg border">
        <div class="overflow-x-auto">
          <table class="w-full text-sm" style="min-width:1800px">
            <thead>
              <tr class="border-b bg-muted/50">
                <th class="h-10 px-2 text-center font-medium text-muted-foreground" style="width:40px">序号</th>
                <th class="h-10 px-2 text-left font-medium text-muted-foreground" style="width:90px">生育时期</th>
                <th class="h-10 px-2 text-left font-medium text-muted-foreground" style="width:90px">生产流程</th>
                <th class="h-10 px-2 text-left font-medium text-muted-foreground" style="width:100px">作业环节</th>
                <th class="h-10 px-2 text-left font-medium text-muted-foreground" style="width:90px">农事作业<br/>生育期天数</th>
                <th class="h-10 px-2 text-left font-medium text-muted-foreground" style="width:130px">核心农事<br/>操作标准</th>
                <th class="h-10 px-2 text-left font-medium text-muted-foreground" style="width:110px">作业参数标准</th>
                <th class="h-10 px-2 text-left font-medium text-muted-foreground" style="width:90px">作业方式</th>
                <th class="h-10 px-2 text-left font-medium text-muted-foreground" style="width:110px">计划开始时间<span class="text-red-500">*</span></th>
                <th class="h-10 px-2 text-left font-medium text-muted-foreground" style="width:110px">计划结束时间<span class="text-red-500">*</span></th>
                <th class="h-10 px-2 text-left font-medium text-muted-foreground" style="width:110px">实际开始时间</th>
                <th class="h-10 px-2 text-left font-medium text-muted-foreground" style="width:110px">实际结束时间</th>
                <th class="h-10 px-2 text-center font-medium text-muted-foreground" style="width:70px">执行状态</th>
                <th class="h-10 px-2 text-left font-medium text-muted-foreground" style="width:100px">备注</th>
                <th class="h-10 px-2 text-center font-medium text-muted-foreground" style="width:50px">操作</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(row, idx) in form.farmingItems" :key="idx" class="border-b hover:bg-muted/30">
                <td class="h-12 px-2 text-center text-muted-foreground">{{ idx + 1 }}</td>
                <td class="h-12 px-2 text-sm">{{ row.growthPeriod }}</td>
                <td class="h-12 px-2 text-sm">{{ row.productionProcess }}</td>
                <td class="h-12 px-2 text-sm">{{ row.taskLink }}</td>
                <td class="h-12 px-2 text-sm">{{ row.farmingDays }}</td>
                <td class="h-12 px-2 text-sm">{{ row.coreStandard }}</td>
                <td class="h-12 px-2 text-sm">{{ row.paramStandard }}</td>
                <td class="h-12 px-2 text-sm">{{ row.workMethod }}</td>
                <td class="h-12 px-2">
                  <input v-model="row.planStartDate" type="date" class="h-8 w-full rounded border border-input bg-transparent px-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-ring" />
                </td>
                <td class="h-12 px-2">
                  <input v-model="row.planEndDate" type="date" class="h-8 w-full rounded border border-input bg-transparent px-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-ring" />
                </td>
                <td class="h-12 px-2">
                  <input v-model="row.actualStartDate" type="date" class="h-8 w-full rounded border border-input bg-transparent px-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-ring" />
                </td>
                <td class="h-12 px-2">
                  <input v-model="row.actualEndDate" type="date" class="h-8 w-full rounded border border-input bg-transparent px-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-ring" />
                </td>
                <td class="h-12 px-2 text-center">
                  <span :class="execStatusBadge(row.execStatus)">{{ execStatusLabel(row.execStatus) }}</span>
                </td>
                <td class="h-12 px-2">
                  <input v-model="row.remark" class="h-8 w-full rounded border border-input bg-transparent px-2 text-sm focus:outline-none focus:ring-1 focus:ring-ring" placeholder="备注" />
                </td>
                <td class="h-12 px-2 text-center">
                  <button class="text-red-500 hover:text-red-700" @click="removeFarmingRow(idx)">
                    <Trash2 class="h-4 w-4" />
                  </button>
                </td>
              </tr>
              <tr v-if="form.farmingItems.length === 0">
                <td colspan="15" class="p-6 text-center text-muted-foreground">暂无明细，点击"添加明细"新增</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Tab 3: 农资投入计划表 -->
    <div v-if="activeTab === 'material'" class="space-y-4">
      <div class="flex items-center justify-between">
        <p class="text-sm text-muted-foreground">基于种植方案的农资投入标准，制定农资采购和使用计划</p>
        <button
          class="inline-flex items-center justify-center gap-1.5 rounded-md bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90"
          @click="addMaterialRow"
        >
          <Plus class="h-3.5 w-3.5" />
          添加明细
        </button>
      </div>
      <div class="rounded-lg border">
        <div class="overflow-x-auto">
          <table class="w-full text-sm" style="min-width:1500px">
            <thead>
              <tr class="border-b bg-muted/50">
                <th class="h-10 px-2 text-center font-medium text-muted-foreground" style="width:40px">序号</th>
                <th class="h-10 px-2 text-left font-medium text-muted-foreground" style="width:90px">生育时期</th>
                <th class="h-10 px-2 text-left font-medium text-muted-foreground" style="width:90px">生产流程</th>
                <th class="h-10 px-2 text-left font-medium text-muted-foreground" style="width:90px">作业环节</th>
                <th class="h-10 px-2 text-left font-medium text-muted-foreground" style="width:80px">农资大类</th>
                <th class="h-10 px-2 text-left font-medium text-muted-foreground" style="width:90px">农资品类</th>
                <th class="h-10 px-2 text-left font-medium text-muted-foreground" style="width:110px">有效成分/规格</th>
                <th class="h-10 px-2 text-left font-medium text-muted-foreground" style="width:80px">标准用量</th>
                <th class="h-10 px-2 text-left font-medium text-muted-foreground" style="width:60px">计量单位</th>
                <th class="h-10 px-2 text-left font-medium text-muted-foreground" style="width:80px">施用方式</th>
                <th class="h-10 px-2 text-left font-medium text-muted-foreground" style="width:80px">计划用量<span class="text-red-500">*</span></th>
                <th class="h-10 px-2 text-left font-medium text-muted-foreground" style="width:80px">需求总量<span class="text-red-500">*</span></th>
                <th class="h-10 px-2 text-left font-medium text-muted-foreground" style="width:80px">需求使用<br/>时间</th>
                <th class="h-10 px-2 text-left font-medium text-muted-foreground" style="width:80px">安全间隔期<br/>(天)</th>
                <th class="h-10 px-2 text-left font-medium text-muted-foreground" style="width:100px">备注</th>
                <th class="h-10 px-2 text-center font-medium text-muted-foreground" style="width:50px">操作</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(row, idx) in form.materialItems" :key="idx" class="border-b hover:bg-muted/30">
                <td class="h-12 px-2 text-center text-muted-foreground">{{ idx + 1 }}</td>
                <td class="h-12 px-2 text-sm">{{ row.growthPeriod }}</td>
                <td class="h-12 px-2 text-sm">{{ row.productionProcess }}</td>
                <td class="h-12 px-2 text-sm">{{ row.taskLink }}</td>
                <td class="h-12 px-2 text-sm">{{ row.materialCategory }}</td>
                <td class="h-12 px-2 text-sm">{{ row.materialType }}</td>
                <td class="h-12 px-2 text-sm">{{ row.spec }}</td>
                <td class="h-12 px-2 text-sm">{{ row.standardDosage }} {{ row.unit }}</td>
                <td class="h-12 px-2 text-sm">{{ row.unit }}</td>
                <td class="h-12 px-2 text-sm">{{ row.applicationMethod }}</td>
                <td class="h-12 px-2">
                  <input v-model.number="row.planDosage" type="number" min="0" class="h-8 w-full rounded border border-input bg-transparent px-2 text-sm focus:outline-none focus:ring-1 focus:ring-ring" placeholder="计划用量" />
                </td>
                <td class="h-12 px-2">
                  <input v-model.number="row.demandTotal" type="number" min="0" class="h-8 w-full rounded border border-input bg-transparent px-2 text-sm focus:outline-none focus:ring-1 focus:ring-ring" placeholder="需求总量" />
                </td>
                <td class="h-12 px-2">
                  <input v-model="row.demandDate" type="date" class="h-8 w-full rounded border border-input bg-transparent px-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-ring" />
                </td>
                <td class="h-12 px-2 text-sm">{{ row.safetyInterval || '-' }}</td>
                <td class="h-12 px-2">
                  <input v-model="row.remark" class="h-8 w-full rounded border border-input bg-transparent px-2 text-sm focus:outline-none focus:ring-1 focus:ring-ring" placeholder="备注" />
                </td>
                <td class="h-12 px-2 text-center">
                  <button class="text-red-500 hover:text-red-700" @click="removeMaterialRow(idx)">
                    <Trash2 class="h-4 w-4" />
                  </button>
                </td>
              </tr>
              <tr v-if="form.materialItems.length === 0">
                <td colspan="16" class="p-6 text-center text-muted-foreground">暂无明细，点击"添加明细"新增</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ArrowLeft, Plus, Save, Send, Trash2 } from 'lucide-vue-next'
import { showToast } from '@/lib/toast'

const route = useRoute()
const router = useRouter()

// ==================== 已生效种植方案数据源 ====================
interface EffectiveScheme {
  id: string
  name: string
  plantingMode: string
  cropCategory: string
  cropVariety: string
  unit: string
  applicableArea: string
  totalDays: number
  version: number
  effectiveTime: string
}

const effectiveSchemesMap: Record<string, EffectiveScheme> = {
  'SP-2024-001': { id: 'SP-2024-001', name: '春季水稻高产方案', plantingMode: '大田种植', cropCategory: '水稻', cropVariety: '籼稻', unit: '松北农场', applicableArea: '松北平原', totalDays: 135, version: 2, effectiveTime: '2024-03-01' },
  'SP-2024-002': { id: 'SP-2024-002', name: '冬小麦越冬方案', plantingMode: '大田种植', cropCategory: '小麦', cropVariety: '强筋小麦', unit: '呼兰农场', applicableArea: '呼兰流域', totalDays: 230, version: 1, effectiveTime: '2024-02-01' },
  'SP-2024-005': { id: 'SP-2024-005', name: '棉花管理方案', plantingMode: '大田种植', cropCategory: '小麦', cropVariety: '强筋小麦', unit: '新民农场', applicableArea: '新民产区', totalDays: 180, version: 3, effectiveTime: '2024-03-15' },
  'SP-2024-007': { id: 'SP-2024-007', name: '花生覆膜方案', plantingMode: '大田种植', cropCategory: '小麦', cropVariety: '强筋小麦', unit: '双城分场', applicableArea: '双城产区', totalDays: 140, version: 1, effectiveTime: '2024-03-20' },
  'SP-2025-001': { id: 'SP-2025-001', name: '春季水稻高产方案(25)', plantingMode: '大田种植', cropCategory: '玉米', cropVariety: '甜玉米', unit: '松北农场', applicableArea: '松北平原', totalDays: 140, version: 1, effectiveTime: '2025-03-01' },
  'SP-2025-003': { id: 'SP-2025-003', name: '大棚番茄种植方案', plantingMode: '设施种植', cropCategory: '大豆', cropVariety: '高蛋白大豆', unit: '阿城农场', applicableArea: '阿城设施区', totalDays: 160, version: 2, effectiveTime: '2025-03-01' },
  'SP-2026-003': { id: 'SP-2026-003', name: '油菜机械化方案', plantingMode: '大田种植', cropCategory: '玉米', cropVariety: '糯玉米', unit: '辽中分场', applicableArea: '辽中产区', totalDays: 195, version: 1, effectiveTime: '2026-02-01' },
  'SP-2026-005': { id: 'SP-2026-005', name: '番茄无土栽培方案', plantingMode: '设施种植', cropCategory: '大豆', cropVariety: '高油大豆', unit: '阿城农场', applicableArea: '阿城设施区', totalDays: 165, version: 1, effectiveTime: '2026-03-10' },
}

// ==================== 引用方案 ====================
const schemeId = computed(() => (route.query.schemeId as string) || '')
const schemeInfo = computed(() => effectiveSchemesMap[schemeId.value] || {
  id: '', name: '', plantingMode: '', cropCategory: '', cropVariety: '',
  unit: '', applicableArea: '', totalDays: 0, version: 0, effectiveTime: '',
})

// ==================== 年份选项 ====================
const yearOptions = [2026, 2025, 2024, 2023]

// ==================== 选项卡 ====================
const tabs = [
  { key: 'basic', label: '基本信息' },
  { key: 'farming', label: '种植作业执行计划明细表' },
  { key: 'material', label: '农资投入计划表' },
]
const activeTab = ref('basic')

// ==================== 执行状态 ====================
type ExecStatus = 'pending' | 'in_progress' | 'completed' | 'delayed'

function execStatusLabel(status: ExecStatus): string {
  const map: Record<ExecStatus, string> = { pending: '待执行', in_progress: '执行中', completed: '已完成', delayed: '已延期' }
  return map[status] || '待执行'
}

function execStatusBadge(status: ExecStatus): string {
  const base = 'inline-flex items-center rounded-md px-1.5 py-0.5 text-xs font-medium'
  const map: Record<ExecStatus, string> = {
    pending: 'bg-gray-100 text-gray-600',
    in_progress: 'bg-blue-100 text-blue-700',
    completed: 'bg-green-100 text-green-700',
    delayed: 'bg-red-100 text-red-700',
  }
  return `${base} ${map[status] || map.pending}`
}

// ==================== 农事作业执行计划明细 ====================
interface FarmingExecItem {
  growthPeriod: string
  productionProcess: string
  taskLink: string
  farmingDays: number | ''
  coreStandard: string
  paramStandard: string
  workMethod: string
  planStartDate: string
  planEndDate: string
  actualStartDate: string
  actualEndDate: string
  execStatus: ExecStatus
  remark: string
}

// ==================== 农资投入计划明细 ====================
interface MaterialPlanItem {
  growthPeriod: string
  productionProcess: string
  taskLink: string
  materialCategory: string
  materialType: string
  spec: string
  standardDosage: number | ''
  unit: string
  applicationMethod: string
  planDosage: number | ''
  demandTotal: number | ''
  demandDate: string
  safetyInterval: number | ''
  remark: string
}

// ==================== 表单数据 ====================
interface PlanForm {
  planCode: string
  planName: string
  year: number | ''
  unit: string
  plantingMode: string
  cropCategory: string
  cropVariety: string
  totalArea: number | ''
  execLeader: string
  planStartDate: string
  planEndDate: string
  author: string
  compiledAt: string
  effectiveTime: string
  remark: string
  farmingItems: FarmingExecItem[]
  materialItems: MaterialPlanItem[]
}

const form = ref<PlanForm>({
  planCode: '',
  planName: '',
  year: new Date().getFullYear(),
  unit: schemeInfo.value.unit,
  plantingMode: schemeInfo.value.plantingMode,
  cropCategory: schemeInfo.value.cropCategory,
  cropVariety: schemeInfo.value.cropVariety,
  totalArea: '',
  execLeader: '',
  planStartDate: '',
  planEndDate: '',
  author: '当前用户',
  compiledAt: new Date().toLocaleDateString('zh-CN'),
  effectiveTime: '',
  remark: '',
  farmingItems: [],
  materialItems: [],
})

// ==================== 方案代入数据 ====================
function loadSchemeData(): void {
  const s = schemeInfo.value
  if (!s.id) return

  form.value.unit = s.unit
  form.value.plantingMode = s.plantingMode
  form.value.cropCategory = s.cropCategory
  form.value.cropVariety = s.cropVariety
  form.value.planName = `${s.name.replace('方案', '')}计划`

  // 代入农事作业执行计划
  if (s.cropCategory === '水稻') {
    form.value.farmingItems = [
      { growthPeriod: '播种期', productionProcess: '土壤准备', taskLink: '整地', farmingDays: 5, coreStandard: '耕深均匀，无大坷垃', paramStandard: '耕深≥30cm', workMethod: '农机作业', planStartDate: '', planEndDate: '', actualStartDate: '', actualEndDate: '', execStatus: 'pending', remark: '' },
      { growthPeriod: '播种期', productionProcess: '播种作业', taskLink: '播种', farmingDays: 3, coreStandard: '行距30cm，穴距15cm', paramStandard: '播深3-5cm', workMethod: '农机作业', planStartDate: '', planEndDate: '', actualStartDate: '', actualEndDate: '', execStatus: 'pending', remark: '' },
      { growthPeriod: '分蘖期', productionProcess: '田间管理', taskLink: '追肥', farmingDays: 7, coreStandard: '亩施尿素10kg', paramStandard: '施肥深度10cm', workMethod: '人工作业', planStartDate: '', planEndDate: '', actualStartDate: '', actualEndDate: '', execStatus: 'pending', remark: '' },
      { growthPeriod: '分蘖期', productionProcess: '田间管理', taskLink: '灌溉', farmingDays: 10, coreStandard: '浅水间歇灌溉', paramStandard: '水层3-5cm', workMethod: '智能设备作业', planStartDate: '', planEndDate: '', actualStartDate: '', actualEndDate: '', execStatus: 'pending', remark: '' },
      { growthPeriod: '拔节期', productionProcess: '植保防治', taskLink: '病虫害防治', farmingDays: 3, coreStandard: '及时发现及时防治', paramStandard: '用药浓度0.1%', workMethod: '无人机作业', planStartDate: '', planEndDate: '', actualStartDate: '', actualEndDate: '', execStatus: 'pending', remark: '' },
      { growthPeriod: '抽穗期', productionProcess: '水肥管理', taskLink: '追肥', farmingDays: 5, coreStandard: '穗肥追施', paramStandard: '亩施尿素5kg', workMethod: '人工作业', planStartDate: '', planEndDate: '', actualStartDate: '', actualEndDate: '', execStatus: 'pending', remark: '' },
      { growthPeriod: '灌浆期', productionProcess: '田间管理', taskLink: '灌溉', farmingDays: 15, coreStandard: '干湿交替灌溉', paramStandard: '水层2-3cm', workMethod: '智能设备作业', planStartDate: '', planEndDate: '', actualStartDate: '', actualEndDate: '', execStatus: 'pending', remark: '' },
      { growthPeriod: '成熟期', productionProcess: '收获作业', taskLink: '收获', farmingDays: 5, coreStandard: '适时收获，防止落粒', paramStandard: '含水率≤25%', workMethod: '农机作业', planStartDate: '', planEndDate: '', actualStartDate: '', actualEndDate: '', execStatus: 'pending', remark: '' },
    ]
  } else {
    form.value.farmingItems = [
      { growthPeriod: '播种期', productionProcess: '土壤准备', taskLink: '整地', farmingDays: 5, coreStandard: '耕深均匀，土壤细碎', paramStandard: '耕深≥25cm', workMethod: '农机作业', planStartDate: '', planEndDate: '', actualStartDate: '', actualEndDate: '', execStatus: 'pending', remark: '' },
      { growthPeriod: '播种期', productionProcess: '播种作业', taskLink: '播种', farmingDays: 3, coreStandard: '均匀播种，覆土压实', paramStandard: '播深4-5cm', workMethod: '农机作业', planStartDate: '', planEndDate: '', actualStartDate: '', actualEndDate: '', execStatus: 'pending', remark: '' },
      { growthPeriod: '生长期', productionProcess: '田间管理', taskLink: '追肥', farmingDays: 7, coreStandard: '科学追肥，促进生长', paramStandard: '亩施尿素8kg', workMethod: '人工作业', planStartDate: '', planEndDate: '', actualStartDate: '', actualEndDate: '', execStatus: 'pending', remark: '' },
      { growthPeriod: '生长期', productionProcess: '植保防治', taskLink: '病虫害防治', farmingDays: 3, coreStandard: '综合防治，绿色防控', paramStandard: '用药浓度0.08%', workMethod: '无人机作业', planStartDate: '', planEndDate: '', actualStartDate: '', actualEndDate: '', execStatus: 'pending', remark: '' },
      { growthPeriod: '成熟期', productionProcess: '收获作业', taskLink: '收获', farmingDays: 5, coreStandard: '适时收获，减少损失', paramStandard: '含水率≤20%', workMethod: '农机作业', planStartDate: '', planEndDate: '', actualStartDate: '', actualEndDate: '', execStatus: 'pending', remark: '' },
    ]
  }

  // 代入农资投入计划
  if (s.cropCategory === '水稻') {
    form.value.materialItems = [
      { growthPeriod: '播种期', productionProcess: '播种作业', taskLink: '播种', materialCategory: '种子', materialType: '水稻种子', spec: '松粳22', standardDosage: 4, unit: 'kg', applicationMethod: '机械撒播', planDosage: '', demandTotal: '', demandDate: '', safetyInterval: '', remark: '' },
      { growthPeriod: '播种期', productionProcess: '土壤准备', taskLink: '施基肥', materialCategory: '肥料', materialType: '复合肥', spec: '15-15-15', standardDosage: 25, unit: 'kg', applicationMethod: '机械撒施', planDosage: '', demandTotal: '', demandDate: '', safetyInterval: '', remark: '' },
      { growthPeriod: '分蘖期', productionProcess: '田间管理', taskLink: '追肥', materialCategory: '肥料', materialType: '尿素', spec: '46%含氮量', standardDosage: 10, unit: 'kg', applicationMethod: '人工撒施', planDosage: '', demandTotal: '', demandDate: '', safetyInterval: '', remark: '' },
      { growthPeriod: '拔节期', productionProcess: '植保防治', taskLink: '病虫害防治', materialCategory: '农药', materialType: '吡虫啉', spec: '10%可湿性粉剂', standardDosage: 0.5, unit: 'L', applicationMethod: '喷雾', planDosage: '', demandTotal: '', demandDate: '', safetyInterval: 15, remark: '' },
      { growthPeriod: '抽穗期', productionProcess: '水肥管理', taskLink: '追肥', materialCategory: '肥料', materialType: '尿素', spec: '46%含氮量', standardDosage: 5, unit: 'kg', applicationMethod: '人工撒施', planDosage: '', demandTotal: '', demandDate: '', safetyInterval: '', remark: '' },
    ]
  } else {
    form.value.materialItems = [
      { growthPeriod: '播种期', productionProcess: '播种作业', taskLink: '播种', materialCategory: '种子', materialType: `${s.cropCategory}种子`, spec: '标准种', standardDosage: 3, unit: 'kg', applicationMethod: '机械条播', planDosage: '', demandTotal: '', demandDate: '', safetyInterval: '', remark: '' },
      { growthPeriod: '播种期', productionProcess: '土壤准备', taskLink: '施基肥', materialCategory: '肥料', materialType: '复合肥', spec: '15-15-15', standardDosage: 20, unit: 'kg', applicationMethod: '机械撒施', planDosage: '', demandTotal: '', demandDate: '', safetyInterval: '', remark: '' },
      { growthPeriod: '生长期', productionProcess: '田间管理', taskLink: '追肥', materialCategory: '肥料', materialType: '尿素', spec: '46%含氮量', standardDosage: 8, unit: 'kg', applicationMethod: '人工撒施', planDosage: '', demandTotal: '', demandDate: '', safetyInterval: '', remark: '' },
      { growthPeriod: '生长期', productionProcess: '植保防治', taskLink: '病虫害防治', materialCategory: '农药', materialType: '草甘膦', spec: '41%水剂', standardDosage: 0.5, unit: 'L', applicationMethod: '喷雾', planDosage: '', demandTotal: '', demandDate: '', safetyInterval: 15, remark: '' },
    ]
  }
}

// ==================== 编号生成 ====================
function generateCode(): string {
  const prefix = 'ZJ'
  const year = new Date().getFullYear()
  const seq = String(Math.floor(Math.random() * 9000) + 1000)
  return `${prefix}-${year}-${seq}`
}

// ==================== 行操作 ====================
function addFarmingRow(): void {
  form.value.farmingItems.push({
    growthPeriod: '', productionProcess: '', taskLink: '', farmingDays: '',
    coreStandard: '', paramStandard: '', workMethod: '',
    planStartDate: '', planEndDate: '', actualStartDate: '', actualEndDate: '',
    execStatus: 'pending', remark: '',
  })
}

function removeFarmingRow(idx: number): void {
  form.value.farmingItems.splice(idx, 1)
}

function addMaterialRow(): void {
  form.value.materialItems.push({
    growthPeriod: '', productionProcess: '', taskLink: '',
    materialCategory: '', materialType: '', spec: '',
    standardDosage: '', unit: '', applicationMethod: '',
    planDosage: '', demandTotal: '', demandDate: '',
    safetyInterval: '', remark: '',
  })
}

function removeMaterialRow(idx: number): void {
  form.value.materialItems.splice(idx, 1)
}

// ==================== 保存/提交 ====================
function handleSave(): void {
  showToast({ message: '种植计划已保存为草稿', type: 'success' })
}

function handleSubmit(): void {
  if (!form.value.planName) {
    showToast({ message: '请填写计划名称', type: 'error' })
    return
  }
  if (!form.value.year) {
    showToast({ message: '请选择年份', type: 'error' })
    return
  }
  if (!form.value.totalArea) {
    showToast({ message: '请输入计划种植面积', type: 'error' })
    return
  }
  if (!form.value.execLeader) {
    showToast({ message: '请输入执行负责人', type: 'error' })
    return
  }
  showToast({ message: '已发送至：松北分场负责人进行审批（审批人：张三、李四）', type: 'success' })
}

function goBack(): void {
  router.push('/planting-schedule')
}

// ==================== 初始化 ====================
onMounted(() => {
  form.value.planCode = generateCode()
  loadSchemeData()
})
</script>
