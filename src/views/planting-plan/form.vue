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
            <option v-for="c in cropMajors" :key="c.code" :value="c.name">{{ c.name }}</option>
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
                  <select v-model="row.productionProcess" class="h-8 w-full rounded border border-input bg-transparent px-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-ring">
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
                  <select v-if="coreStandardOptions.length > 0" v-model="row.coreStandard" class="h-8 w-full rounded border border-input bg-transparent px-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-ring">
                    <option value="">请选择</option>
                    <option v-for="s in coreStandardOptions" :key="s" :value="s">{{ s }}</option>
                  </select>
                  <input v-else v-model="row.coreStandard" class="h-8 w-full rounded border border-input bg-transparent px-2 text-sm focus:outline-none focus:ring-1 focus:ring-ring" placeholder="操作标准" />
                </td>
                <td v-if="form.plantingMode === '设施农业种植'" class="h-12 px-2">
                  <select v-if="envRequirementOptions.length > 0" v-model="row.envRequirement" class="h-8 w-full rounded border border-input bg-transparent px-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-ring">
                    <option value="">请选择</option>
                    <option v-for="e in envRequirementOptions" :key="e" :value="e">{{ e }}</option>
                  </select>
                  <input v-else v-model="row.envRequirement" class="h-8 w-full rounded border border-input bg-transparent px-2 text-sm focus:outline-none focus:ring-1 focus:ring-ring" placeholder="环境管控要求" />
                </td>
                <td class="h-12 px-2">
                  <select v-if="paramStandardOptions.length > 0" v-model="row.paramStandard" class="h-8 w-full rounded border border-input bg-transparent px-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-ring">
                    <option value="">请选择</option>
                    <option v-for="p in paramStandardOptions" :key="p" :value="p">{{ p }}</option>
                  </select>
                  <input v-else v-model="row.paramStandard" class="h-8 w-full rounded border border-input bg-transparent px-2 text-sm focus:outline-none focus:ring-1 focus:ring-ring" placeholder="选填" />
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
                <th class="h-10 px-2 text-left font-medium text-muted-foreground" style="width:40px">序号</th>
                <th class="h-10 px-2 text-left font-medium text-muted-foreground" style="min-width:100px">生育时期</th>
                <th class="h-10 px-2 text-left font-medium text-muted-foreground" style="min-width:100px">生产流程</th>
                <th class="h-10 px-2 text-left font-medium text-muted-foreground" style="min-width:100px">作业环节</th>
                <th class="h-10 px-2 text-left font-medium text-muted-foreground" style="min-width:90px">农资大类</th>
                <th class="h-10 px-2 text-left font-medium text-muted-foreground" style="min-width:90px">农资品类</th>
                <th class="h-10 px-2 text-left font-medium text-muted-foreground" style="min-width:120px">有效成分/规格</th>
                <th class="h-10 px-2 text-left font-medium text-muted-foreground" style="min-width:80px">标准用量 <span class="text-red-500">*</span></th>
                <th class="h-10 px-2 text-left font-medium text-muted-foreground" style="min-width:70px">计量单位 <span class="text-red-500">*</span></th>
                <th class="h-10 px-2 text-left font-medium text-muted-foreground" style="min-width:80px">施用方式 <span class="text-red-500">*</span></th>
                <th class="h-10 px-2 text-left font-medium text-muted-foreground" style="min-width:90px">安全间隔期(天)</th>
                <th class="h-10 px-2 text-left font-medium text-muted-foreground" style="min-width:100px">备注</th>
                <th class="h-10 px-2 text-center font-medium text-muted-foreground" style="width:50px">操作</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(row, idx) in form.materialItems" :key="idx" class="border-b hover:bg-muted/30">
                <td class="px-2 py-1.5 align-middle text-muted-foreground">{{ idx + 1 }}</td>
                <!-- 生育时期 -->
                <td class="px-2 py-1.5 align-middle">
                  <select v-model="row.growthPeriod" class="h-8 w-full rounded border border-input bg-transparent px-2 text-sm focus:outline-none focus:ring-1 focus:ring-ring" @change="onMaterialGrowthPeriodChange(idx)">
                    <option value="">选择</option>
                    <option v-for="p in materialGrowthPeriods" :key="p" :value="p">{{ p }}</option>
                  </select>
                </td>
                <!-- 生产流程 -->
                <td class="px-2 py-1.5 align-middle">
                  <select v-model="row.productionProcess" class="h-8 w-full rounded border border-input bg-transparent px-2 text-sm focus:outline-none focus:ring-1 focus:ring-ring" :disabled="!row.growthPeriod" @change="onMaterialProcessChange(idx)">
                    <option value="">选择</option>
                    <option v-for="p in getMaterialProcesses(row.growthPeriod)" :key="p" :value="p">{{ p }}</option>
                  </select>
                </td>
                <!-- 作业环节 -->
                <td class="px-2 py-1.5 align-middle">
                  <select v-model="row.taskLink" class="h-8 w-full rounded border border-input bg-transparent px-2 text-sm focus:outline-none focus:ring-1 focus:ring-ring" :disabled="!row.productionProcess" @change="onMaterialTaskLinkChange(idx)">
                    <option value="">选择</option>
                    <option v-for="t in getMaterialTaskLinks(row.growthPeriod, row.productionProcess)" :key="t" :value="t">{{ t }}</option>
                  </select>
                </td>
                <!-- 农资大类 -->
                <td class="px-2 py-1.5 align-middle">
                  <select v-model="row.materialCategory" class="h-8 w-full rounded border border-input bg-transparent px-2 text-sm focus:outline-none focus:ring-1 focus:ring-ring" @change="onMaterialCategoryChange(idx)">
                    <option value="">选择</option>
                    <option v-for="c in materialCategoryOptions" :key="c" :value="c">{{ c }}</option>
                  </select>
                </td>
                <!-- 农资品类 -->
                <td class="px-2 py-1.5 align-middle">
                  <select v-model="row.materialType" class="h-8 w-full rounded border border-input bg-transparent px-2 text-sm focus:outline-none focus:ring-1 focus:ring-ring" :disabled="!row.materialCategory" @change="onMaterialTypeChange(idx)">
                    <option value="">选择</option>
                    <option v-for="t in getMaterialTypes(row.materialCategory)" :key="t" :value="t">{{ t }}</option>
                  </select>
                </td>
                <!-- 有效成分/规格 -->
                <td class="px-2 py-1.5 align-middle">
                  <input v-model="row.spec" class="h-8 w-full rounded border border-input bg-transparent px-2 text-sm focus:outline-none focus:ring-1 focus:ring-ring" :placeholder="row.spec ? '' : '自动代入'" readonly />
                </td>
                <!-- 标准用量 -->
                <td class="px-2 py-1.5 align-middle">
                  <input v-model.number="row.standardDosage" type="number" min="0" step="0.1" class="h-8 w-full rounded border border-input bg-transparent px-2 text-sm text-right focus:outline-none focus:ring-1 focus:ring-ring" placeholder="0" />
                </td>
                <!-- 计量单位 -->
                <td class="px-2 py-1.5 align-middle">
                  <select v-model="row.unit" class="h-8 w-full rounded border border-input bg-transparent px-2 text-sm focus:outline-none focus:ring-1 focus:ring-ring">
                    <option value="">选择</option>
                    <option v-for="u in unitOptions" :key="u" :value="u">{{ u }}</option>
                  </select>
                </td>
                <!-- 施用方式 -->
                <td class="px-2 py-1.5 align-middle">
                  <select v-model="row.applicationMethod" class="h-8 w-full rounded border border-input bg-transparent px-2 text-sm focus:outline-none focus:ring-1 focus:ring-ring">
                    <option value="">选择</option>
                    <option v-for="m in applicationMethodOptions" :key="m" :value="m">{{ m }}</option>
                  </select>
                </td>
                <!-- 安全间隔期 -->
                <td class="px-2 py-1.5 align-middle">
                  <input v-model.number="row.safetyInterval" type="number" min="0" step="1" class="h-8 w-full rounded border px-2 text-sm text-right focus:outline-none focus:ring-1 focus:ring-ring" :class="isSafetyIntervalRequired(row) && !row.safetyInterval ? 'border-red-300 bg-red-50/50' : 'border-input bg-transparent'" :placeholder="isSafetyIntervalRequired(row) ? '必填*' : '选填'" />
                </td>
                <!-- 备注 -->
                <td class="px-2 py-1.5 align-middle">
                  <input v-model="row.remark" class="h-8 w-full rounded border border-input bg-transparent px-2 text-sm focus:outline-none focus:ring-1 focus:ring-ring" placeholder="选填" />
                </td>
                <td class="px-2 py-1.5 align-middle text-center">
                  <button class="text-red-500 hover:text-red-700" @click="removeMaterialRow(idx)">
                    <Trash2 class="h-4 w-4" />
                  </button>
                </td>
              </tr>
              <tr v-if="form.materialItems.length === 0">
                <td colspan="13" class="p-6 text-center text-muted-foreground">暂无明细，点击"添加明细"新增</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <div v-if="form.materialItems.length > 0" class="flex items-center justify-end gap-6 text-sm">
        <span class="text-muted-foreground">共 {{ form.materialItems.length }} 条明细</span>
        <span class="text-muted-foreground">用药类 <span class="font-medium text-foreground">{{ medicineCount }}</span> 条</span>
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

