<template>
  <section class="py-20 bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/20">
    <div class="container mx-auto px-4">
      <div class="text-center mb-16">
        <h2 class="text-4xl font-bold text-gray-900 mb-4">AI Everywhere</h2>
        <p class="text-xl text-gray-600">AI Assistant provides intelligent support across all business scenarios</p>
      </div>
      
      <!-- Tab切换按钮 -->
      <div class="flex justify-center mb-8">
        <div class="bg-white/80 backdrop-blur-sm rounded-2xl p-2 shadow-lg border border-purple-200/50">
          <div class="flex gap-2">
            <button
              v-for="(tab, index) in tabs"
              :key="index"
              @click="selectTab(index)"
              :class="[
                'px-6 py-3 rounded-xl font-medium transition-all duration-300',
                selectedTab === index
                  ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg'
                  : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
              ]"
            >
              <i :class="tab.icon" class="mr-2"></i>
              {{ tab.title }}
            </button>
          </div>
        </div>
      </div>

      <!-- AI对话演示区域 -->
      <div class="max-w-4xl mx-auto">
        <div 
          class="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-purple-200/50 overflow-hidden"
          style="height: 600px;"
        >
          <!-- 对话框头部 -->
          <div class="bg-gradient-to-r from-blue-50 via-purple-50 to-pink-50 px-6 py-4 border-b border-purple-200/50">
            <div class="flex items-center justify-between">
              <div class="flex items-center">
                <div class="w-10 h-10 rounded-full overflow-hidden flex items-center justify-center mr-3 shadow-md">
                  <img src="/assets/g6qmm-vsolk.gif" alt="AI Helper" class="w-full h-full object-cover" />
                </div>
                <div>
                  <div class="text-lg font-medium text-gray-800">{{ tabs[selectedTab].title }} AI Helper</div>
                  <div class="text-sm text-purple-600">{{ tabs[selectedTab].description }}</div>
                </div>
              </div>
                             <div class="flex items-center space-x-2">
                 <button 
                   @click="resetDemo"
                   class="px-4 py-2 text-gray-600 hover:text-gray-800 border border-gray-300 rounded-lg hover:bg-gray-50 transition-all"
                 >
                   <i class="fas fa-refresh mr-2"></i>
                   Restart Demo
                 </button>
               </div>
            </div>
          </div>

          <!-- 消息区域 -->
          <div class="flex-1 overflow-y-auto p-6 bg-gradient-to-b from-white via-blue-50/20 to-purple-50/10" style="height: calc(600px - 140px);">
                         <!-- 欢迎消息 -->
             <div v-if="messages.length === 0 && !isPlaying" class="flex justify-center items-center h-full">
               <div class="text-center">
                 <div class="w-16 h-16 rounded-full overflow-hidden flex items-center justify-center mx-auto mb-4 shadow-lg">
                   <img src="/assets/g6qmm-vsolk.gif" alt="AI Helper" class="w-full h-full object-cover" />
                 </div>
                 <h3 class="text-xl font-medium text-gray-800 mb-2">{{ tabs[selectedTab].title }} AI Helper</h3>
                 <p class="text-gray-600 mb-4">{{ tabs[selectedTab].welcomeMessage }}</p>
                 <div class="flex items-center justify-center">
                   <i class="fas fa-spinner fa-spin text-blue-500 mr-2"></i>
                   <span class="text-gray-600">AI Demo is about to start...</span>
                 </div>
               </div>
             </div>

            <!-- 对话消息 -->
                         <div v-for="(message, index) in messages" :key="index" :class="['flex mb-4', message.isUser ? 'justify-end' : 'justify-start']">
               <div v-if="!message.isUser" class="w-8 h-8 rounded-full overflow-hidden flex items-center justify-center mr-3 flex-shrink-0 shadow-sm">
                 <img src="/assets/g6qmm-vsolk.gif" alt="AI" class="w-full h-full object-cover" />
               </div>
               <div :class="[message.isUser ? 'max-w-[70%]' : 'flex-1 mr-4', message.isUser ? 'flex justify-end' : '']">
                <div :class="[
                  'px-4 py-3 rounded-2xl',
                  message.isUser 
                    ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-br-md' 
                    : 'bg-white text-gray-700 border border-gray-200 rounded-bl-md shadow-sm'
                ]">
                  <div v-if="message.type === 'price-list'" class="space-y-3 w-full">
                    <div class="font-medium mb-3">Found the following pricing options for you:</div>
                                         <div v-for="(price, idx) in message.priceData" :key="idx" class="bg-blue-50 rounded-lg p-3 border border-blue-200">
                       <div class="flex justify-between items-start mb-3">
                         <div class="font-medium text-blue-800">{{ price.carrier }}</div>
                         <div class="text-right">
                           <div class="grid grid-cols-3 gap-2 text-sm">
                             <div class="text-center">
                               <div class="text-xs text-gray-500">20GP</div>
                               <div class="font-bold text-blue-600">${{ price.price20GP }}</div>
                             </div>
                             <div class="text-center">
                               <div class="text-xs text-gray-500">40GP</div>
                               <div class="font-bold text-blue-600">${{ price.price40GP }}</div>
                             </div>
                             <div class="text-center">
                               <div class="text-xs text-gray-500">40HC</div>
                               <div class="font-bold text-blue-600">${{ price.price40HC }}</div>
                             </div>
                           </div>
                         </div>
                       </div>
                       <div class="text-sm text-gray-600 space-y-1">
                         <div><i class="fas fa-ship mr-2"></i>{{ price.service }}</div>
                         <div><i class="fas fa-clock mr-2"></i>{{ price.transit }}</div>
                         <div><i class="fas fa-calendar mr-2"></i>{{ price.sailing }}</div>
                       </div>
                     </div>
                  </div>
                                     <div v-else-if="message.type === 'inquiry-form'" class="space-y-3 w-full">
                     <div class="font-medium mb-3">{{ message.text }}</div>
                     <div class="bg-green-50 rounded-lg p-4 border border-green-200">
                       <div class="text-green-800 font-medium mb-2">
                         <i class="fas fa-file-alt mr-2"></i>Inquiry Form Generated
                       </div>
                       <div class="text-sm space-y-2">
                         <div><span class="font-medium">Inquiry No.:</span>{{ message.inquiryData.number }}</div>
                         <div><span class="font-medium">Cargo Info:</span>{{ message.inquiryData.cargo }}</div>
                         <div><span class="font-medium">Dedicated Sales:</span>{{ message.inquiryData.sales }}</div>
                         <div><span class="font-medium">Estimated Response:</span>{{ message.inquiryData.response }}</div>
                       </div>
                     </div>
                   </div>
                   <div v-else-if="message.type === 'task-list'" class="space-y-3 w-full">
                     <div class="font-medium mb-3">{{ message.text }}</div>
                     <div class="space-y-3">
                       <div class="bg-orange-50 rounded-lg p-3 border border-orange-200">
                         <div class="text-orange-800 font-medium mb-2">
                           <i class="fas fa-clipboard-list mr-2"></i>Pending Manifests
                         </div>
                         <div class="flex flex-wrap gap-2">
                           <span v-for="order in message.taskData.pendingManifest" :key="order" class="px-2 py-1 bg-orange-100 text-orange-700 text-xs rounded">{{ order }}</span>
                         </div>
                       </div>
                       <div class="bg-blue-50 rounded-lg p-3 border border-blue-200">
                         <div class="text-blue-800 font-medium mb-2">
                           <i class="fas fa-file-invoice mr-2"></i>Pending Bills
                         </div>
                         <div class="flex flex-wrap gap-2">
                           <span v-for="order in message.taskData.pendingBilling" :key="order" class="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded">{{ order }}</span>
                         </div>
                       </div>
                       <div class="bg-red-50 rounded-lg p-3 border border-red-200">
                         <div class="text-red-800 font-medium mb-2">
                           <i class="fas fa-undo mr-2"></i>Customs Return Pending Confirmation
                         </div>
                         <div class="flex flex-wrap gap-2">
                           <span v-for="order in message.taskData.pendingReturn" :key="order" class="px-2 py-1 bg-red-100 text-red-700 text-xs rounded">{{ order }}</span>
                         </div>
                       </div>
                     </div>
                   </div>
                   <div v-else-if="message.type === 'operation-result'" class="space-y-3 w-full">
                     <div class="font-medium mb-3">{{ message.text }}</div>
                     <div class="space-y-3">
                       <div class="bg-green-50 rounded-lg p-3 border border-green-200">
                         <div class="text-green-800 font-medium mb-2">
                           <i class="fas fa-check-circle mr-2"></i>Customs Return Operation
                         </div>
                         <div class="text-sm text-green-700">{{ message.operationData.returnResult }}</div>
                       </div>
                       <div class="bg-blue-50 rounded-lg p-3 border border-blue-200">
                         <div class="text-blue-800 font-medium mb-2">
                           <i class="fas fa-edit mr-2"></i>Container Type Modification
                         </div>
                         <div class="text-sm space-y-1">
                           <div><span class="font-medium">Order No.:</span>{{ message.operationData.modifyResult.orderNo }}</div>
                           <div><span class="font-medium">Before:</span>{{ message.operationData.modifyResult.before }}</div>
                           <div><span class="font-medium">After:</span>{{ message.operationData.modifyResult.after }}</div>
                           <div><span class="font-medium">Status:</span>{{ message.operationData.modifyResult.ediStatus }}</div>
                           <div><span class="font-medium">EDI Channel:</span>{{ message.operationData.modifyResult.ediChannel }}</div>
                         </div>
                       </div>
                     </div>
                   </div>
                   <div v-else-if="message.type === 'pending-release'" class="space-y-3 w-full">
                     <div class="font-medium mb-3">{{ message.text }}</div>
                     <div class="bg-yellow-50 rounded-lg p-3 border border-yellow-200">
                       <div class="text-yellow-800 font-medium mb-2">
                         <i class="fas fa-ship mr-2"></i>Maersk - Pending Space Release Orders
                       </div>
                       <div class="flex flex-wrap gap-2">
                         <span v-for="order in message.pendingOrders" :key="order" class="px-3 py-1 bg-yellow-100 text-yellow-700 text-sm rounded-lg">{{ order }}</span>
                       </div>
                     </div>
                   </div>
                   <div v-else-if="message.type === 'batch-return'" class="space-y-3 w-full">
                     <div class="font-medium mb-3">{{ message.text }}</div>
                     <div class="bg-red-50 rounded-lg p-3 border border-red-200">
                       <div class="text-red-800 font-medium mb-2">
                         <i class="fas fa-check-circle mr-2"></i>Batch Customs Return Completed
                       </div>
                       <div class="space-y-2">
                         <div v-for="order in message.returnedOrders" :key="order" class="flex items-center text-sm">
                           <i class="fas fa-check text-green-600 mr-2"></i>
                           <span class="text-gray-700">{{ order }} Successfully Returned to Customs</span>
                         </div>
                       </div>
                     </div>
                   </div>
                   <div v-else-if="message.type === 'file-upload'" class="space-y-3 w-full">
                     <div class="font-medium mb-3">{{ message.text }}</div>
                     <div class="bg-blue-50 rounded-lg p-4 border border-blue-200">
                       <div class="text-blue-800 font-medium mb-2">
                         <i class="fas fa-file-upload mr-2"></i>File Upload
                       </div>
                       <div class="text-sm space-y-2">
                         <div><span class="font-medium text-blue-700">File Name:</span><span class="font-bold text-blue-700">{{ message.fileName }}</span></div>
                       </div>
                     </div>
                   </div>
                   <div v-else-if="message.type === 'diff-list'" class="space-y-3 w-full">
                     <div class="font-medium mb-3">{{ message.text }}</div>
                     <div class="bg-green-50 rounded-lg p-4 border border-green-200">
                       <div class="text-green-800 font-medium mb-2">
                         <i class="fas fa-list mr-2"></i>Differences
                       </div>
                       <div class="text-sm space-y-2">
                         <div v-for="(diff, idx) in message.diffData" :key="idx" class="flex justify-between items-start">
                           <div class="font-medium text-gray-800">{{ diff.field }}</div>
                           <div class="text-right">
                             <div class="text-xs text-gray-500">Old: {{ diff.old }}</div>
                             <div class="text-xs text-gray-500">New: {{ diff.new }}</div>
                           </div>
                         </div>
                       </div>
                     </div>
                   </div>
                   <div v-else-if="message.type === 'update-list'" class="space-y-3 w-full">
                     <div class="font-medium mb-3">{{ message.text }}</div>
                     <div class="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
                       <div class="text-yellow-800 font-medium mb-2">
                         <i class="fas fa-update mr-2"></i>Data Updates
                       </div>
                       <div class="text-sm space-y-2">
                         <div v-for="(update, idx) in message.updateData" :key="idx" class="flex justify-between items-start">
                           <div class="font-medium text-gray-800">{{ update.field }}</div>
                           <div class="text-right">
                             <div class="text-xs text-gray-500">Old: {{ update.old }}</div>
                             <div class="text-xs text-gray-500">New: {{ update.value }}</div>
                           </div>
                         </div>
                       </div>
                     </div>
                   </div>
                   <div v-else-if="message.type === 'tracking-info'" class="space-y-3 w-full">
                     <div class="font-medium mb-3">{{ message.text }}</div>
                     <div class="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
                       <div class="text-yellow-800 font-medium mb-2">
                         <i class="fas fa-info-circle mr-2"></i>Logistics Node Information
                       </div>
                       <div class="text-sm space-y-2">
                         <div v-for="(event, idx) in message.trackingData.events" :key="idx" class="flex justify-between items-start">
                           <div class="font-medium text-gray-800">{{ event.port }}</div>
                           <div class="text-right">
                             <div v-for="(node, idx) in event.nodes" :key="idx" class="text-xs text-gray-500">{{ node.label }} - {{ node.time }}</div>
                           </div>
                         </div>
                       </div>
                     </div>
                   </div>
                                       <div v-else-if="message.type === 'chart'" class="space-y-3 w-full">
                      <div class="font-medium mb-3">{{ message.text }}</div>
                      <div class="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
                        <div :ref="(el: any) => setChartRef(el, `chart-${index}`)" style="width: 100%; height: 300px;"></div>
                      </div>
                    </div>
                    <div v-else-if="message.type === 'multi-chart'" class="space-y-3 w-full">
                      <div class="font-medium mb-3">{{ message.text }}</div>
                      <div class="space-y-4">
                        <div v-for="(chart, idx) in message.charts" :key="idx" class="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
                          <div :ref="(el: any) => setChartRef(el, `multi-chart-${index}-${idx}`)" style="width: 100%; height: 280px;"></div>
                        </div>
                      </div>
                    </div>
                                     <div v-else>
                     {{ message.text }}
                     <span v-if="message.isTyping" class="typing-cursor">|</span>
                   </div>
                </div>
              </div>
            </div>

            <!-- 正在输入指示器 -->
            <div v-if="isTyping" class="flex justify-start mb-4">
              <div class="w-8 h-8 rounded-full overflow-hidden flex items-center justify-center mr-3 flex-shrink-0 shadow-sm">
                <img src="/assets/g6qmm-vsolk.gif" alt="AI" class="w-full h-full object-cover" />
              </div>
              <div class="bg-white text-gray-700 border border-gray-200 rounded-2xl rounded-bl-md shadow-sm px-4 py-3">
                <div class="flex items-center space-x-1">
                  <div class="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                  <div class="w-2 h-2 bg-blue-500 rounded-full animate-pulse" style="animation-delay: 0.2s"></div>
                  <div class="w-2 h-2 bg-blue-500 rounded-full animate-pulse" style="animation-delay: 0.4s"></div>
                  <span class="ml-2 text-sm text-gray-500">AI is thinking...</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
