import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, Button, Table, Descriptions, Typography, Space } from '@arco-design/web-react';
import { IconArrowLeft, IconDownload } from '@arco-design/web-react/icon';

const { Title, Text } = Typography;

/**
 * 标书详情页面数据接口
 */
interface BidDetailData {
  // 基本信息
  tenderCode: string;        // 招标编号
  tenderTitle: string;       // 招标标题
  tenderCompany: string;     // 招标公司
  bidCode: string;           // 投标编号
  bidCompany: string;        // 投标企业
  legalRepresentative: string; // 法人代表
  bidDate: string;           // 投标日期
  
  // 标的物信息
  route: string;             // 航线
  originCountry: string;     // 起运国
  originPort: string;        // 起运港
  destinationCountry: string; // 目的国
  destinationPort: string;   // 目的港
  tenderQuantity: string;    // 招标数量
  commitmentMQC: string;     // 承诺MQC
  
  // 附件信息
  attachments: Array<{
    id: string;
    name: string;
    type: string;
    size: string;
    url: string;
  }>;
  
  // 报价明细
  priceDetails: Array<{
    序号: number;
    航线: string;
    起运港: string;
    卸货港: string;
    目的港: string;
    '20GP': {
      海运费: string;
      BAF: string;
      PSS: string;
      THC: string;
    };
    '40GP': {
      海运费: string;
      BAF: string;
      PSS: string;
      THC: string;
    };
    '40HQ': {
      海运费: string;
      BAF: string;
      PSS: string;
      THC: string;
    };
    票: {
      文件费: string;
      电放费: string;
    };
    箱: {
      VGM: string;
      铅封: string;
    };
  }>;
}

/**
 * 标书详情页面组件
 */
