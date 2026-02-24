import React, { useState } from 'react';
import { 
  Table, 
  Button, 
  Space, 
  Card, 
  Tag,
  Message,
  Form,
  Input,
  Select,
  DatePicker,
  Grid,
  Badge
} from '@arco-design/web-react';
import { 
  IconDownload,
  IconList,
  IconEdit,
  IconDelete,
  IconSearch,
  IconRefresh
} from '@arco-design/web-react/icon';

const { Row, Col } = Grid;
const { RangePicker } = DatePicker;

interface InquiryItem {
  key: string;
  inquiryNo: string;
  status: string;
  type: string;
  origin: string;
  destination: string;
  createTime: string;
  validUntil: string;
  preCarriageStatus: string;
  mainCarriageStatus: string;
  onCarriageStatus: string;
}

const InquiryManagement: React.FC = () => {
  const [selectedRowKeys, setSelectedRowKeys] = useState<(string | number)[]>([]);
  const [readIds, setReadIds] = useState<string[]>(() => {
    try {
      // 更改 key 以重置状态，用于演示
      return JSON.parse(localStorage.getItem('inquiry_read_ids_demo_v1') || '[]');
    } catch {
      return [];
    }
  });
  const [form] = Form.useForm();

  // 检查是否未读
  const isUnread = (record: InquiryItem) => {
    const unread = record.preCarriageStatus === '已报价' && 
           record.mainCarriageStatus === '已报价' && 
           record.onCarriageStatus === '已报价' && 
           !readIds.includes(record.key);
    return unread;
  };

  // 更新全局未读状态
  React.useEffect(() => {
    // 计算当前是否有未读项
    // 注意：这里的 data 是在组件内部定义的，如果 data 是动态获取的，应该放在 useEffect 依赖里
    // 由于 data 目前是模拟的静态数据（每次渲染重新生成），我们需要将其固定下来或者在这里直接计算
    // 为了演示，我们将 data 移到组件外或使用 useMemo，这里暂时在 effect 里重新生成一遍用于计算（这在真实项目中不好，但在 demo 中可行）
    // 或者更好的是，我们将 data 定义在组件外
  }, [readIds]);

  const handleEdit = (record: InquiryItem) => {
    if (isUnread(record)) {
      const newReadIds = [...readIds, record.key];
      setReadIds(newReadIds);
      localStorage.setItem('inquiry_read_ids_demo_v1', JSON.stringify(newReadIds));
      window.dispatchEvent(new CustomEvent('INQUIRY_UNREAD_UPDATE'));
    }
    Message.info(`编辑询价单：${record.inquiryNo}`);
  };

  const handleSearch = async () => {
    try {
      const values = await form.validate();
      console.log('搜索条件:', values);
      Message.info('搜索功能开发中...');
    } catch (error) {
      console.error('表单验证失败:', error);
    }
  };

  const handleReset = () => {
    form.resetFields();
    Message.info('重置成功');
  };

  // 表格列定义
  const columns = [
    {
      title: '询价编号',
      dataIndex: 'inquiryNo',
      width: 150,
      render: (value: string, record: InquiryItem) => (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          {isUnread(record) && (
            <div className="premium-red-dot animate" style={{ marginRight: 8 }} />
          )}
          <a href="#" className="text-blue-600">{value}</a>
        </div>
      ),
    },
    {
      title: '询价来源',
      dataIndex: 'source',
      width: 100,
      render: () => '内部',
    },
    {
      title: '询价人',
      dataIndex: 'inquirer',
      width: 100,
      render: (_: unknown, record: InquiryItem) => ['张三', '李四', '王五', '赵六'][Number(record.key) % 4],
    },
    {
      title: '询价状态',
      dataIndex: 'status',
      width: 120,
      render: (value: string) => {
        const colorMap: Record<string, string> = {
          '待报价': 'orange',
          '已报价': 'green',
          '已失效': 'red',
          '已确认': 'blue',
          '草稿': 'gray',
          '已提交': 'cyan',
          '拒绝报价': 'red'
        };
        return <Tag color={colorMap[value]}>{value}</Tag>;
      },
    },
    {
      title: '头程报价状态',
      dataIndex: 'preCarriageStatus',
      width: 120,
      render: (value: string) => {
        const colorMap: Record<string, string> = { '待报价': 'orange', '已报价': 'green', '拒绝报价': 'red' };
        return <Tag color={colorMap[value]}>{value}</Tag>;
      },
    },
    {
      title: '干线报价状态',
      dataIndex: 'mainCarriageStatus',
      width: 120,
      render: (value: string) => {
        const colorMap: Record<string, string> = { '待报价': 'orange', '已报价': 'green', '拒绝报价': 'red' };
        return <Tag color={colorMap[value]}>{value}</Tag>;
      },
    },
    {
      title: '尾程报价状态',
      dataIndex: 'onCarriageStatus',
      width: 120,
      render: (value: string) => {
        const colorMap: Record<string, string> = { '待报价': 'orange', '已报价': 'green', '拒绝报价': 'red' };
        return <Tag color={colorMap[value]}>{value}</Tag>;
      },
    },
    {
      title: '箱型箱量',
      dataIndex: 'containerInfo',
      width: 150,
      render: () => '1*20GP+2*40HC',
    },
    {
      title: '操作',
      width: 200,
      fixed: 'right' as const,
      render: (_: unknown, record: InquiryItem) => (
        <Space>
          <Button 
            type="text" 
            size="small" 
            render={() => <span>详情</span>}
            onClick={() => handleEdit(record)}
          >
             详情
          </Button>
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
            render={() => <span>更多</span>}
          >
             更多
          </Button>
        </Space>
      ),
    }
  ];

  // 模拟数据 - 使用 useMemo 保证数据稳定，同时根据 readIds 排序
  const data: InquiryItem[] = React.useMemo(() => {
    const rawData = Array(10).fill(null).map((_, index) => {
      // 构造前几个为“已报价”且可能未读的数据
      const isQuoted = index < 3; 
      
      return {
        key: `${index}`,
        inquiryNo: `R2024${String(index + 1).padStart(4, '0')}`,
        status: isQuoted ? '已报价' : ['草稿', '已提交'][index % 2],
        type: ['海运', '空运', '铁运', '公路'][index % 4],
        origin: ['深圳', '上海', '广州', '青岛'][index % 4],
        destination: ['汉堡', '鹿特丹', '洛杉矶', '迪拜'][index % 4],
        createTime: '2024-03-15 14:30:00',
        validUntil: '2024-04-15 23:59:59',
        preCarriageStatus: isQuoted ? '已报价' : (index === 3 ? '拒绝报价' : '待报价'),
        mainCarriageStatus: isQuoted ? '已报价' : (index === 4 ? '已报价' : '待报价'),
        onCarriageStatus: isQuoted ? '已报价' : (index === 5 ? '拒绝报价' : '待报价'),
      };
    });

    // 添加两条额外的未读询价数据
    const extraData: InquiryItem[] = [
      {
        key: '9998',
        inquiryNo: 'R20249998',
        status: '已报价',
        type: '海运',
        origin: '宁波',
        destination: '纽约',
        createTime: '2024-03-16 09:15:00',
        validUntil: '2024-04-16 23:59:59',
        preCarriageStatus: '已报价',
        mainCarriageStatus: '已报价',
        onCarriageStatus: '已报价'
      },
      {
        key: '9999',
        inquiryNo: 'R20249999',
        status: '已报价',
        type: '空运',
        origin: '北京',
        destination: '伦敦',
        createTime: '2024-03-16 10:20:00',
        validUntil: '2024-04-16 23:59:59',
        preCarriageStatus: '已报价',
        mainCarriageStatus: '已报价',
        onCarriageStatus: '已报价'
      }
    ];

    // 合并数据
    const allData = [...rawData, ...extraData];

    // 排序：未读置顶
    return allData.sort((a, b) => {
      const aUnread = isUnread(a);
      const bUnread = isUnread(b);
      if (aUnread && !bUnread) return -1;
      if (!aUnread && bUnread) return 1;
      return 0;
    });
  }, [readIds]); // 当 readIds 变化时重新排序

  // 监听数据变化，更新全局未读数量
  React.useEffect(() => {
    const unreadCount = data.filter(item => isUnread(item)).length;
    localStorage.setItem('inquiry_unread_count', String(unreadCount));
    window.dispatchEvent(new CustomEvent('INQUIRY_UNREAD_UPDATE'));
  }, [data, readIds]);

  const pagination = {
    showTotal: true,
    total: 100,
    pageSize: 10,
    current: 1,
    showJumper: true,
    sizeCanChange: true,
    pageSizeChangeResetCurrent: true,
    sizeOptions: [10, 20, 50, 100],
  };

  return (
    <>
      {/* 筛选区 */}
      <Card className="mb-4">
        <Form
          form={form}
          layout="horizontal"
          className="search-form"
        >
          <Row gutter={24}>
            <Col span={8}>
              <Form.Item label="询价编号" field="inquiryNo">
                <Input placeholder="请输入询价编号" allowClear />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="状态" field="status">
                <Select
                  placeholder="请选择状态"
                  allowClear
                  options={[
                    { label: '待报价', value: '待报价' },
                    { label: '已报价', value: '已报价' },
                    { label: '已失效', value: '已失效' },
                    { label: '已确认', value: '已确认' }
                  ]}
                />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="运输类型" field="type">
                <Select
                  placeholder="请选择运输类型"
                  allowClear
                  options={[
                    { label: '海运', value: '海运' },
                    { label: '空运', value: '空运' },
                    { label: '铁运', value: '铁运' },
                    { label: '公路', value: '公路' }
                  ]}
                />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={24}>
            <Col span={8}>
              <Form.Item label="起运地" field="origin">
                <Input placeholder="请输入起运地" allowClear />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="目的地" field="destination">
                <Input placeholder="请输入目的地" allowClear />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="创建日期" field="dateRange">
                <RangePicker style={{ width: '100%' }} />
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={24} style={{ textAlign: 'right' }}>
              <Space>
                <Button type="secondary" icon={<IconRefresh />} onClick={handleReset}>
                  重置
                </Button>
                <Button type="primary" icon={<IconSearch />} onClick={handleSearch}>
                  搜索
                </Button>
              </Space>
            </Col>
          </Row>
        </Form>
      </Card>

      {/* 数据表格卡片 */}
      <Card>
        <div className="flex justify-between items-center mb-4">
          <Space>
            <Button icon={<IconDownload />}>导出数据</Button>
          </Space>
          <Button 
            icon={<IconList />}
            onClick={() => {
              Message.info('自定义表格功能开发中...');
            }}
          >
            自定义表格
          </Button>
        </div>
        
        <Table
          rowKey="key"
          columns={columns}
          data={data}
          rowSelection={{
            selectedRowKeys,
            onChange: (selectedRowKeys) => setSelectedRowKeys(selectedRowKeys),
          }}
          pagination={pagination}
          scroll={{ x: 1500 }}
          border={false}
          className="mt-4"
        />
      </Card>
    </>
  );
};

export default InquiryManagement; 