// @ts-ignore
import { ref, reactive, onMounted, nextTick } from 'vue'
import * as echarts from 'echarts'

// Tab Configuration
const tabs = ref([
  {
    title: 'Smart Pricing',
    icon: 'fas fa-calculator',
    description: 'Intelligent Pricing Query and Inquiry Assistant',
    welcomeMessage: 'I can help you query prices, generate inquiry forms, making price management simpler and more efficient'
  },
  {
    title: 'Order Management',
    icon: 'fas fa-clipboard-list',
    description: 'Order Processing and Status Tracking Assistant',
    welcomeMessage: 'I can help you process orders and track status, making order management easier and more convenient'
  },
  {
    title: 'AI Recognition',
    icon: 'fas fa-eye',
    description: 'Intelligent Document Recognition and Data Extraction',
    welcomeMessage: 'I can help you recognize various documents and extract key information, making data entry more accurate and faster'
  },
  {
    title: 'Shipment Tracking',
    icon: 'fas fa-route',
    description: 'Real-time Cargo Transportation Status Tracking',
    welcomeMessage: 'I can help you track cargo status and predict arrival times, making logistics information more transparent and timely'
  },
  {
    title: 'ChatBI',
    icon: 'fas fa-chart-bar',
    description: 'Intelligent Data Analysis and Report Generation',
    welcomeMessage: 'I can help you analyze business data and generate visual reports, making decisions more scientific and accurate'
  }
])

