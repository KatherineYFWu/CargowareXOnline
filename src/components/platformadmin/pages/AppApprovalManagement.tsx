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
  Typography,
  Tag,
  Descriptions,
  Message,
  Radio,
  Upload
} from '@arco-design/web-react';
import { IconSearch, IconRefresh, IconEye, IconCheck, IconClose, IconUpload, IconLeft, IconRight, IconPlus, IconStop } from '@arco-design/web-react/icon';

const { Title } = Typography;
const { Option } = Select;
const { TextArea } = Input;

/**
 * 应用数据接口 - 与应用列表页面保持一致
 */
interface Application {
  id: string;
  nameZh: string; // 应用名称（中文）
  nameEn: string; // 应用名称（英文）
  descriptionZh: string; // 描述（中文）
  descriptionEn: string; // 描述（英文）
  status: 'online' | 'offline'; // 状态：上架、下架
  category: string[]; // 归属分类（支持多级分类）
  appUrl: string; // 应用URL（跳转路由地址）
  icon?: string; // 应用图标URL
  requiresAgreement: boolean; // 是否需要协议
  agreementFile?: string; // 协议文件URL
  creator: string; // 创建人
  createTime: string; // 创建时间
  lastModifier: string; // 最后修改人
  lastModifyTime: string; // 最后修改时间
}

/**
 * 开通审核申请数据接口
 */
interface ApprovalApplication {
  id: string;
  /** 申请编号 */
  applicationNo: string;
  /** 应用名称（中文） */
  appNameCn: string;
  /** 应用名称（英文） */
  appNameEn: string;
  /** 申请企业 */
  companyName: string;
  /** 申请人 */
  applicantName: string;
  /** 申请人联系方式 */
  applicantContact: string;
  /** 申请时间 */
  applicationTime: string;
  /** 审核状态 */
  status: 'pending' | 'approved' | 'rejected';
  /** 申请类型 */
  applicationType: 'force' | 'self';
  /** 协议文件URL */
  agreementFileUrl?: string;
  /** 协议文件名 */
  agreementFileName?: string;
  /** 审核意见 */
  reviewComment?: string;
  /** 审核人 */
  reviewer?: string;
  /** 审核时间 */
  reviewTime?: string;
}

/**
 * 搜索筛选参数接口
 */
interface SearchParams {
  keyword: string;
  status: string;
  applicationType: string;
  applicationTimeRange: string[];
}

// 审核状态选项
const statusOptions = [
  { value: '', label: '全部状态' },
  { value: 'pending', label: '待审核' },
  { value: 'approved', label: '已通过' },
  { value: 'rejected', label: '已拒绝' }
];

// 申请类型选项
const applicationTypeOptions = [
  { value: '', label: '全部类型' },
  { value: 'force', label: '强制开通' },
  { value: 'self', label: '自助申请' }
];

/**
 * 开通审核管理组件
 * @description 管理应用开通审核申请，支持查看详情、审核通过/拒绝等操作
 * @author 开发者
 * @date 2024-01-15
 */
