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
            <span class="ml-2 text-xs text-muted-foreground font-normal">选择种植单元</span>
          </label>
          <div class="flex items-center gap-2">
            <input
              :value="selectedPlotNames"
              type="text"
              readonly
              placeholder="请选择种植单元"
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
        <div class="text-sm text-muted-foreground space-y-1">
          <p>基于种植方案的农事作业标准，制定执行计划的时间安排</p>
          <div class="flex items-center gap-4 text-xs">
            <span class="flex items-center gap-1"><span class="inline-block w-2 h-2 rounded-full bg-gray-400"></span> 引用方案代入-不可修改</span>
            <span class="flex items-center gap-1"><span class="inline-block w-2 h-2 rounded-full bg-blue-400"></span> 引用方案代入-可修改</span>
            <span class="flex items-center gap-1"><span class="inline-block w-2 h-2 rounded-full bg-green-400"></span> 特有字段</span>
          </div>
        </div>
      </div>
      <div class="rounded-lg border">
        <div class="overflow-x-auto">
          <table class="w-full text-sm" style="min-width:2400px">
            <thead>
              <tr class="border-b bg-muted/50">
                <th class="h-10 px-2 text-center font-medium text-muted-foreground" style="width:40px">序号</th>
                <!-- 引用方案代入-不可修改 -->
                <th class="h-10 px-2 text-left font-medium text-muted-foreground bg-gray-50/50" style="width:80px">生育时期</th>
                <th class="h-10 px-2 text-left font-medium text-muted-foreground bg-gray-50/50" style="width:80px">生产流程</th>
                <th class="h-10 px-2 text-left font-medium text-muted-foreground bg-gray-50/50" style="width:90px">作业环节</th>
                <th v-if="form.plantingMode !== '设施种植'" class="h-10 px-2 text-left font-medium text-muted-foreground bg-gray-50/50" style="width:70px">最小叶龄</th>
                <th v-if="form.plantingMode !== '设施种植'" class="h-10 px-2 text-left font-medium text-muted-foreground bg-gray-50/50" style="width:70px">最大叶龄</th>
                <th class="h-10 px-2 text-left font-medium text-muted-foreground bg-gray-50/50" style="width:120px">核心农事<br/>操作标准</th>
                <th v-if="form.plantingMode === '设施种植'" class="h-10 px-2 text-left font-medium text-muted-foreground bg-gray-50/50" style="width:120px">设施环境<br/>管控要求</th>
                <!-- 引用方案代入-可修改 -->
                <th class="h-10 px-2 text-left font-medium text-muted-foreground bg-blue-50/50" style="width:110px">计划开始时间<span class="text-red-500">*</span></th>
                <th class="h-10 px-2 text-left font-medium text-muted-foreground bg-blue-50/50" style="width:110px">计划结束时间<span class="text-red-500">*</span></th>
                <th class="h-10 px-2 text-left font-medium text-muted-foreground bg-blue-50/50" style="width:110px">作业参数要求</th>
                <th class="h-10 px-2 text-left font-medium text-muted-foreground bg-blue-50/50" style="width:90px">作业方式</th>
                <!-- 特有字段 -->
                <th class="h-10 px-2 text-left font-medium text-muted-foreground bg-green-50/50" style="width:90px">计划作业<br/>面积(亩)</th>
                <th class="h-10 px-2 text-left font-medium text-muted-foreground bg-green-50/50" style="width:120px">计划作业<br/>设备/农机</th>
                <th class="h-10 px-2 text-center font-medium text-muted-foreground bg-green-50/50" style="width:70px">执行状态</th>
                <th class="h-10 px-2 text-left font-medium text-muted-foreground bg-green-50/50" style="width:90px">作业负责人</th>
                <th class="h-10 px-2 text-left font-medium text-muted-foreground bg-green-50/50" style="width:90px">作业执行人</th>
                <th class="h-10 px-2 text-left font-medium text-muted-foreground bg-green-50/50" style="width:110px">实际完成时间</th>
                <th class="h-10 px-2 text-left font-medium text-muted-foreground bg-green-50/50" style="width:130px">执行记录编号</th>
                <th class="h-10 px-2 text-left font-medium text-muted-foreground bg-green-50/50" style="width:100px">备注</th>
                <th class="h-10 px-2 text-center font-medium text-muted-foreground" style="width:50px">操作</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(row, idx) in form.farmingItems" :key="idx" class="border-b hover:bg-muted/30">
                <td class="h-12 px-2 text-center text-muted-foreground">{{ idx + 1 }}</td>
                <!-- 引用方案代入-不可修改 -->
                <td class="h-12 px-2 bg-gray-50/30"><span class="text-sm">{{ row.growthPeriod || '-' }}</span></td>
                <td class="h-12 px-2 bg-gray-50/30"><span class="text-sm">{{ row.productionProcess || '-' }}</span></td>
                <td class="h-12 px-2 bg-gray-50/30"><span class="text-sm">{{ row.taskLink || '-' }}</span></td>
                <td v-if="form.plantingMode !== '设施种植'" class="h-12 px-2 bg-gray-50/30"><span class="text-sm">{{ row.minLeafAge || '-' }}</span></td>
                <td v-if="form.plantingMode !== '设施种植'" class="h-12 px-2 bg-gray-50/30"><span class="text-sm">{{ row.maxLeafAge || '-' }}</span></td>
                <td class="h-12 px-2 bg-gray-50/30"><span class="text-sm">{{ row.coreStandard || '-' }}</span></td>
                <td v-if="form.plantingMode === '设施种植'" class="h-12 px-2 bg-gray-50/30"><span class="text-sm">{{ row.envControlReq || '-' }}</span></td>
                <!-- 引用方案代入-可修改 -->
                <td class="h-12 px-2 bg-blue-50/30">
                  <input v-model="row.planStartDate" type="date" class="h-8 w-full rounded border border-input bg-transparent px-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-ring" />
                </td>
                <td class="h-12 px-2 bg-blue-50/30">
                  <input v-model="row.planEndDate" type="date" class="h-8 w-full rounded border border-input bg-transparent px-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-ring" />
                </td>
                <td class="h-12 px-2 bg-blue-50/30">
                  <input v-model="row.paramStandard" class="h-8 w-full rounded border border-input bg-transparent px-2 text-xs focus:outline-none focus:ring-1 focus:ring-ring" placeholder="参数要求" />
                </td>
                <td class="h-12 px-2 bg-blue-50/30">
                  <select v-model="row.workMethod" class="h-8 w-full rounded border border-input bg-transparent px-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-ring">
                    <option value="">请选择</option>
                    <option value="农机作业">农机作业</option>
                    <option value="人工作业">人工作业</option>
                    <option value="无人机作业">无人机作业</option>
                    <option value="智能设备作业">智能设备作业</option>
                  </select>
                </td>
                <!-- 特有字段 -->
                <td class="h-12 px-2 bg-green-50/30">
                  <input v-model.number="row.planWorkArea" type="number" min="0" class="h-8 w-full rounded border border-input bg-transparent px-2 text-xs focus:outline-none focus:ring-1 focus:ring-ring" placeholder="面积" />
                </td>
                <td class="h-12 px-2 bg-green-50/30">
                  <select v-model="row.planEquipment" class="h-8 w-full rounded border border-input bg-transparent px-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-ring">
                    <option value="">请选择</option>
                    <option v-if="form.plantingMode === '大田种植'" value="拖拉机">拖拉机</option>
                    <option v-if="form.plantingMode === '大田种植'" value="收割机">收割机</option>
                    <option v-if="form.plantingMode === '大田种植'" value="播种机">播种机</option>
                    <option v-if="form.plantingMode === '大田种植'" value="旋耕机">旋耕机</option>
                    <option v-if="form.plantingMode === '设施种植'" value="温控设备">温控设备</option>
                    <option v-if="form.plantingMode === '设施种植'" value="灌溉设备">灌溉设备</option>
                    <option v-if="form.plantingMode === '设施种植'" value="补光设备">补光设备</option>
                    <option v-if="form.plantingMode === '设施种植'" value="通风设备">通风设备</option>
                  </select>
                </td>
                <td class="h-12 px-2 text-center bg-green-50/30">
                  <span :class="execStatusBadge(row.execStatus)">{{ execStatusLabel(row.execStatus) }}</span>
                </td>
                <td class="h-12 px-2 bg-green-50/30">
                  <select v-model="row.workLeader" class="h-8 w-full rounded border border-input bg-transparent px-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-ring">
                    <option value="">请选择</option>
                    <option v-for="p in personnelList" :key="p.id" :value="p.name">{{ p.name }}</option>
                  </select>
                </td>
                <td class="h-12 px-2 bg-green-50/30">
                  <select v-model="row.workExecutor" class="h-8 w-full rounded border border-input bg-transparent px-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-ring">
                    <option value="">请选择</option>
                    <option v-for="p in personnelList" :key="p.id" :value="p.name">{{ p.name }}</option>
                  </select>
                </td>
                <td class="h-12 px-2 bg-green-50/30">
                  <span class="text-xs text-muted-foreground">{{ row.actualCompleteTime || '-' }}</span>
                </td>
                <td class="h-12 px-2 bg-green-50/30">
                  <span class="text-xs font-mono text-muted-foreground">{{ row.execRecordCode || '-' }}</span>
                </td>
                <td class="h-12 px-2 bg-green-50/30">
                  <input v-model="row.remark" class="h-8 w-full rounded border border-input bg-transparent px-2 text-xs focus:outline-none focus:ring-1 focus:ring-ring" placeholder="备注" />
                </td>
                <td class="h-12 px-2 text-center">
                  <button class="text-red-500 hover:text-red-700" @click="removeFarmingRow(idx)">
                    <Trash2 class="h-4 w-4" />
                  </button>
                </td>
              </tr>
              <tr v-if="form.farmingItems.length === 0">
                <td colspan="21" class="p-6 text-center text-muted-foreground">暂无明细，点击"添加明细"新增</td>
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
      <div class="w-[1100px] h-[720px] rounded-lg border bg-background shadow-lg flex flex-col">
        <!-- 弹框头部：所属主体 + 搜索 -->
        <div class="flex items-center justify-between border-b px-5 py-3">
          <div class="flex items-center gap-2">
            <span class="text-sm text-muted-foreground">当前所属主体：</span>
            <button
              class="inline-flex items-center gap-1 rounded-md border border-input bg-background px-3 py-1.5 text-sm font-medium shadow-sm hover:bg-muted"
            >
              {{ currentOrgName }}
              <ChevronDown class="h-3.5 w-3.5" />
            </button>
          </div>
          <div class="flex items-center gap-2">
            <input
              v-model="plotGlobalSearch"
              type="text"
              placeholder="请输入查询内容"
              class="h-8 w-56 rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring"
            />
            <button class="inline-flex items-center justify-center rounded-md bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground shadow hover:bg-primary/90">
              <Search class="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

        <!-- 主体内容：三栏布局 -->
        <div class="flex flex-1 overflow-hidden">
          <!-- 左侧：资源树 -->
          <div class="w-56 border-r flex flex-col bg-muted/20">
            <div class="px-3 py-2 border-b">
              <span class="text-xs font-semibold text-muted-foreground uppercase tracking-wider">资源树</span>
            </div>
            <div class="flex-1 overflow-y-auto p-2">
              <template v-for="org in orgTree" :key="org.id">
                <!-- 一级：总部 -->
                <div class="mb-1">
                  <button
                    class="flex w-full items-center gap-1.5 rounded px-2 py-1.5 text-sm font-medium hover:bg-muted"
                    @click="toggleTreeNode(org.id)"
                  >
                    <ChevronRight
                      class="h-3.5 w-3.5 transition-transform"
                      :class="expandedNodes.includes(org.id) ? 'rotate-90' : ''"
                    />
                    {{ org.name }}
                  </button>
                  <!-- 二级：区域公司 -->
                  <div v-if="expandedNodes.includes(org.id)" class="ml-4">
                    <template v-for="company in org.children" :key="company.id">
                      <div class="mb-0.5">
                        <button
                          class="flex w-full items-center gap-1.5 rounded px-2 py-1 text-sm hover:bg-muted"
                          @click="toggleTreeNode(company.id)"
                        >
                          <ChevronRight
                            class="h-3.5 w-3.5 transition-transform"
                            :class="expandedNodes.includes(company.id) ? 'rotate-90' : ''"
                          />
                          {{ company.name }}
                        </button>
                        <!-- 三级：园区/农场 -->
                        <div v-if="expandedNodes.includes(company.id)" class="ml-4">
                          <template v-for="park in company.children" :key="park.id">
                            <div class="mb-0.5">
                              <button
                                class="flex w-full items-center gap-1.5 rounded px-2 py-1 text-sm hover:bg-muted"
                                :class="selectedTreeNode === park.id ? 'bg-primary/10 text-primary font-medium' : ''"
                                @click="selectTreeNode(park.id, park.name)"
                              >
                                <ChevronRight
                                  class="h-3.5 w-3.5 transition-transform"
                                  :class="expandedNodes.includes(park.id) ? 'rotate-90' : ''"
                                />
                                {{ park.name }}
                              </button>
                              <!-- 四级：分场/分园编号 -->
                              <div v-if="expandedNodes.includes(park.id)" class="ml-4">
                                <button
                                  v-for="branch in park.children"
                                  :key="branch.id"
                                  class="flex w-full items-center gap-1.5 rounded px-2 py-1 text-xs hover:bg-muted"
                                  :class="selectedTreeNode === branch.id ? 'bg-primary/10 text-primary font-medium' : ''"
                                  @click="selectTreeNode(branch.id, branch.name)"
                                >
                                  <MapPin class="h-3 w-3 text-muted-foreground" />
                                  {{ branch.name }}
                                </button>
                              </div>
                            </div>
                          </template>
                        </div>
                      </div>
                    </template>
                  </div>
                </div>
              </template>
            </div>
          </div>

          <!-- 中间：天地图 -->
          <div class="flex-1 relative bg-muted/10">
            <div class="absolute inset-0 flex items-center justify-center">
              <!-- 天地图占位 - 模拟卫星地图 -->
              <div class="w-full h-full relative overflow-hidden">
                <!-- 模拟卫星地图背景 -->
                <div class="absolute inset-0" style="background: linear-gradient(135deg, #e8f0e4 0%, #d4e6c8 25%, #c5d9b3 50%, #b8ccaa 75%, #a8bf98 100%)"></div>
                <!-- 模拟道路 -->
                <div class="absolute top-1/3 left-0 right-0 h-1 bg-white/60"></div>
                <div class="absolute top-0 bottom-0 left-1/4 w-1 bg-white/50"></div>
                <div class="absolute top-0 bottom-0 right-1/3 w-0.5 bg-yellow-200/50"></div>
                <!-- 模拟地块标注 -->
                <div
                  v-for="region in mapRegions"
                  :key="region.id"
                  class="absolute border-2 rounded cursor-pointer transition-all"
                  :class="region.selected ? 'border-blue-500 bg-blue-500/10 shadow-lg' : 'border-green-600 bg-green-600/5 hover:bg-green-600/10'"
                  :style="region.style"
                  @click="toggleMapRegion(region.id)"
                >
                  <span class="absolute -top-5 left-1 text-xs font-medium whitespace-nowrap"
                    :class="region.selected ? 'text-blue-600' : 'text-green-800'"
                  >{{ region.label }}</span>
                  <div v-if="region.selected" class="absolute -top-1 -left-1 h-2.5 w-2.5 rounded-full bg-blue-500"></div>
                  <div v-if="region.selected" class="absolute -top-1 -right-1 h-2.5 w-2.5 rounded-full bg-blue-500"></div>
                  <div v-if="region.selected" class="absolute -bottom-1 -left-1 h-2.5 w-2.5 rounded-full bg-blue-500"></div>
                  <div v-if="region.selected" class="absolute -bottom-1 -right-1 h-2.5 w-2.5 rounded-full bg-blue-500"></div>
                </div>
                <!-- 地图标注文字 -->
                <div class="absolute bottom-4 right-4 text-xs text-green-900/60">储备林苗圃</div>
                <div class="absolute top-6 left-6 text-xs text-green-900/60">农业设施区</div>
                <!-- 天地图标识 -->
                <div class="absolute bottom-2 left-2 flex items-center gap-1 rounded bg-white/80 px-2 py-0.5 text-xs text-muted-foreground">
                  <Map class="h-3.5 w-3.5" />
                  天地图
                </div>
                <!-- 图例 -->
                <div class="absolute top-3 right-3 rounded bg-white/90 border p-2 text-xs space-y-1">
                  <div class="flex items-center gap-1.5"><span class="inline-block w-3 h-0.5 bg-green-600"></span> 地块边界</div>
                  <div class="flex items-center gap-1.5"><span class="inline-block w-3 h-0.5 bg-blue-500"></span> 选中地块</div>
                </div>
              </div>
            </div>
          </div>

          <!-- 右侧：地块列表 -->
          <div class="w-72 border-l flex flex-col bg-white">
            <div class="px-4 py-3 border-b">
              <span class="text-sm font-semibold">选择种植单元</span>
            </div>
            <!-- 搜索 -->
            <div class="px-4 py-2 border-b space-y-2">
              <input
                v-model="plotNameSearch"
                type="text"
                placeholder="请输入种植单元名称"
                class="h-7 w-full rounded border border-input bg-transparent px-2 py-0.5 text-xs focus:outline-none focus:ring-1 focus:ring-ring"
              />
              <input
                v-model="plotCodeSearch"
                type="text"
                placeholder="请输入种植单元编码"
                class="h-7 w-full rounded border border-input bg-transparent px-2 py-0.5 text-xs focus:outline-none focus:ring-1 focus:ring-ring"
              />
              <div class="flex gap-2">
                <button
                  class="flex-1 rounded bg-primary px-2 py-1 text-xs font-medium text-primary-foreground hover:bg-primary/90"
                  @click="applyPlotFilter"
                >查询</button>
                <button
                  class="flex-1 rounded border border-input bg-background px-2 py-1 text-xs font-medium hover:bg-muted"
                  @click="resetPlotFilter"
                >重置</button>
              </div>
            </div>
            <!-- 地块分组列表 -->
            <div class="flex-1 overflow-y-auto px-4 py-2">
              <div v-for="group in plotGroupedList" :key="group.code" class="mb-2">
                <button
                  class="flex w-full items-center gap-1.5 rounded px-2 py-1.5 text-xs font-medium hover:bg-muted"
                  @click="togglePlotGroup(group.code)"
                >
                  <ChevronRight
                    class="h-3 w-3 transition-transform"
                    :class="expandedPlotGroups.includes(group.code) ? 'rotate-90' : ''"
                  />
                  {{ group.code }}
                  <span class="text-muted-foreground">（{{ group.items.length }}）</span>
                </button>
                <div v-if="expandedPlotGroups.includes(group.code)" class="ml-3 space-y-1">
                  <label
                    v-for="plot in group.items"
                    :key="plot.id"
                    class="flex items-start gap-2 rounded px-2 py-1.5 cursor-pointer transition-colors hover:bg-muted/50"
                    :class="tempSelectedPlots.includes(plot.id) ? 'bg-primary/5' : ''"
                  >
                    <input
                      type="checkbox"
                      :checked="tempSelectedPlots.includes(plot.id)"
                      @change="togglePlot(plot.id)"
                      class="mt-0.5 rounded border-input"
                    />
                    <div class="flex-1 min-w-0">
                      <div class="flex items-center gap-1.5">
                        <span
                          class="inline-flex items-center rounded px-1 py-0.5 text-[10px] font-medium"
                          :class="plot.status === '可用' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'"
                        >{{ plot.status }}</span>
                        <span class="text-xs font-medium">{{ plot.name }}</span>
                      </div>
                      <p class="mt-0.5 text-[10px] text-muted-foreground font-mono">{{ plot.uniqueCode }}</p>
                    </div>
                  </label>
                </div>
              </div>
              <p v-if="plotGroupedList.length === 0" class="py-8 text-center text-xs text-muted-foreground">未找到匹配的地块</p>
            </div>
          </div>
        </div>

        <!-- 底部操作 -->
        <div class="flex items-center justify-between border-t px-6 py-3">
          <span class="text-sm text-muted-foreground">
            已选择 <span class="font-medium text-foreground">{{ tempSelectedPlots.length }}</span> 个种植单元，
            资产面积合计 <span class="font-medium text-foreground">{{ tempAssetArea }}</span> 亩
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
              保存
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
import { ArrowLeft, Plus, Save, Send, Trash2, Search, X, ChevronDown, ChevronRight, MapPin, Map } from 'lucide-vue-next'
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
type ScheduleExecStatus = 'pending_issue' | 'pending_exec' | 'in_progress' | 'completed' | 'overdue' | 'cancelled'

