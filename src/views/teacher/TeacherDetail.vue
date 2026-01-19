<template>
  <div class="teacher-detail-container">
    <!-- 页面标题和操作 -->
    <div class="page-header">
      <h2 class="page-title">教师详情</h2>
      <div class="header-actions">
        <el-button @click="handleBack">返回列表</el-button>
        <el-button type="primary" @click="handleEdit" v-if="!isEditMode">编辑</el-button>
        <el-button type="success" @click="handleSave" v-if="isEditMode">保存</el-button>
        <el-button @click="handleCancel" v-if="isEditMode">取消</el-button>
      </div>
    </div>
    
    <!-- 教师基本信息概览卡片 -->
    <el-card shadow="hover" class="overview-card">
      <div class="overview-content">
        <div class="overview-basic">
          <div class="avatar-section">
            <el-avatar :size="120" class="teacher-avatar">
              <template #default>
                <el-icon><UserFilled /></el-icon>
              </template>
            </el-avatar>
            <div class="avatar-actions" v-if="isEditMode">
              <el-button type="primary" size="small">更换头像</el-button>
            </div>
          </div>
          
          <div class="info-section">
            <div class="name-section">
              <h3 class="teacher-name">{{ teacherForm.name }}</h3>
              <el-tag :type="getStatusType(teacherForm.status)">
                {{ teacherForm.status }}
              </el-tag>
            </div>
            <div class="basic-info-grid">
              <div class="info-item">
                <span class="info-label">性别：</span>
                <span class="info-value">{{ teacherForm.gender }}</span>
              </div>
              <div class="info-item">
                <span class="info-label">年龄：</span>
                <span class="info-value">{{ teacherForm.age }}岁</span>
              </div>
              <div class="info-item">
                <span class="info-label">学历：</span>
                <span class="info-value">{{ teacherForm.education }}</span>
              </div>
              <div class="info-item">
                <span class="info-label">专业：</span>
                <span class="info-value">{{ teacherForm.major }}</span>
              </div>
              <div class="info-item">
                <span class="info-label">教龄：</span>
                <span class="info-value">{{ teacherForm.teachingYears }}年</span>
              </div>
              <div class="info-item">
                <span class="info-label">联系方式：</span>
                <span class="info-value">{{ teacherForm.phone }}</span>
              </div>
              <div class="info-item">
                <span class="info-label">所属部门：</span>
                <span class="info-value">{{ teacherForm.department }}</span>
              </div>
              <div class="info-item">
                <span class="info-label">入职时间：</span>
                <span class="info-value">{{ teacherForm.hireDate }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </el-card>
    
    <!-- 详细信息标签页 -->
    <el-card shadow="hover" class="detail-card">
      <el-tabs v-model="activeTab" type="card">
        <!-- 基本信息 -->
        <el-tab-pane label="基本信息" name="basic">
          <el-form :model="teacherForm" label-width="120px" :disabled="!isEditMode">
            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item label="姓名" prop="name">
                  <el-input v-model="teacherForm.name" placeholder="请输入教师姓名" />
                </el-form-item>
                
                <el-form-item label="性别" prop="gender">
                  <el-select v-model="teacherForm.gender" placeholder="请选择性别">
                    <el-option label="男" value="男" />
                    <el-option label="女" value="女" />
                  </el-select>
                </el-form-item>
                
                <el-form-item label="出生日期" prop="birthDate">
                  <el-date-picker
                    v-model="teacherForm.birthDate"
                    type="date"
                    placeholder="请选择出生日期"
                    format="YYYY-MM-DD"
                    value-format="YYYY-MM-DD"
                  />
                </el-form-item>
                
                <el-form-item label="学历" prop="education">
                  <el-select v-model="teacherForm.education" placeholder="请选择学历">
                    <el-option label="大专" value="大专" />
                    <el-option label="本科" value="本科" />
                    <el-option label="硕士" value="硕士" />
                    <el-option label="博士" value="博士" />
                  </el-select>
                </el-form-item>
                
                <el-form-item label="专业" prop="major">
                  <el-input v-model="teacherForm.major" placeholder="请输入专业" />
                </el-form-item>
                
                <el-form-item label="教龄" prop="teachingYears">
                  <el-input-number v-model="teacherForm.teachingYears" :min="0" :max="50" placeholder="请输入教龄" />
                </el-form-item>
              </el-col>
              
              <el-col :span="12">
                <el-form-item label="联系电话" prop="phone">
                  <el-input v-model="teacherForm.phone" placeholder="请输入联系电话" />
                </el-form-item>
                
                <el-form-item label="邮箱" prop="email">
                  <el-input v-model="teacherForm.email" placeholder="请输入邮箱" />
                </el-form-item>
                
                <el-form-item label="所属部门" prop="department">
                  <el-select v-model="teacherForm.department" placeholder="请选择所属部门">
                    <el-option label="语文组" value="语文组" />
                    <el-option label="数学组" value="数学组" />
                    <el-option label="英语组" value="英语组" />
                    <el-option label="综合组" value="综合组" />
                  </el-select>
                </el-form-item>
                
                <el-form-item label="入职时间" prop="hireDate">
                  <el-date-picker
                    v-model="teacherForm.hireDate"
                    type="date"
                    placeholder="请选择入职时间"
                    format="YYYY-MM-DD"
                    value-format="YYYY-MM-DD"
                  />
                </el-form-item>
                
                <el-form-item label="家庭地址" prop="address">
                  <el-input
                    v-model="teacherForm.address"
                    type="textarea"
                    placeholder="请输入家庭地址"
                    rows="3"
                  />
                </el-form-item>
                
                <el-form-item label="备注" prop="remark">
                  <el-input
                    v-model="teacherForm.remark"
                    type="textarea"
                    placeholder="请输入备注信息"
                    rows="3"
                  />
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </el-tab-pane>
        
        <!-- 资质信息 -->
        <el-tab-pane label="资质信息" name="qualification">
          <el-form :model="teacherForm.qualification" label-width="120px" :disabled="!isEditMode">
            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item label="教师资格证编号" prop="teacherCertificateNo">
                  <el-input v-model="teacherForm.qualification.teacherCertificateNo" placeholder="请输入教师资格证编号" />
                </el-form-item>
                
                <el-form-item label="职称" prop="title">
                  <el-select v-model="teacherForm.qualification.title" placeholder="请选择职称">
                    <el-option label="初级教师" value="初级教师" />
                    <el-option label="中级教师" value="中级教师" />
                    <el-option label="高级教师" value="高级教师" />
                    <el-option label="特级教师" value="特级教师" />
                  </el-select>
                </el-form-item>
                
                <el-form-item label="职称评定日期" prop="titleDate">
                  <el-date-picker
                    v-model="teacherForm.qualification.titleDate"
                    type="date"
                    placeholder="请选择职称评定日期"
                    format="YYYY-MM-DD"
                    value-format="YYYY-MM-DD"
                  />
                </el-form-item>
              </el-col>
              
              <el-col :span="12">
                <el-form-item label="技能证书">
                  <el-upload
                    v-model:file-list="teacherForm.qualification.skillCertificates"
                    action="#"
                    :disabled="!isEditMode"
                    list-type="text"
                    :auto-upload="false"
                    :on-change="handleFileChange"
                    :on-remove="handleFileRemove"
                  >
                    <el-button type="primary" :disabled="!isEditMode">
                      <el-icon><Upload /></el-icon>
                      上传证书
                    </el-button>
                    <template #tip>
                      <div class="el-upload__tip">
                        支持上传PDF、JPG、PNG格式，单个文件不超过2MB
                      </div>
                    </template>
                  </el-upload>
                </el-form-item>
              </el-col>
            </el-row>
            
            <el-form-item label="资质描述" prop="description">
              <el-input
                v-model="teacherForm.qualification.description"
                type="textarea"
                placeholder="请输入资质描述"
                rows="4"
              />
            </el-form-item>
          </el-form>
        </el-tab-pane>
        
        <!-- 银行信息 -->
        <el-tab-pane label="银行信息" name="bank">
          <el-form :model="teacherForm.bankInfo" label-width="120px" :disabled="!isEditMode">
            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item label="收款账户姓名" prop="accountName">
                  <el-input v-model="teacherForm.bankInfo.accountName" placeholder="请输入收款账户姓名" />
                </el-form-item>
                
                <el-form-item label="银行账号" prop="accountNumber">
                  <el-input v-model="teacherForm.bankInfo.accountNumber" placeholder="请输入银行账号" />
                </el-form-item>
              </el-col>
              
              <el-col :span="12">
                <el-form-item label="开户行" prop="bankName">
                  <el-input v-model="teacherForm.bankInfo.bankName" placeholder="请输入开户行" />
                </el-form-item>
                
                <el-form-item label="开户行地址" prop="bankAddress">
                  <el-input v-model="teacherForm.bankInfo.bankAddress" placeholder="请输入开户行地址" />
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </el-tab-pane>
        
        <!-- 教学能力 -->
        <el-tab-pane label="教学能力" name="teaching">
          <el-form :model="teacherForm.teachingAbility" label-width="120px" :disabled="!isEditMode">
            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item label="主授科目" prop="mainSubjects">
                  <el-select
                    v-model="teacherForm.teachingAbility.mainSubjects"
                    multiple
                    placeholder="请选择主授科目"
                  >
                    <el-option label="语文" value="语文" />
                    <el-option label="数学" value="数学" />
                    <el-option label="英语" value="英语" />
                    <el-option label="物理" value="物理" />
                    <el-option label="化学" value="化学" />
                    <el-option label="生物" value="生物" />
                    <el-option label="历史" value="历史" />
                    <el-option label="地理" value="地理" />
                    <el-option label="政治" value="政治" />
                  </el-select>
                </el-form-item>
                
                <el-form-item label="辅授科目" prop="auxiliarySubjects">
                  <el-select
                    v-model="teacherForm.teachingAbility.auxiliarySubjects"
                    multiple
                    placeholder="请选择辅授科目"
                  >
                    <el-option label="语文" value="语文" />
                    <el-option label="数学" value="数学" />
                    <el-option label="英语" value="英语" />
                    <el-option label="物理" value="物理" />
                    <el-option label="化学" value="化学" />
                    <el-option label="生物" value="生物" />
                    <el-option label="历史" value="历史" />
                    <el-option label="地理" value="地理" />
                    <el-option label="政治" value="政治" />
                  </el-select>
                </el-form-item>
                
                <el-form-item label="可授年级" prop="gradeLevels">
                  <el-select
                    v-model="teacherForm.teachingAbility.gradeLevels"
                    multiple
                    placeholder="请选择可授年级"
                  >
                    <el-option label="一年级" value="一年级" />
                    <el-option label="二年级" value="二年级" />
                    <el-option label="三年级" value="三年级" />
                    <el-option label="四年级" value="四年级" />
                    <el-option label="五年级" value="五年级" />
                    <el-option label="六年级" value="六年级" />
                    <el-option label="七年级" value="七年级" />
                    <el-option label="八年级" value="八年级" />
                    <el-option label="九年级" value="九年级" />
                  </el-select>
                </el-form-item>
              </el-col>
              
              <el-col :span="12">
                <el-form-item label="教学风格标签" prop="teachingStyle">
                  <el-select
                    v-model="teacherForm.teachingAbility.teachingStyle"
                    multiple
                    placeholder="请选择教学风格标签"
                  >
                    <el-option label="幽默风趣" value="幽默风趣" />
                    <el-option label="严谨细致" value="严谨细致" />
                    <el-option label="互动性强" value="互动性强" />
                    <el-option label="深入浅出" value="深入浅出" />
                    <el-option label="注重实践" value="注重实践" />
                    <el-option label="启发式教学" value="启发式教学" />
                  </el-select>
                </el-form-item>
                
                <el-form-item label="可上课时段" prop="availableTime">
                  <el-checkbox-group v-model="teacherForm.teachingAbility.availableTime">
                    <el-checkbox label="周一" />
                    <el-checkbox label="周二" />
                    <el-checkbox label="周三" />
                    <el-checkbox label="周四" />
                    <el-checkbox label="周五" />
                    <el-checkbox label="周六" />
                    <el-checkbox label="周日" />
                    <el-checkbox label="上午" />
                    <el-checkbox label="下午" />
                    <el-checkbox label="晚上" />
                  </el-checkbox-group>
                </el-form-item>
              </el-col>
            </el-row>
            
            <el-form-item label="教学特点" prop="teachingFeatures">
              <el-input
                v-model="teacherForm.teachingAbility.teachingFeatures"
                type="textarea"
                placeholder="请输入教学特点" 
                rows="4"
              />
            </el-form-item>
          </el-form>
        </el-tab-pane>
        
        <!-- 绩效数据 -->
        <el-tab-pane label="绩效数据" name="performance">
          <div class="performance-content">
            <div class="performance-stats">
              <el-statistic title="总授课量" value="128" suffix="课时" class="stat-item" />
              <el-statistic title="学生评价" value="4.8" suffix="分" class="stat-item" />
              <el-statistic title="课堂记录完成率" value="98" suffix="%" class="stat-item" />
              <el-statistic title="学生满意度" value="96" suffix="%" class="stat-item" />
            </div>
            
            <el-card shadow="hover" class="chart-card">
              <template #header>
                <div class="card-header">
                  <span>授课量趋势</span>
                </div>
              </template>
              <div class="chart-placeholder">
                <el-empty description="图表占位" />
              </div>
            </el-card>
            
            <el-card shadow="hover" class="recent-records-card">
              <template #header>
                <div class="card-header">
                  <span>最近教学记录</span>
                </div>
              </template>
              <el-table :data="recentTeachingRecords" style="width: 100%" border>
                <el-table-column prop="date" label="日期" width="150" />
                <el-table-column prop="subject" label="科目" width="100" />
                <el-table-column prop="grade" label="年级" width="100" />
                <el-table-column prop="className" label="班级" width="150" />
                <el-table-column prop="duration" label="时长" width="100" />
                <el-table-column prop="score" label="学生评价" width="100" />
                <el-table-column prop="status" label="状态" width="100">
                  <template #default="scope">
                    <el-tag :type="scope.row.status === '已完成' ? 'success' : 'warning'">
                      {{ scope.row.status }}
                    </el-tag>
                  </template>
                </el-table-column>
              </el-table>
            </el-card>
          </div>
        </el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { UserFilled, Upload } from '@element-plus/icons-vue'

const route = useRoute()
const router = useRouter()

// 获取路由参数
const teacherId = computed(() => route.params.id as string)
const isEditMode = computed(() => route.query.mode === 'edit')

// 激活的标签页
const activeTab = ref('basic')

// 教师表单数据
const teacherForm = ref({
  id: 0,
  name: '张老师',
  gender: '女',
  birthDate: '1992-05-15',
  age: 32,
  education: '本科',
  major: '汉语言文学',
  teachingYears: 8,
  phone: '13800138001',
  email: 'zhang@example.com',
  department: '语文组',
  hireDate: '2016-09-01',
  status: '在职',
  address: '北京市朝阳区',
  remark: '',
  
  // 资质信息
  qualification: {
    teacherCertificateNo: '201611001122334455',
    title: '中级教师',
    titleDate: '2020-06-15',
    skillCertificates: [],
    description: '具备丰富的教学经验，多次获得优秀教师称号'
  },
  
  // 银行信息
  bankInfo: {
    accountName: '张老师',
    accountNumber: '6222021101012345678',
    bankName: '中国工商银行',
    bankAddress: '北京市朝阳区支行'
  },
  
  // 教学能力
  teachingAbility: {
    mainSubjects: ['语文'],
    auxiliarySubjects: ['历史'],
    gradeLevels: ['六年级', '七年级', '八年级'],
    teachingStyle: ['幽默风趣', '互动性强'],
    availableTime: ['周一', '周二', '周三', '周四', '周五', '上午', '下午'],
    teachingFeatures: '注重培养学生的阅读和写作能力，课堂氛围活跃'
  }
})

// 原始数据（用于取消编辑）
const originalForm = ref({})

// 状态类型映射
const getStatusType = (status: string) => {
  const typeMap: Record<string, string> = {
    '在职': 'success',
    '请假': 'warning',
    '离职': 'danger'
  }
  return typeMap[status] || 'info'
}

// 最近教学记录
const recentTeachingRecords = ref([
  { date: '2024-03-20', subject: '语文', grade: '八年级', className: '八(1)班', duration: '45分钟', score: 4.9, status: '已完成' },
  { date: '2024-03-19', subject: '语文', grade: '七年级', className: '七(2)班', duration: '45分钟', score: 4.8, status: '已完成' },
  { date: '2024-03-18', subject: '语文', grade: '六年级', className: '六(3)班', duration: '45分钟', score: 4.7, status: '已完成' },
  { date: '2024-03-17', subject: '语文', grade: '八年级', className: '八(1)班', duration: '45分钟', score: 4.9, status: '已完成' },
  { date: '2024-03-16', subject: '语文', grade: '七年级', className: '七(2)班', duration: '45分钟', score: 4.8, status: '已完成' }
])

// 教学能力表单验证规则
// 注意：当前未使用，保留用于后续扩展
// const teachingFormRules = {
//   mainSubjects: [
//     { required: true, message: '请选择主授科目', trigger: 'change' },
//     { type: 'array', min: 1, message: '至少选择一个主授科目', trigger: 'change' }
//   ],
//   gradeLevels: [
//     { required: true, message: '请选择可授年级', trigger: 'change' },
//     { type: 'array', min: 1, message: '至少选择一个可授年级', trigger: 'change' }
//   ],
//   availableTime: [
//     { required: true, message: '请选择可上课时段', trigger: 'change' },
//     { type: 'array', min: 1, message: '至少选择一个可上课时段', trigger: 'change' }
//   ]
// }

// 返回列表
const handleBack = () => {
  router.push('/teacher/list')
}

// 编辑
const handleEdit = () => {
  router.push(`/teacher/detail/${teacherId.value}?mode=edit`)
}

// 保存
const handleSave = async () => {
  try {
    // 这里可以添加表单验证逻辑
    console.log('保存教师信息：', teacherForm.value)
    ElMessage.success('保存成功')
    router.push(`/teacher/detail/${teacherId.value}`)
  } catch (error) {
    console.error('保存失败：', error)
    ElMessage.error('保存失败，请检查必填项')
  }
}

// 文件上传处理
const handleFileChange = (file: any) => {
  // 这里可以添加文件格式和大小验证
  const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png']
  const maxSize = 2 * 1024 * 1024 // 2MB
  
  if (!allowedTypes.includes(file.raw.type)) {
    ElMessage.error('只支持上传PDF、JPG、PNG格式的文件')
    return false
  }
  
  if (file.raw.size > maxSize) {
    ElMessage.error('单个文件大小不能超过2MB')
    return false
  }
  
  // 这里可以添加文件上传逻辑
  console.log('文件上传：', file)
  return true
}

// 文件移除处理
const handleFileRemove = (file: any) => {
  console.log('文件移除：', file)
  // 这里可以添加文件移除逻辑
  return true
}

// 取消
const handleCancel = () => {
  // 恢复原始数据
  Object.assign(teacherForm.value, originalForm.value)
  router.push(`/teacher/detail/${teacherId.value}`)
}

// 组件挂载时
onMounted(() => {
  // 保存原始数据
  originalForm.value = JSON.parse(JSON.stringify(teacherForm.value))
  
  // 这里可以根据teacherId获取教师详情数据
  console.log('获取教师详情：', teacherId.value)
})
</script>

<style scoped>
.teacher-detail-container {
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

.overview-card {
  margin-bottom: 20px;
}

.overview-content {
  display: flex;
  flex-wrap: wrap;
}

.overview-basic {
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

.info-section {
  flex: 1;
  min-width: 400px;
}

.name-section {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 24px;
}

.teacher-name {
  margin: 0;
  font-size: 28px;
  font-weight: 600;
  color: var(--color-dark-gray);
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 16px;
  margin-top: 16px;
}

.info-item {
  display: flex;
  gap: 8px;
  margin-bottom: 12px;
}

.info-label {
  font-weight: 500;
  color: var(--color-medium-gray);
  min-width: 80px;
}

.info-value {
  color: var(--color-dark-gray);
}

.basic-info-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
}

.detail-card {
  margin-bottom: 20px;
}

.el-form {
  margin-top: 20px;
}

.el-tabs__content {
  padding: 20px 0;
}

/* 绩效数据样式 */
.performance-content {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.performance-stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  margin-bottom: 20px;
}

.stat-item {
  background-color: var(--color-super-light-gray);
  padding: 20px;
  border-radius: 8px;
  text-align: center;
}

.chart-card {
  margin-bottom: 20px;
}

.chart-placeholder {
  height: 300px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--color-super-light-gray);
  border-radius: 8px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .teacher-detail-container {
    padding: 10px;
  }
  
  .overview-basic {
    flex-direction: column;
    align-items: center;
    text-align: center;
  }
  
  .info-section {
    min-width: auto;
  }
  
  .basic-info-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .page-header {
    flex-direction: column;
    align-items: stretch;
  }
  
  .header-actions {
    justify-content: center;
  }
}
</style>