const selectedTab = ref(0)
const messages = ref<any[]>([])
const isPlaying = ref(false)
const isTyping = ref(false)
const currentTypingText = ref('')
const typingMessageIndex = ref(-1)
const chartRefs = ref<Record<string, any>>({})
const chartInstances = ref<Record<string, any>>({})

// Smart Pricing Demo Conversation Data
const smartPricingDemo = [
  {
    isUser: true,
    text: 'What is the price from Shanghai to Los Angeles next week?'
  },
  {
    isUser: false,
    type: 'price-list',
    text: 'Found the following pricing options for you:',
    priceData: [
      {
        carrier: 'COSCO',
        price20GP: '2,650',
        price40GP: '2,850',
        price40HC: '3,020',
        service: 'CCX',
        transit: '15 days',
        sailing: 'Sailing next Tuesday'
      },
      {
        carrier: 'OOCL',
        price20GP: '2,720',
        price40GP: '2,920',
        price40HC: '3,100',
        service: 'PAX',
        transit: '14 days',
        sailing: 'Sailing next Thursday'
      },
      {
        carrier: 'MSC',
        price20GP: '2,950',
        price40GP: '3,100',
        price40HC: '3,280',
        service: 'Eagle Express',
        transit: '12 days',
        sailing: 'Sailing next Saturday'
      }
    ]
  },
  {
    isUser: true,
    text: 'It\'s too expensive, I have a large shipment and need to apply for a special price.'
  },
  {
    isUser: false,
    text: 'Please provide information such as cargo number, time, quantity, and product name, and I will automatically generate an inquiry form for you.'
  },
  {
    isUser: true,
    text: 'The cargo will be ready in two weeks, 20×40HC, furniture, needs fast shipping.'
  },
  {
    isUser: false,
    type: 'inquiry-form',
    text: 'Inquiry form has been automatically generated for you:',
    inquiryData: {
      number: 'INQ20241230001',
      cargo: '20×40HC Furniture (Fast Shipping)',
      sales: 'James Liu',
      response: 'Reply within 1 hour'
    }
  }
]

