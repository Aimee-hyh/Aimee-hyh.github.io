<template>
  <div class="layout-container">
    <!-- 侧边栏 -->
    <aside class="sidebar" :class="{ 'collapsed': isCollapsed }">
      <div class="sidebar-header">
        <div class="logo">
          <div class="logo-icon">
            <el-icon>
              <School />
            </el-icon>
          </div>
          <h2 v-if="!isCollapsed" class="logo-text">教务管理系统</h2>
        </div>
      </div>
      <div class="sidebar-divider"></div>
      <el-scrollbar>
        <el-menu :default-active="activeMenu" class="sidebar-menu" :collapse="isCollapsed" router unique-opened
          background-color="var(--color-sidebar-bg)" text-color="var(--color-text-secondary)"
          active-text-color="var(--color-white)">
          <template v-for="menu in menuList" :key="menu.path">
            <!-- 有子菜单 -->
            <el-sub-menu v-if="menu.children && menu.children.length > 0" :index="menu.path">
              <template #title>
                <el-icon class="menu-icon">
                  <component :is="menu.meta?.icon || Document" />
                </el-icon>
                <span class="menu-text">{{ menu.meta?.title }}</span>
              </template>
              <el-menu-item v-for="subMenu in menu.children" :key="subMenu.path" :index="subMenu.path">
                <el-icon class="menu-icon">
                  <component :is="subMenu.meta?.icon || Document" />
                </el-icon>
                <span class="menu-text">{{ subMenu.meta?.title }}</span>
              </el-menu-item>
            </el-sub-menu>
            <!-- 无子菜单 -->
            <el-menu-item v-else :index="menu.path">
              <el-icon class="menu-icon">
                <component :is="menu.meta?.icon || Document" />
              </el-icon>
              <span class="menu-text">{{ menu.meta?.title }}</span>
            </el-menu-item>
          </template>
        </el-menu>
      </el-scrollbar>

      <!-- 侧边栏底部区域 -->
      <div class="sidebar-bottom">
        <!-- 用户信息区域 -->
        <!-- <div class="sidebar-footer" :class="{ 'collapsed': isCollapsed }">
          <el-dropdown placement="top-start" trigger="click">
            <div class="user-card">
              <el-avatar :size="36" class="user-avatar">
                <template #default>
                  <el-icon><User /></el-icon>
                </template>
              </el-avatar>
              <div v-if="!isCollapsed" class="user-info">
                <div class="user-name">管理员</div>
                <div class="user-role">系统管理员</div>
              </div>
            </div>
            <template #dropdown>
              <el-dropdown-menu class="user-dropdown">
                <el-dropdown-item @click="handleUserCenter">
                  <el-icon><User /></el-icon>
                  <span>个人中心</span>
                </el-dropdown-item>
                <el-dropdown-item @click="handleSettings">
                  <el-icon><Setting /></el-icon>
                  <span>系统设置</span>
                </el-dropdown-item>
                <el-dropdown-item divided @click="handleLogout">
                  <el-icon><SwitchButton /></el-icon>
                  <span>退出登录</span>
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div> -->

        <!-- 底部导航展开收起按钮 -->
        <div class="sidebar-collapse">
          <el-tooltip :content="isCollapsed ? '展开' : '收起'" placement="top" effect="light">
            <div class="collapse-container">
              <el-button type="text" class="collapse-btn" @click="toggleSidebar">
                <el-icon class="collapse-icon">
                  <component :is="isCollapsed ? Expand : Fold" />
                </el-icon>
                <transition name="fade">
                  <span v-if="!isCollapsed" class="collapse-text">收起</span>
                </transition>
              </el-button>
            </div>
          </el-tooltip>
        </div>
      </div>
    </aside>

    <!-- 主内容区域 -->
    <main class="main-content">
      <!-- 顶部导航栏 -->
      <header class="header">
        <div class="header-left">
          <div class="breadcrumb">
            <el-breadcrumb separator="/">
              <el-breadcrumb-item v-for="crumb in breadcrumbList" :key="crumb.path" :to="crumb.path">
                {{ crumb.meta?.title }}
              </el-breadcrumb-item>
            </el-breadcrumb>
          </div>
        </div>
        <div class="header-right">
          <div class="header-actions">
            <el-button type="text" class="action-btn">
              <el-icon>
                <Bell />
              </el-icon>
              <el-badge :value="3" :max="99" class="badge" />
            </el-button>
            <el-button type="text" class="action-btn">
              <el-icon>
                <FullScreen />
              </el-icon>
            </el-button>
            <el-button type="text" class="action-btn">
              <el-icon>
                <Refresh />
              </el-icon>
            </el-button>
          </div>
          <div class="header-divider"></div>
          <el-dropdown trigger="click">
            <div class="header-user">
              <el-avatar :size="36" class="header-avatar">
                <template #default>
                  <el-icon>
                    <User />
                  </el-icon>
                </template>
              </el-avatar>
              <div class="header-user-info">
                <div class="header-user-name">管理员</div>
                <div class="header-user-role">系统管理员</div>
              </div>
              <el-icon class="dropdown-icon">
                <ArrowDown />
              </el-icon>
            </div>
            <template #dropdown>
              <el-dropdown-menu class="header-dropdown">
                <el-dropdown-item @click="handleUserCenter">
                  <el-icon>
                    <User />
                  </el-icon>
                  <span>个人中心</span>
                </el-dropdown-item>
                <el-dropdown-item @click="handleSettings">
                  <el-icon>
                    <Setting />
                  </el-icon>
                  <span>系统设置</span>
                </el-dropdown-item>
                <el-dropdown-item divided @click="handleLogout">
                  <el-icon>
                    <SwitchButton />
                  </el-icon>
                  <span>退出登录</span>
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </header>

      <!-- 页面标签栏 -->
      <div class="page-tabs" v-if="showTabs">
        <el-tabs v-model="activeTab" type="card" @tab-click="handleTabClick">
          <el-tab-pane v-for="tab in tabList" :key="tab.name" :name="tab.name" :label="tab.title"
            :closable="tab.closable" />
        </el-tabs>
      </div>

      <!-- 内容区域 -->
      <section class="content-wrapper">
        <div class="content-card">
          <router-view />
        </div>
      </section>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import {
  Document, User, ArrowDown, Setting, SwitchButton,
  School, Bell, FullScreen, Refresh, Fold, Expand
} from '@element-plus/icons-vue'

