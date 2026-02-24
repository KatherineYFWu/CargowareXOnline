<template>
  <header class="bg-white/95 backdrop-blur-sm shadow-sm sticky top-0 z-50">
    <div class="container mx-auto px-4">
      <div class="flex items-center justify-between h-16">
        <!-- Logo Area -->
        <div class="flex items-center space-x-4">
          <img 
            src="/assets/WX20250627-182147@2x.png" 
            alt="WallTech Logo" 
            class="h-8 w-auto"
          />
          <button 
            class="text-gray-600 hover:text-blue-600 transition-colors font-medium"
            @click="goHome"
          >
            Back to Homepage
          </button>
        </div>

        <!-- Right Side Buttons -->
        <div class="flex items-center space-x-4">
          <button 
            class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 transition-colors"
            @click="handleLogin"
          >
            Login/Register
          </button>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
// Event Handling Functions
const goHome = () => {
  window.location.href = 'https://zh.etowertech.com/'
}

const handleLogin = () => {
  // Redirect to login/register page
  window.location.href = '/walltech-vue3-auth'
}
</script>

<style scoped>
/* PortalHeader specific styles */
</style>