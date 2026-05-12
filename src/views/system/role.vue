<template>
  <div class="space-y-6">
    <!-- 页面标题 + 操作 -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold tracking-tight">角色管理</h1>
        <p class="mt-1 text-sm text-muted-foreground">管理系统角色及其关联的权限配置</p>
      </div>
      <button
        id="btn-new-role"
        class="inline-flex items-center justify-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
      >
        <Plus class="h-4 w-4" />
        新增角色
      </button>
    </div>

    <!-- 统计卡片 -->
    <div class="grid grid-cols-1 gap-4 sm:grid-cols-3">
      <!-- 统计-角色总数 -->
      <div class="rounded-lg border bg-card text-card-foreground shadow-sm">
        <div class="flex items-center gap-4 p-5">
          <div class="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-green-100">
            <Shield class="h-5 w-5 text-green-600" />
          </div>
          <div>
            <p class="text-sm text-muted-foreground">角色总数</p>
            <p class="text-2xl font-bold">{{ roles.length }}</p>
          </div>
        </div>
      </div>
      <!-- 统计-关联人员 -->
      <div class="rounded-lg border bg-card text-card-foreground shadow-sm">
        <div class="flex items-center gap-4 p-5">
          <div class="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-blue-100">
            <Users class="h-5 w-5 text-blue-600" />
          </div>
          <div>
            <p class="text-sm text-muted-foreground">关联人员</p>
            <p class="text-2xl font-bold">{{ totalMembers }}</p>
          </div>
        </div>
      </div>
      <!-- 统计-权限总配置 -->
      <div class="rounded-lg border bg-card text-card-foreground shadow-sm">
        <div class="flex items-center gap-4 p-5">
          <div class="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-amber-100">
            <Key class="h-5 w-5 text-amber-600" />
          </div>
          <div>
            <p class="text-sm text-muted-foreground">权限总配置</p>
            <p class="text-2xl font-bold">{{ totalPermissions }} <span class="text-sm font-normal text-muted-foreground">项</span></p>
          </div>
        </div>
      </div>
    </div>

    <!-- 角色列表 -->
    <div class="rounded-lg border bg-card text-card-foreground shadow-sm">
      <div class="flex flex-col space-y-1.5 p-6">
        <h3 class="text-lg font-semibold leading-none tracking-tight">角色列表</h3>
        <p class="text-sm text-muted-foreground">所有角色的权限与关联信息</p>
      </div>
      <div class="p-6 pt-0">
        <div class="relative w-full overflow-auto">
          <table class="w-full caption-bottom text-sm">
            <thead class="[&_tr]:border-b">
              <tr class="border-b transition-colors hover:bg-muted/50">
                <th class="h-10 px-2 text-left align-middle font-medium text-muted-foreground">角色名称</th>
                <th class="h-10 px-2 text-left align-middle font-medium text-muted-foreground">编码</th>
                <th class="h-10 px-2 text-right align-middle font-medium text-muted-foreground">关联人员</th>
                <th class="h-10 px-2 text-right align-middle font-medium text-muted-foreground">权限数</th>
                <th class="h-10 px-2 text-left align-middle font-medium text-muted-foreground">描述</th>
                <th class="h-10 px-2 text-left align-middle font-medium text-muted-foreground">状态</th>
              </tr>
            </thead>
            <tbody class="[&_tr:last-child]:border-0">
              <!-- 列表-角色1: 系统管理员 -->
              <tr class="border-b transition-colors hover:bg-muted/50">
                <td class="p-2 align-middle font-medium">系统管理员</td>
                <td class="p-2 align-middle font-mono text-xs">ADMIN</td>
                <td class="p-2 align-middle text-right">2</td>
                <td class="p-2 align-middle text-right">28</td>
                <td class="p-2 align-middle max-w-[250px] truncate text-xs text-muted-foreground">拥有系统全部权限，可管理所有模块</td>
                <td class="p-2 align-middle">
                  <span class="inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 bg-green-100 text-green-700 hover:bg-green-100">启用</span>
                </td>
              </tr>
              <!-- 列表-角色2: 农场主管 -->
              <tr class="border-b transition-colors hover:bg-muted/50">
                <td class="p-2 align-middle font-medium">农场主管</td>
                <td class="p-2 align-middle font-mono text-xs">MANAGER</td>
                <td class="p-2 align-middle text-right">3</td>
                <td class="p-2 align-middle text-right">20</td>
                <td class="p-2 align-middle max-w-[250px] truncate text-xs text-muted-foreground">管理种植方案、计划和农资需求</td>
                <td class="p-2 align-middle">
                  <span class="inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 bg-green-100 text-green-700 hover:bg-green-100">启用</span>
                </td>
              </tr>
              <!-- 列表-角色3: 农技人员 -->
              <tr class="border-b transition-colors hover:bg-muted/50">
                <td class="p-2 align-middle font-medium">农技人员</td>
                <td class="p-2 align-middle font-mono text-xs">TECH</td>
                <td class="p-2 align-middle text-right">8</td>
                <td class="p-2 align-middle text-right">12</td>
                <td class="p-2 align-middle max-w-[250px] truncate text-xs text-muted-foreground">执行种植计划、记录农事数据</td>
                <td class="p-2 align-middle">
                  <span class="inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 bg-green-100 text-green-700 hover:bg-green-100">启用</span>
                </td>
              </tr>
              <!-- 列表-角色4: 采购人员 -->
              <tr class="border-b transition-colors hover:bg-muted/50">
                <td class="p-2 align-middle font-medium">采购人员</td>
                <td class="p-2 align-middle font-mono text-xs">BUYER</td>
                <td class="p-2 align-middle text-right">4</td>
                <td class="p-2 align-middle text-right">8</td>
                <td class="p-2 align-middle max-w-[250px] truncate text-xs text-muted-foreground">管理农资采购与供应商</td>
                <td class="p-2 align-middle">
                  <span class="inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 bg-green-100 text-green-700 hover:bg-green-100">启用</span>
                </td>
              </tr>
              <!-- 列表-角色5: 质检人员 -->
              <tr class="border-b transition-colors hover:bg-muted/50">
                <td class="p-2 align-middle font-medium">质检人员</td>
                <td class="p-2 align-middle font-mono text-xs">QA</td>
                <td class="p-2 align-middle text-right">3</td>
                <td class="p-2 align-middle text-right">6</td>
                <td class="p-2 align-middle max-w-[250px] truncate text-xs text-muted-foreground">负责农产品质量检测</td>
                <td class="p-2 align-middle">
                  <span class="inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 bg-green-100 text-green-700 hover:bg-green-100">启用</span>
                </td>
              </tr>
              <!-- 列表-角色6: 访客 -->
              <tr class="border-b transition-colors hover:bg-muted/50">
                <td class="p-2 align-middle font-medium">访客</td>
                <td class="p-2 align-middle font-mono text-xs">GUEST</td>
                <td class="p-2 align-middle text-right">1</td>
                <td class="p-2 align-middle text-right">3</td>
                <td class="p-2 align-middle max-w-[250px] truncate text-xs text-muted-foreground">只读权限，仅可查看部分数据</td>
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
import { Shield, Plus, Users, Key } from 'lucide-vue-next'

