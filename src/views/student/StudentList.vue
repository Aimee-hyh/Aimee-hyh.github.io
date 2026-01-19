<template>
  <div class="student-list-container">
    <h2 class="page-title">学生列表</h2>
    
    <!-- 操作栏 -->
    <div class="operation-bar">
      <el-button type="primary" @click="handleAddStudent">
        <el-icon><Plus /></el-icon>
        新增学生
      </el-button>
      <el-button type="success" @click="handleImport">
        <el-icon><Upload /></el-icon>
        导入学生
      </el-button>
      <el-button type="warning" @click="handleExport">
        <el-icon><Download /></el-icon>
        导出学生
      </el-button>
      <el-button type="danger" @click="handleDelete" :disabled="selectedStudentIds.length === 0">
        <el-icon><Delete /></el-icon>
        批量删除
      </el-button>
      <el-button type="info" @click="handleTagManage">
        <el-icon><CollectionTag /></el-icon>
        标签管理
      </el-button>
      <div class="search-box">
        <el-input
          v-model="searchQuery"
          placeholder="请输入学生姓名或手机号"
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
        <el-form-item label="性别" class = "gender-select">
          <el-select v-model="filterForm.gender" placeholder="请选择性别" clearable>
            <el-option label="男" value="男" />
            <el-option label="女" value="女" />
          </el-select>
        </el-form-item>
        <el-form-item label="年级">
          <el-input v-model="filterForm.grade" placeholder="请输入年级" clearable />
        </el-form-item>
        <el-form-item label="在读状态" class="status-select">
          <el-select v-model="filterForm.status" placeholder="请选择在读状态" clearable>
            <el-option label="潜在" value="潜在" />
            <el-option label="在读" value="在读" />
            <el-option label="停学" value="停学" />
            <el-option label="毕业" value="毕业" />
          </el-select>
        </el-form-item>
        <el-form-item label="学校">
          <el-input v-model="filterForm.school" placeholder="请输入学校" clearable />
        </el-form-item>
        <el-form-item class="filter-buttons">
          <el-button type="primary" @click="handleSearch">查询</el-button>
          <el-button @click="handleReset">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    
    <!-- 学生列表 -->
    <el-card shadow="hover" class="student-table-card">
      <el-table
        v-loading="loading"
        :data="studentList"
        @selection-change="handleSelectionChange"
        stripe
        border
        style="width: 100%"
      >
        <el-table-column type="selection" width="55" />
        <el-table-column prop="id" label="ID" width="60" />
        <el-table-column prop="name" label="姓名" min-width="120" show-overflow-tooltip>
          <template #default="scope">
            <div class="student-name-cell">
              <a 
                class="student-name-link" 
                href="javascript:void(0)" 
                @click="handleViewDetail(scope.row)"
              >
                {{ scope.row.name }}
              </a>
              <div class="student-tags">
                <el-tag
                  v-for="tag in scope.row.tags"
                  :key="tag"
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
        <el-table-column prop="birthday" label="出生日期" width="120" />
        <el-table-column prop="school" label="学校" min-width="120" show-overflow-tooltip />
        <el-table-column prop="grade" label="年级" width="100" />
        <el-table-column prop="class" label="班级" width="100" />
        <el-table-column prop="phone" label="联系方式" min-width="100" show-overflow-tooltip />
        <el-table-column prop="status" label="在读状态" width="100">
          <template #default="scope">
            <el-tag :type="getStatusTagType(scope.row.status)">
              {{ scope.row.status }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="enrollmentDate" label="入学日期" width="120" />
        <el-table-column prop="createdAt" label="创建时间" width="180" />
        <el-table-column label="操作" width="80" fixed="right">
          <template #default="scope">
            <el-dropdown 
              @command="handleDropdownCommand" 
              @visible-change="(visible: boolean) => handleDropdownVisible(visible, scope.row)"
            >
              <el-icon><MoreFilled /></el-icon>
              <template #dropdown>
                <el-dropdown-menu>
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
                    :disabled="scope.row.status === '在读'"
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
          :total="total"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </el-card>
    
    <!-- 导入学生对话框 -->
    <el-dialog
      v-model="importDialogVisible"
      title="导入学生"
      width="600px"
      :close-on-click-modal="false"
    >
      <div class="import-content">
        <el-upload
          ref="uploadRef"
          :auto-upload="false"
          :on-change="handleFileChange"
          :file-list="fileList"
          accept=".xlsx, .xls"
        >
          <el-button type="primary">
            <el-icon><Upload /></el-icon>
            选择文件
          </el-button>
        </el-upload>
        <div class="import-tips">
          <p>• 支持 .xlsx, .xls 格式文件</p>
          <p>• 请下载模板文件，按照模板格式填写数据</p>
          <el-button type="text" @click="handleDownloadTemplate">下载模板</el-button>
        </div>
      </div>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="importDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="handleImportSubmit">导入</el-button>
        </div>
      </template>
    </el-dialog>
    
    <!-- 状态变更对话框 -->
    <el-dialog
      v-model="statusDialogVisible"
      title="变更状态"
      width="400px"
      :close-on-click-modal="false"
    >
      <el-form :model="statusForm" label-width="100px">
        <el-form-item label="当前状态">
          <el-tag :type="getStatusTagType(editingStudent.status)">
            {{ editingStudent.status }}
          </el-tag>
        </el-form-item>
        <el-form-item label="目标状态" prop="status">
          <el-select v-model="statusForm.status" placeholder="请选择目标状态">
            <el-option label="潜在" value="潜在" />
            <el-option label="在读" value="在读" />
            <el-option label="停学" value="停学" />
            <el-option label="毕业" value="毕业" />
            <el-option label="流失" value="流失" />
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
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { 
  Plus, Upload, Download, Search, CollectionTag, 
  Edit, SwitchButton, Delete, MoreFilled 
} from '@element-plus/icons-vue'
import { ElMessageBox, ElMessage } from 'element-plus'

const router = useRouter()

// 学生列表数据
const studentList = ref([
  {
    id: 1,
    name: '张三',
    gender: '男',
    birthday: '2010-05-15',
    school: 'XX小学',
    grade: '五年级',
    class: '五(1)班',
    phone: '13800138001',
    email: 'zhangsan@example.com',
    status: '在读',
    enrollmentDate: '2024-09-01',
    tags: ['基础薄弱', '积极主动'],
    createdAt: '2024-09-01 10:00:00'
  },
  {
    id: 2,
    name: '李四',
    gender: '女',
    birthday: '2011-03-20',
    school: 'XX中学',
    grade: '七年级',
    class: '七(2)班',
    phone: '13800138002',
    email: 'lisi@example.com',
    status: '潜在',
    enrollmentDate: '',
    tags: ['特长科目：数学'],
    createdAt: '2024-09-02 14:30:00'
  },
  {
    id: 3,
    name: '王五',
    gender: '男',
    birthday: '2009-08-10',
    school: 'XX高中',
    grade: '高一',
    class: '高一(3)班',
    phone: '13800138003',
    email: 'wangwu@example.com',
    status: '毕业',
    enrollmentDate: '2023-09-01',
    tags: ['学习目标：高考', '积极主动'],
    createdAt: '2023-09-01 09:00:00'
  }
])

// 当前操作的行
const activeRow = ref<any>(null)

// 加载状态
const loading = ref(false)

// 选中的学生ID
const selectedStudentIds = ref<number[]>([])

// 搜索查询
const searchQuery = ref('')

// 筛选表单
const filterForm = ref({
  name: '',
  gender: '',
  grade: '',
  status: '',
  school: ''
})

// 分页
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(studentList.value.length)

// 导入对话框
const importDialogVisible = ref(false)
const uploadRef = ref()
const fileList = ref<any[]>([])

// 状态变更对话框
const statusDialogVisible = ref(false)
const editingStudent = ref<any>({ status: '' })
const statusForm = ref({
  status: '',
  reason: ''
})

// 获取状态标签类型
const getStatusTagType = (status: string) => {
  const typeMap: Record<string, string> = {
    '潜在': 'info',
    '在读': 'success',
    '停学': 'warning',
    '毕业': 'primary',
    '流失': 'danger'
  }
  return typeMap[status] || 'info'
}

// 处理选择变化
const handleSelectionChange = (selection: any[]) => {
  selectedStudentIds.value = selection.map(item => item.id)
}

// 处理搜索
const handleSearch = () => {
  console.log('搜索学生：', { ...filterForm.value, searchQuery: searchQuery.value })
  // 这里可以根据搜索条件过滤学生列表
}

// 处理重置
const handleReset = () => {
  filterForm.value = {
    name: '',
    gender: '',
    grade: '',
    status: '',
    school: ''
  }
  searchQuery.value = ''
  handleSearch()
}

// 处理新增学生
const handleAddStudent = () => {
  router.push('/student/add')
}

// 处理查看详情
const handleViewDetail = (row: any) => {
  router.push(`/student/detail/${row.id}`)
}

// 处理编辑
const handleEdit = (row: any) => {
  router.push(`/student/detail/${row.id}?mode=edit`)
}

// 处理变更状态
const handleChangeStatus = (row: any) => {
  editingStudent.value = row
  statusForm.value = {
    status: row.status,
    reason: ''
  }
  statusDialogVisible.value = true
}

// 处理删除
const handleDelete = (row?: any) => {
  const ids = row ? [row.id] : selectedStudentIds.value
  if (ids.length === 0) return
  
  ElMessageBox.confirm('确定要删除选中的学生吗？', '删除提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    // 这里可以调用删除API
    console.log('删除学生：', ids)
    ElMessage.success('删除成功')
  }).catch(() => {
    // 取消删除
  })
}

