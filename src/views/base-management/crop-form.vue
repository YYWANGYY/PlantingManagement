<template>
  <div class="flex h-full -m-6">
    <!-- 左侧作物树 -->
    <div class="w-64 shrink-0 border-r bg-card flex flex-col">
      <div class="flex items-center justify-between p-4 border-b">
        <h3 class="text-sm font-semibold">我的作物</h3>
        <button
          class="inline-flex items-center justify-center rounded-md h-7 w-7 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
          title="新增作物大类"
          @click="addMajor"
        >
          <Plus class="h-4 w-4" />
        </button>
      </div>
      <div class="flex-1 overflow-auto p-2">
        <div v-for="cat in treeData" :key="cat.code" class="mb-1">
          <!-- 一级：作物类别（不可点击选中） -->
          <div
            class="flex items-center gap-1.5 rounded-md px-2 py-1.5 text-sm cursor-pointer transition-colors hover:bg-muted"
            @click="toggleNode(cat.code)"
          >
            <ChevronRight
              class="h-3.5 w-3.5 shrink-0 transition-transform"
              :class="expandedNodes.has(cat.code) ? 'rotate-90' : ''"
              @click.stop="toggleNode(cat.code)"
            />
            <component :is="cat.icon" class="h-4 w-4 shrink-0" :class="cat.iconColor" />
            <span class="truncate font-medium">{{ cat.name }}</span>
            <span class="ml-auto text-xs text-muted-foreground">{{ cat.majors.length }}</span>
          </div>
          <!-- 二级：作物大类（可点击选中） -->
          <div v-if="expandedNodes.has(cat.code)" class="ml-5 mt-0.5 space-y-0.5">
            <div
              v-for="m in cat.majors"
              :key="m.code"
              class="flex items-center gap-1.5 rounded-md px-2 py-1.5 text-sm cursor-pointer transition-colors"
              :class="selectedMajor === m.code ? 'bg-primary/10 text-primary font-medium' : 'text-muted-foreground hover:bg-muted hover:text-foreground'"
              @click="selectMajor(m.code)"
            >
              <span class="truncate">{{ m.name }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 右侧选项卡 + 内容 -->
    <div class="flex-1 flex flex-col min-w-0 overflow-hidden">
      <!-- 顶部标题栏 -->
      <div class="flex items-center justify-between border-b px-6 py-4">
        <div class="flex items-center gap-3">
          <button
            class="inline-flex items-center justify-center rounded-md h-8 w-8 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
            @click="goBack"
          >
            <ArrowLeft class="h-4 w-4" />
          </button>
          <div>
            <h2 class="text-lg font-semibold">{{ currentTitle }}</h2>
            <p class="text-xs text-muted-foreground">{{ currentSubtitle }}</p>
          </div>
        </div>
      </div>

      <!-- 选项卡 -->
      <div class="flex border-b px-6">
        <button
          v-for="tab in tabs"
          :key="tab.key"
          class="relative px-4 py-2.5 text-sm font-medium transition-colors"
          :class="activeTab === tab.key ? 'text-primary' : 'text-muted-foreground hover:text-foreground'"
          @click="activeTab = tab.key"
        >
          {{ tab.label }}
          <span
            v-if="activeTab === tab.key"
            class="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
          />
        </button>
      </div>

      <!-- 选项卡内容 -->
      <div class="flex-1 overflow-auto p-6">
        <!-- 种植品种 -->
        <div v-if="activeTab === 'variety'">
          <div class="flex items-center justify-between mb-4">
            <div class="flex items-center gap-3">
              <div class="relative">
                <Search class="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  v-model="varietySearch"
                  type="text"
                  placeholder="搜索品种名称..."
                  class="h-9 w-64 rounded-md border border-input bg-background pl-8 pr-3 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                />
              </div>
              <span class="text-sm text-muted-foreground">共 {{ filteredVarieties.length }} 个品种</span>
            </div>
            <button
              class="inline-flex items-center justify-center gap-1.5 rounded-md bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90"
              @click="addVariety"
            >
              <Plus class="h-4 w-4" /> 新增品种
            </button>
          </div>
          <table class="w-full text-sm">
            <thead>
              <tr class="border-b bg-muted/50">
                <th class="h-10 px-4 text-left font-medium text-muted-foreground">品种名称</th>
                <th class="h-10 px-4 text-left font-medium text-muted-foreground">生长周期</th>
                <th class="h-10 px-4 text-left font-medium text-muted-foreground">适宜季节</th>
                <th class="h-10 px-4 text-left font-medium text-muted-foreground">种植区域</th>
                <th class="h-10 px-4 text-left font-medium text-muted-foreground">土壤类型</th>
                <th class="h-10 px-4 text-left font-medium text-muted-foreground">状态</th>
                <th class="h-10 px-4 text-right font-medium text-muted-foreground">操作</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="v in filteredVarieties" :key="v.code" class="border-b hover:bg-muted/30 transition-colors">
                <td class="p-4 font-medium">{{ v.name }}</td>
                <td class="p-4">{{ v.growthCycle }}</td>
                <td class="p-4">{{ v.season }}</td>
                <td class="p-4">{{ v.region }}</td>
                <td class="p-4">{{ v.soilType }}</td>
                <td class="p-4">
                  <span
                    class="inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium"
                    :class="v.status === '启用' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'"
                  >{{ v.status }}</span>
                </td>
                <td class="p-4 text-right">
                  <div class="flex items-center justify-end gap-1">
                    <Pencil class="h-4 w-4 text-muted-foreground hover:text-primary cursor-pointer" @click="editVariety(v)" />
                    <Trash2 class="h-4 w-4 text-muted-foreground hover:text-destructive cursor-pointer" @click="deleteVariety(v)" />
                  </div>
                </td>
              </tr>
              <tr v-if="filteredVarieties.length === 0">
                <td colspan="7" class="p-8 text-center text-muted-foreground">暂无品种数据</td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- 生育周期 -->
        <div v-if="activeTab === 'growth-cycle'">
          <!-- 工具栏 -->
          <div class="flex items-center justify-between mb-3">
            <span class="text-sm text-muted-foreground">共 {{ currentGrowthCycles.length }} 个生育时期</span>
            <button
              class="inline-flex items-center justify-center gap-1.5 rounded-md bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90"
              @click="openGcDialog()"
            >
              <Plus class="h-4 w-4" /> 新增生育时期
            </button>
          </div>
          <table class="w-full text-sm">
            <thead>
              <tr class="border-b bg-muted/50">
                <th class="h-10 px-4 text-left font-medium text-muted-foreground w-16">序号</th>
                <th class="h-10 px-4 text-left font-medium text-muted-foreground">生育时期</th>
                <th class="h-10 px-4 text-left font-medium text-muted-foreground">生产流程</th>
                <th class="h-10 px-4 text-left font-medium text-muted-foreground w-24">预计天数</th>
                <th class="h-10 px-4 text-right font-medium text-muted-foreground w-24">操作</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(gc, idx) in currentGrowthCycles" :key="gc.id" class="border-b hover:bg-muted/30 transition-colors">
                <td class="p-4 text-muted-foreground">{{ idx + 1 }}</td>
                <td class="p-4">
                  <span class="inline-flex items-center rounded-md bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">{{ gc.stage }}</span>
                </td>
                <td class="p-4">
                  <div class="flex flex-wrap items-center gap-1">
                    <template v-for="(step, si) in gc.processSteps" :key="si">
                      <span class="inline-flex items-center rounded bg-muted px-1.5 py-0.5 text-xs">{{ step }}</span>
                      <ChevronRight v-if="si < gc.processSteps.length - 1" class="h-3 w-3 text-muted-foreground shrink-0" />
                    </template>
                  </div>
                </td>
                <td class="p-4">{{ gc.days }}天</td>
                <td class="p-4 text-right">
                  <div class="flex items-center justify-end gap-1">
                    <Pencil class="h-4 w-4 text-muted-foreground hover:text-primary cursor-pointer" @click="openGcDialog(gc)" />
                    <Trash2 class="h-4 w-4 text-muted-foreground hover:text-destructive cursor-pointer" @click="deleteGc(gc.id)" />
                  </div>
                </td>
              </tr>
              <tr v-if="currentGrowthCycles.length === 0">
                <td colspan="5" class="p-8 text-center text-muted-foreground">暂无生育周期数据</td>
              </tr>
            </tbody>
          </table>
          <!-- 生育流程图 -->
          <div v-if="currentGrowthCycles.length > 0" class="mt-6">
            <h4 class="text-sm font-medium mb-3">生产流程图</h4>
            <div class="flex items-center overflow-x-auto pb-2">
              <template v-for="(gc, idx) in currentGrowthCycles" :key="gc.id">
                <div class="flex flex-col items-center shrink-0">
                  <div class="rounded-lg border bg-card px-3 py-2 text-center min-w-[80px]">
                    <p class="text-xs font-medium text-primary">{{ gc.stage }}</p>
                    <p class="text-xs text-muted-foreground mt-0.5">{{ gc.days }}天</p>
                  </div>
                </div>
                <div v-if="idx < currentGrowthCycles.length - 1" class="flex items-center px-1 shrink-0 text-muted-foreground">
                  <ChevronRight class="h-4 w-4" />
                </div>
              </template>
            </div>
          </div>
        </div>

        <!-- 生育周期 新增/编辑弹窗 -->
        <div v-if="gcDialogVisible" class="fixed inset-0 z-50 flex items-center justify-center">
          <div class="fixed inset-0 bg-black/50" @click="gcDialogVisible = false" />
          <div class="relative z-10 w-full max-w-lg rounded-lg border bg-background shadow-lg">
            <div class="flex items-center justify-between border-b px-6 py-4">
              <h3 class="text-lg font-semibold">{{ gcEditing ? '编辑生育时期' : '新增生育时期' }}</h3>
              <button class="text-muted-foreground hover:text-foreground" @click="gcDialogVisible = false">
                <X class="h-5 w-5" />
              </button>
            </div>
            <div class="space-y-4 px-6 py-4">
              <!-- 生育时期 -->
              <div>
                <label class="mb-1.5 block text-sm font-medium">生育时期</label>
                <input
                  v-model="gcForm.stage"
                  type="text"
                  placeholder="如：播种期、苗期、分蘖期..."
                  class="w-full rounded-md border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                />
              </div>
              <!-- 预计天数 -->
              <div>
                <label class="mb-1.5 block text-sm font-medium">预计天数</label>
                <input
                  v-model.number="gcForm.days"
                  type="number"
                  min="1"
                  placeholder="请输入天数"
                  class="w-full rounded-md border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                />
              </div>
              <!-- 生育流程 -->
              <div>
                <div class="mb-1.5 flex items-center justify-between">
                  <label class="text-sm font-medium">生产流程（步骤）</label>
                  <button
                    class="inline-flex items-center gap-1 text-xs text-primary hover:text-primary/80"
                    @click="addProcessStep"
                  >
                    <Plus class="h-3 w-3" /> 添加步骤
                  </button>
                </div>
                <div class="space-y-2">
                  <div v-for="(step, si) in gcForm.processSteps" :key="si" class="flex items-center gap-2">
                    <span class="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-medium text-primary">{{ si + 1 }}</span>
                    <input
                      v-model="gcForm.processSteps[si]"
                      type="text"
                      placeholder="请输入流程步骤"
                      class="flex-1 rounded-md border bg-background px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                    />
                    <button
                      v-if="gcForm.processSteps.length > 1"
                      class="shrink-0 text-muted-foreground hover:text-destructive"
                      @click="removeProcessStep(si)"
                    >
                      <X class="h-4 w-4" />
                    </button>
                  </div>
                </div>
                <!-- 流程预览 -->
                <div v-if="gcForm.processSteps.some(s => s.trim())" class="mt-3 rounded-md border bg-muted/30 p-3">
                  <p class="mb-1 text-xs text-muted-foreground">流程预览</p>
                  <div class="flex flex-wrap items-center gap-1">
                    <template v-for="(step, si) in gcForm.processSteps" :key="si">
                      <span v-if="step.trim()" class="inline-flex items-center rounded bg-primary/10 px-1.5 py-0.5 text-xs text-primary">{{ step }}</span>
                      <ChevronRight v-if="step.trim() && si < gcForm.processSteps.filter(s => s.trim()).length - 1 && gcForm.processSteps.slice(si + 1).some(s => s.trim())" class="h-3 w-3 text-muted-foreground shrink-0" />
                    </template>
                  </div>
                </div>
              </div>
            </div>
            <div class="flex items-center justify-end gap-3 border-t px-6 py-4">
              <button
                class="rounded-md border px-4 py-2 text-sm font-medium transition-colors hover:bg-muted"
                @click="gcDialogVisible = false"
              >取消</button>
              <button
                class="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90"
                @click="saveGc"
              >确定</button>
            </div>
          </div>
        </div>

        <!-- 品种维护弹窗 -->
        <div v-if="varietyDialogVisible" class="fixed inset-0 z-50 flex items-center justify-center">
          <div class="fixed inset-0 bg-black/50" @click="varietyDialogVisible = false" />
          <div class="relative z-50 w-[600px] max-h-[85vh] overflow-y-auto rounded-lg border bg-card shadow-lg">
            <!-- 标题 -->
            <div class="flex items-center justify-between border-b px-6 py-4">
              <h3 class="text-lg font-semibold">{{ varietyIsEdit ? '编辑品种' : '新增品种' }}</h3>
              <button class="text-muted-foreground hover:text-foreground" @click="varietyDialogVisible = false">
                <XIcon class="h-4 w-4" />
              </button>
            </div>
            <!-- 表单 -->
            <div class="space-y-4 px-6 py-4">
              <!-- 品种名称 -->
              <div>
                <label class="mb-1.5 block text-sm font-medium">品种名称 <span class="text-red-500">*</span></label>
                <input
                  v-model="varietyForm.name"
                  type="text"
                  placeholder="请输入品种名称"
                  class="w-full rounded-md border bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>
              <!-- 作物大类 -->
              <div>
                <label class="mb-1.5 block text-sm font-medium">所属作物大类 <span class="text-red-500">*</span></label>
                <div class="flex items-center gap-2 rounded-md border bg-muted/50 px-3 py-2 text-sm">
                  <SproutIcon class="h-4 w-4 text-primary" />
                  <span>{{ treeData.flatMap(c => c.majors).find(m => m.code === selectedMajor)?.name || '-' }}</span>
                </div>
              </div>
              <!-- 生长周期 -->
              <div>
                <label class="mb-1.5 block text-sm font-medium">生长周期 <span class="text-red-500">*</span></label>
                <input
                  v-model="varietyForm.growthCycle"
                  type="text"
                  placeholder="如：120天"
                  class="w-full rounded-md border bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>
              <!-- 适宜季节 -->
              <div>
                <label class="mb-1.5 block text-sm font-medium">适宜季节 <span class="text-red-500">*</span></label>
                <select
                  v-model="varietyForm.season"
                  class="w-full rounded-md border bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                >
                  <option value="">请选择</option>
                  <option value="春季">春季</option>
                  <option value="夏季">夏季</option>
                  <option value="秋季">秋季</option>
                  <option value="冬季">冬季</option>
                  <option value="春夏">春夏</option>
                  <option value="夏秋">夏秋</option>
                  <option value="春秋">春秋</option>
                  <option value="全年">全年</option>
                </select>
              </div>
              <!-- 种植区域 -->
              <div>
                <label class="mb-1.5 block text-sm font-medium">种植区域 <span class="text-red-500">*</span></label>
                <input
                  v-model="varietyForm.region"
                  type="text"
                  placeholder="如：华北平原、东北地区"
                  class="w-full rounded-md border bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>
              <!-- 土壤类型 -->
              <div>
                <label class="mb-1.5 block text-sm font-medium">土壤类型 <span class="text-red-500">*</span></label>
                <select
                  v-model="varietyForm.soilType"
                  class="w-full rounded-md border bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                >
                  <option value="">请选择</option>
                  <option value="壤土">壤土</option>
                  <option value="砂壤土">砂壤土</option>
                  <option value="黏壤土">黏壤土</option>
                  <option value="砂土">砂土</option>
                  <option value="黏土">黏土</option>
                  <option value="黑土">黑土</option>
                  <option value="红壤">红壤</option>
                  <option value="黄土">黄土</option>
                  <option value="盐碱地">盐碱地</option>
                </select>
              </div>
              <!-- 状态 -->
              <div>
                <label class="mb-1.5 block text-sm font-medium">状态</label>
                <div class="flex items-center gap-3">
                  <label class="flex items-center gap-1.5 text-sm">
                    <input v-model="varietyForm.status" type="radio" value="启用" class="accent-primary" />
                    启用
                  </label>
                  <label class="flex items-center gap-1.5 text-sm">
                    <input v-model="varietyForm.status" type="radio" value="停用" class="accent-primary" />
                    停用
                  </label>
                </div>
              </div>
            </div>
            <!-- 底部按钮 -->
            <div class="flex justify-end gap-3 border-t px-6 py-4">
              <button
                class="rounded-md border px-4 py-2 text-sm hover:bg-muted"
                @click="varietyDialogVisible = false"
              >取消</button>
              <button
                class="rounded-md bg-primary px-4 py-2 text-sm text-primary-foreground hover:bg-primary/90"
                @click="saveVariety"
              >确定</button>
            </div>
          </div>
        </div>

        <!-- 农事作业编辑弹窗 -->
        <div v-if="fwDialogVisible" class="fixed inset-0 z-50 flex items-center justify-center">
          <div class="fixed inset-0 bg-black/50" @click="fwDialogVisible = false" />
          <div class="relative z-50 w-[680px] max-h-[85vh] overflow-y-auto rounded-lg border bg-card shadow-lg">
            <div class="sticky top-0 flex items-center justify-between border-b px-6 py-4 bg-card">
              <h3 class="text-lg font-semibold">{{ fwEditing ? '编辑农事作业' : '新增农事作业' }}</h3>
              <button class="text-muted-foreground hover:text-foreground" @click="fwDialogVisible = false">
                <X :size="18" />
              </button>
            </div>
            <div class="p-6 space-y-5">
              <!-- 基本信息 -->
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label class="mb-1.5 block text-sm font-medium">农事环节</label>
                  <select v-model="fwForm.farmStage" class="w-full rounded-md border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30">
                    <option value="">请选择农事环节</option>
                    <option v-for="link in farmingLinkOptions" :key="link" :value="link">{{ link }}</option>
                  </select>
                </div>
                <div>
                  <label class="mb-1.5 block text-sm font-medium">作业环节</label>
                  <input v-model="fwForm.workStage" type="text" placeholder="输入作业环节名称" class="w-full rounded-md border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
                </div>
              </div>

              <!-- 核心农事操作标准 -->
              <div>
                <h4 class="mb-2 text-sm font-semibold text-foreground flex items-center gap-1.5">
                  <span class="inline-block h-1.5 w-1.5 rounded-full bg-primary"></span>
                  核心农事操作标准
                </h4>
                <div class="space-y-3 rounded-lg border p-4">
                  <div>
                    <label class="mb-1 block text-xs font-medium text-muted-foreground">操作要求</label>
                    <textarea v-model="fwForm.standardDetail.operationReq" rows="2" placeholder="填写标准化操作要求" class="w-full rounded-md border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none" />
                  </div>
                  <div>
                    <label class="mb-1 block text-xs font-medium text-muted-foreground">质量验收标准</label>
                    <textarea v-model="fwForm.standardDetail.qualityStandard" rows="2" placeholder="填写质量验收标准" class="w-full rounded-md border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none" />
                  </div>
                  <div>
                    <label class="mb-1 block text-xs font-medium text-muted-foreground">农艺管控要点</label>
                    <textarea v-model="fwForm.standardDetail.controlPoints" rows="2" placeholder="填写农艺管控要点" class="w-full rounded-md border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none" />
                  </div>
                </div>
              </div>

              <!-- 设施环境管控要求 -->
              <div>
                <h4 class="mb-2 text-sm font-semibold text-foreground flex items-center gap-1.5">
                  <span class="inline-block h-1.5 w-1.5 rounded-full bg-blue-500"></span>
                  设施环境管控要求
                </h4>
                <div class="space-y-3 rounded-lg border p-4">
                  <div class="grid grid-cols-2 gap-3">
                    <div>
                      <label class="mb-1 block text-xs font-medium text-muted-foreground">温度</label>
                      <input v-model="fwForm.facilityDetail.temperature" type="text" placeholder="如：25-28℃" class="w-full rounded-md border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
                    </div>
                    <div>
                      <label class="mb-1 block text-xs font-medium text-muted-foreground">湿度</label>
                      <input v-model="fwForm.facilityDetail.humidity" type="text" placeholder="如：60-70%" class="w-full rounded-md border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
                    </div>
                    <div>
                      <label class="mb-1 block text-xs font-medium text-muted-foreground">光照</label>
                      <input v-model="fwForm.facilityDetail.light" type="text" placeholder="如：12h/天" class="w-full rounded-md border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
                    </div>
                    <div>
                      <label class="mb-1 block text-xs font-medium text-muted-foreground">CO2浓度</label>
                      <input v-model="fwForm.facilityDetail.co2" type="text" placeholder="如：400-600ppm" class="w-full rounded-md border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
                    </div>
                    <div>
                      <label class="mb-1 block text-xs font-medium text-muted-foreground">通风</label>
                      <input v-model="fwForm.facilityDetail.ventilation" type="text" placeholder="如：适当通风换气" class="w-full rounded-md border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
                    </div>
                    <div>
                      <label class="mb-1 block text-xs font-medium text-muted-foreground">其他</label>
                      <input v-model="fwForm.facilityDetail.other" type="text" placeholder="其他环境要求" class="w-full rounded-md border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
                    </div>
                  </div>
                </div>
              </div>

              <!-- 作业参数标准 -->
              <div>
                <h4 class="mb-2 text-sm font-semibold text-foreground flex items-center justify-between">
                  <span class="flex items-center gap-1.5">
                    <span class="inline-block h-1.5 w-1.5 rounded-full bg-amber-500"></span>
                    作业参数标准
                  </span>
                  <button class="text-xs text-primary hover:underline" @click="addFwParam">+ 添加参数</button>
                </h4>
                <div class="space-y-2 rounded-lg border p-4">
                  <div v-for="(param, pi) in fwForm.paramDetails" :key="pi" class="flex items-center gap-2">
                    <input v-model="param.name" type="text" placeholder="参数名称" class="flex-1 rounded-md border bg-background px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
                    <input v-model="param.value" type="text" placeholder="参数值" class="flex-1 rounded-md border bg-background px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
                    <button class="text-muted-foreground hover:text-red-500 shrink-0" @click="fwForm.paramDetails.splice(pi, 1)">
                      <X :size="14" />
                    </button>
                  </div>
                  <div v-if="fwForm.paramDetails.length === 0" class="py-2 text-center text-xs text-muted-foreground">暂无参数，点击上方添加</div>
                </div>
              </div>
            </div>
            <div class="sticky bottom-0 flex justify-end gap-3 border-t px-6 py-4 bg-card">
              <button class="rounded-md border px-4 py-2 text-sm hover:bg-muted" @click="fwDialogVisible = false">取消</button>
              <button
                class="rounded-md bg-primary px-4 py-2 text-sm text-primary-foreground hover:bg-primary/90"
                @click="saveFw"
              >确定</button>
            </div>
          </div>
        </div>

        <!-- 农事作业 -->
        <div v-if="activeTab === 'farm-work'">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-sm font-medium text-muted-foreground">共 {{ currentFarmWorks.length }} 条农事作业</h3>
            <button class="inline-flex items-center gap-1.5 rounded-md bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground hover:bg-primary/90" @click="openFwDialog()">
              <Plus class="h-4 w-4" /> 新增农事作业
            </button>
          </div>
          <div class="space-y-4">
            <div
              v-for="fw in currentFarmWorks"
              :key="fw.id"
              class="rounded-lg border shadow-sm"
            >
              <div class="flex items-center justify-between border-b bg-muted/30 px-4 py-2.5">
                <div class="flex items-center gap-2">
                  <span class="inline-flex items-center rounded-md bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">{{ fw.farmStage }}</span>
                  <span class="text-sm font-medium">{{ fw.workStage }}</span>
                </div>
                <div class="flex items-center gap-1">
                  <Pencil class="h-4 w-4 text-muted-foreground hover:text-primary cursor-pointer" @click="openFwDialog(fw)" />
                  <Trash2 class="h-4 w-4 text-muted-foreground hover:text-destructive cursor-pointer" @click="deleteFw(fw.id)" />
                </div>
              </div>
              <div class="p-4 space-y-3">
                <!-- 核心农事操作标准 -->
                <div>
                  <p class="text-xs font-medium text-muted-foreground mb-1.5">核心农事操作标准</p>
                  <div class="rounded-md bg-muted/50 p-3 space-y-1.5 text-sm" v-if="fw.standardDetail">
                    <div class="flex"><span class="text-muted-foreground w-24 shrink-0">操作要求：</span><span>{{ fw.standardDetail.operationReq || fw.standard }}</span></div>
                    <div class="flex"><span class="text-muted-foreground w-24 shrink-0">质量标准：</span><span>{{ fw.standardDetail.qualityStandard || '-' }}</span></div>
                    <div class="flex"><span class="text-muted-foreground w-24 shrink-0">管控要点：</span><span>{{ fw.standardDetail.controlPoints || '-' }}</span></div>
                  </div>
                  <p class="text-sm" v-else>{{ fw.standard }}</p>
                </div>
                <!-- 设施环境管控要求 -->
                <div>
                  <p class="text-xs font-medium text-muted-foreground mb-1.5">设施环境管控要求</p>
                  <div class="rounded-md bg-muted/50 p-3" v-if="fw.facilityDetail">
                    <div class="grid grid-cols-3 gap-2 text-sm">
                      <div><span class="text-muted-foreground">温度：</span>{{ fw.facilityDetail.temperature || '-' }}</div>
                      <div><span class="text-muted-foreground">湿度：</span>{{ fw.facilityDetail.humidity || '-' }}</div>
                      <div><span class="text-muted-foreground">光照：</span>{{ fw.facilityDetail.light || '-' }}</div>
                      <div><span class="text-muted-foreground">CO₂：</span>{{ fw.facilityDetail.co2 || '-' }}</div>
                      <div><span class="text-muted-foreground">通风：</span>{{ fw.facilityDetail.ventilation || '-' }}</div>
                      <div><span class="text-muted-foreground">其他：</span>{{ fw.facilityDetail.other || '-' }}</div>
                    </div>
                  </div>
                  <p class="text-sm" v-else>{{ fw.facilityReq }}</p>
                </div>
                <!-- 作业参数 -->
                <div>
                  <p class="text-xs font-medium text-muted-foreground mb-1.5">作业参数标准</p>
                  <div class="flex flex-wrap gap-2" v-if="fw.paramDetails && fw.paramDetails.length">
                    <span v-for="p in fw.paramDetails" :key="p.name" class="inline-flex items-center rounded-md bg-muted px-2 py-0.5 text-xs"><span class="text-muted-foreground mr-1">{{ p.name }}：</span>{{ p.value }}</span>
                  </div>
                  <div class="flex flex-wrap gap-2" v-else>
                    <span v-for="p in fw.params" :key="p" class="inline-flex items-center rounded-md bg-muted px-2 py-0.5 text-xs text-muted-foreground">{{ p }}</span>
                  </div>
                </div>
              </div>
            </div>
            <div v-if="currentFarmWorks.length === 0" class="py-12 text-center text-muted-foreground">
              暂无农事作业数据
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import {
  Plus, ArrowLeft, Search, Pencil, Trash2, ChevronRight, X,
  Wheat, Coins, Leaf, Apple, TreePine, Flower2,
} from 'lucide-vue-next'

const router = useRouter()
const route = useRoute()

const selectedMajor = ref('rice')
const activeTab = ref<'variety' | 'growth-cycle' | 'farm-work'>('variety')
const varietySearch = ref('')
const expandedNodes = ref(new Set<string>(['grain']))

const tabs = [
  { key: 'variety' as const, label: '种植品种' },
  { key: 'growth-cycle' as const, label: '生育周期' },
  { key: 'farm-work' as const, label: '农事作业' },
]

// 一级：作物类别 → 二级：作物大类
const treeData = ref([
  {
    code: 'grain', name: '粮食作物', icon: Wheat, iconColor: 'text-amber-600',
    majors: [
      { code: 'rice', name: '水稻' },
      { code: 'wheat', name: '小麦' },
      { code: 'corn', name: '玉米' },
      { code: 'soybean', name: '大豆' },
    ],
  },
  {
    code: 'cash', name: '经济作物', icon: Coins, iconColor: 'text-emerald-600',
    majors: [
      { code: 'cotton', name: '棉花' },
      { code: 'rape', name: '油菜' },
      { code: 'peanut', name: '花生' },
    ],
  },
  {
    code: 'vegetable', name: '蔬菜', icon: Leaf, iconColor: 'text-green-600',
    majors: [
      { code: 'tomato', name: '番茄' },
      { code: 'cucumber', name: '黄瓜' },
      { code: 'cabbage', name: '白菜' },
    ],
  },
  {
    code: 'fruit', name: '水果', icon: Apple, iconColor: 'text-red-600',
    majors: [
      { code: 'apple', name: '苹果' },
      { code: 'grape', name: '葡萄' },
    ],
  },
  {
    code: 'forage', name: '牧草', icon: TreePine, iconColor: 'text-teal-600',
    majors: [
      { code: 'alfalfa', name: '紫花苜蓿' },
    ],
  },
  {
    code: 'flower', name: '花卉', icon: Flower2, iconColor: 'text-pink-600',
    majors: [
      { code: 'rose', name: '玫瑰' },
    ],
  },
])

// 品种数据
interface VarietyItem {
  code: string
  name: string
  majorCode: string
  growthCycle: string
  season: string
  region: string
  soilType: string
  status: '启用' | '停用'
}

const varieties = ref<VarietyItem[]>([
  // 水稻
  { code: 'v1', name: 'Y两优900', majorCode: 'rice', growthCycle: '150-170天', season: '春季/夏季', region: '东北地区', soilType: '黑土/黏土', status: '启用' },
  { code: 'v2', name: '湘早籼45号', majorCode: 'rice', growthCycle: '110-120天', season: '春季', region: '长江中下游', soilType: '黏土', status: '启用' },
  { code: 'v3', name: '丰两优4号', majorCode: 'rice', growthCycle: '130-140天', season: '春季/夏季', region: '华南地区', soilType: '红壤/黏土', status: '停用' },
  // 小麦
  { code: 'v4', name: '郑麦9023', majorCode: 'wheat', growthCycle: '220-240天', season: '秋季/冬季', region: '黄淮海地区', soilType: '黄土/沙壤土', status: '启用' },
  { code: 'v5', name: '济麦22', majorCode: 'wheat', growthCycle: '225-245天', season: '秋季/冬季', region: '黄淮海地区', soilType: '黄土', status: '启用' },
  // 玉米
  { code: 'v6', name: '先玉335', majorCode: 'corn', growthCycle: '100-120天', season: '春季/夏季', region: '东北地区/华北地区', soilType: '黑土/沙壤土', status: '启用' },
  { code: 'v7', name: '登海605', majorCode: 'corn', growthCycle: '95-110天', season: '夏季', region: '黄淮海地区', soilType: '沙壤土', status: '启用' },
  // 大豆
  { code: 'v8', name: '中黄13', majorCode: 'soybean', growthCycle: '120-140天', season: '春季/夏季', region: '东北地区', soilType: '黑土', status: '启用' },
  { code: 'v9', name: '合丰55', majorCode: 'soybean', growthCycle: '115-130天', season: '春季', region: '东北地区', soilType: '黑土', status: '启用' },
  // 棉花
  { code: 'v10', name: '新陆早45号', majorCode: 'cotton', growthCycle: '150-180天', season: '春季', region: '新疆地区', soilType: '沙壤土/盐碱地', status: '启用' },
  { code: 'v11', name: '中棉所49', majorCode: 'cotton', growthCycle: '140-160天', season: '春季', region: '黄河流域', soilType: '沙壤土', status: '停用' },
  // 油菜
  { code: 'v12', name: '中油杂12', majorCode: 'rape', growthCycle: '200-220天', season: '秋季/冬季', region: '长江中下游', soilType: '红壤/黏土', status: '启用' },
  // 花生
  { code: 'v13', name: '花育33号', majorCode: 'peanut', growthCycle: '130-150天', season: '春季/夏季', region: '黄淮海地区', soilType: '沙壤土', status: '停用' },
  // 番茄
  { code: 'v14', name: '金棚1号', majorCode: 'tomato', growthCycle: '90-120天', season: '春季/秋季', region: '华北地区/设施', soilType: '沙壤土/黏土', status: '启用' },
  { code: 'v15', name: '中杂9号', majorCode: 'tomato', growthCycle: '95-130天', season: '春季/秋季', region: '全国各地/设施', soilType: '沙壤土', status: '启用' },
  // 黄瓜
  { code: 'v16', name: '津春4号', majorCode: 'cucumber', growthCycle: '60-80天', season: '春季/夏季/秋季', region: '东北地区/设施', soilType: '沙壤土', status: '启用' },
  // 白菜
  { code: 'v17', name: '北京新3号', majorCode: 'cabbage', growthCycle: '70-90天', season: '秋季/冬季', region: '华北地区/东北地区', soilType: '沙壤土/黏土', status: '启用' },
  // 苹果
  { code: 'v18', name: '红富士', majorCode: 'apple', growthCycle: '180-210天', season: '春季', region: '黄土高原/渤海湾', soilType: '黄土/沙壤土', status: '启用' },
  { code: 'v19', name: '嘎啦', majorCode: 'apple', growthCycle: '120-140天', season: '春季', region: '黄土高原', soilType: '黄土', status: '启用' },
  // 葡萄
  { code: 'v20', name: '巨峰', majorCode: 'grape', growthCycle: '140-160天', season: '春季', region: '华北地区/西北地区', soilType: '沙壤土', status: '启用' },
  // 紫花苜蓿
  { code: 'v21', name: '中苜1号', majorCode: 'alfalfa', growthCycle: '30-40天/茬', season: '春季/夏季/秋季', region: '西北地区/东北地区', soilType: '沙壤土/盐碱地', status: '启用' },
  // 玫瑰
  { code: 'v22', name: '卡罗拉', majorCode: 'rose', growthCycle: '60-90天', season: '春季/夏季/秋季', region: '设施', soilType: '沙壤土', status: '停用' },
])

const filteredVarieties = computed(() => {
  let result = varieties.value.filter(v => v.majorCode === selectedMajor.value)
  if (varietySearch.value) {
    const keyword = varietySearch.value.toLowerCase()
    result = result.filter(v => v.name.toLowerCase().includes(keyword))
  }
  return result
})

// 生育周期数据
interface GrowthCycleItem {
  id: string
  majorCode: string
  stage: string
  process: string
  processSteps: string[]
  days: number
}

const growthCycles = ref<GrowthCycleItem[]>([
  // 水稻
  { id: 'gc1', majorCode: 'rice', stage: '播种期', process: '浸种→催芽→播种→覆土', processSteps: ['浸种', '催芽', '播种', '覆土'], days: 7 },
  { id: 'gc2', majorCode: 'rice', stage: '苗期', process: '出苗→秧苗培育→移栽', processSteps: ['出苗', '秧苗培育', '移栽'], days: 30 },
  { id: 'gc3', majorCode: 'rice', stage: '分蘖期', process: '返青→分蘖→晒田', processSteps: ['返青', '分蘖', '晒田'], days: 30 },
  { id: 'gc4', majorCode: 'rice', stage: '拔节期', process: '拔节→追肥→中耕', processSteps: ['拔节', '追肥', '中耕'], days: 25 },
  { id: 'gc5', majorCode: 'rice', stage: '抽穗期', process: '抽穗→扬花→授粉', processSteps: ['抽穗', '扬花', '授粉'], days: 15 },
  { id: 'gc6', majorCode: 'rice', stage: '灌浆期', process: '灌浆→乳熟→蜡熟', processSteps: ['灌浆', '乳熟', '蜡熟'], days: 30 },
  { id: 'gc7', majorCode: 'rice', stage: '成熟期', process: '完熟→收获→晾晒', processSteps: ['完熟', '收获', '晾晒'], days: 15 },
  // 小麦
  { id: 'gc8', majorCode: 'wheat', stage: '播种期', process: '整地→施底肥→播种→镇压', processSteps: ['整地', '施底肥', '播种', '镇压'], days: 7 },
  { id: 'gc9', majorCode: 'wheat', stage: '苗期', process: '出苗→分蘖→越冬', processSteps: ['出苗', '分蘖', '越冬'], days: 60 },
  { id: 'gc10', majorCode: 'wheat', stage: '返青期', process: '返青→追肥→中耕', processSteps: ['返青', '追肥', '中耕'], days: 25 },
  { id: 'gc11', majorCode: 'wheat', stage: '拔节期', process: '拔节→追肥→灌溉', processSteps: ['拔节', '追肥', '灌溉'], days: 20 },
  { id: 'gc12', majorCode: 'wheat', stage: '抽穗期', process: '抽穗→扬花→授粉', processSteps: ['抽穗', '扬花', '授粉'], days: 15 },
  { id: 'gc13', majorCode: 'wheat', stage: '灌浆期', process: '灌浆→乳熟→蜡熟', processSteps: ['灌浆', '乳熟', '蜡熟'], days: 30 },
  { id: 'gc14', majorCode: 'wheat', stage: '成熟期', process: '完熟→收获→晾晒', processSteps: ['完熟', '收获', '晾晒'], days: 10 },
  // 玉米
  { id: 'gc15', majorCode: 'corn', stage: '播种期', process: '整地→施底肥→播种', processSteps: ['整地', '施底肥', '播种'], days: 5 },
  { id: 'gc16', majorCode: 'corn', stage: '苗期', process: '出苗→间苗→定苗', processSteps: ['出苗', '间苗', '定苗'], days: 20 },
  { id: 'gc17', majorCode: 'corn', stage: '拔节期', process: '拔节→追肥→中耕', processSteps: ['拔节', '追肥', '中耕'], days: 25 },
  { id: 'gc18', majorCode: 'corn', stage: '抽穗期', process: '抽雄→吐丝→授粉', processSteps: ['抽雄', '吐丝', '授粉'], days: 10 },
  { id: 'gc19', majorCode: 'corn', stage: '灌浆期', process: '灌浆→乳熟→蜡熟', processSteps: ['灌浆', '乳熟', '蜡熟'], days: 35 },
  { id: 'gc20', majorCode: 'corn', stage: '成熟期', process: '完熟→收获→晾晒', processSteps: ['完熟', '收获', '晾晒'], days: 10 },
  // 大豆
  { id: 'gc21', majorCode: 'soybean', stage: '播种期', process: '整地→施底肥→播种', processSteps: ['整地', '施底肥', '播种'], days: 5 },
  { id: 'gc22', majorCode: 'soybean', stage: '苗期', process: '出苗→间苗→定苗', processSteps: ['出苗', '间苗', '定苗'], days: 20 },
  { id: 'gc23', majorCode: 'soybean', stage: '开花期', process: '初花→盛花→结荚', processSteps: ['初花', '盛花', '结荚'], days: 20 },
  { id: 'gc24', majorCode: 'soybean', stage: '鼓粒期', process: '鼓粒→灌浆→成熟', processSteps: ['鼓粒', '灌浆', '成熟'], days: 35 },
  { id: 'gc25', majorCode: 'soybean', stage: '成熟期', process: '完熟→收获→晾晒', processSteps: ['完熟', '收获', '晾晒'], days: 10 },
  // 棉花
  { id: 'gc26', majorCode: 'cotton', stage: '播种期', process: '整地→施底肥→播种', processSteps: ['整地', '施底肥', '播种'], days: 5 },
  { id: 'gc27', majorCode: 'cotton', stage: '苗期', process: '出苗→间苗→定苗', processSteps: ['出苗', '间苗', '定苗'], days: 25 },
  { id: 'gc28', majorCode: 'cotton', stage: '蕾期', process: '现蕾→中耕→追肥', processSteps: ['现蕾', '中耕', '追肥'], days: 25 },
  { id: 'gc29', majorCode: 'cotton', stage: '花铃期', process: '开花→结铃→追肥', processSteps: ['开花', '结铃', '追肥'], days: 50 },
  { id: 'gc30', majorCode: 'cotton', stage: '吐絮期', process: '吐絮→采收', processSteps: ['吐絮', '采收'], days: 30 },
  // 油菜
  { id: 'gc31', majorCode: 'rape', stage: '播种期', process: '整地→施底肥→播种', processSteps: ['整地', '施底肥', '播种'], days: 5 },
  { id: 'gc32', majorCode: 'rape', stage: '苗期', process: '出苗→间苗→越冬', processSteps: ['出苗', '间苗', '越冬'], days: 50 },
  { id: 'gc33', majorCode: 'rape', stage: '蕾薹期', process: '现蕾→抽薹→追肥', processSteps: ['现蕾', '抽薹', '追肥'], days: 30 },
  { id: 'gc34', majorCode: 'rape', stage: '花期', process: '初花→盛花→授粉', processSteps: ['初花', '盛花', '授粉'], days: 25 },
  { id: 'gc35', majorCode: 'rape', stage: '成熟期', process: '灌浆→成熟→收获', processSteps: ['灌浆', '成熟', '收获'], days: 25 },
  // 花生
  { id: 'gc36', majorCode: 'peanut', stage: '播种期', process: '整地→施底肥→播种', processSteps: ['整地', '施底肥', '播种'], days: 5 },
  { id: 'gc37', majorCode: 'peanut', stage: '苗期', process: '出苗→间苗→定苗', processSteps: ['出苗', '间苗', '定苗'], days: 20 },
  { id: 'gc38', majorCode: 'peanut', stage: '开花下针期', process: '开花→下针→培土', processSteps: ['开花', '下针', '培土'], days: 25 },
  { id: 'gc39', majorCode: 'peanut', stage: '结荚期', process: '结荚→膨大→灌浆', processSteps: ['结荚', '膨大', '灌浆'], days: 35 },
  { id: 'gc40', majorCode: 'peanut', stage: '成熟期', process: '成熟→收获→晾晒', processSteps: ['成熟', '收获', '晾晒'], days: 15 },
  // 番茄
  { id: 'gc41', majorCode: 'tomato', stage: '育苗期', process: '催芽→播种→育苗', processSteps: ['催芽', '播种', '育苗'], days: 20 },
  { id: 'gc42', majorCode: 'tomato', stage: '定植期', process: '炼苗→移栽→缓苗', processSteps: ['炼苗', '移栽', '缓苗'], days: 7 },
  { id: 'gc43', majorCode: 'tomato', stage: '生长期', process: '追肥→灌溉→整枝', processSteps: ['追肥', '灌溉', '整枝'], days: 35 },
  { id: 'gc44', majorCode: 'tomato', stage: '结果期', process: '开花→坐果→膨大', processSteps: ['开花', '坐果', '膨大'], days: 30 },
  { id: 'gc45', majorCode: 'tomato', stage: '采收期', process: '采摘→分级→包装', processSteps: ['采摘', '分级', '包装'], days: 25 },
  // 黄瓜
  { id: 'gc46', majorCode: 'cucumber', stage: '育苗期', process: '催芽→播种→育苗', processSteps: ['催芽', '播种', '育苗'], days: 15 },
  { id: 'gc47', majorCode: 'cucumber', stage: '定植期', process: '炼苗→移栽→缓苗', processSteps: ['炼苗', '移栽', '缓苗'], days: 5 },
  { id: 'gc48', majorCode: 'cucumber', stage: '生长期', process: '追肥→灌溉→整枝引蔓', processSteps: ['追肥', '灌溉', '整枝引蔓'], days: 20 },
  { id: 'gc49', majorCode: 'cucumber', stage: '结果期', process: '开花→坐果→膨大', processSteps: ['开花', '坐果', '膨大'], days: 20 },
  { id: 'gc50', majorCode: 'cucumber', stage: '采收期', process: '采摘→分级→包装', processSteps: ['采摘', '分级', '包装'], days: 20 },
  // 白菜
  { id: 'gc51', majorCode: 'cabbage', stage: '播种期', process: '整地→施底肥→播种', processSteps: ['整地', '施底肥', '播种'], days: 3 },
  { id: 'gc52', majorCode: 'cabbage', stage: '苗期', process: '出苗→间苗→定苗', processSteps: ['出苗', '间苗', '定苗'], days: 15 },
  { id: 'gc53', majorCode: 'cabbage', stage: '莲座期', process: '莲座→追肥→灌溉', processSteps: ['莲座', '追肥', '灌溉'], days: 20 },
  { id: 'gc54', majorCode: 'cabbage', stage: '结球期', process: '结球→膨大→充实', processSteps: ['结球', '膨大', '充实'], days: 25 },
  { id: 'gc55', majorCode: 'cabbage', stage: '采收期', process: '采收→分级→包装', processSteps: ['采收', '分级', '包装'], days: 10 },
  // 苹果
  { id: 'gc56', majorCode: 'apple', stage: '萌芽期', process: '休眠解除→芽萌动→展叶', processSteps: ['休眠解除', '芽萌动', '展叶'], days: 15 },
  { id: 'gc57', majorCode: 'apple', stage: '开花期', process: '花蕾→开花→授粉', processSteps: ['花蕾', '开花', '授粉'], days: 10 },
  { id: 'gc58', majorCode: 'apple', stage: '果实发育期', process: '坐果→膨大→着色', processSteps: ['坐果', '膨大', '着色'], days: 90 },
  { id: 'gc59', majorCode: 'apple', stage: '成熟采收期', process: '成熟→采摘→储藏', processSteps: ['成熟', '采摘', '储藏'], days: 20 },
  // 葡萄
  { id: 'gc60', majorCode: 'grape', stage: '萌芽期', process: '休眠解除→芽萌动→展叶', processSteps: ['休眠解除', '芽萌动', '展叶'], days: 15 },
  { id: 'gc61', majorCode: 'grape', stage: '开花期', process: '花序→开花→授粉', processSteps: ['花序', '开花', '授粉'], days: 10 },
  { id: 'gc62', majorCode: 'grape', stage: '果实发育期', process: '坐果→膨大→着色', processSteps: ['坐果', '膨大', '着色'], days: 70 },
  { id: 'gc63', majorCode: 'grape', stage: '成熟采收期', process: '成熟→采摘→储藏', processSteps: ['成熟', '采摘', '储藏'], days: 20 },
  // 紫花苜蓿
  { id: 'gc64', majorCode: 'alfalfa', stage: '播种期', process: '整地→播种→覆土', processSteps: ['整地', '播种', '覆土'], days: 5 },
  { id: 'gc65', majorCode: 'alfalfa', stage: '生长期', process: '分蘖→拔节→孕穗', processSteps: ['分蘖', '拔节', '孕穗'], days: 25 },
  { id: 'gc66', majorCode: 'alfalfa', stage: '刈割期', process: '初花期刈割→晾晒→打捆', processSteps: ['初花期刈割', '晾晒', '打捆'], days: 5 },
  { id: 'gc67', majorCode: 'alfalfa', stage: '再生期', process: '留茬再生→追肥→灌溉', processSteps: ['留茬再生', '追肥', '灌溉'], days: 20 },
  // 玫瑰
  { id: 'gc68', majorCode: 'rose', stage: '育苗期', process: '扦插/嫁接→催根→育苗', processSteps: ['扦插/嫁接', '催根', '育苗'], days: 25 },
  { id: 'gc69', majorCode: 'rose', stage: '生长期', process: '定植→修剪→追肥', processSteps: ['定植', '修剪', '追肥'], days: 30 },
  { id: 'gc70', majorCode: 'rose', stage: '花期', process: '现蕾→开花→采收', processSteps: ['现蕾', '开花', '采收'], days: 20 },
])

const currentGrowthCycles = computed(() =>
  growthCycles.value.filter(gc => gc.majorCode === selectedMajor.value),
)

// 生育周期 CRUD
const gcDialogVisible = ref(false)
const gcEditing = ref<string | null>(null) // null=新增, id=编辑
const gcForm = ref({ stage: '', days: 1, processSteps: [''] })

function openGcDialog(gc?: GrowthCycleItem) {
  if (gc) {
    gcEditing.value = gc.id
    gcForm.value = {
      stage: gc.stage,
      days: gc.days,
      processSteps: [...gc.processSteps],
    }
  } else {
    gcEditing.value = null
    gcForm.value = { stage: '', days: 1, processSteps: [''] }
  }
  gcDialogVisible.value = true
}

function addProcessStep() {
  gcForm.value.processSteps.push('')
}

function removeProcessStep(index: number) {
  gcForm.value.processSteps.splice(index, 1)
}

function saveGc() {
  if (!gcForm.value.stage.trim()) return
  const steps = gcForm.value.processSteps.filter(s => s.trim())
  if (steps.length === 0) return
  const processStr = steps.join('→')

  if (gcEditing.value) {
    // 编辑
    const idx = growthCycles.value.findIndex(gc => gc.id === gcEditing.value)
    if (idx !== -1) {
      growthCycles.value[idx] = {
        ...growthCycles.value[idx],
        stage: gcForm.value.stage.trim(),
        days: gcForm.value.days,
        process: processStr,
        processSteps: steps,
      }
    }
  } else {
    // 新增
    const newId = 'gc' + (Date.now())
    growthCycles.value.push({
      id: newId,
      majorCode: selectedMajor.value,
      stage: gcForm.value.stage.trim(),
      process: processStr,
      processSteps: steps,
      days: gcForm.value.days,
    })
  }
  gcDialogVisible.value = false
}

function deleteGc(id: string) {
  growthCycles.value = growthCycles.value.filter(gc => gc.id !== id)
}

// 农事作业弹窗
const farmingLinkOptions = ['播种', '育苗', '整地', '施肥', '灌溉', '植保', '除草', '中耕', '修剪', '整枝', '收获', '采收', '镇压', '化控', '疏果', '刈割']
const fwDialogVisible = ref(false)
const fwEditing = ref<string | null>(null)
const fwForm = ref({
  farmStage: '',
  workStage: '',
  standard: '',
  facilityReq: '',
  params: '' as string,
  standardDetail: { operationReq: '', qualityStandard: '', controlPoints: '' },
  facilityDetail: { temperature: '', humidity: '', light: '', co2: '', ventilation: '', other: '' },
  paramDetails: [] as { name: string; value: string }[]
})

function openFwDialog(fw?: FarmWorkItem) {
  if (fw) {
    fwEditing.value = fw.id
    fwForm.value = {
      farmStage: fw.farmStage,
      workStage: fw.workStage,
      standard: fw.standard,
      facilityReq: fw.facilityReq,
      params: fw.params.join('、'),
      standardDetail: fw.standardDetail ? { ...fw.standardDetail } : { operationReq: '', qualityStandard: '', controlPoints: '' },
      facilityDetail: fw.facilityDetail ? { ...fw.facilityDetail } : { temperature: '', humidity: '', light: '', co2: '', ventilation: '', other: '' },
      paramDetails: fw.paramDetails ? fw.paramDetails.map(p => ({ ...p })) : []
    }
  } else {
    fwEditing.value = null
    fwForm.value = {
      farmStage: '',
      workStage: '',
      standard: '',
      facilityReq: '',
      params: '',
      standardDetail: { operationReq: '', qualityStandard: '', controlPoints: '' },
      facilityDetail: { temperature: '', humidity: '', light: '', co2: '', ventilation: '', other: '' },
      paramDetails: []
    }
  }
  fwDialogVisible.value = true
}

function addFwParam() {
  fwForm.value.paramDetails.push({ name: '', value: '' })
}

function removeFwParam(index: number) {
  fwForm.value.paramDetails.splice(index, 1)
}

function saveFw() {
  if (!fwForm.value.workStage.trim()) return
  const params = fwForm.value.params ? fwForm.value.params.split(/[,，、]/).map(s => s.trim()).filter(Boolean) : []

  if (fwEditing.value) {
    const idx = farmWorks.value.findIndex((fw: FarmWorkItem) => fw.id === fwEditing.value)
    if (idx !== -1) {
      farmWorks.value[idx] = {
        ...farmWorks.value[idx],
        farmStage: fwForm.value.farmStage.trim(),
        workStage: fwForm.value.workStage.trim(),
        standard: fwForm.value.standard.trim() || fwForm.value.standardDetail.operationReq,
        facilityReq: fwForm.value.facilityReq.trim() || fwForm.value.facilityDetail.temperature,
        params,
        standardDetail: { ...fwForm.value.standardDetail },
        facilityDetail: { ...fwForm.value.facilityDetail },
        paramDetails: fwForm.value.paramDetails.filter(p => p.name.trim() && p.value.trim())
      }
    }
  } else {
    const newId = 'fw' + Date.now()
    farmWorks.value.push({
      id: newId,
      majorCode: selectedMajor.value,
      farmStage: fwForm.value.farmStage.trim(),
      workStage: fwForm.value.workStage.trim(),
      standard: fwForm.value.standard.trim() || fwForm.value.standardDetail.operationReq,
      facilityReq: fwForm.value.facilityReq.trim() || fwForm.value.facilityDetail.temperature,
      params,
      standardDetail: { ...fwForm.value.standardDetail },
      facilityDetail: { ...fwForm.value.facilityDetail },
      paramDetails: fwForm.value.paramDetails.filter(p => p.name.trim() && p.value.trim())
    })
  }
  fwDialogVisible.value = false
}

function deleteFw(id: string) {
  farmWorks.value = farmWorks.value.filter((fw: FarmWorkItem) => fw.id !== id)
}

// 农事作业数据
interface FarmWorkStandard {
  operationReq: string
  qualityStandard: string
  controlPoints: string
}
interface FarmWorkFacility {
  temperature: string
  humidity: string
  light: string
  co2: string
  ventilation: string
  other: string
}
interface FarmWorkParam {
  name: string
  value: string
}
interface FarmWorkItem {
  id: string
  majorCode: string
  farmStage: string
  workStage: string
  standard: string
  facilityReq: string
  params: string[]
  // 详细结构化字段
  standardDetail?: FarmWorkStandard
  facilityDetail?: FarmWorkFacility
  paramDetails?: FarmWorkParam[]
}

const farmWorks = ref<FarmWorkItem[]>([
  // 水稻
  { id: 'fw1', majorCode: 'rice', farmStage: '播种', workStage: '机械精量播种', standard: '播深3-5cm，行距30cm，株距15cm，播种量1.5-2kg/亩', facilityReq: '无特殊要求，注意土壤墒情', params: ['播深: 3-5cm', '行距: 30cm', '播种量: 1.5-2kg/亩', '播种速度: 4-6km/h'],
      standardDetail: { operationReq: '播深3-5cm，行距30cm，株距15cm，播种量1.5-2kg/亩', qualityStandard: '播种均匀，无漏播重播，出苗率≥90%', controlPoints: '适墒播种，播后及时镇压保墒' },
      facilityDetail: { temperature: '自然温度', humidity: '土壤含水量60-70%', light: '自然光照', co2: '自然浓度', ventilation: '无特殊要求', other: '注意土壤墒情' },
      paramDetails: [{name: '播深', value: '3-5cm'}, {name: '行距', value: '30cm'}, {name: '播种量', value: '1.5-2kg/亩'}, {name: '播种速度', value: '4-6km/h'}]
    },
  { id: 'fw2', majorCode: 'rice', farmStage: '播种', workStage: '播后镇压', standard: '播后及时镇压，确保种子与土壤紧密接触', facilityReq: '使用镇压器，镇压强度适中', params: ['镇压强度: 0.3-0.5kg/cm²', '镇压次数: 1-2次'],
      standardDetail: { operationReq: '播后及时镇压，确保种子与土壤紧密接触', qualityStandard: '镇压均匀，无漏压，种子与土壤贴合紧密', controlPoints: '镇压强度适中，避免过实影响出苗' },
      facilityDetail: { temperature: '自然温度', humidity: '土壤含水量60-70%', light: '无特殊要求', co2: '无特殊要求', ventilation: '使用镇压器', other: '镇压强度适中' },
      paramDetails: [{name: '镇压强度', value: '0.3-0.5kg/cm²'}, {name: '镇压次数', value: '1-2次'}]
    },
  { id: 'fw3', majorCode: 'rice', farmStage: '施肥', workStage: '底肥施用', standard: '复合肥40kg/亩+有机肥2000kg/亩，深施15-20cm', facilityReq: '无特殊要求', params: ['复合肥: 40kg/亩', '有机肥: 2000kg/亩', '施肥深度: 15-20cm'],
      standardDetail: { operationReq: '复合肥40kg/亩+有机肥2000kg/亩，深施15-20cm', qualityStandard: '施肥均匀，深度达标，无露肥', controlPoints: '底肥深施，种肥隔离5cm以上' },
      facilityDetail: { temperature: '自然温度', humidity: '土壤含水量适宜', light: '无特殊要求', co2: '无特殊要求', ventilation: '无特殊要求', other: '无特殊要求' },
      paramDetails: [{name: '复合肥', value: '40kg/亩'}, {name: '有机肥', value: '2000kg/亩'}, {name: '施肥深度', value: '15-20cm'}]
    },
  { id: 'fw4', majorCode: 'rice', farmStage: '灌溉', workStage: '分蘖期灌溉', standard: '浅水灌溉，保持3-5cm水层', facilityReq: '需灌溉设施，水位控制精准', params: ['水层深度: 3-5cm', '灌溉频率: 3-5天/次'],
      standardDetail: { operationReq: '浅水灌溉，保持3-5cm水层', qualityStandard: '水层均匀，无旱无涝', controlPoints: '分蘖期浅水促蘖，够苗晒田' },
      facilityDetail: { temperature: '水温≥15℃', humidity: '水层3-5cm', light: '无特殊要求', co2: '无特殊要求', ventilation: '需灌溉设施，水位控制精准', other: '保持水层稳定' },
      paramDetails: [{name: '水层深度', value: '3-5cm'}, {name: '灌溉频率', value: '3-5天/次'}]
    },
  { id: 'fw5', majorCode: 'rice', farmStage: '植保', workStage: '病虫害防治', standard: '分蘖期防治二化螟、稻飞虱，使用低毒农药', facilityReq: '设施区域采用物理+生物防治', params: ['防治对象: 二化螟/稻飞虱', '施药方式: 喷雾', '安全间隔期: 15天'],
      standardDetail: { operationReq: '分蘖期防治二化螟、稻飞虱，使用低毒农药', qualityStandard: '虫口密度控制在防治指标以下，残留不超标', controlPoints: '对症用药，交替使用不同机理农药' },
      facilityDetail: { temperature: '施药避开高温时段', humidity: '施药后6h内无降雨', light: '无特殊要求', co2: '无特殊要求', ventilation: '设施区域采用物理+生物防治', other: '安全间隔期15天' },
      paramDetails: [{name: '防治对象', value: '二化螟/稻飞虱'}, {name: '施药方式', value: '喷雾'}, {name: '安全间隔期', value: '15天'}]
    },
  { id: 'fw6', majorCode: 'rice', farmStage: '收获', workStage: '机械收割', standard: '籽粒含水率≤25%时收割，留茬高度≤15cm', facilityReq: '烘干设备及时烘干至含水率≤14%', params: ['含水率: ≤25%', '留茬高度: ≤15cm', '损失率: ≤3%'],
      standardDetail: { operationReq: '籽粒含水率≤25%时收割，留茬高度≤15cm', qualityStandard: '损失率≤3%，破碎率≤2%', controlPoints: '适时收获，避免过迟落粒' },
      facilityDetail: { temperature: '自然温度', humidity: '含水率≤25%', light: '无特殊要求', co2: '无特殊要求', ventilation: '烘干设备及时烘干至含水率≤14%', other: '收获后及时烘干' },
      paramDetails: [{name: '含水率', value: '≤25%'}, {name: '留茬高度', value: '≤15cm'}, {name: '损失率', value: '≤3%'}]
    },
  // 小麦
  { id: 'fw7', majorCode: 'wheat', farmStage: '播种', workStage: '精量播种', standard: '播深3-5cm，行距20cm，播种量8-10kg/亩', facilityReq: '无特殊要求', params: ['播深: 3-5cm', '行距: 20cm', '播种量: 8-10kg/亩'],
      standardDetail: { operationReq: '播深3-5cm，行距20cm，播种量8-10kg/亩', qualityStandard: '播种均匀，无漏播重播，出苗率≥85%', controlPoints: '适期播种，足墒下种' },
      facilityDetail: { temperature: '自然温度', humidity: '土壤含水量65-75%', light: '无特殊要求', co2: '无特殊要求', ventilation: '无特殊要求', other: '无特殊要求' },
      paramDetails: [{name: '播深', value: '3-5cm'}, {name: '行距', value: '20cm'}, {name: '播种量', value: '8-10kg/亩'}]
    },
  { id: 'fw8', majorCode: 'wheat', farmStage: '施肥', workStage: '底肥追肥', standard: '底肥复合肥50kg/亩，拔节期追尿素15kg/亩', facilityReq: '无特殊要求', params: ['底肥: 50kg/亩', '追肥: 尿素15kg/亩'],
      standardDetail: { operationReq: '底肥复合肥50kg/亩，拔节期追尿素15kg/亩', qualityStandard: '施肥均匀，用量准确', controlPoints: '底肥深施，追肥结合浇水' },
      facilityDetail: { temperature: '自然温度', humidity: '土壤含水量适宜', light: '无特殊要求', co2: '无特殊要求', ventilation: '无特殊要求', other: '无特殊要求' },
      paramDetails: [{name: '底肥', value: '50kg/亩'}, {name: '追肥', value: '尿素15kg/亩'}]
    },
  { id: 'fw9', majorCode: 'wheat', farmStage: '植保', workStage: '赤霉病防治', standard: '齐穗至始花期用药，间隔5-7天再施一次', facilityReq: '无人机飞防效率高', params: ['用药时期: 齐穗-始花期', '间隔: 5-7天', '施药次数: 2次'],
      standardDetail: { operationReq: '齐穗至始花期用药，间隔5-7天再施一次', qualityStandard: '病穗率控制在5%以下', controlPoints: '预防为主，首次用药时间要准' },
      facilityDetail: { temperature: '避开高温时段施药', humidity: '施药后6h内无降雨', light: '无特殊要求', co2: '无特殊要求', ventilation: '无人机飞防效率高', other: '两次用药间隔5-7天' },
      paramDetails: [{name: '用药时期', value: '齐穗-始花期'}, {name: '间隔', value: '5-7天'}, {name: '施药次数', value: '2次'}]
    },
  { id: 'fw10', majorCode: 'wheat', farmStage: '收获', workStage: '机械收获', standard: '含水率≤13%时收获', facilityReq: '烘干设备', params: ['含水率: ≤13%', '损失率: ≤2%'],
      standardDetail: { operationReq: '含水率≤13%时收获', qualityStandard: '损失率≤2%，无杂质', controlPoints: '适时收获，防止穗发芽' },
      facilityDetail: { temperature: '自然温度', humidity: '含水率≤13%', light: '无特殊要求', co2: '无特殊要求', ventilation: '烘干设备', other: '收获后及时晾晒或烘干' },
      paramDetails: [{name: '含水率', value: '≤13%'}, {name: '损失率', value: '≤2%'}]
    },
  // 玉米
  { id: 'fw11', majorCode: 'corn', farmStage: '播种', workStage: '精量点播', standard: '播深4-6cm，行距60cm，株距25cm', facilityReq: '无特殊要求', params: ['播深: 4-6cm', '行距: 60cm', '株距: 25cm'],
      standardDetail: { operationReq: '播深4-6cm，行距60cm，株距25cm', qualityStandard: '播种均匀，出苗率≥90%', controlPoints: '适期播种，足墒下种' },
      facilityDetail: { temperature: '地温≥10℃', humidity: '土壤含水量60-70%', light: '无特殊要求', co2: '无特殊要求', ventilation: '无特殊要求', other: '无特殊要求' },
      paramDetails: [{name: '播深', value: '4-6cm'}, {name: '行距', value: '60cm'}, {name: '株距', value: '25cm'}]
    },
  { id: 'fw12', majorCode: 'corn', farmStage: '施肥', workStage: '底肥追肥', standard: '底肥复合肥40kg/亩，大喇叭口期追尿素20kg/亩', facilityReq: '无特殊要求', params: ['底肥: 40kg/亩', '追肥: 尿素20kg/亩'],
      standardDetail: { operationReq: '底肥复合肥40kg/亩，大喇叭口期追尿素20kg/亩', qualityStandard: '施肥均匀，用量准确', controlPoints: '追肥距植株10cm，深施覆土' },
      facilityDetail: { temperature: '自然温度', humidity: '土壤含水量适宜', light: '无特殊要求', co2: '无特殊要求', ventilation: '无特殊要求', other: '无特殊要求' },
      paramDetails: [{name: '底肥', value: '40kg/亩'}, {name: '追肥', value: '尿素20kg/亩'}]
    },
  { id: 'fw13', majorCode: 'corn', farmStage: '收获', workStage: '机械收获', standard: '籽粒含水率≤25%时收获', facilityReq: '烘干设备', params: ['含水率: ≤25%', '损失率: ≤3%'],
      standardDetail: { operationReq: '籽粒含水率≤25%时收获', qualityStandard: '损失率≤3%，落粒率≤2%', controlPoints: '适时收获，防倒伏' },
      facilityDetail: { temperature: '自然温度', humidity: '含水率≤25%', light: '无特殊要求', co2: '无特殊要求', ventilation: '烘干设备', other: '收获后及时烘干' },
      paramDetails: [{name: '含水率', value: '≤25%'}, {name: '损失率', value: '≤3%'}]
    },
  // 大豆
  { id: 'fw14', majorCode: 'soybean', farmStage: '播种', workStage: '精量播种', standard: '播深3-5cm，行距45cm，株距10cm', facilityReq: '无特殊要求', params: ['播深: 3-5cm', '行距: 45cm', '株距: 10cm'],
      standardDetail: { operationReq: '播深3-5cm，行距45cm，株距10cm', qualityStandard: '播种均匀，出苗率≥85%', controlPoints: '避免重茬，合理密植' },
      facilityDetail: { temperature: '地温≥12℃', humidity: '土壤含水量60-70%', light: '无特殊要求', co2: '无特殊要求', ventilation: '无特殊要求', other: '无特殊要求' },
      paramDetails: [{name: '播深', value: '3-5cm'}, {name: '行距', value: '45cm'}, {name: '株距', value: '10cm'}]
    },
  { id: 'fw15', majorCode: 'soybean', farmStage: '管理', workStage: '中耕除草', standard: '苗期中耕2-3次，及时除草', facilityReq: '无特殊要求', params: ['中耕次数: 2-3次', '中耕深度: 5-8cm'],
      standardDetail: { operationReq: '苗期中耕2-3次，及时除草', qualityStandard: '无杂草，土壤疏松', controlPoints: '中耕不宜过深，避免伤根' },
      facilityDetail: { temperature: '自然温度', humidity: '土壤含水量适宜', light: '无特殊要求', co2: '无特殊要求', ventilation: '无特殊要求', other: '无特殊要求' },
      paramDetails: [{name: '中耕次数', value: '2-3次'}, {name: '中耕深度', value: '5-8cm'}]
    },
  // 棉花
  { id: 'fw16', majorCode: 'cotton', farmStage: '播种', workStage: '棉花播种', standard: '播深2-3cm，行距60-70cm，密度1.2-1.5万株/亩', facilityReq: '地膜覆盖，保温保湿', params: ['播深: 2-3cm', '行距: 60-70cm', '密度: 1.2-1.5万株/亩', '覆膜: 是'],
      standardDetail: { operationReq: '播深2-3cm，行距60-70cm，密度1.2-1.5万株/亩', qualityStandard: '出苗率≥85%，密度均匀', controlPoints: '地膜覆盖，保温保湿促出苗' },
      facilityDetail: { temperature: '地温≥14℃', humidity: '土壤含水量65-75%', light: '无特殊要求', co2: '无特殊要求', ventilation: '地膜覆盖，保温保湿', other: '覆膜栽培' },
      paramDetails: [{name: '播深', value: '2-3cm'}, {name: '行距', value: '60-70cm'}, {name: '密度', value: '1.2-1.5万株/亩'}, {name: '覆膜', value: '是'}]
    },
  { id: 'fw17', majorCode: 'cotton', farmStage: '管理', workStage: '化控整枝', standard: '6-8片真叶期化控，适时打顶去叶枝', facilityReq: '设施栽培注意通风透光', params: ['化控时间: 6-8叶期', '打顶时间: 7月中旬', '缩节胺用量: 2-3g/亩'],
      standardDetail: { operationReq: '6-8片真叶期化控，适时打顶去叶枝', qualityStandard: '株高控制在80-100cm，果枝数≥12台', controlPoints: '化控用量宜轻不宜重，打顶不能过晚' },
      facilityDetail: { temperature: '自然温度', humidity: '设施内注意降湿', light: '设施栽培注意通风透光', co2: '无特殊要求', ventilation: '设施栽培注意通风', other: '合理化控促壮' },
      paramDetails: [{name: '化控时间', value: '6-8叶期'}, {name: '打顶时间', value: '7月中旬'}, {name: '缩节胺用量', value: '2-3g/亩'}]
    },
  { id: 'fw18', majorCode: 'cotton', farmStage: '采收', workStage: '棉花采收', standard: '吐絮后7-10天采收，分次采摘', facilityReq: '机械采收需脱叶催熟处理', params: ['采收时间: 吐絮7-10天后', '采收方式: 人工/机械', '脱叶剂: 噻苯隆'],
      standardDetail: { operationReq: '吐絮后7-10天采收，分次采摘', qualityStandard: '霜前花率≥80%，杂质率≤2%', controlPoints: '及时采收防雨淋，分等级存放' },
      facilityDetail: { temperature: '自然温度', humidity: '含水率≤10%', light: '无特殊要求', co2: '无特殊要求', ventilation: '机械采收需脱叶催熟处理', other: '采后晾晒防潮' },
      paramDetails: [{name: '采收时间', value: '吐絮7-10天后'}, {name: '采收方式', value: '人工/机械'}, {name: '脱叶剂', value: '噻苯隆'}]
    },
  // 番茄
  { id: 'fw19', majorCode: 'tomato', farmStage: '育苗', workStage: '穴盘育苗', standard: '72孔穴盘，基质配比3:1:1（草炭:蛭石:珍珠岩）', facilityReq: '温室育苗，温度25-28℃，湿度80%', params: ['穴盘规格: 72孔', '温度: 25-28℃', '湿度: 80%', '光照: 12h/天'],
      standardDetail: { operationReq: '72孔穴盘，基质配比3:1:1（草炭:蛭石:珍珠岩）', qualityStandard: '出苗率≥95%，苗齐苗壮', controlPoints: '基质消毒，温湿度精准控制' },
      facilityDetail: { temperature: '25-28℃', humidity: '80%', light: '12h/天', co2: '400-600ppm', ventilation: '适当通风换气', other: '温室育苗' },
      paramDetails: [{name: '穴盘规格', value: '72孔'}, {name: '温度', value: '25-28℃'}, {name: '湿度', value: '80%'}, {name: '光照', value: '12h/天'}]
    },
  { id: 'fw20', majorCode: 'tomato', farmStage: '定植', workStage: '移栽定植', standard: '苗龄4-5叶1心时定植，株距35cm，行距50cm', facilityReq: '设施大棚定植，提前7天闷棚消毒', params: ['苗龄: 4-5叶1心', '株距: 35cm', '行距: 50cm', '定植深度: 子叶以下'],
      standardDetail: { operationReq: '苗龄4-5叶1心时定植，株距35cm，行距50cm', qualityStandard: '定植成活率≥98%，缓苗期≤5天', controlPoints: '定植前炼苗5-7天，浇足定植水' },
      facilityDetail: { temperature: '白天25-28℃，夜间15-18℃', humidity: '60-70%', light: '充足光照', co2: '400-600ppm', ventilation: '提前7天闷棚消毒，定植后通风', other: '设施大棚定植' },
      paramDetails: [{name: '苗龄', value: '4-5叶1心'}, {name: '株距', value: '35cm'}, {name: '行距', value: '50cm'}, {name: '定植深度', value: '子叶以下'}]
    },
  { id: 'fw21', majorCode: 'tomato', farmStage: '管理', workStage: '整枝打杈', standard: '单干整枝，及时去除侧枝和老叶', facilityReq: '设施内通风降湿，减少病害', params: ['整枝方式: 单干', '留果层数: 5-6层', '疏果: 每穗3-4果'],
      standardDetail: { operationReq: '单干整枝，及时去除侧枝和老叶', qualityStandard: '植株通风透光，留果层数5-6层', controlPoints: '整枝宜晴天上午，疏果每穗3-4果' },
      facilityDetail: { temperature: '白天25-28℃，夜间13-16℃', humidity: '50-60%', light: '充足光照', co2: '600-800ppm', ventilation: '设施内通风降湿，减少病害', other: '及时打杈促通风' },
      paramDetails: [{name: '整枝方式', value: '单干'}, {name: '留果层数', value: '5-6层'}, {name: '疏果', value: '每穗3-4果'}]
    },
  { id: 'fw22', majorCode: 'tomato', farmStage: '采收', workStage: '成熟采收', standard: '果实转色后采收，轻采轻放', facilityReq: '采后预冷，2-4℃冷藏', params: ['采收标准: 转色≥80%', '采后预冷: 2-4℃', '分级: A/B/C三级'],
      standardDetail: { operationReq: '果实转色后采收，轻采轻放', qualityStandard: '转色≥80%，无机械损伤', controlPoints: '分级采收，轻拿轻放' },
      facilityDetail: { temperature: '采后预冷2-4℃', humidity: '85-90%', light: '避光冷藏', co2: '无特殊要求', ventilation: '采后预冷，2-4℃冷藏', other: '分级A/B/C三级' },
      paramDetails: [{name: '采收标准', value: '转色≥80%'}, {name: '采后预冷', value: '2-4℃'}, {name: '分级', value: 'A/B/C三级'}]
    },
  // 黄瓜
  { id: 'fw23', majorCode: 'cucumber', farmStage: '育苗', workStage: '穴盘育苗', standard: '50孔穴盘，温度25-30℃催芽', facilityReq: '温室育苗，温度控制', params: ['穴盘规格: 50孔', '催芽温度: 25-30℃'],
      standardDetail: { operationReq: '50孔穴盘，温度25-30℃催芽', qualityStandard: '出苗率≥90%，苗齐苗壮', controlPoints: '浸种催芽，基质消毒' },
      facilityDetail: { temperature: '25-30℃', humidity: '75-85%', light: '出苗后充足光照', co2: '无特殊要求', ventilation: '温室育苗，温度控制', other: '注意温度管理' },
      paramDetails: [{name: '穴盘规格', value: '50孔'}, {name: '催芽温度', value: '25-30℃'}]
    },
  { id: 'fw24', majorCode: 'cucumber', farmStage: '管理', workStage: '引蔓整枝', standard: '及时引蔓，摘除侧蔓和老叶', facilityReq: '设施大棚，搭架引蔓', params: ['引蔓方式: 吊蔓', '整枝: 摘侧蔓'],
      standardDetail: { operationReq: '及时引蔓，摘除侧蔓和老叶', qualityStandard: '植株整齐，通风透光', controlPoints: '引蔓及时，侧蔓早摘' },
      facilityDetail: { temperature: '白天25-30℃，夜间15-18℃', humidity: '60-70%', light: '充足光照', co2: '无特殊要求', ventilation: '设施大棚，搭架引蔓', other: '保持通风降湿' },
      paramDetails: [{name: '引蔓方式', value: '吊蔓'}, {name: '整枝', value: '摘侧蔓'}]
    },
  // 苹果
  { id: 'fw25', majorCode: 'apple', farmStage: '修剪', workStage: '冬季修剪', standard: '12月-2月，去除病虫枝、交叉枝，培养结果枝组', facilityReq: '无特殊要求', params: ['修剪时间: 12月-2月', '留枝量: 8-10万条/亩', '短截程度: 中度'],
      standardDetail: { operationReq: '12月-2月，去除病虫枝、交叉枝，培养结果枝组', qualityStandard: '留枝量8-10万条/亩，树冠通风透光', controlPoints: '剪口平滑，大剪口涂保护剂' },
      facilityDetail: { temperature: '自然温度', humidity: '自然湿度', light: '无特殊要求', co2: '无特殊要求', ventilation: '无特殊要求', other: '无特殊要求' },
      paramDetails: [{name: '修剪时间', value: '12月-2月'}, {name: '留枝量', value: '8-10万条/亩'}, {name: '短截程度', value: '中度'}]
    },
  { id: 'fw26', majorCode: 'apple', farmStage: '花果管理', workStage: '疏花疏果', standard: '花后2-3周疏果，20-25cm留1果', facilityReq: '套袋栽培，防虫防鸟', params: ['疏果时间: 花后2-3周', '留果间距: 20-25cm', '套袋: 是', '采收前15天除袋'],
      standardDetail: { operationReq: '花后2-3周疏果，20-25cm留1果', qualityStandard: '单果重≥200g，果形端正', controlPoints: '疏果宜早不宜迟，套袋前喷药' },
      facilityDetail: { temperature: '自然温度', humidity: '自然湿度', light: '无特殊要求', co2: '无特殊要求', ventilation: '套袋栽培，防虫防鸟', other: '采收前15天除袋' },
      paramDetails: [{name: '疏果时间', value: '花后2-3周'}, {name: '留果间距', value: '20-25cm'}, {name: '套袋', value: '是'}, {name: '采收前除袋', value: '15天'}]
    },
  // 葡萄
  { id: 'fw27', majorCode: 'grape', farmStage: '修剪', workStage: '冬季修剪', standard: '12月-1月，短梢修剪为主', facilityReq: '无特殊要求', params: ['修剪时间: 12月-1月', '修剪方式: 短梢修剪'],
      standardDetail: { operationReq: '12月-1月，短梢修剪为主', qualityStandard: '留芽量适中，枝条分布均匀', controlPoints: '剪口在芽上2cm处，倾斜45°' },
      facilityDetail: { temperature: '自然温度', humidity: '自然湿度', light: '无特殊要求', co2: '无特殊要求', ventilation: '无特殊要求', other: '无特殊要求' },
      paramDetails: [{name: '修剪时间', value: '12月-1月'}, {name: '修剪方式', value: '短梢修剪'}]
    },
  // 紫花苜蓿
  { id: 'fw28', majorCode: 'alfalfa', farmStage: '刈割', workStage: '适时刈割', standard: '初花期（10%开花）刈割，留茬5-8cm', facilityReq: '天气晴好时刈割，便于晾晒', params: ['刈割时期: 初花期', '留茬高度: 5-8cm', '刈割次数: 3-4次/年', '晾晒时间: 1-2天'],
      standardDetail: { operationReq: '初花期（10%开花）刈割，留茬5-8cm', qualityStandard: '刈割整齐，留茬高度一致', controlPoints: '晴好天气刈割，便于晾晒' },
      facilityDetail: { temperature: '自然温度', humidity: '天气晴好时刈割', light: '无特殊要求', co2: '无特殊要求', ventilation: '天气晴好时刈割，便于晾晒', other: '晾晒1-2天' },
      paramDetails: [{name: '刈割时期', value: '初花期'}, {name: '留茬高度', value: '5-8cm'}, {name: '刈割次数', value: '3-4次/年'}, {name: '晾晒时间', value: '1-2天'}]
    },
  // 玫瑰
  { id: 'fw29', majorCode: 'rose', farmStage: '修剪', workStage: '玫瑰修剪', standard: '冬季重剪，生长期轻剪促分枝', facilityReq: '温室控温控湿，光照12h以上', params: ['修剪时间: 冬季/生长期', '修剪程度: 重剪/轻剪', '促分枝: 抹芽控旺'],
      standardDetail: { operationReq: '冬季重剪，生长期轻剪促分枝', qualityStandard: '树形美观，花枝分布均匀', controlPoints: '重剪促萌发，轻剪促花芽' },
      facilityDetail: { temperature: '温室控温15-25℃', humidity: '60-70%', light: '12h以上', co2: '400-600ppm', ventilation: '温室控温控湿', other: '光照12h以上促花芽分化' },
      paramDetails: [{name: '修剪时间', value: '冬季/生长期'}, {name: '修剪程度', value: '重剪/轻剪'}, {name: '促分枝', value: '抹芽控旺'}]
    },
])

const currentFarmWorks = computed(() =>
  farmWorks.value.filter(fw => fw.majorCode === selectedMajor.value),
)

const currentTitle = computed(() => {
  for (const cat of treeData.value) {
    const major = cat.majors.find(m => m.code === selectedMajor.value)
    if (major) return `${major.name} - 管理`
  }
  return '作物管理'
})

const currentSubtitle = computed(() => {
  const tab = tabs.find(t => t.key === activeTab.value)
  return tab?.label ?? ''
})

function selectMajor(code: string) {
  selectedMajor.value = code
}

function toggleNode(code: string) {
  if (expandedNodes.value.has(code)) {
    expandedNodes.value.delete(code)
  } else {
    expandedNodes.value.add(code)
  }
}

function goBack() {
  router.push('/base-management/crop')
}

function addMajor() {
  // placeholder
}

// 品种维护弹窗
const varietyDialogVisible = ref(false)
const varietyIsEdit = ref(false)
const varietyForm = ref({
  code: '',
  name: '',
  majorCode: '',
  growthCycle: '',
  season: '',
  region: '',
  soilType: '',
  status: '启用' as '启用' | '停用'
})

const seasonOptions = ['春季', '夏季', '秋季', '冬季', '春季/夏季', '春季/秋季', '秋季/冬季', '全年']
const regionOptions = ['东北地区', '黄淮海地区', '长江中下游', '华南地区', '西南地区', '西北地区', '华北地区']
const soilTypeOptions = ['黑土', '黄土', '黏土', '红壤', '沙壤土', '壤土', '盐碱地', '黑土/黏土', '黄土/沙壤土', '红壤/黏土']

function addVariety() {
  varietyIsEdit.value = false
  varietyForm.value = {
    code: `v${varieties.value.length + 1}`,
    name: '',
    majorCode: selectedMajor.value,
    growthCycle: '',
    season: '',
    region: '',
    soilType: '',
    status: '启用'
  }
  varietyDialogVisible.value = true
}

function editVariety(item: VarietyItem) {
  varietyIsEdit.value = true
  varietyForm.value = { ...item }
  varietyDialogVisible.value = true
}

function deleteVariety(item: VarietyItem) {
  const idx = varieties.value.findIndex(v => v.code === item.code)
  if (idx >= 0) varieties.value.splice(idx, 1)
}

function saveVariety() {
  if (!varietyForm.value.name) return
  if (varietyIsEdit.value) {
    const idx = varieties.value.findIndex(v => v.code === varietyForm.value.code)
    if (idx >= 0) varieties.value[idx] = { ...varietyForm.value }
  } else {
    varieties.value.push({ ...varietyForm.value })
  }
  varietyDialogVisible.value = false
}

onMounted(() => {
  const q = route.query.major as string | undefined
  if (q) {
    selectedMajor.value = q
    // 展开所属类别
    for (const cat of treeData.value) {
      if (cat.majors.some(m => m.code === q)) {
        expandedNodes.value.add(cat.code)
        break
      }
    }
  }
})
</script>