const BidDetailPage: React.FC = () => {
  const { bidId } = useParams<{ bidId: string }>();
  const navigate = useNavigate();
  const [bidData, setBidData] = useState<BidDetailData | null>(null);
  const [loading, setLoading] = useState(true);

  /**
   * 获取标书详情数据
   */
  useEffect(() => {
    const fetchBidDetail = async () => {
      try {
        setLoading(true);
        // 模拟API调用
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // 模拟数据
        const mockData: BidDetailData = {
          tenderCode: 'TB2024001',
          tenderTitle: '2026年度海运物流招标',
          tenderCompany: '中远海运集团',
          bidCode: bidId || 'TESE1234567',
          bidCompany: '上海海运物流有限公司',
          legalRepresentative: '张三',
          bidDate: '2024-01-15',
          
          route: '上海-洛杉矶',
          originCountry: '中国',
          originPort: 'Shanghai Port-上海港',
          destinationCountry: '美国',
          destinationPort: 'Los Angeles Port-洛杉矶港',
          tenderQuantity: '20GP: 100箱, 40GP: 50箱, 40HQ: 30箱',
          commitmentMQC: '180 TEU',
          
          attachments: [
            {
              id: '1',
              name: '投标技术方案.pdf',
              type: 'PDF',
              size: '2.5MB',
              url: '/attachments/tech-proposal.pdf'
            },
            {
              id: '2',
              name: '企业资质证明.pdf',
              type: 'PDF',
              size: '1.8MB',
              url: '/attachments/qualification.pdf'
            },
            {
              id: '3',
              name: '财务报表.pdf',
              type: 'PDF',
              size: '3.2MB',
              url: '/attachments/financial-report.pdf'
            }
          ],
          
          priceDetails: [
            {
              序号: 1,
              航线: '上海-洛杉矶',
              起运港: 'Shanghai Port-上海港',
              卸货港: 'Los Angeles Port-洛杉矶港',
              目的港: 'Los Angeles Port-洛杉矶港',
              '20GP': {
                海运费: '$1,200',
                BAF: '$150',
                PSS: '$100',
                THC: '$80'
              },
              '40GP': {
                海运费: '$2,200',
                BAF: '$280',
                PSS: '$180',
                THC: '$150'
              },
              '40HQ': {
                海运费: '$2,400',
                BAF: '$300',
                PSS: '$200',
                THC: '$160'
              },
              票: {
                文件费: '$25',
                电放费: '$35'
              },
              箱: {
                VGM: '$15',
                铅封: '$10'
              }
            },
            {
              序号: 2,
              航线: '上海-纽约',
              起运港: 'Shanghai Port-上海港',
              卸货港: 'New York Port-纽约港',
              目的港: 'New York Port-纽约港',
              '20GP': {
                海运费: '$1,350',
                BAF: '$170',
                PSS: '$120',
                THC: '$90'
              },
              '40GP': {
                海运费: '$2,450',
                BAF: '$310',
                PSS: '$200',
                THC: '$170'
              },
              '40HQ': {
                海运费: '$2,650',
                BAF: '$330',
                PSS: '$220',
                THC: '$180'
              },
              票: {
                文件费: '$25',
                电放费: '$35'
              },
              箱: {
                VGM: '$15',
                铅封: '$10'
              }
            }
          ]
        };
        
        setBidData(mockData);
      } catch (error) {
        console.error('获取标书详情失败:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBidDetail();
  }, [bidId]);

  /**
   * 处理返回按钮点击
   */
  const handleGoBack = () => {
    navigate(-1);
  };

  /**
   * 处理附件下载
   */
  const handleDownload = (attachment: any) => {
    // 模拟下载
    const link = document.createElement('a');
    link.href = attachment.url;
    link.download = attachment.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  /**
   * 生成报价明细表格列配置
   */
  const getPriceColumns = () => {
    return [
      {
        title: '序号',
        dataIndex: '序号',
        width: 60,
        align: 'center' as const
      },
      {
        title: '航线',
        dataIndex: '航线',
        width: 120
      },
      {
        title: '起运港',
        dataIndex: '起运港',
        width: 140,
        render: (text: string) => {
          const [english, chinese] = text.split('-');
          return (
            <div style={{ whiteSpace: 'nowrap' }}>
              <div style={{ fontSize: '12px', color: '#666' }}>{english}</div>
              <div style={{ fontSize: '12px' }}>{chinese}</div>
            </div>
          );
        }
      },
      {
        title: '卸货港',
        dataIndex: '卸货港',
        width: 140,
        render: (text: string) => {
          const [english, chinese] = text.split('-');
          return (
            <div style={{ whiteSpace: 'nowrap' }}>
              <div style={{ fontSize: '12px', color: '#666' }}>{english}</div>
              <div style={{ fontSize: '12px' }}>{chinese}</div>
            </div>
          );
        }
      },
      {
        title: '目的港',
        dataIndex: '目的港',
        width: 140,
        render: (text: string) => {
          const [english, chinese] = text.split('-');
          return (
            <div style={{ whiteSpace: 'nowrap' }}>
              <div style={{ fontSize: '12px', color: '#666' }}>{english}</div>
              <div style={{ fontSize: '12px' }}>{chinese}</div>
            </div>
          );
        }
      },
      {
        title: '20GP',
        align: 'center' as const,
        children: [
          {
            title: '海运费',
            dataIndex: ['20GP', '海运费'] as any,
            width: 90
          },
          {
            title: 'BAF',
            dataIndex: ['20GP', 'BAF'] as any,
            width: 80
          },
          {
            title: 'PSS',
            dataIndex: ['20GP', 'PSS'] as any,
            width: 80
          },
          {
            title: 'THC',
            dataIndex: ['20GP', 'THC'] as any,
            width: 80
          }
        ]
      },
      {
        title: '40GP',
        align: 'center' as const,
        children: [
          {
            title: '海运费',
            dataIndex: ['40GP', '海运费'] as any,
            width: 90
          },
          {
            title: 'BAF',
            dataIndex: ['40GP', 'BAF'] as any,
            width: 80
          },
          {
            title: 'PSS',
            dataIndex: ['40GP', 'PSS'] as any,
            width: 80
          },
          {
            title: 'THC',
            dataIndex: ['40GP', 'THC'] as any,
            width: 80
          }
        ]
      },
      {
        title: '40HQ',
        align: 'center' as const,
        children: [
          {
            title: '海运费',
            dataIndex: ['40HQ', '海运费'] as any,
            width: 90
          },
          {
            title: 'BAF',
            dataIndex: ['40HQ', 'BAF'] as any,
            width: 80
          },
          {
            title: 'PSS',
            dataIndex: ['40HQ', 'PSS'] as any,
            width: 80
          },
          {
            title: 'THC',
            dataIndex: ['40HQ', 'THC'] as any,
            width: 80
          }
        ]
      },
      {
        title: '票',
        align: 'center' as const,
        children: [
          {
            title: '文件费',
            dataIndex: ['票', '文件费'] as any,
            width: 70
          },
          {
            title: '电放费',
            dataIndex: ['票', '电放费'] as any,
            width: 70
          }
        ]
      },
      {
        title: '箱',
        align: 'center' as const,
        children: [
          {
            title: 'VGM',
            dataIndex: ['箱', 'VGM'] as any,
            width: 60
          },
          {
            title: '铅封',
            dataIndex: ['箱', '铅封'] as any,
            width: 60
          }
        ]
      }
    ] as any;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <Text>加载中...</Text>
        </div>
      </div>
    );
  }

  if (!bidData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Text>未找到标书详情</Text>
          <div className="mt-4">
            <Button onClick={handleGoBack}>返回</Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="w-full">
        {/* 页面头部 */}
        <div className="mb-6">
          <Space>
            <Button 
              icon={<IconArrowLeft />} 
              onClick={handleGoBack}
              className="mb-4"
            >
              返回
            </Button>
          </Space>
          <Title heading={2} className="text-gray-800">
            标书详情 - {bidData.bidCompany}
          </Title>
        </div>

        <div className="space-y-6">
          {/* 第一部分：基本信息模块 */}
          <Card title="基本信息" className="shadow-sm">
            <Descriptions
              column={2}
              data={[
                {
                  label: '招标编号',
                  value: bidData.tenderCode
                },
                {
                  label: '招标标题',
                  value: bidData.tenderTitle
                },
                {
                  label: '招标公司',
                  value: bidData.tenderCompany
                },
                {
                  label: '投标编号',
                  value: bidData.bidCode
                },
                {
                  label: '投标企业',
                  value: bidData.bidCompany
                },
                {
                  label: '法人代表',
                  value: bidData.legalRepresentative
                },
                {
                  label: '投标日期',
                  value: bidData.bidDate
                }
              ]}
            />
          </Card>

          {/* 第二部分：标的物信息模块 */}
          <Card title="标的物信息" className="shadow-sm">
            <Descriptions
              column={2}
              data={[
                {
                  label: '航线',
                  value: bidData.route
                },
                {
                  label: '起运国',
                  value: bidData.originCountry
                },
                {
                  label: '起运港',
                  value: bidData.originPort
                },
                {
                  label: '目的国',
                  value: bidData.destinationCountry
                },
                {
                  label: '目的港',
                  value: bidData.destinationPort
                },
                {
                  label: '招标数量',
                  value: bidData.tenderQuantity
                },
                {
                  label: '承诺MQC',
                  value: bidData.commitmentMQC
                }
              ]}
            />
          </Card>

          {/* 第三部分：附件模块 */}
          <Card title="附件" className="shadow-sm">
            <div className="space-y-3">
              {bidData.attachments.map((attachment) => (
                <div 
                  key={attachment.id} 
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                      <span className="text-red-600 font-bold text-sm">PDF</span>
                    </div>
                    <div>
                      <div className="font-medium text-gray-800">{attachment.name}</div>
                      <div className="text-sm text-gray-500">{attachment.type} • {attachment.size}</div>
                    </div>
                  </div>
                  <Button 
                    type="primary" 
                    icon={<IconDownload />}
                    onClick={() => handleDownload(attachment)}
                  >
                    下载
                  </Button>
                </div>
              ))}
            </div>
          </Card>

          {/* 第四部分：报价明细模块 */}
          <Card title="报价明细" className="shadow-sm">
            <div className="overflow-x-auto">
              <Table
                columns={getPriceColumns()}
                data={bidData.priceDetails}
                pagination={false}
                border
                size="small"
                className="min-w-max"
                scroll={{ x: 1600 }}
                components={{
                  header: {
                    cell: (props: any) => (
                      <th {...props} style={{ ...props.style, whiteSpace: 'nowrap' }} />
                    )
                  }
                }}
              />
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default BidDetailPage;