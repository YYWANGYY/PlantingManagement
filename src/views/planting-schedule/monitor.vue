<template>
  <div class="space-y-6">
    <!-- 页面标题 -->
    <div>
      <h1 class="text-2xl font-bold tracking-tight">计划监控</h1>
      <p class="mt-1 text-sm text-muted-foreground">实时监控种植计划执行进度与农事任务状态</p>
    </div>

    <!-- 顶部页签切换 -->
    <div class="flex gap-1 rounded-lg bg-muted p-1 w-fit">
      <button
        :class="['rounded-md px-4 py-2 text-sm font-medium transition-colors', activeMainTab === 'plan' ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground']"
        @click="activeMainTab = 'plan'"
      >
        农事计划
      </button>
      <button
        :class="['rounded-md px-4 py-2 text-sm font-medium transition-colors', activeMainTab === 'task' ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground']"
        @click="activeMainTab = 'task'"
      >
        任务看板
      </button>
    </div>

    <!-- ========== 农事计划模块 ========== -->
    <template v-if="activeMainTab === 'plan'">
      <!-- 查询条件 -->
      <div class="flex flex-wrap items-end gap-3 rounded-xl border bg-card p-4 shadow-sm">
        <div class="space-y-1">
          <label class="text-xs font-medium text-muted-foreground">所属单位 </label>
          <select v-model="planFilters.org" class="h-9 w-44 rounded-md border bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30">
            <option value="">全部</option>
            <option v-for="org in orgOptions" :key="org.value" :value="org.value">{{ org.label }}</option>
          </select>
        </div>
        <div class="space-y-1">
          <label class="text-xs font-medium text-muted-foreground">日期 </label>
          <input
            v-model="planFilters.date"
            type="date"
            class="h-9 w-40 rounded-md border bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
        </div>
        <button class="h-9 rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground hover:bg-primary/90" @click="resetPlanFilters">重置</button>
      </div>

      <!-- 视图切换：日历 / 卡片 -->
      <div class="flex items-center justify-between">
        <div class="flex gap-1 rounded-lg bg-muted p-1">
          <button
            :class="['rounded-md px-3 py-1.5 text-xs font-medium transition-colors', planViewMode === 'calendar' ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground']"
            @click="planViewMode = 'calendar'"
          >
            <span class="flex items-center gap-1"><CalendarDays class="h-3.5 w-3.5" />日历展示</span>
          </button>
          <button
            :class="['rounded-md px-3 py-1.5 text-xs font-medium transition-colors', planViewMode === 'card' ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground']"
            @click="planViewMode = 'card'"
          >
            <span class="flex items-center gap-1"><LayoutGrid class="h-3.5 w-3.5" />卡片展示</span>
          </button>
        </div>
        <div class="flex items-center gap-4 text-xs text-muted-foreground">
          <span class="flex items-center gap-1"><span class="inline-block h-2.5 w-2.5 rounded-full bg-teal-600" />已归档</span>
          <span class="flex items-center gap-1"><span class="inline-block h-2.5 w-2.5 rounded-full bg-green-500" />全部完成</span>
          <span class="flex items-center gap-1"><span class="inline-block h-2.5 w-2.5 rounded-full bg-blue-500" />执行中</span>
          <span class="flex items-center gap-1"><span class="inline-block h-2.5 w-2.5 rounded-full bg-amber-500" />部分完成</span>
          <span class="flex items-center gap-1"><span class="inline-block h-2.5 w-2.5 rounded-full bg-gray-400" />未生效</span>
          <span class="flex items-center gap-1"><span class="inline-block h-2.5 w-2.5 rounded-full bg-red-500" />已作废</span>
        </div>
      </div>

      <!-- 日历展示模式 -->
      <div v-if="planViewMode === 'calendar'" class="rounded-xl border bg-card shadow-sm">
        <!-- 月份导航 -->
        <div class="flex items-center justify-between border-b px-6 py-4">
          <button class="flex h-8 w-8 items-center justify-center rounded-md hover:bg-accent" @click="prevMonth">
            <ChevronLeft class="h-4 w-4" />
          </button>
          <h2 class="text-lg font-semibold">{{ currentYear }}年{{ currentMonth }}月</h2>
          <button class="flex h-8 w-8 items-center justify-center rounded-md hover:bg-accent" @click="nextMonth">
            <ChevronRight class="h-4 w-4" />
          </button>
        </div>
        <!-- 星期标头 -->
        <div class="grid grid-cols-7 border-b">
          <div v-for="day in weekDays" :key="day" class="py-3 text-center text-xs font-medium text-muted-foreground">
            {{ day }}
          </div>
        </div>
        <!-- 日历格子 -->
        <div class="grid grid-cols-7">
          <div
            v-for="(cell, idx) in calendarCells"
            :key="idx"
            :class="['min-h-[100px] border-b border-r p-2', cell.isCurrentMonth ? 'bg-background' : 'bg-muted/30']"
          >
            <div :class="['mb-1 text-xs font-medium', cell.isToday ? 'flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground' : 'text-muted-foreground']">
              {{ cell.day || '' }}
            </div>
            <div class="space-y-1">
              <div
                v-for="plan in cell.plans"
                :key="plan.id"
                :class="['cursor-pointer rounded px-1.5 py-1 text-xs font-medium truncate transition-opacity hover:opacity-80', planStatusColorClass(plan.progressStatus)]"
                @click="openPlanDetail(plan)"
              >
                {{ plan.planName }}({{ plan.completedTasks }}/{{ plan.totalTasks }})
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 卡片展示模式 -->
      <div v-else class="space-y-4">
        <div
          v-for="status in cardStatusList"
          :key="status.key"
          class="rounded-xl border bg-card shadow-sm"
        >
          <div class="flex items-center gap-2 border-b px-6 py-4">
            <span :class="['inline-block h-3 w-3 rounded-full', status.dotClass]" />
            <h3 class="text-sm font-semibold">{{ status.label }}</h3>
            <span class="ml-1 rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">{{ getPlansByStatus(status.key).length }}</span>
          </div>
          <div class="grid grid-cols-1 gap-3 p-4 sm:grid-cols-2 lg:grid-cols-3">
            <div
              v-for="plan in getPlansByStatus(status.key)"
              :key="plan.id"
              :class="['rounded-lg border p-4 cursor-pointer transition-colors hover:bg-accent/50', status.borderClass]"
              @click="openPlanDetail(plan)"
            >
              <div class="flex items-center justify-between">
                <span class="font-medium text-sm truncate mr-2">{{ plan.planName }}</span>
                <span :class="['inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium', status.badgeClass]">
                  {{ status.label }}
                </span>
              </div>
              <div class="mt-2 text-xs text-muted-foreground">{{ plan.planCode }}</div>
              <div class="mt-2 flex items-center gap-3">
                <div class="h-1.5 flex-1 overflow-hidden rounded-full bg-muted">
                  <div
                    :class="['h-full rounded-full', status.barClass]"
                    :style="{ width: `${plan.totalTasks > 0 ? Math.round(plan.completedTasks / plan.totalTasks * 100) : 0}%` }"
                  />
                </div>
                <span class="text-xs font-medium tabular-nums">{{ plan.completedTasks }}/{{ plan.totalTasks }}</span>
              </div>
              <div class="mt-2 text-xs text-muted-foreground">
                {{ plan.startDate }} ~ {{ plan.endDate }}
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 计划详情弹框 -->
      <div v-if="detailDialogVisible" class="fixed inset-0 z-50 flex items-center justify-center bg-black/40" @click.self="detailDialogVisible = false">
        <div class="w-full max-w-4xl max-h-[85vh] overflow-y-auto rounded-xl bg-background shadow-xl">
          <div class="sticky top-0 z-10 flex items-center justify-between border-b bg-background px-6 py-4">
            <h2 class="text-lg font-semibold">计划详情</h2>
            <button class="flex h-8 w-8 items-center justify-center rounded-md hover:bg-accent" @click="detailDialogVisible = false">
              <X class="h-4 w-4" />
            </button>
          </div>
          <div v-if="selectedPlan" class="space-y-6 p-6">
            <!-- 计划进度 -->
            <div>
              <h3 class="mb-3 text-sm font-semibold text-muted-foreground">计划进度</h3>
              <div class="flex items-center gap-4">
                <span :class="['inline-flex items-center rounded-full px-3 py-1 text-sm font-medium', planStatusBadgeClass(selectedPlan.progressStatus)]">
                  {{ progressStatusLabel(selectedPlan.progressStatus) }}
                </span>
                <div class="flex items-center gap-3 flex-1">
                  <div class="h-2.5 flex-1 overflow-hidden rounded-full bg-muted">
                    <div
                      :class="['h-full rounded-full transition-all', planStatusBarClass(selectedPlan.progressStatus)]"
                      :style="{ width: `${selectedPlan.totalTasks > 0 ? Math.round(selectedPlan.completedTasks / selectedPlan.totalTasks * 100) : 0}%` }"
                    />
                  </div>
                  <span class="text-sm font-medium tabular-nums">{{ selectedPlan.completedTasks }}/{{ selectedPlan.totalTasks }}</span>
                </div>
              </div>
            </div>
            <!-- 基本信息 -->
            <div>
              <h3 class="mb-3 text-sm font-semibold text-muted-foreground">基本信息</h3>
              <div class="grid grid-cols-2 gap-x-8 gap-y-3 lg:grid-cols-3">
                <div><span class="text-xs text-muted-foreground">计划编号</span><p class="text-sm font-medium">{{ selectedPlan.planCode }}</p></div>
                <div><span class="text-xs text-muted-foreground">关联种植方案编号</span><p class="text-sm font-medium">{{ selectedPlan.schemeCode }}</p></div>
                <div><span class="text-xs text-muted-foreground">种植计划名称</span><p class="text-sm font-medium">{{ selectedPlan.planName }}</p></div>
                <div><span class="text-xs text-muted-foreground">所属单位</span><p class="text-sm font-medium">{{ selectedPlan.org }}</p></div>
                <div><span class="text-xs text-muted-foreground">种植作物大类</span><p class="text-sm font-medium">{{ selectedPlan.cropCategory }}</p></div>
                <div><span class="text-xs text-muted-foreground">种植品种</span><p class="text-sm font-medium">{{ selectedPlan.cropVariety }}</p></div>
                <div class="col-span-2 lg:col-span-3">
                  <span class="text-xs text-muted-foreground">种植资源信息</span>
                  <div class="mt-1 overflow-x-auto rounded-lg border">
                    <table class="w-full text-sm">
                      <thead><tr class="border-b bg-muted/50"><th class="px-3 py-2 text-left text-xs font-medium text-muted-foreground">种植单元编号</th><th class="px-3 py-2 text-left text-xs font-medium text-muted-foreground">种植单元名称</th><th class="px-3 py-2 text-left text-xs font-medium text-muted-foreground">种植面积(亩)</th></tr></thead>
                      <tbody>
                        <tr v-for="(res, i) in selectedPlan.resources" :key="i" class="border-b last:border-0">
                          <td class="px-3 py-2">{{ res.plotCode }}</td>
                          <td class="px-3 py-2">{{ res.unitCode }}</td>
                          <td class="px-3 py-2">{{ res.area }}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
                <div><span class="text-xs text-muted-foreground">资产面积(亩)</span><p class="text-sm font-medium">{{ selectedPlan.assetArea }}</p></div>
                <div><span class="text-xs text-muted-foreground">计划种植总面积(亩)</span><p class="text-sm font-medium">{{ selectedPlan.planArea }}</p></div>
                <div><span class="text-xs text-muted-foreground">计划播种/定植开始时间</span><p class="text-sm font-medium">{{ selectedPlan.startDate }}</p></div>
                <div><span class="text-xs text-muted-foreground">计划收获结束时间</span><p class="text-sm font-medium">{{ selectedPlan.endDate }}</p></div>
                <div><span class="text-xs text-muted-foreground">计划负责人</span><p class="text-sm font-medium">{{ selectedPlan.planManager }}</p></div>
                <div><span class="text-xs text-muted-foreground">执行负责人</span><p class="text-sm font-medium">{{ selectedPlan.execManager }}</p></div>
                <div><span class="text-xs text-muted-foreground">创建人</span><p class="text-sm font-medium">{{ selectedPlan.creator }}</p></div>
                <div><span class="text-xs text-muted-foreground">创建时间</span><p class="text-sm font-medium">{{ selectedPlan.createTime }}</p></div>
                <div><span class="text-xs text-muted-foreground">审批人</span><p class="text-sm font-medium">{{ selectedPlan.approver }}</p></div>
                <div><span class="text-xs text-muted-foreground">审批状态</span><p class="text-sm font-medium">{{ selectedPlan.approvalStatus }}</p></div>
                <div><span class="text-xs text-muted-foreground">备注</span><p class="text-sm font-medium">{{ selectedPlan.remark || '-' }}</p></div>
              </div>
            </div>
            <!-- 种植作物执行明细表 -->
            <div>
              <h3 class="mb-3 text-sm font-semibold text-muted-foreground">种植作物执行明细表</h3>
              <div class="overflow-x-auto rounded-lg border">
                <table class="w-full text-sm">
                  <thead><tr class="border-b bg-muted/50">
                    <th class="px-3 py-2 text-left text-xs font-medium text-muted-foreground">生育时期</th>
                    <th class="px-3 py-2 text-left text-xs font-medium text-muted-foreground">生产流程</th>
                    <th class="px-3 py-2 text-left text-xs font-medium text-muted-foreground">作业环节</th>
                    <th class="px-3 py-2 text-left text-xs font-medium text-muted-foreground">核心操作标准</th>
                    <th class="px-3 py-2 text-left text-xs font-medium text-muted-foreground">计划开始时间</th>
                    <th class="px-3 py-2 text-left text-xs font-medium text-muted-foreground">计划结束时间</th>
                  </tr></thead>
                  <tbody>
                    <tr v-for="(row, i) in selectedPlan.execDetails" :key="i" class="border-b last:border-0">
                      <td class="px-3 py-2">{{ row.growthStage }}</td>
                      <td class="px-3 py-2">{{ row.process }}</td>
                      <td class="px-3 py-2">{{ row.step }}</td>
                      <td class="px-3 py-2">{{ row.standard }}</td>
                      <td class="px-3 py-2">{{ row.start }}</td>
                      <td class="px-3 py-2">{{ row.end }}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
            <!-- 农资投入计划表 -->
            <div>
              <h3 class="mb-3 text-sm font-semibold text-muted-foreground">农资投入计划表</h3>
              <div class="overflow-x-auto rounded-lg border">
                <table class="w-full text-sm">
                  <thead><tr class="border-b bg-muted/50">
                    <th class="px-3 py-2 text-left text-xs font-medium text-muted-foreground">农资大类</th>
                    <th class="px-3 py-2 text-left text-xs font-medium text-muted-foreground">品类</th>
                    <th class="px-3 py-2 text-left text-xs font-medium text-muted-foreground">计划用量</th>
                    <th class="px-3 py-2 text-left text-xs font-medium text-muted-foreground">计量单位</th>
                    <th class="px-3 py-2 text-left text-xs font-medium text-muted-foreground">生育时期</th>
                  </tr></thead>
                  <tbody>
                    <tr v-for="(row, i) in selectedPlan.materialPlan" :key="i" class="border-b last:border-0">
                      <td class="px-3 py-2">{{ row.category }}</td>
                      <td class="px-3 py-2">{{ row.type }}</td>
                      <td class="px-3 py-2">{{ row.amount }}</td>
                      <td class="px-3 py-2">{{ row.unit }}</td>
                      <td class="px-3 py-2">{{ row.growthStage }}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>

    <!-- ========== 任务看板模块 ========== -->
    <template v-if="activeMainTab === 'task'">
      <!-- 查询条件 -->
      <div class="flex flex-wrap items-end gap-3 rounded-xl border bg-card p-4 shadow-sm">
        <div class="space-y-1">
          <label class="text-xs font-medium text-muted-foreground">生育时期</label>
          <div class="relative">
            <button
              class="flex h-9 w-44 items-center justify-between rounded-md border bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
              @click="showGrowthDropdown = !showGrowthDropdown"
            >
              <span :class="taskFilters.growthStages.length > 0 ? 'text-foreground' : 'text-muted-foreground'">
                {{ taskFilters.growthStages.length > 0 ? `已选${taskFilters.growthStages.length}项` : '请选择' }}
              </span>
              <ChevronDown class="h-4 w-4 text-muted-foreground" />
            </button>
            <div v-if="showGrowthDropdown" class="absolute left-0 top-full z-20 mt-1 w-44 rounded-md border bg-background shadow-lg">
              <div class="max-h-48 overflow-y-auto p-1">
                <label
                  v-for="stage in growthStageOptions"
                  :key="stage"
                  class="flex items-center gap-2 rounded px-2 py-1.5 text-sm hover:bg-accent cursor-pointer"
                >
                  <input
                    type="checkbox"
                    :checked="taskFilters.growthStages.includes(stage)"
                    class="rounded border-gray-300"
                    @change="toggleGrowthStage(stage)"
                  />
                  {{ stage }}
                </label>
              </div>
            </div>
          </div>
        </div>
        <div class="space-y-1">
          <label class="text-xs font-medium text-muted-foreground">生产流程</label>
          <div class="relative">
            <button
              class="flex h-9 w-44 items-center justify-between rounded-md border bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
              @click="showProcessDropdown = !showProcessDropdown"
            >
              <span :class="taskFilters.processes.length > 0 ? 'text-foreground' : 'text-muted-foreground'">
                {{ taskFilters.processes.length > 0 ? `已选${taskFilters.processes.length}项` : '请选择' }}
              </span>
              <ChevronDown class="h-4 w-4 text-muted-foreground" />
            </button>
            <div v-if="showProcessDropdown" class="absolute left-0 top-full z-20 mt-1 w-44 rounded-md border bg-background shadow-lg">
              <div class="max-h-48 overflow-y-auto p-1">
                <label
                  v-for="proc in processOptions"
                  :key="proc"
                  class="flex items-center gap-2 rounded px-2 py-1.5 text-sm hover:bg-accent cursor-pointer"
                >
                  <input
                    type="checkbox"
                    :checked="taskFilters.processes.includes(proc)"
                    class="rounded border-gray-300"
                    @change="toggleProcess(proc)"
                  />
                  {{ proc }}
                </label>
              </div>
            </div>
          </div>
        </div>
        <div class="space-y-1">
          <label class="text-xs font-medium text-muted-foreground">作业环节</label>
          <div class="relative">
            <button
              class="flex h-9 w-44 items-center justify-between rounded-md border bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
              @click="showStepDropdown = !showStepDropdown"
            >
              <span :class="taskFilters.steps.length > 0 ? 'text-foreground' : 'text-muted-foreground'">
                {{ taskFilters.steps.length > 0 ? `已选${taskFilters.steps.length}项` : '请选择' }}
              </span>
              <ChevronDown class="h-4 w-4 text-muted-foreground" />
            </button>
            <div v-if="showStepDropdown" class="absolute left-0 top-full z-20 mt-1 w-44 rounded-md border bg-background shadow-lg">
              <div class="max-h-48 overflow-y-auto p-1">
                <label
                  v-for="step in stepOptions"
                  :key="step"
                  class="flex items-center gap-2 rounded px-2 py-1.5 text-sm hover:bg-accent cursor-pointer"
                >
                  <input
                    type="checkbox"
                    :checked="taskFilters.steps.includes(step)"
                    class="rounded border-gray-300"
                    @change="toggleStep(step)"
                  />
                  {{ step }}
                </label>
              </div>
            </div>
          </div>
        </div>
        <div class="space-y-1">
          <label class="text-xs font-medium text-muted-foreground">时间范围</label>
          <div class="flex items-center gap-1">
            <input v-model="taskFilters.startDate" type="date" class="h-9 w-36 rounded-md border bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
            <span class="text-muted-foreground">~</span>
            <input v-model="taskFilters.endDate" type="date" class="h-9 w-36 rounded-md border bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
          </div>
        </div>
        <button class="h-9 rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground hover:bg-primary/90" @click="resetTaskFilters">重置</button>
      </div>

      <!-- 任务列表（一行一条，左图右文） -->
      <div class="space-y-3">
        <div
          v-for="task in paginatedTasks"
          :key="task.id"
          class="relative flex rounded-xl border bg-card shadow-sm overflow-hidden hover:shadow-md transition-shadow"
        >
          <!-- 左侧：大田工作图片 -->
          <div class="w-52 flex-shrink-0 bg-muted/30">
            <img
              v-if="task.imageUrl"
              :src="task.imageUrl"
              :alt="task.step"
              class="h-full w-full object-cover"
            />
            <div v-else class="flex h-full items-center justify-center">
              <div class="text-center">
                <ImageIcon class="mx-auto h-8 w-8 text-muted-foreground/40" />
                <p class="mt-1 text-xs text-muted-foreground/60">暂无图片</p>
              </div>
            </div>
          </div>
          <!-- 右侧：文字内容 -->
          <div class="flex-1 p-5 pl-6">
            <!-- 标题行：作业环节 + 状态角标 -->
            <div class="flex items-center justify-between mb-3">
              <div class="flex items-center gap-3">
                <h4 class="text-sm font-semibold">{{ task.step }}</h4>
                <span class="text-xs text-muted-foreground">{{ task.growthStage }} · {{ task.process }}</span>
              </div>
              <span :class="['inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium', taskStatusBadgeClass(task.taskStatus)]">
                {{ taskStatusLabel(task.taskStatus) }}
              </span>
            </div>
            <!-- 信息网格 -->
            <div class="grid grid-cols-2 gap-x-8 gap-y-2 text-xs lg:grid-cols-4">
              <div>
                <span class="text-muted-foreground">作业面积</span>
                <p class="font-medium">{{ task.area }}亩</p>
              </div>
              <div>
                <span class="text-muted-foreground">作业负责人</span>
                <p class="font-medium">{{ task.manager }}</p>
              </div>
              <div>
                <span class="text-muted-foreground">作业执行人</span>
                <p class="font-medium">{{ task.executor }}</p>
              </div>
              <div>
                <span class="text-muted-foreground">实际完成时间</span>
                <p class="font-medium">{{ task.actualEndTime || '-' }}</p>
              </div>
              <div>
                <span class="text-muted-foreground">地块</span>
                <p class="font-medium">{{ task.plotName }}（{{ task.plotCode }}）</p>
              </div>
              <div>
                <span class="text-muted-foreground">农机/设备</span>
                <p class="font-medium">{{ task.equipment || '-' }}</p>
              </div>
              <div>
                <span class="text-muted-foreground">计划日期</span>
                <p class="font-medium">{{ task.planDate }}</p>
              </div>
            </div>
            <!-- 大田工作图片标注 -->
            <div v-if="task.imageUrl" class="mt-2 text-xs text-muted-foreground/60">
              大田工作图片
            </div>
          </div>
          <!-- 左侧色条 -->
          <div :class="['absolute left-0 top-0 bottom-0 w-1', taskStatusBarClass(task.taskStatus)]" />
        </div>
      </div>

      <!-- 分页 -->
      <div v-if="filteredTasks.length > 0" class="flex items-center justify-between px-1">
        <p class="text-sm text-muted-foreground">
          第 {{ taskCurrentPage }} / {{ taskTotalPages }} 页，共 <span class="font-medium">{{ filteredTasks.length }}</span> 条记录
        </p>
        <div class="flex items-center gap-1">
          <button
            class="inline-flex h-8 w-8 items-center justify-center rounded-md border border-input text-sm hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed"
            :disabled="taskCurrentPage === 1"
            @click="taskCurrentPage--"
          >
            <ChevronLeft class="h-4 w-4" />
          </button>
          <template v-for="p in taskVisiblePages" :key="p">
            <button
              v-if="p !== '...'"
              class="inline-flex h-8 w-8 items-center justify-center rounded-md border text-sm transition-colors"
              :class="p === taskCurrentPage ? 'border-primary bg-primary text-primary-foreground' : 'border-input hover:bg-muted'"
              @click="taskCurrentPage = p as number"
            >
              {{ p }}
            </button>
            <span v-else class="px-1 text-muted-foreground">...</span>
          </template>
          <button
            class="inline-flex h-8 w-8 items-center justify-center rounded-md border border-input text-sm hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed"
            :disabled="taskCurrentPage === taskTotalPages"
            @click="taskCurrentPage++"
          >
            <ChevronRight class="h-4 w-4" />
          </button>
        </div>
      </div>

      <!-- 空状态 -->
      <div v-if="filteredTasks.length === 0" class="flex flex-col items-center justify-center py-16 text-muted-foreground">
        <ClipboardList class="h-12 w-12 mb-3" />
        <p class="text-sm">暂无匹配的农事任务</p>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import {
  CalendarDays,
  LayoutGrid,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  X,
  ClipboardList,
  Image as ImageIcon
} from 'lucide-vue-next'