// 处理导入
const handleImport = () => {
  importDialogVisible.value = true
}

// 处理导出
const handleExport = () => {
  console.log('导出学生')
  // 这里可以实现导出功能
}

// 处理标签管理
const handleTagManage = () => {
  console.log('标签管理')
  // 这里可以打开标签管理对话框
}

// 处理文件变化
const handleFileChange = (file: any) => {
  fileList.value = [file]
}

// 处理下载模板
const handleDownloadTemplate = () => {
  console.log('下载模板')
  // 这里可以实现下载模板功能
}

// 处理导入提交
const handleImportSubmit = () => {
  if (fileList.value.length === 0) {
    ElMessage.warning('请选择要导入的文件')
    return
  }
  console.log('导入学生：', fileList.value[0])
  importDialogVisible.value = false
  ElMessage.success('导入成功')
}

// 处理状态变更提交
const handleStatusSubmit = () => {
  console.log('变更状态：', editingStudent.value.id, statusForm.value)
  editingStudent.value.status = statusForm.value.status
  statusDialogVisible.value = false
  ElMessage.success('状态变更成功')
}

// 处理分页大小变化
const handleSizeChange = (size: number) => {
  pageSize.value = size
  console.log('每页条数：', size)
}

// 处理当前页码变化
const handleCurrentChange = (page: number) => {
  currentPage.value = page
  console.log('当前页码：', page)
}

