<template>
  <section class="py-20 bg-gray-50">
    <div class="container mx-auto px-4">
      <div class="text-center mb-16">
        <h2 class="text-4xl font-bold text-gray-900 mb-4">Eight Core Features</h2>
        <p class="text-xl text-gray-600">Powerful functional modules to comprehensively enhance logistics management efficiency</p>
      </div>
      
      <!-- 8 feature cards - displayed in one row -->
      <div class="grid grid-cols-4 lg:grid-cols-8 gap-4 max-w-6xl mx-auto">
        <div 
          v-for="(feature, index) in features" 
          :key="index"
          @click="selectFeature(index)"
          :class="[
            'group relative bg-white rounded-2xl p-4 cursor-pointer transition-all duration-300 hover:scale-105',
            selectedFeature === index 
              ? 'shadow-xl ring-2 ring-blue-500 bg-gradient-to-br from-blue-50 to-white' 
              : 'shadow-lg hover:shadow-2xl'
          ]"
        >
          <!-- Decorative background -->
          <div 
            :class="[
              'absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-300',
              selectedFeature === index ? 'opacity-100' : 'group-hover:opacity-50'
            ]"
            :style="{
              background: selectedFeature === index 
                ? 'linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(147, 197, 253, 0.05) 100%)'
                : 'linear-gradient(135deg, rgba(59, 130, 246, 0.05) 0%, rgba(147, 197, 253, 0.02) 100%)'
            }"
          ></div>
          
          <div class="relative z-10 text-center">
            <!-- Icon only -->
            <i 
              :class="`${feature.icon} text-lg transition-colors duration-300 mb-3`"
              :style="{ 
                color: selectedFeature === index ? '#2563eb' : '#3B82F6',
                textShadow: selectedFeature === index ? '0 0 10px rgba(59,130,246,0.15)' : 'none'
              }"
            ></i>
            
            <!-- Title -->
            <h3 
              :class="[
                'text-sm font-bold leading-tight transition-colors duration-300',
                selectedFeature === index ? 'text-blue-600' : 'text-gray-900 group-hover:text-blue-600'
              ]"
            >
              {{ feature.title }}
            </h3>
            
            <!-- Selection indicator -->
            <div 
              :class="[
                'w-1 h-1 mx-auto mt-2 rounded-full transition-all duration-300',
                selectedFeature === index ? 'bg-blue-500 scale-150' : 'bg-transparent'
              ]"
            ></div>
          </div>
          
          <!-- Shimmer effect on hover -->
          <div class="shimmer-effect"></div>
        </div>
      </div>
      
      <!-- Detailed display card -->
      <div 
        v-if="selectedFeature !== null" 
        class="mt-12 bg-white rounded-2xl shadow-xl overflow-hidden transition-all duration-500 animate-slideUp max-w-6xl mx-auto relative"
      >
        <!-- Top-left blue gradient circular light spot -->
        <div class="absolute -left-16 -top-16 w-40 h-40 rounded-full bg-gradient-to-br from-blue-400 via-blue-200 to-transparent opacity-30 z-0"></div>
        <!-- Bottom-right light blue circular light spot -->
        <div class="absolute -right-16 -bottom-16 w-32 h-32 rounded-full bg-gradient-to-tl from-blue-100 via-cyan-100 to-transparent opacity-40 z-0"></div>
        <div class="grid grid-cols-1 lg:grid-cols-7">
          <!-- Left text content -->
          <div class="lg:col-span-3 p-6 lg:p-8">
            <div class="flex items-center mb-4">
              <!-- Icon only -->
              <i :class="`${features[selectedFeature].icon} text-xl text-blue-600 mr-3`"></i>
              <div>
                <h3 class="text-2xl font-bold text-gray-900">{{ features[selectedFeature].title }}</h3>
                <p class="text-blue-600 font-medium text-sm">{{ features[selectedFeature].category }}</p>
              </div>
            </div>
            
            <p class="text-base text-gray-600 mb-6 leading-relaxed">
              {{ features[selectedFeature].detailDescription }}
            </p>
            
            <!-- Key features list -->
            <div class="space-y-3">
              <h4 class="text-lg font-bold text-gray-900 mb-3">Core Features</h4>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-2">
                <div 
                  v-for="(highlight, index) in features[selectedFeature].highlights" 
                  :key="index"
                  class="flex items-start"
                >
                  <div class="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <span class="text-gray-700 text-sm">{{ highlight }}</span>
                </div>
              </div>
            </div>
            
            <!-- Action button -->
            <div class="mt-6 flex gap-3">
              <button 
                @click="handleExperience"
                class="bg-blue-600 text-white px-5 py-2.5 hover:bg-blue-700 transition-colors font-medium text-sm border-0 rounded-none"
              >
                Try Now
              </button>
            </div>
          </div>
          
          <!-- Right video area -->
          <div class="lg:col-span-4 flex items-center justify-center p-6 lg:p-8 bg-white">
            <div class="w-full">
              <!-- Video player -->
              <div class="relative bg-white rounded-xl overflow-hidden aspect-video">
                <video 
                  v-if="features[selectedFeature].videoUrl"
                  :src="features[selectedFeature].videoUrl"
                  autoplay
                  loop
                  muted
                  playsinline
                  class="w-full h-full object-cover"
                  :poster="features[selectedFeature].videoPoster"
                >
                  Your browser does not support video playback.
                </video>
                
                <!-- Video placeholder -->
                <div v-else class="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
                  <div class="text-center text-gray-600">
                    <i class="fas fa-play-circle text-5xl mb-3 opacity-70"></i>
                    <p class="text-gray-500 text-sm">Demo video coming soon</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Default prompt -->
      <div v-else class="mt-16 text-center py-12">
        <i class="fas fa-mouse-pointer text-4xl text-gray-400 mb-4"></i>
        <p class="text-xl text-gray-500">Click on the feature cards above to view detailed descriptions</p>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