// ==================== 作物数据（来源于基础管理-作物管理） ====================

// 作物大类（与基础管理-作物管理数据源一致）
interface CropMajor {
  code: string
  name: string
  mode: string // field=大田种植, facility=设施农业种植
}

const cropMajors: CropMajor[] = [
  { code: 'rice', name: '水稻', mode: 'field' },
  { code: 'wheat', name: '小麦', mode: 'field' },
  { code: 'corn', name: '玉米', mode: 'field' },
  { code: 'soybean', name: '大豆', mode: 'field' },
  { code: 'cotton', name: '棉花', mode: 'field' },
  { code: 'rape', name: '油菜', mode: 'field' },
  { code: 'peanut', name: '花生', mode: 'field' },
  { code: 'tomato', name: '番茄', mode: 'facility' },
  { code: 'cucumber', name: '黄瓜', mode: 'facility' },
  { code: 'cabbage', name: '白菜', mode: 'facility' },
  { code: 'apple', name: '苹果', mode: 'field' },
  { code: 'grape', name: '葡萄', mode: 'field' },
  { code: 'alfalfa', name: '紫花苜蓿', mode: 'field' },
  { code: 'rose', name: '玫瑰', mode: 'facility' },
]

// 品种列表（与基础管理-作物管理品种数据源一致）
interface CropVariety {
  code: string
  name: string
  majorCode: string
  status: string
}

