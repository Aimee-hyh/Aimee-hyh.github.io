<template>
  <div class="user-management-container">
    <!-- 页面标题和操作 -->
    <div class="page-header">
      <div class="title-section">
        <h1 class="page-title">
          <el-icon><User /></el-icon>
          用户管理
        </h1>
        <div class="subtitle">管理系统用户、角色和权限分配</div>
      </div>
      <div class="header-actions">
        <div class="action-group">
          <el-button 
            type="primary" 
            class="action-btn primary-btn" 
            @click="handleAddUser"
          >
            <el-icon><Plus /></el-icon>
            新增用户
          </el-button>
          <el-button-group class="more-actions">
            <el-button 
              type="primary" 
              class="action-btn more-btn"
              @mouseenter="showMoreActions = true"
              @mouseleave="showMoreActions = false"
            >
              <el-icon><More /></el-icon>
              更多操作
            </el-button>
            <div 
              v-if="showMoreActions" 
              class="dropdown-actions"
              @mouseenter="showMoreActions = true"
              @mouseleave="showMoreActions = false"
            >
              <el-button type="info" class="dropdown-item" @click="handleImport">
                <el-icon><Upload /></el-icon>
                导入用户
              </el-button>
              <el-button type="info" class="dropdown-item" @click="handleExport">
                <el-icon><Download /></el-icon>
                导出用户
              </el-button>
              <el-button 
                type="info" 
                class="dropdown-item" 
                @click="handleDelete"
                :disabled="selectedUserIds.length === 0"
              >
                <el-icon><Delete /></el-icon>
                批量删除
              </el-button>
            </div>
          </el-button-group>
        </div>
        
        <!-- 搜索框 -->
        <div class="search-section">
          <el-input
            v-model="searchQuery"
            placeholder="搜索用户名、姓名、手机号或邮箱"
            class="search-input"
            clearable
            @keyup.enter="handleSearch"
          >
            <template #prefix>
              <el-icon><Search /></el-icon>
            </template>
          </el-input>
          <el-button type="primary" class="search-btn" @click="handleSearch">
            搜索
          </el-button>
        </div>
      </div>
    </div>

    <!-- 筛选条件 -->
    <div class="filter-section">
      <div class="filter-tags">
        <span class="filter-label">筛选：</span>
        <el-tag
          v-for="filter in activeFilters"
          :key="filter.key"
          closable
          size="small"
          @close="removeFilter(filter.key)"
          class="filter-tag"
        >
          {{ filter.label }}: {{ filter.value }}
        </el-tag>
        <el-button type="text" @click="showAdvancedFilter = !showAdvancedFilter" class="filter-toggle">
          {{ showAdvancedFilter ? '收起筛选' : '高级筛选' }}
          <el-icon :class="{ 'rotate-icon': showAdvancedFilter }">
            <ArrowDown />
          </el-icon>
        </el-button>
      </div>
      
      <!-- 高级筛选 -->
      <div v-if="showAdvancedFilter" class="advanced-filter">
        <el-form :inline="true" :model="filterForm" class="filter-form">
          <el-form-item label="用户类型">
            <el-select 
              v-model="filterForm.userType" 
              placeholder="全部类型"
              clearable
              class="filter-select"
            >
              <el-option label="管理员" value="admin" />
              <el-option label="课程顾问" value="consultant" />
              <el-option label="班主任" value="teacher" />
              <el-option label="教师" value="instructor" />
              <el-option label="学生" value="student" />
              <el-option label="家长" value="parent" />
            </el-select>
          </el-form-item>
          <el-form-item label="状态">
            <el-select 
              v-model="filterForm.status" 
              placeholder="全部状态"
              clearable
              class="filter-select"
            >
              <el-option label="启用" value="1" />
              <el-option label="禁用" value="0" />
            </el-select>
          </el-form-item>
          <el-form-item label="创建时间">
            <el-date-picker
              v-model="filterForm.dateRange"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              class="filter-date"
            />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="applyFilters">应用筛选</el-button>
            <el-button @click="resetFilters">重置</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>

    <!-- 用户类型树和用户列表 -->
    <div class="main-content">
      <!-- 左侧用户类型树 -->
      <div class="left-panel">
        <el-card class="type-card" shadow="hover">
          <template #header>
            <div class="card-header">
              <span class="card-title">
                <el-icon><Folder /></el-icon>
                用户分类
              </span>
              <el-button 
                type="text" 
                class="add-type-btn"
                @click="handleAddType"
              >
                <el-icon><Plus /></el-icon>
              </el-button>
            </div>
          </template>
          <el-tree
            :data="userTypeTree"
            :props="treeProps"
            :default-expanded-keys="['1', '1-1', '2', '2-1']"
            node-key="id"
            :highlight-current="true"
            @node-click="handleTypeClick"
            class="type-tree"
          >
            <template #default="{ node, data }">
              <div class="tree-node" :class="{ 'active-node': currentTypeId === data.id }">
                <div class="tree-node-content">
                  <el-icon class="tree-icon">
                    <component :is="data.icon || 'User'" />
                  </el-icon>
                  <span class="tree-label">{{ node.label }}</span>
                  <span class="tree-count" v-if="data.count !== undefined">({{ data.count }})</span>
                </div>
                <div class="tree-actions" v-if="currentTypeId === data.id">
                  <el-button 
                    type="text" 
                    size="small" 
                    class="tree-action-btn"
                    @click.stop="handleEditType(data)"
                  >
                    <el-icon><Edit /></el-icon>
                  </el-button>
                  <el-button 
                    type="text" 
                    size="small" 
                    class="tree-action-btn"
                    @click.stop="handleDeleteType(data)"
                    v-if="!data.children || data.children.length === 0"
                  >
                    <el-icon><Delete /></el-icon>
                  </el-button>
                </div>
              </div>
            </template>
          </el-tree>
          <div class="tree-summary">
            <div class="summary-item">
              <div class="summary-label">用户总数</div>
              <div class="summary-value">1,234</div>
            </div>
            <div class="summary-item">
              <div class="summary-label">活跃用户</div>
              <div class="summary-value">1,089</div>
            </div>
          </div>
        </el-card>
      </div>

      <!-- 右侧用户列表 -->
      <div class="right-panel">
        <el-card class="list-card" shadow="hover">
          <template #header>
            <div class="list-header">
              <div class="list-title">
                <span class="current-type">{{ currentTypeName }}</span>
                <span class="user-count">(共 {{ userList.length }} 个用户)</span>
              </div>
              <div class="list-actions">
                <el-button 
                  type="text" 
                  class="refresh-btn"
                  @click="refreshList"
                >
                  <el-icon><Refresh /></el-icon>
                  刷新
                </el-button>
                <el-button 
                  type="text" 
                  class="view-toggle"
                  @click="listView = listView === 'table' ? 'card' : 'table'"
                >
                  <el-icon v-if="listView === 'table'"><Grid /></el-icon>
                  <el-icon v-else><List /></el-icon>
                  {{ listView === 'table' ? '卡片视图' : '列表视图' }}
                </el-button>
              </div>
            </div>
          </template>

          <!-- 表格视图 -->
          <div v-if="listView === 'table'">
            <el-table
              v-loading="loading"
              :data="userList"
              @selection-change="handleSelectionChange"
              stripe
              class="user-table"
              :header-cell-style="{ background: '#f8f9fa', color: '#495057' }"
            >
              <el-table-column type="selection" width="48" align="center" />
              <el-table-column prop="id" label="ID" width="70" align="center" />
              <el-table-column prop="username" label="用户名" min-width="120">
                <template #default="scope">
                  <div class="user-cell">
                    <el-avatar :size="32" :src="scope.row.avatar" class="user-avatar">
                      <span v-if="!scope.row.avatar">{{ scope.row.name.charAt(0) }}</span>
                    </el-avatar>
                    <div class="user-info">
                      <div class="username">{{ scope.row.username }}</div>
                      <div class="name">{{ scope.row.name }}</div>
                    </div>
                  </div>
                </template>
              </el-table-column>
              <el-table-column prop="phone" label="手机号" min-width="130" />
              <el-table-column prop="email" label="邮箱" min-width="180" />
              <el-table-column prop="userType" label="角色" min-width="100">
                <template #default="scope">
                  <el-tag 
                    :type="getRoleType(scope.row.userType)"
                    size="small"
                    class="role-tag"
                  >
                    {{ scope.row.userType }}
                  </el-tag>
                </template>
              </el-table-column>
              <el-table-column prop="status" label="状态" width="90" align="center">
                <template #default="scope">
                  <el-switch
                    v-model="scope.row.status"
                    :active-value="1"
                    :inactive-value="0"
                    @change="handleStatusChange(scope.row)"
                    :loading="scope.row.statusLoading"
                    active-color="#10b981"
                    inactive-color="#dc2626"
                  />
                </template>
              </el-table-column>
              <el-table-column prop="lastLogin" label="最后登录" width="150" />
              <el-table-column label="操作" width="80" align="center" fixed="right">
                <template #default="scope">
                  <el-dropdown 
                    trigger="click"
                    placement="bottom-end"
                    @command="handleDropdownCommand"
                  >
                    <el-button type="text" class="action-dropdown-btn" @click="setActiveRow(scope.row)">
                      <el-icon><More /></el-icon>
                    </el-button>
                    <template #dropdown>
                      <el-dropdown-menu class="action-dropdown">
                        <el-dropdown-item command="edit">
                          <el-icon><Edit /></el-icon>
                          编辑用户
                        </el-dropdown-item>
                        <el-dropdown-item 
                          command="status"
                          :class="activeRow.status === 1 ? 'warning-item' : 'success-item'"
                        >
                          <el-icon>
                            <component :is="activeRow.status === 1 ? 'SwitchButton' : 'Check'" />
                          </el-icon>
                          {{ activeRow.status === 1 ? '禁用用户' : '启用用户' }}
                        </el-dropdown-item>
                        <el-dropdown-item divided command="reset-password">
                          <el-icon><Key /></el-icon>
                          重置密码
                        </el-dropdown-item>
                        <el-dropdown-item command="view">
                          <el-icon><View /></el-icon>
                          查看详情
                        </el-dropdown-item>
                        <el-dropdown-item divided command="delete" class="danger-item">
                          <el-icon><Delete /></el-icon>
                          删除用户
                        </el-dropdown-item>
                      </el-dropdown-menu>
                    </template>
                  </el-dropdown>
                </template>
              </el-table-column>
            </el-table>

            <!-- 分页 -->
            <div class="pagination-container">
              <div class="selection-info" v-if="selectedUserIds.length > 0">
                已选择 {{ selectedUserIds.length }} 项
                <el-button type="text" @click="clearSelection">取消选择</el-button>
              </div>
              <el-pagination
                v-model:current-page="currentPage"
                v-model:page-size="pageSize"
                :page-sizes="[10, 20, 50, 100]"
                layout="total, sizes, prev, pager, next, jumper"
                :total="total"
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                class="pagination"
              />
            </div>
          </div>

          <!-- 卡片视图 -->
          <div v-else class="card-view">
            <el-row :gutter="16">
              <el-col :xs="24" :sm="12" :md="8" :lg="6" v-for="user in userList" :key="user.id">
                <el-card shadow="hover" class="user-card">
                  <div class="card-header">
                    <el-avatar :size="48" :src="user.avatar" class="card-avatar">
                      <span v-if="!user.avatar">{{ user.name.charAt(0) }}</span>
                    </el-avatar>
                    <div class="card-user-info">
                      <div class="card-username">{{ user.username }}</div>
                      <div class="card-name">{{ user.name }}</div>
                      <el-tag 
                        :type="getRoleType(user.userType)"
                        size="small"
                        class="card-role"
                      >
                        {{ user.userType }}
                      </el-tag>
                    </div>
                  </div>
                  <div class="card-content">
                    <div class="info-item">
                      <el-icon><Phone /></el-icon>
                      <span>{{ user.phone }}</span>
                    </div>
                    <div class="info-item">
                      <el-icon><Message /></el-icon>
                      <span>{{ user.email }}</span>
                    </div>
                    <div class="info-item">
                      <el-icon><Clock /></el-icon>
                      <span>最后登录：{{ user.lastLogin }}</span>
                    </div>
                  </div>
                  <div class="card-actions">
                    <el-switch
                      v-model="user.status"
                      :active-value="1"
                      :inactive-value="0"
                      @change="handleStatusChange(user)"
                      size="small"
                      active-color="#10b981"
                      inactive-color="#dc2626"
                    />
                    <el-dropdown 
                      trigger="click"
                      placement="bottom-end"
                      @command="handleCardDropdownCommand"
                    >
                      <el-button type="text" class="card-action-btn" @click="setActiveRow(user)">
                        <el-icon><More /></el-icon>
                      </el-button>
                      <template #dropdown>
                        <el-dropdown-menu class="card-dropdown">
                          <el-dropdown-item command="edit">
                            <el-icon><Edit /></el-icon>
                            编辑
                          </el-dropdown-item>
                          <el-dropdown-item command="view">
                            <el-icon><View /></el-icon>
                            详情
                          </el-dropdown-item>
                          <el-dropdown-item command="reset-password">
                            <el-icon><Key /></el-icon>
                            重置密码
                          </el-dropdown-item>
                          <el-dropdown-item divided command="delete" class="danger-item">
                            <el-icon><Delete /></el-icon>
                            删除
                          </el-dropdown-item>
                        </el-dropdown-menu>
                      </template>
                    </el-dropdown>
                  </div>
                </el-card>
              </el-col>
            </el-row>
          </div>
        </el-card>
      </div>
    </div>

    <!-- 新增/编辑用户对话框 -->
    <el-dialog
      v-model="dialogVisible"
      :title="isEdit ? '编辑用户' : '新增用户'"
      width="600px"
      :close-on-click-modal="false"
      class="user-dialog"
    >
      <el-form
        ref="userFormRef"
        :model="userForm"
        :rules="userFormRules"
        label-width="100px"
        label-position="right"
      >
        <el-form-item label="用户名" prop="username">
          <el-input v-model="userForm.username" placeholder="请输入用户名" />
        </el-form-item>
        <el-form-item label="姓名" prop="name">
          <el-input v-model="userForm.name" placeholder="请输入姓名" />
        </el-form-item>
        <el-form-item label="手机号" prop="phone">
          <el-input v-model="userForm.phone" placeholder="请输入手机号" />
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="userForm.email" placeholder="请输入邮箱" />
        </el-form-item>
        <el-form-item label="用户类型" prop="userType">
          <el-select v-model="userForm.userType" placeholder="请选择用户类型" style="width: 100%">
            <el-option label="超级管理员" value="超级管理员" />
            <el-option label="管理员" value="管理员" />
            <el-option label="普通用户" value="普通用户" />
            <el-option label="学生" value="学生" />
            <el-option label="教师" value="教师" />
            <el-option label="家长" value="家长" />
          </el-select>
        </el-form-item>
        <el-form-item label="密码" prop="password" v-if="!isEdit">
          <el-input v-model="userForm.password" type="password" placeholder="请输入密码" show-password />
        </el-form-item>
        <el-form-item label="确认密码" prop="confirmPassword" v-if="!isEdit">
          <el-input v-model="userForm.confirmPassword" type="password" placeholder="请确认密码" show-password />
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-switch
            v-model="userForm.status"
            :active-value="1"
            :inactive-value="0"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="handleSubmit">提交</el-button>
        </div>
      </template>
    </el-dialog>

    <!-- 新增用户类型对话框 -->
    <el-dialog
      v-model="typeDialogVisible"
      :title="typeDialogTitle"
      width="400px"
      class="type-dialog"
    >
      <el-form :model="typeForm" label-width="80px">
        <el-form-item label="类型名称">
          <el-input v-model="typeForm.name" placeholder="请输入类型名称" />
        </el-form-item>
        <el-form-item label="上级类型" v-if="!typeForm.id">
          <el-select v-model="typeForm.parentId" placeholder="请选择上级类型" style="width: 100%">
            <el-option label="根目录" value="" />
            <el-option 
              v-for="type in userTypeTree" 
              :key="type.id" 
              :label="type.label" 
              :value="type.id"
            />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="typeDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="saveType">保存</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import { 
  Plus, Upload, Download, Search, Edit, Delete, User, 
  More, ArrowDown, Refresh, Grid, List, Folder,
  Phone, Message, Clock, View, Key
} from '@element-plus/icons-vue'
import { ElMessageBox, ElMessage, type FormInstance } from 'element-plus'

