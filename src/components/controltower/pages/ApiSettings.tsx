import React, { useState } from 'react';
import { 
  Card, 
  Form, 
  Input, 
  Button, 
  Space, 
  Grid,
  Modal,
  Message,
  Radio,
  Tabs
} from '@arco-design/web-react';
import { IconEye, IconRefresh } from '@arco-design/web-react/icon';

const { Row, Col } = Grid;

/**
 * API设置页面组件
 * 提供API相关的配置和管理功能
 */
const ApiSettings: React.FC = () => {
  // Tab状态管理
  const [activeTab, setActiveTab] = useState('prod');
  
  // const [form] = Form.useForm();
  const [ipFormProd] = Form.useForm();
  const [ipFormTest] = Form.useForm();
  // const [loading, setLoading] = useState(false);
  const [ipLoadingProd, setIpLoadingProd] = useState(false);
  const [ipLoadingTest, setIpLoadingTest] = useState(false);
  // 生产环境状态
  const [showSKProd, setShowSKProd] = useState(false);
  const [resetModalVisibleProd, setResetModalVisibleProd] = useState(false);
  const [resetSuccessModalVisibleProd, setResetSuccessModalVisibleProd] = useState(false);
  const [verificationCodeProd, setVerificationCodeProd] = useState('');
  const [sendingCodeProd, setSendingCodeProd] = useState(false);
  const [verificationMethodProd, setVerificationMethodProd] = useState('phone'); // 'phone' or 'email'
  const [newSecretKeyProd, setNewSecretKeyProd] = useState('');
  const [newAccessKeyProd, setNewAccessKeyProd] = useState('');

  // 测试环境状态
  const [showSKTest, setShowSKTest] = useState(false);
  const [resetModalVisibleTest, setResetModalVisibleTest] = useState(false);
  const [resetSuccessModalVisibleTest, setResetSuccessModalVisibleTest] = useState(false);
  const [verificationCodeTest, setVerificationCodeTest] = useState('');
  const [sendingCodeTest, setSendingCodeTest] = useState(false);
  const [verificationMethodTest, setVerificationMethodTest] = useState('phone'); // 'phone' or 'email'
  const [newSecretKeyTest, setNewSecretKeyTest] = useState('');
  const [newAccessKeyTest, setNewAccessKeyTest] = useState('');

  // 模拟的AK/SK数据 - 生产环境
  const [akskDataProd] = useState({
    accessKey: 'AKIAIOSFODNN7EXAMPLE',
    secretKey: 'wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY'
  });

  // 模拟的AK/SK数据 - 测试环境
  const [akskDataTest] = useState({
    accessKey: 'AKIAIOSFODNN7TESTEXAMPLE',
    secretKey: 'wJalrXUtnFEMI/K7MDENG/bPxRfiCYTESTEXAMPLEKEY'
  });

  // 模拟的联系方式数据
  const contactInfo = {
    phone: '138****8888',
    email: 'user****@example.com'
  };

  /**
   * 查看生产环境SK
   */
  const handleViewSKProd = () => {
    setShowSKProd(!showSKProd);
  };

  /**
   * 查看测试环境SK
   */
  const handleViewSKTest = () => {
    setShowSKTest(!showSKTest);
  };

  /**
   * 发送生产环境验证码
   */
  const handleSendVerificationCodeProd = async () => {
    setSendingCodeProd(true);
    try {
      // 模拟发送验证码
      await new Promise(resolve => setTimeout(resolve, 1000));
      const target = verificationMethodProd === 'phone' ? '手机' : '邮箱';
      Message.success(`验证码已发送到您的${target}`);
    } catch (error) {
      Message.error('发送验证码失败');
    } finally {
      setSendingCodeProd(false);
    }
  };

  /**
   * 发送测试环境验证码
   */
  const handleSendVerificationCodeTest = async () => {
    setSendingCodeTest(true);
    try {
      // 模拟发送验证码
      await new Promise(resolve => setTimeout(resolve, 1000));
      const target = verificationMethodTest === 'phone' ? '手机' : '邮箱';
      Message.success(`验证码已发送到您的${target}`);
    } catch (error) {
      Message.error('发送验证码失败');
    } finally {
      setSendingCodeTest(false);
    }
  };

  /**
   * 重置生产环境AK/SK
   */
  const handleResetProd = async () => {
    if (!verificationCodeProd) {
      Message.error('请输入验证码');
      return;
    }
    
    try {
      // 模拟验证码验证和重置
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // 生成新的AK和SK
      const newAK = 'AKIAIOSFODNN7PROD' + Math.random().toString(36).substring(2, 8).toUpperCase();
      const newSK = 'wJalrXUtnFEMI/K7MDENG/bPxRfiCYPROD' + Math.random().toString(36).substring(2, 8);
      setNewAccessKeyProd(newAK);
      setNewSecretKeyProd(newSK);
      
      // 关闭重置弹窗，显示成功弹窗
      setResetModalVisibleProd(false);
      setVerificationCodeProd('');
      setResetSuccessModalVisibleProd(true);
    } catch (error) {
      Message.error('重置失败');
    }
  };

  /**
   * 重置测试环境AK/SK
   */
  const handleResetTest = async () => {
    if (!verificationCodeTest) {
      Message.error('请输入验证码');
      return;
    }
    
    try {
      // 模拟验证码验证和重置
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // 生成新的AK和SK
      const newAK = 'AKIAIOSFODNN7TEST' + Math.random().toString(36).substring(2, 8).toUpperCase();
      const newSK = 'wJalrXUtnFEMI/K7MDENG/bPxRfiCYTEST' + Math.random().toString(36).substring(2, 8);
      setNewAccessKeyTest(newAK);
      setNewSecretKeyTest(newSK);
      
      // 关闭重置弹窗，显示成功弹窗
      setResetModalVisibleTest(false);
      setVerificationCodeTest('');
      setResetSuccessModalVisibleTest(true);
    } catch (error) {
      Message.error('重置失败');
    }
  };



  /**
   * 保存生产环境IP设置
   * @param values 表单值
   */
  const handleSaveIPProd = async (values: any) => {
    setIpLoadingProd(true);
    try {
      console.log('保存生产环境IP设置:', values);
      await new Promise(resolve => setTimeout(resolve, 1000));
      Message.success('生产环境IP设置保存成功');
    } catch (error) {
      console.error('保存失败:', error);
      Message.error('保存失败');
    } finally {
      setIpLoadingProd(false);
    }
  };

  /**
   * 保存测试环境IP设置
   * @param values 表单值
   */
  const handleSaveIPTest = async (values: any) => {
    setIpLoadingTest(true);
    try {
      console.log('保存测试环境IP设置:', values);
      await new Promise(resolve => setTimeout(resolve, 1000));
      Message.success('测试环境IP设置保存成功');
    } catch (error) {
      console.error('保存失败:', error);
      Message.error('保存失败');
    } finally {
      setIpLoadingTest(false);
    }
  };

  /**
   * 渲染生产环境内容
   */
  const renderProdContent = () => (
    <>
      {/* 生产环境安全设置 */}
      <Card 
        title="安全设置"
        style={{ marginBottom: '24px' }}
      >
        <Form layout="vertical">
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="Access Key (AK)">
                <Input 
                  value={akskDataProd.accessKey}
                  readOnly
                  style={{ backgroundColor: '#f5f5f5' }}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Secret Key (SK)">
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Input 
                    value={showSKProd ? akskDataProd.secretKey : '••••••••••••••••••••••••••••••••'}
                    readOnly
                    style={{ backgroundColor: '#f5f5f5', width: '300px' }}
                  />
                  <Button 
                    type="primary"
                    icon={<IconEye />}
                    onClick={handleViewSKProd}
                  >
                    {showSKProd ? '隐藏' : '查看'}
                  </Button>
                  <Button 
                    icon={<IconRefresh />}
                    onClick={() => setResetModalVisibleProd(true)}
                    status="warning"
                  >
                    重置
                  </Button>
                </div>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Card>

      {/* 生产环境IP设置 */}
      <Card 
        title="IP设置"
        style={{ marginBottom: '24px' }}
      >
        <Form
          form={ipFormProd}
          layout="vertical"
          onSubmit={handleSaveIPProd}
        >
          <Form.Item 
            label="白名单IP地址（一行一个）：" 
            field="ipWhitelist"
            extra="请输入需要加入生产环境白名单的IP地址，每行一个IP地址"
          >
            <Input.TextArea 
              rows={8}
              placeholder="192.168.1.1&#10;10.0.0.1&#10;172.16.0.1"
            />
          </Form.Item>

          <div style={{ textAlign: 'left' }}>
            <Button 
              type="primary" 
              htmlType="submit"
              loading={ipLoadingProd}
            >
              保存生产环境IP设置
            </Button>
          </div>
        </Form>
      </Card>
    </>
  );

  /**
   * 渲染测试环境内容
   */
  const renderTestContent = () => (
    <>
      {/* 测试环境安全设置 */}
      <Card 
        title="安全设置"
        style={{ marginBottom: '24px' }}
      >
        <Form layout="vertical">
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="Access Key (AK)">
                <Input 
                  value={akskDataTest.accessKey}
                  readOnly
                  style={{ backgroundColor: '#f5f5f5' }}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Secret Key (SK)">
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Input 
                    value={showSKTest ? akskDataTest.secretKey : '••••••••••••••••••••••••••••••••'}
                    readOnly
                    style={{ backgroundColor: '#f5f5f5', width: '300px' }}
                  />
                  <Button 
                    type="primary"
                    icon={<IconEye />}
                    onClick={handleViewSKTest}
                  >
                    {showSKTest ? '隐藏' : '查看'}
                  </Button>
                  <Button 
                    icon={<IconRefresh />}
                    onClick={() => setResetModalVisibleTest(true)}
                    status="warning"
                  >
                    重置
                  </Button>
                </div>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Card>

      {/* 测试环境IP设置 */}
      <Card 
        title="IP设置"
        style={{ marginBottom: '24px' }}
      >
        <Form
          form={ipFormTest}
          layout="vertical"
          onSubmit={handleSaveIPTest}
        >
          <Form.Item 
            label="白名单IP地址（一行一个）：" 
            field="ipWhitelist"
            extra="请输入需要加入测试环境白名单的IP地址，每行一个IP地址"
          >
            <Input.TextArea 
              rows={8}
              placeholder="192.168.1.1&#10;10.0.0.1&#10;172.16.0.1"
            />
          </Form.Item>

          <div style={{ textAlign: 'left' }}>
            <Button 
              type="primary" 
              htmlType="submit"
              loading={ipLoadingTest}
            >
              保存测试环境IP设置
            </Button>
          </div>
        </Form>
      </Card>
    </>
  );

  return (
    <div className="api-settings">
      <Tabs 
         activeTab={activeTab} 
         onChange={setActiveTab}
         type="line"
       >
         <Tabs.TabPane key="prod" title="生产环境">
           {renderProdContent()}
         </Tabs.TabPane>

         <Tabs.TabPane key="test" title="测试环境">
           {renderTestContent()}
         </Tabs.TabPane>
       </Tabs>

      {/* 生产环境重置AK/SK模态框 */}
      <Modal
        title="重置生产环境AK/SK"
        visible={resetModalVisibleProd}
        onCancel={() => {
          setResetModalVisibleProd(false);
          setVerificationCodeProd('');
        }}
        footer={[
          <Button key="cancel" onClick={() => setResetModalVisibleProd(false)}>
            取消
          </Button>,
          <Button 
            key="confirm" 
            type="primary" 
            onClick={handleResetProd}
            loading={sendingCodeProd}
          >
            确认重置
          </Button>
        ]}
      >
        <div style={{ marginBottom: '16px' }}>
          <p>重置后将生成新的生产环境AK/SK，原有的AK/SK将失效。请选择接收验证码的方式：</p>
        </div>
        
        <Space direction="vertical" style={{ width: '100%' }}>
          <div>
            <Radio.Group 
              value={verificationMethodProd} 
              onChange={setVerificationMethodProd}
              style={{ marginBottom: '16px' }}
            >
              <Radio value="phone">手机号接收</Radio>
              <Radio value="email">邮箱接收</Radio>
            </Radio.Group>
          </div>
          
          <div>
            <Input
              placeholder={verificationMethodProd === 'phone' ? '手机号' : '邮箱'}
              value={verificationMethodProd === 'phone' ? contactInfo.phone : contactInfo.email}
              disabled
              style={{ width: '200px', marginRight: '8px', backgroundColor: '#f5f5f5' }}
            />
          </div>
          
          <div>
            <Input
              placeholder="请输入验证码"
              value={verificationCodeProd}
              onChange={setVerificationCodeProd}
              style={{ width: '200px', marginRight: '8px' }}
            />
            <Button 
              onClick={handleSendVerificationCodeProd}
              loading={sendingCodeProd}
            >
              发送验证码
            </Button>
          </div>
        </Space>
      </Modal>

      {/* 测试环境重置AK/SK模态框 */}
      <Modal
        title="重置测试环境AK/SK"
        visible={resetModalVisibleTest}
        onCancel={() => {
          setResetModalVisibleTest(false);
          setVerificationCodeTest('');
        }}
        footer={[
          <Button key="cancel" onClick={() => setResetModalVisibleTest(false)}>
            取消
          </Button>,
          <Button 
            key="confirm" 
            type="primary" 
            onClick={handleResetTest}
            loading={sendingCodeTest}
          >
            确认重置
          </Button>
        ]}
      >
        <div style={{ marginBottom: '16px' }}>
          <p>重置后将生成新的测试环境AK/SK，原有的AK/SK将失效。请选择接收验证码的方式：</p>
        </div>
        
        <Space direction="vertical" style={{ width: '100%' }}>
          <div>
            <Radio.Group 
              value={verificationMethodTest} 
              onChange={setVerificationMethodTest}
              style={{ marginBottom: '16px' }}
            >
              <Radio value="phone">手机号接收</Radio>
              <Radio value="email">邮箱接收</Radio>
            </Radio.Group>
          </div>
          
          <div>
            <Input
              placeholder={verificationMethodTest === 'phone' ? '手机号' : '邮箱'}
              value={verificationMethodTest === 'phone' ? contactInfo.phone : contactInfo.email}
              disabled
              style={{ width: '200px', marginRight: '8px', backgroundColor: '#f5f5f5' }}
            />
          </div>
          
          <div>
            <Input
              placeholder="请输入验证码"
              value={verificationCodeTest}
              onChange={setVerificationCodeTest}
              style={{ width: '200px', marginRight: '8px' }}
            />
            <Button 
              onClick={handleSendVerificationCodeTest}
              loading={sendingCodeTest}
            >
              发送验证码
            </Button>
          </div>
        </Space>
      </Modal>

      {/* 生产环境重置成功模态框 */}
      <Modal
        title="生产环境重置成功"
        visible={resetSuccessModalVisibleProd}
        onCancel={() => setResetSuccessModalVisibleProd(false)}
        footer={[
          <Button 
            key="confirm" 
            type="primary" 
            onClick={() => setResetSuccessModalVisibleProd(false)}
          >
            我知道了
          </Button>
        ]}
      >
        <div style={{ padding: '16px 0' }}>
          <p style={{ color: '#52c41a', fontWeight: 'bold', marginBottom: '16px' }}>
            重置成功！新的生产环境AK/SK 为：
          </p>
          <div style={{ marginBottom: '12px' }}>
            <p style={{ marginBottom: '8px', fontWeight: 'bold' }}>Access Key (AK):</p>
            <div style={{ 
              backgroundColor: '#f6ffed', 
              border: '1px solid #b7eb8f', 
              padding: '12px', 
              borderRadius: '6px',
              marginBottom: '16px'
            }}>
              <code style={{ color: '#389e0d', fontFamily: 'monospace' }}>
                {newAccessKeyProd}
              </code>
            </div>
          </div>
          <div style={{ marginBottom: '16px' }}>
            <p style={{ marginBottom: '8px', fontWeight: 'bold' }}>Secret Key (SK):</p>
            <div style={{ 
              backgroundColor: '#f6ffed', 
              border: '1px solid #b7eb8f', 
              padding: '12px', 
              borderRadius: '6px'
            }}>
              <code style={{ color: '#389e0d', fontFamily: 'monospace' }}>
                {newSecretKeyProd}
              </code>
            </div>
          </div>
          <p style={{ color: '#ff4d4f', fontWeight: 'bold' }}>
            请妥善保管，绝不可泄露！
          </p>
        </div>
      </Modal>

      {/* 测试环境重置成功模态框 */}
      <Modal
        title="测试环境重置成功"
        visible={resetSuccessModalVisibleTest}
        onCancel={() => setResetSuccessModalVisibleTest(false)}
        footer={[
          <Button 
            key="confirm" 
            type="primary" 
            onClick={() => setResetSuccessModalVisibleTest(false)}
          >
            我知道了
          </Button>
        ]}
      >
        <div style={{ padding: '16px 0' }}>
          <p style={{ color: '#52c41a', fontWeight: 'bold', marginBottom: '16px' }}>
            重置成功！新的测试环境AK/SK 为：
          </p>
          <div style={{ marginBottom: '12px' }}>
            <p style={{ marginBottom: '8px', fontWeight: 'bold' }}>Access Key (AK):</p>
            <div style={{ 
              backgroundColor: '#f6ffed', 
              border: '1px solid #b7eb8f', 
              padding: '12px', 
              borderRadius: '6px',
              marginBottom: '16px'
            }}>
              <code style={{ color: '#389e0d', fontFamily: 'monospace' }}>
                {newAccessKeyTest}
              </code>
            </div>
          </div>
          <div style={{ marginBottom: '16px' }}>
            <p style={{ marginBottom: '8px', fontWeight: 'bold' }}>Secret Key (SK):</p>
            <div style={{ 
              backgroundColor: '#f6ffed', 
              border: '1px solid #b7eb8f', 
              padding: '12px', 
              borderRadius: '6px'
            }}>
              <code style={{ color: '#389e0d', fontFamily: 'monospace' }}>
                {newSecretKeyTest}
              </code>
            </div>
          </div>
          <p style={{ color: '#ff4d4f', fontWeight: 'bold' }}>
            请妥善保管，绝不可泄露！
          </p>
        </div>
      </Modal>
    </div>
  );
};

export default ApiSettings;