const route = useRoute()
const router = useRouter()

// 菜单折叠状态
const isCollapsed = ref(false)

// 标签页相关
const showTabs = ref(true)
const activeTab = ref('dashboard')
const tabList = ref([
  { name: 'dashboard', title: '首页', closable: false },
  { name: 'system', title: '系统管理', closable: true },
  { name: 'student', title: '学生信息管理', closable: true },
  { name: 'teacher', title: '教师管理', closable: true },
  { name: 'class', title: '班级管理', closable: true }
])

// 计算当前激活的菜单
const activeMenu = computed(() => {
  return route.path
})

// 路由菜单列表
const menuList = computed(() => {
  return [
    {
      path: '/dashboard',
      meta: { title: '首页', icon: 'House' },
      children: [
        {
          path: '/dashboard/manager',
          meta: { title: '教务首页', icon: 'House' }
        },
        {
          path: '/dashboard/teacher',
          meta: { title: '教师首页', icon: 'House' }
        }
      ]
    },
    {
      path: '/system',
      meta: { title: '系统管理', icon: 'Setting' },
      children: [
        {
          path: '/system/user',
          meta: { title: '用户管理', icon: 'User' }
        },
        {
          path: '/system/menu',
          meta: { title: '菜单管理', icon: 'Menu' }
        },
        {
          path: '/system/role',
          meta: { title: '角色管理', icon: 'Menu' }
        },
        {
          path: '/system/log',
          meta: { title: '日志管理', icon: 'Menu' }
        },
        {
          path: '/system/dict',
          meta: { title: '字典管理', icon: 'Menu' }
        }
      ]
    },
    {
      path: '/student',
      meta: { title: '学生管理', icon: 'User' },
      children: [
        {
          path: '/student/list',
          meta: { title: '学生列表', icon: 'User' }
        }
        // {
        //   path: '/student/records',
        //   meta: { title: '学生档案', icon: 'Menu' }
        // },
        // {
        //   path: '/student/leaningPortraits',
        //   meta: { title: '学习画像', icon: 'Menu' }
        // },
        // {
        //   path: '/student/learningProgress',
        //   meta: { title: '学习进度', icon: 'Menu' }
        // },
        // {
        //   path: '/student/leaningReport',
        //   meta: { title: '学生学情报告', icon: 'Menu' }
        // },
        // {
        //   path: '/student/alertCenter',
        //   meta: { title: '学生预警中心', icon: 'Menu' }
        // }
      ]
    },
    {
      path: '/teacher',
      meta: { title: '教师管理', icon: 'UserFilled' },
      children: [
        {
          path: '/teacher/list',
          meta: { title: '教师列表', icon: 'User' }
        }
      ]
    },
    {
      path: '/class',
      meta: { title: '班级管理', icon: 'Avatar' },
      children: [
        {
          path: '/class/list',
          meta: { title: '班级列表', icon: 'User' }
        },
        {
          path: '/class/studentManager',
          meta: { title: '班级学生管理', icon: 'Menu' }
        },
        {
          path: '/class/learningProgress',
          meta: { title: '班级学习进度', icon: 'Menu' }
        },
        {
          path: '/class/weakKnowledgePoints',
          meta: { title: '班级薄弱知识点', icon: 'Menu' }
        },
        {
          path: '/class/teachingPlan',
          meta: { title: ' 班级教学计划', icon: 'Menu' }
        }
      ]
    }
  ]
})

