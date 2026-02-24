import React from 'react';
import { Popover, Table, Tag, Typography, Steps } from '@arco-design/web-react';
import { IconSchedule, IconLocation, IconNav } from '@arco-design/web-react/icon';

const { Text } = Typography;
const { Step } = Steps;

export interface PortOfCall {
  portInfo: string;
  terminal: string;
  arrivalDay: string;
  departureDay: string;
  sequence?: number;
}

interface PortsOfCallPopoverProps {
  routeCode: string;
  ports: PortOfCall[];
  triggerElement?: React.ReactNode;
}

export const PortsOfCallPopover: React.FC<PortsOfCallPopoverProps> = ({ 
  routeCode, 
  ports, 
  triggerElement 
}) => {
  const columns = [
    { 
      title: '港口', 
      dataIndex: 'portInfo', 
      width: 240,
      render: (val: string) => <span className="text-gray-800">{val}</span>
    },
    { 
      title: '码头', 
      dataIndex: 'terminal', 
      width: 160,
      render: (val: string) => <span className="text-gray-600">{val || '-'}</span>
    },
    { 
      title: '计划到港', 
      dataIndex: 'arrivalDay', 
      width: 100,
      render: (val: string) => <Tag color="blue" bordered>{val}</Tag>
    },
    { 
      title: '计划离港', 
      dataIndex: 'departureDay', 
      width: 100,
      render: (val: string) => <Tag color="green" bordered>{val}</Tag>
    },
  ];

  return (
    <Popover
      title={
        <div className="flex items-center space-x-2 py-1">
          <IconNav className="text-blue-600" />
          <span className="font-bold text-gray-800 text-base">{routeCode} 挂靠港信息</span>
        </div>
      }
      content={
        <div style={{ width: 'max-content', minWidth: 600 }}>
          <div className="mb-4 px-2 py-2 bg-blue-50 rounded text-blue-800 text-xs flex items-center">
             <IconSchedule className="mr-2" />
             <span>此表显示该航线完整挂靠顺序及船期计划，实际挂靠可能会有所调整。</span>
          </div>
          <Table
            columns={columns}
            data={ports}
            pagination={false}
            size="small"
            border={{ wrapper: true, cell: false, bodyCell: true }}
            className="ports-table"
            rowKey={(record) => record.portInfo}
          />
          <style>{`
            .ports-table .arco-table-th {
              background-color: #f7f8fa !important;
              font-weight: 600;
            }
            .ports-table .arco-table-td {
              border-bottom: 1px solid #f0f0f0;
            }
            .ports-table .arco-table-row:last-child .arco-table-td {
              border-bottom: none;
            }
          `}</style>
        </div>
      }
      trigger="click"
      position="right"
    >
      {triggerElement || (
        <span className="text-blue-600 font-bold cursor-pointer hover:underline hover:text-blue-700 transition-colors">
          {routeCode}
        </span>
      )}
    </Popover>
  );
};