function execStatusLabel(status: ScheduleExecStatus): string {
  const map: Record<ScheduleExecStatus, string> = {
    pending_issue: '待下发',
    pending_exec: '待执行',
    in_progress: '执行中',
    completed: '已完成',
    overdue: '已逾期',
    cancelled: '已取消',
  }
  return map[status] || '待下发'
}

function execStatusBadge(status: ScheduleExecStatus): string {
  const base = 'inline-flex items-center rounded-md px-1.5 py-0.5 text-xs font-medium whitespace-nowrap'
  const map: Record<ScheduleExecStatus, string> = {
    pending_issue: 'bg-gray-100 text-gray-600',
    pending_exec: 'bg-blue-100 text-blue-700',
    in_progress: 'bg-yellow-100 text-yellow-700',
    completed: 'bg-green-100 text-green-700',
    overdue: 'bg-red-100 text-red-700',
    cancelled: 'bg-gray-200 text-gray-500',
  }
  return `${base} ${map[status] || map.pending_issue}`
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
  status: '可用' | '不可用'
  uniqueCode: string
  parentCode: string
}

const plotData: PlotItem[] = [
  { id: 'DK001', code: '京号0077', name: '良乡1号种植单元', area: 120, type: '旱地', location: '良乡园区东区', unit: '良乡园区', status: '可用', uniqueCode: '01020001011200500001', parentCode: '京号0077' },
  { id: 'DK002', code: '京号0077', name: '良乡2号种植单元', area: 85, type: '水田', location: '良乡园区西区', unit: '良乡园区', status: '可用', uniqueCode: '01020001011200500002', parentCode: '京号0077' },
  { id: 'DK003', code: '京号0077', name: '良乡3号种植单元', area: 95, type: '旱地', location: '良乡园区北区', unit: '良乡园区', status: '不可用', uniqueCode: '01020001011200500003', parentCode: '京号0077' },
  { id: 'DK004', code: '京号0077', name: '良乡4号种植单元', area: 60, type: '水田', location: '良乡园区南区', unit: '良乡园区', status: '可用', uniqueCode: '01020001011200500004', parentCode: '京号0077' },
  { id: 'DK005', code: '京号0078', name: '长阳1号种植单元', area: 200, type: '旱地', location: '长阳分场中心', unit: '良乡园区', status: '可用', uniqueCode: '01020001011200500005', parentCode: '京号0078' },
  { id: 'DK006', code: '京号0078', name: '长阳2号种植单元', area: 150, type: '水田', location: '长阳分场南区', unit: '良乡园区', status: '可用', uniqueCode: '01020001011200500006', parentCode: '京号0078' },
  { id: 'DK007', code: '京号0078', name: '长阳3号种植单元', area: 90, type: '旱地', location: '长阳分场北区', unit: '良乡园区', status: '不可用', uniqueCode: '01020001011200500007', parentCode: '京号0078' },
  { id: 'DK008', code: '京号0079', name: '北潞上1号种植单元', area: 110, type: '旱地', location: '北潞上分场东区', unit: '良乡园区', status: '可用', uniqueCode: '01020001011200500008', parentCode: '京号0079' },
  { id: 'DK009', code: '京号0079', name: '北潞上2号种植单元', area: 75, type: '设施大棚', location: '北潞上分场西区', unit: '良乡园区', status: '可用', uniqueCode: '01020001011200500009', parentCode: '京号0079' },
  { id: 'DK010', code: '津号0001', name: '天津1号种植单元', area: 180, type: '旱地', location: '天津园区中心', unit: '天津园区', status: '可用', uniqueCode: '01020001021200500001', parentCode: '津号0001' },
  { id: 'DK011', code: '津号0001', name: '天津2号种植单元', area: 130, type: '水田', location: '天津园区南区', unit: '天津园区', status: '可用', uniqueCode: '01020001021200500002', parentCode: '津号0001' },
  { id: 'DK012', code: '冀号0010', name: '唐山1号种植单元', area: 160, type: '旱地', location: '唐山园区东区', unit: '唐山园区', status: '可用', uniqueCode: '01020001031200500001', parentCode: '冀号0010' },
  { id: 'DK013', code: '冀号0010', name: '唐山2号地植单元', area: 100, type: '水田', location: '唐山园区西区', unit: '唐山园区', status: '不可用', uniqueCode: '01020001031200500002', parentCode: '冀号0010' },
  { id: 'DK014', code: '冀号0011', name: '石家庄1号种植单元', area: 140, type: '旱地', location: '石家庄农场中心', unit: '石家庄农场', status: '可用', uniqueCode: '01020001031200500003', parentCode: '冀号0011' },
  { id: 'DK015', code: '晋号0005', name: '太原1号种植单元', area: 170, type: '旱地', location: '太原农场北区', unit: '太原农场', status: '可用', uniqueCode: '01020001041200500001', parentCode: '晋号0005' },
]

