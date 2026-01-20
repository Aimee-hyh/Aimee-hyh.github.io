<template>
  <div class="teaching-data-container">
    <!-- 页面标题和操作 -->
    <div class="page-header">
      <h2 class="page-title">教学数据</h2>
      <div class="header-actions">
        <el-button @click="handleBack">返回门户</el-button>
        <el-select v-model="currentSemester" placeholder="选择学期">
          <el-option label="2024-2025学年第一学期" value="2024-1" />
          <el-option label="2023-2024学年第二学期" value="2024-2" />
          <el-option label="2023-2024学年第一学期" value="2023-1" />
        </el-select>
      </div>
    </div>
    
    <!-- 教学数据概览 -->
    <el-row :gutter="20" class="stats-row">
      <el-col :span="6">
        <el-card shadow="hover" class="stat-card">
          <div class="stat-content">
            <div class="stat-header">
              <h3 class="stat-title">总授课量</h3>
              <el-icon class="stat-icon"><Clock /></el-icon>
            </div>
            <div class="stat-value">{{ teachingStats.totalLessons }}</div>
            <div class="stat-unit">课时</div>
            <div class="stat-change">
              <span class="change-icon">↑</span>
              <span class="change-value">12%</span>
              <span class="change-text">较上学期</span>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="hover" class="stat-card">
          <div class="stat-content">
            <div class="stat-header">
              <h3 class="stat-title">学生评价</h3>
              <el-icon class="stat-icon"><Star /></el-icon>
            </div>
            <div class="stat-value">{{ teachingStats.studentRating }}</div>
            <div class="stat-unit">分</div>
            <div class="stat-change">
              <span class="change-icon">↑</span>
              <span class="change-value">0.3</span>
              <span class="change-text">较上学期</span>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="hover" class="stat-card">
          <div class="stat-content">
            <div class="stat-header">
              <h3 class="stat-title">课堂记录完成率</h3>
              <el-icon class="stat-icon"><DocumentChecked /></el-icon>
            </div>
            <div class="stat-value">{{ teachingStats.recordCompletionRate }}</div>
            <div class="stat-unit">%</div>
            <div class="stat-change">
              <span class="change-icon">↑</span>
              <span class="change-value">5%</span>
              <span class="change-text">较上学期</span>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="hover" class="stat-card">
          <div class="stat-content">
            <div class="stat-header">
              <h3 class="stat-title">学生满意度</h3>
              <el-icon class="stat-icon"><CircleCheck /></el-icon>
            </div>
            <div class="stat-value">{{ teachingStats.studentSatisfaction }}</div>
            <div class="stat-unit">%</div>
            <div class="stat-change">
              <span class="change-icon">↑</span>
              <span class="change-value">3%</span>
              <span class="change-text">较上学期</span>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>
    
    <!-- 图表区域 -->
    <el-row :gutter="20" class="charts-row">
      <el-col :span="12">
        <el-card shadow="hover" class="chart-card">
          <template #header>
            <div class="card-header">
              <h3 class="card-title">授课量趋势</h3>
            </div>
          </template>
          <div class="chart-placeholder">
            <el-empty description="授课量趋势图表" />
          </div>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card shadow="hover" class="chart-card">
          <template #header>
            <div class="card-header">
              <h3 class="card-title">学生评价分布</h3>
            </div>
          </template>
          <div class="chart-placeholder">
            <el-empty description="学生评价分布图表" />
          </div>
        </el-card>
      </el-col>
    </el-row>
    
    <!-- 详细数据表格 -->
    <el-row :gutter="20" class="tables-row">
      <el-col :span="12">
        <el-card shadow="hover" class="table-card">
          <template #header>
            <div class="card-header">
              <h3 class="card-title">班级授课统计</h3>
            </div>
          </template>
          <el-table
            :data="classStats"
            style="width: 100%"
            stripe
            border
          >
            <el-table-column prop="className" label="班级" width="150" />
            <el-table-column prop="subject" label="科目" width="100" />
            <el-table-column prop="lessonsCount" label="授课量" width="100" />
            <el-table-column prop="avgRating" label="平均评价" width="120">
              <template #default="scope">
                <el-rate v-model="scope.row.avgRating" disabled :max="5" />
              </template>
            </el-table-column>
            <el-table-column prop="studentCount" label="学生人数" width="100" />
          </el-table>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card shadow="hover" class="table-card">
          <template #header>
            <div class="card-header">
              <h3 class="card-title">最近评价</h3>
            </div>
          </template>
          <el-table
            :data="recentRatings"
            style="width: 100%"
            stripe
            border
          >
            <el-table-column prop="date" label="日期" width="120" />
            <el-table-column prop="className" label="班级" width="150" />
            <el-table-column prop="studentName" label="学生姓名" width="100" />
            <el-table-column prop="rating" label="评价" width="100">
              <template #default="scope">
                <el-rate v-model="scope.row.rating" disabled :max="5" />
              </template>
            </el-table-column>
            <el-table-column prop="comment" label="评语" min-width="200" />
          </el-table>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { Clock, Star, DocumentChecked, CircleCheck } from '@element-plus/icons-vue'