const cropVarieties: CropVariety[] = [
  { code: 'v1', name: 'Y两优900', majorCode: 'rice', status: '启用' },
  { code: 'v2', name: '湘早籼45号', majorCode: 'rice', status: '启用' },
  { code: 'v3', name: '丰两优4号', majorCode: 'rice', status: '停用' },
  { code: 'v4', name: '郑麦9023', majorCode: 'wheat', status: '启用' },
  { code: 'v5', name: '济麦22', majorCode: 'wheat', status: '启用' },
  { code: 'v6', name: '先玉335', majorCode: 'corn', status: '启用' },
  { code: 'v7', name: '登海605', majorCode: 'corn', status: '启用' },
  { code: 'v8', name: '中黄13', majorCode: 'soybean', status: '启用' },
  { code: 'v9', name: '合丰55', majorCode: 'soybean', status: '启用' },
  { code: 'v10', name: '新陆早45号', majorCode: 'cotton', status: '启用' },
  { code: 'v11', name: '中棉所49', majorCode: 'cotton', status: '停用' },
  { code: 'v12', name: '中油杂12', majorCode: 'rape', status: '启用' },
  { code: 'v13', name: '花育33号', majorCode: 'peanut', status: '停用' },
  { code: 'v14', name: '金棚1号', majorCode: 'tomato', status: '启用' },
  { code: 'v15', name: '中杂9号', majorCode: 'tomato', status: '启用' },
  { code: 'v16', name: '津春4号', majorCode: 'cucumber', status: '启用' },
  { code: 'v17', name: '北京新3号', majorCode: 'cabbage', status: '启用' },
  { code: 'v18', name: '红富士', majorCode: 'apple', status: '启用' },
  { code: 'v19', name: '嘎啦', majorCode: 'apple', status: '启用' },
  { code: 'v20', name: '巨峰', majorCode: 'grape', status: '启用' },
  { code: 'v21', name: '中苜1号', majorCode: 'alfalfa', status: '启用' },
  { code: 'v22', name: '卡罗拉', majorCode: 'rose', status: '停用' },
]

// 按种植模式筛选作物大类
const filteredCropMajors = computed(() => {
  if (!form.value.plantingMode) return cropMajors
  if (form.value.plantingMode === '大田种植') return cropMajors.filter(m => m.mode === 'field')
  if (form.value.plantingMode === '设施农业种植') return cropMajors.filter(m => m.mode === 'facility')
  return cropMajors
})

// 作物大类下拉选项
const cropCategoryOptions = computed(() => {
  return filteredCropMajors.value.map(m => m.name)
})

// 根据所选作物大类筛选品种（仅显示启用的品种）
const varietyOptions = computed(() => {
  if (!form.value.cropCategory) return []
  const major = cropMajors.find(m => m.name === form.value.cropCategory)
  if (!major) return []
  return cropVarieties.filter(v => v.majorCode === major.code && v.status === '启用').map(v => v.name)
})

// 获取当前品种的编码
const currentVarietyCode = computed(() => {
  if (!form.value.cropCategory || !form.value.cropVariety) return ''
  const major = cropMajors.find(m => m.name === form.value.cropCategory)
  if (!major) return ''
  const variety = cropVarieties.find(v => v.majorCode === major.code && v.name === form.value.cropVariety)
  return variety?.code || ''
})

// ==================== 农事作业选项数据（来源于基础管理-作物管理） ====================
const workMethodOptions = ['农机作业', '无人机作业', '人工作业', '智能设备作业']

// 按品种编码定义农事作业数据源（来源于基础管理-作物管理）
interface CropFarmingData {
  growthPeriods: string[]       // 生育时期
  processes: string[]          // 生产流程
  taskLinks: string[]          // 作业环节
  coreStandards: string[]      // 核心农事操作标准
  envRequirements: string[]    // 设施环境管控要求
  paramStandards: string[]     // 作业参数标准
}

