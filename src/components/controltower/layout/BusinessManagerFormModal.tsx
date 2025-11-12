import React, { useState, useEffect } from 'react';
import {
  Modal,
  Form,
  Select,
  Button,
  Message,
  Space
} from '@arco-design/web-react';

const FormItem = Form.Item;
const Option = Select.Option;

interface BusinessManagerItem {
  key: string;
  employee: string; // 员工选择（姓名+手机号+邮箱拼接）
  businessType: string[];
  position: string[];
  rateType: string[];
  originPort: string[];
  destinationPort: string[];
  dischargePort: string[];
  route: string[];
  carrier: string[];
  customer: string[];
  createTime: string;
  updateTime: string;
}

interface BusinessManagerFormModalProps {
  /** 是否显示弹窗 */
  visible: boolean;
  /** 弹窗标题 */
  title: string;
  /** 编辑时的初始数据 */
  initialData?: BusinessManagerItem;
  /** 关闭弹窗回调 */
  onCancel: () => void;
  /** 提交表单回调 */
  onSubmit: (data: BusinessManagerItem) => void;
}

/**
 * 业务负责人表单弹窗组件
 */
const BusinessManagerFormModal: React.FC<BusinessManagerFormModalProps> = ({
  visible,
  title,
  initialData,
  onCancel,
  onSubmit
}) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  // 业务属性选项
  const businessTypeOptions = [
    { label: '海运', value: 'sea' },
    { label: '空运', value: 'air' },
    { label: '铁路', value: 'rail' },
    { label: '陆运', value: 'land' }
  ];

  // 岗位选项
  const positionOptions = [
    { label: '销售', value: 'sales' },
    { label: '航线', value: 'route' },
    { label: '客服', value: 'service' },
    { label: '操作', value: 'operation' },
    { label: '单证', value: 'document' },
    { label: '商务', value: 'business' },
    { label: '财务', value: 'finance' }
  ];

  // 运价类型选项
  const rateTypeOptions = [
    { label: '整箱', value: 'fcl' },
    { label: '拼箱', value: 'lcl' },
    { label: '空运', value: 'air' },
    { label: '铁路', value: 'rail' },
    { label: '陆运', value: 'land' },
    { label: '港前', value: 'pre_port' },
    { label: '尾程', value: 'last_mile' }
  ];

  // 员工选项（姓名+手机号+邮箱拼接）
  const employeeOptions = [
    { label: '张三 - 13800138001 - zhangsan@example.com', value: '张三 - 13800138001 - zhangsan@example.com' },
    { label: '李四 - 13800138002 - lisi@example.com', value: '李四 - 13800138002 - lisi@example.com' },
    { label: '王五 - 13800138003 - wangwu@example.com', value: '王五 - 13800138003 - wangwu@example.com' },
    { label: '赵六 - 13800138004 - zhaoliu@example.com', value: '赵六 - 13800138004 - zhaoliu@example.com' },
    { label: '钱七 - 13800138005 - qianqi@example.com', value: '钱七 - 13800138005 - qianqi@example.com' },
    { label: '孙八 - 13800138006 - sunba@example.com', value: '孙八 - 13800138006 - sunba@example.com' }
  ];

  // 模拟港口数据
  const portOptions = [
    { label: '上海港', value: 'CNSHA' },
    { label: '深圳港', value: 'CNSZX' },
    { label: '宁波港', value: 'CNNGB' },
    { label: '青岛港', value: 'CNTAO' },
    { label: '天津港', value: 'CNTSN' },
    { label: '洛杉矶港', value: 'USLAX' },
    { label: '长滩港', value: 'USLGB' },
    { label: '纽约港', value: 'USNYC' },
    { label: '汉堡港', value: 'DEHAM' },
    { label: '鹿特丹港', value: 'NLRTM' }
  ];

  // 模拟航线数据
  const routeOptions = [
    { label: '亚欧航线', value: 'asia_europe' },
    { label: '跨太平洋航线', value: 'transpacific' },
    { label: '亚洲区域航线', value: 'asia_regional' },
    { label: '地中海航线', value: 'mediterranean' },
    { label: '南美航线', value: 'south_america' }
  ];

  // 模拟承运人数据
  const carrierOptions = [
    { label: 'COSCO', value: 'cosco' },
    { label: 'MSC', value: 'msc' },
    { label: 'MAERSK', value: 'maersk' },
    { label: 'CMA CGM', value: 'cma_cgm' },
    { label: 'EVERGREEN', value: 'evergreen' },
    { label: 'HAPAG-LLOYD', value: 'hapag_lloyd' }
  ];

  // 模拟客户数据
  const customerOptions = [
    { label: '阿里巴巴', value: 'alibaba' },
    { label: '腾讯', value: 'tencent' },
    { label: '华为', value: 'huawei' },
    { label: '小米', value: 'xiaomi' },
    { label: '京东', value: 'jd' },
    { label: '美团', value: 'meituan' }
  ];

  /**
   * 当弹窗显示时，设置表单初始值
   */
  useEffect(() => {
    if (visible) {
      if (initialData) {
        // 编辑模式，设置初始值
        form.setFieldsValue(initialData);
      } else {
        // 新增模式，重置表单
        form.resetFields();
        form.setFieldsValue({
          status: 'active' // 默认状态为启用
        });
      }
    }
  }, [visible, initialData, form]);

  /**
   * 处理表单提交
   */
  const handleSubmit = async () => {
    try {
      setLoading(true);
      const values = await form.validate();
      
      // 构造提交数据
      const submitData: BusinessManagerItem = {
        ...values,
        key: initialData?.key || `manager_${Date.now()}`,
        createTime: initialData?.createTime || new Date().toISOString(),
        updateTime: new Date().toISOString()
      };
      
      onSubmit(submitData);
      Message.success(initialData ? '编辑成功' : '新增成功');
      handleCancel();
    } catch (error) {
      console.error('表单验证失败:', error);
    } finally {
      setLoading(false);
    }
  };

  /**
   * 处理取消操作
   */
  const handleCancel = () => {
    form.resetFields();
    onCancel();
  };

  return (
    <Modal
      title={title}
      visible={visible}
      onCancel={handleCancel}
      footer={null}
      style={{ width: 800, maxHeight: '80vh' }}
    >
      <div style={{ maxHeight: '60vh', overflow: 'auto' }}>
        <Form
          form={form}
          layout="vertical"
          scrollToFirstError
        >
        {/* 基本信息 */}
        <div style={{ marginBottom: 24 }}>
          <h3 style={{ marginBottom: 16, fontSize: 16, fontWeight: 500 }}>基本信息</h3>
          
          <FormItem
            label="员工"
            field="employee"
            rules={[
              { required: true, message: '请选择员工' }
            ]}
          >
            <Select placeholder="请选择员工">
              {employeeOptions.map(option => (
                <Option key={option.value} value={option.value}>
                  {option.label}
                </Option>
              ))}
            </Select>
          </FormItem>
        </div>

        {/* 业务配置 */}
        <div style={{ marginBottom: 24 }}>
          <h3 style={{ marginBottom: 16, fontSize: 16, fontWeight: 500 }}>业务配置</h3>
          
          <FormItem
            label="业务属性"
            field="businessType"
            rules={[{ required: true, message: '请选择业务属性' }]}
          >
            <Select
              mode="multiple"
              placeholder="请选择业务属性"
              allowClear
            >
              {businessTypeOptions.map(option => (
                <Option key={option.value} value={option.value}>
                  {option.label}
                </Option>
              ))}
            </Select>
          </FormItem>

          <FormItem
            label="岗位"
            field="position"
            rules={[{ required: true, message: '请选择岗位' }]}
          >
            <Select
              mode="multiple"
              placeholder="请选择岗位"
              allowClear
            >
              {positionOptions.map(option => (
                <Option key={option.value} value={option.value}>
                  {option.label}
                </Option>
              ))}
            </Select>
          </FormItem>

          <FormItem
            label="运价类型"
            field="rateType"
          >
            <Select
              mode="multiple"
              placeholder="请选择运价类型"
              allowClear
            >
              {rateTypeOptions.map(option => (
                <Option key={option.value} value={option.value}>
                  {option.label}
                </Option>
              ))}
            </Select>
          </FormItem>
        </div>

        {/* 港口和航线配置 */}
        <div style={{ marginBottom: 24 }}>
          <h3 style={{ marginBottom: 16, fontSize: 16, fontWeight: 500 }}>港口和航线配置</h3>
          
          <FormItem
            label="起运港"
            field="originPort"
          >
            <Select
              mode="multiple"
              placeholder="请选择起运港"
              allowClear
              showSearch
            >
              {portOptions.map(option => (
                <Option key={option.value} value={option.value}>
                  {option.label}
                </Option>
              ))}
            </Select>
          </FormItem>

          <FormItem
            label="目的港"
            field="destinationPort"
          >
            <Select
              mode="multiple"
              placeholder="请选择目的港"
              allowClear
              showSearch
            >
              {portOptions.map(option => (
                <Option key={option.value} value={option.value}>
                  {option.label}
                </Option>
              ))}
            </Select>
          </FormItem>

          <FormItem
            label="卸货港"
            field="dischargePort"
          >
            <Select
              mode="multiple"
              placeholder="请选择卸货港"
              allowClear
              showSearch
            >
              {portOptions.map(option => (
                <Option key={option.value} value={option.value}>
                  {option.label}
                </Option>
              ))}
            </Select>
          </FormItem>

          <FormItem
            label="航线"
            field="route"
          >
            <Select
              mode="multiple"
              placeholder="请选择航线"
              allowClear
            >
              {routeOptions.map(option => (
                <Option key={option.value} value={option.value}>
                  {option.label}
                </Option>
              ))}
            </Select>
          </FormItem>
        </div>

        {/* 合作伙伴配置 */}
        <div style={{ marginBottom: 24 }}>
          <h3 style={{ marginBottom: 16, fontSize: 16, fontWeight: 500 }}>合作伙伴配置</h3>
          
          <FormItem
            label="承运人"
            field="carrier"
          >
            <Select
              mode="multiple"
              placeholder="请选择承运人"
              allowClear
              showSearch
            >
              {carrierOptions.map(option => (
                <Option key={option.value} value={option.value}>
                  {option.label}
                </Option>
              ))}
            </Select>
          </FormItem>

          <FormItem
            label="客户"
            field="customer"
          >
            <Select
              mode="multiple"
              placeholder="请选择客户"
              allowClear
              showSearch
            >
              {customerOptions.map(option => (
                <Option key={option.value} value={option.value}>
                  {option.label}
                </Option>
              ))}
            </Select>
          </FormItem>
        </div>

        {/* 底部按钮 */}
        <div style={{ textAlign: 'right', paddingTop: 16, borderTop: '1px solid #f2f3f5' }}>
          <Space>
            <Button onClick={handleCancel}>
              取消
            </Button>
            <Button
              type="primary"
              loading={loading}
              onClick={handleSubmit}
            >
              {initialData ? '保存' : '新增'}
            </Button>
          </Space>
        </div>
        </Form>
      </div>
    </Modal>
  );
};

export default BusinessManagerFormModal;
export type { BusinessManagerItem };