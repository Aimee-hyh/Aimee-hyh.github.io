<template>
  <div class="teacher-list-container">
    <h2 class="page-title">教师列表</h2>
    
    <!-- 操作栏 -->
    <div class="operation-bar">
      <el-button type="primary" @click="handleAddTeacher">
        <el-icon><Plus /></el-icon>
        新增教师
      </el-button>
      <el-button type="warning" @click="handleBatchOperation('status')" :disabled="selectedTeacherIds.length === 0">
        <el-icon><SwitchButton /></el-icon>
        批量变更状态
      </el-button>
      <el-button type="danger" @click="handleBatchOperation('delete')" :disabled="selectedTeacherIds.length === 0">
        <el-icon><Delete /></el-icon>
        批量删除
      </el-button>
      <div class="search-box">
        <el-input
          v-model="searchQuery"
          placeholder="请输入教师姓名或联系方式"
          class="search-input"
          clearable
        >
          <template #append>
            <el-button type="primary" @click="handleSearch">
              <el-icon><Search /></el-icon>
              搜索
            </el-button>
          </template>
        </el-input>
      </div>
    </div>
    
    <!-- 筛选条件 -->
    <el-card shadow="hover" class="filter-card">
      <el-form :inline="true" :model="filterForm" class="filter-form">
        <el-form-item label="姓名">
          <el-input v-model="filterForm.name" placeholder="请输入姓名" clearable />
        </el-form-item>
        <el-form-item label="性别" class="gender-select">
          <el-select v-model="filterForm.gender" placeholder="请选择性别" clearable>
            <el-option label="男" value="男" />
            <el-option label="女" value="女" />
          </el-select>
        </el-form-item>
        <el-form-item label="学历" class="education-select">
          <el-select v-model="filterForm.education" placeholder="请选择学历" clearable>
            <el-option label="大专" value="大专" />
            <el-option label="本科" value="本科" />
            <el-option label="硕士" value="硕士" />
            <el-option label="博士" value="博士" />
          </el-select>
        </el-form-item>
        <el-form-item label="状态" class="status-select">
          <el-select v-model="filterForm.status" placeholder="请选择状态" clearable>
            <el-option label="在职" value="在职" />
            <el-option label="请假" value="请假" />
            <el-option label="离职" value="离职" />
          </el-select>
        </el-form-item>
        <el-form-item label="所属部门" class = "department-select">
          <el-select v-model="filterForm.department" placeholder="请选择部门" clearable>
            <el-option label="语文组" value="语文组" />
            <el-option label="数学组" value="数学组" />
            <el-option label="英语组" value="英语组" />
            <el-option label="综合组" value="综合组" />
          </el-select>
        </el-form-item>
        <el-form-item class="filter-buttons">
          <el-button type="primary" @click="handleSearch">查询</el-button>
          <el-button @click="handleReset">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    
    <!-- 教师列表 -->
    <el-card shadow="hover" class="teacher-table-card">
      <el-table
        v-loading="loading"
        :data="filteredTeacherList"
        @selection-change="handleSelectionChange"
        stripe
        border
        style="width: 100%"
      >
        <el-table-column type="selection" width="55" />
        <el-table-column type="index" label="序号" width="60" />
        <el-table-column prop="name" label="姓名" min-width="120" show-overflow-tooltip>
          <template #default="scope">
            <div class="teacher-name-cell">
              <a 
                class="teacher-name-link" 
                href="javascript:void(0)" 
                @click="handleViewDetail(scope.row)"
              >
                {{ scope.row.name }}
              </a>
              <div class="teacher-tags">
                <el-tag
                  v-for="(tag, index) in scope.row.tags || []"
                  :key="index"
                  size="small"
                  type="info"
                >
                  {{ tag }}
                </el-tag>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="gender" label="性别" width="80" />
        <el-table-column prop="age" label="年龄" width="80" />
        <el-table-column prop="education" label="学历" min-width="100" />
        <el-table-column prop="major" label="专业" min-width="120" show-overflow-tooltip />
        <el-table-column prop="teachingYears" label="教龄" width="80" />
        <el-table-column prop="phone" label="联系方式" min-width="130" />
        <el-table-column prop="department" label="所属部门" min-width="100" />
        <el-table-column prop="status" label="状态" width="100">
          <template #default="scope">
            <el-tag :type="getStatusTagType(scope.row.status)">
              {{ scope.row.status }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="hireDate" label="入职时间" width="120" />
        <el-table-column label="操作" width="80" fixed="right">
          <template #default="scope">
            <el-dropdown 
              @command="(command: string) => handleDropdownCommand(command, scope.row)" 
              @visible-change="(visible: boolean) => handleDropdownVisible(visible, scope.row)"
            >
              <el-icon>
                <MoreFilled />
              </el-icon>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item command="view">
                    <el-icon><View /></el-icon>
                    查看
                  </el-dropdown-item>
                  <el-dropdown-item command="edit">
                    <el-icon><Edit /></el-icon>
                    编辑
                  </el-dropdown-item>
                  <el-dropdown-item command="status">
                    <el-icon><SwitchButton /></el-icon>
                    变更状态
                  </el-dropdown-item>
                  <el-dropdown-item 
                    command="delete" 
                    :disabled="scope.row.status === '在职'"
                    divided
                    class="dropdown-item-danger"
                  >
                    <el-icon><Delete /></el-icon>
                    删除
                  </el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </template>
        </el-table-column>
      </el-table>
      
      <!-- 分页 -->
      <div class="pagination-container">
        <el-pagination
          v-model:current-page="currentPage"
          v-model:page-size="pageSize"
          :page-sizes="[10, 20, 50, 100]"
          layout="total, sizes, prev, pager, next, jumper"
          :total="totalTeachers"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </el-card>
    
    <!-- 状态变更对话框 -->
    <el-dialog
      v-model="statusDialogVisible"
      title="变更教师状态"
      width="400px"
      :close-on-click-modal="false"
    >
      <el-form :model="statusForm" label-width="100px">
        <el-form-item label="当前状态">
          <el-tag :type="getStatusTagType(editingTeacher.status)">
            {{ editingTeacher.status }}
          </el-tag>
        </el-form-item>
        <el-form-item label="目标状态" prop="status">
          <el-select v-model="statusForm.status" placeholder="请选择目标状态">
            <el-option label="在职" value="在职" />
            <el-option label="请假" value="请假" />
            <el-option label="离职" value="离职" />
          </el-select>
        </el-form-item>
        <el-form-item label="变更原因" prop="reason">
          <el-input
            v-model="statusForm.reason"
            type="textarea"
            placeholder="请输入变更原因"
            rows="3"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="statusDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="handleStatusSubmit">保存</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { 
  Plus, View, Edit, MoreFilled, Search,
  SwitchButton, Delete
} from '@element-plus/icons-vue'
import { ElMessageBox, ElMessage } from 'element-plus'

