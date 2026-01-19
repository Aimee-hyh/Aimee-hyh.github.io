<template>
  <div class="student-detail-container">
    <!-- 页面标题和返回按钮 -->
    <div class="page-header">
      <el-button @click="handleBack" class="back-button">
        <el-icon><ArrowLeft /></el-icon>
        返回列表
      </el-button>
      <h2 class="page-title">{{ isEdit ? '编辑学生' : '学生详情' }}</h2>
    </div>
    
    <!-- 学生基本信息卡片 -->
    <el-card shadow="hover" class="basic-info-card">
      <template #header>
        <div class="card-header">
          <span>基本信息</span>
          <el-button v-if="!isEdit" type="primary" size="small" @click="isEdit = true">
            <el-icon><Edit /></el-icon>
            编辑
          </el-button>
        </div>
      </template>

      <el-form :model="studentForm" label-width="120px" :disabled="!isEdit">
        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="姓名" prop="name">
              <el-input v-model="studentForm.name" placeholder="请输入姓名" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="性别" prop="gender">
              <el-select v-model="studentForm.gender" placeholder="请选择性别">
                <el-option label="男" value="男" />
                <el-option label="女" value="女" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="出生日期" prop="birthday">
              <el-date-picker v-model="studentForm.birthday" type="date" placeholder="选择出生日期" style="width: 100%" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="学校" prop="school">
              <el-input v-model="studentForm.school" placeholder="请输入学校" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="年级" prop="grade">
              <el-input v-model="studentForm.grade" placeholder="请输入年级" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="班级" prop="class">
              <el-input v-model="studentForm.class" placeholder="请输入班级" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="联系方式" prop="phone">
              <el-input v-model="studentForm.phone" placeholder="请输入手机号" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="邮箱" prop="email">
              <el-input v-model="studentForm.email" placeholder="请输入邮箱" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-card>

    <!-- 标签管理 -->
    <el-card shadow="hover" class="tags-card">
      <template #header>
        <div class="card-header">
          <span>学习特点标签</span>
        </div>
      </template>

      <div class="tags-container">
        <el-tag v-for="tag in studentForm.tags" :key="tag" closable :disabled="!isEdit" @close="handleRemoveTag(tag)">
          {{ tag }}
        </el-tag>
        <el-input v-if="isEdit" v-model="newTag" class="tag-input" placeholder="输入标签后按回车添加" @keyup.enter="handleAddTag"
          clearable />
      </div>
    </el-card>

    <!-- 家庭信息 -->
    <el-card shadow="hover" class="family-info-card">
      <template #header>
        <div class="card-header">
          <span>家庭信息</span>
        </div>
      </template>

      <el-form :model="studentForm" label-width="120px" :disabled="!isEdit">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="父亲姓名" prop="fatherName">
              <el-input v-model="studentForm.fatherName" placeholder="请输入父亲姓名" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="母亲姓名" prop="motherName">
              <el-input v-model="studentForm.motherName" placeholder="请输入母亲姓名" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="父亲职业" prop="fatherJob">
              <el-input v-model="studentForm.fatherJob" placeholder="请输入父亲职业" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="母亲职业" prop="motherJob">
              <el-input v-model="studentForm.motherJob" placeholder="请输入母亲职业" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="父亲联系方式" prop="fatherPhone">
              <el-input v-model="studentForm.fatherPhone" placeholder="请输入父亲联系方式" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="母亲联系方式" prop="motherPhone">
              <el-input v-model="studentForm.motherPhone" placeholder="请输入母亲联系方式" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="家庭地址" prop="address">
              <el-input v-model="studentForm.address" type="textarea" placeholder="请输入家庭地址" rows="2" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="紧急联系人" prop="emergencyContact">
              <el-input v-model="studentForm.emergencyContact" placeholder="请输入紧急联系人" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="紧急联系电话" prop="emergencyPhone">
              <el-input v-model="studentForm.emergencyPhone" placeholder="请输入紧急联系电话" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-card>

    <!-- 学习信息 -->
    <el-card shadow="hover" class="study-info-card">
      <template #header>
        <div class="card-header">
          <span>学习信息</span>
        </div>
      </template>

      <el-form :model="studentForm" label-width="120px" :disabled="!isEdit">
        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="入学日期" prop="enrollmentDate">
              <el-date-picker v-model="studentForm.enrollmentDate" type="date" placeholder="选择入学日期"
                style="width: 100%" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="在读状态" prop="status">
              <el-select v-model="studentForm.status" placeholder="请选择在读状态">
                <el-option label="潜在" value="潜在" />
                <el-option label="在读" value="在读" />
                <el-option label="停学" value="停学" />
                <el-option label="毕业" value="毕业" />
                <el-option label="流失" value="流失" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="班主任" prop="classTeacher">
              <el-input v-model="studentForm.classTeacher" placeholder="请输入班主任" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="学习目标" prop="learningGoal">
              <el-input v-model="studentForm.learningGoal" type="textarea" placeholder="请输入学习目标" rows="2" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="薄弱科目" prop="weakSubjects">
              <el-select v-model="studentForm.weakSubjects" placeholder="请选择薄弱科目" multiple collapse-tags>
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
          </el-col>
          <el-col :span="12">
            <el-form-item label="特长科目" prop="strongSubjects">
              <el-select v-model="studentForm.strongSubjects" placeholder="请选择特长科目" multiple collapse-tags>
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
          </el-col>
        </el-row>
      </el-form>
    </el-card>

    <!-- 医疗信息 -->
    <el-card shadow="hover" class="medical-info-card">
      <template #header>
        <div class="card-header">
          <span>医疗信息</span>
        </div>
      </template>

      <el-form :model="studentForm" label-width="120px" :disabled="!isEdit">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="过敏史" prop="allergyHistory">
              <el-input v-model="studentForm.allergyHistory" placeholder="请输入过敏史" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="特殊疾病" prop="specialDisease">
              <el-input v-model="studentForm.specialDisease" placeholder="请输入特殊疾病" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="家长授权">
              <el-switch v-model="studentForm.parentAuthorization" :disabled="!isEdit" />
              <span class="form-help">（需家长授权方可录入医疗信息）</span>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-card>

    <!-- 档案附件 -->
    <el-card shadow="hover" class="attachment-card">
      <template #header>
        <div class="card-header">
          <span>档案附件</span>
        </div>
      </template>

      <div v-if="isEdit" class="upload-area">
        <el-upload action="#" :on-success="handleUploadSuccess" :on-error="handleUploadError" :file-list="fileList"
          list-type="picture-card" :auto-upload="false">
          <el-icon>
            <Plus />
          </el-icon>
          <div class="upload-text">上传文件</div>
        </el-upload>
      </div>

      <div v-else-if="fileList.length > 0" class="attachment-list">
        <el-descriptions :column="4" border>
          <el-descriptions-item v-for="(file, index) in fileList" :key="index" :label="file.name">
            <el-button type="primary" size="small" @click="handleDownload(file)">
              <el-icon>
                <Download />
              </el-icon>
              下载
            </el-button>
          </el-descriptions-item>
        </el-descriptions>
      </div>

      <div v-else class="empty-attachment">
        <el-empty description="暂无附件" />
      </div>
    </el-card>

    <!-- 操作按钮 -->
    <div class="form-actions" v-if="isEdit">
      <el-button @click="handleCancel">取消</el-button>
      <el-button type="primary" @click="handleSubmit">提交</el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Edit, Plus, Download, ArrowLeft } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

