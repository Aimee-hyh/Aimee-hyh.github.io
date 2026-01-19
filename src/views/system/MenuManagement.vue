<template>
  <div class="menu-management-container">
    <h2 class="page-title">菜单管理</h2>
    
    <!-- 操作栏 -->
    <div class="operation-bar">
      <el-button type="primary" @click="handleAddMenu">
        <el-icon><Plus /></el-icon>
        新增菜单
      </el-button>
      <el-button type="success" @click="handleAddDir">
        <el-icon><FolderAdd /></el-icon>
        新增目录
      </el-button>
      <el-button type="danger" @click="handleDelete" :disabled="!selectedMenu">
        <el-icon><Delete /></el-icon>
        删除
      </el-button>
      <el-button type="warning" @click="handleRefresh">
        <el-icon><Refresh /></el-icon>
        刷新
      </el-button>
    </div>
    
    <!-- 菜单树和菜单详情 -->
    <div class="main-content">
      <!-- 左侧菜单树 -->
      <div class="menu-tree">
        <el-card shadow="hover" class="tree-card">
          <template #header>
            <div class="card-header">
              <span>菜单结构</span>
            </div>
          </template>
          <el-tree
            :data="menuTree"
            :props="treeProps"
            :default-expanded-keys="['1']"
            @node-click="handleMenuClick"
            :highlight-current="true"
            node-key="id"
          >
            <template #default="{ node, data }">
              <span class="tree-node">
                <el-icon>
                  <component :is="data.type === 0 ? 'Folder' : data.type === 1 ? 'Menu' : 'Link'" />
                </el-icon>
                <span>{{ node.label }}</span>
              </span>
            </template>
          </el-tree>
        </el-card>
      </div>
      
      <!-- 右侧菜单详情 -->
      <div class="menu-detail">
        <el-card shadow="hover">
          <template #header>
            <div class="card-header">
              <span>{{ selectedMenu ? (isEdit ? '编辑菜单' : '菜单详情') : '请选择菜单' }}</span>
            </div>
          </template>
          
          <div v-if="selectedMenu" class="detail-content">
            <el-form
              ref="menuFormRef"
              :model="menuForm"
              :rules="menuFormRules"
              label-width="120px"
            >
              <el-form-item label="菜单名称" prop="name">
                <el-input v-model="menuForm.name" placeholder="请输入菜单名称" />
              </el-form-item>
              
              <el-form-item label="菜单类型" prop="type">
                <el-select v-model="menuForm.type" placeholder="请选择菜单类型" @change="handleTypeChange">
                  <el-option label="目录" :value="0" />
                  <el-option label="菜单" :value="1" />
                  <el-option label="按钮" :value="2" />
                </el-select>
              </el-form-item>
              
              <el-form-item label="上级菜单" prop="parentId">
                <el-select v-model="menuForm.parentId" placeholder="请选择上级菜单">
                  <el-option label="顶级菜单" :value="0" />
                  <el-option
                    v-for="item in menuOptions"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"
                    :disabled="item.id === menuForm.id"
                  />
                </el-select>
              </el-form-item>
              
              <el-form-item label="路由地址" prop="path" v-if="menuForm.type !== 0">
                <el-input v-model="menuForm.path" placeholder="请输入路由地址" />
              </el-form-item>
              
              <el-form-item label="组件路径" prop="component" v-if="menuForm.type === 1">
                <el-input v-model="menuForm.component" placeholder="请输入组件路径" />
              </el-form-item>
              
              <el-form-item label="权限标识" prop="permission" v-if="menuForm.type === 2">
                <el-input v-model="menuForm.permission" placeholder="请输入权限标识" />
              </el-form-item>
              
              <el-form-item label="菜单图标" prop="icon">
                <el-input v-model="menuForm.icon" placeholder="请输入图标名称（如：User）" />
              </el-form-item>
              
              <el-form-item label="排序" prop="sort">
                <el-input-number v-model="menuForm.sort" :min="0" :step="1" />
              </el-form-item>
              
              <el-form-item label="是否显示" prop="visible">
                <el-switch v-model="menuForm.visible" />
              </el-form-item>
              
              <el-form-item label="是否缓存" prop="keepAlive" v-if="menuForm.type === 1">
                <el-switch v-model="menuForm.keepAlive" />
              </el-form-item>
              
              <el-form-item label="重定向地址" prop="redirect" v-if="menuForm.type === 0">
                <el-input v-model="menuForm.redirect" placeholder="请输入重定向地址" />
              </el-form-item>
            </el-form>
            
            <!-- 操作按钮 -->
            <div class="form-actions">
              <el-button type="primary" @click="handleSubmit">保存</el-button>
              <el-button @click="handleCancel">取消</el-button>
            </div>
          </div>
          
          <div v-else class="empty-detail">
            <el-empty description="请选择一个菜单进行编辑" />
          </div>
        </el-card>
      </div>
    </div>
    
    <!-- 新增菜单对话框 -->
    <el-dialog
      v-model="dialogVisible"
      :title="isAddDir ? '新增目录' : '新增菜单'"
      width="600px"
      :close-on-click-modal="false"
    >
      <el-form
        ref="addMenuFormRef"
        :model="addMenuForm"
        :rules="menuFormRules"
        label-width="120px"
      >
        <el-form-item label="菜单名称" prop="name">
          <el-input v-model="addMenuForm.name" placeholder="请输入菜单名称" />
        </el-form-item>
        
        <el-form-item label="菜单类型" prop="type">
          <el-select v-model="addMenuForm.type" placeholder="请选择菜单类型" @change="handleAddTypeChange">
            <el-option label="目录" :value="0" />
            <el-option label="菜单" :value="1" />
            <el-option label="按钮" :value="2" />
          </el-select>
        </el-form-item>
        
        <el-form-item label="上级菜单" prop="parentId">
          <el-select v-model="addMenuForm.parentId" placeholder="请选择上级菜单">
            <el-option label="顶级菜单" :value="0" />
            <el-option
              v-for="item in menuOptions"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        
        <el-form-item label="路由地址" prop="path" v-if="addMenuForm.type !== 0">
          <el-input v-model="addMenuForm.path" placeholder="请输入路由地址" />
        </el-form-item>
        
        <el-form-item label="组件路径" prop="component" v-if="addMenuForm.type === 1">
          <el-input v-model="addMenuForm.component" placeholder="请输入组件路径" />
        </el-form-item>
        
        <el-form-item label="权限标识" prop="permission" v-if="addMenuForm.type === 2">
          <el-input v-model="addMenuForm.permission" placeholder="请输入权限标识" />
        </el-form-item>
        
        <el-form-item label="菜单图标" prop="icon">
          <el-input v-model="addMenuForm.icon" placeholder="请输入图标名称（如：User）" />
        </el-form-item>
        
        <el-form-item label="排序" prop="sort">
          <el-input-number v-model="addMenuForm.sort" :min="0" :step="1" />
        </el-form-item>
        
        <el-form-item label="是否显示" prop="visible">
          <el-switch v-model="addMenuForm.visible" />
        </el-form-item>
        
        <el-form-item label="是否缓存" prop="keepAlive" v-if="addMenuForm.type === 1">
          <el-switch v-model="addMenuForm.keepAlive" />
        </el-form-item>
        
        <el-form-item label="重定向地址" prop="redirect" v-if="addMenuForm.type === 0">
          <el-input v-model="addMenuForm.redirect" placeholder="请输入重定向地址" />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="handleAddSubmit">提交</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { Plus, FolderAdd, Delete, Refresh } from '@element-plus/icons-vue'
