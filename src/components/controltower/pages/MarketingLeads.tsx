import React, { useState } from 'react';
import { Card, Button, Table, Form, Input, Select, Space, Tag, Popconfirm, Message, Modal, Descriptions } from '@arco-design/web-react';
import { IconDownload, IconEdit, IconDelete, IconEye, IconSearch, IconRefresh, IconUser } from '@arco-design/web-react/icon';

const FormItem = Form.Item;
const Option = Select.Option;
const TextArea = Input.TextArea;

interface MarketingLead {
  id: string;
  companyName: string;
  contactPerson: string;
  phone: string;
  email: string;
  source: '首页留资' | 'AI导入';
  status: '未跟进' | '已跟进';
  submitTime: string;
  lastFollowTime?: string;
  followUpPerson?: string;
  followUpRecord?: string; // 跟进记录
}

interface FollowUpForm {
  followUpRecord: string;
}

/**
 * 营销线索页面组件
 * @description 展示营销线索列表，支持筛选、查看、跟进、删除等操作
 */
const MarketingLeads: React.FC = () => {
  const [form] = Form.useForm();
  const [followUpForm] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  
  // 对话框状态管理
  const [viewModalVisible, setViewModalVisible] = useState(false);
  const [followUpModalVisible, setFollowUpModalVisible] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [currentRecord, setCurrentRecord] = useState<MarketingLead | null>(null);
  
  // 模拟营销线索数据
  const [marketingLeads, setMarketingLeads] = useState<MarketingLead[]>([
    {
      id: 'ML001',
      companyName: '深圳市科技有限公司',
      contactPerson: '张经理',
      phone: '13800138001',
      email: 'zhang@tech.com',
      source: '首页留资',
      status: '未跟进',
      submitTime: '2024-01-20 14:30:00',
      lastFollowTime: undefined,
      followUpPerson: undefined
    },
    {
      id: 'ML002',
      companyName: '上海贸易集团',
      contactPerson: '李总',
      phone: '13900139002',
      email: 'li@trade.com',
      source: 'AI导入',
      status: '已跟进',
      submitTime: '2024-01-19 10:15:00',
      lastFollowTime: '2024-01-20 09:30:00',
      followUpPerson: '王销售',
      followUpRecord: '已与客户电话沟通，了解其物流需求，客户对我们的服务很感兴趣，约定下周进行详细方案讨论。'
    },
    {
      id: 'ML003',
      companyName: '广州物流运输公司',
      contactPerson: '陈主管',
      phone: '13700137003',
      email: 'chen@logistics.com',
      source: '首页留资',
      status: '已跟进',
      submitTime: '2024-01-18 16:45:00',
      lastFollowTime: '2024-01-19 14:20:00',
      followUpPerson: '刘销售',
      followUpRecord: '客户主要从事国际物流业务，目前在寻找更优质的货代服务商，已发送公司介绍资料，等待客户反馈。'
    },
    {
      id: 'ML004',
      companyName: '北京进出口贸易有限公司',
      contactPerson: '赵总监',
      phone: '13600136004',
      email: 'zhao@import.com',
      source: 'AI导入',
      status: '未跟进',
      submitTime: '2024-01-17 11:20:00',
      lastFollowTime: undefined,
      followUpPerson: undefined
    },
    {
      id: 'ML005',
      companyName: '杭州电商科技公司',
      contactPerson: '孙经理',
      phone: '13500135005',
      email: 'sun@ecommerce.com',
      source: '首页留资',
      status: '已跟进',
      submitTime: '2024-01-16 13:10:00',
      lastFollowTime: '2024-01-18 10:45:00',
      followUpPerson: '周销售',
      followUpRecord: '客户是电商平台，有大量跨境电商物流需求，已安排技术人员对接API接口，预计本月内可以开始合作。'
    }
  ]);

  /**
   * 搜索处理函数
   * @param values 表单值
   */
  const handleSearch = async (values: any) => {
    setSearchLoading(true);
    try {
      // 模拟API调用
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log('搜索条件:', values);
      Message.success('搜索完成');
    } catch (error) {
      Message.error('搜索失败，请重试');
    } finally {
      setSearchLoading(false);
    }
  };

  /**
   * 重置搜索条件
   */
  const handleReset = () => {
    form.resetFields();
    Message.info('搜索条件已重置');
  };

  /**
   * 导出列表
   */
  const handleExport = async () => {
    setLoading(true);
    try {
      // 模拟导出操作
      await new Promise(resolve => setTimeout(resolve, 2000));
      Message.success('导出成功');
    } catch (error) {
      Message.error('导出失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  /**
   * 查看线索详情
   * @param record 线索记录
   */
  const handleView = (record: MarketingLead) => {
    setCurrentRecord(record);
    setViewModalVisible(true);
  };

  /**
   * 打开跟进对话框
   * @param record 线索记录
   */
  const handleFollowUp = (record: MarketingLead) => {
    setCurrentRecord(record);
    setFollowUpModalVisible(true);
    followUpForm.resetFields();
  };

  /**
   * 确认跟进操作
   * @param values 表单值
   */
  const handleFollowUpConfirm = async (values: FollowUpForm) => {
    if (!currentRecord) return;
    
    try {
      setLoading(true);
      // 模拟API调用
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setMarketingLeads(prev => 
        prev.map(item => 
          item.id === currentRecord.id 
            ? { 
                ...item, 
                status: '已跟进', 
                lastFollowTime: new Date().toLocaleString('zh-CN'),
                followUpPerson: '当前用户', // 实际应该从用户信息中获取
                followUpRecord: values.followUpRecord
              }
            : item
        )
      );
      
      Message.success(`已跟进线索: ${currentRecord.companyName}`);
      setFollowUpModalVisible(false);
      setCurrentRecord(null);
    } catch (error) {
      Message.error('跟进失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  /**
   * 打开删除确认对话框
   * @param record 线索记录
   */
  const handleDelete = (record: MarketingLead) => {
    setCurrentRecord(record);
    setDeleteModalVisible(true);
  };

  /**
   * 确认删除操作
   */
  const handleDeleteConfirm = async () => {
    if (!currentRecord) return;
    
    try {
      setLoading(true);
      // 模拟API调用
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setMarketingLeads(prev => prev.filter(item => item.id !== currentRecord.id));
      Message.success(`已删除线索: ${currentRecord.companyName}`);
      setDeleteModalVisible(false);
      setCurrentRecord(null);
    } catch (error) {
      Message.error('删除失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  // 表格列配置
  const columns = [
    {
      title: '公司名称',
      dataIndex: 'companyName',
      key: 'companyName',
      width: 200,
      render: (text: string) => (
        <span className="font-medium text-gray-900">{text}</span>
      )
    },
    {
      title: '联系人',
      dataIndex: 'contactPerson',
      key: 'contactPerson',
      width: 120,
      render: (text: string) => (
        <div className="flex items-center">
          <IconUser className="mr-1 text-gray-400" />
          <span>{text}</span>
        </div>
      )
    },
    {
      title: '电话',
      dataIndex: 'phone',
      key: 'phone',
      width: 140,
      render: (text: string) => (
        <span className="font-mono text-sm">{text}</span>
      )
    },
    {
      title: '邮箱',
      dataIndex: 'email',
      key: 'email',
      width: 180,
      render: (text: string) => (
        <span className="text-blue-600 hover:text-blue-800 cursor-pointer">{text}</span>
      )
    },
    {
      title: '来源',
      dataIndex: 'source',
      key: 'source',
      width: 100,
      render: (text: string) => (
        <Tag color={text === '首页留资' ? 'blue' : 'green'}>
          {text}
        </Tag>
      )
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (text: string) => (
        <Tag color={text === '未跟进' ? 'red' : 'green'}>
          {text}
        </Tag>
      )
    },
    {
      title: '提交时间',
      dataIndex: 'submitTime',
      key: 'submitTime',
      width: 160,
      render: (text: string) => {
        const date = new Date(text);
        return (
          <div>
            <div>{date.toLocaleDateString('zh-CN')}</div>
            <div className="text-sm text-gray-500">{date.toLocaleTimeString('zh-CN', { hour12: false })}</div>
          </div>
        );
      }
    },
    {
      title: '最新跟进时间',
      dataIndex: 'lastFollowTime',
      key: 'lastFollowTime',
      width: 160,
      render: (text: string) => {
        if (!text) return <span className="text-gray-400">-</span>;
        const date = new Date(text);
        return (
          <div>
            <div>{date.toLocaleDateString('zh-CN')}</div>
            <div className="text-sm text-gray-500">{date.toLocaleTimeString('zh-CN', { hour12: false })}</div>
          </div>
        );
      }
    },
    {
      title: '跟进人',
      dataIndex: 'followUpPerson',
      key: 'followUpPerson',
      width: 100,
      render: (text: string) => (
        text ? <span>{text}</span> : <span className="text-gray-400">-</span>
      )
    },
    {
      title: '操作',
      key: 'action',
      width: 120,
      fixed: 'right' as const,
      render: (_: any, record: MarketingLead) => (
        <div className="space-y-1">
          <div className="flex space-x-1">
            <Button
              type="text"
              size="mini"
              icon={<IconEye />}
              onClick={() => handleView(record)}
              className="text-blue-600 hover:text-blue-800"
            >
              查看
            </Button>
            <Button
              type="text"
              size="mini"
              icon={<IconEdit />}
              onClick={() => handleFollowUp(record)}
              className="text-green-600 hover:text-green-800"
              disabled={record.status === '已跟进'}
            >
              跟进
            </Button>
          </div>
          <div className="flex space-x-1">
            <Popconfirm
              title="确定要删除这条线索吗？"
              onOk={() => handleDelete(record)}
              okText="确定"
              cancelText="取消"
            >
              <Button
                type="text"
                size="mini"
                icon={<IconDelete />}
                className="text-red-600 hover:text-red-800"
              >
                删除
              </Button>
            </Popconfirm>
          </div>
        </div>
      )
    }
  ];

  return (
    <div className="p-6 space-y-6">
      {/* 筛选区域 */}
      <Card>
        <Form
          form={form}
          layout="inline"
          onSubmit={handleSearch}
          className="mb-4"
        >
          <FormItem field="companyName" label="公司名称">
            <Input placeholder="请输入公司名称" style={{ width: 200 }} />
          </FormItem>

          <FormItem field="contactPerson" label="联系人">
            <Input placeholder="请输入联系人" style={{ width: 150 }} />
          </FormItem>

          <FormItem field="source" label="来源">
            <Select placeholder="请选择来源" style={{ width: 120 }}>
              <Option value="首页留资">首页留资</Option>
              <Option value="AI导入">AI导入</Option>
            </Select>
          </FormItem>

          <FormItem field="status" label="状态">
            <Select placeholder="请选择状态" style={{ width: 120 }}>
              <Option value="未跟进">未跟进</Option>
              <Option value="已跟进">已跟进</Option>
            </Select>
          </FormItem>

          <FormItem>
            <Space>
              <Button 
                type="primary" 
                htmlType="submit" 
                icon={<IconSearch />}
                loading={searchLoading}
              >
                搜索
              </Button>
              <Button 
                icon={<IconRefresh />}
                onClick={handleReset}
              >
                重置
              </Button>
            </Space>
          </FormItem>
        </Form>
      </Card>

      {/* 功能区和列表区 */}
      <Card>
        <div className="mb-4 flex justify-between items-center">
          <Space>
            <Button 
              icon={<IconDownload />}
              onClick={handleExport}
              loading={loading}
            >
              导出列表
            </Button>
          </Space>
        </div>

        <Table
          columns={columns}
          data={marketingLeads}
          rowKey="id"
          pagination={{
            pageSize: 10,
            showTotal: true,
            showJumper: true
          }}
          scroll={{ x: 1400 }}
        />
      </Card>

      {/* 查看详情对话框 */}
      <Modal
        title="线索详情"
        visible={viewModalVisible}
        onCancel={() => setViewModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setViewModalVisible(false)}>
            关闭
          </Button>
        ]}
        style={{ width: 600 }}
      >
        {currentRecord && (
          <Descriptions
            column={2}
            data={[
              { label: '公司名称', value: currentRecord.companyName },
              { label: '联系人', value: currentRecord.contactPerson },
              { label: '电话', value: currentRecord.phone },
              { label: '邮箱', value: currentRecord.email },
              { label: '来源', value: currentRecord.source },
              { label: '状态', value: currentRecord.status },
              { label: '提交时间', value: currentRecord.submitTime },
              ...(currentRecord.status === '已跟进' ? [
                { label: '跟进人', value: currentRecord.followUpPerson || '-' },
                { label: '跟进时间', value: currentRecord.lastFollowTime || '-' },
                { label: '跟进记录', value: currentRecord.followUpRecord || '-', span: 2 }
              ] : [])
            ]}
          />
        )}
      </Modal>

      {/* 跟进对话框 */}
      <Modal
        title="跟进线索"
        visible={followUpModalVisible}
        onCancel={() => setFollowUpModalVisible(false)}
        onOk={() => followUpForm.submit()}
        confirmLoading={loading}
        style={{ width: 500 }}
      >
        {currentRecord && (
          <div className="mb-4">
            <p><strong>公司名称：</strong>{currentRecord.companyName}</p>
            <p><strong>联系人：</strong>{currentRecord.contactPerson}</p>
          </div>
        )}
        <Form
          form={followUpForm}
          onSubmit={handleFollowUpConfirm}
          layout="vertical"
        >
          <FormItem
            field="followUpRecord"
            label="跟进记录"
            rules={[{ required: true, message: '请填写跟进记录' }]}
          >
            <TextArea
              placeholder="请详细描述本次跟进情况..."
              rows={4}
              maxLength={500}
              showWordLimit
            />
          </FormItem>
        </Form>
      </Modal>

      {/* 删除确认对话框 */}
      <Modal
        title="确认删除"
        visible={deleteModalVisible}
        onCancel={() => setDeleteModalVisible(false)}
        onOk={handleDeleteConfirm}
        confirmLoading={loading}
        okButtonProps={{ status: 'danger' }}
        style={{ width: 400 }}
      >
        {currentRecord && (
          <div>
            <p className="mb-2">删除后无法恢复，是否确认删除？</p>
            <div className="bg-gray-50 p-3 rounded">
              <p><strong>公司名称：</strong>{currentRecord.companyName}</p>
              <p><strong>联系人：</strong>{currentRecord.contactPerson}</p>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default MarketingLeads;