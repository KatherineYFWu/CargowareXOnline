import React, { useState } from 'react';
import { Card, Progress, Tooltip, Tabs, Modal } from '@arco-design/web-react';
import { OrderSOP } from './sopData';

interface SOPQueryProps {
  sopData: OrderSOP;
}

const SOPQuery: React.FC<SOPQueryProps> = ({ sopData }) => {
  const [activeTab, setActiveTab] = useState<string>('sop');
  const [subTaskModalVisible, setSubTaskModalVisible] = useState<boolean>(false);
  const [selectedSubTasks, setSelectedSubTasks] = useState<any[]>([]);

  // 计算整体进度
  const calculateProgress = () => {
    const totalNodes = sopData.nodes.length;
    const completedNodes = sopData.nodes.filter(node => node.status === '已完成').length;
    const partialNodes = sopData.nodes.filter(node => node.status === '部分完成').length;
    
    return ((completedNodes + partialNodes) / totalNodes) * 100;
  };

  // 获取状态颜色
  const getStatusColor = (status: string) => {
    switch (status) {
      case '已完成': return '#1565C0';
      case '部分完成': return '#F59E0B';
      case '未完成': return '#999999';
      default: return '#999999';
    }
  };

  // 获取子任务状态颜色
  const getSubTaskStatusColor = (status: string) => {
    switch (status) {
      case '已完成': return '#1565C0';
      case '已跳过': return '#F59E0B';
      case '未完成': return '#EF4444';
      default: return '#EF4444';
    }
  };

  // 显示子任务详情弹窗
  const showSubTaskDetails = (subTasks: any[]) => {
    setSelectedSubTasks(subTasks);
    setSubTaskModalVisible(true);
  };

  // 渲染流程节点
  const renderNode = (node: any) => {
    const statusColor = getStatusColor(node.status);
    
    return (
      <div 
        key={node.id}
        className="sop-node"
        style={{
          border: `2px solid ${statusColor}`,
          borderRadius: '8px',
          padding: '16px',
          marginBottom: '12px',
          backgroundColor: 'white',
          transition: 'all 0.3s ease'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '12px' }}>
          <div style={{ 
            width: '24px', 
            height: '24px', 
            color: statusColor,
            marginRight: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <i className={`fas ${node.icon}`} style={{ fontSize: '20px' }} />
          </div>
          <div style={{ flex: 1 }}>
            <div className="sop-node-title" style={{ 
              fontFamily: 'Microsoft YaHei', 
              fontWeight: 'bold', 
              fontSize: '24px', 
              color: '#000000',
              marginBottom: '4px'
            }}>
              {node.name}
            </div>
            <div style={{ 
              fontFamily: 'Microsoft YaHei', 
              fontSize: '16px', 
              color: statusColor
            }}>
              {node.status}
            </div>
          </div>
          <Tooltip 
            content={
              <div style={{ minWidth: '200px' }}>
                <div style={{ fontFamily: 'Microsoft YaHei', fontWeight: 'bold', marginBottom: '8px' }}>
                  子任务详情
                </div>
                {node.subTasks.map((subTask: any, index: number) => (
                  <div key={index} style={{ marginBottom: '6px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ fontFamily: 'Microsoft YaHei', fontSize: '12px' }}>
                        {subTask.type} - {subTask.name}
                      </span>
                      <span style={{ 
                        fontFamily: 'Microsoft YaHei', 
                        fontSize: '12px',
                        color: getSubTaskStatusColor(subTask.status)
                      }}>
                        {subTask.status}
                      </span>
                    </div>
                    {subTask.updateTime && (
                      <div style={{ 
                        fontFamily: 'Microsoft YaHei', 
                        fontSize: '10px', 
                        color: '#666',
                        marginTop: '2px'
                      }}>
                        更新时间: {subTask.updateTime}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            }
          >
            <button 
              style={{
                background: '#e0e0e0',
                border: 'none',
                borderRadius: '4px',
                padding: '6px 12px',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                fontFamily: 'Microsoft YaHei',
                fontSize: '12px'
              }}
            >
              info
            </button>
          </Tooltip>
        </div>
        
        {/* 子任务列表 */}
        <div style={{ marginLeft: '36px' }}>
          {node.subTasks.map((subTask: any, index: number) => (
            <div key={index} style={{ 
              display: 'flex', 
              alignItems: 'center', 
              marginBottom: '8px',
              padding: '8px',
              backgroundColor: '#f8f9fa',
              borderRadius: '4px'
            }}>
              <div style={{ 
                width: '8px', 
                height: '8px', 
                borderRadius: '50%', 
                backgroundColor: getSubTaskStatusColor(subTask.status),
                marginRight: '12px'
              }} />
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ 
                    fontFamily: 'Microsoft YaHei', 
                    fontSize: '12px', 
                    color: '#000000'
                  }}>
                    {subTask.type} - {subTask.name}
                  </span>
                  <span style={{ 
                    fontFamily: 'Microsoft YaHei', 
                    fontSize: '12px',
                    color: getSubTaskStatusColor(subTask.status)
                  }}>
                    {subTask.status}
                  </span>
                </div>
                {subTask.updateTime && (
                  <div style={{ 
                    fontFamily: 'Microsoft YaHei', 
                    fontSize: '10px', 
                    color: '#666',
                    marginTop: '2px'
                  }}>
                    更新时间: {subTask.updateTime}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // 渲染SOP页签内容
  const renderSOPContent = () => (
    <div>
      {/* 整体进度条 */}
      <div style={{ marginBottom: '24px' }}>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          marginBottom: '8px'
        }}>
          <span style={{ fontFamily: 'Microsoft YaHei', fontSize: '16px', fontWeight: 'bold' }}>整体进度</span>
          <span style={{ fontFamily: 'Microsoft YaHei', fontSize: '14px', color: '#666' }}>
            {calculateProgress().toFixed(0)}%
          </span>
        </div>
        <Progress 
          percent={calculateProgress()} 
          color={getStatusColor('已完成')}
          style={{ marginBottom: '0' }}
        />
      </div>

      {/* 轨道站点动画 */}
      <div style={{ 
        position: 'relative', 
        height: '80px', 
        marginBottom: '20px',
        overflow: 'hidden',
        background: '#f8f9fa',
        borderRadius: '8px',
        padding: '10px'
      }}>
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '0',
          right: '0',
          height: '3px',
          background: 'linear-gradient(90deg, #1565C0 0%, #F59E0B 50%, #999999 100%)',
          transform: 'translateY(-50%)',
          borderRadius: '2px'
        }} />
        
        {/* 站点标记 */}
        {sopData.nodes.map((node, index) => {
          const progress = (index / (sopData.nodes.length - 1)) * 100;
          const statusColor = getStatusColor(node.status);
          
          return (
            <div
              key={node.id}
              style={{
                position: 'absolute',
                left: `${progress}%`,
                top: '50%',
                transform: 'translate(-50%, -50%)',
                width: '20px',
                height: '20px',
                borderRadius: '50%',
                backgroundColor: statusColor,
                border: '3px solid white',
                boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
                zIndex: 2
              }}
            />
          );
        })}
        
        {/* 小船动画 */}
        <div
          style={{
            position: 'absolute',
            left: `${calculateProgress()}%`,
            top: '50%',
            transform: 'translate(-50%, -50%)',
            fontSize: '28px',
            color: '#1565C0',
            animation: 'shipMove 2s ease-in-out infinite',
            zIndex: 3,
            filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))'
          }}
        >
          🚢
        </div>
      </div>

      {/* 流程节点列表 */}
      <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
        {sopData.nodes.map(renderNode)}
      </div>
    </div>
  );

  // 渲染运踪页签内容
  const renderTrackingContent = () => (
    <div>
      <div style={{ 
        padding: '30px 20px', 
        textAlign: 'center',
        color: '#1565C0',
        fontFamily: 'Microsoft YaHei',
        background: 'linear-gradient(135deg, #f0f7ff 0%, #e3f2fd 100%)',
        borderRadius: '12px',
        marginBottom: '20px'
      }}>
        <i className="fas fa-map-marker-alt" style={{ fontSize: '48px', marginBottom: '16px', color: '#1565C0' }} />
        <div style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '8px' }}>运踪信息</div>
        <div style={{ fontSize: '14px', color: '#666' }}>实时跟踪订单运输状态</div>
      </div>
      
      {/* 运踪时间线 */}
      <div style={{ marginTop: '20px' }}>
        {sopData.nodes.map((node, index) => (
          <div key={node.id} className="tracking-timeline-item" style={{ 
            display: 'flex', 
            alignItems: 'center', 
            marginBottom: '16px',
            padding: '16px',
            backgroundColor: '#f8f9fa',
            borderRadius: '12px',
            border: '1px solid #e0e0e0',
            transition: 'all 0.3s ease'
          }}>
            <div style={{
              width: '12px',
              height: '12px',
              borderRadius: '50%',
              backgroundColor: getStatusColor(node.status),
              marginRight: '16px',
              border: '2px solid white',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
            }} />
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: 'Microsoft YaHei', fontWeight: 'bold', marginBottom: '6px', fontSize: '16px' }}>
                {node.name}
              </div>
              <div style={{ fontFamily: 'Microsoft YaHei', fontSize: '14px', color: '#666' }}>
                状态: {node.status}
              </div>
            </div>
            <button 
              onClick={() => showSubTaskDetails(node.subTasks)}
              style={{
                background: 'linear-gradient(135deg, #1565C0 0%, #1976D2 100%)',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                padding: '8px 16px',
                cursor: 'pointer',
                fontFamily: 'Microsoft YaHei',
                fontSize: '14px',
                fontWeight: 'bold',
                transition: 'all 0.3s ease',
                boxShadow: '0 2px 4px rgba(21, 101, 192, 0.3)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 4px 8px rgba(21, 101, 192, 0.4)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 2px 4px rgba(21, 101, 192, 0.3)';
              }}
            >
              详情
            </button>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <Card 
      className="sop-query-card"
      title={
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ fontFamily: 'Microsoft YaHei', fontSize: '20px', fontWeight: 'bold' }}>
            SOP运踪查询
          </div>
          <div style={{ fontFamily: 'Microsoft YaHei', fontSize: '16px', color: '#666' }}>
            订单编号: {sopData.orderId}
          </div>
        </div>
      }
      style={{ marginBottom: '20px' }}
    >
      {/* 双页签 */}
      <Tabs 
        activeTab={activeTab} 
        onChange={setActiveTab}
        type="rounded"
      >
        <Tabs.TabPane key="sop" title="SOP流程">
          {renderSOPContent()}
        </Tabs.TabPane>
        <Tabs.TabPane key="tracking" title="运踪信息">
          {renderTrackingContent()}
        </Tabs.TabPane>
      </Tabs>

      {/* 子任务详情弹窗 */}
      <Modal
        title="子任务详情"
        visible={subTaskModalVisible}
        onOk={() => setSubTaskModalVisible(false)}
        onCancel={() => setSubTaskModalVisible(false)}
        style={{ maxWidth: '500px' }}
      >
        <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
          {selectedSubTasks.map((subTask, index) => (
            <div key={index} style={{
              padding: '12px',
              marginBottom: '8px',
              backgroundColor: '#f8f9fa',
              borderRadius: '4px'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                <span style={{ fontFamily: 'Microsoft YaHei', fontWeight: 'bold' }}>
                  {subTask.type} - {subTask.name}
                </span>
                <span style={{ 
                  fontFamily: 'Microsoft YaHei',
                  color: getSubTaskStatusColor(subTask.status)
                }}>
                  {subTask.status}
                </span>
              </div>
              {subTask.updateTime && (
                <div style={{ 
                  fontFamily: 'Microsoft YaHei', 
                  fontSize: '12px', 
                  color: '#666'
                }}>
                  更新时间: {subTask.updateTime}
                </div>
              )}
            </div>
          ))}
        </div>
      </Modal>

      <style>
        {`
          @keyframes shipMove {
            0% { 
              transform: translate(-50%, -50%) translateY(0px) scale(1); 
              filter: drop-shadow(0 2px 4px rgba(21, 101, 192, 0.3));
            }
            25% { 
              transform: translate(-50%, -50%) translateY(-8px) scale(1.1); 
              filter: drop-shadow(0 4px 8px rgba(21, 101, 192, 0.5));
            }
            50% { 
              transform: translate(-50%, -50%) translateY(-5px) scale(1.05); 
              filter: drop-shadow(0 3px 6px rgba(21, 101, 192, 0.4));
            }
            75% { 
              transform: translate(-50%, -50%) translateY(-3px) scale(1.02); 
              filter: drop-shadow(0 2px 4px rgba(21, 101, 192, 0.3));
            }
            100% { 
              transform: translate(-50%, -50%) translateY(0px) scale(1); 
              filter: drop-shadow(0 2px 4px rgba(21, 101, 192, 0.3));
            }
          }
          
          .sop-node:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(0,0,0,0.1);
          }
          
          .tracking-timeline-item:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(0,0,0,0.1);
            background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
          }
          
          /* 窄屏适配 */
          @media (max-width: 768px) {
            .sop-query-card {
              margin: 10px;
              padding: 12px;
            }
            
            .sop-node {
              padding: 12px !important;
              margin-bottom: 8px !important;
            }
            
            .sop-node-title {
              font-size: 18px !important;
            }
            
            .tracking-timeline-item {
              flex-direction: column;
              align-items: flex-start !important;
            }
            
            .tracking-timeline-item button {
              margin-top: 8px;
              align-self: flex-end;
            }
          }
          
          /* 超窄屏适配 */
          @media (max-width: 480px) {
            .sop-query-card {
              margin: 5px;
              padding: 8px;
            }
            
            .sop-node-title {
              font-size: 16px !important;
            }
            
            .tracking-timeline-item {
              padding: 8px !important;
            }
            
            /* 超窄屏下优化小船动画 */
            @keyframes shipMove {
              0% { transform: translate(-50%, -50%) translateY(0px); }
              50% { transform: translate(-50%, -50%) translateY(-3px); }
              100% { transform: translate(-50%, -50%) translateY(0px); }
            }
          }
        `}
      </style>
    </Card>
  );
};

export default SOPQuery;