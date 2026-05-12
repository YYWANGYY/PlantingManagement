<template>
  <div class="space-y-6">
    <!-- 页面标题 + 操作 -->
    <div class="flex items-center justify-between">
      <div class="flex items-center gap-3">
        <button
          class="inline-flex items-center justify-center rounded-md border border-input bg-background px-3 py-1.5 text-sm font-medium shadow-sm transition-colors hover:bg-muted"
          @click="goBack"
        >
          <ArrowLeft class="mr-1 h-4 w-4" />
          返回
        </button>
        <div>
          <h1 class="text-2xl font-bold tracking-tight">{{ isEdit ? '编辑种植方案' : '新建种植方案' }}</h1>
          <p v-if="isEdit" class="mt-0.5 text-sm text-muted-foreground">
            {{ form.code }} · 版本 {{ form.version }}
          </p>
        </div>
      </div>
      <div class="flex items-center gap-2">
        <button
          class="inline-flex items-center justify-center gap-1.5 rounded-md border border-input bg-background px-4 py-2 text-sm font-medium shadow-sm transition-colors hover:bg-muted"
          :disabled="!canSave"
          @click="handleSave"
        >
          <Save class="h-4 w-4" />
          保存
        </button>
        <button
          class="inline-flex items-center justify-center gap-1.5 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90"
          :disabled="!canSubmit"
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
      <!-- 第1行：方案编码 + 方案名称 -->
      <div class="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <!-- 方案编码 -->
        <div>
          <label class="mb-1.5 block text-sm font-medium">
            方案编码 <span class="text-red-500">*</span>
            <span class="ml-2 text-xs text-muted-foreground font-normal">系统生成</span>
          </label>
          <input
            :value="form.code"
            type="text"
            readonly
            class="h-9 w-full rounded-md border border-input bg-muted px-3 py-1 text-sm text-muted-foreground cursor-not-allowed"
          />
        </div>
        <!-- 方案名称 -->
        <div>
          <label class="mb-1.5 block text-sm font-medium">
            方案名称 <span class="text-red-500">*</span>
            <span class="ml-2 text-xs text-muted-foreground font-normal">系统生成</span>
          </label>
          <input
            :value="form.name"
            type="text"
            readonly
            class="h-9 w-full rounded-md border border-input bg-muted px-3 py-1 text-sm text-muted-foreground cursor-not-allowed"
          />
        </div>
      </div>

      <!-- 第2行：种植模式 + 种植作物大类 + 种植品种 -->
      <div class="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <!-- 种植模式 -->
        <div>
          <label class="mb-1.5 block text-sm font-medium">种植模式 <span class="text-red-500">*</span></label>
          <select
            v-model="form.plantingMode"
            class="h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus:outline-none focus:ring-1 focus:ring-ring"
            @change="onPlantingModeChange"
          >
            <option value="">请选择</option>
            <option value="大田种植">大田种植</option>
            <option value="设施农业种植">设施农业种植</option>
          </select>
        </div>
        <!-- 种植作物大类 -->
        <div>
          <label class="mb-1.5 block text-sm font-medium">种植作物大类 <span class="text-red-500">*</span></label>
          <select
            v-model="form.cropCategory"
            class="h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus:outline-none focus:ring-1 focus:ring-ring"
            :disabled="!form.plantingMode"
            @change="onCropCategoryChange"
          >
            <option value="">请选择</option>
            <option v-for="c in cropCategories" :key="c" :value="c">{{ c }}</option>
          </select>
        </div>
        <!-- 种植品种 -->
        <div>
          <label class="mb-1.5 block text-sm font-medium">种植品种 <span class="text-red-500">*</span></label>
          <select
            v-model="form.cropVariety"
            class="h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus:outline-none focus:ring-1 focus:ring-ring"
            :disabled="!form.cropCategory"
          >
            <option value="">请选择</option>
            <option v-for="v in varietyOptions" :key="v" :value="v">{{ v }}</option>
          </select>
        </div>
      </div>

      <!-- 第3行：所属单位（多选树形） -->
      <div>
        <label class="mb-1.5 block text-sm font-medium">所属单位 <span class="text-red-500">*</span> <span class="text-xs text-muted-foreground font-normal">（支持多选）</span></label>
        <div class="relative" ref="unitDropdownRef">
          <div
            class="min-h-[36px] flex flex-wrap items-center gap-1 rounded-md border border-input bg-transparent px-3 py-1 text-sm cursor-pointer transition-colors hover:border-primary/50 focus:outline-none focus:ring-1 focus:ring-ring"
            @click="showUnitDropdown = !showUnitDropdown"
          >
            <span v-if="form.units.length === 0" class="text-muted-foreground">请选择所属单位</span>
            <template v-else>
              <span
                v-for="u in form.units"
                :key="u"
                class="inline-flex items-center gap-1 rounded bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary"
              >
                {{ u }}
                <X class="h-3 w-3 cursor-pointer hover:text-red-500" @click.stop="removeUnit(u)" />
              </span>
            </template>
          </div>
          <!-- 树形下拉面板 -->
          <div
            v-if="showUnitDropdown"
            class="absolute z-50 mt-1 w-full rounded-md border bg-background shadow-lg"
          >
            <div class="p-2">
              <div v-for="org in orgTree" :key="org.label" class="mb-2">
                <div class="flex items-center gap-2 mb-1">
                  <button class="text-sm font-medium text-foreground hover:text-primary" @click="toggleOrgExpand(org.label)">
                    <ChevronRight :class="['h-3.5 w-3.5 inline-block transition-transform', expandedOrgs.includes(org.label) ? 'rotate-90' : '']" />
                  </button>
                  <label class="flex items-center gap-2 cursor-pointer text-sm font-medium">
                    <input
                      type="checkbox"
                      :checked="isOrgAllSelected(org)"
                      :indeterminate="isOrgPartialSelected(org)"
                      class="rounded border-input"
                      @change="toggleOrgAll(org)"
                    />
                    {{ org.label }}
                  </label>
                </div>
                <div v-if="expandedOrgs.includes(org.label)" class="ml-7 space-y-1">
                  <label
                    v-for="child in org.children"
                    :key="child"
                    class="flex items-center gap-2 cursor-pointer text-sm text-muted-foreground hover:text-foreground"
                  >
                    <input
                      type="checkbox"
                      :checked="form.units.includes(child)"
                      class="rounded border-input"
                      @change="toggleUnit(child)"
                    />
                    {{ child }}
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 第4行：适用区域 -->
      <div>
        <label class="mb-1.5 block text-sm font-medium">适用区域 <span class="text-red-500">*</span></label>
        <textarea
          v-model="form.applicableArea"
          rows="3"
          placeholder="请输入适用区域描述"
          class="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm transition-colors focus:outline-none focus:ring-1 focus:ring-ring resize-none"
        />
      </div>

      <!-- 第5行：全生育周期总天数 + 方案版本号 -->
      <div class="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <!-- 全生育周期总天数 -->
        <div>
          <label class="mb-1.5 block text-sm font-medium">
            全生育周期总天数 <span class="text-red-500">*</span>
            <span class="ml-2 text-xs text-muted-foreground font-normal">自动计算（农事作业生育期去重求和）</span>
          </label>
          <input
            :value="totalGrowthDays"
            type="text"
            readonly
            class="h-9 w-full rounded-md border border-input bg-muted px-3 py-1 text-sm text-muted-foreground cursor-not-allowed"
          />
          <p class="mt-1 text-xs text-muted-foreground">= 农事作业标准明细表中所有生育时期天数去重求和</p>
        </div>
        <!-- 方案版本号 -->
        <div>
          <label class="mb-1.5 block text-sm font-medium">
            方案版本号 <span class="text-red-500">*</span>
          </label>
          <input
            :value="form.version"
            type="text"
            readonly
            class="h-9 w-full rounded-md border border-input bg-muted px-3 py-1 text-sm text-muted-foreground cursor-not-allowed"
          />
          <p class="mt-1 text-xs text-muted-foreground">初始 v1.0，修改完成审批后自动迭代</p>
        </div>
      </div>

      <!-- 第6行：编制人 + 编制时间 -->
      <div class="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div>
          <label class="mb-1.5 block text-sm font-medium">编制人 <span class="text-red-500">*</span> <span class="text-xs text-muted-foreground font-normal">自动代入</span></label>
          <input
            :value="form.author"
            type="text"
            readonly
            class="h-9 w-full rounded-md border border-input bg-muted px-3 py-1 text-sm text-muted-foreground cursor-not-allowed"
          />
        </div>
        <div>
          <label class="mb-1.5 block text-sm font-medium">编制时间 <span class="text-red-500">*</span> <span class="text-xs text-muted-foreground font-normal">自动代入</span></label>
          <input
            :value="form.compiledAt"
            type="text"
            readonly
            class="h-9 w-full rounded-md border border-input bg-muted px-3 py-1 text-sm text-muted-foreground cursor-not-allowed"
          />
        </div>
      </div>

      <!-- 第7行：审批人 + 审批完成时间 -->
      <div class="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div>
          <label class="mb-1.5 block text-sm font-medium">审批人 <span class="text-xs text-muted-foreground font-normal">审批完成时自动回填</span></label>
          <input
            :value="form.approver"
            type="text"
            readonly
            class="h-9 w-full rounded-md border border-input bg-muted px-3 py-1 text-sm text-muted-foreground cursor-not-allowed"
            placeholder="审批完成后自动填充"
          />
        </div>
        <div>
          <label class="mb-1.5 block text-sm font-medium">审批完成时间 <span class="text-xs text-muted-foreground font-normal">审批完成时自动回填</span></label>
          <input
            :value="form.approvedAt"
            type="text"
            readonly
            class="h-9 w-full rounded-md border border-input bg-muted px-3 py-1 text-sm text-muted-foreground cursor-not-allowed"
            placeholder="审批完成后自动填充"
          />
        </div>
      </div>

      <!-- 第8行：审批状态 + 生效状态 -->
      <div class="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div>
          <label class="mb-1.5 block text-sm font-medium">审批状态</label>
          <div class="flex items-center h-9">
            <span
              class="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium"
              :class="approvalStatusClass"
            >
              {{ approvalStatusText }}
            </span>
          </div>
        </div>
        <div>
          <label class="mb-1.5 block text-sm font-medium">
            生效状态
            <span class="text-xs text-muted-foreground font-normal">自动计算（审批完成 且 生效时间已到达）</span>
          </label>
          <div class="flex items-center h-9">
            <span
              class="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium"
              :class="form.effectiveStatus === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'"
            >
              {{ form.effectiveStatus === 'active' ? '已生效' : '未生效' }}
            </span>
          </div>
        </div>
      </div>

      <!-- 第9行：生效时间 -->
      <div class="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div>
          <label class="mb-1.5 block text-sm font-medium">生效时间 <span class="text-red-500">*</span></label>
          <input
            v-model="form.effectiveTime"
            type="date"
            class="h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus:outline-none focus:ring-1 focus:ring-ring"
          />
        </div>
      </div>

      <!-- 第10行：备注 -->
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

    <!-- Tab 2: 农事作业标准明细表 -->
    <div v-if="activeTab === 'farming'" class="space-y-4">
      <div class="flex items-center justify-between">
        <p class="text-sm text-muted-foreground">定义种植过程中各阶段的农事作业标准</p>
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
          <table class="w-full text-sm" style="min-width:1600px">
            <thead>
              <tr class="border-b bg-muted/50">
                <th class="h-10 px-2 text-center font-medium text-muted-foreground" style="width:40px">序号</th>
                <th class="h-10 px-2 text-left font-medium text-muted-foreground" style="width:100px">生育时期<span class="text-red-500">*</span></th>
                <th class="h-10 px-2 text-left font-medium text-muted-foreground" style="width:100px">生产流程<span class="text-red-500">*</span></th>
                <th class="h-10 px-2 text-left font-medium text-muted-foreground" style="width:110px">作业环节<span class="text-red-500">*</span></th>
                <th class="h-10 px-2 text-left font-medium text-muted-foreground" style="width:110px">农事作业<br/>生育期天数</th>
                <th v-if="form.plantingMode === '大田种植'" class="h-10 px-2 text-left font-medium text-muted-foreground" style="width:80px">最小叶龄</th>
                <th v-if="form.plantingMode === '大田种植'" class="h-10 px-2 text-left font-medium text-muted-foreground" style="width:80px">最大叶龄</th>
                <th class="h-10 px-2 text-left font-medium text-muted-foreground" style="width:150px">核心农事<br/>操作标准</th>
                <th v-if="form.plantingMode === '设施农业种植'" class="h-10 px-2 text-left font-medium text-muted-foreground" style="width:150px">设施环境<br/>管控要求</th>
                <th class="h-10 px-2 text-left font-medium text-muted-foreground" style="width:130px">作业参数标准</th>
                <th class="h-10 px-2 text-left font-medium text-muted-foreground" style="width:110px">作业方式<span class="text-red-500">*</span></th>
                <th class="h-10 px-2 text-center font-medium text-muted-foreground" style="width:80px">播种类<br/>操作<span class="text-red-500">*</span></th>
                <th class="h-10 px-2 text-center font-medium text-muted-foreground" style="width:80px">施肥类<br/>操作<span class="text-red-500">*</span></th>
                <th class="h-10 px-2 text-center font-medium text-muted-foreground" style="width:80px">用药类<br/>操作<span class="text-red-500">*</span></th>
                <th class="h-10 px-2 text-left font-medium text-muted-foreground" style="width:120px">备注</th>
                <th class="h-10 px-2 text-center font-medium text-muted-foreground" style="width:50px">操作</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(row, idx) in form.farmingItems" :key="idx" class="border-b hover:bg-muted/30">
                <td class="h-12 px-2 text-center text-muted-foreground">{{ idx + 1 }}</td>
                <td class="h-12 px-2">
                  <select v-model="row.growthPeriod" class="h-8 w-full rounded border border-input bg-transparent px-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-ring">
                    <option value="">请选择</option>
                    <option v-for="p in growthPeriodOptions" :key="p" :value="p">{{ p }}</option>
                  </select>
                </td>
                <td class="h-12 px-2">
                  <select v-model="row.process" class="h-8 w-full rounded border border-input bg-transparent px-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-ring">
                    <option value="">请选择</option>
                    <option v-for="p in processOptions" :key="p" :value="p">{{ p }}</option>
                  </select>
                </td>
                <td class="h-12 px-2">
                  <select v-model="row.taskLink" class="h-8 w-full rounded border border-input bg-transparent px-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-ring">
                    <option value="">请选择</option>
                    <option v-for="t in taskLinkOptions" :key="t" :value="t">{{ t }}</option>
                  </select>
                </td>
                <td class="h-12 px-2">
                  <input v-model.number="row.farmingDays" type="number" min="0" class="h-8 w-full rounded border border-input bg-transparent px-2 text-sm focus:outline-none focus:ring-1 focus:ring-ring" placeholder="天数" />
                </td>
                <td v-if="form.plantingMode === '大田种植'" class="h-12 px-2">
                  <input v-model.number="row.minLeafAge" type="number" min="0" class="h-8 w-full rounded border border-input bg-transparent px-2 text-sm focus:outline-none focus:ring-1 focus:ring-ring" placeholder="选填" />
                </td>
                <td v-if="form.plantingMode === '大田种植'" class="h-12 px-2">
                  <input v-model.number="row.maxLeafAge" type="number" min="0" class="h-8 w-full rounded border border-input bg-transparent px-2 text-sm focus:outline-none focus:ring-1 focus:ring-ring" placeholder="选填" />
                </td>
                <td class="h-12 px-2">
                  <input v-model="row.coreStandard" class="h-8 w-full rounded border border-input bg-transparent px-2 text-sm focus:outline-none focus:ring-1 focus:ring-ring" placeholder="操作标准" />
                </td>
                <td v-if="form.plantingMode === '设施农业种植'" class="h-12 px-2">
                  <input v-model="row.envRequirement" class="h-8 w-full rounded border border-input bg-transparent px-2 text-sm focus:outline-none focus:ring-1 focus:ring-ring" placeholder="环境管控要求" />
                </td>
                <td class="h-12 px-2">
                  <input v-model="row.paramStandard" class="h-8 w-full rounded border border-input bg-transparent px-2 text-sm focus:outline-none focus:ring-1 focus:ring-ring" placeholder="选填" />
                </td>
                <td class="h-12 px-2">
                  <select v-model="row.workMethod" class="h-8 w-full rounded border border-input bg-transparent px-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-ring">
                    <option value="">请选择</option>
                    <option v-for="m in workMethodOptions" :key="m" :value="m">{{ m }}</option>
                  </select>
                </td>
                <td class="h-12 px-2 text-center">
                  <select v-model="row.isSowing" class="h-8 rounded border border-input bg-transparent px-1 text-sm focus:outline-none focus:ring-1 focus:ring-ring">
                    <option value="否">否</option>
                    <option value="是">是</option>
                  </select>
                </td>
                <td class="h-12 px-2 text-center">
                  <select v-model="row.isFertilizing" class="h-8 rounded border border-input bg-transparent px-1 text-sm focus:outline-none focus:ring-1 focus:ring-ring">
                    <option value="否">否</option>
                    <option value="是">是</option>
                  </select>
                </td>
                <td class="h-12 px-2 text-center">
                  <select v-model="row.isMedicating" class="h-8 rounded border border-input bg-transparent px-1 text-sm focus:outline-none focus:ring-1 focus:ring-ring">
                    <option value="否">否</option>
                    <option value="是">是</option>
                  </select>
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
                <td :colspan="farmingColspan" class="p-6 text-center text-muted-foreground">暂无明细，点击"添加明细"新增</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <!-- 预计生育期天数汇总 -->
      <div v-if="form.farmingItems.length > 0" class="flex items-center gap-4 rounded-lg border bg-muted/30 px-4 py-3">
        <span class="text-sm font-medium">预计生育期天数：</span>
        <span class="text-sm font-bold text-primary">{{ totalGrowthDays }} 天</span>
        <span class="text-xs text-muted-foreground">（将同一生育时期的农事作业生育期天数汇总）</span>
      </div>
    </div>

    <!-- Tab 3: 农资投入标准明细表 -->
    <div v-if="activeTab === 'material'" class="space-y-4">
      <div class="flex items-center justify-between">
        <p class="text-sm text-muted-foreground">定义种植过程中各类农资的投入标准</p>
        <button
          class="inline-flex items-center justify-center gap-1.5 rounded-md bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90"
          @click="addMaterialRow"
        >
          <Plus class="h-3.5 w-3.5" />
          添加明细
        </button>
      </div>
      <div class="rounded-lg border">
        <div class="overflow-auto">
          <table class="w-full text-sm">
            <thead>
              <tr class="border-b bg-muted/50">
                <th class="h-10 px-3 text-left font-medium text-muted-foreground" style="width:50px">序号</th>
                <th class="h-10 px-3 text-left font-medium text-muted-foreground">农资大类</th>
                <th class="h-10 px-3 text-left font-medium text-muted-foreground">农资品类</th>
                <th class="h-10 px-3 text-left font-medium text-muted-foreground">规格型号</th>
                <th class="h-10 px-3 text-left font-medium text-muted-foreground">计量单位</th>
                <th class="h-10 px-3 text-right font-medium text-muted-foreground">亩用量</th>
                <th class="h-10 px-3 text-right font-medium text-muted-foreground">总量</th>
                <th class="h-10 px-3 text-right font-medium text-muted-foreground">单价(元)</th>
                <th class="h-10 px-3 text-right font-medium text-muted-foreground">预算(元)</th>
                <th class="h-10 px-3 text-left font-medium text-muted-foreground">用途</th>
                <th class="h-10 px-3 text-center font-medium text-muted-foreground" style="width:60px">操作</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(row, idx) in form.materialItems" :key="idx" class="border-b">
                <td class="p-2 align-middle text-muted-foreground">{{ idx + 1 }}</td>
                <td class="p-2 align-middle">
                  <select v-model="row.category" class="h-8 w-full rounded border border-input bg-transparent px-2 text-sm focus:outline-none focus:ring-1 focus:ring-ring" @change="row.type = ''">
                    <option value="">选择</option>
                    <option value="肥料">肥料</option>
                    <option value="农药">农药</option>
                    <option value="种子">种子</option>
                    <option value="农膜">农膜</option>
                    <option value="农机">农机</option>
                  </select>
                </td>
                <td class="p-2 align-middle">
                  <input v-model="row.type" class="h-8 w-full rounded border border-input bg-transparent px-2 text-sm focus:outline-none focus:ring-1 focus:ring-ring" placeholder="如 尿素" />
                </td>
                <td class="p-2 align-middle">
                  <input v-model="row.spec" class="h-8 w-full rounded border border-input bg-transparent px-2 text-sm focus:outline-none focus:ring-1 focus:ring-ring" placeholder="如 46%含氮量" />
                </td>
                <td class="p-2 align-middle">
                  <select v-model="row.unit" class="h-8 w-full rounded border border-input bg-transparent px-2 text-sm focus:outline-none focus:ring-1 focus:ring-ring">
                    <option value="">选择</option>
                    <option value="kg">kg</option>
                    <option value="L">L</option>
                    <option value="袋">袋</option>
                    <option value="亩">亩</option>
                    <option value="吨">吨</option>
                  </select>
                </td>
                <td class="p-2 align-middle">
                  <input v-model.number="row.perMu" type="number" min="0" step="0.1" class="h-8 w-16 rounded border border-input bg-transparent px-2 text-sm text-right focus:outline-none focus:ring-1 focus:ring-ring" placeholder="0" @input="calcMaterialTotal(idx)" />
                </td>
                <td class="p-2 align-middle text-right font-medium">{{ row.total }}</td>
                <td class="p-2 align-middle">
                  <input v-model.number="row.price" type="number" min="0" step="0.01" class="h-8 w-20 rounded border border-input bg-transparent px-2 text-sm text-right focus:outline-none focus:ring-1 focus:ring-ring" placeholder="0" @input="calcMaterialTotal(idx)" />
                </td>
                <td class="p-2 align-middle text-right font-medium text-primary">{{ row.budget }}</td>
                <td class="p-2 align-middle">
                  <input v-model="row.purpose" class="h-8 w-full rounded border border-input bg-transparent px-2 text-sm focus:outline-none focus:ring-1 focus:ring-ring" placeholder="如 基肥" />
                </td>
                <td class="p-2 align-middle text-center">
                  <button class="text-red-500 hover:text-red-700" @click="removeMaterialRow(idx)">
                    <Trash2 class="h-4 w-4" />
                  </button>
                </td>
              </tr>
              <tr v-if="form.materialItems.length === 0">
                <td colspan="11" class="p-6 text-center text-muted-foreground">暂无明细，点击"添加明细"新增</td>
              </tr>
              <tr v-if="form.materialItems.length > 0" class="bg-muted/30 font-medium">
                <td colspan="8" class="p-2 text-right">合计</td>
                <td class="p-2 text-right text-primary">{{ materialBudgetTotal }}</td>
                <td colspan="2"></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ArrowLeft, Save, Send, Plus, Trash2, X, ChevronRight } from 'lucide-vue-next'