const cropFarmingDataMap: Record<string, CropFarmingData> = {
  v1: {  // 水稻
    growthPeriods: ['播种期', '出苗期', '分蘖期', '拔节期', '抽穗期', '灌浆期', '成熟期', '收获期'],
    processes: ['土壤准备', '播种作业', '田间管理', '植保防治', '水肥管理', '收获作业'],
    taskLinks: ['整地', '播种', '追肥', '灌溉', '病虫害防治', '除草', '收获', '施基肥', '中耕', '晒田'],
    coreStandards: ['耕深均匀，无大坷垃', '行距30cm，穴距15cm', '亩施尿素10kg', '浅水间歇灌溉', '及时发现及时防治', '适时收获，防止落粒'],
    envRequirements: [],
    paramStandards: ['耕深≥30cm', '播深3-5cm', '施肥深度10cm', '用药浓度0.1%', '亩用量≥50kg'],
  },
  v2: {  // 小麦
    growthPeriods: ['播种期', '出苗期', '分蘖期', '越冬期', '返青期', '拔节期', '抽穗期', '灌浆期', '成熟期', '收获期'],
    processes: ['土壤准备', '播种作业', '田间管理', '植保防治', '水肥管理', '收获作业'],
    taskLinks: ['整地', '播种', '追肥', '灌溉', '病虫害防治', '除草', '收获', '施基肥', '中耕', '镇压'],
    coreStandards: ['耕深≥25cm，耙平压实', '基本苗15-20万/亩', '亩施尿素8kg', '适时冬灌', '综合防治蚜虫', '蜡熟末期收获'],
    envRequirements: [],
    paramStandards: ['耕深≥25cm', '播深4-5cm', '施肥深度8cm', '用药浓度0.08%', '亩播种量10-15kg'],
  },
  v3: {  // 玉米
    growthPeriods: ['播种期', '出苗期', '拔节期', '大喇叭口期', '抽雄期', '吐丝期', '灌浆期', '成熟期', '收获期'],
    processes: ['土壤准备', '播种作业', '田间管理', '植保防治', '水肥管理', '收获作业'],
    taskLinks: ['整地', '播种', '追肥', '灌溉', '病虫害防治', '除草', '收获', '施基肥', '中耕', '培土'],
    coreStandards: ['深翻≥30cm', '株距25cm，行距60cm', '大喇叭口期追施尿素', '及时排涝', '防治玉米螟', '籽粒乳线消失后收获'],
    envRequirements: [],
    paramStandards: ['耕深≥30cm', '播深4-6cm', '施肥深度10cm', '用药浓度0.1%', '亩保苗4000-4500株'],
  },
  v4: {  // 大豆
    growthPeriods: ['播种期', '出苗期', '分枝期', '开花期', '结荚期', '鼓粒期', '成熟期', '收获期'],
    processes: ['土壤准备', '播种作业', '田间管理', '植保防治', '水肥管理', '收获作业'],
    taskLinks: ['整地', '播种', '追肥', '灌溉', '病虫害防治', '除草', '收获', '施基肥', '中耕'],
    coreStandards: ['深松≥25cm', '株距10cm，行距50cm', '初花期追施磷酸二氢钾', '花荚期保持土壤湿润', '防治大豆食心虫', '叶片脱落80%后收获'],
    envRequirements: [],
    paramStandards: ['耕深≥25cm', '播深3-5cm', '施肥深度8cm', '用药浓度0.05%', '亩保苗1.5-2万株'],
  },
  v5: {  // 棉花
    growthPeriods: ['播种期', '出苗期', '苗期', '蕾期', '花铃期', '吐絮期', '收获期'],
    processes: ['土壤准备', '播种作业', '田间管理', '植保防治', '水肥管理', '收获作业', '整枝修剪'],
    taskLinks: ['整地', '播种', '追肥', '灌溉', '病虫害防治', '除草', '收获', '施基肥', '中耕', '培土', '修剪', '化控'],
    coreStandards: ['覆膜保墒', '一播全苗', '蕾期稳长', '花铃期重施花铃肥', '综合防治棉铃虫', '适时采收'],
    envRequirements: [],
    paramStandards: ['耕深≥25cm', '播深2-3cm', '施肥深度10cm', '用药浓度0.1%', '亩留苗1-1.2万株'],
  },
  rape: {
    growthPeriods: ['播种期', '出苗期', '苗期', '越冬期', '蕾薹期', '花期', '角果期', '成熟期', '收获期'],
    processes: ['土壤准备', '播种作业', '田间管理', '植保防治', '水肥管理', '收获作业'],
    taskLinks: ['整地', '播种', '追肥', '灌溉', '病虫害防治', '除草', '收获', '施基肥', '中耕'],
    coreStandards: ['精整细耙', '匀播全苗', '冬前促壮苗', '蕾薹期追施硼肥', '防治菌核病', '全株2/3角果变黄时收获'],
    envRequirements: [],
    paramStandards: ['耕深≥20cm', '播深1-2cm', '施肥深度8cm', '用药浓度0.08%', '亩播种量0.2-0.3kg'],
  },
  peanut: {
    growthPeriods: ['播种期', '出苗期', '苗期', '花针期', '结荚期', '饱果期', '收获期'],
    processes: ['土壤准备', '播种作业', '田间管理', '植保防治', '水肥管理', '收获作业'],
    taskLinks: ['整地', '播种', '追肥', '灌溉', '病虫害防治', '除草', '收获', '施基肥', '中耕', '培土'],
    coreStandards: ['深耕细耙', '穴距15cm，行距40cm', '花针期追施钙肥', '保持土壤湿润', '防治地下害虫', '饱果率达70%收获'],
    envRequirements: [],
    paramStandards: ['耕深≥25cm', '播深3-5cm', '施肥深度8cm', '用药浓度0.05%', '亩穴数1.5-2万'],
  },
  tomato: {
    growthPeriods: ['育苗期', '定植期', '缓苗期', '开花期', '结果期', '膨大期', '转色期', '采收期'],
    processes: ['育苗管理', '移栽定植', '田间管理', '植保防治', '水肥管理', '收获作业', '整枝修剪', '花果管理'],
    taskLinks: ['育苗', '移栽', '追肥', '灌溉', '病虫害防治', '整枝', '疏花疏果', '套袋', '收获', '施基肥'],
    coreStandards: ['壮苗标准：茎粗0.5cm，5-6片真叶', '定植深度至子叶', '单干整枝', '保花保果', '防治灰霉病', '转色后适时采收'],
    envRequirements: ['白天温度25-28℃，夜间15-18℃', '相对湿度60-70%', '光照≥8小时/天', 'CO₂浓度800-1200ppm', '通风换气防病害'],
    paramStandards: ['育苗温度25℃', '定植行距50cm', '追肥浓度0.3%', '用药浓度0.05%', '亩定植3000-3500株'],
  },
  cucumber: {
    growthPeriods: ['育苗期', '定植期', '缓苗期', '抽蔓期', '开花期', '结果期', '盛果期', '采收期'],
    processes: ['育苗管理', '移栽定植', '田间管理', '植保防治', '水肥管理', '收获作业', '整枝修剪'],
    taskLinks: ['育苗', '移栽', '追肥', '灌溉', '病虫害防治', '整枝', '收获', '施基肥', '引蔓'],
    coreStandards: ['嫁接育苗防枯萎病', '定植后浇透定植水', '及时引蔓整枝', '预防霜霉病', '小水勤浇', '适时采收防老熟'],
    envRequirements: ['白天温度25-30℃，夜间13-15℃', '相对湿度70-80%', '光照≥6小时/天', '通风降湿防病'],
    paramStandards: ['育苗温度28℃', '定植行距40cm', '追肥浓度0.2%', '用药浓度0.05%', '亩定植3500-4000株'],
  },
  cabbage: {
    growthPeriods: ['育苗期', '定植期', '莲座期', '结球期', '收获期'],
    processes: ['育苗管理', '移栽定植', '田间管理', '植保防治', '水肥管理', '收获作业'],
    taskLinks: ['育苗', '移栽', '追肥', '灌溉', '病虫害防治', '除草', '收获', '施基肥'],
    coreStandards: ['适期播种防抽薹', '带土移栽', '莲座期控水蹲苗', '结球期充足供水', '防治菜青虫', '叶球紧实后采收'],
    envRequirements: [],
    paramStandards: ['育苗温度20℃', '定植行距50cm', '追肥浓度0.2%', '用药浓度0.05%', '亩定植2500-3000株'],
  },
  apple: {
    growthPeriods: ['休眠期', '萌芽期', '花期', '坐果期', '膨大期', '着色期', '成熟期', '采收期'],
    processes: ['土壤准备', '花果管理', '植保防治', '水肥管理', '收获作业', '整枝修剪'],
    taskLinks: ['修剪', '追肥', '灌溉', '病虫害防治', '疏花疏果', '套袋', '收获', '施基肥', '中耕'],
    coreStandards: ['冬季修剪整形', '疏花疏果留单果', '套袋护果', '综合防治病虫害', '秋施基肥', '适期分批采收'],
    envRequirements: [],
    paramStandards: ['修剪留枝量8-10万/亩', '追肥深度20cm', '套袋时间花后40天', '用药浓度0.08%', '亩产量3000-4000kg'],
  },
  grape: {
    growthPeriods: ['休眠期', '萌芽期', '新梢生长期', '花期', '浆果生长期', '转色期', '成熟期', '采收期'],
    processes: ['土壤准备', '花果管理', '植保防治', '水肥管理', '收获作业', '整枝修剪'],
    taskLinks: ['修剪', '追肥', '灌溉', '病虫害防治', '疏花疏果', '套袋', '收获', '施基肥', '引蔓'],
    coreStandards: ['冬剪短梢修剪', '疏粒整形', '套袋防鸟害', '防治霜霉病', '膨大期追施钾肥', '可溶性固形物≥16%采收'],
    envRequirements: [],
    paramStandards: ['修剪留芽量1.5-2万/亩', '追肥深度15cm', '套袋时间花后30天', '用药浓度0.08%', '亩产量1500-2000kg'],
  },
  alfalfa: {
    growthPeriods: ['播种期', '出苗期', '分枝期', '现蕾期', '开花期', '结荚期', '成熟期'],
    processes: ['土壤准备', '播种作业', '田间管理', '植保防治', '水肥管理', '收获作业'],
    taskLinks: ['整地', '播种', '追肥', '灌溉', '病虫害防治', '除草', '收获', '施基肥'],
    coreStandards: ['深耕细耙', '条播行距30cm', '现蕾期刈割', '留茬高度5cm', '防治蚜虫', '初花期最佳收割'],
    envRequirements: [],
    paramStandards: ['耕深≥25cm', '播深1-2cm', '施肥深度8cm', '用药浓度0.05%', '亩播种量1-1.5kg'],
  },
  rose: {
    growthPeriods: ['休眠期', '萌芽期', '抽梢期', '现蕾期', '开花期', '采收期'],
    processes: ['土壤准备', '花果管理', '植保防治', '水肥管理', '收获作业', '整枝修剪'],
    taskLinks: ['修剪', '追肥', '灌溉', '病虫害防治', '疏花疏果', '收获', '施基肥'],
    coreStandards: ['冬季重剪', '及时摘侧蕾', '防治白粉病', '花期追施磷钾肥', '花蕾露色采收', '保鲜处理'],
    envRequirements: ['白天温度20-25℃，夜间12-15℃', '相对湿度60-70%', '光照≥6小时/天', '通风防白粉病'],
    paramStandards: ['修剪留2-3芽/枝', '追肥浓度0.2%', '用药浓度0.05%', '亩定植4000-5000株'],
  },
  tea: {
    growthPeriods: ['休眠期', '萌芽期', '新梢生长期', '采摘期', '二次萌发期', '秋季生长末期'],
    processes: ['土壤准备', '田间管理', '植保防治', '水肥管理', '收获作业', '整枝修剪'],
    taskLinks: ['修剪', '追肥', '灌溉', '病虫害防治', '除草', '收获', '施基肥', '中耕'],
    coreStandards: ['春前轻修剪', '一芽二叶标准采摘', '防治茶小绿叶蝉', '秋施有机肥', '及时分批采摘', '鲜叶4小时内加工'],
    envRequirements: [],
    paramStandards: ['修剪留叶层≥10cm', '追肥深度10cm', '用药浓度0.03%', '亩施有机肥2000kg', '亩产鲜叶500-800kg'],
  },
}