const showPlotDialog = ref(false)
const plotGlobalSearch = ref('')
const plotNameSearch = ref('')
const plotCodeSearch = ref('')
const tempSelectedPlots = ref<string[]>([])
const selectedTreeNode = ref('')
const expandedNodes = ref<string[]>(['org-1', 'org-1-1'])
const expandedPlotGroups = ref<string[]>(['京号0077'])

// ==================== 组织架构树 ====================
interface TreeNode {
  id: string
  name: string
  children: TreeNode[]
}

const currentOrgName = ref('农发北京')

const orgTree: TreeNode[] = [
  {
    id: 'org-1', name: '农发总部',
    children: [
      {
        id: 'org-1-1', name: '北京公司',
        children: [
          {
            id: 'org-1-1-1', name: '良乡园区',
            children: [
              { id: 'org-1-1-1-1', name: '良乡分场', children: [] },
              { id: 'org-1-1-1-2', name: '京号0077', children: [] },
              { id: 'org-1-1-1-3', name: '长阳分场', children: [] },
              { id: 'org-1-1-1-4', name: '北潞上分场', children: [] },
              { id: 'org-1-1-1-5', name: '观音寺片区', children: [] },
            ]
          },
          { id: 'org-1-1-2', name: '通州园区', children: [] },
          { id: 'org-1-1-3', name: '唐山园区', children: [] },
          { id: 'org-1-1-4', name: '天津园区', children: [] },
          { id: 'org-1-1-5', name: '石家庄农场', children: [] },
          { id: 'org-1-1-6', name: '太原农场', children: [] },
        ]
      }
    ]
  }
]

