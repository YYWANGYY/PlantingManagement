<template>
  <div class="space-y-6">
    <!-- 页面标题 -->
    <div>
      <h1 class="text-2xl font-bold tracking-tight">字典管理</h1>
      <p class="text-muted-foreground">管理系统中的数据字典，维护业务枚举值和分类信息</p>
    </div>

    <!-- 统计卡片 -->
    <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <div class="rounded-lg border bg-card text-card-foreground shadow-sm">
        <div class="flex flex-row items-center justify-between space-y-0 p-6 pb-2">
          <h3 class="text-sm font-medium">字典总数</h3>
          <BookMarked class="h-4 w-4 text-muted-foreground" />
        </div>
        <div class="p-6 pt-0">
          <div class="text-2xl font-bold">{{ stats.total }}</div>
        </div>
      </div>
      <div class="rounded-lg border bg-card text-card-foreground shadow-sm">
        <div class="flex flex-row items-center justify-between space-y-0 p-6 pb-2">
          <h3 class="text-sm font-medium">已启用</h3>
          <div class="h-2 w-2 rounded-full bg-green-500" />
        </div>
        <div class="p-6 pt-0">
          <div class="text-2xl font-bold text-green-600">{{ stats.enabled }}</div>
        </div>
      </div>
      <div class="rounded-lg border bg-card text-card-foreground shadow-sm">
        <div class="flex flex-row items-center justify-between space-y-0 p-6 pb-2">
          <h3 class="text-sm font-medium">已停用</h3>
          <div class="h-2 w-2 rounded-full bg-gray-400" />
        </div>
        <div class="p-6 pt-0">
          <div class="text-2xl font-bold text-gray-500">{{ stats.disabled }}</div>
        </div>
      </div>
      <div class="rounded-lg border bg-card text-card-foreground shadow-sm">
        <div class="flex flex-row items-center justify-between space-y-0 p-6 pb-2">
          <h3 class="text-sm font-medium">字典项总数</h3>
          <BookMarked class="h-4 w-4 text-muted-foreground" />
        </div>
        <div class="p-6 pt-0">
          <div class="text-2xl font-bold">{{ stats.totalEntries }}</div>
        </div>
      </div>
    </div>

    <!-- 主内容区 - 左右布局 -->
    <div class="grid grid-cols-1 gap-6 lg:grid-cols-5">
      <!-- 左侧：字典列表 -->
      <div class="rounded-lg border bg-card text-card-foreground shadow-sm lg:col-span-2">
        <div class="flex flex-col space-y-1.5 p-6">
          <div class="flex items-center justify-between">
            <h3 class="text-lg font-semibold leading-none tracking-tight">字典列表</h3>
            <button
              id="btn-new-dict"
              class="inline-flex items-center justify-center gap-1 rounded-md bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              @click="dictDialogOpen = true"
            >
              <Plus class="h-4 w-4" />
              新增
            </button>
          </div>
          <div class="relative mt-2">
            <Search class="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <input
              id="input-dict-search"
              type="text"
              placeholder="搜索字典..."
              class="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 pl-8 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              :value="searchTerm"
              @input="onSearchInput"
            />
          </div>
        </div>
        <div class="p-6 pt-0 px-2">
          <div class="space-y-1">
            <button
              v-for="dict in filteredDicts"
              :key="dict.id"
              class="w-full rounded-md px-3 py-2.5 text-left transition-colors"
              :class="selectedDictId === dict.id ? 'bg-primary/10 text-primary' : 'hover:bg-muted'"
              @click="selectDict(dict.id)"
            >
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-2">
                  <span class="font-medium text-sm">{{ dict.name }}</span>
                  <span
                    v-if="dict.status === 'disabled'"
                    class="inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium bg-gray-100 text-gray-500"
                  >停用</span>
                </div>
                <div class="flex items-center gap-2">
                  <span class="text-xs text-muted-foreground">{{ dict.itemCount }}项</span>
                  <div class="flex gap-0.5">
                    <Pencil class="h-3.5 w-3.5 text-muted-foreground hover:text-primary cursor-pointer" @click.stop />
                    <Trash2 class="h-3.5 w-3.5 text-muted-foreground hover:text-destructive cursor-pointer" @click.stop />
                  </div>
                </div>
              </div>
              <div class="mt-0.5 text-xs text-muted-foreground">{{ dict.code }} · {{ dict.description }}</div>
            </button>

            <div v-if="filteredDicts.length === 0" class="py-8 text-center text-sm text-muted-foreground">
              未找到匹配的字典
            </div>
          </div>
        </div>
      </div>

      <!-- 右侧：字典项详情 -->
      <div class="rounded-lg border bg-card text-card-foreground shadow-sm lg:col-span-3">
        <div class="flex flex-col space-y-1.5 p-6">
          <div class="flex items-center justify-between">
            <div>
              <h3 class="text-lg font-semibold leading-none tracking-tight">
                {{ selectedDict ? `${selectedDict.name} - 字典项` : '字典项详情' }}
              </h3>
              <p v-if="selectedDict" class="text-sm text-muted-foreground mt-1">
                编码：{{ selectedDict.code }} · {{ selectedDict.description }}
              </p>
            </div>
            <button
              v-if="selectedDict"
              id="btn-new-entry"
              class="inline-flex items-center justify-center gap-1 rounded-md bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              @click="openEntryDialog"
            >
              <Plus class="h-4 w-4" />
              {{ selectedDict.code === 'crop_type' ? (cropTab === 'category' ? '新增作物大类' : '新增作物品种') : '新增字典项' }}
            </button>
          </div>
        </div>
        <div class="p-6 pt-0">
          <!-- 种植作物字典：双Tab结构 -->
          <template v-if="selectedDict && selectedDict.code === 'crop_type'">
            <!-- Tab 切换 -->
            <div class="flex border-b mb-4">
              <button
                class="px-4 py-2 text-sm font-medium transition-colors border-b-2 -mb-px"
                :class="cropTab === 'category' ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground'"
                @click="cropTab = 'category'"
              >
                作物大类
              </button>
              <button
                class="px-4 py-2 text-sm font-medium transition-colors border-b-2 -mb-px"
                :class="cropTab === 'variety' ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground'"
                @click="cropTab = 'variety'"
              >
                作物品种
              </button>
            </div>

            <!-- 作物大类表格 -->
            <div v-if="cropTab === 'category'" class="relative w-full overflow-auto">
              <table class="w-full caption-bottom text-sm">
                <thead class="[&_tr]:border-b">
                  <tr class="border-b transition-colors hover:bg-muted/50">
                    <th class="h-10 px-2 text-left align-middle font-medium text-muted-foreground w-16">排序</th>
                    <th class="h-10 px-2 text-left align-middle font-medium text-muted-foreground">大类编码</th>
                    <th class="h-10 px-2 text-left align-middle font-medium text-muted-foreground">大类名称</th>
                    <th class="h-10 px-2 text-left align-middle font-medium text-muted-foreground">品种数量</th>
                    <th class="h-10 px-2 text-left align-middle font-medium text-muted-foreground w-20">状态</th>
                    <th class="h-10 px-2 text-right align-middle font-medium text-muted-foreground w-20">操作</th>
                  </tr>
                </thead>
                <tbody class="[&_tr:last-child]:border-0">
                  <tr v-for="cat in cropCategories" :key="cat.code" class="border-b transition-colors hover:bg-muted/50">
                    <td class="p-2 align-middle text-muted-foreground">{{ cat.sort }}</td>
                    <td class="p-2 align-middle"><code class="rounded bg-muted px-1.5 py-0.5 text-sm">{{ cat.code }}</code></td>
                    <td class="p-2 align-middle font-medium">{{ cat.name }}</td>
                    <td class="p-2 align-middle text-muted-foreground">{{ cat.varietyCount }}个</td>
                    <td class="p-2 align-middle">
                      <span class="inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium" :class="cat.status === 'enabled' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'">
                        {{ cat.status === 'enabled' ? '启用' : '停用' }}
                      </span>
                    </td>
                    <td class="p-2 align-middle text-right">
                      <div class="flex items-center justify-end gap-1">
                        <Pencil class="h-4 w-4 text-muted-foreground hover:text-primary cursor-pointer" />
                        <Trash2 class="h-4 w-4 text-muted-foreground hover:text-destructive cursor-pointer" />
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <!-- 作物品种表格 -->
            <div v-else class="relative w-full overflow-auto">
              <table class="w-full caption-bottom text-sm">
                <thead class="[&_tr]:border-b">
                  <tr class="border-b transition-colors hover:bg-muted/50">
                    <th class="h-10 px-2 text-left align-middle font-medium text-muted-foreground w-16">排序</th>
                    <th class="h-10 px-2 text-left align-middle font-medium text-muted-foreground">品种编码</th>
                    <th class="h-10 px-2 text-left align-middle font-medium text-muted-foreground">品种名称</th>
                    <th class="h-10 px-2 text-left align-middle font-medium text-muted-foreground">所属作物大类</th>
                    <th class="h-10 px-2 text-left align-middle font-medium text-muted-foreground w-20">状态</th>
                    <th class="h-10 px-2 text-right align-middle font-medium text-muted-foreground w-20">操作</th>
                  </tr>
                </thead>
                <tbody class="[&_tr:last-child]:border-0">
                  <tr v-for="v in cropVarieties" :key="v.code" class="border-b transition-colors hover:bg-muted/50">
                    <td class="p-2 align-middle text-muted-foreground">{{ v.sort }}</td>
                    <td class="p-2 align-middle"><code class="rounded bg-muted px-1.5 py-0.5 text-sm">{{ v.code }}</code></td>
                    <td class="p-2 align-middle font-medium">{{ v.name }}</td>
                    <td class="p-2 align-middle">
                      <span class="inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium bg-primary/10 text-primary">
                        {{ getCategoryName(v.categoryCode) }}
                      </span>
                    </td>
                    <td class="p-2 align-middle">
                      <span class="inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium" :class="v.status === 'enabled' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'">
                        {{ v.status === 'enabled' ? '启用' : '停用' }}
                      </span>
                    </td>
                    <td class="p-2 align-middle text-right">
                      <div class="flex items-center justify-end gap-1">
                        <Pencil class="h-4 w-4 text-muted-foreground hover:text-primary cursor-pointer" />
                        <Trash2 class="h-4 w-4 text-muted-foreground hover:text-destructive cursor-pointer" />
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </template>

          <!-- 其他字典：通用表格 -->
          <template v-else-if="selectedDict && selectedDict.code !== 'crop_type'">
            <div class="relative w-full overflow-auto">
              <table class="w-full caption-bottom text-sm">
                <thead class="[&_tr]:border-b">
                  <tr class="border-b transition-colors hover:bg-muted/50">
                    <th class="h-10 px-2 text-left align-middle font-medium text-muted-foreground w-16">排序</th>
                    <th class="h-10 px-2 text-left align-middle font-medium text-muted-foreground">标签</th>
                    <th class="h-10 px-2 text-left align-middle font-medium text-muted-foreground">值</th>
                    <th class="h-10 px-2 text-left align-middle font-medium text-muted-foreground w-20">状态</th>
                    <th class="h-10 px-2 text-right align-middle font-medium text-muted-foreground w-20">操作</th>
                  </tr>
                </thead>
                <tbody class="[&_tr:last-child]:border-0">
                  <tr v-for="item in currentDictEntries" :key="item.value" class="border-b transition-colors hover:bg-muted/50">
                    <td class="p-2 align-middle text-muted-foreground">{{ item.sort }}</td>
                    <td class="p-2 align-middle font-medium">{{ item.label }}</td>
                    <td class="p-2 align-middle"><code class="rounded bg-muted px-1.5 py-0.5 text-sm">{{ item.value }}</code></td>
                    <td class="p-2 align-middle">
                      <span class="inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium" :class="item.status === 'enabled' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'">
                        {{ item.status === 'enabled' ? '启用' : '停用' }}
                      </span>
                    </td>
                    <td class="p-2 align-middle text-right">
                      <div class="flex items-center justify-end gap-1">
                        <Pencil class="h-4 w-4 text-muted-foreground hover:text-primary cursor-pointer" />
                        <Trash2 class="h-4 w-4 text-muted-foreground hover:text-destructive cursor-pointer" />
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </template>

          <!-- 未选中字典 -->
          <template v-else>
            <div class="flex flex-col items-center justify-center py-16 text-muted-foreground">
              <BookMarked class="h-12 w-12 mb-3 opacity-20" />
              <p>请从左侧选择一个字典查看详情</p>
            </div>
          </template>
        </div>
      </div>
    </div>

    <!-- 新增字典对话框 -->
    <div
      v-if="dictDialogOpen"
      id="dialog-new-dict"
      class="fixed inset-0 z-50 flex items-center justify-center"
    >
      <div class="fixed inset-0 bg-black/80" @click="dictDialogOpen = false" />
      <div class="relative z-50 grid w-full max-w-lg gap-4 border bg-background p-6 shadow-lg rounded-lg mx-4">
        <div class="flex flex-col space-y-1.5 text-center sm:text-left">
          <h2 class="text-lg font-semibold leading-none tracking-tight">新增字典</h2>
          <p class="text-sm text-muted-foreground">添加新的数据字典类型</p>
        </div>
        <div class="grid gap-4 py-4">
          <div class="grid gap-2">
            <label for="dict-code" class="text-sm font-medium leading-none">字典编码</label>
            <input id="dict-code" type="text" placeholder="如：crop_type" class="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring" />
          </div>
          <div class="grid gap-2">
            <label for="dict-name" class="text-sm font-medium leading-none">字典名称</label>
            <input id="dict-name" type="text" placeholder="如：作物类型" class="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring" />
          </div>
          <div class="grid gap-2">
            <label for="dict-desc" class="text-sm font-medium leading-none">描述</label>
            <input id="dict-desc" type="text" placeholder="字典用途说明" class="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring" />
          </div>
        </div>
        <div class="flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2">
          <button class="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground" @click="dictDialogOpen = false">取消</button>
          <button class="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90" @click="dictDialogOpen = false">确认</button>
        </div>
      </div>
    </div>

    <!-- 新增字典项对话框 -->
    <div
      v-if="entryDialogOpen"
      id="dialog-new-entry"
      class="fixed inset-0 z-50 flex items-center justify-center"
    >
      <div class="fixed inset-0 bg-black/80" @click="entryDialogOpen = false" />
      <div class="relative z-50 grid w-full max-w-lg gap-4 border bg-background p-6 shadow-lg rounded-lg mx-4">
        <div class="flex flex-col space-y-1.5 text-center sm:text-left">
          <h2 class="text-lg font-semibold leading-none tracking-tight">
            {{ selectedDict?.code === 'crop_type' ? (cropTab === 'category' ? '新增作物大类' : '新增作物品种') : '新增字典项' }}
          </h2>
          <p class="text-sm text-muted-foreground">为「{{ selectedDict?.name }}」添加新的字典项</p>
        </div>
        <div class="grid gap-4 py-4">
          <!-- 作物大类表单 -->
          <template v-if="selectedDict?.code === 'crop_type' && cropTab === 'category'">
            <div class="grid gap-2">
              <label class="text-sm font-medium leading-none">大类编码</label>
              <input type="text" placeholder="如：grain" class="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring" />
            </div>
            <div class="grid gap-2">
              <label class="text-sm font-medium leading-none">大类名称</label>
              <input type="text" placeholder="如：粮食作物" class="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring" />
            </div>
            <div class="grid gap-2">
              <label class="text-sm font-medium leading-none">排序号</label>
              <input type="number" placeholder="1" class="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring" />
            </div>
          </template>

          <!-- 作物品种表单 -->
          <template v-else-if="selectedDict?.code === 'crop_type' && cropTab === 'variety'">
            <div class="grid gap-2">
              <label class="text-sm font-medium leading-none">品种编码</label>
              <input type="text" placeholder="如：rice" class="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring" />
            </div>
            <div class="grid gap-2">
              <label class="text-sm font-medium leading-none">品种名称</label>
              <input type="text" placeholder="如：水稻" class="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring" />
            </div>
            <div class="grid gap-2">
              <label class="text-sm font-medium leading-none">所属作物大类</label>
              <select class="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring">
                <option value="" disabled selected>请选择作物大类</option>
                <option v-for="cat in cropCategories" :key="cat.code" :value="cat.code">{{ cat.name }}（{{ cat.code }}）</option>
              </select>
            </div>
            <div class="grid gap-2">
              <label class="text-sm font-medium leading-none">排序号</label>
              <input type="number" placeholder="1" class="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring" />
            </div>
          </template>

          <!-- 通用字典项表单 -->
          <template v-else>
            <div class="grid gap-2">
              <label class="text-sm font-medium leading-none">显示标签</label>
              <input type="text" placeholder="如：粮食作物" class="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring" />
            </div>
            <div class="grid gap-2">
              <label class="text-sm font-medium leading-none">存储值</label>
              <input type="text" placeholder="如：grain" class="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring" />
            </div>
            <div class="grid gap-2">
              <label class="text-sm font-medium leading-none">排序号</label>
              <input type="number" placeholder="1" class="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring" />
            </div>
          </template>
        </div>
        <div class="flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2">
          <button class="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground" @click="entryDialogOpen = false">取消</button>
          <button class="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90" @click="entryDialogOpen = false">确认</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { BookMarked, Plus, Search, Pencil, Trash2 } from 'lucide-vue-next'