// ==================== 通用类型 ====================
type PlanProgressStatus = 'archived' | 'all_done' | 'executing' | 'partial_done' | 'not_effective' | 'voided' | 'not_started'
type TaskStatus = 'pending_issue' | 'issued' | 'executing' | 'completed' | 'failed' | 'cancelled'

interface PlanResource {
  plotCode: string
  unitCode: string
  area: number
}

interface ExecDetail {
  growthStage: string
  process: string
  step: string
  standard: string
  start: string
  end: string
}

interface MaterialPlanItem {
  category: string
  type: string
  amount: string
  unit: string
  growthStage: string
}

interface FarmPlan {
  id: string
  planCode: string
  schemeCode: string
  planName: string
  org: string
  cropCategory: string
  cropVariety: string
  resources: PlanResource[]
  assetArea: number
  planArea: number
  startDate: string
  endDate: string
  planManager: string
  execManager: string
  creator: string
  createTime: string
  approver: string
  approvalStatus: string
  remark: string
  progressStatus: PlanProgressStatus
  completedTasks: number
  totalTasks: number
  execDetails: ExecDetail[]
  materialPlan: MaterialPlanItem[]
}

interface FarmTask {
  id: string
  step: string
  growthStage: string
  process: string
  area: number
  manager: string
  executor: string
  actualEndTime: string
  plotName: string
  plotCode: string
  equipment: string
  taskStatus: TaskStatus
  imageUrl: string
  planDate: string
}

