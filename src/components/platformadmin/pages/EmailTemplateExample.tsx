import React, { useState } from 'react';
import { Card, Tabs, Typography, Space } from '@arco-design/web-react';

const { Title } = Typography;
const TabPane = Tabs.TabPane;

/**
 * 邮件模板样例页面组件
 * 展示各种邮件模板的标题和正文内容
 */
const EmailTemplateExample: React.FC = () => {
  const [activeTab, setActiveTab] = useState('register-code');

  // 邮件模板数据
  const emailTemplates = {
    'register-code': {
      title: '注册验证码',
      subject: '【注册验证码】{{租户名称}} 控制塔系统',
      content: `<div style="margin-bottom: 6px;">
  <strong style="color: #1f2937; font-size: 16px;">尊敬的用户：</strong>
</div>

<div style="margin-bottom: 5px; color: #374151; line-height: 1.3;">
  您好！感谢您注册 <strong style="color: #1e40af;">{{租户名称}} 控制塔系统</strong>。
</div>

<div style="margin: 6px 0; color: #374151;">
  您的注册验证码是：
</div>

<div style="text-align: center; margin: 10px 0;">
  <span style="display: inline-block; background: linear-gradient(135deg, #87ceeb 0%, #ffc0cb 50%, #ffffff 100%); color: #1e40af; padding: 12px 24px; border-radius: 8px; font-size: 24px; font-weight: 700; letter-spacing: 4px; font-family: 'Courier New', monospace; box-shadow: 0 4px 16px rgba(135, 206, 235, 0.2);">123456</span>
</div>

<div style="background: #f8fafc; padding: 10px; border-radius: 6px; margin: 8px 0;">
  <div style="color: #1e40af; font-weight: 600; margin-bottom: 4px;">⏰ 重要提醒</div>
  <div style="color: #64748b; font-size: 14px; line-height: 1.3;">
    • 验证码有效期为 <strong>10分钟</strong>，请及时使用<br>
    • 如果您没有进行注册操作，请忽略此邮件<br>
    • 为了保障您的账户安全，请勿将验证码告知他人
  </div>
</div>

<hr style="border: none; border-top: 1px solid #e5e7eb; margin: 10px 0;">

<div style="color: #6b7280; font-size: 14px; line-height: 1.3;">
  <div style="margin-bottom: 4px;"><strong>此致</strong></div>
  <div style="margin-bottom: 2px;"><strong style="color: #1e40af;">{{租户名称}}</strong></div>
  <div style="margin-bottom: 1px;">📞 客服热线：{{租户个性化设置里设置的客服电话}}</div>
  <div>🌐 官方网站：{{租户独立域名的portal网址}}</div>
</div>`
    },
    'login-code': {
      title: '用户登录验证码',
      subject: '【登录验证码】{{租户名称}} 控制塔系统',
      content: `<div style="margin-bottom: 6px;">
  <strong style="color: #1f2937; font-size: 16px;">尊敬的用户：</strong>
</div>

<div style="margin-bottom: 5px; color: #374151; line-height: 1.3;">
  您好！感谢您登录 <strong style="color: #1e40af;">{{租户名称}} 控制塔系统</strong>。
</div>

<div style="margin: 6px 0; color: #374151;">
  您的登录验证码是：
</div>

<div style="text-align: center; margin: 10px 0;">
  <span style="display: inline-block; background: linear-gradient(135deg, #87ceeb 0%, #ffc0cb 50%, #ffffff 100%); color: #1e40af; padding: 12px 24px; border-radius: 8px; font-size: 24px; font-weight: 700; letter-spacing: 4px; font-family: 'Courier New', monospace; box-shadow: 0 4px 16px rgba(135, 206, 235, 0.2);">123456</span>
</div>

<div style="background: #f8fafc; padding: 10px; border-radius: 6px; margin: 8px 0;">
  <div style="color: #1e40af; font-weight: 600; margin-bottom: 4px;">⏰ 重要提醒</div>
  <div style="color: #64748b; font-size: 14px; line-height: 1.3;">
    • 验证码有效期为 <strong>10分钟</strong>，请及时使用<br>
    • 如果您没有进行登录操作，请忽略此邮件<br>
    • 为了保障您的账户安全，请勿将验证码告知他人
  </div>
</div>

<hr style="border: none; border-top: 1px solid #e5e7eb; margin: 10px 0;">

<div style="color: #6b7280; font-size: 14px; line-height: 1.3;">
  <div style="margin-bottom: 4px;"><strong>此致</strong></div>
  <div style="margin-bottom: 2px;"><strong style="color: #1e40af;">{{租户名称}}</strong></div>
  <div style="margin-bottom: 1px;">📞 客服热线：{{租户个性化设置里设置的客服电话}}</div>
  <div>🌐 官方网站：{{租户独立域名的portal网址}}</div>
</div>`
    },
    'reset-password-code': {
      title: '重置密码验证码',
      subject: '【重置密码验证码】{{租户名称}} 控制塔系统',
      content: `<div style="margin-bottom: 6px;">
  <strong style="color: #1f2937; font-size: 16px;">尊敬的用户：</strong>
</div>

<div style="margin-bottom: 5px; color: #374151; line-height: 1.3;">
  您好！您正在重置 <strong style="color: #1e40af;">{{租户名称}} 控制塔系统</strong> 的登录密码。
</div>

<div style="margin: 6px 0; color: #374151;">
  您的重置密码验证码是：
</div>

<div style="text-align: center; margin: 10px 0;">
  <span style="display: inline-block; background: linear-gradient(135deg, #87ceeb 0%, #ffc0cb 50%, #ffffff 100%); color: #1e40af; padding: 12px 24px; border-radius: 8px; font-size: 24px; font-weight: 700; letter-spacing: 4px; font-family: 'Courier New', monospace; box-shadow: 0 4px 16px rgba(135, 206, 235, 0.2);">123456</span>
</div>

<div style="background: #f8fafc; padding: 10px; border-radius: 6px; margin: 8px 0;">
  <div style="color: #1e40af; font-weight: 600; margin-bottom: 4px;">⏰ 重要提醒</div>
  <div style="color: #64748b; font-size: 14px; line-height: 1.3;">
    • 验证码有效期为 <strong>10分钟</strong>，请及时使用<br>
    • 如果您没有进行重置密码操作，请忽略此邮件<br>
    • 为了保障您的账户安全，请勿将验证码告知他人
  </div>
</div>

<hr style="border: none; border-top: 1px solid #e5e7eb; margin: 10px 0;">

<div style="color: #6b7280; font-size: 14px; line-height: 1.3;">
  <div style="margin-bottom: 4px;"><strong>此致</strong></div>
  <div style="margin-bottom: 2px;"><strong style="color: #1e40af;">{{租户名称}}</strong></div>
  <div style="margin-bottom: 1px;">📞 客服热线：{{租户个性化设置里设置的客服电话}}</div>
  <div>🌐 官方网站：{{租户独立域名的portal网址}}</div>
</div>`
    },
    'identity-verification': {
      title: '身份验证码(修改手机邮箱)',
      subject: '【身份验证码】{{租户名称}} 控制塔系统',
      content: `<div style="margin-bottom: 6px;">
  <strong style="color: #1f2937; font-size: 16px;">尊敬的用户：</strong>
</div>

<div style="margin-bottom: 5px; color: #374151; line-height: 1.3;">
  您好！您正在修改 <strong style="color: #1e40af;">{{租户名称}} 控制塔系统</strong> 的{{手机号码或邮箱地址,根据修改行为判断}}。
</div>

<div style="margin: 6px 0; color: #374151;">
  您的身份验证码是：
</div>

<div style="text-align: center; margin: 10px 0;">
  <span style="display: inline-block; background: linear-gradient(135deg, #87ceeb 0%, #ffc0cb 50%, #ffffff 100%); color: #1e40af; padding: 12px 24px; border-radius: 8px; font-size: 24px; font-weight: 700; letter-spacing: 4px; font-family: 'Courier New', monospace; box-shadow: 0 4px 16px rgba(135, 206, 235, 0.2);">123456</span>
</div>

<div style="background: #f8fafc; padding: 10px; border-radius: 6px; margin: 8px 0;">
  <div style="color: #1e40af; font-weight: 600; margin-bottom: 4px;">⏰ 重要提醒</div>
  <div style="color: #64748b; font-size: 14px; line-height: 1.3;">
    • 验证码有效期为 <strong>10分钟</strong>，请及时使用<br>
    • 如果您没有进行信息修改操作，请立即联系客服<br>
    • 为了保障您的账户安全，请勿将验证码告知他人
  </div>
</div>

<hr style="border: none; border-top: 1px solid #e5e7eb; margin: 10px 0;">

<div style="color: #6b7280; font-size: 14px; line-height: 1.3;">
  <div style="margin-bottom: 4px;"><strong>此致</strong></div>
  <div style="margin-bottom: 2px;"><strong style="color: #1e40af;">{{租户名称}}</strong></div>
  <div style="margin-bottom: 1px;">📞 客服热线：{{租户个性化设置里设置的客服电话}}</div>
  <div>🌐 官方网站：{{租户独立域名的portal网址}}</div>
</div>`
    },
    'reset-password-notice': {
      title: '重置密码通知',
      subject: '【重置密码】{{租户名称}} 控制塔系统',
      content: `<div style="margin-bottom: 6px;">
  <strong style="color: #1f2937; font-size: 16px;">尊敬的用户：</strong>
</div>

<div style="margin-bottom: 5px; color: #374151; line-height: 1.3;">
  您好！您的 <strong style="color: #1e40af;">{{租户名称}} 控制塔系统</strong>账户密码已成功重置。
</div>

<div style="margin: 6px 0; color: #374151;">
  重置后的密码为：
</div>

<div style="text-align: center; margin: 10px 0;">
  <span style="display: inline-block; background: linear-gradient(135deg, #87ceeb 0%, #ffc0cb 50%, #ffffff 100%); color: #1e40af; padding: 12px 24px; border-radius: 8px; font-size: 24px; font-weight: 700; letter-spacing: 4px; font-family: 'Courier New', monospace; box-shadow: 0 4px 16px rgba(135, 206, 235, 0.2);">Kx9#mP2$</span>
</div>

<div style="background: #f8fafc; padding: 10px; border-radius: 6px; margin: 8px 0;">
  <div style="color: #1e40af; font-weight: 600; margin-bottom: 3px;">⚠️ 安全提醒</div>
  <div style="color: #64748b; font-size: 14px; line-height: 1.3;">
    如果这不是您本人的操作，请立即联系客服并重新设置密码。
  </div>
</div>

<div style="background: #f8fafc; padding: 10px; border-radius: 6px; margin: 8px 0;">
  <div style="color: #1e40af; font-weight: 600; margin-bottom: 4px;">🛡️ 安全建议</div>
  <div style="color: #64748b; font-size: 14px; line-height: 1.3;">
    • 定期更换密码<br>
    • 使用复杂密码组合<br>
    • 不要在多个平台使用相同密码<br>
    • 及时关注账户异常提醒
  </div>
</div>

<hr style="border: none; border-top: 1px solid #e5e7eb; margin: 10px 0;">

<div style="color: #6b7280; font-size: 14px; line-height: 1.3;">
  <div style="margin-bottom: 4px;"><strong>此致</strong></div>
  <div style="margin-bottom: 2px;"><strong style="color: #1e40af;">{{租户名称}}</strong></div>
  <div style="margin-bottom: 1px;">📞 客服热线：{{租户个性化设置里设置的客服电话}}</div>
  <div>🌐 官方网站：{{租户独立域名的portal网址}}</div>
</div>`
    },
    'create-user-notice': {
      title: '创建用户通知',
      subject: '【创建用户】{{租户名称}} 控制塔系统',
      content: `<div style="margin-bottom: 6px;">
  <strong style="color: #1f2937; font-size: 16px;">尊敬的用户：</strong>
</div>

<div style="margin-bottom: 5px; color: #374151; line-height: 1.3;">
  您好！欢迎加入 <strong style="color: #1e40af;">{{租户名称}} 控制塔系统</strong>！
</div>

<div style="background: #f0fdf4; padding: 10px; border-radius: 8px; margin: 8px 0;">
  <div style="color: #16a34a; font-weight: 600; margin-bottom: 4px;">🎉 账户创建成功</div>
  <div style="color: #374151; font-size: 14px; line-height: 1.3;">
    <div style="margin-bottom: 3px;"><strong>登录邮箱：</strong>{{用户的注册邮箱}}</div>
    <div style="margin-bottom: 3px;"><strong>初始密码：</strong>{{系统自动创建的密码}}</div>
    <div><strong>注册时间：</strong>{{动态取创建账户的时间}}</div>
  </div>
</div>

<div style="background: #f8fafc; padding: 10px; border-radius: 6px; margin: 8px 0;">
  <div style="color: #1e40af; font-weight: 600; margin-bottom: 4px;">📋 首次登录建议</div>
  <div style="color: #64748b; font-size: 14px; line-height: 1.3;">
    • 完善个人资料信息<br>
    • 设置安全密码<br>
    • 绑定手机号码<br>
    • 了解平台使用指南
  </div>
</div>

<hr style="border: none; border-top: 1px solid #e5e7eb; margin: 10px 0;">

<div style="color: #6b7280; font-size: 14px; line-height: 1.3;">
  <div style="margin-bottom: 4px;"><strong>此致</strong></div>
  <div style="margin-bottom: 2px;"><strong style="color: #1e40af;">{{租户名称}}</strong></div>
  <div style="margin-bottom: 1px;">📞 客服热线：{{租户个性化设置里设置的客服电话}}</div>
  <div>🌐 官方网站：{{租户独立域名的portal网址}}</div>
</div>`
    }
  };

  // Tab选项配置
  const tabOptions = [
    { key: 'register-code', title: '注册验证码' },
    { key: 'login-code', title: '用户登录验证码' },
    { key: 'reset-password-code', title: '重置密码验证码' },
    { key: 'identity-verification', title: '身份验证码(修改手机邮箱)' },
    { key: 'reset-password-notice', title: '重置密码通知' },
    { key: 'create-user-notice', title: '创建用户通知' }
  ];

  /**
   * 处理Tab切换
   * @param key - Tab的key值
   */
  const handleTabChange = (key: string) => {
    setActiveTab(key);
  };

  /**
   * 渲染邮件内容
   * @param content - 邮件正文内容
   */
  const renderEmailContent = (content: string) => {
    return (
      <div 
        style={{ 
          lineHeight: '0.5',
          whiteSpace: 'pre-line',
          padding: '32px',
          backgroundColor: '#ffffff',
          border: '1px solid #e5e7eb',
          borderRadius: '12px',
          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
          fontSize: '15px',
          color: '#374151',
          fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
          maxWidth: '600px'
        }}
        dangerouslySetInnerHTML={{ __html: content }}
      />
    );
  };

  return (
    <div className="p-6">
      {/* 固定提示文字 */}
      <div style={{
        backgroundColor: '#fff2e8',
        border: '1px solid #ffb366',
        borderRadius: '4px',
        padding: '12px 16px',
        marginBottom: '24px',
        textAlign: 'center'
      }}>
        <div style={{
          color: '#d46b08',
          fontWeight: 'bold',
          fontSize: '14px'
        }}>
          这个页面不是系统功能！！！不用开发！！！只是邮件模板方便展示原型！！！！！
        </div>
      </div>

      {/* Tab切换和邮件模板内容 */}
      <Card>
        <Tabs 
          activeTab={activeTab} 
          onChange={handleTabChange}
          type="line"
          size="large"
        >
          {tabOptions.map(tab => {
            const template = emailTemplates[tab.key as keyof typeof emailTemplates];
            return (
              <TabPane key={tab.key} title={tab.title}>
                <Space direction="vertical" size="large" style={{ width: '100%' }}>
                  {/* 邮件标题 */}
                  <div>
                    <Title heading={4} className="mb-3" style={{ color: '#1f2937', fontWeight: '600' }}>
                      邮件标题
                    </Title>
                    <div 
                      style={{
                        padding: '16px 20px',
                        backgroundColor: '#f8fafc',
                        border: '1px solid #e2e8f0',
                        borderRadius: '8px',
                        fontSize: '16px',
                        fontWeight: '600',
                        color: '#1e40af',
                        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
                        letterSpacing: '0.025em',
                        maxWidth: '600px'
                      }}
                    >
                      {template.subject}
                    </div>
                  </div>

                  {/* 邮件正文 */}
                  <div>
                    <Title heading={4} className="mb-3" style={{ color: '#1f2937', fontWeight: '600' }}>
                      邮件正文
                    </Title>
                    {renderEmailContent(template.content)}
                  </div>
                </Space>
              </TabPane>
            );
          })}
        </Tabs>
      </Card>
    </div>
  );
};

export default EmailTemplateExample;