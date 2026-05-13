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
              <span class="text-xs text-muted-foreground">关联种植方案名称</span>
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

      <!-- 资源信息（只读） -->
      <div class="rounded-lg border">
        <div class="border-b bg-muted/30 px-4 py-3">
          <h3 class="text-sm font-semibold">种植资源信息</h3>
        </div>
        <div class="overflow-x-auto">
          <table class="w-full text-sm">
            <thead>
              <tr class="border-b bg-muted/20">
                <th class="px-4 py-2 text-left font-medium whitespace-nowrap">序号</th>
                <th class="px-4 py-2 text-left font-medium whitespace-nowrap">地块编号</th>
                <th class="px-4 py-2 text-left font-medium whitespace-nowrap">地块名称</th>
                <th class="px-4 py-2 text-left font-medium whitespace-nowrap">地块类型</th>
                <th class="px-4 py-2 text-left font-medium whitespace-nowrap">地块面积(亩)</th>
                <th class="px-4 py-2 text-left font-medium whitespace-nowrap">所属园区/农场</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(r, idx) in resourceList" :key="idx" class="border-b hover:bg-muted/10">
                <td class="px-4 py-2">{{ idx + 1 }}</td>
                <td class="px-4 py-2 font-mono text-xs">{{ r.code }}</td>
                <td class="px-4 py-2">{{ r.name }}</td>
                <td class="px-4 py-2">{{ r.type }}</td>
                <td class="px-4 py-2">{{ r.area }}</td>
                <td class="px-4 py-2">{{ r.belong }}</td>
               
              </tr>
            </tbody>
          </table>
        </div>
        <div class="border-t bg-muted/10 px-4 py-2 text-sm text-muted-foreground">
          共 {{ resourceList.length }} 个地块，资产面积合计：{{ planInfo.assetArea }} 亩
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

    <!-- Tab 2: 农事任务（列表只读 + 批量下发） -->
    <div v-if="activeTab === 'task'" class="space-y-4">
      <!-- 批量操作栏 -->
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-4">
          <label class="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              :checked="isAllSelected && pendingCount > 0"
              :indeterminate="selectedCount > 0 && !isAllSelected"
              class="h-4 w-4 rounded border-gray-300"
              @change="toggleSelectAll"
            />
            <span class="text-sm text-muted-foreground">全选（已选 {{ selectedCount }}/{{ pendingCount }} 条待下发）</span>
          </label>
          <button
            class="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
            @click="toggleCollapseAll"
          >
            <component :is="allCollapsed ? ChevronsDown : ChevronsUp" class="h-4 w-4" />
            {{ allCollapsed ? '全部展开' : '全部折叠' }}
          </button>
        </div>
        <button
          :disabled="selectedTaskCodes.size === 0"
          class="inline-flex items-center justify-center gap-1.5 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
          @click="openDispatchDialog('batch')"
        >
          <Send class="h-4 w-4" />
          批量下发
        </button>
      </div>

      <!-- 任务卡片列表 -->
      <div class="space-y-4">
        <div
          v-for="(task, tIdx) in paginatedTasks"
          :key="tIdx"
          class="rounded-lg border bg-background shadow-sm overflow-hidden transition-shadow hover:shadow-md"
        >
          <!-- 卡片头部 -->
          <div
            class="flex items-center justify-between px-5 py-3 bg-muted/30 border-b select-none"
          >
            <div class="flex items-center gap-3 min-w-0">
              <input
                v-if="task.taskStatus === 'pending'"
                type="checkbox"
                :checked="selectedTaskCodes.has(task.taskCode)"
                class="h-4 w-4 rounded border-gray-300 shrink-0"
                @click.stop
                @change="toggleSelect(task.taskCode)"
              />
              <button
                class="inline-flex items-center justify-center h-6 w-6 rounded hover:bg-muted transition-colors shrink-0"
                :title="isCardCollapsed(task.taskCode) ? '展开' : '折叠'"
                @click="toggleCardCollapse(task.taskCode)"
              >
                <component
                  :is="isCardCollapsed(task.taskCode) ? ChevronRight : ChevronDown"
                  class="h-4 w-4 text-muted-foreground transition-transform duration-200"
                />
              </button>
              <span class="text-sm font-semibold shrink-0">第 {{ (taskCurrentPage - 1) * taskPageSize + tIdx + 1 }} 项</span>
              <span class="text-xs text-muted-foreground font-mono truncate">{{ task.taskCode }}</span>
              <span
                class="inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium shrink-0"
                :class="taskStatusBadge(task.taskStatus)"
              >
                {{ taskStatusLabel(task.taskStatus) }}
              </span>
              <!-- 折叠时显示摘要信息 -->
              <template v-if="isCardCollapsed(task.taskCode)">
                <span class="text-xs text-muted-foreground hidden lg:inline">|</span>
                <span class="text-xs text-muted-foreground hidden lg:inline truncate">{{ task.growthStage }} · {{ task.workStep }}</span>
                <span class="text-xs text-muted-foreground hidden xl:inline truncate">{{ task.planStartTime }} ~ {{ task.planEndTime }}</span>
                <span class="text-xs text-muted-foreground hidden xl:inline">{{ task.planArea }} 亩</span>
              </template>
            </div>
            <div class="flex items-center gap-2 shrink-0">
              <button
                v-if="task.taskStatus === 'pending'"
                class="text-primary hover:text-primary/80 text-xs font-medium"
                @click.stop="openDispatchDialog('single', task.taskCode)"
              >
                下发
              </button>
            </div>
          </div>

          <!-- 卡片内容（可折叠，带过渡动画） -->
          <Transition
            name="card-collapse"
            @before-enter="onBeforeEnter"
            @enter="onEnter"
            @after-enter="onAfterEnter"
            @before-leave="onBeforeLeave"
            @leave="onLeave"
            @after-leave="onAfterLeave"
          >
            <div v-show="!isCardCollapsed(task.taskCode)">
              <!-- 基本信息 -->
              <div class="px-5 py-4">
                <h4 class="text-sm font-semibold mb-3 text-foreground/80">基本信息</h4>
                <div class="grid grid-cols-4 gap-x-6 gap-y-2.5 text-sm">
                  <div><span class="text-muted-foreground">计划编号：</span>{{ task.planCode }}</div>
                  <div><span class="text-muted-foreground">计划名称：</span>{{ task.planName }}</div>
                  <div><span class="text-muted-foreground">所属单位：</span>{{ task.unit }}</div>
                  <div><span class="text-muted-foreground">地块名称：</span>{{ task.plotName || '-' }}</div>
                  <div><span class="text-muted-foreground">地块类型：</span>{{ task.plotType || '-' }}</div>
                  <div><span class="text-muted-foreground">计划作业面积：</span>{{ task.planArea }} 亩</div>
                  <div><span class="text-muted-foreground">生育时期：</span>{{ task.growthStage }}</div>
                  <div><span class="text-muted-foreground">生产流程：</span>{{ task.productionProcess }}</div>
                  <div><span class="text-muted-foreground">作业环节：</span>{{ task.workStep }}</div>
                  <div v-if="planInfo.plantingMode === '大田种植'"><span class="text-muted-foreground">最小叶龄：</span>{{ task.minLeafAge ?? '-' }}</div>
                  <div v-if="planInfo.plantingMode === '大田种植'"><span class="text-muted-foreground">最大叶龄：</span>{{ task.maxLeafAge ?? '-' }}</div>
                  <div><span class="text-muted-foreground">核心农事操作标准：</span>{{ task.coreStandard || '-' }}</div>
                  <div v-if="planInfo.plantingMode === '设施种植'"><span class="text-muted-foreground">设施环境管控要求：</span>{{ task.envRequirement || '-' }}</div>
                  <div><span class="text-muted-foreground">作业参数要求：</span>{{ task.workParamReq || '-' }}</div>
                  <div><span class="text-muted-foreground">作业方式：</span>{{ task.workMethod || '-' }}</div>
                  <div><span class="text-muted-foreground">计划开始时间：</span>{{ task.planStartTime }}</div>
                  <div><span class="text-muted-foreground">计划结束时间：</span>{{ task.planEndTime }}</div>
                  <div><span class="text-muted-foreground">计划作业设备/农机：</span>{{ task.planEquipment || '-' }}</div>
                  <div><span class="text-muted-foreground">作业负责人：</span>{{ task.workLeader }}</div>
                  <div><span class="text-muted-foreground">作业执行人：</span>{{ task.workExecutor }}</div>
                  <div class="col-span-4"><span class="text-muted-foreground">备注：</span>{{ task.remark || '-' }}</div>
                </div>
              </div>

              <!-- 计划农资需求明细 -->
              <div class="px-5 pb-4">
                <h4 class="text-sm font-semibold mb-3 text-foreground/80">计划农资需求明细</h4>
                <div class="rounded-md border overflow-hidden">
                  <table class="w-full text-xs">
                    <thead>
                      <tr class="border-b bg-muted/20">
                        <th class="px-2 py-1.5 text-left font-medium whitespace-nowrap">任务编号</th>
                        <th class="px-2 py-1.5 text-left font-medium whitespace-nowrap">农资大类</th>
                        <th class="px-2 py-1.5 text-left font-medium whitespace-nowrap">农资品类</th>
                        <th class="px-2 py-1.5 text-left font-medium whitespace-nowrap">有效成分/规格</th>
                        <th class="px-2 py-1.5 text-left font-medium whitespace-nowrap">标准用量</th>
                        <th class="px-2 py-1.5 text-left font-medium whitespace-nowrap">计量单位</th>
                        <th class="px-2 py-1.5 text-left font-medium whitespace-nowrap">原计划耗用数量</th>
                        <th class="px-2 py-1.5 text-left font-medium whitespace-nowrap">计划投入预算(元)</th>
                        <th class="px-2 py-1.5 text-left font-medium whitespace-nowrap">需求使用时间</th>
                        <th class="px-2 py-1.5 text-left font-medium whitespace-nowrap">责任人</th>
                        <th class="px-2 py-1.5 text-left font-medium whitespace-nowrap">计划单价(元)</th>
                        <th class="px-2 py-1.5 text-left font-medium whitespace-nowrap">备注</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-if="task.materialDetails.length === 0">
                        <td colspan="12" class="px-2 py-3 text-center text-muted-foreground">暂无农资需求明细</td>
                      </tr>
                      <tr v-for="(m, mIdx) in task.materialDetails" :key="mIdx" class="border-b last:border-b-0 hover:bg-muted/10">
                        <td class="px-2 py-1.5 font-mono">{{ m.taskCode }}</td>
                        <td class="px-2 py-1.5">{{ m.materialCategory }}</td>
                        <td class="px-2 py-1.5">{{ m.materialType }}</td>
                        <td class="px-2 py-1.5">{{ m.specification }}</td>
                        <td class="px-2 py-1.5">{{ m.standardDosage }}</td>
                        <td class="px-2 py-1.5">{{ m.unit }}</td>
                        <td class="px-2 py-1.5">{{ m.plannedQuantity }}</td>
                        <td class="px-2 py-1.5">{{ m.plannedBudget.toFixed(2) }}</td>
                        <td class="px-2 py-1.5 whitespace-nowrap">{{ m.demandTime }}</td>
                        <td class="px-2 py-1.5">{{ m.responsiblePerson }}</td>
                        <td class="px-2 py-1.5">{{ m.unitPrice.toFixed(2) }}</td>
                        <td class="px-2 py-1.5">{{ m.remark || '-' }}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </Transition>
        </div>
      </div>

      <!-- 分页 + 批量操作 -->
      <div class="flex items-center justify-between px-4 py-3 border rounded-b-lg bg-background">
        <div class="flex items-center gap-3">
          <span class="text-sm text-muted-foreground">共 {{ taskList.length }} 条</span>
          <span v-if="selectedTaskCodes.size > 0" class="text-sm text-primary font-medium">
            已选 {{ selectedTaskCodes.size }} 条
          </span>
        </div>
        <div class="flex items-center gap-1">
          <button
            class="inline-flex h-8 w-8 items-center justify-center rounded-md border text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            :disabled="taskCurrentPage === 1"
            @click="taskCurrentPage = 1"
          >
            <ChevronsLeft class="h-4 w-4" />
          </button>
          <button
            class="inline-flex h-8 w-8 items-center justify-center rounded-md border text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            :disabled="taskCurrentPage === 1"
            @click="taskCurrentPage--"
          >
            <ChevronLeft class="h-4 w-4" />
          </button>
          <template v-for="page in taskVisiblePages" :key="page">
            <span v-if="page === '...'" class="px-1 text-sm text-muted-foreground">...</span>
            <button
              v-else
              class="inline-flex h-8 w-8 items-center justify-center rounded-md border text-sm"
              :class="taskCurrentPage === page ? 'bg-primary text-primary-foreground border-primary' : ''"
              @click="taskCurrentPage = page as number"
            >
              {{ page }}
            </button>
          </template>
          <button
            class="inline-flex h-8 w-8 items-center justify-center rounded-md border text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            :disabled="taskCurrentPage === taskTotalPages"
            @click="taskCurrentPage++"
          >
            <ChevronRight class="h-4 w-4" />
          </button>
          <button
            class="inline-flex h-8 w-8 items-center justify-center rounded-md border text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            :disabled="taskCurrentPage === taskTotalPages"
            @click="taskCurrentPage = taskTotalPages"
          >
            <ChevronsRight class="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>

    <!-- 下发目标选择弹框 -->
    <div v-if="dispatchDialogVisible" class="fixed inset-0 z-50 flex items-center justify-center bg-black/50" @click.self="dispatchDialogVisible = false">
      <div class="w-full max-w-md rounded-lg bg-background shadow-lg border">
        <div class="border-b px-6 py-4">
          <h3 class="text-lg font-semibold">选择下发系统</h3>
          <p class="mt-1 text-sm text-muted-foreground">
            {{ dispatchMode === 'batch' ? `批量下发 ${selectedTaskCodes.size} 条任务至` : '下发任务至' }}
          </p>
        </div>
        <div class="p-6 space-y-3">
          <div
            v-for="opt in dispatchTargets"
            :key="opt.value"
            class="flex items-center gap-3 rounded-lg border p-4 cursor-pointer transition-colors"
            :class="selectedTarget === opt.value ? 'border-primary bg-primary/5' : 'hover:bg-muted/50'"
            @click="selectedTarget = opt.value"
          >
            <div class="flex h-5 w-5 items-center justify-center rounded-full border-2"
              :class="selectedTarget === opt.value ? 'border-primary' : 'border-muted-foreground/30'">
              <div v-if="selectedTarget === opt.value" class="h-2.5 w-2.5 rounded-full bg-primary" />
            </div>
            <div>
              <p class="text-sm font-medium">{{ opt.label }}</p>
              <p class="text-xs text-muted-foreground">{{ opt.desc }}</p>
            </div>
          </div>
        </div>
        <div class="flex justify-end gap-3 border-t px-6 py-4">
          <button
            class="rounded-md border px-4 py-2 text-sm font-medium transition-colors hover:bg-muted"
            @click="dispatchDialogVisible = false"
          >
            取消
          </button>
          <button
            :disabled="!selectedTarget"
            class="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
            @click="confirmDispatch"
          >
            确认下发
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ArrowLeft, Send, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, ChevronDown, ChevronUp, ChevronsDown, ChevronsUp } from 'lucide-vue-next'
import { showToast } from '@/lib/toast'