// 计算面包屑
const breadcrumbList = computed(() => {
  const matched = route.matched
  return matched.filter(item => item.meta.title)
})

// 切换侧边栏展开收起
const toggleSidebar = () => {
  isCollapsed.value = !isCollapsed.value
}

const handleTabClick = (tab: any) => {
  console.log('Tab clicked:', tab)
  if (tab.props.name === 'dashboard') {
    router.push('/dashboard')
  } else if (tab.props.name === 'system') {
    router.push('/system')
  } else if (tab.props.name === 'menu') {
    router.push('/system/menu')
  } else if (tab.props.name === 'student') {
    router.push('/student')
  } else if (tab.props.name === 'teacher') {
    router.push('/teacher')
  }
}

const handleUserCenter = () => {
  ElMessage.info('跳转到个人中心')
}

const handleSettings = () => {
  ElMessage.info('跳转到系统设置')
  router.push('/system')
}

const handleLogout = () => {
  // ElMessage.info('退出登录')
  router.push('/login')
}

// 初始化时根据当前路由设置激活的标签页
onMounted(() => {
  const currentPath = route.path
  if (currentPath.includes('/dashboard')) {
    activeTab.value = 'dashboard'
  } else if (currentPath.includes('/system')) {
    activeTab.value = 'system'
  } else if (currentPath.includes('/menu')) {
    activeTab.value = 'system/menu'
  } else if (currentPath.includes('/student')) {
    activeTab.value = 'student'
  } else if (currentPath.includes('/teacher')) {
    activeTab.value = 'teacher'
  }
})
</script>

