<template>
  <div class="min-h-screen bg-white">
    <PortalHeader />
    <main>
      <PortalHero @open-lead-form="showLeadForm = true" />
      <PortalFeatures @open-lead-form="showLeadForm = true" />
      <PortalAIDemo />
      <PortalCTA @open-lead-form="showLeadForm = true" />
    </main>
    <PortalFooter />
    
    <!-- Lead Generation Popup -->
    <div v-if="showLeadForm" class="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div class="bg-white rounded-2xl shadow-2xl max-w-lg w-full relative overflow-hidden animate-fadeIn">
        <!-- Close Button -->
        <button 
          @click="showLeadForm = false"
          class="absolute top-4 right-4 w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors z-10"
        >
          <i class="fas fa-times text-gray-500"></i>
        </button>
        
        <!-- Decorative Header -->
        <div class="bg-gradient-to-r from-blue-600 to-indigo-600 px-8 pt-8 pb-6 relative">
          <div class="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
          <div class="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-12 -translate-x-12"></div>
          <div class="relative z-10">
            <div class="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mb-4">
              <i class="fas fa-rocket text-white text-2xl"></i>
            </div>
            <h3 class="text-2xl font-bold text-white mb-2">Request Product Demo</h3>
            <p class="text-blue-100 text-sm">Fill in your information and we will provide you with a professional product demo</p>
          </div>
        </div>
        
        <!-- Form Content -->
        <div class="px-8 py-6">
          <form @submit.prevent="handleSubmitForm" class="space-y-5">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div class="relative">
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  <i class="fas fa-user text-blue-500 mr-2"></i>Name
                </label>
                <input 
                  v-model="formData.name"
                  type="text" 
                  class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="Please enter your name"
                  required
                >
              </div>
              <div class="relative">
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  <i class="fas fa-building text-blue-500 mr-2"></i>Company
                </label>
                <input 
                  v-model="formData.company"
                  type="text" 
                  class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="Please enter your company name"
                  required
                >
              </div>
            </div>
            
            <div class="relative">
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  <i class="fas fa-phone text-blue-500 mr-2"></i>Phone
                </label>
                <input 
                  v-model="formData.phone"
                  type="tel" 
                  class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="Please enter your phone number"
                  required
                >
              </div>
            
            <div class="relative">
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  <i class="fas fa-envelope text-blue-500 mr-2"></i>Email
                </label>
                <input 
                  v-model="formData.email"
                  type="email" 
                  class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="Please enter your email address"
                  required
                >
              </div>
            
            <!-- Privacy Notice -->
            <div class="bg-blue-50 rounded-xl p-4 border border-blue-100">
              <div class="flex items-start">
                <i class="fas fa-shield-alt text-blue-500 mt-1 mr-3"></i>
                <div class="text-sm text-gray-600">
                  We promise to protect your privacy. Your information will only be used for product demo appointments and will not be used for other commercial purposes.
                </div>
              </div>
            </div>
            
            <div class="flex gap-3 pt-2">
              <button 
                type="submit"
                class="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 px-6 rounded-xl font-medium hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg hover:shadow-xl"
              >
                Request Demo Now
              </button>
              <button 
                type="button"
                @click="showLeadForm = false"
                class="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// @ts-ignore
import { ref, reactive } from 'vue'
import PortalHeader from './PortalHeader.vue'
import PortalFooter from './PortalFooter.vue'
import PortalHero from './PortalHero.vue'
import PortalFeatures from './PortalFeatures.vue'
import PortalAIDemo from './PortalAIDemo.vue'
import PortalCTA from './PortalCTA.vue'
import './PortalStyles.css'

// Lead form popup state
const showLeadForm = ref(false)

// Form data
const formData = reactive({
  name: '',
  company: '',
  phone: '',
  email: ''
})

// Submit form
const handleSubmitForm = () => {
  console.log('提交表单数据:', formData)
  // 这里可以添加实际的提交逻辑
  alert('Submission successful! We will contact you soon.')
  showLeadForm.value = false
  // 重置表单
  formData.name = ''
  formData.company = ''
  formData.phone = ''
  formData.email = ''
}
</script>

<style scoped>
/* Portal specific styles */
.animate-fadeIn {
  animation: fadeIn 0.3s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: scale(0.95) translateY(-10px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}
</style>