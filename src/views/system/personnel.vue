<template>
  <div class="space-y-6">
    <!-- 页面标题 + 操作 -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold tracking-tight">人员管理</h1>
        <p class="mt-1 text-sm text-muted-foreground">管理系统内的人员信息和组织归属</p>
      </div>
      <button
        id="btn-new-personnel"
        class="inline-flex items-center justify-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
      >
        <Plus class="h-4 w-4" />
        新增人员
      </button>
    </div>

    <!-- 统计卡片 -->
    <div class="grid grid-cols-1 gap-4 sm:grid-cols-3">
      <!-- 统计-人员总数 -->
      <div class="rounded-lg border bg-card text-card-foreground shadow-sm">
        <div class="flex items-center gap-4 p-5">
          <div class="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-green-100">
            <Users class="h-5 w-5 text-green-600" />
          </div>
          <div>
            <p class="text-sm text-muted-foreground">人员总数</p>
            <p class="text-2xl font-bold">{{ personnelList.length }}</p>
          </div>
        </div>
      </div>
      <!-- 统计-在职人员 -->
      <div class="rounded-lg border bg-card text-card-foreground shadow-sm">
        <div class="flex items-center gap-4 p-5">
          <div class="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-blue-100">
            <Mail class="h-5 w-5 text-blue-600" />
          </div>
          <div>
            <p class="text-sm text-muted-foreground">在职人员</p>
            <p class="text-2xl font-bold">{{ activeCount }}</p>
          </div>
        </div>
      </div>
      <!-- 统计-部门覆盖 -->
      <div class="rounded-lg border bg-card text-card-foreground shadow-sm">
        <div class="flex items-center gap-4 p-5">
          <div class="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-amber-100">
            <Phone class="h-5 w-5 text-amber-600" />
          </div>
          <div>
            <p class="text-sm text-muted-foreground">部门覆盖</p>
            <p class="text-2xl font-bold">{{ departmentCoverage }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- 人员列表 -->
    <div class="rounded-lg border bg-card text-card-foreground shadow-sm">
      <div class="flex flex-col space-y-1.5 p-6">
        <h3 class="text-lg font-semibold leading-none tracking-tight">人员列表</h3>
        <p class="text-sm text-muted-foreground">所有人员的详细信息</p>
      </div>
      <div class="p-6 pt-0">
        <div class="relative w-full overflow-auto">
          <table class="w-full caption-bottom text-sm">
            <thead class="[&_tr]:border-b">
              <tr class="border-b transition-colors hover:bg-muted/50">
                <th class="h-10 px-2 text-left align-middle font-medium text-muted-foreground">姓名</th>
                <th class="h-10 px-2 text-left align-middle font-medium text-muted-foreground">部门</th>
                <th class="h-10 px-2 text-left align-middle font-medium text-muted-foreground">职位</th>
                <th class="h-10 px-2 text-left align-middle font-medium text-muted-foreground">联系电话</th>
                <th class="h-10 px-2 text-left align-middle font-medium text-muted-foreground">邮箱</th>
                <th class="h-10 px-2 text-left align-middle font-medium text-muted-foreground">入职日期</th>
                <th class="h-10 px-2 text-left align-middle font-medium text-muted-foreground">状态</th>
              </tr>
            </thead>
            <tbody class="[&_tr:last-child]:border-0">
              <!-- 列表-人员1: 张农技 -->
              <tr class="border-b transition-colors hover:bg-muted/50">
                <td class="p-2 align-middle font-medium">张农技</td>
                <td class="p-2 align-middle">农业生产部</td>
                <td class="p-2 align-middle">部长</td>
                <td class="p-2 align-middle text-xs">13800001001</td>
                <td class="p-2 align-middle text-xs text-muted-foreground">zhang@farm.com</td>
                <td class="p-2 align-middle text-xs">2018-03-15</td>
                <td class="p-2 align-middle">
                  <span class="inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 bg-green-100 text-green-700 hover:bg-green-100">在职</span>
                </td>
              </tr>
              <!-- 列表-人员2: 李采购 -->
              <tr class="border-b transition-colors hover:bg-muted/50">
                <td class="p-2 align-middle font-medium">李采购</td>
                <td class="p-2 align-middle">农资采购部</td>
                <td class="p-2 align-middle">部长</td>
                <td class="p-2 align-middle text-xs">13800001002</td>
                <td class="p-2 align-middle text-xs text-muted-foreground">li@farm.com</td>
                <td class="p-2 align-middle text-xs">2019-06-01</td>
                <td class="p-2 align-middle">
                  <span class="inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 bg-green-100 text-green-700 hover:bg-green-100">在职</span>
                </td>
              </tr>
              <!-- 列表-人员3: 王技术 -->
              <tr class="border-b transition-colors hover:bg-muted/50">
                <td class="p-2 align-middle font-medium">王技术</td>
                <td class="p-2 align-middle">技术支持部</td>
                <td class="p-2 align-middle">部长</td>
                <td class="p-2 align-middle text-xs">13800001003</td>
                <td class="p-2 align-middle text-xs text-muted-foreground">wang@farm.com</td>
                <td class="p-2 align-middle text-xs">2017-09-20</td>
                <td class="p-2 align-middle">
                  <span class="inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 bg-green-100 text-green-700 hover:bg-green-100">在职</span>
                </td>
              </tr>
              <!-- 列表-人员4: 赵质检 -->
              <tr class="border-b transition-colors hover:bg-muted/50">
                <td class="p-2 align-middle font-medium">赵质检</td>
                <td class="p-2 align-middle">质量检测部</td>
                <td class="p-2 align-middle">部长</td>
                <td class="p-2 align-middle text-xs">13800001004</td>
                <td class="p-2 align-middle text-xs text-muted-foreground">zhao@farm.com</td>
                <td class="p-2 align-middle text-xs">2020-01-10</td>
                <td class="p-2 align-middle">
                  <span class="inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 bg-green-100 text-green-700 hover:bg-green-100">在职</span>
                </td>
              </tr>
              <!-- 列表-人员5: 孙设备 -->
              <tr class="border-b transition-colors hover:bg-muted/50">
                <td class="p-2 align-middle font-medium">孙设备</td>
                <td class="p-2 align-middle">设备管理部</td>
                <td class="p-2 align-middle">部长</td>
                <td class="p-2 align-middle text-xs">13800001005</td>
                <td class="p-2 align-middle text-xs text-muted-foreground">sun@farm.com</td>
                <td class="p-2 align-middle text-xs">2019-11-05</td>
                <td class="p-2 align-middle">
                  <span class="inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 bg-green-100 text-green-700 hover:bg-green-100">在职</span>
                </td>
              </tr>
              <!-- 列表-人员6: 周综合 -->
              <tr class="border-b transition-colors hover:bg-muted/50">
                <td class="p-2 align-middle font-medium">周综合</td>
                <td class="p-2 align-middle">综合管理部</td>
                <td class="p-2 align-middle">部长</td>
                <td class="p-2 align-middle text-xs">13800001006</td>
                <td class="p-2 align-middle text-xs text-muted-foreground">zhou@farm.com</td>
                <td class="p-2 align-middle text-xs">2018-07-20</td>
                <td class="p-2 align-middle">
                  <span class="inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 bg-green-100 text-green-700 hover:bg-green-100">在职</span>
                </td>
              </tr>
              <!-- 列表-人员7: 刘农技1 -->
              <tr class="border-b transition-colors hover:bg-muted/50">
                <td class="p-2 align-middle font-medium">刘农技1</td>
                <td class="p-2 align-middle">农业生产部</td>
                <td class="p-2 align-middle">技术员</td>
                <td class="p-2 align-middle text-xs">13800001007</td>
                <td class="p-2 align-middle text-xs text-muted-foreground">liu1@farm.com</td>
                <td class="p-2 align-middle text-xs">2021-02-15</td>
                <td class="p-2 align-middle">
                  <span class="inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 bg-green-100 text-green-700 hover:bg-green-100">在职</span>
                </td>
              </tr>
              <!-- 列表-人员8: 陈农技2 -->
              <tr class="border-b transition-colors hover:bg-muted/50">
                <td class="p-2 align-middle font-medium">陈农技2</td>
                <td class="p-2 align-middle">农业生产部</td>
                <td class="p-2 align-middle">技术员</td>
                <td class="p-2 align-middle text-xs">13800001008</td>
                <td class="p-2 align-middle text-xs text-muted-foreground">chen2@farm.com</td>
                <td class="p-2 align-middle text-xs">2021-05-10</td>
                <td class="p-2 align-middle">
                  <span class="inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 bg-green-100 text-green-700 hover:bg-green-100">在职</span>
                </td>
              </tr>
              <!-- 列表-人员9: 杨采购1 -->
              <tr class="border-b transition-colors hover:bg-muted/50">
                <td class="p-2 align-middle font-medium">杨采购1</td>
                <td class="p-2 align-middle">农资采购部</td>
                <td class="p-2 align-middle">采购员</td>
                <td class="p-2 align-middle text-xs">13800001009</td>
                <td class="p-2 align-middle text-xs text-muted-foreground">yang@farm.com</td>
                <td class="p-2 align-middle text-xs">2022-03-01</td>
                <td class="p-2 align-middle">
                  <span class="inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 bg-green-100 text-green-700 hover:bg-green-100">在职</span>
                </td>
              </tr>
              <!-- 列表-人员10: 吴技术1 -->
              <tr class="border-b transition-colors hover:bg-muted/50">
                <td class="p-2 align-middle font-medium">吴技术1</td>
                <td class="p-2 align-middle">技术支持部</td>
                <td class="p-2 align-middle">工程师</td>
                <td class="p-2 align-middle text-xs">13800001010</td>
                <td class="p-2 align-middle text-xs text-muted-foreground">wu@farm.com</td>
                <td class="p-2 align-middle text-xs">2020-08-15</td>
                <td class="p-2 align-middle">
                  <span class="inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 bg-gray-100 text-gray-500 hover:bg-gray-100">离职</span>
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
import { Users, Plus, Mail, Phone } from 'lucide-vue-next'

interface Personnel {
  id: number
  name: string
  department: string
  position: string
  phone: string
  email: string
  status: 'active' | 'inactive'
  joinDate: string
}

const personnelList: Personnel[] = [
  { id: 1, name: '张农技', department: '农业生产部', position: '部长', phone: '13800001001', email: 'zhang@farm.com', status: 'active', joinDate: '2018-03-15' },
  { id: 2, name: '李采购', department: '农资采购部', position: '部长', phone: '13800001002', email: 'li@farm.com', status: 'active', joinDate: '2019-06-01' },
  { id: 3, name: '王技术', department: '技术支持部', position: '部长', phone: '13800001003', email: 'wang@farm.com', status: 'active', joinDate: '2017-09-20' },
  { id: 4, name: '赵质检', department: '质量检测部', position: '部长', phone: '13800001004', email: 'zhao@farm.com', status: 'active', joinDate: '2020-01-10' },
  { id: 5, name: '孙设备', department: '设备管理部', position: '部长', phone: '13800001005', email: 'sun@farm.com', status: 'active', joinDate: '2019-11-05' },
  { id: 6, name: '周综合', department: '综合管理部', position: '部长', phone: '13800001006', email: 'zhou@farm.com', status: 'active', joinDate: '2018-07-20' },
  { id: 7, name: '刘农技1', department: '农业生产部', position: '技术员', phone: '13800001007', email: 'liu1@farm.com', status: 'active', joinDate: '2021-02-15' },
  { id: 8, name: '陈农技2', department: '农业生产部', position: '技术员', phone: '13800001008', email: 'chen2@farm.com', status: 'active', joinDate: '2021-05-10' },
  { id: 9, name: '杨采购1', department: '农资采购部', position: '采购员', phone: '13800001009', email: 'yang@farm.com', status: 'active', joinDate: '2022-03-01' },
  { id: 10, name: '吴技术1', department: '技术支持部', position: '工程师', phone: '13800001010', email: 'wu@farm.com', status: 'inactive', joinDate: '2020-08-15' },
]

const activeCount = computed(() => personnelList.filter(p => p.status === 'active').length)
const departmentCoverage = computed(() => new Set(personnelList.map(p => p.department)).size)
</script>