// 显示更多操作菜单
const showMoreActions = ref(false)
const showAdvancedFilter = ref(false)
const listView = ref('table') // 'table' 或 'card'

// 当前激活的行（用于下拉菜单）
const activeRow = ref<any>({})

// 用户类型树数据
const userTypeTree = ref([
  {
    id: '1',
    label: '系统用户',
    icon: 'User',
    count: 45,
    children: [
      { id: '1-1', label: '超级管理员', icon: 'User', count: 3 },
      { id: '1-2', label: '管理员', icon: 'User', count: 8 },
      { id: '1-3', label: '普通用户', icon: 'User', count: 34 }
    ]
  },
  {
    id: '2',
    label: '学生用户',
    icon: 'User',
    count: 989,
    children: [
      { id: '2-1', label: '在读学生', icon: 'User', count: 876 },
      { id: '2-2', label: '已毕业', icon: 'User', count: 113 }
    ]
  },
  {
    id: '3',
    label: '教师用户',
    icon: 'UserFilled',
    count: 156,
    children: [
      { id: '3-1', label: '专职教师', icon: 'UserFilled', count: 89 },
      { id: '3-2', label: '兼职教师', icon: 'UserFilled', count: 67 }
    ]
  },
  {
    id: '4',
    label: '家长用户',
    icon: 'User',
    count: 44,
    children: [
      { id: '4-1', label: '父亲', icon: 'User', count: 22 },
      { id: '4-2', label: '母亲', icon: 'User', count: 22 }
    ]
  }
])