// Order Management Demo Conversation Data
const orderManagementDemo = [
  {
    isUser: true,
    text: 'What tasks do I have to do today?'
  },
  {
    isUser: false,
    type: 'task-list',
    text: 'The following orders need to be processed:',
    taskData: {
      pendingManifest: ['SH2024120001', 'SH2024120002'],
      pendingBilling: ['SH2024119001', 'SH2024119002'],
      pendingReturn: ['SH2024118001', 'SH2024118002']
    }
  },
  {
    isUser: true,
    text: 'Return SH2024119001 to customs, change SH2024119002 container type to 2*20GP and re-book.'
  },
  {
    isUser: false,
    type: 'operation-result',
    text: 'Operation completed:',
    operationData: {
      returnResult: 'SH2024119001 has been returned to customs',
      modifyResult: {
        orderNo: 'SH2024119002',
        before: '1*40HQ',
        after: '2*20GP',
        ediStatus: 'Booking EDI submitted',
        ediChannel: 'INTTRA'
      }
    }
  },
  {
    isUser: true,
    text: 'How many orders with Maersk have pending space release for ETD next week?'
  },
  {
    isUser: false,
    type: 'pending-release',
    text: 'Orders with ETD within next week and space status as Pending:',
    pendingOrders: ['SH2024120101', 'SH2024120102', 'SH2024120103']
  },
  {
    isUser: true,
    text: 'Return all of these to customs.'
  },
  {
    isUser: false,
    type: 'batch-return',
    text: 'The following orders have been returned to customs:',
    returnedOrders: ['SH2024120101', 'SH2024120102', 'SH2024120103']
  }
]