// ==================== 页签状态 ====================
const activeMainTab = ref<'plan' | 'task'>('plan')

// ==================== 农事计划模块 ====================
const planViewMode = ref<'calendar' | 'card'>('calendar')
const detailDialogVisible = ref(false)
const selectedPlan = ref<FarmPlan | null>(null)
const currentYear = ref(2025)
const currentMonth = ref(5)

const planFilters = ref({
  org: '',
  date: ''
})

const weekDays = ['一', '二', '三', '四', '五', '六', '日']

const orgOptions = [
  { value: 'harbin', label: '哈尔滨区域公司' },
  { value: 'shenyang', label: '沈阳区域公司' },
  { value: 'wudalianchi', label: '五大连池农场' },
  { value: 'shuangcheng', label: '双城农场' },
  { value: 'faku', label: '法库农场' }
]

// 计划状态颜色配置
const planStatusColors: Record<PlanProgressStatus, { dot: string; bg: string; bar: string; badge: string; border: string }> = {
  archived: { dot: 'bg-teal-600', bg: 'bg-teal-600 text-white', bar: 'bg-teal-500', badge: 'bg-teal-100 text-teal-700', border: 'border-teal-200' },
  all_done: { dot: 'bg-green-500', bg: 'bg-green-500 text-white', bar: 'bg-green-500', badge: 'bg-green-100 text-green-700', border: 'border-green-200' },
  executing: { dot: 'bg-blue-500', bg: 'bg-blue-500 text-white', bar: 'bg-blue-500', badge: 'bg-blue-100 text-blue-700', border: 'border-blue-200' },
  partial_done: { dot: 'bg-amber-500', bg: 'bg-amber-500 text-white', bar: 'bg-amber-500', badge: 'bg-amber-100 text-amber-700', border: 'border-amber-200' },
  not_effective: { dot: 'bg-gray-400', bg: 'bg-gray-400 text-white', bar: 'bg-gray-400', badge: 'bg-gray-100 text-gray-700', border: 'border-gray-200' },
  voided: { dot: 'bg-red-500', bg: 'bg-red-500 text-white', bar: 'bg-red-500', badge: 'bg-red-100 text-red-700', border: 'border-red-200' },
  not_started: { dot: 'bg-gray-300', bg: 'bg-gray-300 text-gray-700', bar: 'bg-gray-300', badge: 'bg-gray-100 text-gray-600', border: 'border-gray-200' }
}