// 树配置
const treeProps = {
  label: 'label',
  children: 'children'
}

// 当前选中的用户类型
const currentTypeId = ref('1')
const currentTypeName = computed(() => {
  const findName = (items: any[], id: string): string => {
    for (const item of items) {
      if (item.id === id) return item.label
      if (item.children) {
        const found = findName(item.children, id)
        if (found) return found
      }
    }
    return ''
  }
  return findName(userTypeTree.value, currentTypeId.value) || '所有用户'
})

// 模拟用户列表数据
const userList = ref([
  { 
    id: 1, 
    username: 'admin', 
    name: '系统管理员', 
    phone: '13800138000', 
    email: 'admin@example.com', 
    userType: '超级管理员', 
    status: 1, 
    createTime: '2024-01-01 10:00:00',
    lastLogin: '2024-03-20 14:30:00',
    avatar: '',
    statusLoading: false
  },
  { 
    id: 2, 
    username: 'zhangsan', 
    name: '张三', 
    phone: '13800138001', 
    email: 'zhangsan@example.com', 
    userType: '管理员', 
    status: 1, 
    createTime: '2024-01-02 10:00:00',
    lastLogin: '2024-03-19 09:15:00',
    avatar: '',
    statusLoading: false
  },
  { 
    id: 3, 
    username: 'lisi', 
    name: '李四', 
    phone: '13800138002', 
    email: 'lisi@example.com', 
    userType: '普通用户', 
    status: 1, 
    createTime: '2024-01-03 10:00:00',
    lastLogin: '2024-03-18 16:45:00',
    avatar: '',
    statusLoading: false
  },
  { 
    id: 4, 
    username: 'wangwu', 
    name: '王五', 
    phone: '13800138003', 
    email: 'wangwu@example.com', 
    userType: '学生', 
    status: 0, 
    createTime: '2024-01-04 10:00:00',
    lastLogin: '2024-03-15 11:20:00',
    avatar: '',
    statusLoading: false
  },
  { 
    id: 5, 
    username: 'zhaoliu', 
    name: '赵六', 
    phone: '13800138004', 
    email: 'zhaoliu@example.com', 
    userType: '教师', 
    status: 1, 
    createTime: '2024-01-05 10:00:00',
    lastLogin: '2024-03-20 08:45:00',
    avatar: '',
    statusLoading: false
  }
])