<style scoped>
/* CSS 变量定义 - 根据设计规范 */
.layout-container {
  --color-primary: #3A7BD5;
  /* 教育蓝 */
  --color-primary-hover: #2C6AB8;
  --color-primary-light: #E8F2FC;
  --color-primary-disabled: #A3C8F0;

  --color-secondary-purple: #8A4FFF;
  /* 智慧紫 */
  --color-secondary-orange: #FF7C43;
  /* 活力橙 */
  --color-secondary-orange-hover: #E56A2C;
  --color-success: #2ECC71;
  /* 成功绿 */

  --color-text-primary: #2C3E50;
  /* 深灰 - 一级标题 */
  --color-text-secondary: #34495E;
  /* 稍浅深灰 - 二级标题 */
  --color-text-body: #7F8C8D;
  /* 中灰 - 正文内容 */
  --color-text-auxiliary: #95A5A6;
  /* 浅灰 - 辅助文字 */
  --color-text-disabled: #BDC3C7;
  /* 更浅灰 - 禁用状态 */

  --color-bg-light: #ECF0F1;
  /* 浅灰 - 背景、分割线 */
  --color-bg-extra-light: #F9F9F9;
  /* 超浅灰 - 卡片背景 */
  --color-bg-page: #F5F7FA;
  /* 整体页面背景 */

  --color-white: #FFFFFF;
  --color-black: #000000;

  --color-status-success: #2ECC71;
  --color-status-warning: #F39C12;
  --color-status-error: #E74C3C;
  --color-status-info: #3498DB;

  --color-sidebar-bg: #2C3E50;
  --color-sidebar-header: #1A252F;

  --font-family-primary: 'Inter', 'Segoe UI', 'Roboto', 'Microsoft YaHei', sans-serif;

  --font-size-extra-large: 1.5rem;
  /* 24px */
  --font-size-large: 1.25rem;
  /* 20px */
  --font-size-medium: 1.125rem;
  /* 18px */
  --font-size-base: 1rem;
  /* 16px */
  --font-size-small: 0.875rem;
  /* 14px */
  --font-size-extra-small: 0.75rem;
  /* 12px */
  --font-size-data: 1.75rem;
  /* 28px */

  --line-height-title: 1.2;
  --line-height-body: 1.5;
  --line-height-dense: 1.3;

  --spacing-large: 2rem;
  /* 32px */
  --spacing-medium: 1rem;
  /* 16px */
  --spacing-small: 0.5rem;
  /* 8px */
  --spacing-tiny: 0.25rem;
  /* 4px */

  --border-radius-card: 0.75rem;
  /* 12px */
  --border-radius-button: 0.5rem;
  /* 8px */
  --border-radius-input: 0.375rem;
  /* 6px */

  --shadow-card: 0 0.25rem 0.75rem rgba(0, 0, 0, 0.08);
  --shadow-button: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.1);

  --transition-base: all 0.3s ease;
}

.layout-container {
  display: flex;
  width: 100%;
  height: 100vh;
  overflow: hidden;
  background: var(--color-bg-page);
  font-family: var(--font-family-primary);
}

/* 侧边栏样式 */
.sidebar {
  width: 240px;
  height: 100%;
  background-color: var(--color-sidebar-bg);
  transition: var(--transition-base);
  position: relative;
  z-index: 100;
  display: flex;
  flex-direction: column;
  border-right: 1px solid var(--color-bg-light);
}

.sidebar.collapsed {
  width: 64px;
}

.sidebar-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 var(--spacing-medium);
  height: 60px;
  background: var(--color-sidebar-header);
  flex-shrink: 0;
}

.logo {
  display: flex;
  align-items: center;
  gap: var(--spacing-small);
}

.logo-icon {
  width: 32px;
  height: 32px;
  background: var(--color-primary);
  border-radius: var(--border-radius-input);
  display: flex;
  align-items: center;
  justify-content: center;
}

.logo-icon .el-icon {
  font-size: 18px;
  color: var(--color-white);
}

.logo-text {
  margin: 0;
  font-size: var(--font-size-base);
  font-weight: 600;
  color: var(--color-white);
  white-space: nowrap;
  line-height: var(--line-height-title);
}

/* 侧边栏底部区域 */
.sidebar-bottom {
  margin-top: auto;
  display: flex;
  flex-direction: column;
}

