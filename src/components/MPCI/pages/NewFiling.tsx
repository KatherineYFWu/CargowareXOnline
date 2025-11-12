import React from 'react';
import { Card, Button, Form, Input, Select, DatePicker, Typography, Space, Divider } from '@arco-design/web-react';
import { IconArrowLeft, IconSave, IconSend } from '@arco-design/web-react/icon';
import { useNavigate } from 'react-router-dom';

const { Title, Text } = Typography;
const FormItem = Form.Item;
const { Option } = Select;

/**
 * 新建申报页面组件
 * @description 手工录入申报信息的页面，目前为占位实现
 */
const NewFiling: React.FC = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();

  /**
   * 返回上一页
   */
  const handleGoBack = () => {
    navigate(-1);
  };

  /**
   * 保存草稿
   */
  const handleSaveDraft = () => {
    form.validate().then((values) => {
      console.log('保存草稿:', values);
      // TODO: 实现保存草稿逻辑
    }).catch((error) => {
      console.log('表单验证失败:', error);
    });
  };

  /**
   * 提交申报
   */
  const handleSubmit = () => {
    form.validate().then((values) => {
      console.log('提交申报:', values);
      // TODO: 实现提交申报逻辑
    }).catch((error) => {
      console.log('表单验证失败:', error);
    });
  };

  return (
    <div className="p-6 bg-gray-50 min-h-full">
      {/* 页面头部 */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-4">
            <Button
              type="text"
              icon={<IconArrowLeft />}
              onClick={handleGoBack}
              className="text-gray-600 hover:text-gray-800"
            >
              返回
            </Button>
            <div>
              <Title heading={3} className="mb-1">新建申报</Title>
              <Text type="secondary">手工录入申报信息</Text>
            </div>
          </div>
          
          <Space>
            <Button onClick={handleSaveDraft} icon={<IconSave />}>
              保存草稿
            </Button>
            <Button type="primary" onClick={handleSubmit} icon={<IconSend />}>
              提交申报
            </Button>
          </Space>
        </div>
        
        <Divider className="my-0" />
      </div>

      {/* 表单内容 */}
      <div className="max-w-4xl mx-auto">
        <Card className="shadow-sm">
          <Form
            form={form}
            layout="vertical"
            className="space-y-6"
          >
            {/* 基本信息 */}
            <div>
              <Title heading={5} className="mb-4 text-gray-800">
                基本信息
              </Title>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormItem
                  label="申报类型"
                  field="declarationType"
                  rules={[{ required: true, message: '请选择申报类型' }]}
                >
                  <Select placeholder="请选择申报类型">
                    <Option value="import">进口申报</Option>
                    <Option value="export">出口申报</Option>
                    <Option value="transit">转运申报</Option>
                  </Select>
                </FormItem>
                
                <FormItem
                  label="申报编号"
                  field="declarationNumber"
                  rules={[{ required: true, message: '请输入申报编号' }]}
                >
                  <Input placeholder="请输入申报编号" />
                </FormItem>
                
                <FormItem
                  label="申报日期"
                  field="declarationDate"
                  rules={[{ required: true, message: '请选择申报日期' }]}
                >
                  <DatePicker className="w-full" placeholder="请选择申报日期" />
                </FormItem>
                
                <FormItem
                  label="申报人"
                  field="declarant"
                  rules={[{ required: true, message: '请输入申报人' }]}
                >
                  <Input placeholder="请输入申报人" />
                </FormItem>
              </div>
            </div>
            
            <Divider />
            
            {/* 货物信息 */}
            <div>
              <Title heading={5} className="mb-4 text-gray-800">
                货物信息
              </Title>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormItem
                  label="货物名称"
                  field="goodsName"
                  rules={[{ required: true, message: '请输入货物名称' }]}
                >
                  <Input placeholder="请输入货物名称" />
                </FormItem>
                
                <FormItem
                  label="HS编码"
                  field="hsCode"
                  rules={[{ required: true, message: '请输入HS编码' }]}
                >
                  <Input placeholder="请输入HS编码" />
                </FormItem>
                
                <FormItem
                  label="数量"
                  field="quantity"
                  rules={[{ required: true, message: '请输入数量' }]}
                >
                  <Input placeholder="请输入数量" />
                </FormItem>
                
                <FormItem
                  label="单位"
                  field="unit"
                  rules={[{ required: true, message: '请选择单位' }]}
                >
                  <Select placeholder="请选择单位">
                    <Option value="kg">千克</Option>
                    <Option value="pcs">件</Option>
                    <Option value="m3">立方米</Option>
                    <Option value="ton">吨</Option>
                  </Select>
                </FormItem>
                
                <FormItem
                  label="货值"
                  field="value"
                  rules={[{ required: true, message: '请输入货值' }]}
                >
                  <Input placeholder="请输入货值" />
                </FormItem>
                
                <FormItem
                  label="币种"
                  field="currency"
                  rules={[{ required: true, message: '请选择币种' }]}
                >
                  <Select placeholder="请选择币种">
                    <Option value="USD">美元</Option>
                    <Option value="EUR">欧元</Option>
                    <Option value="CNY">人民币</Option>
                    <Option value="AED">阿联酋迪拉姆</Option>
                  </Select>
                </FormItem>
              </div>
            </div>
            
            <Divider />
            
            {/* 运输信息 */}
            <div>
              <Title heading={5} className="mb-4 text-gray-800">
                运输信息
              </Title>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormItem
                  label="运输方式"
                  field="transportMode"
                  rules={[{ required: true, message: '请选择运输方式' }]}
                >
                  <Select placeholder="请选择运输方式">
                    <Option value="sea">海运</Option>
                    <Option value="air">空运</Option>
                    <Option value="land">陆运</Option>
                    <Option value="rail">铁路</Option>
                  </Select>
                </FormItem>
                
                <FormItem
                  label="运输工具"
                  field="transportTool"
                >
                  <Input placeholder="请输入运输工具" />
                </FormItem>
                
                <FormItem
                  label="起运港/地"
                  field="originPort"
                  rules={[{ required: true, message: '请输入起运港/地' }]}
                >
                  <Input placeholder="请输入起运港/地" />
                </FormItem>
                
                <FormItem
                  label="目的港/地"
                  field="destinationPort"
                  rules={[{ required: true, message: '请输入目的港/地' }]}
                >
                  <Input placeholder="请输入目的港/地" />
                </FormItem>
              </div>
            </div>
            
            <Divider />
            
            {/* 备注信息 */}
            <div>
              <Title heading={5} className="mb-4 text-gray-800">
                备注信息
              </Title>
              
              <FormItem
                label="备注"
                field="remarks"
              >
                <Input.TextArea
                  placeholder="请输入备注信息"
                  rows={4}
                  maxLength={500}
                  showWordLimit
                />
              </FormItem>
            </div>
          </Form>
        </Card>
        
        {/* 开发提示 */}
        <Card className="mt-6 bg-blue-50 border-blue-200">
          <div className="text-center py-4">
            <Title heading={6} className="text-blue-800 mb-2">
              🚧 功能开发中
            </Title>
            <Text type="secondary" className="text-blue-600">
              此页面为新建申报功能的占位实现，完整的表单验证、数据提交等功能正在开发中...
            </Text>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default NewFiling;