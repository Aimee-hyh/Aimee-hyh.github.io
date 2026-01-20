<template>
  <div class="teacher-portal-container">
    <!-- 页面标题 -->
    <h2 class="page-title">教师门户</h2>
    
    <!-- 教师信息概览 -->
    <el-card shadow="hover" class="overview-card">
      <div class="overview-content">
        <div class="avatar-section">
          <el-avatar :size="120" class="teacher-avatar">
            <template #default>
              <el-icon><UserFilled /></el-icon>
            </template>
          </el-avatar>
          <h3 class="teacher-name">张老师</h3>
          <el-tag type="success">在职</el-tag>
        </div>
        <div class="info-section">
          <div class="info-grid">
            <div class="info-item">
              <span class="info-label">部门：</span>
              <span class="info-value">语文组</span>
            </div>
            <div class="info-item">
              <span class="info-label">教龄：</span>
              <span class="info-value">8年</span>
            </div>
            <div class="info-item">
              <span class="info-label">主授科目：</span>
              <span class="info-value">语文</span>
            </div>
            <div class="info-item">
              <span class="info-label">当前学期：</span>
              <span class="info-value">2024-2025学年第一学期</span>
            </div>
          </div>
        </div>
      </div>
    </el-card>
    
    <!-- 核心数据区域 -->
    <el-row :gutter="20" class="core-data-section">
      <!-- 左侧：今日课表 -->
      <el-col :xs="24" :sm="24" :md="14" :lg="16">
        <el-card shadow="hover" class="today-schedule-card">
          <template #header>
            <div class="card-header">
              <h3 class="card-title">
                <el-icon><Calendar /></el-icon>
                今日课表 ({{ currentDate }})
              </h3>
              <el-button type="primary" text @click="handleNavigate('/management/teacher/schedule')">
                查看完整课表
              </el-button>
            </div>
          </template>
          
          <div class="schedule-content">
            <el-empty v-if="todaySchedule.length === 0" description="今日无课程安排" :image-size="80" />
            
            <div v-else class="schedule-list">
              <div v-for="item in todaySchedule" :key="item.id" class="schedule-item">
                <div class="schedule-time">
                  <div class="time-range">{{ item.timeRange }}</div>
                  <div class="lesson-period">{{ item.period }}节</div>
                </div>
                <div class="schedule-details">
                  <h4 class="course-name">{{ item.courseName }}</h4>
                  <div class="course-info">
                    <el-tag size="small">{{ item.className }}</el-tag>
                    <span class="location">
                      <el-icon><Location /></el-icon>
                      {{ item.location }}
                    </span>
                  </div>
                  <p v-if="item.remark" class="remark">{{ item.remark }}</p>
                </div>
                <div class="schedule-actions">
                  <el-button v-if="item.needRecord" type="success" size="small" @click="handleRecordLesson(item)">
                    <el-icon><DocumentAdd /></el-icon>
                    课堂记录
                  </el-button>
                </div>
              </div>
            </div>
          </div>
        </el-card>
      </el-col>
      
      <!-- 右侧：待办事项和数据快照 -->
      <el-col :xs="24" :sm="24" :md="10" :lg="8">
        <!-- 待办事项 -->
        <el-card shadow="hover" class="todo-card">
          <template #header>
            <div class="card-header">
              <h3 class="card-title">
                <el-icon><Clock /></el-icon>
                待办事项
              </h3>
            </div>
          </template>
          
          <el-tabs v-model="activeTodoTab" class="todo-tabs">
            <el-tab-pane label="待审批" name="approval">
              <div class="todo-list">
                <div v-if="pendingApprovals.length === 0" class="empty-todo">
                  <el-icon><CircleCheck /></el-icon>
                  <span>暂无待审批事项</span>
                </div>
                <div v-else>
                  <div v-for="item in pendingApprovals" :key="item.id" class="todo-item">
                    <div class="todo-item-content">
                      <h4 class="todo-title">{{ item.title }}</h4>
                      <div class="todo-meta">
                        <span class="todo-type">{{ item.type }}</span>
                        <span class="todo-time">{{ item.submitTime }}</span>
                      </div>
                      <p class="todo-desc">{{ item.description }}</p>
                    </div>
                    <div class="todo-actions">
                      <el-button type="primary" size="small" @click="handleApprove(item)">
                        审批
                      </el-button>
                    </div>
                  </div>
                </div>
              </div>
            </el-tab-pane>
            
            <el-tab-pane label="待记录" name="recording">
              <div class="todo-list">
                <div v-if="pendingRecords.length === 0" class="empty-todo">
                  <el-icon><CircleCheck /></el-icon>
                  <span>暂无待记录事项</span>
                </div>
                <div v-else>
                  <div v-for="item in pendingRecords" :key="item.id" class="todo-item">
                    <div class="todo-item-content">
                      <h4 class="todo-title">{{ item.title }}</h4>
                      <div class="todo-meta">
                        <span class="todo-class">{{ item.className }}</span>
                        <span class="todo-time">{{ item.time }}</span>
                      </div>
                    </div>
                    <div class="todo-actions">
                      <el-button type="success" size="small" @click="handleRecord(item)">
                        记录
                      </el-button>
                    </div>
                  </div>
                </div>
              </div>
            </el-tab-pane>
          </el-tabs>
        </el-card>
        
        <!-- 数据快照 -->
        <el-card shadow="hover" class="snapshot-card">
          <template #header>
            <div class="card-header">
              <h3 class="card-title">
                <el-icon><DataAnalysis /></el-icon>
                数据快照
              </h3>
            </div>
          </template>
          
          <div class="snapshot-content">
            <div class="snapshot-item">
              <div class="snapshot-icon class-icon">
                <el-icon><School /></el-icon>
              </div>
              <div class="snapshot-info">
                <div class="snapshot-value">{{ dataSnapshot.classCount }}</div>
                <div class="snapshot-label">班级数</div>
              </div>
            </div>
            
            <div class="snapshot-item">
              <div class="snapshot-icon student-icon">
                <el-icon><User /></el-icon>
              </div>
              <div class="snapshot-info">
                <div class="snapshot-value">{{ dataSnapshot.studentCount }}</div>
                <div class="snapshot-label">学生数</div>
              </div>
            </div>
            
            <div class="snapshot-item">
              <div class="snapshot-icon course-icon">
                <el-icon><Notebook /></el-icon>
              </div>
              <div class="snapshot-info">
                <div class="snapshot-value">{{ dataSnapshot.courseCount }}</div>
                <div class="snapshot-label">课程数</div>
              </div>
            </div>
            
            <div class="snapshot-item">
              <div class="snapshot-icon record-icon">
                <el-icon><DocumentChecked /></el-icon>
              </div>
              <div class="snapshot-info">
                <div class="snapshot-value">{{ dataSnapshot.recordCount }}</div>
                <div class="snapshot-label">已记录</div>
              </div>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>
    
    <!-- 快捷功能入口 -->
    <el-row :gutter="20" class="quick-actions">
      <el-col :xs="12" :sm="8" :md="6">
        <el-card shadow="hover" class="action-card" @click="handleNavigate('/management/teacher/schedule')">
          <div class="action-content">
            <el-icon class="action-icon"><Calendar /></el-icon>
            <h3 class="action-title">个人课表</h3>
            <p class="action-desc">查看本周和下周的授课安排</p>
          </div>
        </el-card>
      </el-col>
      <el-col :xs="12" :sm="8" :md="6">
        <el-card shadow="hover" class="action-card" @click="handleNavigate('/management/teacher/lesson-records')">
          <div class="action-content">
            <el-icon class="action-icon"><Document /></el-icon>
            <h3 class="action-title">课堂记录</h3>
            <p class="action-desc">填写和查看课堂教学记录</p>
          </div>
        </el-card>
      </el-col>
      <el-col :xs="12" :sm="8" :md="6">
        <el-card shadow="hover" class="action-card" @click="handleNavigate('/management/teacher/teaching-data')">
          <div class="action-content">
            <el-icon class="action-icon"><DataAnalysis /></el-icon>
            <h3 class="action-title">教学数据</h3>
            <p class="action-desc">查看教学绩效和学生评价</p>
          </div>
        </el-card>
      </el-col>
      <el-col :xs="12" :sm="8" :md="6">
        <el-card shadow="hover" class="action-card" @click="handleNavigate('/management/teacher/approval')">
          <div class="action-content">
            <el-icon class="action-icon"><Checked /></el-icon>
            <h3 class="action-title">审批中心</h3>
            <p class="action-desc">处理学生请假等审批事项</p>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { 
  UserFilled, 
  Calendar, 
  Document, 
  DataAnalysis, 
  Clock,
  Location,
  DocumentAdd,
  CircleCheck,
  School,
  User,
  Notebook,
  DocumentChecked,
  Checked
} from '@element-plus/icons-vue'