function toggleTreeNode(nodeId: string): void {
  const idx = expandedNodes.value.indexOf(nodeId)
  if (idx >= 0) {
    expandedNodes.value.splice(idx, 1)
  } else {
    expandedNodes.value.push(nodeId)
  }
}

function selectTreeNode(nodeId: string, nodeName: string): void {
  selectedTreeNode.value = nodeId
  // 展开该节点
  if (!expandedNodes.value.includes(nodeId)) {
    expandedNodes.value.push(nodeId)
  }
  // 过滤地块列表：如果选中的是园区/农场节点，则按该单位过滤
  const unitMatch = plotData.find(p => p.unit === nodeName)
  if (unitMatch) {
    plotNameSearch.value = ''
    plotCodeSearch.value = ''
  }
}

// ==================== 地图区域 ====================
interface MapRegion {
  id: string
  label: string
  selected: boolean
  style: { top: string; left: string; width: string; height: string }
}

const mapRegions = ref<MapRegion[]>([
  { id: 'DK001', label: '良乡1号', selected: false, style: { top: '8%', left: '10%', width: '18%', height: '22%' } },
  { id: 'DK002', label: '良乡2号', selected: false, style: { top: '8%', left: '32%', width: '15%', height: '22%' } },
  { id: 'DK005', label: '长阳1号', selected: false, style: { top: '35%', left: '10%', width: '25%', height: '20%' } },
  { id: 'DK006', label: '长阳2号', selected: false, style: { top: '35%', left: '38%', width: '18%', height: '20%' } },
  { id: 'DK008', label: '北潞上1号', selected: false, style: { top: '60%', left: '12%', width: '20%', height: '18%' } },
  { id: 'DK009', label: '北潞上2号', selected: false, style: { top: '60%', left: '35%', width: '15%', height: '18%' } },
  { id: 'DK010', label: '天津1号', selected: false, style: { top: '15%', left: '60%', width: '22%', height: '25%' } },
  { id: 'DK012', label: '唐山1号', selected: false, style: { top: '50%', left: '60%', width: '20%', height: '22%' } },
])

