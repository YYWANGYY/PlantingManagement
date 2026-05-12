<template>
  <div class="space-y-6">
    <!-- 页面标题 + 操作 -->
    <div class="flex items-center justify-between">
      <div class="flex items-center gap-3">
        <button class="text-muted-foreground hover:text-foreground" @click="goBack">
          <ArrowLeft class="h-5 w-5" />
        </button>
        <div>
          <h1 class="text-2xl font-bold tracking-tight">任务下发详情</h1>
          <p class="mt-0.5 text-sm text-muted-foreground">
            计划编号：{{ planInfo.planCode }} | {{ planInfo.planName }}
          </p>
        </div>
      </div>
      <div class="flex items-center gap-2">
        <span class="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium"
          :class="progressBadgeClass(planInfo.progressStatus)">
          {{ progressStatusLabel(planInfo.progressStatus) }}
        </span>
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

    <!-- Tab 1: 农事计划（只读） -->
    <div v-if="activeTab === 'plan'" class="space-y-6">
      <!-- 基本信息（只读） -->
      <div class="rounded-lg border">
        <div class="border-b bg-muted/30 px-4 py-3">
          <h3 class="text-sm font-semibold">基本信息</h3>
        </div>
        <div class="p-4">
          <div class="grid grid-cols-1 gap-4 lg:grid-cols-4">
            <div>
              <span class="text-xs text-muted-foreground">计划编号</span>
              <p class="mt-0.5 font-mono text-sm">{{ planInfo.planCode }}</p>
            </div>
            <div>
              <span class="text-xs text-muted-foreground">关联种植方案编号</span>
              <p class="mt-0.5 font-mono text-sm">{{ planInfo.schemeCode }}</p>
            </div>
            <div>
              <span class="text-xs text-muted-foreground">种植计划名称</span>
              <p class="mt-0.5 text-sm font-medium">{{ planInfo.planName }}</p>
            </div>
            <div>
              <span class="text-xs text-muted-foreground">所属单位</span>
              <p class="mt-0.5 text-sm">{{ planInfo.unit }}</p>
            </div>
            <div>
              <span class="text-xs text-muted-foreground">种植模式</span>
              <p class="mt-0.5 text-sm">{{ planInfo.plantingMode }}</p>
            </div>
            <div>
              <span class="text-xs text-muted-foreground">种植作物大类</span>
              <p class="mt-0.5 text-sm">{{ planInfo.cropCategory }}</p>
            </div>
            <div>
              <span class="text-xs text-muted-foreground">种植品种</span>
              <p class="mt-0.5 text-sm">{{ planInfo.cropVariety }}</p>
            </div>
            <div>
              <span class="text-xs text-muted-foreground">资产面积</span>
              <p class="mt-0.5 text-sm">{{ planInfo.assetArea }} 亩</p>
            </div>
            <div>
              <span class="text-xs text-muted-foreground">计划种植总面积</span>
              <p class="mt-0.5 text-sm">{{ planInfo.planArea }} 亩</p>
            </div>
            <div>
              <span class="text-xs text-muted-foreground">种植单元编码</span>
              <p class="mt-0.5 font-mono text-xs">{{ planInfo.resourceCodes }}</p>
            </div>
            <div>
              <span class="text-xs text-muted-foreground">计划播种/定植开始时间</span>
              <p class="mt-0.5 text-sm">{{ planInfo.planStartTime }}</p>
            </div>
            <div>
              <span class="text-xs text-muted-foreground">计划收获结束时间</span>
              <p class="mt-0.5 text-sm">{{ planInfo.planEndTime }}</p>
            </div>
            <div>
              <span class="text-xs text-muted-foreground">计划负责人</span>
              <p class="mt-0.5 text-sm">{{ planInfo.planLeader }}</p>
            </div>
            <div>
              <span class="text-xs text-muted-foreground">执行负责人</span>
              <p class="mt-0.5 text-sm">{{ planInfo.execLeader }}</p>
            </div>
            <div>
              <span class="text-xs text-muted-foreground">创建人</span>
              <p class="mt-0.5 text-sm">{{ planInfo.creator }}</p>
            </div>
            <div>
              <span class="text-xs text-muted-foreground">生效时间</span>
              <p class="mt-0.5 text-sm">{{ planInfo.effectiveTime }}</p>
            </div>
          </div>
          <div v-if="planInfo.remark" class="mt-4 pt-4 border-t">
            <span class="text-xs text-muted-foreground">备注</span>
            <p class="mt-0.5 text-sm">{{ planInfo.remark }}</p>
          </div>
        </div>
      </div>

      <!-- 种植作业执行计划明细表（只读） -->
      <div class="rounded-lg border">
        <div class="border-b bg-muted/30 px-4 py-3">
          <h3 class="text-sm font-semibold">种植作业执行计划明细表</h3>
        </div>
        <div class="overflow-x-auto">
          <table class="w-full text-sm">
            <thead>
              <tr class="border-b bg-muted/20">
                <th class="px-3 py-2 text-left font-medium whitespace-nowrap">序号</th>
                <th class="px-3 py-2 text-left font-medium whitespace-nowrap">生育时期</th>
                <th class="px-3 py-2 text-left font-medium whitespace-nowrap">生产流程</th>
                <th class="px-3 py-2 text-left font-medium whitespace-nowrap">作业环节</th>
                <th v-if="planInfo.plantingMode === '大田种植'" class="px-3 py-2 text-left font-medium whitespace-nowrap">最小叶龄</th>
                <th v-if="planInfo.plantingMode === '大田种植'" class="px-3 py-2 text-left font-medium whitespace-nowrap">最大叶龄</th>
                <th class="px-3 py-2 text-left font-medium whitespace-nowrap">核心农事操作标准</th>
                <th v-if="planInfo.plantingMode === '设施种植'" class="px-3 py-2 text-left font-medium whitespace-nowrap">设施环境管控要求</th>
                <th class="px-3 py-2 text-left font-medium whitespace-nowrap">计划开始时间</th>
                <th class="px-3 py-2 text-left font-medium whitespace-nowrap">计划结束时间</th>
                <th class="px-3 py-2 text-left font-medium whitespace-nowrap">作业参数要求</th>
                <th class="px-3 py-2 text-left font-medium whitespace-nowrap">作业方式</th>
                <th class="px-3 py-2 text-left font-medium whitespace-nowrap">计划作业面积(亩)</th>
                <th class="px-3 py-2 text-left font-medium whitespace-nowrap">计划作业设备/农机</th>
                <th class="px-3 py-2 text-left font-medium whitespace-nowrap">执行状态</th>
                <th class="px-3 py-2 text-left font-medium whitespace-nowrap">作业负责人</th>
                <th class="px-3 py-2 text-left font-medium whitespace-nowrap">作业执行人</th>
                <th class="px-3 py-2 text-left font-medium whitespace-nowrap">备注</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(row, idx) in farmingList" :key="idx" class="border-b hover:bg-muted/10">
                <td class="px-3 py-2">{{ idx + 1 }}</td>
                <td class="px-3 py-2">{{ row.growthStage }}</td>
                <td class="px-3 py-2">{{ row.productionProcess }}</td>
                <td class="px-3 py-2">{{ row.workStep }}</td>
                <td v-if="planInfo.plantingMode === '大田种植'" class="px-3 py-2">{{ row.minLeafAge ?? '-' }}</td>
                <td v-if="planInfo.plantingMode === '大田种植'" class="px-3 py-2">{{ row.maxLeafAge ?? '-' }}</td>
                <td class="px-3 py-2">{{ row.coreStandard }}</td>
                <td v-if="planInfo.plantingMode === '设施种植'" class="px-3 py-2">{{ row.envRequirement ?? '-' }}</td>
                <td class="px-3 py-2 whitespace-nowrap">{{ row.planStartTime }}</td>
                <td class="px-3 py-2 whitespace-nowrap">{{ row.planEndTime }}</td>
                <td class="px-3 py-2">{{ row.workParamReq }}</td>
                <td class="px-3 py-2">{{ row.workMethod }}</td>
                <td class="px-3 py-2">{{ row.planArea }}</td>
                <td class="px-3 py-2">{{ row.planEquipment || '-' }}</td>
                <td class="px-3 py-2">
                  <span class="inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium"
                    :class="execStatusBadge(row.execStatus)">
                    {{ execStatusLabel(row.execStatus) }}
                  </span>
                </td>
                <td class="px-3 py-2">{{ row.workLeader }}</td>
                <td class="px-3 py-2">{{ row.workExecutor }}</td>
                <td class="px-3 py-2">{{ row.remark || '-' }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- 农资投入计划表（只读） -->
      <div class="rounded-lg border">
        <div class="border-b bg-muted/30 px-4 py-3">
          <h3 class="text-sm font-semibold">农资投入计划表</h3>
        </div>
        <div class="overflow-x-auto">
          <table class="w-full text-sm">
            <thead>
              <tr class="border-b bg-muted/20">
                <th class="px-3 py-2 text-left font-medium whitespace-nowrap">序号</th>
                <th class="px-3 py-2 text-left font-medium whitespace-nowrap">生育时期</th>
                <th class="px-3 py-2 text-left font-medium whitespace-nowrap">生产流程</th>
                <th class="px-3 py-2 text-left font-medium whitespace-nowrap">作业环节</th>
                <th class="px-3 py-2 text-left font-medium whitespace-nowrap">农资大类</th>
                <th class="px-3 py-2 text-left font-medium whitespace-nowrap">农资品类</th>
                <th class="px-3 py-2 text-left font-medium whitespace-nowrap">有效成分/规格</th>
                <th class="px-3 py-2 text-left font-medium whitespace-nowrap">标准用量</th>
                <th class="px-3 py-2 text-left font-medium whitespace-nowrap">计量单位</th>
                <th class="px-3 py-2 text-left font-medium whitespace-nowrap">施用方式</th>
                <th class="px-3 py-2 text-left font-medium whitespace-nowrap">安全间隔期(天)</th>
                <th class="px-3 py-2 text-left font-medium whitespace-nowrap">备注</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(row, idx) in materialList" :key="idx" class="border-b hover:bg-muted/10">
                <td class="px-3 py-2">{{ idx + 1 }}</td>
                <td class="px-3 py-2">{{ row.growthStage }}</td>
                <td class="px-3 py-2">{{ row.productionProcess }}</td>
                <td class="px-3 py-2">{{ row.workStep }}</td>
                <td class="px-3 py-2">{{ row.materialCategory }}</td>
                <td class="px-3 py-2">{{ row.materialType }}</td>
                <td class="px-3 py-2">{{ row.spec }}</td>
                <td class="px-3 py-2">{{ row.standardDosage }}</td>
                <td class="px-3 py-2">{{ row.unit }}</td>
                <td class="px-3 py-2">{{ row.applyMethod }}</td>
                <td class="px-3 py-2">{{ row.safetyInterval ?? '-' }}</td>
                <td class="px-3 py-2">{{ row.remark || '-' }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Tab 2: 农事任务 -->
    <div v-if="activeTab === 'task'" class="space-y-4">
      <div class="flex items-center justify-between">
        <p class="text-sm text-muted-foreground">
          共 {{ taskList.length }} 条农事任务（与种植作业执行计划明细表一一对应）
        </p>
        <button
          class="inline-flex items-center justify-center gap-1.5 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90"
          @click="handleBatchIssue"
        >
          <Send class="h-4 w-4" />
          批量下发任务
        </button>
      </div>

      <!-- 任务卡片列表 -->
      <div v-for="(task, tIdx) in taskList" :key="tIdx" class="rounded-lg border">
        <!-- 卡片头 -->
        <div class="flex items-center justify-between border-b bg-muted/30 px-4 py-3">
          <div class="flex items-center gap-3">
            <span class="text-sm font-semibold">任务 {{ tIdx + 1 }}</span>
            <span class="inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium"
              :class="taskStatusBadge(task.taskStatus)">
              {{ taskStatusLabel(task.taskStatus) }}
            </span>
          </div>
          <div class="flex items-center gap-2">
            <span class="text-xs text-muted-foreground">子任务单编码：{{ task.taskCode }}</span>
            <button
              v-if="task.taskStatus === 'pending'"
              class="inline-flex items-center justify-center gap-1 rounded-md bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground shadow-sm transition-colors hover:bg-primary/90"
              @click="handleIssueSingle(tIdx)"
            >
              下发任务
            </button>
          </div>
        </div>

        <!-- 卡片内容：两列布局 -->
        <div class="p-4">
          <div class="grid grid-cols-1 gap-x-8 gap-y-3 lg:grid-cols-3">
            <!-- 计划编号 -->
            <div>
              <span class="text-xs text-muted-foreground">计划编号</span>
              <p class="mt-0.5 font-mono text-sm">{{ task.planCode }}</p>
            </div>
            <!-- 计划名称 -->
            <div>
              <span class="text-xs text-muted-foreground">计划名称</span>
              <p class="mt-0.5 text-sm">{{ task.planName }}</p>
            </div>
            <!-- 所属单位 -->
            <div>
              <span class="text-xs text-muted-foreground">所属单位</span>
              <p class="mt-0.5 text-sm">{{ task.unit }}</p>
            </div>
            <!-- 地块名称 -->
            <div>
              <label class="mb-1 block text-xs text-muted-foreground">地块名称 <span class="text-red-500">*</span></label>
              <select
                v-model="task.plotName"
                class="h-8 w-full rounded-md border border-input bg-transparent px-2 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring"
              >
                <option value="">请选择地块</option>
                <option v-for="p in plotOptions" :key="p.code" :value="p.name">{{ p.name }}</option>
              </select>
            </div>
            <!-- 地块类型 -->
            <div>
              <label class="mb-1 block text-xs text-muted-foreground">地块类型 <span class="text-red-500">*</span></label>
              <select
                v-model="task.plotType"
                class="h-8 w-full rounded-md border border-input bg-transparent px-2 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring"
              >
                <option value="">请选择</option>
                <option value="大田">大田</option>
                <option value="大棚">大棚</option>
                <option value="棚间地">棚间地</option>
                <option value="所属耕地">所属耕地</option>
              </select>
            </div>
            <!-- 计划作业面积 -->
            <div>
              <label class="mb-1 block text-xs text-muted-foreground">计划作业面积(亩) <span class="text-red-500">*</span></label>
              <input
                v-model.number="task.planArea"
                type="number"
                min="0"
                class="h-8 w-full rounded-md border border-input bg-transparent px-2 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring"
              />
            </div>
            <!-- 生育时期 -->
            <div>
              <span class="text-xs text-muted-foreground">生育时期</span>
              <p class="mt-0.5 text-sm">{{ task.growthStage }}</p>
            </div>
            <!-- 生产流程 -->
            <div>
              <span class="text-xs text-muted-foreground">生产流程</span>
              <p class="mt-0.5 text-sm">{{ task.productionProcess }}</p>
            </div>
            <!-- 作业环节 -->
            <div>
              <span class="text-xs text-muted-foreground">作业环节</span>
              <p class="mt-0.5 text-sm">{{ task.workStep }}</p>
            </div>
            <!-- 最小叶龄（仅大田） -->
            <div v-if="planInfo.plantingMode === '大田种植'">
              <span class="text-xs text-muted-foreground">最小叶龄</span>
              <p class="mt-0.5 text-sm">{{ task.minLeafAge ?? '-' }}</p>
            </div>
            <!-- 最大叶龄（仅大田） -->
            <div v-if="planInfo.plantingMode === '大田种植'">
              <span class="text-xs text-muted-foreground">最大叶龄</span>
              <p class="mt-0.5 text-sm">{{ task.maxLeafAge ?? '-' }}</p>
            </div>
            <!-- 核心农事操作标准 -->
            <div class="lg:col-span-2">
              <label class="mb-1 block text-xs text-muted-foreground">核心农事操作标准</label>
              <textarea
                v-model="task.coreStandard"
                rows="2"
                class="w-full rounded-md border border-input bg-transparent px-2 py-1 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring"
              />
            </div>
            <!-- 设施环境管控要求（仅设施） -->
            <div v-if="planInfo.plantingMode === '设施种植'" class="lg:col-span-2">
              <label class="mb-1 block text-xs text-muted-foreground">设施环境管控要求</label>
              <textarea
                v-model="task.envRequirement"
                rows="2"
                class="w-full rounded-md border border-input bg-transparent px-2 py-1 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring"
              />
            </div>
            <!-- 作业参数要求 -->
            <div>
              <label class="mb-1 block text-xs text-muted-foreground">作业参数要求</label>
              <input
                v-model="task.workParamReq"
                type="text"
                class="h-8 w-full rounded-md border border-input bg-transparent px-2 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring"
              />
            </div>
            <!-- 作业方式 -->
            <div>
              <label class="mb-1 block text-xs text-muted-foreground">作业方式</label>
              <select
                v-model="task.workMethod"
                class="h-8 w-full rounded-md border border-input bg-transparent px-2 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring"
              >
                <option value="">请选择</option>
                <option value="农机作业">农机作业</option>
                <option value="人工作业">人工作业</option>
                <option value="无人机作业">无人机作业</option>
                <option value="智能设备">智能设备</option>
              </select>
            </div>
            <!-- 计划开始时间 -->
            <div>
              <label class="mb-1 block text-xs text-muted-foreground">计划开始时间 <span class="text-red-500">*</span></label>
              <input
                v-model="task.planStartTime"
                type="date"
                class="h-8 w-full rounded-md border border-input bg-transparent px-2 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring"
              />
            </div>
            <!-- 计划结束时间 -->
            <div>
              <label class="mb-1 block text-xs text-muted-foreground">计划结束时间 <span class="text-red-500">*</span></label>
              <input
                v-model="task.planEndTime"
                type="date"
                class="h-8 w-full rounded-md border border-input bg-transparent px-2 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring"
              />
            </div>
            <!-- 计划农资需求 -->
            <div>
              <label class="mb-1 block text-xs text-muted-foreground">计划农资需求</label>
              <input
                v-model="task.materialDemand"
                type="text"
                placeholder="如：复合肥 50kg"
                class="h-8 w-full rounded-md border border-input bg-transparent px-2 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring"
              />
            </div>
            <!-- 计划作业设备/农机 -->
            <div>
              <label class="mb-1 block text-xs text-muted-foreground">计划作业设备/农机</label>
              <select
                v-model="task.planEquipment"
                class="h-8 w-full rounded-md border border-input bg-transparent px-2 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring"
              >
                <option value="">请选择</option>
                <option v-if="planInfo.plantingMode === '大田种植'" value="拖拉机">拖拉机</option>
                <option v-if="planInfo.plantingMode === '大田种植'" value="播种机">播种机</option>
                <option v-if="planInfo.plantingMode === '大田种植'" value="收割机">收割机</option>
                <option v-if="planInfo.plantingMode === '大田种植'" value="植保无人机">植保无人机</option>
                <option v-if="planInfo.plantingMode === '设施种植'" value="温控设备">温控设备</option>
                <option v-if="planInfo.plantingMode === '设施种植'" value="灌溉系统">灌溉系统</option>
                <option v-if="planInfo.plantingMode === '设施种植'" value="施肥机">施肥机</option>
              </select>
            </div>
            <!-- 作业负责人 -->
            <div>
              <label class="mb-1 block text-xs text-muted-foreground">作业负责人 <span class="text-red-500">*</span></label>
              <select
                v-model="task.workLeader"
                class="h-8 w-full rounded-md border border-input bg-transparent px-2 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring"
              >
                <option value="">请选择</option>
                <option v-for="p in personnelOptions" :key="p" :value="p">{{ p }}</option>
              </select>
            </div>
            <!-- 作业执行人 -->
            <div>
              <label class="mb-1 block text-xs text-muted-foreground">作业执行人 <span class="text-red-500">*</span></label>
              <select
                v-model="task.workExecutor"
                class="h-8 w-full rounded-md border border-input bg-transparent px-2 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring"
              >
                <option value="">请选择</option>
                <option v-for="p in personnelOptions" :key="p" :value="p">{{ p }}</option>
              </select>
            </div>
            <!-- 备注 -->
            <div class="lg:col-span-3">
              <label class="mb-1 block text-xs text-muted-foreground">备注</label>
              <textarea
                v-model="task.remark"
                rows="2"
                placeholder="请输入备注信息"
                class="w-full rounded-md border border-input bg-transparent px-2 py-1 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ArrowLeft, Send } from 'lucide-vue-next'
import { showToast } from '@/lib/toast'

const route = useRoute()
const router = useRouter()

type ProgressStatus = 'not_effective' | 'pending_issue' | 'executing' | 'partial_complete' | 'all_complete' | 'archived' | 'voided'
type ExecStatus = 'pending' | 'to_execute' | 'executing' | 'completed' | 'overdue' | 'cancelled'
type TaskStatus = 'pending' | 'issued' | 'executing' | 'completed' | 'overdue' | 'cancelled'

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
  resourceCodes: string
  planStartTime: string
  planEndTime: string
  planLeader: string
  execLeader: string
  creator: string
  effectiveTime: string
  progressStatus: ProgressStatus
  remark: string
}

interface FarmingExecRow {
  growthStage: string
  productionProcess: string
  workStep: string
  minLeafAge?: number
  maxLeafAge?: number
  coreStandard: string
  envRequirement?: string
  planStartTime: string
  planEndTime: string
  workParamReq: string
  workMethod: string
  planArea: number
  planEquipment: string
  execStatus: ExecStatus
  workLeader: string
  workExecutor: string
  remark: string
}

interface MaterialRow {
  growthStage: string
  productionProcess: string
  workStep: string
  materialCategory: string
  materialType: string
  spec: string
  standardDosage: string
  unit: string
  applyMethod: string
  safetyInterval?: number
  remark: string
}

interface TaskItem {
  taskCode: string
  planCode: string
  planName: string
  unit: string
  plotName: string
  plotType: string
  planArea: number
  growthStage: string
  productionProcess: string
  workStep: string
  minLeafAge?: number
  maxLeafAge?: number
  coreStandard: string
  envRequirement: string
  workParamReq: string
  workMethod: string
  planStartTime: string
  planEndTime: string
  materialDemand: string
  planEquipment: string
  workLeader: string
  workExecutor: string
  taskStatus: TaskStatus
  remark: string
}

const tabs = [
  { key: 'plan', label: '农事计划' },
  { key: 'task', label: '农事任务' },
]
const activeTab = ref('task') // 默认选中农事任务

const planInfo = ref<PlanInfo>({
  planCode: '',
  schemeCode: '',
  planName: '',
  unit: '',
  plantingMode: '',
  cropCategory: '',
  cropVariety: '',
  assetArea: 0,
  planArea: 0,
  resourceCodes: '',
  planStartTime: '',
  planEndTime: '',
  planLeader: '',
  execLeader: '',
  creator: '',
  effectiveTime: '',
  progressStatus: 'pending_issue',
  remark: '',
})

const farmingList = ref<FarmingExecRow[]>([])
const materialList = ref<MaterialRow[]>([])
const taskList = ref<TaskItem[]>([])

const plotOptions = [
  { code: 'JH0077001', name: '良乡地块A-01' },
  { code: 'JH0077002', name: '良乡地块A-02' },
  { code: 'JH0077003', name: '良乡地块B-01' },
  { code: 'JH0078001', name: '通州地块C-01' },
  { code: 'JH0078002', name: '通州地块C-02' },
  { code: 'JH0079001', name: '唐山地块D-01' },
]

const personnelOptions = ['张三', '李四', '王五', '赵六', '孙七', '周八']

// ==================== 状态映射 ====================
function progressStatusLabel(status: ProgressStatus): string {
  const map: Record<ProgressStatus, string> = {
    not_effective: '未生效',
    pending_issue: '待下发',
    executing: '执行中',
    partial_complete: '部分完成',
    all_complete: '全部完成',
    archived: '已归档',
    voided: '已作废',
  }
  return map[status] ?? status
}

function progressBadgeClass(status: ProgressStatus): string {
  const map: Record<ProgressStatus, string> = {
    not_effective: 'bg-blue-50 text-blue-700',
    pending_issue: 'bg-amber-50 text-amber-700',
    executing: 'bg-green-50 text-green-700',
    partial_complete: 'bg-cyan-50 text-cyan-700',
    all_complete: 'bg-emerald-50 text-emerald-700',
    archived: 'bg-gray-100 text-gray-600',
    voided: 'bg-red-50 text-red-600',
  }
  return map[status] ?? 'bg-gray-100 text-gray-600'
}

function execStatusLabel(status: ExecStatus): string {
  const map: Record<ExecStatus, string> = {
    pending: '待下发',
    to_execute: '待执行',
    executing: '执行中',
    completed: '已完成',
    overdue: '已逾期',
    cancelled: '已取消',
  }
  return map[status] ?? status
}

function execStatusBadge(status: ExecStatus): string {
  const map: Record<ExecStatus, string> = {
    pending: 'bg-amber-50 text-amber-700',
    to_execute: 'bg-blue-50 text-blue-700',
    executing: 'bg-green-50 text-green-700',
    completed: 'bg-emerald-50 text-emerald-700',
    overdue: 'bg-red-50 text-red-600',
    cancelled: 'bg-gray-100 text-gray-500',
  }
  return map[status] ?? 'bg-gray-100 text-gray-500'
}

function taskStatusLabel(status: TaskStatus): string {
  const map: Record<TaskStatus, string> = {
    pending: '待下发',
    issued: '已下发',
    executing: '执行中',
    completed: '已完成',
    overdue: '已逾期',
    cancelled: '已取消',
  }
  return map[status] ?? status
}

function taskStatusBadge(status: TaskStatus): string {
  const map: Record<TaskStatus, string> = {
    pending: 'bg-amber-50 text-amber-700',
    issued: 'bg-blue-50 text-blue-700',
    executing: 'bg-green-50 text-green-700',
    completed: 'bg-emerald-50 text-emerald-700',
    overdue: 'bg-red-50 text-red-600',
    cancelled: 'bg-gray-100 text-gray-500',
  }
  return map[status] ?? 'bg-gray-100 text-gray-500'
}

// ==================== 数据加载 ====================
onMounted(() => {
  loadMockData()
})

function loadMockData(): void {
  // 模拟计划基本信息
  planInfo.value = {
    planCode: 'ZJ2025-001',
    schemeCode: 'FA2025-WH-001',
    planName: '2025年北京公司小麦种植计划',
    unit: '北京公司',
    plantingMode: '大田种植',
    cropCategory: '粮食',
    cropVariety: '冬小麦',
    assetArea: 1200,
    planArea: 1000,
    resourceCodes: 'JH0077, JH0078, JH0079',
    planStartTime: '2025-03-01',
    planEndTime: '2025-07-15',
    planLeader: '张三',
    execLeader: '李四',
    creator: '管理员',
    effectiveTime: '2025-02-20',
    progressStatus: 'pending_issue',
    remark: '2025年度冬小麦种植计划，覆盖北京公司全部大田区域',
  }

  // 模拟种植作业执行计划明细
  farmingList.value = [
    { growthStage: '播种期', productionProcess: '备耕', workStep: '深松整地作业', coreStandard: '深松深度≥30cm，无漏耕', planStartTime: '2025-03-01', planEndTime: '2025-03-05', workParamReq: '深度30-35cm', workMethod: '农机作业', planArea: 1000, planEquipment: '拖拉机', execStatus: 'pending', workLeader: '张三', workExecutor: '李四', remark: '' },
    { growthStage: '播种期', productionProcess: '春耕', workStep: '播种作业', coreStandard: '播种均匀，播深3-5cm', planStartTime: '2025-03-06', planEndTime: '2025-03-12', workParamReq: '行距20cm，播深3-5cm', workMethod: '农机作业', planArea: 1000, planEquipment: '播种机', execStatus: 'pending', workLeader: '张三', workExecutor: '李四', remark: '' },
    { growthStage: '出苗期', productionProcess: '田间管理', workStep: '查苗补苗作业', coreStandard: '缺苗率≤3%', planStartTime: '2025-03-20', planEndTime: '2025-03-25', workParamReq: '补苗密度与原播一致', workMethod: '人工作业', planArea: 1000, planEquipment: '', execStatus: 'pending', workLeader: '张三', workExecutor: '王五', remark: '' },
    { growthStage: '返青期', productionProcess: '追肥', workStep: '追肥作业', coreStandard: '追施返青肥，亩施尿素10kg', planStartTime: '2025-04-01', planEndTime: '2025-04-05', workParamReq: '亩施尿素10-12kg', workMethod: '农机作业', planArea: 1000, planEquipment: '施肥机', execStatus: 'pending', workLeader: '张三', workExecutor: '李四', remark: '' },
    { growthStage: '拔节期', productionProcess: '田间管理', workStep: '病虫害防治作业', coreStandard: '蚜虫防治，吡虫啉喷施', planStartTime: '2025-04-15', planEndTime: '2025-04-20', workParamReq: '吡虫啉1500倍液喷雾', workMethod: '无人机作业', planArea: 1000, planEquipment: '植保无人机', execStatus: 'pending', workLeader: '张三', workExecutor: '赵六', remark: '用药类操作' },
    { growthStage: '抽穗期', productionProcess: '田间管理', workStep: '灌溉作业', coreStandard: '保证抽穗期水分充足', planStartTime: '2025-05-01', planEndTime: '2025-05-05', workParamReq: '灌水量50m³/亩', workMethod: '智能设备', planArea: 1000, planEquipment: '灌溉系统', execStatus: 'pending', workLeader: '张三', workExecutor: '孙七', remark: '' },
    { growthStage: '灌浆期', productionProcess: '田间管理', workStep: '叶面喷肥作业', coreStandard: '磷酸二氢钾叶面喷施', planStartTime: '2025-05-15', planEndTime: '2025-05-18', workParamReq: '0.3%浓度叶面喷施', workMethod: '无人机作业', planArea: 1000, planEquipment: '植保无人机', execStatus: 'pending', workLeader: '张三', workExecutor: '赵六', remark: '' },
    { growthStage: '成熟期', productionProcess: '收获', workStep: '收割作业', coreStandard: '适时收获，减损率≤3%', planStartTime: '2025-07-01', planEndTime: '2025-07-15', workParamReq: '含水率≤14%', workMethod: '农机作业', planArea: 1000, planEquipment: '收割机', execStatus: 'pending', workLeader: '张三', workExecutor: '李四', remark: '' },
  ]

  // 模拟农资投入计划
  materialList.value = [
    { growthStage: '播种期', productionProcess: '备耕', workStep: '深松整地作业', materialCategory: '肥料', materialType: '复合肥', spec: 'N-P-K 15-15-15', standardDosage: '50', unit: 'kg/亩', applyMethod: '基肥撒施', safetyInterval: undefined, remark: '' },
    { growthStage: '播种期', productionProcess: '春耕', workStep: '播种作业', materialCategory: '种子', materialType: '冬小麦种子', spec: '济麦22', standardDosage: '12', unit: 'kg/亩', applyMethod: '机械播种', safetyInterval: undefined, remark: '' },
    { growthStage: '播种期', productionProcess: '春耕', workStep: '播种作业', materialCategory: '农药', materialType: '种衣剂', spec: '戊唑醇·吡虫啉', standardDosage: '200', unit: 'ml/亩', applyMethod: '拌种', safetyInterval: 30, remark: '' },
    { growthStage: '返青期', productionProcess: '追肥', workStep: '追肥作业', materialCategory: '肥料', materialType: '尿素', spec: '含氮量≥46%', standardDosage: '10', unit: 'kg/亩', applyMethod: '机械追施', safetyInterval: undefined, remark: '' },
    { growthStage: '拔节期', productionProcess: '田间管理', workStep: '病虫害防治作业', materialCategory: '农药', materialType: '吡虫啉', spec: '10%可湿性粉剂', standardDosage: '30', unit: 'g/亩', applyMethod: '喷雾', safetyInterval: 14, remark: '用药类操作' },
    { growthStage: '灌浆期', productionProcess: '田间管理', workStep: '叶面喷肥作业', materialCategory: '肥料', materialType: '磷酸二氢钾', spec: '含量≥98%', standardDosage: '200', unit: 'g/亩', applyMethod: '叶面喷施', safetyInterval: undefined, remark: '' },
  ]

  // 农事任务 - 与种植作业执行计划明细表一对一
  taskList.value = farmingList.value.map((row, idx) => ({
    taskCode: `TASK-${planInfo.value.planCode}-${String(idx + 1).padStart(3, '0')}`,
    planCode: planInfo.value.planCode,
    planName: planInfo.value.planName,
    unit: planInfo.value.unit,
    plotName: '',
    plotType: '',
    planArea: row.planArea,
    growthStage: row.growthStage,
    productionProcess: row.productionProcess,
    workStep: row.workStep,
    minLeafAge: row.minLeafAge,
    maxLeafAge: row.maxLeafAge,
    coreStandard: row.coreStandard,
    envRequirement: row.envRequirement ?? '',
    workParamReq: row.workParamReq,
    workMethod: row.workMethod,
    planStartTime: row.planStartTime,
    planEndTime: row.planEndTime,
    materialDemand: '',
    planEquipment: row.planEquipment,
    workLeader: row.workLeader,
    workExecutor: row.workExecutor,
    taskStatus: 'pending' as TaskStatus,
    remark: '',
  }))
}

// ==================== 操作 ====================
function goBack(): void {
  router.push('/planting-schedule')
}

function handleIssueSingle(idx: number): void {
  taskList.value[idx].taskStatus = 'issued'
  showToast({ message: `任务 ${idx + 1} 已下发成功`, type: 'success' })
}

function handleBatchIssue(): void {
  let count = 0
  taskList.value.forEach((t) => {
    if (t.taskStatus === 'pending') {
      t.taskStatus = 'issued'
      count++
    }
  })
  showToast({ message: `已批量下发 ${count} 条任务`, type: 'success' })
}
</script>