// 根据作物大类和品种动态获取农事作业选项
const currentMajorCode = computed(() => {
  // 先根据品种名称查找对应的majorCode（作物大类编码）
  if (form.value.cropVariety) {
    const variety = cropVarieties.find(v => v.name === form.value.cropVariety)
    if (variety) return variety.majorCode
  }
  // 回退：根据作物大类名称查找编码
  if (form.value.cropCategory) {
    const major = cropMajors.find(m => m.name === form.value.cropCategory)
    if (major) return major.code
  }
  return ''
})

const currentFarmingData = computed<CropFarmingData>(() => {
  return cropFarmingDataMap[currentMajorCode.value] || {
    growthPeriods: [], processes: [], taskLinks: [],
    coreStandards: [], envRequirements: [], paramStandards: [],
  }
})

const growthPeriodOptions = computed(() => currentFarmingData.value.growthPeriods)
const processOptions = computed(() => currentFarmingData.value.processes)
const taskLinkOptions = computed(() => currentFarmingData.value.taskLinks)
const coreStandardOptions = computed(() => currentFarmingData.value.coreStandards)
const envRequirementOptions = computed(() => currentFarmingData.value.envRequirements)
const paramStandardOptions = computed(() => currentFarmingData.value.paramStandards)

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
  productionProcess: string            // 生产流程
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
  growthPeriod: string         // 生育时期
  productionProcess: string    // 生产流程
  taskLink: string             // 作业环节
  materialCategory: string     // 农资大类
  materialType: string         // 农资品类
  spec: string                 // 有效成分/规格
  standardDosage: number | ''  // 标准用量
  unit: string                 // 计量单位
  applicationMethod: string    // 施用方式
  safetyInterval: number | ''  // 安全间隔期
  remark: string               // 备注
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
    { growthPeriod: '播种期', productionProcess: '土壤准备', taskLink: '整地', farmingDays: 5, minLeafAge: '', maxLeafAge: '', coreStandard: '耕深均匀，无大坷垃', envRequirement: '', paramStandard: '耕深≥30cm', workMethod: '农机作业', isSowing: '否', isFertilizing: '否', isMedicating: '否', remark: '避免雨天作业' },
    { growthPeriod: '播种期', productionProcess: '播种作业', taskLink: '播种', farmingDays: 3, minLeafAge: '', maxLeafAge: '', coreStandard: '行距30cm，穴距15cm', envRequirement: '', paramStandard: '播深3-5cm', workMethod: '农机作业', isSowing: '是', isFertilizing: '否', isMedicating: '否', remark: '播后及时覆土镇压' },
    { growthPeriod: '生长期', productionProcess: '田间管理', taskLink: '追肥', farmingDays: 7, minLeafAge: 3, maxLeafAge: 5, coreStandard: '亩施尿素10kg', envRequirement: '', paramStandard: '施肥深度10cm', workMethod: '人工作业', isSowing: '否', isFertilizing: '是', isMedicating: '否', remark: '结合灌水进行' },
    { growthPeriod: '生长期', productionProcess: '植保防治', taskLink: '病虫害防治', farmingDays: 3, minLeafAge: 5, maxLeafAge: 8, coreStandard: '及时发现及时防治', envRequirement: '', paramStandard: '用药浓度0.1%', workMethod: '无人机作业', isSowing: '否', isFertilizing: '否', isMedicating: '是', remark: '注意安全间隔期' },
  ],
  materialItems: isEdit.value ? [] : [
    { growthPeriod: '播种期', productionProcess: '播种作业', taskLink: '播种', materialCategory: '种子', materialType: '水稻种子', spec: '松粳22', standardDosage: 4, unit: 'kg', applicationMethod: '机械撒播', safetyInterval: '', remark: '' },
    { growthPeriod: '播种期', productionProcess: '土壤准备', taskLink: '施基肥', materialCategory: '肥料', materialType: '复合肥', spec: '15-15-15', standardDosage: 25, unit: 'kg', applicationMethod: '机械撒施', safetyInterval: '', remark: '' },
    { growthPeriod: '分蘖期', productionProcess: '田间管理', taskLink: '追肥', materialCategory: '肥料', materialType: '尿素', spec: '46%含氮量', standardDosage: 10, unit: 'kg', applicationMethod: '人工撒施', safetyInterval: '', remark: '' },
    { growthPeriod: '分蘖期', productionProcess: '田间管理', taskLink: '除草', materialCategory: '农药', materialType: '草甘膦', spec: '41%水剂', standardDosage: 0.5, unit: 'L', applicationMethod: '喷雾', safetyInterval: 15, remark: '用药类操作' },
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
    growthPeriod: '', productionProcess: '', taskLink: '', farmingDays: '',
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
  form.value.materialItems.push({ growthPeriod: '', productionProcess: '', taskLink: '', materialCategory: '', materialType: '', spec: '', standardDosage: '', unit: '', applicationMethod: '', safetyInterval: '', remark: '' })
}

