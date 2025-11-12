import React from 'react';
import { Card, Typography, Empty, Button } from '@arco-design/web-react';
import { IconUser } from '@arco-design/web-react/icon';

const { Title, Text } = Typography;

/**
 * 客户订阅管理页面
 * @description 管理客户运价订阅相关功能的页面
 * @author 系统生成
 * @date 2024-01-15
 */
const CustomerSubscription: React.FC = () => {
  /**
   * 处理新增客户订阅操作
   */
  const handleAddSubscription = () => {
    // TODO: 实现新增客户订阅逻辑
    console.log('新增客户订阅');
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <Title heading={3} className="mb-2">
          客户订阅管理
        </Title>
        <Text type="secondary">
          管理客户运价订阅，包括客户订阅创建、修改、查看等功能
        </Text>
      </div>

      <Card className="min-h-96">
        <div className="flex flex-col items-center justify-center py-16">
          <Empty
            icon={<IconUser />}
            description={
              <div className="text-center">
                <div className="mb-2">暂无客户订阅数据</div>
                <Text type="secondary" className="text-sm">
                  该功能正在开发中，敬请期待
                </Text>
              </div>
            }
          />
          <Button 
            type="primary" 
            onClick={handleAddSubscription}
            className="mt-4"
          >
            新增客户订阅
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default CustomerSubscription;