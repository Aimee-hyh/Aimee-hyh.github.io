<template>
  <div class="lesson-record-container">
    <!-- 页面标题和操作 -->
    <div class="page-header">
      <div class="header-left">
        <el-button type="text" @click="handleBack" class="back-btn">
          <el-icon><ArrowLeft /></el-icon>
          返回
        </el-button>
        <h2 class="page-title">课堂记录</h2>
      </div>
      <div class="header-actions">
        <el-button type="primary" @click="handleSaveRecord" :loading="saving" size="large">
          <el-icon><Check /></el-icon>
          保存记录
        </el-button>
      </div>
    </div>

    <!-- 课程基本信息卡片 -->
    <div class="lesson-info-section">
      <div class="lesson-info-card">
        <div class="info-grid">
          <div class="info-item">
            <div class="info-icon">
              <el-icon><Reading /></el-icon>
            </div>
            <div class="info-content">
              <div class="info-label">课程</div>
              <div class="info-value">{{ lessonInfo.courseName }}</div>
            </div>
          </div>
          
          <div class="info-item">
            <div class="info-icon">
              <el-icon><UserFilled /></el-icon>
            </div>
            <div class="info-content">
              <div class="info-label">班级</div>
              <div class="info-value">{{ lessonInfo.className }}</div>
            </div>
          </div>
          
          <div class="info-item">
            <div class="info-icon">
              <el-icon><Clock /></el-icon>
            </div>
            <div class="info-content">
              <div class="info-label">时间</div>
              <div class="info-value">{{ lessonInfo.date }} {{ lessonInfo.timeRange }}</div>
            </div>
          </div>
          
          <div class="info-item">
            <div class="info-icon">
              <el-icon><Location /></el-icon>
            </div>
            <div class="info-content">
              <div class="info-label">教室</div>
              <div class="info-value">{{ lessonInfo.classroom }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 学生名单管理 -->
    <el-card shadow="hover" class="student-list-card">
      <template #header>
        <div class="card-header">
          <div class="card-header-left">
            <h3 class="card-title">
              <el-icon><User /></el-icon>
              学生名单
            </h3>
            <div class="student-stats">
              <el-tag type="primary" size="small">班级生 {{ classStudents.length }}</el-tag>
              <el-tag type="warning" size="small">试听生 {{ trialStudents.length }}</el-tag>
              <el-tag type="info" size="small">其他 {{ otherStudents.length }}</el-tag>
              <el-tag type="success" size="small">总计 {{ totalStudents }}</el-tag>
            </div>
          </div>
          <div class="card-header-right">
            <el-button type="primary" @click="showAddStudentDialog" size="small">
              <el-icon><Plus /></el-icon>
              添加学生
            </el-button>
          </div>
        </div>
      </template>

      <!-- 批量操作工具栏 -->
      <div class="batch-toolbar">
        <div class="batch-left">
          <el-button-group>
            <el-button size="small" @click="batchMarkAll('present')" type="success">
              <el-icon><Check /></el-icon>
              全体出勤
            </el-button>
            <el-button size="small" @click="batchMarkAll('absent')" type="danger">
              <el-icon><Close /></el-icon>
              全体缺勤
            </el-button>
          </el-button-group>
          <span v-if="selectedStudents.length > 0" class="selection-count">
            已选择 {{ selectedStudents.length }} 名学生
          </span>
        </div>
        <div class="batch-right">
          <el-button size="small" plain @click="clearAllSelection">
            <el-icon><Delete /></el-icon>
            清空选择
          </el-button>
        </div>
      </div>

      <!-- 学生表格 -->
      <div class="table-container">
        <el-table 
          :data="allStudents" 
          class="student-table"
          @selection-change="handleSelectionChange"
          row-key="id"
          stripe
          border
          size="small"
          style="width: 100%"
        >
          <el-table-column type="selection" width="48" align="center" fixed />
          
          <el-table-column label="学生信息" width="180" fixed>
            <template #default="{ row }">
              <div class="student-info-cell">
                <el-avatar :size="32" class="student-avatar">
                  {{ row.name.charAt(0) }}
                </el-avatar>
                <div class="student-details">
                  <div class="student-name">{{ row.name }}</div>
                  <div class="student-meta">
                    <el-tag 
                      size="mini" 
                      :type="getStudentTypeTag(row.type)"
                      class="student-type-tag"
                    >
                      {{ getStudentTypeText(row.type) }}
                    </el-tag>
                    <span class="student-id">{{ row.studentId }}</span>
                  </div>
                </div>
              </div>
            </template>
          </el-table-column>

          <el-table-column label="出勤状态" width="120" align="center">
            <template #default="{ row }">
              <el-select 
                v-model="row.attendance" 
                size="small"
                placeholder="状态"
                style="width: 100px"
                class="attendance-select"
              >
                <el-option label="出勤" value="present">
                  <span class="attendance-option present">● 出勤</span>
                </el-option>
                <el-option label="迟到" value="late">
                  <span class="attendance-option late">● 迟到</span>
                </el-option>
                <el-option label="请假" value="leave">
                  <span class="attendance-option leave">● 请假</span>
                </el-option>
                <el-option label="缺勤" value="absent">
                  <span class="attendance-option absent">● 缺勤</span>
                </el-option>
              </el-select>
            </template>
          </el-table-column>

          <el-table-column label="课堂表现" width="140" align="center">
            <template #default="{ row }">
              <el-select 
                v-model="row.performance" 
                size="small"
                placeholder="表现"
                clearable
                style="width: 120px"
                class="performance-select"
              >
                <el-option label="A+ 优秀" value="excellent" class="performance-excellent" />
                <el-option label="A 良好" value="good" class="performance-good" />
                <el-option label="B 一般" value="average" class="performance-average" />
                <el-option label="C 需努力" value="poor" class="performance-poor" />
              </el-select>
            </template>
          </el-table-column>

          <el-table-column label="表现标签" width="200">
            <template #default="{ row }">
              <el-select
                v-model="row.tags"
                multiple
                size="small"
                placeholder="选择标签"
                style="width: 180px"
                collapse-tags
                collapse-tags-tooltip
              >
                <el-option
                  v-for="tag in performanceTags"
                  :key="tag.value"
                  :label="tag.label"
                  :value="tag.value"
                />
              </el-select>
            </template>
          </el-table-column>

          <el-table-column label="随堂成绩" width="120" align="center">
            <template #default="{ row }">
              <el-input-number
                v-model="row.score"
                size="small"
                :min="0"
                :max="100"
                placeholder="分数"
                controls-position="right"
                style="width: 100px"
                :precision="0"
              />
            </template>
          </el-table-column>

          <el-table-column label="个性化评语" min-width="250">
            <template #default="{ row }">
              <div class="comment-cell">
                <el-input
                  v-model="row.comment"
                  type="textarea"
                  :rows="2"
                  placeholder="输入评语..."
                  size="small"
                  :maxlength="200"
                  show-word-limit
                />
                <div class="comment-tools">
                  <el-button 
                    size="mini" 
                    type="text"
                    @click="showCommonComments(row)"
                    class="tool-btn"
                  >
                    <el-icon><Collection /></el-icon>
                    常用评语
                  </el-button>
                  <el-button 
                    size="mini" 
                    type="text"
                    @click="startVoiceInput(row)"
                    class="tool-btn"
                  >
                    <el-icon><Microphone /></el-icon>
                    语音输入
                  </el-button>
                </div>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-card>

    <!-- 作业与照片 -->
    <div class="bottom-section">
      <el-row :gutter="20">
        <el-col :xs="24" :sm="24" :md="14" :lg="16">
          <el-card shadow="hover" class="homework-card">
            <template #header>
              <div class="card-header">
                <h3 class="card-title">
                  <el-icon><Notebook /></el-icon>
                  布置作业
                </h3>
                <el-button type="primary" text size="small" @click="showHomeworkTemplate">
                  从模板选择
                </el-button>
              </div>
            </template>

            <div class="homework-editor">
              <el-input
                v-model="homework.content"
                type="textarea"
                :rows="6"
                placeholder="请输入作业内容..."
                class="homework-input"
                resize="none"
              />
              
              <div class="homework-actions">
                <div class="deadline-picker">
                  <el-date-picker
                    v-model="homework.deadline"
                    type="datetime"
                    placeholder="选择截止时间"
                    size="small"
                    :default-time="new Date(2000, 1, 1, 23, 59, 0)"
                    format="YYYY-MM-DD HH:mm"
                    value-format="YYYY-MM-DD HH:mm:ss"
                  />
                </div>
                <div class="homework-settings">
                  <el-checkbox v-model="homework.remindParents">
                    提醒家长
                  </el-checkbox>
                  <el-checkbox v-model="homework.needSubmit">
                    需要提交
                  </el-checkbox>
                </div>
              </div>
            </div>
          </el-card>
        </el-col>

        <el-col :xs="24" :sm="24" :md="10" :lg="8">
          <el-card shadow="hover" class="photos-card">
            <template #header>
              <div class="card-header">
                <h3 class="card-title">
                  <el-icon><Camera /></el-icon>
                  课堂照片
                  <span class="photo-count">{{ uploadedPhotos.length }}/3</span>
                </h3>
              </div>
            </template>

            <div class="photos-content">
              <el-upload
                class="photos-uploader"
                action="#"
                list-type="picture-card"
                :file-list="uploadedPhotos"
                :on-change="handlePhotoUpload"
                :on-remove="handlePhotoRemove"
                :auto-upload="false"
                accept="image/*"
                :limit="3"
                :on-exceed="handleExceed"
              >
                <el-icon><Plus /></el-icon>
              </el-upload>
              
              <div class="upload-notice">
                <p class="notice-title">上传须知：</p>
                <p class="notice-item">1. 最多可上传3张照片</p>
                <p class="notice-item">2. 建议上传课堂活动、板书、作品照片</p>
                <p class="notice-item">3. 注意保护学生隐私，避免面部特写</p>
              </div>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </div>

    <!-- 添加学生弹窗 -->
    <el-dialog
      v-model="addStudentDialog.visible"
      title="添加学生"
      width="800px"
      :close-on-click-modal="false"
      @close="handleCloseAddDialog"
    >
      <el-tabs v-model="addStudentDialog.activeTab">
        <!-- 选择试听生 -->
        <el-tab-pane label="选择试听生" name="trial">
          <div class="trial-section">
            <div v-if="availableTrialStudents.length === 0" class="empty-state">
              <el-icon><User /></el-icon>
              <p>暂无试听生安排</p>
            </div>
            <div v-else class="student-list">
              <div 
                v-for="student in availableTrialStudents" 
                :key="student.id"
                class="student-item"
                :class="{ 'selected': isTrialStudentSelected(student.id) }"
                @click="toggleTrialStudentSelection(student)"
              >
                <div class="student-info">
                  <div class="avatar">{{ student.name.charAt(0) }}</div>
                  <div class="details">
                    <h4>{{ student.name }}</h4>
                    <div class="meta">
                      <span class="age">{{ student.age }}岁</span>
                      <span class="phone">{{ student.phone }}</span>
                      <span class="arranger">安排：{{ student.arranger }}</span>
                    </div>
                  </div>
                </div>
                <el-checkbox 
                  :model-value="isTrialStudentSelected(student.id)"
                  @change="toggleTrialStudentSelection(student)"
                />
              </div>
            </div>
          </div>
        </el-tab-pane>

        <!-- 搜索添加 -->
        <el-tab-pane label="搜索添加" name="search">
          <div class="search-section">
            <div class="search-bar">
              <el-input
                v-model="addStudentDialog.searchKeyword"
                placeholder="请输入学生姓名、手机号或学号"
                size="large"
                clearable
                @keyup.enter="searchStudents"
              >
                <template #append>
                  <el-button @click="searchStudents">
                    <el-icon><Search /></el-icon>
                    搜索
                  </el-button>
                </template>
              </el-input>
            </div>
            
            <div class="search-results">
              <div v-if="addStudentDialog.searchResults.length === 0 && addStudentDialog.searchKeyword" class="empty-results">
                未找到相关学生
              </div>
              <div v-else-if="addStudentDialog.searchResults.length === 0" class="empty-state">
                <el-icon><Search /></el-icon>
                <p>请输入关键词搜索学生</p>
              </div>
              <div v-else class="student-list">
                <div 
                  v-for="student in addStudentDialog.searchResults"
                  :key="student.id"
                  class="student-item"
                  :class="{ 'selected': isSearchStudentSelected(student.id) }"
                  @click="toggleSearchStudentSelection(student)"
                >
                  <div class="student-info">
                    <div class="avatar">{{ student.name.charAt(0) }}</div>
                    <div class="details">
                      <h4>{{ student.name }}</h4>
                      <div class="meta">
                        <el-tag size="mini">{{ student.className }}</el-tag>
                        <span class="phone">{{ student.phone }}</span>
                      </div>
                    </div>
                  </div>
                  <el-checkbox 
                    :model-value="isSearchStudentSelected(student.id)"
                    @change="toggleSearchStudentSelection(student)"
                  />
                </div>
              </div>
            </div>
          </div>
        </el-tab-pane>

        <!-- 快速新建 -->
        <el-tab-pane label="快速新建" name="new">
          <div class="new-student-section">
            <el-form 
              :model="addStudentDialog.newStudent" 
              label-width="80px"
              class="new-student-form"
              size="large"
            >
              <el-form-item label="学生姓名" required>
                <el-input 
                  v-model="addStudentDialog.newStudent.name" 
                  placeholder="请输入学生姓名"
                />
              </el-form-item>
              <el-form-item label="联系电话" required>
                <el-input 
                  v-model="addStudentDialog.newStudent.phone" 
                  placeholder="请输入联系电话"
                />
              </el-form-item>
              <el-form-item label="备注">
                <el-input 
                  v-model="addStudentDialog.newStudent.remark" 
                  type="textarea"
                  placeholder="可填写备注信息，如：临时补课学生"
                  :rows="3"
                />
              </el-form-item>
            </el-form>
            <el-alert
              title="注意：快速新建的学生将作为临时记录，课后需要由顾问完善详细信息。"
              type="warning"
              :closable="false"
              class="alert-message"
            />
          </div>
        </el-tab-pane>
      </el-tabs>

      <template #footer>
        <div class="dialog-footer">
          <div class="selected-summary" v-if="selectedCount > 0">
            已选择 {{ selectedCount }} 名学生
          </div>
          <div class="footer-actions">
            <el-button @click="addStudentDialog.visible = false">取消</el-button>
            <el-button type="primary" @click="confirmAddStudents" :disabled="selectedCount === 0 && !addStudentDialog.newStudent.name">
              确定添加
            </el-button>
          </div>
        </div>
      </template>
    </el-dialog>

    <!-- 常用评语弹窗 -->
    <el-dialog
      v-model="commonCommentsDialog.visible"
      title="常用评语库"
      width="600px"
    >
      <div class="common-comments-list">
        <div 
          v-for="comment in commonComments" 
          :key="comment.id"
          class="comment-item"
          @click="selectCommonComment(comment)"
        >
          {{ comment.content }}
        </div>
      </div>
      <template #footer>
        <el-button @click="commonCommentsDialog.visible = false">关闭</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import {
  ArrowLeft,
  Check,
  Plus,
  Close,
  Collection,
  Microphone,
  Camera,
  User,
  Reading,
  UserFilled,
  Clock,
  Location,
  Delete,
  Notebook,
  Search
} from '@element-plus/icons-vue'

const router = useRouter()

// 课程信息
const lessonInfo = ref({
  id: 1,
  courseName: '语文课',
  className: '八年级(1)班',
  date: '2024年3月20日',
  timeRange: '14:00-15:40',
  classroom: '教学楼A-301',
  teacher: '张老师'
})

// 学生类型常量
const StudentType = {
  CLASS: 'class',
  TRIAL: 'trial',
  OTHER: 'other'
}

// 学生数据
const classStudents = ref([
  { id: 1, studentId: 'S001', name: '张三', type: StudentType.CLASS, attendance: 'present', performance: null, tags: [], score: null, comment: '' },
  { id: 2, studentId: 'S002', name: '李四', type: StudentType.CLASS, attendance: 'present', performance: null, tags: [], score: null, comment: '' },
  { id: 3, studentId: 'S003', name: '王五', type: StudentType.CLASS, attendance: 'present', performance: null, tags: [], score: null, comment: '' },
  { id: 4, studentId: 'S004', name: '赵六', type: StudentType.CLASS, attendance: 'present', performance: null, tags: [], score: null, comment: '' },
  { id: 5, studentId: 'S005', name: '钱七', type: StudentType.CLASS, attendance: 'present', performance: null, tags: [], score: null, comment: '' }
])

const trialStudents = ref<any[]>([])
const otherStudents = ref<any[]>([])

// 计算属性
const allStudents = computed(() => [
  ...classStudents.value,
  ...trialStudents.value,
  ...otherStudents.value
])

const totalStudents = computed(() => allStudents.value.length)

// 已选中的学生
const selectedStudents = ref<any[]>([])

// 表现标签选项
const performanceTags = ref([
  { label: '积极互动', value: 'active_interaction' },
  { label: '注意力集中', value: 'focused' },
  { label: '思维活跃', value: 'active_thinking' },
  { label: '回答问题积极', value: 'active_answering' },
  { label: '进步明显', value: 'significant_progress' },
  { label: '注意力分散', value: 'distracted' },
  { label: '需要督促', value: 'needs_supervision' },
  { label: '需要加强练习', value: 'needs_practice' }
])

// 作业信息
const homework = ref({
  content: '',
  deadline: null as string | null,
  remindParents: true,
  needSubmit: true
})

// 上传的照片
const uploadedPhotos = ref<any[]>([])

// 添加学生弹窗数据
const addStudentDialog = ref({
  visible: false,
  activeTab: 'trial',
  searchKeyword: '',
  searchResults: [] as any[],
  newStudent: {
    name: '',
    phone: '',
    remark: ''
  },
  selectedTrialStudents: [] as any[],
  selectedSearchStudents: [] as any[]
})

// 可用的试听生
const availableTrialStudents = ref([
  { id: 'T001', name: '试听生A', age: 12, phone: '13800138000', arranger: '李顾问' },
  { id: 'T002', name: '试听生B', age: 13, phone: '13800138001', arranger: '王顾问' }
])

// 常用评语弹窗
const commonCommentsDialog = ref({
  visible: false,
  currentStudent: null as any
})

const commonComments = ref([
  { id: 1, content: '本节课表现优秀，积极参与课堂讨论，继续保持！' },
  { id: 2, content: '学习态度认真，作业完成质量高，值得表扬。' },
  { id: 3, content: '课堂参与度较高，但需要注意课堂纪律。' },
  { id: 4, content: '知识点掌握比较扎实，但需要加强课堂互动。' },
  { id: 5, content: '本节课有明显进步，回答问题积极，继续保持！' },
  { id: 6, content: '需要加强课后复习，巩固本节课所学内容。' },
  { id: 7, content: '思维活跃，能够举一反三，非常好！' },
  { id: 8, content: '课堂表现一般，建议课后多加练习。' }
])

// 保存状态
const saving = ref(false)

// 计算选中数量
const selectedCount = computed(() => {
  const trialCount = addStudentDialog.value.selectedTrialStudents.length
  const searchCount = addStudentDialog.value.selectedSearchStudents.length
  const newCount = addStudentDialog.value.newStudent.name ? 1 : 0
  return trialCount + searchCount + newCount
})

// 方法
const getStudentTypeTag = (type: string) => {
  switch (type) {
    case StudentType.CLASS: return 'primary'
    case StudentType.TRIAL: return 'warning'
    case StudentType.OTHER: return 'info'
    default: return 'info'
  }
}

const getStudentTypeText = (type: string) => {
  switch (type) {
    case StudentType.CLASS: return '班级生'
    case StudentType.TRIAL: return '试听生'
    case StudentType.OTHER: return '其他'
    default: return '其他'
  }
}

const handleSelectionChange = (selection: any[]) => {
  selectedStudents.value = selection
}

const batchMarkAll = (status: string) => {
  const statusMap: Record<string, string> = {
    present: '出勤',
    absent: '缺勤'
  }
  
  ElMessageBox.confirm(
    `确定要将所有学生标记为${statusMap[status]}吗？`,
    '批量操作确认',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }
  ).then(() => {
    allStudents.value.forEach(student => {
      student.attendance = status
    })
    ElMessage.success(`已将所有学生标记为${statusMap[status]}`)
  })
}