const route = useRoute()
const router = useRouter()

type ProgressStatus = 'not_effective' | 'pending_issue' | 'executing' | 'partial_complete' | 'all_complete' | 'archived' | 'voided'
type ExecStatus = 'pending' | 'to_execute' | 'executing' | 'completed' | 'overdue' | 'cancelled'
type TaskStatus = 'pending' | 'issued' | 'executing' | 'completed' | 'overdue' | 'cancelled'

interface PlanInfo {
  planCode: string
  schemeCode: string
  schemeName: string
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
  progressStatus: ProgressStatus
  remark: string
}

interface ResourceItem {
  code: string
  name: string
  type: string
  area: number
  belong: string
  status: string
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

interface MaterialDetailItem {
  taskCode: string
  materialCategory: string
  materialType: string
  specification: string
  standardDosage: number
  unit: string
  plannedQuantity: number
  plannedBudget: number
  demandTime: string
  responsiblePerson: string
  unitPrice: number
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
  planEquipment: string
  workLeader: string
  workExecutor: string
  taskStatus: TaskStatus
  materialDetails: MaterialDetailItem[]
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
  schemeName: '',
  planName: '',
  unit: '',
  plantingMode: '',
  cropCategory: '',
  cropVariety: '',
  assetArea: 0,
  planArea: 0,
  planStartTime: '',
  planEndTime: '',
  planLeader: '',
  execLeader: '',
  creator: '',
  effectiveTime: '',
  progressStatus: 'pending_issue',
  remark: '',
})

