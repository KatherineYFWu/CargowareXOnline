import React, { useState, useEffect } from 'react';
import {
  Card,
  Table,
  Button,
  Input,
  Select,
  Space,
  Modal,
  Form,
  Message,
  Popconfirm
} from '@arco-design/web-react';
import {
  IconSearch,
  IconPlus,
  IconEdit,
  IconDelete,
  IconRefresh
} from '@arco-design/web-react/icon';

/**
 * 类目数据接口定义
 */
interface Category {
  id: string;
  name: string;
  nameEn: string; // 类目名称（英文）
  parentId?: string;
  parentName?: string;
  level: number;
  sort: number;
  createTime: string;
  creator: string; // 创建人
  lastUpdateTime: string; // 最后更新时间
  lastUpdater: string; // 最后更新人
  hasApplications?: boolean; // 是否存在关联应用
  applicationCount?: number; // 关联应用数量
}

/**
 * 类目管理页面组件
 * @description 管理应用类目的增删改查操作
 */
const CategoryManagement: React.FC = () => {
  // 状态管理
  const [categoryData, setCategoryData] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState('');

  const [selectedRowKeys, setSelectedRowKeys] = useState<string[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [form] = Form.useForm();
  const [showApplicationWarning, setShowApplicationWarning] = useState(false);

  /**
   * 初始化模拟数据
   */
  useEffect(() => {
    loadCategoryData();
  }, []);

  /**
   * 加载类目数据
   */
  const loadCategoryData = async () => {
    setLoading(true);
    try {
      // 模拟API调用
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockData: Category[] = [
        {
          id: '1',
          name: 'AI创新场',
          nameEn: 'AI Innovation',
          level: 1,
          sort: 1,
          createTime: '2024-01-01 10:00:00',
          creator: '管理员',
          lastUpdateTime: '2024-01-15 14:30:00',
          lastUpdater: '张三',
          hasApplications: true,
          applicationCount: 5
        },
        {
          id: '2',
          name: '海关专区',
          nameEn: 'Customs Zone',
          level: 1,
          sort: 2,
          createTime: '2024-01-01 10:00:00',
          creator: '管理员',
          lastUpdateTime: '2024-01-15 14:30:00',
          lastUpdater: '李四'
        },
        {
          id: '3',
          name: '美加专区',
          nameEn: 'US & Canada Zone',
          parentId: '2',
          parentName: '海关专区',
          level: 2,
          sort: 1,
          createTime: '2024-01-01 10:00:00',
          creator: '王五',
          lastUpdateTime: '2024-01-15 14:30:00',
          lastUpdater: '赵六',
          hasApplications: true,
          applicationCount: 3
        },
        {
          id: '4',
          name: '欧盟业务',
          nameEn: 'EU Business',
          parentId: '2',
          parentName: '海关专区',
          level: 2,
          sort: 2,
          createTime: '2024-01-01 10:00:00',
          creator: '王五',
          lastUpdateTime: '2024-01-15 14:30:00',
          lastUpdater: '钱七'
        },
        {
          id: '5',
          name: '中国业务',
          nameEn: 'China Business',
          parentId: '2',
          parentName: '海关专区',
          level: 2,
          sort: 3,
          createTime: '2024-01-01 10:00:00',
          creator: '孙八',
          lastUpdateTime: '2024-01-15 14:30:00',
          lastUpdater: '周九'
        },
        {
          id: '6',
          name: '智慧物流系统',
          nameEn: 'Smart Logistics System',
          level: 1,
          sort: 3,
          createTime: '2024-01-01 10:00:00',
          creator: '管理员',
          lastUpdateTime: '2024-01-15 14:30:00',
          lastUpdater: '吴十',
          hasApplications: true,
          applicationCount: 8
        },
        {
          id: '7',
          name: '定制门户',
          nameEn: 'Custom Portal',
          parentId: '6',
          parentName: '智慧物流系统',
          level: 2,
          sort: 1,
          createTime: '2024-01-01 10:00:00',
          creator: '管理员',
          lastUpdateTime: '2024-01-15 14:30:00',
          lastUpdater: '系统管理员'
        },
        {
          id: '8',
          name: '经纪代理',
          nameEn: 'Brokerage Agency',
          level: 1,
          sort: 4,
          createTime: '2024-01-01 10:00:00',
          creator: '管理员',
          lastUpdateTime: '2024-01-15 14:30:00',
          lastUpdater: '系统管理员'
        },
        {
          id: '9',
          name: '美国业务',
          nameEn: 'US Business',
          parentId: '8',
          parentName: '经纪代理',
          level: 2,
          sort: 1,
          createTime: '2024-01-01 10:00:00',
          creator: '管理员',
          lastUpdateTime: '2024-01-15 14:30:00',
          lastUpdater: '系统管理员'
        },
        {
          id: '10',
          name: '订舱门户',
          nameEn: 'Booking Portal',
          level: 1,
          sort: 5,
          createTime: '2024-01-01 10:00:00',
          creator: '管理员',
          lastUpdateTime: '2024-01-15 14:30:00',
          lastUpdater: '系统管理员'
        },
        {
          id: '11',
          name: '船东',
          nameEn: 'Ship Owner',
          parentId: '10',
          parentName: '订舱门户',
          level: 2,
          sort: 1,
          createTime: '2024-01-01 10:00:00',
          creator: '管理员',
          lastUpdateTime: '2024-01-15 14:30:00',
          lastUpdater: '系统管理员'
        },
        {
          id: '12',
          name: '工具箱',
          nameEn: 'Toolbox',
          level: 1,
          sort: 6,
          createTime: '2024-01-01 10:00:00',
          creator: '管理员',
          lastUpdateTime: '2024-01-15 14:30:00',
          lastUpdater: '系统管理员'
        },
        {
          id: '13',
          name: '可视化',
          nameEn: 'Visualization',
          parentId: '12',
          parentName: '工具箱',
          level: 2,
          sort: 1,
          createTime: '2024-01-01 10:00:00',
          creator: '管理员',
          lastUpdateTime: '2024-01-15 14:30:00',
          lastUpdater: '系统管理员'
        },
        {
          id: '14',
          name: '实用助手',
          nameEn: 'Utility Helper',
          parentId: '12',
          parentName: '工具箱',
          level: 2,
          sort: 2,
          createTime: '2024-01-01 10:00:00',
          creator: '管理员',
          lastUpdateTime: '2024-01-15 14:30:00',
          lastUpdater: '系统管理员'
        }
      ];
      
      setCategoryData(mockData);
    } catch (error) {
      Message.error('加载类目数据失败');
    } finally {
      setLoading(false);
    }
  };

  /**
   * 筛选数据
   */
  const filteredData = categoryData.filter(item => {
    const matchKeyword = !searchKeyword || 
      item.name.toLowerCase().includes(searchKeyword.toLowerCase()) ||
      (item.nameEn && item.nameEn.toLowerCase().includes(searchKeyword.toLowerCase()));
    
    const matchStatus = true;
    
    return matchKeyword && matchStatus;
  });

  /**
   * 处理搜索
   */
  const handleSearch = () => {
    // 搜索逻辑已在 filteredData 中实现
    Message.success('搜索完成');
  };

  /**
   * 重置搜索条件
   */
  const handleReset = () => {
    setSearchKeyword('');
    Message.success('已重置搜索条件');
  };

  /**
   * 打开新增/编辑弹窗
   */
  const openModal = (category?: Category) => {
    setEditingCategory(category || null);
    setModalVisible(true);
    
    if (category) {
      form.setFieldsValue({
        name: category.name,
        nameEn: category.nameEn,
        parentId: category.parentId,
        sort: category.sort
      });
    } else {
      form.resetFields();
    }
  };

  /**
   * 关闭弹窗
   */
  const closeModal = () => {
    setModalVisible(false);
    setEditingCategory(null);
    form.resetFields();
  };

  /**
   * 保存类目
   */
  const handleSave = async () => {
    try {
      const values = await form.validate();
      
      if (editingCategory) {
        // 编辑模式
        const updatedData = categoryData.map(item => 
          item.id === editingCategory.id 
            ? { ...item, ...values, lastUpdateTime: new Date().toLocaleString(), lastUpdater: '当前用户' }
            : item
        );
        setCategoryData(updatedData);
        Message.success('类目更新成功');
      } else {
        // 新增模式
        const newCategory: Category = {
          id: Date.now().toString(),
          ...values,
          level: values.parentId ? 2 : 1,
          createTime: new Date().toLocaleString(),
          creator: '当前用户',
          lastUpdateTime: new Date().toLocaleString(),
          lastUpdater: '当前用户'
        };
        
        // 如果有父类目，设置父类目名称
        if (values.parentId) {
          const parentCategory = categoryData.find(item => item.id === values.parentId);
          if (parentCategory) {
            newCategory.parentName = parentCategory.name;
          }
        }
        
        setCategoryData([...categoryData, newCategory]);
        Message.success('类目创建成功');
      }
      
      closeModal();
    } catch (error) {
      Message.error('保存失败，请检查输入信息');
    }
  };

  /**
   * 单个删除类目
   * @param categoryId 类目ID
   */
  const handleDelete = (categoryId: string) => {
    // 检查是否有子类目
    const hasChildren = categoryData.some(item => item.parentId === categoryId);
    if (hasChildren) {
      Message.error('该类目下存在子类目，无法删除');
      return;
    }
    
    // 检查类目下是否存在应用
    const category = categoryData.find(item => item.id === categoryId);
    if (category?.hasApplications) {
      setShowApplicationWarning(true);
      return;
    }
    
    // 执行删除操作
    const updatedData = categoryData.filter(item => item.id !== categoryId);
    setCategoryData(updatedData);
    Message.success('类目删除成功');
  };



  /**
   * 批量删除类目
   */
  const handleBatchDelete = () => {
    if (selectedRowKeys.length === 0) {
      Message.warning('请选择要删除的类目');
      return;
    }
    
    // 检查是否有子类目
    const hasChildren = selectedRowKeys.some(id => 
      categoryData.some(item => item.parentId === id)
    );
    
    if (hasChildren) {
      Message.error('选中的类目中存在有子类目的项，无法删除');
      return;
    }
    
    // 检查选中的类目中是否存在应用
    const hasApplications = selectedRowKeys.some(id => {
      const category = categoryData.find(item => item.id === id);
      return category?.hasApplications;
    });
    
    if (hasApplications) {
      setShowApplicationWarning(true);
      return;
    }
    
    // 执行批量删除操作
    const updatedData = categoryData.filter(item => !selectedRowKeys.includes(item.id));
    setCategoryData(updatedData);
    setSelectedRowKeys([]);
    Message.success(`成功删除 ${selectedRowKeys.length} 个类目`);
  };



  /**
   * 渲染层级标识
   */
  const renderLevelIndicator = (level: number, name: string) => {
    const indent = '　'.repeat((level - 1) * 2);
    const prefix = level > 1 ? '└─ ' : '';
    return (
      <span>
        {indent}{prefix}{name}
      </span>
    );
  };

  /**
   * 表格列配置
   */
  const columns = [
    {
      title: '类目名称',
      dataIndex: 'name',
      key: 'name',
      render: (name: string, record: Category) => renderLevelIndicator(record.level, name)
    },
    {
      title: '英文名称',
      dataIndex: 'nameEn',
      key: 'nameEn',
      render: (nameEn?: string) => nameEn || '-'
    },
    {
      title: '父类目',
      dataIndex: 'parentName',
      key: 'parentName',
      render: (parentName?: string) => parentName || '-'
    },
    {
      title: '层级',
      dataIndex: 'level',
      key: 'level',
      render: (categoryLevel: number) => `第${categoryLevel}级`
    },
    {
      title: '排序',
      dataIndex: 'sort',
      key: 'sort'
    },
    {
      title: '创建人',
      dataIndex: 'creator',
      key: 'creator'
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      key: 'createTime'
    },
    {
      title: '最后更新人',
      dataIndex: 'lastUpdater',
      key: 'lastUpdater'
    },
    {
      title: '最后更新时间',
      dataIndex: 'lastUpdateTime',
      key: 'lastUpdateTime'
    },
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: Category) => (
        <Space>
          <Button
            type="text"
            size="small"
            icon={<IconEdit />}
            onClick={() => openModal(record)}
          >
            编辑
          </Button>
          <Popconfirm
            title="确定要删除这个类目吗？"
            onOk={() => handleDelete(record.id)}
            okText="确定"
            cancelText="取消"
          >
            <Button
              type="text"
              size="small"
              status="danger"
              icon={<IconDelete />}
            >
              删除
            </Button>
          </Popconfirm>
        </Space>
      )
    }
  ];

  /**
   * 获取父类目选项（只显示一级类目）
   */
  const getParentCategoryOptions = () => {
    return categoryData
      .filter(item => item.level === 1)
      .map(item => ({
        label: item.name,
        value: item.id
      }));
  };

  return (
    <div style={{ padding: '24px', backgroundColor: '#ffffff' }}>
      {/* 搜索筛选区域 */}
      <Card style={{ marginBottom: '16px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '16px', alignItems: 'flex-end' }}>
          <div>
            <div style={{ marginBottom: '4px', fontSize: '14px', color: '#666' }}>类目名称</div>
            <Input
              placeholder="请输入类目名称"
              value={searchKeyword}
              onChange={setSearchKeyword}
              allowClear
            />
          </div>
          

          
          <div style={{ display: 'flex', gap: '8px' }}>
            <Button type="primary" icon={<IconSearch />} onClick={handleSearch}>
              搜索
            </Button>
            <Button icon={<IconRefresh />} onClick={handleReset}>
              重置
            </Button>
          </div>
        </div>
      </Card>

      {/* 操作按钮区域 */}
      <div style={{ marginBottom: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', gap: '8px' }}>
          <Button type="primary" icon={<IconPlus />} onClick={() => openModal()}>
            新增类目
          </Button>
          {selectedRowKeys.length > 0 && (
            <Popconfirm
              title={`确定要删除选中的 ${selectedRowKeys.length} 个类目吗？`}
              onOk={handleBatchDelete}
              okText="确定"
              cancelText="取消"
            >
              <Button status="danger" icon={<IconDelete />}>
                批量删除
              </Button>
            </Popconfirm>
          )}
        </div>
        {selectedRowKeys.length > 0 && (
          <div style={{ fontSize: '14px', color: '#666' }}>
            已选择 {selectedRowKeys.length} 项
          </div>
        )}
      </div>

      {/* 表格 */}
      <Card>
        <Table
          columns={columns}
          data={filteredData}
          loading={loading}
          rowKey="id"
          rowSelection={{
            selectedRowKeys,
            onChange: (selectedKeys: (string | number)[]) => {
              const newSelectedKeys = new Set(selectedKeys as string[]);
              
              // 获取当前操作的差异
              const previousKeys = new Set(selectedRowKeys);
              const addedKeys = (selectedKeys as string[]).filter(key => !previousKeys.has(key));
              const removedKeys = selectedRowKeys.filter(key => !selectedKeys.includes(key));
              
              // 处理新增选择的项
              addedKeys.forEach(key => {
                const category = categoryData.find(item => item.id === key);
                if (category && category.level === 1) {
                  // 如果选中的是一级类目，自动选中其所有子类目
                  const children = categoryData.filter(item => item.parentId === category.id);
                  children.forEach(child => {
                    newSelectedKeys.add(child.id);
                  });
                }
              });
              
              // 处理取消选择的项
              removedKeys.forEach(key => {
                const category = categoryData.find(item => item.id === key);
                if (category && category.level === 1) {
                  // 如果取消选中的是一级类目，自动取消选中其所有子类目
                  const children = categoryData.filter(item => item.parentId === category.id);
                  children.forEach(child => {
                    newSelectedKeys.delete(child.id);
                  });
                }
              });
              
              setSelectedRowKeys(Array.from(newSelectedKeys));
            }
          }}
          pagination={{
            total: filteredData.length,
            pageSize: 10,
            showTotal: true,
            showJumper: true,
            sizeCanChange: true
          }}
        />
      </Card>

      {/* 新增/编辑弹窗 */}
      <Modal
        title={editingCategory ? '编辑类目' : '新增类目'}
        visible={modalVisible}
        onOk={handleSave}
        onCancel={closeModal}
        okText="保存"
        cancelText="取消"
style={{ width: 600 }}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            label="类目名称"
            field="name"
            rules={[
              { required: true, message: '请输入类目名称' },
              { maxLength: 50, message: '类目名称不能超过50个字符' }
            ]}
          >
            <Input placeholder="请输入类目名称" />
          </Form.Item>
          
          <Form.Item
            label="英文名称"
            field="nameEn"
            rules={[
              { maxLength: 50, message: '英文名称不能超过50个字符' }
            ]}
          >
            <Input placeholder="请输入英文名称" />
          </Form.Item>
          
          <Form.Item
            label="父类目"
            field="parentId"
          >
            <Select
              placeholder="请选择父类目（不选择则为一级类目）"
              options={getParentCategoryOptions()}
              allowClear
            />
          </Form.Item>
          
          <Form.Item
            label="排序"
            field="sort"
            rules={[
              { required: true, message: '请输入排序值' },
              { type: 'number', min: 1, max: 999, message: '排序值必须在1-999之间' }
            ]}
            initialValue={1}
          >
            <Input type="number" placeholder="请输入排序值" />
          </Form.Item>
          

        </Form>
      </Modal>
      
      {/* 应用关联警告弹窗 */}
      <Modal
        title="删除提示"
        visible={showApplicationWarning}
        onCancel={() => setShowApplicationWarning(false)}
        footer={[
          <Button key="close" onClick={() => setShowApplicationWarning(false)}>
            关闭
          </Button>
        ]}
        style={{ width: 400 }}
      >
        <div style={{ textAlign: 'center', padding: '20px 0' }}>
          <p>类目下存在应用，请移除后再删除类目</p>
        </div>
      </Modal>
      </div>
    );
};

export default CategoryManagement;