const clearAllSelection = () => {
  selectedStudents.value = []
  ElMessage.info('已清空选择')
}

const showAddStudentDialog = () => {
  addStudentDialog.value.visible = true
}

const handleCloseAddDialog = () => {
  // 重置对话框数据
  addStudentDialog.value = {
    visible: false,
    activeTab: 'trial',
    searchKeyword: '',
    searchResults: [],
    newStudent: {
      name: '',
      phone: '',
      remark: ''
    },
    selectedTrialStudents: [],
    selectedSearchStudents: []
  }
}

// 检查试听生是否被选中
const isTrialStudentSelected = (studentId: string) => {
  return addStudentDialog.value.selectedTrialStudents.some((s: any) => s.id === studentId)
}

// 切换试听生选择
const toggleTrialStudentSelection = (student: any) => {
  const index = addStudentDialog.value.selectedTrialStudents.findIndex((s: any) => s.id === student.id)
  if (index === -1) {
    addStudentDialog.value.selectedTrialStudents.push(student)
  } else {
    addStudentDialog.value.selectedTrialStudents.splice(index, 1)
  }
}

// 搜索学生
const searchStudents = () => {
  if (!addStudentDialog.value.searchKeyword.trim()) {
    ElMessage.warning('请输入搜索关键词')
    return
  }

  // 模拟搜索API调用
  addStudentDialog.value.searchResults = [
    { id: 'O001', name: '跨班生A', phone: '13800138002', className: '七年级(2)班', grade: '初一' },
    { id: 'O002', name: '补课生B', phone: '13800138003', className: '八年级(3)班', grade: '初二' }
  ]
}