import { showToast } from '@/lib/toast'

// ==================== 路由 ====================
const route = useRoute()
const router = useRouter()

const isEdit = computed(() => !!route.query.id)
const editId = computed(() => route.query.id as string || '')
const editVersion = computed(() => Number(route.query.version) || 1)

// ==================== 组织树 ====================
const orgTree = [
  { label: '哈尔滨公司', children: ['松北农场', '呼兰农场', '阿城农场', '双城分场', '五常分场'] },
  { label: '沈阳公司', children: ['苏家屯农场', '新民农场', '辽中分场', '法库分场'] },
]

// ==================== 作物数据 ====================
const cropCategoryMap: Record<string, string[]> = {
  '粮食作物': ['水稻-松粳22', '小麦-济麦22', '玉米-郑单958', '大豆-中黄13'],
  '经济作物': ['棉花-鲁棉研28', '油菜-秦油10号', '花生-花育33'],
  '园艺作物': ['茶叶-龙井43', '苹果-红富士', '番茄-中杂9号'],
  '饲草作物': ['紫花苜蓿-阿尔冈金', '饲用玉米-雅玉8号'],
}
const cropCategories = computed(() => {
  if (!form.value.plantingMode) return Object.keys(cropCategoryMap)
  return Object.keys(cropCategoryMap)
})
const varietyOptions = computed(() => {
  if (!form.value.cropCategory) return []
  return cropCategoryMap[form.value.cropCategory] || []
})