// 加载状态
const loading = ref(false)

// 选中的用户ID
const selectedUserIds = ref<number[]>([])

// 搜索查询
const searchQuery = ref('')

// 筛选条件
const filterForm = reactive({
  userType: '',
  status: '',
  dateRange: []
})

const activeFilters = ref([
  { key: 'type', label: '用户类型', value: '管理员' },
  { key: 'status', label: '状态', value: '启用' }
])

// 分页
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(userList.value.length)

// 对话框
const dialogVisible = ref(false)
const isEdit = ref(false)
const userFormRef = ref<FormInstance>()

// 用户表单
const userForm = ref({
  id: 0,
  username: '',
  name: '',
  phone: '',
  email: '',
  userType: '',
  password: '',
  confirmPassword: '',
  status: 1 as 0 | 1
})

// 表单验证规则
const userFormRules = {
  username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
  name: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
  phone: [
    { required: true, message: '请输入手机号', trigger: 'blur' },
    { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号', trigger: 'blur' }
  ],
  email: [
    { required: true, message: '请输入邮箱', trigger: 'blur' },
    { type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur' }
  ],
  userType: [{ required: true, message: '请选择用户类型', trigger: 'change' }],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' }, 
    { min: 6, message: '密码长度不能少于6个字符', trigger: 'blur' }
  ],
  confirmPassword: [
    { required: true, message: '请确认密码', trigger: 'blur' },
    { 
      validator: (_rule: any, value: string, callback: (error?: Error) => void) => {
        if (value !== userForm.value.password) {
          callback(new Error('两次输入密码不一致'))
        } else {
          callback()
        }
      }, 
      trigger: 'blur' 
    }
  ]
}

// 用户类型对话框
const typeDialogVisible = ref(false)
const typeDialogTitle = ref('新增用户类型')
const typeForm = reactive({
  id: '',
  name: '',
  parentId: ''
})

// 处理类型点击
const handleTypeClick = (data: any) => {
  currentTypeId.value = data.id
}

// 处理选择变化
const handleSelectionChange = (selection: any[]) => {
  selectedUserIds.value = selection.map(item => item.id)
}

// 清除选择
const clearSelection = () => {
  selectedUserIds.value = []
}

// 处理搜索
const handleSearch = () => {
  console.log('搜索用户：', searchQuery.value)
}

// 应用筛选
const applyFilters = () => {
  console.log('应用筛选：', filterForm)
}

// 重置筛选
const resetFilters = () => {
  Object.assign(filterForm, {
    userType: '',
    status: '',
    dateRange: []
  })
}

// 移除筛选
const removeFilter = (key: string) => {
  const index = activeFilters.value.findIndex(f => f.key === key)
  if (index > -1) {
    activeFilters.value.splice(index, 1)
  }
}

// 处理新增用户
const handleAddUser = () => {
  isEdit.value = false
  userForm.value = {
    id: 0,
    username: '',
    name: '',
    phone: '',
    email: '',
    userType: '',
    password: '',
    confirmPassword: '',
    status: 1
  }
  dialogVisible.value = true
}

// 处理编辑用户
const handleEdit = (row: any) => {
  isEdit.value = true
  userForm.value = { 
    id: row.id,
    username: row.username,
    name: row.name,
    phone: row.phone,
    email: row.email,
    userType: row.userType,
    password: '',
    confirmPassword: '',
    status: row.status
  }
  dialogVisible.value = true
}

// 处理状态变更
const handleStatusChange = async (row: any) => {
  row.statusLoading = true
  try {
    // 模拟API调用
    await new Promise(resolve => setTimeout(resolve, 500))
    row.status = row.status === 1 ? 0 : 1
    ElMessage.success(`用户 ${row.name} 已${row.status === 1 ? '启用' : '禁用'}`)
  } finally {
    row.statusLoading = false
  }
}

// 处理删除
const handleDelete = (row?: any) => {
  const ids = row ? [row.id] : selectedUserIds.value
  if (ids.length === 0) return
  
  ElMessageBox.confirm('确定要删除选中的用户吗？', '删除提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
    confirmButtonClass: 'el-button--danger'
  }).then(() => {
    // 这里可以调用删除API
    console.log('删除用户：', ids)
    ElMessage.success('删除成功')
  }).catch(() => {
    // 取消删除
  })
}

