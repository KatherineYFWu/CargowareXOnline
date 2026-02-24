<template>
  <form @submit.prevent="handleSubmit" class="space-y-4">
    <!-- Username and Phone Number -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <label class="block text-gray-700 font-semibold mb-2">Username</label>
        <div class="relative">
          <i class="fas fa-user absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
          <input
            v-model="registerForm.username"
            type="text"
            placeholder="Please enter username"
            class="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
            required
          />
        </div>
      </div>

      <div>
        <label class="block text-gray-700 font-semibold mb-2">Phone Number</label>
        <div class="relative">
          <i class="fas fa-phone absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
          <input
            v-model="registerForm.phone"
            type="tel"
            placeholder="Please enter phone number"
            pattern="^1[3-9]\d{9}$"
            class="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
            required
          />
        </div>
      </div>
    </div>

    <!-- Phone Verification Code -->
    <div>
      <label class="block text-gray-700 font-semibold mb-2">Phone Verification Code</label>
      <div class="flex space-x-3">
        <input
          v-model="registerForm.phoneCode"
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
          {{ countdown > 0 ? `${countdown}s` : 'Send Verification Code' }}
        </button>
      </div>
    </div>

    <!-- Email (Optional) -->
    <div>
      <label class="block text-gray-700 font-semibold mb-2">Email (Optional)</label>
      <div class="relative">
        <i class="fas fa-envelope absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
        <input
          v-model="registerForm.email"
          type="email"
          placeholder="Please enter email (optional)"
          class="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
        />
      </div>
    </div>

    <!-- Password Settings -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <label class="block text-gray-700 font-semibold mb-2">Set Password</label>
        <div class="relative">
          <i class="fas fa-lock absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
          <input
            v-model="registerForm.password"
            :type="passwordVisible ? 'text' : 'password'"
            placeholder="At least 6 characters"
            minlength="6"
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

      <div>
        <label class="block text-gray-700 font-semibold mb-2">Confirm Password</label>
        <div class="relative">
          <i class="fas fa-lock absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
          <input
            v-model="registerForm.confirmPassword"
            :type="confirmPasswordVisible ? 'text' : 'password'"
            placeholder="Please re-enter password"
            class="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
            required
          />
          <button
            type="button"
            @click="toggleConfirmPasswordVisible"
            class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <i :class="confirmPasswordVisible ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
          </button>
        </div>
      </div>
    </div>

    <!-- User Agreement -->
    <div class="flex items-start">
      <input
        v-model="agreedToTerms"
        type="checkbox"
        id="terms"
        class="mt-1 mr-3 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
        required
      />
      <label for="terms" class="text-sm text-gray-600">
        I have read and agree to the
        <button
          type="button"
          @click="$emit('showAgreement')"
          class="text-blue-600 hover:text-blue-700"
        >
          User Agreement
        </button>
        and
        <button
          type="button"
          @click="$emit('showPrivacy')"
          class="text-blue-600 hover:text-blue-700"
        >
          Privacy Policy
        </button>
      </label>
    </div>

    <!-- Register Button -->
    <button
      type="submit"
      :disabled="loading || !agreedToTerms"
      class="w-full py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-blue-800 disabled:opacity-50 transition-all flex items-center justify-center"
    >
      <i v-if="loading" class="fas fa-spinner fa-spin mr-2"></i>
      {{ loading ? 'Registering...' : 'Register Now' }}
    </button>

    <!-- Corporate User Notice -->
    <div class="mt-6 p-4 bg-blue-50 rounded-lg">
      <div class="flex items-start">
        <i class="fas fa-building text-blue-600 mt-1 mr-3"></i>
        <div>
          <h4 class="text-sm font-semibold text-gray-800 mb-1">Corporate User?</h4>
          <p class="text-sm text-gray-600">
            Please contact your enterprise administrator or
            <button
              type="button"
              @click="handleStaffAuth"
              class="text-blue-600 hover:text-blue-700 font-medium"
            >
              login via staff channel
            </button>
          </p>
        </div>
      </div>
    </div>
  </form>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthState } from '../composables/useAuthState'

// Props
interface Props {
  loading: boolean
}

const props = defineProps<Props>()

// Emits
const emit = defineEmits<{
  submit: [values: any]
  sendCode: []
  showAgreement: []
  showPrivacy: []
}>()

// 使用状态管理
const {
  registerForm,
  passwordVisible,
  confirmPasswordVisible,
  countdown,
  togglePasswordVisible,
  toggleConfirmPasswordVisible,
  startCountdown
} = useAuthState()

const router = useRouter()
const agreedToTerms = ref(false)

// Handle form submission
const handleSubmit = async () => {
  // Validate form
  if (!registerForm.value.username) {
    alert('Please enter username')
    return
  }
  
  if (!registerForm.value.phone || !/^1[3-9]\d{9}$/.test(registerForm.value.phone)) {
    alert('Please enter a valid phone number')
    return
  }
  
  if (!registerForm.value.phoneCode) {
    alert('Please enter verification code')
    return
  }
  
  if (!registerForm.value.password || registerForm.value.password.length < 6) {
    alert('Password must be at least 6 characters')
    return
  }
  
  if (registerForm.value.password !== registerForm.value.confirmPassword) {
    alert('Passwords do not match')
    return
  }
  
  if (!agreedToTerms.value) {
    alert('Please agree to the User Agreement and Privacy Policy')
    return
  }
  
  emit('submit', registerForm.value)
}

// Send verification code
const handleSendCode = () => {
  if (!registerForm.value.phone) {
    alert('Please enter phone number first')
    return
  }
  
  if (!/^1[3-9]\d{9}$/.test(registerForm.value.phone)) {
    alert('Please enter a valid phone number')
    return
  }
  
  startCountdown()
  emit('sendCode')
  alert('Verification code sent 📱')
}

// 跳转到员工登录
const handleStaffAuth = () => {
  router.push('/staff/auth')
}
</script>