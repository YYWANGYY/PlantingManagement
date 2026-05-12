<template>
  <div class="space-y-6">
    <!-- 页面标题 + 操作 -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold tracking-tight">种植方案</h1>
        <p class="mt-1 text-sm text-muted-foreground">管理和制定各类作物种植技术方案</p>
      </div>
      <button
        id="btn-new-scheme"
        class="inline-flex items-center justify-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
      >
        <Plus class="h-4 w-4" />
        新建方案
      </button>
    </div>

    <!-- 统计卡片 -->
    <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <!-- 统计-执行中 -->
      <div class="rounded-lg border bg-card text-card-foreground shadow-sm">
        <div class="flex items-center gap-4 p-5">
          <div class="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-green-100">
            <CheckCircle2 class="h-5 w-5 text-green-600" />
          </div>
          <div>
            <p class="text-sm text-muted-foreground">执行中</p>
            <p class="text-2xl font-bold">{{ activeCount }} <span class="text-sm font-normal text-muted-foreground">个方案</span></p>
          </div>
        </div>
      </div>
      <!-- 统计-执行中面积 -->
      <div class="rounded-lg border bg-card text-card-foreground shadow-sm">
        <div class="flex items-center gap-4 p-5">
          <div class="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-blue-100">
            <FileText class="h-5 w-5 text-blue-600" />
          </div>
          <div>
            <p class="text-sm text-muted-foreground">执行中面积</p>
            <p class="text-2xl font-bold">{{ totalArea }} <span class="text-sm font-normal text-muted-foreground">亩</span></p>
          </div>
        </div>
      </div>
      <!-- 统计-待审核 -->
      <div class="rounded-lg border bg-card text-card-foreground shadow-sm">
        <div class="flex items-center gap-4 p-5">
          <div class="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-amber-100">
            <Clock class="h-5 w-5 text-amber-600" />
          </div>
          <div>
            <p class="text-sm text-muted-foreground">待审核</p>
            <p class="text-2xl font-bold">{{ reviewCount }} <span class="text-sm font-normal text-muted-foreground">个</span></p>
          </div>
        </div>
      </div>
      <!-- 统计-草稿 -->
      <div class="rounded-lg border bg-card text-card-foreground shadow-sm">
        <div class="flex items-center gap-4 p-5">
          <div class="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-gray-100">
            <AlertCircle class="h-5 w-5 text-gray-600" />
          </div>
          <div>
            <p class="text-sm text-muted-foreground">草稿</p>
            <p class="text-2xl font-bold">{{ draftCount }} <span class="text-sm font-normal text-muted-foreground">个</span></p>
          </div>
        </div>
      </div>
    </div>

    <!-- 方案列表 -->
    <div class="rounded-lg border bg-card text-card-foreground shadow-sm">
      <div class="flex flex-col space-y-1.5 p-6">
        <h3 class="text-lg font-semibold leading-none tracking-tight">方案列表</h3>
        <p class="text-sm text-muted-foreground">所有种植方案的详细信息</p>
      </div>
      <div class="p-6 pt-0">
        <div class="relative w-full overflow-auto">
          <table class="w-full caption-bottom text-sm">
            <thead class="[&_tr]:border-b">
              <tr class="border-b transition-colors hover:bg-muted/50">
                <th class="h-10 px-2 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]" style="width: 130px">编号</th>
                <th class="h-10 px-2 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]">方案名称</th>
                <th class="h-10 px-2 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]">作物</th>
                <th class="h-10 px-2 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]">季节</th>
                <th class="h-10 px-2 text-right align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]">面积(亩)</th>
                <th class="h-10 px-2 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]">产量目标</th>
                <th class="h-10 px-2 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]">状态</th>
                <th class="h-10 px-2 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]">创建人</th>
                <th class="h-10 px-2 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]">创建日期</th>
              </tr>
            </thead>
            <tbody class="[&_tr:last-child]:border-0">
              <!-- 列表-方案1 -->
              <tr class="border-b transition-colors hover:bg-muted/50 cursor-pointer" data-id="SP-2024-001">
                <td class="p-2 align-middle [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px] font-mono text-xs">SP-2024-001</td>
                <td class="p-2 align-middle [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px] font-medium">春季水稻高产方案</td>
                <td class="p-2 align-middle [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]">
                  <span class="inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-normal transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2">水稻</span>
                </td>
                <td class="p-2 align-middle [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px] text-muted-foreground">春季</td>
                <td class="p-2 align-middle [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px] text-right">250</td>
                <td class="p-2 align-middle [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]">650kg/亩</td>
                <td class="p-2 align-middle [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]">
                  <span class="inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-xs font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 bg-primary text-primary-foreground shadow hover:bg-primary/80">
                    <CheckCircle2 class="h-3 w-3" />
                    执行中
                  </span>
                </td>
                <td class="p-2 align-middle [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px] text-muted-foreground">张农技</td>
                <td class="p-2 align-middle [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px] text-muted-foreground text-xs">2024-02-15</td>
              </tr>
              <!-- 列表-方案2 -->
              <tr class="border-b transition-colors hover:bg-muted/50 cursor-pointer" data-id="SP-2024-002">
                <td class="p-2 align-middle [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px] font-mono text-xs">SP-2024-002</td>
                <td class="p-2 align-middle [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px] font-medium">冬小麦越冬方案</td>
                <td class="p-2 align-middle [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]">
                  <span class="inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-normal transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2">小麦</span>
                </td>
                <td class="p-2 align-middle [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px] text-muted-foreground">冬季</td>
                <td class="p-2 align-middle [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px] text-right">175</td>
                <td class="p-2 align-middle [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]">500kg/亩</td>
                <td class="p-2 align-middle [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]">
                  <span class="inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-xs font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 bg-primary text-primary-foreground shadow hover:bg-primary/80">
                    <CheckCircle2 class="h-3 w-3" />
                    执行中
                  </span>
                </td>
                <td class="p-2 align-middle [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px] text-muted-foreground">李规划</td>
                <td class="p-2 align-middle [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px] text-muted-foreground text-xs">2024-01-20</td>
              </tr>
              <!-- 列表-方案3 -->
              <tr class="border-b transition-colors hover:bg-muted/50 cursor-pointer" data-id="SP-2024-003">
                <td class="p-2 align-middle [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px] font-mono text-xs">SP-2024-003</td>
                <td class="p-2 align-middle [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px] font-medium">夏玉米密植方案</td>
                <td class="p-2 align-middle [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]">
                  <span class="inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-normal transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2">玉米</span>
                </td>
                <td class="p-2 align-middle [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px] text-muted-foreground">夏季</td>
                <td class="p-2 align-middle [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px] text-right">95</td>
                <td class="p-2 align-middle [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]">700kg/亩</td>
                <td class="p-2 align-middle [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]">
                  <span class="inline-flex items-center gap-1 rounded-md border px-2.5 py-0.5 text-xs font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 text-foreground">
                    <Clock class="h-3 w-3" />
                    审核中
                  </span>
                </td>
                <td class="p-2 align-middle [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px] text-muted-foreground">王技术</td>
                <td class="p-2 align-middle [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px] text-muted-foreground text-xs">2024-03-10</td>
              </tr>
              <!-- 列表-方案4 -->
              <tr class="border-b transition-colors hover:bg-muted/50 cursor-pointer" data-id="SP-2024-004">
                <td class="p-2 align-middle [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px] font-mono text-xs">SP-2024-004</td>
                <td class="p-2 align-middle [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px] font-medium">大豆轮作方案</td>
                <td class="p-2 align-middle [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]">
                  <span class="inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-normal transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2">大豆</span>
                </td>
                <td class="p-2 align-middle [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px] text-muted-foreground">春季</td>
                <td class="p-2 align-middle [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px] text-right">60</td>
                <td class="p-2 align-middle [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]">200kg/亩</td>
                <td class="p-2 align-middle [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]">
                  <span class="inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-xs font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 bg-secondary text-secondary-foreground hover:bg-secondary/80">
                    <FileText class="h-3 w-3" />
                    草稿
                  </span>
                </td>
                <td class="p-2 align-middle [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px] text-muted-foreground">赵助理</td>
                <td class="p-2 align-middle [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px] text-muted-foreground text-xs">2024-03-18</td>
              </tr>
              <!-- 列表-方案5 -->
              <tr class="border-b transition-colors hover:bg-muted/50 cursor-pointer" data-id="SP-2024-005">
                <td class="p-2 align-middle [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px] font-mono text-xs">SP-2024-005</td>
                <td class="p-2 align-middle [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px] font-medium">棉花管理方案</td>
                <td class="p-2 align-middle [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]">
                  <span class="inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-normal transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2">棉花</span>
                </td>
                <td class="p-2 align-middle [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px] text-muted-foreground">春季</td>
                <td class="p-2 align-middle [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px] text-right">110</td>
                <td class="p-2 align-middle [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]">300kg/亩</td>
                <td class="p-2 align-middle [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]">
                  <span class="inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-xs font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 bg-primary text-primary-foreground shadow hover:bg-primary/80">
                    <CheckCircle2 class="h-3 w-3" />
                    执行中
                  </span>
                </td>
                <td class="p-2 align-middle [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px] text-muted-foreground">张农技</td>
                <td class="p-2 align-middle [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px] text-muted-foreground text-xs">2024-02-28</td>
              </tr>
              <!-- 列表-方案6 -->
              <tr class="border-b transition-colors hover:bg-muted/50 cursor-pointer" data-id="SP-2024-006">
                <td class="p-2 align-middle [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px] font-mono text-xs">SP-2024-006</td>
                <td class="p-2 align-middle [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px] font-medium">油菜秋播方案</td>
                <td class="p-2 align-middle [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]">
                  <span class="inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-normal transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2">油菜</span>
                </td>
                <td class="p-2 align-middle [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px] text-muted-foreground">秋季</td>
                <td class="p-2 align-middle [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px] text-right">70</td>
                <td class="p-2 align-middle [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]">180kg/亩</td>
                <td class="p-2 align-middle [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]">
                  <span class="inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-xs font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 bg-secondary text-secondary-foreground hover:bg-secondary/80">
                    <FileText class="h-3 w-3" />
                    草稿
                  </span>
                </td>
                <td class="p-2 align-middle [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px] text-muted-foreground">李规划</td>
                <td class="p-2 align-middle [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px] text-muted-foreground text-xs">2024-03-22</td>
              </tr>
              <!-- 列表-方案7 -->
              <tr class="border-b transition-colors hover:bg-muted/50 cursor-pointer" data-id="SP-2024-007">
                <td class="p-2 align-middle [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px] font-mono text-xs">SP-2024-007</td>
                <td class="p-2 align-middle [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px] font-medium">花生覆膜方案</td>
                <td class="p-2 align-middle [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]">
                  <span class="inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-normal transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2">花生</span>
                </td>
                <td class="p-2 align-middle [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px] text-muted-foreground">春季</td>
                <td class="p-2 align-middle [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px] text-right">55</td>
                <td class="p-2 align-middle [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]">350kg/亩</td>
                <td class="p-2 align-middle [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]">
                  <span class="inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-xs font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 bg-primary text-primary-foreground shadow hover:bg-primary/80">
                    <CheckCircle2 class="h-3 w-3" />
                    执行中
                  </span>
                </td>
                <td class="p-2 align-middle [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px] text-muted-foreground">王技术</td>
                <td class="p-2 align-middle [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px] text-muted-foreground text-xs">2024-03-05</td>
              </tr>
              <!-- 列表-方案8 -->
              <tr class="border-b transition-colors hover:bg-muted/50 cursor-pointer" data-id="SP-2024-008">
                <td class="p-2 align-middle [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px] font-mono text-xs">SP-2024-008</td>
                <td class="p-2 align-middle [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px] font-medium">茶叶精细方案</td>
                <td class="p-2 align-middle [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]">
                  <span class="inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-normal transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2">茶叶</span>
                </td>
                <td class="p-2 align-middle [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px] text-muted-foreground">秋季</td>
                <td class="p-2 align-middle [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px] text-right">80</td>
                <td class="p-2 align-middle [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]">120kg/亩</td>
                <td class="p-2 align-middle [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]">
                  <span class="inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-xs font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 bg-secondary text-secondary-foreground hover:bg-secondary/80">
                    <AlertCircle class="h-3 w-3" />
                    已归档
                  </span>
                </td>
                <td class="p-2 align-middle [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px] text-muted-foreground">赵助理</td>
                <td class="p-2 align-middle [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px] text-muted-foreground text-xs">2023-09-10</td>
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
import { Plus, FileText, CheckCircle2, Clock, AlertCircle } from 'lucide-vue-next'