const router = useRouter()

// 获取当前日期
const currentDate = computed(() => {
  const now = new Date()
  const month = now.getMonth() + 1
  const day = now.getDate()
  const weekDays = ['日', '一', '二', '三', '四', '五', '六']
  const weekDay = weekDays[now.getDay()]
  return `${month}月${day}日 星期${weekDay}`
})

// 今日课表数据
const todaySchedule = ref([
  {
    id: 1,
    timeRange: '08:00-09:40',
    period: 2,
    courseName: '语文课',
    className: '八年级(1)班',
    location: '教学楼A-301',
    remark: '期中考试复习',
    needRecord: true
  },
  {
    id: 2,
    timeRange: '10:00-11:40',
    period: 2,
    courseName: '语文课',
    className: '七年级(2)班',
    location: '教学楼B-203',
    remark: '作文指导课',
    needRecord: false
  },
  {
    id: 3,
    timeRange: '14:00-15:40',
    period: 2,
    courseName: '阅读课',
    className: '八年级(1)班',
    location: '图书馆阅览室',
    remark: '',
    needRecord: true
  }
])

// 待办事项
const activeTodoTab = ref('approval')
const pendingApprovals = ref([
  {
    id: 1,
    title: '学生请假申请',
    type: '请假审批',
    submitTime: '今天 08:30',
    description: '张三同学因病请假一天',
    studentName: '张三',
    className: '八年级(1)班'
  },
  {
    id: 2,
    title: '活动申请',
    type: '活动审批',
    submitTime: '昨天 16:20',
    description: '班级读书会活动场地申请',
    studentName: '李四',
    className: '七年级(2)班'
  }
])