// 处理下拉菜单显示/隐藏
const handleDropdownVisible = (visible: boolean, row: typeof studentList.value[number]) => {
  if (visible) {
    activeRow.value = row
  }
}

// 处理下拉菜单命令（表格视图）
const handleDropdownCommand = (command: string) => {
  const row = activeRow.value
  switch (command) {
    case 'view':
      handleViewDetail(row)
      break
    case 'edit':
      handleEdit(row)
      break
    case 'status':
      handleChangeStatus(row)
      break
    case 'delete':
      handleDelete(row)
      break
  }
}


</script>

<style scoped>
.student-list-container {
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

/* 学生表格样式 */
.student-table-card {
  margin-top: 20px;
}

/* 表格样式调整 */
.student-table-card :deep(.el-table) {
  width: 100%;
}

.student-table-card :deep(.el-table th),
.student-table-card :deep(.el-table td) {
  padding: 12px 8px;
}

.student-table-card :deep(.el-table .cell) {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* 学生名字单元格样式 */
.student-name-cell {
  display: flex;
  flex-direction: column;
}

.student-name-link {
  font-weight: 500;
  color: #409eff;
  text-decoration: none;
  cursor: pointer;
  transition: color 0.2s;
  margin-bottom: 5px;
}

.student-name-link:hover {
  color: #66b1ff;
  text-decoration: underline;
}

.student-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
}

.student-tags :deep(.el-tag) {
  margin-right: 0;
  height: 22px;
  line-height: 20px;
}

/* 下拉菜单项样式 */
.dropdown-item-danger {
  color: #f56c6c;
}

/* 在读状态筛选条件下来 */
.status-select :deep(.el-select) {
  width: 150px;
}

/* 性别筛选条件下来 */
.gender-select:deep(.el-select) {
  width: 150px;
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

/* 导入对话框样式 */
.import-content {
  padding: 20px 0;
}

.import-tips {
  margin-top: 20px;
  padding: 10px;
  background-color: #f5f7fa;
  border-radius: 4px;
  color: #606266;
  font-size: 14px;
}

.import-tips p {
  margin: 5px 0;
}

/* 对话框样式 */
.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

/* 操作列样式调整 */
.student-table-card :deep(.el-dropdown) {
  cursor: pointer;
}

.student-table-card :deep(.el-icon) {
  font-size: 16px;
  color: #606266;
  transition: color 0.2s;
}

.student-table-card :deep(.el-icon:hover) {
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