function removeMaterialRow(idx: number): void {
  form.value.materialItems.splice(idx, 1)
}

function isMedicationTask(idx: number): boolean {
  const row = form.value.materialItems[idx]
  if (!row.growthPeriod || !row.productionProcess || !row.taskLink) return false
  const farming = form.value.farmingItems.find(f => f.growthPeriod === row.growthPeriod && f.productionProcess === row.productionProcess && f.taskLink === row.taskLink)
  return farming?.isMedicating === '是'
}

// 农资投入 - 生育时期选项（来源于农事作业标准明细表）
const materialPeriodOptions = computed(() => {
  const periods = new Set<string>()
  form.value.farmingItems.forEach(item => {
    if (item.growthPeriod) periods.add(item.growthPeriod)
  })
  return Array.from(periods)
})

// 农资投入 - 生产流程选项（根据生育时期过滤）
function materialProcessOptions(period: string): string[] {
  const processes = new Set<string>()
  form.value.farmingItems
    .filter(item => item.growthPeriod === period)
    .forEach(item => {
      if (item.productionProcess) processes.add(item.productionProcess)
    })
  return Array.from(processes)
}

// 农资投入 - 作业环节选项（根据生育时期+生产流程过滤）
function materialTaskOptions(period: string, process: string): string[] {
  const tasks = new Set<string>()
  form.value.farmingItems
    .filter(item => item.growthPeriod === period && item.productionProcess === process)
    .forEach(item => {
      if (item.taskLink) tasks.add(item.taskLink)
    })
  return Array.from(tasks)
}