// @ts-ignore
import { ref, nextTick } from 'vue'

const selectedFeature = ref<number | null>(0) // Default to expanding the first BI panel

// Define emits
const emit = defineEmits<{
  openLeadForm: []
}>()

const features = ref([
  // 1. Smart BI Dashboard
  {
    title: "Smart BI Dashboard",
    description: "Real-time data analysis and visualization",
    icon: "fas fa-chart-bar",
    category: "Data Analysis",
    detailDescription: "AI-powered business intelligence dashboard providing real-time data monitoring, trend analysis, and prediction capabilities. Through intuitive charts and dashboards, it helps managers quickly understand business conditions and make data-driven decisions. Supports custom reports, data drilling, and multi-dimensional analysis.",
    highlights: [
      "Real-time data monitoring and alerts",
      "Intelligent trend analysis and prediction",
      "Visual charts and dashboards",
      "Custom report generation",
      "Multi-dimensional data drill-down analysis"
    ],
    videoUrl: "/qrcodes/video/BI.mp4",
    videoPoster: "/assets/video-poster-bi.jpg"
  },
  // 2. AI Assistant
  {
    title: "AI Assistant",
    description: "24/7 online intelligent support",
    icon: "fas fa-robot",
    category: "Artificial Intelligence",
    detailDescription: "AI assistant based on large language models, providing round-the-clock professional consulting services. Capable of understanding natural language queries, providing accurate business answers, assisting with daily operations, and significantly improving work efficiency.",
    highlights: [
      "Natural language conversation interaction",
      "Professional business knowledge Q&A",
      "Intelligent operation guidance",
      "Multi-language support",
      "Learning user habits to optimize services"
    ],
    videoUrl: "/qrcodes/video/AI.mp4",
    videoPoster: ""
  },
  // 3. Inquiry & Quotation
  {
    title: "Inquiry & Quotation",
    description: "Comprehensive quotation management system",
    icon: "fas fa-calculator",
    category: "Business Management",
    detailDescription: "Complete inquiry and quotation management process, supporting multi-channel inquiries, intelligent quotation recommendations, and price comparison analysis. Built-in cost calculation engine supporting complex fee structures and billing rules.",
    highlights: [
      "Multi-channel inquiry management",
      "Intelligent quotation recommendations",
      "Automatic cost calculation",
      "Price comparison analysis",
      "Quotation version management"
    ],
    videoUrl: "/qrcodes/video/quote.mp4",
    videoPoster: ""
  },
  // 4. Order Collaboration
  {
    title: "Order Collaboration",
    description: "Highly collaborative order fulfillment management",
    icon: "fas fa-handshake",
    category: "Collaboration Management",
    detailDescription: "End-to-end order fulfillment management platform supporting multi-party collaboration, real-time status tracking, and automated process handling. Provides visual order progress monitoring to ensure on-time delivery.",
    highlights: [
      "End-to-end order tracking",
      "Multi-party collaboration platform",
      "Automated process engine",
      "Real-time status updates",
      "Exception alert handling"
    ],
    videoUrl: "/qrcodes/video/doc.mp4",
    videoPoster: ""
  },
  // 5. API Integration
  {
    title: "API Integration",
    description: "Comprehensive third-party system integration",
    icon: "fas fa-plug",
    category: "System Integration",
    detailDescription: "Provides comprehensive API interfaces and SDKs, supporting seamless integration with ERP, WMS, TMS and other systems. Standardized interface design simplifies system integration processes, enabling data exchange and business collaboration.",
    highlights: [
      "RESTful API interfaces",
      "Multiple SDK support",
      "Standardized data formats",
      "Real-time data synchronization",
      "Interface monitoring and management"
    ],
    videoUrl: "/qrcodes/video/api.mp4",
    videoPoster: ""
  },
  // 6. AI Recognition
  {
    title: "AI Recognition",
    description: "Powerful document recognition and data extraction",
    icon: "fas fa-eye",
    category: "Intelligent Recognition",
    detailDescription: "Document recognition technology based on deep learning, supporting automatic recognition and data extraction of invoices, bills of lading, customs declarations, and other logistics documents. Significantly reduces manual data entry work and improves data accuracy.",
    highlights: [
      "Multiple document type recognition",
      "High-precision data extraction",
      "Automatic data validation",
      "Batch processing capability",
      "Traceable recognition results"
    ],
    videoUrl: "/qrcodes/video/scan.mp4",
    videoPoster: ""
  },
  // 7. Permission System
  {
    title: "Permission System",
    description: "Complete organizational structure and permission management",
    icon: "fas fa-users-cog",
    category: "Security Management",
    detailDescription: "Enterprise-level permission management system supporting complex organizational structures and role-based permission configurations. Provides granular functional permission control to ensure data security and operational compliance. Supports SSO single sign-on and multi-factor authentication.",
    highlights: [
      "Multi-level organizational structure support",
      "Granular permission control",
      "Role-based permission management",
      "SSO single sign-on",
      "Audit log tracking"
    ],
    videoUrl: "/qrcodes/video/per.mp4",
    videoPoster: ""
  },
  // 8. Flexible Deployment
  {
    title: "Flexible Deployment",
    description: "Cloud and on-premises deployment support",
    icon: "fas fa-cloud",
    category: "Infrastructure",
    detailDescription: "Supports multiple deployment modes including public cloud, private cloud, and hybrid cloud to meet different enterprise security and compliance requirements. Provides Docker containerized deployment with auto-scaling capabilities to ensure high system availability.",
    highlights: [
      "Multi-cloud environment support",
      "Containerized deployment",
      "Automatic scaling",
      "High-availability architecture",
      "Disaster recovery solutions"
    ],
    videoUrl: "/qrcodes/video/yun.mp4",
    videoPoster: ""
  }
])