function planStatusColorClass(status: PlanProgressStatus): string {
  return planStatusColors[status]?.bg || 'bg-gray-400 text-white'
}

function planStatusBadgeClass(status: PlanProgressStatus): string {
  return planStatusColors[status]?.badge || 'bg-gray-100 text-gray-700'
}

function planStatusBarClass(status: PlanProgressStatus): string {
  return planStatusColors[status]?.bar || 'bg-gray-400'
}

function progressStatusLabel(status: PlanProgressStatus): string {
  const map: Record<PlanProgressStatus, string> = {
    archived: '已归档',
    all_done: '全部完成',
    executing: '执行中',
    partial_done: '部分完成',
    not_effective: '未生效',
    voided: '已作废',
    not_started: '未启动'
  }
  return map[status] || status
}

// 卡片展示-状态列表
const cardStatusList = [
  { key: 'executing' as PlanProgressStatus, label: '执行中', dotClass: 'bg-blue-500', badgeClass: 'bg-blue-100 text-blue-700', barClass: 'bg-blue-500', borderClass: 'border-blue-200' },
  { key: 'partial_done' as PlanProgressStatus, label: '部分完成', dotClass: 'bg-amber-500', badgeClass: 'bg-amber-100 text-amber-700', barClass: 'bg-amber-500', borderClass: 'border-amber-200' },
  { key: 'all_done' as PlanProgressStatus, label: '全部完成', dotClass: 'bg-green-500', badgeClass: 'bg-green-100 text-green-700', barClass: 'bg-green-500', borderClass: 'border-green-200' },
  { key: 'not_effective' as PlanProgressStatus, label: '未生效', dotClass: 'bg-gray-400', badgeClass: 'bg-gray-100 text-gray-700', barClass: 'bg-gray-400', borderClass: 'border-gray-200' },
  { key: 'not_started' as PlanProgressStatus, label: '未启动', dotClass: 'bg-gray-300', badgeClass: 'bg-gray-100 text-gray-600', barClass: 'bg-gray-300', borderClass: 'border-gray-200' },
  { key: 'archived' as PlanProgressStatus, label: '已归档', dotClass: 'bg-teal-600', badgeClass: 'bg-teal-100 text-teal-700', barClass: 'bg-teal-500', borderClass: 'border-teal-200' },
  { key: 'voided' as PlanProgressStatus, label: '已作废', dotClass: 'bg-red-500', badgeClass: 'bg-red-100 text-red-700', barClass: 'bg-red-500', borderClass: 'border-red-200' }
]

