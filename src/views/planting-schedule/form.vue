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

      <!-- 第1行：计划编号 + 关联种植方案编号 + 种植计划名称 -->
      <div class="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div>
          <label class="mb-1.5 block text-sm font-medium">
            计划编号 <span class="text-red-500">*</span>
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
            关联种植方案编号
            <span class="ml-2 text-xs text-muted-foreground font-normal">自动带入</span>
          </label>
          <input
            :value="form.schemeCode"
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

      <!-- 第2行：所属单位 + 种植模式 + 种植作物大类 + 种植品种 -->
      <div class="grid grid-cols-1 gap-6 lg:grid-cols-4">
        <div>
          <label class="mb-1.5 block text-sm font-medium">
            所属单位 <span class="text-xs text-muted-foreground font-normal">自动带入</span>
          </label>
          <input
            :value="form.unit"
            type="text"
            readonly
            class="h-9 w-full rounded-md border border-input bg-muted px-3 py-1 text-sm text-muted-foreground cursor-not-allowed"
          />
        </div>
        <div>
          <label class="mb-1.5 block text-sm font-medium">
            种植模式 <span class="text-xs text-muted-foreground font-normal">自动带入</span>
          </label>
          <input
            :value="form.plantingMode"
            type="text"
            readonly
            class="h-9 w-full rounded-md border border-input bg-muted px-3 py-1 text-sm text-muted-foreground cursor-not-allowed"
          />
        </div>
        <div>
          <label class="mb-1.5 block text-sm font-medium">
            种植作物大类 <span class="text-xs text-muted-foreground font-normal">自动带入</span>
          </label>
          <input
            :value="form.cropCategory"
            type="text"
            readonly
            class="h-9 w-full rounded-md border border-input bg-muted px-3 py-1 text-sm text-muted-foreground cursor-not-allowed"
          />
        </div>
        <div>
          <label class="mb-1.5 block text-sm font-medium">
            种植品种 <span class="text-xs text-muted-foreground font-normal">自动带入</span>
          </label>
          <input
            :value="form.cropVariety"
            type="text"
            readonly
            class="h-9 w-full rounded-md border border-input bg-muted px-3 py-1 text-sm text-muted-foreground cursor-not-allowed"
          />
        </div>
      </div>

      <!-- 第3行：种植资源信息 + 资产面积 -->
      <div class="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div>
          <label class="mb-1.5 block text-sm font-medium">
            种植资源信息 <span class="text-red-500">*</span>
            <span class="ml-2 text-xs text-muted-foreground font-normal">选择种植单元（地块）</span>
          </label>
          <div class="flex items-center gap-2">
            <input
              :value="selectedPlotNames"
              type="text"
              readonly
              placeholder="请选择种植单元（地块）"
              class="h-9 flex-1 rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm cursor-not-allowed"
            />
            <button
              type="button"
              class="inline-flex items-center justify-center gap-1.5 rounded-md border border-input bg-background px-3 py-2 text-sm font-medium shadow-sm transition-colors hover:bg-muted"
              @click="showPlotDialog = true"
            >
              <Search class="h-3.5 w-3.5" />
              选择
            </button>
          </div>
        </div>
        <div>
          <label class="mb-1.5 block text-sm font-medium">
            资产面积（亩）
            <span class="ml-2 text-xs text-muted-foreground font-normal">自动计算</span>
          </label>
          <input
            :value="assetAreaDisplay"
            type="text"
            readonly
            class="h-9 w-full rounded-md border border-input bg-muted px-3 py-1 text-sm text-muted-foreground cursor-not-allowed"
          />
        </div>
      </div>

      <!-- 第4行：计划种植总面积 -->
      <div class="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div>
          <label class="mb-1.5 block text-sm font-medium">
            计划种植总面积（亩）<span class="text-red-500">*</span>
          </label>
          <input
            v-model.number="form.totalArea"
            type="number"
            min="0"
            placeholder="请输入计划种植面积"
            class="h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus:outline-none focus:ring-1 focus:ring-ring"
          />
          <p v-if="form.totalArea && assetArea > 0 && form.totalArea > assetArea" class="mt-1 text-xs text-red-500">
            计划种植总面积不能大于资产面积（{{ assetArea }} 亩）
          </p>
        </div>
      </div>

      <!-- 第5行：计划播种/定植开始时间 + 计划收获结束时间 -->
      <div class="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div>
          <label class="mb-1.5 block text-sm font-medium">
            计划播种/定植开始时间 <span class="text-red-500">*</span>
          </label>
          <input
            v-model="form.planStartDate"
            type="date"
            class="h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus:outline-none focus:ring-1 focus:ring-ring"
          />
        </div>
        <div>
          <label class="mb-1.5 block text-sm font-medium">
            计划收获结束时间
            <span class="ml-2 text-xs text-muted-foreground font-normal">自动代入（开始时间 + 全生育周期天数），可修改</span>
          </label>
          <input
            v-model="form.planEndDate"
            type="date"
            class="h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus:outline-none focus:ring-1 focus:ring-ring"
          />
        </div>
      </div>

      <!-- 第6行：计划负责人 + 执行负责人 -->
      <div class="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div>
          <label class="mb-1.5 block text-sm font-medium">
            计划负责人 <span class="text-red-500">*</span>
          </label>
          <select
            v-model="form.planLeader"
            class="h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus:outline-none focus:ring-1 focus:ring-ring"
          >
            <option value="">请选择计划负责人</option>
            <option v-for="p in personnelList" :key="p.id" :value="p.name">{{ p.name }}</option>
          </select>
        </div>
        <div>
          <label class="mb-1.5 block text-sm font-medium">
            执行负责人 <span class="text-red-500">*</span>
          </label>
          <select
            v-model="form.execLeader"
            class="h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus:outline-none focus:ring-1 focus:ring-ring"
          >
            <option value="">请选择执行负责人</option>
            <option v-for="p in personnelList" :key="p.id" :value="p.name">{{ p.name }}</option>
          </select>
        </div>
      </div>

      <!-- 第7行：创建人 + 生效时间 -->
      <div class="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div>
          <label class="mb-1.5 block text-sm font-medium">
            创建人 <span class="text-xs text-muted-foreground font-normal">自动代入</span>
          </label>
          <input
            :value="form.author"
            type="text"
            readonly
            class="h-9 w-full rounded-md border border-input bg-muted px-3 py-1 text-sm text-muted-foreground cursor-not-allowed"
          />
        </div>
        <div>
          <label class="mb-1.5 block text-sm font-medium">
            生效时间 <span class="text-red-500">*</span>
          </label>
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

    <!-- ==================== 种植单元（地块）选择弹框 ==================== -->
    <div v-if="showPlotDialog" class="fixed inset-0 z-50 flex items-center justify-center bg-black/50" @click.self="showPlotDialog = false">
      <div class="w-[720px] max-h-[80vh] rounded-lg border bg-background shadow-lg flex flex-col">
        <!-- 弹框头部 -->
        <div class="flex items-center justify-between border-b px-6 py-4">
          <h3 class="text-lg font-semibold">选择种植单元（地块）</h3>
          <button class="text-muted-foreground hover:text-foreground" @click="showPlotDialog = false">
            <X class="h-5 w-5" />
          </button>
        </div>
        <!-- 搜索 -->
        <div class="px-6 py-3 border-b">
          <input
            v-model="plotSearch"
            type="text"
            placeholder="搜索地块名称或编码"
            class="h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring"
          />
        </div>
        <!-- 列表 -->
        <div class="flex-1 overflow-y-auto px-6 py-3">
          <div class="mb-2 flex items-center justify-between">
            <span class="text-sm text-muted-foreground">
              当前所属单位：<span class="font-medium text-foreground">{{ form.unit }}</span>
            </span>
            <label class="inline-flex items-center gap-2 text-sm cursor-pointer">
              <input type="checkbox" :checked="allPlotsSelected" @change="toggleAllPlots" class="rounded border-input" />
              全选
            </label>
          </div>
          <div class="space-y-2">
            <label
              v-for="plot in filteredPlots"
              :key="plot.id"
              class="flex items-center gap-3 rounded-md border p-3 cursor-pointer transition-colors hover:bg-muted/50"
              :class="tempSelectedPlots.includes(plot.id) ? 'border-primary bg-primary/5' : 'border-input'"
            >
              <input
                type="checkbox"
                :checked="tempSelectedPlots.includes(plot.id)"
                @change="togglePlot(plot.id)"
                class="rounded border-input"
              />
              <div class="flex-1 min-w-0">
                <div class="flex items-center gap-2">
                  <span class="text-sm font-medium">{{ plot.name }}</span>
                  <span class="text-xs text-muted-foreground">{{ plot.code }}</span>
                </div>
                <div class="mt-1 flex items-center gap-4 text-xs text-muted-foreground">
                  <span>面积：{{ plot.area }} 亩</span>
                  <span>类型：{{ plot.type }}</span>
                  <span>位置：{{ plot.location }}</span>
                </div>
              </div>
            </label>
            <p v-if="filteredPlots.length === 0" class="py-6 text-center text-sm text-muted-foreground">未找到匹配的地块</p>
          </div>
        </div>
        <!-- 底部操作 -->
        <div class="flex items-center justify-between border-t px-6 py-4">
          <span class="text-sm text-muted-foreground">
            已选择 <span class="font-medium text-foreground">{{ tempSelectedPlots.length }}</span> 个地块
          </span>
          <div class="flex items-center gap-2">
            <button
              class="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium shadow-sm transition-colors hover:bg-muted"
              @click="showPlotDialog = false"
            >
              取消
            </button>
            <button
              class="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90"
              @click="confirmPlotSelection"
            >
              确认选择
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ArrowLeft, Plus, Save, Send, Trash2, Search, X } from 'lucide-vue-next'
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