function toggleMapRegion(regionId: string): void {
  const region = mapRegions.value.find(r => r.id === regionId)
  if (region) {
    region.selected = !region.selected
    togglePlot(regionId)
  }
}

// 同步地图选中状态
function syncMapSelections(): void {
  for (const region of mapRegions.value) {
    region.selected = tempSelectedPlots.value.includes(region.id)
  }
}

// ==================== 地块分组列表（右侧） ====================
const plotGroupedList = computed<{ code: string; items: PlotItem[] }[]>(() => {
  let filtered: PlotItem[] = plotData

  // 按树节点过滤
  if (selectedTreeNode.value) {
    const treeNode = findTreeNodeName(orgTree, selectedTreeNode.value)
    if (treeNode) {
      filtered = filtered.filter(p => p.unit === treeNode || p.parentCode === treeNode || p.code === treeNode)
    }
  }

  // 按搜索条件过滤
  if (plotNameSearch.value.trim()) {
    const kw = plotNameSearch.value.trim().toLowerCase()
    filtered = filtered.filter(p => p.name.toLowerCase().includes(kw))
  }
  if (plotCodeSearch.value.trim()) {
    const kw = plotCodeSearch.value.trim().toLowerCase()
    filtered = filtered.filter(p => p.code.toLowerCase().includes(kw) || p.uniqueCode.toLowerCase().includes(kw))
  }
  if (plotGlobalSearch.value.trim()) {
    const kw = plotGlobalSearch.value.trim().toLowerCase()
    filtered = filtered.filter(p =>
      p.name.toLowerCase().includes(kw) ||
      p.code.toLowerCase().includes(kw) ||
      p.uniqueCode.toLowerCase().includes(kw) ||
      p.location.toLowerCase().includes(kw)
    )
  }

  // 按编号分组
  const groupMap: Record<string, PlotItem[]> = {}
  for (const p of filtered) {
    if (!groupMap[p.code]) {
      groupMap[p.code] = []
    }
    groupMap[p.code].push(p)
  }

  const result: { code: string; items: PlotItem[] }[] = []
  Object.keys(groupMap).forEach((code) => {
    result.push({ code, items: groupMap[code] })
  })
  return result
})

