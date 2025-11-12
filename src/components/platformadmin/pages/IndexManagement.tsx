import React, { useState, useEffect } from 'react';
import { 
  Card, 
  Typography, 
  Table, 
  Button, 
  Input, 
  Space, 
  Tag, 
  Modal,
  Form,
  Message,
  InputNumber,
  Pagination
} from '@arco-design/web-react';
import { 
  IconSearch, 
  IconPlus, 
  IconEdit,
  IconHistory,
  IconDelete
} from '@arco-design/web-react/icon';
import dayjs from 'dayjs';

const { Title, Text } = Typography;


/**
 * 指数数据接口定义
 */
interface IndexData {
  id: string;
  indexName: string;
  chineseName: string;
  latestIndex: number;
  changeRate: number;
  creator: string;
  createDate: string;
  updater: string;
  updateDate: string;
}

/**
 * 历史记录数据接口定义
 */
interface HistoryRecord {
  id: string;
  index: number;
  changeRate: number;
  updateDate: string;
  updater: string;
}

/**
 * 指数管理页面组件
 * @description 提供指数的增删改查功能，包含搜索、新建、编辑、历史记录查看等功能
 */
const IndexManagement: React.FC = () => {
  // 状态管理
  const [loading, setLoading] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [indexData, setIndexData] = useState<IndexData[]>([]);
  const [filteredData, setFilteredData] = useState<IndexData[]>([]);
  const [currentPage, setCurrent] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);

  // 弹窗状态
  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [historyModalVisible, setHistoryModalVisible] = useState(false);
  const [currentEditData, setCurrentEditData] = useState<IndexData | null>(null);
  const [historyData, setHistoryData] = useState<HistoryRecord[]>([]);

  // 表单实例
  const [createForm] = Form.useForm();
  const [editForm] = Form.useForm();

  /**
   * 初始化模拟数据
   */
  useEffect(() => {
    initMockData();
  }, []);

  /**
   * 初始化模拟数据
   */
  const initMockData = () => {
    const mockData: IndexData[] = [
      {
        id: '1',
        indexName: 'FAX',
        chineseName: '远东亚洲运价指数',
        latestIndex: 1250.5,
        changeRate: 2.3,
        creator: '张三',
        createDate: '2024-01-15 09:30:00',
        updater: '李四',
        updateDate: '2024-01-20 14:20:00'
      },
      {
        id: '2',
        indexName: 'FBX',
        chineseName: '波罗的海运价指数',
        latestIndex: 980.2,
        changeRate: -1.5,
        creator: '王五',
        createDate: '2024-01-10 11:15:00',
        updater: '赵六',
        updateDate: '2024-01-19 16:45:00'
      },
      {
        id: '3',
        indexName: 'FBX01',
        chineseName: '波罗的海1号线指数',
        latestIndex: 1580.8,
        changeRate: 4.2,
        creator: '孙七',
        createDate: '2024-01-08 08:20:00',
        updater: '周八',
        updateDate: '2024-01-18 10:30:00'
      },
      {
        id: '4',
        indexName: 'FBX03',
        chineseName: '波罗的海3号线指数',
        latestIndex: 750.3,
        changeRate: -0.8,
        creator: '吴九',
        createDate: '2024-01-12 13:45:00',
        updater: '郑十',
        updateDate: '2024-01-17 15:20:00'
      },
      {
        id: '5',
        indexName: 'FBX11',
        chineseName: '波罗的海11号线指数',
        latestIndex: 2100.7,
        changeRate: 6.5,
        creator: '陈一',
        createDate: '2024-01-05 07:30:00',
        updater: '林二',
        updateDate: '2024-01-16 12:10:00'
      },
      {
        id: '6',
        indexName: 'FBX13',
        chineseName: '波罗的海13号线指数',
        latestIndex: 1350.9,
        changeRate: 1.8,
        creator: '黄三',
        createDate: '2024-01-03 16:20:00',
        updater: '刘四',
        updateDate: '2024-01-15 09:40:00'
      }
    ];
    
    setIndexData(mockData);
    setFilteredData(mockData);
    setTotal(mockData.length);
  };

  /**
   * 搜索功能
   */
  useEffect(() => {
    if (!searchValue.trim()) {
      setFilteredData(indexData);
      setTotal(indexData.length);
    } else {
      const filtered = indexData.filter(item => 
        item.indexName.toLowerCase().includes(searchValue.toLowerCase())
      );
      setFilteredData(filtered);
      setTotal(filtered.length);
    }
    setCurrent(1); // 重置到第一页
  }, [searchValue, indexData]);

  /**
   * 处理搜索
   */
  const handleSearch = (value: string) => {
    setSearchValue(value);
  };

  /**
   * 查询数据
   */
  const handleQuery = () => {
    setLoading(true);
    setTimeout(() => {
      initMockData();
      setLoading(false);
      Message.success('查询完成');
    }, 1000);
  };

  /**
   * 打开新建弹窗
   */
  const handleCreate = () => {
    createForm.resetFields();
    setCreateModalVisible(true);
  };

  /**
   * 处理新建提交
   */
  const handleCreateSubmit = async () => {
    try {
      const values = await createForm.validate();
      const newIndex: IndexData = {
        id: Date.now().toString(),
        indexName: values.indexName,
        chineseName: values.chineseName,
        latestIndex: values.latestIndex,
        changeRate: values.changeRate || 0,
        creator: '当前用户',
        createDate: dayjs().format('YYYY-MM-DD HH:mm:ss'),
        updater: '当前用户',
        updateDate: dayjs().format('YYYY-MM-DD HH:mm:ss')
      };
      
      const newData = [...indexData, newIndex];
      setIndexData(newData);
      setCreateModalVisible(false);
      Message.success('指数创建成功');
    } catch (error) {
      console.error('表单验证失败:', error);
    }
  };

  /**
   * 打开编辑弹窗
   */
  const handleEdit = (record: IndexData) => {
    setCurrentEditData(record);
    editForm.setFieldsValue({
      indexName: record.indexName,
      chineseName: record.chineseName,
      latestIndex: record.latestIndex,
      changeRate: record.changeRate
    });
    setEditModalVisible(true);
  };

  /**
   * 处理编辑提交
   */
  const handleEditSubmit = async () => {
    try {
      const values = await editForm.validate();
      if (!currentEditData) return;
      
      const updatedData = indexData.map(item => 
        item.id === currentEditData.id 
          ? {
              ...item,
              indexName: values.indexName,
              chineseName: values.chineseName,
              latestIndex: values.latestIndex,
              changeRate: values.changeRate,
              updater: '当前用户',
              updateDate: dayjs().format('YYYY-MM-DD HH:mm:ss')
            }
          : item
      );
      
      setIndexData(updatedData);
      setEditModalVisible(false);
      setCurrentEditData(null);
      Message.success('指数更新成功');
    } catch (error) {
      console.error('表单验证失败:', error);
    }
  };

  /**
   * 查看历史记录
   */
  const handleViewHistory = (record: IndexData) => {
    // 模拟历史数据
    const mockHistory: HistoryRecord[] = [
      {
        id: '1',
        index: record.latestIndex,
        changeRate: record.changeRate,
        updateDate: record.updateDate,
        updater: record.updater
      },
      {
        id: '2',
        index: record.latestIndex - 50,
        changeRate: record.changeRate - 1.2,
        updateDate: dayjs(record.updateDate).subtract(1, 'day').format('YYYY-MM-DD HH:mm:ss'),
        updater: '历史用户1'
      },
      {
        id: '3',
        index: record.latestIndex - 100,
        changeRate: record.changeRate - 2.5,
        updateDate: dayjs(record.updateDate).subtract(2, 'day').format('YYYY-MM-DD HH:mm:ss'),
        updater: '历史用户2'
      }
    ];
    
    setHistoryData(mockHistory);
    setHistoryModalVisible(true);
  };

  /**
   * 删除指数
   */
  const handleDelete = (record: IndexData) => {
    Modal.confirm({
      title: '确认删除指数',
      content: (
        <div>
          <p>确定要删除指数 <strong>"{record.indexName}"</strong> 吗？</p>
          <p style={{ color: '#f53f3f', marginTop: '8px' }}>
            ⚠️ 此操作不可恢复，删除后将无法找回该指数的所有数据！
          </p>
        </div>
      ),
      okText: '确认删除',
      cancelText: '取消',
      okButtonProps: {
        status: 'danger'
      },
      onOk: () => {
        const newData = indexData.filter(item => item.id !== record.id);
        setIndexData(newData);
        Message.success(`指数 "${record.indexName}" 删除成功`);
      },
      onCancel: () => {
        Message.info('已取消删除操作');
      }
    });
  };

  /**
   * 分页变化处理
   */
  const handlePageChange = (page: number, size: number) => {
    setCurrent(page);
    setPageSize(size);
  };

  /**
   * 获取当前页数据
   */
  const getCurrentPageData = () => {
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    return filteredData.slice(startIndex, endIndex);
  };

  // 表格列配置
  const columns = [
    {
      title: '指数名称',
      dataIndex: 'indexName',
      key: 'indexName',
      width: 120,
      render: (text: string) => (
        <Tag color="blue" style={{ fontWeight: 'bold' }}>
          {text}
        </Tag>
      )
    },
    {
      title: '中文名称',
      dataIndex: 'chineseName',
      key: 'chineseName',
      width: 180,
      render: (text: string) => (
        <Text style={{ color: '#666', fontSize: '14px' }}>
          {text}
        </Text>
      )
    },
    {
      title: '最新指数',
      dataIndex: 'latestIndex',
      key: 'latestIndex',
      width: 120,
      render: (value: number) => (
        <Text style={{ fontWeight: 'bold', fontSize: '14px' }}>
          {value.toFixed(1)}
        </Text>
      )
    },
    {
      title: '涨跌幅度',
      dataIndex: 'changeRate',
      key: 'changeRate',
      width: 120,
      render: (rate: number) => (
        <Tag color={rate >= 0 ? 'green' : 'red'}>
          {rate >= 0 ? '+' : ''}{rate.toFixed(1)}%
        </Tag>
      )
    },
    {
      title: '创建人',
      dataIndex: 'creator',
      key: 'creator',
      width: 100
    },
    {
      title: '创建日期',
      dataIndex: 'createDate',
      key: 'createDate',
      width: 140,
      render: (date: string) => (
        <div>
          <div>{date.split(' ')[0]}</div>
          <div style={{ fontSize: '12px', color: '#999' }}>
            {date.split(' ')[1]}
          </div>
        </div>
      )
    },
    {
      title: '更新人',
      dataIndex: 'updater',
      key: 'updater',
      width: 100
    },
    {
      title: '更新日期',
      dataIndex: 'updateDate',
      key: 'updateDate',
      width: 140,
      render: (date: string) => (
        <div>
          <div>{date.split(' ')[0]}</div>
          <div style={{ fontSize: '12px', color: '#999' }}>
            {date.split(' ')[1]}
          </div>
        </div>
      )
    },
    {
      title: '操作',
      key: 'action',
      width: 200,
      fixed: 'right' as const,
      render: (_: any, record: IndexData) => (
        <div style={{ 
          display: 'flex', 
          flexDirection: 'column', 
          gap: '6px',
          padding: '4px 0'
        }}>
          {/* 第一行：编辑和历史按钮 */}
          <div style={{ display: 'flex', gap: '6px', justifyContent: 'center' }}>
            <Button 
              type="text" 
              size="small" 
              icon={<IconEdit />}
              onClick={() => handleEdit(record)}
              style={{ 
                flex: 1, 
                minWidth: '72px',
                height: '28px',
                fontSize: '12px',
                borderRadius: '4px'
              }}
            >
              编辑
            </Button>
            <Button 
              type="text" 
              size="small" 
              icon={<IconHistory />}
              onClick={() => handleViewHistory(record)}
              style={{ 
                flex: 1, 
                minWidth: '72px',
                height: '28px',
                fontSize: '12px',
                borderRadius: '4px'
              }}
            >
              历史
            </Button>
          </div>
          {/* 第二行：删除按钮 */}
          <div style={{ display: 'flex', gap: '6px', justifyContent: 'center' }}>
            <Button 
              type="text" 
              size="small" 
              status="danger"
              icon={<IconDelete />}
              onClick={() => handleDelete(record)}
              style={{ 
                flex: 1, 
                minWidth: '72px',
                height: '28px',
                fontSize: '12px',
                borderRadius: '4px'
              }}
            >
              删除
            </Button>
            {/* 占位元素，保持对称 */}
            <div style={{ flex: 1, minWidth: '72px' }}></div>
          </div>
        </div>
      )
    }
  ];

  // 历史记录表格列配置
  const historyColumns = [
    {
      title: '指数',
      dataIndex: 'index',
      key: 'index',
      render: (value: number) => value.toFixed(1)
    },
    {
      title: '涨跌幅度',
      dataIndex: 'changeRate',
      key: 'changeRate',
      render: (rate: number) => (
        <Tag color={rate >= 0 ? 'green' : 'red'}>
          {rate >= 0 ? '+' : ''}{rate.toFixed(1)}%
        </Tag>
      )
    },
    {
      title: '更新日期',
      dataIndex: 'updateDate',
      key: 'updateDate'
    },
    {
      title: '更新人',
      dataIndex: 'updater',
      key: 'updater'
    }
  ];

  return (
    <div className="p-6">
      <Card>
        <div className="mb-6">
          <Title heading={4} style={{ margin: 0, marginBottom: '16px' }}>
            指数管理
          </Title>
          <Text type="secondary">
            管理系统中的各类指数数据，包括FAX、FBX系列等指数的维护和监控
          </Text>
        </div>

        {/* 顶部筛选区 */}
        <div className="mb-4">
          <Space size="medium">
            <Input
              placeholder="请输入指数名称搜索"
              value={searchValue}
              onChange={handleSearch}
              style={{ width: 300 }}
              prefix={<IconSearch />}
              allowClear
            />
            <Button 
              icon={<IconSearch />} 
              onClick={handleQuery}
              loading={loading}
            >
              查询
            </Button>
          </Space>
        </div>

        {/* 功能按钮区 */}
        <div className="mb-4">
          <Button 
            type="primary" 
            icon={<IconPlus />}
            onClick={handleCreate}
          >
            新建指数
          </Button>
        </div>

        {/* 数据列表区 */}
        <Table
          columns={columns}
          data={getCurrentPageData()}
          loading={loading}
          pagination={false}
          scroll={{ x: 1200 }}
          rowKey="id"
        />

        {/* 分页组件 */}
        <div className="mt-4 flex justify-end">
          <Pagination
            current={currentPage}
            pageSize={pageSize}
            total={total}
            onChange={handlePageChange}
            sizeCanChange
            showJumper
            showTotal={(total, range) => 
              `第 ${range[0]}-${range[1]} 条，共 ${total} 条`
            }
            sizeOptions={[10, 20, 50, 100]}
          />
        </div>
      </Card>

      {/* 新建指数弹窗 */}
      <Modal
        title="新建指数"
        visible={createModalVisible}
        onOk={handleCreateSubmit}
        onCancel={() => setCreateModalVisible(false)}
        autoFocus={false}
        focusLock={true}
        style={{ maxHeight: '80vh' }}
      >
        <Form form={createForm} layout="vertical">
          <Form.Item
            label="指数名称"
            field="indexName"
            rules={[
              { required: true, message: '请输入指数名称' },
              { minLength: 2, message: '指数名称至少2个字符' }
            ]}
          >
            <Input placeholder="请输入指数名称，如：FAX、FBX等" />
          </Form.Item>
          <Form.Item
            label="中文名称"
            field="chineseName"
            rules={[
              { required: true, message: '请输入中文名称' },
              { minLength: 2, message: '中文名称至少2个字符' }
            ]}
          >
            <Input placeholder="请输入指数的中文名称" />
          </Form.Item>
          <Form.Item
            label="最新指数"
            field="latestIndex"
            rules={[
              { required: true, message: '请输入最新指数' },
              { type: 'number', min: 0, message: '指数值不能为负数' }
            ]}
          >
            <InputNumber 
              placeholder="请输入最新指数值" 
              style={{ width: '100%' }}
              precision={1}
            />
          </Form.Item>
          <Form.Item
            label="涨跌幅度(%)"
            field="changeRate"
            rules={[
              { type: 'number', message: '请输入有效的数字' }
            ]}
          >
            <InputNumber 
              placeholder="请输入涨跌幅度，可为负数" 
              style={{ width: '100%' }}
              precision={1}
            />
          </Form.Item>
        </Form>
      </Modal>

      {/* 编辑指数弹窗 */}
      <Modal
        title="编辑指数"
        visible={editModalVisible}
        onOk={handleEditSubmit}
        onCancel={() => {
          setEditModalVisible(false);
          setCurrentEditData(null);
        }}
        autoFocus={false}
        focusLock={true}
        style={{ maxHeight: '80vh' }}
      >
        <Form form={editForm} layout="vertical">
          <Form.Item
            label="指数名称"
            field="indexName"
            rules={[
              { required: true, message: '请输入指数名称' },
              { minLength: 2, message: '指数名称至少2个字符' }
            ]}
          >
            <Input placeholder="请输入指数名称" />
          </Form.Item>
          <Form.Item
            label="中文名称"
            field="chineseName"
            rules={[
              { required: true, message: '请输入中文名称' },
              { minLength: 2, message: '中文名称至少2个字符' }
            ]}
          >
            <Input placeholder="请输入指数的中文名称" />
          </Form.Item>
          <Form.Item
            label="最新指数"
            field="latestIndex"
            rules={[
              { required: true, message: '请输入最新指数' },
              { type: 'number', min: 0, message: '指数值不能为负数' }
            ]}
          >
            <InputNumber 
              placeholder="请输入最新指数值" 
              style={{ width: '100%' }}
              precision={1}
            />
          </Form.Item>
          <Form.Item
            label="涨跌幅度(%)"
            field="changeRate"
            rules={[
              { type: 'number', message: '请输入有效的数字' }
            ]}
          >
            <InputNumber 
              placeholder="请输入涨跌幅度" 
              style={{ width: '100%' }}
              precision={1}
            />
          </Form.Item>
        </Form>
      </Modal>

      {/* 历史记录弹窗 */}
      <Modal
        title="历史记录"
        visible={historyModalVisible}
        onCancel={() => setHistoryModalVisible(false)}
        footer={null}
        style={{ maxHeight: '80vh', width: '800px' }}
      >
        <Table
          columns={historyColumns}
          data={historyData}
          pagination={false}
          size="small"
          rowKey="id"
        />
      </Modal>
    </div>
  );
};

export default IndexManagement;