// ==================== 地块数据（种植单元） ====================
interface PlotItem {
  id: string
  code: string
  name: string
  area: number
  type: string
  location: string
  unit: string
}

const plotData: PlotItem[] = [
  { id: 'DK001', code: 'SB-DK-001', name: '松北1号地', area: 120, type: '旱地', location: '松北平原东区', unit: '松北农场' },
  { id: 'DK002', code: 'SB-DK-002', name: '松北2号地', area: 85, type: '水田', location: '松北平原西区', unit: '松北农场' },
  { id: 'DK003', code: 'SB-DK-003', name: '松北3号地', area: 150, type: '水田', location: '松北平原北区', unit: '松北农场' },
  { id: 'DK004', code: 'HL-DK-001', name: '呼兰1号地', area: 200, type: '旱地', location: '呼兰流域南段', unit: '呼兰农场' },
  { id: 'DK005', code: 'HL-DK-002', name: '呼兰2号地', area: 95, type: '水田', location: '呼兰流域北段', unit: '呼兰农场' },
  { id: 'DK006', code: 'XM-DK-001', name: '新民1号地', area: 180, type: '旱地', location: '新民产区中心', unit: '新民农场' },
  { id: 'DK007', code: 'SC-DK-001', name: '双城1号地', area: 110, type: '旱地', location: '双城产区东区', unit: '双城分场' },
  { id: 'DK008', code: 'AC-DK-001', name: '阿城设施1号棚', area: 15, type: '设施大棚', location: '阿城设施区A栋', unit: '阿城农场' },
  { id: 'DK009', code: 'AC-DK-002', name: '阿城设施2号棚', area: 12, type: '设施大棚', location: '阿城设施区B栋', unit: '阿城农场' },
  { id: 'DK010', code: 'LZ-DK-001', name: '辽中1号地', area: 160, type: '旱地', location: '辽中产区西区', unit: '辽中分场' },
  { id: 'DK011', code: 'SB-DK-004', name: '松北4号地', area: 75, type: '旱地', location: '松北平原南区', unit: '松北农场' },
  { id: 'DK012', code: 'AC-DK-003', name: '阿城设施3号棚', area: 18, type: '设施大棚', location: '阿城设施区C栋', unit: '阿城农场' },
]