function getPlansByStatus(status: PlanProgressStatus): FarmPlan[] {
  return filteredPlans.value.filter(p => p.progressStatus === status)
}

// 模拟计划数据
const allPlans: FarmPlan[] = [
  {
    id: 'P001', planCode: 'ZJ-2025-001', schemeCode: 'FA-2025-001', planName: '五大连池玉米种植计划', org: '五大连池农场',
    cropCategory: '玉米', cropVariety: '先玉335',
    resources: [{ plotCode: 'WDLC-A01', unitCode: '种植单元A01-001', area: 2500 }, { plotCode: 'WDLC-A02', unitCode: '种植单元A02-002', area: 2500 }],
    assetArea: 5000, planArea: 5000, startDate: '2025-04-20', endDate: '2025-10-15',
    planManager: '张建国', execManager: '李明远', creator: '系统管理员', createTime: '2025-03-01 09:00',
    approver: '王总', approvalStatus: '已审批', remark: '',
    progressStatus: 'executing', completedTasks: 8, totalTasks: 12,
    execDetails: [
      { growthStage: '播种期', process: '播种', step: '精量播种', standard: '株距25cm', start: '2025-04-20', end: '2025-04-25' },
      { growthStage: '苗期', process: '田间管理', step: '中耕除草', standard: '深度10cm', start: '2025-05-10', end: '2025-05-20' },
      { growthStage: '拔节期', process: '施肥', step: '追施氮肥', standard: '15kg/亩', start: '2025-06-01', end: '2025-06-10' }
    ],
    materialPlan: [
      { category: '化肥', type: '尿素', amount: '75000', unit: 'kg', growthStage: '拔节期' },
      { category: '农药', type: '草甘膦', amount: '500', unit: 'kg', growthStage: '苗期' }
    ]
  },
  {
    id: 'P002', planCode: 'ZJ-2025-002', schemeCode: 'FA-2025-002', planName: '五大连池大豆种植计划', org: '五大连池农场',
    cropCategory: '大豆', cropVariety: '黑河43',
    resources: [{ plotCode: 'WDLC-B01', unitCode: '种植单元B01-001', area: 3000 }, { plotCode: 'WDLC-B02', unitCode: '种植单元B02-001', area: 2000 }],
    assetArea: 5000, planArea: 5000, startDate: '2025-05-01', endDate: '2025-09-30',
    planManager: '赵志强', execManager: '孙伟', creator: '系统管理员', createTime: '2025-03-05 10:00',
    approver: '王总', approvalStatus: '已审批', remark: '',
    progressStatus: 'partial_done', completedTasks: 6, totalTasks: 10,
    execDetails: [
      { growthStage: '播种期', process: '播种', step: '机械播种', standard: '行距45cm', start: '2025-05-01', end: '2025-05-05' },
      { growthStage: '花期', process: '植保', step: '喷施叶面肥', standard: '2kg/亩', start: '2025-07-01', end: '2025-07-10' }
    ],
    materialPlan: [
      { category: '化肥', type: '磷酸二铵', amount: '50000', unit: 'kg', growthStage: '播种期' }
    ]
  },
  {
    id: 'P003', planCode: 'ZJ-2025-003', schemeCode: 'FA-2025-003', planName: '双城水稻种植计划', org: '双城农场',
    cropCategory: '水稻', cropVariety: '龙粳31',
    resources: [{ plotCode: 'SC-C01', unitCode: '种植单元C01-001', area: 4000 }],
    assetArea: 4000, planArea: 4000, startDate: '2025-04-10', endDate: '2025-10-20',
    planManager: '刘海涛', execManager: '陈刚', creator: '系统管理员', createTime: '2025-03-10 11:00',
    approver: '王总', approvalStatus: '已审批', remark: '',
    progressStatus: 'all_done', completedTasks: 14, totalTasks: 14,
    execDetails: [
      { growthStage: '播种期', process: '育秧', step: '温室育秧', standard: '秧龄30天', start: '2025-04-10', end: '2025-05-10' },
      { growthStage: '分蘖期', process: '田间管理', step: '晒田控蘖', standard: '晒田7天', start: '2025-06-15', end: '2025-06-22' }
    ],
    materialPlan: [
      { category: '化肥', type: '复合肥', amount: '80000', unit: 'kg', growthStage: '分蘖期' }
    ]
  },
  {
    id: 'P004', planCode: 'ZJ-2025-004', schemeCode: 'FA-2025-004', planName: '法库花生种植计划', org: '法库农场',
    cropCategory: '花生', cropVariety: '花育33',
    resources: [{ plotCode: 'FK-D01', unitCode: '种植单元D01-001', area: 2000 }],
    assetArea: 2000, planArea: 2000, startDate: '2025-05-10', endDate: '2025-09-25',
    planManager: '王永亮', execManager: '周鹏', creator: '系统管理员', createTime: '2025-04-01 09:00',
    approver: '', approvalStatus: '未审批', remark: '待审批',
    progressStatus: 'not_effective', completedTasks: 0, totalTasks: 8,
    execDetails: [
      { growthStage: '播种期', process: '播种', step: '起垄播种', standard: '垄距40cm', start: '2025-05-10', end: '2025-05-15' }
    ],
    materialPlan: []
  },
  {
    id: 'P005', planCode: 'ZJ-2025-005', schemeCode: 'FA-2025-005', planName: '双城马铃薯种植计划', org: '双城农场',
    cropCategory: '马铃薯', cropVariety: '大西洋',
    resources: [{ plotCode: 'SC-E01', unitCode: '种植单元E01-001', area: 1500 }],
    assetArea: 1500, planArea: 1500, startDate: '2025-04-15', endDate: '2025-08-30',
    planManager: '马强', execManager: '于涛', creator: '系统管理员', createTime: '2025-03-15 14:00',
    approver: '王总', approvalStatus: '已审批', remark: '',
    progressStatus: 'archived', completedTasks: 10, totalTasks: 10,
    execDetails: [
      { growthStage: '播种期', process: '播种', step: '切块播种', standard: '株距25cm', start: '2025-04-15', end: '2025-04-20' }
    ],
    materialPlan: []
  },
  {
    id: 'P006', planCode: 'ZJ-2025-006', schemeCode: 'FA-2025-006', planName: '五大连池小麦种植计划', org: '五大连池农场',
    cropCategory: '小麦', cropVariety: '龙麦35',
    resources: [{ plotCode: 'WDLC-F01', unitCode: '种植单元F01-001', area: 3000 }],
    assetArea: 3000, planArea: 3000, startDate: '2025-03-20', endDate: '2025-08-10',
    planManager: '钱明', execManager: '吴磊', creator: '系统管理员', createTime: '2025-02-20 10:00',
    approver: '王总', approvalStatus: '已审批', remark: '',
    progressStatus: 'voided', completedTasks: 0, totalTasks: 8,
    execDetails: [],
    materialPlan: []
  },
  {
    id: 'P007', planCode: 'ZJ-2025-007', schemeCode: 'FA-2025-007', planName: '法库大豆种植计划', org: '法库农场',
    cropCategory: '大豆', cropVariety: '辽豆15',
    resources: [{ plotCode: 'FK-G01', unitCode: '种植单元G01-001', area: 3500 }],
    assetArea: 3500, planArea: 3500, startDate: '2025-05-05', endDate: '2025-10-05',
    planManager: '郑伟', execManager: '黄海', creator: '系统管理员', createTime: '2025-04-05 11:00',
    approver: '王总', approvalStatus: '已审批', remark: '',
    progressStatus: 'not_started', completedTasks: 0, totalTasks: 10,
    execDetails: [
      { growthStage: '播种期', process: '播种', step: '精量播种', standard: '行距50cm', start: '2025-05-05', end: '2025-05-10' }
    ],
    materialPlan: []
  },
  {
    id: 'P008', planCode: 'ZJ-2025-008', schemeCode: 'FA-2025-008', planName: '双城玉米种植计划', org: '双城农场',
    cropCategory: '玉米', cropVariety: '郑单958',
    resources: [{ plotCode: 'SC-H01', unitCode: '种植单元H01-001', area: 4500 }],
    assetArea: 4500, planArea: 4500, startDate: '2025-04-25', endDate: '2025-10-20',
    planManager: '冯磊', execManager: '蒋华', creator: '系统管理员', createTime: '2025-03-20 09:00',
    approver: '王总', approvalStatus: '已审批', remark: '',
    progressStatus: 'executing', completedTasks: 5, totalTasks: 12,
    execDetails: [
      { growthStage: '播种期', process: '播种', step: '机械播种', standard: '株距22cm', start: '2025-04-25', end: '2025-04-30' },
      { growthStage: '苗期', process: '田间管理', step: '间苗定苗', standard: '留苗密度4500株/亩', start: '2025-05-15', end: '2025-05-20' }
    ],
    materialPlan: [
      { category: '化肥', type: '尿素', amount: '67500', unit: 'kg', growthStage: '拔节期' }
    ]
  }
]