// AI Recognition Demo Conversation Data
const aiRecognitionDemo = [
  {
    isUser: true,
    type: 'file-upload',
    fileName: 'SHSE123456 SI 补料.pdf',
    text: 'Upload File: SHSE123456 SI 补料.pdf'
  },
  {
    isUser: false,
    text: 'Received file "SHSE123456 SI 补料.pdf", identifying...'
  },
  {
    isUser: false,
    text: 'Identified file type as "SI Supplement", would you like to start document matching?'
  },
  {
    isUser: true,
    text: 'Yes'
  },
  {
    isUser: false,
    type: 'diff-list',
    text: 'Document matching completed, the following differences were found:',
    diffData: [
      { field: 'Container No.', old: 'Empty', new: 'TCNU1122330' },
      { field: 'Cargo Name', old: 'General Cargo', new: 'Chair、Table' },
      { field: 'Pieces', old: '10', new: '12' },
      { field: 'Gross Weight', old: '8000kg', new: '8200kg' },
      { field: 'Marks', old: 'N/M', new: 'WOOO' }
    ]
  },
  {
    isUser: false,
    text: 'Would you like to overwrite system data?'
  },
  {
    isUser: true,
    text: 'Confirm'
  },
  {
    isUser: false,
    type: 'update-list',
    text: 'The following data has been updated:',
    updateData: [
      { field: 'Container No.', value: 'TCNU1122330' },
      { field: 'Cargo Name', value: 'Chair、Table' },
      { field: 'Pieces', value: '12' },
      { field: 'Gross Weight', value: '8200kg' },
      { field: 'Marks', value: 'WOOO' }
    ]
  }
]