const router = useRouter()

// 当前学期
const currentSemester = ref('2024-1')

// 教学数据统计
const teachingStats = ref({
  totalLessons: 128,
  studentRating: 4.8,
  recordCompletionRate: 98,
  studentSatisfaction: 96
})

// 班级授课统计
const classStats = ref([
  { className: '八年级(1)班', subject: '语文', lessonsCount: 48, avgRating: 4.9, studentCount: 45 },
  { className: '七年级(2)班', subject: '语文', lessonsCount: 40, avgRating: 4.8, studentCount: 42 },
  { className: '六年级(3)班', subject: '语文', lessonsCount: 40, avgRating: 4.7, studentCount: 40 }
])

// 最近评价
const recentRatings = ref([
  { date: '2024-03-20', className: '八年级(1)班', studentName: '小明', rating: 5, comment: '老师上课很有趣，我很喜欢' },
  { date: '2024-03-20', className: '八年级(1)班', studentName: '小红', rating: 4, comment: '老师讲得很清楚，就是作业有点多' },
  { date: '2024-03-19', className: '七年级(2)班', studentName: '小刚', rating: 5, comment: '老师很有耐心，我进步很大' },
  { date: '2024-03-19', className: '七年级(2)班', studentName: '小丽', rating: 4, comment: '课堂氛围很好，互动性强' },
  { date: '2024-03-18', className: '六年级(3)班', studentName: '小强', rating: 5, comment: '老师很亲切，我很愿意上她的课' }
])

// 返回门户
const handleBack = () => {
  router.push('/dashboard/teacherportal')
}
</script>

<style scoped>
.teaching-data-container {
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
  gap: 16px;
  align-items: center;
}

.stats-row {
  margin-bottom: 20px;
}

.stat-card {
  height: 100%;
}

.stat-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px 0;
}

.stat-header {
  display: flex;
  justify-content: space-between;
  width: 100%;
  padding: 0 20px;
  margin-bottom: 16px;
}

.stat-title {
  margin: 0;
  font-size: 16px;
  font-weight: 500;
  color: var(--color-medium-gray);
}

.stat-icon {
  font-size: 20px;
  color: var(--color-primary);
}

.stat-value {
  font-size: 36px;
  font-weight: 600;
  color: var(--color-dark-gray);
  margin-bottom: 8px;
}

.stat-unit {
  font-size: 14px;
  color: var(--color-medium-gray);
  margin-bottom: 12px;
}

.stat-change {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 14px;
}

.change-icon {
  color: var(--color-success);
  font-weight: 600;
}

.change-value {
  color: var(--color-success);
  font-weight: 600;
}

.change-text {
  color: var(--color-medium-gray);
}

.charts-row,
.tables-row {
  margin-bottom: 20px;
}

.chart-card,
.table-card {
  height: 100%;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.card-title {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: var(--color-dark-gray);
}

.chart-placeholder {
  height: 300px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--color-super-light-gray);
  border-radius: 8px;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .teaching-data-container {
    padding: 10px;
  }
  
  .page-header {
    flex-direction: column;
    align-items: stretch;
  }
  
  .header-actions {
    justify-content: center;
  }
  
  .el-col {
    margin-bottom: 20px;
  }
}
</style>