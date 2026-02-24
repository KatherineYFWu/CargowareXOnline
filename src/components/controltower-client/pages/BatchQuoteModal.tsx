import React, { useState } from 'react';
import {
  Modal,
  Input,
  Button,
  Typography,
  Checkbox
} from '@arco-design/web-react';
import { IconSettings } from '@arco-design/web-react/icon';
// import ScreenshotModal from './ScreenshotModal'; // 暂时注释，需要确认是否存在

const { Title, Text } = Typography;

interface BatchQuoteModalProps {
  visible: boolean;
  onCancel: () => void;
  selectedItems: any[];
}

interface SampleData {
  shipCompany: string;
  departurePort: string;
  destinationPort: string;
  sailingDate: string;
  validPeriod: string;
  route: string;
  freightCode: string;
  directTransit: string;
  oceanFreight: string;
  originalPrice: string;
  additionalFees?: string;
}

/**
 * 批量报价弹窗组件
 * 用于快速批量报价功能，支持多个运价信息展示和价格设置
 */
const BatchQuoteModal: React.FC<BatchQuoteModalProps> = ({
  visible,
  onCancel,
  // selectedItems
}) => {
  const [gp20Price, setGp20Price] = useState('');
  const [gp40Price, setGp40Price] = useState('');
  const [hc40Price, setHc40Price] = useState('');
  const [hc45Price, setHc45Price] = useState('');
  const [nor20Price, setNor20Price] = useState('');
  const [nor40Price, setNor40Price] = useState('');
  const [hasAdditionalFees, setHasAdditionalFees] = useState(false);

  // 模拟选中的运价数据 - 根据截图显示多个运价信息
  const baseSampleDataList: SampleData[] = [
    {
      shipCompany: 'MAERSK',
      departurePort: 'SHANGHAI',
      destinationPort: 'JEBEL ALI',
      sailingDate: '2025-08-24 ~ 2025-09-12',
      validPeriod: '截止19',
      route: 'KOSTAS K/V.532W',
      freightCode: 'FM1',
      directTransit: '直达',
      oceanFreight: '20GP/40GP/40HC',
      originalPrice: 'USD 1597/1682/1682'
    },
    {
      shipCompany: 'HPL_QQ',
      departurePort: 'SHANGHAI',
      destinationPort: 'JEBEL ALI',
      sailingDate: '2025-08-25 ~ 2025-09-12',
      validPeriod: '截止18',
      route: '',
      freightCode: '',
      directTransit: '',
      oceanFreight: '',
      originalPrice: ''
    }
  ];

  // 根据附加费状态动态生成运价数据
  const sampleDataList = baseSampleDataList.map(data => {
    if (hasAdditionalFees && data.originalPrice) {
      return {
        ...data,
        additionalFees: '文件费: USD 50\n铅封费: USD 25\nTHC费: USD 120\n报关费: USD 80\n查验费: USD 150'
      };
    }
    return data;
  });

  /**
   * 处理提交批量报价
   */
  const handleSubmit = () => {
    // 处理提交逻辑
    console.log('批量报价提交', {
      gp20Price,
      gp40Price,
      hc40Price,
      hasAdditionalFees
    });
    onCancel();
  };

  return (
    <>
    <Modal
      title="快速报价"
      visible={visible}
      onCancel={onCancel}
      footer={null}
      style={{ top: 50, width: 600 }}
    >

      <div style={{ padding: '24px 32px' }}>
        {/* 提示文本 */}
        <div style={{ marginBottom: '4px' }}>
          <Text style={{ color: '#666', fontSize: '14px' }}>
            您可以修改/复制下面的文本，快速报价
          </Text>
        </div>

        {/* 运价信息列表 */}
        <div style={{ 
          maxHeight: '200px', 
          overflowY: 'auto',
          marginBottom: '16px',
          border: '1px solid #e8e8e8',
          borderRadius: '4px',
          backgroundColor: '#f8f9fa'
        }}>
          {sampleDataList.map((sampleData, index) => (
            <div key={index} style={{ 
              padding: '12px 16px', 
              borderBottom: index < sampleDataList.length - 1 ? '1px solid #e8e8e8' : 'none'
            }}>
              <div style={{ fontSize: '12px', lineHeight: '1.5', color: '#333' }}>
                <div><strong>船公司:</strong> {sampleData.shipCompany}</div>
                <div><strong>起运港:</strong> {sampleData.departurePort}</div>
                <div><strong>目的港:</strong> {sampleData.destinationPort}</div>
                <div><strong>开航/到港:</strong> {sampleData.sailingDate}, {sampleData.validPeriod}</div>
                {sampleData.route && <div><strong>船名/航次:</strong> {sampleData.route}</div>}
                {sampleData.freightCode && <div><strong>航线代码:</strong> {sampleData.freightCode}</div>}
                {sampleData.directTransit && <div><strong>直达/中转:</strong> {sampleData.directTransit}</div>}
                {sampleData.oceanFreight && <div><strong>海运费:</strong> {sampleData.oceanFreight}</div>}
                {sampleData.originalPrice && (
                  <div style={{ marginTop: '4px', paddingLeft: '20px' }}>
                    <strong>{sampleData.originalPrice}</strong>
                    {sampleData.additionalFees && (
                      <div style={{ marginTop: '8px', fontSize: '11px', color: '#666' }}>
                        <div><strong>附加费用：</strong></div>
                        {sampleData.additionalFees.split('\n').map((fee: string, feeIndex: number) => (
                          <div key={feeIndex} style={{ marginLeft: '8px' }}>• {fee}</div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* 固定价格加价 */}
        <div style={{ marginBottom: '16px' }}>
          <Title heading={6} style={{ color: '#1890ff', marginBottom: '12px', fontSize: '14px' }}>
            固定价格加价
          </Title>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {/* 第一行 */}
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'nowrap' }}>
              <div style={{ flex: 1 }}>
                <Input
                  placeholder="请输入"
                  value={gp20Price}
                  onChange={setGp20Price}
                  prefix={<Text style={{ fontSize: '12px', color: '#666', marginRight: '8px', whiteSpace: 'nowrap' }}>20GP</Text>}
                  style={{ fontSize: '12px', height: '32px' }}
                />
              </div>
              <div style={{ flex: 1 }}>
                <Input
                  placeholder="请输入"
                  value={gp40Price}
                  onChange={setGp40Price}
                  prefix={<Text style={{ fontSize: '12px', color: '#666', marginRight: '8px', whiteSpace: 'nowrap' }}>40GP</Text>}
                  style={{ fontSize: '12px', height: '32px' }}
                />
              </div>
              <div style={{ flex: 1 }}>
                <Input
                  placeholder="请输入"
                  value={hc40Price}
                  onChange={setHc40Price}
                  prefix={<Text style={{ fontSize: '12px', color: '#666', marginRight: '8px', whiteSpace: 'nowrap' }}>40HC</Text>}
                  style={{ fontSize: '12px', height: '32px' }}
                />
              </div>
            </div>
            {/* 第二行 */}
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'nowrap' }}>
              <div style={{ flex: 1 }}>
                <Input
                  placeholder="请输入"
                  value={hc45Price}
                  onChange={setHc45Price}
                  prefix={<Text style={{ fontSize: '12px', color: '#666', marginRight: '8px', whiteSpace: 'nowrap' }}>45HC</Text>}
                  style={{ fontSize: '12px', height: '32px' }}
                />
              </div>
              <div style={{ flex: 1 }}>
                <Input
                  placeholder="请输入"
                  value={nor20Price}
                  onChange={setNor20Price}
                  prefix={<Text style={{ fontSize: '12px', color: '#666', marginRight: '8px', whiteSpace: 'nowrap' }}>20NOR</Text>}
                  style={{ fontSize: '12px', height: '32px' }}
                />
              </div>
              <div style={{ flex: 1 }}>
                <Input
                  placeholder="请输入"
                  value={nor40Price}
                  onChange={setNor40Price}
                  prefix={<Text style={{ fontSize: '12px', color: '#666', marginRight: '8px', whiteSpace: 'nowrap' }}>40NOR</Text>}
                  style={{ fontSize: '12px', height: '32px' }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* 费用选项 */}
        <div style={{ marginBottom: '20px' }}>
          <Checkbox
            checked={hasAdditionalFees}
            onChange={setHasAdditionalFees}
          >
            <Text style={{ fontSize: '12px' }}>附加费</Text>
          </Checkbox>

        </div>

        {/* 底部按钮 */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          marginTop: '20px',
          paddingTop: '16px',
          borderTop: '1px solid #f0f0f0'
        }}>
          {/* 左下角齿轮图标 */}
          <Button
            type="text"
            icon={<IconSettings />}
            onClick={() => {}}
            style={{
              color: '#1890ff',
              fontSize: '16px',
              padding: '4px',
              height: '32px',
              width: '32px',
              border: 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          />
          
          {/* 右侧按钮组 */}
          <div style={{ display: 'flex', gap: '8px' }}>
            <Button 
              onClick={onCancel}
              style={{
                height: '32px',
                fontSize: '14px'
              }}
            >
              取消
            </Button>
            <Button
              type="primary"
              onClick={handleSubmit}
              style={{
                backgroundColor: '#1890ff',
                borderColor: '#1890ff',
                height: '32px',
                fontSize: '14px'
              }}
            >
              文本报价
            </Button>
          </div>
        </div>
      </div>

      </Modal>
      
      {/* 截图弹窗 - 暂时注释，需要确认ScreenshotModal组件是否存在 */}
      {/*
      <ScreenshotModal
        visible={showScreenshotModal}
        onCancel={() => setShowScreenshotModal(false)}
        onSave={(data) => {
          console.log('截图弹窗保存数据:', data);
          setShowScreenshotModal(false);
        }}
      />
      */}
    </>
  );
};

export default BatchQuoteModal;