// Shipment Tracking Demo Conversation Data
const trackingDemo = [
  {
    isUser: true,
    text: 'SHSE11122223'
  },
  {
    isUser: false,
    type: 'tracking-info',
    text: 'Found the latest logistics node information for shipment [SHSE11122223]:',
    trackingData: {
      containerNo: 'A14FX01920',
      origin: 'HONG KONG, CHINA',
      destination: 'SINGAPORE',
      events: [
        { port: 'HONG KONG, CHINA', nodes: [
          { label: 'Empty Container Pickup', time: '2025-05-28 14:56' },
          { label: 'Gate In', time: '2025-05-28 19:53' },
          { label: 'Loaded on Vessel', time: '2025-05-29 09:50' },
          { label: 'Vessel Departure', time: '2025-05-29 17:37' }
        ]},
        { port: 'SINGAPORE', nodes: [
          { label: 'Vessel Arrival', time: '2025-06-02 23:38' },
          { label: 'Vessel Berthing', time: '2025-06-03 00:12' },
          { label: 'Unloaded from Vessel', time: '2025-06-03 05:34' },
          { label: 'Container Pickup (Cargo)', time: '2025-06-03 19:08' },
          { label: 'Empty Container Return', time: '2025-06-06 13:59' }
        ]}
      ],
      vessel: {
        name: 'WAN HAI 370',
        voyage: 'S016',
        mmsi: '563220900',
        imo: '9958092'
      }
    }
  }
]

// ChatBI Demo Conversation Data
const chatBIDemo = [
  {
    isUser: true,
    text: 'Check this month\'s orders, US routes business, make a bar chart.'
  },
  {
    isUser: false,
    type: 'chart',
    text: 'Generated this month\'s US route order bar chart:',
    chartData: {
      type: 'bar',
      title: 'US Route Order Statistics - December 2024',
      data: [
        { label: 'US West Basic Ports', value: 156 },
        { label: 'US East Basic Ports', value: 89 },
        { label: 'US West Minor Ports', value: 45 },
        { label: 'US East Minor Ports', value: 32 }
      ]
    }
  },
  {
    isUser: true,
    text: 'May\'s business profit margin and target achievement rate for each salesperson, make line charts for each'
  },
  {
    isUser: false,
    type: 'multi-chart',
    text: 'Generated May sales performance analysis charts:',
    charts: [
      {
        type: 'line',
        title: 'Sales Business Profit Margin - May',
        data: [
          { label: 'James Liu', values: [12, 15, 18, 16, 20] },
          { label: 'Sarah Chen', values: [10, 13, 14, 17, 19] },
          { label: 'Mike Wang', values: [8, 11, 13, 15, 16] },
          { label: 'Lisa Zhang', values: [14, 16, 15, 18, 22] }
        ]
      },
      {
        type: 'line',
        title: 'Sales Target Achievement Rate - May',
        data: [
          { label: 'James Liu', values: [85, 90, 95, 92, 98] },
          { label: 'Sarah Chen', values: [80, 88, 92, 96, 102] },
          { label: 'Mike Wang', values: [75, 82, 87, 90, 94] },
          { label: 'Lisa Zhang', values: [90, 95, 93, 98, 105] }
        ]
      }
    ]
  }
]

// Switch Tab
const selectTab = async (index: number) => {
  selectedTab.value = index
  resetDemo()
  // Auto-start demo after 1 second delay
  await delay(1000)
  startDemo()
}

