<template>
  <div class="min-h-screen relative overflow-hidden auth-container">
    <!-- 动态背景 -->
    <div class="fixed inset-0 auth-background">
      <div class="absolute inset-0 bg-gradient-to-br from-blue-500/20 via-sky-400/20 to-blue-300/20"></div>
      <div class="absolute top-0 left-0 w-full h-full">
        <!-- 浮动圆球 -->
        <div class="floating-orb orb-1"></div>
        <div class="floating-orb orb-2"></div>
        <div class="floating-orb orb-3"></div>
        <div class="floating-orb orb-4"></div>
        <div class="floating-orb orb-5"></div>
      </div>
      <!-- 网格背景 -->
      <div class="absolute inset-0 grid-background"></div>
    </div>

    <!-- 返回首页按钮 -->
    <div class="absolute top-8 left-8 z-50">
      <button 
        @click="handleBackToPortal"
        class="group flex items-center space-x-2 px-4 py-2 bg-white/10 backdrop-blur-md rounded-full border border-blue-800/30 text-blue-800 hover:bg-white/20 hover:border-blue-800/50 transition-all duration-300 hover:scale-105"
      >
        <i class="fas fa-arrow-left text-lg group-hover:-translate-x-1 transition-transform duration-300"></i>
        <span class="font-medium">Back to Homepage</span>
      </button>
    </div>

    <!-- 主内容区域 -->
    <div class="relative z-10 min-h-screen flex items-center justify-center p-4">
      <div :class="`w-full max-w-4xl transition-all duration-1000 ${mounted ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`">
        
        <!-- Logo区域 -->
        <div class="text-center mb-8">
          <div class="flex items-center justify-center mb-6">
            <div class="relative">
              <div class="logo-container group">
                <div class="logo-inner">
                  <span class="text-3xl font-black">🚢</span>
                </div>
                <div class="logo-glow"></div>
              </div>
            </div>
          </div>
          <h1 class="text-3xl font-black text-blue-900 mb-3 tracking-tight">
            <span class="bg-gradient-to-r from-blue-900 via-blue-800 to-blue-700 bg-clip-text text-transparent">
              Smart Logistics Platform
            </span>
          </h1>
          <p class="text-blue-800 text-lg font-medium">
            Making International Logistics Simpler
          </p>
        </div>

        <!-- 主卡片 -->
        <div class="auth-main-card-wide">
          <!-- 登录页面 -->
          <div v-if="isLogin" class="auth-content-grid">
            <!-- 登录表单组件将在第3.2步添加 -->
            <div class="auth-left-section">
              <h2 class="text-2xl font-bold text-gray-800 mb-4">Welcome Back</h2>
              <p class="text-gray-500 mb-6">Log in to your account to continue using smart logistics services</p>
              <!-- 登录表单 -->
              <LoginForm 
                :loading="loading"
                @submit="handleLogin"
                @sendCode="handleSendCode"
              />
            </div>
            
            <!-- 右侧装饰 -->
            <div class="auth-right-section">
              <div class="auth-decoration">
                <div class="decoration-icon">
                  <span class="text-6xl">🌏</span>
                </div>
                <h3 class="text-xl font-bold text-gray-700 mb-2">Global Logistics Network</h3>
                <p class="text-gray-500 text-center leading-relaxed">
                  Connecting ports worldwide, providing end-to-end logistics solutions
                </p>
              </div>
            </div>
          </div>
          
          <!-- 注册页面 -->
          <div v-else class="auth-content-grid">
            <!-- 注册表单组件将在第3.3步添加 -->
            <div class="auth-left-section">
              <h2 class="text-2xl font-bold text-gray-800 mb-4">Create Account</h2>
              <p class="text-gray-500 mb-6">Start your smart logistics journey</p>
              <!-- 注册表单 -->
              <RegisterForm 
                :loading="loading"
                @submit="handleRegister"
                @sendCode="handleSendCode"
                @showAgreement="userAgreementVisible = true"
                @showPrivacy="privacyPolicyVisible = true"
              />
            </div>
            
            <!-- 右侧装饰 -->
            <div class="auth-right-section">
              <div class="auth-decoration">
                <div class="decoration-icon">
                  <span className="text-6xl">🚀</span>
                </div>
                <h3 className="text-xl font-bold text-gray-700 mb-2">Join Us</h3>
                <p className="text-gray-500 text-center leading-relaxed">
                  Chosen by tens of thousands of companies, experience smart logistics
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- 底部切换链接 -->
        <div class="text-center mt-6">
          <p class="text-gray-600">
            <span v-if="isLogin">Don't have an account?</span>
            <span v-else>Already have an account?</span>
            <button
              @click="handleAuthModeToggle"
              class="text-blue-600 hover:text-blue-700 font-medium ml-2"
            >
              {{ isLogin ? 'Register Now' : 'Log In Now' }}
            </button>
          </p>
        </div>
      </div>
    </div>
    
    <!-- 用户协议弹窗 -->
    <PolicyModal 
      :visible="userAgreementVisible"
      type="agreement"
      @close="userAgreementVisible = false"
    />
    
    <!-- 隐私政策弹窗 -->
    <PolicyModal 
      :visible="privacyPolicyVisible"
      type="privacy"
      @close="privacyPolicyVisible = false"
    />
    
    <!-- 租户选择弹窗 -->
    <div v-if="tenantSelectionVisible" class="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div class="bg-white rounded-2xl shadow-2xl max-w-md w-full relative overflow-hidden animate-fadeIn">
        <!-- 装饰性头部 -->
        <div class="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 pt-6 pb-4 relative">
          <div class="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -translate-y-12 translate-x-12"></div>
          <div class="relative z-10">
            <div class="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mb-3">
              <i class="fas fa-building text-white text-xl"></i>
            </div>
            <h3 class="text-xl font-bold text-white mb-2">Select Tenant</h3>
            <p class="text-blue-100 text-sm">Your account belongs to multiple tenants, please select the one you want to log in to</p>
          </div>
        </div>
        
        <!-- 表单内容 -->
        <div class="p-6">
          <div class="mb-6">
            <label class="block text-gray-700 font-semibold mb-3">Tenant List</label>
            <select 
              v-model="selectedTenant" 
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
            >
              <option value="personal">Personal Account</option>
              <option value="company1">Shanghai Logistics Technology Co., Ltd.</option>
              <option value="company2">Shenzhen International Freight Forwarding Co., Ltd.</option>
              <option value="company3">Beijing Supply Chain Management Co., Ltd.</option>
              <option value="company4">Guangzhou Cross-border E-commerce Logistics Co., Ltd.</option>
              <option value="company5">Qingdao Port Logistics Co., Ltd.</option>
            </select>
          </div>
          
          <div class="flex gap-3">
            <button 
              @click="tenantSelectionVisible = false"
              class="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
            >
              Cancel
            </button>
            <button 
              @click="handleTenantConfirm"
              class="flex-1 px-4 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all font-medium"
            >
              Confirm
            </button>
          </div>
        </div>
      </div>
    </div>
    
    <!-- 账号已注册提醒弹窗 -->
    <div v-if="accountExistsModalVisible" class="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div class="bg-white rounded-2xl shadow-2xl max-w-md w-full relative overflow-hidden animate-fadeIn">
        <!-- 装饰性头部 -->
        <div class="bg-gradient-to-r from-orange-500 to-red-500 px-6 pt-6 pb-4 relative">
          <div class="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -translate-y-12 translate-x-12"></div>
          <div class="relative z-10">
            <div class="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mb-3">
              <i class="fas fa-exclamation-triangle text-white text-xl"></i>
            </div>
            <h3 class="text-xl font-bold text-white mb-2">Account Reminder</h3>
            <p class="text-orange-100 text-sm">The system detects that you may already have an account</p>
          </div>
        </div>
        
        <!-- 内容区域 -->
        <div class="p-6">
          <div class="mb-6 text-center">
            <div class="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <i class="fas fa-user-check text-orange-500 text-2xl"></i>
            </div>
            <h4 class="text-lg font-bold text-gray-800 mb-3">Account Already Exists</h4>
            <p class="text-gray-600 leading-relaxed">
              Your account information has been detected in our system. There is no need to register again. Please log in directly with your existing account to enjoy our smart logistics services.
            </p>
          </div>
          
          <div class="bg-blue-50 rounded-xl p-4 mb-6 border border-blue-100">
              <div class="flex items-start">
                <i class="fas fa-info-circle text-blue-500 mt-1 mr-3"></i>
                <div class="text-sm text-blue-700">
                  <p class="font-medium mb-1">Friendly reminder:</p>
                  <p>If you have forgotten your password, you can reset it using the "Forgot Password" function.</p>
                </div>
              </div>
            </div>
          
          <div class="flex gap-3">
            <button 
              @click="accountExistsModalVisible = false"
              class="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
            >
              Cancel
            </button>
            <button 
              @click="handleGoToLogin"
              class="flex-1 px-4 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all font-medium flex items-center justify-center"
            >
              <i class="fas fa-sign-in-alt mr-2"></i>
              Go to Login
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// @ts-ignore
import { ref, reactive, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthState } from './composables/useAuthState'
import { useUser } from './composables/useUser'
import LoginForm from './components/LoginForm.vue'
import RegisterForm from './components/RegisterForm.vue'
import PolicyModal from './components/PolicyModal.vue'
import './PortalStyles.css'

