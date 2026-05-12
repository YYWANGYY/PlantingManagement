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
            {{ form.id }} · 版本 v{{ form.version }}
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
      <div class="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <!-- 方案名称 -->
        <div>
          <label class="mb-1.5 block text-sm font-medium">方案名称 <span class="text-red-500">*</span></label>
          <input
            v-model="form.name"
            type="text"
            placeholder="请输入方案名称"
            class="h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus:outline-none focus:ring-1 focus:ring-ring"
          />
        </div>
        <!-- 所属单位 -->
        <div>
          <label class="mb-1.5 block text-sm font-medium">所属单位 <span class="text-red-500">*</span></label>
          <select
            v-model="form.unit"
            class="h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus:outline-none focus:ring-1 focus:ring-ring"
          >
            <option value="">请选择</option>
            <optgroup v-for="org in orgTree" :key="org.label" :label="org.label">
              <option v-for="child in org.children" :key="child" :value="child">{{ child }}</option>
            </optgroup>
          </select>
        </div>
        <!-- 种植模式 -->
        <div>
          <label class="mb-1.5 block text-sm font-medium">种植模式 <span class="text-red-500">*</span></label>
          <select
            v-model="form.plantingMode"
            class="h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus:outline-none focus:ring-1 focus:ring-ring"
          >
            <option value="">请选择</option>
            <option value="露地种植">露地种植</option>
            <option value="设施种植">设施种植</option>
          </select>
        </div>
        <!-- 作物大类 -->
        <div>
          <label class="mb-1.5 block text-sm font-medium">作物大类 <span class="text-red-500">*</span></label>
          <select
            v-model="form.cropCategory"
            class="h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus:outline-none focus:ring-1 focus:ring-ring"
            @change="form.cropVariety = ''"
          >
            <option value="">请选择</option>
            <option v-for="c in cropCategories" :key="c" :value="c">{{ c }}</option>
          </select>
        </div>
        <!-- 作物品种 -->
        <div>
          <label class="mb-1.5 block text-sm font-medium">作物品种 <span class="text-red-500">*</span></label>
          <select
            v-model="form.cropVariety"
            class="h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus:outline-none focus:ring-1 focus:ring-ring"
            :disabled="!form.cropCategory"
          >
            <option value="">请选择</option>
            <option v-for="v in varietyOptions" :key="v" :value="v">{{ v }}</option>
          </select>
        </div>
        <!-- 种植季节 -->
        <div>
          <label class="mb-1.5 block text-sm font-medium">种植季节 <span class="text-red-500">*</span></label>
          <select
            v-model="form.season"
            class="h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus:outline-none focus:ring-1 focus:ring-ring"
          >
            <option value="">请选择</option>
            <option value="春季">春季</option>
            <option value="夏季">夏季</option>
            <option value="秋季">秋季</option>
            <option value="冬季">冬季</option>
          </select>
        </div>
        <!-- 种植面积 -->
        <div>
          <label class="mb-1.5 block text-sm font-medium">种植面积(亩) <span class="text-red-500">*</span></label>
          <input
            v-model.number="form.area"
            type="number"
            min="0"
            placeholder="请输入种植面积"
            class="h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus:outline-none focus:ring-1 focus:ring-ring"
          />
        </div>
        <!-- 产量目标 -->
        <div>
          <label class="mb-1.5 block text-sm font-medium">产量目标 <span class="text-red-500">*</span></label>
          <input
            v-model="form.yieldTarget"
            type="text"
            placeholder="如 650kg/亩"
            class="h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus:outline-none focus:ring-1 focus:ring-ring"
          />
        </div>
        <!-- 年份 -->
        <div>
          <label class="mb-1.5 block text-sm font-medium">年份 <span class="text-red-500">*</span></label>
          <select
            v-model="form.year"
            class="h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus:outline-none focus:ring-1 focus:ring-ring"
          >
            <option value="">请选择</option>
            <option v-for="y in [2026, 2025, 2024]" :key="y" :value="y">{{ y }}</option>
          </select>
        </div>
        <!-- 方案描述 -->
        <div class="lg:col-span-2">
          <label class="mb-1.5 block text-sm font-medium">方案描述</label>
          <textarea
            v-model="form.description"
            rows="3"
            placeholder="请输入方案描述"
            class="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm transition-colors focus:outline-none focus:ring-1 focus:ring-ring resize-none"
          />
        </div>
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
        <div class="overflow-auto">
          <table class="w-full text-sm">
            <thead>
              <tr class="border-b bg-muted/50">
                <th class="h-10 px-3 text-left font-medium text-muted-foreground" style="width:50px">序号</th>
                <th class="h-10 px-3 text-left font-medium text-muted-foreground">作业阶段</th>
                <th class="h-10 px-3 text-left font-medium text-muted-foreground">作业项目</th>
                <th class="h-10 px-3 text-left font-medium text-muted-foreground">作业内容</th>
                <th class="h-10 px-3 text-left font-medium text-muted-foreground">作业时间</th>
                <th class="h-10 px-3 text-left font-medium text-muted-foreground">质量标准</th>
                <th class="h-10 px-3 text-left font-medium text-muted-foreground">注意事项</th>
                <th class="h-10 px-3 text-center font-medium text-muted-foreground" style="width:60px">操作</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(row, idx) in form.farmingItems" :key="idx" class="border-b">
                <td class="p-2 align-middle text-muted-foreground">{{ idx + 1 }}</td>
                <td class="p-2 align-middle">
                  <input v-model="row.stage" class="h-8 w-full rounded border border-input bg-transparent px-2 text-sm focus:outline-none focus:ring-1 focus:ring-ring" placeholder="如 播种期" />
                </td>
                <td class="p-2 align-middle">
                  <input v-model="row.item" class="h-8 w-full rounded border border-input bg-transparent px-2 text-sm focus:outline-none focus:ring-1 focus:ring-ring" placeholder="如 整地" />
                </td>
                <td class="p-2 align-middle">
                  <input v-model="row.content" class="h-8 w-full rounded border border-input bg-transparent px-2 text-sm focus:outline-none focus:ring-1 focus:ring-ring" placeholder="如 深翻30cm" />
                </td>
                <td class="p-2 align-middle">
                  <input v-model="row.time" class="h-8 w-full rounded border border-input bg-transparent px-2 text-sm focus:outline-none focus:ring-1 focus:ring-ring" placeholder="如 3月上旬" />
                </td>
                <td class="p-2 align-middle">
                  <input v-model="row.standard" class="h-8 w-full rounded border border-input bg-transparent px-2 text-sm focus:outline-none focus:ring-1 focus:ring-ring" placeholder="如 耕深均匀" />
                </td>
                <td class="p-2 align-middle">
                  <input v-model="row.remark" class="h-8 w-full rounded border border-input bg-transparent px-2 text-sm focus:outline-none focus:ring-1 focus:ring-ring" placeholder="如 避免雨天" />
                </td>
                <td class="p-2 align-middle text-center">
                  <button class="text-red-500 hover:text-red-700" @click="removeFarmingRow(idx)">
                    <Trash2 class="h-4 w-4" />
                  </button>
                </td>
              </tr>
              <tr v-if="form.farmingItems.length === 0">
                <td colspan="8" class="p-6 text-center text-muted-foreground">暂无明细，点击"添加明细"新增</td>
              </tr>
            </tbody>
          </table>
        </div>
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
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ArrowLeft, Save, Send, Plus, Trash2 } from 'lucide-vue-next'
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
const cropCategories = Object.keys(cropCategoryMap)
const varietyOptions = computed(() => {
  if (!form.value.cropCategory) return []
  return cropCategoryMap[form.value.cropCategory] || []
})