// 检查搜索学生是否被选中
const isSearchStudentSelected = (studentId: string) => {
  return addStudentDialog.value.selectedSearchStudents.some((s: any) => s.id === studentId)
}

// 切换搜索学生选择
const toggleSearchStudentSelection = (student: any) => {
  const index = addStudentDialog.value.selectedSearchStudents.findIndex((s: any) => s.id === student.id)
  if (index === -1) {
    addStudentDialog.value.selectedSearchStudents.push(student)
  } else {
    addStudentDialog.value.selectedSearchStudents.splice(index, 1)
  }
}

// 确认添加学生
const confirmAddStudents = () => {
  // 添加试听生
  addStudentDialog.value.selectedTrialStudents.forEach((student: any) => {
    trialStudents.value.push({
      id: trialStudents.value.length + 100,
      studentId: student.id,
      name: student.name,
      type: StudentType.TRIAL,
      attendance: 'present',
      performance: null,
      tags: [],
      score: null,
      comment: '',
      phone: student.phone
    })
  })

  // 添加搜索到的学生
  addStudentDialog.value.selectedSearchStudents.forEach((student: any) => {
    otherStudents.value.push({
      id: otherStudents.value.length + 200,
      studentId: student.id,
      name: student.name,
      type: StudentType.OTHER,
      attendance: 'present',
      performance: null,
      tags: [],
      score: null,
      comment: '',
      phone: student.phone,
      className: student.className
    })
  })

  // 添加新建的学生
  if (addStudentDialog.value.newStudent.name && addStudentDialog.value.newStudent.phone) {
    const newId = `TEMP_${Date.now()}`
    otherStudents.value.push({
      id: otherStudents.value.length + 300,
      studentId: newId,
      name: addStudentDialog.value.newStudent.name,
      phone: addStudentDialog.value.newStudent.phone,
      type: StudentType.OTHER,
      attendance: 'present',
      performance: null,
      tags: [],
      score: null,
      comment: addStudentDialog.value.newStudent.remark || '',
      isTemporary: true
    })
    
    ElMessage.warning('已添加临时学生记录，课后请通知顾问完善信息')
  }

  addStudentDialog.value.visible = false
  
  const addedCount = addStudentDialog.value.selectedTrialStudents.length + 
                     addStudentDialog.value.selectedSearchStudents.length + 
                     (addStudentDialog.value.newStudent.name ? 1 : 0)
  
  if (addedCount > 0) {
    ElMessage.success(`成功添加${addedCount}名学生`)
  }
}

