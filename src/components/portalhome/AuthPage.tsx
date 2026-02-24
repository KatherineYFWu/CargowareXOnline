import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Input, Form, Message, Modal } from '@arco-design/web-react';
import { IconUser, IconLock, IconEmail, IconPhone, IconArrowLeft, IconEye, IconEyeInvisible } from '@arco-design/web-react/icon';
import { useUser } from './UserContext';
import './PortalStyles.css';

interface LoginFormData {
  account: string; // Email or phone number
  password?: string;
  code?: string;
}

interface RegisterFormData {
  username: string;
  phone: string;
  email?: string;
  password: string;
  confirmPassword: string;
  phoneCode: string;
}

const AuthPage: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [loginType, setLoginType] = useState<'password' | 'code'>('password');
  const [countdown, setCountdown] = useState(0);
  const [userAgreementVisible, setUserAgreementVisible] = useState(false);
  const [privacyPolicyVisible, setPrivacyPolicyVisible] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const [mounted, setMounted] = useState(false);
  const navigate = useNavigate();
  const { login } = useUser();

  const [loginForm] = Form.useForm<LoginFormData>();
  const [registerForm] = Form.useForm<RegisterFormData>();

  useEffect(() => {
    setMounted(true);
  }, []);

  // Mock login
  const handleLogin = async (values: LoginFormData) => {
    console.log('Login form submitted:', values);
    
    // Check if form data is empty
    if (!values || !values.account) {
      console.error('Form data is empty or missing account field');
      Message.error('Please check your input');
      return;
    }
    
    setLoading(true);
    try {
      console.log('Login data:', values);
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Validate dummy account password
      const validAccounts = ['1', 'test@example.com', 'admin', 'test user'];
      const validPasswords = ['1', 'password1', 'password', '123456'];
      
      if (loginType === 'password') {
        if (!validAccounts.includes(values.account) || !validPasswords.includes(values.password || '')) {
          Message.error('Account or password error! Available accounts: 1/test@example.com/admin, passwords: 1/password1/password');
          setLoading(false);
          return;
        }
      } else {
        // Code login mode, only validate account
        if (!validAccounts.includes(values.account)) {
          Message.error('Account error! Available accounts: 1/test@example.com/admin');
          setLoading(false);
          return;
        }
      }
      
      // Generate user data based on login account
      let userData;
      if (values.account === 'test@example.com') {
        userData = {
          id: 'user_001',
          username: 'Test User',
          email: 'test@example.com',
          phone: '13800138000',
        };
      } else if (values.account === 'admin') {
        userData = {
          id: 'user_002',
          username: 'Admin',
          email: 'admin@example.com',
          phone: '13900139000',
        };
      } else if (values.account === '1') {
        userData = {
          id: 'user_003',
          username: 'User 1',
          email: 'user1@example.com',
          phone: '13700137000',
        };
      } else {
        userData = {
          id: 'user_004',
          username: values.account,
          email: values.account.includes('@') ? values.account : undefined,
          phone: !values.account.includes('@') ? values.account : undefined,
        };
      }
      
      // Save user login status
      login(userData);
      
      Message.success('Login successful! Welcome back 🎉');
      
      // Ensure navigation after state update
      setTimeout(() => {
        navigate('/portal');
      }, 100);
      
    } catch (error) {
      console.error('Login error:', error);
      Message.error('Login failed, please try again');
    } finally {
      setLoading(false);
    }
  };

  // Mock registration
  const handleRegister = async (values: RegisterFormData) => {
    setLoading(true);
    try {
      console.log('Registration data:', values);
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock user data
      const userData = {
        id: 'user_' + Date.now(),
        username: values.username,
        email: values.email,
        phone: values.phone,
      };
      
      // Save user login status
      login(userData);
      
      Message.success('Registration successful! Welcome to join us 🌟');
      navigate('/portal');
    } catch (error) {
      Message.error('Registration failed, please try again');
    } finally {
      setLoading(false);
    }
  };

  // Send verification code
  const handleSendCode = (formType: 'login' | 'register') => {
    if (countdown > 0) return;
    
    let account: string = '';
    if (formType === 'login') {
      account = loginForm.getFieldValue('account') || '';
      if (!account) {
        Message.error('Please enter phone number or email first');
        return;
      }
    } else {
      account = registerForm.getFieldValue('phone') || '';
      if (!account) {
        Message.error('Please enter phone number first');
        return;
      }
    }
    
    Message.success('Verification code sent 📱');
    
    // Start countdown
    setCountdown(60);
    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  // Return to Portal homepage
  const handleBackToPortal = () => {
    navigate('/portal');
  };

  return (
    <div className="min-h-screen relative overflow-hidden auth-container">
      {/* 动态背景 */}
      <div className="fixed inset-0 auth-background">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 via-sky-400/20 to-blue-300/20"></div>
        <div className="absolute top-0 left-0 w-full h-full">
          {/* 浮动圆球 */}
          <div className="floating-orb orb-1"></div>
          <div className="floating-orb orb-2"></div>
          <div className="floating-orb orb-3"></div>
          <div className="floating-orb orb-4"></div>
          <div className="floating-orb orb-5"></div>
        </div>
        {/* 网格背景 */}
        <div className="absolute inset-0 grid-background"></div>
      </div>

      {/* Return to homepage button */}
      <div className="absolute top-8 left-8 z-50">
        <button 
          onClick={handleBackToPortal}
          className="group flex items-center space-x-2 px-4 py-2 bg-white/10 backdrop-blur-md rounded-full border border-blue-800/30 text-blue-800 hover:bg-white/20 hover:border-blue-800/50 transition-all duration-300 hover:scale-105"
        >
          <IconArrowLeft className="text-lg group-hover:-translate-x-1 transition-transform duration-300" />
          <span className="font-medium">Back to Homepage</span>
        </button>
      </div>

      {/* 主内容区域 */}
      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        <div className={`w-full max-w-4xl transition-all duration-1000 ${mounted ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
          
          {/* Logo区域 */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-6">
              <div className="relative">
                <div className="logo-container group">
                  <div className="logo-inner">
                    <span className="text-3xl font-black">🚢</span>
                  </div>
                  <div className="logo-glow"></div>
                </div>
              </div>
            </div>
            <h1 className="text-3xl font-black text-blue-900 mb-3 tracking-tight">
              <span className="bg-gradient-to-r from-blue-900 via-blue-800 to-blue-700 bg-clip-text text-transparent">
                Smart Logistics Platform
              </span>
            </h1>
            <p className="text-blue-800 text-lg font-medium">
              Make international logistics easier
            </p>
          </div>

          {/* 主卡片 */}
          <div className="auth-main-card-wide">
            {/* 登录页面 */}
            {isLogin ? (
              <div className="auth-content-grid">
                {/* 左侧内容 */}
                <div className="auth-left-section">
                  <div className="mb-8">
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">Welcome back</h2>
                  <p className="text-gray-500">Log in to your account to continue using smart logistics services</p>
                  </div>

                  {/* Login method switching */}
                  <div className="auth-tab-container mb-6">
                    <button
                      className={`auth-tab ${loginType === 'password' ? 'active' : ''}`}
                      onClick={() => setLoginType('password')}
                    >
                      <span>Password Login</span>
                    </button>
                    <button
                      className={`auth-tab ${loginType === 'code' ? 'active' : ''}`}
                      onClick={() => setLoginType('code')}
                    >
                      <span>Code Login</span>
                    </button>
                  </div>

                  <Form
                    form={loginForm}
                    layout="vertical"
                    onSubmit={handleLogin}
                    className="space-y-4"
                    validateTrigger="onSubmit"
                  >
                    <Form.Item
                      field="account"
                      label={
                        <span className="text-gray-700 font-semibold">
                          {loginType === 'password' ? 'Email or Phone Number' : 'Phone Number or Email'}
                        </span>
                      }
                      rules={[{ required: true, message: 'Please enter account information' }]}
                      validateTrigger="onBlur"
                    >
                        <Input
                          placeholder={loginType === 'password' ? 'Please enter email or phone number' : 'Please enter phone number or email'}
                          size="large"
                          className="auth-input-field"
                        prefix={<IconUser className="auth-input-icon" />}
                        />
                    </Form.Item>

                    {loginType === 'password' ? (
                      <Form.Item
                        field="password"
                        label={<span className="text-gray-700 font-semibold">Password</span>}
                        rules={[{ required: true, message: 'Please enter password' }]}
                        validateTrigger="onBlur"
                      >
                          <Input
                            type={passwordVisible ? 'text' : 'password'}
                            placeholder="Please enter password"
                            size="large"
                            className="auth-input-field"
                          prefix={<IconLock className="auth-input-icon" />}
                            suffix={
                              <button
                                type="button"
                                onClick={() => setPasswordVisible(!passwordVisible)}
                                className="text-gray-400 hover:text-gray-600 transition-colors"
                              >
                                {passwordVisible ? <IconEyeInvisible /> : <IconEye />}
                              </button>
                            }
                          />
                      </Form.Item>
                    ) : (
                      <Form.Item
                        field="code"
                        label={<span className="text-gray-700 font-semibold">Verification Code</span>}
                        rules={[{ required: true, message: 'Please enter verification code' }]}
                        validateTrigger="onBlur"
                      >
                        <div className="flex space-x-3">
                            <Input
                              placeholder="Please enter verification code"
                              size="large"
                            className="auth-input-field flex-1"
                            />
                          <button
                            type="button"
                            disabled={countdown > 0}
                            onClick={() => handleSendCode('login')}
                            className="auth-code-button"
                          >
                            {countdown > 0 ? `${countdown}s` : 'Send Code'}
                          </button>
                        </div>
                      </Form.Item>
                    )}

                    {loginType === 'password' && (
                      <div className="flex justify-between items-center mb-4">
                        <label className="flex items-center text-gray-600 cursor-pointer">
                          <input type="checkbox" className="auth-checkbox" />
                          <span className="ml-3">Remember me</span>
                        </label>
                        <button type="button" className="text-blue-600 hover:text-blue-700 font-medium">
                          Forgot password?
                        </button>
                      </div>
                    )}

                    <Button
                      type="primary"
                      htmlType="submit"
                      size="large"
                      loading={loading}
                      className="auth-submit-button"
                    >
                      {loading ? 'Logging in...' : 'Log In Now'}
                    </Button>
                  </Form>
                </div>

                {/* 右侧装饰 */}
                <div className="auth-right-section">
                  <div className="auth-decoration">
                    <div className="decoration-icon">
                      <span className="text-6xl">🌏</span>
                    </div>
                    <h3 className="text-xl font-bold text-gray-700 mb-2">全球物流网络</h3>
                    <p className="text-gray-500 text-center leading-relaxed">
                      连接全球港口，提供端到端的物流解决方案
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              /* 注册页面 */
              <div className="auth-content-grid">
                {/* 左侧内容 */}
                <div className="auth-left-section">
                  <div className="mb-6">
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">创建账户</h2>
                    <p className="text-gray-500">开启您的智慧物流之旅</p>
                  </div>

                  <Form
                    form={registerForm}
                    layout="vertical"
                    onSubmit={handleRegister}
                    className="space-y-4"
                    validateTrigger="onSubmit"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Form.Item
                        field="username"
                        label={<span className="text-gray-700 font-semibold">Username</span>}
                        rules={[{ required: true, message: 'Please enter username' }]}
                      >
                          <Input
                            placeholder="Please enter username"
                            size="large"
                            className="auth-input-field"
                          prefix={<IconUser className="auth-input-icon" />}
                          />
                      </Form.Item>

                      <Form.Item
                        field="phone"
                        label={<span className="text-gray-700 font-semibold">Phone Number</span>}
                        rules={[
                          { required: true, message: 'Please enter phone number' },
                          {
                            validator: (value, callback) => {
                              if (value && !/^1[3-9]\d{9}$/.test(value)) {
                                callback('Please enter a valid phone number');
                              } else {
                                callback();
                              }
                            }
                          }
                        ]}
                      >
                          <Input
                            placeholder="Please enter phone number"
                            size="large"
                            className="auth-input-field"
                          prefix={<IconPhone className="auth-input-icon" />}
                          />
                      </Form.Item>
                    </div>

                    <Form.Item
                      field="phoneCode"
                      label={<span className="text-gray-700 font-semibold">Phone Verification Code</span>}
                      rules={[{ required: true, message: 'Please enter phone verification code' }]}
                    >
                      <div className="flex space-x-3">
                        <div className="auth-input-container flex-1">
                          <Input
                            placeholder="Please enter verification code"
                            size="large"
                            className="auth-input-field"
                          />
                        </div>
                        <button
                          type="button"
                          disabled={countdown > 0}
                          onClick={() => handleSendCode('register')}
                          className="auth-code-button"
                        >
                          {countdown > 0 ? `${countdown}s` : 'Send Code'}
                        </button>
                      </div>
                    </Form.Item>

                    <Form.Item
                      field="email"
                      label={<span className="text-gray-700 font-semibold">Email (Optional)</span>}
                      rules={[
                        { 
                          type: 'email', 
                          message: 'Please enter a valid email format' 
                        }
                      ]}
                    >
                      <div className="auth-input-container">
                        <IconEmail className="auth-input-icon" />
                        <Input
                          placeholder="Please enter email (optional)"
                          size="large"
                          className="auth-input-field"
                        />
                      </div>
                    </Form.Item>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Form.Item
                        field="password"
                        label={<span className="text-gray-700 font-semibold">Set Password</span>}
                        rules={[
                          { required: true, message: 'Please enter password' },
                          { minLength: 6, message: 'Password must be at least 6 characters' }
                        ]}
                      >
                        <div className="auth-input-container">
                          <IconLock className="auth-input-icon" />
                          <Input
                            type={passwordVisible ? 'text' : 'password'}
                            placeholder="At least 6 characters"
                            size="large"
                            className="auth-input-field"
                            suffix={
                              <button
                                type="button"
                                onClick={() => setPasswordVisible(!passwordVisible)}
                                className="text-gray-400 hover:text-gray-600 transition-colors"
                              >
                                {passwordVisible ? <IconEyeInvisible /> : <IconEye />}
                              </button>
                            }
                          />
                        </div>
                      </Form.Item>

                      <Form.Item
                        field="confirmPassword"
                        label={<span className="text-gray-700 font-semibold">Confirm Password</span>}
                        rules={[
                          { required: true, message: 'Please confirm password' },
                          {
                            validator: (value, callback) => {
                              const password = registerForm.getFieldValue('password');
                              if (value && value !== password) {
                                callback('Passwords do not match');
                              } else {
                                callback();
                              }
                            }
                          }
                        ]}
                      >
                        <div className="auth-input-container">
                          <IconLock className="auth-input-icon" />
                          <Input
                            type={confirmPasswordVisible ? 'text' : 'password'}
                            placeholder="Enter password again"
                            size="large"
                            className="auth-input-field"
                            suffix={
                              <button
                                type="button"
                                onClick={() => setConfirmPasswordVisible(!confirmPasswordVisible)}
                                className="text-gray-400 hover:text-gray-600 transition-colors"
                              >
                                {confirmPasswordVisible ? <IconEyeInvisible /> : <IconEye />}
                              </button>
                            }
                          />
                        </div>
                      </Form.Item>
                    </div>

                    <div className="mb-6">
                      <label className="flex items-start text-gray-600 cursor-pointer">
                        <input type="checkbox" className="auth-checkbox mt-1" required />
                        <span className="ml-3 leading-relaxed">
                          I have read and agree to 
                          <button 
                            type="button"
                            className="text-blue-600 hover:text-blue-700 mx-1 underline font-medium"
                            onClick={() => setUserAgreementVisible(true)}
                          >
                            User Agreement
                          </button>
                          and
                          <button 
                            type="button"
                            className="text-blue-600 hover:text-blue-700 mx-1 underline font-medium"
                            onClick={() => setPrivacyPolicyVisible(true)}
                          >
                            Privacy Policy
                          </button>
                        </span>
                      </label>
                    </div>

                    <Button
                      type="primary"
                      htmlType="submit"
                      size="large"
                      loading={loading}
                      className="auth-submit-button"
                    >
                      {loading ? 'Creating...' : 'Create Account'}
                    </Button>
                  </Form>
                </div>

                {/* Right decoration */}
                <div className="auth-right-section">
                  <div className="auth-decoration">
                    <div className="decoration-icon">
                      <span className="text-6xl">📦</span>
                    </div>
                    <h3 className="text-xl font-bold text-gray-700 mb-2">Intelligent Management</h3>
                    <p className="text-gray-500 text-center leading-relaxed">
                      AI-driven smart logistics management system to improve efficiency and reduce costs
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Bottom switching */}
            <div className="auth-footer">
              <p className="text-gray-600 mb-4">
                {isLogin ? 'Don\'t have an account?' : 'Already have an account?'}
              </p>
              <button
                onClick={() => setIsLogin(!isLogin)}
                className="auth-switch-button"
              >
                {isLogin ? 'Register Now' : 'Log In Now'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* User Agreement Modal */}
      <Modal
        title={null}
        visible={userAgreementVisible}
        onCancel={() => setUserAgreementVisible(false)}
        footer={null}
        style={{ width: '800px' }}
        className="modern-modal"
      >
        <div className="modal-header">
          <div className="modal-icon">📜</div>
          <h3 className="text-2xl font-bold text-gray-800">User Agreement</h3>
          <p className="text-gray-500 mt-2">Smart Logistics Platform Service Terms</p>
        </div>
        
        <div className="modal-content">
          <div className="space-y-6 text-gray-700 leading-relaxed">
            <section className="agreement-section">
              <h4 className="section-title">1. Acceptance of Terms</h4>
              <p>Welcome to the Smart Logistics Platform! This agreement is a legal contract between you and this platform regarding the use of logistics services. By registering, accessing, or using this service, you agree to accept all the terms and conditions of this agreement.</p>
            </section>

            <section className="agreement-section">
              <h4 className="section-title">2. Logistics Service Content</h4>
              <p>This platform provides international logistics, freight forwarding, warehousing management, supply chain optimization and other services. The specific functions are subject to the actual provision of the platform. We are committed to providing customers with efficient and safe logistics solutions.</p>
            </section>

            <section className="agreement-section">
              <h4 className="section-title">3. User Obligations and Responsibilities</h4>
              <p>You promise to provide true and accurate cargo information and contact details, and update them in a timely manner. You are responsible for ensuring the legality of the goods, complying with relevant import and export regulations, and cooperating with customs inspections and other related procedures.</p>
            </section>

            <section className="agreement-section">
              <h4 className="section-title">4. Service Fees and Settlement</h4>
              <p>Logistics service fees will be determined based on factors such as cargo weight, volume, transportation distance, and service type. Fee standards are transparent and open, supporting multiple settlement methods to ensure transaction security.</p>
            </section>

            <section className="agreement-section">
              <h4 className="section-title">5. Disclaimer</h4>
              <p>Within the scope permitted by law, the platform shall not be liable for delays or losses caused by force majeure, policy changes, customs detention, and other factors. It is recommended that customers purchase appropriate cargo insurance.</p>
            </section>
          </div>
        </div>

        <div className="modal-footer">
          <Button 
            onClick={() => setUserAgreementVisible(false)} 
            className="modern-button"
            size="large"
          >
            I have read and understand
          </Button>
        </div>
      </Modal>

      {/* Privacy Policy Modal */}
      <Modal
        title={null}
        visible={privacyPolicyVisible}
        onCancel={() => setPrivacyPolicyVisible(false)}
        footer={null}
        style={{ width: '800px' }}
        className="modern-modal"
      >
        <div className="modal-header">
          <div className="modal-icon">🔒</div>
          <h3 className="text-2xl font-bold text-gray-800">Privacy Policy</h3>
          <p className="text-gray-500 mt-2">How We Protect Your Personal Information</p>
        </div>
        
        <div className="modal-content">
          <div className="space-y-6 text-gray-700 leading-relaxed">
            <section className="agreement-section">
              <h4 className="section-title">1. Information Collection and Use</h4>
              <p>We collect your contact information, cargo details, transaction records, etc., to provide logistics services, optimize user experience, and ensure transaction security. All information is strictly confidential and will not be used for other commercial purposes.</p>
            </section>

            <section className="agreement-section">
              <h4 className="section-title">2. Data Security Protection</h4>
              <p>We adopt bank-level data encryption technology, establish multiple security protection systems, and conduct regular security audits to ensure the security of your personal information and transaction data.</p>
            </section>

            <section className="agreement-section">
              <h4 className="section-title">3. Third-Party Cooperation</h4>
              <p>To complete logistics services, we may share necessary information with third-party institutions such as carriers, customs, and ports. All partners have signed confidentiality agreements to ensure information security.</p>
            </section>

            <section className="agreement-section">
              <h4 className="section-title">4. Data Storage and Cross-Border Transmission</h4>
              <p>Your data is mainly stored on secure servers in China. For international logistics business, cross-border data transmission may be involved, and we will comply with relevant laws and regulations.</p>
            </section>

            <section className="agreement-section">
              <h4 className="section-title">5. Your Rights</h4>
              <p>You have the right to access, correct, delete personal information, withdraw consent, and request data portability. If you need to exercise these rights or have any privacy questions, please contact our customer service team.</p>
            </section>
          </div>
        </div>

        <div className="modal-footer">
          <Button 
            onClick={() => setPrivacyPolicyVisible(false)} 
            className="modern-button"
            size="large"
          >
            I have read and understand
          </Button>
        </div>
      </Modal>
    </div>
  );
};

export default AuthPage;