const route = useRoute()
const router = useRouter()

// 返回列表
const handleBack = () => {
  router.push('/student/list')
}
// 编辑模式
const isEdit = ref(route.query.mode === 'edit')

// 学生ID
const studentId = ref(Number(route.params.id))

// 学生表单
const studentForm = ref({
  id: studentId.value,
  name: '张三',
  gender: '男',
  birthday: '2010-05-15',
  school: 'XX小学',
  grade: '五年级',
  class: '五(1)班',
  phone: '13800138001',
  email: 'zhangsan@example.com',
  tags: ['基础薄弱', '积极主动'],
  // 家庭信息
  fatherName: '张父',
  motherName: '张母',
  fatherJob: '工程师',
  motherJob: '教师',
  fatherPhone: '13800138004',
  motherPhone: '13800138005',
  address: 'XX市XX区XX路XX号',
  emergencyContact: '张父',
  emergencyPhone: '13800138004',
  // 学习信息
  enrollmentDate: '2024-09-01',
  status: '在读',
  classTeacher: '李老师',
  learningGoal: '提高数学成绩，考上重点中学',
  weakSubjects: ['数学', '英语'],
  strongSubjects: ['语文'],
  // 医疗信息
  allergyHistory: '无',
  specialDisease: '无',
  parentAuthorization: true,
  // 档案附件
  attachments: []
})