function findTreeNodeName(tree: TreeNode[], targetId: string): string {
  for (const node of tree) {
    if (node.id === targetId) return node.name
    if (node.children.length > 0) {
      const found = findTreeNodeName(node.children, targetId)
      if (found) return found
    }
  }
  return ''
}

function togglePlotGroup(code: string): void {
  const idx = expandedPlotGroups.value.indexOf(code)
  if (idx >= 0) {
    expandedPlotGroups.value.splice(idx, 1)
  } else {
    expandedPlotGroups.value.push(code)
  }
}

function applyPlotFilter(): void {
  // 计算属性会自动响应搜索条件变化
}

function resetPlotFilter(): void {
  plotNameSearch.value = ''
  plotCodeSearch.value = ''
  plotGlobalSearch.value = ''
  selectedTreeNode.value = ''
}

// ==================== 地块选择操作 ====================
function togglePlot(plotId: string): void {
  const idx = tempSelectedPlots.value.indexOf(plotId)
  if (idx >= 0) {
    tempSelectedPlots.value.splice(idx, 1)
  } else {
    tempSelectedPlots.value.push(plotId)
  }
  syncMapSelections()
}

function confirmPlotSelection(): void {
  form.value.selectedPlots = [...tempSelectedPlots.value]
  showPlotDialog.value = false
}