const AppApprovalManagement: React.FC = () => {
  // 组件状态管理
  const [loading, setLoading] = useState(false);
  const [dataSource, setDataSource] = useState<ApprovalApplication[]>([]);
  const [searchParams, setSearchParams] = useState<SearchParams>({
    keyword: '',
    status: '',
    applicationType: '',
    applicationTimeRange: []
  });
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0
  });
  
  // 弹窗状态
  const [detailVisible, setDetailVisible] = useState(false);
  const [reviewVisible, setReviewVisible] = useState(false);
  const [currentRecord, setCurrentRecord] = useState<ApprovalApplication | null>(null);
  
  // 表单实例
  const [reviewForm] = Form.useForm();
  
  // 强制开通弹窗状态
  const [forceActivateVisible, setForceActivateVisible] = useState(false);
  const [forceActivateStep, setForceActivateStep] = useState(1);
  const [selectedApp, setSelectedApp] = useState<string>('');
  const [selectedCompany, setSelectedCompany] = useState<string>('');
  const [disableConfirmVisible, setDisableConfirmVisible] = useState(false);
  const [currentDisableRecord, setCurrentDisableRecord] = useState<ApprovalApplication | null>(null);
  const [companySearchParams, setCompanySearchParams] = useState({ code: '', name: '' });
  const [companyList, setCompanyList] = useState<any[]>([]);
  const [agreementFile, setAgreementFile] = useState<any>(null);
  
  // 表单实例
  const [forceActivateForm] = Form.useForm();

  /**
   * 初始化示例数据
   */
  useEffect(() => {
    const mockData: ApprovalApplication[] = [
      {
        id: '1',
        applicationNo: 'APP20240115001',
        appNameCn: 'ICS2申报',
        appNameEn: 'ICS2 Declaration',
        companyName: '上海贸易有限公司',
        applicantName: '张三',
        applicantContact: '13800138000',
        applicationTime: '2024-01-15 10:30:00',
        status: 'pending',
        applicationType: 'self',
        agreementFileUrl: '/files/agreement_001.pdf',
        agreementFileName: '服务协议_上海贸易有限公司.pdf'
      },
      {
        id: '2',
        applicationNo: 'APP20240114002',
        appNameCn: '美国清关',
        appNameEn: 'US Customs Clearance',
        companyName: '深圳物流科技公司',
        applicantName: '李四',
        applicantContact: '13900139000',
        applicationTime: '2024-01-14 14:20:00',
        status: 'approved',
        applicationType: 'force',
        agreementFileUrl: '/files/agreement_002.pdf',
        agreementFileName: '服务协议_深圳物流科技公司.pdf',
        reviewComment: '协议文件完整，企业资质符合要求，审核通过。',
        reviewer: '管理员',
        reviewTime: '2024-01-14 16:45:00'
      },
      {
        id: '3',
        applicationNo: 'APP20240113003',
        appNameCn: '欧盟报关',
        appNameEn: 'EU Customs Declaration',
        companyName: '北京国际贸易集团',
        applicantName: '王五',
        applicantContact: '13700137000',
        applicationTime: '2024-01-13 09:15:00',
        status: 'rejected',
        applicationType: 'self',
        agreementFileUrl: '/files/agreement_003.pdf',
        agreementFileName: '服务协议_北京国际贸易集团.pdf',
        reviewComment: '协议文件缺少公章，请重新上传加盖公章的协议文件。',
        reviewer: '管理员',
        reviewTime: '2024-01-13 11:30:00'
      },
      {
        id: '4',
        applicationNo: 'APP20240112004',
        appNameCn: '物流追踪',
        appNameEn: 'Logistics Tracking',
        companyName: '广州国际物流有限公司',
        applicantName: '赵六',
        applicantContact: '13600136000',
        applicationTime: '2024-01-12 15:45:00',
        status: 'approved',
        applicationType: 'force',
        agreementFileUrl: '/files/agreement_004.pdf',
        agreementFileName: '服务协议_广州国际物流有限公司.pdf',
        reviewComment: '强制开通，企业为战略合作伙伴。',
        reviewer: '管理员',
        reviewTime: '2024-01-12 16:30:00'
      }
    ];
    
    setDataSource(mockData);
    setPagination(prev => ({ ...prev, total: mockData.length }));
  }, []);

  /**
   * 处理搜索参数变更
   * @param key 参数名
   * @param value 参数值
   */
  const handleSearchParamChange = (key: keyof SearchParams, value: any) => {
    setSearchParams(prev => ({ ...prev, [key]: value }));
  };

  /**
   * 处理搜索操作
   */
  const handleSearch = () => {
    setLoading(true);
    // 模拟API调用
    setTimeout(() => {
      // 过滤数据
      const filteredData = dataSource.filter((item: ApprovalApplication) => {
        const matchKeyword = searchParams.keyword
          ? item.applicationNo.includes(searchParams.keyword) ||
            item.appNameCn.includes(searchParams.keyword) ||
            item.companyName.includes(searchParams.keyword)
          : true;
        
        const matchStatus = searchParams.status
          ? item.status === searchParams.status
          : true;
        
        const matchType = searchParams.applicationType
          ? item.applicationType === searchParams.applicationType
          : true;
        
        // 日期范围筛选逻辑
        let matchDateRange = true;
        if (searchParams.applicationTimeRange && searchParams.applicationTimeRange.length === 2) {
          const startDate = new Date(searchParams.applicationTimeRange[0]);
          const endDate = new Date(searchParams.applicationTimeRange[1]);
          const itemDate = new Date(item.applicationTime);
          
          matchDateRange = itemDate >= startDate && itemDate <= endDate;
        }
        
        return matchKeyword && matchStatus && matchType && matchDateRange;
      });
      
      setDataSource(filteredData);
      setPagination(prev => ({ ...prev, current: 1, total: filteredData.length }));
      setLoading(false);
      Message.success('搜索完成');
    }, 1000);
  };

  /**
   * 处理重置操作
   */
  const handleReset = () => {
    setSearchParams({
      keyword: '',
      status: '',
      applicationType: '',
      applicationTimeRange: []
    });
    Message.success('已重置搜索条件');
  };

  /**
   * 处理查看详情操作
   * @param record 申请记录
   */
  const handleViewDetail = (record: ApprovalApplication) => {
    setCurrentRecord(record);
    setDetailVisible(true);
  };

  /**
   * 处理审核操作
   * @param record 申请记录
   */
  const handleReview = (record: ApprovalApplication) => {
    setCurrentRecord(record);
    setReviewVisible(true);
    reviewForm.resetFields();
  };

  /**
   * 处理审核提交
   * @param action 审核动作（approve/reject）
   */
  const handleReviewSubmit = async (action: 'approve' | 'reject') => {
    try {
      const values = await reviewForm.validate();
      setLoading(true);
      
      // 模拟API调用
      setTimeout(() => {
        const updatedData = dataSource.map(item => {
          if (item.id === currentRecord?.id) {
            return {
              ...item,
              status: action === 'approve' ? 'approved' as const : 'rejected' as const,
              reviewComment: values.reviewComment,
              reviewer: '管理员',
              reviewTime: new Date().toLocaleString('zh-CN')
            };
          }
          return item;
        });
        
        setDataSource(updatedData);
        setLoading(false);
        setReviewVisible(false);
        Message.success(`审核${action === 'approve' ? '通过' : '拒绝'}成功`);
      }, 1000);
    } catch (error) {
      console.error('表单验证失败:', error);
    }
  };

  /**
   * 处理禁用操作
   * @param record 申请记录
   */
  const handleDisable = (record: ApprovalApplication) => {
    setCurrentDisableRecord(record);
    setDisableConfirmVisible(true);
  };

  /**
   * 确认禁用操作
   */
  const handleConfirmDisable = () => {
    if (!currentDisableRecord) return;
    
    setLoading(true);
    
    // 模拟API调用
    setTimeout(() => {
      const updatedData = dataSource.map(item => {
        if (item.id === currentDisableRecord.id) {
          return {
            ...item,
            status: 'rejected' as const,
            reviewComment: '管理员禁用',
            reviewer: '管理员',
            reviewTime: new Date().toLocaleString('zh-CN')
          };
        }
        return item;
      });
      
      setDataSource(updatedData);
      setLoading(false);
      setDisableConfirmVisible(false);
      setCurrentDisableRecord(null);
      Message.success('禁用成功');
    }, 1000);
  };

  /**
   * 重置强制开通弹窗状态
   */
  const resetForceActivateModal = () => {
    setForceActivateStep(1);
    setSelectedApp('');
    setSelectedCompany('');
    setCompanySearchParams({ code: '', name: '' });
    setCompanyList([]);
    setAgreementFile(null);
    forceActivateForm.resetFields();
  };

  /**
   * 关闭强制开通弹窗
   */
  const handleForceActivateCancel = () => {
    setForceActivateVisible(false);
    resetForceActivateModal();
  };

  /**
   * 强制开通下一步
   */
  const handleForceActivateNext = () => {
    if (forceActivateStep === 1) {
      if (!selectedApp) {
        Message.warning('请选择应用');
        return;
      }
      setForceActivateStep(2);
    } else if (forceActivateStep === 2) {
      if (!selectedCompany) {
        Message.warning('请选择企业');
        return;
      }
      setForceActivateStep(3);
    }
  };

  /**
   * 强制开通上一步
   */
  const handleForceActivatePrev = () => {
    if (forceActivateStep > 1) {
      setForceActivateStep(forceActivateStep - 1);
    }
  };

  /**
   * 搜索企业
   */
  const handleCompanySearch = () => {
    // 模拟企业数据
    const mockCompanies = [
      { id: '1', code: 'COMP001', name: '北京科技有限公司', status: '正常', hasApp: false },
      { id: '2', code: 'COMP002', name: '上海贸易有限公司', status: '正常', hasApp: false },
      { id: '3', code: 'COMP003', name: '深圳创新有限公司', status: '正常', hasApp: false },
      { id: '4', code: 'COMP004', name: '广州服务有限公司', status: '正常', hasApp: false },
    ];
    
    // 根据搜索条件过滤
    let filteredCompanies = mockCompanies.filter(company => 
      company.status === '正常' && !company.hasApp
    );
    
    if (companySearchParams.code) {
      filteredCompanies = filteredCompanies.filter(company => 
        company.code.toLowerCase().includes(companySearchParams.code.toLowerCase())
      );
    }
    
    if (companySearchParams.name) {
      filteredCompanies = filteredCompanies.filter(company => 
        company.name.toLowerCase().includes(companySearchParams.name.toLowerCase())
      );
    }
    
    setCompanyList(filteredCompanies);
  };

  /**
   * 重置企业搜索
   */
  const handleCompanySearchReset = () => {
    setCompanySearchParams({ code: '', name: '' });
    setCompanyList([]);
  };

  /**
   * 确认上传协议
   */
  const handleAgreementUpload = async () => {
    if (!agreementFile) {
      Message.warning('请上传协议文件');
      return;
    }
    
    try {
      // 模拟上传和添加记录
      console.log('强制开通数据:', {
        appId: selectedApp,
        companyId: selectedCompany,
        agreementFile: agreementFile
      });
      
      Message.success('强制开通成功，记录已添加并设为审核通过状态');
      setForceActivateVisible(false);
      resetForceActivateModal();
      // 刷新数据
      handleSearch();
    } catch (error) {
      console.error('强制开通失败:', error);
      Message.error('强制开通失败');
    }
  };

  // 应用列表数据 - 从应用列表页面获取状态为上架的应用
  const appList: Application[] = [
    {
      id: '1',
      nameZh: 'AI沃宝',
      nameEn: 'AI Assistant',
      descriptionZh: '智能客服助手，提供24小时在线服务',
      descriptionEn: 'Intelligent customer service assistant providing 24-hour online service',
      status: 'online' as const,
      category: ['AI创新场'],
      appUrl: '/ai-assistant',
      requiresAgreement: true,
      creator: '系统管理员',
      createTime: '2024-01-15 10:00:00',
      lastModifier: '系统管理员',
      lastModifyTime: '2024-01-15 10:00:00'
    },
    {
      id: '2',
      nameZh: '智能报关',
      nameEn: 'Smart Customs',
      descriptionZh: '智能化报关服务，简化通关流程',
      descriptionEn: 'Intelligent customs declaration service, simplifying clearance process',
      status: 'online' as const,
      category: ['海关专区'],
      appUrl: '/smart-customs',
      requiresAgreement: true,
      creator: '系统管理员',
      createTime: '2024-01-15 10:00:00',
      lastModifier: '系统管理员',
      lastModifyTime: '2024-01-15 10:00:00'
    },
    {
      id: '3',
      nameZh: '物流追踪',
      nameEn: 'Logistics Tracking',
      descriptionZh: '实时物流信息追踪与管理',
      descriptionEn: 'Real-time logistics information tracking and management',
      status: 'online' as const,
      category: ['智慧物流系统'],
      appUrl: '/logistics-tracking',
      requiresAgreement: false,
      creator: '系统管理员',
      createTime: '2024-01-15 10:00:00',
      lastModifier: '系统管理员',
      lastModifyTime: '2024-01-15 10:00:00'
    },
    {
      id: '4',
      nameZh: '订舱系统',
      nameEn: 'Booking System',
      descriptionZh: '在线订舱服务平台',
      descriptionEn: 'Online booking service platform',
      status: 'online' as const,
      category: ['订舱门户'],
      appUrl: '/booking-system',
      requiresAgreement: true,
      creator: '系统管理员',
      createTime: '2024-01-15 10:00:00',
      lastModifier: '系统管理员',
      lastModifyTime: '2024-01-15 10:00:00'
    },
    {
      id: '5',
      nameZh: '数据分析',
      nameEn: 'Data Analytics',
      descriptionZh: '业务数据分析与可视化',
      descriptionEn: 'Business data analysis and visualization',
      status: 'online' as const,
      category: ['工具箱'],
      appUrl: '/data-analytics',
      requiresAgreement: false,
      creator: '系统管理员',
      createTime: '2024-01-15 10:00:00',
      lastModifier: '系统管理员',
      lastModifyTime: '2024-01-15 10:00:00'
    }
  ].filter(app => app.status === 'online'); // 只显示状态为上架的应用

  /**
   * 获取状态标签
   * @param status 状态值
   */
  const getStatusTag = (status: ApprovalApplication['status']) => {
    const statusMap = {
      pending: { color: 'orange', text: '待审核' },
      approved: { color: 'green', text: '已通过' },
      rejected: { color: 'red', text: '已拒绝' }
    };
    const config = statusMap[status];
    return <Tag color={config.color}>{config.text}</Tag>;
  };

  // 表格列定义
  const columns = [
    {
      title: '申请编号',
      dataIndex: 'applicationNo',
      key: 'applicationNo',
      width: 150
    },
    {
      title: '应用名称',
      key: 'appName',
      width: 200,
      render: (_: any, record: ApprovalApplication) => (
        <div>
          <div>{record.appNameCn}</div>
          <div style={{ fontSize: 12, color: '#86909c' }}>{record.appNameEn}</div>
        </div>
      )
    },
    {
      title: '申请企业',
      dataIndex: 'companyName',
      key: 'companyName',
      width: 200
    },
    {
      title: '申请类型',
      dataIndex: 'applicationType',
      key: 'applicationType',
      width: 120,
      render: (type: string) => (
        <Tag color={type === 'force' ? 'orange' : 'blue'}>
          {type === 'force' ? '强制开通' : '自助申请'}
        </Tag>
      )
    },
    {
      title: '申请人',
      key: 'applicant',
      width: 150,
      render: (_: any, record: ApprovalApplication) => (
        <div>
          <div>{record.applicantName}</div>
          <div style={{ fontSize: 12, color: '#86909c' }}>{record.applicantContact}</div>
        </div>
      )
    },
    {
      title: '申请时间',
      dataIndex: 'applicationTime',
      key: 'applicationTime',
      width: 160
    },
    {
      title: '审核状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status: ApprovalApplication['status']) => getStatusTag(status)
    },
    {
      title: '操作',
      key: 'action',
      width: 200,
      render: (_: any, record: ApprovalApplication) => (
        <Space>
          <Button
            type="text"
            size="small"
            icon={<IconEye />}
            onClick={() => handleViewDetail(record)}
          >
            查看
          </Button>
          {(record.status === 'pending' || record.status === 'rejected') && (
            <Button
              type="text"
              size="small"
              icon={<IconCheck />}
              onClick={() => handleReview(record)}
            >
              审核
            </Button>
          )}
          {record.status === 'approved' && (
            <Button
              type="text"
              size="small"
              status="danger"
              icon={<IconStop />}
              onClick={() => handleDisable(record)}
            >
              禁用
            </Button>
          )}
        </Space>
      )
    }
  ];

  return (
    <Card>
      {/* 搜索筛选区域 */}
      <div style={{ marginBottom: 16, padding: 16, backgroundColor: '#ffffff', borderRadius: 6 }}>
        <Space wrap>
          <Input
            placeholder="搜索申请编号、企业名称、申请人"
            value={searchParams.keyword}
            onChange={(value) => setSearchParams(prev => ({ ...prev, keyword: value }))}
            style={{ width: 250 }}
            allowClear
          />
          <Select
            placeholder="审核状态"
            value={searchParams.status}
            onChange={(value) => handleSearchParamChange('status', value)}
            style={{ width: 120 }}
            allowClear
          >
            {statusOptions.map(option => (
              <Option key={option.value} value={option.value}>
                {option.label}
              </Option>
            ))}
          </Select>
          <Select
            placeholder="申请类型"
            value={searchParams.applicationType}
            onChange={(value) => handleSearchParamChange('applicationType', value)}
            style={{ width: 120 }}
            allowClear
          >
            {applicationTypeOptions.map(option => (
              <Option key={option.value} value={option.value}>
                {option.label}
              </Option>
            ))}
          </Select>
          <Button type="primary" icon={<IconSearch />} onClick={handleSearch} loading={loading}>
            搜索
          </Button>
          <Button icon={<IconRefresh />} onClick={handleReset}>
            重置
          </Button>
        </Space>
      </div>

      {/* 按钮栏 */}
      <div style={{ 
        marginBottom: 16, 
        display: 'flex',
        justifyContent: 'flex-start'
      }}>
        <Button type="primary" icon={<IconPlus />} onClick={() => setForceActivateVisible(true)}>
          强制开通
        </Button>
      </div>

      {/* 数据表格 */}
      <Table
        columns={columns}
        data={dataSource}
        loading={loading}
        pagination={{
          ...pagination,
          showTotal: true,
          showJumper: true,
          sizeCanChange: true,
          onChange: (current, pageSize) => {
            setPagination(prev => ({ ...prev, current, pageSize }));
          }
        }}
        rowKey="id"
      />

      {/* 查看详情弹窗 */}
      <Modal
        title="申请详情"
        visible={detailVisible}
        onCancel={() => setDetailVisible(false)}
        footer={[
          <Button key="close" onClick={() => setDetailVisible(false)}>
            关闭
          </Button>
        ]}
        style={{ width: 800 }}
      >
        {currentRecord && (
          <Descriptions
            column={2}
            data={[
              { label: '申请编号', value: currentRecord.applicationNo },
              { label: '申请时间', value: currentRecord.applicationTime },
              { label: '应用名称（中文）', value: currentRecord.appNameCn },
              { label: '应用名称（英文）', value: currentRecord.appNameEn },
              { label: '申请企业', value: currentRecord.companyName },
              { label: '申请人', value: currentRecord.applicantName },
              { label: '联系方式', value: currentRecord.applicantContact },
              { label: '审核状态', value: getStatusTag(currentRecord.status) },
              {
                label: '协议文件',
                value: currentRecord.agreementFileName ? (
                  <Button type="text" size="small">
                    {currentRecord.agreementFileName}
                  </Button>
                ) : '无'
              },
              { label: '审核人', value: currentRecord.reviewer || '-' },
              { label: '审核时间', value: currentRecord.reviewTime || '-' },
              {
                label: '审核意见',
                value: currentRecord.reviewComment || '-',
                span: 2
              }
            ]}
          />
        )}
      </Modal>

      {/* 审核弹窗 */}
      <Modal
        title="审核申请"
        visible={reviewVisible}
        onCancel={() => setReviewVisible(false)}
        footer={[
          <Button key="cancel" onClick={() => setReviewVisible(false)}>
            取消
          </Button>,
          <Button
            key="reject"
            status="danger"
            icon={<IconClose />}
            onClick={() => handleReviewSubmit('reject')}
            loading={loading}
          >
            拒绝
          </Button>,
          <Button
            key="approve"
            type="primary"
            icon={<IconCheck />}
            onClick={() => handleReviewSubmit('approve')}
            loading={loading}
          >
            通过
          </Button>
        ]}
        style={{ width: 600 }}
      >
        {currentRecord && (
          <div>
            <Descriptions
              column={1}
              data={[
                { label: '申请编号', value: currentRecord.applicationNo },
                { label: '应用名称', value: `${currentRecord.appNameCn} (${currentRecord.appNameEn})` },
                { label: '申请企业', value: currentRecord.companyName },
                { label: '申请人', value: `${currentRecord.applicantName} (${currentRecord.applicantContact})` },
                {
                  label: '协议文件',
                  value: currentRecord.agreementFileName ? (
                    <Button type="text" size="small">
                      {currentRecord.agreementFileName}
                    </Button>
                  ) : '无'
                }
              ]}
              style={{ marginBottom: 16 }}
            />
            
            <Form form={reviewForm} layout="vertical">
              <Form.Item
                field="reviewComment"
                label="审核意见"
                rules={[{ required: true, message: '请输入审核意见' }]}
              >
                <TextArea
                  placeholder="请输入审核意见..."
                  rows={4}
                  maxLength={500}
                  showWordLimit
                />
              </Form.Item>
            </Form>
          </div>
        )}
      </Modal>

      {/* 强制开通弹窗 */}
      <Modal
        title={`强制开通 - 步骤 ${forceActivateStep}/3`}
        visible={forceActivateVisible}
        onCancel={handleForceActivateCancel}
        footer={null}
        style={{ top: 50, width: 800 }}
      >
        {/* 步骤1：选择应用 */}
        {forceActivateStep === 1 && (
          <div>
            <div style={{ marginBottom: 24 }}>
              <Title heading={4} style={{ marginBottom: 16 }}>选择应用</Title>
              <Radio.Group
                value={selectedApp}
                onChange={setSelectedApp}
                style={{ width: '100%' }}
              >
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 16 }}>
                  {appList.map(app => (
                    <Radio key={app.id} value={app.id}>
                      <Card 
                        size="small" 
                        style={{ 
                          width: '100%',
                          cursor: 'pointer',
                          border: selectedApp === app.id ? '2px solid #7466F0' : '1px solid #e5e6eb'
                        }}
                        onClick={() => setSelectedApp(app.id)}
                      >
                        <div style={{ fontWeight: 'bold', marginBottom: 8 }}>{app.nameZh}</div>
                        <div style={{ color: '#86909c', fontSize: 12 }}>{app.nameEn}</div>
                        <div style={{ color: '#999', fontSize: 11, marginTop: 4 }}>分类: {app.category.join(', ')}</div>
                      </Card>
                    </Radio>
                  ))}
                </div>
              </Radio.Group>
            </div>
            <div style={{ textAlign: 'right', borderTop: '1px solid #e5e6eb', paddingTop: 16 }}>
              <Space>
                <Button onClick={handleForceActivateCancel}>取消</Button>
                <Button type="primary" onClick={handleForceActivateNext} disabled={!selectedApp}>
                  下一步 <IconRight />
                </Button>
              </Space>
            </div>
          </div>
        )}

        {/* 步骤2：选择企业 */}
        {forceActivateStep === 2 && (
          <div>
            <div style={{ marginBottom: 24 }}>
              <Title heading={4} style={{ marginBottom: 16 }}>选择企业</Title>
              
              {/* 搜索区域 */}
              <div style={{ 
                padding: 16, 
                backgroundColor: '#f7f8fa', 
                borderRadius: 6, 
                marginBottom: 16 
              }}>
                <Space wrap>
                  <Input
                    placeholder="企业编码"
                    value={companySearchParams.code}
                    onChange={(value) => setCompanySearchParams(prev => ({ ...prev, code: value }))}
                    style={{ width: 200 }}
                  />
                  <Input
                    placeholder="企业名称"
                    value={companySearchParams.name}
                    onChange={(value) => setCompanySearchParams(prev => ({ ...prev, name: value }))}
                    style={{ width: 200 }}
                  />
                  <Button type="primary" onClick={handleCompanySearch}>
                    查找
                  </Button>
                  <Button onClick={handleCompanySearchReset}>
                    重置
                  </Button>
                </Space>
              </div>

              {/* 企业列表 */}
              {companyList.length > 0 && (
                <div style={{ maxHeight: 300, overflow: 'auto' }}>
                  <Radio.Group
                    value={selectedCompany}
                    onChange={setSelectedCompany}
                    style={{ width: '100%' }}
                  >
                    <div>
                      {companyList.map((company: any) => (
                        <div
                          key={company.id}
                          style={{
                            padding: 12,
                            border: selectedCompany === company.id ? '2px solid #7466F0' : '1px solid #e5e6eb',
                            borderRadius: 6,
                            marginBottom: 8,
                            cursor: 'pointer'
                          }}
                          onClick={() => setSelectedCompany(company.id)}
                        >
                          <Radio value={company.id}>
                            <div>
                              <div style={{ fontWeight: 'bold' }}>{company.name}</div>
                              <div style={{ color: '#86909c', fontSize: 12 }}>企业编码: {company.code}</div>
                            </div>
                          </Radio>
                        </div>
                      ))}
                    </div>
                  </Radio.Group>
                </div>
              )}
            </div>
            
            <div style={{ textAlign: 'right', borderTop: '1px solid #e5e6eb', paddingTop: 16 }}>
              <Space>
                <Button onClick={handleForceActivatePrev}>
                  <IconLeft /> 上一步
                </Button>
                <Button type="primary" onClick={handleForceActivateNext} disabled={!selectedCompany}>
                  下一步 <IconRight />
                </Button>
              </Space>
            </div>
          </div>
        )}

        {/* 步骤3：上传协议 */}
        {forceActivateStep === 3 && (
          <div>
            <div style={{ marginBottom: 24 }}>
              <Title heading={4} style={{ marginBottom: 16 }}>上传协议</Title>
              
              <div style={{ 
                padding: 24, 
                backgroundColor: '#f7f8fa', 
                borderRadius: 6,
                textAlign: 'center'
              }}>
                <Upload
                  drag
                  accept=".pdf,.doc,.docx"
                  beforeUpload={(file) => {
                    setAgreementFile(file);
                    return false; // 阻止自动上传
                  }}
                  onRemove={() => setAgreementFile(null)}
                  fileList={agreementFile ? [agreementFile] : []}
                >
                  <div style={{ padding: 40 }}>
                    <IconUpload style={{ fontSize: 48, color: '#7466F0', marginBottom: 16 }} />
                    <div style={{ fontSize: 16, marginBottom: 8 }}>点击或拖拽文件到此区域上传</div>
                    <div style={{ color: '#86909c', fontSize: 12 }}>支持 PDF、Word 格式的协议文件</div>
                  </div>
                </Upload>
              </div>
              
              {agreementFile && (
                <div style={{ 
                  marginTop: 16, 
                  padding: 12, 
                  backgroundColor: '#e8f5e8', 
                  borderRadius: 6,
                  color: '#00b42a'
                }}>
                  已选择文件: {agreementFile.name}
                </div>
              )}
            </div>
            
            <div style={{ textAlign: 'right', borderTop: '1px solid #e5e6eb', paddingTop: 16 }}>
              <Space>
                <Button onClick={handleForceActivatePrev}>
                  <IconLeft /> 上一步
                </Button>
                <Button type="primary" onClick={handleAgreementUpload} disabled={!agreementFile}>
                  确认上传
                </Button>
              </Space>
            </div>
          </div>
        )}
      </Modal>

      {/* 禁用确认弹窗 */}
      <Modal
        title="确认禁用"
        visible={disableConfirmVisible}
        onCancel={() => {
          setDisableConfirmVisible(false);
          setCurrentDisableRecord(null);
        }}
        footer={[
          <Button key="cancel" onClick={() => {
            setDisableConfirmVisible(false);
            setCurrentDisableRecord(null);
          }}>
            取消
          </Button>,
          <Button
            key="confirm"
            type="primary"
            status="danger"
            onClick={handleConfirmDisable}
            loading={loading}
          >
            确认禁用
          </Button>
        ]}
      >
        {currentDisableRecord && (
          <div>
            <p>确定要禁用以下申请吗？</p>
            <Descriptions
              column={1}
              data={[
                { label: '申请编号', value: currentDisableRecord.applicationNo },
                { label: '应用名称', value: `${currentDisableRecord.appNameCn} (${currentDisableRecord.appNameEn})` },
                { label: '申请企业', value: currentDisableRecord.companyName },
                { label: '申请人', value: currentDisableRecord.applicantName }
              ]}
            />
            <div style={{ marginTop: 16, padding: 12, backgroundColor: '#fff2e8', borderRadius: 6 }}>
              <div style={{ color: '#ff7d00', fontWeight: 'bold' }}>注意：</div>
              <div style={{ color: '#ff7d00' }}>禁用后，该申请将被标记为已禁用状态，企业将无法使用该应用。</div>
            </div>
          </div>
        )}
      </Modal>
    </Card>
  );
};

export default AppApprovalManagement;