import { ElMessageBox, ElMessage } from 'element-plus'

// 菜单树数据
const menuTree = ref([
  {
    id: 1,
    name: '仪表盘',
    type: 1,
    path: '/dashboard',
    component: 'views/Dashboard.vue',
    icon: 'DataAnalysis',
    sort: 1,
    visible: true,
    keepAlive: true,
    parentId: 0,
    children: []
  },
  {
    id: 2,
    name: '系统管理',
    type: 0,
    path: '/system',
    icon: 'Setting',
    sort: 2,
    visible: true,
    redirect: '/system/user',
    parentId: 0,
    children: [
      {
        id: 21,
        name: '用户管理',
        type: 1,
        path: '/system/user',
        component: 'views/system/UserManagement.vue',
        icon: 'User',
        sort: 1,
        visible: true,
        keepAlive: true,
        parentId: 2,
        children: []
      },
      {
        id: 22,
        name: '菜单管理',
        type: 1,
        path: '/system/menu',
        component: 'views/system/MenuManagement.vue',
        icon: 'Menu',
        sort: 2,
        visible: true,
        keepAlive: true,
        parentId: 2,
        children: []
      },
      {
        id: 23,
        name: '角色管理',
        type: 1,
        path: '/system/role',
        component: 'views/system/RoleManagement.vue',
        icon: 'UserFilled',
        sort: 3,
        visible: true,
        keepAlive: true,
        parentId: 2,
        children: []
      }
    ]
  },
  {
    id: 3,
    name: '学生管理',
    type: 0,
    path: '/student',
    icon: 'User',
    sort: 3,
    visible: true,
    redirect: '/student/list',
    parentId: 0,
    children: [
      {
        id: 31,
        name: '学生列表',
        type: 1,
        path: '/student/list',
        component: 'views/student/StudentList.vue',
        icon: 'List',
        sort: 1,
        visible: true,
        keepAlive: true,
        parentId: 3,
        children: []
      }
    ]
  }
])

