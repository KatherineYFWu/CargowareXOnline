import React, { useState } from 'react';
import { Card, Button, Form, Input, Select, Switch, Message, Space, Typography, Divider } from '@arco-design/web-react';
import { IconSettings, IconSave, IconRefresh } from '@arco-design/web-react/icon';

const { Title, Text } = Typography;
const FormItem = Form.Item;
const Option = Select.Option;

/**
 * EDI设置页面组件
 * @description 用于配置EDI（电子数据交换）系统的相关设置
 */
const EdiSettings: React.FC = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [testLoading, setTestLoading] = useState(false);

  /**
   * 保存EDI设置
   * @param values 表单数据
   */
  const handleSave = async (values: any) => {
    setLoading(true);
    try {
      // 模拟API调用
      await new Promise(resolve => setTimeout(resolve, 1000));
      Message.success('EDI设置保存成功');
      console.log('EDI设置数据:', values);
    } catch (error) {
      Message.error('保存失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  /**
   * 测试EDI连接
   */
  const handleTestConnection = async () => {
    setTestLoading(true);
    try {
      // 模拟连接测试
      await new Promise(resolve => setTimeout(resolve, 2000));
      Message.success('EDI连接测试成功');
    } catch (error) {
      Message.error('连接测试失败');
    } finally {
      setTestLoading(false);
    }
  };

  /**
   * 重置表单
   */
  const handleReset = () => {
    form.resetFields();
    Message.info('表单已重置');
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <Title heading={4} className="flex items-center">
          <IconSettings className="mr-2" />
          EDI设置
        </Title>
        <Text type="secondary">
          配置电子数据交换(EDI)系统的连接参数和数据传输设置
        </Text>
      </div>

      <Card className="mb-6">
        <Form
          form={form}
          layout="vertical"
          onSubmit={handleSave}
          initialValues={{
            enabled: true,
            protocol: 'AS2',
            format: 'X12',
            encoding: 'UTF-8'
          }}
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* 基础设置 */}
            <div>
              <Title heading={6} className="mb-4">基础设置</Title>
              
              <FormItem label="启用EDI" field="enabled">
                <Switch />
              </FormItem>

              <FormItem 
                label="EDI服务器地址" 
                field="serverUrl"
                rules={[{ required: true, message: '请输入EDI服务器地址' }]}
              >
                <Input placeholder="https://edi.example.com" />
              </FormItem>

              <FormItem 
                label="端口" 
                field="port"
                rules={[{ required: true, message: '请输入端口号' }]}
              >
                <Input placeholder="443" />
              </FormItem>

              <FormItem 
                label="协议类型" 
                field="protocol"
                rules={[{ required: true, message: '请选择协议类型' }]}
              >
                <Select placeholder="请选择协议类型">
                  <Option value="AS2">AS2</Option>
                  <Option value="FTP">FTP</Option>
                  <Option value="SFTP">SFTP</Option>
                  <Option value="HTTP">HTTP</Option>
                  <Option value="HTTPS">HTTPS</Option>
                </Select>
              </FormItem>
            </div>

            {/* 认证设置 */}
            <div>
              <Title heading={6} className="mb-4">认证设置</Title>
              
              <FormItem 
                label="用户名" 
                field="username"
                rules={[{ required: true, message: '请输入用户名' }]}
              >
                <Input placeholder="请输入用户名" />
              </FormItem>

              <FormItem 
                label="密码" 
                field="password"
                rules={[{ required: true, message: '请输入密码' }]}
              >
                <Input.Password placeholder="请输入密码" />
              </FormItem>

              <FormItem label="证书路径" field="certificatePath">
                <Input placeholder="/path/to/certificate.pem" />
              </FormItem>

              <FormItem label="私钥路径" field="privateKeyPath">
                <Input placeholder="/path/to/private-key.pem" />
              </FormItem>
            </div>
          </div>

          <Divider />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* 数据格式设置 */}
            <div>
              <Title heading={6} className="mb-4">数据格式设置</Title>
              
              <FormItem 
                label="数据格式" 
                field="format"
                rules={[{ required: true, message: '请选择数据格式' }]}
              >
                <Select placeholder="请选择数据格式">
                  <Option value="X12">X12</Option>
                  <Option value="EDIFACT">EDIFACT</Option>
                  <Option value="XML">XML</Option>
                  <Option value="JSON">JSON</Option>
                </Select>
              </FormItem>

              <FormItem 
                label="字符编码" 
                field="encoding"
                rules={[{ required: true, message: '请选择字符编码' }]}
              >
                <Select placeholder="请选择字符编码">
                  <Option value="UTF-8">UTF-8</Option>
                  <Option value="ISO-8859-1">ISO-8859-1</Option>
                  <Option value="ASCII">ASCII</Option>
                </Select>
              </FormItem>

              <FormItem label="分隔符" field="delimiter">
                <Input placeholder="~" />
              </FormItem>
            </div>

            {/* 传输设置 */}
            <div>
              <Title heading={6} className="mb-4">传输设置</Title>
              
              <FormItem label="超时时间(秒)" field="timeout">
                <Input placeholder="30" type="number" />
              </FormItem>

              <FormItem label="重试次数" field="retryCount">
                <Input placeholder="3" type="number" />
              </FormItem>

              <FormItem label="批处理大小" field="batchSize">
                <Input placeholder="100" type="number" />
              </FormItem>

              <FormItem label="启用压缩" field="compression">
                <Switch />
              </FormItem>
            </div>
          </div>

          <Divider />

          {/* 操作按钮 */}
          <div className="flex justify-between">
            <Space>
              <Button 
                type="primary" 
                htmlType="submit" 
                loading={loading}
                icon={<IconSave />}
              >
                保存设置
              </Button>
              <Button 
                onClick={handleTestConnection}
                loading={testLoading}
              >
                测试连接
              </Button>
            </Space>
            
            <Button 
              onClick={handleReset}
              icon={<IconRefresh />}
            >
              重置
            </Button>
          </div>
        </Form>
      </Card>
    </div>
  );
};

export default EdiSettings;