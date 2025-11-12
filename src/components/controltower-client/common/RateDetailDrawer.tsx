import React from 'react';
import { Drawer, Table, Typography, Divider } from '@arco-design/web-react';

const { Title } = Typography;

interface ContainerRateItem {
  key: string;
  feeName: string;
  currency: string;
  '20gp'?: string;
  '40gp'?: string;
  '40hc'?: string;
  '40nor'?: string;
  specialNote?: string;
}

interface NonContainerRateItem {
  key: string;
  feeName: string;
  currency: string;
  unit: string;
  price: string;
  specialNote?: string;
}

interface RateDetailDrawerProps {
  visible: boolean;
  onClose: () => void;
  containerRateList: ContainerRateItem[];
  containerSurchargeList: ContainerRateItem[];
  nonContainerRateList: NonContainerRateItem[];
  nonContainerSurchargeList: NonContainerRateItem[];
  boxTypeVisibility: {
    '20gp': boolean;
    '40gp': boolean;
    '40hc': boolean;
    '40nor': boolean;
  };
}

/**
 * 费用明细抽屉组件
 * 显示海运费和附加费的详细表格信息
 */
const RateDetailDrawer: React.FC<RateDetailDrawerProps> = ({
  visible,
  onClose,
  containerRateList,
  containerSurchargeList,
  nonContainerRateList,
  nonContainerSurchargeList,
  boxTypeVisibility
}) => {
  return (
    <Drawer
      title="费用明细"
      visible={visible}
      onCancel={onClose}
      width={800}
      footer={null}
    >
      <div className="space-y-6">
        {/* 海运费区域 */}
        <div>
          <Title heading={6} className="text-blue-600 mb-4" style={{ fontSize: '14px' }}>
            海运费明细
          </Title>
          
          {/* 按箱型计费 - 海运费 */}
          <div className="mb-6">
            <div className="text-blue-600 font-bold border-l-4 border-blue-600 pl-2 mb-4">
              按箱型计费
            </div>
            
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
                ...(boxTypeVisibility['40nor'] ? [{
                  title: '40NOR',
                  dataIndex: '40nor',
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
          {nonContainerRateList.length > 0 && (
            <div className="mb-6">
              <div className="text-green-600 font-bold border-l-4 border-green-600 pl-2 mb-4">
                非按箱型计费
              </div>
              
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
                    render: (value: string, record: NonContainerRateItem) => 
                      value ? `${record.currency} ${value}` : '-'
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
          )}
        </div>

        <Divider />

        {/* 附加费区域 */}
        <div>
          <Title heading={6} className="text-orange-600 mb-4" style={{ fontSize: '14px' }}>
            附加费明细
          </Title>
          
          {/* 按箱型计费 - 附加费 */}
          <div className="mb-6">
            <div className="text-orange-600 font-bold border-l-4 border-orange-600 pl-2 mb-4">
              按箱型计费
            </div>
            
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
                ...(boxTypeVisibility['40nor'] ? [{
                  title: '40NOR',
                  dataIndex: '40nor',
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
          {nonContainerSurchargeList.length > 0 && (
            <div className="mb-6">
              <div className="text-purple-600 font-bold border-l-4 border-purple-600 pl-2 mb-4">
                非按箱型计费
              </div>
              
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
                    render: (value: string, record: NonContainerRateItem) => 
                      value ? `${record.currency} ${value}` : '-'
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
          )}
        </div>
      </div>
    </Drawer>
  );
};

export default RateDetailDrawer;