const showPlotDialog = ref(false)
const plotSearch = ref('')
const tempSelectedPlots = ref<string[]>([])

// 按所属单位筛选地块
const unitPlots = computed(() => {
  const unit = form.value.unit
  if (!unit) return plotData
  return plotData.filter(p => p.unit === unit)
})

// 搜索过滤
const filteredPlots = computed(() => {
  const keyword = plotSearch.value.trim().toLowerCase()
  if (!keyword) return unitPlots.value
  return unitPlots.value.filter(p =>
    p.name.toLowerCase().includes(keyword) ||
    p.code.toLowerCase().includes(keyword)
  )
})

const allPlotsSelected = computed(() => {
  if (filteredPlots.value.length === 0) return false
  return filteredPlots.value.every(p => tempSelectedPlots.value.includes(p.id))
})

function togglePlot(plotId: string): void {
  const idx = tempSelectedPlots.value.indexOf(plotId)
  if (idx >= 0) {
    tempSelectedPlots.value.splice(idx, 1)
  } else {
    tempSelectedPlots.value.push(plotId)
  }
}

function toggleAllPlots(): void {
  if (allPlotsSelected.value) {
    // 取消当前过滤列表中的所有
    const filteredIds = filteredPlots.value.map(p => p.id)
    tempSelectedPlots.value = tempSelectedPlots.value.filter(id => !filteredIds.includes(id))
  } else {
    // 选中当前过滤列表中的所有
    const existingIds = new Set(tempSelectedPlots.value)
    for (const p of filteredPlots.value) {
      if (!existingIds.has(p.id)) {
        tempSelectedPlots.value.push(p.id)
      }
    }
  }
}

function confirmPlotSelection(): void {
  form.value.selectedPlots = [...tempSelectedPlots.value]
  showPlotDialog.value = false
}

// 已选地块名称展示
const selectedPlotNames = computed(() => {
  const ids = form.value.selectedPlots
  if (ids.length === 0) return ''
  return plotData
    .filter(p => ids.includes(p.id))
    .map(p => p.name)
    .join('、')
})

