<template>
  <div class="space-y-6">
    <!-- 页面标题 -->
    <div>
      <h1 class="text-2xl font-bold tracking-tight">种植档案</h1>
      <p class="mt-1 text-sm text-muted-foreground">实时查看农场地块分布、作物生长状态和环境数据</p>
    </div>

    <!-- 统计卡片 -->
    <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <!-- 统计-总地块 -->
      <div class="rounded-lg border bg-card text-card-foreground shadow-sm">
        <div class="flex items-center gap-4 p-5">
          <div class="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-green-100">
            <MapPin class="h-5 w-5 text-green-600" />
          </div>
          <div>
            <p class="text-sm text-muted-foreground">总地块</p>
            <p class="text-2xl font-bold">{{ plots.length }}</p>
          </div>
        </div>
      </div>
      <!-- 统计-平均湿度 -->
      <div class="rounded-lg border bg-card text-card-foreground shadow-sm">
        <div class="flex items-center gap-4 p-5">
          <div class="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-sky-100">
            <Droplets class="h-5 w-5 text-sky-600" />
          </div>
          <div>
            <p class="text-sm text-muted-foreground">平均湿度</p>
            <p class="text-2xl font-bold">{{ avgMoisture }}%</p>
          </div>
        </div>
      </div>
      <!-- 统计-生长中 -->
      <div class="rounded-lg border bg-card text-card-foreground shadow-sm">
        <div class="flex items-center gap-4 p-5">
          <div class="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-emerald-100">
            <Leaf class="h-5 w-5 text-emerald-600" />
          </div>
          <div>
            <p class="text-sm text-muted-foreground">生长中</p>
            <p class="text-2xl font-bold">{{ growingCount }}</p>
          </div>
        </div>
      </div>
      <!-- 统计-总面积/已收获 -->
      <div class="rounded-lg border bg-card text-card-foreground shadow-sm">
        <div class="flex items-center gap-4 p-5">
          <div class="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-amber-100">
            <Sun class="h-5 w-5 text-amber-600" />
          </div>
          <div>
            <p class="text-sm text-muted-foreground">总面积/已收获</p>
            <p class="text-2xl font-bold">{{ totalArea }} <span class="text-sm font-normal text-muted-foreground">亩 / {{ harvestedCount }}块</span></p>
          </div>
        </div>
      </div>
    </div>

    <!-- 地块分布 -->
    <div class="rounded-lg border bg-card text-card-foreground shadow-sm">
      <div class="flex flex-col space-y-1.5 p-6">
        <h3 class="text-lg font-semibold leading-none tracking-tight">地块分布</h3>
        <p class="text-sm text-muted-foreground">点击地块查看详细信息，不同颜色代表不同生长状态</p>
      </div>
      <div class="p-6 pt-0">
        <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          <!-- 列表-地块A1区 -->
          <div class="group relative overflow-hidden rounded-lg border bg-card text-card-foreground shadow-sm transition-shadow hover:shadow-md">
            <div class="absolute left-0 top-0 h-1 w-full bg-green-500" />
            <div class="flex flex-col space-y-1.5 pb-2 pt-4 px-6">
              <div class="flex items-center justify-between">
                <span class="text-base font-semibold">A1区</span>
                <span class="inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 bg-green-100 text-green-800 hover:bg-green-100">生长中</span>
              </div>
              <p class="text-xs text-muted-foreground">水稻 · 120亩</p>
            </div>
            <div class="space-y-3 pb-4 px-6">
              <div class="flex items-center gap-4 text-xs text-muted-foreground">
                <div class="flex items-center gap-1">
                  <Droplets class="h-3.5 w-3.5 text-sky-500" />
                  <span>湿度 78%</span>
                </div>
                <div class="flex items-center gap-1">
                  <Leaf class="h-3.5 w-3.5 text-green-500" />
                  <span>长势 65%</span>
                </div>
              </div>
              <div class="space-y-1">
                <div class="flex items-center justify-between text-xs">
                  <span class="text-muted-foreground">生长进度</span>
                  <span class="font-medium">65%</span>
                </div>
                <div class="h-1.5 w-full overflow-hidden rounded-full bg-primary/20">
                  <div class="h-full rounded-full bg-primary transition-all" :style="{ width: '65%' }" />
                </div>
              </div>
            </div>
          </div>
          <!-- 列表-地块A2区 -->
          <div class="group relative overflow-hidden rounded-lg border bg-card text-card-foreground shadow-sm transition-shadow hover:shadow-md">
            <div class="absolute left-0 top-0 h-1 w-full bg-amber-500" />
            <div class="flex flex-col space-y-1.5 pb-2 pt-4 px-6">
              <div class="flex items-center justify-between">
                <span class="text-base font-semibold">A2区</span>
                <span class="inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 bg-amber-100 text-amber-800 hover:bg-amber-100">已收获</span>
              </div>
              <p class="text-xs text-muted-foreground">小麦 · 85亩</p>
            </div>
            <div class="space-y-3 pb-4 px-6">
              <div class="flex items-center gap-4 text-xs text-muted-foreground">
                <div class="flex items-center gap-1">
                  <Droplets class="h-3.5 w-3.5 text-sky-500" />
                  <span>湿度 32%</span>
                </div>
                <div class="flex items-center gap-1">
                  <Leaf class="h-3.5 w-3.5 text-green-500" />
                  <span>长势 100%</span>
                </div>
              </div>
              <div class="space-y-1">
                <div class="flex items-center justify-between text-xs">
                  <span class="text-muted-foreground">生长进度</span>
                  <span class="font-medium">100%</span>
                </div>
                <div class="h-1.5 w-full overflow-hidden rounded-full bg-primary/20">
                  <div class="h-full rounded-full bg-primary transition-all" :style="{ width: '100%' }" />
                </div>
              </div>
            </div>
          </div>
          <!-- 列表-地块A3区 -->
          <div class="group relative overflow-hidden rounded-lg border bg-card text-card-foreground shadow-sm transition-shadow hover:shadow-md">
            <div class="absolute left-0 top-0 h-1 w-full bg-green-500" />
            <div class="flex flex-col space-y-1.5 pb-2 pt-4 px-6">
              <div class="flex items-center justify-between">
                <span class="text-base font-semibold">A3区</span>
                <span class="inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 bg-green-100 text-green-800 hover:bg-green-100">生长中</span>
              </div>
              <p class="text-xs text-muted-foreground">玉米 · 95亩</p>
            </div>
            <div class="space-y-3 pb-4 px-6">
              <div class="flex items-center gap-4 text-xs text-muted-foreground">
                <div class="flex items-center gap-1">
                  <Droplets class="h-3.5 w-3.5 text-sky-500" />
                  <span>湿度 65%</span>
                </div>
                <div class="flex items-center gap-1">
                  <Leaf class="h-3.5 w-3.5 text-green-500" />
                  <span>长势 45%</span>
                </div>
              </div>
              <div class="space-y-1">
                <div class="flex items-center justify-between text-xs">
                  <span class="text-muted-foreground">生长进度</span>
                  <span class="font-medium">45%</span>
                </div>
                <div class="h-1.5 w-full overflow-hidden rounded-full bg-primary/20">
                  <div class="h-full rounded-full bg-primary transition-all" :style="{ width: '45%' }" />
                </div>
              </div>
            </div>
          </div>
          <!-- 列表-地块B1区 -->
          <div class="group relative overflow-hidden rounded-lg border bg-card text-card-foreground shadow-sm transition-shadow hover:shadow-md">
            <div class="absolute left-0 top-0 h-1 w-full bg-sky-500" />
            <div class="flex flex-col space-y-1.5 pb-2 pt-4 px-6">
              <div class="flex items-center justify-between">
                <span class="text-base font-semibold">B1区</span>
                <span class="inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 bg-sky-100 text-sky-800 hover:bg-sky-100">已播种</span>
              </div>
              <p class="text-xs text-muted-foreground">大豆 · 60亩</p>
            </div>
            <div class="space-y-3 pb-4 px-6">
              <div class="flex items-center gap-4 text-xs text-muted-foreground">
                <div class="flex items-center gap-1">
                  <Droplets class="h-3.5 w-3.5 text-sky-500" />
                  <span>湿度 55%</span>
                </div>
                <div class="flex items-center gap-1">
                  <Leaf class="h-3.5 w-3.5 text-green-500" />
                  <span>长势 10%</span>
                </div>
              </div>
              <div class="space-y-1">
                <div class="flex items-center justify-between text-xs">
                  <span class="text-muted-foreground">生长进度</span>
                  <span class="font-medium">10%</span>
                </div>
                <div class="h-1.5 w-full overflow-hidden rounded-full bg-primary/20">
                  <div class="h-full rounded-full bg-primary transition-all" :style="{ width: '10%' }" />
                </div>
              </div>
            </div>
          </div>
          <!-- 列表-地块B2区 -->
          <div class="group relative overflow-hidden rounded-lg border bg-card text-card-foreground shadow-sm transition-shadow hover:shadow-md">
            <div class="absolute left-0 top-0 h-1 w-full bg-green-500" />
            <div class="flex flex-col space-y-1.5 pb-2 pt-4 px-6">
              <div class="flex items-center justify-between">
                <span class="text-base font-semibold">B2区</span>
                <span class="inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 bg-green-100 text-green-800 hover:bg-green-100">生长中</span>
              </div>
              <p class="text-xs text-muted-foreground">棉花 · 110亩</p>
            </div>
            <div class="space-y-3 pb-4 px-6">
              <div class="flex items-center gap-4 text-xs text-muted-foreground">
                <div class="flex items-center gap-1">
                  <Droplets class="h-3.5 w-3.5 text-sky-500" />
                  <span>湿度 70%</span>
                </div>
                <div class="flex items-center gap-1">
                  <Leaf class="h-3.5 w-3.5 text-green-500" />
                  <span>长势 72%</span>
                </div>
              </div>
              <div class="space-y-1">
                <div class="flex items-center justify-between text-xs">
                  <span class="text-muted-foreground">生长进度</span>
                  <span class="font-medium">72%</span>
                </div>
                <div class="h-1.5 w-full overflow-hidden rounded-full bg-primary/20">
                  <div class="h-full rounded-full bg-primary transition-all" :style="{ width: '72%' }" />
                </div>
              </div>
            </div>
          </div>
          <!-- 列表-地块B3区 -->
          <div class="group relative overflow-hidden rounded-lg border bg-card text-card-foreground shadow-sm transition-shadow hover:shadow-md">
            <div class="absolute left-0 top-0 h-1 w-full bg-gray-400" />
            <div class="flex flex-col space-y-1.5 pb-2 pt-4 px-6">
              <div class="flex items-center justify-between">
                <span class="text-base font-semibold">B3区</span>
                <span class="inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 bg-gray-100 text-gray-600 hover:bg-gray-100">休耕</span>
              </div>
              <p class="text-xs text-muted-foreground">暂无作物 · 75亩</p>
            </div>
            <div class="space-y-3 pb-4 px-6">
              <div class="flex items-center gap-4 text-xs text-muted-foreground">
                <div class="flex items-center gap-1">
                  <Droplets class="h-3.5 w-3.5 text-sky-500" />
                  <span>湿度 40%</span>
                </div>
                <div class="flex items-center gap-1">
                  <Leaf class="h-3.5 w-3.5 text-green-500" />
                  <span>长势 0%</span>
                </div>
              </div>
              <div class="space-y-1">
                <div class="flex items-center justify-between text-xs">
                  <span class="text-muted-foreground">生长进度</span>
                  <span class="font-medium">0%</span>
                </div>
                <div class="h-1.5 w-full overflow-hidden rounded-full bg-primary/20">
                  <div class="h-full rounded-full bg-primary transition-all" :style="{ width: '0%' }" />
                </div>
              </div>
            </div>
          </div>
          <!-- 列表-地块C1区 -->
          <div class="group relative overflow-hidden rounded-lg border bg-card text-card-foreground shadow-sm transition-shadow hover:shadow-md">
            <div class="absolute left-0 top-0 h-1 w-full bg-green-500" />
            <div class="flex flex-col space-y-1.5 pb-2 pt-4 px-6">
              <div class="flex items-center justify-between">
                <span class="text-base font-semibold">C1区</span>
                <span class="inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 bg-green-100 text-green-800 hover:bg-green-100">生长中</span>
              </div>
              <p class="text-xs text-muted-foreground">水稻 · 130亩</p>
            </div>
            <div class="space-y-3 pb-4 px-6">
              <div class="flex items-center gap-4 text-xs text-muted-foreground">
                <div class="flex items-center gap-1">
                  <Droplets class="h-3.5 w-3.5 text-sky-500" />
                  <span>湿度 82%</span>
                </div>
                <div class="flex items-center gap-1">
                  <Leaf class="h-3.5 w-3.5 text-green-500" />
                  <span>长势 55%</span>
                </div>
              </div>
              <div class="space-y-1">
                <div class="flex items-center justify-between text-xs">
                  <span class="text-muted-foreground">生长进度</span>
                  <span class="font-medium">55%</span>
                </div>
                <div class="h-1.5 w-full overflow-hidden rounded-full bg-primary/20">
                  <div class="h-full rounded-full bg-primary transition-all" :style="{ width: '55%' }" />
                </div>
              </div>
            </div>
          </div>
          <!-- 列表-地块C2区 -->
          <div class="group relative overflow-hidden rounded-lg border bg-card text-card-foreground shadow-sm transition-shadow hover:shadow-md">
            <div class="absolute left-0 top-0 h-1 w-full bg-sky-500" />
            <div class="flex flex-col space-y-1.5 pb-2 pt-4 px-6">
              <div class="flex items-center justify-between">
                <span class="text-base font-semibold">C2区</span>
                <span class="inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 bg-sky-100 text-sky-800 hover:bg-sky-100">已播种</span>
              </div>
              <p class="text-xs text-muted-foreground">油菜 · 70亩</p>
            </div>
            <div class="space-y-3 pb-4 px-6">
              <div class="flex items-center gap-4 text-xs text-muted-foreground">
                <div class="flex items-center gap-1">
                  <Droplets class="h-3.5 w-3.5 text-sky-500" />
                  <span>湿度 48%</span>
                </div>
                <div class="flex items-center gap-1">
                  <Leaf class="h-3.5 w-3.5 text-green-500" />
                  <span>长势 5%</span>
                </div>
              </div>
              <div class="space-y-1">
                <div class="flex items-center justify-between text-xs">
                  <span class="text-muted-foreground">生长进度</span>
                  <span class="font-medium">5%</span>
                </div>
                <div class="h-1.5 w-full overflow-hidden rounded-full bg-primary/20">
                  <div class="h-full rounded-full bg-primary transition-all" :style="{ width: '5%' }" />
                </div>
              </div>
            </div>
          </div>
          <!-- 列表-地块C3区 -->
          <div class="group relative overflow-hidden rounded-lg border bg-card text-card-foreground shadow-sm transition-shadow hover:shadow-md">
            <div class="absolute left-0 top-0 h-1 w-full bg-green-500" />
            <div class="flex flex-col space-y-1.5 pb-2 pt-4 px-6">
              <div class="flex items-center justify-between">
                <span class="text-base font-semibold">C3区</span>
                <span class="inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 bg-green-100 text-green-800 hover:bg-green-100">生长中</span>
              </div>
              <p class="text-xs text-muted-foreground">花生 · 55亩</p>
            </div>
            <div class="space-y-3 pb-4 px-6">
              <div class="flex items-center gap-4 text-xs text-muted-foreground">
                <div class="flex items-center gap-1">
                  <Droplets class="h-3.5 w-3.5 text-sky-500" />
                  <span>湿度 60%</span>
                </div>
                <div class="flex items-center gap-1">
                  <Leaf class="h-3.5 w-3.5 text-green-500" />
                  <span>长势 80%</span>
                </div>
              </div>
              <div class="space-y-1">
                <div class="flex items-center justify-between text-xs">
                  <span class="text-muted-foreground">生长进度</span>
                  <span class="font-medium">80%</span>
                </div>
                <div class="h-1.5 w-full overflow-hidden rounded-full bg-primary/20">
                  <div class="h-full rounded-full bg-primary transition-all" :style="{ width: '80%' }" />
                </div>
              </div>
            </div>
          </div>
          <!-- 列表-地块D1区 -->
          <div class="group relative overflow-hidden rounded-lg border bg-card text-card-foreground shadow-sm transition-shadow hover:shadow-md">
            <div class="absolute left-0 top-0 h-1 w-full bg-green-500" />
            <div class="flex flex-col space-y-1.5 pb-2 pt-4 px-6">
              <div class="flex items-center justify-between">
                <span class="text-base font-semibold">D1区</span>
                <span class="inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 bg-green-100 text-green-800 hover:bg-green-100">生长中</span>
              </div>
              <p class="text-xs text-muted-foreground">红薯 · 45亩</p>
            </div>
            <div class="space-y-3 pb-4 px-6">
              <div class="flex items-center gap-4 text-xs text-muted-foreground">
                <div class="flex items-center gap-1">
                  <Droplets class="h-3.5 w-3.5 text-sky-500" />
                  <span>湿度 55%</span>
                </div>
                <div class="flex items-center gap-1">
                  <Leaf class="h-3.5 w-3.5 text-green-500" />
                  <span>长势 35%</span>
                </div>
              </div>
              <div class="space-y-1">
                <div class="flex items-center justify-between text-xs">
                  <span class="text-muted-foreground">生长进度</span>
                  <span class="font-medium">35%</span>
                </div>
                <div class="h-1.5 w-full overflow-hidden rounded-full bg-primary/20">
                  <div class="h-full rounded-full bg-primary transition-all" :style="{ width: '35%' }" />
                </div>
              </div>
            </div>
          </div>
          <!-- 列表-地块D2区 -->
          <div class="group relative overflow-hidden rounded-lg border bg-card text-card-foreground shadow-sm transition-shadow hover:shadow-md">
            <div class="absolute left-0 top-0 h-1 w-full bg-amber-500" />
            <div class="flex flex-col space-y-1.5 pb-2 pt-4 px-6">
              <div class="flex items-center justify-between">
                <span class="text-base font-semibold">D2区</span>
                <span class="inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 bg-amber-100 text-amber-800 hover:bg-amber-100">已收获</span>
              </div>
              <p class="text-xs text-muted-foreground">小麦 · 90亩</p>
            </div>
            <div class="space-y-3 pb-4 px-6">
              <div class="flex items-center gap-4 text-xs text-muted-foreground">
                <div class="flex items-center gap-1">
                  <Droplets class="h-3.5 w-3.5 text-sky-500" />
                  <span>湿度 28%</span>
                </div>
                <div class="flex items-center gap-1">
                  <Leaf class="h-3.5 w-3.5 text-green-500" />
                  <span>长势 100%</span>
                </div>
              </div>
              <div class="space-y-1">
                <div class="flex items-center justify-between text-xs">
                  <span class="text-muted-foreground">生长进度</span>
                  <span class="font-medium">100%</span>
                </div>
                <div class="h-1.5 w-full overflow-hidden rounded-full bg-primary/20">
                  <div class="h-full rounded-full bg-primary transition-all" :style="{ width: '100%' }" />
                </div>
              </div>
            </div>
          </div>
          <!-- 列表-地块D3区 -->
          <div class="group relative overflow-hidden rounded-lg border bg-card text-card-foreground shadow-sm transition-shadow hover:shadow-md">
            <div class="absolute left-0 top-0 h-1 w-full bg-green-500" />
            <div class="flex flex-col space-y-1.5 pb-2 pt-4 px-6">
              <div class="flex items-center justify-between">
                <span class="text-base font-semibold">D3区</span>
                <span class="inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 bg-green-100 text-green-800 hover:bg-green-100">生长中</span>
              </div>
              <p class="text-xs text-muted-foreground">茶叶 · 80亩</p>
            </div>
            <div class="space-y-3 pb-4 px-6">
              <div class="flex items-center gap-4 text-xs text-muted-foreground">
                <div class="flex items-center gap-1">
                  <Droplets class="h-3.5 w-3.5 text-sky-500" />
                  <span>湿度 75%</span>
                </div>
                <div class="flex items-center gap-1">
                  <Leaf class="h-3.5 w-3.5 text-green-500" />
                  <span>长势 60%</span>
                </div>
              </div>
              <div class="space-y-1">
                <div class="flex items-center justify-between text-xs">
                  <span class="text-muted-foreground">生长进度</span>
                  <span class="font-medium">60%</span>
                </div>
                <div class="h-1.5 w-full overflow-hidden rounded-full bg-primary/20">
                  <div class="h-full rounded-full bg-primary transition-all" :style="{ width: '60%' }" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 状态图例 -->
    <div class="rounded-lg border bg-card text-card-foreground shadow-sm">
      <div class="flex flex-col space-y-1.5 p-6 pb-3">
        <h3 class="text-sm font-medium leading-none tracking-tight">状态图例</h3>
      </div>
      <div class="p-6 pt-0">
        <div class="flex flex-wrap gap-6">
          <!-- 图例-生长中 -->
          <div class="flex items-center gap-2">
            <div class="h-3 w-3 rounded-full bg-green-500" />
            <span class="text-sm text-muted-foreground">生长中</span>
          </div>
          <!-- 图例-已收获 -->
          <div class="flex items-center gap-2">
            <div class="h-3 w-3 rounded-full bg-amber-500" />
            <span class="text-sm text-muted-foreground">已收获</span>
          </div>
          <!-- 图例-休耕 -->
          <div class="flex items-center gap-2">
            <div class="h-3 w-3 rounded-full bg-gray-400" />
            <span class="text-sm text-muted-foreground">休耕</span>
          </div>
          <!-- 图例-已播种 -->
          <div class="flex items-center gap-2">
            <div class="h-3 w-3 rounded-full bg-sky-500" />
            <span class="text-sm text-muted-foreground">已播种</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { MapPin, Droplets, Leaf, Sun } from 'lucide-vue-next'