/* 侧边栏底部用户信息 */
.sidebar-footer {
  padding: var(--spacing-medium);
  background: var(--color-sidebar-header);
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.sidebar-footer.collapsed {
  padding: var(--spacing-medium) var(--spacing-small);
}

.user-card {
  display: flex;
  align-items: center;
  gap: var(--spacing-small);
  padding: 8px;
  border-radius: var(--border-radius-input);
  cursor: pointer;
  transition: var(--transition-base);
}

.user-card:hover {
  background: rgba(255, 255, 255, 0.1);
}

.user-avatar {
  background: var(--color-primary);
  flex-shrink: 0;
}

.user-info {
  flex: 1;
  min-width: 0;
}

.user-name {
  font-size: var(--font-size-small);
  font-weight: 500;
  color: var(--color-white);
  margin-bottom: var(--spacing-tiny);
  line-height: var(--line-height-title);
}

.user-role {
  font-size: var(--font-size-extra-small);
  color: rgba(255, 255, 255, 0.8);
}

/* 底部导航展开收起按钮区域 */
.sidebar-collapse {
  padding: var(--spacing-medium);
  background: var(--color-sidebar-header);
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.sidebar.collapsed .sidebar-collapse {
  padding: var(--spacing-medium) var(--spacing-small);
}

.collapse-container {
  position: relative;
  width: 100%;
}

.collapse-btn {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-small);
  color: rgba(255, 255, 255, 0.85);
  font-size: var(--font-size-base);
  padding: var(--spacing-small);
  border-radius: var(--border-radius-input);
  transition: var(--transition-base);
}

.collapse-btn:hover {
  color: var(--color-white);
  background: rgba(255, 255, 255, 0.1);
}

.collapse-icon {
  font-size: 18px;
  transition: transform 0.3s;
}

.sidebar.collapsed .collapse-icon {
  transform: rotate(180deg);
}

.collapse-text {
  font-size: var(--font-size-small);
  color: rgba(255, 255, 255, 0.85);
  transition: var(--transition-base);
}

.sidebar-divider {
  height: 1px;
  background: var(--color-bg-light);
  opacity: 0.2;
}

/* 侧边栏菜单样式 */
.sidebar-menu {
  border-right: none !important;
  background-color: var(--color-sidebar-bg) !important;
}

.sidebar-menu :deep(.el-menu) {
  background-color: var(--color-sidebar-bg) !important;
  border-right: none;
}

.sidebar-menu :deep(.el-menu-item),
.sidebar-menu :deep(.el-sub-menu__title) {
  height: 44px;
  line-height: 44px;
  color: var(--color-text-auxiliary) !important;
  background-color: var(--color-sidebar-bg) !important;
  transition: var(--transition-base);
}

.sidebar-menu :deep(.el-menu-item:hover),
.sidebar-menu :deep(.el-sub-menu__title:hover) {
  background-color: var(--color-primary) !important;
  color: var(--color-white) !important;
}

.sidebar-menu :deep(.el-menu-item.is-active) {
  background-color: var(--color-primary) !important;
  color: var(--color-white) !important;
  font-weight: 500;
}

.sidebar-menu :deep(.el-sub-menu) {
  background-color: var(--color-sidebar-bg) !important;
}

.sidebar-menu :deep(.el-menu-item .el-icon),
.sidebar-menu :deep(.el-sub-menu__title .el-icon) {
  color: inherit !important;
}

.sidebar-menu :deep(.el-sub-menu__title) {
  color: var(--color-text-auxiliary) !important;
}

.sidebar-menu :deep(.el-menu-item span),
.sidebar-menu :deep(.el-sub-menu__title span) {
  color: inherit !important;
  font-size: var(--font-size-small);
}

.menu-item-content {
  display: flex;
  align-items: center;
  gap: var(--spacing-small);
}

.menu-icon {
  font-size: 16px;
}

.menu-text {
  font-size: var(--font-size-small);
  font-weight: 400;
  color: inherit;
  line-height: var(--line-height-body);
}

/* 折叠状态下的菜单修复 */
.sidebar-menu :deep(.el-menu--collapse) {
  width: 64px;
}

.sidebar-menu :deep(.el-menu--collapse) .el-sub-menu,
.sidebar-menu :deep(.el-menu--collapse) .el-menu-item {
  position: relative;
}

/* 折叠状态下显示tooltip */
.sidebar-menu :deep(.el-menu--collapse) .el-sub-menu .el-tooltip {
  padding: 0 var(--spacing-medium) !important;
}

/* 确保折叠时文字完全隐藏 */
.sidebar-menu :deep(.el-menu--collapse) .el-sub-menu__title span,
.sidebar-menu :deep(.el-menu--collapse) .el-menu-item span {
  display: none;
}

/* 折叠状态下图标居中 */
.sidebar-menu :deep(.el-menu--collapse) .el-sub-menu__title .el-icon,
.sidebar-menu :deep(.el-menu--collapse) .el-menu-item .el-icon {
  margin: 0 !important;
}

/* 修复子菜单箭头在折叠状态下的位置 */
.sidebar-menu :deep(.el-menu--collapse) .el-sub-menu__title .el-sub-menu__icon-arrow {
  display: none;
}

/* 主内容区域 */
.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
  background: var(--color-bg-page);
}

