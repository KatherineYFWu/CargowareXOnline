import React, { useState } from 'react';
import {
  Card,
  Typography,
  Table,
  Button,
  Input,
  Select,
  Space,
  Modal,
  Form,
  Message,
  Tag
} from '@arco-design/web-react';
import {
  IconSearch,
  IconRefresh,
  IconPlus,
  IconEdit,
  IconEye,
  IconDelete
} from '@arco-design/web-react/icon';
import { useNavigate } from 'react-router-dom';

const { Text } = Typography;
const { Option } = Select;

/**
 * 页面自定义数据接口
 */
interface PageCustomData {
  /** 页面ID */
  id: string;
  /** 页面名称 */
  pageName: string;
  /** 关联页面 */
  relatedPage: string;
  /** 页面属性 */
  pageType: 'form_submit' | 'audit_confirm';
  /** 页面路由 */
  pageRoute: string;
  /** 状态 */
  status: 'enabled' | 'disabled';
  /** 创建人 */
  creator: string;
  /** 创建时间 */
  createTime: string;
  /** 更新人 */
  updater: string;
  /** 更新时间 */
  updateTime: string;
}

/**
 * 页面自定义管理组件
 * @description 提供页面自定义配置的管理功能，包括筛选、新增、编辑、预览、删除和状态切换
 * @author 系统管理员
 * @date 2024-01-15
 */