// 临时选中地块面积合计
const tempAssetArea = computed(() => {
  if (tempSelectedPlots.value.length === 0) return 0
  return plotData
    .filter(p => tempSelectedPlots.value.includes(p.id))
    .reduce((sum, p) => sum + p.area, 0)
})

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
  // 引用方案代入-不可修改
  growthPeriod: string
  productionProcess: string
  taskLink: string
  minLeafAge: number | ''
  maxLeafAge: number | ''
  coreStandard: string
  envControlReq: string
  // 引用方案代入-可修改
  planStartDate: string
  planEndDate: string
  paramStandard: string
  workMethod: string
  // 特有字段
  planWorkArea: number | ''
  planEquipment: string
  execStatus: ScheduleExecStatus
  workLeader: string
  workExecutor: string
  actualCompleteTime: string
  execRecordCode: string
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
  // 自动计算农事作业计划时间（顺序排列）
  autoCalcFarmingTimes()
})

// 自动计算农事作业执行计划的时间（按顺序排列）
function autoCalcFarmingTimes(): void {
  const startDate = form.value.planStartDate
  if (!startDate || form.value.farmingItems.length === 0) return

  let currentDate = new Date(startDate)
  // 按生育期天数顺序推进
  const farmingDaysMap: Record<string, number> = {
    '整地': 5, '播种': 3, '追肥': 7, '灌溉': 10,
    '病虫害防治': 3, '收获': 5, '施基肥': 4, '间苗': 3,
  }

  for (const item of form.value.farmingItems) {
    if (!item.planStartDate) {
      item.planStartDate = currentDate.toISOString().slice(0, 10)
    }
    const days = farmingDaysMap[item.taskLink] || 5
    const endDate = new Date(item.planStartDate)
    endDate.setDate(endDate.getDate() + days)
    if (!item.planEndDate) {
      item.planEndDate = endDate.toISOString().slice(0, 10)
    }
    // 下一行的开始时间 = 上一行的结束时间
    currentDate = new Date(item.planEndDate)
  }
}

// 自动代入特有字段
watch(() => form.value.totalArea, (newVal) => {
  if (newVal) {
    for (const item of form.value.farmingItems) {
      if (!item.planWorkArea) {
        item.planWorkArea = typeof newVal === 'number' ? newVal : 0
      }
    }
  }
})

watch(() => form.value.planLeader, (newVal) => {
  if (newVal) {
    for (const item of form.value.farmingItems) {
      if (!item.workLeader) {
        item.workLeader = newVal
      }
    }
  }
})