const showCommonComments = (student: any) => {
  commonCommentsDialog.value.currentStudent = student
  commonCommentsDialog.value.visible = true
}

const selectCommonComment = (comment: any) => {
  if (commonCommentsDialog.value.currentStudent) {
    commonCommentsDialog.value.currentStudent.comment = comment.content
  }
  commonCommentsDialog.value.visible = false
}

const startVoiceInput = (student: any) => {
  ElMessage.info('语音输入功能正在开发中...')
}

const handlePhotoUpload = (file: any, fileList: any[]) => {
  uploadedPhotos.value = fileList.map(f => ({
    name: f.name,
    url: URL.createObjectURL(f.raw)
  }))
}

const handlePhotoRemove = (file: any, fileList: any[]) => {
  uploadedPhotos.value = fileList
}

const handleExceed = () => {
  ElMessage.warning('最多只能上传3张照片')
}

const showHomeworkTemplate = () => {
  ElMessage.info('作业模板功能正在开发中...')
}

const handleSaveRecord = async () => {
  try {
    saving.value = true

    // 验证出勤状态
    const incomplete = allStudents.value.filter(s => !s.attendance)
    if (incomplete.length > 0) {
      ElMessage.warning(`请为${incomplete.length}名学生选择出勤状态`)
      return
    }

    // 模拟保存过程
    await new Promise(resolve => setTimeout(resolve, 1500))

    ElMessage.success({
      message: '课堂记录保存成功！',
      type: 'success',
      duration: 2000
    })

    // 保存成功后返回
    setTimeout(() => {
      router.push('/dashboard/teacherportal')
    }, 2000)

  } catch (error) {
    ElMessage.error('保存失败，请稍后重试')
  } finally {
    saving.value = false
  }
}

