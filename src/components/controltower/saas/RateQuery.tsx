import React, { useState, useEffect } from 'react';
import { 
  Table, 
  Button, 
  Space, 
  Select, 
  DatePicker, 
  Card, 
  Breadcrumb,
  Tag,
  Modal,
  Message,
  Notification,
  Switch,
  Tooltip,
  Tabs,
  Input,
  Drawer,
  Grid,
  Typography,
  Pagination,
  Radio,
  Checkbox,
  Popover,
  Empty
} from '@arco-design/web-react';
import { 
  IconSearch, 
  IconDownload, 
  IconRefresh, 
  IconList,
  IconDragDotVertical,
  IconDown,
  IconUp,
  IconSettings,
  IconPushpin,
  IconNav,
  IconLocation,
  IconTrophy,
  IconRobot,
  // IconFilter,
  // IconSort,
  // IconMore
} from '@arco-design/web-react/icon';
import { useNavigate, useLocation } from 'react-router-dom';
import ControlTowerSaasLayout from "./ControlTowerSaasLayout";
import SchemeSelect from './SchemeSelect';
import SchemeManagementModal, { SchemeData } from './SchemeManagementModal';
import BatchQuoteModal from './BatchQuoteModal';
import SailingScheduleModal from './SailingScheduleModal';
import RateTrendModal from './RateTrendModal';
import RateDetailModal from './RateDetailModal';
import SearchProgress, { CarrierProgress } from './SearchProgress';
import './InquiryManagement.css';

const Option = Select.Option;
const RangePicker = DatePicker.RangePicker;
const TabPane = Tabs.TabPane;
const Row = Grid.Row;
const Col = Grid.Col;
const Title = Typography.Title;

import { PortsOfCallPopover, PortOfCall } from './PortsOfCallPopover';

// 预定义选项常量
const BOX_TYPE_OPTIONS = [
  { label: '20GP', value: '20GP' },
  { label: '40GP', value: '40GP' },
  { label: '40HC', value: '40HC' },
  { label: '20NOR', value: '20NOR' },
  { label: '40NOR', value: '40NOR' },
  { label: '45HC', value: '45HC' },
  { label: '20HC', value: '20HC' },
  { label: '20TK', value: '20TK' },
  { label: '40TK', value: '40TK' },
  { label: '20OT', value: '20OT' },
  { label: '40OT', value: '40OT' },
  { label: '20FR', value: '20FR' },
  { label: '40FR', value: '40FR' }
];

const SHIPPING_COMPANY_OPTIONS = [
  { label: 'CNC', value: 'CNC' },
  { label: 'ZIN', value: 'ZIN' },
  { label: 'MAERSK', value: 'MAERSK' },
  { label: 'OOCL', value: 'OOCL' },
  { label: 'HPL_SPOT', value: 'HPL_SPOT' },
  { label: 'EMC', value: 'EMC' },
  { label: 'ZIM', value: 'ZIM' },
  { label: 'CMA', value: 'CMA' },
  { label: 'COSCO', value: 'COSCO' },
  { label: 'HPL_QQ', value: 'HPL_QQ' },
  { label: 'MSC', value: 'MSC' },
  { label: 'ONE', value: 'ONE' },
  { label: 'HMM', value: 'HMM' }
];

// 筛选模式枚举
export enum FilterMode {
  EQUAL = 'equal',
  NOT_EQUAL = 'notEqual', 
  CONTAINS = 'contains',
  NOT_CONTAINS = 'notContains',
  IS_EMPTY = 'isEmpty',
  IS_NOT_EMPTY = 'isNotEmpty',
  BATCH = 'batch'
}

// 筛选模式选项
export const FilterModeOptions = [
  { label: '等于', value: FilterMode.EQUAL },
  { label: '不等于', value: FilterMode.NOT_EQUAL },
  { label: '包含', value: FilterMode.CONTAINS },
  { label: '不包含', value: FilterMode.NOT_CONTAINS },
  { label: '为空', value: FilterMode.IS_EMPTY },
  { label: '不为空', value: FilterMode.IS_NOT_EMPTY },
  { label: '批量', value: FilterMode.BATCH }
];

// 筛选字段配置接口
export interface FilterFieldConfig {
  key: string;
  label: string;
  type: 'text' | 'select' | 'dateRange' | 'number';
  options?: { label: string; value: string }[];
  placeholder?: string;
  width?: number;
  mode?: 'multiple';
}

// 筛选条件值接口
export interface FilterCondition {
  key: string;
  mode: FilterMode;
  value: any;
  visible: boolean;
}

// 筛选方案接口
export interface FilterScheme {
  id: string;
  name: string;
  conditions: FilterCondition[];
  isDefault?: boolean;
}

// 根据不同Tab定义不同的筛选字段配置
const getFilterFieldsByTab = (activeTab: string): FilterFieldConfig[] => {
  switch (activeTab) {
    case 'ecommerce':
      return [
        {
          key: 'pol',
          label: '起运港',
          type: 'select',
          options: [
            { label: '洋山 Shanghai (CNSHA)', value: 'SHANGHAI' },
            { label: '舟山 Ningbo (CNNGB)', value: 'NINGBO' },
            { label: '盐田 Shenzhen (CNSZX)', value: 'SHENZHEN' },
            { label: '青岛港 Qingdao (CNQIN)', value: 'QINGDAO' },
            { label: '新加坡港 Singapore (SGSIN)', value: 'SINGAPORE' },
            { label: '汉堡港 Hamburg (DEHAM)', value: 'HAMBURG' },
            { label: '鹿特丹港 Rotterdam (NLRTM)', value: 'ROTTERDAM' },
            { label: '洛杉矶港 Los Angeles (USLAX)', value: 'LOS ANGELES' },
            { label: '奥克兰港 Oakland (USOAK)', value: 'OAKLAND' },
            { label: '费力克斯托港 Felixstowe (GBFXT)', value: 'FELIXSTOWE' }
          ],
          placeholder: '请输入或选择起运港'
        },
        {
          key: 'pod',
          label: '目的港',
          type: 'select',
          options: [
            { label: '鹿特丹港 Rotterdam (NLRTM)', value: 'ROTTERDAM' },
            { label: '汉堡港 Hamburg (DEHAM)', value: 'HAMBURG' },
            { label: '洛杉矶港 Los Angeles (USLAX)', value: 'LOS ANGELES' },
            { label: '纽约港 New York (USNYC)', value: 'NEW YORK' },
            { label: '洋山 Shanghai (CNSHA)', value: 'SHANGHAI' },
            { label: '舟山 Ningbo (CNNGB)', value: 'NINGBO' },
            { label: '盐田 Shenzhen (CNSZX)', value: 'SHENZHEN' },
            { label: '青岛港 Qingdao (CNQIN)', value: 'QINGDAO' },
            { label: '新加坡港 Singapore (SGSIN)', value: 'SINGAPORE' },
            { label: '奥克兰港 Oakland (USOAK)', value: 'OAKLAND' }
          ],
          placeholder: '请输入或选择目的港'
        },
        {
          key: 'boxType',
          label: '箱型',
          type: 'select',
          mode: 'multiple',
          options: BOX_TYPE_OPTIONS,
          placeholder: '请选择箱型'
        },
        {
          key: 'carrier',
          label: '船公司',
          type: 'select',
          mode: 'multiple',
          options: SHIPPING_COMPANY_OPTIONS,
          placeholder: '请选择船公司'
        },
        {
          key: 'transitType',
          label: '中转/直达',
          type: 'select',
          options: [
            { label: '直达', value: '直达' },
            { label: '中转', value: '中转' }
          ],
          placeholder: '请选择中转/直达'
        },
        {
          key: 'cargoType',
          label: '货物类型',
          type: 'select',
          options: [
            { label: '普货', value: '普货' },
            { label: '危险品', value: '危险品' },
            { label: '冷冻品', value: '冷冻品' },
            { label: '特种箱', value: '特种箱' },
            { label: '卷钢', value: '卷钢' },
            { label: '液体', value: '液体' },
            { label: '化工品', value: '化工品' },
            { label: '纺织品', value: '纺织品' }
          ],
          placeholder: '请选择货物类型'
        },
        {
          key: 'transitTime',
          label: '航程',
          type: 'number',
          placeholder: '请输入航程'
        },
        {
          key: 'spaceStatus',
          label: '舱位状态',
          type: 'select',
          options: [
            { label: '现舱', value: '现舱' },
            { label: '满舱', value: '满舱' }
          ],
          placeholder: '请选择舱位状态'
        },
        {
          key: 'totalPrice',
          label: '总运价',
          type: 'number',
          placeholder: '请输入总运价'
        },
        {
          key: 'totalCurrency',
          label: '总价币种',
          type: 'select',
          options: [
            { label: 'USD', value: 'USD' },
            { label: 'EUR', value: 'EUR' },
            { label: 'CNY', value: 'CNY' }
          ],
          placeholder: '请选择总价币种'
        },
        {
          key: 'basePrice',
          label: '基础运费',
          type: 'number',
          placeholder: '请输入基础运费'
        },
        {
          key: 'baseCurrency',
          label: '基价币种',
          type: 'select',
          options: [
            { label: 'USD', value: 'USD' },
            { label: 'EUR', value: 'EUR' },
            { label: 'CNY', value: 'CNY' }
          ],
          placeholder: '请选择基价币种'
        },
        {
          key: 'vesselName',
          label: '船名',
          type: 'text',
          placeholder: '请输入船名'
        },
        {
          key: 'voyageNo',
          label: '航次',
          type: 'text',
          placeholder: '请输入航次'
        },
        {
          key: 'lineCode',
          label: '航线代码',
          type: 'text',
          placeholder: '请输入航线代码'
        },
        {
          key: 'updateTime',
          label: '更新时间',
          type: 'dateRange',
          placeholder: '请选择更新时间范围'
        },
        {
          key: 'validFrom',
          label: '有效起始日期',
          type: 'dateRange',
          placeholder: '请选择有效起始日期范围'
        },
        {
          key: 'validTo',
          label: '有效结束日期',
          type: 'dateRange',
          placeholder: '请选择有效结束日期范围'
        }
      ];
    case 'fcl':
    case 'lcl':
    case 'air':
      return [
        {
          key: 'routeCode',
          label: '运价号',
          type: 'text',
          placeholder: '请输入运价号'
        },
        {
          key: 'rateType',
          label: '运价类型',
          type: 'select',
          options: [
            { label: '合约价', value: '合约价' },
            { label: 'SPOT电商', value: 'SPOT电商' }
          ],
          placeholder: '请选择运价类型'
        },
        {
          key: 'departurePort',
          label: '起运港',
          type: 'select',
          options: [
            { label: 'CNSHA', value: 'CNSHA' },
            { label: 'CNNGB', value: 'CNNGB' },
            { label: 'CNQIN', value: 'CNQIN' },
            { label: 'CNYTN', value: 'CNYTN' }
          ],
          placeholder: '请选择起运港'
        },
        {
          key: 'dischargePort',
          label: '目的港',
          type: 'select',
          options: [
            { label: 'USLAX', value: 'USLAX' },
            { label: 'USNYC', value: 'USNYC' },
            { label: 'USLGB', value: 'USLGB' },
            { label: 'USOAK', value: 'USOAK' }
          ],
          placeholder: '请选择目的港'
        },
        {
          key: 'directTransit',
          label: '直达',
          type: 'select',
          options: [
            { label: '直达', value: '直达' },
            { label: '中转', value: '中转' }
          ],
          placeholder: '请选择直达/中转'
        },
        {
          key: 'transitPort',
          label: '中转港',
          type: 'select',
          options: [
            { label: 'SINGAPORE', value: 'SINGAPORE' },
            { label: 'HONG KONG', value: 'HONG KONG' },
            { label: 'KRPUS', value: 'KRPUS' }
          ],
          placeholder: '请选择中转港'
        },
        {
          key: 'transitType',
          label: '中转类型',
          type: 'select',
          options: [
            { label: '直达', value: '直达' },
            { label: '中转', value: '中转' }
          ],
          placeholder: '请选择中转类型'
        },
        {
          key: 'shipCompany',
          label: '船公司',
          type: 'select',
          mode: 'multiple',
          options: SHIPPING_COMPANY_OPTIONS,
          placeholder: '请选择船公司'
        },
        {
          key: 'contractNo',
          label: '约号',
          type: 'select',
          options: [
            { label: 'CONTRACT001', value: 'CONTRACT001' },
            { label: 'CONTRACT002', value: 'CONTRACT002' },
            { label: 'CONTRACT003', value: 'CONTRACT003' },
            { label: 'SPOT', value: 'SPOT' }
          ],
          placeholder: '请选择约号'
        },
        {
          key: 'spaceStatus',
          label: '舱位状态',
          type: 'select',
          options: [
            { label: '畅接', value: '畅接' },
            { label: '正常', value: '正常' },
            { label: '单票申请', value: '单票申请' },
            { label: '爆舱', value: '爆舱' },
            { label: '不接', value: '不接' }
          ],
          placeholder: '请选择舱位状态'
        },
        {
          key: 'priceStatus',
          label: '价格趋势',
          type: 'select',
          options: [
            { label: '价格上涨', value: '价格上涨' },
            { label: '价格下调', value: '价格下调' },
            { label: '价格稳定', value: '价格稳定' }
          ],
          placeholder: '请选择价格趋势'
        },
        {
          key: 'cargoType',
          label: '货物类型',
          type: 'select',
          options: [
            { label: '普货', value: '普货' },
            { label: '危险品', value: '危险品' },
            { label: '冷冻品', value: '冷冻品' },
            { label: '特种箱', value: '特种箱' },
            { label: '卷钢', value: '卷钢' },
            { label: '液体', value: '液体' },
            { label: '化工品', value: '化工品' },
            { label: '纺织品', value: '纺织品' }
          ],
          placeholder: '请选择货物类型'
        },
        {
          key: 'vesselSchedule',
          label: '船期',
          type: 'select',
          options: [
            { label: '周一', value: '周一' },
            { label: '周二', value: '周二' },
            { label: '周三', value: '周三' },
            { label: '周四', value: '周四' },
            { label: '周五', value: '周五' },
            { label: '周六', value: '周六' },
            { label: '周日', value: '周日' }
          ],
          placeholder: '请选择船期'
        },
        {
          key: 'voyage',
          label: '航程',
          type: 'text',
          placeholder: '请输入航程'
        },
        {
          key: 'freeStorageDays',
          label: '免柜租期',
          type: 'number',
          placeholder: '请输入免柜租期'
        },
        {
          key: 'nac',
          label: 'NAC',
          type: 'select',
          options: [
            { label: 'NAC01', value: 'NAC01' },
            { label: 'NAC02', value: 'NAC02' },
            { label: 'NAC03', value: 'NAC03' }
          ],
          placeholder: '请选择NAC'
        },
        {
          key: 'validPeriod',
          label: '有效期',
          type: 'dateRange',
          placeholder: '请选择有效期范围'
        },
        {
          key: 'etd',
          label: 'ETD',
          type: 'dateRange',
          placeholder: '请选择ETD范围'
        },
        {
          key: 'eta',
          label: 'ETA',
          type: 'dateRange',
          placeholder: '请选择ETA范围'
        },
        {
          key: 'vesselName',
          label: '船名',
          type: 'text',
          placeholder: '请输入船名'
        },
        {
          key: 'voyageNo',
          label: '航次',
          type: 'text',
          placeholder: '请输入航次'
        },
        {
          key: 'cutoffDate',
          label: '截关日',
          type: 'dateRange',
          placeholder: '请选择截关日范围'
        },
        {
          key: 'destinationRegion',
          label: '目的区域',
          type: 'text',
          placeholder: '请输入目的区域'
        },
        {
          key: 'entryPerson',
          label: '创建人',
          type: 'text',
          placeholder: '请输入创建人'
        },
        {
          key: 'createDate',
          label: '创建日期',
          type: 'dateRange',
          placeholder: '请选择创建日期范围'
        },
        {
          key: 'rateModifier',
          label: '运价修改人',
          type: 'text',
          placeholder: '请输入运价修改人'
        },
        {
          key: 'modifyDate',
          label: '修改日期',
          type: 'dateRange',
          placeholder: '请选择修改日期范围'
        }
      ];
    case 'precarriage':
      return [
        {
          key: 'code',
          label: '港前运价编号',
          type: 'text',
          placeholder: '请输入港前运价编号'
        },
        {
          key: 'rateType',
          label: '运价类型',
          type: 'select',
          options: [
            { label: '直拖', value: '直拖' },
            { label: '支线', value: '支线' },
            { label: '海铁', value: '海铁' }
          ],
          placeholder: '请选择运价类型'
        },
        {
          key: 'sublineType',
          label: '支线类型',
          type: 'select',
          options: [
            { label: '海宁支线', value: '海宁支线' },
            { label: '乍浦支线', value: '乍浦支线' }
          ],
          placeholder: '请选择支线类型'
        },
        {
          key: 'seaRailType',
          label: '海铁类型',
          type: 'select',
          options: [
            { label: '湖州海铁', value: '湖州海铁' },
            { label: '义务海铁', value: '义务海铁' }
          ],
          placeholder: '请选择海铁类型'
        },
        {
          key: 'origin',
          label: '起运地',
          type: 'text',
          placeholder: '请输入起运地'
        },
        {
          key: 'destination',
          label: '起运港',
          type: 'select',
          options: [
            { label: 'CNSHA', value: 'CNSHA' },
            { label: 'CNNGB', value: 'CNNGB' },
            { label: 'CNQIN', value: 'CNQIN' },
            { label: 'CNYTN', value: 'CNYTN' }
          ],
          placeholder: '请选择起运港'
        },
        {
          key: 'terminal',
          label: '码头',
          type: 'text',
          placeholder: '请输入码头'
        },
        {
          key: 'vendor',
          label: '供应商',
          type: 'text',
          placeholder: '请输入供应商'
        },
        {
          key: 'status',
          label: '状态',
          type: 'select',
          options: [
            { label: '正常', value: '正常' },
            { label: '过期', value: '过期' },
            { label: '下架', value: '下架' }
          ],
          placeholder: '请选择状态'
        },
        {
          key: 'validDateRange',
          label: '有效期',
          type: 'dateRange',
          placeholder: '请选择有效期范围'
        },
        {
          key: 'createDate',
          label: '创建日期',
          type: 'dateRange',
          placeholder: '请选择创建日期范围'
        },
        {
          key: 'entryPerson',
          label: '创建人',
          type: 'text',
          placeholder: '请输入创建人'
        },
        {
          key: 'rateModifier',
          label: '运价修改人',
          type: 'text',
          placeholder: '请输入运价修改人'
        },
        {
          key: 'modifyDate',
          label: '修改日期',
          type: 'dateRange',
          placeholder: '请选择修改日期范围'
        }
      ];
    case 'oncarriage':
      return [
        {
          key: 'code',
          label: '尾程运价编号',
          type: 'text',
          placeholder: '请输入尾程运价编号'
        },
        {
          key: 'origin',
          label: '目的港',
          type: 'select',
          options: [
            { label: 'USLAX', value: 'USLAX' },
            { label: 'USNYC', value: 'USNYC' },
            { label: 'USLGB', value: 'USLGB' },
            { label: 'USOAK', value: 'USOAK' },
            { label: 'USSEA', value: 'USSEA' },
            { label: 'USNRF', value: 'USNRF' }
          ],
          placeholder: '请选择目的港'
        },
        {
          key: 'addressType',
          label: '地址类型',
          type: 'select',
          options: [
            { label: '第三方地址', value: '第三方地址' },
            { label: '亚马逊仓库', value: '亚马逊仓库' },
            { label: '易仓', value: '易仓' }
          ],
          placeholder: '请选择地址类型'
        },
        {
          key: 'zipCode',
          label: '邮编',
          type: 'text',
          placeholder: '请输入邮编'
        },
        {
          key: 'state',
          label: '州',
          type: 'select',
          options: [
            { label: 'California (CA)', value: 'CA' },
            { label: 'New York (NY)', value: 'NY' },
            { label: 'Texas (TX)', value: 'TX' },
            { label: 'Florida (FL)', value: 'FL' },
            { label: 'Washington (WA)', value: 'WA' },
            { label: 'Georgia (GA)', value: 'GA' }
          ],
          placeholder: '请选择州'
        },
        {
          key: 'province',
          label: '省/县',
          type: 'text',
          placeholder: '请输入省/县'
        },
        {
          key: 'region',
          label: '区域/城市',
          type: 'text',
          placeholder: '请输入区域/城市'
        },
        {
          key: 'address',
          label: '详细地址',
          type: 'text',
          placeholder: '请输入详细地址'
        },
        {
          key: 'warehouseCode',
          label: '仓库代码',
          type: 'text',
          placeholder: '请输入仓库代码'
        },
        {
          key: 'agentName',
          label: '代理名称',
          type: 'text',
          placeholder: '请输入代理名称'
        },
        {
          key: 'status',
          label: '状态',
          type: 'select',
          options: [
            { label: '正常', value: '正常' },
            { label: '过期', value: '过期' },
            { label: '下架', value: '下架' }
          ],
          placeholder: '请选择状态'
        },
        {
          key: 'validDateRange',
          label: '有效期',
          type: 'dateRange',
          placeholder: '请选择有效期范围'
        },
        {
          key: 'createDate',
          label: '创建日期',
          type: 'dateRange',
          placeholder: '请选择创建日期范围'
        },
        {
          key: 'entryPerson',
          label: '创建人',
          type: 'text',
          placeholder: '请输入创建人'
        },
        {
          key: 'rateModifier',
          label: '运价修改人',
          type: 'text',
          placeholder: '请输入运价修改人'
        },
        {
          key: 'modifyDate',
          label: '修改日期',
          type: 'dateRange',
          placeholder: '请选择修改日期范围'
        }
      ];
    default:
      return [];
  }
};

interface DataItem {
  key: string;
  routeCode: string; // 运价号
  departurePort: string; // 起运港
  dischargePort: string; // 目的港
  transitPort: string; // 中转港
  spaceStatus: string; // 舱位状态
  priceStatus: string; // 价格趋势
  containerType: string; // 箱种
  rateStatus: string; // 运价状态
  '20gp': number; // 20'
  '40gp': number; // 40'
  '40hc': number; // 40' HC
  '45hc': number; // 45'
  '40nor': number; // 40' NOR
  '20nor': number; // 20' NOR
  '20hc': number; // 20' HC
  '20tk': number; // 20' TK
  '40tk': number; // 40' TK
  '20ot': number; // 20' OT
  '40ot': number; // 40' OT
  '20fr': number; // 20' FR
  '40fr': number; // 40' FR
  shipCompany: string; // 船公司
  contractNo: string; // 约号
  vesselSchedule: string; // 船期
  voyage: string; // 航程
  cargoType: string; // 货物类型
  freeContainerDays: number; // 免用箱
  freeStorageDays: number; // 免堆存
  chargeSpecialNote: string; // 接货特殊说明
  nac: string; // NAC
  overweightNote: string; // 超重说明
  notes: string; // 备注
  validPeriod: string; // 有效期
  branch: string; // 分公司
  entryPerson: string; // 创建人
  createDate: string; // 创建日期
  rateModifier: string; // 运价修改人
  modifyDate: string; // 修改日期
  rateType: string; // 运价类型
  vesselName: string; // 船名
  voyageNo: string; // 航次
  etd: string; // ETD
  eta: string; // ETA
  
  // 根据截图补充的字段
  transitType: string; // 中转类型
  transitDays: number; // 中转天数
  bookingDeadline: string; // 订舱截止时间
  documentDeadline: string; // 单证截止时间
  portOfLoading: string; // 装货港
  portOfDischarge: string; // 卸货港
  finalDestination: string; // 最终目的地
  placeOfReceipt: string; // 收货地
  placeOfDelivery: string; // 交货地
  shippingTerms: string; // 贸易条款
  freightTerms: string; // 运费条款
  carrierName: string; // 承运人
  forwarderName: string; // 货代名称
  quotationValidDays: number; // 报价有效天数
  bookingRemarks: string; // 订舱备注
  specialRequirements: string; // 特殊要求
  insuranceRequired: boolean; // 是否需要保险
  customsClearance: string; // 清关要求
  documentRequired: string; // 单证要求
  weighingRequired: boolean; // 是否需要称重
  inspectionRequired: boolean; // 是否需要查验
  consolidationService: boolean; // 是否提供拼箱服务
  doorToDoorService: boolean; // 是否提供门到门服务
  temperatureControl: string; // 温控要求
  hazardousGoods: boolean; // 是否危险品
  oversizeGoods: boolean; // 是否超尺寸货物
  overweightGoods: boolean; // 是否超重货物
  priority: string; // 优先级
  status: string; // 状态
  publishStatus: string; // 发布状态
  isActive: boolean; // 是否激活
  isPublic: boolean; // 是否公开
  tags: string[]; // 标签
  category: string; // 分类
  subcategory: string; // 子分类
  region: string; // 区域
  lane: string; // 航线
  tradeRoute: string; // 贸易路线
  transitTime: number; // 运输时间
  frequency: string; // 班期频率
  vessel: string; // 船舶
  operatorCode: string; // 操作代码
  bookingOffice: string; // 订舱处
  salesPerson: string; // 销售员
  customerService: string; // 客服
  lastUpdated: string; // 最后更新时间
  version: string; // 版本号
  source: string; // 数据来源
  reliability: string; // 可靠性
  confidence: number; // 置信度
  updateFrequency: string; // 更新频率
  dataQuality: string; // 数据质量
  verified: boolean; // 是否已验证
  archived: boolean; // 是否已归档
  deleted: boolean; // 是否已删除
  
  // 继续根据新截图添加的字段
  validToDate: string; // 有效期止（截图中的"有效期止"）
  companyBranch: string; // 分公司（截图中的"分公司"）
  dataEntryPerson: string; // 录入人（截图中的"录入人"）
  creationDate: string; // 创建日期（截图中的"创建日期"）
  rateModifyPerson: string; // 运价修改人（截图中的"运价修改人"）
  modificationDate: string; // 修改日期（截图中的"修改日期"）
  targetRegion: string; // 目的区域（截图中的"目的区域"）
  freightRateType: string; // 运价类型（截图中的"运价类型"）
  shipName: string; // 船名（截图中的"船名"）
  voyageNumber: string; // 航次（截图中的"航次"）
  container20NOR: string; // 20' NOR（截图中的"20' NOR"）
  estimatedDeparture: string; // ETD（截图中的"ETD"）
  estimatedArrival: string; // ETA（截图中的"ETA"）
}

// LCL和Air运价数据接口
interface LclAirDataItem {
  key: string;
  shipCompany: string;
  dischargePort: string;
  etd: string;
  transitType: string;
  transit: number;
  weight: number; // KGS
  volume: number; // CBM
  routeCode: string;
  vesselName: string;
  voyageNo: string;
  spaceStatus: string;
  remark: string;
}