// ==================== 选项卡 ====================
const tabs = [
  { key: 'basic', label: '基本信息' },
  { key: 'farming', label: '农事作业标准明细表' },
  { key: 'material', label: '农资投入标准明细表' },
]
const activeTab = ref('basic')

// ==================== 表单数据 ====================
interface FarmingItem {
  stage: string
  item: string
  content: string
  time: string
  standard: string
  remark: string
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

interface SchemeForm {
  id: string
  name: string
  unit: string
  plantingMode: string
  cropCategory: string
  cropVariety: string
  season: string
  area: number | ''
  yieldTarget: string
  year: number | ''
  description: string
  version: number
  status: string
  farmingItems: FarmingItem[]
  materialItems: MaterialItem[]
}

const form = ref<SchemeForm>({
  id: isEdit.value ? editId.value : '',
  name: '',
  unit: '',
  plantingMode: '',
  cropCategory: '',
  cropVariety: '',
  season: '',
  area: '',
  yieldTarget: '',
  year: '',
  description: '',
  version: isEdit.value ? editVersion.value : 1,
  status: 'draft',
  farmingItems: isEdit.value ? [] : [
    { stage: '播种期', item: '整地', content: '深翻30cm，耙平作畦', time: '3月上旬', standard: '耕深均匀，无大坷垃', remark: '避免雨天作业' },
    { stage: '播种期', item: '播种', content: '机械精量穴播', time: '3月中旬', standard: '行距30cm，穴距15cm', remark: '播后及时覆土镇压' },
    { stage: '生长期', item: '追肥', content: '分蘖期追施尿素', time: '4月下旬', standard: '亩施10kg', remark: '结合灌水进行' },
  ],
  materialItems: isEdit.value ? [] : [
    { category: '肥料', type: '尿素', spec: '46%含氮量', unit: 'kg', perMu: 10, total: 0, price: 2.5, budget: 0, purpose: '追肥' },
    { category: '肥料', type: '复合肥', spec: '15-15-15', unit: 'kg', perMu: 25, total: 0, price: 3.2, budget: 0, purpose: '基肥' },
    { category: '农药', type: '草甘膦', spec: '41%水剂', unit: 'L', perMu: 0.5, total: 0, price: 15, budget: 0, purpose: '除草' },
    { category: '种子', type: '水稻种子', spec: '松粳22', unit: 'kg', perMu: 4, total: 0, price: 8, budget: 0, purpose: '播种' },
  ],
})

// 初始化计算
form.value.materialItems.forEach((_, idx) => calcMaterialTotal(idx))

// ==================== 农事作业操作 ====================
function addFarmingRow() {
  form.value.farmingItems.push({ stage: '', item: '', content: '', time: '', standard: '', remark: '' })
}

function removeFarmingRow(idx: number) {
  form.value.farmingItems.splice(idx, 1)
}

// ==================== 农资投入操作 ====================
function addMaterialRow() {
  form.value.materialItems.push({ category: '', type: '', spec: '', unit: '', perMu: '', total: 0, price: '', budget: 0, purpose: '' })
}

function removeMaterialRow(idx: number) {
  form.value.materialItems.splice(idx, 1)
}

function calcMaterialTotal(idx: number) {
  const row = form.value.materialItems[idx]
  const area = Number(form.value.area) || 0
  const perMu = Number(row.perMu) || 0
  const price = Number(row.price) || 0
  row.total = Math.round(perMu * area * 100) / 100
  row.budget = Math.round(row.total * price * 100) / 100
}

const materialBudgetTotal = computed(() => {
  return form.value.materialItems.reduce((sum, row) => sum + (row.budget || 0), 0).toFixed(2)
})

// ==================== 表单验证 ====================
const canSave = computed(() => {
  return form.value.name.trim() !== ''
})

const canSubmit = computed(() => {
  const f = form.value
  return (
    f.name.trim() !== '' &&
    f.unit !== '' &&
    f.plantingMode !== '' &&
    f.cropCategory !== '' &&
    f.cropVariety !== '' &&
    f.season !== '' &&
    Number(f.area) > 0 &&
    f.yieldTarget.trim() !== '' &&
    Number(f.year) > 0 &&
    f.farmingItems.length > 0 &&
    f.materialItems.length > 0
  )
})

// ==================== 保存与发起 ====================
function handleSave() {
  if (!canSave.value) return
  // 重新计算所有农资合计
  form.value.materialItems.forEach((_, idx) => calcMaterialTotal(idx))
  form.value.status = 'draft'
  showToast({ message: `方案已保存${isEdit.value ? '（版本 v' + form.value.version + '）' : ''}`, type: 'success' })
}

function handleSubmit() {
  if (!canSubmit.value) {
    showToast({ message: '请填写完整的方案信息后再发起流程', type: 'warning' })
    return
  }
  form.value.materialItems.forEach((_, idx) => calcMaterialTotal(idx))
  form.value.status = 'review'

  // 找出所属单位对应的区域公司审批人
  let approverUnit = ''
  for (const org of orgTree) {
    if (org.children.includes(form.value.unit)) {
      approverUnit = org.label
      break
    }
  }
  showToast({ message: `已发送至：${approverUnit}负责人进行审批（审批人：张三、李四）`, type: 'success' })
}

function goBack() {
  router.push('/planting-plan')
}
</script>