/* 顶部导航栏 */
.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 56px;
  padding: 0 var(--spacing-large);
  background: var(--color-primary);
  box-shadow: var(--shadow-button);
  z-index: 10;
}

.breadcrumb :deep(.el-breadcrumb__inner) {
  color: rgba(255, 255, 255, 0.9);
  font-weight: normal;
  font-size: var(--font-size-small);
}

.breadcrumb :deep(.el-breadcrumb__item:last-child .el-breadcrumb__inner) {
  color: var(--color-white);
  font-weight: 500;
}

.header-right {
  display: flex;
  align-items: center;
  gap: var(--spacing-medium);
}

.header-actions {
  display: flex;
  align-items: center;
  gap: var(--spacing-small);
}

.action-btn {
  color: rgba(255, 255, 255, 0.9);
  transition: var(--transition-base);
  padding: var(--spacing-small);
}

.action-btn:hover {
  color: var(--color-white);
  background: rgba(255, 255, 255, 0.1);
}

.badge {
  position: absolute;
  top: 2px;
  right: 2px;
}

.header-divider {
  width: 1px;
  height: 20px;
  background: rgba(255, 255, 255, 0.2);
}

.header-user {
  display: flex;
  align-items: center;
  gap: var(--spacing-small);
  padding: var(--spacing-tiny) var(--spacing-small);
  border-radius: var(--border-radius-input);
  cursor: pointer;
  transition: var(--transition-base);
}

.header-user:hover {
  background: rgba(255, 255, 255, 0.1);
}

.header-avatar {
  background: rgba(255, 255, 255, 0.2);
}

.header-user-info {
  flex: 1;
  min-width: 0;
}

.header-user-name {
  font-size: var(--font-size-small);
  font-weight: 500;
  color: var(--color-white);
  margin-bottom: var(--spacing-tiny);
  line-height: var(--line-height-title);
}

.header-user-role {
  font-size: var(--font-size-extra-small);
  color: rgba(255, 255, 255, 0.8);
}

/* 页面标签栏 */
.page-tabs {
  background: var(--color-white);
  padding: 0 var(--spacing-large);
  border-bottom: 1px solid var(--color-bg-light);
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
}

.page-tabs :deep(.el-tabs__header) {
  margin: 0;
}

.page-tabs :deep(.el-tabs__nav-wrap) {
  padding: var(--spacing-tiny) 0;
}

.page-tabs :deep(.el-tabs__item) {
  height: 36px;
  line-height: 36px;
  padding: 0 var(--spacing-medium);
  border-radius: var(--border-radius-button) var(--border-radius-button) 0 0;
  border: 1px solid var(--color-bg-light);
  border-bottom: none;
  margin-right: var(--spacing-tiny);
  background: var(--color-bg-extra-light);
  color: var(--color-text-body);
  font-size: var(--font-size-small);
  transition: var(--transition-base);
}