// ========== 类型定义 ==========
interface DictItem {
  id: string
  code: string
  name: string
  description: string
  status: 'enabled' | 'disabled'
  itemCount: number
  updatedAt: string
}

interface CropCategory {
  code: string
  name: string
  sort: number
  status: 'enabled' | 'disabled'
  varietyCount: number
}

interface CropVariety {
  code: string
  name: string
  categoryCode: string
  sort: number
  status: 'enabled' | 'disabled'
}

interface DictEntry {
  label: string
  value: string
  sort: number
  status: 'enabled' | 'disabled'
}

// ========== 种植作物字典数据 ==========
const cropCategories = ref<CropCategory[]>([
  { code: 'rice', name: '水稻', sort: 1, status: 'enabled', varietyCount: 4 },
  { code: 'wheat', name: '小麦', sort: 2, status: 'enabled', varietyCount: 3 },
  { code: 'corn', name: '玉米', sort: 3, status: 'enabled', varietyCount: 4 },
  { code: 'soybean', name: '大豆', sort: 4, status: 'enabled', varietyCount: 2 },
  { code: 'sorghum', name: '高粱', sort: 5, status: 'enabled', varietyCount: 2 },
  { code: 'potato', name: '马铃薯', sort: 6, status: 'enabled', varietyCount: 3 },
  { code: 'cotton', name: '棉花', sort: 7, status: 'enabled', varietyCount: 2 },
  { code: 'rapeseed', name: '油菜', sort: 8, status: 'enabled', varietyCount: 2 },
  { code: 'peanut', name: '花生', sort: 9, status: 'enabled', varietyCount: 2 },
  { code: 'sugarcane', name: '甘蔗', sort: 10, status: 'enabled', varietyCount: 2 },
  { code: 'tomato', name: '番茄', sort: 11, status: 'enabled', varietyCount: 2 },
  { code: 'cabbage', name: '大白菜', sort: 12, status: 'enabled', varietyCount: 2 },
  { code: 'apple', name: '苹果', sort: 13, status: 'enabled', varietyCount: 3 },
  { code: 'alfalfa', name: '紫花苜蓿', sort: 14, status: 'enabled', varietyCount: 2 },
])