const handleBack = () => {
  router.push('/dashboard/teacherportal')
}
</script>

<style scoped>
.lesson-record-container {
  padding: 20px;
  background-color: #f5f7fa;
  min-height: 100vh;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  padding: 0 8px;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 16px;
}

.back-btn {
  padding: 8px 0;
  color: #666;
}

.back-btn:hover {
  color: var(--el-color-primary);
}

.page-title {
  margin: 0;
  font-size: 24px;
  font-weight: 600;
  color: #1f2d3d;
}

.header-actions {
  display: flex;
  gap: 12px;
  align-items: center;
}

.lesson-info-section {
  margin-bottom: 20px;
}

.lesson-info-card {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 12px;
  padding: 24px;
  color: white;
  box-shadow: 0 6px 20px rgba(102, 126, 234, 0.2);
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
}

.info-item {
  display: flex;
  align-items: center;
  gap: 16px;
}

.info-icon {
  width: 48px;
  height: 48px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.info-icon .el-icon {
  font-size: 24px;
  color: white;
}

.info-content {
  display: flex;
  flex-direction: column;
}

.info-label {
  font-size: 14px;
  opacity: 0.9;
  margin-bottom: 4px;
}

.info-value {
  font-size: 16px;
  font-weight: 600;
}

.student-list-card {
  margin-bottom: 20px;
  border-radius: 12px;
  border: none;
}

:deep(.student-list-card .el-card__header) {
  padding: 20px;
  border-bottom: 1px solid #f0f2f5;
  background-color: #fff;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.card-header-left {
  display: flex;
  align-items: center;
  gap: 16px;
}

.card-title {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: #1f2d3d;
  display: flex;
  align-items: center;
  gap: 8px;
}

.student-stats {
  display: flex;
  gap: 8px;
  align-items: center;
}

.card-header-right {
  display: flex;
  gap: 8px;
}

:deep(.student-list-card .el-card__body) {
  padding: 20px;
}

.batch-toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  background-color: #f8fafc;
  border-radius: 8px;
  margin-bottom: 16px;
  border: 1px solid #e8eaef;
}