const router = useRouter()

// 当前操作的行
const activeRow = ref<any>(null)

// 加载状态
const loading = ref(false)

// 搜索查询
const searchQuery = ref('')

// 筛选表单
const filterForm = ref({
  name: '',
  gender: '',
  education: '',
  status: '',
  department: ''
})

// 分页
const currentPage = ref(1)
const pageSize = ref(10)

// 选中的教师ID
const selectedTeacherIds = ref<number[]>([])

// 模拟教师列表数据
const teacherList = ref([
  {
    id: 1,
    name: '张老师',
    gender: '女',
    age: 32,
    education: '本科',
    major: '汉语言文学',
    teachingYears: 8,
    phone: '13800138001',
    department: '语文组',
    status: '在职',
    hireDate: '2016-09-01',
    email: 'zhang@example.com',
    address: '北京市朝阳区',
    tags: ['资深教师', '教研组长']
  },
  {
    id: 2,
    name: '李老师',
    gender: '男',
    age: 35,
    education: '硕士',
    major: '数学',
    teachingYears: 10,
    phone: '13800138002',
    department: '数学组',
    status: '在职',
    hireDate: '2014-09-01',
    email: 'li@example.com',
    address: '北京市海淀区',
    tags: ['学科带头人']
  },
  {
    id: 3,
    name: '王老师',
    gender: '女',
    age: 28,
    education: '本科',
    major: '英语',
    teachingYears: 5,
    phone: '13800138003',
    department: '英语组',
    status: '请假',
    hireDate: '2019-09-01',
    email: 'wang@example.com',
    address: '北京市西城区',
    tags: ['青年教师']
  },
  {
    id: 4,
    name: '赵老师',
    gender: '男',
    age: 40,
    education: '博士',
    major: '物理',
    teachingYears: 15,
    phone: '13800138004',
    department: '综合组',
    status: '在职',
    hireDate: '2009-09-01',
    email: 'zhao@example.com',
    address: '北京市丰台区',
    tags: ['特级教师', '学科带头人']
  },
  {
    id: 5,
    name: '刘老师',
    gender: '女',
    age: 30,
    education: '硕士',
    major: '化学',
    teachingYears: 7,
    phone: '13800138005',
    department: '综合组',
    status: '离职',
    hireDate: '2017-09-01',
    email: 'liu@example.com',
    address: '北京市石景山区',
    tags: ['骨干教师']
  }
])