// 作物品种（每个大类下的具体栽培类型或品种）
const cropVarieties = ref<CropVariety[]>([
  // 水稻大类
  { code: 'indica_rice', name: '籼稻', categoryCode: 'rice', sort: 1, status: 'enabled' },
  { code: 'japonica_rice', name: '粳稻', categoryCode: 'rice', sort: 2, status: 'enabled' },
  { code: 'glutinous_rice', name: '糯稻', categoryCode: 'rice', sort: 3, status: 'enabled' },
  { code: 'hybrid_rice', name: '杂交稻', categoryCode: 'rice', sort: 4, status: 'enabled' },
  // 小麦大类
  { code: 'strong_gluten_wheat', name: '强筋小麦', categoryCode: 'wheat', sort: 1, status: 'enabled' },
  { code: 'medium_gluten_wheat', name: '中筋小麦', categoryCode: 'wheat', sort: 2, status: 'enabled' },
  { code: 'weak_gluten_wheat', name: '弱筋小麦', categoryCode: 'wheat', sort: 3, status: 'enabled' },
  // 玉米大类
  { code: 'grain_corn', name: '籽粒玉米', categoryCode: 'corn', sort: 1, status: 'enabled' },
  { code: 'sweet_corn', name: '甜玉米', categoryCode: 'corn', sort: 2, status: 'enabled' },
  { code: 'waxy_corn', name: '糯玉米', categoryCode: 'corn', sort: 3, status: 'enabled' },
  { code: 'silage_corn', name: '青贮玉米', categoryCode: 'corn', sort: 4, status: 'enabled' },
  // 大豆大类
  { code: 'high_protein_soybean', name: '高蛋白大豆', categoryCode: 'soybean', sort: 1, status: 'enabled' },
  { code: 'high_oil_soybean', name: '高油大豆', categoryCode: 'soybean', sort: 2, status: 'enabled' },
  // 高粱大类
  { code: 'grain_sorghum', name: '粒用高粱', categoryCode: 'sorghum', sort: 1, status: 'enabled' },
  { code: 'sweet_sorghum', name: '甜高粱', categoryCode: 'sorghum', sort: 2, status: 'enabled' },
  // 马铃薯大类
  { code: 'early_potato', name: '早熟马铃薯', categoryCode: 'potato', sort: 1, status: 'enabled' },
  { code: 'starchy_potato', name: '淀粉型马铃薯', categoryCode: 'potato', sort: 2, status: 'enabled' },
  { code: 'fresh_potato', name: '鲜食马铃薯', categoryCode: 'potato', sort: 3, status: 'enabled' },
  // 棉花大类
  { code: 'upland_cotton', name: '细绒棉', categoryCode: 'cotton', sort: 1, status: 'enabled' },
  { code: 'long_staple_cotton', name: '长绒棉', categoryCode: 'cotton', sort: 2, status: 'enabled' },
  // 油菜大类
  { code: 'winter_rapeseed', name: '冬油菜', categoryCode: 'rapeseed', sort: 1, status: 'enabled' },
  { code: 'spring_rapeseed', name: '春油菜', categoryCode: 'rapeseed', sort: 2, status: 'enabled' },
  // 花生大类
  { code: 'common_peanut', name: '普通型花生', categoryCode: 'peanut', sort: 1, status: 'enabled' },
  { code: 'high_oleic_peanut', name: '高油酸花生', categoryCode: 'peanut', sort: 2, status: 'enabled' },
  // 甘蔗大类
  { code: 'chewing_cane', name: '果蔗', categoryCode: 'sugarcane', sort: 1, status: 'enabled' },
  { code: 'sugar_cane', name: '糖蔗', categoryCode: 'sugarcane', sort: 2, status: 'enabled' },
  // 番茄大类
  { code: 'fresh_tomato', name: '鲜食番茄', categoryCode: 'tomato', sort: 1, status: 'enabled' },
  { code: 'processing_tomato', name: '加工番茄', categoryCode: 'tomato', sort: 2, status: 'enabled' },
  // 大白菜大类
  { code: 'napa_cabbage', name: '结球白菜', categoryCode: 'cabbage', sort: 1, status: 'enabled' },
  { code: 'non_heading_cabbage', name: '散叶白菜', categoryCode: 'cabbage', sort: 2, status: 'enabled' },
  // 苹果大类
  { code: 'red_fuji', name: '红富士', categoryCode: 'apple', sort: 1, status: 'enabled' },
  { code: 'gala', name: '嘎啦', categoryCode: 'apple', sort: 2, status: 'enabled' },
  { code: 'golden_delicious', name: '金冠', categoryCode: 'apple', sort: 3, status: 'enabled' },
  // 紫花苜蓿大类
  { code: 'vernal_alfalfa', name: '维纳尔苜蓿', categoryCode: 'alfalfa', sort: 1, status: 'enabled' },
  { code: 'drought_resistant_alfalfa', name: '耐旱苜蓿', categoryCode: 'alfalfa', sort: 2, status: 'enabled' },
])
function getCategoryName(code: string): string {
  return cropCategories.value.find(c => c.code === code)?.name ?? code
}