watch(() => form.value.execLeader, (newVal) => {
  if (newVal) {
    for (const item of form.value.farmingItems) {
      if (!item.workExecutor) {
        item.workExecutor = newVal
      }
    }
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
  const baseFarmingItems: FarmingExecItem[] = s.cropCategory === '水稻'
    ? [
        { growthPeriod: '播种期', productionProcess: '土壤准备', taskLink: '整地', minLeafAge: '', maxLeafAge: '', coreStandard: '耕深均匀，无大坷垃', envControlReq: '', planStartDate: '', planEndDate: '', paramStandard: '耕深≥30cm', workMethod: '农机作业', planWorkArea: '', planEquipment: '', execStatus: 'pending_issue', workLeader: '', workExecutor: '', actualCompleteTime: '', execRecordCode: '', remark: '' },
        { growthPeriod: '播种期', productionProcess: '播种作业', taskLink: '播种', minLeafAge: '', maxLeafAge: '', coreStandard: '行距30cm，穴距15cm', envControlReq: '', planStartDate: '', planEndDate: '', paramStandard: '播深3-5cm', workMethod: '农机作业', planWorkArea: '', planEquipment: '', execStatus: 'pending_issue', workLeader: '', workExecutor: '', actualCompleteTime: '', execRecordCode: '', remark: '' },
        { growthPeriod: '分蘖期', productionProcess: '田间管理', taskLink: '追肥', minLeafAge: 3, maxLeafAge: 5, coreStandard: '亩施尿素10kg', envControlReq: '', planStartDate: '', planEndDate: '', paramStandard: '施肥深度10cm', workMethod: '人工作业', planWorkArea: '', planEquipment: '', execStatus: 'pending_issue', workLeader: '', workExecutor: '', actualCompleteTime: '', execRecordCode: '', remark: '' },
        { growthPeriod: '分蘖期', productionProcess: '田间管理', taskLink: '灌溉', minLeafAge: 3, maxLeafAge: 6, coreStandard: '浅水间歇灌溉', envControlReq: '', planStartDate: '', planEndDate: '', paramStandard: '水层3-5cm', workMethod: '智能设备作业', planWorkArea: '', planEquipment: '', execStatus: 'pending_issue', workLeader: '', workExecutor: '', actualCompleteTime: '', execRecordCode: '', remark: '' },
        { growthPeriod: '拔节期', productionProcess: '植保防治', taskLink: '病虫害防治', minLeafAge: 7, maxLeafAge: 9, coreStandard: '及时发现及时防治', envControlReq: '', planStartDate: '', planEndDate: '', paramStandard: '用药浓度0.1%', workMethod: '无人机作业', planWorkArea: '', planEquipment: '', execStatus: 'pending_issue', workLeader: '', workExecutor: '', actualCompleteTime: '', execRecordCode: '', remark: '' },
        { growthPeriod: '抽穗期', productionProcess: '水肥管理', taskLink: '追肥', minLeafAge: 10, maxLeafAge: 12, coreStandard: '穗肥追施', envControlReq: '', planStartDate: '', planEndDate: '', paramStandard: '亩施尿素5kg', workMethod: '人工作业', planWorkArea: '', planEquipment: '', execStatus: 'pending_issue', workLeader: '', workExecutor: '', actualCompleteTime: '', execRecordCode: '', remark: '' },
        { growthPeriod: '灌浆期', productionProcess: '田间管理', taskLink: '灌溉', minLeafAge: 13, maxLeafAge: 15, coreStandard: '干湿交替灌溉', envControlReq: '', planStartDate: '', planEndDate: '', paramStandard: '水层2-3cm', workMethod: '智能设备作业', planWorkArea: '', planEquipment: '', execStatus: 'pending_issue', workLeader: '', workExecutor: '', actualCompleteTime: '', execRecordCode: '', remark: '' },
        { growthPeriod: '成熟期', productionProcess: '收获作业', taskLink: '收获', minLeafAge: 16, maxLeafAge: 18, coreStandard: '适时收获，防止落粒', envControlReq: '', planStartDate: '', planEndDate: '', paramStandard: '含水率≤25%', workMethod: '农机作业', planWorkArea: '', planEquipment: '', execStatus: 'pending_issue', workLeader: '', workExecutor: '', actualCompleteTime: '', execRecordCode: '', remark: '' },
      ]
    : [
        { growthPeriod: '播种期', productionProcess: '土壤准备', taskLink: '整地', minLeafAge: '', maxLeafAge: '', coreStandard: '耕深均匀，土壤细碎', envControlReq: '', planStartDate: '', planEndDate: '', paramStandard: '耕深≥25cm', workMethod: '农机作业', planWorkArea: '', planEquipment: '', execStatus: 'pending_issue', workLeader: '', workExecutor: '', actualCompleteTime: '', execRecordCode: '', remark: '' },
        { growthPeriod: '播种期', productionProcess: '播种作业', taskLink: '播种', minLeafAge: '', maxLeafAge: '', coreStandard: '均匀播种，覆土压实', envControlReq: '', planStartDate: '', planEndDate: '', paramStandard: '播深4-5cm', workMethod: '农机作业', planWorkArea: '', planEquipment: '', execStatus: 'pending_issue', workLeader: '', workExecutor: '', actualCompleteTime: '', execRecordCode: '', remark: '' },
        { growthPeriod: '生长期', productionProcess: '田间管理', taskLink: '追肥', minLeafAge: 2, maxLeafAge: 4, coreStandard: '科学追肥，促进生长', envControlReq: '', planStartDate: '', planEndDate: '', paramStandard: '亩施尿素8kg', workMethod: '人工作业', planWorkArea: '', planEquipment: '', execStatus: 'pending_issue', workLeader: '', workExecutor: '', actualCompleteTime: '', execRecordCode: '', remark: '' },
        { growthPeriod: '生长期', productionProcess: '植保防治', taskLink: '病虫害防治', minLeafAge: 5, maxLeafAge: 7, coreStandard: '综合防治，绿色防控', envControlReq: '', planStartDate: '', planEndDate: '', paramStandard: '用药浓度0.08%', workMethod: '无人机作业', planWorkArea: '', planEquipment: '', execStatus: 'pending_issue', workLeader: '', workExecutor: '', actualCompleteTime: '', execRecordCode: '', remark: '' },
        { growthPeriod: '成熟期', productionProcess: '收获作业', taskLink: '收获', minLeafAge: 10, maxLeafAge: 12, coreStandard: '适时收获，减少损失', envControlReq: '', planStartDate: '', planEndDate: '', paramStandard: '含水率≤20%', workMethod: '农机作业', planWorkArea: '', planEquipment: '', execStatus: 'pending_issue', workLeader: '', workExecutor: '', actualCompleteTime: '', execRecordCode: '', remark: '' },
      ]

  // 设施种植模式填充设施环境管控要求，隐藏叶龄
  if (s.plantingMode === '设施种植') {
    for (const item of baseFarmingItems) {
      item.minLeafAge = ''
      item.maxLeafAge = ''
      if (item.taskLink === '灌溉') item.envControlReq = '温度25-28℃，湿度60-70%'
      if (item.taskLink === '追肥') item.envControlReq = '通风换气2小时后施肥'
      if (item.taskLink === '病虫害防治') item.envControlReq = '密闭熏蒸6小时后通风'
    }
  }

  form.value.farmingItems = baseFarmingItems

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
    growthPeriod: '', productionProcess: '', taskLink: '',
    minLeafAge: '', maxLeafAge: '', coreStandard: '', envControlReq: '',
    planStartDate: '', planEndDate: '', paramStandard: '', workMethod: '',
    planWorkArea: '', planEquipment: '', execStatus: 'pending_issue',
    workLeader: '', workExecutor: '', actualCompleteTime: '', execRecordCode: '',
    remark: '',
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
    plotGlobalSearch.value = ''
    plotNameSearch.value = ''
    plotCodeSearch.value = ''
    syncMapSelections()
  }
})

// ==================== 初始化 ====================
onMounted(() => {
  form.value.planCode = generateCode()
  loadSchemeData()
})
</script>