const PageCustomization: React.FC = () => {
  const navigate = useNavigate();
  
  // 状态管理
  const [loading, setLoading] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [pageTypeFilter, setPageTypeFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState<PageCustomData | null>(null);
  
  // 模态框状态
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [previewModalVisible, setPreviewModalVisible] = useState(false);
  const [deleteConfirmVisible, setDeleteConfirmVisible] = useState(false);
  const [statusToggleVisible, setStatusToggleVisible] = useState(false);
  
  // 表单实例
  const [form] = Form.useForm();
  
  // 模拟页面自定义数据
  const [pageData, setPageData] = useState<PageCustomData[]>([
    {
      id: 'PC001',
      pageName: '订单提交页面',
      relatedPage: '/order/submit',
      pageType: 'form_submit',
      pageRoute: '/custom/order-submit',
      status: 'enabled',
      creator: '张三',
      createTime: '2024-01-10 09:30:00',
      updater: '李四',
      updateTime: '2024-01-12 14:20:00'
    },
    {
      id: 'PC002',
      pageName: '审核确认页面',
      relatedPage: '/audit/confirm',
      pageType: 'audit_confirm',
      pageRoute: '/custom/audit-confirm',
      status: 'enabled',
      creator: '王五',
      createTime: '2024-01-08 16:45:00',
      updater: '王五',
      updateTime: '2024-01-08 16:45:00'
    },
    {
      id: 'PC003',
      pageName: '用户注册页面',
      relatedPage: '/user/register',
      pageType: 'form_submit',
      pageRoute: '/custom/user-register',
      status: 'disabled',
      creator: '赵六',
      createTime: '2024-01-05 11:15:00',
      updater: '张三',
      updateTime: '2024-01-11 10:30:00'
    },
    {
      id: 'PC004',
      pageName: '报表审核页面',
      relatedPage: '/report/audit',
      pageType: 'audit_confirm',
      pageRoute: '/custom/report-audit',
      status: 'enabled',
      creator: '陈七',
      createTime: '2024-01-03 13:20:00',
      updater: '李四',
      updateTime: '2024-01-09 15:45:00'
    },
    {
      id: 'PC005',
      pageName: '产品发布页面',
      relatedPage: '/product/publish',
      pageType: 'form_submit',
      pageRoute: '/custom/product-publish',
      status: 'disabled',
      creator: '孙八',
      createTime: '2024-01-01 08:00:00',
      updater: '孙八',
      updateTime: '2024-01-01 08:00:00'
    }
  ]);
  
  /**
   * 处理搜索操作
   */
  const handleSearch = () => {
    setLoading(true);
    // 模拟搜索延迟
    setTimeout(() => {
      setLoading(false);
      Message.success('搜索完成');
    }, 500);
  };
  
  /**
   * 处理刷新操作
   */
  const handleRefresh = () => {
    setLoading(true);
    setSearchKeyword('');
    setStatusFilter('all');
    setPageTypeFilter('all');
    // 模拟刷新延迟
    setTimeout(() => {
      setLoading(false);
      Message.success('刷新完成');
    }, 500);
  };
  
  /**
   * 处理新增页面
   */
  const handleAdd = () => {
    navigate('/controltower/page-designer?mode=create');
  };
  
  /**
   * 处理编辑页面
   * @param record 页面数据
   */
  const handleEdit = (record: PageCustomData) => {
    navigate(`/controltower/page-designer?mode=edit&pageId=${record.id}`);
  };
  
  /**
   * 处理预览页面
   * @param record 页面数据
   */
  const handlePreview = (record: PageCustomData) => {
    setCurrentPage(record);
    setPreviewModalVisible(true);
  };
  
  /**
   * 处理删除页面
   * @param record 页面数据
   */
  const handleDelete = (record: PageCustomData) => {
    setCurrentPage(record);
    setDeleteConfirmVisible(true);
  };
  
  /**
   * 确认删除页面
   */
  const confirmDelete = () => {
    if (currentPage) {
      setPageData(prev => prev.filter(item => item.id !== currentPage.id));
      Message.success(`页面 "${currentPage.pageName}" 删除成功`);
      setDeleteConfirmVisible(false);
      setCurrentPage(null);
    }
  };
  
  /**
   * 处理状态切换
   * @param record 页面数据
   */
  const handleStatusToggle = (record: PageCustomData) => {
    setCurrentPage(record);
    setStatusToggleVisible(true);
  };
  
  /**
   * 确认状态切换
   */
  const confirmStatusToggle = () => {
    if (currentPage) {
      const newStatus = currentPage.status === 'enabled' ? 'disabled' : 'enabled';
      setPageData(prev => prev.map(item => 
        item.id === currentPage.id 
          ? { ...item, status: newStatus, updater: '当前用户', updateTime: new Date().toLocaleString() }
          : item
      ));
      Message.success(`页面 "${currentPage.pageName}" ${newStatus === 'enabled' ? '启用' : '禁用'}成功`);
      setStatusToggleVisible(false);
      setCurrentPage(null);
    }
  };
  
  /**
   * 处理表单提交
   * @param values 表单数据
   */
  const handleFormSubmit = (values: any) => {
    const now = new Date().toLocaleString();
    
    if (currentPage) {
      // 编辑模式
      setPageData(prev => prev.map(item => 
        item.id === currentPage.id 
          ? { ...item, ...values, updater: '当前用户', updateTime: now }
          : item
      ));
      Message.success('页面更新成功');
    } else {
      // 新增模式
      const newPage: PageCustomData = {
        ...values,
        id: `PC${String(pageData.length + 1).padStart(3, '0')}`,
        creator: '当前用户',
        createTime: now,
        updater: '当前用户',
        updateTime: now
      };
      setPageData(prev => [...prev, newPage]);
      Message.success('页面创建成功');
    }
    
    setEditModalVisible(false);
    setCurrentPage(null);
    form.resetFields();
  };
  
  /**
   * 获取状态标签
   * @param status 状态值
   */
  const getStatusTag = (status: string) => {
    switch (status) {
      case 'enabled':
        return <Tag color="green">启用</Tag>;
      case 'disabled':
        return <Tag color="red">禁用</Tag>;
      default:
        return <Tag color="gray">未知</Tag>;
    }
  };
  
  /**
   * 获取页面属性标签
   * @param pageType 页面属性
   */
  const getPageTypeTag = (pageType: string) => {
    switch (pageType) {
      case 'form_submit':
        return <Tag color="blue">表单提交</Tag>;
      case 'audit_confirm':
        return <Tag color="orange">审核确认</Tag>;
      default:
        return <Tag color="gray">未知</Tag>;
    }
  };
  
  // 数据筛选
  const filteredData = pageData.filter(page => {
    const matchesKeyword = !searchKeyword || 
      page.pageName.includes(searchKeyword) || 
      page.relatedPage.includes(searchKeyword) ||
      page.pageRoute.includes(searchKeyword);
    const matchesStatus = statusFilter === 'all' || page.status === statusFilter;
    const matchesPageType = pageTypeFilter === 'all' || page.pageType === pageTypeFilter;
    
    return matchesKeyword && matchesStatus && matchesPageType;
  });
  
  // 表格列定义
  const columns = [
    {
      title: '页面ID',
      dataIndex: 'id',
      width: 100,
      render: (id: string) => (
        <Text style={{ fontFamily: 'monospace', fontSize: '12px' }}>{id}</Text>
      )
    },
    {
      title: '页面名称',
      dataIndex: 'pageName',
      width: 150,
      render: (name: string) => (
        <Text style={{ fontWeight: 'bold' }}>{name}</Text>
      )
    },
    {
      title: '关联页面',
      dataIndex: 'relatedPage',
      width: 150,
      render: (page: string) => (
        <Text style={{ fontFamily: 'monospace', fontSize: '12px', color: '#666' }}>{page}</Text>
      )
    },
    {
      title: '页面属性',
      dataIndex: 'pageType',
      width: 120,
      render: (type: string) => getPageTypeTag(type)
    },
    {
      title: '页面路由',
      dataIndex: 'pageRoute',
      width: 180,
      render: (route: string) => (
        <Text style={{ fontFamily: 'monospace', fontSize: '12px', color: '#666' }}>{route}</Text>
      )
    },
    {
      title: '状态',
      dataIndex: 'status',
      width: 80,
      render: (status: string) => getStatusTag(status)
    },
    {
      title: '创建人',
      dataIndex: 'creator',
      width: 100
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      width: 150,
      render: (time: string) => (
        <Text style={{ fontSize: '12px' }}>{time}</Text>
      )
    },
    {
      title: '更新人',
      dataIndex: 'updater',
      width: 100
    },
    {
      title: '更新时间',
      dataIndex: 'updateTime',
      width: 150,
      render: (time: string) => (
        <Text style={{ fontSize: '12px' }}>{time}</Text>
      )
    },
    {
      title: '操作',
      width: 120,
      fixed: 'right' as const,
      render: (_: any, record: PageCustomData) => (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <div style={{ display: 'flex', gap: '4px' }}>
            <Button 
              type="text" 
              size="small" 
              icon={<IconEdit />}
              onClick={() => handleEdit(record)}
            >
              编辑
            </Button>
            <Button 
              type="text" 
              size="small" 
              icon={<IconEye />}
              onClick={() => handlePreview(record)}
            >
              预览
            </Button>
          </div>
          <div style={{ display: 'flex', gap: '4px' }}>
            <Button 
              type="text" 
              size="small" 
              icon={<IconDelete />}
              status="danger"
              onClick={() => handleDelete(record)}
            >
              删除
            </Button>
            <Button 
              type="text" 
              size="small"
              onClick={() => handleStatusToggle(record)}
            >
              {record.status === 'enabled' ? '禁用' : '启用'}
            </Button>
          </div>
        </div>
      )
    }
  ];
  
  return (
    <div style={{ padding: '0' }}>
      {/* 筛选区域 */}
      <Card style={{ marginBottom: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
          <Space size="medium">
            <Input
              style={{ width: 280 }}
              placeholder="搜索页面名称、关联页面或路由"
              value={searchKeyword}
              onChange={(value) => setSearchKeyword(value)}
              prefix={<IconSearch />}
              allowClear
            />
            <Select
              placeholder="状态筛选"
              value={statusFilter}
              onChange={setStatusFilter}
              style={{ width: 120 }}
            >
              <Option value="all">全部状态</Option>
              <Option value="enabled">启用</Option>
              <Option value="disabled">禁用</Option>
            </Select>
            <Select
              placeholder="属性筛选"
              value={pageTypeFilter}
              onChange={setPageTypeFilter}
              style={{ width: 120 }}
            >
              <Option value="all">全部属性</Option>
              <Option value="form_submit">表单提交</Option>
              <Option value="audit_confirm">审核确认</Option>
            </Select>
            <Button type="primary" icon={<IconSearch />} onClick={handleSearch}>
              搜索
            </Button>
          </Space>
          
          {/* 功能按钮区域 */}
          <Space>
            <Button icon={<IconRefresh />} onClick={handleRefresh}>
              刷新
            </Button>
            <Button
              type="primary"
              size="large"
              icon={<IconPlus />}
              onClick={handleAdd}
            >
              新增页面
            </Button>
          </Space>
        </div>
      </Card>
      
      {/* 数据列表区域 */}
      <Card>
        <Table
          columns={columns}
          data={filteredData}
          loading={loading}
          pagination={{
            total: filteredData.length,
            pageSize: 10,
            showTotal: (total, range) => 
              `第 ${range[0]}-${range[1]} 条，共 ${total} 条`,
            showJumper: true,
            sizeCanChange: true,
            sizeOptions: [10, 20, 50]
          }}
          rowKey="id"
          stripe
          border
          scroll={{ x: 1400 }}
        />
      </Card>
      
      {/* 编辑/新增模态框 */}
      <Modal
        title={currentPage ? '编辑页面' : '新增页面'}
        visible={editModalVisible}
        onCancel={() => {
          setEditModalVisible(false);
          setCurrentPage(null);
          form.resetFields();
        }}
        onOk={() => form.submit()}
        style={{ width: 600 }}
      >
        <Form
          form={form}
          layout="vertical"
          onSubmit={handleFormSubmit}
        >
          <Form.Item
            label="页面名称"
            field="pageName"
            rules={[{ required: true, message: '请输入页面名称' }]}
          >
            <Input placeholder="请输入页面名称" />
          </Form.Item>
          
          <Form.Item
            label="关联页面"
            field="relatedPage"
            rules={[{ required: true, message: '请输入关联页面路径' }]}
          >
            <Input placeholder="请输入关联页面路径，如：/order/submit" />
          </Form.Item>
          
          <Form.Item
            label="页面属性"
            field="pageType"
            rules={[{ required: true, message: '请选择页面属性' }]}
          >
            <Select placeholder="请选择页面属性">
              <Option value="form_submit">表单提交</Option>
              <Option value="audit_confirm">审核确认</Option>
            </Select>
          </Form.Item>
          
          <Form.Item
            label="页面路由"
            field="pageRoute"
            rules={[{ required: true, message: '请输入页面路由' }]}
          >
            <Input placeholder="请输入页面路由，如：/custom/order-submit" />
          </Form.Item>
          
          <Form.Item
            label="状态"
            field="status"
            rules={[{ required: true, message: '请选择状态' }]}
          >
            <Select placeholder="请选择状态">
              <Option value="enabled">启用</Option>
              <Option value="disabled">禁用</Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
      
      {/* 预览模态框 */}
      <Modal
        title="页面预览"
        visible={previewModalVisible}
        onCancel={() => {
          setPreviewModalVisible(false);
          setCurrentPage(null);
        }}
        footer={
          <Button type="primary" onClick={() => setPreviewModalVisible(false)}>
            关闭
          </Button>
        }
        style={{ width: 700 }}
      >
        {currentPage && (
          <div style={{ padding: '16px 0' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr', gap: '16px 24px', alignItems: 'center' }}>
              <Text type="secondary">页面ID：</Text>
              <Text style={{ fontFamily: 'monospace' }}>{currentPage.id}</Text>
              
              <Text type="secondary">页面名称：</Text>
              <Text style={{ fontSize: '16px', fontWeight: 'bold' }}>{currentPage.pageName}</Text>
              
              <Text type="secondary">关联页面：</Text>
              <Text style={{ fontFamily: 'monospace', color: '#666' }}>{currentPage.relatedPage}</Text>
              
              <Text type="secondary">页面属性：</Text>
              <div>{getPageTypeTag(currentPage.pageType)}</div>
              
              <Text type="secondary">页面路由：</Text>
              <Text style={{ fontFamily: 'monospace', color: '#666' }}>{currentPage.pageRoute}</Text>
              
              <Text type="secondary">状态：</Text>
              <div>{getStatusTag(currentPage.status)}</div>
              
              <Text type="secondary">创建人：</Text>
              <Text>{currentPage.creator}</Text>
              
              <Text type="secondary">创建时间：</Text>
              <Text>{currentPage.createTime}</Text>
              
              <Text type="secondary">更新人：</Text>
              <Text>{currentPage.updater}</Text>
              
              <Text type="secondary">更新时间：</Text>
              <Text>{currentPage.updateTime}</Text>
            </div>
          </div>
        )}
      </Modal>
      
      {/* 删除确认模态框 */}
      <Modal
        title="删除确认"
        visible={deleteConfirmVisible}
        onCancel={() => {
          setDeleteConfirmVisible(false);
          setCurrentPage(null);
        }}
        onOk={confirmDelete}
        okButtonProps={{ status: 'danger' }}
      >
        <div style={{ padding: '16px 0' }}>
          <Text>确定要删除页面 "{currentPage?.pageName}" 吗？</Text>
          <br />
          <Text type="secondary" style={{ fontSize: '12px' }}>此操作不可撤销，请谨慎操作。</Text>
        </div>
      </Modal>
      
      {/* 状态切换确认模态框 */}
      <Modal
        title={currentPage?.status === 'enabled' ? '禁用确认' : '启用确认'}
        visible={statusToggleVisible}
        onCancel={() => {
          setStatusToggleVisible(false);
          setCurrentPage(null);
        }}
        onOk={confirmStatusToggle}
      >
        <div style={{ padding: '16px 0' }}>
          <Text>
            确定要{currentPage?.status === 'enabled' ? '禁用' : '启用'}页面 "{currentPage?.pageName}" 吗？
          </Text>
        </div>
      </Modal>
    </div>
  );
};

export default PageCustomization;