// 使用状态管理
const {
  isLogin,
  loading,
  mounted,
  userAgreementVisible,
  privacyPolicyVisible,
  toggleAuthMode
} = useAuthState()

// 路由
const router = useRouter()
const { login } = useUser()

// 租户选择相关状态
const tenantSelectionVisible = ref(false)
const selectedTenant = ref('personal')
const pendingUserData = ref(null)

// 账号已注册提醒弹窗状态
const accountExistsModalVisible = ref(false)

// 组件挂载
onMounted(() => {
  mounted.value = true
})

// 返回首页
const handleBackToPortal = () => {
  window.location.href = '/walltech-vue3'
}

// 处理登录
const handleLogin = async (values: any) => {
  loading.value = true
  try {
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    // 验证虚拟账号密码
    const validAccounts = ['1', 'test@example.com', 'admin', '测试用户']
    const validPasswords = ['1', '密码1', 'password', '123456']
    
    if (values.password && (!validAccounts.includes(values.account) || !validPasswords.includes(values.password))) {
      alert('Account or password error! Available accounts: 1/test@example.com/admin, passwords: 1/password1/password')
      loading.value = false
      return
    }
    
    // 生成用户数据
    const userData = {
      id: `user_${Date.now()}`,
      username: values.account,
      email: values.account.includes('@') ? values.account : `${values.account}@example.com`,
      phone: '13800138000'
    }
    
    // 特殊处理：账号1密码1显示租户选择
    if (values.account === '1' && values.password === '1') {
      pendingUserData.value = userData
      tenantSelectionVisible.value = true
      loading.value = false
      return
    }
    
    login(userData)
    alert('Login successful! Welcome back 🎉')
    
    setTimeout(() => {
      router.push('/walltech-vue3')
    }, 100)
    
  } catch (error) {
    alert('Login failed, please try again')
  } finally {
    loading.value = false
  }
}

