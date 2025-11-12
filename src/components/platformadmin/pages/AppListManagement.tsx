import React, { useState, useEffect } from 'react';
import {
  Card,
  Table,
  Button,
  Space,
  Tag,
  Tooltip,
  Modal,
  Drawer,
  Form,
  Input,
  Select,
  Message,
  Popconfirm,
  Upload,
  Checkbox
} from '@arco-design/web-react';

const { TextArea } = Input;
import {
  IconPlus,
  IconEdit,
  IconEye,
  IconSearch,
  IconRefresh,
  IconUp,
  IconDown,
  IconDelete
} from '@arco-design/web-react/icon';

const { Option } = Select;


/**
 * 应用数据接口
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
 * 搜索筛选参数接口
 */
interface SearchParams {
  keyword: string;
  status: string;
  category: string;
}

// 状态选项
const statusOptions = [
  { value: 'online', label: '上架' },
  { value: 'offline', label: '下架' }
];

// 分类选项（支持多级分类）
const categoryOptions = [
  { value: 'AI创新场', label: 'AI创新场' },
  { value: '海关专区', label: '海关专区' },
  { value: '海关专区/美加专区', label: '海关专区 > 美加专区' },
  { value: '海关专区/欧盟业务', label: '海关专区 > 欧盟业务' },
  { value: '海关专区/中国业务', label: '海关专区 > 中国业务' },
  { value: '海关专区/其他', label: '海关专区 > 其他' },
  { value: '智慧物流系统', label: '智慧物流系统' },
  { value: '智慧物流系统/定制门户', label: '智慧物流系统 > 定制门户' },
  { value: '智慧物流系统/协作云平台', label: '智慧物流系统 > 协作云平台' },
  { value: '经纪代理', label: '经纪代理' },
  { value: '经纪代理/美国业务', label: '经纪代理 > 美国业务' },
  { value: '经纪代理/欧盟业务', label: '经纪代理 > 欧盟业务' },
  { value: '经纪代理/中国业务', label: '经纪代理 > 中国业务' },
  { value: '经纪代理/其他', label: '经纪代理 > 其他' },
  { value: '订舱门户', label: '订舱门户' },
  { value: '订舱门户/船东', label: '订舱门户 > 船东' },
  { value: '订舱门户/代理', label: '订舱门户 > 代理' },
  { value: '工具箱', label: '工具箱' },
  { value: '工具箱/可视化', label: '工具箱 > 可视化' },
  { value: '工具箱/实用助手', label: '工具箱 > 实用助手' }
];

/**
 * 应用列表管理组件
 * @description 管理平台应用的列表展示、CRUD操作和批量操作功能
 * @author 开发者
 * @date 2024-01-15
 */