// 处理导入
const handleImport = () => {
  console.log('导入用户')
  showMoreActions.value = false
}

// 处理导出
const handleExport = () => {
  console.log('导出用户')
  showMoreActions.value = false
}

// 刷新列表
const refreshList = () => {
  loading.value = true
  setTimeout(() => {
    loading.value = false
    ElMessage.success('数据已刷新')
  }, 500)
}

// 设置当前激活的行
const setActiveRow = (row: any) => {
  activeRow.value = row
}

// 处理下拉菜单命令（表格视图）
const handleDropdownCommand = (command: string) => {
  const row = activeRow.value
  switch (command) {
    case 'edit':
      handleEdit(row)
      break
    case 'status':
      handleStatusChange(row)
      break
    case 'delete':
      handleDelete(row)
      break
    case 'reset-password':
      handleResetPassword(row)
      break
    case 'view':
      handleViewDetail(row)
      break
  }
}

// 处理卡片下拉菜单命令
const handleCardDropdownCommand = (command: string) => {
  const row = activeRow.value
  switch (command) {
    case 'edit':
      handleEdit(row)
      break
    case 'view':
      handleViewDetail(row)
      break
    case 'reset-password':
      handleResetPassword(row)
      break
    case 'delete':
      handleDelete(row)
      break
  }
}