const pendingRecords = ref([
  {
    id: 1,
    title: '语文课堂记录',
    className: '八年级(1)班',
    time: '今天 08:00-09:40',
    courseName: '语文课'
  },
  {
    id: 2,
    title: '阅读课堂记录',
    className: '八年级(1)班',
    time: '今天 14:00-15:40',
    courseName: '阅读课'
  }
])

// 数据快照
const dataSnapshot = ref({
  classCount: 4,
  studentCount: 168,
  courseCount: 6,
  recordCount: 42
})

// 导航到指定页面
const handleNavigate = (path: string) => {
  router.push(path)
}

// 处理课堂记录
const handleRecordLesson = (lesson: any) => {
  console.log('记录课堂:', lesson)
  router.push('/management/teacher/lesson-records?action=add')
}

// 处理审批
const handleApprove = (item: any) => {
  console.log('审批:', item)
  // 这里可以调用审批API
}

// 处理记录
const handleRecord = (item: any) => {
  console.log('记录:', item)
  router.push('/management/teacher/lesson-records?action=add')
}
</script>

<style scoped>
.teacher-portal-container {
  width: 100%;
  padding: 20px;
}

.page-title {
  margin: 0 0 20px 0;
  font-size: 24px;
  font-weight: 600;
  color: var(--color-dark-gray);
}

.overview-card {
  margin-bottom: 20px;
}

.overview-content {
  display: flex;
  gap: 40px;
  flex-wrap: wrap;
}

.avatar-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
}

.teacher-avatar {
  background-color: var(--color-primary);
  font-size: 48px;
  color: white;
}

.teacher-name {
  margin: 0;
  font-size: 24px;
  font-weight: 600;
  color: var(--color-dark-gray);
}

.info-section {
  flex: 1;
  min-width: 400px;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 16px;
}

.info-item {
  display: flex;
  gap: 8px;
}

.info-label {
  font-weight: 500;
  color: var(--color-medium-gray);
  min-width: 80px;
}

.info-value {
  color: var(--color-dark-gray);
}

/* 核心数据区域 */
.core-data-section {
  margin-bottom: 20px;
}

