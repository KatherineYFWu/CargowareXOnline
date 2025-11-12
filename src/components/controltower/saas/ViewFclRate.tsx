import React, { useState, useEffect } from 'react';
import { 
  Card, 
  Breadcrumb,
  Typography, 
  Button, 
  Space, 
  Table,
  Descriptions,
  Modal,
  InputNumber,
  Select,
  Grid,
  Input,
  Message
} from '@arco-design/web-react';
import { IconArrowLeft, IconDownload, IconCopy, IconPrinter } from '@arco-design/web-react/icon';
import { useNavigate, useParams } from 'react-router-dom';
import ControlTowerSaasLayout from './ControlTowerSaasLayout';

const { Title } = Typography;
const { Row, Col } = Grid;
const { Option } = Select;
const { TextArea } = Input;

// 按箱型计费项目接口
interface ContainerRateItem {
  key: number;
  feeName: string;
  currency: string;
  '20gp': string;
  '40gp': string;
  '40hc': string;
  '45hc': string;
  '40nor': string;
  '20nor': string;
  '20hc': string;
  '20tk': string;
  '40tk': string;
  '20ot': string;
  '40ot': string;
  '20fr': string;
  '40fr': string;
  specialNote: string;
}

// 非按箱型计费项目接口
interface NonContainerRateItem {
  key: number;
  feeName: string;
  currency: string;
  unit: string;
  price: string;
  specialNote: string;
}

/**
 * 整箱运价查看页面
 */