// 农资投入 - 农资大类选项
const materialCategoryOptions = ['肥料', '农药', '种子', '农膜', '生长调节剂']

// 农资投入 - 农资品类选项（联动大类）
const materialTypeMap: Record<string, string[]> = {
  '肥料': ['复合肥', '尿素', '磷酸二铵', '氯化钾', '有机肥', '叶面肥', '微生物菌肥'],
  '农药': ['杀虫剂', '杀菌剂', '除草剂', '杀螨剂', '植物生长调节剂'],
  '种子': ['杂交种', '常规种', '包衣种'],
  '农膜': ['地膜', '棚膜', '反光膜'],
  '生长调节剂': ['矮壮素', '多效唑', '赤霉素', '乙烯利'],
}

function materialTypeOptions(category: string): string[] {
  return materialTypeMap[category] || []
}

// 农资投入 - 有效成分/规格（根据品类自动代入）
const materialSpecMap: Record<string, string> = {
  '复合肥': 'N-P₂O₅-K₂O ≥ 45%',
  '尿素': '含氮量 ≥ 46%',
  '磷酸二铵': 'N 18% + P₂O₅ 46%',
  '氯化钾': 'K₂O ≥ 60%',
  '有机肥': '有机质 ≥ 45%',
  '叶面肥': '微量元素 ≥ 10%',
  '微生物菌肥': '有效活菌数 ≥ 2亿/g',
  '杀虫剂': '有效成分含量 ≥ 20%',
  '杀菌剂': '有效成分含量 ≥ 25%',
  '除草剂': '有效成分含量 ≥ 30%',
  '杀螨剂': '有效成分含量 ≥ 15%',
  '植物生长调节剂': '有效成分含量 ≥ 10%',
  '杂交种': '纯度 ≥ 96%，发芽率 ≥ 85%',
  '常规种': '纯度 ≥ 95%，发芽率 ≥ 80%',
  '包衣种': '种衣剂覆盖率 ≥ 98%',
  '地膜': '厚度 0.01mm，幅宽 90cm',
  '棚膜': '厚度 0.12mm，无滴防雾',
  '反光膜': '反射率 ≥ 80%',
  '矮壮素': '有效成分 50% 水剂',
  '多效唑': '有效成分 15% 可湿性粉剂',
  '赤霉素': '有效成分 85% 结晶粉',
  '乙烯利': '有效成分 40% 水剂',
}

