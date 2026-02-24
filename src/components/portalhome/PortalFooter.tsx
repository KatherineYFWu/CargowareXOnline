import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faWeixin, 
  faTiktok, 
  faFacebook, 
  faInstagram, 
  faYoutube, 
  faLinkedin, 
  faXTwitter 
} from '@fortawesome/free-brands-svg-icons';
import { faBookOpen } from '@fortawesome/free-solid-svg-icons';

const PortalFooter = () => {
  const navigate = useNavigate();
  const [hoveredSocial, setHoveredSocial] = useState<string | null>(null);

  const footerLinks = [
    {
      title: 'Products',
      links: [
        { label: 'Control Tower', href: '/portal/auth', onClick: () => navigate('/portal/auth') },
        { label: 'Super Rates', href: '/portal/auth', onClick: () => navigate('/portal/auth') }
      ]
    },
    {
      title: 'Solutions',
      links: [
        { label: 'Ocean Freight', href: '#' },
        { label: 'Air Freight', href: '#' },
        { label: 'Warehousing', href: '#' },
        { label: 'Customs Services', href: '#' }
      ]
    },
    {
      title: 'Company',
      links: [
        { label: 'About Us', href: '/about' },
        { label: 'News Center', href: '/portal/news', onClick: () => navigate('/portal/news') },
        { label: 'Contact Us', href: '#' },
        { label: 'Staff Login', href: '/staff/auth', onClick: () => navigate('/staff/auth') }
      ]
    }
  ];

  return (
    <footer className="bg-gray-50 pt-16 pb-8">
      <div className="container-custom">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Company Information */}
          <div className="md:col-span-1">
            <div className="flex items-center mb-4">
              <div className="bg-gradient-to-r from-blue-600 to-blue-400 text-white w-10 h-10 rounded-lg flex items-center justify-center mr-3 relative overflow-hidden shadow-lg">
                <span className="text-xl font-bold">Y</span>
                <div className="absolute bottom-0 right-0 w-3 h-3 bg-white rounded-tl-lg flex items-center justify-center">
                  <span className="text-xs text-blue-600 font-bold">L</span>
                </div>
              </div>
              <div>
                <div className="text-lg font-bold text-gray-800 leading-tight tracking-wide">Your LOGO</div>
              </div>
            </div>
            <p className="text-gray-600 text-sm mb-4">
              Intelligent solutions for global international logistics
            </p>
            <div className="flex space-x-3 flex-wrap gap-y-2">
              {/* WeChat */}
              <div 
                className="relative"
                onMouseEnter={() => setHoveredSocial('wechat')}
                onMouseLeave={() => setHoveredSocial(null)}
              >
                <button className="text-gray-400 hover:text-green-500 transition-colors duration-300" title="WeChat" aria-label="Follow us on WeChat">
                  <FontAwesomeIcon icon={faWeixin} className="h-5 w-5" />
                </button>
                {hoveredSocial === 'wechat' && (
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 bg-white rounded-lg shadow-xl border border-gray-200 p-4 z-50">
                    <div className="text-center">
                      <img 
                        src="/WX20250623-164557@2x.png" 
                        alt="WeChat QR Code" 
                        className="w-32 h-32 mx-auto object-contain rounded-lg"
                      />
                      <p className="text-xs text-gray-600 mt-3">Scan to follow our WeChat official account</p>
                    </div>
                    <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-white"></div>
                  </div>
                )}
              </div>

              {/* Douyin/TikTok */}
              <div 
                className="relative"
                onMouseEnter={() => setHoveredSocial('tiktok')}
                onMouseLeave={() => setHoveredSocial(null)}
              >
                <button className="text-gray-400 hover:text-pink-500 transition-colors duration-300" title="Douyin/TikTok" aria-label="Follow us on Douyin">
                  <FontAwesomeIcon icon={faTiktok} className="h-5 w-5" />
                </button>
                {hoveredSocial === 'tiktok' && (
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 bg-white rounded-lg shadow-xl border border-gray-200 p-4 z-50">
                    <div className="text-center">
                      <img 
                        src="/assets/qrcodes/douyin-qr.svg" 
                        alt="Douyin QR Code" 
                        className="w-32 h-32 mx-auto object-contain rounded-lg"
                      />
                      <p className="text-xs text-gray-600 mt-3">Scan to follow our Douyin account</p>
                    </div>
                    <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-white"></div>
                  </div>
                )}
              </div>

              {/* Xiaohongshu */}
              <div 
                className="relative"
                onMouseEnter={() => setHoveredSocial('xiaohongshu')}
                onMouseLeave={() => setHoveredSocial(null)}
              >
                <button className="text-gray-400 hover:text-red-500 transition-colors duration-300" title="Xiaohongshu" aria-label="Follow us on Xiaohongshu">
                  <FontAwesomeIcon icon={faBookOpen} className="h-5 w-5" />
                </button>
                {hoveredSocial === 'xiaohongshu' && (
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 bg-white rounded-lg shadow-xl border border-gray-200 p-4 z-50">
                    <div className="text-center">
                      <img 
                        src="/assets/qrcodes/xiaohongshu-qr.svg" 
                        alt="Xiaohongshu QR Code" 
                        className="w-32 h-32 mx-auto object-contain rounded-lg"
                      />
                      <p className="text-xs text-gray-600 mt-3">Scan to follow our Xiaohongshu account</p>
                    </div>
                    <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-white"></div>
                  </div>
                )}
              </div>

              {/* Facebook */}
              <div className="relative">
                <a 
                  href="https://facebook.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-blue-600 transition-colors duration-300" 
                  title="Facebook" 
                  aria-label="Follow us on Facebook"
                >
                  <FontAwesomeIcon icon={faFacebook} className="h-5 w-5" />
                </a>
              </div>

              {/* Instagram */}
              <div className="relative">
                <a 
                  href="https://instagram.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-pink-600 transition-colors duration-300" 
                  title="Instagram" 
                  aria-label="Follow us on Instagram"
                >
                  <FontAwesomeIcon icon={faInstagram} className="h-5 w-5" />
                </a>
              </div>

              {/* YouTube */}
              <div className="relative">
                <a 
                  href="https://youtube.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-red-600 transition-colors duration-300" 
                  title="YouTube" 
                  aria-label="Follow us on YouTube"
                >
                  <FontAwesomeIcon icon={faYoutube} className="h-5 w-5" />
                </a>
              </div>

              {/* LinkedIn */}
              <div className="relative">
                <a 
                  href="https://linkedin.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-blue-700 transition-colors duration-300" 
                  title="LinkedIn" 
                  aria-label="Follow us on LinkedIn"
                >
                  <FontAwesomeIcon icon={faLinkedin} className="h-5 w-5" />
                </a>
              </div>

              {/* X (Twitter) */}
              <div className="relative">
                <a 
                  href="https://x.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-black transition-colors duration-300" 
                  title="X (Twitter)" 
                  aria-label="Follow us on X"
                >
                  <FontAwesomeIcon icon={faXTwitter} className="h-5 w-5" />
                </a>
              </div>
            </div>
          </div>

          {/* Link Lists */}
          {footerLinks.map((column, index) => (
            <div key={index} className="md:col-span-1">
              <h3 className="text-gray-800 font-semibold mb-4">{column.title}</h3>
              <ul className="space-y-2">
                {column.links.map((link, linkIndex) => (
                  <li key={linkIndex}>
                    {link.onClick ? (
                      <button
                        onClick={link.onClick}
                        className="text-gray-600 hover:text-primary text-sm text-left"
                      >
                        {link.label}
                      </button>
                    ) : (
                      <a href={link.href} className="text-gray-600 hover:text-primary text-sm">
                        {link.label}
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Copyright */}
        <div className="pt-8 border-t border-gray-200">
          <div className="flex flex-col md:flex-row justify-between items-center mb-4">
            <p className="text-gray-500 text-sm">
              © 2025 WallTech. All rights reserved.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="/privacy" className="text-gray-500 hover:text-primary text-sm">Privacy Policy</a>
              <a href="/terms" className="text-gray-500 hover:text-primary text-sm">Terms of Service</a>
              <a href="/cookie-settings" className="text-gray-500 hover:text-primary text-sm">Cookie Settings</a>
            </div>
          </div>

          {/* Filing Information */}
          <div className="flex flex-col md:flex-row justify-center items-center space-y-2 md:space-y-0 md:space-x-4 text-xs text-gray-400">
            <a
              href="https://beian.miit.gov.cn/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center hover:text-primary transition-colors duration-300"
            >
              <span>沪ICP备20230512号-1</span>
            </a>
            <a
              href="http://www.beian.gov.cn/portal/registerSystemInfo"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center hover:text-primary transition-colors duration-300"
            >
              <img
                src="/gongan.png"
                alt="Public Security Filing Icon"
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

export default PortalFooter;