// 电商运价数据接口
interface EcommerceRateItem {
  key: string;
  id: string; // 费用ID
  carrierLogo: string; // 承运人Logo
  carrierName: string; // 承运人名称
  pol: string; // 起运港
  pod: string; // 目的港
  etd: string; // 离港日期
  eta: string; // 到港日期
  transitType: string; // 中转状况 (直达/中转)
  cargoType: string; // 货物类型
  transitTime: number; // 航程 (天)
  containerType: string; // 箱型
  spaceStatus: string; // 舱位状态 (现舱/满舱)
  totalPrice: number; // 总运价
  totalCurrency: string; // 总价币种
  basePrice: number; // 基础运费
  baseCurrency: string; // 基价币种
  vesselName: string; // 船名
  voyageNo: string; // 航次
  routeCode?: string; // 航线代码
  updateTime: string; // 更新时间
  validFrom: string; // 有效起始日期
  validTo: string; // 有效结束日期
  transportTerms: string; // 运输条款
  lane?: string; // 航线
  transitPorts?: string[]; // 中转港
  portsOfCall?: PortOfCall[]; // 挂靠港信息
  '20gp'?: number;
  '40gp'?: number;
  '40hc'?: number;
  '20nor'?: number;
  '40nor'?: number;
  '45hc'?: number;
  '20hc'?: number;
  '20tk'?: number;
  '40tk'?: number;
  '20ot'?: number;
  '40ot'?: number;
  '20fr'?: number;
  '40fr'?: number;
  surchargeLabel?: string;
  surchargeAmount?: number;
  cutoffDate?: string;
}

// 电商运价模拟数据
// 辅助函数：生成动态时间
const getMockTime = (hoursAgo: number) => {
  const date = new Date();
  date.setTime(date.getTime() - hoursAgo * 60 * 60 * 1000);
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
};

// 电商运价模拟数据
const ecommerceData: EcommerceRateItem[] = [
  {
    key: '1',
    id: 'EC20240115001',
    carrierLogo: '/assets/carrier/EMC.png',
    carrierName: 'EMC',
    pol: 'SHANGHAI',
    pod: 'ROTTERDAM',
    etd: '2026-01-18',
    eta: '2026-02-17',
    transitType: '直达',
    cargoType: '普货',
    transitTime: 30,
    containerType: '40HC',
    spaceStatus: '现舱',
    totalPrice: 3130,
    totalCurrency: 'USD',
    basePrice: 2984,
    baseCurrency: 'USD',
    vesselName: 'COSCO SHIPPING LIBRA',
    voyageNo: '034W',
    routeCode: 'NE3',
    updateTime: getMockTime(1), // 1小时前 - 极鲜
    validFrom: '2026-01-15',
    validTo: '2026-01-31',
    transportTerms: 'CY-CY',
    lane: 'Europe Line',
    transitPorts: [],
    portsOfCall: [
      { portInfo: 'Shanghai China (CN)', terminal: 'Yangshan Phase IV', arrivalDay: '星期六', departureDay: '星期日' },
      { portInfo: 'Ningbo China (CN)', terminal: 'Meishan Terminal', arrivalDay: '星期一', departureDay: '星期二' },
      { portInfo: 'Yantian China (CN)', terminal: 'YICT', arrivalDay: '星期四', departureDay: '星期五' },
      { portInfo: 'Singapore Singapore (SG)', terminal: 'PSA Singapore', arrivalDay: '星期二', departureDay: '星期三' },
      { portInfo: 'Rotterdam Netherlands (NL)', terminal: 'ECT Delta', arrivalDay: '星期二', departureDay: '星期三' },
      { portInfo: 'Hamburg Germany (DE)', terminal: 'HHLA CTA', arrivalDay: '星期五', departureDay: '星期六' },
      { portInfo: 'Antwerp Belgium (BE)', terminal: 'Antwerp Gateway', arrivalDay: '星期一', departureDay: '星期二' }
    ],
    '20gp': 1500,
    '40gp': 2800,
    '40hc': 3130,
    '45hc': 3500
  },
  {
    key: '2',
    id: 'EC20240115002',
    carrierLogo: '/assets/carrier/COSCO.png',
    carrierName: 'COSCO',
    pol: 'NINGBO',
    pod: 'HAMBURG',
    etd: '2026-01-20',
    eta: '2026-02-22',
    transitType: '中转',
    cargoType: '普货',
    transitTime: 33,
    containerType: '20GP',
    spaceStatus: '满舱',
    totalPrice: 1850,
    totalCurrency: 'USD',
    basePrice: 1650,
    baseCurrency: 'USD',
    vesselName: 'COSCO SHIPPING SCORPIO',
    voyageNo: '022W',
    routeCode: 'AWE2',
    updateTime: getMockTime(4), // 4小时前 - 新鲜
    validFrom: '2026-01-15',
    validTo: '2026-01-31',
    transportTerms: 'CY-CY',
    transitPorts: ['SINGAPORE', 'ROTTERDAM'],
    portsOfCall: [
      { portInfo: 'Ningbo China (CN)', terminal: 'Meishan Terminal', arrivalDay: '星期一', departureDay: '星期二' },
      { portInfo: 'Shanghai China (CN)', terminal: 'Yangshan Phase IV', arrivalDay: '星期三', departureDay: '星期四' },
      { portInfo: 'Xiamen China (CN)', terminal: 'Hairun Terminal', arrivalDay: '星期六', departureDay: '星期日' },
      { portInfo: 'Singapore Singapore (SG)', terminal: 'Pasir Panjang', arrivalDay: '星期四', departureDay: '星期五' },
      { portInfo: 'Suez Canal Egypt (EG)', terminal: '-', arrivalDay: '星期一', departureDay: '星期一' },
      { portInfo: 'Hamburg Germany (DE)', terminal: 'HHLA CTA', arrivalDay: '星期四', departureDay: '星期五' },
      { portInfo: 'Rotterdam Netherlands (NL)', terminal: 'RWG', arrivalDay: '星期日', departureDay: '星期一' }
    ],
    surchargeLabel: 'AMS',
    surchargeAmount: 30,
    cutoffDate: '2026-01-18'
  },
  {
    key: '3',
    id: 'EC20240115003',
    carrierLogo: '/assets/carrier/MSK.png',
    carrierName: 'MAERSK',
    pol: 'SHENZHEN',
    pod: 'LOS ANGELES',
    etd: '2026-01-25',
    eta: '2026-02-10',
    transitType: '直达',
    cargoType: '普货',
    transitTime: 16,
    containerType: '40HC',
    spaceStatus: '现舱',
    totalPrice: 2800,
    totalCurrency: 'USD',
    basePrice: 2600,
    baseCurrency: 'USD',
    vesselName: 'MAERSK EUREKA',
    voyageNo: '105E',
    routeCode: 'TP6',
    updateTime: getMockTime(9), // 9小时前 - 较新
    validFrom: '2026-01-15',
    validTo: '2026-01-31',
    transportTerms: 'CY-CY',
    transitPorts: [],
    portsOfCall: [
      { portInfo: 'Yantian China (CN)', terminal: 'YICT', arrivalDay: '星期二', departureDay: '星期三' },
      { portInfo: 'Hong Kong Hong Kong (HK)', terminal: 'HIT', arrivalDay: '星期四', departureDay: '星期四' },
      { portInfo: 'Nansha China (CN)', terminal: 'Nansha Phase III', arrivalDay: '星期五', departureDay: '星期六' },
      { portInfo: 'Kaohsiung Taiwan (TW)', terminal: 'Kaohsiung Port', arrivalDay: '星期日', departureDay: '星期一' },
      { portInfo: 'Los Angeles United States (US)', terminal: 'APM Terminals', arrivalDay: '星期二', departureDay: '星期四' },
      { portInfo: 'Oakland United States (US)', terminal: 'OICT', arrivalDay: '星期六', departureDay: '星期日' }
    ]
  },
  {
    key: '4',
    id: 'EC20240115004',
    carrierLogo: '/assets/carrier/OOCL.png',
    carrierName: 'OOCL',
    pol: 'QINGDAO',
    pod: 'NEW YORK',
    etd: '2026-01-28',
    eta: '2026-02-25',
    transitType: '直达',
    cargoType: '普货',
    transitTime: 28,
    containerType: '40HC',
    spaceStatus: '现舱',
    totalPrice: 4200,
    totalCurrency: 'USD',
    basePrice: 3950,
    baseCurrency: 'USD',
    vesselName: 'OOCL HONG KONG',
    voyageNo: '018E',
    routeCode: 'AEC1',
    updateTime: getMockTime(18), // 18小时前 - 一天内
    validFrom: '2026-01-15',
    validTo: '2026-01-31',
    transportTerms: 'CY-CY',
    transitPorts: [],
    portsOfCall: []
  },
  {
    key: '5',
    id: 'EC20240115005',
    carrierLogo: '/assets/carrier/MSC.png',
    carrierName: 'MSC',
    pol: 'SHANGHAI',
    pod: 'FELIXSTOWE',
    etd: '2026-01-30',
    eta: '2026-03-05',
    transitType: '中转',
    cargoType: '普货',
    transitTime: 34,
    containerType: '20GP',
    spaceStatus: '满舱',
    totalPrice: 1950,
    totalCurrency: 'USD',
    basePrice: 1700,
    baseCurrency: 'USD',
    vesselName: 'MSC GULSUN',
    voyageNo: '404W',
    routeCode: 'AE55',
    updateTime: getMockTime(36), // 36小时前 - 两天内
    validFrom: '2026-01-15',
    validTo: '2026-01-31',
    transportTerms: 'CY-CY',
    transitPorts: ['ANTWERP'],
    portsOfCall: []
  },
  {
    key: '6',
    id: 'EC20240115006',
    carrierLogo: '/assets/carrier/CMA.png',
    carrierName: 'CMA',
    pol: 'NINGBO',
    pod: 'LE HAVRE',
    etd: '2026-02-02',
    eta: '2026-03-10',
    transitType: '直达',
    cargoType: '普货',
    transitTime: 36,
    containerType: '40HC',
    spaceStatus: '现舱',
    totalPrice: 3050,
    totalCurrency: 'USD',
    basePrice: 2800,
    baseCurrency: 'USD',
    vesselName: 'CMA CGM JACQUES SAADE',
    voyageNo: '0WB',
    routeCode: 'FAL1',
    updateTime: getMockTime(72), // 72小时前 - 陈旧
    validFrom: '2026-01-10',
    validTo: '2026-01-31',
    transportTerms: 'CY-CY',
    transitPorts: [],
    portsOfCall: []
  }
];


// 新鲜度配置
const getFreshnessConfig = (updateTime: string) => {
  if (!updateTime) return { color: '#86909C', text: '未知', timeDisplay: '未知时间' };
  
  const now = new Date();
  const update = new Date(updateTime);
  const diffHours = (now.getTime() - update.getTime()) / (1000 * 60 * 60);

  let color = '';
  let text = '';
  
  if (diffHours < 2) {
    color = '#00B42A'; // green-6
    text = '极鲜';
  } else if (diffHours < 6) {
    color = '#7BC616'; // lime-7
    text = '新鲜';
  } else if (diffHours < 12) {
    color = '#F7BA1E'; // gold-6
    text = '较新';
  } else if (diffHours < 24) {
    color = '#FF7D00'; // orange-6
    text = '一天内';
  } else if (diffHours < 48) {
    color = '#F53F3F'; // red-6
    text = '两天内';
  } else {
    color = '#86909C'; // gray-6
    text = '陈旧';
  }

  // 计算显示时间
  let timeDisplay = '';
  const diffMinutes = Math.floor((now.getTime() - update.getTime()) / (1000 * 60));
  if (diffMinutes < 60) {
    timeDisplay = `${diffMinutes}分钟前更新`;
  } else if (diffHours < 24) {
    timeDisplay = `${Math.floor(diffHours)}小时前更新`;
  } else {
    timeDisplay = `${Math.floor(diffHours / 24)}天前更新`;
  }

  return { color, text, timeDisplay };
};

const ALL_ECOMMERCE_COLUMNS = [
  { title: '运价ID', dataIndex: 'id', width: 140, sorter: (a: any, b: any) => a.id.localeCompare(b.id) },
  { title: '运输条款', dataIndex: 'transportTerms', width: 100, sorter: (a: any, b: any) => a.transportTerms.localeCompare(b.transportTerms) },
  { title: '承运人名称', dataIndex: 'carrierName', width: 120, sorter: (a: any, b: any) => a.carrierName.localeCompare(b.carrierName) },
  { title: '起运港', dataIndex: 'pol', width: 120, sorter: (a: any, b: any) => a.pol.localeCompare(b.pol) },
  { title: '目的港', dataIndex: 'pod', width: 120, sorter: (a: any, b: any) => a.pod.localeCompare(b.pod) },
  { 
    title: '航线代码', 
    dataIndex: 'routeCode', 
    width: 120, 
    sorter: (a: any, b: any) => (a.routeCode || '').localeCompare(b.routeCode || ''),
    render: (val: string, record: any) => {
      const ports = record.portsOfCall || [];
      return (
        <PortsOfCallPopover 
          routeCode={val || '-'} 
          ports={ports}
        />
      );
    }
  },
  { title: 'ETD', dataIndex: 'etd', width: 120, sorter: (a: any, b: any) => a.etd.localeCompare(b.etd) },
  { title: 'ETA', dataIndex: 'eta', width: 120, sorter: (a: any, b: any) => a.eta.localeCompare(b.eta) },
  { title: '中转状况', dataIndex: 'transitType', width: 100, sorter: (a: any, b: any) => a.transitType.localeCompare(b.transitType) },
  { title: '有效起始日期', dataIndex: 'validFrom', width: 120, sorter: (a: any, b: any) => a.validFrom.localeCompare(b.validFrom) },
  { title: '有效结束日期', dataIndex: 'validTo', width: 120, sorter: (a: any, b: any) => a.validTo.localeCompare(b.validTo) },
  { title: '舱位状态', dataIndex: 'spaceStatus', width: 100, sorter: (a: any, b: any) => a.spaceStatus.localeCompare(b.spaceStatus), render: (val: string) => <Tag color={val === '现舱' ? 'green' : 'red'}>{val}</Tag> },
  { title: '货物类型', dataIndex: 'cargoType', width: 100, sorter: (a: any, b: any) => a.cargoType.localeCompare(b.cargoType) },
  // 箱型价格列 - Base
  { title: '20GP-Base', dataIndex: '20gp', width: 110, sorter: (a: any, b: any) => (a['20gp'] || 0) - (b['20gp'] || 0), render: (val: number) => <span className="text-red-600 font-bold">{val}</span> },
  { title: '40GP-Base', dataIndex: '40gp', width: 110, sorter: (a: any, b: any) => (a['40gp'] || 0) - (b['40gp'] || 0), render: (val: number) => <span className="text-red-600 font-bold">{val}</span> },
  { title: '40HC-Base', dataIndex: '40hc', width: 110, sorter: (a: any, b: any) => (a['40hc'] || 0) - (b['40hc'] || 0), render: (val: number) => <span className="text-red-600 font-bold">{val}</span> },
  // 箱型价格列 - Total
  { 
    title: '20GP-Total', 
    dataIndex: '20gp-total', 
    width: 110, 
    sorter: (a: any, b: any) => {
      const aTotal = (a['20gp'] || 0) + ((a.totalPrice || 0) - (a.basePrice || 0));
      const bTotal = (b['20gp'] || 0) + ((b.totalPrice || 0) - (b.basePrice || 0));
      return aTotal - bTotal;
    },
    render: (val: any, record: any) => {
      const basePrice = record['20gp'] || 0;
      const diff = (record.totalPrice || 0) - (record.basePrice || 0);
      const totalPrice = basePrice + (diff > 0 ? diff : 0);
      return <span className="text-[#1e3a8a] font-bold">{totalPrice}</span>;
    }
  },
  { 
    title: '40GP-Total', 
    dataIndex: '40gp-total', 
    width: 110, 
    sorter: (a: any, b: any) => {
      const aTotal = (a['40gp'] || 0) + ((a.totalPrice || 0) - (a.basePrice || 0));
      const bTotal = (b['40gp'] || 0) + ((b.totalPrice || 0) - (b.basePrice || 0));
      return aTotal - bTotal;
    },
    render: (val: any, record: any) => {
      const basePrice = record['40gp'] || 0;
      const diff = (record.totalPrice || 0) - (record.basePrice || 0);
      const totalPrice = basePrice + (diff > 0 ? diff : 0);
      return <span className="text-[#1e3a8a] font-bold">{totalPrice}</span>;
    }
  },
  { 
    title: '40HC-Total', 
    dataIndex: '40hc-total', 
    width: 110, 
    sorter: (a: any, b: any) => {
      const aTotal = (a['40hc'] || 0) + ((a.totalPrice || 0) - (a.basePrice || 0));
      const bTotal = (b['40hc'] || 0) + ((b.totalPrice || 0) - (b.basePrice || 0));
      return aTotal - bTotal;
    },
    render: (val: any, record: any) => {
      const basePrice = record['40hc'] || 0;
      const diff = (record.totalPrice || 0) - (record.basePrice || 0);
      const totalPrice = basePrice + (diff > 0 ? diff : 0);
      return <span className="text-[#1e3a8a] font-bold">{totalPrice}</span>;
    }
  },
  // Non-default
  { title: '航程', dataIndex: 'transitTime', width: 100, sorter: (a: any, b: any) => a.transitTime - b.transitTime, render: (val: number) => `${val}天` },
  { title: '总运价', dataIndex: 'totalPrice', width: 120, sorter: (a: any, b: any) => a.totalPrice - b.totalPrice, render: (val: number, record: any) => <span className="text-red-600 font-bold">{record.totalCurrency} {val}</span> },
  { title: '总价币种', dataIndex: 'totalCurrency', width: 100, sorter: (a: any, b: any) => a.totalCurrency.localeCompare(b.totalCurrency) },
  { title: '基础运费', dataIndex: 'basePrice', width: 120, sorter: (a: any, b: any) => a.basePrice - b.basePrice },
  { title: '基价币种', dataIndex: 'baseCurrency', width: 100, sorter: (a: any, b: any) => a.baseCurrency.localeCompare(b.baseCurrency) },
  { title: '船名', dataIndex: 'vesselName', width: 150, sorter: (a: any, b: any) => a.vesselName.localeCompare(b.vesselName) },
  { title: '航次', dataIndex: 'voyageNo', width: 100, sorter: (a: any, b: any) => a.voyageNo.localeCompare(b.voyageNo) },
  { 
    title: '更新时间', 
    dataIndex: 'updateTime', 
    width: 220, 
    sorter: (a: any, b: any) => a.updateTime.localeCompare(b.updateTime),
    render: (val: string) => {
      const { color, text, timeDisplay } = getFreshnessConfig(val);
      return (
        <div className="flex items-center">
          <Tooltip content={timeDisplay}>
             <Tag color={color} size="small" className="mr-2" style={{ borderColor: 'transparent', minWidth: '48px', textAlign: 'center' }}>{text}</Tag>
          </Tooltip>
          <span>{val}</span>
        </div>
      );
    }
  },
  { title: '附加费标签', dataIndex: 'surchargeLabel', width: 120, sorter: (a: any, b: any) => (a.surchargeLabel || '').localeCompare(b.surchargeLabel || ''), render: (val: string) => val ? <span className="text-orange-500 font-bold">{val}</span> : '-' },
  { title: '附加费金额', dataIndex: 'surchargeAmount', width: 120, sorter: (a: any, b: any) => (a.surchargeAmount || 0) - (b.surchargeAmount || 0), render: (val: number) => val ? <span className="text-orange-500 font-bold">{val}</span> : '-' },
  { title: '截关日期', dataIndex: 'cutoffDate', width: 140, sorter: (a: any, b: any) => (a.cutoffDate || '').localeCompare(b.cutoffDate || '') },
  // Other containers - Base
  { title: '45HC-Base', dataIndex: '45hc', width: 110, sorter: (a: any, b: any) => (a['45hc'] || 0) - (b['45hc'] || 0), render: (val: number) => <span className="text-red-600 font-bold">{val || '-'}</span> },
  { title: '20NOR-Base', dataIndex: '20nor', width: 110, sorter: (a: any, b: any) => (a['20nor'] || 0) - (b['20nor'] || 0), render: (val: number) => <span className="text-red-600 font-bold">{val || '-'}</span> },
  { title: '40NOR-Base', dataIndex: '40nor', width: 110, sorter: (a: any, b: any) => (a['40nor'] || 0) - (b['40nor'] || 0), render: (val: number) => <span className="text-red-600 font-bold">{val || '-'}</span> },
  { title: '20HC-Base', dataIndex: '20hc', width: 110, sorter: (a: any, b: any) => (a['20hc'] || 0) - (b['20hc'] || 0), render: (val: number) => <span className="text-red-600 font-bold">{val || '-'}</span> },
  { title: '20TK-Base', dataIndex: '20tk', width: 110, sorter: (a: any, b: any) => (a['20tk'] || 0) - (b['20tk'] || 0), render: (val: number) => <span className="text-red-600 font-bold">{val || '-'}</span> },
  { title: '40TK-Base', dataIndex: '40tk', width: 110, sorter: (a: any, b: any) => (a['40tk'] || 0) - (b['40tk'] || 0), render: (val: number) => <span className="text-red-600 font-bold">{val || '-'}</span> },
  { title: '20OT-Base', dataIndex: '20ot', width: 110, sorter: (a: any, b: any) => (a['20ot'] || 0) - (b['20ot'] || 0), render: (val: number) => <span className="text-red-600 font-bold">{val || '-'}</span> },
  { title: '40OT-Base', dataIndex: '40ot', width: 110, sorter: (a: any, b: any) => (a['40ot'] || 0) - (b['40ot'] || 0), render: (val: number) => <span className="text-red-600 font-bold">{val || '-'}</span> },
  { title: '20FR-Base', dataIndex: '20fr', width: 110, sorter: (a: any, b: any) => (a['20fr'] || 0) - (b['20fr'] || 0), render: (val: number) => <span className="text-red-600 font-bold">{val || '-'}</span> },
  { title: '40FR-Base', dataIndex: '40fr', width: 110, sorter: (a: any, b: any) => (a['40fr'] || 0) - (b['40fr'] || 0), render: (val: number) => <span className="text-red-600 font-bold">{val || '-'}</span> },
  // Other containers - Total
  { 
    title: '45HC-Total', 
    dataIndex: '45hc-total', 
    width: 110, 
    render: (val: any, record: any) => {
      const basePrice = record['45hc'] || 0;
      if (!basePrice) return '-';
      const diff = (record.totalPrice || 0) - (record.basePrice || 0);
      const totalPrice = basePrice + (diff > 0 ? diff : 0);
      return <span className="text-[#1e3a8a] font-bold">{totalPrice}</span>;
    }
  },
  { 
    title: '20NOR-Total', 
    dataIndex: '20nor-total', 
    width: 110, 
    render: (val: any, record: any) => {
      const basePrice = record['20nor'] || 0;
      if (!basePrice) return '-';
      const diff = (record.totalPrice || 0) - (record.basePrice || 0);
      const totalPrice = basePrice + (diff > 0 ? diff : 0);
      return <span className="text-[#1e3a8a] font-bold">{totalPrice}</span>;
    }
  },
  { 
    title: '40NOR-Total', 
    dataIndex: '40nor-total', 
    width: 110, 
    render: (val: any, record: any) => {
      const basePrice = record['40nor'] || 0;
      if (!basePrice) return '-';
      const diff = (record.totalPrice || 0) - (record.basePrice || 0);
      const totalPrice = basePrice + (diff > 0 ? diff : 0);
      return <span className="text-[#1e3a8a] font-bold">{totalPrice}</span>;
    }
  },
  { 
    title: '20HC-Total', 
    dataIndex: '20hc-total', 
    width: 110, 
    render: (val: any, record: any) => {
      const basePrice = record['20hc'] || 0;
      if (!basePrice) return '-';
      const diff = (record.totalPrice || 0) - (record.basePrice || 0);
      const totalPrice = basePrice + (diff > 0 ? diff : 0);
      return <span className="text-[#1e3a8a] font-bold">{totalPrice}</span>;
    }
  },
  { 
    title: '20TK-Total', 
    dataIndex: '20tk-total', 
    width: 110, 
    render: (val: any, record: any) => {
      const basePrice = record['20tk'] || 0;
      if (!basePrice) return '-';
      const diff = (record.totalPrice || 0) - (record.basePrice || 0);
      const totalPrice = basePrice + (diff > 0 ? diff : 0);
      return <span className="text-[#1e3a8a] font-bold">{totalPrice}</span>;
    }
  },
  { 
    title: '40TK-Total', 
    dataIndex: '40tk-total', 
    width: 110, 
    render: (val: any, record: any) => {
      const basePrice = record['40tk'] || 0;
      if (!basePrice) return '-';
      const diff = (record.totalPrice || 0) - (record.basePrice || 0);
      const totalPrice = basePrice + (diff > 0 ? diff : 0);
      return <span className="text-[#1e3a8a] font-bold">{totalPrice}</span>;
    }
  },
  { 
    title: '20OT-Total', 
    dataIndex: '20ot-total', 
    width: 110, 
    render: (val: any, record: any) => {
      const basePrice = record['20ot'] || 0;
      if (!basePrice) return '-';
      const diff = (record.totalPrice || 0) - (record.basePrice || 0);
      const totalPrice = basePrice + (diff > 0 ? diff : 0);
      return <span className="text-[#1e3a8a] font-bold">{totalPrice}</span>;
    }
  },
  { 
    title: '40OT-Total', 
    dataIndex: '40ot-total', 
    width: 110, 
    render: (val: any, record: any) => {
      const basePrice = record['40ot'] || 0;
      if (!basePrice) return '-';
      const diff = (record.totalPrice || 0) - (record.basePrice || 0);
      const totalPrice = basePrice + (diff > 0 ? diff : 0);
      return <span className="text-[#1e3a8a] font-bold">{totalPrice}</span>;
    }
  },
  { 
    title: '20FR-Total', 
    dataIndex: '20fr-total', 
    width: 110, 
    render: (val: any, record: any) => {
      const basePrice = record['20fr'] || 0;
      if (!basePrice) return '-';
      const diff = (record.totalPrice || 0) - (record.basePrice || 0);
      const totalPrice = basePrice + (diff > 0 ? diff : 0);
      return <span className="text-[#1e3a8a] font-bold">{totalPrice}</span>;
    }
  },
  { 
    title: '40FR-Total', 
    dataIndex: '40fr-total', 
    width: 110, 
    render: (val: any, record: any) => {
      const basePrice = record['40fr'] || 0;
      if (!basePrice) return '-';
      const diff = (record.totalPrice || 0) - (record.basePrice || 0);
      const totalPrice = basePrice + (diff > 0 ? diff : 0);
      return <span className="text-[#1e3a8a] font-bold">{totalPrice}</span>;
    }
  },
];