// ==================== 农事作业选项数据 ====================
const growthPeriodOptions = ['播种期', '出苗期', '分蘖期', '拔节期', '抽穗期', '开花期', '灌浆期', '成熟期', '收获期', '苗期', '蕾期', '花铃期', '吐絮期']
const processOptions = ['土壤准备', '播种作业', '田间管理', '植保防治', '水肥管理', '收获作业', '育苗管理', '移栽定植', '整枝修剪', '花果管理']
const taskLinkOptions = ['整地', '播种', '追肥', '灌溉', '病虫害防治', '除草', '收获', '育苗', '移栽', '修剪', '疏花疏果', '套袋', '施基肥', '中耕', '培土']
const workMethodOptions = ['农机作业', '无人机作业', '人工作业', '智能设备作业']

// ==================== 选项卡 ====================
const tabs = [
  { key: 'basic', label: '基本信息' },
  { key: 'farming', label: '农事作业标准明细表' },
  { key: 'material', label: '农资投入标准明细表' },
]
const activeTab = ref('basic')

// ==================== 表单数据 ====================
interface FarmingItem {
  growthPeriod: string       // 生育时期
  process: string            // 生产流程
  taskLink: string           // 作业环节
  farmingDays: number | ''   // 农事作业生育期天数
  minLeafAge: number | ''    // 最小叶龄（大田种植）
  maxLeafAge: number | ''    // 最大叶龄（大田种植）
  coreStandard: string       // 核心农事操作标准
  envRequirement: string     // 设施环境管控要求（设施种植）
  paramStandard: string      // 作业参数标准
  workMethod: string         // 作业方式
  isSowing: string           // 播种类操作
  isFertilizing: string      // 施肥类操作
  isMedicating: string       // 用药类操作
  remark: string             // 备注
}