// 处理注册
const handleRegister = async (values: any) => {
  loading.value = true
  try {
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    const userData = {
      id: 'user_' + Date.now(),
      username: values.username,
      email: values.email,
      phone: values.phone,
    }
    
    login(userData)
    alert('Registration successful! Welcome to join us 🌟')
    router.push('/walltech-vue3')
  } catch (error) {
    alert('Registration failed, please try again')
  } finally {
    loading.value = false
  }
}

// 发送验证码
const handleSendCode = () => {
  // 验证码逻辑已在组件中处理
  console.log('Send verification code')
}

// 处理租户确认
const handleTenantConfirm = () => {
  if (!pendingUserData.value) return
  
  // 添加租户信息到用户数据
  const userDataWithTenant = {
    ...pendingUserData.value,
    tenant: selectedTenant.value,
    tenantType: selectedTenant.value === 'personal' ? 'personal' : 'enterprise'
  }
  
  login(userDataWithTenant)
  tenantSelectionVisible.value = false
  
  if (selectedTenant.value === 'personal') {
    alert('Login successful! Welcome to use your personal account 👤')
    // 个人账号跳转到控制塔，但只显示用户中心
    window.location.href = '/controltower?mode=personal'
  } else {
    alert('Login successful! Welcome to the enterprise control tower 🏢')
    // 企业账号跳转到完整的控制塔
    window.location.href = '/controltower'
  }
}