// 重置密码
const handleResetPassword = (row: any) => {
  ElMessageBox.prompt('请输入新密码', '重置密码', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    inputType: 'password'
  }).then(({ value }) => {
    if (value) {
      console.log(`为用户 ${row.name} 重置密码为：${value}`)
      ElMessage.success('密码重置成功')
    }
  }).catch(() => {})
}

// 查看详情
const handleViewDetail = (row: any) => {
  console.log('查看用户详情：', row)
  ElMessage.info(`查看用户 ${row.name} 的详细信息`)
}

// 处理表单提交
const handleSubmit = async () => {
  if (!userFormRef.value) return
  
  const valid = await userFormRef.value.validate()
  if (valid) {
    // 这里可以调用保存API
    console.log('提交用户表单：', userForm.value)
    dialogVisible.value = false
    ElMessage.success(isEdit.value ? '编辑成功' : '新增成功')
  }
}

// 获取角色类型
const getRoleType = (role: string) => {
  const roleTypes: Record<string, string> = {
    '超级管理员': 'danger',
    '管理员': 'warning',
    '普通用户': '',
    '学生': 'success',
    '教师': 'info',
    '家长': 'primary'
  }
  return roleTypes[role] || ''
}

// 处理分页大小变化
const handleSizeChange = (size: number) => {
  pageSize.value = size
}

// 处理当前页码变化
const handleCurrentChange = (page: number) => {
  currentPage.value = page
}

// 处理新增用户类型
const handleAddType = () => {
  typeDialogTitle.value = '新增用户类型'
  Object.assign(typeForm, {
    id: '',
    name: '',
    parentId: ''
  })
  typeDialogVisible.value = true
}

// 处理编辑用户类型
const handleEditType = (data: any) => {
  typeDialogTitle.value = '编辑用户类型'
  Object.assign(typeForm, {
    id: data.id,
    name: data.label,
    parentId: ''
  })
  typeDialogVisible.value = true
}

// 处理删除用户类型
const handleDeleteType = (data: any) => {
  ElMessageBox.confirm(`确定要删除类型 "${data.label}" 吗？`, '删除提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    console.log('删除类型：', data)
    ElMessage.success('删除成功')
  }).catch(() => {})
}

// 保存用户类型
const saveType = () => {
  if (!typeForm.name.trim()) {
    ElMessage.warning('请输入类型名称')
    return
  }
  
  console.log('保存用户类型：', typeForm)
  typeDialogVisible.value = false
  ElMessage.success('保存成功')
}
</script>