const AppListManagement: React.FC = () => {
  const [appData, setAppData] = useState<Application[]>([]);
  const [filteredData, setFilteredData] = useState<Application[]>([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState<string[]>([]);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [viewModalVisible, setViewModalVisible] = useState(false);
  const [currentApp, setCurrentApp] = useState<Application | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [searchParams, setSearchParams] = useState<SearchParams>({
    keyword: '',
    status: '',
    category: ''
  });
  const [iconFileList, setIconFileList] = useState<any[]>([]);
  const [agreementFileList, setAgreementFileList] = useState<any[]>([]);
  const [requiresAgreement, setRequiresAgreement] = useState(false);
  const [form] = Form.useForm();

  /**
   * 初始化示例数据
   */
  useEffect(() => {
    const mockData: Application[] = [
      // AI创新场
      {
        id: '1',
        nameZh: 'AI沃宝',
        nameEn: 'AI Assistant',
        descriptionZh: '智能客服助手，提供24小时在线服务',
        descriptionEn: 'Intelligent customer service assistant providing 24-hour online service',
        status: 'online',
        category: ['AI创新场'],
        appUrl: '/ai/assistant',
        icon: '/assets/icons/ai-assistant.png',
        requiresAgreement: true,
        agreementFile: '/assets/agreements/ai-assistant-agreement.pdf',
        creator: '张三',
        createTime: '2024-01-10 09:30:00',
        lastModifier: '李四',
        lastModifyTime: '2024-01-15 14:20:00'
      },
      {
        id: '2',
        nameZh: '文件识别',
        nameEn: 'Document Recognition',
        descriptionZh: '自动识别和处理各类贸易单证',
        descriptionEn: 'Automatic recognition and processing of various trade documents',
        status: 'offline',
        category: ['AI创新场'],
        appUrl: '/ai/document-recognition',
        requiresAgreement: false,
        creator: '王五',
        createTime: '2024-01-08 16:45:00',
        lastModifier: '赵六',
        lastModifyTime: '2024-01-14 11:30:00'
      },
      {
        id: '3',
        nameZh: '超级运价',
        nameEn: 'Super Freight Rate',
        descriptionZh: '智能运价分析和报价系统',
        descriptionEn: 'Intelligent freight rate analysis and quotation system',
        status: 'online',
        category: ['AI创新场'],
        appUrl: '/ai/freight-rate',
        icon: '/assets/icons/freight-rate.png',
        requiresAgreement: true,
        agreementFile: '/assets/agreements/freight-rate-agreement.pdf',
        creator: '陈七',
        createTime: '2024-01-05 10:15:00',
        lastModifier: '陈七',
        lastModifyTime: '2024-01-12 09:45:00'
      },
      {
        id: '4',
        nameZh: '智能BI',
        nameEn: 'Smart BI',
        descriptionZh: '智能商业分析和数据洞察',
        descriptionEn: 'Smart business analysis and data insights',
        status: 'offline',
        category: ['AI创新场'],
        appUrl: '/ai/smart-bi',
        requiresAgreement: false,
        creator: '刘八',
        createTime: '2024-01-03 14:20:00',
        lastModifier: '刘八',
        lastModifyTime: '2024-01-10 16:30:00'
      },
      // 海关专区 - 美加专区
      {
        id: '5',
        nameZh: 'AMS申报',
        nameEn: 'AMS Declaration',
        descriptionZh: '美国海关自动舱单系统申报',
        descriptionEn: 'US Customs Automated Manifest System declaration',
        status: 'online',
        category: ['海关专区', '美加专区'],
        appUrl: '/customs/ams-declaration',
        requiresAgreement: false,
        creator: '张三',
        createTime: '2024-01-12 10:00:00',
        lastModifier: '李四',
        lastModifyTime: '2024-01-16 15:30:00'
      },
      {
        id: '6',
        nameZh: 'ISF申报',
        nameEn: 'ISF Declaration',
        descriptionZh: '进口商安全申报系统',
        descriptionEn: 'Importer Security Filing system',
        status: 'online',
        category: ['海关专区', '美加专区'],
        appUrl: '/customs/isf-declaration',
        requiresAgreement: false,
        creator: '王五',
        createTime: '2024-01-11 14:20:00',
        lastModifier: '赵六',
        lastModifyTime: '2024-01-17 09:15:00'
      },
      {
        id: '7',
        nameZh: 'ACI申报',
        nameEn: 'ACI Declaration',
        descriptionZh: '加拿大预先货物信息系统',
        descriptionEn: 'Canada Advance Commercial Information system',
        status: 'online',
        category: ['海关专区', '美加专区'],
        appUrl: '/customs/aci-declaration',
        requiresAgreement: false,
        creator: '陈七',
        createTime: '2024-01-09 11:45:00',
        lastModifier: '陈七',
        lastModifyTime: '2024-01-15 16:20:00'
      },
      // 海关专区 - 欧盟业务
      {
        id: '8',
        nameZh: 'ICS2申报',
        nameEn: 'ICS2 Declaration',
        descriptionZh: '欧盟进口控制系统2.0申报',
        descriptionEn: 'EU Import Control System 2.0 declaration',
        status: 'offline',
        category: ['海关专区', '欧盟业务'],
        appUrl: '/customs/ics2-declaration',
        requiresAgreement: false,
        creator: '刘八',
        createTime: '2024-01-07 13:30:00',
        lastModifier: '刘八',
        lastModifyTime: '2024-01-13 10:45:00'
      },
      // 海关专区 - 中国业务
      {
        id: '9',
        nameZh: '上海预配舱单',
        nameEn: 'Shanghai Pre-loading Manifest',
        descriptionZh: '上海港预配舱单申报',
        descriptionEn: 'Shanghai Port pre-loading manifest declaration',
        status: 'online',
        category: ['海关专区', '中国业务'],
        appUrl: '/customs/shanghai-manifest',
        requiresAgreement: false,
        creator: '张三',
        createTime: '2024-01-06 08:15:00',
        lastModifier: '李四',
        lastModifyTime: '2024-01-14 12:30:00'
      },
      {
        id: '10',
        nameZh: 'VGM申报',
        nameEn: 'VGM Declaration',
        descriptionZh: '集装箱重量验证申报',
        descriptionEn: 'Verified Gross Mass declaration',
        status: 'offline',
        category: ['海关专区', '中国业务'],
        appUrl: '/customs/vgm-declaration',
        requiresAgreement: false,
        creator: '王五',
        createTime: '2024-01-04 16:00:00',
        lastModifier: '赵六',
        lastModifyTime: '2024-01-11 14:15:00'
      },
      // 智慧物流系统 - 定制门户
      {
        id: '11',
        nameZh: 'Web门户',
        nameEn: 'Web Portal',
        descriptionZh: '基于Web的物流管理门户',
        descriptionEn: 'Web-based logistics management portal',
        status: 'online',
        category: ['智慧物流系统', '定制门户'],
        appUrl: '/logistics/web-portal',
        requiresAgreement: false,
        creator: '陈七',
        createTime: '2024-01-02 09:45:00',
        lastModifier: '陈七',
        lastModifyTime: '2024-01-09 11:20:00'
      },
      {
        id: '12',
        nameZh: 'B2B平台',
        nameEn: 'B2B Platform',
        descriptionZh: '企业间物流服务平台',
        descriptionEn: 'Business-to-business logistics service platform',
        status: 'online',
        category: ['智慧物流系统', '定制门户'],
        appUrl: '/logistics/b2b-platform',
        requiresAgreement: false,
        creator: '刘八',
        createTime: '2024-01-01 15:30:00',
        lastModifier: '刘八',
        lastModifyTime: '2024-01-08 13:45:00'
      },
      // 经纪代理 - 美国业务
      {
        id: '13',
        nameZh: '美国公司注册',
        nameEn: 'US Company Registration',
        descriptionZh: '美国公司注册服务',
        descriptionEn: 'US company registration service',
        status: 'online',
        category: ['经纪代理', '美国业务'],
        appUrl: '/broker/us-company-registration',
        requiresAgreement: false,
        creator: '张三',
        createTime: '2023-12-28 10:20:00',
        lastModifier: '李四',
        lastModifyTime: '2024-01-05 16:10:00'
      },
      {
        id: '14',
        nameZh: '美国海关Bond',
        nameEn: 'US Customs Bond',
        descriptionZh: '美国海关保证金服务',
        descriptionEn: 'US customs bond service',
        status: 'online',
        category: ['经纪代理', '美国业务'],
        appUrl: '/broker/us-customs-bond',
        requiresAgreement: false,
        creator: '王五',
        createTime: '2023-12-25 14:15:00',
        lastModifier: '赵六',
        lastModifyTime: '2024-01-03 09:30:00'
      },
      // 订舱门户 - 船东
      {
        id: '15',
        nameZh: '船司订舱',
        nameEn: 'Carrier Booking',
        descriptionZh: '船公司直接订舱服务',
        descriptionEn: 'Direct carrier booking service',
        status: 'online',
        category: ['订舱门户', '船东'],
        appUrl: '/booking/carrier-booking',
        requiresAgreement: false,
        creator: '陈七',
        createTime: '2023-12-20 11:40:00',
        lastModifier: '陈七',
        lastModifyTime: '2023-12-30 15:25:00'
      },
      // 工具箱 - 可视化
      {
        id: '16',
        nameZh: '全链路跟踪',
        nameEn: 'End-to-End Tracking',
        descriptionZh: '全程物流链路可视化跟踪',
        descriptionEn: 'End-to-end logistics chain visualization tracking',
        status: 'online',
        category: ['工具箱', '可视化'],
        appUrl: '/tools/end-to-end-tracking',
        requiresAgreement: false,
        creator: '刘八',
        createTime: '2023-12-15 13:20:00',
        lastModifier: '刘八',
        lastModifyTime: '2023-12-28 10:50:00'
      },
      {
        id: '17',
        nameZh: '全球船期',
        nameEn: 'Global Sailing Schedule',
        descriptionZh: '全球船期信息查询',
        descriptionEn: 'Global sailing schedule information query',
        status: 'online',
        category: ['工具箱', '可视化'],
        appUrl: '/tools/global-sailing-schedule',
        requiresAgreement: false,
        creator: '张三',
        createTime: '2023-12-10 16:30:00',
        lastModifier: '李四',
        lastModifyTime: '2023-12-25 14:40:00'
      },
      // 工具箱 - 实用助手
      {
        id: '18',
        nameZh: 'HS归类大师',
        nameEn: 'HS Classification Master',
        descriptionZh: 'HS编码智能归类工具',
        descriptionEn: 'HS code intelligent classification tool',
        status: 'offline',
        category: ['工具箱', '实用助手'],
        appUrl: '/tools/hs-classification',
        requiresAgreement: false,
        creator: '王五',
        createTime: '2023-12-05 12:15:00',
        lastModifier: '赵六',
        lastModifyTime: '2023-12-20 11:25:00'
      }
    ];

    setAppData(mockData);
    setFilteredData(mockData);
  }, []);

  /**
   * 搜索筛选功能
   */
  const handleSearch = () => {
    let filtered = appData;

    // 关键词搜索
    if (searchParams.keyword) {
      filtered = filtered.filter(app => 
        app.nameZh.includes(searchParams.keyword) ||
        app.nameEn.toLowerCase().includes(searchParams.keyword.toLowerCase()) ||
        app.descriptionZh.includes(searchParams.keyword) ||
        app.descriptionEn.toLowerCase().includes(searchParams.keyword.toLowerCase())
      );
    }

    // 状态筛选
    if (searchParams.status) {
      filtered = filtered.filter(app => app.status === searchParams.status);
    }

    // 分类筛选
    if (searchParams.category) {
      filtered = filtered.filter(app => 
        app.category.some(cat => cat.includes(searchParams.category))
      );
    }

    setFilteredData(filtered);
  };

  /**
   * 重置搜索条件
   */
  const handleReset = () => {
    setSearchParams({
      keyword: '',
      status: '',
      category: ''
    });
    setFilteredData(appData);
  };

  /**
   * 新增应用
   */
  const handleAdd = () => {
    setCurrentApp(null);
    setIsEditing(false);
    form.resetFields();
    setEditModalVisible(true);
  };

  /**
   * 编辑应用
   * @param app 应用数据
   */
  const handleEdit = (app: Application) => {
    setCurrentApp(app);
    setIsEditing(true);
    form.setFieldsValue({
      nameZh: app.nameZh,
      nameEn: app.nameEn,
      descriptionZh: app.descriptionZh,
      descriptionEn: app.descriptionEn,
      status: app.status,
      category: app.category,
      appUrl: app.appUrl
    });
    setEditModalVisible(true);
  };

  /**
   * 查看应用详情
   * @param app 应用数据
   */
  const handleView = (app: Application) => {
    setCurrentApp(app);
    setViewModalVisible(true);
  };

  /**
   * 保存应用数据
   * @param actionType 操作类型：'save' 保存（下架状态）, 'publish' 直接上架
   */
  const handleSaveApp = async (actionType: 'save' | 'publish') => {
    try {
      const values = await form.validate();
      
      // 处理文件上传
      let iconUrl = '';
      let agreementFileUrl = '';
      
      if (iconFileList.length > 0) {
        // 模拟文件上传，实际项目中需要调用上传API
        iconUrl = `/assets/icons/${iconFileList[0].name}`;
      }
      
      if (agreementFileList.length > 0) {
        // 模拟文件上传，实际项目中需要调用上传API
        agreementFileUrl = `/assets/agreements/${agreementFileList[0].name}`;
      }
      
      const now = new Date().toLocaleString('zh-CN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
      }).replace(/\//g, '-');

      if (isEditing && currentApp) {
        // 编辑模式：检查是否为已上架应用
        if (currentApp.status === 'online') {
          Message.error('已上架应用必须先下架才能编辑');
          return;
        }
        
        const updatedApp: Application = {
          ...currentApp,
          ...values,
          icon: iconUrl || currentApp.icon,
          requiresAgreement,
          agreementFile: agreementFileUrl || currentApp.agreementFile,
          status: actionType === 'publish' ? 'online' : 'offline',
          lastModifier: '当前用户', // 实际项目中从用户上下文获取
          lastModifyTime: now
        };
        
        const newData = appData.map(app => 
          app.id === currentApp.id ? updatedApp : app
        );
        setAppData(newData);
        setFilteredData(newData);
        
        const message = actionType === 'publish' ? '应用更新并上架成功' : '应用更新成功';
        Message.success(message);
      } else {
        // 新增模式：默认为下架状态，除非选择直接上架
        const newApp: Application = {
          id: Date.now().toString(),
          ...values,
          icon: iconUrl,
          requiresAgreement,
          agreementFile: agreementFileUrl,
          status: actionType === 'publish' ? 'online' : 'offline',
          creator: '当前用户', // 实际项目中从用户上下文获取
          createTime: now,
          lastModifier: '当前用户',
          lastModifyTime: now
        };
        
        const newData = [...appData, newApp];
        setAppData(newData);
        setFilteredData(newData);
        
        const message = actionType === 'publish' ? '应用创建并上架成功' : '应用创建成功（下架状态）';
        Message.success(message);
      }
      
      // 重置状态
      setEditModalVisible(false);
      setIconFileList([]);
      setAgreementFileList([]);
      setRequiresAgreement(false);
      form.resetFields();
    } catch (error) {
      console.error('保存应用失败:', error);
    }
  };

  /**
   * 切换应用状态（上架/下架）
   * @param app 应用数据
   */
  const handleToggleStatus = (app: Application) => {
    const newStatus = app.status === 'online' ? 'offline' : 'online';
    const now = new Date().toLocaleString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    }).replace(/\//g, '-');

    const updatedApp: Application = {
      ...app,
      status: newStatus,
      lastModifier: '当前用户',
      lastModifyTime: now
    };

    const newData = appData.map(item => 
      item.id === app.id ? updatedApp : item
    );
    setAppData(newData);
    setFilteredData(newData);
    Message.success(`应用已${newStatus === 'online' ? '上架' : '下架'}`);
  };

  /**
   * 批量上架
   */
  const handleBatchOnline = () => {
    const now = new Date().toLocaleString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    }).replace(/\//g, '-');

    const newData = appData.map(app => {
      if (selectedRowKeys.includes(app.id)) {
        return {
          ...app,
          status: 'online' as const,
          lastModifier: '当前用户',
          lastModifyTime: now
        };
      }
      return app;
    });
    
    setAppData(newData);
    setFilteredData(newData);
    setSelectedRowKeys([]);
    Message.success(`已批量上架 ${selectedRowKeys.length} 个应用`);
  };

  /**
   * 批量下架
   */
  const handleBatchOffline = () => {
    const now = new Date().toLocaleString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    }).replace(/\//g, '-');

    const newData = appData.map(app => {
      if (selectedRowKeys.includes(app.id)) {
        return {
          ...app,
          status: 'offline' as const,
          lastModifier: '当前用户',
          lastModifyTime: now
        };
      }
      return app;
    });
    
    setAppData(newData);
    setFilteredData(newData);
    setSelectedRowKeys([]);
    Message.success(`已批量下架 ${selectedRowKeys.length} 个应用`);
  };

  /**
   * 删除应用
   * @param app 应用数据
   */
  const handleDelete = (app: Application) => {
    // 只有下架状态的应用才能删除
    if (app.status === 'online') {
      Message.error('上架状态的应用不能删除，请先下架');
      return;
    }

    const newData = appData.filter(item => item.id !== app.id);
    setAppData(newData);
    setFilteredData(newData);
    Message.success('应用删除成功');
  };

  /**
   * 渲染分类标签
   * @param categories 分类数组
   */
  const renderCategoryTags = (categories: string[]) => {
    return (
      <div>
        {categories.map((category, index) => (
          <Tag key={index} color="blue" style={{ marginBottom: '4px' }}>
            {category}
          </Tag>
        ))}
      </div>
    );
  };

  // 表格列定义
  const columns = [
    {
      title: '应用名称（中文）',
      dataIndex: 'nameZh',
      width: 150,
      fixed: 'left' as const,
    },
    {
      title: '应用名称（英文）',
      dataIndex: 'nameEn',
      width: 180,
    },
    {
      title: '描述（中文）',
      dataIndex: 'descriptionZh',
      width: 200,
      render: (text: string) => (
        <Tooltip content={text}>
          <div style={{ 
            maxWidth: '180px', 
            overflow: 'hidden', 
            textOverflow: 'ellipsis', 
            whiteSpace: 'nowrap' 
          }}>
            {text}
          </div>
        </Tooltip>
      ),
    },
    {
      title: '描述（英文）',
      dataIndex: 'descriptionEn',
      width: 200,
      render: (text: string) => (
        <Tooltip content={text}>
          <div style={{ 
            maxWidth: '180px', 
            overflow: 'hidden', 
            textOverflow: 'ellipsis', 
            whiteSpace: 'nowrap' 
          }}>
            {text}
          </div>
        </Tooltip>
      ),
    },
    {
      title: '状态',
      dataIndex: 'status',
      width: 100,
      render: (status: string) => (
        <Tag color={status === 'online' ? 'green' : 'red'}>
          {status === 'online' ? '上架' : '下架'}
        </Tag>
      ),
    },
    {
      title: '归属分类',
      dataIndex: 'category',
      width: 150,
      render: (categories: string[]) => renderCategoryTags(categories),
    },
    {
      title: '创建人',
      dataIndex: 'creator',
      width: 100,
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      width: 160,
    },
    {
      title: '最后修改人',
      dataIndex: 'lastModifier',
      width: 120,
    },
    {
      title: '最后修改时间',
      dataIndex: 'lastModifyTime',
      width: 160,
    },
    {
      title: '操作',
      dataIndex: 'action',
      width: 200,
      fixed: 'right' as const,
      render: (_: unknown, record: Application) => (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          {/* 第一行：查看和编辑 */}
          <Space size="small">
            <Button
              type="text"
              size="small"
              icon={<IconEye />}
              onClick={() => handleView(record)}
            >
              查看
            </Button>
            <Button
              type="text"
              size="small"
              icon={<IconEdit />}
              onClick={() => handleEdit(record)}
            >
              编辑
            </Button>
          </Space>
          {/* 第二行：上架/下架和删除 */}
          <Space size="small">
            <Popconfirm
              title={`确定要${record.status === 'online' ? '下架' : '上架'}此应用吗？`}
              onOk={() => handleToggleStatus(record)}
            >
              <Button
                type="text"
                size="small"
                icon={record.status === 'online' ? <IconDown /> : <IconUp />}
                status={record.status === 'online' ? 'danger' : 'success'}
              >
                {record.status === 'online' ? '下架' : '上架'}
              </Button>
            </Popconfirm>
            {/* 删除按钮只在下架状态显示 */}
            {record.status === 'offline' && (
              <Popconfirm
                title="确定要删除此应用吗？删除后无法恢复。"
                onOk={() => handleDelete(record)}
              >
                <Button
                  type="text"
                  size="small"
                  icon={<IconDelete />}
                  status="danger"
                >
                  删除
                </Button>
              </Popconfirm>
            )}
          </Space>
        </div>
      ),
    },
  ];

  return (
    <Card>

      {/* 搜索筛选区域 */}
      <Card style={{ marginBottom: '16px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr auto', gap: '16px', alignItems: 'flex-end' }}>
          <div>
            <div style={{ marginBottom: '4px', fontSize: '14px', color: '#666' }}>应用名称</div>
            <Input
              placeholder="请输入应用中文名或英文名"
              value={searchParams.keyword}
              onChange={(value) => setSearchParams(prev => ({ ...prev, keyword: value }))}
            />
          </div>
          <div>
            <div style={{ marginBottom: '4px', fontSize: '14px', color: '#666' }}>状态</div>
            <Select
              placeholder="选择状态"
              value={searchParams.status}
              onChange={(value) => setSearchParams(prev => ({ ...prev, status: value }))}
              allowClear
            >
              {statusOptions.map(option => (
                <Option key={option.value} value={option.value}>{option.label}</Option>
              ))}
            </Select>
          </div>
          <div>
            <div style={{ marginBottom: '4px', fontSize: '14px', color: '#666' }}>分类</div>
            <Select
              placeholder="选择分类"
              value={searchParams.category}
              onChange={(value) => setSearchParams(prev => ({ ...prev, category: value }))}
              allowClear
            >
              {categoryOptions.map(option => (
                <Option key={option.value} value={option.value}>{option.label}</Option>
              ))}
            </Select>
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
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', gap: '8px' }}>
            <Button type="primary" icon={<IconPlus />} onClick={handleAdd}>
              新增应用
            </Button>
          </div>
          {(() => {
            const getBatchOperation = () => {
              if (selectedRowKeys.length === 0) return null;
              
              const selectedApps = appData.filter(app => selectedRowKeys.includes(app.id));
              const onlineCount = selectedApps.filter(app => app.status === 'online').length;
              const offlineCount = selectedApps.filter(app => app.status === 'offline').length;
              
              if (offlineCount > 0 && onlineCount === 0) {
                return { action: 'online', text: '批量上架' };
              } else if (onlineCount > 0 && offlineCount === 0) {
                return { action: 'offline', text: '批量下架' };
              } else if (onlineCount > 0 && offlineCount > 0) {
                return { action: 'offline', text: '批量下架' };
              }
              return null;
            };
            
            const batchOp = getBatchOperation();
            return batchOp && (
              <div style={{
                display: 'flex',
                gap: '8px',
                paddingLeft: '12px',
                borderLeft: '1px solid #e5e6e7',
                marginLeft: '4px'
              }}>
                {batchOp.action === 'online' ? (
                  <Button 
                    type="primary" 
                    icon={<IconUp />} 
                    onClick={handleBatchOnline}
                  >
                    {batchOp.text}
                  </Button>
                ) : (
                  <Button 
                    status="danger" 
                    icon={<IconDown />} 
                    onClick={handleBatchOffline}
                  >
                    {batchOp.text}
                  </Button>
                )}
              </div>
            );
          })()}
        </div>
        {selectedRowKeys.length > 0 && (
          <div style={{ color: '#666', fontSize: '14px' }}>
            已选择 {selectedRowKeys.length} 项
          </div>
        )}
      </div>

      {/* 应用列表表格 */}
      <Table
        rowSelection={{
          selectedRowKeys,
          onChange: (selectedRowKeys: (string | number)[]) => {
            setSelectedRowKeys(selectedRowKeys as string[]);
          },
          checkboxProps: () => ({
            disabled: false,
          }),
        }}
        columns={columns}
        data={filteredData}
        rowKey="id"
        scroll={{ x: 1800 }}
        pagination={{
          pageSize: 10,
          showTotal: true,
          showJumper: true,
          sizeCanChange: true,
        }}
      />

      {/* 新增/编辑应用抽屉 */}
      <Drawer
        title={isEditing ? '编辑应用' : '新增应用'}
        visible={editModalVisible}
        onCancel={() => setEditModalVisible(false)}
        width={600}
        footer={
          <div style={{ textAlign: 'right' }}>
            <Space>
              <Button onClick={() => setEditModalVisible(false)}>取消</Button>
              <Button type="primary" onClick={() => handleSaveApp('save')}>保存</Button>
              <Button type="primary" status="success" onClick={() => handleSaveApp('publish')}>直接上架</Button>
            </Space>
          </div>
        }
      >
        <Form form={form} layout="vertical">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <Form.Item
              field="nameZh"
              label="应用名称（中文）"
              rules={[{ required: true, message: '请输入中文应用名称' }]}
            >
              <Input placeholder="请输入中文应用名称" />
            </Form.Item>
            
            <Form.Item
              field="nameEn"
              label="应用名称（英文）"
              rules={[{ required: true, message: '请输入英文应用名称' }]}
            >
              <Input placeholder="请输入英文应用名称" />
            </Form.Item>
          </div>
          
          <Form.Item
            field="descriptionZh"
            label="描述（中文）"
            rules={[{ required: true, message: '请输入中文描述' }]}
          >
            <TextArea placeholder="请输入中文描述" rows={3} />
          </Form.Item>
          
          <Form.Item
            field="descriptionEn"
            label="描述（英文）"
            rules={[{ required: true, message: '请输入英文描述' }]}
          >
            <TextArea placeholder="请输入英文描述" rows={3} />
          </Form.Item>
          
          <Form.Item
            field="category"
            label="归属分类"
            rules={[{ required: true, message: '请选择归属分类' }]}
          >
            <Select 
              placeholder="请选择归属分类" 
              mode="multiple"
              allowClear
            >
              {categoryOptions.map(option => (
                <Option key={option.value} value={option.value}>{option.label}</Option>
              ))}
            </Select>
          </Form.Item>
          
          <Form.Item
            field="appUrl"
            label="应用URL"
            rules={[
              { required: true, message: '请输入应用URL' },
              { 
                type: 'string',
                validator: (value, callback) => {
                  if (value && !value.startsWith('/')) {
                    callback('应用URL应以"/"开头，如：/dashboard');
                  } else {
                    callback();
                  }
                }
              }
            ]}
          >
            <Input 
              placeholder="请输入应用跳转的路由地址，如：/dashboard" 
              allowClear
            />
          </Form.Item>
          
          {/* 应用图标上传 */}
          <Form.Item
            field="icon"
            label="应用图标"
          >
            <Upload
              fileList={iconFileList}
              onChange={(fileList) => setIconFileList(fileList)}
              accept="image/*"
              limit={1}
              listType="picture-card"
              showUploadList={{
                previewIcon: true,
                removeIcon: true,
                cancelIcon: true,
              }}
            >
              {iconFileList.length === 0 && (
                <div>
                  <div style={{ marginTop: 8 }}>上传图标</div>
                </div>
              )}
            </Upload>
          </Form.Item>
          
          {/* 是否需要协议 */}
          <Form.Item
            field="requiresAgreement"
            label="是否需要协议"
          >
            <Checkbox
              checked={requiresAgreement}
              onChange={(checked) => {
                setRequiresAgreement(checked);
                if (!checked) {
                  setAgreementFileList([]);
                }
              }}
            >
              需要用户同意协议
            </Checkbox>
          </Form.Item>
          
          {/* 协议文件上传 */}
          {requiresAgreement && (
            <Form.Item
              field="agreementFile"
              label="协议模板文件"
              rules={[{ required: true, message: '请上传协议模板文件' }]}
            >
              <Upload
                fileList={agreementFileList}
                onChange={(fileList) => setAgreementFileList(fileList)}
                accept=".pdf,.doc,.docx"
                limit={1}
                showUploadList={{
                  previewIcon: true,
                  removeIcon: true,
                  cancelIcon: true,
                }}
              >
                <Button type="primary">上传协议文件</Button>
              </Upload>
            </Form.Item>
          )}
        </Form>
      </Drawer>

      {/* 查看应用详情弹窗 */}
      <Modal
        title="应用详情"
        visible={viewModalVisible}
        onCancel={() => setViewModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setViewModalVisible(false)}>
            关闭
          </Button>
        ]}
        style={{ width: 800 }}
      >
        {currentApp && (
          <div style={{ padding: '16px 0' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
              <div>
                <div style={{ fontWeight: 'bold', marginBottom: '8px' }}>应用名称（中文）</div>
                <div>{currentApp.nameZh}</div>
              </div>
              <div>
                <div style={{ fontWeight: 'bold', marginBottom: '8px' }}>应用名称（英文）</div>
                <div>{currentApp.nameEn}</div>
              </div>
            </div>
            
            <div style={{ marginBottom: '16px' }}>
              <div style={{ fontWeight: 'bold', marginBottom: '8px' }}>描述（中文）</div>
              <div>{currentApp.descriptionZh}</div>
            </div>
            
            <div style={{ marginBottom: '16px' }}>
              <div style={{ fontWeight: 'bold', marginBottom: '8px' }}>描述（英文）</div>
              <div>{currentApp.descriptionEn}</div>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
              <div>
                <div style={{ fontWeight: 'bold', marginBottom: '8px' }}>状态</div>
                <Tag color={currentApp.status === 'online' ? 'green' : 'red'}>
                  {currentApp.status === 'online' ? '上架' : '下架'}
                </Tag>
              </div>
              <div>
                <div style={{ fontWeight: 'bold', marginBottom: '8px' }}>归属分类</div>
                {renderCategoryTags(currentApp.category)}
              </div>
            </div>
            
            <div style={{ marginBottom: '16px' }}>
              <div style={{ fontWeight: 'bold', marginBottom: '8px' }}>应用URL</div>
              <div>{currentApp.appUrl || '未设置'}</div>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
              <div>
                <div style={{ fontWeight: 'bold', marginBottom: '8px' }}>创建人</div>
                <div>{currentApp.creator}</div>
              </div>
              <div>
                <div style={{ fontWeight: 'bold', marginBottom: '8px' }}>创建时间</div>
                <div>{currentApp.createTime}</div>
              </div>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div>
                <div style={{ fontWeight: 'bold', marginBottom: '8px' }}>最后修改人</div>
                <div>{currentApp.lastModifier}</div>
              </div>
              <div>
                <div style={{ fontWeight: 'bold', marginBottom: '8px' }}>最后修改时间</div>
                <div>{currentApp.lastModifyTime}</div>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </Card>
  );
};

export default AppListManagement;