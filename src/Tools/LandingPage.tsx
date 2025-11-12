import React, { useState } from 'react';
import './LandingPage.css';
import Header from './Header';
import Footer from './Footer';
import aiscanImage from './aiscan.png';
import eoriImage from './eori.png';
import freeImage from './free.png';
// 导入Arco Design组件和图标
import { Form, Input, Button, Message } from '@arco-design/web-react';
import { IconCode, IconThunderbolt, IconCustomerService, IconMessage, IconUser, IconFile, IconCheck } from '@arco-design/web-react/icon';

/**
 * ICS2服务落地页组件
 * @description 展示ICS2发送服务的主要功能和优势
 * @author AI Assistant
 * @date 2024-01-15
 */
const LandingPage: React.FC = () => {
  // 表单状态管理
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  /**
   * 处理表单提交
   * @param values 表单数据
   */
  const handleSubmit = async (values: any) => {
    setLoading(true);
    try {
      // 验证手机号和邮箱至少填写一个
      if (!values.phone && !values.email) {
        Message.error('请至少填写手机号或邮箱其中一项');
        return;
      }
      
      // 这里可以添加实际的提交逻辑
      console.log('提交的表单数据:', values);
      Message.success('提交成功！我们会尽快与您联系');
      form.resetFields();
    } catch (error) {
      Message.error('提交失败，请稍后重试');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="landing-page">
      {/* WallTech Header */}
      <Header />
      {/* 主要横幅区域 */}
      <section className="hero-section">
        <div className="hero-content">
          <div className="hero-text">
            <div className="hero-tags">
              <span className="hero-tag">认证IT服务商</span>
              <span className="hero-tag">成本极低</span>
              <span className="hero-tag">专业服务</span>
            </div>
            <h1 style={{color: '#7466F0'}}>ICS2（ENS）申报</h1>
            <h2>WallTech工具化服务新成员</h2>
            <div className="hero-action">
              <button className="hero-button">立即使用</button>
            </div>
          </div>
        </div>
      </section>

      {/* 服务特色区域 */}
      <section className="features-section">
        {/* 特色1: 提供申报人EORI号 */}
        <div className="feature-item">
          <div className="feature-text">
            <h3><IconUser className="feature-icon" />提供申报人EORI号</h3>
            <p>我们为您提供全套完整申报资质，您无需注册新的EORI号码。</p>
          </div>
          <div className="feature-image">
            <img 
              src={eoriImage} 
              alt="EORI Service" 
              width="660" 
              height="460"
            />
          </div>
        </div>

        {/* 特色2: AI识别文档 */}
        <div className="feature-item">
          <div className="feature-text">
            <h3><IconFile className="feature-icon" />AI智能识别文档</h3>
            <p>AI智能识别各类文件（提单、HBL、装箱单......）数据自动匹配导入，免除您手工录入的困扰</p>
          </div>
          <div className="feature-image">
            <img 
              src={aiscanImage} 
              alt="AI Document Recognition" 
              width="660" 
              height="460"
            />
          </div>
        </div>

        {/* 特色3: 免费创建首个ICS2 */}
        <div className="feature-item">
          <div className="feature-text">
            <h3><IconCheck className="feature-icon" />费用月结，首票免费</h3>
            <p>
              无需预充值，您的申报费用可以无门槛月结。<br />
              专业客服，一对一培训，确保您熟练掌握各类申报要求。
            </p>
          </div>
          <div className="feature-image">
            <img 
              src={freeImage} 
              alt="Free Trial" 
              width="660" 
              height="460"
            />
          </div>
        </div>
      </section>

      {/* 专业团队支持区域 */}
      <section className="support-section">
        <h2>专业团队提供全流程支持</h2>
        <div className="support-grid">
          {/* 支持项1 */}
          <div className="support-item">
            <div className="support-icon">
              <IconCode style={{ fontSize: '48px', color: '#7466F0' }} />
            </div>
            <div className="support-content">
              <h4>提供资质 通道稳定</h4>
              <p>提供全套资质，发送0门槛</p>
            </div>
          </div>

          {/* 支持项2 */}
          <div className="support-item">
            <div className="support-icon">
              <IconThunderbolt style={{ fontSize: '48px', color: '#7466F0' }} />
            </div>
            <div className="support-content">
              <h4>全程服务保障</h4>
              <p>异常情况全程跟进，服务有保障</p>
            </div>
          </div>

          {/* 支持项3 */}
          <div className="support-item">
            <div className="support-icon">
              <IconCustomerService style={{ fontSize: '48px', color: '#7466F0' }} />
            </div>
            <div className="support-content">
              <h4>金牌客服答疑</h4>
              <p>专业客服全年9:30-21:00在线答疑</p>
            </div>
          </div>

          {/* 支持项4 */}
          <div className="support-item">
            <div className="support-icon">
              <IconMessage style={{ fontSize: '48px', color: '#7466F0' }} />
            </div>
            <div className="support-content">
              <h4>沟通高效敏捷</h4>
              <p>告别时差限制，全程中文沟通</p>
            </div>
          </div>
        </div>
      </section>

      {/* 3步开始流程区域 */}
      <section className="steps-section">
        <h2>3步开始</h2>
        <div className="steps-grid">
          {/* 步骤1 - 合并注册和企业认证 */}
          <div className="step-item">
            <div className="step-image">
              <IconUser style={{ fontSize: '48px', color: '#7466F0' }} />
            </div>
            <div className="step-content">
              <h4>注册认证</h4>
              <p>免费注册账号，提交企业认证</p>
            </div>
          </div>

          {/* 步骤2 - 原步骤3 */}
          <div className="step-item">
            <div className="step-image">
              <IconFile style={{ fontSize: '48px', color: '#A891FF' }} />
            </div>
            <div className="step-content">
              <h4>服务协议</h4>
              <p>上传签名盖章的服务协议</p>
            </div>
          </div>

          {/* 步骤3 - 原步骤4 */}
          <div className="step-item">
            <div className="step-image">
              <IconCheck style={{ fontSize: '48px', color: '#7466F0' }} />
            </div>
            <div className="step-content">
              <h4>全部完成！欢迎！</h4>
              <p>请等待客服完成审核</p>
            </div>
          </div>
        </div>
      </section>

      {/* 留资区域 */}
      <section className="contact-form-section">
        <div className="contact-form-container">
          <div className="contact-form-header">
            <h3>立即获取服务</h3>
            <p>填写您的联系信息，我们将为您提供专业的ICS2申报服务</p>
          </div>
          <Form
             form={form}
             layout="horizontal"
             onSubmit={handleSubmit}
             className="contact-form"
           >
            <div className="form-row">
              <Form.Item
                field="phone"
                label="手机号"
                className="form-item"
                rules={[
                  {
                    validator: (value, callback) => {
                      const email = form.getFieldValue('email');
                      if (!value && !email) {
                        callback('请至少填写手机号或邮箱其中一项');
                      } else if (value && !/^1[3-9]\d{9}$/.test(value)) {
                        callback('请输入正确的手机号格式');
                      } else {
                        callback();
                      }
                    }
                  }
                ]}
              >
                <Input placeholder="请输入您的手机号" />
              </Form.Item>

              <Form.Item
                field="email"
                label="邮箱"
                className="form-item"
                rules={[
                  {
                    validator: (value, callback) => {
                      const phone = form.getFieldValue('phone');
                      if (!value && !phone) {
                        callback('请至少填写手机号或邮箱其中一项');
                      } else if (value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
                        callback('请输入正确的邮箱格式');
                      } else {
                        callback();
                      }
                    }
                  }
                ]}
              >
                <Input placeholder="请输入您的邮箱" />
              </Form.Item>

              <Form.Item
                field="company"
                label="公司"
                className="form-item"
              >
                <Input placeholder="请输入您的公司" />
              </Form.Item>

              <div className="form-submit">
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={loading}
                  size="large"
                  className="submit-button"
                >
                  立即提交
                </Button>
              </div>
            </div>
          </Form>
        </div>
      </section>
      
      {/* WallTech Footer */}
      <Footer />
    </div>
  );
};

export default LandingPage;