<style scoped>
/* 样式保持不变，使用之前提供的样式 */
.user-management-container {
  padding: 20px;
  background: #f8fafc;
  min-height: 100vh;
}

/* 页面头部样式 */
.page-header {
  background: white;
  border-radius: 12px;
  padding: 24px;
  margin-bottom: 20px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 24px;
}

.title-section {
  flex: 1;
}

.page-title {
  font-size: 24px;
  font-weight: 600;
  color: #1e293b;
  margin: 0 0 8px 0;
  display: flex;
  align-items: center;
  gap: 12px;
}

.page-title .el-icon {
  color: #6366f1;
  font-size: 28px;
}

.subtitle {
  font-size: 14px;
  color: #64748b;
  margin: 0;
}

.header-actions {
  display: flex;
  flex-direction: column;
  gap: 16px;
  align-items: flex-end;
}

.action-group {
  display: flex;
  gap: 12px;
  align-items: center;
  position: relative;
}

.more-actions {
  position: relative;
}

.more-btn {
  padding: 8px 16px;
}

.dropdown-actions {
  position: absolute;
  top: 100%;
  right: 0;
  background: white;
  border-radius: 8px;
  padding: 8px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.12);
  z-index: 1000;
  min-width: 160px;
  display: flex;
  flex-direction: column;
  gap: 4px;
  margin-top: 8px;
  border: 1px solid #e2e8f0;
}

.dropdown-item {
  justify-content: flex-start;
  width: 100%;
  margin: 0;
}

.search-section {
  display: flex;
  gap: 12px;
  align-items: center;
}

.search-input {
  width: 300px;
}

.search-input :deep(.el-input__inner) {
  border-radius: 8px;
}

.search-btn {
  height: 40px;
  padding: 0 20px;
}

/* 筛选区域样式 */
.filter-section {
  background: white;
  border-radius: 12px;
  padding: 16px 24px;
  margin-bottom: 20px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
}

.filter-tags {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
}

.filter-label {
  font-size: 14px;
  color: #64748b;
  font-weight: 500;
}

.filter-tag {
  background: #f1f5f9;
  border: 1px solid #e2e8f0;
  color: #475569;
  font-size: 13px;
}

.filter-toggle {
  margin-left: auto;
  color: #6366f1;
  font-size: 13px;
}

.rotate-icon {
  transform: rotate(180deg);
  transition: transform 0.3s;
}

.advanced-filter {
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid #e2e8f0;
}

.filter-form {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  align-items: center;
}

.filter-select,
.filter-date {
  width: 180px;
}

.filter-form :deep(.el-form-item) {
  margin-bottom: 0;
}

/* 主内容区域样式 */
.main-content {
  display: grid;
  grid-template-columns: 280px 1fr;
  gap: 20px;
  min-height: 600px;
}

/* 左侧面板样式 */
.left-panel {
  display: flex;
  flex-direction: column;
}

.type-card {
  height: 100%;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
}

.type-card :deep(.el-card__header) {
  border-bottom: 1px solid #e2e8f0;
  padding: 16px 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.card-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 600;
  color: #1e293b;
}

.add-type-btn {
  color: #6366f1;
  padding: 4px;
}

.type-tree {
  margin: -8px -12px;
}

.tree-node {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 4px 8px;
  margin: 2px 0;
  border-radius: 6px;
  transition: all 0.2s;
  cursor: pointer;
}

.tree-node:hover {
  background: #f8fafc;
}

.tree-node.active-node {
  background: #6366f1;
}

.tree-node.active-node .tree-node-content {
  color: white;
}

.tree-node-content {
  display: flex;
  align-items: center;
  gap: 8px;
  flex: 1;
  min-width: 0;
  color: #475569;
  transition: color 0.2s;
}

.tree-icon {
  font-size: 16px;
  flex-shrink: 0;
}

.tree-label {
  flex: 1;
  min-width: 0;
  font-size: 14px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.tree-count {
  font-size: 12px;
  color: #94a3b8;
}

.tree-node.active-node .tree-count {
  color: rgba(255, 255, 255, 0.8);
}

.tree-actions {
  display: flex;
  gap: 4px;
  opacity: 0;
  transition: opacity 0.2s;
}

.tree-node:hover .tree-actions {
  opacity: 1;
}

.tree-action-btn {
  padding: 4px;
  color: #64748b;
}

.tree-node.active-node .tree-action-btn {
  color: white;
}

.tree-summary {
  margin-top: 20px;
  padding-top: 20px;
  border-top: 1px solid #e2e8f0;
}

.summary-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 0;
}

.summary-label {
  font-size: 14px;
  color: #64748b;
}

.summary-value {
  font-size: 18px;
  font-weight: 600;
  color: #1e293b;
}

/* 右侧面板样式 */
.right-panel {
  display: flex;
  flex-direction: column;
}