const selectFeature = (index: number) => {
  selectedFeature.value = index
}

// Handle Try Now button click
const handleExperience = () => {
  // Redirect to login/registration page
  window.location.href = '/walltech-vue3-auth'
}

// Feature selection handling
// Scroll-related code removed due to fixed grid layout
</script>

<style scoped>
/* PortalFeatures specific styles */
.animate-slideUp {
  animation: slideUp 0.5s ease-out;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Shimmer effect animation */
.shimmer-effect {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border-radius: 1rem;
  background: linear-gradient(45deg, transparent 30%, rgba(255,255,255,0.2) 50%, transparent 70%);
  opacity: 0;
  transform: translateX(-100%);
  transition: opacity 0.3s ease;
  pointer-events: none;
  animation: shimmer 2s infinite;
}

.group:hover .shimmer-effect {
  opacity: 1;
}

@keyframes shimmer {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(100%);
  }
}

/* Card hover shadow optimization */
.group:hover {
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 
              0 10px 10px -5px rgba(0, 0, 0, 0.04),
              0 0 0 1px rgba(59, 130, 246, 0.05);
}

/* Special effects for selected state */
.group.ring-2 {
  box-shadow: 0 25px 50px -12px rgba(59, 130, 246, 0.25),
              0 0 0 2px rgba(59, 130, 246, 0.5);
}

/* Responsive optimizations */
@media (max-width: 1024px) {
  .grid-cols-4 {
    gap: 0.75rem;
  }
}

@media (max-width: 768px) {
  .grid-cols-4 .group {
    padding: 0.75rem;
  }
  
  .grid-cols-4 h3 {
    font-size: 0.75rem;
    line-height: 1;
  }
  
  .grid-cols-4 .w-12 {
    width: 2.5rem;
    height: 2.5rem;
  }
}
</style>