/* 今日课表样式 */
.today-schedule-card,
.todo-card,
.snapshot-card {
  margin-bottom: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.card-title {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: var(--color-dark-gray);
  display: flex;
  align-items: center;
  gap: 8px;
}

.schedule-content {
  padding: 10px 0;
}

.schedule-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.schedule-item {
  display: flex;
  align-items: center;
  padding: 16px;
  background-color: #f8f9fa;
  border-radius: 8px;
  border-left: 4px solid var(--color-primary);
  gap: 20px;
}

.schedule-time {
  display: flex;
  flex-direction: column;
  align-items: center;
  min-width: 80px;
}

.time-range {
  font-size: 16px;
  font-weight: 600;
  color: var(--color-dark-gray);
}

.lesson-period {
  font-size: 12px;
  color: var(--color-medium-gray);
  background-color: #e9ecef;
  padding: 2px 8px;
  border-radius: 10px;
  margin-top: 4px;
}

.schedule-details {
  flex: 1;
}

.course-name {
  margin: 0 0 8px 0;
  font-size: 16px;
  font-weight: 600;
  color: var(--color-dark-gray);
}

.course-info {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 8px;
}

.location {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 14px;
  color: var(--color-medium-gray);
}

.remark {
  margin: 0;
  font-size: 14px;
  color: var(--color-medium-gray);
  font-style: italic;
}

.schedule-actions {
  min-width: 100px;
}

/* 待办事项样式 */
.todo-tabs {
  margin-top: -20px;
}

.todo-list {
  min-height: 200px;
}

.todo-item {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 12px 0;
  border-bottom: 1px solid #eee;
}

.todo-item:last-child {
  border-bottom: none;
}

.todo-item-content {
  flex: 1;
}

.todo-title {
  margin: 0 0 6px 0;
  font-size: 14px;
  font-weight: 600;
  color: var(--color-dark-gray);
}

.todo-meta {
  display: flex;
  gap: 12px;
  margin-bottom: 6px;
  font-size: 12px;
}

.todo-type {
  color: var(--color-primary);
  background-color: rgba(var(--color-primary-rgb), 0.1);
  padding: 2px 8px;
  border-radius: 10px;
}

.todo-class {
  color: #e6a23c;
  background-color: rgba(230, 162, 60, 0.1);
  padding: 2px 8px;
  border-radius: 10px;
}

.todo-time {
  color: var(--color-medium-gray);
}

.todo-desc {
  margin: 0;
  font-size: 13px;
  color: var(--color-medium-gray);
  line-height: 1.4;
}

.todo-actions {
  min-width: 60px;
}

.empty-todo {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 200px;
  color: var(--color-medium-gray);
  gap: 12px;
}

.empty-todo .el-icon {
  font-size: 48px;
  color: #67c23a;
}

/* 数据快照样式 */
.snapshot-content {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
}

.snapshot-item {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px;
  background-color: #f8f9fa;
  border-radius: 8px;
}

.snapshot-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  border-radius: 50%;
  font-size: 24px;
}

.class-icon {
  background-color: rgba(64, 158, 255, 0.1);
  color: var(--color-primary);
}

.student-icon {
  background-color: rgba(103, 194, 58, 0.1);
  color: #67c23a;
}

.course-icon {
  background-color: rgba(255, 153, 0, 0.1);
  color: #ff9900;
}

.record-icon {
  background-color: rgba(157, 87, 255, 0.1);
  color: #9d57ff;
}

.snapshot-info {
  flex: 1;
}

.snapshot-value {
  font-size: 24px;
  font-weight: 700;
  color: var(--color-dark-gray);
  line-height: 1.2;
}

.snapshot-label {
  font-size: 14px;
  color: var(--color-medium-gray);
}

/* 快捷功能入口 */
.quick-actions {
  margin-top: 20px;
}

.action-card {
  cursor: pointer;
  transition: all 0.3s;
  height: 100%;
}

.action-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
}

.action-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 20px 0;
}

.action-icon {
  font-size: 48px;
  color: var(--color-primary);
  margin-bottom: 16px;
}

.action-title {
  margin: 0 0 8px 0;
  font-size: 18px;
  font-weight: 600;
  color: var(--color-dark-gray);
}

.action-desc {
  margin: 0;
  color: var(--color-medium-gray);
  font-size: 14px;
}

/* 响应式设计 */
@media (max-width: 1200px) {
  .core-data-section .el-col {
    margin-bottom: 20px;
  }
}

@media (max-width: 768px) {
  .teacher-portal-container {
    padding: 10px;
  }
  
  .overview-content {
    flex-direction: column;
    align-items: center;
    text-align: center;
    gap: 20px;
  }
  
  .info-section {
    min-width: auto;
  }
  
  .info-grid {
    grid-template-columns: 1fr;
  }
  
  .schedule-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }
  
  .schedule-time {
    flex-direction: row;
    gap: 12px;
  }
  
  .schedule-actions {
    width: 100%;
  }
  
  .snapshot-content {
    grid-template-columns: 1fr;
  }
  
  .quick-actions .el-col {
    margin-bottom: 20px;
  }
}
</style>