.batch-left {
  display: flex;
  align-items: center;
  gap: 16px;
}

.el-button-group {
  display: flex;
  gap: 1px;
}

.selection-count {
  font-size: 14px;
  color: var(--el-color-primary);
  font-weight: 500;
  padding-left: 12px;
  border-left: 1px solid #dcdfe6;
}

.batch-right {
  display: flex;
  gap: 8px;
}

.table-container {
  background: white;
  border-radius: 8px;
  overflow: hidden;
  border: 1px solid #e8eaef;
}

.student-table {
  width: 100%;
}

:deep(.student-table .el-table__header) {
  background-color: #f8fafc;
}

:deep(.student-table .el-table__header th) {
  background-color: #f8fafc;
  color: #1f2d3d;
  font-weight: 600;
  border-bottom: 1px solid #e8eaef;
}

:deep(.student-table .el-table__body tr:hover td) {
  background-color: #f5f7fa;
}

:deep(.student-table .el-table__cell) {
  padding: 12px 8px;
}

.student-info-cell {
  display: flex;
  align-items: center;
  gap: 12px;
}

.student-avatar {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  font-weight: 600;
}

.student-details {
  display: flex;
  flex-direction: column;
}

.student-name {
  font-weight: 600;
  color: #1f2d3d;
  margin-bottom: 4px;
}

