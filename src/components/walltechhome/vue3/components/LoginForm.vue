<template>
  <div>
    <!-- Login Method Switch -->
    <div class="auth-tab-container mb-6">
      <button
        :class="`auth-tab ${loginType === 'password' ? 'active' : ''}`"
        @click="setLoginType('password')"
      >
        <span>Password Login</span>
      </button>
      <button
        :class="`auth-tab ${loginType === 'code' ? 'active' : ''}`"
        @click="setLoginType('code')"
      >
        <span>Verification Code Login</span>
      </button>
    </div>

    <form @submit.prevent="handleSubmit" class="space-y-4">
      <!-- Account Input -->
      <div>
        <label class="block text-gray-700 font-semibold mb-2">
          {{ loginType === 'password' ? 'Email or Phone Number' : 'Phone Number or Email' }}
        </label>
        <div class="relative">
          <i class="fas fa-user absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
          <input
            v-model="loginForm.account"
            type="text"
            :placeholder="loginType === 'password' ? 'Please enter email or phone number' : 'Please enter phone number or email'"
            class="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
            required
          />
        </div>
      </div>

      <!-- Password Input -->
      <div v-if="loginType === 'password'">
        <label class="block text-gray-700 font-semibold mb-2">Password</label>
        <div class="relative">
          <i class="fas fa-lock absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
          <input
            v-model="loginForm.password"
            :type="passwordVisible ? 'text' : 'password'"
            placeholder="Please enter password"
            class="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
            required
          />
          <button
            type="button"
            @click="togglePasswordVisible"
            class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <i :class="passwordVisible ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
          </button>
        </div>
      </div>

      <!-- Verification Code Input -->
      <div v-else>
        <label class="block text-gray-700 font-semibold mb-2">Verification Code</label>
        <div class="flex space-x-3">
          <input
            v-model="loginForm.code"
            type="text"
            placeholder="Please enter verification code"
            class="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
            required
          />
          <button
            type="button"
            :disabled="countdown > 0"
            @click="handleSendCode"
            class="px-6 py-3 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors whitespace-nowrap"
          >
            {{ countdown > 0 ? `${countdown}s` : 'Send Code' }}
          </button>
        </div>
      </div>

      <!-- Remember Me and Forgot Password -->
      <div v-if="loginType === 'password'" class="flex justify-between items-center">
        <label class="flex items-center text-gray-600 cursor-pointer">
          <input type="checkbox" class="mr-3 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" />
          <span>Remember Me</span>
        </label>
        <button type="button" class="text-blue-600 hover:text-blue-700 font-medium">
          Forgot Password?
        </button>
      </div>

      <!-- Login Button -->
      <button
        type="submit"
        :disabled="loading"
        class="w-full py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-blue-800 disabled:opacity-50 transition-all flex items-center justify-center"
      >
        <i v-if="loading" class="fas fa-spinner fa-spin mr-2"></i>
        {{ loading ? 'Logging in...' : 'Login Now' }}
      </button>
    </form>

    <!-- Third-party Login -->
    <div class="mt-8">
      <div class="relative">
        <div class="absolute inset-0 flex items-center">
          <div class="w-full border-t border-gray-300"></div>
        </div>
        <div class="relative flex justify-center text-sm">
          <span class="px-4 bg-white text-gray-500">Other Login Methods</span>
        </div>
      </div>

      <div class="mt-6 grid grid-cols-2 gap-3">
        <button
          @click="handleThirdPartyLogin('etower')"
          class="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
        >
          <img src="/assets/111.png" alt="eTower" class="w-5 h-5 mr-2" />
          <span class="text-sm font-medium">eTower</span>
        </button>
        <button
          @click="handleThirdPartyLogin('cargoware')"
          class="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
        >
          <img src="/assets/v2_snyjmq-Lh_sDSg4.png" alt="CargoWare" class="w-5 h-5 mr-2" />
          <span class="text-sm font-medium">CargoWare</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useAuthState } from '../composables/useAuthState'
import { useUser } from '../composables/useUser'

// Props
interface Props {
  loading: boolean
}

const props = defineProps<Props>()

// Emits
const emit = defineEmits<{
  submit: [values: any]
  sendCode: []
}>()

// Use state management
const {
  loginType,
  loginForm,
  passwordVisible,
  countdown,
  setLoginType,
  togglePasswordVisible,
  startCountdown
} = useAuthState()

const router = useRouter()
const { login } = useUser()

// Handle form submission
const handleSubmit = async () => {
  // Validate form
  if (!loginForm.value.account) {
    alert('Please enter account')
    return
  }
  
  if (loginType.value === 'password' && !loginForm.value.password) {
    alert('Please enter password')
    return
  }
  
  if (loginType.value === 'code' && !loginForm.value.code) {
    alert('Please enter verification code')
    return
  }
  
  emit('submit', loginForm.value)
}

// Send verification code
const handleSendCode = () => {
  if (!loginForm.value.account) {
    alert('Please enter phone number or email first')
    return
  }
  
  startCountdown()
  emit('sendCode')
  alert('Verification code has been sent 📱')
}

// Third-party login
const handleThirdPartyLogin = (provider: string) => {
  if (provider === 'etower') {
    router.push('/sso/auth/etower')
  } else if (provider === 'cargoware') {
    router.push('/sso/auth/cargoware')
  } else {
    alert(`${provider} login is under development...`)
  }
}
</script>

<style scoped>
.auth-tab-container {
  display: flex;
  background: #f3f4f6;
  padding: 4px;
  border-radius: 12px;
}

.auth-tab {
  flex: 1;
  padding: 10px 20px;
  border: none;
  background: transparent;
  color: #6b7280;
  font-weight: 500;
  border-radius: 8px;
  transition: all 0.3s;
  cursor: pointer;
}

.auth-tab.active {
  background: white;
  color: #3b82f6;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.auth-tab:hover:not(.active) {
  color: #374151;
}
</style>