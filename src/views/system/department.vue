<template>
  <div class="space-y-6">
    <!-- 页面标题 + 操作 -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold tracking-tight">部门管理</h1>
        <p class="mt-1 text-sm text-muted-foreground">管理组织架构中的部门信息</p>
      </div>
      <button
        id="btn-new-dept"
        class="inline-flex items-center justify-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
      >
        <Plus class="h-4 w-4" />
        新增部门
      </button>
    </div>

    <!-- 统计卡片 -->
    <div class="grid grid-cols-1 gap-4 sm:grid-cols-3">
      <!-- 统计-部门总数 -->
      <div class="rounded-lg border bg-card text-card-foreground shadow-sm">
        <div class="flex items-center gap-4 p-5">
          <div class="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-green-100">
            <Building2 class="h-5 w-5 text-green-600" />
          </div>
          <div>
            <p class="text-sm text-muted-foreground">部门总数</p>
            <p class="text-2xl font-bold">{{ departments.length }}</p>
          </div>
        </div>
      </div>
      <!-- 统计-总人数 -->
      <div class="rounded-lg border bg-card text-card-foreground shadow-sm">
        <div class="flex items-center gap-4 p-5">
          <div class="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-blue-100">
            <Users class="h-5 w-5 text-blue-600" />
          </div>
          <div>
            <p class="text-sm text-muted-foreground">总人数</p>
            <p class="text-2xl font-bold">{{ totalMembers }}</p>
          </div>
        </div>
      </div>
      <!-- 统计-活跃部门 -->
      <div class="rounded-lg border bg-card text-card-foreground shadow-sm">
        <div class="flex items-center gap-4 p-5">
          <div class="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-amber-100">
            <Phone class="h-5 w-5 text-amber-600" />
          </div>
          <div>
            <p class="text-sm text-muted-foreground">活跃部门</p>
            <p class="text-2xl font-bold">{{ activeDeptCount }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- 部门列表 -->
    <div class="rounded-lg border bg-card text-card-foreground shadow-sm">
      <div class="flex flex-col space-y-1.5 p-6">
        <h3 class="text-lg font-semibold leading-none tracking-tight">部门列表</h3>
        <p class="text-sm text-muted-foreground">所有部门的详细信息</p>
      </div>
      <div class="p-6 pt-0">
        <div class="relative w-full overflow-auto">
          <table class="w-full caption-bottom text-sm">
            <thead class="[&_tr]:border-b">
              <tr class="border-b transition-colors hover:bg-muted/50">
                <th class="h-10 px-2 text-left align-middle font-medium text-muted-foreground">部门名称</th>
                <th class="h-10 px-2 text-left align-middle font-medium text-muted-foreground">编码</th>
                <th class="h-10 px-2 text-left align-middle font-medium text-muted-foreground">负责人</th>
                <th class="h-10 px-2 text-right align-middle font-medium text-muted-foreground">人数</th>
                <th class="h-10 px-2 text-left align-middle font-medium text-muted-foreground">联系电话</th>
                <th class="h-10 px-2 text-left align-middle font-medium text-muted-foreground">描述</th>
                <th class="h-10 px-2 text-left align-middle font-medium text-muted-foreground">状态</th>
              </tr>
            </thead>
            <tbody class="[&_tr:last-child]:border-0">
              <!-- 列表-部门1: 农业生产部 -->
              <tr class="border-b transition-colors hover:bg-muted/50">
                <td class="p-2 align-middle font-medium">农业生产部</td>
                <td class="p-2 align-middle font-mono text-xs">AGR</td>
                <td class="p-2 align-middle">张农技</td>
                <td class="p-2 align-middle text-right">12</td>
                <td class="p-2 align-middle text-xs">0571-88001001</td>
                <td class="p-2 align-middle max-w-[200px] truncate text-xs text-muted-foreground">负责种植方案制定与农事执行</td>
                <td class="p-2 align-middle">
                  <span class="inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 bg-green-100 text-green-700 hover:bg-green-100">启用</span>
                </td>
              </tr>
              <!-- 列表-部门2: 农资采购部 -->
              <tr class="border-b transition-colors hover:bg-muted/50">
                <td class="p-2 align-middle font-medium">农资采购部</td>
                <td class="p-2 align-middle font-mono text-xs">PUR</td>
                <td class="p-2 align-middle">李采购</td>
                <td class="p-2 align-middle text-right">6</td>
                <td class="p-2 align-middle text-xs">0571-88001002</td>
                <td class="p-2 align-middle max-w-[200px] truncate text-xs text-muted-foreground">负责农资采购与供应商管理</td>
                <td class="p-2 align-middle">
                  <span class="inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 bg-green-100 text-green-700 hover:bg-green-100">启用</span>
                </td>
              </tr>
              <!-- 列表-部门3: 技术支持部 -->
              <tr class="border-b transition-colors hover:bg-muted/50">
                <td class="p-2 align-middle font-medium">技术支持部</td>
                <td class="p-2 align-middle font-mono text-xs">TEC</td>
                <td class="p-2 align-middle">王技术</td>
                <td class="p-2 align-middle text-right">8</td>
                <td class="p-2 align-middle text-xs">0571-88001003</td>
                <td class="p-2 align-middle max-w-[200px] truncate text-xs text-muted-foreground">负责农业技术指导与培训</td>
                <td class="p-2 align-middle">
                  <span class="inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 bg-green-100 text-green-700 hover:bg-green-100">启用</span>
                </td>
              </tr>
              <!-- 列表-部门4: 质量检测部 -->
              <tr class="border-b transition-colors hover:bg-muted/50">
                <td class="p-2 align-middle font-medium">质量检测部</td>
                <td class="p-2 align-middle font-mono text-xs">QA</td>
                <td class="p-2 align-middle">赵质检</td>
                <td class="p-2 align-middle text-right">5</td>
                <td class="p-2 align-middle text-xs">0571-88001004</td>
                <td class="p-2 align-middle max-w-[200px] truncate text-xs text-muted-foreground">负责农产品质量检测与追溯</td>
                <td class="p-2 align-middle">
                  <span class="inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 bg-green-100 text-green-700 hover:bg-green-100">启用</span>
                </td>
              </tr>
              <!-- 列表-部门5: 设备管理部 -->
              <tr class="border-b transition-colors hover:bg-muted/50">
                <td class="p-2 align-middle font-medium">设备管理部</td>
                <td class="p-2 align-middle font-mono text-xs">EQP</td>
                <td class="p-2 align-middle">孙设备</td>
                <td class="p-2 align-middle text-right">4</td>
                <td class="p-2 align-middle text-xs">0571-88001005</td>
                <td class="p-2 align-middle max-w-[200px] truncate text-xs text-muted-foreground">负责农机设备维护与管理</td>
                <td class="p-2 align-middle">
                  <span class="inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 bg-green-100 text-green-700 hover:bg-green-100">启用</span>
                </td>
              </tr>
              <!-- 列表-部门6: 综合管理部 -->
              <tr class="border-b transition-colors hover:bg-muted/50">
                <td class="p-2 align-middle font-medium">综合管理部</td>
                <td class="p-2 align-middle font-mono text-xs">ADM</td>
                <td class="p-2 align-middle">周综合</td>
                <td class="p-2 align-middle text-right">6</td>
                <td class="p-2 align-middle text-xs">0571-88001006</td>
                <td class="p-2 align-middle max-w-[200px] truncate text-xs text-muted-foreground">负责行政、人事、财务综合管理</td>
                <td class="p-2 align-middle">
                  <span class="inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 bg-green-100 text-green-700 hover:bg-green-100">启用</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { Building2, Plus, Users, Phone } from 'lucide-vue-next'

interface Department {
  id: number
  name: string
  code: string
  leader: string
  memberCount: number
  phone: string
  status: 'active' | 'inactive'
  description: string
}

const departments: Department[] = [
  { id: 1, name: '农业生产部', code: 'AGR', leader: '张农技', memberCount: 12, phone: '0571-88001001', status: 'active', description: '负责种植方案制定与农事执行' },
  { id: 2, name: '农资采购部', code: 'PUR', leader: '李采购', memberCount: 6, phone: '0571-88001002', status: 'active', description: '负责农资采购与供应商管理' },
  { id: 3, name: '技术支持部', code: 'TEC', leader: '王技术', memberCount: 8, phone: '0571-88001003', status: 'active', description: '负责农业技术指导与培训' },
  { id: 4, name: '质量检测部', code: 'QA', leader: '赵质检', memberCount: 5, phone: '0571-88001004', status: 'active', description: '负责农产品质量检测与追溯' },
  { id: 5, name: '设备管理部', code: 'EQP', leader: '孙设备', memberCount: 4, phone: '0571-88001005', status: 'active', description: '负责农机设备维护与管理' },
  { id: 6, name: '综合管理部', code: 'ADM', leader: '周综合', memberCount: 6, phone: '0571-88001006', status: 'active', description: '负责行政、人事、财务综合管理' },
]

const totalMembers = computed(() => departments.reduce((sum, d) => sum + d.memberCount, 0))
const activeDeptCount = computed(() => departments.filter(d => d.status === 'active').length)
</script>