// 资产面积（自动计算：选中地块面积之和）
const assetArea = computed(() => {
  const ids = form.value.selectedPlots
  if (ids.length === 0) return 0
  return plotData
    .filter(p => ids.includes(p.id))
    .reduce((sum, p) => sum + p.area, 0)
})

const assetAreaDisplay = computed(() => {
  return assetArea.value > 0 ? `${assetArea.value}` : ''
})

// ==================== 人员列表（所属单位关联） ====================
interface PersonnelItem {
  id: string
  name: string
  role: string
  unit: string
}

const personnelData: PersonnelItem[] = [
  { id: 'P001', name: '张三', role: '场长', unit: '松北农场' },
  { id: 'P002', name: '李四', role: '技术主管', unit: '松北农场' },
  { id: 'P003', name: '王五', role: '农艺师', unit: '松北农场' },
  { id: 'P004', name: '赵六', role: '场长', unit: '呼兰农场' },
  { id: 'P005', name: '孙七', role: '技术主管', unit: '呼兰农场' },
  { id: 'P006', name: '周八', role: '场长', unit: '新民农场' },
  { id: 'P007', name: '吴九', role: '技术主管', unit: '新民农场' },
  { id: 'P008', name: '郑十', role: '农艺师', unit: '双城分场' },
  { id: 'P009', name: '刘明', role: '场长', unit: '阿城农场' },
  { id: 'P010', name: '陈亮', role: '技术主管', unit: '阿城农场' },
  { id: 'P011', name: '杨帆', role: '场长', unit: '辽中分场' },
  { id: 'P012', name: '黄磊', role: '农艺师', unit: '辽中分场' },
]

const personnelList = computed(() => {
  const unit = form.value.unit
  if (!unit) return personnelData
  return personnelData.filter(p => p.unit === unit)
})

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
  schemeCode: string
  planName: string
  unit: string
  plantingMode: string
  cropCategory: string
  cropVariety: string
  selectedPlots: string[]
  totalArea: number | ''
  planStartDate: string
  planEndDate: string
  planLeader: string
  execLeader: string
  author: string
  effectiveTime: string
  remark: string
  farmingItems: FarmingExecItem[]
  materialItems: MaterialPlanItem[]
}

const form = ref<PlanForm>({
  planCode: '',
  schemeCode: '',
  planName: '',
  unit: schemeInfo.value.unit,
  plantingMode: schemeInfo.value.plantingMode,
  cropCategory: schemeInfo.value.cropCategory,
  cropVariety: schemeInfo.value.cropVariety,
  selectedPlots: [],
  totalArea: '',
  planStartDate: '',
  planEndDate: '',
  planLeader: '',
  execLeader: '',
  author: '当前用户',
  effectiveTime: '',
  remark: '',
  farmingItems: [],
  materialItems: [],
})

// ==================== 自动计算收获结束时间 ====================
watch(() => form.value.planStartDate, (newVal) => {
  if (newVal && schemeInfo.value.totalDays > 0) {
    const startDate = new Date(newVal)
    startDate.setDate(startDate.getDate() + schemeInfo.value.totalDays)
    form.value.planEndDate = startDate.toISOString().slice(0, 10)
  }
})

// ==================== 方案代入数据 ====================
function loadSchemeData(): void {
  const s = schemeInfo.value
  if (!s.id) return

  form.value.schemeCode = s.id
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
  if (form.value.selectedPlots.length === 0) {
    showToast({ message: '请选择种植资源信息', type: 'error' })
    return
  }
  if (!form.value.totalArea) {
    showToast({ message: '请输入计划种植面积', type: 'error' })
    return
  }
  if (assetArea.value > 0 && form.value.totalArea > assetArea.value) {
    showToast({ message: '计划种植总面积不能大于资产面积', type: 'error' })
    return
  }
  if (!form.value.planStartDate) {
    showToast({ message: '请选择计划播种/定植开始时间', type: 'error' })
    return
  }
  if (!form.value.planLeader) {
    showToast({ message: '请选择计划负责人', type: 'error' })
    return
  }
  if (!form.value.execLeader) {
    showToast({ message: '请选择执行负责人', type: 'error' })
    return
  }
  showToast({ message: '已发送至：' + form.value.unit + '负责人进行审批（审批人：张三、李四）', type: 'success' })
}

function goBack(): void {
  router.push('/planting-schedule')
}

// ==================== 弹框打开时同步已选 ====================
watch(showPlotDialog, (val) => {
  if (val) {
    tempSelectedPlots.value = [...form.value.selectedPlots]
    plotSearch.value = ''
  }
})

// ==================== 初始化 ====================
onMounted(() => {
  form.value.planCode = generateCode()
  loadSchemeData()
})
</script>