// ========== 其他字典数据 ==========
const otherDictEntries: Record<string, DictEntry[]> = {

  planting_mode: [
    { label: '大田种植', value: 'field', sort: 1, status: 'enabled' },
    { label: '设施种植', value: 'facility', sort: 2, status: 'enabled' },
  ],
  crop_category:[
   { label: '粮食作物', value: 'grain', sort: 1, status: 'enabled' },
  { label: '经济作物', value: 'cash', sort: 2, status: 'enabled' },
  { label: '蔬菜', value: 'vegetable', sort: 3, status: 'enabled' },
  { label: '水果', value: 'fruit', sort: 4, status: 'enabled' },
  { label: '牧草', value: 'forage', sort: 5, status: 'enabled' },
  { label: '中药材', value: 'herbal', sort: 6, status: 'enabled' },
  { label: '油料作物', value: 'oil', sort: 7, status: 'enabled' },      // 可选，也可并入经济作物
  { label: '糖料作物', value: 'sugar', sort: 8, status: 'enabled' },    // 可选
  { label: '花卉', value: 'flower', sort: 9, status: 'enabled' },       // 大田规模种植的花卉
    
  ]
}

// ========== 字典列表 ==========
const mockDicts: DictItem[] = [
 { id: '1', code: 'planting_mode', name: '种植模式', description: '大田/设施等种植模式', status: 'enabled', itemCount: 2, updatedAt: '2025-01-08' },
  { id: '2', code: 'crop_type', name: '种植作物', description: '种植作物的分类类型，包含作物大类和品种', status: 'enabled', itemCount: 8, updatedAt: '2025-01-15' }  ,
    { id: '3', code: 'crop_category', name: '种植类别', description: '作物类别，包含粮食作物、油料作物等', status: 'enabled', itemCount: 9, updatedAt: '2025-01-15' }  
]
  