.list-card {
  flex: 1;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
  display: flex;
  flex-direction: column;
}

.list-card :deep(.el-card__header) {
  border-bottom: 1px solid #e2e8f0;
  padding: 16px 20px;
}

.list-card :deep(.el-card__body) {
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 0;
}

.list-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.list-title {
  display: flex;
  align-items: center;
  gap: 8px;
}

.current-type {
  font-weight: 600;
  color: #1e293b;
  font-size: 16px;
}

.user-count {
  font-size: 14px;
  color: #64748b;
}

.list-actions {
  display: flex;
  gap: 16px;
  align-items: center;
}

.refresh-btn,
.view-toggle {
  color: #64748b;
  font-size: 14px;
}

.refresh-btn:hover,
.view-toggle:hover {
  color: #6366f1;
}

/* 表格样式 */
.user-table {
  flex: 1;
  border: none;
}

.user-table :deep(.el-table__header) th {
  background: #f8f9fa;
  color: #495057;
  font-weight: 600;
  border-bottom: 1px solid #e2e8f0;
}

.user-table :deep(.el-table__row) {
  transition: background-color 0.2s;
}

.user-table :deep(.el-table__row:hover) {
  background-color: #f8fafc;
}

.user-cell {
  display: flex;
  align-items: center;
  gap: 12px;
}

.user-avatar {
  background: linear-gradient(135deg, #6366f1, #8b5cf6);
  color: white;
  font-weight: 500;
}

.user-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.username {
  font-weight: 500;
  color: #1e293b;
}

.name {
  font-size: 12px;
  color: #64748b;
}

.role-tag {
  font-weight: 500;
  border-radius: 12px;
  padding: 0 8px;
}

/* 操作按钮样式 */
.action-dropdown-btn {
  color: #64748b;
  padding: 8px;
  border-radius: 6px;
}

.action-dropdown-btn:hover {
  background: #f1f5f9;
  color: #6366f1;
}

.action-dropdown :deep(.el-dropdown-menu__item) {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  font-size: 14px;
}

.action-dropdown :deep(.el-dropdown-menu__item).danger-item {
  color: #ef4444;
}

.action-dropdown :deep(.el-dropdown-menu__item).danger-item:hover {
  background: #fef2f2;
  color: #dc2626;
}

.action-dropdown :deep(.el-dropdown-menu__item).warning-item {
  color: #f59e0b;
}

.action-dropdown :deep(.el-dropdown-menu__item).success-item {
  color: #10b981;
}

/* 分页样式 */
.pagination-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  border-top: 1px solid #e2e8f0;
  background: #f8fafc;
  border-radius: 0 0 12px 12px;
}

.selection-info {
  font-size: 14px;
  color: #64748b;
}

.pagination {
  margin: 0;
}

/* 卡片视图样式 */
.card-view {
  padding: 20px;
  flex: 1;
  overflow-y: auto;
}

.user-card {
  margin-bottom: 16px;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
  transition: all 0.3s;
}

.user-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
  border-color: #6366f1;
}

.card-header {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 16px;
}

.card-avatar {
  background: linear-gradient(135deg, #6366f1, #8b5cf6);
  color: white;
  font-weight: 500;
}

.card-user-info {
  flex: 1;
  min-width: 0;
}

.card-username {
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 4px;
}

.card-name {
  font-size: 14px;
  color: #64748b;
  margin-bottom: 8px;
}

.card-role {
  font-size: 12px;
}

.card-content {
  margin-bottom: 16px;
}

.info-item {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  color: #64748b;
  margin-bottom: 8px;
}

.info-item .el-icon {
  color: #94a3b8;
  font-size: 14px;
}

.card-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 16px;
  border-top: 1px solid #e2e8f0;
}

.card-action-btn {
  color: #64748b;
  padding: 4px;
}

.card-action-btn:hover {
  color: #6366f1;
}

.card-dropdown :deep(.el-dropdown-menu__item) {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  font-size: 14px;
}

/* 对话框样式 */
.user-dialog :deep(.el-dialog__header),
.type-dialog :deep(.el-dialog__header) {
  border-bottom: 1px solid #e2e8f0;
  margin-right: 0;
}

.user-dialog :deep(.el-dialog__body),
.type-dialog :deep(.el-dialog__body) {
  padding: 20px;
}

/* 响应式设计 */
@media (max-width: 1200px) {
  .main-content {
    grid-template-columns: 1fr;
  }
  
  .left-panel {
    margin-bottom: 20px;
  }
}

@media (max-width: 768px) {
  .page-header {
    flex-direction: column;
    align-items: stretch;
    gap: 16px;
  }
  
  .header-actions {
    align-items: stretch;
  }
  
  .search-section {
    flex-direction: column;
  }
  
  .search-input {
    width: 100%;
  }
  
  .main-content {
    gap: 16px;
  }
}
</style>