interface MaterialItem {
  category: string
  type: string
  spec: string
  unit: string
  perMu: number | ''
  total: number
  price: number | ''
  budget: number
  purpose: string
}

type ApprovalStatus = 'draft' | 'review' | 'rejected' | 'revoked' | 'forced_end' | 'completed'
type EffectiveStatus = 'inactive' | 'active'

interface SchemeForm {
  code: string
  name: string
  plantingMode: string
  cropCategory: string
  cropVariety: string
  units: string[]
  applicableArea: string
  version: string
  author: string
  compiledAt: string
  approver: string
  approvedAt: string
  approvalStatus: ApprovalStatus
  effectiveTime: string
  effectiveStatus: EffectiveStatus
  remark: string
  farmingItems: FarmingItem[]
  materialItems: MaterialItem[]
}

const form = ref<SchemeForm>({
  code: '',
  name: '',
  plantingMode: '',
  cropCategory: '',
  cropVariety: '',
  units: [],
  applicableArea: '',
  version: isEdit.value ? `v${editVersion.value}.0` : 'v1.0',
  author: '当前用户',
  compiledAt: new Date().toLocaleDateString('zh-CN'),
  approver: '',
  approvedAt: '',
  approvalStatus: 'draft',
  effectiveTime: '',
  effectiveStatus: 'inactive',
  remark: '',
  farmingItems: isEdit.value ? [] : [
    { growthPeriod: '播种期', process: '土壤准备', taskLink: '整地', farmingDays: 5, minLeafAge: '', maxLeafAge: '', coreStandard: '耕深均匀，无大坷垃', envRequirement: '', paramStandard: '耕深≥30cm', workMethod: '农机作业', isSowing: '否', isFertilizing: '否', isMedicating: '否', remark: '避免雨天作业' },
    { growthPeriod: '播种期', process: '播种作业', taskLink: '播种', farmingDays: 3, minLeafAge: '', maxLeafAge: '', coreStandard: '行距30cm，穴距15cm', envRequirement: '', paramStandard: '播深3-5cm', workMethod: '农机作业', isSowing: '是', isFertilizing: '否', isMedicating: '否', remark: '播后及时覆土镇压' },
    { growthPeriod: '生长期', process: '田间管理', taskLink: '追肥', farmingDays: 7, minLeafAge: 3, maxLeafAge: 5, coreStandard: '亩施尿素10kg', envRequirement: '', paramStandard: '施肥深度10cm', workMethod: '人工作业', isSowing: '否', isFertilizing: '是', isMedicating: '否', remark: '结合灌水进行' },
    { growthPeriod: '生长期', process: '植保防治', taskLink: '病虫害防治', farmingDays: 3, minLeafAge: 5, maxLeafAge: 8, coreStandard: '及时发现及时防治', envRequirement: '', paramStandard: '用药浓度0.1%', workMethod: '无人机作业', isSowing: '否', isFertilizing: '否', isMedicating: '是', remark: '注意安全间隔期' },
  ],
  materialItems: isEdit.value ? [] : [
    { category: '肥料', type: '尿素', spec: '46%含氮量', unit: 'kg', perMu: 10, total: 0, price: 2.5, budget: 0, purpose: '追肥' },
    { category: '肥料', type: '复合肥', spec: '15-15-15', unit: 'kg', perMu: 25, total: 0, price: 3.2, budget: 0, purpose: '基肥' },
    { category: '农药', type: '草甘膦', spec: '41%水剂', unit: 'L', perMu: 0.5, total: 0, price: 15, budget: 0, purpose: '除草' },
    { category: '种子', type: '水稻种子', spec: '松粳22', unit: 'kg', perMu: 4, total: 0, price: 8, budget: 0, purpose: '播种' },
  ],
})