interface PlantingScheme {
  id: string
  name: string
  crop: string
  area: number
  yieldTarget: string
  status: 'active' | 'draft' | 'review' | 'archived'
  creator: string
  createdAt: string
  season: string
}

const schemes: PlantingScheme[] = [
  { id: 'SP-2024-001', name: '春季水稻高产方案', crop: '水稻', area: 250, yieldTarget: '650kg/亩', status: 'active', creator: '张农技', createdAt: '2024-02-15', season: '春季' },
  { id: 'SP-2024-002', name: '冬小麦越冬方案', crop: '小麦', area: 175, yieldTarget: '500kg/亩', status: 'active', creator: '李规划', createdAt: '2024-01-20', season: '冬季' },
  { id: 'SP-2024-003', name: '夏玉米密植方案', crop: '玉米', area: 95, yieldTarget: '700kg/亩', status: 'review', creator: '王技术', createdAt: '2024-03-10', season: '夏季' },
  { id: 'SP-2024-004', name: '大豆轮作方案', crop: '大豆', area: 60, yieldTarget: '200kg/亩', status: 'draft', creator: '赵助理', createdAt: '2024-03-18', season: '春季' },
  { id: 'SP-2024-005', name: '棉花管理方案', crop: '棉花', area: 110, yieldTarget: '300kg/亩', status: 'active', creator: '张农技', createdAt: '2024-02-28', season: '春季' },
  { id: 'SP-2024-006', name: '油菜秋播方案', crop: '油菜', area: 70, yieldTarget: '180kg/亩', status: 'draft', creator: '李规划', createdAt: '2024-03-22', season: '秋季' },
  { id: 'SP-2024-007', name: '花生覆膜方案', crop: '花生', area: 55, yieldTarget: '350kg/亩', status: 'active', creator: '王技术', createdAt: '2024-03-05', season: '春季' },
  { id: 'SP-2024-008', name: '茶叶精细方案', crop: '茶叶', area: 80, yieldTarget: '120kg/亩', status: 'archived', creator: '赵助理', createdAt: '2023-09-10', season: '秋季' },
]

const activeCount = computed(() => schemes.filter((s) => s.status === 'active').length)
const totalArea = computed(() => schemes.filter((s) => s.status === 'active').reduce((sum, s) => sum + s.area, 0))
const draftCount = computed(() => schemes.filter((s) => s.status === 'draft').length)
const reviewCount = computed(() => schemes.filter((s) => s.status === 'review').length)
</script>