// 树配置
const treeProps = {
  label: 'name',
  children: 'children'
}

// 选中的菜单
const selectedMenu = ref<any>(null)
const isEdit = ref(false)

// 新增菜单对话框
const dialogVisible = ref(false)
const isAddDir = ref(false)

// 表单引用
const menuFormRef = ref()
const addMenuFormRef = ref()

// 菜单表单
const menuForm = ref({
  id: 0,
  name: '',
  type: 0,
  path: '',
  component: '',
  permission: '',
  icon: '',
  sort: 0,
  visible: true,
  keepAlive: false,
  redirect: '',
  parentId: 0
})

// 新增菜单表单
const addMenuForm = ref({
  id: 0,
  name: '',
  type: 0,
  path: '',
  component: '',
  permission: '',
  icon: '',
  sort: 0,
  visible: true,
  keepAlive: false,
  redirect: '',
  parentId: 0
})

// 表单验证规则
const menuFormRules = {
  name: [{ required: true, message: '请输入菜单名称', trigger: 'blur' }],
  type: [{ required: true, message: '请选择菜单类型', trigger: 'change' }],
  path: [{ required: true, message: '请输入路由地址', trigger: 'blur' }],
  component: [{ required: true, message: '请输入组件路径', trigger: 'blur' }],
  parentId: [{ required: true, message: '请选择上级菜单', trigger: 'change' }],
  sort: [{ required: true, message: '请输入排序', trigger: 'blur' }]
}

// 菜单选项（用于选择上级菜单）
const menuOptions = ref<any[]>([])

// 计算所有菜单选项（扁平化）
const flattenMenuOptions = (tree: any[], prefix: string = ''): any[] => {
  let result: any[] = []
  for (const item of tree) {
    result.push({
      ...item,
      name: prefix + item.name
    })
    if (item.children && item.children.length > 0) {
      result = result.concat(flattenMenuOptions(item.children, prefix + '└ '))
    }
  }
  return result
}

// 加载菜单数据
const loadMenuData = () => {
  // 这里可以调用API获取菜单数据
  menuOptions.value = flattenMenuOptions(menuTree.value)
}