.page-tabs :deep(.el-tabs__item:hover) {
  color: var(--color-primary);
}

.page-tabs :deep(.el-tabs__item.is-active) {
  background: var(--color-white);
  color: var(--color-primary);
  border-bottom: 1px solid var(--color-white);
  font-weight: 500;
}

/* 内容区域 */
.content-wrapper {
  flex: 1;
  padding: var(--spacing-medium);
  overflow-y: auto;
}

.content-card {
  background: var(--color-white);
  border-radius: var(--border-radius-card);
  padding: var(--spacing-large);
  min-height: calc(100vh - 160px);
  box-shadow: var(--shadow-card);
}

/* 滚动条样式 */
:deep(.el-scrollbar__thumb) {
  background-color: rgba(255, 255, 255, 0.3);
}

:deep(.el-scrollbar__thumb:hover) {
  background-color: rgba(255, 255, 255, 0.5);
}

/* 动画效果 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .sidebar {
    transform: translateX(-100%);
  }

  .sidebar.collapsed {
    transform: translateX(0);
    width: 100%;
  }

  .header {
    padding: 0 var(--spacing-medium);
  }

  .content-wrapper {
    padding: var(--spacing-medium);
  }

  .content-card {
    padding: var(--spacing-medium);
  }
}

/* 全局样式覆盖 - 符合设计规范 */
:deep(.el-button) {
  font-family: var(--font-family-primary);
  font-size: var(--font-size-small);
  transition: var(--transition-base);
}

:deep(.el-button--primary) {
  background: var(--color-primary);
  border-color: var(--color-primary);
  border-radius: var(--border-radius-button);
  height: 40px;
  padding: 0 20px;
}

:deep(.el-button--primary:hover) {
  background: var(--color-primary-hover);
  border-color: var(--color-primary-hover);
}

:deep(.el-button--primary:disabled) {
  background: var(--color-primary-disabled);
  border-color: var(--color-primary-disabled);
}

:deep(.el-button--danger) {
  background: var(--color-secondary-orange);
  border-color: var(--color-secondary-orange);
  border-radius: var(--border-radius-button);
}

:deep(.el-button--danger:hover) {
  background: var(--color-secondary-orange-hover);
  border-color: var(--color-secondary-orange-hover);
}

:deep(.el-input) {
  font-family: var(--font-family-primary);
}

:deep(.el-input__wrapper) {
  border-radius: var(--border-radius-input);
  height: 40px;
  border: 1px solid var(--color-text-disabled);
}

:deep(.el-input__wrapper.is-focus) {
  border: 2px solid var(--color-primary);
  box-shadow: none;
}

:deep(.el-table) {
  font-family: var(--font-family-primary);
}

:deep(.el-table thead) {
  background: var(--color-bg-light);
}

:deep(.el-table th) {
  background: var(--color-bg-light);
  color: var(--color-text-primary);
  font-weight: 600;
  font-size: var(--font-size-small);
}

:deep(.el-table tr) {
  height: 56px;
}

:deep(.el-table td) {
  padding: var(--spacing-medium);
  color: var(--color-text-body);
  font-size: var(--font-size-small);
}

:deep(.el-table--striped .el-table__body tr.el-table__row--striped td) {
  background: var(--color-bg-extra-light);
}

:deep(.el-table__body tr:hover > td) {
  background: var(--color-primary-light) !important;
}

:deep(.el-table__body tr.current-row > td) {
  background: var(--color-primary) !important;
  color: var(--color-white);
}

:deep(.el-dropdown-menu) {
  border-radius: var(--border-radius-input);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

:deep(.el-dropdown-menu__item) {
  font-size: var(--font-size-small);
  color: var(--color-text-body);
}

:deep(.el-dropdown-menu__item:hover) {
  background: var(--color-primary-light);
  color: var(--color-primary);
}

:deep(.el-badge__content) {
  font-family: var(--font-family-primary);
  font-size: var(--font-size-extra-small);
}
</style>