// 过滤计划
const filteredPlans = computed(() => {
  return allPlans.filter(p => {
    if (planFilters.value.org) {
      const orgLabel = orgOptions.find(o => o.value === planFilters.value.org)?.label
      if (orgLabel && !p.org.includes(orgLabel.replace(/区域公司$/, ''))) return false
    }
    if (planFilters.value.date) {
      const d = planFilters.value.date
      if (p.startDate > d && p.endDate < d) return false
    }
    return true
  })
})

// 日历格子计算
interface CalendarCell {
  day: number
  isCurrentMonth: boolean
  isToday: boolean
  plans: FarmPlan[]
}

const calendarCells = computed<CalendarCell[]>(() => {
  const year = currentYear.value
  const month = currentMonth.value
  const firstDay = new Date(year, month - 1, 1)
  const lastDay = new Date(year, month, 0)
  const daysInMonth = lastDay.getDate()

  // Monday=0, Sunday=6
  let startWeekday = firstDay.getDay() - 1
  if (startWeekday < 0) startWeekday = 6

  const prevMonthLastDay = new Date(year, month - 1, 0).getDate()
  const today = new Date()
  const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`

  const cells: CalendarCell[] = []

  // Previous month cells
  for (let i = startWeekday - 1; i >= 0; i--) {
    cells.push({ day: prevMonthLastDay - i, isCurrentMonth: false, isToday: false, plans: [] })
  }

  // Current month cells
  for (let d = 1; d <= daysInMonth; d++) {
    const dateStr = `${year}-${String(month).padStart(2, '0')}-${String(d).padStart(2, '0')}`
    const plansOnDate = filteredPlans.value.filter(p => dateStr >= p.startDate && dateStr <= p.endDate)
    cells.push({
      day: d,
      isCurrentMonth: true,
      isToday: dateStr === todayStr,
      plans: plansOnDate
    })
  }

  // Next month cells
  const remaining = 42 - cells.length
  for (let d = 1; d <= remaining; d++) {
    cells.push({ day: d, isCurrentMonth: false, isToday: false, plans: [] })
  }

  return cells
})

function prevMonth() {
  if (currentMonth.value === 1) {
    currentMonth.value = 12
    currentYear.value--
  } else {
    currentMonth.value--
  }
}

function nextMonth() {
  if (currentMonth.value === 12) {
    currentMonth.value = 1
    currentYear.value++
  } else {
    currentMonth.value++
  }
}

function resetPlanFilters() {
  planFilters.value = { org: '', date: '' }
}

function openPlanDetail(plan: FarmPlan) {
  selectedPlan.value = plan
  detailDialogVisible.value = true
}

// ==================== 任务看板模块 ====================
const showGrowthDropdown = ref(false)
const showProcessDropdown = ref(false)
const showStepDropdown = ref(false)

const taskFilters = ref({
  growthStages: [] as string[],
  processes: [] as string[],
  steps: [] as string[],
  startDate: '',
  endDate: ''
})

const growthStageOptions = ['播种期', '苗期', '分蘖期', '拔节期', '抽穗期', '花期', '灌浆期', '成熟期', '收获期']
const processOptions = ['播种', '田间管理', '施肥', '植保', '灌溉', '收获']
const stepOptions = ['精量播种', '机械播种', '中耕除草', '追施氮肥', '喷施叶面肥', '晒田控蘖', '起垄播种', '间苗定苗', '收割作业']

function toggleGrowthStage(stage: string) {
  const idx = taskFilters.value.growthStages.indexOf(stage)
  if (idx >= 0) taskFilters.value.growthStages.splice(idx, 1)
  else taskFilters.value.growthStages.push(stage)
}

function toggleProcess(proc: string) {
  const idx = taskFilters.value.processes.indexOf(proc)
  if (idx >= 0) taskFilters.value.processes.splice(idx, 1)
  else taskFilters.value.processes.push(proc)
}

function toggleStep(step: string) {
  const idx = taskFilters.value.steps.indexOf(step)
  if (idx >= 0) taskFilters.value.steps.splice(idx, 1)
  else taskFilters.value.steps.push(step)
}

function resetTaskFilters() {
  taskFilters.value = { growthStages: [], processes: [], steps: [], startDate: '', endDate: '' }
  taskCurrentPage.value = 1
}

// 任务状态配置
const taskStatusColors: Record<TaskStatus, { badge: string; bar: string }> = {
  pending_issue: { badge: 'bg-gray-100 text-gray-700', bar: 'bg-gray-400' },
  issued: { badge: 'bg-indigo-100 text-indigo-700', bar: 'bg-indigo-400' },
  executing: { badge: 'bg-blue-100 text-blue-700', bar: 'bg-blue-500' },
  completed: { badge: 'bg-green-100 text-green-700', bar: 'bg-green-500' },
  failed: { badge: 'bg-red-100 text-red-700', bar: 'bg-red-500' },
  cancelled: { badge: 'bg-gray-100 text-gray-500', bar: 'bg-gray-300' }
}

function taskStatusBadgeClass(status: TaskStatus): string {
  return taskStatusColors[status]?.badge || 'bg-gray-100 text-gray-700'
}

function taskStatusBarClass(status: TaskStatus): string {
  return taskStatusColors[status]?.bar || 'bg-gray-400'
}

function taskStatusLabel(status: TaskStatus): string {
  const map: Record<TaskStatus, string> = {
    pending_issue: '待下发',
    issued: '已下发',
    executing: '执行中',
    completed: '已完成',
    failed: '失败',
    cancelled: '已取消'
  }
  return map[status] || status
}

// 模拟任务数据
const allTasks: FarmTask[] = [
  { id: 'T001', step: '精量播种', growthStage: '播种期', process: '播种', area: 5000, manager: '李明远', executor: '张三', actualEndTime: '', plotName: '龙泉分场A区', plotCode: 'WDLC-A01', equipment: '约翰迪尔播种机', taskStatus: 'completed', imageUrl: 'https://picsum.photos/seed/farm01/400/200', planDate: '2025-04-20' },
  { id: 'T002', step: '中耕除草', growthStage: '苗期', process: '田间管理', area: 5000, manager: '李明远', executor: '李四', actualEndTime: '', plotName: '龙泉分场A区', plotCode: 'WDLC-A01', equipment: '中耕机', taskStatus: 'executing', imageUrl: 'https://picsum.photos/seed/farm02/400/200', planDate: '2025-05-10' },
  { id: 'T003', step: '追施氮肥', growthStage: '拔节期', process: '施肥', area: 5000, manager: '李明远', executor: '王五', actualEndTime: '', plotName: '龙泉分场A区', plotCode: 'WDLC-A01', equipment: '撒肥机', taskStatus: 'issued', imageUrl: '', planDate: '2025-06-01' },
  { id: 'T004', step: '机械播种', growthStage: '播种期', process: '播种', area: 5000, manager: '孙伟', executor: '赵六', actualEndTime: '2025-05-05', plotName: '龙泉分场B区', plotCode: 'WDLC-B01', equipment: '大豆播种机', taskStatus: 'completed', imageUrl: 'https://picsum.photos/seed/farm03/400/200', planDate: '2025-05-01' },
  { id: 'T005', step: '喷施叶面肥', growthStage: '花期', process: '植保', area: 5000, manager: '孙伟', executor: '钱七', actualEndTime: '', plotName: '龙泉分场B区', plotCode: 'WDLC-B01', equipment: '植保无人机', taskStatus: 'executing', imageUrl: 'https://picsum.photos/seed/farm04/400/200', planDate: '2025-07-01' },
  { id: 'T006', step: '温室育秧', growthStage: '播种期', process: '播种', area: 4000, manager: '陈刚', executor: '孙八', actualEndTime: '2025-05-08', plotName: '双城农场C区', plotCode: 'SC-C01', equipment: '育秧流水线', taskStatus: 'completed', imageUrl: 'https://picsum.photos/seed/farm05/400/200', planDate: '2025-04-10' },
  { id: 'T007', step: '晒田控蘖', growthStage: '分蘖期', process: '田间管理', area: 4000, manager: '陈刚', executor: '周九', actualEndTime: '2025-06-22', plotName: '双城农场C区', plotCode: 'SC-C01', equipment: '-', taskStatus: 'completed', imageUrl: 'https://picsum.photos/seed/farm06/400/200', planDate: '2025-06-15' },
  { id: 'T008', step: '起垄播种', growthStage: '播种期', process: '播种', area: 2000, manager: '周鹏', executor: '吴十', actualEndTime: '', plotName: '法库农场D区', plotCode: 'FK-D01', equipment: '起垄播种一体机', taskStatus: 'pending_issue', imageUrl: '', planDate: '2025-05-10' },
  { id: 'T009', step: '间苗定苗', growthStage: '苗期', process: '田间管理', area: 4500, manager: '蒋华', executor: '郑一', actualEndTime: '', plotName: '双城农场H区', plotCode: 'SC-H01', equipment: '-', taskStatus: 'executing', imageUrl: 'https://picsum.photos/seed/farm07/400/200', planDate: '2025-05-15' },
  { id: 'T010', step: '追施氮肥', growthStage: '拔节期', process: '施肥', area: 4500, manager: '蒋华', executor: '冯二', actualEndTime: '', plotName: '双城农场H区', plotCode: 'SC-H01', equipment: '撒肥车', taskStatus: 'issued', imageUrl: '', planDate: '2025-06-05' },
  { id: 'T011', step: '收割作业', growthStage: '成熟期', process: '收获', area: 3000, manager: '吴磊', executor: '何三', actualEndTime: '', plotName: '五大连池F区', plotCode: 'WDLC-F01', equipment: '-', taskStatus: 'cancelled', imageUrl: '', planDate: '2025-07-20' },
  { id: 'T012', step: '精量播种', growthStage: '播种期', process: '播种', area: 3500, manager: '黄海', executor: '施四', actualEndTime: '', plotName: '法库农场G区', plotCode: 'FK-G01', equipment: '大豆精播机', taskStatus: 'pending_issue', imageUrl: '', planDate: '2025-05-05' }
]

const filteredTasks = computed(() => {
  return allTasks.filter(t => {
    if (taskFilters.value.growthStages.length > 0 && !taskFilters.value.growthStages.includes(t.growthStage)) return false
    if (taskFilters.value.processes.length > 0 && !taskFilters.value.processes.includes(t.process)) return false
    if (taskFilters.value.steps.length > 0 && !taskFilters.value.steps.includes(t.step)) return false
    if (taskFilters.value.startDate && t.planDate < taskFilters.value.startDate) return false
    if (taskFilters.value.endDate && t.planDate > taskFilters.value.endDate) return false
    return true
  })
})

// 任务看板分页
const taskCurrentPage = ref(1)
const taskPageSize = 8

const taskTotalPages = computed(() => Math.max(1, Math.ceil(filteredTasks.value.length / taskPageSize)))

const paginatedTasks = computed(() => {
  const start = (taskCurrentPage.value - 1) * taskPageSize
  return filteredTasks.value.slice(start, start + taskPageSize)
})

const taskVisiblePages = computed(() => {
  const total = taskTotalPages.value
  const current = taskCurrentPage.value
  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1)
  }
  if (current <= 3) {
    return [1, 2, 3, 4, '...', total]
  }
  if (current >= total - 2) {
    return [1, '...', total - 3, total - 2, total - 1, total]
  }
  return [1, '...', current - 1, current, current + 1, '...', total]
})

// 查询条件变化时重置页码
watch([() => taskFilters.value.growthStages, () => taskFilters.value.processes, () => taskFilters.value.steps, () => taskFilters.value.startDate, () => taskFilters.value.endDate], () => {
  taskCurrentPage.value = 1
}, { deep: true })
</script>
