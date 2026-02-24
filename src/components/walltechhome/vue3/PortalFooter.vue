<template>
  <footer class="bg-white pt-16 pb-8">
    <div class="container mx-auto px-4">
      <!-- Logo and Search Bar Area -->
      <div class="flex flex-col md:flex-row justify-between items-start mb-12">
        <div class="flex items-center mb-6 md:mb-0">
          <img 
            src="/assets/WX20250627-182147@2x.png" 
            alt="WallTech (China) Co.,Ltd." 
            class="h-12 w-auto"
          />
        </div>
        <div class="flex items-center bg-gray-50 rounded-lg px-4 py-2 w-full md:w-96">
          <input 
            type="text" 
            placeholder="Search..." 
            class="bg-transparent outline-none flex-1 text-gray-600"
          />
          <button class="text-gray-400 hover:text-blue-600">
            <i class="fas fa-search"></i>
          </button>
        </div>
      </div>

      <!-- Main Links Area -->
      <div class="grid grid-cols-1 md:grid-cols-5 gap-8 mb-12">
        <!-- Customers & Support -->
        <div>
          <h3 class="text-gray-800 font-semibold mb-4">Customers & Support</h3>
          <ul class="space-y-2">
            <li><a href="https://zh.etowertech.com/etowerb2c-parcel-logistics-management/" target="_blank" class="text-gray-600 hover:text-blue-600 text-sm transition-colors">eTowerB2C</a></li>
            <li><a href="https://zh.etowertech.com/etowerone-integrated-logistics-management/" target="_blank" class="text-gray-600 hover:text-blue-600 text-sm transition-colors">eTowerOne</a></li>
            <li><a href="https://zh.etowertech.com/cargoware-freight-forwarding-management/" target="_blank" class="text-gray-600 hover:text-blue-600 text-sm transition-colors">CargoWare</a></li>
            <li><a href="https://zh.etowertech.com/contact/#contact" target="_blank" class="text-gray-600 hover:text-blue-600 text-sm transition-colors">IT Support</a></li>
            <li><a href="https://auth.walltechsystem.cn/LoginServlet?ps=eyJyZXR1cm5VcmwiOiJodHRwczpcL1wvY24uZXRvd2VydGVjaC5jb21cL0luZGV4U2VydmxldCIsInNlcnZpY2VDb2RlIjoiUGFyY2VsIiwiYnJhbmQiOiJjbi5ldG93ZXJ0ZWNoLmNvbSIsImxhbmd1YWdlIjoiZW5fVVMifQ==&notifyUrl=https%3A%2F%2Fwww.etowertech.com%2FApi%2FSync%2FloginNotify%3Flogin_flag%3D99134f39-507a-41ea-905e-4f9e74f42d07" target="_blank" class="text-gray-600 hover:text-blue-600 text-sm transition-colors">Login</a></li>
          </ul>
        </div>

        <!-- Help Center -->
        <div>
          <h3 class="text-gray-800 font-semibold mb-4">Help Center</h3>
          <ul class="space-y-2">
            <li><a href="https://zh.etowertech.com/faqs/" target="_blank" class="text-gray-600 hover:text-blue-600 text-sm transition-colors">FAQs</a></li>
            <li><a href="https://zh.etowertech.com/contact/#contact" target="_blank" class="text-gray-600 hover:text-blue-600 text-sm transition-colors">Customer Service</a></li>
            <li><a href="https://zh.etowertech.com/privacy-policy.html" target="_blank" class="text-gray-600 hover:text-blue-600 text-sm transition-colors">Privacy Policy</a></li>
          </ul>
        </div>

        <!-- Contact Us -->
        <div>
          <h3 class="text-gray-800 font-semibold mb-4">Contact Us</h3>
          <ul class="space-y-2">
            <li><a href="https://zh.etowertech.com/company-profile/" target="_blank" class="text-gray-600 hover:text-blue-600 text-sm transition-colors">Partnership</a></li>
            <li><a href="https://zh.etowertech.com/contact/#contact" target="_blank" class="text-gray-600 hover:text-blue-600 text-sm transition-colors">Inquiry</a></li>
            <li><a href="https://zh.etowertech.com/company-profile/" target="_blank" class="text-gray-600 hover:text-blue-600 text-sm transition-colors">Locations</a></li>
          </ul>
        </div>

        <!-- Feedback & Suggestions -->
        <div>
          <h3 class="text-gray-800 font-semibold mb-4">Feedback & Suggestions</h3>
          <ul class="space-y-2">
            <li><a href="https://zh.etowertech.com/contact/#contact" target="_blank" class="text-gray-600 hover:text-blue-600 text-sm transition-colors">Comments</a></li>
            <li><a href="https://zh.etowertech.com/contact/#contact" target="_blank" class="text-gray-600 hover:text-blue-600 text-sm transition-colors">Suggestion Email</a></li>
          </ul>
        </div>

        <!-- Partner Evaluation -->
        <div>
          <h3 class="text-gray-800 font-semibold mb-4">Partner Evaluation</h3>
          <ul class="space-y-2">
            <li><a href="https://zh.etowertech.com/cooperation-cases/" target="_blank" class="text-gray-600 hover:text-blue-600 text-sm transition-colors">Partners</a></li>
            <li><a href="https://zh.etowertech.com/cooperation-cases/" target="_blank" class="text-gray-600 hover:text-blue-600 text-sm transition-colors">Case Studies</a></li>
            <li><a href="https://zh.etowertech.com/cooperation-cases/" target="_blank" class="text-gray-600 hover:text-blue-600 text-sm transition-colors">Reviews</a></li>
          </ul>
        </div>
      </div>

      <!-- Contact Information Area -->
      <div class="border-t border-gray-200 pt-8 mb-8">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
          <!-- Phone -->
          <div class="flex items-center">
            <i class="fas fa-phone text-blue-600 mr-3"></i>
            <a href="tel:400-665-9211" class="text-gray-700 hover:text-blue-600 transition-colors">
              400-665-9211
            </a>
          </div>

          <!-- Email -->
          <div class="flex items-center">
            <i class="fas fa-envelope text-blue-600 mr-3"></i>
            <a href="mailto:etowermkt@walltechsystem.cn" class="text-gray-700 hover:text-blue-600 transition-colors">
              etowermkt@walltechsystem.cn
            </a>
          </div>

          <!-- Address -->
          <div class="md:col-span-2">
            <div class="flex items-start">
              <i class="fas fa-map-marker-alt text-blue-600 mr-3 mt-1"></i>
              <div class="text-gray-700 text-sm">
                <div class="mb-1">Headquarters: 9F, Tower A, Zhongyin Plaza, 669 Zhoujiazui Road, Hongkou District, Shanghai</div>
                <div class="mb-1">South China Office: 30F, Office Tower T2, Runhong Building, 75 Meiyuan Road, Luohu District, Shenzhen</div>
                <div>Beijing Office: Room 623, Tower B, Xuhui Airport Center, Shunyi District, Beijing</div>
              </div>
            </div>
          </div>
        </div>

        <!-- Social Media Icons -->
        <div class="flex justify-center space-x-6 mt-8">
          <a href="https://www.linkedin.com/company/etowertech/?viewAsMember=true" 
             target="_blank" 
             class="text-gray-400 hover:text-blue-600 transition-colors" 
             title="LinkedIn"
             aria-label="访问我们的LinkedIn主页">
            <i class="fab fa-linkedin text-xl"></i>
          </a>
          <a href="https://www.facebook.com/eTowertech/" 
             target="_blank" 
             class="text-gray-400 hover:text-blue-600 transition-colors" 
             title="Facebook"
             aria-label="访问我们的Facebook页面">
            <i class="fab fa-facebook text-xl"></i>
          </a>
          <a href="https://x.com/etowertech" 
             target="_blank" 
             class="text-gray-400 hover:text-blue-600 transition-colors" 
             title="X (Twitter)"
             aria-label="访问我们的X账号">
            <i class="fab fa-twitter text-xl"></i>
          </a>
          <a href="https://www.youtube.com/@WallTechSystemLogistics" 
             target="_blank" 
             class="text-gray-400 hover:text-blue-600 transition-colors" 
             title="YouTube"
             aria-label="访问我们的YouTube频道">
            <i class="fab fa-youtube text-xl"></i>
          </a>
            <a href="https://affim.baidu.com/unique_23353207/chat?siteId=19529787&userId=23353207&siteToken=79c1c8eec08eed73a1ea37fdf830aad3" 
             target="_blank" 
             class="text-gray-400 hover:text-blue-600 transition-colors" 
             title="Live Chat"
             aria-label="Chat with us online">
            <i class="fas fa-comments text-xl"></i>
          </a>
          <a href="https://wa.me/" 
             target="_blank" 
             class="text-gray-400 hover:text-blue-600 transition-colors" 
             title="WhatsApp"
             aria-label="通过WhatsApp联系我们">
            <i class="fab fa-whatsapp text-xl"></i>
          </a>
        </div>
      </div>

      <!-- Bottom Copyright Information -->
      <div class="border-t border-gray-200 pt-6">
        <div class="flex flex-col md:flex-row justify-between items-center mb-4">
          <div class="text-center">
            <p class="text-gray-500 text-sm mb-2">
              Copyright © <a href="https://zh.etowertech.com/" target="_blank" class="hover:text-blue-600 transition-colors">WallTech (China) Co.,Ltd.</a> All rights reserved.
            </p>
          </div>
          <div class="flex space-x-6 mt-4 md:mt-0">
            <a href="https://zh.etowertech.com/sitemap.html" target="_blank" class="text-gray-500 hover:text-blue-600 text-sm transition-colors">Sitemap</a>
            <a href="https://zh.etowertech.com/privacy-policy.html" target="_blank" class="text-gray-500 hover:text-blue-600 text-sm transition-colors">Privacy Policy</a>
          </div>
        </div>

        <!-- Filing Information -->
        <div class="flex flex-col md:flex-row justify-center items-center space-y-2 md:space-y-0 md:space-x-4 text-xs text-gray-400">
          <a
            href="https://beian.miit.gov.cn/"
            target="_blank"
            rel="noopener noreferrer"
            class="flex items-center hover:text-blue-600 transition-colors duration-300"
          >
            <span>沪ICP备20230512号-1</span>
          </a>
          <a
            href="http://www.beian.gov.cn/portal/registerSystemInfo"
            target="_blank"
            rel="noopener noreferrer"
            class="flex items-center hover:text-blue-600 transition-colors duration-300"
          >
            <img
              src="/gongan.png"
              alt="Public Security Filing Icon"
              class="h-4 mr-1"
            />
            <span>沪公网安备31010402005432号</span>
          </a>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
// Footer component
</script>

<style scoped>
/* PortalFooter specific styles */
footer {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', sans-serif;
}

/* 确保FontAwesome图标正确显示 */
.fas, .fab {
  font-family: "Font Awesome 6 Free", "Font Awesome 6 Brands";
}
</style>