// 计算过滤后的教师列表
const filteredTeacherList = computed(() => {
  let result = [...teacherList.value]
  
  // 搜索过滤
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    result = result.filter(item => 
      item.name.toLowerCase().includes(query) || 
      item.phone.includes(query)
    )
  }
  
  // 高级筛选
  if (filterForm.value.name) {
    result = result.filter(item => item.name.includes(filterForm.value.name))
  }
  
  if (filterForm.value.gender) {
    result = result.filter(item => item.gender === filterForm.value.gender)
  }
  
  if (filterForm.value.education) {
    result = result.filter(item => item.education === filterForm.value.education)
  }
  
  if (filterForm.value.status) {
    result = result.filter(item => item.status === filterForm.value.status)
  }
  
  if (filterForm.value.department) {
    result = result.filter(item => item.department === filterForm.value.department)
  }
  
  // 分页
  const start = (currentPage.value - 1) * pageSize.value
  const end = start + pageSize.value
  return result.slice(start, end)
})

// 教师总数
const totalTeachers = computed(() => teacherList.value.length)

// 状态类型映射
const getStatusTagType = (status: string) => {
  const typeMap: Record<string, string> = {
    '在职': 'success',
    '请假': 'warning',
    '离职': 'danger'
  }
  return typeMap[status] || 'info'
}

// 选中教师变化
const handleSelectionChange = (selection: any[]) => {
  selectedTeacherIds.value = selection.map(item => item.id)
}

// 搜索
const handleSearch = () => {
  currentPage.value = 1
  console.log('搜索教师：', { ...filterForm.value, searchQuery: searchQuery.value })
}

// 重置
const handleReset = () => {
  searchQuery.value = ''
  filterForm.value = {
    name: '',
    gender: '',
    education: '',
    status: '',
    department: ''
  }
  currentPage.value = 1
  handleSearch()
}

// 新增教师
const handleAddTeacher = () => {
  router.push('/teacher/add')
}

// 查看详情
const handleViewDetail = (row: any) => {
  router.push(`/teacher/detail/${row.id}`)
}

// 编辑
const handleEdit = (row: any) => {
  router.push(`/teacher/detail/${row.id}?mode=edit`)
}

// 处理下拉菜单显示/隐藏
const handleDropdownVisible = (visible: boolean, row: any) => {
  if (visible) {
    activeRow.value = row
  }
}

// 处理下拉菜单命令
const handleDropdownCommand = (command: string, row: any) => {
  if (command === 'view') {
    handleViewDetail(row)
  } else if (command === 'edit') {
    handleEdit(row)
  } else if (command === 'status') {
    handleChangeStatus(row)
  } else if (command === 'delete') {
    handleDelete(row)
  }
}

// 变更状态
const editingTeacher = ref<any>({ id: 0, status: '' })
const statusDialogVisible = ref(false)
const statusForm = ref({
  status: '',
  reason: ''
})

const handleChangeStatus = (row: any) => {
  editingTeacher.value = row
  statusForm.value = {
    status: row.status,
    reason: ''
  }
  statusDialogVisible.value = true
}

// 状态变更提交
const handleStatusSubmit = () => {
  console.log('变更状态：', editingTeacher.value.id, statusForm.value)
  
  // 业务规则检查
  if (statusForm.value.status === '请假') {
    // 请假申请需提前24小时提交，紧急情况需备注说明
    if (!statusForm.value.reason.includes('紧急')) {
      ElMessage.warning('请假申请需提前24小时提交，紧急情况请在备注中说明')
    }
  }
  
  // 状态变更逻辑
  const index = teacherList.value.findIndex(item => item.id === editingTeacher.value.id)
  if (index !== -1) {
    teacherList.value[index].status = statusForm.value.status
    
    // 离职后账号自动停用
    if (statusForm.value.status === '离职') {
      console.log(`教师${editingTeacher.value.name}已离职，账号自动停用`)
    }
    
    ElMessage.success('状态变更成功')
  }
  statusDialogVisible.value = false
}