interface Role {
  id: number
  name: string
  code: string
  memberCount: number
  permissionCount: number
  description: string
  status: 'active' | 'inactive'
}

const roles: Role[] = [
  { id: 1, name: '系统管理员', code: 'ADMIN', memberCount: 2, permissionCount: 28, description: '拥有系统全部权限，可管理所有模块', status: 'active' },
  { id: 2, name: '农场主管', code: 'MANAGER', memberCount: 3, permissionCount: 20, description: '管理种植方案、计划和农资需求', status: 'active' },
  { id: 3, name: '农技人员', code: 'TECH', memberCount: 8, permissionCount: 12, description: '执行种植计划、记录农事数据', status: 'active' },
  { id: 4, name: '采购人员', code: 'BUYER', memberCount: 4, permissionCount: 8, description: '管理农资采购与供应商', status: 'active' },
  { id: 5, name: '质检人员', code: 'QA', memberCount: 3, permissionCount: 6, description: '负责农产品质量检测', status: 'active' },
  { id: 6, name: '访客', code: 'GUEST', memberCount: 1, permissionCount: 3, description: '只读权限，仅可查看部分数据', status: 'active' },
]

const totalPermissions = computed(() => roles.reduce((sum, r) => sum + r.permissionCount, 0))
const totalMembers = computed(() => roles.reduce((sum, r) => sum + r.memberCount, 0))
</script>
