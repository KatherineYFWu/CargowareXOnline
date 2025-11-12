import React, { useState, useCallback, useMemo } from 'react';
import {
  ReactFlow,
  Node,
  Edge,
  addEdge,
  Connection,
  useNodesState,
  useEdgesState,
  Controls,
  MiniMap,
  Background,
  BackgroundVariant,
  NodeTypes,
  EdgeTypes,
  ReactFlowProvider,
  // useReactFlow,
  Panel,
  Handle,
  Position,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { Card, Button, Form, Input, Select, Message, Switch, Popconfirm, Upload, Drawer } from '@arco-design/web-react';
import { IconPlus, IconEdit, IconDelete, IconUpload } from '@arco-design/web-react/icon';

const { Option } = Select;

// 任务类型定义
type TaskType = 'external' | 'internal';
type TaskAssignmentType = 'dedicated_contact' | 'business_manager'; // 对接人类型：专属对接人 | 业务负责人
type PositionType = 'sales' | 'service' | 'documentation' | 'operation' | 'business';
type DedicatedContactType = 'dedicated_sales' | 'dedicated_service' | 'dedicated_operation' | 'dedicated_documentation' | 'dedicated_business' | 'dedicated_finance'; // 专属对接人类型

interface Task {
  id: string;
  name: string;
  type: TaskType;
  assignmentType?: TaskAssignmentType; // 对接人类型（仅内部任务使用）
  position?: PositionType; // 岗位字段（保留用于其他用途）
  dedicatedContact?: DedicatedContactType; // 专属对接人类型（当assignmentType为dedicated_contact时使用）
  skippable: boolean;
  parentTaskId?: string;
  relatedPage?: {
    name: string;
    url: string;
  };
  deadline?: {
    referencePoint: 'prev_task_complete' | 'task_activate' | 'prev_node' | 'origin_eta' | 'origin_etd' | 'origin_ata' | 'origin_atd' | 'dest_eta' | 'dest_etd' | 'dest_ata' | 'dest_atd';
    direction: 'before' | 'after';
    value: number;
    unit: 'minutes' | 'hours' | 'days' | 'weeks';
  };
}

// 业务节点数据类型
interface BusinessNodeData {
  id: string;
  name: string;
  description?: string;
  enabled: boolean;
  icon?: string;
  tasks: Task[];
}

// 开始节点组件
const StartNode: React.FC<{ 
  data: { id: string; name: string }; 
  selected: boolean;
}> = ({ selected }) => {
  return (
    <div className={`business-node start-node ${
      selected ? 'selected' : ''
    }`}>
      <Handle
        type="source"
        position={Position.Right}
        id="start-output"
        style={{
          background: '#7466F0',
          border: '2px solid #fff',
          width: '12px',
          height: '12px',
        }}
      />
      
      <Card
        className="node-card start-card"
        style={{
          width: '280px',
          minHeight: '120px',
          border: selected ? '2px solid #7466F0' : '2px solid #b7eb8f',
          borderRadius: '12px',
          background: 'linear-gradient(135deg, #b7eb8f 0%, #95de64 100%)',
          color: '#389e0d',
          boxShadow: selected 
            ? '0 8px 32px rgba(116, 102, 240, 0.3)' 
            : '0 4px 16px rgba(183, 235, 143, 0.2)',
        }}
      >
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <div className="text-xl font-bold mb-2">开始</div>
            <div className="text-sm opacity-90">工作流起始节点</div>
          </div>
        </div>
      </Card>
    </div>
  );
};

// 自定义业务节点组件 - 完全复制原来的renderNodeCard样式和功能
const BusinessNode: React.FC<{ 
  data: BusinessNodeData; 
  selected: boolean;
  onEdit?: (node: BusinessNodeData) => void;
  onDelete?: (nodeId: string) => void;
  onToggle?: (nodeId: string, enabled: boolean) => void;
  isFirst?: boolean;
  isLast?: boolean;
}> = ({ data, selected, onEdit, onDelete, onToggle, isFirst, isLast }) => {
  // const [showConnector, setShowConnector] = useState(false);
  
  return (
    <div 
      className={`business-node ${selected ? 'selected' : ''}`}
      // onMouseEnter={() => setShowConnector(true)}
      // onMouseLeave={() => setShowConnector(false)}
      style={{
        display: 'flex',
        alignItems: 'center',
        position: 'relative'
      }}
    >
      {/* 节点卡片 - 完全复制原来的样式 */}
      <Card
        style={{
          width: '280px',
          minHeight: '160px',
          border: data.enabled ? '1px solid #bae7ff' : '1px solid #f0f0f0',
          backgroundColor: data.enabled ? '#f0f8ff' : '#ffffff',
          cursor: 'pointer',
          borderRadius: '16px',
          boxShadow: data.enabled
            ? '0 8px 24px rgba(24, 144, 255, 0.12)'
            : '0 4px 16px rgba(0, 0, 0, 0.04)',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          position: 'relative',
          overflow: 'visible'
        }}
        size="small"
        hoverable
        onClick={() => onEdit?.(data)}
        onMouseEnter={(e) => {
          if (data.enabled) {
            e.currentTarget.style.transform = 'translateY(-4px) scale(1.02)';
            e.currentTarget.style.boxShadow = '0 12px 32px rgba(24, 144, 255, 0.2)';
            e.currentTarget.style.borderColor = '#91d5ff';
          } else {
            e.currentTarget.style.transform = 'translateY(-2px) scale(1.01)';
            e.currentTarget.style.boxShadow = '0 8px 24px rgba(0, 0, 0, 0.08)';
            e.currentTarget.style.borderColor = '#d9d9d9';
          }
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'translateY(0) scale(1)';
          e.currentTarget.style.boxShadow = data.enabled
            ? '0 8px 24px rgba(24, 144, 255, 0.12)'
            : '0 4px 16px rgba(0, 0, 0, 0.04)';
          e.currentTarget.style.borderColor = data.enabled ? '#bae7ff' : '#f0f0f0';
        }}
      >
        {/* 左侧状态指示器 */}
        <div style={{
          position: 'absolute',
          top: '20px',
          left: '0',
          width: '4px',
          height: '40px',
          borderRadius: '0 4px 4px 0',
          background: data.enabled
            ? 'linear-gradient(180deg, #1890ff, #40a9ff)'
            : '#d9d9d9',
          boxShadow: data.enabled
            ? '0 0 12px rgba(24, 144, 255, 0.6), 0 0 24px rgba(24, 144, 255, 0.3)'
            : 'none'
        }} />

        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          paddingLeft: '16px'
        }}>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '12px' }}>
              {/* 节点图标 */}
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                backgroundColor: data.enabled ? '#e6f7ff' : '#f5f5f5',
                border: `1px solid ${data.enabled ? '#91d5ff' : '#d9d9d9'}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginRight: '12px',
                overflow: 'hidden'
              }}>
                {data.icon ? (
                  <img 
                    src={data.icon} 
                    alt={data.name}
                    style={{
                      width: '20px',
                      height: '20px',
                      objectFit: 'cover'
                    }}
                  />
                ) : (
                  <IconPlus 
                    style={{
                      fontSize: '16px',
                      color: data.enabled ? '#1890ff' : '#8c8c8c'
                    }}
                  />
                )}
              </div>
              <span style={{
                fontWeight: '600',
                fontSize: '16px',
                color: data.enabled ? '#262626' : '#8c8c8c',
                lineHeight: '1.3',
                letterSpacing: '0.02em'
              }}>
                {data.name}
              </span>
            </div>

            {/* 任务数量显示 */}
            <div style={{ marginBottom: '12px' }}>
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                padding: '4px 12px',
                backgroundColor: data.enabled ? '#f0f9ff' : '#f5f5f5',
                border: `1px solid ${data.enabled ? '#bae7ff' : '#d9d9d9'}`,
                borderRadius: '20px',
                fontSize: '12px',
                fontWeight: '500',
                color: data.enabled ? '#1890ff' : '#8c8c8c'
              }}>
                <span style={{ 
                  width: '6px', 
                  height: '6px', 
                  borderRadius: '50%', 
                  backgroundColor: data.enabled ? '#1890ff' : '#d9d9d9',
                  marginRight: '6px'
                }} />
                {data.tasks.length} 个任务
              </div>
            </div>

            {data.description && (
              <div style={{
                fontSize: '12px',
                color: '#595959',
                lineHeight: '1.5',
                marginTop: '12px',
                padding: '8px 12px',
                backgroundColor: data.enabled ? '#f9f9f9' : '#fafafa',
                borderRadius: '8px',
                border: `1px solid ${data.enabled ? '#e6f7ff' : '#f0f0f0'}`,
                fontStyle: 'italic'
              }}>
                {data.description}
              </div>
            )}
          </div>

          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            marginLeft: '16px',
            gap: '8px'
          }}>
            <div style={{
              padding: '6px',
              borderRadius: '8px',
              backgroundColor: data.enabled ? '#f0f9ff' : '#fafafa',
              border: `1px solid ${data.enabled ? '#d4edda' : '#e9ecef'}`
            }}>
              <Switch
                size="small"
                checked={data.enabled}
                onChange={(checked) => onToggle?.(data.id, checked)}
                onClick={(e) => e.stopPropagation()}
              />
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <Button
                type="text"
                size="mini"
                icon={<IconEdit />}
                style={{
                  color: '#1890ff',
                  backgroundColor: 'rgba(24, 144, 255, 0.1)',
                  borderRadius: '6px',
                  width: '28px',
                  height: '28px'
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit?.(data);
                }}
              />
              {!isFirst && !isLast && (
                <Popconfirm
                  title="确认删除节点"
                  content="删除后不可恢复，确定要删除这个业务节点吗？"
                  onOk={(e) => {
                    e?.stopPropagation();
                    onDelete?.(data.id);
                  }}
                  onCancel={(e) => {
                    e?.stopPropagation();
                  }}
                  okText="确定删除"
                  cancelText="取消"
                  position="top"
                >
                  <Button
                    type="text"
                    size="mini"
                    status="danger"
                    icon={<IconDelete />}
                    style={{
                      backgroundColor: 'rgba(255, 77, 79, 0.1)',
                      borderRadius: '6px',
                      width: '28px',
                      height: '28px'
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                    }}
                  />
                </Popconfirm>
              )}
            </div>
          </div>
        </div>
      </Card>
      
      {/* React Flow 连接点 */}
      <Handle
        type="target"
        position={Position.Left}
        style={{
          width: '12px',
          height: '12px',
          backgroundColor: '#52c41a',
          border: '2px solid white',
          borderRadius: '50%'
        }}
      />
      
      <Handle
        type="source"
        position={Position.Right}
        style={{
          width: '12px',
          height: '12px',
          backgroundColor: '#1890ff',
          border: '2px solid white',
          borderRadius: '50%'
        }}
      />
    </div>
  );
};

// 自定义连接线组件
const CustomEdge: React.FC<any> = ({ 
  id, 
  sourceX, 
  sourceY, 
  targetX, 
  targetY, 
  // sourcePosition,
  // targetPosition,
  // data,
  markerEnd 
}) => {
  const [showAddButton, setShowAddButton] = useState(false);
  
  // 计算路径
  const edgePath = `M${sourceX},${sourceY} C${sourceX + 50},${sourceY} ${targetX - 50},${targetY} ${targetX},${targetY}`;
  
  // 计算中点位置
  const midX = (sourceX + targetX) / 2;
  const midY = (sourceY + targetY) / 2;
  
  return (
    <g>
      <path
        id={id}
        style={{ stroke: '#1890ff', strokeWidth: 2, fill: 'none' }}
        d={edgePath}
        markerEnd={markerEnd}
        onMouseEnter={() => setShowAddButton(true)}
        onMouseLeave={() => setShowAddButton(false)}
      />
      
      {/* 连接线上的加号按钮 */}
      {showAddButton && (
        <g>
          <circle
            cx={midX}
            cy={midY}
            r="12"
            fill="white"
            stroke="#1890ff"
            strokeWidth="2"
            style={{ cursor: 'pointer' }}
            onClick={() => {
              // 触发插入节点事件
              const event = new CustomEvent('insertNode', {
                detail: { edgeId: id, position: { x: midX, y: midY } }
              });
              window.dispatchEvent(event);
            }}
          />
          <text
            x={midX}
            y={midY + 1}
            textAnchor="middle"
            fontSize="14"
            fill="#1890ff"
            style={{ cursor: 'pointer', userSelect: 'none' }}
            onClick={() => {
              const event = new CustomEvent('insertNode', {
                detail: { edgeId: id, position: { x: midX, y: midY } }
              });
              window.dispatchEvent(event);
            }}
          >
            +
          </text>
        </g>
      )}
    </g>
  );
};

// 创建一个包装组件来传递回调函数
const createBusinessNodeWrapper = (
  onEdit: (node: BusinessNodeData) => void,
  onDelete: (nodeId: string) => void,
  onToggle: (nodeId: string, enabled: boolean) => void
) => {
  return (props: any) => (
    <BusinessNode
      {...props}
      onEdit={onEdit}
      onDelete={onDelete}
      onToggle={onToggle}
      isFirst={false}
      isLast={false}
    />
  );
};

// 开始节点包装器
const createStartNodeWrapper = () => {
  return (props: any) => (
    <StartNode {...props} />
  );
};

// 连接线类型定义
const edgeTypes: EdgeTypes = {
  custom: CustomEdge,
};

// 主要的流程编辑器组件
const FlowEditor: React.FC = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingNode, setEditingNode] = useState<BusinessNodeData | null>(null);
  const [form] = Form.useForm();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [showSaveConfirm, setShowSaveConfirm] = useState(false);

  // 关联页面选项
  const relatedPageOptions = [
    { label: '1-创建询价', value: '/inquiry/create', url: '/inquiry/create' },
    { label: '2-创建报价', value: '/quote/create', url: '/quote/create' },
    { label: '3-创建订舱申请 + 审核订舱申请', value: '/booking/create+review', url: '/booking/create', hasSubTask: true, subTaskUrl: '/booking/review', subTaskLabel: '审核订舱申请' },
    { label: '4-上传BC件 + 确认BC件', value: '/bc/upload+confirm', url: '/bc/upload', hasSubTask: true, subTaskUrl: '/bc/confirm', subTaskLabel: '确认BC件' },
    { label: '5-创建拖车申请 + 审核拖车申请', value: '/trailer/create+review', url: '/trailer/create', hasSubTask: true, subTaskUrl: '/trailer/review', subTaskLabel: '审核拖车申请' },
    { label: '6-创建派车单 + 确认派车单', value: '/dispatch/create+confirm', url: '/dispatch/create', hasSubTask: true, subTaskUrl: '/dispatch/confirm', subTaskLabel: '确认派车单' },
    { label: '7-创建进仓申请 + 审核进仓申请', value: '/warehouse-entry/create+review', url: '/warehouse-entry/create', hasSubTask: true, subTaskUrl: '/warehouse-entry/review', subTaskLabel: '审核进仓申请' },
    { label: '8-创建仓库入库单 + 确认仓库入库单', value: '/warehouse-receipt/create+confirm', url: '/warehouse-receipt/create', hasSubTask: true, subTaskUrl: '/warehouse-receipt/confirm', subTaskLabel: '确认仓库入库单' },
    { label: '9-创建报关申请 + 审核报关资料', value: '/customs/create+review', url: '/customs/create', hasSubTask: true, subTaskUrl: '/customs/review', subTaskLabel: '审核报关资料' },
    { label: '10-上传报关核对件 + 确认报关核对件', value: '/customs-check/upload+confirm', url: '/customs-check/upload', hasSubTask: true, subTaskUrl: '/customs-check/confirm', subTaskLabel: '确认报关核对件' },
    { label: '11-创建舱单申请 + 审核舱单申请', value: '/manifest/create+review', url: '/manifest/create', hasSubTask: true, subTaskUrl: '/manifest/review', subTaskLabel: '审核舱单申请' },
    { label: '12-创建VGM申请 + 审核VGM申请', value: '/vgm/create+review', url: '/vgm/create', hasSubTask: true, subTaskUrl: '/vgm/review', subTaskLabel: '审核VGM申请' },
    { label: '13-创建提单补料 + 审核提单补料', value: '/bl-supplement/create+review', url: '/bl-supplement/create', hasSubTask: true, subTaskUrl: '/bl-supplement/review', subTaskLabel: '审核提单补料' },
    { label: '14-上传提单格式件 + 确认提单格式件', value: '/bl-format/upload+confirm', url: '/bl-format/upload', hasSubTask: true, subTaskUrl: '/bl-format/confirm', subTaskLabel: '确认提单格式件' },
    { label: '15-上传账单 + 确认账单', value: '/bill/upload+confirm', url: '/bill/upload', hasSubTask: true, subTaskUrl: '/bill/confirm', subTaskLabel: '确认账单' },
    { label: '16-上传发票 + 确认发票', value: '/invoice/upload+confirm', url: '/invoice/upload', hasSubTask: true, subTaskUrl: '/invoice/confirm', subTaskLabel: '确认发票' },
    { label: '17-上传提单扫描件 + 确认提单扫描件', value: '/bl-scan/upload+confirm', url: '/bl-scan/upload', hasSubTask: true, subTaskUrl: '/bl-scan/confirm', subTaskLabel: '确认提单扫描件' },
    { label: '18-创建换单申请 + 审核换单申请', value: '/exchange/create+review', url: '/exchange/create', hasSubTask: true, subTaskUrl: '/exchange/review', subTaskLabel: '审核换单申请' },
    { label: '19-上传AN + 确认AN', value: '/an/upload+confirm', url: '/an/upload', hasSubTask: true, subTaskUrl: '/an/confirm', subTaskLabel: '确认AN' },
    { label: '20-创建送货申请 + 审核送货申请', value: '/delivery/create+review', url: '/delivery/create', hasSubTask: true, subTaskUrl: '/delivery/review', subTaskLabel: '审核送货申请' },
   ];

  // 任务管理函数
  const handleAddTask = () => {
    const newTask: Task = {
      id: `task-${Date.now()}`,
      name: '',
      type: 'external',
      skippable: false
    };
    setTasks([...tasks, newTask]);
  };

  /**
   * 删除任务处理函数
   * @param taskId 要删除的任务ID
   */
  const handleDeleteTask = (taskId: string) => {
    const taskToDelete = tasks.find(task => task.id === taskId);
    if (!taskToDelete) return;
    
    // 如果删除的是父任务，同时删除其子任务
    if (!taskToDelete.parentTaskId) {
      const childTasks = tasks.filter(task => task.parentTaskId === taskId);
      if (childTasks.length > 0) {
        const childTaskNames = childTasks.map(t => t.name).join('、');
        Message.info(`同时删除了子任务：${childTaskNames}`);
      }
      setTasks(tasks.filter(task => task.id !== taskId && task.parentTaskId !== taskId));
    } else {
      // 如果删除的是子任务，只删除子任务本身
      setTasks(tasks.filter(task => task.id !== taskId));
      Message.info('子任务已删除，可通过重新选择父任务的关联页面组合来恢复');
    }
  };

  const handleUpdateTask = (taskId: string, updates: Partial<Task>) => {
    setTasks(tasks.map(task => 
      task.id === taskId ? { ...task, ...updates } : task
    ));
  };
  
  // 切换节点启用状态
  const handleToggleNode = useCallback((nodeId: string, enabled: boolean) => {
    setNodes((nds) => 
      nds.map(node => 
        node.id === nodeId 
          ? { 
              ...node, 
              data: { 
                ...node.data, 
                enabled 
              } 
            }
          : node
      )
    );
    Message.success(enabled ? '节点已启用' : '节点已禁用');
  }, [setNodes]);
  
  // 编辑节点
  const handleEditNode = useCallback((nodeData: BusinessNodeData) => {
    setEditingNode(nodeData);
    setTasks(nodeData.tasks || []);
    form.setFieldsValue({
      name: nodeData.name,
      description: nodeData.description,
      enabled: nodeData.enabled,
      icon: nodeData.icon
    });
    setModalVisible(true);
  }, [form]);
  
  // 删除节点
  const handleDeleteNode = useCallback((nodeId: string) => {
    // 防止删除开始节点
    if (nodeId === 'start-node') {
      Message.warning('开始节点不能被删除');
      return;
    }
    
    setNodes((nds) => nds.filter(n => n.id !== nodeId));
    setEdges((eds) => eds.filter(e => e.source !== nodeId && e.target !== nodeId));
    Message.success('节点删除成功');
  }, [setNodes, setEdges]);
  
  // 节点类型定义
  const nodeTypes: NodeTypes = useMemo(() => ({
    businessNode: createBusinessNodeWrapper(handleEditNode, handleDeleteNode, handleToggleNode),
    startNode: createStartNodeWrapper(),
  }), [handleEditNode, handleDeleteNode, handleToggleNode]);
  
  // 初始化默认节点数据
  const initializeNodes = useCallback(() => {
    const defaultNodesData = [
      {
        id: 'node-1',
        name: '生产',
        description: '货物生产制造环节',
        enabled: true,
        tasks: [{ id: 'task-1', name: '生产制造', type: 'operation' as const, skippable: false }]
      },
      {
        id: 'node-2',
        name: '运价',
        description: '计算运输价格',
        enabled: true,
        tasks: [{ id: 'task-2', name: '运价计算', type: 'operation' as const, skippable: false }]
      },
      {
        id: 'node-3',
        name: '订舱',
        description: '预订船舱位置',
        enabled: true,
        tasks: [{ id: 'task-3', name: '舱位预订', type: 'operation' as const, skippable: false }]
      },
      {
        id: 'node-4',
        name: '拖车',
        description: '安排拖车运输',
        enabled: true,
        tasks: [{ id: 'task-4', name: '拖车安排', type: 'operation' as const, skippable: false }]
      },
      {
        id: 'node-5',
        name: '仓库',
        description: '货物仓储管理',
        enabled: true,
        tasks: [{ id: 'task-5', name: '仓储管理', type: 'operation' as const, skippable: false }]
      },
      {
        id: 'node-6',
        name: '报关',
        description: '向海关申报货物',
        enabled: true,
        tasks: [{ id: 'task-6', name: '海关申报', type: 'operation' as const, skippable: false }]
      },
      {
        id: 'node-7',
        name: '舱单',
        description: '制作货物舱单',
        enabled: true,
        tasks: [{ id: 'task-7', name: '舱单制作', type: 'operation' as const, skippable: false }]
      },
      {
        id: 'node-8',
        name: 'VGM',
        description: '集装箱称重验证',
        enabled: true,
        tasks: [{ id: 'task-8', name: 'VGM称重', type: 'operation' as const, skippable: false }]
      },
      {
        id: 'node-9',
        name: '补料',
        description: '客户补充相关资料',
        enabled: true,
        tasks: [{ id: 'task-9', name: '补充资料', type: 'customer' as const, skippable: true }]
      },
      {
        id: 'node-10',
        name: '账单',
        description: '生成费用账单',
        enabled: true,
        tasks: [{ id: 'task-10', name: '账单生成', type: 'operation' as const, skippable: false }]
      },
      {
        id: 'node-11',
        name: '发票',
        description: '开具发票',
        enabled: true,
        tasks: [{ id: 'task-11', name: '发票开具', type: 'operation' as const, skippable: false }]
      },
      {
        id: 'node-12',
        name: '提单',
        description: '签发提单',
        enabled: true,
        tasks: [{ id: 'task-12', name: '提单签发', type: 'operation' as const, skippable: false }]
      },
      {
        id: 'node-13',
        name: '换单',
        description: '换取提货单',
        enabled: true,
        tasks: [{ id: 'task-13', name: '换单操作', type: 'operation' as const, skippable: false }]
      },
      {
        id: 'node-14',
        name: '提柜',
        description: '提取集装箱',
        enabled: true,
        tasks: [{ id: 'task-14', name: '提柜操作', type: 'operation' as const, skippable: false }]
      },
      {
        id: 'node-15',
        name: '送货',
        description: '货物配送',
        enabled: true,
        tasks: [{ id: 'task-15', name: '货物配送', type: 'operation' as const, skippable: false }]
      }
    ];
    
    // 创建开始节点
    const startNode: Node = {
      id: 'start-node',
      type: 'startNode',
      position: { x: 50, y: 200 },
      data: {
        id: 'start-node',
        name: '开始'
      },
      deletable: false,
      draggable: true,
    };
    
    // 创建节点 - 从左到右的流程布局
    const initialNodes: Node[] = [startNode, ...defaultNodesData.map((nodeData, index) => {
      const nodeWidth = 300; // 节点宽度
      const nodeHeight = 180; // 节点高度
      const marginX = 80; // 水平间距
      const marginY = 100; // 垂直间距
      const startX = 450; // 起始X位置（为开始节点预留空间）
      const startY = 100; // 起始Y位置
      
      let x, y;
      
      // 按照业务流程布局：生产→运价→订舱→(拖车、仓库、报关、舱单、VGM、补料)→账单→发票→提单→换单→提柜→送货
      if (index === 0) { // 生产
        x = startX;
        y = startY + 200;
      } else if (index === 1) { // 运价
        x = startX + (nodeWidth + marginX) * 1;
        y = startY + 200;
      } else if (index === 2) { // 订舱
        x = startX + (nodeWidth + marginX) * 2;
        y = startY + 200;
      } else if (index >= 3 && index <= 8) { // 拖车、仓库、报关、舱单、VGM、补料
         const parallelIndex = index - 3;
         // 所有并行节点排列在同一列
         x = startX + (nodeWidth + marginX) * 3;
         y = startY + parallelIndex * (nodeHeight + marginY * 0.7);
      } else if (index === 9) { // 账单
        x = startX + (nodeWidth + marginX) * 6;
        y = startY + 200;
      } else if (index === 10) { // 发票
        x = startX + (nodeWidth + marginX) * 7;
        y = startY + 200;
      } else if (index === 11) { // 提单
        x = startX + (nodeWidth + marginX) * 8;
        y = startY + 200;
      } else if (index === 12) { // 换单
        x = startX + (nodeWidth + marginX) * 9;
        y = startY + 200;
      } else if (index === 13) { // 提柜
        x = startX + (nodeWidth + marginX) * 10;
        y = startY + 200;
      } else { // 送货
        x = startX + (nodeWidth + marginX) * 11;
        y = startY + 200;
      }
      
      return {
        id: nodeData.id,
        type: 'businessNode',
        position: { x, y },
        data: nodeData,
        dragHandle: '.business-node',
      };
    })];
    
    // 创建连接线 - 按照业务流程：开始→生产→运价→订舱→(拖车、仓库、报关、舱单、VGM、补料)→账单→发票→提单→换单→提柜→送货
    const initialEdges: Edge[] = [
      // 开始 -> 生产
      { id: 'edge-start-1', source: 'start-node', target: 'node-1', type: 'custom' },
      // 生产 -> 运价
      { id: 'edge-1-2', source: 'node-1', target: 'node-2', type: 'custom' },
      // 运价 -> 订舱
      { id: 'edge-2-3', source: 'node-2', target: 'node-3', type: 'custom' },
      // 订舱 -> 拖车、仓库、报关、舱单、VGM、补料 (一对多连接)
      { id: 'edge-3-4', source: 'node-3', target: 'node-4', type: 'custom' },
      { id: 'edge-3-5', source: 'node-3', target: 'node-5', type: 'custom' },
      { id: 'edge-3-6', source: 'node-3', target: 'node-6', type: 'custom' },
      { id: 'edge-3-7', source: 'node-3', target: 'node-7', type: 'custom' },
      { id: 'edge-3-8', source: 'node-3', target: 'node-8', type: 'custom' },
      { id: 'edge-3-9', source: 'node-3', target: 'node-9', type: 'custom' },
      // 拖车、仓库、报关、舱单、VGM、补料 -> 账单 (多对一连接)
      { id: 'edge-4-10', source: 'node-4', target: 'node-10', type: 'custom' },
      { id: 'edge-5-10', source: 'node-5', target: 'node-10', type: 'custom' },
      { id: 'edge-6-10', source: 'node-6', target: 'node-10', type: 'custom' },
      { id: 'edge-7-10', source: 'node-7', target: 'node-10', type: 'custom' },
      { id: 'edge-8-10', source: 'node-8', target: 'node-10', type: 'custom' },
      { id: 'edge-9-10', source: 'node-9', target: 'node-10', type: 'custom' },
      // 账单 -> 发票
      { id: 'edge-10-11', source: 'node-10', target: 'node-11', type: 'custom' },
      // 发票 -> 提单
      { id: 'edge-11-12', source: 'node-11', target: 'node-12', type: 'custom' },
      // 提单 -> 换单
      { id: 'edge-12-13', source: 'node-12', target: 'node-13', type: 'custom' },
      // 换单 -> 提柜
      { id: 'edge-13-14', source: 'node-13', target: 'node-14', type: 'custom' },
      // 提柜 -> 送货
      { id: 'edge-14-15', source: 'node-14', target: 'node-15', type: 'custom' },
    ];
    
    setNodes(initialNodes);
    setEdges(initialEdges);
  }, [setNodes, setEdges]);
  
  // 组件挂载时初始化
  React.useEffect(() => {
    initializeNodes();
  }, [initializeNodes]);
  
  // 处理连接
  const onConnect = useCallback(
    (params: Connection) => {
      const newEdge = {
        ...params,
        id: `edge-${params.source}-${params.target}-${Date.now()}`,
        type: 'custom',
      };
      setEdges((eds) => addEdge(newEdge, eds));
    },
    [setEdges]
  );
  
  // 处理删除边（连接线）
  const onEdgesDelete = useCallback(
    (edgesToDelete: Edge[]) => {
      setEdges((eds) => eds.filter(edge => !edgesToDelete.find(e => e.id === edge.id)));
      Message.success(`已删除 ${edgesToDelete.length} 条连接线`);
    },
    [setEdges]
  );
  
  // 添加新节点
  const addNewNode = useCallback((position?: { x: number; y: number }) => {
    const newNodeId = `node-${Date.now()}`;
    
    // 如果没有指定位置，计算一个不重叠的位置
    let newPosition = position || { x: 200, y: 200 }; // 提供默认值
    if (!position) {
      const nodeWidth = 300;
      const nodeHeight = 200;
      const margin = 50;
      
      // 找到一个不与现有节点重叠的位置
      let attempts = 0;
      let foundPosition = false;
      
      while (!foundPosition && attempts < 20) {
        const x = Math.random() * (window.innerWidth - nodeWidth - 400) + 200;
        const y = Math.random() * (window.innerHeight - nodeHeight - 300) + 150;
        
        // 检查是否与现有节点重叠
        const overlapping = nodes.some(node => {
          const dx = Math.abs(node.position.x - x);
          const dy = Math.abs(node.position.y - y);
          return dx < nodeWidth + margin && dy < nodeHeight + margin;
        });
        
        if (!overlapping) {
          newPosition = { x, y };
          foundPosition = true;
        }
        attempts++;
      }
      
      // 如果找不到合适位置，使用默认位置
      if (!foundPosition) {
        newPosition = { x: 200 + nodes.length * 50, y: 200 + nodes.length * 30 };
      }
    }
    
    const newNode: Node = {
      id: newNodeId,
      type: 'businessNode',
      position: newPosition,
      data: {
        id: newNodeId,
        name: '新节点',
        description: '请编辑节点信息',
        enabled: true,
        tasks: []
      },
      dragHandle: '.business-node',
    };
    
    setNodes((nds) => [...nds, newNode]);
    setEditingNode(newNode.data);
    setModalVisible(true);
  }, [setNodes, nodes]);
  
  // 监听插入节点事件
  React.useEffect(() => {
    const handleInsertNode = (event: any) => {
      const { edgeId, position } = event.detail;
      
      // 找到要分割的边
      const edge = edges.find(e => e.id === edgeId);
      if (!edge) return;
      
      // 创建新节点
      const newNodeId = `node-${Date.now()}`;
      const newNode: Node = {
        id: newNodeId,
        type: 'businessNode',
        position: { x: position.x - 80, y: position.y - 40 },
        data: {
          id: newNodeId,
          name: '新节点',
          description: '请编辑节点信息',
          enabled: true,
          tasks: []
        },
        dragHandle: '.business-node',
      };
      
      // 删除原边，添加两条新边
      setEdges((eds) => {
        const newEdges = eds.filter(e => e.id !== edgeId);
        return [
          ...newEdges,
          {
            id: `edge-${edge.source}-${newNodeId}`,
            source: edge.source,
            target: newNodeId,
            type: 'custom'
          },
          {
            id: `edge-${newNodeId}-${edge.target}`,
            source: newNodeId,
            target: edge.target,
            type: 'custom'
          }
        ];
      });
      
      // 添加新节点
      setNodes((nds) => [...nds, newNode]);
    };
    
    window.addEventListener('insertNode', handleInsertNode);
    return () => window.removeEventListener('insertNode', handleInsertNode);
  }, [edges, setNodes, setEdges]);
  
  // 编辑节点（通过节点ID）
  const handleEditNodeById = useCallback((nodeId: string) => {
    const node = nodes.find(n => n.id === nodeId);
    if (node) {
      handleEditNode(node.data);
    }
  }, [nodes, handleEditNode]);
  
  /**
   * 保存节点编辑
   * 包含任务表单验证，特别是专属对接人字段的必填验证
   */
  const handleSaveNode = useCallback(async () => {
    try {
      const values = await form.validate();
      
      // 验证内部任务的专属对接人字段
      const validationErrors: string[] = [];
      
      tasks.forEach((task) => {
        if (task.type === 'internal') {
          // 检查对接人类型是否已选择
          if (!task.assignmentType) {
            validationErrors.push(`任务 "${task.name}" 需要选择对接人类型`);
          }
          
          // 如果选择了专属对接人，必须填写专属对接人字段
          if (task.assignmentType === 'dedicated_contact' && !task.dedicatedContact) {
            validationErrors.push(`任务 "${task.name}" 选择了专属对接人，必须填写专属对接人字段`);
          }
          

        }
      });
      
      // 如果有验证错误，显示错误信息并阻止保存
      if (validationErrors.length > 0) {
        Message.error({
          content: (
            <div>
              <div>表单验证失败：</div>
              <ul style={{ margin: '8px 0', paddingLeft: '20px' }}>
                {validationErrors.map((error, index) => (
                  <li key={index}>{error}</li>
                ))}
              </ul>
            </div>
          ),
          duration: 5000
        });
        return;
      }
      
      if (editingNode) {
        setNodes((nds) => 
          nds.map(node => 
            node.id === editingNode.id 
              ? { 
                  ...node, 
                  data: { 
                    ...node.data, 
                    ...values,
                    tasks: tasks
                  } 
                }
              : node
          )
        );
      } else {
        // 新增节点 - 直接调用addNewNode，它会自动创建节点并打开编辑
        // 但我们需要在这里手动创建节点，因为我们已经有了表单数据
        const newNodeId = `node-${Date.now()}`;
        const newNode: Node = {
          id: newNodeId,
          type: 'businessNode',
          position: { x: 200 + nodes.length * 50, y: 200 + nodes.length * 30 },
          data: {
            id: newNodeId,
            ...values,
            tasks: tasks
          },
          dragHandle: '.business-node',
        };
        setNodes((nds) => [...nds, newNode]);
      }
      setModalVisible(false);
      setEditingNode(null);
      setTasks([]);
      form.resetFields();
    } catch (error) {
      console.error('表单验证失败:', error);
    }
  }, [editingNode, form, setNodes, tasks]);
  
  /**
   * 处理节点删除事件（键盘删除）
   * @param nodes 要删除的节点数组
   */
  const onNodesDelete = useCallback((nodes: Node[]) => {
    const hasStartNode = nodes.some(node => node.id === 'start-node');
    if (hasStartNode) {
      Message.warning('开始节点不能被删除');
      return;
    }
    // 如果没有开始节点，则正常删除
    setNodes((nds) => nds.filter(node => !nodes.find(n => n.id === node.id)));
  }, [setNodes]);

  return (
    <>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onEdgesDelete={onEdgesDelete}
        onNodesDelete={onNodesDelete}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        fitView
        attributionPosition="bottom-left"
        onNodeDoubleClick={(_, node) => handleEditNodeById(node.id)}
        deleteKeyCode={['Backspace', 'Delete']}
        multiSelectionKeyCode={['Meta', 'Ctrl']}
      >
        <Controls />
        <MiniMap 
          nodeColor="#1890ff"
          nodeStrokeWidth={3}
          zoomable
          pannable
        />
        <Background 
          variant={BackgroundVariant.Dots} 
          gap={20} 
          size={1}
          color="#f0f0f0"
        />
        
        {/* 工具栏 */}
        <Panel position="top-right">
          <div style={{ display: 'flex', gap: '8px' }}>
            <Button 
              type="primary" 
              icon={<IconPlus />}
              onClick={() => addNewNode()}
            >
              添加节点
            </Button>
            <Button 
              onClick={initializeNodes}
            >
              重置布局
            </Button>
            <Button 
              type="primary"
              onClick={() => setShowSaveConfirm(true)}
            >
              保存设置
            </Button>
          </div>
        </Panel>
      </ReactFlow>
      
      {/* 编辑节点抽屉 */}
      <Drawer
        title={editingNode?.id ? '编辑节点' : '新增节点'}
        visible={modalVisible}
        onOk={handleSaveNode}
        onCancel={() => {
          setModalVisible(false);
          setEditingNode(null);
          form.resetFields();
        }}
        okText="保存"
        cancelText="取消"
        placement="right"
        width="50%"
        maskClosable={false}
        escToExit={false}
        footer={
          <div style={{
            display: 'flex',
            justifyContent: 'flex-end',
            gap: '12px',
            padding: '16px 24px',
            borderTop: '1px solid #f0f0f0',
            backgroundColor: '#fff',
            position: 'sticky',
            bottom: 0,
            zIndex: 10
          }}>
            <Button
              size="default"
              onClick={() => {
                setModalVisible(false);
                setEditingNode(null);
                form.resetFields();
              }}
            >
              取消
            </Button>
            <Button
              type="primary"
              size="default"
              onClick={handleSaveNode}
            >
              保存
            </Button>
          </div>
        }
      >
        <div style={{
          padding: '24px',
          height: '100%',
          overflowY: 'auto'
        }}>
          <Form form={form} layout="vertical" autoComplete="off">
            {/* 基本信息区域 */}
            <div style={{
              marginBottom: '32px',
              padding: '20px',
              backgroundColor: '#fafafa',
              borderRadius: '8px',
              border: '1px solid #e8e9ea'
            }}>
              <h3 style={{
                margin: '0 0 16px 0',
                fontSize: '16px',
                fontWeight: 600,
                color: '#262626'
              }}>基本信息</h3>
              
              <Form.Item
                label="节点名称"
                field="name"
                rules={[{ required: true, message: '请输入节点名称' }]}
                style={{ marginBottom: '20px' }}
              >
                <Input 
                  placeholder="请输入节点名称，如：报价确认" 
                  size="large"
                />
              </Form.Item>
              
              <Form.Item
                label="节点描述"
                field="description"
                style={{ marginBottom: '20px' }}
              >
                <Input.TextArea 
                  placeholder="请输入节点描述（可选）" 
                  rows={4}
                  maxLength={200}
                  showWordLimit
                />
              </Form.Item>
              
              <Form.Item
                 label="启用状态"
                 field="enabled"
                 triggerPropName="checked"
                 style={{ marginBottom: '0' }}
               >
                 <Switch size="default" />
               </Form.Item>
            </div>
            {/* 图标设置区域 */}
            <div style={{
              marginBottom: '32px',
              padding: '20px',
              backgroundColor: '#fafafa',
              borderRadius: '8px',
              border: '1px solid #e8e9ea'
            }}>
              <h3 style={{
                margin: '0 0 16px 0',
                fontSize: '16px',
                fontWeight: 600,
                color: '#262626'
              }}>图标设置</h3>
              
              <Form.Item
                label="节点图标"
                field="icon"
                style={{ marginBottom: '0' }}
              >
            <Upload
              listType="picture-card"
              fileList={form.getFieldValue('icon') ? [{
                uid: '1',
                name: 'icon',
                status: 'done',
                url: form.getFieldValue('icon')
              }] : []}
              showUploadList={true}
              accept="image/*"
              beforeUpload={(file) => {
                const isImage = file.type.startsWith('image/');
                const isLt2M = file.size / 1024 / 1024 < 2;
                
                if (!isImage) {
                  Message.error('只能上传图片文件!');
                  return false;
                }
                if (!isLt2M) {
                  Message.error('图片大小不能超过 2MB!');
                  return false;
                }
                
                const reader = new FileReader();
                reader.onload = (e) => {
                  const imageUrl = e.target?.result as string;
                  form.setFieldValue('icon', imageUrl);
                  Message.success('图标上传成功');
                };
                reader.readAsDataURL(file);
                
                return false;
              }}
              onRemove={() => {
                form.setFieldValue('icon', undefined);
                Message.success('图标已移除');
              }}
            >
              {!form.getFieldValue('icon') && (
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  height: '100%'
                }}>
                  <IconUpload style={{ fontSize: '24px', color: '#999' }} />
                  <div style={{ marginTop: '8px', fontSize: '12px', color: '#999' }}>
                    上传图标
                  </div>
                </div>
              )}
            </Upload>
                <div style={{ fontSize: '12px', color: '#999', marginTop: '8px' }}>
                  支持 JPG、PNG、GIF 格式，文件大小不超过 2MB
                </div>
              </Form.Item>
            </div>

            {/* 任务配置区域 */}
            <div style={{
              marginBottom: '32px',
              padding: '20px',
              backgroundColor: '#fafafa',
              borderRadius: '8px',
              border: '1px solid #e8e9ea'
            }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '16px'
              }}>
                <h3 style={{
                  margin: '0',
                  fontSize: '16px',
                  fontWeight: 600,
                  color: '#262626'
                }}>任务配置</h3>
                <Button
                  type="primary"
                  size="default"
                  icon={<IconPlus />}
                  onClick={handleAddTask}
                >
                  添加任务
                </Button>
              </div>

              {/* 任务列表 */}
              <div style={{
                border: '1px solid #e8e9ea',
                borderRadius: '8px',
                padding: '12px',
                backgroundColor: 'white'
              }}>
                {tasks.length === 0 ? (
                  <div style={{
                    textAlign: 'center',
                    color: '#8c8c8c',
                    padding: '40px 20px'
                  }}>
                    暂无任务，点击"添加任务"开始配置
                  </div>
                ) : (
                  tasks.map((task, index) => (
                    <div key={task.id} style={{
                      border: '1px solid #e8e9ea',
                      borderRadius: '8px',
                      padding: '16px',
                      marginBottom: '12px',
                      backgroundColor: '#f8f9fa'
                    }}>
                      <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: '12px'
                      }}>
                        <span style={{ 
                          fontWeight: 600, 
                          fontSize: '14px',
                          color: '#262626'
                        }}>任务 {index + 1}</span>
                      <Button
                        type="text"
                        size="mini"
                        status="danger"
                        icon={<IconDelete />}
                        onClick={() => handleDeleteTask(task.id)}
                      />
                    </div>

                      <div style={{ 
                        display: 'grid', 
                        gridTemplateColumns: '1fr 1fr', 
                        gap: '16px',
                        marginBottom: '16px'
                      }}>
                        <div>
                          <label style={{ 
                            fontSize: '13px', 
                            color: '#666',
                            display: 'block',
                            marginBottom: '6px',
                            fontWeight: 500
                          }}>任务名称</label>
                          <Input
                            size="default"
                            value={task.name}
                            placeholder="请输入任务名称"
                            onChange={(value) => handleUpdateTask(task.id, { name: value })}
                          />
                        </div>

                        <div>
                          <label style={{ 
                            fontSize: '13px', 
                            color: '#666',
                            display: 'block',
                            marginBottom: '6px',
                            fontWeight: 500
                          }}>任务性质</label>
                          <Select
                            size="default"
                            value={task.type}
                            onChange={(value) => handleUpdateTask(task.id, { type: value as TaskType })}
                          >
                            <Option value="external">外部任务</Option>
                            <Option value="internal">内部任务</Option>
                          </Select>
                        </div>

                        {task.type === 'internal' && (
                          <>
                            <div>
                              <label style={{ 
                                fontSize: '13px', 
                                color: '#666',
                                display: 'block',
                                marginBottom: '6px',
                                fontWeight: 500
                              }}>对接人类型</label>
                              <Select
                                size="default"
                                value={task.assignmentType}
                                placeholder="请选择对接人类型"
                                onChange={(value) => {
                                  handleUpdateTask(task.id, { 
                                    assignmentType: value as TaskAssignmentType,
                                    // 清空之前的选择
                                    position: undefined,
                                    dedicatedContact: undefined
                                  });
                                }}
                              >
                                <Option value="dedicated_contact">专属对接人</Option>
                                <Option value="business_manager">业务负责人</Option>
                              </Select>
                            </div>

                            {/* 专属对接人字段 */}
                            {task.assignmentType === 'dedicated_contact' && (
                              <div>
                                <label style={{ 
                                  fontSize: '13px', 
                                  color: '#666',
                                  display: 'block',
                                  marginBottom: '6px',
                                  fontWeight: 500
                                }}>专属对接人 <span style={{ color: '#ff4d4f' }}>*</span></label>
                                <Select
                                  size="default"
                                  value={task.dedicatedContact}
                                  placeholder="请选择专属对接人"
                                  onChange={(value) => handleUpdateTask(task.id, { dedicatedContact: value as DedicatedContactType })}
                                >
                                  <Option value="dedicated_sales">专属销售</Option>
                                  <Option value="dedicated_service">专属客服</Option>
                                  <Option value="dedicated_operation">专属操作</Option>
                                  <Option value="dedicated_documentation">专属单证</Option>
                                  <Option value="dedicated_business">专属商务</Option>
                                  <Option value="dedicated_finance">专属财务</Option>
                                </Select>
                              </div>
                            )}


                          </>
                        )}

                        <div>
                          <label style={{ 
                            fontSize: '13px', 
                            color: '#666',
                            display: 'block',
                            marginBottom: '6px',
                            fontWeight: 500
                          }}>是否可跳过</label>
                          <Switch
                            size="default"
                            checked={task.skippable}
                            onChange={(checked) => handleUpdateTask(task.id, { skippable: checked })}
                          />
                        </div>
                      </div>

                      {/* 关联页面 */}
                      <div style={{ marginBottom: '16px' }}>
                        <label style={{ 
                          fontSize: '13px', 
                          color: '#666',
                          display: 'block',
                          marginBottom: '6px',
                          fontWeight: 500
                        }}>关联页面（可选）</label>
                        <Select
                          size="default"
                          placeholder="请选择关联页面"
                          value={task.relatedPage?.url || ''}
                          disabled={!!task.parentTaskId} // 子任务的关联页面不可修改
                          onChange={(value) => {
                            const selectedPage = relatedPageOptions.find(option => option.value === value);
                            
                            // 更新当前任务的关联页面
                            handleUpdateTask(task.id, {
                              relatedPage: selectedPage ? {
                                name: selectedPage.label.split(' + ')[0], // 只取主任务名称
                                url: selectedPage.url
                              } : undefined
                            });
                            
                            // 如果选择的是带+的任务组合，自动创建子任务
                            if (selectedPage?.hasSubTask) {
                              // 检查是否已存在该子任务
                              const existingSubTask = tasks.find(t => 
                                t.parentTaskId === task.id && 
                                t.relatedPage?.url === selectedPage.subTaskUrl
                              );
                              
                              if (!existingSubTask) {
                                const subTask: Task = {
                                  id: `task-${Date.now()}-sub`,
                                  name: selectedPage.subTaskLabel || '',
                                  type: 'internal', // 子任务默认为内部任务
                                  skippable: false,
                                  parentTaskId: task.id, // 关联到父任务
                                  relatedPage: {
                                    name: selectedPage.subTaskLabel || '',
                                    url: selectedPage.subTaskUrl || ''
                                  }
                                };
                                setTasks([...tasks, subTask]);
                                Message.success('已自动创建子任务：' + selectedPage.subTaskLabel);
                              }
                            } else {
                              // 如果取消选择带+的任务组合，删除对应的子任务
                              const subTasksToRemove = tasks.filter(t => t.parentTaskId === task.id);
                              if (subTasksToRemove.length > 0) {
                                setTasks(tasks.filter(t => t.parentTaskId !== task.id));
                              }
                            }
                          }}
                          allowClear
                        >
                          {relatedPageOptions.map(option => (
                            <Option key={option.value} value={option.value}>
                              {option.label}
                            </Option>
                          ))}
                        </Select>
                      </div>

                      {/* 父任务 */}
                      <div style={{ marginBottom: '16px' }}>
                        <label style={{ 
                          fontSize: '13px', 
                          color: '#666',
                          display: 'block',
                          marginBottom: '6px',
                          fontWeight: 500
                        }}>父任务（可选）</label>
                        <Select
                          size="default"
                          placeholder="请选择父任务"
                          value={task.parentTaskId || ''}
                          disabled={!!task.parentTaskId} // 子任务的父任务字段不可修改
                          onChange={(value) => {
                            handleUpdateTask(task.id, {
                              parentTaskId: value || undefined
                            });
                          }}
                          allowClear
                        >
                          {editingNode?.tasks
                            ?.filter((t: Task) => t.id !== task.id)
                            ?.map((t: Task) => (
                              <Option key={t.id} value={t.id}>
                                {t.name}
                              </Option>
                            ))}
                        </Select>
                      </div>

                      {/* 截止时间 */}
                      <div style={{ marginBottom: '0' }}>
                        <label style={{ 
                          fontSize: '13px', 
                          color: '#666',
                          display: 'block',
                          marginBottom: '6px',
                          fontWeight: 500
                        }}>截止时间（可选）</label>
                        <div style={{ 
                          display: 'grid', 
                          gridTemplateColumns: '1fr 80px 80px 100px', 
                          gap: '12px'
                        }}>
                          <Select
                            size="default"
                            placeholder="参考时间点"
                            value={task.deadline?.referencePoint || ''}
                            onChange={(value) => {
                              handleUpdateTask(task.id, {
                                deadline: {
                                  referencePoint: value as 'prev_task_complete' | 'task_activate' | 'prev_node' | 'origin_eta' | 'origin_etd' | 'origin_ata' | 'origin_atd' | 'dest_eta' | 'dest_etd' | 'dest_ata' | 'dest_atd',
                                  direction: task.deadline?.direction || 'after',
                                  value: task.deadline?.value || 1,
                                  unit: task.deadline?.unit || 'days'
                                }
                              });
                            }}
                            allowClear
                          >
                          <Option value="prev_task_complete">上一个任务完成</Option>
                          <Option value="task_activate">任务激活</Option>
                          <Option value="prev_node">上一个节点</Option>
                          <Option value="origin_eta">起运港ETA</Option>
                          <Option value="origin_etd">起运港ETD</Option>
                          <Option value="origin_ata">起运港ATA</Option>
                          <Option value="origin_atd">起运港ATD</Option>
                          <Option value="dest_eta">目的港ETA</Option>
                          <Option value="dest_etd">目的港ETD</Option>
                          <Option value="dest_ata">目的港ATA</Option>
                          <Option value="dest_atd">目的港ATD</Option>
                          </Select>
                          
                          <Select
                            size="default"
                            placeholder="前后"
                            value={task.deadline?.direction || ''}
                            onChange={(value) => {
                              if (task.deadline) {
                                handleUpdateTask(task.id, {
                                  deadline: {
                                    ...task.deadline,
                                    direction: value as 'before' | 'after'
                                  }
                                });
                              }
                            }}
                          >
                            <Option value="before">之前</Option>
                            <Option value="after">之后</Option>
                          </Select>
                          
                          <Input
                            size="default"
                            placeholder="数值"
                            value={task.deadline?.value?.toString() || ''}
                            onChange={(value) => {
                              const numValue = parseInt(value) || 0;
                              if (task.deadline) {
                                handleUpdateTask(task.id, {
                                  deadline: {
                                    ...task.deadline,
                                    value: numValue
                                  }
                                });
                              }
                            }}
                          />
                          
                          <Select
                            size="default"
                            placeholder="时间单位"
                            value={task.deadline?.unit || ''}
                            onChange={(value) => {
                              if (task.deadline) {
                                handleUpdateTask(task.id, {
                                  deadline: {
                                    ...task.deadline,
                                    unit: value as 'minutes' | 'hours' | 'days' | 'weeks'
                                  }
                                });
                              }
                            }}
                          >
                            <Option value="minutes">分钟</Option>
                            <Option value="hours">小时</Option>
                            <Option value="days">天</Option>
                            <Option value="weeks">周</Option>
                          </Select>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </Form>
        </div>
      </Drawer>
      
      {/* 自定义保存确认弹窗 */}
      {showSaveConfirm && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            backgroundColor: 'white',
            borderRadius: '8px',
            padding: '24px',
            minWidth: '400px',
            maxWidth: '500px',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
          }}>
            <div style={{
              fontSize: '16px',
              fontWeight: 500,
              marginBottom: '16px',
              color: '#262626'
            }}>
              确认保存
            </div>
            <div style={{
              fontSize: '14px',
              color: '#595959',
              marginBottom: '24px',
              lineHeight: '1.5'
            }}>
              保存后业务节点将对所有业务生效，确认保存？
            </div>
            <div style={{
              display: 'flex',
              justifyContent: 'flex-end',
              gap: '12px'
            }}>
              <Button
                onClick={() => setShowSaveConfirm(false)}
              >
                取消
              </Button>
              <Button
                type="primary"
                onClick={() => {
                  // 这里可以添加保存逻辑
                  Message.success('业务节点设置已保存');
                  setShowSaveConfirm(false);
                }}
              >
                确认
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

// 包装组件，提供ReactFlow上下文
const FlowEditorWrapper: React.FC = () => {
  return (
    <ReactFlowProvider>
      <FlowEditor />
    </ReactFlowProvider>
  );
};

export default FlowEditorWrapper;