const ViewFclRate: React.FC = () => {
  const navigate = useNavigate();
  const params = useParams();

  const rateId = params.id;
  
  // 基本信息状态
  const [rateData, setRateData] = useState<any>({
    routeLine: '', // 确保有默认值
  });
  
  // 按箱型计费列表状态 - 海运费
  const [containerRateList, setContainerRateList] = useState<ContainerRateItem[]>([]);
  
  // 按箱型计费列表状态 - 附加费
  const [containerSurchargeList, setContainerSurchargeList] = useState<ContainerRateItem[]>([]);
  
  // 非按箱型计费列表状态
  const [nonContainerRateList, setNonContainerRateList] = useState<NonContainerRateItem[]>([]);
  
  // 非按箱型计费列表状态 - 附加费
  const [nonContainerSurchargeList, setNonContainerSurchargeList] = useState<NonContainerRateItem[]>([]);
  
  // 箱型显示设置
  const [boxTypeVisibility] = useState({
    '20gp': true,
    '40gp': true,
    '40hc': true,
    '20nor': true,
    '40nor': true,
    '45hc': true,
    '20hc': false,
    '20tk': false,
    '40tk': false,
    '20ot': false,
    '40ot': false,
    '20fr': false,
    '40fr': false
  });

  // 导出运价相关状态
  const [exportModalVisible, setExportModalVisible] = useState(false);
  const [containerSelections, setContainerSelections] = useState<Array<{
    id: number;
    type: string;
    count: number;
  }>>([{ id: 1, type: '20gp', count: 1 }]);
  const [copyTextModalVisible, setCopyTextModalVisible] = useState(false);
  const [pdfPreviewVisible, setPdfPreviewVisible] = useState(false);
  const [quotationText, setQuotationText] = useState('');

  // 加载运价数据
  useEffect(() => {
    if (rateId) {
      loadRateData(rateId);
    }
  }, [rateId]);

  const loadRateData = async (id: string) => {
    try {
      
      // 模拟API调用获取运价数据
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // 模拟返回的数据
      const mockData = {
        routeCode: `FCL${id}`,
        rateType: '合约价',
        cargoType: '普货',
        departurePort: 'CNSHA',
        dischargePort: 'USLAX',
        transitType: '直达',
        shipCompany: 'COSCO',
        spaceStatus: '正常',
        contractNo: 'CONTRACT001',
        priceStatus: '价格稳定',
        nac: 'NAC01',
        routeLine: '美加线',
        vesselSchedule: ['周一', '周三'],
        voyage: 15,
        chargeSpecialNote: '注意包装',
        shipName: 'COSCO SHIPPING',
        voyageNumber: 'V001',
        freeContainerDays: 7,
        freeStorageDays: 5,
        validFrom: '2024-04-01',
        validTo: '2024-04-30',
        overweightNote: '超重加收费用',
        notes: '该运价已包含基本港杂费'
      };
      
      setRateData(mockData);
      
      // 模拟按箱型计费数据 - 海运费
      setContainerRateList([
        {
          key: 1,
          feeName: '海运费',
          currency: 'USD',
          '20gp': '1500',
          '40gp': '2500',
          '40hc': '2700',
          '45hc': '2900',
          '40nor': '2500',
          '20nor': '1500',
          '20hc': '',
          '20tk': '',
          '40tk': '',
          '20ot': '',
          '40ot': '',
          '20fr': '',
          '40fr': '',
          specialNote: '包含基本港杂费'
        }
      ]);
      
      // 模拟按箱型计费数据 - 附加费
      setContainerSurchargeList([
        {
          key: 1,
          feeName: 'THC',
          currency: 'USD',
          '20gp': '120',
          '40gp': '180',
          '40hc': '180',
          '45hc': '200',
          '40nor': '180',
          '20nor': '120',
          '20hc': '',
          '20tk': '',
          '40tk': '',
          '20ot': '',
          '40ot': '',
          '20fr': '',
          '40fr': '',
          specialNote: '码头操作费'
        },
        {
          key: 2,
          feeName: '操作费',
          currency: 'USD',
          '20gp': '50',
          '40gp': '80',
          '40hc': '80',
          '45hc': '90',
          '40nor': '80',
          '20nor': '50',
          '20hc': '',
          '20tk': '',
          '40tk': '',
          '20ot': '',
          '40ot': '',
          '20fr': '',
          '40fr': '',
          specialNote: '订舱操作费'
        }
      ]);
      
      // 模拟非按箱型计费数据 - 海运费
      setNonContainerRateList([
        {
          key: 1,
          feeName: '订舱费',
          currency: 'USD',
          unit: '票',
          price: '50',
          specialNote: '每票收取'
        }
      ]);
      
      // 模拟非按箱型计费数据 - 附加费
      setNonContainerSurchargeList([
        {
          key: 1,
          feeName: '铅封费',
          currency: 'USD',
          unit: '个',
          price: '15',
          specialNote: '每个铅封收取'
        },
        {
          key: 2,
          feeName: '打单费',
          currency: 'USD',
          unit: '票',
          price: '25',
          specialNote: '单据打印费'
        },
        {
          key: 3,
          feeName: 'EDI费',
          currency: 'USD',
          unit: '票',
          price: '30',
          specialNote: '电子数据交换费'
        }
      ]);
      
    } catch (error) {
      console.error('加载运价数据失败:', error);
    } finally {
      
    }
  };

  // 返回运价维护列表页
  const handleGoBack = () => {
    navigate('/controltower/saas/fcl-rates');
  };

  // 立即订舱
  const handleBookingNow = () => {
    navigate('/controltower/saas/booking-submission-for-client');
  };

  // 导出运价
  const handleExportRate = () => {
    setExportModalVisible(true);
  };

  // 生成快捷报价文本
  const generateQuotationText = () => {
    const selectedContainers = containerSelections
      .filter(item => item.count > 0)
      .map(item => `${item.count}*${item.type.toUpperCase()}`)
      .join(' + ');

    if (!selectedContainers || containerSelections.length === 0) {
      Message.warning('请先选择箱型箱量');
      return;
    }

    // 计算总价格
    let totalOceanFreight = 0;
    let totalSurcharge = 0;
    let totalOtherFees = 0;

    containerSelections.forEach(selection => {
      if (selection.count > 0) {
        // 海运费
        const oceanFee = containerRateList.find(item => item.feeName === '海运费');
        if (oceanFee && oceanFee[selection.type as keyof ContainerRateItem]) {
          totalOceanFreight += parseInt(oceanFee[selection.type as keyof ContainerRateItem] as string || '0') * selection.count;
        }

        // 附加费
        containerSurchargeList.forEach(item => {
          if (item[selection.type as keyof ContainerRateItem]) {
            totalSurcharge += parseInt(item[selection.type as keyof ContainerRateItem] as string || '0') * selection.count;
          }
        });
      }
    });

    // 非按箱型计费
    nonContainerRateList.forEach(item => {
      totalOtherFees += parseInt(item.price || '0');
    });
    nonContainerSurchargeList.forEach(item => {
      totalOtherFees += parseInt(item.price || '0');
    });

    const totalCost = totalOceanFreight + totalSurcharge + totalOtherFees;

    const text = `
【整箱运价报价】

运价编号：${rateData.routeCode}
航线：${rateData.departurePort} → ${rateData.dischargePort}
船公司：${rateData.shipCompany}
箱型箱量：${selectedContainers}

价格明细：
- 海运费：USD ${totalOceanFreight}
- 附加费：USD ${totalSurcharge}
- 其他费用：USD ${totalOtherFees}
总计：USD ${totalCost}

有效期：${rateData.validFrom} ~ ${rateData.validTo}
船期：${rateData.vesselSchedule?.join(', ')}
航程：${rateData.voyage} 天
免用箱：${rateData.freeContainerDays} 天
免堆存：${rateData.freeStorageDays} 天

备注：${rateData.notes}

※ 以上价格仅供参考，实际价格以正式合同为准
※ 如有任何疑问，请联系我们的客服团队
    `.trim();

    setQuotationText(text);
    setExportModalVisible(false);
    setCopyTextModalVisible(true);
  };

  // 复制到剪贴板
  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(quotationText);
      Message.success('报价文本已复制到剪贴板');
      setCopyTextModalVisible(false);
    } catch (err) {
      Message.error('复制失败，请手动复制');
    }
  };

  // 生成并预览PDF
  const generatePDF = () => {
    const selectedContainers = containerSelections.filter(item => item.count > 0);

    if (selectedContainers.length === 0) {
      Message.warning('请先选择箱型箱量');
      return;
    }

    setExportModalVisible(false);
    setPdfPreviewVisible(true);
  };

  // 添加新的箱型选择
  const addContainerSelection = () => {
    const newId = Math.max(...containerSelections.map(item => item.id)) + 1;
    setContainerSelections([...containerSelections, { id: newId, type: '20gp', count: 1 }]);
  };

  // 删除箱型选择
  const removeContainerSelection = (id: number) => {
    if (containerSelections.length > 1) {
      setContainerSelections(containerSelections.filter(item => item.id !== id));
    }
  };

  // 更新箱型选择
  const updateContainerSelection = (id: number, field: 'type' | 'count', value: string | number) => {
    setContainerSelections(containerSelections.map(item => 
      item.id === id ? { ...item, [field]: value } : item
    ));
  };

  // 获取可选择的箱型列表
  const getAvailableContainerTypes = () => {
    return Object.entries(boxTypeVisibility)
      .filter(([_, visible]) => visible)
      .map(([type, _]) => ({ label: type.toUpperCase(), value: type }));
  };

  return (
    <ControlTowerSaasLayout 
      menuSelectedKey="2" 
      breadcrumb={
        <Breadcrumb>
          <Breadcrumb.Item>运价管理</Breadcrumb.Item>
          <Breadcrumb.Item>运价维护</Breadcrumb.Item>
          <Breadcrumb.Item>查看整箱运价</Breadcrumb.Item>
        </Breadcrumb>
      }
    >
      {/* 页面头部 */}
      <Card style={{ marginBottom: '20px' }}>
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <Title heading={4} style={{ margin: 0 }}>查看整箱运价</Title>
          </div>
          <Space>
            <Button onClick={handleGoBack} icon={<IconArrowLeft />}>返回</Button>
            <Button 
              type="primary" 
              onClick={handleExportRate} 
              icon={<IconDownload />}
            >
              导出运价
            </Button>
            <Button 
              style={{ 
                backgroundColor: '#ff6b35', 
                borderColor: '#ff6b35',
                color: '#fff',
                fontWeight: 'bold',
                boxShadow: '0 2px 8px rgba(255, 107, 53, 0.3)'
              }}
              onClick={handleBookingNow}
            >
              🚢 立即订舱
            </Button>
          </Space>
        </div>
      </Card>

        {/* 基本信息区域 */}
        <Card title="基本信息" className="mb-6">
          <Descriptions 
            column={3}
            layout="vertical"
            data={[
              { label: '运价号', value: rateData.routeCode },
              { label: '运价类型', value: rateData.rateType },
              { label: '货物类型', value: rateData.cargoType },
              { label: '舱位状态', value: rateData.spaceStatus },
              { label: '价格趋势', value: rateData.priceStatus },
            ]}
          />
        </Card>

        {/* 航线信息区域 */}
        <Card title="航线信息" className="mb-6">
          <Descriptions 
            column={3}
            layout="vertical"
            data={[
              { label: '航线', value: rateData.routeLine || '美加线' },
              { label: '航线代码', value: rateData.lineCode || '-' },
              { label: '收货地', value: rateData.placeOfReceipt || '-' },
              { label: '起运港', value: rateData.departurePort },
              { label: '卸货港', value: rateData.dischargePort || '-' },
              { label: '目的港', value: rateData.finalDestination },
              { label: '直达/中转', value: rateData.transitType },
              { label: '船名', value: rateData.shipName },
              { label: '航次', value: rateData.voyageNumber },
              { label: '船期', value: rateData.vesselSchedule?.join(', ') },
              { label: '航程', value: `${rateData.voyage} 天` },
              { label: 'ETD', value: rateData.etd || '-' },
              { label: 'ETA', value: rateData.eta || '-' },
              ...(rateData.transitType === '中转' ? [
                { label: '中转港 (1st)', value: rateData.transitPort1st || '-' },
                { label: '中转港 (2nd)', value: rateData.transitPort2nd || '-' },
                { label: '中转港 (3rd)', value: rateData.transitPort3rd || '-' },
              ] : [])
            ]}
          />
        </Card>

        {/* 船公司信息区域 */}
        <Card title="船公司信息" className="mb-6">
          <Descriptions 
            column={3}
            layout="vertical"
            data={[
              { label: '船公司', value: rateData.shipCompany },
              { label: '约号', value: rateData.contractNo },
              { label: 'NAC', value: rateData.nac },
            ]}
          />
        </Card>

        {/* 免费期限设置 */}
        <Card title="D&D" className="mb-6">
          <Descriptions 
            column={2}
            layout="vertical"
            data={[
              { label: '免用箱', value: `${rateData.freeContainerDays} 天` },
              { label: '免堆存', value: `${rateData.freeStorageDays} 天` },
            ]}
          />
        </Card>

        {/* 有效期设置 */}
        <Card title="有效期设置" className="mb-6">
          <Descriptions 
            column={1}
            layout="vertical"
            data={[
              { label: '有效期', value: `${rateData.validFrom} ~ ${rateData.validTo}` },
            ]}
          />
        </Card>

        {/* 备注信息 */}
        <Card title="备注信息" className="mb-6">
          <Descriptions 
            column={2}
            layout="vertical"
            data={[
              { label: '超重说明', value: rateData.overweightNote },
              { label: '接货特殊说明', value: rateData.chargeSpecialNote },
              { label: '备注', value: rateData.notes, span: 2 },
            ]}
          />
        </Card>

        {/* 海运费区域 */}
        <Card title="海运费" className="mb-6">
          {/* 按箱型计费 - 海运费 */}
          <div className="mb-8">
            <div className="text-blue-600 font-bold border-l-4 border-blue-600 pl-2 mb-4">按箱型计费</div>
            
            <Table
              borderCell={true}
              columns={[
                {
                  title: '费用名称',
                  dataIndex: 'feeName',
                  width: 180,
                },
                {
                  title: '币种',
                  dataIndex: 'currency',
                  width: 120,
                },
                ...(boxTypeVisibility['20gp'] ? [{
                  title: '20GP',
                  dataIndex: '20gp',
                  width: 120,
                  render: (value: string) => value ? `$ ${value}` : '-'
                }] : []),
                ...(boxTypeVisibility['40gp'] ? [{
                  title: '40GP',
                  dataIndex: '40gp',
                  width: 120,
                  render: (value: string) => value ? `$ ${value}` : '-'
                }] : []),
                ...(boxTypeVisibility['40hc'] ? [{
                  title: '40HC',
                  dataIndex: '40hc',
                  width: 120,
                  render: (value: string) => value ? `$ ${value}` : '-'
                }] : []),
                ...(boxTypeVisibility['20nor'] ? [{
                  title: '20NOR',
                  dataIndex: '20nor',
                  width: 120,
                  render: (value: string) => value ? `$ ${value}` : '-'
                }] : []),
                ...(boxTypeVisibility['40nor'] ? [{
                  title: '40NOR',
                  dataIndex: '40nor',
                  width: 120,
                  render: (value: string) => value ? `$ ${value}` : '-'
                }] : []),
                ...(boxTypeVisibility['45hc'] ? [{
                  title: '45HC',
                  dataIndex: '45hc',
                  width: 120,
                  render: (value: string) => value ? `$ ${value}` : '-'
                }] : []),
                {
                  title: '特殊备注',
                  dataIndex: 'specialNote',
                  width: 200,
                }
              ]}
              data={containerRateList}
              pagination={false}
              scroll={{ x: 'max-content' }}
            />
          </div>

          {/* 非按箱型计费 - 海运费 */}
          <div className="mb-4">
            <div className="text-green-600 font-bold border-l-4 border-green-600 pl-2 mb-4">非按箱型计费</div>
            
            <Table
              borderCell={true}
              columns={[
                {
                  title: '费用名称',
                  dataIndex: 'feeName',
                  width: 200,
                },
                {
                  title: '币种',
                  dataIndex: 'currency',
                  width: 120,
                },
                {
                  title: '计费单位',
                  dataIndex: 'unit',
                  width: 120,
                },
                {
                  title: '单价',
                  dataIndex: 'price',
                  width: 150,
                  render: (value: string, record: NonContainerRateItem) => value ? `${record.currency} ${value}` : '-'
                },
                {
                  title: '特殊备注',
                  dataIndex: 'specialNote',
                  width: 250,
                }
              ]}
              data={nonContainerRateList}
              pagination={false}
              scroll={{ x: 'max-content' }}
            />
          </div>
        </Card>

        {/* 附加费区域 */}
        <Card title="附加费" className="mb-6">
          {/* 按箱型计费 - 附加费 */}
          <div className="mb-8">
            <div className="text-orange-600 font-bold border-l-4 border-orange-600 pl-2 mb-4">按箱型计费</div>
            
            <Table
              borderCell={true}
              columns={[
                {
                  title: '费用名称',
                  dataIndex: 'feeName',
                  width: 180,
                },
                {
                  title: '币种',
                  dataIndex: 'currency',
                  width: 120,
                },
                ...(boxTypeVisibility['20gp'] ? [{
                  title: '20GP',
                  dataIndex: '20gp',
                  width: 120,
                  render: (value: string) => value ? `$ ${value}` : '-'
                }] : []),
                ...(boxTypeVisibility['40gp'] ? [{
                  title: '40GP',
                  dataIndex: '40gp',
                  width: 120,
                  render: (value: string) => value ? `$ ${value}` : '-'
                }] : []),
                ...(boxTypeVisibility['40hc'] ? [{
                  title: '40HC',
                  dataIndex: '40hc',
                  width: 120,
                  render: (value: string) => value ? `$ ${value}` : '-'
                }] : []),
                ...(boxTypeVisibility['20nor'] ? [{
                  title: '20NOR',
                  dataIndex: '20nor',
                  width: 120,
                  render: (value: string) => value ? `$ ${value}` : '-'
                }] : []),
                ...(boxTypeVisibility['40nor'] ? [{
                  title: '40NOR',
                  dataIndex: '40nor',
                  width: 120,
                  render: (value: string) => value ? `$ ${value}` : '-'
                }] : []),
                ...(boxTypeVisibility['45hc'] ? [{
                  title: '45HC',
                  dataIndex: '45hc',
                  width: 120,
                  render: (value: string) => value ? `$ ${value}` : '-'
                }] : []),
                {
                  title: '特殊备注',
                  dataIndex: 'specialNote',
                  width: 200,
                }
              ]}
              data={containerSurchargeList}
              pagination={false}
              scroll={{ x: 'max-content' }}
            />
          </div>

          {/* 非按箱型计费 - 附加费 */}
          <div className="mb-4">
            <div className="text-purple-600 font-bold border-l-4 border-purple-600 pl-2 mb-4">非按箱型计费</div>
            
            <Table
              borderCell={true}
              columns={[
                {
                  title: '费用名称',
                  dataIndex: 'feeName',
                  width: 200,
                },
                {
                  title: '币种',
                  dataIndex: 'currency',
                  width: 120,
                },
                {
                  title: '计费单位',
                  dataIndex: 'unit',
                  width: 120,
                },
                {
                  title: '单价',
                  dataIndex: 'price',
                  width: 150,
                  render: (value: string, record: NonContainerRateItem) => value ? `${record.currency} ${value}` : '-'
                },
                {
                  title: '特殊备注',
                  dataIndex: 'specialNote',
                  width: 250,
                }
              ]}
              data={nonContainerSurchargeList}
              pagination={false}
              scroll={{ x: 'max-content' }}
            />
                  </div>
      </Card>

      {/* 导出运价弹窗 */}
      <Modal
        title="导出运价"
        visible={exportModalVisible}
        onCancel={() => setExportModalVisible(false)}
        footer={null}
        style={{ width: 600 }}
      >
        <div className="space-y-6">
          {/* 箱型箱量选择 */}
          <div>
            <div className="flex justify-between items-center mb-4">
              <h4 className="text-lg font-medium">选择箱型箱量</h4>
              <Button 
                type="primary" 
                size="small"
                onClick={addContainerSelection}
              >
                + 添加箱型
              </Button>
            </div>
            
            <div className="space-y-3">
              {containerSelections.map((selection) => (
                <Row key={selection.id} gutter={16} align="center">
                  <Col span={8}>
                    <Select
                      placeholder="选择箱型"
                      value={selection.type}
                      onChange={(value) => updateContainerSelection(selection.id, 'type', value)}
                      style={{ width: '100%' }}
                    >
                      {getAvailableContainerTypes().map(option => (
                        <Option key={option.value} value={option.value}>
                          {option.label}
                        </Option>
                      ))}
                    </Select>
                  </Col>
                  <Col span={8}>
                    <InputNumber
                      min={1}
                      max={999}
                      value={selection.count}
                      onChange={(value) => updateContainerSelection(selection.id, 'count', value || 1)}
                      style={{ width: '100%' }}
                      placeholder="数量"
                    />
                  </Col>
                  <Col span={8}>
                    <Button
                      type="text"
                      status="danger"
                      disabled={containerSelections.length === 1}
                      onClick={() => removeContainerSelection(selection.id)}
                    >
                      删除
                    </Button>
                  </Col>
                </Row>
              ))}
            </div>
          </div>

          {/* 操作按钮 */}
          <div className="flex justify-center gap-4">
            <Button
              type="primary"
              icon={<IconCopy />}
              onClick={generateQuotationText}
              size="large"
            >
              复制快捷报价文本
            </Button>
            <Button
              type="primary"
              icon={<IconPrinter />}
              onClick={generatePDF}
              size="large"
            >
              打印报价单文件
            </Button>
          </div>
        </div>
      </Modal>

      {/* 快捷报价文本弹窗 */}
      <Modal
        title="快捷报价文本"
        visible={copyTextModalVisible}
        onCancel={() => setCopyTextModalVisible(false)}
        footer={
          <div className="flex justify-end space-x-2">
            <Button onClick={() => setCopyTextModalVisible(false)}>
              关闭
            </Button>
            <Button type="primary" icon={<IconCopy />} onClick={copyToClipboard}>
              复制文本
            </Button>
          </div>
        }
        style={{ width: 700 }}
      >
        <div className="space-y-4">
          <p className="text-sm text-gray-600">
            以下是根据您选择的箱型箱量生成的报价文本，您可以复制后发送给客户：
          </p>
          <TextArea
            value={quotationText}
            readOnly
            rows={15}
            style={{ fontFamily: 'monospace' }}
          />
        </div>
      </Modal>

      {/* PDF预览弹窗 */}
      <Modal
        title="报价单预览"
        visible={pdfPreviewVisible}
        onCancel={() => setPdfPreviewVisible(false)}
        footer={
          <div className="flex justify-end space-x-2">
            <Button onClick={() => setPdfPreviewVisible(false)}>
              关闭
            </Button>
            <Button type="primary" icon={<IconDownload />}>
              下载PDF
            </Button>
          </div>
        }
        style={{ width: 900, top: 20 }}
      >
        <div className="space-y-4" style={{ height: '600px', overflow: 'auto' }}>
          {/* PDF预览内容 */}
          <div className="bg-white p-8 shadow-sm border" style={{ fontFamily: 'SimSun, serif' }}>
            <div className="text-center mb-8">
              <h1 className="text-2xl font-bold mb-2">整箱运价报价单</h1>
              <p className="text-gray-600">Quotation for FCL Rate</p>
            </div>

            {/* 基本信息 */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-3 pb-2 border-b">基本信息</h3>
              <Row gutter={[16, 8]}>
                <Col span={8}>运价编号：{rateData.routeCode}</Col>
                <Col span={8}>运价类型：{rateData.rateType}</Col>
                <Col span={8}>货物类型：{rateData.cargoType}</Col>
                <Col span={8}>起运港：{rateData.departurePort}</Col>
                <Col span={8}>目的港：{rateData.dischargePort}</Col>
                <Col span={8}>船公司：{rateData.shipCompany}</Col>
              </Row>
            </div>

            {/* 箱型箱量 */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-3 pb-2 border-b">箱型箱量</h3>
              <div className="grid grid-cols-3 gap-4">
                {containerSelections
                  .filter(selection => selection.count > 0)
                  .map(selection => (
                    <div key={selection.id} className="border p-3 text-center">
                      <div className="font-medium">{selection.type.toUpperCase()}</div>
                      <div className="text-xl font-bold text-blue-600">{selection.count} 箱</div>
                    </div>
                  ))}
              </div>
            </div>

            {/* 海运费明细 */}
            <div className="mb-6">
              <div className="bg-blue-50 px-4 py-2 mb-3 rounded">
                <h3 className="text-lg font-semibold text-blue-800">海运费明细</h3>
              </div>
              <table className="w-full border-collapse border border-gray-300 shadow-sm">
                <thead>
                  <tr className="bg-blue-100">
                    <th className="border border-gray-300 p-3 text-left font-semibold">费用项目</th>
                    <th className="border border-gray-300 p-3 text-center font-semibold">币种</th>
                    {containerSelections
                      .filter(selection => selection.count > 0)
                      .map(selection => (
                        <th key={selection.id} className="border border-gray-300 p-3 text-center font-semibold">
                          {selection.type.toUpperCase()} × {selection.count}
                        </th>
                      ))}
                    <th className="border border-gray-300 p-3 text-center font-semibold bg-blue-200">小计</th>
                  </tr>
                </thead>
                <tbody>
                  {containerRateList.map((item, index) => (
                    <tr key={item.key} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                      <td className="border border-gray-300 p-3 font-medium">{item.feeName}</td>
                      <td className="border border-gray-300 p-3 text-center">{item.currency}</td>
                      {containerSelections
                        .filter(selection => selection.count > 0)
                        .map(selection => {
                          const unitPrice = item[selection.type as keyof ContainerRateItem] as string;
                          const totalPrice = unitPrice ? parseInt(unitPrice) * selection.count : 0;
                          return (
                            <td key={selection.id} className="border border-gray-300 p-3 text-center">
                              {unitPrice ? (
                                <div>
                                  <div className="text-sm text-gray-600">{item.currency} {unitPrice} × {selection.count}</div>
                                  <div className="font-medium">{item.currency} {totalPrice}</div>
                                </div>
                              ) : (
                                <span className="text-gray-400">-</span>
                              )}
                            </td>
                          );
                        })}
                      <td className="border border-gray-300 p-3 text-center font-bold text-blue-700 bg-blue-50">
                        {item.currency} {containerSelections
                          .filter(selection => selection.count > 0)
                          .reduce((sum, selection) => {
                            const price = item[selection.type as keyof ContainerRateItem] as string;
                            return sum + (price ? parseInt(price) * selection.count : 0);
                          }, 0)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* 附加费明细 */}
            <div className="mb-6">
              <div className="bg-orange-50 px-4 py-2 mb-3 rounded">
                <h3 className="text-lg font-semibold text-orange-800">附加费明细</h3>
              </div>
              <table className="w-full border-collapse border border-gray-300 shadow-sm">
                <thead>
                  <tr className="bg-orange-100">
                    <th className="border border-gray-300 p-3 text-left font-semibold">费用项目</th>
                    <th className="border border-gray-300 p-3 text-center font-semibold">币种</th>
                    {containerSelections
                      .filter(selection => selection.count > 0)
                      .map(selection => (
                        <th key={selection.id} className="border border-gray-300 p-3 text-center font-semibold">
                          {selection.type.toUpperCase()} × {selection.count}
                        </th>
                      ))}
                    <th className="border border-gray-300 p-3 text-center font-semibold bg-orange-200">小计</th>
                  </tr>
                </thead>
                <tbody>
                  {containerSurchargeList.map((item, index) => (
                    <tr key={item.key} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                      <td className="border border-gray-300 p-3 font-medium">{item.feeName}</td>
                      <td className="border border-gray-300 p-3 text-center">{item.currency}</td>
                      {containerSelections
                        .filter(selection => selection.count > 0)
                        .map(selection => {
                          const unitPrice = item[selection.type as keyof ContainerRateItem] as string;
                          const totalPrice = unitPrice ? parseInt(unitPrice) * selection.count : 0;
                          return (
                            <td key={selection.id} className="border border-gray-300 p-3 text-center">
                              {unitPrice ? (
                                <div>
                                  <div className="text-sm text-gray-600">{item.currency} {unitPrice} × {selection.count}</div>
                                  <div className="font-medium">{item.currency} {totalPrice}</div>
                                </div>
                              ) : (
                                <span className="text-gray-400">-</span>
                              )}
                            </td>
                          );
                        })}
                      <td className="border border-gray-300 p-3 text-center font-bold text-orange-700 bg-orange-50">
                        {item.currency} {containerSelections
                          .filter(selection => selection.count > 0)
                          .reduce((sum, selection) => {
                            const price = item[selection.type as keyof ContainerRateItem] as string;
                            return sum + (price ? parseInt(price) * selection.count : 0);
                          }, 0)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* 其他费用明细 */}
            {(nonContainerRateList.length > 0 || nonContainerSurchargeList.length > 0) && (
              <div className="mb-6">
                <div className="bg-green-50 px-4 py-2 mb-3 rounded">
                  <h3 className="text-lg font-semibold text-green-800">其他费用明细</h3>
                </div>
                <table className="w-full border-collapse border border-gray-300 shadow-sm">
                  <thead>
                    <tr className="bg-green-100">
                      <th className="border border-gray-300 p-3 text-left font-semibold">费用项目</th>
                      <th className="border border-gray-300 p-3 text-center font-semibold">币种</th>
                      <th className="border border-gray-300 p-3 text-center font-semibold">计费单位</th>
                      <th className="border border-gray-300 p-3 text-center font-semibold">单价</th>
                      <th className="border border-gray-300 p-3 text-center font-semibold">备注</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[...nonContainerRateList, ...nonContainerSurchargeList].map((item, index) => (
                      <tr key={item.key} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                        <td className="border border-gray-300 p-3 font-medium">{item.feeName}</td>
                        <td className="border border-gray-300 p-3 text-center">{item.currency}</td>
                        <td className="border border-gray-300 p-3 text-center">{item.unit}</td>
                        <td className="border border-gray-300 p-3 text-center font-medium">
                          {item.currency} {item.price}
                        </td>
                        <td className="border border-gray-300 p-3 text-sm text-gray-600">{item.specialNote}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* 费用汇总 */}
            <div className="mb-6">
              <div className="bg-gray-100 px-4 py-2 mb-3 rounded">
                <h3 className="text-lg font-semibold text-gray-800">费用汇总</h3>
              </div>
              <div className="bg-gray-50 p-4 rounded border">
                <Row gutter={[16, 8]}>
                  <Col span={12}>
                    <div className="text-lg">
                      <span className="text-gray-600">海运费总计：</span>
                      <span className="font-bold text-blue-700">
                        USD {containerRateList.reduce((total, item) => {
                          return total + containerSelections
                            .filter(selection => selection.count > 0)
                            .reduce((sum, selection) => {
                              const price = item[selection.type as keyof ContainerRateItem] as string;
                              return sum + (price ? parseInt(price) * selection.count : 0);
                            }, 0);
                        }, 0)}
                      </span>
                    </div>
                  </Col>
                  <Col span={12}>
                    <div className="text-lg">
                      <span className="text-gray-600">附加费总计：</span>
                      <span className="font-bold text-orange-700">
                        USD {containerSurchargeList.reduce((total, item) => {
                          return total + containerSelections
                            .filter(selection => selection.count > 0)
                            .reduce((sum, selection) => {
                              const price = item[selection.type as keyof ContainerRateItem] as string;
                              return sum + (price ? parseInt(price) * selection.count : 0);
                            }, 0);
                        }, 0)}
                      </span>
                    </div>
                  </Col>
                  <Col span={24}>
                    <div className="text-xl pt-3 border-t border-gray-300 mt-3">
                      <span className="text-gray-600">报价总计：</span>
                      <span className="font-bold text-2xl text-red-600">
                        USD {[...containerRateList, ...containerSurchargeList].reduce((total, item) => {
                          return total + containerSelections
                            .filter(selection => selection.count > 0)
                            .reduce((sum, selection) => {
                              const price = item[selection.type as keyof ContainerRateItem] as string;
                              return sum + (price ? parseInt(price) * selection.count : 0);
                            }, 0);
                        }, 0) + [...nonContainerRateList, ...nonContainerSurchargeList].reduce((sum, item) => sum + parseInt(item.price || '0'), 0)}
                      </span>
                    </div>
                  </Col>
                </Row>
              </div>
            </div>

            {/* 其他信息 */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-3 pb-2 border-b">其他信息</h3>
              <Row gutter={[16, 8]}>
                <Col span={12}>有效期：{rateData.validFrom} ~ {rateData.validTo}</Col>
                <Col span={12}>船期：{rateData.vesselSchedule?.join(', ')}</Col>
                <Col span={12}>航程：{rateData.voyage} 天</Col>
                <Col span={12}>免用箱：{rateData.freeContainerDays} 天</Col>
                <Col span={12}>免堆存：{rateData.freeStorageDays} 天</Col>
              </Row>
            </div>

            {/* 备注 */}
            {rateData.notes && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-3 pb-2 border-b">备注</h3>
                <p className="text-gray-700">{rateData.notes}</p>
              </div>
            )}

            {/* 免责声明 */}
            <div className="mt-8 p-4 bg-gray-50 border-l-4 border-yellow-400">
              <p className="text-sm text-gray-600 mb-2">
                <strong>重要声明：</strong>
              </p>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• 以上价格仅供参考，实际价格以正式合同为准</li>
                <li>• 价格有效期以报价单中标注的日期为准</li>
                <li>• 如有任何疑问，请联系我们的客服团队</li>
              </ul>
            </div>

            {/* 页脚 */}
            <div className="mt-8 text-center text-sm text-gray-500">
              <p>报价单生成时间：{new Date().toLocaleString()}</p>
            </div>
          </div>
        </div>
      </Modal>
    </ControlTowerSaasLayout>
  );
};

export default ViewFclRate;