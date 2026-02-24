// @ts-ignore
import { ref, computed } from 'vue'

// Form data interfaces
export interface LoginFormData {
  account: string // Email or phone number
  password?: string
  code?: string
}

export interface RegisterFormData {
  username: string
  phone: string
  email?: string
  password: string
  confirmPassword: string
  phoneCode: string
}

// Create authentication state management
export const useAuthState = () => {
  // Basic states
  const isLogin = ref(true)
  const loading = ref(false)
  const loginType = ref<'password' | 'code'>('password')
  const countdown = ref(0)
  const mounted = ref(false)
  
  // Password visibility
  const passwordVisible = ref(false)
  const confirmPasswordVisible = ref(false)
  
  // Modal states
  const userAgreementVisible = ref(false)
  const privacyPolicyVisible = ref(false)
  
  // Form data
  const loginForm = ref<LoginFormData>({
    account: '',
    password: '',
    code: ''
  })
  
  const registerForm = ref<RegisterFormData>({
    username: '',
    phone: '',
    email: '',
    password: '',
    confirmPassword: '',
    phoneCode: ''
  })
  
  // Toggle login/register
  const toggleAuthMode = () => {
    isLogin.value = !isLogin.value
  }
  
  // Toggle login method
  const setLoginType = (type: 'password' | 'code') => {
    loginType.value = type
  }
  
  // Toggle password visibility
  const togglePasswordVisible = () => {
    passwordVisible.value = !passwordVisible.value
  }
  
  const toggleConfirmPasswordVisible = () => {
    confirmPasswordVisible.value = !confirmPasswordVisible.value
  }
  
  // Start countdown
  const startCountdown = () => {
    if (countdown.value > 0) return
    
    countdown.value = 60
    const timer = setInterval(() => {
      countdown.value--
      if (countdown.value <= 0) {
        clearInterval(timer)
      }
    }, 1000)
  }
  
  // Reset forms
  const resetForms = () => {
    loginForm.value = {
      account: '',
      password: '',
      code: ''
    }
    registerForm.value = {
      username: '',
      phone: '',
      email: '',
      password: '',
      confirmPassword: '',
      phoneCode: ''
    }
  }
  
  return {
    // States
    isLogin,
    loading,
    loginType,
    countdown,
    mounted,
    passwordVisible,
    confirmPasswordVisible,
    userAgreementVisible,
    privacyPolicyVisible,
    loginForm,
    registerForm,
    
    // Methods
    toggleAuthMode,
    setLoginType,
    togglePasswordVisible,
    toggleConfirmPasswordVisible,
    startCountdown,
    resetForms
  }
}