const resourceList = ref<ResourceItem[]>([])
const farmingList = ref<FarmingExecRow[]>([])
const materialList = ref<MaterialRow[]>([])
const taskList = ref<TaskItem[]>([])

// 选择状态
const selectedTaskCodes = ref(new Set<string>())
const collapsedCards = ref(new Set<string>())
const dispatchDialogVisible = ref(false)
const dispatchMode = ref<'single' | 'batch'>('single')
const singleTaskCode = ref('')
const selectedTarget = ref('')

// 判断卡片是否折叠
function isCardCollapsed(taskCode: string): boolean {
  return collapsedCards.value.has(taskCode)
}

// 切换单个卡片折叠/展开
function toggleCardCollapse(taskCode: string): void {
  const newSet = new Set(collapsedCards.value)
  if (newSet.has(taskCode)) {
    newSet.delete(taskCode)
  } else {
    newSet.add(taskCode)
  }
  collapsedCards.value = newSet
}

const dispatchTargets = [
  { value: 'farm_machinery', label: '农机系统', desc: '适用于大田种植的农机作业任务，自动分配农机资源' },
  { value: 'facility', label: '设施系统', desc: '适用于设施种植的环境管控与设备作业任务' },
  { value: 'manual', label: '本系统（人工作业）', desc: '适用于人工作业任务，在本系统中进行任务派发与跟踪' },
]