.student-meta {
  display: flex;
  align-items: center;
  gap: 8px;
}

.student-type-tag {
  height: 20px;
  line-height: 18px;
  font-size: 12px;
}

.student-id {
  font-size: 12px;
  color: #909399;
}

.attendance-option {
  display: inline-block;
  padding-left: 8px;
}

.attendance-option.present {
  color: var(--el-color-success);
}

.attendance-option.late {
  color: var(--el-color-warning);
}

.attendance-option.leave {
  color: #e6a23c;
}

.attendance-option.absent {
  color: var(--el-color-danger);
}

.comment-cell {
  position: relative;
}

.comment-tools {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 8px;
}

.tool-btn {
  padding: 4px 0;
  font-size: 12px;
  height: auto;
}

.tool-btn .el-icon {
  margin-right: 4px;
}

.bottom-section {
  margin-top: 20px;
}

.bottom-section .el-col {
  margin-bottom: 20px;
}

.homework-card,
.photos-card {
  border-radius: 12px;
  border: none;
  height: 100%;
}

:deep(.homework-card .el-card__header),
:deep(.photos-card .el-card__header) {
  padding: 20px;
  border-bottom: 1px solid #f0f2f5;
}

:deep(.homework-card .card-header),
:deep(.photos-card .card-header) {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

:deep(.homework-card .card-title),
:deep(.photos-card .card-title) {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: #1f2d3d;
  display: flex;
  align-items: center;
  gap: 8px;
}

:deep(.homework-card .el-card__body),
:deep(.photos-card .el-card__body) {
  padding: 20px;
}

.homework-editor {
  display: flex;
  flex-direction: column;
}

.homework-input {
  margin-bottom: 20px;
}

:deep(.homework-input .el-textarea__inner) {
  border-radius: 8px;
  border-color: #e4e7ed;
  resize: none;
}

:deep(.homework-input .el-textarea__inner:focus) {
  border-color: var(--el-color-primary);
}

.homework-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 16px;
}