interface PlotData {
  id: string
  name: string
  crop: string
  area: number
  status: 'growing' | 'harvested' | 'fallow' | 'seeded'
  moisture: number
  growth: number
}

const plots: PlotData[] = [
  { id: 'A1', name: 'A1区', crop: '水稻', area: 120, status: 'growing', moisture: 78, growth: 65 },
  { id: 'A2', name: 'A2区', crop: '小麦', area: 85, status: 'harvested', moisture: 32, growth: 100 },
  { id: 'A3', name: 'A3区', crop: '玉米', area: 95, status: 'growing', moisture: 65, growth: 45 },
  { id: 'B1', name: 'B1区', crop: '大豆', area: 60, status: 'seeded', moisture: 55, growth: 10 },
  { id: 'B2', name: 'B2区', crop: '棉花', area: 110, status: 'growing', moisture: 70, growth: 72 },
  { id: 'B3', name: 'B3区', crop: '', area: 75, status: 'fallow', moisture: 40, growth: 0 },
  { id: 'C1', name: 'C1区', crop: '水稻', area: 130, status: 'growing', moisture: 82, growth: 55 },
  { id: 'C2', name: 'C2区', crop: '油菜', area: 70, status: 'seeded', moisture: 48, growth: 5 },
  { id: 'C3', name: 'C3区', crop: '花生', area: 55, status: 'growing', moisture: 60, growth: 80 },
  { id: 'D1', name: 'D1区', crop: '红薯', area: 45, status: 'growing', moisture: 55, growth: 35 },
  { id: 'D2', name: 'D2区', crop: '小麦', area: 90, status: 'harvested', moisture: 28, growth: 100 },
  { id: 'D3', name: 'D3区', crop: '茶叶', area: 80, status: 'growing', moisture: 75, growth: 60 },
]

const totalArea = computed(() => plots.reduce((sum, p) => sum + p.area, 0))
const growingCount = computed(() => plots.filter((p) => p.status === 'growing').length)
const harvestedCount = computed(() => plots.filter((p) => p.status === 'harvested').length)
const avgMoisture = computed(() => Math.round(plots.reduce((sum, p) => sum + p.moisture, 0) / plots.length))
</script>