// ==================== 任务分页 ====================
const taskCurrentPage = ref(1)
const taskPageSize = 10
const taskTotalPages = computed(() => Math.max(1, Math.ceil(taskList.value.length / taskPageSize)))
const paginatedTasks = computed(() => {
  const start = (taskCurrentPage.value - 1) * taskPageSize
  return taskList.value.slice(start, start + taskPageSize)
})
const taskVisiblePages = computed(() => {
  const total = taskTotalPages.value
  const current = taskCurrentPage.value
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1)
  const pages: (number | string)[] = [1]
  if (current > 3) pages.push('...')
  for (let i = Math.max(2, current - 1); i <= Math.min(total - 1, current + 1); i++) pages.push(i)
  if (current < total - 2) pages.push('...')
  pages.push(total)
  return pages
})

// 监听任务列表变化重置页码
watch(taskList, () => { taskCurrentPage.value = 1 })

const allCollapsed = computed(() => {
  const page = paginatedTasks.value
  return page.length > 0 && page.every(t => collapsedCards.value.has(t.taskCode))
})

function toggleCollapseAll(): void {
  if (allCollapsed.value) {
    collapsedCards.value = new Set()
  } else {
    collapsedCards.value = new Set(paginatedTasks.value.map(t => t.taskCode))
  }
}