// 处理菜单点击
const handleMenuClick = (data: any) => {
  selectedMenu.value = data
  isEdit.value = true
  menuForm.value = { ...data }
}

// 处理类型变更
const handleTypeChange = () => {
  if (menuForm.value.type !== 1) {
    menuForm.value.keepAlive = false
  }
  if (menuForm.value.type === 0) {
    menuForm.value.component = ''
    menuForm.value.permission = ''
  } else if (menuForm.value.type === 2) {
    menuForm.value.component = ''
    menuForm.value.keepAlive = false
  }
}

// 处理新增类型变更
const handleAddTypeChange = () => {
  if (addMenuForm.value.type !== 1) {
    addMenuForm.value.keepAlive = false
  }
  if (addMenuForm.value.type === 0) {
    addMenuForm.value.component = ''
    addMenuForm.value.permission = ''
  } else if (addMenuForm.value.type === 2) {
    addMenuForm.value.component = ''
    addMenuForm.value.keepAlive = false
  }
}

// 处理新增菜单
const handleAddMenu = () => {
  isAddDir.value = false
  initAddMenuForm()
  dialogVisible.value = true
}

// 处理新增目录
const handleAddDir = () => {
  isAddDir.value = true
  initAddMenuForm(0)
  dialogVisible.value = true
}

// 初始化新增菜单表单
const initAddMenuForm = (type: number = 1) => {
  addMenuForm.value = {
    id: 0,
    name: '',
    type: type,
    path: '',
    component: '',
    permission: '',
    icon: '',
    sort: 0,
    visible: true,
    keepAlive: false,
    redirect: '',
    parentId: 0
  }
}

// 处理删除
const handleDelete = () => {
  if (!selectedMenu.value) return
  
  ElMessageBox.confirm('确定要删除该菜单吗？', '删除提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    // 这里可以调用删除API
    console.log('删除菜单：', selectedMenu.value)
    ElMessage.success('删除成功')
    // 刷新菜单树
    handleRefresh()
  }).catch(() => {
    // 取消删除
  })
}

// 处理刷新
const handleRefresh = () => {
  selectedMenu.value = null
  isEdit.value = false
  loadMenuData()
}

// 处理表单提交
const handleSubmit = () => {
  menuFormRef.value.validate((valid: boolean) => {
    if (valid) {
      // 这里可以调用保存API
      console.log('保存菜单：', menuForm.value)
      ElMessage.success('保存成功')
      // 刷新菜单树
      handleRefresh()
    }
  })
}

// 处理取消
const handleCancel = () => {
  selectedMenu.value = null
  isEdit.value = false
}

// 处理新增菜单提交
const handleAddSubmit = () => {
  addMenuFormRef.value.validate((valid: boolean) => {
    if (valid) {
      // 这里可以调用新增API
      console.log('新增菜单：', addMenuForm.value)
      ElMessage.success('新增成功')
      dialogVisible.value = false
      // 刷新菜单树
      handleRefresh()
    }
  })
}

// 组件挂载时加载数据
onMounted(() => {
  loadMenuData()
})
</script>

<style scoped>
.menu-management-container {
  width: 100%;
}

.page-title {
  margin: 0 0 20px 0;
  font-size: 20px;
  font-weight: 600;
  color: #2c3e50;
}

/* 操作栏样式 */
.operation-bar {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 20px;
}

/* 主内容区域 */
.main-content {
  display: grid;
  grid-template-columns: 300px 1fr;
  gap: 20px;
  height: calc(100vh - 200px);
}

/* 菜单树样式 */
.menu-tree {
  overflow: hidden;
}

.tree-card {
  height: 100%;
}

.tree-node {
  display: flex;
  align-items: center;
  gap: 5px;
}

/* 菜单详情样式 */
.menu-detail {
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.card-header {
  display: flex;
  align-items: center;
}

.detail-content {
  padding: 20px 0;
}

.empty-detail {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 30px;
}

/* 对话框样式 */
.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}
</style>