.deadline-picker {
  flex: 1;
  min-width: 200px;
}

.homework-settings {
  display: flex;
  gap: 20px;
}

.homework-settings .el-checkbox {
  margin-right: 0;
}

.photo-count {
  margin-left: 8px;
  font-size: 14px;
  color: var(--el-color-primary);
  font-weight: 500;
}

.photos-content {
  display: flex;
  flex-direction: column;
}

.photos-uploader {
  margin-bottom: 20px;
}

:deep(.photos-uploader .el-upload--picture-card) {
  width: 100px;
  height: 100px;
  border-radius: 8px;
  border-color: #dcdfe6;
  background-color: #f8fafc;
}

:deep(.photos-uploader .el-upload--picture-card:hover) {
  border-color: var(--el-color-primary);
}

:deep(.photos-uploader .el-upload--picture-card .el-icon) {
  font-size: 24px;
  color: #909399;
}

:deep(.photos-uploader .el-upload-list--picture-card .el-upload-list__item) {
  width: 100px;
  height: 100px;
  border-radius: 8px;
}

.upload-notice {
  padding: 16px;
  background-color: #f8fafc;
  border-radius: 8px;
  border: 1px dashed #dcdfe6;
}

.notice-title {
  margin: 0 0 8px 0;
  font-weight: 600;
  color: #1f2d3d;
  font-size: 14px;
}

.notice-item {
  margin: 4px 0;
  font-size: 13px;
  color: #606266;
  line-height: 1.5;
}

/* 弹窗样式 */
.trial-section,
.search-section,
.new-student-section {
  min-height: 400px;
  max-height: 500px;
  overflow-y: auto;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 300px;
  color: #909399;
}

.empty-state .el-icon {
  font-size: 48px;
  margin-bottom: 16px;
}

.empty-state p {
  margin: 0;
  font-size: 16px;
}

.student-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.student-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px;
  border: 1px solid #e4e7ed;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s;
}

.student-item:hover {
  border-color: var(--el-color-primary);
  background-color: #f5f7fa;
}

.student-item.selected {
  border-color: var(--el-color-primary);
  background-color: rgba(var(--el-color-primary-rgb), 0.1);
}

.student-info {
  display: flex;
  align-items: center;
  gap: 16px;
}

.avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 18px;
}

.details h4 {
  margin: 0 0 8px 0;
  font-size: 16px;
  font-weight: 600;
  color: #1f2d3d;
}

.meta {
  display: flex;
  gap: 16px;
  font-size: 13px;
  color: #606266;
}

.meta .el-tag {
  margin-right: 8px;
}

.search-bar {
  margin-bottom: 20px;
}

:deep(.search-bar .el-input-group__append) {
  background-color: var(--el-color-primary);
  color: white;
  border: none;
}

:deep(.search-bar .el-input-group__append .el-button) {
  color: white;
}

.empty-results {
  text-align: center;
  padding: 60px 20px;
  color: #909399;
  font-size: 16px;
}

.new-student-form {
  padding: 20px 0;
}

.alert-message {
  margin-top: 20px;
}

.dialog-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}

.selected-summary {
  color: var(--el-color-primary);
  font-weight: 500;
}

.footer-actions {
  display: flex;
  gap: 12px;
}

.common-comments-list {
  max-height: 400px;
  overflow-y: auto;
}

.comment-item {
  padding: 12px;
  margin-bottom: 10px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s;
}

.comment-item:hover {
  background-color: #f5f5f5;
  border-color: var(--el-color-primary);
  color: var(--el-color-primary);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .lesson-record-container {
    padding: 12px;
  }
  
  .page-header {
    flex-direction: column;
    gap: 16px;
    align-items: stretch;
  }
  
  .header-left {
    justify-content: space-between;
  }
  
  .lesson-info-card {
    padding: 16px !important;
  }
  
  .info-grid {
    grid-template-columns: 1fr !important;
    gap: 16px !important;
  }
  
  .batch-toolbar {
    flex-direction: column;
    gap: 12px;
    align-items: stretch;
  }
  
  .batch-left {
    justify-content: space-between;
  }
  
  .student-info-cell {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }
  
  .homework-actions {
    flex-direction: column;
    align-items: stretch !important;
  }
  
  .homework-settings {
    justify-content: space-between;
  }
}

@media (max-width: 1024px) {
  .table-container {
    overflow-x: auto;
  }
  
  .student-table {
    min-width: 1000px;
  }
}

/* 滚动条样式 */
::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 3px;
}

::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 3px;
}

::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}
</style>