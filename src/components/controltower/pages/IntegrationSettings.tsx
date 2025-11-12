import React, { useState } from 'react';
import { Card, Typography, Tabs, Button, Tag, Grid, Switch, Modal, Select, Message } from '@arco-design/web-react';
import { IconSync, IconSettings, IconUser, IconDriveFile, IconCalendar, IconHome, IconPlus, IconMinus } from '@arco-design/web-react/icon';

const { Row, Col } = Grid;

const { Title, Text } = Typography;
const { TabPane } = Tabs;

/**
 * 同步模块卡片接口
 */
interface SyncModuleCard {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  status: 'active' | 'inactive';
  lastSync?: string;
  category: string;
}

/**
 * 配置字段接口
 */
interface ConfigField {
  id: string;
  platform: string;
  mode: string;
}

/**
 * 对接方设置页面组件
 * @description 展示同步模块列表，支持分类筛选和卡片展示
 * @author 系统
 * @date 2024-01-15
 */
const IntegrationSettings: React.FC = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [configModalVisible, setConfigModalVisible] = useState(false);
  const [currentModuleId, setCurrentModuleId] = useState<string>('');
  const [configFields, setConfigFields] = useState<ConfigField[]>([
    { id: '1', platform: 'CargoWare', mode: 'auto' }
  ]);

  // 同步模块数据
  const [syncModules, setSyncModules] = useState<SyncModuleCard[]>([
    // 客商中心
    {
      id: 'sync-partner',
      title: '同步合作伙伴',
      description: '同步合作伙伴信息，包括供应商、客户等基础数据',
      icon: <IconUser className="text-blue-500" />,
      status: 'active',
      lastSync: '2024-01-15 14:30:00',
      category: 'customer'
    },
    // 系统设置
    {
      id: 'sync-employee',
      title: '同步员工列表',
      description: '同步企业员工信息和组织架构数据',
      icon: <IconSettings className="text-green-500" />,
      status: 'active',
      lastSync: '2024-01-15 12:00:00',
      category: 'system'
    },
    // 超级运价
    {
      id: 'sync-rate-maintenance',
      title: '同步运价维护',
      description: '同步运价数据和费用标准信息',
      icon: <IconHome className="text-orange-500" />,
      status: 'active',
      lastSync: '2024-01-15 11:30:00',
      category: 'freight'
    },
    {
      id: 'sync-inquiry',
      title: '同步询价单',
      description: '同步客户询价单据和报价请求',
      icon: <IconSync className="text-purple-500" />,
      status: 'active',
      lastSync: '2024-01-15 10:15:00',
      category: 'freight'
    },
    {
      id: 'sync-quote',
      title: '同步报价单',
      description: '同步报价单据和价格信息',
      icon: <IconDriveFile className="text-yellow-500" />,
      status: 'active',
      lastSync: '2024-01-15 09:45:00',
      category: 'freight'
    },
    // 订单中心
    {
      id: 'sync-order',
      title: '同步订单',
      description: '同步订单信息和物流跟踪数据',
      icon: <IconDriveFile className="text-red-500" />,
      status: 'active',
      lastSync: '2024-01-15 13:20:00',
      category: 'order'
    },
    // 船期中心
    {
      id: 'sync-schedule',
      title: '同步船期',
      description: '同步船期信息和航线数据',
      icon: <IconCalendar className="text-teal-500" />,
      status: 'active',
      lastSync: '2024-01-15 11:30:00',
      category: 'schedule'
    }
  ]);

  // 分类配置
  const categories = [
    { key: 'all', label: '全部', count: syncModules.length },
    { key: 'customer', label: '客商中心', count: syncModules.filter(m => m.category === 'customer').length },
    { key: 'system', label: '系统设置', count: syncModules.filter(m => m.category === 'system').length },
    { key: 'freight', label: '超级运价', count: syncModules.filter(m => m.category === 'freight').length },
    { key: 'order', label: '订单中心', count: syncModules.filter(m => m.category === 'order').length },
    { key: 'schedule', label: '船期中心', count: syncModules.filter(m => m.category === 'schedule').length }
  ];

  // 根据选中的分类过滤模块
  const filteredModules = activeTab === 'all' 
    ? syncModules 
    : syncModules.filter(module => module.category === activeTab);



  /**
   * 处理配置操作
   * @param moduleId 模块ID
   */
  const handleConfig = (moduleId: string) => {
    setCurrentModuleId(moduleId);
    setConfigModalVisible(true);
  };

  /**
   * 添加配置字段
   */
  const handleAddConfigField = () => {
    const newField: ConfigField = {
      id: Date.now().toString(),
      platform: 'CargoWare',
      mode: 'auto'
    };
    setConfigFields([...configFields, newField]);
  };

  /**
   * 删除配置字段
   * @param fieldId 字段ID
   */
  const handleRemoveConfigField = (fieldId: string) => {
    if (configFields.length > 1) {
      setConfigFields(configFields.filter(field => field.id !== fieldId));
    }
  };

  /**
   * 更新配置字段
   * @param fieldId 字段ID
   * @param key 字段键
   * @param value 字段值
   */
  const handleUpdateConfigField = (fieldId: string, key: 'platform' | 'mode', value: string) => {
    setConfigFields(configFields.map(field => 
      field.id === fieldId ? { ...field, [key]: value } : field
    ));
  };

  /**
   * 保存配置
   */
  const handleSaveConfig = () => {
    console.log('保存配置:', { moduleId: currentModuleId, config: configFields });
    Message.success('设置成功');
    setConfigModalVisible(false);
  };

  /**
   * 取消配置
   */
  const handleCancelConfig = () => {
    setConfigModalVisible(false);
    // 重置配置字段为默认值
    setConfigFields([{ id: '1', platform: 'CargoWare', mode: 'auto' }]);
  };

  /**
   * 处理同步开关切换
   * @param moduleId 模块ID
   * @param enabled 是否启用
   */
  const handleSyncToggle = (moduleId: string, enabled: boolean) => {
    setSyncModules(prevModules => 
      prevModules.map(module => 
        module.id === moduleId 
          ? { ...module, status: enabled ? 'active' : 'inactive' }
          : module
      )
    );
    console.log(`模块 ${moduleId} 同步状态切换为: ${enabled ? '启用' : '禁用'}`);
  };

  return (
    <div className="p-6">
      
      {/* 分类标签页 */}
      <Tabs 
        activeTab={activeTab} 
        onChange={setActiveTab}
        className="mb-6"
        type="rounded"
      >
        {categories.map(category => (
          <TabPane 
            key={category.key} 
            title={
              <span>
                {category.label}
                <Tag className="ml-2" size="small">{category.count}</Tag>
              </span>
            }
          />
        ))}
      </Tabs>

      {/* 同步模块卡片网格 */}
      <Row gutter={[16, 16]}>
        {filteredModules.map(module => (
          <Col key={module.id} xs={24} sm={12} md={8} lg={6}>
            <Card 
              className="h-full hover:shadow-lg transition-shadow duration-200"
              hoverable
            >
              <div className="flex flex-col h-full">
                {/* 卡片头部 */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center">
                    <div className="text-2xl mr-3">
                      {module.icon}
                    </div>
                    <div>
                      <Title heading={6} className="mb-1">
                        {module.title}
                      </Title>
                    </div>
                  </div>
                  <Switch 
                    checked={module.status === 'active'} 
                    onChange={(checked) => handleSyncToggle(module.id, checked)}
                  />
                </div>

                {/* 卡片描述 */}
                <Text className="text-gray-600 text-sm mb-4 flex-1">
                  {module.description}
                </Text>

                {/* 操作按钮 */}
                <div className="flex justify-end">
                  <Button 
                    type="primary" 
                    size="small"
                    onClick={() => handleConfig(module.id)}
                  >
                    编辑配置
                  </Button>
                </div>
              </div>
            </Card>
          </Col>
        ))}
      </Row>

      {/* 空状态 */}
      {filteredModules.length === 0 && (
        <div className="text-center py-12">
          <Title heading={4} className="text-gray-500">
            暂无同步模块
          </Title>
          <Text className="text-gray-400">
            当前分类下没有可用的同步模块
          </Text>
        </div>
      )}

      {/* 配置编辑弹窗 */}
       <Modal
         title="编辑配置"
         visible={configModalVisible}
         onCancel={handleCancelConfig}
         footer={[
           <Button key="cancel" onClick={handleCancelConfig}>
             取消
           </Button>,
           <Button key="confirm" type="primary" onClick={handleSaveConfig}>
             确认
           </Button>
         ]}
         style={{ width: 600 }}
       >
        <div className="space-y-4">
          {configFields.map((field) => (
            <div key={field.id} className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg">
              <div className="flex-1">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Text className="block mb-2 text-sm font-medium">同步平台</Text>
                    <Select
                      value={field.platform}
                      onChange={(value) => handleUpdateConfigField(field.id, 'platform', value)}
                      className="w-full"
                    >
                      <Select.Option value="CargoWare">CargoWare</Select.Option>
                      <Select.Option value="eTower">eTower</Select.Option>
                    </Select>
                  </div>
                  <div>
                    <Text className="block mb-2 text-sm font-medium">同步模式</Text>
                    <Select
                      value={field.mode}
                      onChange={(value) => handleUpdateConfigField(field.id, 'mode', value)}
                      className="w-full"
                    >
                      <Select.Option value="auto">自动同步</Select.Option>
                      <Select.Option value="manual">手动同步</Select.Option>
                    </Select>
                  </div>
                </div>
              </div>
              <div className="flex flex-row space-x-3 items-end">
                <Button
                  type="primary"
                  icon={<IconPlus />}
                  size="small"
                  onClick={handleAddConfigField}
                  className="w-8 h-8"
                />
                <Button
                  type="secondary"
                  icon={<IconMinus />}
                  size="small"
                  onClick={() => handleRemoveConfigField(field.id)}
                  disabled={configFields.length === 1}
                  className="w-8 h-8"
                />
              </div>
            </div>
          ))}
        </div>
      </Modal>
    </div>
  );
};

export default IntegrationSettings;