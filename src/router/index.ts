import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'

const DashboardLayout = () => import('@/layouts/DashboardLayout.vue')

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    redirect: '/digital-map',
  },
  {
    path: '/',
    component: DashboardLayout,
    children: [
      {
        path: 'digital-map',
        component: () => import('@/views/digital-map/index.vue'),
        meta: { title: '数字地图' },
      },
      {
        path: 'planting-plan',
        component: () => import('@/views/planting-plan/index.vue'),
        meta: { title: '种植方案' },
      },
      {
        path: 'planting-plan/form',
        component: () => import('@/views/planting-plan/form.vue'),
        meta: { title: '种植方案编辑', parent: '种植方案' },
      },
      {
        path: 'planting-schedule',
        component: () => import('@/views/planting-schedule/index.vue'),
        meta: { title: '计划清单', parent: '种植计划' },
      },
      {
        path: 'planting-schedule/monitor',
        component: () => import('@/views/planting-schedule/monitor.vue'),
        meta: { title: '计划监控', parent: '种植计划' },
      },
      {
        path: 'material-demand',
        component: () => import('@/views/material-demand/index.vue'),
        meta: { title: '需求计划', parent: '农资需求' },
      },
      {
        path: 'material-demand/:id',
        component: () => import('@/views/material-demand/detail.vue'),
        meta: { title: '需求计划详情', parent: '农资需求' },
      },
      {
        path: 'material-demand/summary',
        component: () => import('@/views/material-demand/summary.vue'),
        meta: { title: '需求汇总', parent: '农资需求' },
      },
      {
        path: 'material-demand/summary/:tab/:key',
        component: () => import('@/views/material-demand/summary-detail.vue'),
        meta: { title: '汇总明细', parent: '农资需求' },
      },
      {
        path: 'statistics/archive',
        component: () => import('@/views/statistics/archive.vue'),
        meta: { title: '种植档案', parent: '统计分析' },
      },
      {
        path: 'statistics/structure',
        component: () => import('@/views/statistics/structure.vue'),
        meta: { title: '种植结构表', parent: '统计分析' },
      },
      {
        path: 'base-management/crop',
        component: () => import('@/views/base-management/crop.vue'),
        meta: { title: '作物管理', parent: '基础管理' },
      },
      {
        path: 'base-management/crop/form',
        component: () => import('@/views/base-management/crop-form.vue'),
        meta: { title: '作物编辑', parent: '基础管理' },
      },
      {
        path: 'system/department',
        component: () => import('@/views/system/department.vue'),
        meta: { title: '部门管理', parent: '系统管理' },
      },
      {
        path: 'system/personnel',
        component: () => import('@/views/system/personnel.vue'),
        meta: { title: '人员管理', parent: '系统管理' },
      },
      {
        path: 'system/role',
        component: () => import('@/views/system/role.vue'),
        meta: { title: '角色管理', parent: '系统管理' },
      },
      {
        path: 'system/permission',
        component: () => import('@/views/system/permission.vue'),
        meta: { title: '权限管理', parent: '系统管理' },
      },
      {
        path: 'system/dictionary',
        component: () => import('@/views/system/dictionary.vue'),
        meta: { title: '字典管理', parent: '系统管理' },
      },
    ],
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