// ==================== 方案编码生成 ====================
function generateCode(): string {
  const prefix = 'FA'
  const year = new Date().getFullYear()
  const seq = String(Math.floor(Math.random() * 9000) + 1000)
  return `${prefix}${year}${seq}`
}

onMounted(() => {
  if (!isEdit.value) {
    form.value.code = generateCode()
  } else {
    form.value.code = editId.value
  }
  form.value.materialItems.forEach((_, idx) => calcMaterialTotal(idx))
})

// ==================== 方案名称自动生成 ====================
const generatedName = computed(() => {
  const mode = form.value.plantingMode
  const category = form.value.cropCategory
  const variety = form.value.cropVariety
  const area = form.value.applicableArea
  if (!mode && !category && !variety && !area) return ''
  const parts: string[] = []
  if (mode) parts.push(mode)
  if (category) parts.push(category)
  if (variety) parts.push(variety)
  if (area) parts.push(area)
  return parts.join('') + '种植方案'
})

// 当依赖字段变化时自动更新方案名称
function updateName(): void {
  if (generatedName.value) {
    form.value.name = generatedName.value
  }
}

function onPlantingModeChange(): void {
  form.value.cropCategory = ''
  form.value.cropVariety = ''
  updateName()
}

function onCropCategoryChange(): void {
  form.value.cropVariety = ''
  updateName()
}