// 农资投入 - 计量单位选项
const materialUnitOptions = ['kg', '亩', 'ml', 'l', 'g', '袋']

// 农资投入 - 施用方式选项
const materialUsageOptions = ['基肥', '追肥', '叶面喷施', '种子处理', '土壤处理', '灌根', '喷雾', '拌种', '撒施', '滴灌']

// 判断某行农资投入的安全间隔期是否必填
function isSafetyIntervalRequired(row: MaterialItem): boolean {
  if (!row.growthPeriod || !row.productionProcess || !row.taskLink) return false
  const match = form.value.farmingItems.find(
    item => item.growthPeriod === row.growthPeriod &&
            item.productionProcess === row.productionProcess &&
            item.taskLink === row.taskLink
  )
  return match?.isMedicating === '是'
}

// 农资投入 - 品类变更时自动代入规格
function onMaterialTypeChange(idx: number) {
  const row = form.value.materialItems[idx]
  row.spec = materialSpecMap[row.materialType] || ''
}

// 农资投入 - 生育时期变更时清空下级选项
function onMaterialPeriodChange(row: MaterialItem) {
  row.productionProcess = ''
  row.taskLink = ''
  row.safetyInterval = ''
}

// 农资投入 - 生育时期选项（来自农事作业标准明细表）
const materialGrowthPeriods = computed(() => {
  const periods = new Set<string>()
  form.value.farmingItems.forEach(item => {
    if (item.growthPeriod) periods.add(item.growthPeriod)
  })
  return Array.from(periods)
})

// 农资投入 - 根据生育时期获取生产流程
function getMaterialProcesses(growthPeriod: string): string[] {
  const processes = new Set<string>()
  form.value.farmingItems.forEach(item => {
    if (item.growthPeriod === growthPeriod && item.productionProcess) processes.add(item.productionProcess)
  })
  return Array.from(processes)
}

// 农资投入 - 根据生育时期+生产流程获取作业环节
function getMaterialTaskLinks(growthPeriod: string, productionProcess: string): string[] {
  const links = new Set<string>()
  form.value.farmingItems.forEach(item => {
    if (item.growthPeriod === growthPeriod && item.productionProcess === productionProcess && item.taskLink) links.add(item.taskLink)
  })
  return Array.from(links)
}

// 农资投入 - 生育时期变更时清空下级选项
function onMaterialGrowthPeriodChange(idx: number) {
  const row = form.value.materialItems[idx]
  row.productionProcess = ''
  row.taskLink = ''
  row.safetyInterval = ''
}

// 农资投入 - 作业环节变更时更新安全间隔期
function onMaterialTaskLinkChange(idx: number) {
  const row = form.value.materialItems[idx]
  row.safetyInterval = isSafetyIntervalRequired(row) ? '' : ''
}

// 农资投入 - 农资大类变更时清空品类和规格
function onMaterialCategoryChange(idx: number) {
  const row = form.value.materialItems[idx]
  row.materialType = ''
  row.spec = ''
}

// 农资投入 - 根据农资大类获取品类
function getMaterialTypes(category: string): string[] {
  const data = materialTypeMap[category]
  return data || []
}

// 计量单位选项
const unitOptions = ['kg', '亩', 'ml', 'l', 'g', '袋']

// 施用方式选项
const applicationMethodOptions = ['基施', '追施', '叶面喷施', '滴灌施', '拌种', '浸种', '穴施', '沟施', '撒施', '灌根']

// 用药类条目数
const medicineCount = computed(() => {
  return form.value.materialItems.filter(item => isSafetyIntervalRequired(item)).length
})

// 农资投入 - 生产流程变更时清空下级选项
function onMaterialProcessChange(idx: number) {
  const row = form.value.materialItems[idx]
  if (row) {
    row.taskLink = ''
    row.safetyInterval = ''
  }
}

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
  form.value.approvalStatus = 'draft'
  showToast({ message: `方案已保存${isEdit.value ? '（版本 ' + form.value.version + '）' : ''}`, type: 'success' })
}

function handleSubmit(): void {
  if (!canSubmit.value) {
    showToast({ message: '请填写完整的方案信息后再发起流程', type: 'warning' })
    return
  }
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
