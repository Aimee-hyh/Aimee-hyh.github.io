<template>
  <div class="dashboard-container">
    <h2 class="page-title">仪表盘</h2>
    
    <!-- 统计卡片 -->
    <div class="stats-cards">
      <el-card shadow="hover" class="stat-card">
        <div class="stat-content">
          <div class="stat-info">
            <div class="stat-value">1,234</div>
            <div class="stat-label">学生总数</div>
          </div>
          <div class="stat-icon student">
            <el-icon><User /></el-icon>
          </div>
        </div>
        <div class="stat-footer">
          <el-icon class="trend-up"><ArrowUp /></el-icon>
          <span class="trend-text">较上月增长 8.5%</span>
        </div>
      </el-card>
      
      <el-card shadow="hover" class="stat-card">
        <div class="stat-content">
          <div class="stat-info">
            <div class="stat-value">56</div>
            <div class="stat-label">教师总数</div>
          </div>
          <div class="stat-icon teacher">
            <el-icon><UserFilled /></el-icon>
          </div>
        </div>
        <div class="stat-footer">
          <el-icon class="trend-up"><ArrowUp /></el-icon>
          <span class="trend-text">较上月增长 2.1%</span>
        </div>
      </el-card>
      
      <el-card shadow="hover" class="stat-card">
        <div class="stat-content">
          <div class="stat-info">
            <div class="stat-value">89</div>
            <div class="stat-label">当前班级数</div>
          </div>
          <div class="stat-icon class">
            <el-icon><Document /></el-icon>
          </div>
        </div>
        <div class="stat-footer">
          <el-icon class="trend-down"><ArrowDown /></el-icon>
          <span class="trend-text">较上月减少 1.2%</span>
        </div>
      </el-card>
      
      <el-card shadow="hover" class="stat-card">
        <div class="stat-content">
          <div class="stat-info">
            <div class="stat-value">¥234,567</div>
            <div class="stat-label">本月营收</div>
          </div>
          <div class="stat-icon revenue">
            <el-icon><Money /></el-icon>
          </div>
        </div>
        <div class="stat-footer">
          <el-icon class="trend-up"><ArrowUp /></el-icon>
          <span class="trend-text">较上月增长 12.3%</span>
        </div>
      </el-card>
    </div>
    
    <!-- 图表区域 -->
    <div class="charts-section">
      <el-card shadow="hover" class="chart-card">
        <template #header>
          <div class="card-header">
            <span>学生增长趋势</span>
          </div>
        </template>
        <div class="chart-content">
          <div class="chart-placeholder">
            <el-icon class="chart-icon"><DataAnalysis /></el-icon>
            <span>学生增长趋势图表</span>
          </div>
        </div>
      </el-card>
      
      <el-card shadow="hover" class="chart-card">
        <template #header>
          <div class="card-header">
            <span>学生状态分布</span>
          </div>
        </template>
        <div class="chart-content">
          <div class="chart-placeholder">
            <el-icon class="chart-icon"><PieChart /></el-icon>
            <span>学生状态分布图表</span>
          </div>
        </div>
      </el-card>
    </div>
    
    <!-- 最近动态 -->
    <div class="recent-activities">
      <el-card shadow="hover">
        <template #header>
          <div class="card-header">
            <span>最近动态</span>
            <el-button type="text" class="more-btn">查看更多</el-button>
          </div>
        </template>
        <el-timeline>
          <el-timeline-item
            v-for="(item, index) in activities"
            :key="index"
            :timestamp="item.time"
          >
            <el-card :body-style="{ padding: '10px' }">
              <div class="activity-content">
                <el-icon class="activity-icon"><component :is="item.icon" /></el-icon>
                <span class="activity-text">{{ item.content }}</span>
              </div>
            </el-card>
          </el-timeline-item>
        </el-timeline>
      </el-card>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  User,
  UserFilled,
  Document,
  Money,
  ArrowUp,
  ArrowDown,
  DataAnalysis,
  PieChart,
  Plus,
  Edit,
  SwitchButton
} from '@element-plus/icons-vue'

// 最近动态数据
const activities = [
  {
    time: '2024-05-20 14:30',
    content: '学生张三成功报名数学提高班',
    icon: Plus
  },
  {
    time: '2024-05-20 13:15',
    content: '教师李四的课时安排已更新',
    icon: Edit
  },
  {
    time: '2024-05-20 10:45',
    content: '学生王五状态变更为在读',
    icon: SwitchButton
  },
  {
    time: '2024-05-19 16:20',
    content: '家长赵六提交了学生信息变更申请',
    icon: Edit
  },
  {
    time: '2024-05-19 09:30',
    content: '新教师孙七完成入职建档',
    icon: Plus
  }
]
</script>

<style scoped>
.dashboard-container {
  width: 100%;
}

.page-title {
  margin: 0 0 20px 0;
  font-size: 20px;
  font-weight: 600;
  color: #2c3e50;
}

/* 统计卡片样式 */
.stats-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  margin-bottom: 20px;
}

.stat-card {
  height: 100%;
  transition: all 0.3s;
}

.stat-card:hover {
  transform: translateY(-2px);
}

.stat-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 15px;
}

.stat-info {
  flex: 1;
}

.stat-value {
  font-size: 28px;
  font-weight: 600;
  color: #2c3e50;
  margin-bottom: 5px;
}

.stat-label {
  font-size: 14px;
  color: #606266;
}

.stat-icon {
  width: 50px;
  height: 50px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  color: #fff;
}

.stat-icon.student {
  background-color: #1890ff;
}

.stat-icon.teacher {
  background-color: #52c41a;
}

.stat-icon.class {
  background-color: #faad14;
}

.stat-icon.revenue {
  background-color: #f5222d;
}

.stat-footer {
  display: flex;
  align-items: center;
  font-size: 12px;
  color: #909399;
}

.trend-up {
  color: #52c41a;
  margin-right: 5px;
}

.trend-down {
  color: #f5222d;
  margin-right: 5px;
}

.trend-text {
  color: #606266;
}

/* 图表区域样式 */
.charts-section {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 20px;
  margin-bottom: 20px;
}

.chart-card {
  height: 300px;
}

.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.card-header span {
  font-size: 16px;
  font-weight: 500;
}

.more-btn {
  font-size: 12px;
  color: #1890ff;
}

.chart-content {
  height: calc(100% - 60px);
  display: flex;
  align-items: center;
  justify-content: center;
}

.chart-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #909399;
}

.chart-icon {
  font-size: 48px;
  margin-bottom: 10px;
  opacity: 0.5;
}

/* 最近动态样式 */
.recent-activities {
  margin-top: 20px;
}

.activity-content {
  display: flex;
  align-items: center;
  gap: 10px;
}

.activity-icon {
  font-size: 16px;
  color: #1890ff;
}

.activity-text {
  font-size: 14px;
  color: #606266;
}
</style>