// ==================== 所属单位多选 ====================
const showUnitDropdown = ref(false)
const expandedOrgs = ref<string[]>([])
const unitDropdownRef = ref<HTMLElement | null>(null)

function toggleOrgExpand(label: string): void {
  const idx = expandedOrgs.value.indexOf(label)
  if (idx >= 0) expandedOrgs.value.splice(idx, 1)
  else expandedOrgs.value.push(label)
}

function isOrgAllSelected(org: { label: string; children: string[] }): boolean {
  return org.children.every((c: string) => form.value.units.includes(c))
}

function isOrgPartialSelected(org: { label: string; children: string[] }): boolean {
  const selected = org.children.filter((c: string) => form.value.units.includes(c))
  return selected.length > 0 && selected.length < org.children.length
}

function toggleOrgAll(org: { label: string; children: string[] }): void {
  if (isOrgAllSelected(org)) {
    form.value.units = form.value.units.filter((u: string) => !org.children.includes(u))
  } else {
    const toAdd = org.children.filter((c: string) => !form.value.units.includes(c))
    form.value.units.push(...toAdd)
  }
}

function toggleUnit(unit: string): void {
  const idx = form.value.units.indexOf(unit)
  if (idx >= 0) form.value.units.splice(idx, 1)
  else form.value.units.push(unit)
}