// 新标签
const newTag = ref('')

// 文件列表
const fileList = ref([
  { name: '身份证复印件.jpg', url: '#' },
  { name: '照片.jpg', url: '#' },
  { name: '过往成绩单.pdf', url: '#' }
])

// 处理添加标签
const handleAddTag = () => {
  if (newTag.value && !studentForm.value.tags.includes(newTag.value)) {
    studentForm.value.tags.push(newTag.value)
    newTag.value = ''
  }
}

// 处理移除标签
const handleRemoveTag = (tag: string) => {
  const index = studentForm.value.tags.indexOf(tag)
  if (index > -1) {
    studentForm.value.tags.splice(index, 1)
  }
}

// 处理上传成功
const handleUploadSuccess = (response: any, file: any) => {
  console.log('上传成功：', response, file)
  ElMessage.success('上传成功')
}

// 处理上传失败
const handleUploadError = (error: any) => {
  console.error('上传失败：', error)
  ElMessage.error('上传失败')
}

// 处理下载
const handleDownload = (file: any) => {
  console.log('下载文件：', file)
  ElMessage.success('下载成功')
}

// 处理提交
const handleSubmit = () => {
  // 这里可以调用API保存学生信息
  console.log('保存学生信息：', studentForm.value)
  isEdit.value = false
  ElMessage.success('保存成功')
}

// 处理取消
const handleCancel = () => {
  if (studentId.value) {
    // 如果是编辑现有学生，重置表单
    isEdit.value = false
  } else {
    // 如果是新增学生，返回列表页
    router.push('/student/list')
  }
}

// 组件挂载时加载数据
onMounted(() => {
  if (studentId.value) {
    // 这里可以调用API获取学生信息
    console.log('加载学生信息：', studentId.value)
  }
})
</script>

<style scoped>
.student-detail-container {
  width: 100%;
}

/* 页面标题和返回按钮样式 */
.page-header {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
  gap: 15px;
}

.back-button {
  margin-right: auto;
}

.page-title {
  margin: 0;
  font-size: 20px;
  font-weight: 600;
  color: #2c3e50;
  flex-grow: 1;
  text-align: center;
}

/* 卡片样式 */
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.basic-info-card,
.tags-card,
.family-info-card,
.study-info-card,
.medical-info-card,
.attachment-card {
  margin-bottom: 20px;
}

/* 标签样式 */
.tags-container {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  align-items: center;
}

.tag-input {
  width: 200px;
}

/* 医疗信息样式 */
.form-help {
  margin-left: 10px;
  font-size: 12px;
  color: #909399;
}

/* 附件样式 */
.upload-area {
  margin-bottom: 20px;
}

.upload-text {
  margin-top: 8px;
}

.attachment-list {
  margin-top: 20px;
}

.empty-attachment {
  padding: 40px 0;
}

/* 操作按钮样式 */
.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 30px;
  padding: 20px 0;
  border-top: 1px solid #ebeef5;
}

/* 响应式调整 */
@media (max-width: 768px) {
  .page-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
  }
  
  .back-button {
    margin-right: 0;
    align-self: flex-start;
  }
  
  .page-title {
    text-align: left;
    font-size: 18px;
  }
  
  .card-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
  }
}
</style>