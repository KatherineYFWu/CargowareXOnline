// 模拟的SOP流程数据
export interface SubTask {
  type: '运营任务' | '客户任务';
  name: string;
  status: '未完成' | '已跳过' | '已完成';
  updateTime?: string;
}

export interface SOPNode {
  id: number;
  icon: string;
  name: string;
  status: '未完成' | '部分完成' | '已完成';
  subTasks: SubTask[];
}

export interface OrderSOP {
  orderId: string;
  nodes: SOPNode[];
}

// 模拟的订单SOP流程数据
export const orderSOPData: OrderSOP[] = [
  {
    orderId: 'ORD000001',
    nodes: [
      {
        id: 1,
        icon: 'faCogs',
        name: '生产',
        status: '已完成',
        subTasks: [
          { type: '运营任务', name: '生产安排', status: '已完成', updateTime: '2024-01-15 09:30' }
        ]
      },
      {
        id: 2,
        icon: 'faDollarSign',
        name: '运价',
        status: '已完成',
        subTasks: [
          { type: '客户任务', name: '提交询价', status: '已完成', updateTime: '2024-01-15 10:15' },
          { type: '运营任务', name: '提交报价', status: '已完成', updateTime: '2024-01-15 10:30' }
        ]
      },
      {
        id: 3,
        icon: 'faAnchor',
        name: '订舱',
        status: '已完成',
        subTasks: [
          { type: '客户任务', name: '订舱申请', status: '已完成', updateTime: '2024-01-15 11:00' },
          { type: '运营任务', name: '订舱确认', status: '已完成', updateTime: '2024-01-15 11:30' }
        ]
      },
      {
        id: 4,
        icon: 'faTruck',
        name: '拖车',
        status: '部分完成',
        subTasks: [
          { type: '运营任务', name: '拖车安排', status: '已完成', updateTime: '2024-01-15 12:45' }
        ]
      },
      {
        id: 5,
        icon: 'faWarehouse',
        name: '仓库',
        status: '部分完成',
        subTasks: [
          { type: '客户任务', name: '仓储费用', status: '未完成' },
          { type: '运营任务', name: '入库安排', status: '已完成', updateTime: '2024-01-15 14:20' }
        ]
      },
      {
        id: 6,
        icon: 'faFileContract',
        name: '报关',
        status: '部分完成',
        subTasks: [
          { type: '客户任务', name: '报关资料', status: '已完成', updateTime: '2024-01-15 15:00' },
          { type: '运营任务', name: '报关申报', status: '未完成' }
        ]
      },
      {
        id: 7,
        icon: 'faFileAlt',
        name: '舱单',
        status: '未完成',
        subTasks: [
          { type: '运营任务', name: '舱单制作', status: '未完成' }
        ]
      },
      {
        id: 8,
        icon: 'faWeight',
        name: 'VGM',
        status: '未完成',
        subTasks: [
          { type: '客户任务', name: 'VGM提交', status: '未完成' }
        ]
      },
      {
        id: 9,
        icon: 'faFileImport',
        name: '补料',
        status: '未完成',
        subTasks: [
          { type: '客户任务', name: '补料提交', status: '未完成' },
          { type: '客户任务', name: '补料费用', status: '未完成' },
          { type: '运营任务', name: '补料审核', status: '未完成' }
        ]
      },
      {
        id: 10,
        icon: 'faReceipt',
        name: '账单',
        status: '未完成',
        subTasks: [
          { type: '运营任务', name: '账单生成', status: '未完成' }
        ]
      },
      {
        id: 11,
        icon: 'faFileInvoiceDollar',
        name: '发票',
        status: '未完成',
        subTasks: [
          { type: '运营任务', name: '发票开具', status: '未完成' }
        ]
      },
      {
        id: 12,
        icon: 'faFileText',
        name: '提单',
        status: '未完成',
        subTasks: [
          { type: '运营任务', name: '提单签发', status: '未完成' }
        ]
      },
      {
        id: 13,
        icon: 'faExchangeAlt',
        name: '换单',
        status: '未完成',
        subTasks: [
          { type: '运营任务', name: '换单处理', status: '未完成' }
        ]
      },
      {
        id: 14,
        icon: 'faBox',
        name: '提柜',
        status: '未完成',
        subTasks: [
          { type: '运营任务', name: '提柜安排', status: '未完成' }
        ]
      },
      {
        id: 15,
        icon: 'faShippingFast',
        name: '送货',
        status: '未完成',
        subTasks: [
          { type: '运营任务', name: '配送安排', status: '未完成' }
        ]
      }
    ]
  },
  {
    orderId: 'ORD000002',
    nodes: [
      {
        id: 1,
        icon: 'faCogs',
        name: '生产',
        status: '已完成',
        subTasks: [
          { type: '运营任务', name: '生产安排', status: '已完成', updateTime: '2024-01-14 11:20' }
        ]
      },
      {
        id: 2,
        icon: 'faDollarSign',
        name: '运价',
        status: '已完成',
        subTasks: [
          { type: '客户任务', name: '提交询价', status: '已完成', updateTime: '2024-01-14 12:05' },
          { type: '运营任务', name: '提交报价', status: '已完成', updateTime: '2024-01-14 12:30' }
        ]
      },
      {
        id: 3,
        icon: 'faAnchor',
        name: '订舱',
        status: '已完成',
        subTasks: [
          { type: '客户任务', name: '订舱申请', status: '已完成', updateTime: '2024-01-14 13:00' },
          { type: '运营任务', name: '订舱确认', status: '已完成', updateTime: '2024-01-14 13:30' }
        ]
      },
      {
        id: 4,
        icon: 'faTruck',
        name: '拖车',
        status: '已完成',
        subTasks: [
          { type: '运营任务', name: '拖车安排', status: '已完成', updateTime: '2024-01-14 14:30' }
        ]
      },
      {
        id: 5,
        icon: 'faWarehouse',
        name: '仓库',
        status: '已完成',
        subTasks: [
          { type: '客户任务', name: '仓储费用', status: '已完成', updateTime: '2024-01-14 15:15' },
          { type: '运营任务', name: '入库安排', status: '已完成', updateTime: '2024-01-14 16:15' }
        ]
      },
      {
        id: 6,
        icon: 'faFileContract',
        name: '报关',
        status: '部分完成',
        subTasks: [
          { type: '客户任务', name: '报关资料', status: '已完成', updateTime: '2024-01-15 09:00' },
          { type: '运营任务', name: '报关申报', status: '未完成' }
        ]
      },
      {
        id: 7,
        icon: 'faFileAlt',
        name: '舱单',
        status: '未完成',
        subTasks: [
          { type: '运营任务', name: '舱单制作', status: '未完成' }
        ]
      },
      {
        id: 8,
        icon: 'faWeight',
        name: 'VGM',
        status: '未完成',
        subTasks: [
          { type: '客户任务', name: 'VGM提交', status: '未完成' }
        ]
      },
      {
        id: 9,
        icon: 'faFileImport',
        name: '补料',
        status: '未完成',
        subTasks: [
          { type: '客户任务', name: '补料提交', status: '未完成' },
          { type: '客户任务', name: '补料费用', status: '未完成' },
          { type: '运营任务', name: '补料审核', status: '未完成' }
        ]
      },
      {
        id: 10,
        icon: 'faReceipt',
        name: '账单',
        status: '未完成',
        subTasks: [
          { type: '运营任务', name: '账单生成', status: '未完成' }
        ]
      },
      {
        id: 11,
        icon: 'faFileInvoiceDollar',
        name: '发票',
        status: '未完成',
        subTasks: [
          { type: '运营任务', name: '发票开具', status: '未完成' }
        ]
      },
      {
        id: 12,
        icon: 'faFileText',
        name: '提单',
        status: '未完成',
        subTasks: [
          { type: '运营任务', name: '提单签发', status: '未完成' }
        ]
      },
      {
        id: 13,
        icon: 'faExchangeAlt',
        name: '换单',
        status: '未完成',
        subTasks: [
          { type: '运营任务', name: '换单处理', status: '未完成' }
        ]
      },
      {
        id: 14,
        icon: 'faBox',
        name: '提柜',
        status: '未完成',
        subTasks: [
          { type: '运营任务', name: '提柜安排', status: '未完成' }
        ]
      },
      {
        id: 15,
        icon: 'faShippingFast',
        name: '送货',
        status: '未完成',
        subTasks: [
          { type: '运营任务', name: '配送安排', status: '未完成' }
        ]
      }
    ]
  }
];