// 处理登录/注册模式切换
const handleAuthModeToggle = () => {
  // 如果当前是登录页面，用户点击"立即注册"，先显示账号已注册提醒弹窗
  if (isLogin.value) {
    accountExistsModalVisible.value = true
  } else {
    // 如果当前是注册页面，用户点击"立即登录"，直接切换到登录页面
    toggleAuthMode()
  }
}

// 处理去登录按钮点击
const handleGoToLogin = () => {
  accountExistsModalVisible.value = false
  // 确保切换到登录模式
  if (!isLogin.value) {
    toggleAuthMode()
  }
}
</script>

<style scoped>
/* AuthPage特定样式 */
.auth-container {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

.logo-container {
  position: relative;
  width: 80px;
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.logo-inner {
  position: relative;
  z-index: 2;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 10px 30px rgba(59, 130, 246, 0.3);
  transition: all 0.3s ease;
}

.logo-container:hover .logo-inner {
  transform: scale(1.05);
  box-shadow: 0 15px 40px rgba(59, 130, 246, 0.4);
}

.logo-glow {
  position: absolute;
  inset: -20px;
  background: radial-gradient(circle, rgba(59, 130, 246, 0.3) 0%, transparent 70%);
  filter: blur(20px);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.logo-container:hover .logo-glow {
  opacity: 1;
}

.auth-main-card-wide {
  background: white/95;
  backdrop-filter: blur(10px);
  border-radius: 24px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.5);
}

.auth-content-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  min-height: 500px;
}

.auth-left-section {
  padding: 3rem;
}

.auth-right-section {
  background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
  padding: 3rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.auth-decoration {
  text-align: center;
}

.decoration-icon {
  margin-bottom: 1.5rem;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .auth-content-grid {
    grid-template-columns: 1fr;
  }
  
  .auth-right-section {
    display: none;
  }
  
  .auth-left-section {
    padding: 2rem;
  }
}

.floating-orb {
  position: absolute;
  border-radius: 50%;
  background: linear-gradient(135deg, rgba(59, 130, 246, 0.3), rgba(147, 51, 234, 0.3));
  animation: float 6s ease-in-out infinite;
}

.orb-1 {
  width: 300px;
  height: 300px;
  top: -150px;
  left: -150px;
  animation-delay: 0s;
}

.orb-2 {
  width: 200px;
  height: 200px;
  bottom: -100px;
  right: -100px;
  animation-delay: 2s;
}

.orb-3 {
  width: 150px;
  height: 150px;
  top: 50%;
  right: 10%;
  animation-delay: 4s;
}

.orb-4 {
  width: 100px;
  height: 100px;
  bottom: 30%;
  left: 10%;
  animation-delay: 1s;
}

.orb-5 {
  width: 80px;
  height: 80px;
  top: 20%;
  right: 30%;
  animation-delay: 3s;
}

@keyframes float {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-30px); }
}
</style>