// Transition 钩子：折叠/展开动画
function onBeforeEnter(el: Element): void {
  const htmlEl = el as HTMLElement
  htmlEl.style.height = '0'
  htmlEl.style.overflow = 'hidden'
}
function onEnter(el: Element, done: () => void): void {
  const htmlEl = el as HTMLElement
  requestAnimationFrame(() => {
    htmlEl.style.transition = 'height 0.25s ease-out'
    htmlEl.style.height = htmlEl.scrollHeight + 'px'
    htmlEl.addEventListener('transitionend', () => done(), { once: true })
  })
}
function onAfterEnter(el: Element): void {
  const htmlEl = el as HTMLElement
  htmlEl.style.height = ''
  htmlEl.style.overflow = ''
  htmlEl.style.transition = ''
}
function onBeforeLeave(el: Element): void {
  const htmlEl = el as HTMLElement
  htmlEl.style.height = htmlEl.scrollHeight + 'px'
  htmlEl.style.overflow = 'hidden'
}
function onLeave(el: Element, done: () => void): void {
  const htmlEl = el as HTMLElement
  requestAnimationFrame(() => {
    htmlEl.style.transition = 'height 0.2s ease-in'
    htmlEl.style.height = '0'
    htmlEl.addEventListener('transitionend', () => done(), { once: true })
  })
}
function onAfterLeave(el: Element): void {
  const htmlEl = el as HTMLElement
  htmlEl.style.height = ''
  htmlEl.style.overflow = ''
  htmlEl.style.transition = ''
}

const pendingCount = computed(() => taskList.value.filter(t => t.taskStatus === 'pending').length)
const selectedCount = computed(() => taskList.value.filter(t => t.taskStatus === 'pending' && selectedTaskCodes.value.has(t.taskCode)).length)

const isAllSelected = computed(() => {
  const pendingTasks = taskList.value.filter(t => t.taskStatus === 'pending')
  return pendingTasks.length > 0 && pendingTasks.every(t => selectedTaskCodes.value.has(t.taskCode))
})

const isIndeterminate = computed(() => {
  const pendingTasks = taskList.value.filter(t => t.taskStatus === 'pending')
  const selectedPending = pendingTasks.filter(t => selectedTaskCodes.value.has(t.taskCode))
  return selectedPending.length > 0 && selectedPending.length < pendingTasks.length
})