// 默认的SOP流程（用于不存在的订单号）
export const defaultSOP: OrderSOP = {
  orderId: 'DEFAULT',
  nodes: [
    {
      id: 1,
      icon: 'faCogs',
      name: '生产',
      status: '已完成',
      subTasks: [
        { type: '运营任务', name: '生产安排', status: '已完成', updateTime: '2024-01-15 09:30' }
      ]
    },
    {
      id: 2,
      icon: 'faDollarSign',
      name: '运价',
      status: '已完成',
      subTasks: [
        { type: '客户任务', name: '提交询价', status: '已完成', updateTime: '2024-01-15 10:15' },
        { type: '运营任务', name: '提交报价', status: '已完成', updateTime: '2024-01-15 10:30' }
      ]
    },
    {
      id: 3,
      icon: 'faAnchor',
      name: '订舱',
      status: '已完成',
      subTasks: [
        { type: '客户任务', name: '订舱申请', status: '已完成', updateTime: '2024-01-15 11:00' },
        { type: '运营任务', name: '订舱确认', status: '已完成', updateTime: '2024-01-15 11:30' }
      ]
    },
    {
      id: 4,
      icon: 'faTruck',
      name: '拖车',
      status: '部分完成',
      subTasks: [
        { type: '运营任务', name: '拖车安排', status: '已完成', updateTime: '2024-01-15 12:45' }
      ]
    },
    {
      id: 5,
      icon: 'faWarehouse',
      name: '仓库',
      status: '部分完成',
      subTasks: [
        { type: '客户任务', name: '仓储费用', status: '未完成' },
        { type: '运营任务', name: '入库安排', status: '已完成', updateTime: '2024-01-15 14:20' }
      ]
    },
    {
      id: 6,
      icon: 'faFileContract',
      name: '报关',
      status: '未完成',
      subTasks: [
        { type: '客户任务', name: '报关资料', status: '未完成' },
        { type: '运营任务', name: '报关申报', status: '未完成' }
      ]
    },
    {
      id: 7,
      icon: 'faFileAlt',
      name: '舱单',
      status: '未完成',
      subTasks: [
        { type: '运营任务', name: '舱单制作', status: '未完成' }
      ]
    },
    {
      id: 8,
      icon: 'faWeight',
      name: 'VGM',
      status: '未完成',
      subTasks: [
        { type: '客户任务', name: 'VGM提交', status: '未完成' }
      ]
    },
    {
      id: 9,
      icon: 'faFileImport',
      name: '补料',
      status: '未完成',
      subTasks: [
        { type: '客户任务', name: '补料提交', status: '未完成' },
        { type: '客户任务', name: '补料费用', status: '未完成' },
        { type: '运营任务', name: '补料审核', status: '未完成' }
      ]
    },
    {
      id: 10,
      icon: 'faReceipt',
      name: '账单',
      status: '未完成',
      subTasks: [
        { type: '运营任务', name: '账单生成', status: '未完成' }
      ]
    },
    {
      id: 11,
      icon: 'faFileInvoiceDollar',
      name: '发票',
      status: '未完成',
      subTasks: [
        { type: '运营任务', name: '发票开具', status: '未完成' }
      ]
    },
    {
      id: 12,
      icon: 'faFileText',
      name: '提单',
      status: '未完成',
      subTasks: [
        { type: '运营任务', name: '提单签发', status: '未完成' }
      ]
    },
    {
      id: 13,
      icon: 'faExchangeAlt',
      name: '换单',
      status: '未完成',
      subTasks: [
        { type: '运营任务', name: '换单处理', status: '未完成' }
      ]
    },
    {
      id: 14,
      icon: 'faBox',
      name: '提柜',
      status: '未完成',
      subTasks: [
        { type: '运营任务', name: '提柜安排', status: '未完成' }
      ]
    },
    {
      id: 15,
      icon: 'faShippingFast',
      name: '送货',
      status: '未完成',
      subTasks: [
        { type: '运营任务', name: '配送安排', status: '未完成' }
      ]
    }
  ]
};

// 根据订单号获取SOP流程数据
export const getSOPByOrderId = (orderId: string): OrderSOP => {
  const sop = orderSOPData.find(item => item.orderId === orderId);
  return sop || { ...defaultSOP, orderId };
};