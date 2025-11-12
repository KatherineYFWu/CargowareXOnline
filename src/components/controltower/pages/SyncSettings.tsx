import React, { useState } from 'react';
import { Card, Typography, Button, Switch, Grid, Modal, Input, Message } from '@arco-design/web-react';
import { IconSettings, IconCloud } from '@arco-design/web-react/icon';

const { Row, Col } = Grid;
const { Title, Text } = Typography;

/**
 * 对接方配置接口
 */
interface IntegrationConfig {
  id: string;
  name: string;
  enabled: boolean;
  config: Record<string, string>;
}

/**
 * 同步设置页面组件
 * @description 用于配置各种同步相关的设置
 * @author 系统
 * @date 2024-01-15
 */
const SyncSettings: React.FC = () => {
  const [configModalVisible, setConfigModalVisible] = useState(false);
  const [currentIntegration, setCurrentIntegration] = useState<string>('');
  const [configData, setConfigData] = useState<Record<string, string>>({});

  // 对接方数据
  const [integrations, setIntegrations] = useState<IntegrationConfig[]>([
    {
      id: 'cargoware',
      name: 'CargoWare',
      enabled: true,
      config: {
        url: '',
        ak: '',
        sk: ''
      }
    },
    {
      id: 'etower',
      name: 'eTower',
      enabled: false,
      config: {
        url: '',
        token: ''
      }
    }
  ]);

  /**
   * 处理开关切换
   * @param integrationId 对接方ID
   * @param enabled 是否启用
   */
  const handleToggle = (integrationId: string, enabled: boolean) => {
    setIntegrations(prev => 
      prev.map(item => 
        item.id === integrationId 
          ? { ...item, enabled }
          : item
      )
    );
    console.log(`${integrationId} 状态切换为: ${enabled ? '启用' : '禁用'}`);
  };

  /**
   * 处理编辑配置
   * @param integrationId 对接方ID
   */
  const handleEditConfig = (integrationId: string) => {
    const integration = integrations.find(item => item.id === integrationId);
    if (integration) {
      setCurrentIntegration(integrationId);
      setConfigData({ ...integration.config });
      setConfigModalVisible(true);
    }
  };

  /**
   * 保存配置
   */
  const handleSaveConfig = () => {
    setIntegrations(prev => 
      prev.map(item => 
        item.id === currentIntegration 
          ? { ...item, config: { ...configData } }
          : item
      )
    );
    Message.success('配置保存成功');
    setConfigModalVisible(false);
    setConfigData({});
    setCurrentIntegration('');
  };

  /**
   * 取消配置
   */
  const handleCancelConfig = () => {
    setConfigModalVisible(false);
    setConfigData({});
    setCurrentIntegration('');
  };

  /**
   * 更新配置字段
   * @param key 字段键
   * @param value 字段值
   */
  const handleConfigChange = (key: string, value: string) => {
    setConfigData(prev => ({ ...prev, [key]: value }));
  };

  /**
   * 获取配置字段
   */
  const getConfigFields = () => {
    if (currentIntegration === 'cargoware') {
      return [
        { key: 'url', label: '接口Url', placeholder: '请输入接口地址' },
        { key: 'ak', label: 'AK', placeholder: '请输入Access Key' },
        { key: 'sk', label: 'SK', placeholder: '请输入Secret Key' }
      ];
    } else if (currentIntegration === 'etower') {
      return [
        { key: 'url', label: 'url', placeholder: '请输入接口地址' },
        { key: 'token', label: 'Token', placeholder: '请输入访问令牌' }
      ];
    }
    return [];
  };

  return (
    <div className="p-6">
      {/* 对接方设置卡片 */}
      <Row gutter={[16, 16]}>
        {integrations.map(integration => (
          <Col key={integration.id} xs={24} sm={12} md={8} lg={6}>
            <Card 
              className="h-full hover:shadow-lg transition-shadow duration-200"
              hoverable
            >
              <div className="flex flex-col h-full">
                {/* 卡片头部 */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center">
                    <div className="text-2xl mr-3">
                      {integration.id === 'cargoware' ? (
                        <IconSettings className="text-blue-500" />
                      ) : (
                        <IconCloud className="text-green-500" />
                      )}
                    </div>
                    <div>
                      <Title heading={6} className="mb-1">
                        {integration.name}
                      </Title>
                    </div>
                  </div>
                  <Switch 
                    checked={integration.enabled} 
                    onChange={(checked) => handleToggle(integration.id, checked)}
                  />
                </div>

                {/* 卡片描述 */}
                <Text className="text-gray-600 text-sm mb-4 flex-1">
                  {integration.id === 'cargoware' 
                    ? '配置CargoWare系统的对接参数和认证信息' 
                    : '配置eTower系统的对接参数和访问令牌'
                  }
                </Text>

                {/* 操作按钮 */}
                <div className="flex justify-end">
                  <Button 
                    type="primary" 
                    size="small"
                    onClick={() => handleEditConfig(integration.id)}
                  >
                    编辑配置
                  </Button>
                </div>
              </div>
            </Card>
          </Col>
        ))}
      </Row>

      {/* 配置编辑弹窗 */}
      <Modal
        title={`编辑${integrations.find(item => item.id === currentIntegration)?.name || ''}配置`}
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
        style={{ width: 500 }}
      >
        <div className="space-y-4">
          {getConfigFields().map(field => (
            <div key={field.key}>
              <Text className="block mb-2 text-sm font-medium">{field.label}</Text>
              <Input
                value={configData[field.key] || ''}
                onChange={(value) => handleConfigChange(field.key, value)}
                placeholder={field.placeholder}
                className="w-full"
              />
            </div>
          ))}
        </div>
      </Modal>
    </div>
  );
};

export default SyncSettings;