const RateQuery: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [notification, contextHolder] = Notification.useNotification();
  const [modal, modalContextHolder] = Modal.useModal();
  const [activeTab, setActiveTab] = useState<string>('ecommerce');
  const [customTableModalVisible, setCustomTableModalVisible] = useState(false);
  
  // 运价置顶状态
  const [pinnedRateIds, setPinnedRateIds] = useState<string[]>(() => {
    const saved = localStorage.getItem('pinnedRateIds');
    return saved ? JSON.parse(saved) : [];
  });
  const [showAllPinned, setShowAllPinned] = useState(false);

  useEffect(() => {
    localStorage.setItem('pinnedRateIds', JSON.stringify(pinnedRateIds));
  }, [pinnedRateIds]);

  // Ecommerce Column Settings
  const [ecommerceColumnSettings, setEcommerceColumnSettings] = useState<{
    visible: Record<string, boolean>;
    order: string[];
  }>(() => {
    const saved = localStorage.getItem('ecommerceColumnSettings');
    if (saved) {
      return JSON.parse(saved);
    }
    return {
      visible: {
        id: false,
        transportTerms: true,
        carrierName: true,
        pol: true,
        pod: true,
        routeCode: true,
        etd: true,
        eta: true,
        transitType: true,
        validFrom: true,
        validTo: true,
        spaceStatus: true,
        cargoType: true,
        '20gp': true,
        '20gp-total': true,
        '40gp': true,
        '40gp-total': true,
        '40hc': true,
        '40hc-total': true,
        '45hc': false,
        '45hc-total': false,
        '20nor': false,
        '20nor-total': false,
        '40nor': false,
        '40nor-total': false,
        '20hc': false,
        '20hc-total': false,
        '20tk': false,
        '20tk-total': false,
        '40tk': false,
        '40tk-total': false,
        '20ot': false,
        '20ot-total': false,
        '40ot': false,
        '40ot-total': false,
        '20fr': false,
        '20fr-total': false,
        '40fr': false,
        '40fr-total': false,
        surchargeLabel: false,
        surchargeAmount: false,
        cutoffDate: false,
        updateTime: true
      },
      order: [
        'carrierName', 'pol', 'pod', 'transportTerms', 'routeCode',
        'etd', 'eta', 'transitType', 'validFrom', 'validTo', 'spaceStatus',
        '20gp', '20gp-total', '40gp', '40gp-total', '40hc', '40hc-total', 
        'id', 'cargoType', '45hc', '45hc-total', '20nor', '20nor-total', '40nor', '40nor-total',
        '20hc', '20hc-total', '20tk', '20tk-total', '40tk', '40tk-total',
        '20ot', '20ot-total', '40ot', '40ot-total', '20fr', '20fr-total', '40fr', '40fr-total',
        'surchargeLabel', 'surchargeAmount', 'cutoffDate', 'updateTime'
      ]
    };
  });

  const saveEcommerceSettings = () => {
    localStorage.setItem('ecommerceColumnSettings', JSON.stringify(ecommerceColumnSettings));
    Message.success('配置已保存');
    closeCustomTableModal();
  };

  const resetEcommerceSettings = () => {
    setEcommerceColumnSettings({
      visible: {
        id: false,
        transportTerms: true,
        carrierName: true,
        pol: true,
        pod: true,
        routeCode: true,
        etd: true,
        eta: true,
        transitType: true,
        validFrom: true,
        validTo: true,
        spaceStatus: true,
        cargoType: true,
        '20gp': true,
        '20gp-total': true,
        '40gp': true,
        '40gp-total': true,
        '40hc': true,
        '40hc-total': true,
        '45hc': false,
        '45hc-total': false,
        '20nor': false,
        '20nor-total': false,
        '40nor': false,
        '40nor-total': false,
        '20hc': false,
        '20hc-total': false,
        '20tk': false,
        '20tk-total': false,
        '40tk': false,
        '40tk-total': false,
        '20ot': false,
        '20ot-total': false,
        '40ot': false,
        '40ot-total': false,
        '20fr': false,
        '20fr-total': false,
        '40fr': false,
        '40fr-total': false,
        surchargeLabel: false,
        surchargeAmount: false,
        cutoffDate: false,
        updateTime: true
      },
      order: [
        'carrierName', 'pol', 'pod', 'transportTerms', 'routeCode',
        'etd', 'eta', 'transitType', 'validFrom', 'validTo', 'spaceStatus',
        '20gp', '20gp-total', '40gp', '40gp-total', '40hc', '40hc-total', 
        'id', 'cargoType', '45hc', '45hc-total', '20nor', '20nor-total', '40nor', '40nor-total',
        '20hc', '20hc-total', '20tk', '20tk-total', '40tk', '40tk-total',
        '20ot', '20ot-total', '40ot', '40ot-total', '20fr', '20fr-total', '40fr', '40fr-total',
        'surchargeLabel', 'surchargeAmount', 'cutoffDate', 'updateTime'
      ]
    });
    Message.success('已恢复默认配置');
  };

  const [priceDisplayMode, setPriceDisplayMode] = useState<('total' | 'base')[]>(['total', 'base']);
  
  // 客户端访问标识 - 用于控制运价状态列显示
  const isClientAccess = false; // 默认为运营版，显示运价状态列
  
  // 完整的列可见性状态 - 包含所有可能的字段
  const [columnVisibility, setColumnVisibility] = useState({
    routeCode: true,
    rateType: true,
    departurePort: true,
    dischargePort: true,
    transitPort: true,
    transitType: true,
    shipCompany: true,
    contractNo: false,
    spaceStatus: true,
    priceStatus: true,
    cargoType: false,
    rateStatus: true,
    '20gp': true,
    '40gp': true,
    '40hc': true,
    '20nor': false,
    '40nor': false,
    '45hc': true,
    '20hc': false,
    '20tk': false,
    '40tk': false,
    '20ot': false,
    '40ot': false,
    '20fr': false,
    '40fr': false,
    vesselSchedule: true,
    voyage: false,
    freeContainerDays: true,
    freeStorageDays: true,
    chargeSpecialNote: false,
    nac: false,
    overweightNote: false,
    notes: false,
    validPeriod: true,
    etd: false,
    eta: false,
    vesselName: false,
    voyageNo: false,
    entryPerson: false,
    createDate: false,
    rateModifier: false,
    modifyDate: false
  });

  // 筛选功能状态
  const [filterExpanded, setFilterExpanded] = useState(true);
  
  // 选择状态管理
  const [selectedRowKeys, setSelectedRowKeys] = useState<string[]>([]);
  const [selectAll, setSelectAll] = useState(false);
  const [indeterminate, setIndeterminate] = useState(false);
  
  // 获取表格数据
  const getTableData = (): any => {
    switch (activeTab) {
      case 'ecommerce':
        return ecommerceData;
      case 'lcl':
        return lclData;
      case 'air':
        return airData;
      case 'precarriage':
        return precarriageData;
      case 'oncarriage':
        return oncarriageData;
      case 'fcl':
      default:
        return fclData;
    }
  };

  // 获取置顶数据
  const getPinnedData = () => {
    const allData = getTableData();
    return allData.filter((item: any) => pinnedRateIds.includes(item.key));
  };

  // 获取未置顶数据 (主列表显示)
  const getUnpinnedData = () => {
    const allData = getTableData();
    return allData.filter((item: any) => !pinnedRateIds.includes(item.key));
  };

  // 处理全选 (只选未置顶的可见数据)
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      const currentData = getUnpinnedData();
      const allKeys = currentData.map((item: any) => item.key);
      // 如果已经有选中的置顶项，保留它们
      const pinnedSelected = selectedRowKeys.filter(key => pinnedRateIds.includes(key));
      setSelectedRowKeys([...pinnedSelected, ...allKeys]);
      setSelectAll(true);
      setIndeterminate(false);
    } else {
      // 取消全选时，仅取消未置顶的选中项，还是全部取消？通常全选checkbox控制的是下面的列表。
      // 如果用户想取消置顶项的选择，应该去置顶列表操作。
      // 这里只操作未置顶项
      const pinnedSelected = selectedRowKeys.filter(key => pinnedRateIds.includes(key));
      setSelectedRowKeys(pinnedSelected);
      setSelectAll(false);
      setIndeterminate(false);
    }
  };
  
  // 处理单行选择 (需要适配)
  const handleRowSelect = (key: string, checked: boolean) => {
    let newSelectedKeys;
    if (checked) {
      newSelectedKeys = [...selectedRowKeys, key];
    } else {
      newSelectedKeys = selectedRowKeys.filter(k => k !== key);
    }
    
    setSelectedRowKeys(newSelectedKeys);
    
    // Check status for unpinned list select all checkbox
    const unpinnedData = getUnpinnedData();
    const unpinnedKeys = unpinnedData.map((item: any) => item.key);
    const selectedUnpinnedCount = newSelectedKeys.filter(k => unpinnedKeys.includes(k)).length;
    
    if (selectedUnpinnedCount === 0) {
      setSelectAll(false);
      setIndeterminate(false);
    } else if (selectedUnpinnedCount === unpinnedKeys.length && unpinnedKeys.length > 0) {
      setSelectAll(true);
      setIndeterminate(false);
    } else {
       setSelectAll(false);
       setIndeterminate(true);
     }
   };

  // 处理置顶操作
  const handlePinOperation = () => {
    if (selectedRowKeys.length === 0) {
      Message.warning('请先选择运价');
      return;
    }

    const pinnedSelected = selectedRowKeys.filter(key => pinnedRateIds.includes(key));
    const unpinnedSelected = selectedRowKeys.filter(key => !pinnedRateIds.includes(key));

    if (pinnedSelected.length > 0 && unpinnedSelected.length > 0) {
      // 置换置顶: 取消选中的置顶，置顶选中的未置顶
      const newPinnedIds = pinnedRateIds.filter(id => !pinnedSelected.includes(id));
      setPinnedRateIds([...newPinnedIds, ...unpinnedSelected]);
      Message.success('已置换置顶运价');
    } else if (pinnedSelected.length > 0) {
      // 取消置顶
      const newPinnedIds = pinnedRateIds.filter(id => !pinnedSelected.includes(id));
      setPinnedRateIds(newPinnedIds);
      Message.success('已取消置顶');
    } else if (unpinnedSelected.length > 0) {
      // 运价置顶
      setPinnedRateIds([...pinnedRateIds, ...unpinnedSelected]);
      Message.success('已置顶运价');
    }
    
    // 清空选择，体验更好？或者保留？保留选择比较好。
    setSelectedRowKeys([]);
    setSelectAll(false);
    setIndeterminate(false);
  };

  const [filterFieldModalVisible, setFilterFieldModalVisible] = useState(false);
  const [schemeModalVisible, setSchemeModalVisible] = useState(false);
  const [newSchemeName, setNewSchemeName] = useState('');
  
  // 筛选条件状态
  const [filterConditions, setFilterConditions] = useState<FilterCondition[]>([]);
  const [filterSchemes, setFilterSchemes] = useState<FilterScheme[]>([]);
  const [currentSchemeId, setCurrentSchemeId] = useState<string>('default');
  
  // 排序状态
  const [sortField, setSortField] = useState<string>('');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  
  // 容器类型选择状态
  const [showContainerDropdown, setShowContainerDropdown] = useState<boolean>(false);
  const [selectedContainerType, setSelectedContainerType] = useState<string>('');
  
  // 点击外部关闭下拉菜单
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (showContainerDropdown) {
        const target = event.target as HTMLElement;
        if (!target.closest('.container-dropdown-wrapper')) {
          setShowContainerDropdown(false);
        }
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    // 渲染置顶区域
  const renderPinnedSection = () => {
    const pinnedData = getPinnedData();
    if (pinnedData.length === 0) return null;

    const visiblePinnedData = showAllPinned ? pinnedData : pinnedData.slice(0, 10);
    const hasMore = pinnedData.length > 10;

    // Calculate checkbox state for pinned section
    const visiblePinnedKeys = visiblePinnedData.map((item: any) => item.key);
    const selectedPinnedCount = selectedRowKeys.filter(key => visiblePinnedKeys.includes(key)).length;
    const isPinnedAllSelected = visiblePinnedData.length > 0 && selectedPinnedCount === visiblePinnedData.length;
    const isPinnedIndeterminate = selectedPinnedCount > 0 && selectedPinnedCount < visiblePinnedData.length;

    // Handle Pinned Select All
    const handlePinnedSelectAll = (checked: boolean) => {
      if (checked) {
        // Add all visible pinned keys to selectedRowKeys, keeping existing non-pinned selections
        const otherSelected = selectedRowKeys.filter(key => !visiblePinnedKeys.includes(key));
        const newSelected = Array.from(new Set([...otherSelected, ...visiblePinnedKeys]));
        setSelectedRowKeys(newSelected);
      } else {
        // Remove all visible pinned keys from selectedRowKeys
        const newSelected = selectedRowKeys.filter(key => !visiblePinnedKeys.includes(key));
        setSelectedRowKeys(newSelected);
      }
    };

    return (
      <div className="mb-4">
        <div className="bg-gray-100 p-2 rounded-t flex justify-between items-center border-b border-gray-200">
           <div className="flex items-center text-gray-700 font-bold">
              <Checkbox 
                checked={isPinnedAllSelected} 
                indeterminate={isPinnedIndeterminate}
                onChange={handlePinnedSelectAll}
                className="mr-2"
              />
              <IconPushpin className="mr-2 text-blue-600" />
              <span>置顶运价 ({pinnedData.length})</span>
           </div>
           {hasMore && (
             <Button 
               type="text" 
               size="mini" 
               onClick={() => setShowAllPinned(!showAllPinned)}
               className="text-blue-600"
             >
               {showAllPinned ? '收起置顶运价' : '展开全部置顶运价'}
             </Button>
           )}
        </div>
        
        <div className="bg-gray-50 border border-gray-200 rounded-b p-2 overflow-hidden">
          {viewMode === 'list' ? (
             <Table
               rowKey="key"
               rowSelection={activeTab === 'ecommerce' ? {
                 type: 'checkbox',
                 selectedRowKeys,
                 columnTitle: " ", // Hide default select all checkbox
                 onSelect: (selected, record) => {
                    handleRowSelect(record.key, selected);
                 },
                 onSelectAll: (selected, selectedRows) => {
                    const currentTableKeys = visiblePinnedData.map((r: any) => r.key);
                    if (selected) {
                       const newSet = new Set([...selectedRowKeys, ...currentTableKeys]);
                       setSelectedRowKeys(Array.from(newSet));
                    } else {
                       const newKeys = selectedRowKeys.filter(k => !currentTableKeys.includes(k));
                       setSelectedRowKeys(newKeys);
                    }
                 }
               } : undefined}
               loading={false}
               columns={getTableColumns()}
               data={visiblePinnedData}
               pagination={false}
               scroll={{ x: 2740 }}
               border={false}
               className="inquiry-table-nowrap pinned-table"
             />
          ) : (
             <CardView data={visiblePinnedData} />
          )}
        </div>
      </div>
    );
  };

  const getPinButtonText = () => {
    const pinnedSelected = selectedRowKeys.filter(key => pinnedRateIds.includes(key));
    const unpinnedSelected = selectedRowKeys.filter(key => !pinnedRateIds.includes(key));
    
    if (pinnedSelected.length > 0 && unpinnedSelected.length > 0) {
      return '置换置顶';
    } else if (pinnedSelected.length > 0) {
      return '取消置顶';
    } else {
      return '运价置顶';
    }
  };

  return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showContainerDropdown]);
  
  // 方案管理相关状态
  const [schemeManagementModalVisible, setSchemeManagementModalVisible] = useState(false);
  const [allSchemes, setAllSchemes] = useState<SchemeData[]>([]);

  // 拖拽状态
  const [draggedItem, setDraggedItem] = useState<string | null>(null);
  const [dragOverItem, setDragOverItem] = useState<string | null>(null);
  const [columnOrder, setColumnOrder] = useState<string[]>([]);

  // 筛选字段拖拽状态
  const [draggedFilterField, setDraggedFilterField] = useState<string | null>(null);
  const [dragOverFilterField, setDragOverFilterField] = useState<string | null>(null);
  const [filterFieldOrder, setFilterFieldOrder] = useState<string[]>([]);

  // 视图模式状态 - 列表式/卡片式
  const [viewMode, setViewMode] = useState<'list' | 'card'>('list');
  
  // 运价趋势弹窗状态
  const [rateTrendModalVisible, setRateTrendModalVisible] = useState(false);
  
  // 运价详情弹窗状态
  const [rateDetailModalVisible, setRateDetailModalVisible] = useState(false);
  const [currentRateDetail, setCurrentRateDetail] = useState<any>(null);
  const [rateDetailInitialTab, setRateDetailInitialTab] = useState<string>('cost');
  
  // 导出运价弹窗状态
  const [exportModalVisible, setExportModalVisible] = useState(false);

  /**
   * 处理导出运价功能
   * 显示导出成功提示弹窗
   */
  const handleExportRate = () => {
    // 如果有选中运价，直接导出
    if (selectedRowKeys.length > 0) {
      const exportCount = selectedRowKeys.length;
      notification.success({
        title: '导出成功',
        content: `Excel导出成功，共导出${exportCount}条记录`,
        duration: 3000
      });
    } else {
      // 如果未选中任何运价，询问是否导出全部
      modal.confirm({
        title: '确认导出',
        content: '是否发起导出任务，导出目前查询条件下的所有运价结果？',
        okText: '确认',
        cancelText: '取消',
        onOk: () => {
          // 模拟导出所有记录
          const totalCount = 9232; // 模拟总数
          notification.success({
            title: '导出成功',
            content: `Excel导出成功，共导出${totalCount}条记录`,
            duration: 3000
          });
        }
      });
    }
  };

  /**
   * 处理查看任务按钮点击
   * 跳转到任务中心的导出任务tab
   */
  const handleViewTask = () => {
    setExportModalVisible(false);
    navigate('/controltower/task-management?tab=export');
  };

  /**
   * 关闭导出弹窗
   */
  const handleCloseExportModal = () => {
    setExportModalVisible(false);
  };

  
  // 选中行变化处理
  // const onSelectChange = (selectedRowKeys: (string | number)[]) => {
  //   setSelectedRowKeys(selectedRowKeys);
  // };
  
  // 运输类型筛选状态
  const [transitFilter, setTransitFilter] = useState<string>('all');
  
  // 船公司选项
  const shippingCompanyOptions = SHIPPING_COMPANY_OPTIONS;

  // 船公司筛选状态 - 默认全选
  const [selectedShippingCompanies, setSelectedShippingCompanies] = useState<string[]>(
    shippingCompanyOptions.map(option => option.value)
  );
  
  // 箱型筛选状态
  const [selectedContainerTypes, setSelectedContainerTypes] = useState<string[]>([]);
  
  // 箱型选项
  const containerTypeOptions = BOX_TYPE_OPTIONS;
  
  // 电商运价查询状态
  const [ecommerceOrigin, setEcommerceOrigin] = useState<string>('');
  const [ecommerceDestination, setEcommerceDestination] = useState<string>('');
  const [ecommerceWeight, setEcommerceWeight] = useState<string>('');
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [searchProgressData, setSearchProgressData] = useState<CarrierProgress[]>([]);

  // 处理电商运价查询
  const handleEcommerceSearch = () => {
    let origin = ecommerceOrigin;
    let destination = ecommerceDestination;
    
    // 如果是列表模式，从筛选条件中获取值
    if (viewMode === 'list') {
       const polCondition = filterConditions.find(c => c.key === 'pol');
       const podCondition = filterConditions.find(c => c.key === 'pod');
       const boxTypeCondition = filterConditions.find(c => c.key === 'boxType');

       origin = polCondition?.value || '';
       destination = podCondition?.value || '';

       // 校验20GP箱型必须填写重量
       if (boxTypeCondition?.value === '20GP' && !ecommerceWeight) {
          notification.error({
            title: '查询校验失败',
            content: '选择20GP箱型时必须填写毛重',
            position: 'topRight'
          });
          return;
       }
    }

    if (!origin || !destination) {
      notification.error({
        title: '查询校验失败',
        content: '请输入起运港和目的港',
        position: 'topRight'
      });
      return;
    }

    setIsSearching(true);
    // 初始化查询进度数据
    const initialProgress: CarrierProgress[] = [
      { carrierCode: 'MSK', carrierName: 'MAERSK', logo: '/assets/carrier/MSK.png', status: 'waiting' },
      { carrierCode: 'CMA', carrierName: 'CMA CGM', logo: '/assets/carrier/CMA.png', status: 'waiting' },
      { carrierCode: 'COSCO', carrierName: 'COSCO', logo: '/assets/carrier/COSCO.png', status: 'waiting' },
      { carrierCode: 'ONE', carrierName: 'ONE', logo: '/assets/carrier/ONE.png', status: 'waiting' },
      { carrierCode: 'EMC', carrierName: 'EVERGREEN', logo: '/assets/carrier/EMC.png', status: 'waiting' },
      { carrierCode: 'HPL', carrierName: 'HAPAG-LLOYD', logo: '/assets/carrier/HPL_SPOT.png', status: 'waiting' }
    ];
    setSearchProgressData(initialProgress);

    // 模拟查询过程
    initialProgress.forEach((carrier, index) => {
      // 1. 变为查询中
      setTimeout(() => {
        setSearchProgressData(prev => prev.map(p => 
          p.carrierCode === carrier.carrierCode ? { ...p, status: 'searching' } : p
        ));
      }, index * 800 + 100);

      // 2. 变为完成
      setTimeout(() => {
        setSearchProgressData(prev => prev.map(p => 
          p.carrierCode === carrier.carrierCode ? { 
            ...p, 
            status: 'completed', 
            count: Math.floor(Math.random() * 5) + 1 
          } : p
        ));
        
        // 如果是最后一个，结束查询状态
        if (index === initialProgress.length - 1) {
          setTimeout(() => {
            setIsSearching(false);
            setHasSearched(true);
            Message.success('查询完成，已为您找到最新的运价信息');
          }, 1000);
        }
      }, index * 800 + 1500 + Math.random() * 1000);
    });
  };

  // 船公司选择变化处理
  const handleShippingCompanyChange = (values: string[]) => {
    setSelectedShippingCompanies(values);
  };
  
  // 箱型选择变化处理
  const handleContainerTypeChange = (values: string[]) => {
    setSelectedContainerTypes(values);
  };

  // 货好时间相关状态
  const [cargoTimeMode, setCargoTimeMode] = useState<'range' | 'date'>('range');
  const [cargoTimeRange, setCargoTimeRange] = useState<string>('一周内');
  const [cargoDate, setCargoDate] = useState<any>(null);
  
  // ETD和ETA日期范围状态
  const [etdDateRange, setEtdDateRange] = useState<any[]>([]);
  const [etaDateRange, setEtaDateRange] = useState<any[]>([]);
  
  const [recentSearches] = useState([
    { origin: 'Shanghai', destination: 'Los Angeles', cargoTime: '一周内' },
    { origin: 'Ningbo', destination: 'Hamburg', cargoTime: '二周内' },
    { origin: 'Shenzhen', destination: 'Rotterdam', cargoTime: '2025-01-15' },
    { origin: 'Qingdao', destination: 'Singapore', cargoTime: '一个月内' }
  ]);

  // 批量报价弹窗状态
  const [batchQuoteModalVisible, setBatchQuoteModalVisible] = useState(false);
  const [quickQuoteItem, setQuickQuoteItem] = useState<any>(null);
  const [sailingScheduleModalVisible, setSailingScheduleModalVisible] = useState(false);

  // 批量报价按钮点击处理
  const handleBatchQuote = () => {
    if (selectedRowKeys.length === 0) {
      Message.warning('请先选择要报价的运价');
      return;
    }
    setBatchQuoteModalVisible(true);
  };

  // 快速报价处理
  const handleQuickQuote = (record: any) => {
    setQuickQuoteItem(record);
    setBatchQuoteModalVisible(true);
  };

  // 查看可用船期按钮点击处理
  const handleViewAvailableSailings = () => {
    setSailingScheduleModalVisible(true);
  };

  // 处理AI分析
  const handleAiAnalysis = () => {
    // 收集筛选条件
    const filters: any = {};
    filterConditions.forEach(condition => {
      if (condition.value) {
        filters[condition.key] = condition.value;
      }
    });
    if (selectedShippingCompanies.length > 0) {
      filters.shippingCompany = selectedShippingCompanies;
    }
    if (selectedContainerTypes.length > 0) {
      filters.containerType = selectedContainerTypes;
    }

    const event = new CustomEvent('openAiAssistant', {
      detail: {
        skill: '运价分析',
        input: '根据当前筛选条件与查询到的运价，进行运价分析',
        context: {
          type: 'filter',
          activeTab,
          filters
        }
      }
    });
    window.dispatchEvent(event);
  };

  // 处理单个运价AI分析
  const handleSingleRateAnalysis = (record: any) => {
    const event = new CustomEvent('openAiAssistant', {
      detail: {
        skill: '运价分析',
        input: '分析该运价是否划算，给出选择建议',
        context: {
          type: 'row',
          record
        }
      }
    });
    window.dispatchEvent(event);
  };

  // 监听AI助手请求打开运价详情或快速报价
  useEffect(() => {
    const handleTriggerRateAction = (event: CustomEvent) => {
      const { action, rateId, rate } = event.detail || {};
      if (action === 'viewDetail') {
        // 如果有rate对象，可以直接使用，否则可能需要根据ID查找（这里简化处理，假设传递了足够信息或ID足够）
        // 这里的handleViewRateDetail需要record对象，如果只有ID可能需要调整，
        // 但AI助手传递过来的rate对象通常包含必要信息
        if (rate) {
          handleViewRateDetail(rate);
        } else if (rateId) {
           // 尝试在当前数据中查找
           const record = getTableData().find((item: any) => item.key === rateId || item.id === rateId);
           if (record) {
             handleViewRateDetail(record);
           } else {
             // 如果找不到，构建一个最小可用对象或跳转
             handleViewFclRate(rateId);
           }
        }
      } else if (action === 'quickQuote') {
        if (rate) {
          handleQuickQuote(rate);
        } else if (rateId) {
           const record = getTableData().find((item: any) => item.key === rateId || item.id === rateId);
           if (record) {
             handleQuickQuote(record);
           } else {
             Message.warning('未找到对应运价信息');
           }
        }
      }
    };

    window.addEventListener('triggerRateAction', handleTriggerRateAction as EventListener);
    return () => {
      window.removeEventListener('triggerRateAction', handleTriggerRateAction as EventListener);
    };
  }, [activeTab]);

  // 运价趋势按钮点击处理
  const handleViewRateTrend = (item?: any) => {
    if (item) {
      setCurrentRateDetail(item);
    }
    setRateDetailInitialTab('trend');
    setRateDetailModalVisible(true);
  };

  // 筛选区收起/展开状态

  // 移除卡片展开状态管理，固定为展开状态

  // 城市SVG图标
  const CitySvg = () => (
    <svg width="1em" height="1em" viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="butt" strokeLinejoin="miter">
      <path d="M4 44H44" />
      <path d="M10 44V20L24 12L38 20V44" />
      <path d="M24 44V34" />
      <path d="M18 26H30" />
      <path d="M18 34H24" />
      <path d="M30 34H24" />
    </svg>
  );

  // 船锚SVG图标
  const AnchorSvg = () => (
    <svg width="1em" height="1em" viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="butt" strokeLinejoin="miter">
      <path d="M24 4V44" />
      <path d="M10 24C10 31.732 16.268 38 24 38C31.732 38 38 31.732 38 24" />
      <circle cx="24" cy="10" r="4" />
      <path d="M20 16H28" />
    </svg>
  );

  // 卡片式视图组件 - 一行显示一个卡片
  const CardView: React.FC<{ data: any[] }> = ({ data }) => {
    if (activeTab === 'ecommerce') {
      return (
        <div className="space-y-4 mt-4">
          {data.map((item: any) => (
            <Card key={item.key} className="hover:shadow-lg transition-shadow duration-300 relative">
              {/* Header: Carrier Info, Route Info */}
              <div className="flex justify-between items-start mb-4">
                 <div className="flex items-center space-x-3">
                    <Checkbox 
                      checked={selectedRowKeys.includes(item.key)}
                      onChange={(checked) => handleRowSelect(item.key, checked)}
                    />
                    <Tag color="green">{item.transportTerms || 'CY-CY'}</Tag>
                    <Tag color={item.spaceStatus === '现舱' ? 'green' : 'red'}>{item.spaceStatus}</Tag>
                    
                    {(() => {
                        const { color, text, timeDisplay } = getFreshnessConfig(item.updateTime);
                        return (
                            <div className="flex items-center ml-2">
                                <Tooltip content={timeDisplay}>
                                    <Tag color={color} size="small" className="mr-2" style={{ borderColor: 'transparent', minWidth: '48px', textAlign: 'center' }}>{text}</Tag>
                                </Tooltip>
                                <span className="text-gray-500 text-xs">{item.updateTime}</span>
                            </div>
                        );
                    })()}
                 </div>
                 <div className="flex items-center space-x-2">
                    <span className="text-gray-500 text-xs">有效期: {item.validFrom} ~ {item.validTo}</span>
                 </div>
              </div>
              
              <div className="flex items-center">
                 {/* Carrier */}
                 <div className="flex flex-col items-center w-24 mr-4">
                    <img 
                      src={item.carrierLogo} 
                      alt={item.carrierName} 
                      className="w-10 h-10 object-contain" 
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://via.placeholder.com/40?text=' + item.carrierName;
                      }}
                    />
                    <span className="font-bold mt-1 text-sm">{item.carrierName}</span>
                 </div>
                 
                {/* Route */}
                 <div className="flex flex-col px-4 relative" style={{ width: '45%', flex: '0 0 45%' }}>
                    {(() => {
                        const getPortInfo = (val: string) => {
                            let name = val || '';
                            if (val && val.includes('|')) {
                                name = val.split('|')[1].trim();
                            }
                            
                            // 简单的城市/国家/UNICODE映射
                            const cityMap: Record<string, { city: string, country: string, code: string, unicode: string, portName?: string }> = {
                                'Shanghai': { city: 'Shanghai', country: 'China', code: 'CN', unicode: 'CNSHA', portName: 'Yangshan' },
                                'Ningbo': { city: 'Ningbo', country: 'China', code: 'CN', unicode: 'CNNGB', portName: 'Zhoushan' },
                                'Shenzhen': { city: 'Shenzhen', country: 'China', code: 'CN', unicode: 'CNSZX', portName: 'Yantian' },
                                'Yantian': { city: 'Shenzhen', country: 'China', code: 'CN', unicode: 'CNYTN', portName: 'Yantian' },
                                'Qingdao': { city: 'Qingdao', country: 'China', code: 'CN', unicode: 'CNQDA', portName: 'Qingdao Port' },
                                'Xiamen': { city: 'Xiamen', country: 'China', code: 'CN', unicode: 'CNXMN', portName: 'Xiamen Port' },
                                'Tianjin': { city: 'Tianjin', country: 'China', code: 'CN', unicode: 'CNTJN', portName: 'Tianjin Port' },
                                'Guangzhou': { city: 'Guangzhou', country: 'China', code: 'CN', unicode: 'CNGZG', portName: 'Nansha' },
                                'Hamburg': { city: 'Hamburg', country: 'Germany', code: 'DE', unicode: 'DEHAM', portName: 'Hamburg Port' },
                                'Rotterdam': { city: 'Rotterdam', country: 'Netherlands', code: 'NL', unicode: 'NLRTM', portName: 'Rotterdam Port' },
                                'Antwerp': { city: 'Antwerp', country: 'Belgium', code: 'BE', unicode: 'BEANR', portName: 'Antwerp Port' },
                                'Felixstowe': { city: 'Felixstowe', country: 'United Kingdom', code: 'GB', unicode: 'GBFXT', portName: 'Felixstowe Port' },
                                'Southampton': { city: 'Southampton', country: 'United Kingdom', code: 'GB', unicode: 'GBSOU', portName: 'Southampton Port' },
                                'Le Havre': { city: 'Le Havre', country: 'France', code: 'FR', unicode: 'FRLEH', portName: 'Le Havre Port' },
                                'Singapore': { city: 'Singapore', country: 'Singapore', code: 'SG', unicode: 'SGSIN', portName: 'Singapore Port' },
                                'Busan': { city: 'Busan', country: 'Korea', code: 'KR', unicode: 'KRPUS', portName: 'Busan Port' },
                                'Port Klang': { city: 'Port Klang', country: 'Malaysia', code: 'MY', unicode: 'MYPKG', portName: 'Port Klang' },
                                'Jebel Ali': { city: 'Dubai', country: 'United Arab Emirates', code: 'AE', unicode: 'AEJEA', portName: 'Jebel Ali' },
                                'Los Angeles': { city: 'Los Angeles', country: 'United States', code: 'US', unicode: 'USLAX', portName: 'LA Terminal' },
                                'Long Beach': { city: 'Long Beach', country: 'United States', code: 'US', unicode: 'USLGB', portName: 'LB Terminal' },
                                'New York': { city: 'New York', country: 'United States', code: 'US', unicode: 'USNYC', portName: 'NY Terminal' },
                                'Savannah': { city: 'Savannah', country: 'United States', code: 'US', unicode: 'USSAV', portName: 'Savannah Port' },
                                'Vancouver': { city: 'Vancouver', country: 'Canada', code: 'CA', unicode: 'CAVAN', portName: 'Vancouver Port' },
                                'Toronto': { city: 'Toronto', country: 'Canada', code: 'CA', unicode: 'CATOR', portName: 'Toronto Port' },
                                'Tokyo': { city: 'Tokyo', country: 'Japan', code: 'JP', unicode: 'JPTYO', portName: 'Tokyo Port' },
                                'Yokohama': { city: 'Yokohama', country: 'Japan', code: 'JP', unicode: 'JPYOK', portName: 'Yokohama Port' },
                                'Nagoya': { city: 'Nagoya', country: 'Japan', code: 'JP', unicode: 'JPNGO', portName: 'Nagoya Port' },
                                'Osaka': { city: 'Osaka', country: 'Japan', code: 'JP', unicode: 'JPOSA', portName: 'Osaka Port' },
                                'Kobe': { city: 'Kobe', country: 'Japan', code: 'JP', unicode: 'JPUKB', portName: 'Kobe Port' },
                            };
                            
                            // 尝试匹配
                            const lookupKey = Object.keys(cityMap).find(k => name.toLowerCase().includes(k.toLowerCase())) || name.split(' ')[0];
                            const info = cityMap[lookupKey] || { city: name, country: '', code: '', unicode: '' };
                            
                            // 标题大小写转换函数
                            const toTitleCase = (str: string) => {
                              if (!str) return '';
                              return str.toLowerCase().split(' ').map(word => {
                                return word.charAt(0).toUpperCase() + word.slice(1);
                              }).join(' ');
                            };

                            const portName = toTitleCase(info.portName || name);
                            const cityName = toTitleCase(info.city);
                            
                            return { 
                              port: portName, 
                              city: cityName, 
                              country: info.country, 
                              countryCode: info.code,
                              unicode: info.unicode || info.code
                            };
                        };

                        const polInfo = getPortInfo(item.pol || item.departurePort);
                        const podInfo = getPortInfo(item.pod || item.dischargePort);
                        
                        return (
                          <div className="w-full flex flex-col items-center">
                            {/* 同一行：4个ETD/ETA卡片 + 航程 */}
                            <div className="w-full relative mb-3" style={{ height: '50px' }}>
                                {/* ETD above Receipt (3% position) */}
                                <div className="absolute left-[3%] transform -translate-x-1/2 flex flex-col items-center bg-blue-50 px-3 py-1.5 rounded border border-blue-100" style={{ minWidth: '70px', whiteSpace: 'nowrap' }}>
                                  <span className="text-xs text-blue-600 mb-0.5">ETD</span>
                                  <span className="font-bold text-base text-blue-700 whitespace-nowrap">{item.etd?.substring(5)}</span>
                                </div>
                                
                                {/* ETD above POL (28% position) */}
                                <div className="absolute left-[28%] transform -translate-x-1/2 flex flex-col items-center bg-blue-50 px-3 py-1.5 rounded border border-blue-100" style={{ minWidth: '70px', whiteSpace: 'nowrap' }}>
                                  <span className="text-xs text-blue-600 mb-0.5">ETD</span>
                                  <span className="font-bold text-base text-blue-700 whitespace-nowrap">{item.etd?.substring(5)}</span>
                                </div>
                                
                                {/* 航程 - 居中 */}
                                <div className="absolute left-1/2 transform -translate-x-1/2 flex flex-col items-center">
                                  <span className="text-gray-500 text-xs mb-0.5">航程</span>
                                  <span className="font-bold text-base text-gray-700">{item.transitTime} 天</span>
                                </div>
                                
                                {/* ETA above POD (72% position) */}
                                <div className="absolute left-[72%] transform -translate-x-1/2 flex flex-col items-center bg-blue-50 px-3 py-1.5 rounded border border-blue-100" style={{ minWidth: '70px', whiteSpace: 'nowrap' }}>
                                  <span className="text-xs text-blue-600 mb-0.5">ETA</span>
                                  <span className="font-bold text-base text-blue-700 whitespace-nowrap">{item.eta?.substring(5)}</span>
                                </div>
                                
                                {/* ETA above Delivery (97% position) */}
                                <div className="absolute left-[97%] transform -translate-x-1/2 flex flex-col items-center bg-blue-50 px-3 py-1.5 rounded border border-blue-100" style={{ minWidth: '70px', whiteSpace: 'nowrap' }}>
                                  <span className="text-xs text-blue-600 mb-0.5">ETA</span>
                                  <span className="font-bold text-base text-blue-700 whitespace-nowrap">{item.eta?.substring(5)}</span>
                                </div>
                            </div>

                            {/* Timeline Graphic */}
                            <div className="relative w-full h-8 mb-2 flex items-center justify-center">
                                {/* Base Line */}
                                <div className="absolute w-[94%] h-[1px] bg-gray-300 top-1/2 transform -translate-y-1/2 z-0"></div>

                                {/* Node 1: Receipt (City Icon) */}
                                <div className="absolute left-[3%] top-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10 bg-white p-0.5">
                                    <Tooltip content={`${polInfo.city}, ${polInfo.country} (${polInfo.countryCode})`}>
                                        <div className="flex items-center justify-center w-6 h-6 rounded-full border border-green-300 bg-white text-green-500 cursor-pointer hover:scale-125 transition-transform">
                                            <CitySvg />
                                        </div>
                                    </Tooltip>
                                </div>
                                
                                {/* Node 2: POL (Anchor Icon) */}
                                <div className="absolute left-[28%] top-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10 bg-white p-0.5">
                                    <Tooltip content={`${polInfo.city} (${polInfo.unicode})`}>
                                        <div className="flex items-center justify-center w-6 h-6 rounded-full border border-green-500 bg-white text-green-600 cursor-pointer hover:scale-125 transition-transform">
                                            <AnchorSvg />
                                        </div>
                                    </Tooltip>
                                </div>

                                {/* Center Button */}
                                <div className="absolute left-1/2 transform -translate-x-1/2 top-1/2 -translate-y-1/2 z-20 bg-white px-2">
                                    <Button 
                                      size="mini"
                                      className={`px-3 py-0 h-6 text-xs rounded-full border shadow-sm hover:shadow-md transition-shadow ${item.transitType === '直达' ? 'text-green-600 border-green-200 bg-green-50' : 'text-orange-600 border-orange-200 bg-orange-50'}`}
                                      onClick={(e) => {
                                          e.stopPropagation();
                                          setCurrentRateDetail(item);
                                          setRateDetailInitialTab('schedule');
                                          setRateDetailModalVisible(true);
                                      }}
                                    >
                                      {item.transitType}
                                    </Button>
                                </div>

                                {/* Node 3: POD (Anchor Icon) */}
                                <div className="absolute left-[72%] top-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10 bg-white p-0.5">
                                    <Tooltip content={`${podInfo.city} (${podInfo.unicode})`}>
                                        <div className="flex items-center justify-center w-6 h-6 rounded-full border border-orange-500 bg-white text-orange-600 cursor-pointer hover:scale-125 transition-transform">
                                            <AnchorSvg />
                                        </div>
                                    </Tooltip>
                                </div>
                                
                                {/* Node 4: Delivery (City Icon) */}
                                <div className="absolute left-[97%] top-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10 bg-white p-0.5">
                                    <Tooltip content={`${podInfo.city}, ${podInfo.country} (${podInfo.countryCode})`}>
                                        <div className="flex items-center justify-center w-6 h-6 rounded-full border border-orange-300 bg-white text-orange-500 cursor-pointer hover:scale-125 transition-transform">
                                            <CitySvg />
                                        </div>
                                    </Tooltip>
                                </div>
                            </div>
                            
                            {/* Bottom Text: Port/City Names */}
                            <div className="w-full relative h-6 text-xs text-gray-600">
                                {/* Node 1 Text: Receipt */}
                                <div className="absolute left-[3%] w-[20%] text-center transform -translate-x-1/2 truncate text-base text-gray-800" title={polInfo.city}>
                                    {polInfo.city}
                                </div>
                                
                                {/* Node 2 Text: POL */}
                                <div className="absolute left-[28%] w-[20%] text-center transform -translate-x-1/2 truncate text-base text-gray-800" title={polInfo.city}>
                                    {polInfo.city}
                                </div>

                                {/* Node 3 Text: POD */}
                                <div className="absolute left-[72%] w-[20%] text-center transform -translate-x-1/2 truncate text-base text-gray-800" title={podInfo.city}>
                                    {podInfo.city}
                                </div>
                                
                                {/* Node 4 Text: Delivery */}
                                <div className="absolute left-[97%] w-[20%] text-center transform -translate-x-1/2 truncate text-base text-gray-800" title={podInfo.city}>
                                    {podInfo.city}
                                </div>
                            </div>
                          </div>
                        );
                    })()}
                 </div>
                 
                 {/* Container Prices Grid with Base/Total Labels */}
                  <div className="flex-1 flex items-start justify-center space-x-2 px-4">
                     {/* Base/Total Labels Column */}
                     <div className="flex flex-col justify-center space-y-2 pt-6">
                        {priceDisplayMode.includes('base') && (
                          <div className="text-xs font-medium text-red-600 h-7 flex items-center">Base</div>
                        )}
                        {priceDisplayMode.includes('total') && (
                          <div className="text-xs font-medium text-[#1e3a8a] h-7 flex items-center">Total</div>
                        )}
                     </div>
                     
                     {/* Container Price Cards */}
                     <div className="flex space-x-2">
                       {['20gp', '40gp', '40hc', '45hc'].map(type => {
                          // For mock data purposes, ensure we display prices even if not explicitly in data for some items
                          // In real app, this would be handled by data completeness or fallback
                          const basePrice = item[type] || (type === '20gp' ? 1500 : type === '40gp' ? 2800 : type === '40hc' ? 3130 : 3500);
                          // Calculate Total Price (Base + (Total - Base of main type))
                          // Assuming surcharge diff is constant for simplicity in this mock
                          const diff = (item.totalPrice || 0) - (item.basePrice || 0);
                          const totalPrice = basePrice + (diff > 0 ? diff : 0);

                          return (
                            <div key={type} className="flex flex-col items-center justify-center bg-gray-50 rounded px-3 py-2 min-w-[80px]">
                               <span className="text-xs text-gray-500 font-medium mb-1 uppercase">{type.replace('gp', 'GP').replace('hc', 'HC').replace('nor', 'NOR')}</span>
                               {priceDisplayMode.includes('base') && (
                                  <div className="flex items-center space-x-1 h-7">
                                    <span className="text-xs text-gray-500">$</span>
                                    <span className="text-lg font-bold text-red-600">{basePrice}</span>
                                  </div>
                               )}
                               {priceDisplayMode.includes('total') && (
                                  <div className="flex items-center space-x-1 h-7">
                                    <span className="text-xs text-gray-500">$</span>
                                    <span className="text-lg font-bold text-[#1e3a8a]">{totalPrice}</span>
                                  </div>
                               )}
                            </div>
                          );
                       })}
                     </div>
                  </div>

                 {/* Price & Operations (Right Panel) */}
                  <div className="flex flex-col items-end pl-6 border-l border-gray-100 ml-4 min-w-[240px]">
                     <div className="flex items-center justify-end w-full mb-3 h-6">
                        {/* Space Status moved to top left, so nothing here */}
                     </div>
                     
                     <div className="flex items-center justify-end w-full mb-3">
                        {/* Price Trend on the left of prices */}
                        <div className="mr-4">
                             <span 
                               className="text-sm text-green-600 flex items-center bg-green-100 px-3 py-1.5 rounded cursor-pointer hover:bg-green-200 transition-colors font-medium"
                               onClick={() => handleViewRateTrend(item)}
                             >
                                  <span className="mr-1">↗</span> 价格趋势
                             </span>
                        </div>
                        
                        {/* Right side Total/Base labels removed as requested */}
                     </div>
                     
                     <div className="flex space-x-2 w-full justify-end">
                         <Button type="primary" status="success" className="px-4" onClick={() => handleViewRateDetail(item)}>费用明细</Button>
                         <Button type="primary" status="warning" className="px-4" onClick={() => handleQuickQuote(item)}>快速报价</Button>
                         <Button type="primary" style={{ background: 'linear-gradient(to right, #3B82F6, #7C3AED)', border: 'none' }} className="px-4" icon={<IconRobot />} onClick={() => handleSingleRateAnalysis(item)}>AI分析</Button>
                      </div>
                  </div>
              </div>
              
              {/* Footer Info */}
              <div className="mt-4 pt-3 border-t border-dashed border-gray-200 flex justify-between text-xs text-gray-400">
                 <div className="space-x-4">
                    <span>船名/航次: {item.vesselName}/{item.voyageNo}</span>
                    <span className="inline-flex items-center">
                      航线代码: 
                      <PortsOfCallPopover 
                        routeCode={item.routeCode || '-'} 
                        ports={item.portsOfCall || []}
                        triggerElement={
                          <span className="ml-1 text-blue-600 font-bold cursor-pointer hover:underline">{item.routeCode}</span>
                        }
                      />
                    </span>
                 </div>
                 <div className="flex items-center space-x-4">
                    {/* 更新时间已移动到左上角 */}
                 </div>
              </div>
            </Card>
          ))}
        </div>
      );
    }

    return (
      <div className="space-y-4 mt-4">
        {data.map((item, index) => (
          <Card key={item.key || index} className="hover:shadow-lg transition-shadow duration-300 relative min-h-[200px]">
            {/* 左上角Checkbox */}
            <div className="absolute top-3 left-3 z-10">
              <Checkbox
                checked={selectedRowKeys.includes(item.key)}
                onChange={(checked) => handleRowSelect(item.key, checked)}
              />
            </div>
            {/* 运价号、运价类型标签和直达/中转标签 */}
            <div className="absolute top-3 left-12 z-10 flex items-center space-x-2">
              <PortsOfCallPopover 
                routeCode={item.routeCode || '-'} 
                ports={item.portsOfCall || []}
                triggerElement={
                  <span className="text-xs text-blue-600 font-bold cursor-pointer hover:underline">{item.routeCode}</span>
                }
              />
              <div className={`px-2 py-1 text-xs text-white font-medium rounded ${
                item.rateType === '合约价' ? 'bg-blue-500' : 'bg-orange-500'
              }`}>
                {item.rateType || '电商价'}
              </div>
              <Tooltip 
                content={
                  item.transitType === '中转' && item.transitPort ? (
                    <div>
                      <div>中转港1：{item.transitPort.split('|')[0] || item.transitPort}</div>
                      {/* 如果有多个中转港，可以在这里添加 */}
                      {/* <div>中转港2：XXXX</div> */}
                    </div>
                  ) : null
                }
                mini
                disabled={item.transitType === '直达'}
              >
                <div className={`px-2 py-1 text-xs font-medium rounded border cursor-pointer ${
                  item.transitType === '直达' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-yellow-50 text-yellow-700 border-yellow-200'
                }`}>
                  {item.transitType || '直达'}
                </div>
              </Tooltip>
            </div>
            {/* 右上角：舱位状态和价格趋势标签 */}
            <div className="absolute top-3 right-3 z-10 flex flex-row space-x-1">
              {item.spaceStatus && (
                <span className="text-xs px-2 py-1 bg-green-100 text-green-600 rounded text-center">
                  {item.spaceStatus}
                </span>
              )}
              {item.priceStatus && (
                <span 
                  className="text-xs px-2 py-1 bg-blue-100 text-blue-600 rounded text-center cursor-pointer hover:bg-blue-200 transition-colors"
                  onClick={() => handleViewRateTrend(item)}
                >
                  {item.priceStatus}
                </span>
              )}
            </div>
            <div className="flex items-center justify-between p-4 pl-12 mt-2">
              {/* 最左侧：船公司信息 */}
              <div className="flex flex-col items-center space-y-1 w-16">
                <div className="w-8 h-8 flex items-center justify-center bg-gray-100 rounded">
                  <img
                    src="/assets/carrier/MSK.png"
                    alt={item.shipCompany}
                    className="w-6 h-6 object-contain"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                      target.nextElementSibling!.textContent = item.shipCompany?.substring(0, 2) || 'SC';
                    }}
                  />
                  <span className="text-xs font-medium text-gray-600 hidden">{item.shipCompany?.substring(0, 2) || 'SC'}</span>
                </div>
                <div>
                  <div className="text-xs font-medium text-gray-700 text-center">{item.shipCompany}</div>
                </div>
              </div>
              
              {/* 中间：港口信息 */}
              <div className="flex-1 mx-2">
                <div className="flex items-center justify-center text-sm text-gray-600">
                  <span className="flex-shrink-0 text-xs">{item.departurePort?.split('|')[0] || item.departurePort}</span>
                  <div className="mx-1 relative">
                    <div className="flex items-center justify-center">
                      <div className="w-6 h-0.5 bg-gray-300"></div>
                      <div className="mx-1 text-xs text-gray-500 bg-white px-1 py-0.5 rounded border border-gray-200">
                        {item.transitTime || item.transitDays || '15'}天
                      </div>
                      <div className="w-6 h-0.5 bg-gray-300"></div>
                    </div>
                    <div className="absolute right-0 top-1/2 transform -translate-y-1/2">
                      <div className="w-0 h-0 border-l-3 border-l-gray-400 border-t-1.5 border-t-transparent border-b-1.5 border-b-transparent"></div>
                    </div>
                  </div>
                  <span className="flex-shrink-0 text-xs">{item.dischargePort?.split('|')[0] || item.dischargePort}</span>
                </div>
              </div>
              
              {/* 船期信息 */}
              <div 
                className="flex-shrink-0 mx-2 cursor-pointer hover:bg-blue-100 transition-colors rounded-lg"
                onClick={() => {
                  setCurrentRateDetail(item);
                  setRateDetailInitialTab('schedule');
                  setRateDetailModalVisible(true);
                }}
              >
                <div className="text-center bg-blue-50 p-2 rounded-lg border border-blue-200">
                  <div className="text-xs text-gray-500 mb-1">船期</div>
                  <div className="text-sm font-medium text-blue-600">
                    {item.vesselSchedule || item.etd || '待定'}
                  </div>
                </div>
              </div>
              
              {/* 右侧：价格信息 */}
              <div className="flex items-center space-x-6 flex-1 justify-center">
                {/* 根据选择的箱型筛选显示价格 */}
                {(selectedContainerTypes.length === 0 || selectedContainerTypes.includes('20GP')) && item['20gp'] && (
                  <div className="text-center bg-gray-50 p-3 rounded-lg">
                    <div className="text-sm text-gray-500 mb-1">20GP</div>
                    <div className="text-xl font-bold text-red-600">${item['20gp']}</div>
                  </div>
                )}
                {(selectedContainerTypes.length === 0 || selectedContainerTypes.includes('40GP')) && item['40gp'] && (
                  <div className="text-center bg-gray-50 p-3 rounded-lg">
                    <div className="text-sm text-gray-500 mb-1">40GP</div>
                    <div className="text-xl font-bold text-red-600">${item['40gp']}</div>
                  </div>
                )}
                {(selectedContainerTypes.length === 0 || selectedContainerTypes.includes('40HC')) && item['40hc'] && (
                  <div className="text-center bg-gray-50 p-3 rounded-lg">
                    <div className="text-sm text-gray-500 mb-1">40HC</div>
                    <div className="text-xl font-bold text-red-600">${item['40hc']}</div>
                  </div>
                )}
                {(selectedContainerTypes.length === 0 || selectedContainerTypes.includes('45HC')) && item['45hc'] && (
                  <div className="text-center bg-gray-50 p-3 rounded-lg">
                    <div className="text-sm text-gray-500 mb-1">45HC</div>
                    <div className="text-xl font-bold text-red-600">${item['45hc']}</div>
                  </div>
                )}
                {(selectedContainerTypes.length === 0 || selectedContainerTypes.includes('20NOR')) && item['20nor'] && (
                  <div className="text-center bg-gray-50 p-3 rounded-lg">
                    <div className="text-sm text-gray-500 mb-1">20NOR</div>
                    <div className="text-xl font-bold text-red-600">${item['20nor']}</div>
                  </div>
                )}
                {(selectedContainerTypes.length === 0 || selectedContainerTypes.includes('40NOR')) && item['40nor'] && (
                  <div className="text-center bg-gray-50 p-3 rounded-lg">
                    <div className="text-sm text-gray-500 mb-1">40NOR</div>
                    <div className="text-xl font-bold text-red-600">${item['40nor']}</div>
                  </div>
                )}
              </div>
              
              {/* 右侧：操作按钮 */}
              <div className="flex flex-col items-end space-y-1 w-24">
                <div className="flex items-center space-x-1">
                  <Button 
                    type="outline" 
                    size="mini"
                    style={{ borderColor: '#1890ff', color: '#1890ff' }}
                    onClick={() => handleViewRateDetail(item.key)}
                  >
                    查看详情
                  </Button>
                </div>
                <div className="flex items-center space-x-1">
                  <Button 
                    type="outline" 
                    size="mini"
                    style={{ borderColor: '#722ED1', color: '#722ED1' }}
                    onClick={() => handleSingleRateAnalysis(item)}
                  >
                    AI分析
                  </Button>
                </div>
                <div className="flex items-center space-x-1">
                  <Button 
                    type="primary" 
                    size="mini"
                    onClick={() => handleBookingNow(item.key)}
                  >
                    立即订舱
                  </Button>
                </div>
              </div>
            </div>
            {/* 详细信息 - 始终显示 */}
            <div className="px-4 pb-4 pt-2 border-t border-gray-100 bg-gray-50">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <span className="text-gray-500">船名航次:</span>
                  {(item.vesselName && item.voyageNo) ? (
                    <span className="ml-2 text-gray-700">{item.vesselName}/{item.voyageNo}</span>
                  ) : (
                    <Button 
                      type="text" 
                      size="mini" 
                      style={{ color: '#1890ff', padding: '0 4px', marginLeft: '8px' }}
                      onClick={handleViewAvailableSailings}
                    >
                      查看可用船期
                    </Button>
                  )}
                </div>
                <div>
                  <span className="text-gray-500">航线代码:</span>
                  <PortsOfCallPopover 
                    routeCode={item.routeCode || 'AE7'} 
                    ports={item.portsOfCall || []}
                    triggerElement={
                      <span className="ml-2 text-blue-600 font-bold cursor-pointer hover:underline">{item.routeCode || 'AE7'}</span>
                    }
                  />
                </div>
                <div>
                  <span className="text-gray-500">免用箱:</span>
                  <span className="ml-2 text-gray-700">{item.freeDemurrage || '7天'}</span>
                </div>
                <div>
                  <span className="text-gray-500">免堆存:</span>
                  <span className="ml-2 text-gray-700">{item.freeStorage || '5天'}</span>
                </div>
                <div>
                  <span className="text-gray-500">有效期:</span>
                  <span className="ml-2 text-gray-700">
                    {item.validPeriod ? `${item.validPeriod.split(' ')[0]} - ${item.validPeriod.split(' ')[2] || item.validPeriod.split(' ')[0]}` : '暂无'}
                  </span>
                </div>
                <div>
                  <span className="text-gray-500">备注:</span>
                  <span 
                    className="ml-2 text-gray-700 cursor-help" 
                    title={item.remarks || '暂无备注'}
                  >
                    {item.remarks ? (item.remarks.length > 20 ? `${item.remarks.substring(0, 20)}...` : item.remarks) : '暂无'}
                  </span>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    );
  };

  // useEffect 初始化字段顺序
  useEffect(() => {
    const allColumns = Object.keys(columnVisibility);
    setColumnOrder(allColumns);
    
    const filterFields = getFilterFieldsByTab(activeTab);
    const filterFieldKeys = filterFields.map(f => f.key);
    setFilterFieldOrder(filterFieldKeys);
  }, [activeTab]);

  // useEffect 初始化筛选条件
  useEffect(() => {
    const defaultConditions = initializeDefaultConditions(activeTab);
    setFilterConditions(defaultConditions);
    
    const defaultScheme = initializeDefaultScheme(activeTab);
    setFilterSchemes([defaultScheme]);
  }, [activeTab]);

  // 初始化方案数据
  useEffect(() => {
    const defaultScheme: SchemeData = {
      id: 'default',
      name: '系统默认方案',
      isDefault: true,
      createTime: new Date().toISOString(),
      conditions: []
    };
    
    const customScheme1: SchemeData = {
      id: 'custom1',
      name: '常用查询',
      isDefault: false,
      createTime: new Date(Date.now() - 86400000).toISOString(),
      conditions: []
    };
    
    const customScheme2: SchemeData = {
      id: 'custom2',
      name: '欧线查询',
      isDefault: false,
      createTime: new Date(Date.now() - 172800000).toISOString(),
      conditions: []
    };
    
    setAllSchemes([defaultScheme, customScheme1, customScheme2]);
  }, []);

  // 方案管理相关函数
  const openSchemeManagementModal = () => {
    setSchemeManagementModalVisible(true);
  };

  const closeSchemeManagementModal = () => {
    setSchemeManagementModalVisible(false);
  };

  const handleDeleteScheme = (id: string) => {
    setAllSchemes(prev => prev.filter(scheme => scheme.id !== id));
    // 如果删除的是当前选中的方案，切换到默认方案
    if (currentSchemeId === id) {
      setCurrentSchemeId('default');
    }
  };

  const handleSetDefaultScheme = (id: string) => {
    setAllSchemes(prev => 
      prev.map(scheme => ({
        ...scheme,
        isDefault: scheme.id === id
      }))
    );
    setCurrentSchemeId(id);
  };

  const handleRenameScheme = (id: string, newName: string) => {
    setAllSchemes(prev => 
      prev.map(scheme => 
        scheme.id === id ? { ...scheme, name: newName } : scheme
      )
    );
  };

  // 切换筛选区收起/展开

  // 打开自定义表格弹窗
  const openCustomTableModal = () => {
    setCustomTableModalVisible(true);
  };

  // 关闭自定义表格弹窗
  const closeCustomTableModal = () => {
    setCustomTableModalVisible(false);
  };

  // 处理表格列可见性变更
  const handleColumnVisibilityChange = (column: string, visible: boolean) => {
    setColumnVisibility({
      ...columnVisibility,
      [column]: visible
    });
  };

  // 重置表格列可见性
  const resetColumnVisibility = () => {
    setColumnVisibility({
      routeCode: true,
      rateType: true,
      departurePort: true,
      dischargePort: true,
      transitPort: true,
      transitType: true,
      shipCompany: true,
      contractNo: false,
      spaceStatus: true,
      priceStatus: true,
      cargoType: false,
      rateStatus: true,
      '20gp': true,
      '40gp': true,
      '40hc': true,
      '20nor': false,
      '40nor': false,
      '45hc': true,
      '20hc': false,
      '20tk': false,
      '40tk': false,
      '20ot': false,
      '40ot': false,
      '20fr': false,
      '40fr': false,
      vesselSchedule: true,
      voyage: false,
      freeContainerDays: true,
      freeStorageDays: true,
      chargeSpecialNote: false,
      nac: false,
      overweightNote: false,
      notes: false,
      validPeriod: true,
      etd: false,
      eta: false,
      vesselName: false,
      voyageNo: false,
      entryPerson: false,
      createDate: false,
      rateModifier: false,
      modifyDate: false
    });
  };

  // 应用表格列设置
  const applyColumnSettings = () => {
    // 这里可以添加保存设置的逻辑
    Message.success('表格设置已应用');
    closeCustomTableModal();
  };

  // 处理Tab切换
  const handleTabChange = (key: string) => {
    setActiveTab(key);
  };

  // 处理视图模式切换
  const handleViewModeChange = (checked: boolean) => {
    setViewMode(checked ? 'card' : 'list');
  };

  // 打开组合方案查询页面
  const openCombinationQuery = () => {
    navigate('/controltower/saas/combination-rate-query');
  };





  // FCL列定义
  const fclColumns = [
    {
      title: (
        <Checkbox
          checked={selectAll}
          indeterminate={indeterminate}
          onChange={handleSelectAll}
        />
      ),
      dataIndex: 'selection',
      width: 60,
      fixed: 'left' as const,
      render: (_: any, record: DataItem) => (
        <Checkbox
          checked={selectedRowKeys.includes(record.key)}
          onChange={(checked) => handleRowSelect(record.key, checked)}
        />
      ),
    },
    {
      title: '运价号',
      dataIndex: 'routeCode',
      width: 180,
      render: (value: string) => <Tooltip content={value} mini><span className="no-ellipsis">{value}</span></Tooltip>,
      sorter: true,
      resizable: true,
    },
    {
      title: '运价类型',
      dataIndex: 'rateType',
      width: 140,
      render: (value: string) => <Tooltip content={value} mini><span className="no-ellipsis">{value}</span></Tooltip>,
      sorter: true,
      resizable: true,
    },
    {
      title: '起运港',
      dataIndex: 'departurePort',
      width: 180,
      render: (value: string) => {
        const [code, name] = value.split('|');
        return (
          <Tooltip content={value} mini>
            <div className="text-left">
              <div className="text-xs font-mono">{code}</div>
              <div className="text-xs text-gray-600">{name}</div>
            </div>
          </Tooltip>
        );
      },
      sorter: true,
      resizable: true,
    },
    {
      title: '目的港',
      dataIndex: 'dischargePort',
      width: 200,
      render: (value: string) => {
        const [code, name] = value.split('|');
        return (
          <Tooltip content={value} mini>
            <div className="text-left">
              <div className="text-xs font-mono">{code}</div>
              <div className="text-xs text-gray-600">{name}</div>
            </div>
          </Tooltip>
        );
      },
      sorter: true,
      resizable: true,
    },
    {
      title: '中转港',
      dataIndex: 'transitPort',
      width: 180,
      render: (value: string) => {
        const [code, name] = value.split('|');
        return (
          <Tooltip content={value} mini>
            <div className="text-left">
              <div className="text-xs font-mono">{code}</div>
              <div className="text-xs text-gray-600">{name}</div>
            </div>
          </Tooltip>
        );
      },
      sorter: true,
      resizable: true,
    },
    {
      title: '中转类型',
      dataIndex: 'transitType',
      width: 120,
      render: (value: string) => <Tooltip content={value} mini><span className="no-ellipsis">{value}</span></Tooltip>,
      sorter: true,
      resizable: true,
    },
    {
      title: '船公司',
      dataIndex: 'shipCompany',
      width: 220,
      render: (value: string) => <Tooltip content={value} mini><span className="no-ellipsis">{value}</span></Tooltip>,
      sorter: true,
      resizable: true,
    },
    {
      title: '约号',
      dataIndex: 'contractNo',
      width: 160,
      render: (value: string) => <Tooltip content={value} mini><span className="no-ellipsis">{value}</span></Tooltip>,
      sorter: true,
      resizable: true,
    },
    {
      title: '舱位状态',
      dataIndex: 'spaceStatus',
      width: 120,
      render: (value: string) => {
        const colorMap: Record<string, string> = {
          '畅接': 'green',
          '正常': 'blue', 
          '单票申请': 'orange',
          '爆舱': 'red',
          '不接': 'gray'
        };
        return (
          <Tooltip content={value} mini>
            <Tag color={colorMap[value] || 'blue'} size="small">
              {value}
            </Tag>
          </Tooltip>
        );
      },
      sorter: true,
      resizable: true,
    },
    {
      title: '价格趋势',
      dataIndex: 'priceStatus',
      width: 120,
      render: (value: string) => (
        <Tooltip content={value} mini>
          <Tag color={value === '价格上涨' ? 'red' : value === '价格下调' ? 'green' : 'blue'} size="small">
            {value}
          </Tag>
        </Tooltip>
      ),
      sorter: true,
      resizable: true,
    },
    {
      title: '货物类型',
      dataIndex: 'cargoType',
      width: 120,
      render: (value: string) => <Tooltip content={value} mini><span className="no-ellipsis">{value}</span></Tooltip>,
      sorter: true,
      resizable: true,
    },
    // 运价状态列 - 仅在运营版显示
    ...(isClientAccess ? [] : [{
      title: '运价状态',
      dataIndex: 'rateStatus',
      width: 120,
      render: (value: string) => {
        const colorMap: Record<string, string> = {
          '正常': 'green',
          '过期': 'red'
        };
        return (
          <Tooltip content={value} mini>
            <Tag color={colorMap[value] || 'blue'} size="small">
              {value}
            </Tag>
          </Tooltip>
        );
      },
      sorter: true,
      resizable: true,
    }]),
    {
      title: "20GP",
      dataIndex: '20gp',
      width: 100,
      render: (value: number) => <Tooltip content={value.toString()} mini><span className="no-ellipsis">{value}</span></Tooltip>,
      sorter: true,
      resizable: true,
    },
    {
      title: "40GP",
      dataIndex: '40gp',
      width: 100,
      render: (value: number) => <Tooltip content={value.toString()} mini><span className="no-ellipsis">{value}</span></Tooltip>,
      sorter: true,
      resizable: true,
    },
    {
      title: "40HC",
      dataIndex: '40hc',
      width: 100,
      render: (value: number) => <Tooltip content={value.toString()} mini><span className="no-ellipsis">{value}</span></Tooltip>,
      sorter: true,
      resizable: true,
    },
    {
      title: "20NOR",
      dataIndex: '20nor',
      width: 100,
      render: (value: number) => <Tooltip content={value.toString()} mini><span className="no-ellipsis">{value}</span></Tooltip>,
      sorter: true,
      resizable: true,
    },
    {
      title: "40NOR",
      dataIndex: '40nor',
      width: 100,
      render: (value: number) => <Tooltip content={value.toString()} mini><span className="no-ellipsis">{value}</span></Tooltip>,
      sorter: true,
      resizable: true,
    },
    {
      title: "45HC",
      dataIndex: '45hc',
      width: 100,
      render: (value: number) => <Tooltip content={value.toString()} mini><span className="no-ellipsis">{value}</span></Tooltip>,
      sorter: true,
      resizable: true,
    },
    {
      title: "20HC",
      dataIndex: '20hc',
      width: 100,
      render: (value: number) => <Tooltip content={value.toString()} mini><span className="no-ellipsis">{value}</span></Tooltip>,
      sorter: true,
      resizable: true,
    },
    {
      title: "20TK",
      dataIndex: '20tk',
      width: 100,
      render: (value: number) => <Tooltip content={value.toString()} mini><span className="no-ellipsis">{value}</span></Tooltip>,
      sorter: true,
      resizable: true,
    },
    {
      title: "40TK",
      dataIndex: '40tk',
      width: 100,
      render: (value: number) => <Tooltip content={value.toString()} mini><span className="no-ellipsis">{value}</span></Tooltip>,
      sorter: true,
      resizable: true,
    },
    {
      title: "20OT",
      dataIndex: '20ot',
      width: 100,
      render: (value: number) => <Tooltip content={value.toString()} mini><span className="no-ellipsis">{value}</span></Tooltip>,
      sorter: true,
      resizable: true,
    },
    {
      title: "40OT",
      dataIndex: '40ot',
      width: 100,
      render: (value: number) => <Tooltip content={value.toString()} mini><span className="no-ellipsis">{value}</span></Tooltip>,
      sorter: true,
      resizable: true,
    },
    {
      title: "20FR",
      dataIndex: '20fr',
      width: 100,
      render: (value: number) => <Tooltip content={value.toString()} mini><span className="no-ellipsis">{value}</span></Tooltip>,
      sorter: true,
      resizable: true,
    },
    {
      title: "40FR",
      dataIndex: '40fr',
      width: 100,
      render: (value: number) => <Tooltip content={value.toString()} mini><span className="no-ellipsis">{value}</span></Tooltip>,
      sorter: true,
      resizable: true,
    },
    {
      title: '船期',
      dataIndex: 'vesselSchedule',
      width: 120,
      render: (value: string) => <Tooltip content={value} mini><span className="no-ellipsis">{value}</span></Tooltip>,
      sorter: true,
      resizable: true,
    },
    {
      title: '航程',
      dataIndex: 'voyage',
      width: 100,
      render: (value: string) => <Tooltip content={value} mini><span className="no-ellipsis">{value}</span></Tooltip>,
      sorter: true,
      resizable: true,
    },
    {
      title: '免用箱',
      dataIndex: 'freeContainerDays',
      width: 120,
      render: (value: number) => <Tooltip content={`${value}天`} mini><span className="no-ellipsis">{value}天</span></Tooltip>,
      sorter: true,
      resizable: true,
    },
    {
      title: '免堆存',
      dataIndex: 'freeStorageDays',
      width: 120,
      render: (value: number) => <Tooltip content={`${value}天`} mini><span className="no-ellipsis">{value}天</span></Tooltip>,
      sorter: true,
      resizable: true,
    },
    {
      title: '接货特殊说明',
      dataIndex: 'chargeSpecialNote',
      width: 200,
      render: (value: string) => <Tooltip content={value} mini><span className="no-ellipsis">{value}</span></Tooltip>,
      sorter: true,
      resizable: true,
    },
    {
      title: 'NAC',
      dataIndex: 'nac',
      width: 120,
      render: (value: string) => <Tooltip content={value} mini><span className="no-ellipsis">{value}</span></Tooltip>,
      sorter: true,
      resizable: true,
    },
    {
      title: '超重说明',
      dataIndex: 'overweightNote',
      width: 140,
      render: (value: string) => <Tooltip content={value} mini><span className="no-ellipsis">{value}</span></Tooltip>,
      sorter: true,
      resizable: true,
    },
    {
      title: '备注',
      dataIndex: 'notes',
      width: 180,
      render: (value: string) => <Tooltip content={value} mini><span className="no-ellipsis">{value}</span></Tooltip>,
      sorter: true,
      resizable: true,
    },
    {
      title: '有效期',
      dataIndex: 'validPeriod',
      width: 240,
      render: (value: string) => <Tooltip content={value} mini><span className="no-ellipsis">{value}</span></Tooltip>,
      sorter: true,
      resizable: true,
    },
    {
      title: 'ETD',
      dataIndex: 'etd',
      width: 120,
      render: (value: string) => <Tooltip content={value} mini><span className="no-ellipsis">{value}</span></Tooltip>,
      sorter: true,
      resizable: true,
    },
    {
      title: 'ETA',
      dataIndex: 'eta',
      width: 120,
      render: (value: string) => <Tooltip content={value} mini><span className="no-ellipsis">{value}</span></Tooltip>,
      sorter: true,
      resizable: true,
    },
    {
      title: '船名',
      dataIndex: 'vesselName',
      width: 200,
      render: (value: string) => <Tooltip content={value} mini><span className="no-ellipsis">{value}</span></Tooltip>,
      sorter: true,
      resizable: true,
    },
    {
      title: '航次',
      dataIndex: 'voyageNo',
      width: 120,
      render: (value: string) => <Tooltip content={value} mini><span className="no-ellipsis">{value}</span></Tooltip>,
      sorter: true,
      resizable: true,
    },
    {
      title: '创建人',
      dataIndex: 'entryPerson',
      width: 120,
      render: (value: string) => <Tooltip content={value} mini><span className="no-ellipsis">{value}</span></Tooltip>,
      sorter: true,
      resizable: true,
    },
    {
      title: '创建日期',
      dataIndex: 'createDate',
      width: 120,
      render: (value: string) => <Tooltip content={value} mini><span className="no-ellipsis">{value}</span></Tooltip>,
      sorter: true,
      resizable: true,
    },
    {
      title: '运价修改人',
      dataIndex: 'rateModifier',
      width: 160,
      render: (value: string) => <Tooltip content={value} mini><span className="no-ellipsis">{value}</span></Tooltip>,
      sorter: true,
      resizable: true,
    },
    {
      title: '修改日期',
      dataIndex: 'modifyDate',
      width: 120,
      render: (value: string) => <Tooltip content={value} mini><span className="no-ellipsis">{value}</span></Tooltip>,
      sorter: true,
      resizable: true,
    },
    {
      title: '操作',
      dataIndex: 'operations',
      fixed: 'right' as const,
      width: 280,
      className: 'action-column',
      render: (_: any, record: DataItem) => (
        <Space>
          <Button type="text" size="mini" onClick={() => handleViewFclRate(record.key)}>
            详情
          </Button>
          <Button type="text" size="mini" onClick={() => handleSingleRateAnalysis(record)}>
            AI分析
          </Button>
          <Button type="text" size="mini" onClick={handleViewAvailableSailings}>
            可用船期
          </Button>
          <Button type="text" size="mini" onClick={() => handleViewRateTrend()}>
            运价趋势
          </Button>
        </Space>
      ),
    },
  ];

  // FCL数据
  const fclData: DataItem[] = Array(12).fill(null).map((_, index) => {
    const random20gp = [-30, 510, 560, 865, 1130, 530].sort(() => Math.random() - 0.5)[0];
    const random40gp = random20gp === -30 ? -60 : random20gp === 510 ? 1020 : random20gp === 560 ? 1120 : random20gp === 865 ? 1730 : random20gp === 1130 ? 2260 : 1060;

    const vesselNames = ['MEDKON QUO', 'SITC PENANG', 'SITC YOKOHAMA', 'SITC XINCHENG'];
    const departurePorts = [
      { code: 'CNSHA', fullName: 'SHANGHAI', name: '上海' },
      { code: 'CNNGB', fullName: 'NINGBO', name: '宁波' },
      { code: 'CNQIN', fullName: 'QINGDAO', name: '青岛' },
      { code: 'CNYTN', fullName: 'YANTAI', name: '烟台' }
    ];
    const dischargePorts = [
      { code: 'USLAX', fullName: 'LOS ANGELES', name: '洛杉矶' },
      { code: 'USNYC', fullName: 'NEW YORK', name: '纽约' },
      { code: 'USLGB', fullName: 'LONG BEACH', name: '长滩' },
      { code: 'USOAK', fullName: 'OAKLAND', name: '奥克兰' },
      { code: 'PHMNL', fullName: 'MANILA', name: '马尼拉' },
      { code: 'SGSIN', fullName: 'SINGAPORE', name: '新加坡' }
    ];
    const transitPorts = [
      { code: 'SGSIN', fullName: 'SINGAPORE', name: '新加坡' },
      { code: 'HKHKG', fullName: 'HONG KONG', name: '香港' },
      { code: 'KRPUS', fullName: 'PUSAN', name: '釜山' }
    ];
    
    const selectedDeparturePort = departurePorts[Math.floor(Math.random() * departurePorts.length)];
    const selectedDischargePort = dischargePorts[Math.floor(Math.random() * dischargePorts.length)];
    const selectedTransitPort = transitPorts[Math.floor(Math.random() * transitPorts.length)];
    
    return {
      key: `${index}`,
      routeCode: `FCL${2024}${String(index + 1).padStart(4, '0')}`,
      departurePort: `${selectedDeparturePort.fullName} (${selectedDeparturePort.code})|${selectedDeparturePort.name}`,
      dischargePort: `${selectedDischargePort.fullName} (${selectedDischargePort.code})|${selectedDischargePort.name}`,
      transitPort: `${selectedTransitPort.fullName} (${selectedTransitPort.code})|${selectedTransitPort.name}`,
      spaceStatus: ['畅接', '正常', '单票申请', '爆舱', '不接'][Math.floor(Math.random() * 5)],
      priceStatus: ['价格稳定', '价格上涨', '价格下调'][Math.floor(Math.random() * 3)],
      containerType: ['普通箱', '冷冻箱', '开顶箱'][Math.floor(Math.random() * 3)],
      rateStatus: isClientAccess ? '正常' : ['正常', '过期'][Math.floor(Math.random() * 2)],
      '20gp': random20gp,
      '40gp': random40gp,
      '40hc': random40gp + 50,
      '40nor': random40gp - 20,
      '20nor': random20gp - 10,
      '20hc': random20gp + 20,
      '20tk': random20gp + 30,
      '40tk': random40gp + 40,
      '20ot': random20gp + 50,
      '40ot': random40gp + 60,
      '20fr': random20gp + 70,
      '40fr': random40gp + 80,
      '45hc': random40gp + 100,
      shipCompany: ['MSK-马士基', 'SITC-海丰国际', 'COSCO-中远海运', 'ONE-海洋网联', 'EMC-长荣海运'][Math.floor(Math.random() * 5)],
      contractNo: Math.random() > 0.3 ? ['CONTRACT001', 'CONTRACT002', 'CONTRACT003', 'SPOT'][Math.floor(Math.random() * 4)] : '',
      vesselSchedule: (() => {
        const days = ['周一', '周二', '周三', '周四', '周五', '周六', '周日'];
        const numDays = Math.random() > 0.6 ? 2 : 1; // 60%概率显示2个日期，40%概率显示1个日期
        if (numDays === 1) {
          return days[Math.floor(Math.random() * 7)];
        } else {
          const selectedDays = [];
          const firstDay = Math.floor(Math.random() * 7);
          selectedDays.push(days[firstDay]);
          let secondDay;
          do {
            secondDay = Math.floor(Math.random() * 7);
          } while (secondDay === firstDay);
          selectedDays.push(days[secondDay]);
          return selectedDays.sort((a, b) => days.indexOf(a) - days.indexOf(b)).join('、');
        }
      })(),
      voyage: `${4 + Math.floor(Math.random() * 6)}天`,
      cargoType: ['普货', '危险品', '冷冻品', '特种箱', '卷钢', '液体', '化工品', '纺织品'][Math.floor(Math.random() * 8)],
      freeContainerDays: 5 + Math.floor(Math.random() * 8),
      freeStorageDays: 7 + Math.floor(Math.random() * 8),
      chargeSpecialNote: '需提前预约',
      nac: Math.random() > 0.4 ? ['NAC01', 'NAC02', 'NAC03'][Math.floor(Math.random() * 3)] : '',
      overweightNote: '超重另计',
      notes: 'LSE已含',
      validPeriod: '2024-05-01 至 2024-12-31',
      branch: '上海分公司',
      entryPerson: '张三',
      createDate: '2024-05-15',
      rateModifier: '李四',
      modifyDate: '2024-05-16',
      rateType: ['合约价', 'SPOT电商'][Math.floor(Math.random() * 2)],
      vesselName: Math.random() > 0.3 ? vesselNames[Math.floor(Math.random() * vesselNames.length)] : '',
      voyageNo: Math.random() > 0.3 ? `25${10 + Math.floor(Math.random() * 9)}S` : '',
      etd: Math.random() > 0.3 ? `05-${15 + Math.floor(Math.random() * 4)}` : '',
      eta: Math.random() > 0.3 ? `06-${1 + Math.floor(Math.random() * 10)}` : '',
      
      // 根据截图补充的字段
      transitType: Math.random() > 0.5 ? '中转' : '直达',
      transitDays: Math.floor(Math.random() * 10) + 1,
      bookingDeadline: `2024-05-${15 + Math.floor(Math.random() * 10)}`,
      documentDeadline: `2024-05-${15 + Math.floor(Math.random() * 10)}`,
      portOfLoading: Math.random() > 0.5 ? '上海' : '宁波',
      portOfDischarge: Math.random() > 0.5 ? '洛杉矶' : '纽约',
      finalDestination: Math.random() > 0.5 ? '美国' : '欧洲',
      placeOfReceipt: Math.random() > 0.5 ? '上海' : '宁波',
      placeOfDelivery: Math.random() > 0.5 ? '上海' : '宁波',
      shippingTerms: ['FOB', 'CIF', 'CFR'][Math.floor(Math.random() * 3)],
      freightTerms: ['LCL', 'FCL', '拼箱'][Math.floor(Math.random() * 3)],
      carrierName: ['COSCO', 'MSC', 'HMM'][Math.floor(Math.random() * 3)],
      forwarderName: ['德邦物流', '顺丰物流', '中远海运'][Math.floor(Math.random() * 3)],
      quotationValidDays: Math.floor(Math.random() * 30) + 1,
      bookingRemarks: '无特殊要求',
      specialRequirements: '无特殊要求',
      insuranceRequired: Math.random() > 0.5,
      customsClearance: '无特殊要求',
      documentRequired: '无特殊要求',
      weighingRequired: Math.random() > 0.5,
      inspectionRequired: Math.random() > 0.5,
      consolidationService: Math.random() > 0.5,
      doorToDoorService: Math.random() > 0.5,
      temperatureControl: ['恒温', '常温', '冷藏'][Math.floor(Math.random() * 3)],
      hazardousGoods: Math.random() > 0.5,
      oversizeGoods: Math.random() > 0.5,
      overweightGoods: Math.random() > 0.5,
      priority: ['高', '中', '低'][Math.floor(Math.random() * 3)],
      status: ['正常', '过期', '下架'][Math.floor(Math.random() * 3)],
      publishStatus: ['已发布', '未发布', '已下架'][Math.floor(Math.random() * 3)],
      isActive: Math.random() > 0.5,
      isPublic: Math.random() > 0.5,
      tags: [['标签1'], ['标签2'], ['标签3']][Math.floor(Math.random() * 3)],
      category: ['分类1', '分类2', '分类3'][Math.floor(Math.random() * 3)],
      subcategory: ['子分类1', '子分类2', '子分类3'][Math.floor(Math.random() * 3)],
      region: ['区域1', '区域2', '区域3'][Math.floor(Math.random() * 3)],
      lane: ['航线1', '航线2', '航线3'][Math.floor(Math.random() * 3)],
      tradeRoute: ['贸易路线1', '贸易路线2', '贸易路线3'][Math.floor(Math.random() * 3)],
      transitTime: Math.floor(Math.random() * 10) + 1,
      frequency: ['每周一', '每周二', '每周三'][Math.floor(Math.random() * 3)],
      vessel: ['船舶1', '船舶2', '船舶3'][Math.floor(Math.random() * 3)],
      operatorCode: ['操作代码1', '操作代码2', '操作代码3'][Math.floor(Math.random() * 3)],
      bookingOffice: ['订舱处1', '订舱处2', '订舱处3'][Math.floor(Math.random() * 3)],
      salesPerson: ['销售员1', '销售员2', '销售员3'][Math.floor(Math.random() * 3)],
      customerService: ['客服1', '客服2', '客服3'][Math.floor(Math.random() * 3)],
      lastUpdated: '2024-05-15',
      version: '1.0',
      source: '数据来源1',
      reliability: '可靠性1',
      confidence: Math.random() * 100,
      updateFrequency: ['每日更新', '每周更新', '每月更新'][Math.floor(Math.random() * 3)],
      dataQuality: ['高质量', '中等质量', '低质量'][Math.floor(Math.random() * 3)],
      verified: Math.random() > 0.5,
      archived: Math.random() > 0.5,
      deleted: Math.random() > 0.5,
      
      // 继续根据新截图添加的字段
      validToDate: '2024-12-31',
      companyBranch: '上海分公司',
      dataEntryPerson: '张三',
      creationDate: '2024-05-15',
      rateModifyPerson: '李四',
      modificationDate: '2024-05-16',
      targetRegion: '东南亚',
      freightRateType: '整箱运价',
      shipName: 'COSCO SHIPPING UNIVERSE',
      voyageNumber: '25S',
      container20NOR: '20NOR',
      estimatedDeparture: '05-15',
      estimatedArrival: '06-01',
    };
  });

  // LCL和空运列定义
  const lclAirColumns = [
    {
      title: '船公司/航司',
      dataIndex: 'shipCompany',
      width: 120,
      render: (value: string) => <Tooltip content={value} mini><span className="arco-ellipsis">{value}</span></Tooltip>,
      sorter: true,
      resizable: true,
    },
    {
      title: '卸货港',
      dataIndex: 'dischargePort',
      width: 150,
      render: (value: string) => <Tooltip content={value} mini><span className="arco-ellipsis">{value}</span></Tooltip>,
      sorter: true,
      resizable: true,
    },
    {
      title: 'ETD',
      dataIndex: 'etd',
      width: 100,
      render: (value: string) => <Tooltip content={value} mini><span className="arco-ellipsis">{value}</span></Tooltip>,
      sorter: true,
      resizable: true,
    },
    {
      title: '直达/中转',
      dataIndex: 'transitType',
      width: 100,
      render: (value: string) => <Tooltip content={value} mini><span className="arco-ellipsis">{value}</span></Tooltip>,
      sorter: true,
      resizable: true,
    },
    {
      title: '航程',
      dataIndex: 'transit',
      width: 80,
      render: (value: number) => <Tooltip content={String(value)} mini><span className="arco-ellipsis">{value}</span></Tooltip>,
      sorter: true,
      resizable: true,
    },
    {
      title: '重量(KGS)',
      dataIndex: 'weight',
      width: 110,
      render: (value: number) => <Tooltip content={`$ ${value}`} mini><span className="arco-ellipsis">$ {value}</span></Tooltip>,
      sorter: true,
      resizable: true,
    },
    {
      title: '体积(CBM)',
      dataIndex: 'volume',
      width: 110,
      render: (value: number) => <Tooltip content={`$ ${value}`} mini><span className="arco-ellipsis">$ {value}</span></Tooltip>,
      sorter: true,
      resizable: true,
    },
    {
      title: '航线代码',
      dataIndex: 'routeCode',
      width: 100,
      render: (value: string) => <Tooltip content={value} mini><span className="arco-ellipsis">{value}</span></Tooltip>,
      sorter: true,
      resizable: true,
    },
    {
      title: '船名/航班',
      dataIndex: 'vesselName',
      width: 150,
      render: (value: string) => <Tooltip content={value} mini><span className="arco-ellipsis">{value}</span></Tooltip>,
      sorter: true,
      resizable: true,
    },
    {
      title: '航次',
      dataIndex: 'voyageNo',
      width: 100,
      render: (value: string) => <Tooltip content={value} mini><span className="arco-ellipsis">{value}</span></Tooltip>,
      sorter: true,
      resizable: true,
    },
    {
      title: '舱位状态',
      dataIndex: 'spaceStatus',
      width: 100,
      render: (value: string) => (
        <Tooltip content={value} mini>
          <Tag color={value === '舱位充足' ? 'blue' : 'orange'} size="small">
            {value}
          </Tag>
        </Tooltip>
      ),
      sorter: true,
      resizable: true,
    },
    {
      title: '备注',
      dataIndex: 'remark',
      width: 150,
      render: (value: string) => <Tooltip content={value || 'LSE已含'} mini><span className="arco-ellipsis">{value || 'LSE已含'}</span></Tooltip>,
      resizable: true,
    },
    {
      title: '操作',
      dataIndex: 'operations',
      fixed: 'right' as const,
      width: 165,
      className: 'action-column',
      render: () => (
        <div style={{display:'flex',flexWrap:'wrap',gap:0}}>
          <div style={{display:'flex',gap:0,width:'100%'}}>
            <Button type="text" size="mini">编辑</Button>
            <Button type="text" size="mini">下载</Button>
          </div>
          <div style={{display:'flex',gap:0,width:'100%'}}>
            <Button type="text" size="mini">复制</Button>
          </div>
        </div>
      ),
    },
  ];

  // LCL数据
  const lclData: LclAirDataItem[] = Array(12).fill(null).map((_, index) => {
    const randomWeight = (75 + Math.floor(Math.random() * 50));
    const randomVolume = (12 + Math.floor(Math.random() * 8));
    const portPrefix = ['MANILA-NORTH', 'MANILA-SOUTH', 'SUBIC BAY', 'CEBU', 'ILOILO', 'CAGAYAN DE ORO', 'BATANGAS'];
    const routeCodes = ['CPX4', 'CPS', 'CPX7', 'CPX6'];
    const vesselNames = ['MEDKON QUO', 'SITC PENANG', 'SITC YOKOHAMA', 'SITC XINCHENG'];
    
    return {
      key: `lcl-${index}`,
      shipCompany: 'SITC',
      dischargePort: portPrefix[Math.floor(Math.random() * portPrefix.length)],
      etd: `05-${15 + Math.floor(Math.random() * 4)}`,
      transitType: '直达',
      transit: 4 + Math.floor(Math.random() * 6),
      weight: randomWeight,
      volume: randomVolume,
      routeCode: routeCodes[Math.floor(Math.random() * routeCodes.length)],
      vesselName: vesselNames[Math.floor(Math.random() * vesselNames.length)],
      voyageNo: `25${10 + Math.floor(Math.random() * 9)}S`,
      spaceStatus: Math.random() > 0.3 ? '舱位充足' : '运费下调',
      remark: Math.random() > 0.5 ? 'LSE已含' : '运费下调',
    };
  });

  // 空运数据
  const airData: LclAirDataItem[] = Array(12).fill(null).map((_, index) => {
    const randomWeight = (125 + Math.floor(Math.random() * 75));
    const randomVolume = (5 + Math.floor(Math.random() * 6));
    const portPrefix = ['LAX', 'JFK', 'ORD', 'ATL', 'DFW', 'SFO', 'MIA'];
    const routeCodes = ['CA101', 'MU123', 'CZ456', 'CI789'];
    const flightNames = ['CA501', 'MU208', 'CZ308', 'CI118'];
    
    return {
      key: `air-${index}`,
      shipCompany: ['南方航空', '东方航空', '国际航空', '中华航空'][Math.floor(Math.random() * 4)],
      dischargePort: portPrefix[Math.floor(Math.random() * portPrefix.length)],
      etd: `05-${15 + Math.floor(Math.random() * 4)}`,
      transitType: Math.random() > 0.6 ? '直达' : '中转',
      transit: 1 + Math.floor(Math.random() * 3),
      weight: randomWeight,
      volume: randomVolume,
      routeCode: routeCodes[Math.floor(Math.random() * routeCodes.length)],
      vesselName: flightNames[Math.floor(Math.random() * flightNames.length)],
      voyageNo: `A${Math.floor(1000 + Math.random() * 9000)}`,
      spaceStatus: Math.random() > 0.3 ? '舱位充足' : '运费下调',
      remark: Math.random() > 0.5 ? 'AMS已含' : '运费下调',
    };
  });



  // 处理查看整箱运价详情
  const handleViewFclRate = (id: string) => {
    // 检查当前路径，如果是客户端则导航到客户端的查看页面
    const currentPath = location.pathname;
    if (currentPath.includes('/controltower-client/')) {
      navigate(`/controltower-client/view-fcl-rate/${id}`);
    } else {
      navigate(`/controltower/saas/view-fcl-rate/${id}`);
    }
  };

  // 处理查看运价详情
  const handleViewRateDetail = (record: any) => {
    // 根据当前tab类型导航到对应的详情页面
    const currentPath = location.pathname;
    
    if (activeTab === 'ecommerce') {
      setCurrentRateDetail(record);
      setRateDetailInitialTab('cost');
      setRateDetailModalVisible(true);
    } else if (activeTab === 'fcl') {
      if (currentPath.includes('/controltower-client/')) {
        navigate(`/controltower-client/view-fcl-rate/${record.key}`);
      } else {
        navigate(`/controltower/saas/view-fcl-rate/${record.key}`);
      }
    } else if (activeTab === 'precarriage') {
      navigate(`/controltower/saas/view-precarriage-rate/${record.key}`);
    } else if (activeTab === 'lastmile') {
      navigate(`/controltower/saas/view-lastmile-rate/${record.key}`);
    }
  };

  // 处理立即订舱
  const handleBookingNow = (record: any) => {
    // 这里可以导航到订舱页面或打开订舱弹窗
    Message.info('立即订舱功能开发中...');
    console.log('立即订舱:', record);
  };

  // 处理查看港前运价详情
  const handleViewPrecarriageRate = (id: string) => {
    navigate(`/controltower/saas/view-precarriage-rate/${id}`);
  };

  // 港前运价列定义 - 复刻自PrecarriageRates.tsx
  const precarriageColumns = [
    {
      title: '港前运价编号',
      dataIndex: 'code',
      width: 140,
      sorter: true,
      resizable: true,
      render: (value: string) => <Tooltip content={value} mini><span>{value}</span></Tooltip>
    },
    {
      title: '运价类型',
      dataIndex: 'rateType',
      width: 120,
      sorter: true,
      resizable: true,
      render: (value: string) => <Tooltip content={value} mini><span>{value}</span></Tooltip>
    },
    {
      title: '支线类型',
      dataIndex: 'sublineType',
      width: 140,
      sorter: true,
      resizable: true,
      render: (value: string | null) => value ? <Tooltip content={value} mini><span>{value}</span></Tooltip> : '-'
    },
    {
      title: '起运地',
      dataIndex: 'origin',
      width: 220,
      sorter: true,
      resizable: true,
      render: (value: string) => <Tooltip content={value} mini><span>{value}</span></Tooltip>
    },
    {
      title: '起运港',
      dataIndex: 'destination',
      width: 180,
      sorter: true,
      resizable: true,
      render: (value: string) => <Tooltip content={value} mini><span>{value}</span></Tooltip>
    },
    {
      title: '码头',
      dataIndex: 'terminal',
      width: 120,
      sorter: true,
      resizable: true,
      render: (value: string) => <Tooltip content={value} mini><span>{value}</span></Tooltip>
    },
    {
      title: '供应商',
      dataIndex: 'vendor',
      width: 150,
      sorter: true,
      resizable: true,
      render: (value: string) => <Tooltip content={value} mini><span>{value}</span></Tooltip>
    },
    {
      title: '20GP',
      dataIndex: '20gp',
      width: 100,
      sorter: true,
      resizable: true,
      render: (value: number) => <Tooltip content={value} mini><span>{value}</span></Tooltip>
    },
    {
      title: '40GP',
      dataIndex: '40gp',
      width: 100,
      sorter: true,
      resizable: true,
      render: (value: number) => <Tooltip content={value} mini><span>{value}</span></Tooltip>
    },
    {
      title: '40HC',
      dataIndex: '40hc',
      width: 100,
      sorter: true,
      resizable: true,
      render: (value: number) => <Tooltip content={value} mini><span>{value}</span></Tooltip>
    },
    {
      title: '40NOR',
      dataIndex: '40nor',
      width: 100,
      sorter: true,
      resizable: true,
      render: (value: number) => <Tooltip content={value} mini><span>{value}</span></Tooltip>
    },
    {
      title: '45HC',
      dataIndex: '45hc',
      width: 100,
      sorter: true,
      resizable: true,
      render: (value: number) => <Tooltip content={value} mini><span>{value}</span></Tooltip>
    },
    {
      title: '有效期',
      dataIndex: 'validDateRange',
      width: 200,
      sorter: true,
      resizable: true,
      render: (value: string) => <Tooltip content={value} mini><span>{value}</span></Tooltip>
    },
    {
      title: '状态',
      dataIndex: 'status',
      width: 100,
      sorter: true,
      resizable: true,
      render: (value: string) => {
        const colorMap: Record<string, string> = {
          '正常': 'green',
          '过期': 'red',
          '下架': 'gray'
        };
        return (
          <Tooltip content={value} mini>
            <Tag color={colorMap[value] || 'blue'} size="small">
              {value}
            </Tag>
          </Tooltip>
        );
      }
    },
    {
      title: '备注',
      dataIndex: 'remark',
      width: 200,
      sorter: true,
      resizable: true,
      render: (value: string) => <Tooltip content={value} mini><span>{value || '-'}</span></Tooltip>
    },
    {
      title: '创建人',
      dataIndex: 'entryPerson',
      width: 120,
      sorter: true,
      resizable: true,
      render: (value: string) => <Tooltip content={value} mini><span>{value}</span></Tooltip>
    },
    {
      title: '创建时间',
      dataIndex: 'createDate',
      width: 120,
      sorter: true,
      resizable: true,
      render: (value: string) => <Tooltip content={value} mini><span>{value}</span></Tooltip>
    },
    {
      title: '修改人',
      dataIndex: 'rateModifier',
      width: 120,
      sorter: true,
      resizable: true,
      render: (value: string) => <Tooltip content={value} mini><span>{value}</span></Tooltip>
    },
    {
      title: '修改时间',
      dataIndex: 'modifyDate',
      width: 120,
      sorter: true,
      resizable: true,
      render: (value: string) => <Tooltip content={value} mini><span>{value}</span></Tooltip>
    },
    {
      title: '操作',
      dataIndex: 'operations',
      fixed: 'right' as const,
      width: 120,
      className: 'action-column',
      render: (_: any, record: PrecarriageDataItem) => (
        <Button type="text" size="mini" onClick={() => handleViewPrecarriageRate(record.key)}>详情</Button>
      ),
    },
  ];

  // 港前运价数据接口
  interface PrecarriageDataItem {
    key: string;
    code: string; // 港前运价编号
    rateType: string; // 运价类型
    sublineType: string | null; // 支线类型
    origin: string; // 起运地
    destination: string; // 起运港
    terminal: string; // 码头
    vendor: string; // 供应商
    '20gp': number;
    '40gp': number;
    '40hc': number;
    '40nor': number;
    '45hc': number;
    validDateRange: string; // 有效期区间
    status: '正常' | '过期' | '下架'; // 状态
    remark: string; // 备注
    entryPerson: string; // 创建人
    createDate: string; // 创建时间
    rateModifier: string; // 修改人
    modifyDate: string; // 修改时间
  }

  // 港前运价数据
  const precarriageData: PrecarriageDataItem[] = [
    {
      key: '1',
      code: 'PCR2024050001',
      rateType: '直拖',
      sublineType: null,
      origin: '浙江省杭州市萧山区',
      destination: 'CNSHA | SHANGHAI',
      terminal: '洋山',
      vendor: '安吉物流',
      '20gp': 800,
      '40gp': 1200,
      '40hc': 1300,
      '40nor': 1250,
      '45hc': 1500,
      validDateRange: '2024-05-01 至 2024-12-31',
      status: '正常',
      remark: '',
      entryPerson: '张三',
      createDate: '2024-05-01',
      rateModifier: '李四',
      modifyDate: '2024-05-15',
    },
    {
      key: '2',
      code: 'PCR2024050002',
      rateType: '支线',
      sublineType: '湖州海铁',
      origin: '浙江省湖州市吴兴区',
      destination: 'CNNGB | NINGBO',
      terminal: '北仑',
      vendor: '中远海运',
      '20gp': 400,
      '40gp': 700,
      '40hc': 750,
      '40nor': 720,
      '45hc': 850,
      validDateRange: '2024-05-15 至 2024-11-30',
      status: '正常',
      remark: '',
      entryPerson: '王五',
      createDate: '2024-05-15',
      rateModifier: '赵六',
      modifyDate: '2024-05-20',
    },
    {
      key: '3',
      code: 'PCR2024050003',
      rateType: '直拖',
      sublineType: null,
      origin: '江苏省苏州市工业园区',
      destination: 'CNSHA | SHANGHAI',
      terminal: '外高桥',
      vendor: '德邦物流',
      '20gp': 850,
      '40gp': 1250,
      '40hc': 1350,
      '40nor': 1300,
      '45hc': 1550,
      validDateRange: '2024-04-01 至 2024-12-15',
      status: '正常',
      remark: '需提前24小时预约',
      entryPerson: '钱七',
      createDate: '2024-04-01',
      rateModifier: '孙八',
      modifyDate: '2024-04-15',
    },
    {
      key: '4',
      code: 'PCR2024040001',
      rateType: '直拖',
      sublineType: null,
      origin: '上海市嘉定区',
      destination: 'CNSHA | SHANGHAI',
      terminal: '洋山',
      vendor: '顺丰物流',
      '20gp': 750,
      '40gp': 1150,
      '40hc': 1250,
      '40nor': 1200,
      '45hc': 1450,
      validDateRange: '2024-03-01 至 2024-05-31',
      status: '过期',
      remark: '',
      entryPerson: '周九',
      createDate: '2024-03-01',
      rateModifier: '吴十',
      modifyDate: '2024-03-10',
    },
  ];



  // 尾程运价数据接口
  interface OncarriageDataItem {
    key: string;
    code: string; // 尾程运价编号
    origin: string; // 目的港
    addressType: '第三方地址' | '亚马逊仓库' | '易仓'; // 配送地址类型
    zipCode: string; // 邮编
    address: string; // 地址
    warehouseCode: string | null; // 仓库代码
    agentName: string; // 代理名称
    validDateRange: string; // 有效期区间
    remark: string; // 备注
    status: '正常' | '过期' | '下架'; // 状态
    '20gp': number; // 20GP价格
    '40gp': number; // 40GP价格
    '40hc': number; // 40HC价格
    '45hc': number; // 45HC价格
    '40nor': number; // 40NOR价格
    entryPerson: string; // 创建人
    createDate: string; // 创建时间
    rateModifier: string; // 修改人
    modifyDate: string; // 修改时间
  }
  
  // 处理查看尾程运价详情
  const handleViewLastMileRate = (id: string) => {
    navigate(`/controltower/saas/view-lastmile-rate/${id}`);
  };

  // 尾程运价列定义
  const oncarriageColumns = [
    {
      title: '尾程运价编号',
      dataIndex: 'code',
      width: 140,
      sorter: true,
      resizable: true,
      render: (value: string) => <Tooltip content={value} mini><span>{value}</span></Tooltip>
    },
    {
      title: '目的港',
      dataIndex: 'origin',
      width: 180,
      sorter: true,
      resizable: true,
      render: (value: string) => <Tooltip content={value} mini><span>{value}</span></Tooltip>
    },
    {
      title: '配送地址类型',
      dataIndex: 'addressType',
      width: 140,
      sorter: true,
      resizable: true,
      render: (value: string) => <Tooltip content={value} mini><span>{value}</span></Tooltip>
    },
    {
      title: '邮编',
      dataIndex: 'zipCode',
      width: 100,
      sorter: true,
      resizable: true,
      render: (value: string, record: OncarriageDataItem) => {
        if (record.addressType === '亚马逊仓库' || record.addressType === '易仓') {
          return '-';
        }
        return <Tooltip content={value} mini><span>{value}</span></Tooltip>;
      }
    },
    {
      title: '地址',
      dataIndex: 'address',
      width: 200,
      sorter: true,
      resizable: true,
      render: (value: string, record: OncarriageDataItem) => {
        if (record.addressType === '亚马逊仓库' || record.addressType === '易仓') {
          return '-';
        }
        return <Tooltip content={value} mini><span>{value}</span></Tooltip>;
      }
    },
    {
      title: '仓库代码',
      dataIndex: 'warehouseCode',
      width: 120,
      sorter: true,
      resizable: true,
      render: (value: string | null) => value ? <Tooltip content={value} mini><span>{value}</span></Tooltip> : '-'
    },
    {
      title: '代理名称',
      dataIndex: 'agentName',
      width: 200,
      sorter: true,
      resizable: true,
      render: (value: string) => <Tooltip content={value} mini><span>{value}</span></Tooltip>
    },
    {
      title: '20GP',
      dataIndex: '20gp',
      width: 100,
      sorter: true,
      resizable: true,
      render: (value: number) => <Tooltip content={value} mini><span>{value}</span></Tooltip>
    },
    {
      title: '40GP',
      dataIndex: '40gp',
      width: 100,
      sorter: true,
      resizable: true,
      render: (value: number) => <Tooltip content={value} mini><span>{value}</span></Tooltip>
    },
    {
      title: '40HC',
      dataIndex: '40hc',
      width: 100,
      sorter: true,
      resizable: true,
      render: (value: number) => <Tooltip content={value} mini><span>{value}</span></Tooltip>
    },
    {
      title: '40NOR',
      dataIndex: '40nor',
      width: 100,
      sorter: true,
      resizable: true,
      render: (value: number) => <Tooltip content={value} mini><span>{value}</span></Tooltip>
    },
    {
      title: '45HC',
      dataIndex: '45hc',
      width: 100,
      sorter: true,
      resizable: true,
      render: (value: number) => <Tooltip content={value} mini><span>{value}</span></Tooltip>
    },
    {
      title: '有效期',
      dataIndex: 'validDateRange',
      width: 200,
      sorter: true,
      resizable: true,
      render: (value: string) => <Tooltip content={value} mini><span>{value}</span></Tooltip>
    },
    {
      title: '状态',
      dataIndex: 'status',
      width: 100,
      sorter: true,
      resizable: true,
      render: (value: string) => {
        const colorMap: Record<string, string> = {
          '正常': 'green',
          '过期': 'red',
          '下架': 'gray'
        };
        return (
          <Tooltip content={value} mini>
            <Tag color={colorMap[value] || 'blue'} size="small">
              {value}
            </Tag>
          </Tooltip>
        );
      }
    },
    {
      title: '备注',
      dataIndex: 'remark',
      width: 200,
      sorter: true,
      resizable: true,
      render: (value: string) => <Tooltip content={value} mini><span>{value || '-'}</span></Tooltip>
    },
    {
      title: '创建人',
      dataIndex: 'entryPerson',
      width: 120,
      sorter: true,
      resizable: true,
      render: (value: string) => <Tooltip content={value} mini><span>{value}</span></Tooltip>
    },
    {
      title: '创建时间',
      dataIndex: 'createDate',
      width: 120,
      sorter: true,
      resizable: true,
      render: (value: string) => <Tooltip content={value} mini><span>{value}</span></Tooltip>
    },
    {
      title: '修改人',
      dataIndex: 'rateModifier',
      width: 120,
      sorter: true,
      resizable: true,
      render: (value: string) => <Tooltip content={value} mini><span>{value}</span></Tooltip>
    },
    {
      title: '修改时间',
      dataIndex: 'modifyDate',
      width: 120,
      sorter: true,
      resizable: true,
      render: (value: string) => <Tooltip content={value} mini><span>{value}</span></Tooltip>
    },
    {
      title: '操作',
      dataIndex: 'operations',
      fixed: 'right' as const,
      width: 120,
      className: 'action-column',
      render: (_: any, record: OncarriageDataItem) => (
        <Button type="text" size="mini" onClick={() => handleViewLastMileRate(record.key)}>详情</Button>
      ),
    },
  ];

  // 尾程运价数据
  const oncarriageData: OncarriageDataItem[] = [
    {
      key: '1',
      code: 'LMR2024050001',
      origin: 'USLAX | LOS ANGELES',
      addressType: '第三方地址',
      zipCode: '92101',
      address: 'San Diego, CA',
      warehouseCode: null,
      agentName: 'XPO TRUCK LLC',
      validDateRange: '2024-05-01 至 2024-12-31',
      remark: '',
      status: '正常',
      '20gp': 1200,
      '40gp': 1800,
      '40hc': 1900,
      '45hc': 2200,
      '40nor': 2000,
      entryPerson: '张三',
      createDate: '2024-05-01',
      rateModifier: '李四',
      modifyDate: '2024-05-15'
    },
    {
      key: '2',
      code: 'LMR2024050002',
      origin: 'USNYC | NEW YORK',
      addressType: '亚马逊仓库',
      zipCode: '',
      address: '',
      warehouseCode: 'ONT8',
      agentName: 'DRAYEASY INC',
      validDateRange: '2024-05-15 至 2024-11-30',
      remark: '',
      status: '正常',
      '20gp': 980,
      '40gp': 1650,
      '40hc': 1750,
      '45hc': 2050,
      '40nor': 1800,
      entryPerson: '王五',
      createDate: '2024-05-15',
      rateModifier: '赵六',
      modifyDate: '2024-05-20'
    },
    {
      key: '3',
      code: 'LMR2024050003',
      origin: 'DEHAM | HAMBURG',
      addressType: '易仓',
      zipCode: '',
      address: '',
      warehouseCode: 'LAX203',
      agentName: 'AMERICAN FREIGHT SOLUTIONS',
      validDateRange: '2024-04-01 至 2024-12-15',
      remark: '需提前24小时预约',
      status: '正常',
      '20gp': 1300,
      '40gp': 1950,
      '40hc': 2050,
      '45hc': 2400,
      '40nor': 2100,
      entryPerson: '钱七',
      createDate: '2024-04-01',
      rateModifier: '孙八',
      modifyDate: '2024-04-15'
    },
    {
      key: '4',
      code: 'LMR2024040001',
      origin: 'NLRTM | ROTTERDAM',
      addressType: '第三方地址',
      zipCode: '96001',
      address: 'Redding, CA',
      warehouseCode: null,
      agentName: 'WEST COAST CARRIERS LLC',
      validDateRange: '2024-03-01 至 2024-05-31',
      remark: '',
      status: '过期',
      '20gp': 1100,
      '40gp': 1700,
      '40hc': 1800,
      '45hc': 2150,
      '40nor': 1950,
      entryPerson: '周九',
      createDate: '2024-03-01',
      rateModifier: '吴十',
      modifyDate: '2024-03-10'
    },
  ];

  // 获取表格列
  const getTableColumns = (): any => {
    switch (activeTab) {
      case 'ecommerce':
        // Filter and sort ecommerce columns
        const { visible, order } = ecommerceColumnSettings;
        
        // Ensure all keys in order exist in ALL_ECOMMERCE_COLUMNS
        const availableColumns = ALL_ECOMMERCE_COLUMNS.filter(col => visible[col.dataIndex as keyof typeof visible]);
        
        // Sort according to order
        const sortedColumns = availableColumns.sort((a, b) => {
          const indexA = order.indexOf(a.dataIndex);
          const indexB = order.indexOf(b.dataIndex);
          if (indexA === -1) return 1;
          if (indexB === -1) return -1;
          return indexA - indexB;
        });

        // Override render for transitType to allow opening schedule detail
        const columnsWithActions = sortedColumns.map(col => {
          if (col.dataIndex === 'transitType') {
            return {
              ...col,
              render: (val: string, record: any) => (
                <span 
                  className="cursor-pointer text-blue-600 hover:text-blue-800 hover:underline"
                  onClick={(e) => {
                    e.stopPropagation();
                    setCurrentRateDetail(record);
                    setRateDetailInitialTab('schedule');
                    setRateDetailModalVisible(true);
                  }}
                >
                  {val}
                </span>
              )
            };
          }
          return col;
        });

        // Add Operations column
        return [
          ...columnsWithActions,
          {
            title: '操作',
            dataIndex: 'operations',
            fixed: 'right',
            width: 160,
            render: (_: any, record: EcommerceRateItem) => (
              <Space size={4}>
                 <Button type="text" size="mini" style={{ padding: '0 4px' }} onClick={() => handleViewRateDetail(record)}>详情</Button>
                 <Button type="text" size="mini" style={{ padding: '0 4px' }} onClick={() => handleQuickQuote(record)}>快速报价</Button>
                 <Button type="text" size="mini" style={{ padding: '0 4px' }} onClick={() => handleSingleRateAnalysis(record)}>AI分析</Button>
              </Space>
            )
          }
        ];
      case 'lcl':
        return lclAirColumns;
      case 'air':
        return lclAirColumns;
      case 'precarriage':
        return precarriageColumns;
      case 'oncarriage':
        return oncarriageColumns;
      case 'fcl':
      default:
        return fclColumns;
    }
  };
  
  // 定义类型安全的表格组件渲染

  const pagination = {
    showTotal: true,
    total: 9232,
    pageSize: 12,
    current: 1,
    showJumper: true,
    sizeCanChange: true,
    pageSizeChangeResetCurrent: true,
    sizeOptions: [12, 50, 100, 200],
  };

  // 定义每个tab下的筛选表单内容

  // 拖拽功能
  const handleDragStart = (_e: React.DragEvent, columnKey: string) => {
    setDraggedItem(columnKey);
  };

  const handleDragOver = (e: React.DragEvent, columnKey: string) => {
    e.preventDefault();
    setDragOverItem(columnKey);
  };

  const handleDrop = (e: React.DragEvent, targetColumnKey: string) => {
    e.preventDefault();
    if (draggedItem && draggedItem !== targetColumnKey) {
      const newOrder = [...columnOrder];
      const draggedIndex = newOrder.indexOf(draggedItem);
      const targetIndex = newOrder.indexOf(targetColumnKey);
      
      newOrder.splice(draggedIndex, 1);
      newOrder.splice(targetIndex, 0, draggedItem);
      
      setColumnOrder(newOrder);
    }
    setDraggedItem(null);
    setDragOverItem(null);
  };

  const handleDragEnd = () => {
    setDraggedItem(null);
    setDragOverItem(null);
  };

  const handleEcommerceDrop = (e: React.DragEvent, targetColumnKey: string) => {
    e.preventDefault();
    if (draggedItem && draggedItem !== targetColumnKey) {
      const newOrder = [...ecommerceColumnSettings.order];
      const draggedIndex = newOrder.indexOf(draggedItem);
      const targetIndex = newOrder.indexOf(targetColumnKey);
      
      if (draggedIndex > -1 && targetIndex > -1) {
        newOrder.splice(draggedIndex, 1);
        newOrder.splice(targetIndex, 0, draggedItem);
        setEcommerceColumnSettings(prev => ({ ...prev, order: newOrder }));
      }
    }
    setDraggedItem(null);
    setDragOverItem(null);
  };

  // 筛选字段拖拽功能
  const handleFilterFieldDragStart = (_e: React.DragEvent, fieldKey: string) => {
    setDraggedFilterField(fieldKey);
  };

  const handleFilterFieldDragOver = (e: React.DragEvent, fieldKey: string) => {
    e.preventDefault();
    setDragOverFilterField(fieldKey);
  };

  const handleFilterFieldDrop = (e: React.DragEvent, targetFieldKey: string) => {
    e.preventDefault();
    if (draggedFilterField && draggedFilterField !== targetFieldKey) {
      const newOrder = [...filterFieldOrder];
      const draggedIndex = newOrder.indexOf(draggedFilterField);
      const targetIndex = newOrder.indexOf(targetFieldKey);
      
      newOrder.splice(draggedIndex, 1);
      newOrder.splice(targetIndex, 0, draggedFilterField);
      
      setFilterFieldOrder(newOrder);
    }
    setDraggedFilterField(null);
    setDragOverFilterField(null);
  };

  const handleFilterFieldDragEnd = () => {
    setDraggedFilterField(null);
    setDragOverFilterField(null);
  };

  // 获取列标签
  const getColumnLabel = (columnKey: string): string => {
    const columnLabels: Record<string, string> = {
      routeCode: '运价号',
      rateType: '运价类型',
      departurePort: '起运港',
      dischargePort: '目的港',
      transitPort: '中转港',
      transitType: '中转类型',
      shipCompany: '船公司',
      contractNo: '约号',
      spaceStatus: '舱位状态',
      priceStatus: '价格趋势',
      cargoType: '货物类型',
      rateStatus: '运价状态',
      '20gp': "20GP",
      '40gp': "40GP",
      '40hc': "40HC",
      '20nor': "20NOR",
      '40nor': "40NOR",
      '45hc': "45HC",
      '20hc': "20HC",
      '20tk': "20TK",
      '40tk': "40TK",
      '20ot': "20OT",
      '40ot': "40OT",
      '20fr': "20FR",
      '40fr': "40FR",
      vesselSchedule: '船期',
      voyage: '航程',
      freeContainerDays: '免用箱',
      freeStorageDays: '免堆存',
      chargeSpecialNote: '接货特殊说明',
      nac: 'NAC',
      overweightNote: '超重说明',
      notes: '备注',
      validPeriod: '有效期',
      etd: 'ETD',
      eta: 'ETA',
      vesselName: '船名',
      voyageNo: '航次',
      cutoffDate: '截关日',
      destinationRegion: '目的区域',
      entryPerson: '创建人',
      createDate: '创建日期',
      rateModifier: '运价修改人',
      modifyDate: '修改日期'
    };
    return columnLabels[columnKey] || columnKey;
  };

  // 初始化默认筛选条件
  const initializeDefaultConditions = (activeTab: string): FilterCondition[] => {
    const filterFields = getFilterFieldsByTab(activeTab);
    
    // 电商运价默认显示字段
    if (activeTab === 'ecommerce') {
      return filterFields.map(field => ({
        key: field.key,
        mode: FilterMode.EQUAL,
        value: field.key === 'carrier' && field.options ? field.options.map(o => o.value) : '',
        visible: ['pol', 'pod', 'boxType', 'carrier', 'etd', 'eta'].includes(field.key)
      }));
    }

    return filterFields.map(field => ({
      key: field.key,
      mode: FilterMode.EQUAL,
      value: '',
      visible: ['shipCompany', 'transitType', 'departurePort', 'dischargePort'].includes(field.key)
    }));
  };

  // 初始化默认方案
  const initializeDefaultScheme = (activeTab: string): FilterScheme => {
    return {
      id: 'default',
      name: '默认方案',
      conditions: initializeDefaultConditions(activeTab),
      isDefault: true
    };
  };

  // 获取可见的筛选条件
  const getVisibleConditions = (): FilterCondition[] => {
    return filterConditions.filter(condition => condition.visible);
  };

  // 获取第一行筛选条件
  const getFirstRowConditions = (): FilterCondition[] => {
    const visible = getVisibleConditions();
    return visible.slice(0, 4);
  };

  // 切换筛选区展开/收起
  const toggleFilterExpanded = () => {
    setFilterExpanded(!filterExpanded);
  };

  // 更新筛选条件
  const updateFilterCondition = (key: string, mode: FilterMode, value: any) => {
    setFilterConditions(prev => prev.map(condition => 
      condition.key === key ? { ...condition, mode, value } : condition
    ));
  };

  // 重置筛选条件
  const resetFilterConditions = () => {
    const defaultConditions = initializeDefaultConditions(activeTab);
    setFilterConditions(defaultConditions);
    
    const defaultScheme = initializeDefaultScheme(activeTab);
    setFilterSchemes([defaultScheme]);
    setCurrentSchemeId('default');
    
    Message.success('筛选条件已重置');
  };

  // 应用筛选方案
  const applyFilterScheme = (schemeId: string) => {
    const scheme = filterSchemes.find(s => s.id === schemeId);
    if (scheme) {
      setFilterConditions(scheme.conditions);
      setCurrentSchemeId(schemeId);
    }
  };

  // 打开筛选字段Modal
  const openFilterFieldModal = () => {
    setFilterFieldModalVisible(true);
  };

  // 关闭筛选字段Modal
  const closeFilterFieldModal = () => {
    setFilterFieldModalVisible(false);
  };

  // 打开方案Modal
  const openSchemeModal = () => {
    setSchemeModalVisible(true);
  };

  // 关闭方案Modal
  const closeSchemeModal = () => {
    setSchemeModalVisible(false);
    setNewSchemeName('');
  };

  // 保存筛选方案
  const saveFilterScheme = () => {
    if (!newSchemeName.trim()) {
      Message.error('请输入方案名称');
      return;
    }
    
    const newScheme: FilterScheme = {
      id: Date.now().toString(),
      name: newSchemeName,
      conditions: [...filterConditions]
    };
    
    const newSchemeData: SchemeData = {
      id: newScheme.id,
      name: newScheme.name,
      isDefault: false,
      createTime: new Date().toISOString(),
      conditions: newScheme.conditions
    };
    
    // 同时更新两个状态
    setFilterSchemes(prev => [...prev, newScheme]);
    setAllSchemes(prev => [...prev, newSchemeData]);
    setCurrentSchemeId(newScheme.id);
    closeSchemeModal();
    Message.success('方案保存成功');
  };

  // 更新筛选条件可见性
  const updateFilterConditionVisibility = (key: string, visible: boolean) => {
    setFilterConditions(prev => prev.map(condition => 
      condition.key === key ? { ...condition, visible } : condition
    ));
  };

  // 渲染筛选条件
  const renderFilterCondition = (condition: FilterCondition) => {
    const fieldConfig = getFilterFieldsByTab(activeTab).find(field => field.key === condition.key);
    if (!fieldConfig) return null;

    const handleModeChange = (mode: FilterMode) => {
      updateFilterCondition(condition.key, mode, condition.value);
    };

    const handleValueChange = (value: any) => {
      updateFilterCondition(condition.key, condition.mode, value);
    };

    // 根据筛选模式决定是否禁用输入框
    const isInputDisabled = condition.mode === FilterMode.IS_EMPTY || condition.mode === FilterMode.IS_NOT_EMPTY;

    return (
      <Col span={6} key={condition.key} className="mb-4">
        <div className="filter-condition-wrapper">
          {/* 字段标签和筛选模式 */}
          <div className="filter-label-row mb-2 flex items-center justify-between">
            <span className="text-gray-700 text-sm font-medium">{fieldConfig.label}</span>
          </div>
          
          {/* 输入控件 - 占满整个宽度 */}
          <div className="filter-input-wrapper">
            {fieldConfig.type === 'text' && (
              <Input
                placeholder={isInputDisabled ? '（自动判断）' : fieldConfig.placeholder}
                value={condition.value || ''}
                onChange={handleValueChange}
                disabled={isInputDisabled}
                allowClear
                style={{ width: '100%' }}
              />
            )}
            {fieldConfig.type === 'select' && (
              <Select
                mode={fieldConfig.mode}
                placeholder={isInputDisabled ? '（自动判断）' : fieldConfig.placeholder}
                value={condition.value}
                onChange={handleValueChange}
                disabled={isInputDisabled}
                allowClear
                style={{ width: '100%' }}
                maxTagCount={3} // 超过3个省略
                showSearch={['pol', 'pod'].includes(condition.key)} // 仅起运港和目的港支持搜索
                filterOption={(inputValue, option) => {
                  const label = (option as any)?.props?.children?.toString() || '';
                  const value = (option as any)?.props?.value?.toString() || '';
                  return label.toLowerCase().includes(inputValue.toLowerCase()) || 
                         value.toLowerCase().includes(inputValue.toLowerCase());
                }}
                dropdownRender={(menu) => {
                  // 为箱型和船公司添加全选按钮
                  if (['boxType', 'carrier', 'shipCompany'].includes(condition.key)) {
                    const allValues = fieldConfig.options?.map(o => o.value) || [];
                    const selectedValues = Array.isArray(condition.value) ? condition.value : [];
                    const isAllSelected = allValues.length > 0 && selectedValues.length === allValues.length;
                    
                    return (
                      <div>
                         <div style={{ padding: '8px 12px', borderBottom: '1px solid #e5e6eb' }}>
                           <Checkbox 
                             checked={isAllSelected} 
                             onChange={(checked) => {
                               handleValueChange(checked ? allValues : []);
                             }}
                           >
                             全选
                           </Checkbox>
                         </div>
                         {menu}
                      </div>
                    );
                  }
                  return menu;
                }}
              >
                {fieldConfig.options?.map(option => {
                  if (condition.key === 'boxType' && option.value === '20GP') {
                    return (
                      <Option key={option.value} value={option.value}>
                        <div className="flex items-center justify-between w-full">
                          <span>{option.label}</span>
                          <div 
                            onClick={(e) => e.stopPropagation()} 
                            onMouseDown={(e) => e.stopPropagation()}
                          >
                            <Input 
                              size="mini"
                              placeholder="请输入" 
                              suffix="KG" 
                              style={{ width: 120, marginLeft: 8 }}
                              value={ecommerceWeight}
                              onChange={(value) => setEcommerceWeight(value)}
                            />
                          </div>
                        </div>
                      </Option>
                    );
                  }
                  return (
                    <Option key={option.value} value={option.value}>
                      {option.label}
                    </Option>
                  );
                })}
              </Select>
            )}
            {fieldConfig.type === 'dateRange' && (
              <RangePicker
                value={condition.value}
                onChange={handleValueChange}
                disabled={isInputDisabled}
                style={{ width: '100%' }}
                placeholder={isInputDisabled ? ['（自动判断）', ''] : ['开始日期', '结束日期']}
              />
            )}
            {fieldConfig.type === 'number' && (
              <Input
                placeholder={isInputDisabled ? '（自动判断）' : fieldConfig.placeholder}
                value={condition.value || ''}
                onChange={handleValueChange}
                disabled={isInputDisabled}
                allowClear
                style={{ width: '100%' }}
              />
            )}
          </div>
        </div>
      </Col>
    );
  };

  // 渲染卡片模式专用筛选区域 - 与船期查询页面样式一致
  const renderCardModeFilterArea = () => {
    if (activeTab === 'ecommerce') {
      return (
        <Card className="search-card" style={{ marginBottom: 24 }}>
          <Row gutter={24}>
            <Col span={6}>
              <div style={{ marginBottom: 8, fontWeight: 'bold' }}>起运港 (POL)</div>
              <Select
                placeholder="请输入起运港"
                showSearch
                allowClear
                style={{ width: '100%' }}
                value={ecommerceOrigin}
                onChange={setEcommerceOrigin}
              >
                 <Option value="SHANGHAI">上海港 Shanghai</Option>
                 <Option value="NINGBO">宁波港 Ningbo</Option>
                 <Option value="SHENZHEN">深圳港 Shenzhen</Option>
                 <Option value="QINGDAO">青岛港 Qingdao</Option>
              </Select>
            </Col>
            <Col span={6}>
              <div style={{ marginBottom: 8, fontWeight: 'bold' }}>目的港 (POD)</div>
              <Select
                placeholder="请输入目的港"
                showSearch
                allowClear
                style={{ width: '100%' }}
                value={ecommerceDestination}
                onChange={setEcommerceDestination}
              >
                 <Option value="ROTTERDAM">鹿特丹港 Rotterdam</Option>
                 <Option value="HAMBURG">汉堡港 Hamburg</Option>
                 <Option value="LOS ANGELES">洛杉矶港 Los Angeles</Option>
                 <Option value="NEW YORK">纽约港 New York</Option>
              </Select>
            </Col>
            <Col span={6}>
               <div style={{ marginBottom: 8, fontWeight: 'bold' }}>箱型</div>
               <Select
                  mode="multiple"
                  placeholder="请选择箱型"
                  value={selectedContainerTypes}
                  onChange={handleContainerTypeChange}
                  style={{ width: '100%' }}
                  maxTagCount={3}
                  allowClear
                  dropdownRender={(menu) => {
                    const allValues = containerTypeOptions.map(o => o.value);
                    const isAllSelected = allValues.length > 0 && selectedContainerTypes.length === allValues.length;
                    
                    return (
                      <div>
                         <div style={{ padding: '8px 12px', borderBottom: '1px solid #e5e6eb' }}>
                           <Checkbox 
                             checked={isAllSelected} 
                             onChange={(checked) => {
                               handleContainerTypeChange(checked ? allValues : []);
                             }}
                           >
                             全选
                           </Checkbox>
                         </div>
                         {menu}
                      </div>
                    );
                  }}
                >
                  {containerTypeOptions.map(option => (
                    <Option key={option.value} value={option.value}>
                      {option.value === '20GP' ? (
                        <div className="flex items-center justify-between w-full" onClick={(e) => e.stopPropagation()}>
                          <span>{option.label}</span>
                          <Input 
                            size="mini" 
                            style={{ width: '100px', marginLeft: '8px' }} 
                            placeholder="请输入" 
                            suffix="KG"
                            onClick={(e) => e.stopPropagation()}
                          />
                        </div>
                      ) : (
                        option.label
                      )}
                    </Option>
                  ))}
                </Select>
            </Col>
            <Col span={6}>
               <div style={{ marginBottom: 8, fontWeight: 'bold' }}>船公司</div>
               <Select
                  mode="multiple"
                  placeholder="请选择船公司"
                  value={selectedShippingCompanies}
                  onChange={handleShippingCompanyChange}
                  style={{ width: '100%' }}
                  maxTagCount={3}
                  allowClear
                  dropdownRender={(menu) => {
                    const allValues = shippingCompanyOptions.map(o => o.value);
                    const isAllSelected = allValues.length > 0 && selectedShippingCompanies.length === allValues.length;
                    
                    return (
                      <div>
                         <div style={{ padding: '8px 12px', borderBottom: '1px solid #e5e6eb' }}>
                           <Checkbox 
                             checked={isAllSelected} 
                             onChange={(checked) => {
                               handleShippingCompanyChange(checked ? allValues : []);
                             }}
                           >
                             全选
                           </Checkbox>
                         </div>
                         {menu}
                      </div>
                    );
                  }}
                >
                  {shippingCompanyOptions.map(option => (
                    <Option key={option.value} value={option.value}>
                      {option.label}
                    </Option>
                  ))}
                </Select>
            </Col>
          </Row>
          <Row gutter={24} style={{ marginTop: 16 }}>
             <Col span={24} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Space>
                  <Button 
                    type="primary"
                    status="success"
                    icon={<IconTrophy />} 
                    onClick={() => navigate('/controltower/freight-rate-ranking')}
                  >
                    运价榜单
                  </Button>
                  <Button 
                    type="primary"
                    style={{ background: 'linear-gradient(to right, #3B82F6, #7C3AED)', border: 'none' }}
                    icon={<IconRobot />} 
                    onClick={handleAiAnalysis}
                  >
                    AI分析
                  </Button>
                </Space>
                <Space>
                  <Button type="primary" icon={<IconSearch />} onClick={handleEcommerceSearch} loading={isSearching}>查询</Button>
                  <Button icon={<IconRefresh />}>重置</Button>
                </Space>
             </Col>
          </Row>
        </Card>
      );
    }

    const handleRecentSearchClick = (search: any) => {
      // 这里可以添加自动填充逻辑
      console.log('点击最近搜索:', search);
    };

    return (
      <Card className="search-card" style={{ marginBottom: 24 }}>
        <Row gutter={24} align="center">
          <Col span={6}>
            <div style={{ marginBottom: 8 }}>
              <span style={{ fontWeight: 'bold' }}>起运港</span>
            </div>
            <Select
              placeholder="请输入起运港"
              style={{ width: '100%' }}
              showSearch
              filterOption={(inputValue, option) => {
                const children = (option as any)?.props?.children?.toString() || '';
                const value = (option as any)?.props?.value?.toString() || '';
                return children.toLowerCase().includes(inputValue.toLowerCase()) ||
                       value.toLowerCase().includes(inputValue.toLowerCase());
              }}
            >
              <Option value="CNSHA">上海港 Shanghai (CNSHA)</Option>
              <Option value="CNNGB">宁波港 Ningbo (CNNGB)</Option>
              <Option value="CNSZX">深圳港 Shenzhen (CNSZX)</Option>
              <Option value="CNYTN">烟台港 Yantian (CNYTN)</Option>
              <Option value="CNQIN">青岛港 Qingdao (CNQIN)</Option>
              <Option value="SGSIN">新加坡港 Singapore (SGSIN)</Option>
              <Option value="DEHAM">汉堡港 Hamburg (DEHAM)</Option>
              <Option value="NLRTM">鹿特丹港 Rotterdam (NLRTM)</Option>
              <Option value="USLAX">洛杉矶港 Los Angeles (USLAX)</Option>
              <Option value="USOAK">奥克兰港 Oakland (USOAK)</Option>
              <Option value="GBFXT">费力克斯托港 Felixstowe (GBFXT)</Option>
            </Select>
          </Col>
          
          <Col span={6}>
            <div style={{ marginBottom: 8 }}>
              <span style={{ fontWeight: 'bold' }}>目的港</span>
            </div>
            <Select
              placeholder="请输入目的港"
              style={{ width: '100%' }}
              showSearch
              filterOption={(inputValue, option) => {
                const children = (option as any)?.props?.children?.toString() || '';
                const value = (option as any)?.props?.value?.toString() || '';
                return children.toLowerCase().includes(inputValue.toLowerCase()) ||
                       value.toLowerCase().includes(inputValue.toLowerCase());
              }}
            >
              <Option value="CNSHA">上海港 Shanghai (CNSHA)</Option>
              <Option value="CNNGB">宁波港 Ningbo (CNNGB)</Option>
              <Option value="CNSZX">深圳港 Shenzhen (CNSZX)</Option>
              <Option value="CNYTN">烟台港 Yantian (CNYTN)</Option>
              <Option value="CNQIN">青岛港 Qingdao (CNQIN)</Option>
              <Option value="SGSIN">新加坡港 Singapore (SGSIN)</Option>
              <Option value="DEHAM">汉堡港 Hamburg (DEHAM)</Option>
              <Option value="NLRTM">鹿特丹港 Rotterdam (NLRTM)</Option>
              <Option value="USLAX">洛杉矶港 Los Angeles (USLAX)</Option>
              <Option value="USOAK">奥克兰港 Oakland (USOAK)</Option>
              <Option value="GBFXT">费力克斯托港 Felixstowe (GBFXT)</Option>
            </Select>
          </Col>

          <Col span={6}>
            <div style={{ marginBottom: 8 }}>
              <span style={{ fontWeight: 'bold' }}>货好时间</span>
            </div>
            <div className="flex items-center">
              <div className="mr-3 flex items-center">
                <Radio.Group
                  type="button"
                  name="cargoReadyTimeType"
                  value={cargoTimeMode}
                  onChange={(value) => setCargoTimeMode(value)}
                >
                  <Radio value="range">区间</Radio>
                  <Radio value="date">日期</Radio>
                </Radio.Group>
              </div>
              <div className="flex-1">
                {cargoTimeMode === 'range' ? (
                  <Select
                    value={cargoTimeRange}
                    onChange={setCargoTimeRange}
                    style={{ width: '100%' }}
                  >
                    <Option value="一周内">一周内</Option>
                    <Option value="二周内">二周内</Option>
                    <Option value="一个月内">一个月内</Option>
                    <Option value="二个月内">二个月内</Option>
                  </Select>
                ) : (
                  <DatePicker
                    value={cargoDate}
                    onChange={setCargoDate}
                    style={{ width: '100%' }}
                    placeholder="请选择货好时间"
                  />
                )}
              </div>
            </div>
          </Col>
          
          <Col span={6}>
            <div style={{ marginBottom: 8 }}>
              <span>&nbsp;</span>
            </div>
            <Space>
              <Button 
                type="primary" 
                icon={<IconSearch />}
                size="large"
              >
                查询
              </Button>
              <Button 
                icon={<IconRefresh />}
                size="large"
              >
                重置
              </Button>
            </Space>
          </Col>
        </Row>

        <Row gutter={24} style={{ marginTop: 16 }}>
           <Col span={24}>
              <Space>
                <Button 
                  type="primary"
                  status="success"
                  icon={<IconTrophy />} 
                  onClick={() => navigate('/controltower/freight-rate-ranking')}
                >
                  运价榜单
                </Button>
                <Button 
                  type="primary"
                  style={{ background: 'linear-gradient(to right, #3B82F6, #7C3AED)', border: 'none' }}
                  icon={<IconRobot />} 
                  onClick={handleAiAnalysis}
                >
                  AI分析
                </Button>
              </Space>
           </Col>
        </Row>

        {/* 最近搜索区域 */}
        <div style={{ marginTop: 24, borderTop: '1px solid #f0f0f0', paddingTop: 16 }}>
          <div style={{ marginBottom: 12 }}>
            <span style={{ fontWeight: 'bold', color: '#666' }}>最近搜索</span>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {recentSearches.map((search, index) => (
              <Tag
                key={index}
                style={{ 
                  cursor: 'pointer',
                  padding: '4px 12px',
                  borderRadius: '16px',
                  backgroundColor: '#f5f5f5',
                  border: '1px solid #d9d9d9'
                }}
                onClick={() => handleRecentSearchClick(search)}
              >
                {search.origin} → {search.destination}, {search.cargoTime}
              </Tag>
            ))}
          </div>
        </div>
      </Card>
    );
  };

  // 通用查询处理
  const handleSearch = () => {
    if (activeTab === 'ecommerce') {
      handleEcommerceSearch();
    } else {
      Message.info('查询功能仅在电商运价Tab演示');
    }
  };

  // 渲染列表模式筛选区域
  const renderListModeFilterArea = () => {
    // 始终显示所有可见的筛选条件
    const conditionsToShow = getVisibleConditions();
    
    return (
      <Card className="mb-4 filter-area-card">
        {/* 筛选条件网格 - 直接放置，无额外包装 */}
        <Row gutter={[20, 20]}>
          {conditionsToShow.map((condition) => renderFilterCondition(condition))}
        </Row>
        
        {/* 操作按钮放在右下角 */}
        <div className="flex justify-between mt-4">
          <Space>
            <Button 
              type="primary"
              status="success"
              icon={<IconTrophy />} 
              onClick={() => navigate('/controltower/freight-rate-ranking')}
            >
              运价榜单
            </Button>
            <Button 
              type="primary"
              style={{ background: 'linear-gradient(to right, #3B82F6, #7C3AED)', border: 'none' }}
              icon={<IconRobot />} 
              onClick={handleAiAnalysis}
            >
              AI分析
            </Button>
          </Space>
          <Space size="medium">
            <Button 
              type="primary" 
              icon={<IconSearch />}
              className="search-btn"
              size="small"
              onClick={handleSearch}
              loading={isSearching}
            >
              查询
            </Button>
            <Button 
              icon={<IconRefresh />} 
              onClick={resetFilterConditions}
              className="reset-btn"
              size="small"
            >
              重置
            </Button>
          </Space>
        </div>

        {/* 添加自定义样式 */}
        <style dangerouslySetInnerHTML={{
          __html: `
            .filter-area-card {
              background: linear-gradient(135deg, #f8fafc 0%, #ffffff 100%);
              border: 1px solid #e2e8f0;
              box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
            }
            
            .filter-label-row {
              min-height: 24px;
            }
            
            .filter-mode-select .arco-select-view {
              background: #f1f5f9;
              border: 1px solid #cbd5e1;
            }
            
            .filter-input-wrapper .arco-input,
            .filter-input-wrapper .arco-select-view,
            .filter-input-wrapper .arco-picker {
              border: 1px solid #d1d5db;
              transition: border-color 0.2s ease;
            }
            
            .filter-input-wrapper .arco-input:focus,
            .filter-input-wrapper .arco-select-view:focus,
            .filter-input-wrapper .arco-picker:focus {
              border-color: #3b82f6;
              box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
            }
            
            .search-btn {
              background: linear-gradient(45deg, #3b82f6, #1d4ed8);
              border: none;
              font-weight: 500;
            }
            
            .reset-btn {
              border: 1px solid #e2e8f0;
              background: white;
              transition: all 0.2s ease;
            }
            
            .reset-btn:hover {
              border-color: #3b82f6;
              color: #3b82f6;
            }
          `
        }} />
      </Card>
    );
  };

  // 渲染置顶区域
  const renderPinnedSection = () => {
    const pinnedData = getPinnedData();
    if (pinnedData.length === 0) return null;

    const visiblePinnedData = showAllPinned ? pinnedData : pinnedData.slice(0, 10);
    const hasMore = pinnedData.length > 10;

    // Calculate checkbox state for pinned section
    const visiblePinnedKeys = visiblePinnedData.map((item: any) => item.key);
    const selectedPinnedCount = selectedRowKeys.filter(key => visiblePinnedKeys.includes(key)).length;
    const isPinnedAllSelected = visiblePinnedData.length > 0 && selectedPinnedCount === visiblePinnedData.length;
    const isPinnedIndeterminate = selectedPinnedCount > 0 && selectedPinnedCount < visiblePinnedData.length;

    // Handle Pinned Select All
    const handlePinnedSelectAll = (checked: boolean) => {
      if (checked) {
        // Add all visible pinned keys to selectedRowKeys, keeping existing non-pinned selections
        const otherSelected = selectedRowKeys.filter(key => !visiblePinnedKeys.includes(key));
        const newSelected = Array.from(new Set([...otherSelected, ...visiblePinnedKeys]));
        setSelectedRowKeys(newSelected);
      } else {
        // Remove all visible pinned keys from selectedRowKeys
        const newSelected = selectedRowKeys.filter(key => !visiblePinnedKeys.includes(key));
        setSelectedRowKeys(newSelected);
      }
    };

    return (
      <div className="mb-4">
        <div className="bg-gray-100 p-2 rounded-t flex justify-between items-center border-b border-gray-200">
           <div className="flex items-center text-gray-700 font-bold">
              <Checkbox 
                checked={isPinnedAllSelected} 
                indeterminate={isPinnedIndeterminate}
                onChange={handlePinnedSelectAll}
                className="mr-2"
              />
              <IconPushpin className="mr-2 text-blue-600" />
              <span>置顶运价 ({pinnedData.length})</span>
           </div>
           {hasMore && (
             <Button 
               type="text" 
               size="mini" 
               onClick={() => setShowAllPinned(!showAllPinned)}
               className="text-blue-600"
             >
               {showAllPinned ? '收起置顶运价' : '展开全部置顶运价'}
             </Button>
           )}
        </div>
        
        <div className="bg-gray-50 border border-gray-200 rounded-b p-2 overflow-hidden">
          {viewMode === 'list' ? (
             <Table
               rowKey="key"
               rowSelection={activeTab === 'ecommerce' ? {
                 type: 'checkbox',
                 selectedRowKeys,
                 onSelect: (selected, record) => {
                    handleRowSelect(record.key, selected);
                 },
                 onSelectAll: (selected, selectedRows) => {
                    const currentTableKeys = visiblePinnedData.map((r: any) => r.key);
                    if (selected) {
                       const newSet = new Set([...selectedRowKeys, ...currentTableKeys]);
                       setSelectedRowKeys(Array.from(newSet));
                    } else {
                       const newKeys = selectedRowKeys.filter(k => !currentTableKeys.includes(k));
                       setSelectedRowKeys(newKeys);
                    }
                 }
               } : undefined}
               loading={false}
               columns={getTableColumns()}
               data={visiblePinnedData}
               pagination={false}
               scroll={{ x: 2740 }}
               border={false}
               className="inquiry-table-nowrap pinned-table"
             />
          ) : (
             <CardView data={visiblePinnedData} />
          )}
        </div>
      </div>
    );
  };

  const getPinButtonText = () => {
    const pinnedSelected = selectedRowKeys.filter(key => pinnedRateIds.includes(key));
    const unpinnedSelected = selectedRowKeys.filter(key => !pinnedRateIds.includes(key));
    
    if (pinnedSelected.length > 0 && unpinnedSelected.length > 0) {
      return '置换置顶';
    } else if (pinnedSelected.length > 0) {
      return '取消置顶';
    } else {
      return '运价置顶';
    }
  };

  return (
    <ControlTowerSaasLayout menuSelectedKey="3" breadcrumb={
      <Breadcrumb>
        <Breadcrumb.Item>运价管理</Breadcrumb.Item>
        <Breadcrumb.Item>运价查询</Breadcrumb.Item>
      </Breadcrumb>
    }>
      {contextHolder}
      {modalContextHolder}
      <Card>
        <div className="flex justify-between items-center mb-4">
          <Tabs activeTab={activeTab} onChange={handleTabChange} className="flex-1">
            <TabPane key="ecommerce" title="电商运价" />
            <TabPane key="fcl" title="整箱运价" />
            <TabPane key="lcl" title="拼箱运价" />
            <TabPane key="air" title="空运运价" />
            <TabPane key="precarriage" title="港前运价" />
            <TabPane key="oncarriage" title="尾程运价" />
          </Tabs>
          <div className="flex items-center space-x-2 ml-4">
            <span className="text-sm text-gray-600">列表式</span>
            <Switch 
              checked={viewMode === 'card'} 
              onChange={handleViewModeChange}
              size="small"
            />
            <span className="text-sm text-gray-600">卡片式</span>
          </div>
        </div>
        
        {/* 筛选区域 - 根据视图模式切换 */}
        {viewMode === 'card' ? renderCardModeFilterArea() : renderListModeFilterArea()}
        
        <Card>
          <div className="flex justify-between mb-4">
            <Space>
              {(activeTab === 'fcl' || activeTab === 'lcl' || activeTab === 'air') && (
                <Button 
                  type="primary" 
                  icon={<IconSearch />} 
                  onClick={openCombinationQuery}
                >
                  组合方案查询
                </Button>
              )}
              {viewMode === 'card' && (
                <div className="flex items-center mr-2">
                  <Checkbox 
                    checked={selectAll} 
                    onChange={handleSelectAll}
                  >
                    全选
                  </Checkbox>
                </div>
              )}
              <Button icon={<IconDownload />} onClick={handleExportRate}>导出运价</Button>
              <Button type="primary" status="warning" icon={<IconPushpin />} onClick={handlePinOperation}>{getPinButtonText()}</Button>
              <Button 
                type="primary" 
                icon={<IconSearch />} 
                onClick={handleBatchQuote}
                disabled={selectedRowKeys.length === 0}
              >
                快速报价
              </Button>
            </Space>
            <div className="flex items-center space-x-4">
              {/* ETD/ETA 筛选 - 仅在卡片模式显示 */}
              {viewMode === 'card' && (
                <>
                  <div className="flex items-center space-x-2">
                    <span className="text-gray-600 text-xs">ETD:</span>
                    <RangePicker 
                      style={{ width: 200 }} 
                      size="small"
                      value={etdDateRange}
                      onChange={setEtdDateRange}
                    />
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-gray-600 text-xs">ETA:</span>
                    <RangePicker 
                      style={{ width: 200 }} 
                      size="small"
                      value={etaDateRange}
                      onChange={setEtaDateRange}
                    />
                  </div>
                </>
              )}
              {/* 价格展示 - 仅在卡片模式显示 */}
              {viewMode === 'card' && (
                <div className="flex items-center space-x-2">
                  <Checkbox.Group 
                    value={priceDisplayMode} 
                    onChange={setPriceDisplayMode}
                    options={[
                      { label: 'Base', value: 'base' },
                      { label: 'Total', value: 'total' }
                    ]}
                  />
                </div>
              )}
              {/* 运输类型筛选 - 仅在卡片模式显示 */}
              {viewMode === 'card' && (
                <Radio.Group 
                  type="button"
                  value={transitFilter} 
                  onChange={setTransitFilter}
                  style={{ marginRight: '16px' }}
                >
                  <Radio value="all">全部</Radio>
                  <Radio value="direct">直达</Radio>
                  <Radio value="transit">中转</Radio>
                </Radio.Group>
              )}
              {/* 筛选字段 - 仅在卡片模式显示 */}
              {viewMode === 'card' && (
                <div className="flex items-center space-x-2">
                  <Button 
                     size="small" 
                     icon={sortField === 'earliest' ? 
                       (sortOrder === 'asc' ? <IconUp style={{color: '#1890ff'}} /> : <IconDown style={{color: '#1890ff'}} />) : 
                       <IconUp style={{color: '#d9d9d9'}} />
                     }
                     onClick={() => {
                       if (sortField === 'earliest') {
                         setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
                       } else {
                         setSortField('earliest');
                         setSortOrder('asc');
                       }
                     }}
                   >
                     最早的
                   </Button>
                   <Button 
                     size="small" 
                     icon={sortField === 'fastest' ? 
                       (sortOrder === 'asc' ? <IconUp style={{color: '#1890ff'}} /> : <IconDown style={{color: '#1890ff'}} />) : 
                       <IconUp style={{color: '#d9d9d9'}} />
                     }
                     onClick={() => {
                       if (sortField === 'fastest') {
                         setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
                       } else {
                         setSortField('fastest');
                         setSortOrder('asc');
                       }
                     }}
                   >
                     最快的
                   </Button>
                   <div className="container-dropdown-wrapper" style={{ position: 'relative', display: 'inline-block' }}>
                     <Button 
                       size="small" 
                       icon={sortField === 'cheapest' ? 
                         (sortOrder === 'asc' ? <IconUp style={{color: '#1890ff'}} /> : <IconDown style={{color: '#1890ff'}} />) : 
                         <IconUp style={{color: '#d9d9d9'}} />
                       }
                       onClick={() => {
                         setShowContainerDropdown(!showContainerDropdown);
                       }}
                     >
                       最便宜的
                     </Button>
                     {showContainerDropdown && (
                       <div style={{
                         position: 'absolute',
                         top: '100%',
                         left: 0,
                         zIndex: 1000,
                         backgroundColor: 'white',
                         border: '1px solid #d9d9d9',
                         borderRadius: '4px',
                         boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
                         minWidth: '120px',
                         marginTop: '4px'
                       }}>
                         {['20GP', '40GP', '40HC', '20NOR', '40NOR', '45HC', '20FR', '40FR', '20OT', '40OT', '20TK', '40TK', '20HC'].map((containerType) => (
                           <div
                             key={containerType}
                             style={{
                               padding: '8px 12px',
                               cursor: 'pointer',
                               borderBottom: '1px solid #f0f0f0',
                               fontSize: '14px'
                             }}
                             onMouseEnter={(e) => {
                               e.currentTarget.style.backgroundColor = '#f5f5f5';
                             }}
                             onMouseLeave={(e) => {
                               e.currentTarget.style.backgroundColor = 'white';
                             }}
                             onClick={() => {
                               setSelectedContainerType(containerType);
                               setShowContainerDropdown(false);
                               setSortField('cheapest');
                               setSortOrder('asc');
                             }}
                           >
                             {containerType}
                           </div>
                         ))}
                       </div>
                     )}
                   </div>
                </div>
              )}
              {viewMode === 'list' && (
                <>
                  <div className="flex items-center mr-2">
                    <span className="text-gray-600 mr-2 text-xs">ETD:</span>
                    <RangePicker 
                      style={{ width: 200 }} 
                      size="small"
                      value={etdDateRange}
                      onChange={setEtdDateRange}
                    />
                  </div>
                  <div className="flex items-center mr-4">
                    <span className="text-gray-600 mr-2 text-xs">ETA:</span>
                    <RangePicker 
                      style={{ width: 200 }} 
                      size="small"
                      value={etaDateRange}
                      onChange={setEtaDateRange}
                    />
                  </div>
                  <div 
                    className="flex items-center text-blue-500 cursor-pointer hover:text-blue-700"
                    onClick={openCustomTableModal}
                  >
                    <IconList className="mr-1" />
                    <span>自定义表格</span>
                  </div>
                </>
              )}
            </div>
          </div>
          
          {activeTab === 'ecommerce' && !hasSearched ? (
            <div style={{ padding: '80px 0' }}>
               <Empty
                 icon={<IconSearch style={{ fontSize: 48, color: 'var(--color-text-3)' }} />}
                 description="请选择筛选条件并点击【查询】以搜索电商运价"
               />
            </div>
          ) : (
            <>
              {renderPinnedSection()}

              {viewMode === 'list' ? (
                <Table
                  rowKey="key"
                  rowSelection={activeTab === 'ecommerce' ? {
                    type: 'checkbox',
                    selectedRowKeys,
                    onSelect: (selected, record) => {
                      handleRowSelect(record.key, selected);
                    },
                    onSelectAll: (selected, selectedRows) => {
                      const currentTableKeys = getUnpinnedData().map((r: any) => r.key);
                      if (selected) {
                        // 全选时，保留已选中的置顶项，添加当前列表所有项
                        const pinnedSelected = selectedRowKeys.filter(key => pinnedRateIds.includes(key));
                        const newSet = new Set([...pinnedSelected, ...currentTableKeys]);
                        setSelectedRowKeys(Array.from(newSet));
                      } else {
                        // 取消全选时，仅取消当前列表项的选择，保留置顶项
                        const newKeys = selectedRowKeys.filter(k => !currentTableKeys.includes(k));
                        setSelectedRowKeys(newKeys);
                      }
                    }
                  } : undefined}
                  loading={false}
                  columns={getTableColumns()}
                  data={getUnpinnedData()}
                  pagination={pagination}
                  scroll={{ x: 2740 }}
                  border={false}
                  className="mt-4 inquiry-table-nowrap"
                />
              ) : (
                <>
                  <CardView data={getUnpinnedData()} />
                  <div className="flex justify-center mt-6">
                    <Pagination
                      total={pagination.total}
                      pageSize={pagination.pageSize}
                      current={pagination.current}
                      showTotal={pagination.showTotal}
                      showJumper={pagination.showJumper}
                      sizeCanChange={pagination.sizeCanChange}
                      sizeOptions={pagination.sizeOptions}
                    />
                  </div>
                </>
              )}
            </>
          )}
          
          {/* 添加自定义样式 */}
          <style dangerouslySetInnerHTML={{
            __html: `
              .no-ellipsis {
                white-space: nowrap !important;
                overflow: visible !important;
                text-overflow: unset !important;
              }
              .inquiry-table-nowrap .arco-table-td .arco-table-cell {
                white-space: nowrap !important;
                overflow: visible !important;
                text-overflow: unset !important;
              }
              .pinned-table .arco-table-tr .arco-table-td {
                background-color: #f9fafb !important;
              }
              .pinned-table .arco-table-tr:hover .arco-table-td {
                background-color: #f3f4f6 !important;
              }
            `
          }} />
          {(activeTab !== 'ecommerce' || hasSearched) && <div className="mt-2 text-gray-500 text-sm">共 9232 条</div>}
        </Card>
      </Card>

      {/* 自定义表格抽屉 */}
      <Drawer
        title={
          <div className="flex items-center gap-2">
            <IconSettings />
            <span>自定义表格</span>
          </div>
        }
        visible={customTableModalVisible}
        onCancel={closeCustomTableModal}
        width={480}
        footer={
          <div className="flex justify-between">
            <Button onClick={activeTab === 'ecommerce' ? resetEcommerceSettings : resetColumnVisibility}>
              重置默认
            </Button>
            <div>
              <Button onClick={closeCustomTableModal} style={{ marginRight: 8 }}>
                取消
              </Button>
              <Button type="primary" onClick={activeTab === 'ecommerce' ? saveEcommerceSettings : applyColumnSettings}>
                确认
              </Button>
            </div>
          </div>
        }
      >
        {activeTab === 'ecommerce' ? (
          <div className="space-y-4">
            <div className="bg-gray-50 p-3 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">
                  已选择 {Object.values(ecommerceColumnSettings.visible).filter(Boolean).length} / {ecommerceColumnSettings.order.length} 个字段
                </span>
                <div className="space-x-2">
                  <Button 
                    size="small" 
                    onClick={() => {
                      const newVisible = { ...ecommerceColumnSettings.visible };
                      ecommerceColumnSettings.order.forEach(key => newVisible[key] = true);
                      setEcommerceColumnSettings(prev => ({ ...prev, visible: newVisible }));
                    }}
                  >
                    全选
                  </Button>
                  <Button 
                    size="small" 
                    onClick={() => {
                      const newVisible = { ...ecommerceColumnSettings.visible };
                      ecommerceColumnSettings.order.forEach(key => newVisible[key] = false);
                      setEcommerceColumnSettings(prev => ({ ...prev, visible: newVisible }));
                    }}
                  >
                    清空
                  </Button>
                </div>
              </div>
            </div>
            <div className="space-y-2">
              {ecommerceColumnSettings.order.map((columnKey, index) => {
                const column = ALL_ECOMMERCE_COLUMNS.find(c => c.dataIndex === columnKey);
                return (
                  <div
                    key={columnKey}
                    className={`flex items-center gap-3 p-3 border border-gray-200 bg-white hover:bg-gray-50 transition-colors ${
                      draggedItem === columnKey ? 'opacity-50' : ''
                    } ${
                      dragOverItem === columnKey ? 'border-blue-400 border-2' : ''
                    }`}
                    draggable
                    onDragStart={(e) => handleDragStart(e, columnKey)}
                    onDragOver={(e) => handleDragOver(e, columnKey)}
                    onDrop={(e) => handleEcommerceDrop(e, columnKey)}
                    onDragEnd={handleDragEnd}
                  >
                    <IconDragDotVertical className="text-gray-400 cursor-move" />
                    <div className="flex items-center justify-center w-6 h-5 bg-gray-100 text-xs text-gray-600 font-medium rounded" style={{ minWidth: '24px' }}>
                      {index + 1}
                    </div>
                    <span className="flex-1 text-sm">{column?.title || columnKey}</span>
                    <Switch
                      size="small"
                      checked={ecommerceColumnSettings.visible[columnKey]}
                      onChange={(checked) => {
                         setEcommerceColumnSettings(prev => ({
                           ...prev,
                           visible: { ...prev.visible, [columnKey]: checked }
                         }));
                      }}
                    />
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
        <div className="space-y-4">
          {/* 快捷操作区域 */}
          <div className="bg-gray-50 p-3 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">
                已选择 {Object.values(columnVisibility).filter(Boolean).length} / {Object.keys(columnVisibility).length} 个字段
              </span>
              <div className="space-x-2">
                <Button 
                  size="small" 
                  onClick={() => {
                    const newVisibility: any = {};
                    Object.keys(columnVisibility).forEach(key => {
                      newVisibility[key] = true;
                    });
                    setColumnVisibility(newVisibility);
                  }}
                >
                  全选
                </Button>
                <Button 
                  size="small" 
                  onClick={() => {
                    const newVisibility: any = {};
                    Object.keys(columnVisibility).forEach(key => {
                      newVisibility[key] = false;
                    });
                    setColumnVisibility(newVisibility);
                  }}
                >
                  清空
                </Button>
              </div>
            </div>
          </div>

          {/* 字段列表 */}
          <div className="space-y-2">
            {columnOrder.map((columnKey, index) => (
              <div
                key={columnKey}
                className={`flex items-center gap-3 p-3 border border-gray-200 bg-white hover:bg-gray-50 transition-colors ${
                  draggedItem === columnKey ? 'opacity-50' : ''
                } ${
                  dragOverItem === columnKey ? 'border-blue-400 border-2' : ''
                }`}
                draggable
                onDragStart={(e) => handleDragStart(e, columnKey)}
                onDragOver={(e) => handleDragOver(e, columnKey)}
                onDrop={(e) => handleDrop(e, columnKey)}
                onDragEnd={handleDragEnd}
              >
                <IconDragDotVertical className="text-gray-400 cursor-move" />
                <div className="flex items-center justify-center w-6 h-5 bg-gray-100 text-xs text-gray-600 font-medium rounded" style={{ minWidth: '24px' }}>
                  {index + 1}
                </div>
                <span className="flex-1 text-sm">{getColumnLabel(columnKey)}</span>
                <Switch
                  size="small"
                  checked={columnVisibility[columnKey as keyof typeof columnVisibility]}
                  onChange={(checked) => handleColumnVisibilityChange(columnKey, checked)}
                />
              </div>
            ))}
          </div>
        </div>
        )}
      </Drawer>

      {/* 筛选字段抽屉 */}
      <Drawer
        title={
          <div className="flex items-center gap-2">
            <IconSettings />
            <span>增减条件</span>
          </div>
        }
        visible={filterFieldModalVisible}
        onCancel={closeFilterFieldModal}
        width={480}
        footer={
          <div className="flex justify-between">
            <Button onClick={() => {
              const defaultConditions = initializeDefaultConditions(activeTab);
              setFilterConditions(defaultConditions);
            }}>
              重置默认
            </Button>
            <div>
              <Button onClick={closeFilterFieldModal} style={{ marginRight: 8 }}>
                取消
              </Button>
              <Button type="primary" onClick={closeFilterFieldModal}>
                确认
              </Button>
            </div>
          </div>
        }
      >
        <div className="space-y-4">
          {/* 快捷操作区域 */}
          <div className="bg-gray-50 p-3 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">
                已选择 {filterConditions.filter(c => c.visible).length} / {filterConditions.length} 个字段
              </span>
              <div className="space-x-2">
                <Button 
                  size="small" 
                  onClick={() => {
                    setFilterConditions(prev => prev.map(condition => ({ ...condition, visible: true })));
                  }}
                >
                  全选
                </Button>
                <Button 
                  size="small" 
                  onClick={() => {
                    setFilterConditions(prev => prev.map(condition => ({ ...condition, visible: false })));
                  }}
                >
                  清空
                </Button>
              </div>
            </div>
          </div>

          {/* 筛选字段列表 */}
          <div className="space-y-2">
            {filterFieldOrder.map((fieldKey, index) => {
              const condition = filterConditions.find(c => c.key === fieldKey);
              const field = getFilterFieldsByTab(activeTab).find(f => f.key === fieldKey);
              if (!condition || !field) return null;

              return (
                <div
                  key={fieldKey}
                  className={`flex items-center gap-3 p-3 border border-gray-200 bg-white hover:bg-gray-50 transition-colors ${
                    draggedFilterField === fieldKey ? 'opacity-50' : ''
                  } ${
                    dragOverFilterField === fieldKey ? 'border-blue-400 border-2' : ''
                  }`}
                  draggable
                  onDragStart={(e) => handleFilterFieldDragStart(e, fieldKey)}
                  onDragOver={(e) => handleFilterFieldDragOver(e, fieldKey)}
                  onDrop={(e) => handleFilterFieldDrop(e, fieldKey)}
                  onDragEnd={handleFilterFieldDragEnd}
                >
                  <IconDragDotVertical className="text-gray-400 cursor-move" />
                  <div className="flex items-center justify-center w-6 h-5 bg-gray-100 text-xs text-gray-600 font-medium rounded" style={{ minWidth: '24px' }}>
                    {index + 1}
                  </div>
                  <span className="flex-1 text-sm">{field.label}</span>
                  <Switch
                    size="small"
                    checked={condition.visible}
                    onChange={(checked) => updateFilterConditionVisibility(fieldKey, checked)}
                  />
                </div>
              );
            })}
          </div>
        </div>
      </Drawer>

      {/* 保存方案弹窗 */}
      <Modal
        title="保存筛选方案"
        visible={schemeModalVisible}
        onCancel={closeSchemeModal}
        onOk={saveFilterScheme}
        okText="保存"
        cancelText="取消"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              方案名称
            </label>
            <Input
              placeholder="请输入方案名称"
              value={newSchemeName}
              onChange={setNewSchemeName}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              当前筛选条件
            </label>
            <div className="bg-gray-50 p-3 rounded">
              {getVisibleConditions().map(condition => {
                const field = getFilterFieldsByTab(activeTab).find(f => f.key === condition.key);
                return (
                  <div key={condition.key} className="text-sm text-gray-600">
                    {field?.label}: {FilterModeOptions.find(m => m.value === condition.mode)?.label} {condition.value || '(空)'}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </Modal>

      {/* 方案管理弹窗 */}
      <SchemeManagementModal
        visible={schemeManagementModalVisible}
        onCancel={closeSchemeManagementModal}
        schemes={allSchemes}
        onDeleteScheme={handleDeleteScheme}
        onSetDefault={handleSetDefaultScheme}
        onRenameScheme={handleRenameScheme}
      />

      {/* 批量报价弹窗 */}
      <BatchQuoteModal
        visible={batchQuoteModalVisible}
        onCancel={() => {
          setBatchQuoteModalVisible(false);
          setQuickQuoteItem(null);
        }}
        selectedItems={quickQuoteItem ? [{
            carrier: quickQuoteItem.shipCompany || quickQuoteItem.carrierName || '',
            origin: quickQuoteItem.departurePort || quickQuoteItem.pol || '',
            destination: quickQuoteItem.dischargePort || quickQuoteItem.pod || '',
            sailingTime: quickQuoteItem.vesselSchedule || quickQuoteItem.etd || ''
        }] : selectedRowKeys.map(key => {
          const currentData = getTableData();
          const item = currentData.find((d: any) => d.key === key);
          return {
            carrier: item?.shipCompany || item?.carrierName || '',
            origin: item?.departurePort || item?.pol || '',
            destination: item?.dischargePort || item?.pod || '',
            sailingTime: item?.vesselSchedule || item?.etd || ''
          };
        })}
      />

      {/* 船期查询弹窗 */}
      <SailingScheduleModal
        visible={sailingScheduleModalVisible}
        onCancel={() => setSailingScheduleModalVisible(false)}
      />

      {/* 运价趋势弹窗 */}
      <RateTrendModal
        visible={rateTrendModalVisible}
        onCancel={() => setRateTrendModalVisible(false)}
      />

      {/* 运价详情弹窗 */}
      <RateDetailModal
        visible={rateDetailModalVisible}
        onCancel={() => setRateDetailModalVisible(false)}
        data={currentRateDetail}
        initialActiveTab={rateDetailInitialTab}
      />

      {/* 导出成功提示弹窗 */}
      <Modal
        title="导出提示"
        visible={exportModalVisible}
        onCancel={handleCloseExportModal}
        footer={[
          <Button key="close" onClick={handleCloseExportModal}>
            关闭
          </Button>,
          <Button key="view" type="primary" onClick={handleViewTask}>
            查看任务
          </Button>
        ]}
        style={{ width: 400 }}
      >
        <div className="text-center py-4">
          <div className="text-green-600 text-lg mb-2">✓</div>
          <div className="text-gray-700">
            导出任务生成成功，请稍后在任务中心查看。
          </div>
        </div>
      </Modal>
      {/* 查询进度浮窗 */}
      <SearchProgress 
        visible={isSearching} 
        progressData={searchProgressData} 
      />
    </ControlTowerSaasLayout>
  );
};

export default RateQuery;