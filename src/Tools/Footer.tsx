import React from 'react';

/**
 * WallTech页面Footer组件
 * @description 从Vue PortalFooter组件转换而来的TSX版本
 * @author AI Assistant
 * @date 2024-01-15
 */
interface FooterProps {
  /** 自定义类名 */
  className?: string;
}

const Footer: React.FC<FooterProps> = ({ className = '' }) => {
  return (
    <footer className={`bg-white pt-16 pb-8 ${className}`}>
      <div className="container mx-auto px-4">
        {/* Logo和搜索框区域 */}
        <div className="flex flex-col md:flex-row justify-between items-start mb-12">
          <div className="flex items-center mb-6 md:mb-0">
            <img 
              src="/assets/WX20250627-182147@2x.png" 
              alt="WallTech (China) Co.,Ltd." 
              className="h-12 w-auto"
            />
          </div>
          <div className="flex items-center bg-gray-50 rounded-lg px-4 py-2 w-full md:w-96">
            <input 
              type="text" 
              placeholder="Search..." 
              className="bg-transparent outline-none flex-1 text-gray-600"
            />
            <button className="text-gray-400 hover:text-blue-600">
              <i className="fas fa-search"></i>
            </button>
          </div>
        </div>

        {/* 主要链接区域 */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8 mb-12">
          {/* 客户和支持 */}
          <div>
            <h3 className="text-gray-800 font-semibold mb-4">客户和支持</h3>
            <ul className="space-y-2">
              <li><a href="https://zh.etowertech.com/etowerb2c-parcel-logistics-management/" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-blue-600 text-sm transition-colors">eTowerB2C</a></li>
              <li><a href="https://zh.etowertech.com/etowerone-integrated-logistics-management/" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-blue-600 text-sm transition-colors">eTowerOne</a></li>
              <li><a href="https://zh.etowertech.com/cargoware-freight-forwarding-management/" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-blue-600 text-sm transition-colors">CargoWare</a></li>
              <li><a href="https://zh.etowertech.com/contact/#contact" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-blue-600 text-sm transition-colors">IT-支持</a></li>
              <li><a href="https://auth.walltechsystem.cn/LoginServlet?ps=eyJyZXR1cm5VcmwiOiJodHRwczpcL1wvY24uZXRvd2VydGVjaC5jb21cL0luZGV4U2VydmxldCIsInNlcnZpY2VDb2RlIjoiUGFyY2VsIiwiYnJhbmQiOiJjbi5ldG93ZXJ0ZWNoLmNvbSIsImxhbmd1YWdlIjoiZW5fVVMifQ==&notifyUrl=https%3A%2F%2Fwww.etowertech.com%2FApi%2FSync%2FloginNotify%3Flogin_flag%3D99134f39-507a-41ea-905e-4f9e74f42d07" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-blue-600 text-sm transition-colors">登录</a></li>
            </ul>
          </div>

          {/* 帮助中心 */}
          <div>
            <h3 className="text-gray-800 font-semibold mb-4">帮助中心</h3>
            <ul className="space-y-2">
              <li><a href="https://zh.etowertech.com/faqs/" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-blue-600 text-sm transition-colors">常见问题</a></li>
              <li><a href="https://zh.etowertech.com/contact/#contact" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-blue-600 text-sm transition-colors">客户服务</a></li>
              <li><a href="https://zh.etowertech.com/privacy-policy.html" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-blue-600 text-sm transition-colors">隐私政策</a></li>
            </ul>
          </div>

          {/* 联系我们 */}
          <div>
            <h3 className="text-gray-800 font-semibold mb-4">联系我们</h3>
            <ul className="space-y-2">
              <li><a href="https://zh.etowertech.com/company-profile/" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-blue-600 text-sm transition-colors">合作</a></li>
              <li><a href="https://zh.etowertech.com/contact/#contact" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-blue-600 text-sm transition-colors">咨询</a></li>
              <li><a href="https://zh.etowertech.com/company-profile/" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-blue-600 text-sm transition-colors">位置</a></li>
            </ul>
          </div>

          {/* 意见和建议 */}
          <div>
            <h3 className="text-gray-800 font-semibold mb-4">意见和建议</h3>
            <ul className="space-y-2">
              <li><a href="https://zh.etowertech.com/contact/#contact" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-blue-600 text-sm transition-colors">评论</a></li>
              <li><a href="https://zh.etowertech.com/contact/#contact" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-blue-600 text-sm transition-colors">建议邮件</a></li>
            </ul>
          </div>

          {/* 合作伙伴评估 */}
          <div>
            <h3 className="text-gray-800 font-semibold mb-4">合作伙伴评估</h3>
            <ul className="space-y-2">
              <li><a href="https://zh.etowertech.com/cooperation-cases/" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-blue-600 text-sm transition-colors">合作伙伴</a></li>
              <li><a href="https://zh.etowertech.com/cooperation-cases/" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-blue-600 text-sm transition-colors">合作案例</a></li>
              <li><a href="https://zh.etowertech.com/cooperation-cases/" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-blue-600 text-sm transition-colors">评价</a></li>
            </ul>
          </div>
        </div>

        {/* 联系信息区域 */}
        <div className="border-t border-gray-200 pt-8 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {/* 电话 */}
            <div className="flex items-center">
              <i className="fas fa-phone text-blue-600 mr-3"></i>
              <a href="tel:400-665-9211" className="text-gray-700 hover:text-blue-600 transition-colors">
                400-665-9211
              </a>
            </div>

            {/* 邮箱 */}
            <div className="flex items-center">
              <i className="fas fa-envelope text-blue-600 mr-3"></i>
              <a href="mailto:etowermkt@walltechsystem.cn" className="text-gray-700 hover:text-blue-600 transition-colors">
                etowermkt@walltechsystem.cn
              </a>
            </div>

            {/* 地址 */}
            <div className="md:col-span-2">
              <div className="flex items-start">
                <i className="fas fa-map-marker-alt text-blue-600 mr-3 mt-1"></i>
                <div className="text-gray-700 text-sm">
                  <div className="mb-1">总部:上海市虹口区周家嘴路669号中垠广场A座9楼</div>
                  <div className="mb-1">华南办事处:深圳市罗湖区笋岗梅园路75号润弘大厦写字楼T2 30楼</div>
                  <div>北京办事处:北京市顺义区旭辉空港中心B座623室</div>
                </div>
              </div>
            </div>
          </div>

          {/* 社交媒体图标 */}
          <div className="flex justify-center space-x-6 mt-8">
            <a href="https://www.linkedin.com/company/etowertech/?viewAsMember=true" 
               target="_blank" 
               rel="noopener noreferrer"
               className="text-gray-400 hover:text-blue-600 transition-colors" 
               title="LinkedIn"
               aria-label="访问我们的LinkedIn主页">
              <i className="fab fa-linkedin text-xl"></i>
            </a>
            <a href="https://www.facebook.com/eTowertech/" 
               target="_blank" 
               rel="noopener noreferrer"
               className="text-gray-400 hover:text-blue-600 transition-colors" 
               title="Facebook"
               aria-label="访问我们的Facebook页面">
              <i className="fab fa-facebook text-xl"></i>
            </a>
            <a href="https://x.com/etowertech" 
               target="_blank" 
               rel="noopener noreferrer"
               className="text-gray-400 hover:text-blue-600 transition-colors" 
               title="X (Twitter)"
               aria-label="访问我们的X账号">
              <i className="fab fa-twitter text-xl"></i>
            </a>
            <a href="https://www.youtube.com/@WallTechSystemLogistics" 
               target="_blank" 
               rel="noopener noreferrer"
               className="text-gray-400 hover:text-blue-600 transition-colors" 
               title="YouTube"
               aria-label="访问我们的YouTube频道">
              <i className="fab fa-youtube text-xl"></i>
            </a>
            <a href="https://affim.baidu.com/unique_23353207/chat?siteId=19529787&userId=23353207&siteToken=79c1c8eec08eed73a1ea37fdf830aad3" 
               target="_blank" 
               rel="noopener noreferrer"
               className="text-gray-400 hover:text-blue-600 transition-colors" 
               title="在线客服"
               aria-label="在线客服">
              <i className="fas fa-comments text-xl"></i>
            </a>
            <a href="https://wa.me/" 
               target="_blank" 
               rel="noopener noreferrer"
               className="text-gray-400 hover:text-blue-600 transition-colors" 
               title="WhatsApp"
               aria-label="通过WhatsApp联系我们">
              <i className="fab fa-whatsapp text-xl"></i>
            </a>
          </div>
        </div>

        {/* 底部版权信息 */}
        <div className="border-t border-gray-200 pt-6">
          <div className="flex flex-col md:flex-row justify-between items-center mb-4">
            <div className="text-center">
              <p className="text-gray-500 text-sm mb-2">
                版权 © <a href="https://zh.etowertech.com/" target="_blank" rel="noopener noreferrer" className="hover:text-blue-600 transition-colors">WallTech (China) Co.,Ltd.</a> 保留所有权利.
              </p>
            </div>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="https://zh.etowertech.com/sitemap.html" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-blue-600 text-sm transition-colors">网站地图</a>
              <a href="https://zh.etowertech.com/privacy-policy.html" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-blue-600 text-sm transition-colors">隐私政策</a>
            </div>
          </div>

          {/* 备案信息 */}
          <div className="flex flex-col md:flex-row justify-center items-center space-y-2 md:space-y-0 md:space-x-4 text-xs text-gray-400">
            <a
              href="https://beian.miit.gov.cn/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center hover:text-blue-600 transition-colors duration-300"
            >
              <span>沪ICP备20230512号-1</span>
            </a>
            <a
              href="http://www.beian.gov.cn/portal/registerSystemInfo"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center hover:text-blue-600 transition-colors duration-300"
            >
              <img
                src="/gongan.png"
                alt="公安备案图标"
                className="h-4 mr-1"
              />
              <span>沪公网安备31010402005432号</span>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;