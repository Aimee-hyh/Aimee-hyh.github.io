<template>
  <div class="teacher-schedule-container">
    <!-- 页面标题和操作 -->
    <div class="page-header">
      <h2 class="page-title">个人课表</h2>
      <div class="header-actions">
        <el-button @click="handleBack">返回门户</el-button>
        <el-radio-group v-model="currentWeek" size="small" class="week-switcher">
          <el-radio-button label="week1">本周</el-radio-button>
          <el-radio-button label="week2">下周</el-radio-button>
        </el-radio-group>
      </div>
    </div>
    
    <!-- 课表内容 -->
    <el-card shadow="hover" class="schedule-card">
      <div class="schedule-header">
        <h3 class="schedule-title">{{ currentWeekTitle }}</h3>
        <div class="date-range">{{ currentDateRange }}</div>
      </div>
      
      <div class="schedule-content">
        <div class="time-axis">
          <div class="time-slot" v-for="time in timeSlots" :key="time.id">
            {{ time.time }}
          </div>
        </div>
        
        <div class="schedule-grid">
          <div class="day-column" v-for="day in weekDays" :key="day.id">
            <div class="day-header">{{ day.name }}</div>
            <div class="day-content">
              <div 
                class="lesson-item" 
                v-for="lesson in getLessonsByDay(day.id)" 
                :key="lesson.id"
                :style="{ 
                  top: `${(lesson.startTime - 1) * 100}px`,
                  height: `${(lesson.endTime - lesson.startTime) * 100}px`
                }"
              >
                <div class="lesson-info">
                  <div class="lesson-subject">{{ lesson.subject }}</div>
                  <div class="lesson-class">{{ lesson.className }}</div>
                  <div class="lesson-time">{{ lesson.startTime }}:00 - {{ lesson.endTime }}:00</div>
                  <div class="lesson-room">教室：{{ lesson.room }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </el-card>
    
    <!-- 今日课程 -->
    <el-card shadow="hover" class="today-lessons-card">
      <template #header>
        <div class="card-header">
          <h3 class="card-title">今日课程</h3>
        </div>
      </template>
      <div class="today-lessons">
        <div 
          class="today-lesson-item" 
          v-for="lesson in todayLessons" 
          :key="lesson.id"
        >
          <div class="lesson-time">{{ lesson.startTime }}:00 - {{ lesson.endTime }}:00</div>
          <div class="lesson-detail">
            <div class="lesson-subject">{{ lesson.subject }}</div>
            <div class="lesson-class">{{ lesson.className }}</div>
            <div class="lesson-room">教室：{{ lesson.room }}</div>
          </div>
          <el-button type="primary" size="small" @click="handleFillRecord(lesson)">
            填写记录
          </el-button>
        </div>
        <div class="no-lessons" v-if="todayLessons.length === 0">
          今日无课程安排
        </div>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'

const router = useRouter()

// 当前周
const currentWeek = ref('week1')

// 时间槽
const timeSlots = [
  { id: 1, time: '08:00' },
  { id: 2, time: '09:00' },
  { id: 3, time: '10:00' },
  { id: 4, time: '11:00' },
  { id: 5, time: '14:00' },
  { id: 6, time: '15:00' },
  { id: 7, time: '16:00' },
  { id: 8, time: '17:00' },
  { id: 9, time: '19:00' },
  { id: 10, time: '20:00' }
]

// 星期
const weekDays = [
  { id: 1, name: '周一' },
  { id: 2, name: '周二' },
  { id: 3, name: '周三' },
  { id: 4, name: '周四' },
  { id: 5, name: '周五' },
  { id: 6, name: '周六' },
  { id: 7, name: '周日' }
]

// 本周课程数据
const week1Lessons = [
  { id: 1, dayId: 1, subject: '语文', className: '八年级(1)班', startTime: 2, endTime: 4, room: '301' },
  { id: 2, dayId: 2, subject: '语文', className: '七年级(2)班', startTime: 5, endTime: 7, room: '202' },
  { id: 3, dayId: 3, subject: '语文', className: '六年级(3)班', startTime: 2, endTime: 4, room: '103' },
  { id: 4, dayId: 4, subject: '语文', className: '八年级(1)班', startTime: 5, endTime: 7, room: '301' },
  { id: 5, dayId: 5, subject: '语文', className: '七年级(2)班', startTime: 2, endTime: 4, room: '202' }
]

// 下周课程数据
const week2Lessons = [
  { id: 6, dayId: 1, subject: '语文', className: '八年级(1)班', startTime: 2, endTime: 4, room: '301' },
  { id: 7, dayId: 2, subject: '语文', className: '七年级(2)班', startTime: 5, endTime: 7, room: '202' },
  { id: 8, dayId: 3, subject: '语文', className: '六年级(3)班', startTime: 2, endTime: 4, room: '103' },
  { id: 9, dayId: 4, subject: '语文', className: '八年级(1)班', startTime: 5, endTime: 7, room: '301' },
  { id: 10, dayId: 5, subject: '语文', className: '七年级(2)班', startTime: 2, endTime: 4, room: '202' }
]

// 计算当前周标题
const currentWeekTitle = computed(() => {
  return currentWeek.value === 'week1' ? '本周课表' : '下周课表'
})

// 计算当前日期范围
const currentDateRange = computed(() => {
  // 这里可以根据实际日期计算
  return currentWeek.value === 'week1' ? '2024-03-18 至 2024-03-24' : '2024-03-25 至 2024-03-31'
})

// 获取当前周的课程
const currentLessons = computed(() => {
  return currentWeek.value === 'week1' ? week1Lessons : week2Lessons
})

// 根据星期获取课程
const getLessonsByDay = (dayId: number) => {
  return currentLessons.value.filter(lesson => lesson.dayId === dayId)
}

// 今日课程
const todayLessons = ref([
  { id: 1, subject: '语文', className: '八年级(1)班', startTime: 14, endTime: 16, room: '301' }
])

// 返回门户
const handleBack = () => {
  router.push('/management/teacher/portal')
}

// 填写课堂记录
const handleFillRecord = (lesson: any) => {
  router.push('/teacher/lesson-records')
  ElMessage.info(`开始填写${lesson.className}的${lesson.subject}课堂记录`)
}
</script>

<style scoped>
.teacher-schedule-container {
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

.week-switcher {
  margin-left: 16px;
}

.schedule-card {
  margin-bottom: 20px;
}

.schedule-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 16px;
  border-bottom: 1px solid var(--color-light-gray);
}

.schedule-title {
  margin: 0;
  font-size: 20px;
  font-weight: 600;
  color: var(--color-dark-gray);
}

.date-range {
  color: var(--color-medium-gray);
}

.schedule-content {
  display: flex;
  position: relative;
  height: 1000px;
  overflow: auto;
}

.time-axis {
  width: 80px;
  background-color: var(--color-super-light-gray);
  border-right: 1px solid var(--color-light-gray);
}

.time-slot {
  height: 100px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  color: var(--color-medium-gray);
  border-bottom: 1px solid var(--color-light-gray);
}

.schedule-grid {
  flex: 1;
  display: flex;
  position: relative;
}

.day-column {
  flex: 1;
  border-right: 1px solid var(--color-light-gray);
}

.day-column:last-child {
  border-right: none;
}

.day-header {
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  color: var(--color-dark-gray);
  border-bottom: 1px solid var(--color-light-gray);
  background-color: var(--color-super-light-gray);
}

.day-content {
  height: 950px;
  position: relative;
  background-color: white;
}

.lesson-item {
  position: absolute;
  left: 5px;
  right: 5px;
  background-color: var(--color-primary-light);
  border: 1px solid var(--color-primary);
  border-radius: 8px;
  padding: 8px;
  cursor: pointer;
  transition: all 0.3s;
  overflow: hidden;
}

.lesson-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.lesson-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.lesson-subject {
  font-weight: 600;
  color: var(--color-primary);
  font-size: 16px;
}

.lesson-class {
  font-size: 14px;
  color: var(--color-dark-gray);
}

.lesson-time, .lesson-room {
  font-size: 12px;
  color: var(--color-medium-gray);
}

.today-lessons-card {
  margin-bottom: 20px;
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

.today-lessons {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.today-lesson-item {
  display: flex;
  align-items: center;
  gap: 20px;
  padding: 16px;
  background-color: var(--color-super-light-gray);
  border-radius: 8px;
  transition: all 0.3s;
}

.today-lesson-item:hover {
  background-color: var(--color-light-gray);
}

.today-lesson-item .lesson-time {
  width: 120px;
  font-weight: 600;
  color: var(--color-dark-gray);
  font-size: 16px;
}

.today-lesson-item .lesson-detail {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.today-lesson-item .lesson-subject {
  font-weight: 600;
  color: var(--color-dark-gray);
  font-size: 18px;
}

.today-lesson-item .lesson-class {
  font-size: 14px;
  color: var(--color-medium-gray);
}

.today-lesson-item .lesson-room {
  font-size: 14px;
  color: var(--color-medium-gray);
}

.no-lessons {
  text-align: center;
  padding: 40px;
  color: var(--color-medium-gray);
  font-size: 16px;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .teacher-schedule-container {
    padding: 10px;
  }
  
  .page-header {
    flex-direction: column;
    align-items: stretch;
  }
  
  .header-actions {
    justify-content: center;
  }
  
  .schedule-content {
    font-size: 12px;
  }
  
  .time-axis {
    width: 60px;
  }
  
  .lesson-subject {
    font-size: 14px !important;
  }
  
  .today-lesson-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }
  
  .today-lesson-item .lesson-time {
    width: auto;
  }
}
</style>