function removeUnit(unit: string): void {
  const idx = form.value.units.indexOf(unit)
  if (idx >= 0) form.value.units.splice(idx, 1)
}

// 点击外部关闭下拉
function handleClickOutsideUnit(e: MouseEvent): void {
  if (unitDropdownRef.value && !unitDropdownRef.value.contains(e.target as Node)) {
    showUnitDropdown.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutsideUnit)
})

onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutsideUnit)
})

// ==================== 全生育周期总天数 ====================
const totalGrowthDays = computed(() => {
  // 预计生育期天数：将同一生育时期的农事作业生育期天数汇总（去重生育时期）
  const periodMap = new Map<string, number>()
  form.value.farmingItems.forEach(item => {
    const period = item.growthPeriod.trim()
    const days = Number(item.farmingDays) || 0
    if (period) {
      periodMap.set(period, (periodMap.get(period) || 0) + days)
    }
  })
  if (periodMap.size === 0) return 0
  return Array.from(periodMap.values()).reduce((a, b) => a + b, 0)
})

// 农事作业表动态列数（根据种植模式显示/隐藏列）
const farmingColspan = computed(() => {
  let cols = 13 // 基础列：序号+生育时期+生产流程+作业环节+农事作业天数+核心标准+参数标准+作业方式+播种+施肥+用药+备注+操作
  if (form.value.plantingMode === '大田种植') cols += 2 // 最小叶龄+最大叶龄
  if (form.value.plantingMode === '设施农业种植') cols += 1 // 设施环境管控要求
  return cols
})