function toggleSelectAll(): void {
  const pendingTasks = taskList.value.filter(t => t.taskStatus === 'pending')
  if (pendingTasks.every(t => selectedTaskCodes.value.has(t.taskCode))) {
    // 全部取消
    pendingTasks.forEach(t => selectedTaskCodes.value.delete(t.taskCode))
  } else {
    // 全部选中
    pendingTasks.forEach(t => selectedTaskCodes.value.add(t.taskCode))
  }
}

function toggleSelect(code: string): void {
  if (selectedTaskCodes.value.has(code)) {
    selectedTaskCodes.value.delete(code)
  } else {
    selectedTaskCodes.value.add(code)
  }
}

function openDispatchDialog(mode: 'single' | 'batch', code?: string): void {
  dispatchMode.value = mode
  selectedTarget.value = ''
  if (mode === 'single' && code) {
    singleTaskCode.value = code
  }
  dispatchDialogVisible.value = true
}

function confirmDispatch(): void {
  if (!selectedTarget) return

  const targetLabel = dispatchTargets.find(t => t.value === selectedTarget.value)?.label ?? ''

  if (dispatchMode.value === 'single') {
    const task = taskList.value.find(t => t.taskCode === singleTaskCode.value)
    if (task) {
      task.taskStatus = 'issued'
    }
    showToast({ message: `任务已下发至【${targetLabel}】`, type: 'success' })
  } else {
    let count = 0
    taskList.value.forEach(t => {
      if (selectedTaskCodes.value.has(t.taskCode) && t.taskStatus === 'pending') {
        t.taskStatus = 'issued'
        count++
      }
    })
    selectedTaskCodes.value.clear()
    showToast({ message: `已批量下发 ${count} 条任务至【${targetLabel}】`, type: 'success' })
  }

  dispatchDialogVisible.value = false
}

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
    schemeName: '冬小麦越冬方案',
    planName: '2025年北京公司小麦种植计划',
    unit: '北京公司',
    plantingMode: '大田种植',
    cropCategory: '小麦',
    cropVariety: '强筋小麦',
    assetArea: 1200,
    planArea: 1000,
    planStartTime: '2025-03-01',
    planEndTime: '2025-07-15',
    planLeader: '张三',
    execLeader: '李四',
    creator: '管理员',
    effectiveTime: '2025-02-20',
    progressStatus: 'pending_issue',
    remark: '2025年度冬小麦种植计划，覆盖北京公司全部大田区域',
  }

  // 模拟资源信息
  resourceList.value = [
    { code: 'JH0077001', name: '良乡地块A-01', type: '大田', area: 300, belong: '良乡园区', status: '可用' },
    { code: 'JH0077002', name: '良乡地块A-02', type: '大田', area: 250, belong: '良乡园区', status: '可用' },
    { code: 'JH0077003', name: '良乡地块B-01', type: '大田', area: 200, belong: '良乡园区', status: '可用' },
    { code: 'JH0078001', name: '通州地块C-01', type: '大田', area: 200, belong: '通州园区', status: '可用' },
    { code: 'JH0078002', name: '通州地块C-02', type: '大田', area: 150, belong: '通州园区', status: '可用' },
    { code: 'JH0079001', name: '唐山地块D-01', type: '大田', area: 100, belong: '唐山园区', status: '可用' },
  ]

  // 模拟种植作业执行计划明细
  farmingList.value = [
    { growthStage: '播种期', productionProcess: '备耕', workStep: '深松整地作业', coreStandard: '深松深度≥30cm，无漏耕', planStartTime: '2025-03-01', planEndTime: '2025-03-05', workParamReq: '深度30-35cm', workMethod: '农机作业', planArea: 1000, planEquipment: '拖拉机', execStatus: 'pending', workLeader: '张三', workExecutor: '李四', remark: '' },
    { growthStage: '播种期', productionProcess: '春耕', workStep: '播种作业', coreStandard: '播种均匀，播深3-5cm', planStartTime: '2025-03-06', planEndTime: '2025-03-12', workParamReq: '行距20cm，播深3-5cm', workMethod: '农机作业', planArea: 1000, planEquipment: '播种机', execStatus: 'pending', workLeader: '张三', workExecutor: '李四', remark: '' },
    { growthStage: '出苗期', productionProcess: '田间管理', workStep: '查苗补苗作业', coreStandard: '缺苗率≤3%', planStartTime: '2025-03-20', planEndTime: '2025-03-25', workParamReq: '补苗密度与原播一致', workMethod: '人工作业', planArea: 1000, planEquipment: '', execStatus: 'pending', workLeader: '张三', workExecutor: '王五', remark: '' },
    { growthStage: '返青期', productionProcess: '追肥', workStep: '追肥作业', coreStandard: '追施返青肥，亩施尿素10kg', planStartTime: '2025-04-01', planEndTime: '2025-04-05', workParamReq: '亩施尿素10-12kg', workMethod: '农机作业', planArea: 1000, planEquipment: '施肥机', execStatus: 'pending', workLeader: '张三', workExecutor: '李四', remark: '' },
    { growthStage: '返青期', productionProcess: '田间管理', workStep: '中耕除草作业', coreStandard: '除草率≥90%，不伤苗', planStartTime: '2025-04-06', planEndTime: '2025-04-10', workParamReq: '行间除草，深度5-8cm', workMethod: '农机作业', planArea: 1000, planEquipment: '中耕机', execStatus: 'pending', workLeader: '张三', workExecutor: '李四', remark: '' },
    { growthStage: '拔节期', productionProcess: '田间管理', workStep: '病虫害防治作业', coreStandard: '蚜虫防治，吡虫啉喷施', planStartTime: '2025-04-15', planEndTime: '2025-04-20', workParamReq: '吡虫啉1500倍液喷雾', workMethod: '无人机作业', planArea: 1000, planEquipment: '植保无人机', execStatus: 'pending', workLeader: '张三', workExecutor: '赵六', remark: '用药类操作' },
    { growthStage: '拔节期', productionProcess: '追肥', workStep: '拔节肥追施作业', coreStandard: '亩施尿素8kg，促进拔节', planStartTime: '2025-04-21', planEndTime: '2025-04-25', workParamReq: '亩施尿素8-10kg', workMethod: '农机作业', planArea: 1000, planEquipment: '施肥机', execStatus: 'pending', workLeader: '张三', workExecutor: '李四', remark: '' },
    { growthStage: '抽穗期', productionProcess: '田间管理', workStep: '灌溉作业', coreStandard: '保证抽穗期水分充足', planStartTime: '2025-05-01', planEndTime: '2025-05-05', workParamReq: '灌水量50m³/亩', workMethod: '智能设备', planArea: 1000, planEquipment: '灌溉系统', execStatus: 'pending', workLeader: '张三', workExecutor: '孙七', remark: '' },
    { growthStage: '抽穗期', productionProcess: '田间管理', workStep: '赤霉病防治作业', coreStandard: '赤霉病预防，多菌灵喷施', planStartTime: '2025-05-06', planEndTime: '2025-05-10', workParamReq: '多菌灵800倍液喷雾', workMethod: '无人机作业', planArea: 1000, planEquipment: '植保无人机', execStatus: 'pending', workLeader: '张三', workExecutor: '赵六', remark: '用药类操作' },
    { growthStage: '灌浆期', productionProcess: '田间管理', workStep: '叶面喷肥作业', coreStandard: '磷酸二氢钾叶面喷施', planStartTime: '2025-05-15', planEndTime: '2025-05-18', workParamReq: '0.3%浓度叶面喷施', workMethod: '无人机作业', planArea: 1000, planEquipment: '植保无人机', execStatus: 'pending', workLeader: '张三', workExecutor: '赵六', remark: '' },
    { growthStage: '灌浆期', productionProcess: '田间管理', workStep: '穗期虫害防治作业', coreStandard: '穗蚜防治，高效氯氟氰菊酯', planStartTime: '2025-05-20', planEndTime: '2025-05-25', workParamReq: '高效氯氟氰菊酯1000倍液', workMethod: '无人机作业', planArea: 1000, planEquipment: '植保无人机', execStatus: 'pending', workLeader: '张三', workExecutor: '赵六', remark: '用药类操作' },
    { growthStage: '成熟期', productionProcess: '田间管理', workStep: '田间排水作业', coreStandard: '成熟期及时排水，防止穗发芽', planStartTime: '2025-06-20', planEndTime: '2025-06-25', workParamReq: '排干田间积水', workMethod: '人工作业', planArea: 1000, planEquipment: '', execStatus: 'pending', workLeader: '张三', workExecutor: '王五', remark: '' },
    { growthStage: '成熟期', productionProcess: '收获', workStep: '收割作业', coreStandard: '适时收获，减损率≤3%', planStartTime: '2025-07-01', planEndTime: '2025-07-05', workParamReq: '含水率≤14%', workMethod: '农机作业', planArea: 1000, planEquipment: '收割机', execStatus: 'pending', workLeader: '张三', workExecutor: '李四', remark: '' },
    { growthStage: '成熟期', productionProcess: '收获', workStep: '烘干入库作业', coreStandard: '烘干至含水率≤13%', planStartTime: '2025-07-06', planEndTime: '2025-07-10', workParamReq: '烘干温度50-55℃，含水率≤13%', workMethod: '智能设备', planArea: 1000, planEquipment: '烘干设备', execStatus: 'pending', workLeader: '张三', workExecutor: '孙七', remark: '' },
    { growthStage: '成熟期', productionProcess: '收获', workStep: '秸秆还田作业', coreStandard: '秸秆粉碎还田，提升土壤有机质', planStartTime: '2025-07-11', planEndTime: '2025-07-15', workParamReq: '秸秆粉碎长度≤10cm', workMethod: '农机作业', planArea: 1000, planEquipment: '秸秆还田机', execStatus: 'pending', workLeader: '张三', workExecutor: '李四', remark: '' },
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
  const plotAssignments = [
    { name: '良乡地块A-01', type: '大田', area: 300 },
    { name: '良乡地块A-02', type: '大田', area: 250 },
    { name: '良乡地块B-01', type: '大田', area: 200 },
    { name: '通州地块C-01', type: '大田', area: 200 },
    { name: '通州地块C-02', type: '大田', area: 150 },
    { name: '唐山地块D-01', type: '大田', area: 100 },
    { name: '良乡地块A-03', type: '大田', area: 180 },
    { name: '良乡地块B-02', type: '大田', area: 220 },
    { name: '通州地块C-03', type: '大田', area: 160 },
    { name: '唐山地块D-02', type: '大田', area: 140 },
    { name: '良乡地块A-04', type: '大田', area: 190 },
    { name: '通州地块C-04', type: '大田', area: 170 },
    { name: '良乡地块B-03', type: '大田', area: 210 },
    { name: '唐山地块D-03', type: '大田', area: 130 },
    { name: '良乡地块A-05', type: '大田', area: 200 },
  ]

  taskList.value = farmingList.value.map((row, idx) => ({
    taskCode: `TASK-${planInfo.value.planCode}-${String(idx + 1).padStart(3, '0')}`,
    planCode: planInfo.value.planCode,
    planName: planInfo.value.planName,
    unit: planInfo.value.unit,
    plotName: plotAssignments[idx]?.name ?? '',
    plotType: plotAssignments[idx]?.type ?? '',
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
    materialDetails: generateMaterialDetails(row, planInfo.value.planCode),
    planEquipment: row.planEquipment,
    workLeader: row.workLeader,
    workExecutor: row.workExecutor,
    taskStatus: 'pending' as TaskStatus,
    remark: '',
  }))
}