// ========== 状态 ==========
const searchTerm = ref('')
const selectedDictId = ref<string | null>(null)
const dictDialogOpen = ref(false)
const entryDialogOpen = ref(false)
const cropTab = ref<'category' | 'variety'>('category')

// ========== 计算属性 ==========
const filteredDicts = computed(() =>
  mockDicts.filter(d =>
    d.name.includes(searchTerm.value) ||
    d.code.includes(searchTerm.value) ||
    d.description.includes(searchTerm.value)
  )
)

const selectedDict = computed(() =>
  mockDicts.find(d => d.id === selectedDictId.value) ?? null
)

const currentDictEntries = computed<DictEntry[]>(() => {
  if (!selectedDict.value) return []
  return otherDictEntries[selectedDict.value.code] ?? []
})

const stats = computed(() => ({
  total: mockDicts.length,
  enabled: mockDicts.filter(d => d.status === 'enabled').length,
  disabled: mockDicts.filter(d => d.status === 'disabled').length,
  totalEntries: mockDicts.reduce((sum, d) => sum + d.itemCount, 0),
}))

// ========== 方法 ==========
function selectDict(id: string) {
  selectedDictId.value = id
  cropTab.value = 'category'
}

function onSearchInput(e: Event) {
  searchTerm.value = (e.target as HTMLInputElement).value
}

function openEntryDialog() {
  entryDialogOpen.value = true
}
</script>
