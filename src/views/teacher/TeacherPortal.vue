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
    
    <!-- 快捷功能入口 -->
    <el-row :gutter="20" class="quick-actions">
      <el-col :span="8">
        <el-card shadow="hover" class="action-card" @click="handleNavigate('/teacher/schedule')">
          <div class="action-content">
            <el-icon class="action-icon"><Calendar /></el-icon>
            <h3 class="action-title">个人课表</h3>
            <p class="action-desc">查看本周和下周的授课安排</p>
          </div>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card shadow="hover" class="action-card" @click="handleNavigate('/teacher/lesson-records')">
          <div class="action-content">
            <el-icon class="action-icon"><Document /></el-icon>
            <h3 class="action-title">课堂记录</h3>
            <p class="action-desc">填写和查看课堂教学记录</p>
          </div>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card shadow="hover" class="action-card" @click="handleNavigate('/teacher/teaching-data')">
          <div class="action-content">
            <el-icon class="action-icon"><DataAnalysis /></el-icon>
            <h3 class="action-title">教学数据</h3>
            <p class="action-desc">查看教学绩效和学生评价</p>
          </div>
        </el-card>
      </el-col>
    </el-row>
    
    <!-- 最近教学活动 -->
    <el-card shadow="hover" class="recent-activities-card">
      <template #header>
        <div class="card-header">
          <h3 class="card-title">最近教学活动</h3>
        </div>
      </template>
      <el-timeline>
        <el-timeline-item timestamp="2024-03-20 14:30" placement="top">
          <h4>八年级(1)班 语文</h4>
          <p>课堂记录已完成，学生评价：4.9分</p>
        </el-timeline-item>
        <el-timeline-item timestamp="2024-03-19 10:00" placement="top">
          <h4>七年级(2)班 语文</h4>
          <p>课堂记录已完成，学生评价：4.8分</p>
        </el-timeline-item>
        <el-timeline-item timestamp="2024-03-18 16:00" placement="top">
          <h4>六年级(3)班 语文</h4>
          <p>课堂记录已完成，学生评价：4.7分</p>
        </el-timeline-item>
      </el-timeline>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { UserFilled, Calendar, Document, DataAnalysis } from '@element-plus/icons-vue'

const router = useRouter()

// 导航到指定页面
const handleNavigate = (path: string) => {
  router.push(path)
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

.quick-actions {
  margin-bottom: 20px;
}

.action-card {
  cursor: pointer;
  transition: all 0.3s;
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
}

.recent-activities-card {
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

/* 响应式设计 */
@media (max-width: 768px) {
  .teacher-portal-container {
    padding: 10px;
  }
  
  .overview-content {
    flex-direction: column;
    align-items: center;
    text-align: center;
  }
  
  .info-section {
    min-width: auto;
  }
  
  .info-grid {
    grid-template-columns: 1fr;
  }
  
  .el-col {
    margin-bottom: 20px;
  }
}
</style>