// 根据作业行生成农资需求明细（1对多）
function generateMaterialDetails(row: FarmingExecRow, planCode: string): MaterialDetailItem[] {
  const matched = materialList.value.filter(
    m => m.growthStage === row.growthStage && m.workStep === row.workStep
  )
  if (matched.length === 0) {
    // 若无精确匹配，按生育时期匹配
    const byStage = materialList.value.filter(m => m.growthStage === row.growthStage)
    if (byStage.length > 0) return byStage.map(m => mapToDetail(m, planCode))
    // 兜底：随机1-2条
    return materialList.value.slice(0, Math.min(2, materialList.value.length)).map(m => mapToDetail(m, planCode))
  }
  return matched.map(m => mapToDetail(m, planCode))
}

function mapToDetail(m: { materialCategory: string; materialType: string; spec: string; standardDosage: string; unit: string; applyMethod: string; remark: string }, planCode: string): MaterialDetailItem {
  return {
    taskCode: planCode,
    materialCategory: m.materialCategory,
    materialType: m.materialType,
    specification: m.spec,
    standardDosage: parseFloat(m.standardDosage) || 0,
    unit: m.unit,
    plannedQuantity: (parseFloat(m.standardDosage) || 0) * (1 + Math.random() * 0.2),
    plannedBudget: Math.round(((parseFloat(m.standardDosage) || 0) * (5 + Math.random() * 20)) * 100) / 100,
    demandTime: '2025-03-15',
    responsiblePerson: '张三',
    unitPrice: Math.round((5 + Math.random() * 20) * 100) / 100,
    remark: m.remark,
  }
}

// ==================== 操作 ====================
function goBack(): void {
  router.push('/planting-schedule')
}
</script>