// Start Demo
const startDemo = async () => {
  if (isPlaying.value) return
  
  isPlaying.value = true
  messages.value = []
  
  if (selectedTab.value === 0) {
    // Smart Pricing Demo
    await playSmartPricingDemo()
  } else if (selectedTab.value === 1) {
    // Order Management Demo
    await playOrderManagementDemo()
  } else if (selectedTab.value === 2) {
    // AI Recognition Demo
    await playAiRecognitionDemo()
  } else if (selectedTab.value === 3) {
    // Shipment Tracking Demo
    await playTrackingDemo()
  } else if (selectedTab.value === 4) {
    // ChatBI Demo
    await playChatBIDemo()
  }
  
  isPlaying.value = false
}

// Play Smart Pricing Demo
const playSmartPricingDemo = async () => {
  for (let i = 0; i < smartPricingDemo.length; i++) {
    const message = smartPricingDemo[i]
    
    if (message.isUser) {
      // 用户消息直接显示
      await delay(1000)
      messages.value.push(message)
    } else {
      // AI消息需要显示打字效果
      await delay(800)
      
      if (message.type === 'price-list' || message.type === 'inquiry-form') {
        // 特殊类型消息直接显示
        isTyping.value = true
        await delay(1500)
        isTyping.value = false
        messages.value.push(message)
      } else {
        // 普通文本消息使用打字机效果
        await typewriterEffect(message.text, i)
      }
    }
  }
}

// Play Order Management Demo
const playOrderManagementDemo = async () => {
  for (let i = 0; i < orderManagementDemo.length; i++) {
    const message = orderManagementDemo[i]
    
    if (message.isUser) {
      // 用户消息直接显示
      await delay(1000)
      messages.value.push(message)
    } else {
      // AI消息需要显示打字效果
      await delay(800)
      
      if (message.type === 'task-list' || message.type === 'operation-result' || 
          message.type === 'pending-release' || message.type === 'batch-return') {
        // 特殊类型消息直接显示
        isTyping.value = true
        await delay(1500)
        isTyping.value = false
        messages.value.push(message)
      } else {
        // 普通文本消息使用打字机效果
        await typewriterEffect(message.text, i)
      }
    }
  }
}

// Play AI Recognition Demo
const playAiRecognitionDemo = async () => {
  for (let i = 0; i < aiRecognitionDemo.length; i++) {
    const message = aiRecognitionDemo[i]
    
    if (message.isUser) {
      // 用户消息直接显示
      await delay(1000)
      messages.value.push(message)
    } else {
      // AI消息需要显示打字效果
      await delay(800)
      
      if (message.type === 'file-upload' || message.type === 'diff-list' || message.type === 'update-list') {
        // 特殊类型消息直接显示
        isTyping.value = true
        await delay(1500)
        isTyping.value = false
        messages.value.push(message)
      } else {
        // 普通文本消息使用打字机效果
        await typewriterEffect(message.text, i)
      }
    }
  }
}

// Play Shipment Tracking Demo
const playTrackingDemo = async () => {
  for (let i = 0; i < trackingDemo.length; i++) {
    const message = trackingDemo[i]
    
    if (message.isUser) {
      // 用户消息直接显示
      await delay(1000)
      messages.value.push(message)
    } else {
      // AI消息需要显示打字效果
      await delay(800)
      
      if (message.type === 'tracking-info') {
        // 特殊类型消息直接显示
        isTyping.value = true
        await delay(1500)
        isTyping.value = false
        messages.value.push(message)
      } else {
        // 普通文本消息使用打字机效果
        await typewriterEffect(message.text, i)
      }
    }
  }
}

// Play ChatBI Demo
const playChatBIDemo = async () => {
  for (let i = 0; i < chatBIDemo.length; i++) {
    const message = chatBIDemo[i]
    
    if (message.isUser) {
      // 用户消息直接显示
      await delay(1000)
      messages.value.push(message)
    } else {
      // AI消息需要显示打字效果
      await delay(800)
      
      if (message.type === 'chart' || message.type === 'multi-chart') {
        // 特殊类型消息直接显示
        isTyping.value = true
        await delay(1500)
        isTyping.value = false
        messages.value.push(message)
        
        // 渲染图表
        await nextTick()
        if (message.type === 'chart') {
          const chartKey = `chart-${messages.value.length - 1}`
          await renderBarChart(message.chartData, chartKey)
        } else if (message.type === 'multi-chart' && message.charts) {
          for (let j = 0; j < message.charts.length; j++) {
            const chartKey = `multi-chart-${messages.value.length - 1}-${j}`
            await renderLineChart(message.charts[j], chartKey)
          }
        }
      } else {
        // 普通文本消息使用打字机效果
        await typewriterEffect(message.text, i)
      }
    }
  }
}

