<template>
  <div class="lesson-records-container">
    <!-- 页面标题和操作 -->
    <div class="page-header">
      <h2 class="page-title">课堂记录</h2>
      <div class="header-actions">
        <el-button @click="handleBack">返回门户</el-button>
        <el-button type="primary" @click="handleAddRecord">
          <el-icon><Plus /></el-icon>
          新增记录
        </el-button>
      </div>
    </div>
    
    <!-- 筛选区域 -->
    <el-card shadow="hover" class="filter-card">
      <el-form :model="filterForm" inline>
        <el-form-item label="日期范围">
          <el-date-picker
            v-model="filterForm.dateRange"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            format="YYYY-MM-DD"
            value-format="YYYY-MM-DD"
          />
        </el-form-item>
        <el-form-item label="科目">
          <el-select v-model="filterForm.subject" placeholder="请选择科目">
            <el-option label="语文" value="语文" />
            <el-option label="数学" value="数学" />
            <el-option label="英语" value="英语" />
          </el-select>
        </el-form-item>
        <el-form-item label="班级">
          <el-select v-model="filterForm.className" placeholder="请选择班级">
            <el-option label="八年级(1)班" value="八年级(1)班" />
            <el-option label="七年级(2)班" value="七年级(2)班" />
            <el-option label="六年级(3)班" value="六年级(3)班" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">查询</el-button>
          <el-button @click="handleReset">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    
    <!-- 课堂记录列表 -->
    <el-card shadow="hover" class="records-card">
      <el-table
        v-loading="loading"
        :data="filteredRecords"
        style="width: 100%"
        stripe
        border
      >
        <el-table-column type="index" label="序号" width="60" />
        <el-table-column prop="date" label="日期" width="120" />
        <el-table-column prop="subject" label="科目" width="100" />
        <el-table-column prop="className" label="班级" width="120" />
        <el-table-column prop="topic" label="授课主题" min-width="150" />
        <el-table-column prop="attendance" label="出勤情况" width="120">
          <template #default="scope">
            {{ scope.row.attendance.attended }}/{{ scope.row.attendance.total }}人
          </template>
        </el-table-column>
        <el-table-column prop="homework" label="作业布置" width="150">
          <template #default="scope">
            <el-tag :type="scope.row.homework ? 'success' : 'warning'">
              {{ scope.row.homework ? '已布置' : '未布置' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="evaluation" label="教学评价" width="100">
          <template #default="scope">
            <el-rate v-model="scope.row.evaluation" disabled :max="5" />
          </template>
        </el-table-column>
        <el-table-column label="操作" width="150" fixed="right">
          <template #default="scope">
            <el-button type="primary" size="small" @click="handleViewDetail(scope.row)" :icon="View">
              查看
            </el-button>
            <el-button type="success" size="small" @click="handleEditRecord(scope.row)" :icon="Edit">
              编辑
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      
      <!-- 分页 -->
      <div class="pagination">
        <el-pagination
          v-model:current-page="currentPage"
          v-model:page-size="pageSize"
          :page-sizes="[10, 20, 50, 100]"
          layout="total, sizes, prev, pager, next, jumper"
          :total="totalRecords"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </el-card>
    
    <!-- 课堂记录详情对话框 -->
    <el-dialog
      v-model="recordDialogVisible"
      :title="dialogTitle"
      width="600px"
    >
      <el-form ref="recordFormRef" :model="recordForm" label-width="120px" :rules="formRules">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="日期" prop="date">
              <el-date-picker
                v-model="recordForm.date"
                type="date"
                placeholder="请选择日期"
                format="YYYY-MM-DD"
                value-format="YYYY-MM-DD"
                :disabled="!isEditMode"
              />
            </el-form-item>
            <el-form-item label="科目" prop="subject">
              <el-select v-model="recordForm.subject" placeholder="请选择科目" :disabled="!isEditMode">
                <el-option label="语文" value="语文" />
                <el-option label="数学" value="数学" />
                <el-option label="英语" value="英语" />
              </el-select>
            </el-form-item>
            <el-form-item label="班级" prop="className">
              <el-select v-model="recordForm.className" placeholder="请选择班级" :disabled="!isEditMode">
                <el-option label="八年级(1)班" value="八年级(1)班" />
                <el-option label="七年级(2)班" value="七年级(2)班" />
                <el-option label="六年级(3)班" value="六年级(3)班" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="授课主题" prop="topic">
              <el-input v-model="recordForm.topic" placeholder="请输入授课主题" :disabled="!isEditMode" />
            </el-form-item>
            <el-form-item label="教学评价" prop="evaluation">
              <el-rate v-model="recordForm.evaluation" :max="5" :disabled="!isEditMode" />
            </el-form-item>
            <el-form-item label="课堂时长">
              <el-input-number v-model="recordForm.duration" :min="1" :max="240" :disabled="!isEditMode" />
              <span style="margin-left: 8px;">分钟</span>
            </el-form-item>
          </el-col>
        </el-row>
        
        <el-form-item label="出勤情况">
          <div class="attendance-info">
            <div class="attendance-item">
              <span class="label">应到人数：</span>
              <el-input-number v-model="recordForm.attendance.total" :min="1" :disabled="!isEditMode" />
            </div>
            <div class="attendance-item">
              <span class="label">实到人数：</span>
              <el-input-number v-model="recordForm.attendance.attended" :min="0" :max="recordForm.attendance.total" :disabled="!isEditMode" />
            </div>
            <div class="attendance-item">
              <span class="label">缺勤人数：</span>
              <span class="value">{{ recordForm.attendance.total - recordForm.attendance.attended }}</span>
            </div>
          </div>
        </el-form-item>
        
        <el-form-item label="授课内容" prop="content">
          <el-input
            v-model="recordForm.content"
            type="textarea"
            placeholder="请输入授课内容"
            rows="4"
            :disabled="!isEditMode"
          />
        </el-form-item>
        
        <el-form-item label="作业布置" prop="homework">
          <el-input
            v-model="recordForm.homework"
            type="textarea"
            placeholder="请输入作业布置"
            rows="3"
            :disabled="!isEditMode"
          />
        </el-form-item>
        
        <el-form-item label="教学反思">
          <el-input
            v-model="recordForm.reflection"
            type="textarea"
            placeholder="请输入教学反思"
            rows="3"
            :disabled="!isEditMode"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="recordDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="handleSaveRecord" v-if="isEditMode">确定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { Plus, View, Edit } from '@element-plus/icons-vue'

const router = useRouter()

// 加载状态
const loading = ref(false)

// 筛选表单
const filterForm = ref({
  dateRange: [],
  subject: '',
  className: ''
})

// 分页
const currentPage = ref(1)
const pageSize = ref(10)
const totalRecords = ref(0)

// 课堂记录数据
const lessonRecords = ref([
  {
    id: 1,
    date: '2024-03-20',
    subject: '语文',
    className: '八年级(1)班',
    topic: '《背影》课文分析',
    duration: 45,
    attendance: { total: 45, attended: 43, absent: 2 },
    content: '讲解了《背影》的写作背景、主题思想和艺术特色，重点分析了父亲的人物形象和文中的细节描写。',
    homework: '1. 完成课后练习题；2. 写一篇关于父爱的作文',
    reflection: '课堂氛围良好，学生参与度高，但部分学生对细节描写的理解还不够深入，需要在后续课程中加强训练。',
    evaluation: 4.9
  },
  {
    id: 2,
    date: '2024-03-19',
    subject: '语文',
    className: '七年级(2)班',
    topic: '修辞手法讲解',
    duration: 45,
    attendance: { total: 42, attended: 41, absent: 1 },
    content: '讲解了比喻、拟人、夸张等修辞手法的定义和用法，并通过实例分析帮助学生理解。',
    homework: '找出课文中使用修辞手法的句子并分析其作用',
    reflection: '学生对修辞手法的兴趣较高，参与互动积极，教学效果良好。',
    evaluation: 4.8
  },
  {
    id: 3,
    date: '2024-03-18',
    subject: '语文',
    className: '六年级(3)班',
    topic: '作文写作指导',
    duration: 45,
    attendance: { total: 40, attended: 39, absent: 1 },
    content: '指导学生如何写好一篇记叙文，包括选材、结构安排和语言表达等方面。',
    homework: '完成一篇题为《我的校园》的记叙文',
    reflection: '部分学生对作文结构的掌握还不够好，需要在下次课中进行针对性训练。',
    evaluation: 4.7
  }
])

// 计算过滤后的记录
const filteredRecords = computed(() => {
  let result = [...lessonRecords.value]
  
  // 日期范围过滤
  if (filterForm.value.dateRange && filterForm.value.dateRange.length === 2) {
    const startDate = new Date(filterForm.value.dateRange[0])
    const endDate = new Date(filterForm.value.dateRange[1])
    result = result.filter(item => {
      const itemDate = new Date(item.date)
      return itemDate >= startDate && itemDate <= endDate
    })
  }
  
  // 科目过滤
  if (filterForm.value.subject) {
    result = result.filter(item => item.subject === filterForm.value.subject)
  }
  
  // 班级过滤
  if (filterForm.value.className) {
    result = result.filter(item => item.className === filterForm.value.className)
  }
  
  // 更新总数
  totalRecords.value = result.length
  
  // 分页
  const start = (currentPage.value - 1) * pageSize.value
  const end = start + pageSize.value
  return result.slice(start, end)
})

// 对话框相关
const recordDialogVisible = ref(false)
const isEditMode = ref(true)
const dialogTitle = ref('新增课堂记录')
const recordFormRef = ref()

// 记录表单
const recordForm = ref({
  id: 0,
  date: '',
  subject: '',
  className: '',
  topic: '',
  duration: 45,
  attendance: {
    total: 0,
    attended: 0,
    absent: 0
  },
  content: '',
  homework: '',
  reflection: '',
  evaluation: 5
})

// 表单验证规则
const formRules = {
  date: [
    { required: true, message: '请选择日期', trigger: 'change' }
  ],
  subject: [
    { required: true, message: '请选择科目', trigger: 'change' }
  ],
  className: [
    { required: true, message: '请选择班级', trigger: 'change' }
  ],
  topic: [
    { required: true, message: '请输入授课主题', trigger: 'blur' }
  ],
  content: [
    { required: true, message: '请输入授课内容', trigger: 'blur' }
  ]
}

// 返回门户
const handleBack = () => {
  router.push('/teacher/portal')
}

// 搜索
const handleSearch = () => {
  currentPage.value = 1
  console.log('搜索课堂记录：', filterForm.value)
}

// 重置
const handleReset = () => {
  filterForm.value = {
    dateRange: [],
    subject: '',
    className: ''
  }
  currentPage.value = 1
  handleSearch()
}

// 新增记录
const handleAddRecord = () => {
  isEditMode.value = true
  dialogTitle.value = '新增课堂记录'
  recordForm.value = {
    id: 0,
    date: new Date().toISOString().split('T')[0],
    subject: '',
    className: '',
    topic: '',
    duration: 45,
    attendance: {
      total: 0,
      attended: 0,
      absent: 0
    },
    content: '',
    homework: '',
    reflection: '',
    evaluation: 5
  }
  recordDialogVisible.value = true
}

// 查看详情
const handleViewDetail = (row: any) => {
  isEditMode.value = false
  dialogTitle.value = '课堂记录详情'
  recordForm.value = { ...row }
  recordDialogVisible.value = true
}

// 编辑记录
const handleEditRecord = (row: any) => {
  isEditMode.value = true
  dialogTitle.value = '编辑课堂记录'
  recordForm.value = { ...row }
  recordDialogVisible.value = true
}

// 保存记录
const handleSaveRecord = async () => {
  try {
    await recordFormRef.value.validate()
    
    // 计算缺勤人数
    recordForm.value.attendance.absent = recordForm.value.attendance.total - recordForm.value.attendance.attended
    
    if (recordForm.value.id === 0) {
      // 新增记录
      recordForm.value.id = lessonRecords.value.length + 1
      lessonRecords.value.unshift(recordForm.value)
      ElMessage.success('新增记录成功')
    } else {
      // 更新记录
      const index = lessonRecords.value.findIndex(item => item.id === recordForm.value.id)
      if (index !== -1) {
        lessonRecords.value[index] = recordForm.value
        ElMessage.success('更新记录成功')
      }
    }
    
    recordDialogVisible.value = false
  } catch (error) {
    console.error('表单验证失败：', error)
    ElMessage.error('表单验证失败，请检查必填项')
  }
}

// 分页大小变化
const handleSizeChange = (size: number) => {
  pageSize.value = size
  currentPage.value = 1
}

// 当前页码变化
const handleCurrentChange = (page: number) => {
  currentPage.value = page
}
</script>

<style scoped>
.lesson-records-container {
  width: 100%;
  padding: 20px;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  flex-wrap: wrap;
  gap: 16px;
}

.page-title {
  margin: 0;
  font-size: 24px;
  font-weight: 600;
  color: var(--color-dark-gray);
}

.header-actions {
  display: flex;
  gap: 8px;
}

.filter-card,
.records-card {
  margin-bottom: 20px;
}

.pagination {
  margin-top: 20px;
  text-align: right;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
}

.attendance-info {
  display: flex;
  gap: 24px;
  align-items: center;
  flex-wrap: wrap;
}

.attendance-item {
  display: flex;
  align-items: center;
  gap: 8px;
}

.attendance-item .label {
  font-weight: 500;
  color: var(--color-medium-gray);
}

.attendance-item .value {
  color: var(--color-dark-gray);
  font-weight: 500;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .lesson-records-container {
    padding: 10px;
  }
  
  .page-header {
    flex-direction: column;
    align-items: stretch;
  }
  
  .header-actions {
    justify-content: center;
  }
  
  .attendance-info {
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
  }
}
</style>