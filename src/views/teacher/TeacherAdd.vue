<template>
  <div class="teacher-add-container">
    <!-- 页面标题和操作 -->
    <div class="page-header">
      <h2 class="page-title">新增教师</h2>
      <div class="header-actions">
        <el-button @click="handleBack">返回列表</el-button>
        <el-button type="primary" @click="handleSubmit" :loading="submitLoading">保存</el-button>
      </div>
    </div>
    
    <!-- 教师基本信息概览卡片 -->
    <el-card shadow="hover" class="overview-card">
      <div class="overview-content">
        <div class="avatar-section">
          <el-avatar :size="120" class="teacher-avatar">
            <template #default>
              <el-icon><UserFilled /></el-icon>
            </template>
          </el-avatar>
          <div class="avatar-actions">
            <el-button type="primary" size="small">上传头像</el-button>
          </div>
        </div>
      </div>
    </el-card>
    
    <!-- 详细信息标签页 -->
    <el-card shadow="hover" class="detail-card">
      <el-tabs v-model="activeTab" type="card">
        <!-- 基本信息 -->
        <el-tab-pane label="基本信息" name="basic">
          <el-form ref="teacherFormRef" :model="teacherForm" label-width="120px" :rules="formRules">
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
          <el-form ref="qualificationFormRef" :model="teacherForm.qualification" label-width="120px">
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
                    list-type="text"
                    :auto-upload="false"
                    :on-change="handleFileChange"
                    :on-remove="handleFileRemove"
                  >
                    <el-button type="primary">
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
          <el-form ref="bankFormRef" :model="teacherForm.bankInfo" label-width="120px">
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
          <el-form ref="teachingFormRef" :model="teacherForm.teachingAbility" label-width="120px">
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
      </el-tabs>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { UserFilled, Upload } from '@element-plus/icons-vue'

const router = useRouter()

// 加载状态
const submitLoading = ref(false)

// 激活的标签页
const activeTab = ref('basic')

// 表单引用
const teacherFormRef = ref()
const qualificationFormRef = ref()
const bankFormRef = ref()
const teachingFormRef = ref()

// 教师表单数据
const teacherForm = ref({
  name: '',
  gender: '',
  birthDate: '',
  age: 0,
  education: '',
  major: '',
  teachingYears: 0,
  phone: '',
  email: '',
  department: '',
  hireDate: '',
  status: '在职',
  address: '',
  remark: '',
  
  // 资质信息
  qualification: {
    teacherCertificateNo: '',
    title: '',
    titleDate: '',
    skillCertificates: [],
    description: ''
  },
  
  // 银行信息
  bankInfo: {
    accountName: '',
    accountNumber: '',
    bankName: '',
    bankAddress: ''
  },
  
  // 教学能力
  teachingAbility: {
    mainSubjects: [],
    auxiliarySubjects: [],
    gradeLevels: [],
    teachingStyle: [],
    availableTime: [],
    teachingFeatures: ''
  }
})

// 表单验证规则
const formRules = {
  name: [
    { required: true, message: '请输入教师姓名', trigger: 'blur' },
    { min: 2, max: 10, message: '姓名长度在 2 到 10 个字符', trigger: 'blur' }
  ],
  gender: [
    { required: true, message: '请选择性别', trigger: 'change' }
  ],
  birthDate: [
    { required: true, message: '请选择出生日期', trigger: 'change' }
  ],
  education: [
    { required: true, message: '请选择学历', trigger: 'change' }
  ],
  department: [
    { required: true, message: '请选择所属部门', trigger: 'change' }
  ],
  hireDate: [
    { required: true, message: '请选择入职时间', trigger: 'change' }
  ],
  phone: [
    { required: true, message: '请输入联系电话', trigger: 'blur' },
    { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号码', trigger: 'blur' }
  ],
  email: [
    { required: true, message: '请输入邮箱', trigger: 'blur' },
    { type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur' }
  ]
}

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

// 提交表单
const handleSubmit = async () => {
  submitLoading.value = true
  
  try {
    // 验证基本信息表单
    await teacherFormRef.value.validate()
    
    // 验证教学能力表单
    await teachingFormRef.value.validate()
    
    // 这里可以实现保存逻辑
    console.log('保存教师信息：', teacherForm.value)
    
    // 保存成功后跳转到教师列表
    ElMessage.success('教师添加成功')
    router.push('/teacher/list')
  } catch (error) {
    console.error('表单验证失败：', error)
    ElMessage.error('表单验证失败，请检查必填项')
  } finally {
    submitLoading.value = false
  }
}
</script>

<style scoped>
.teacher-add-container {
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
  justify-content: center;
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

.detail-card {
  margin-bottom: 20px;
}

.el-form {
  margin-top: 20px;
}

.el-tabs__content {
  padding: 20px 0;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .teacher-add-container {
    padding: 10px;
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