<template>
  <div class="space-y-6">
    <!-- 页面标题 + 操作 -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold tracking-tight">权限管理</h1>
        <p class="mt-1 text-sm text-muted-foreground">管理系统功能权限与角色授权配置</p>
      </div>
      <button
        id="btn-new-perm"
        class="inline-flex items-center justify-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
      >
        <Plus class="h-4 w-4" />
        新增权限
      </button>
    </div>

    <!-- 统计卡片 -->
    <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <!-- 统计-权限总数 -->
      <div class="rounded-lg border bg-card text-card-foreground shadow-sm">
        <div class="flex items-center gap-4 p-5">
          <div class="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-green-100">
            <Lock class="h-5 w-5 text-green-600" />
          </div>
          <div>
            <p class="text-sm text-muted-foreground">权限总数</p>
            <p class="text-2xl font-bold">{{ permissions.length }}</p>
          </div>
        </div>
      </div>
      <!-- 统计-功能模块 -->
      <div class="rounded-lg border bg-card text-card-foreground shadow-sm">
        <div class="flex items-center gap-4 p-5">
          <div class="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-blue-100">
            <Shield class="h-5 w-5 text-blue-600" />
          </div>
          <div>
            <p class="text-sm text-muted-foreground">功能模块</p>
            <p class="text-2xl font-bold">{{ moduleCount }}</p>
          </div>
        </div>
      </div>
      <!-- 统计-查看/编辑 -->
      <div class="rounded-lg border bg-card text-card-foreground shadow-sm">
        <div class="flex items-center gap-4 p-5">
          <div class="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-amber-100">
            <Key class="h-5 w-5 text-amber-600" />
          </div>
          <div>
            <p class="text-sm text-muted-foreground">查看/编辑</p>
            <p class="text-2xl font-bold">{{ viewPermCount }} <span class="text-sm font-normal text-muted-foreground">/ {{ editPermCount }}</span></p>
          </div>
        </div>
      </div>
      <!-- 统计-管理权限 -->
      <div class="rounded-lg border bg-card text-card-foreground shadow-sm">
        <div class="flex items-center gap-4 p-5">
          <div class="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-purple-100">
            <Shield class="h-5 w-5 text-purple-600" />
          </div>
          <div>
            <p class="text-sm text-muted-foreground">管理权限</p>
            <p class="text-2xl font-bold">{{ managePermCount }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- 权限列表 -->
    <div class="rounded-lg border bg-card text-card-foreground shadow-sm">
      <div class="flex flex-col space-y-1.5 p-6">
        <h3 class="text-lg font-semibold leading-none tracking-tight">权限列表</h3>
        <p class="text-sm text-muted-foreground">所有系统权限及授权角色</p>
      </div>
      <div class="p-6 pt-0">
        <div class="relative w-full overflow-auto">
          <table class="w-full caption-bottom text-sm">
            <thead class="[&_tr]:border-b">
              <tr class="border-b transition-colors hover:bg-muted/50">
                <th class="h-10 px-2 text-left align-middle font-medium text-muted-foreground">权限名称</th>
                <th class="h-10 px-2 text-left align-middle font-medium text-muted-foreground">编码</th>
                <th class="h-10 px-2 text-left align-middle font-medium text-muted-foreground">所属模块</th>
                <th class="h-10 px-2 text-left align-middle font-medium text-muted-foreground">类型</th>
                <th class="h-10 px-2 text-left align-middle font-medium text-muted-foreground">描述</th>
                <th class="h-10 px-2 text-left align-middle font-medium text-muted-foreground">授权角色</th>
              </tr>
            </thead>
            <tbody class="[&_tr:last-child]:border-0">
              <!-- 列表-权限1: 查看地图 -->
              <tr class="border-b transition-colors hover:bg-muted/50">
                <td class="p-2 align-middle font-medium">查看地图</td>
                <td class="p-2 align-middle font-mono text-xs">map:view</td>
                <td class="p-2 align-middle">
                  <span class="inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 bg-emerald-100 text-emerald-700 hover:bg-emerald-100">数字地图</span>
                </td>
                <td class="p-2 align-middle">
                  <span class="inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 bg-blue-100 text-blue-700 hover:bg-blue-100">查看</span>
                </td>
                <td class="p-2 align-middle max-w-[200px] truncate text-xs text-muted-foreground">查看地块分布与状态</td>
                <td class="p-2 align-middle">
                  <div class="flex flex-wrap gap-1">
                    <span class="inline-flex rounded bg-muted px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground">ADMIN</span>
                    <span class="inline-flex rounded bg-muted px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground">MANAGER</span>
                    <span class="inline-flex rounded bg-muted px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground">TECH</span>
                    <span class="inline-flex rounded bg-muted px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground">BUYER</span>
                    <span class="inline-flex rounded bg-muted px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground">QA</span>
                    <span class="inline-flex rounded bg-muted px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground">GUEST</span>
                  </div>
                </td>
              </tr>
              <!-- 列表-权限2: 编辑地块 -->
              <tr class="border-b transition-colors hover:bg-muted/50">
                <td class="p-2 align-middle font-medium">编辑地块</td>
                <td class="p-2 align-middle font-mono text-xs">map:edit</td>
                <td class="p-2 align-middle">
                  <span class="inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 bg-emerald-100 text-emerald-700 hover:bg-emerald-100">数字地图</span>
                </td>
                <td class="p-2 align-middle">
                  <span class="inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 bg-green-100 text-green-700 hover:bg-green-100">编辑</span>
                </td>
                <td class="p-2 align-middle max-w-[200px] truncate text-xs text-muted-foreground">编辑地块信息与状态</td>
                <td class="p-2 align-middle">
                  <div class="flex flex-wrap gap-1">
                    <span class="inline-flex rounded bg-muted px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground">ADMIN</span>
                    <span class="inline-flex rounded bg-muted px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground">MANAGER</span>
                    <span class="inline-flex rounded bg-muted px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground">TECH</span>
                  </div>
                </td>
              </tr>
              <!-- 列表-权限3: 查看方案 -->
              <tr class="border-b transition-colors hover:bg-muted/50">
                <td class="p-2 align-middle font-medium">查看方案</td>
                <td class="p-2 align-middle font-mono text-xs">plan:view</td>
                <td class="p-2 align-middle">
                  <span class="inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 bg-amber-100 text-amber-700 hover:bg-amber-100">种植方案</span>
                </td>
                <td class="p-2 align-middle">
                  <span class="inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 bg-blue-100 text-blue-700 hover:bg-blue-100">查看</span>
                </td>
                <td class="p-2 align-middle max-w-[200px] truncate text-xs text-muted-foreground">查看种植方案列表</td>
                <td class="p-2 align-middle">
                  <div class="flex flex-wrap gap-1">
                    <span class="inline-flex rounded bg-muted px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground">ADMIN</span>
                    <span class="inline-flex rounded bg-muted px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground">MANAGER</span>
                    <span class="inline-flex rounded bg-muted px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground">TECH</span>
                    <span class="inline-flex rounded bg-muted px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground">GUEST</span>
                  </div>
                </td>
              </tr>
              <!-- 列表-权限4: 创建方案 -->
              <tr class="border-b transition-colors hover:bg-muted/50">
                <td class="p-2 align-middle font-medium">创建方案</td>
                <td class="p-2 align-middle font-mono text-xs">plan:create</td>
                <td class="p-2 align-middle">
                  <span class="inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 bg-amber-100 text-amber-700 hover:bg-amber-100">种植方案</span>
                </td>
                <td class="p-2 align-middle">
                  <span class="inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 bg-green-100 text-green-700 hover:bg-green-100">编辑</span>
                </td>
                <td class="p-2 align-middle max-w-[200px] truncate text-xs text-muted-foreground">创建新的种植方案</td>
                <td class="p-2 align-middle">
                  <div class="flex flex-wrap gap-1">
                    <span class="inline-flex rounded bg-muted px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground">ADMIN</span>
                    <span class="inline-flex rounded bg-muted px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground">MANAGER</span>
                  </div>
                </td>
              </tr>
              <!-- 列表-权限5: 删除方案 -->
              <tr class="border-b transition-colors hover:bg-muted/50">
                <td class="p-2 align-middle font-medium">删除方案</td>
                <td class="p-2 align-middle font-mono text-xs">plan:delete</td>
                <td class="p-2 align-middle">
                  <span class="inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 bg-amber-100 text-amber-700 hover:bg-amber-100">种植方案</span>
                </td>
                <td class="p-2 align-middle">
                  <span class="inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 bg-red-100 text-red-700 hover:bg-red-100">删除</span>
                </td>
                <td class="p-2 align-middle max-w-[200px] truncate text-xs text-muted-foreground">删除种植方案</td>
                <td class="p-2 align-middle">
                  <div class="flex flex-wrap gap-1">
                    <span class="inline-flex rounded bg-muted px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground">ADMIN</span>
                  </div>
                </td>
              </tr>
              <!-- 列表-权限6: 查看计划 -->
              <tr class="border-b transition-colors hover:bg-muted/50">
                <td class="p-2 align-middle font-medium">查看计划</td>
                <td class="p-2 align-middle font-mono text-xs">schedule:view</td>
                <td class="p-2 align-middle">
                  <span class="inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 bg-teal-100 text-teal-700 hover:bg-teal-100">种植计划</span>
                </td>
                <td class="p-2 align-middle">
                  <span class="inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 bg-blue-100 text-blue-700 hover:bg-blue-100">查看</span>
                </td>
                <td class="p-2 align-middle max-w-[200px] truncate text-xs text-muted-foreground">查看种植计划与进度</td>
                <td class="p-2 align-middle">
                  <div class="flex flex-wrap gap-1">
                    <span class="inline-flex rounded bg-muted px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground">ADMIN</span>
                    <span class="inline-flex rounded bg-muted px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground">MANAGER</span>
                    <span class="inline-flex rounded bg-muted px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground">TECH</span>
                    <span class="inline-flex rounded bg-muted px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground">GUEST</span>
                  </div>
                </td>
              </tr>
              <!-- 列表-权限7: 执行计划 -->
              <tr class="border-b transition-colors hover:bg-muted/50">
                <td class="p-2 align-middle font-medium">执行计划</td>
                <td class="p-2 align-middle font-mono text-xs">schedule:execute</td>
                <td class="p-2 align-middle">
                  <span class="inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 bg-teal-100 text-teal-700 hover:bg-teal-100">种植计划</span>
                </td>
                <td class="p-2 align-middle">
                  <span class="inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 bg-green-100 text-green-700 hover:bg-green-100">编辑</span>
                </td>
                <td class="p-2 align-middle max-w-[200px] truncate text-xs text-muted-foreground">执行和更新计划任务</td>
                <td class="p-2 align-middle">
                  <div class="flex flex-wrap gap-1">
                    <span class="inline-flex rounded bg-muted px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground">ADMIN</span>
                    <span class="inline-flex rounded bg-muted px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground">MANAGER</span>
                    <span class="inline-flex rounded bg-muted px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground">TECH</span>
                  </div>
                </td>
              </tr>
              <!-- 列表-权限8: 管理计划 -->
              <tr class="border-b transition-colors hover:bg-muted/50">
                <td class="p-2 align-middle font-medium">管理计划</td>
                <td class="p-2 align-middle font-mono text-xs">schedule:manage</td>
                <td class="p-2 align-middle">
                  <span class="inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 bg-teal-100 text-teal-700 hover:bg-teal-100">种植计划</span>
                </td>
                <td class="p-2 align-middle">
                  <span class="inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 bg-purple-100 text-purple-700 hover:bg-purple-100">管理</span>
                </td>
                <td class="p-2 align-middle max-w-[200px] truncate text-xs text-muted-foreground">管理计划配置与分配</td>
                <td class="p-2 align-middle">
                  <div class="flex flex-wrap gap-1">
                    <span class="inline-flex rounded bg-muted px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground">ADMIN</span>
                    <span class="inline-flex rounded bg-muted px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground">MANAGER</span>
                  </div>
                </td>
              </tr>
              <!-- 列表-权限9: 查看需求 -->
              <tr class="border-b transition-colors hover:bg-muted/50">
                <td class="p-2 align-middle font-medium">查看需求</td>
                <td class="p-2 align-middle font-mono text-xs">demand:view</td>
                <td class="p-2 align-middle">
                  <span class="inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 bg-sky-100 text-sky-700 hover:bg-sky-100">农资需求</span>
                </td>
                <td class="p-2 align-middle">
                  <span class="inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 bg-blue-100 text-blue-700 hover:bg-blue-100">查看</span>
                </td>
                <td class="p-2 align-middle max-w-[200px] truncate text-xs text-muted-foreground">查看农资需求清单</td>
                <td class="p-2 align-middle">
                  <div class="flex flex-wrap gap-1">
                    <span class="inline-flex rounded bg-muted px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground">ADMIN</span>
                    <span class="inline-flex rounded bg-muted px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground">MANAGER</span>
                    <span class="inline-flex rounded bg-muted px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground">BUYER</span>
                    <span class="inline-flex rounded bg-muted px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground">GUEST</span>
                  </div>
                </td>
              </tr>
              <!-- 列表-权限10: 创建需求 -->
              <tr class="border-b transition-colors hover:bg-muted/50">
                <td class="p-2 align-middle font-medium">创建需求</td>
                <td class="p-2 align-middle font-mono text-xs">demand:create</td>
                <td class="p-2 align-middle">
                  <span class="inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 bg-sky-100 text-sky-700 hover:bg-sky-100">农资需求</span>
                </td>
                <td class="p-2 align-middle">
                  <span class="inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 bg-green-100 text-green-700 hover:bg-green-100">编辑</span>
                </td>
                <td class="p-2 align-middle max-w-[200px] truncate text-xs text-muted-foreground">创建新的农资需求</td>
                <td class="p-2 align-middle">
                  <div class="flex flex-wrap gap-1">
                    <span class="inline-flex rounded bg-muted px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground">ADMIN</span>
                    <span class="inline-flex rounded bg-muted px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground">MANAGER</span>
                    <span class="inline-flex rounded bg-muted px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground">BUYER</span>
                  </div>
                </td>
              </tr>
              <!-- 列表-权限11: 采购管理 -->
              <tr class="border-b transition-colors hover:bg-muted/50">
                <td class="p-2 align-middle font-medium">采购管理</td>
                <td class="p-2 align-middle font-mono text-xs">demand:purchase</td>
                <td class="p-2 align-middle">
                  <span class="inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 bg-sky-100 text-sky-700 hover:bg-sky-100">农资需求</span>
                </td>
                <td class="p-2 align-middle">
                  <span class="inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 bg-purple-100 text-purple-700 hover:bg-purple-100">管理</span>
                </td>
                <td class="p-2 align-middle max-w-[200px] truncate text-xs text-muted-foreground">管理采购流程与审批</td>
                <td class="p-2 align-middle">
                  <div class="flex flex-wrap gap-1">
                    <span class="inline-flex rounded bg-muted px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground">ADMIN</span>
                    <span class="inline-flex rounded bg-muted px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground">MANAGER</span>
                    <span class="inline-flex rounded bg-muted px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground">BUYER</span>
                  </div>
                </td>
              </tr>
              <!-- 列表-权限12: 查看统计 -->
              <tr class="border-b transition-colors hover:bg-muted/50">
                <td class="p-2 align-middle font-medium">查看统计</td>
                <td class="p-2 align-middle font-mono text-xs">stats:view</td>
                <td class="p-2 align-middle">
                  <span class="inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 bg-indigo-100 text-indigo-700 hover:bg-indigo-100">统计分析</span>
                </td>
                <td class="p-2 align-middle">
                  <span class="inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 bg-blue-100 text-blue-700 hover:bg-blue-100">查看</span>
                </td>
                <td class="p-2 align-middle max-w-[200px] truncate text-xs text-muted-foreground">查看统计报表</td>
                <td class="p-2 align-middle">
                  <div class="flex flex-wrap gap-1">
                    <span class="inline-flex rounded bg-muted px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground">ADMIN</span>
                    <span class="inline-flex rounded bg-muted px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground">MANAGER</span>
                    <span class="inline-flex rounded bg-muted px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground">GUEST</span>
                  </div>
                </td>
              </tr>
              <!-- 列表-权限13: 导出统计 -->
              <tr class="border-b transition-colors hover:bg-muted/50">
                <td class="p-2 align-middle font-medium">导出统计</td>
                <td class="p-2 align-middle font-mono text-xs">stats:export</td>
                <td class="p-2 align-middle">
                  <span class="inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 bg-indigo-100 text-indigo-700 hover:bg-indigo-100">统计分析</span>
                </td>
                <td class="p-2 align-middle">
                  <span class="inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 bg-green-100 text-green-700 hover:bg-green-100">编辑</span>
                </td>
                <td class="p-2 align-middle max-w-[200px] truncate text-xs text-muted-foreground">导出统计数据</td>
                <td class="p-2 align-middle">
                  <div class="flex flex-wrap gap-1">
                    <span class="inline-flex rounded bg-muted px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground">ADMIN</span>
                    <span class="inline-flex rounded bg-muted px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground">MANAGER</span>
                  </div>
                </td>
              </tr>
              <!-- 列表-权限14: 管理作物 -->
              <tr class="border-b transition-colors hover:bg-muted/50">
                <td class="p-2 align-middle font-medium">管理作物</td>
                <td class="p-2 align-middle font-mono text-xs">base:crop</td>
                <td class="p-2 align-middle">
                  <span class="inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 bg-orange-100 text-orange-700 hover:bg-orange-100">基础管理</span>
                </td>
                <td class="p-2 align-middle">
                  <span class="inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 bg-purple-100 text-purple-700 hover:bg-purple-100">管理</span>
                </td>
                <td class="p-2 align-middle max-w-[200px] truncate text-xs text-muted-foreground">管理作物信息</td>
                <td class="p-2 align-middle">
                  <div class="flex flex-wrap gap-1">
                    <span class="inline-flex rounded bg-muted px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground">ADMIN</span>
                    <span class="inline-flex rounded bg-muted px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground">MANAGER</span>
                  </div>
                </td>
              </tr>
              <!-- 列表-权限15: 管理部门 -->
              <tr class="border-b transition-colors hover:bg-muted/50">
                <td class="p-2 align-middle font-medium">管理部门</td>
                <td class="p-2 align-middle font-mono text-xs">sys:dept</td>
                <td class="p-2 align-middle">
                  <span class="inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 bg-gray-100 text-gray-700 hover:bg-gray-100">系统管理</span>
                </td>
                <td class="p-2 align-middle">
                  <span class="inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 bg-purple-100 text-purple-700 hover:bg-purple-100">管理</span>
                </td>
                <td class="p-2 align-middle max-w-[200px] truncate text-xs text-muted-foreground">管理部门信息</td>
                <td class="p-2 align-middle">
                  <div class="flex flex-wrap gap-1">
                    <span class="inline-flex rounded bg-muted px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground">ADMIN</span>
                  </div>
                </td>
              </tr>
              <!-- 列表-权限16: 管理人员 -->
              <tr class="border-b transition-colors hover:bg-muted/50">
                <td class="p-2 align-middle font-medium">管理人员</td>
                <td class="p-2 align-middle font-mono text-xs">sys:user</td>
                <td class="p-2 align-middle">
                  <span class="inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 bg-gray-100 text-gray-700 hover:bg-gray-100">系统管理</span>
                </td>
                <td class="p-2 align-middle">
                  <span class="inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 bg-purple-100 text-purple-700 hover:bg-purple-100">管理</span>
                </td>
                <td class="p-2 align-middle max-w-[200px] truncate text-xs text-muted-foreground">管理用户账号</td>
                <td class="p-2 align-middle">
                  <div class="flex flex-wrap gap-1">
                    <span class="inline-flex rounded bg-muted px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground">ADMIN</span>
                  </div>
                </td>
              </tr>
              <!-- 列表-权限17: 管理角色 -->
              <tr class="border-b transition-colors hover:bg-muted/50">
                <td class="p-2 align-middle font-medium">管理角色</td>
                <td class="p-2 align-middle font-mono text-xs">sys:role</td>
                <td class="p-2 align-middle">
                  <span class="inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 bg-gray-100 text-gray-700 hover:bg-gray-100">系统管理</span>
                </td>
                <td class="p-2 align-middle">
                  <span class="inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 bg-purple-100 text-purple-700 hover:bg-purple-100">管理</span>
                </td>
                <td class="p-2 align-middle max-w-[200px] truncate text-xs text-muted-foreground">管理角色配置</td>
                <td class="p-2 align-middle">
                  <div class="flex flex-wrap gap-1">
                    <span class="inline-flex rounded bg-muted px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground">ADMIN</span>
                  </div>
                </td>
              </tr>
              <!-- 列表-权限18: 管理权限 -->
              <tr class="border-b transition-colors hover:bg-muted/50">
                <td class="p-2 align-middle font-medium">管理权限</td>
                <td class="p-2 align-middle font-mono text-xs">sys:perm</td>
                <td class="p-2 align-middle">
                  <span class="inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 bg-gray-100 text-gray-700 hover:bg-gray-100">系统管理</span>
                </td>
                <td class="p-2 align-middle">
                  <span class="inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 bg-purple-100 text-purple-700 hover:bg-purple-100">管理</span>
                </td>
                <td class="p-2 align-middle max-w-[200px] truncate text-xs text-muted-foreground">管理权限分配</td>
                <td class="p-2 align-middle">
                  <div class="flex flex-wrap gap-1">
                    <span class="inline-flex rounded bg-muted px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground">ADMIN</span>
                  </div>
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
import { Lock, Plus, Shield, Key } from 'lucide-vue-next'

interface Permission {
  id: number
  name: string
  code: string
  module: string
  type: 'view' | 'edit' | 'delete' | 'manage'
  description: string
  roles: string[]
}

const permissions: Permission[] = [
  { id: 1, name: '查看地图', code: 'map:view', module: '数字地图', type: 'view', description: '查看地块分布与状态', roles: ['ADMIN', 'MANAGER', 'TECH', 'BUYER', 'QA', 'GUEST'] },
  { id: 2, name: '编辑地块', code: 'map:edit', module: '数字地图', type: 'edit', description: '编辑地块信息与状态', roles: ['ADMIN', 'MANAGER', 'TECH'] },
  { id: 3, name: '查看方案', code: 'plan:view', module: '种植方案', type: 'view', description: '查看种植方案列表', roles: ['ADMIN', 'MANAGER', 'TECH', 'GUEST'] },
  { id: 4, name: '创建方案', code: 'plan:create', module: '种植方案', type: 'edit', description: '创建新的种植方案', roles: ['ADMIN', 'MANAGER'] },
  { id: 5, name: '删除方案', code: 'plan:delete', module: '种植方案', type: 'delete', description: '删除种植方案', roles: ['ADMIN'] },
  { id: 6, name: '查看计划', code: 'schedule:view', module: '种植计划', type: 'view', description: '查看种植计划与进度', roles: ['ADMIN', 'MANAGER', 'TECH', 'GUEST'] },
  { id: 7, name: '执行计划', code: 'schedule:execute', module: '种植计划', type: 'edit', description: '执行和更新计划任务', roles: ['ADMIN', 'MANAGER', 'TECH'] },
  { id: 8, name: '管理计划', code: 'schedule:manage', module: '种植计划', type: 'manage', description: '管理计划配置与分配', roles: ['ADMIN', 'MANAGER'] },
  { id: 9, name: '查看需求', code: 'demand:view', module: '农资需求', type: 'view', description: '查看农资需求清单', roles: ['ADMIN', 'MANAGER', 'BUYER', 'GUEST'] },
  { id: 10, name: '创建需求', code: 'demand:create', module: '农资需求', type: 'edit', description: '创建新的农资需求', roles: ['ADMIN', 'MANAGER', 'BUYER'] },
  { id: 11, name: '采购管理', code: 'demand:purchase', module: '农资需求', type: 'manage', description: '管理采购流程与审批', roles: ['ADMIN', 'MANAGER', 'BUYER'] },
  { id: 12, name: '查看统计', code: 'stats:view', module: '统计分析', type: 'view', description: '查看统计报表', roles: ['ADMIN', 'MANAGER', 'GUEST'] },
  { id: 13, name: '导出统计', code: 'stats:export', module: '统计分析', type: 'edit', description: '导出统计数据', roles: ['ADMIN', 'MANAGER'] },
  { id: 14, name: '管理作物', code: 'base:crop', module: '基础管理', type: 'manage', description: '管理作物信息', roles: ['ADMIN', 'MANAGER'] },
  { id: 15, name: '管理部门', code: 'sys:dept', module: '系统管理', type: 'manage', description: '管理部门信息', roles: ['ADMIN'] },
  { id: 16, name: '管理人员', code: 'sys:user', module: '系统管理', type: 'manage', description: '管理用户账号', roles: ['ADMIN'] },
  { id: 17, name: '管理角色', code: 'sys:role', module: '系统管理', type: 'manage', description: '管理角色配置', roles: ['ADMIN'] },
  { id: 18, name: '管理权限', code: 'sys:perm', module: '系统管理', type: 'manage', description: '管理权限分配', roles: ['ADMIN'] },
]

const moduleCount = computed(() => new Set(permissions.map(p => p.module)).size)
const viewPermCount = computed(() => permissions.filter(p => p.type === 'view').length)
const editPermCount = computed(() => permissions.filter(p => p.type === 'edit').length)
const managePermCount = computed(() => permissions.filter(p => p.type === 'manage').length)
</script>