// 删除
const handleDelete = (row?: any) => {
  const ids = row ? [row.id] : selectedTeacherIds.value
  if (ids.length === 0) return
  
  ElMessageBox.confirm('确定要删除选中的教师吗？', '删除提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    // 检查是否有在职教师
    const hasActiveTeachers = teacherList.value.some(item => 
      ids.includes(item.id) && item.status === '在职'
    )
    if (hasActiveTeachers) {
      ElMessage.warning('有在职教师不可直接删除')
      return
    }
    
    // 删除逻辑
    teacherList.value = teacherList.value.filter(item => 
      !ids.includes(item.id)
    )
    selectedTeacherIds.value = []
    ElMessage.success('删除成功')
  }).catch(() => {
    // 取消删除
  })
}

// 批量操作
const handleBatchOperation = (type: string) => {
  if (type === 'status') {
    if (selectedTeacherIds.value.length === 0) return
    ElMessage.info('批量变更状态功能开发中')
  } else if (type === 'delete') {
    handleDelete()
  }
}

// 分页大小变化
const handleSizeChange = (size: number) => {
  pageSize.value = size
  currentPage.value = 1
  console.log('每页条数：', size)
}

// 当前页码变化
const handleCurrentChange = (page: number) => {
  currentPage.value = page
  console.log('当前页码：', page)
}
</script>

<style scoped>
.teacher-list-container {
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

.search-box {
  margin-left: auto;
}

.search-input {
  width: 300px;
}

/* 筛选卡片样式 */
.filter-card {
  margin-bottom: 20px;
}

.filter-form {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}
.filter-buttons {
  margin-left: auto;
}

/* 教师表格样式 */
.teacher-table-card {
  margin-top: 20px;
}

/* 教师名字单元格样式 */
.teacher-name-cell {
  display: flex;
  flex-direction: column;
}

.teacher-name-link {
  font-weight: 500;
  color: #409eff;
  text-decoration: none;
  cursor: pointer;
  transition: color 0.2s;
  margin-bottom: 5px;
}

.teacher-name-link:hover {
  color: #66b1ff;
  text-decoration: underline;
}

.teacher-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
}

.teacher-tags :deep(.el-tag) {
  margin-right: 0;
  height: 22px;
  line-height: 20px;
}

/* 下拉菜单项样式 */
.dropdown-item-danger {
  color: #f56c6c;
}

/* 筛选条件下拉选择器宽度 */
.status-select :deep(.el-select) {
  width: 120px;
}

.gender-select :deep(.el-select) {
  width: 120px;
}

.education-select :deep(.el-select) {
  width: 120px;
}
.department-select :deep(.el-select) {
  width: 120px;
}

.dropdown-item-danger:hover {
  color: #fff;
  background-color: #f56c6c;
}

/* 分页样式 */
.pagination-container {
  display: flex;
  justify-content: flex-end;
  margin-top: 20px;
}

/* 对话框样式 */
.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

/* 表格样式调整 */
.teacher-table-card :deep(.el-table) {
  width: 100%;
}

.teacher-table-card :deep(.el-table th),
.teacher-table-card :deep(.el-table td) {
  padding: 12px 8px;
}

.teacher-table-card :deep(.el-table .cell) {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* 操作列样式调整 */
.teacher-table-card :deep(.el-dropdown) {
  cursor: pointer;
}

.teacher-table-card :deep(.el-icon) {
  font-size: 16px;
  color: #606266;
  transition: color 0.2s;
}

.teacher-table-card :deep(.el-icon:hover) {
  color: #409eff;
}

/* 响应式调整 */
@media (max-width: 1200px) {
  .filter-form {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .filter-buttons {
    margin-left: 0;
    width: 100%;
    text-align: right;
  }
  
  .search-input {
    width: 200px;
  }
}

@media (max-width: 768px) {
  .operation-bar {
    flex-wrap: wrap;
  }
  
  .search-box {
    width: 100%;
    margin-left: 0;
    margin-top: 10px;
  }
  
  .search-input {
    width: 100%;
  }
}
</style>