# 种植管理系统 - 项目上下文

### 版本技术栈

- **Framework**: Vue 3 (Composition API + `<script setup>`)
- **Build Tool**: Vite 6
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS 4 (纯 CSS，无 UI 框架组件)
- **Icons**: lucide-vue-next
- **Router**: Vue Router 4

## 项目概览

种植管理系统是一个面向农业种植场景的管理平台，提供数字地图、种植方案、种植计划、农资需求、统计分析、基础管理和系统管理七大核心功能模块。采用左右布局，左侧为功能导航菜单（支持多级折叠），右侧为内容区域。

## 目录结构

```
├── public/                 # 静态资源
├── src/
│   ├── assets/             # 样式资源
│   │   └── main.css        # 全局样式 + Tailwind
│   ├── components/         # 公共组件
│   ├── layouts/            # 布局组件
│   │   └── DashboardLayout.vue  # 主布局（侧边栏 + 面包屑 + 顶栏）
│   ├── lib/                # 工具库
│   │   └── utils.ts        # 通用工具函数 (cn)
│   ├── router/             # 路由配置
│   │   └── index.ts        # Vue Router 路由表
│   ├── views/              # 页面组件
│   │   ├── digital-map/    # 数字地图
│   │   │   ├── index.vue   # 主页面
│   │   │   ├── data.ts     # 数据定义
│   │   │   ├── TreeSelectNode.vue  # 树形选择节点
│   │   │   └── CompletionBadge.vue # 完成率标签
│   │   ├── planting-plan/  # 种植方案
│   │   ├── planting-schedule/ # 种植计划
│   │   │   ├── index.vue   # 计划清单
│   │   │   └── monitor.vue # 计划监控
│   │   ├── material-demand/ # 农资需求
│   │   │   ├── index.vue   # 需求计划
│   │   │   └── summary.vue # 需求汇总
│   │   ├── statistics/     # 统计分析
│   │   │   ├── archive.vue # 种植档案
│   │   │   └── structure.vue # 种植结构表
│   │   ├── base-management/ # 基础管理
│   │   │   └── crop.vue    # 作物管理
│   │   └── system/         # 系统管理
│   │       ├── department.vue # 部门管理
│   │       ├── personnel.vue  # 人员管理
│   │       ├── role.vue       # 角色管理
│   │       ├── permission.vue # 权限管理
│   │       └── dictionary.vue # 字典管理
│   ├── App.vue             # 根组件
│   └── main.ts             # 入口文件
├── index.html              # HTML 入口
├── vite.config.ts          # Vite 配置
├── tsconfig.json           # TypeScript 配置
└── package.json            # 项目依赖
```

## 路由结构

| 路径 | 页面 | 父级菜单 |
|------|------|----------|
| `/digital-map` | 数字地图 | 顶级 |
| `/planting-plan` | 种植方案 | 顶级 |
| `/planting-schedule` | 计划清单 | 种植计划 |
| `/planting-schedule/monitor` | 计划监控 | 种植计划 |
| `/material-demand` | 需求计划 | 农资需求 |
| `/material-demand/summary` | 需求汇总 | 农资需求 |
| `/statistics/archive` | 种植档案 | 统计分析 |
| `/statistics/structure` | 种植结构表 | 统计分析 |
| `/base-management/crop` | 作物管理 | 基础管理 |
| `/system/department` | 部门管理 | 系统管理 |
| `/system/personnel` | 人员管理 | 系统管理 |
| `/system/role` | 角色管理 | 系统管理 |
| `/system/permission` | 权限管理 | 系统管理 |
| `/system/dictionary` | 字典管理 | 系统管理 |

## 包管理规范

**仅允许使用 pnpm** 作为包管理器，**严禁使用 npm 或 yarn**。

## 构建与测试命令

- 类型检查：`npx vue-tsc --noEmit`
- 开发启动：`pnpm dev`（端口 5000，支持 HMR）
- 构建：`pnpm build`
- 生产启动：`pnpm preview`

## 开发规范

### 编码规范

- 使用 Vue 3 Composition API + `<script setup lang="ts">` 风格
- 禁止隐式 `any`，函数参数和返回值应有明确类型
- 样式使用 Tailwind CSS 直接书写，不依赖 UI 框架组件
- 图标使用 `lucide-vue-next`

### 组件规范

- 页面组件放在 `views/` 目录下，每个模块一个文件夹或直接一个 .vue 文件
- 公共组件放在 `components/` 目录下
- 布局组件放在 `layouts/` 目录下