// ==================== 审批状态显示 ====================
const approvalStatusMap: Record<ApprovalStatus, { text: string; class: string }> = {
  draft: { text: '草稿', class: 'bg-gray-100 text-gray-600' },
  review: { text: '审批中', class: 'bg-blue-100 text-blue-700' },
  rejected: { text: '已退回', class: 'bg-red-100 text-red-700' },
  revoked: { text: '已撤回', class: 'bg-orange-100 text-orange-700' },
  forced_end: { text: '强制结束', class: 'bg-purple-100 text-purple-700' },
  completed: { text: '已完成', class: 'bg-green-100 text-green-700' },
}

const approvalStatusText = computed(() => approvalStatusMap[form.value.approvalStatus].text)
const approvalStatusClass = computed(() => approvalStatusMap[form.value.approvalStatus].class)

// ==================== 农事作业操作 ====================
function addFarmingRow(): void {
  form.value.farmingItems.push({
    growthPeriod: '', process: '', taskLink: '', farmingDays: '',
    minLeafAge: '', maxLeafAge: '', coreStandard: '', envRequirement: '',
    paramStandard: '', workMethod: '', isSowing: '否', isFertilizing: '否',
    isMedicating: '否', remark: '',
  })
}

function removeFarmingRow(idx: number): void {
  form.value.farmingItems.splice(idx, 1)
}

// ==================== 农资投入操作 ====================
function addMaterialRow(): void {
  form.value.materialItems.push({ category: '', type: '', spec: '', unit: '', perMu: '', total: 0, price: '', budget: 0, purpose: '' })
}

function removeMaterialRow(idx: number): void {
  form.value.materialItems.splice(idx, 1)
}

function calcMaterialTotal(idx: number): void {
  const row = form.value.materialItems[idx]
  const perMu = Number(row.perMu) || 0
  const price = Number(row.price) || 0
  row.total = Math.round(perMu * 100) / 100
  row.budget = Math.round(row.total * price * 100) / 100
}

const materialBudgetTotal = computed(() => {
  return form.value.materialItems.reduce((sum, row) => sum + (row.budget || 0), 0).toFixed(2)
})

// ==================== 表单验证 ====================
const canSave = computed(() => {
  return form.value.plantingMode.trim() !== '' ||
    form.value.cropCategory.trim() !== '' ||
    form.value.applicableArea.trim() !== ''
})

const canSubmit = computed(() => {
  const f = form.value
  return (
    f.plantingMode !== '' &&
    f.cropCategory !== '' &&
    f.cropVariety !== '' &&
    f.units.length > 0 &&
    f.applicableArea.trim() !== '' &&
    f.effectiveTime !== '' &&
    f.farmingItems.length > 0 &&
    f.materialItems.length > 0
  )
})

// ==================== 保存与发起 ====================
function handleSave(): void {
  if (!canSave.value) return
  form.value.materialItems.forEach((_, idx) => calcMaterialTotal(idx))
  form.value.approvalStatus = 'draft'
  showToast({ message: `方案已保存${isEdit.value ? '（版本 ' + form.value.version + '）' : ''}`, type: 'success' })
}

function handleSubmit(): void {
  if (!canSubmit.value) {
    showToast({ message: '请填写完整的方案信息后再发起流程', type: 'warning' })
    return
  }
  form.value.materialItems.forEach((_, idx) => calcMaterialTotal(idx))
  form.value.approvalStatus = 'review'

  // 找出所属单位对应的区域公司审批人
  let approverUnit = ''
  for (const org of orgTree) {
    if (org.children.some(c => form.value.units.includes(c))) {
      approverUnit = org.label
      break
    }
  }
  showToast({ message: `已发送至：${approverUnit}负责人进行审批（审批人：张三、李四）`, type: 'success' })
}

function goBack(): void {
  router.push('/planting-plan')
}
</script>