// Typewriter Effect
const typewriterEffect = async (text: string, messageIndex: number) => {
  typingMessageIndex.value = messageIndex
  currentTypingText.value = ''
  
  // 添加一个临时消息用于显示打字效果
  const tempMessage = {
    isUser: false,
    text: '',
    isTyping: true
  }
  messages.value.push(tempMessage)
  
  // 逐字显示
  for (let i = 0; i <= text.length; i++) {
    currentTypingText.value = text.slice(0, i)
    tempMessage.text = currentTypingText.value
    await delay(50) // 每个字符延迟50ms
  }
  
  // 完成打字，移除isTyping标记
  tempMessage.isTyping = false
  typingMessageIndex.value = -1
}

// Reset Demo
const resetDemo = () => {
  messages.value = []
  isPlaying.value = false
  isTyping.value = false
  currentTypingText.value = ''
  typingMessageIndex.value = -1
}

// Delay Function
const delay = (ms: number) => {
  return new Promise(resolve => setTimeout(resolve, ms))
}

// Set Chart Reference
const setChartRef = (el: any, key: string) => {
  if (el) {
    chartRefs.value[key] = el
  }
}

// Render Bar Chart
const renderBarChart = async (chartData: any, key: string) => {
  await nextTick()
  const dom = chartRefs.value[key]
  if (!dom) return
  
  const myChart = echarts.init(dom)
  chartInstances.value[key] = myChart
  
  const option = {
    title: {
      text: chartData.title,
      left: 'center',
      top: 10,
      textStyle: {
        fontSize: 16,
        fontWeight: 'bold'
      }
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      }
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: chartData.data.map((item: any) => item.label),
      axisLabel: {
        interval: 0,
        rotate: 30
      }
    },
    yAxis: {
          type: 'value',
          name: 'Number of Orders'
        },
    series: [{
      data: chartData.data.map((item: any) => item.value),
      type: 'bar',
      itemStyle: {
        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
          { offset: 0, color: '#3B82F6' },
          { offset: 1, color: '#1E40AF' }
        ])
      },
      label: {
        show: true,
        position: 'top',
        formatter: '{c}'
      }
    }]
  }
  
  myChart.setOption(option)
}

// Render Line Chart
const renderLineChart = async (chartData: any, key: string) => {
  await nextTick()
  const dom = chartRefs.value[key]
  if (!dom) return
  
  const myChart = echarts.init(dom)
  chartInstances.value[key] = myChart
  
  const option = {
    title: {
      text: chartData.title,
      left: 'center',
      top: 10,
      textStyle: {
        fontSize: 16,
        fontWeight: 'bold'
      }
    },
    tooltip: {
      trigger: 'axis'
    },
    legend: {
      data: chartData.data.map((item: any) => item.label),
      bottom: 10
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '15%',
      containLabel: true
    },
    xAxis: {
          type: 'category',
          boundaryGap: false,
          data: ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5']
        },
    yAxis: {
          type: 'value',
          name: chartData.title.includes('利润率') ? 'Profit Margin(%)' : 'Achievement Rate(%)'
        },
    series: chartData.data.map((item: any) => ({
      name: item.label,
      type: 'line',
      smooth: true,
      data: item.values,
      lineStyle: {
        width: 2
      },
      symbol: 'circle',
      symbolSize: 8
    }))
  }
  
  myChart.setOption(option)
}

// Start demo automatically when component is mounted
onMounted(async () => {
  await delay(500)
  startDemo()
  
  // Listen for window resize events to adjust chart sizes
  window.addEventListener('resize', () => {
    Object.values(chartInstances.value).forEach((chart: any) => {
      chart.resize()
    })
  })
})
</script>

<style scoped>
/* PortalAIDemo Specific Styles */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes blink {
  0%, 50% { opacity: 1; }
  51%, 100% { opacity: 0; }
}

.message-enter-active {
  animation: fadeIn 0.5s ease-out;
}

.typing-cursor {
  animation: blink 1s infinite;
  color: #3B82F6;
  font-weight: bold;
}

/* 响应式优化 */
@media (max-width: 768px) {
  .container {
    padding-left: 1rem;
    padding-right: 1rem;
  }
  
  .max-w-4xl {
    margin-left: 0;
    margin-right: 0;
  }
}
</style>