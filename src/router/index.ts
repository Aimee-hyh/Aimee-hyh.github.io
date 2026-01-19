import { createRouter, createWebHistory } from 'vue-router'
import Layout from '../components/Layout.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'Layout',
      component: Layout,
      redirect: '/dashboard',
      children: [
        {
          path: '/dashboard',
          name: 'Dashboard',
          component: () => import('../views/Dashboard.vue'),
          meta: { title: '仪表盘' }
        },
        // 系统管理
        {
          path: '/system',
          name: 'System',
          meta: { title: '系统管理' },
          children: [
            {
              path: '/system/user',
              name: 'UserManagement',
              component: () => import('../views/system/UserManagement.vue'),
              meta: { title: '用户管理' }
            },
            {
              path: '/system/menu',
              name: 'MenuManagement',
              component: () => import('../views/system/MenuManagement.vue'),
              meta: { title: '菜单管理' }
            },
            {
              path: '/system/role',
              name: 'RoleManagement',
              component: () => import('../views/system/RoleManagement.vue'),
              meta: { title: '角色管理' }
            },
            {
              path: '/system/log',
              name: 'LogManagement',
              component: () => import('../views/system/LogManagement.vue'),
              meta: { title: '日志管理' }
            },
            {
              path: '/system/dict',
              name: 'DictManagement',
              component: () => import('../views/system/DictManagement.vue'),
              meta: { title: '字典管理' }
            }
          ]
        },
        // 学生信息管理
        {
          path: '/student',
          name: 'Student',
          meta: { title: '学生信息管理' },
          children: [
            {
              path: '/student/list',
              name: 'StudentList',
              component: () => import('../views/student/StudentList.vue'),
              meta: { title: '学生列表' }
            },
            {
              path: '/student/detail/:id',
              name: 'StudentDetail',
              component: () => import('../views/student/StudentDetail.vue'),
              meta: { title: '学生详情' }
            },
            {
              path: '/student/add',
              name: 'StudentAdd',
              component: () => import('../views/student/StudentAdd.vue'),
              meta: { title: '添加学生' }
            }
          ]
        }
      ]
    },
    {
      path: '/teacher',
      name: 'Teacher',
      component: Layout,
      meta: { title: '教师信息管理' },
      children: [
        {
          path: '/teacher/list',
          name: 'TeacherList',
          component: () => import('../views/teacher/TeacherList.vue'),
          meta: { title: '教师列表' }
        },
        {
          path: '/teacher/detail/:id',
          name: 'TeacherDetail',
          component: () => import('../views/teacher/TeacherDetail.vue'),
          meta: { title: '教师详情' }
        },
        {
          path: '/teacher/add',
          name: 'TeacherAdd',
          component: () => import('../views/teacher/TeacherAdd.vue'),
          meta: { title: '添加教师' }
        },
        // 教师门户
        {
          path: '/teacher/portal',
          name: 'TeacherPortal',
          component: () => import('../views/teacher/TeacherPortal.vue'),
          meta: { title: '教师门户' }
        },
        {
          path: '/teacher/schedule',
          name: 'TeacherSchedule',
          component: () => import('../views/teacher/TeacherSchedule.vue'),
          meta: { title: '个人课表' }
        },
        {
          path: '/teacher/lesson-records',
          name: 'LessonRecords',
          component: () => import('../views/teacher/LessonRecords.vue'),
          meta: { title: '课堂记录' }
        },
        {
          path: '/teacher/teaching-data',
          name: 'TeachingData',
          component: () => import('../views/teacher/TeachingData.vue'),
          meta: { title: '教学数据' }
        }
      ]

    },
    {
      path: '/login',
      name: 'Login',
      component: () => import('../views/Login.vue'),
      meta: { title: '登录' }
    }
  ]
})

export default router