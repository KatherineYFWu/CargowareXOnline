import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  Button, 
  Card, 
  Typography, 
  Space, 
  Input
} from '@arco-design/web-react';
import { 
  IconLeft,
  IconRobot,
  IconBulb,
  IconFile,
  IconUpload,
  IconSave,
  IconSend
} from '@arco-design/web-react/icon';

const { Title } = Typography;
const TextArea = Input.TextArea;

const BLAddition: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();
  
  // 提单字段数据
  const [shipper, setShipper] = useState('发货人(Shipper)\nRoom 2101, Building 9, 970 Dalian Road,\nYangpu District, Shanghai\nWalltech Limit Co.,Ltd');
  const [consignee, setConsignee] = useState('收货人(Consignee)\nONE');
  const [notifyParty, setNotifyParty] = useState('通知方(Notify Party)\nSAME AS CONSIGNEE');
  const [forwardingAgent, setForwardingAgent] = useState('');
  const [masterBlNumber, setMasterBlNumber] = useState('');
  const [placeOfShipment, setPlaceOfShipment] = useState('SHANGHAI');
  const [placeOfIssue, setPlaceOfIssue] = useState('SHANGHAI');
   // 原产地
   const [countryOfOrigin, setCountryOfOrigin] = useState('CHINA');
   const [blRemarks, setBlRemarks] = useState('SAY: WIRE ONLY.');
  
  // 船舶信息
  const [vessel, setVessel] = useState('');
  const [voyage, setVoyage] = useState('');
  const [transTerm, setTransTerm] = useState('');
  const [portOfLoading, setPortOfLoading] = useState('SHANGHAI');
  const [dateOfIssue, setDateOfIssue] = useState('');
  const [containerNo, setContainerNo] = useState('');
  
  // 货物信息
  const [placeOfReceipt, setPlaceOfReceipt] = useState('');
  const [portOfDischarge, setPortOfDischarge] = useState('KLAPEIDA');
  const [placeOfDelivery, setPlaceOfDelivery] = useState('');
  const [hsCode, setHsCode] = useState('');
  const [piecesType, setPiecesType] = useState('');
  
  // 卸货港信息
  const [finalDestination, setFinalDestination] = useState('KLAPEIDA');
  const [grossWeight, setGrossWeight] = useState('12.000');
  const [measurement, setMeasurement] = useState('0.000');
  const [packageCount, setPackageCount] = useState('12');
  const [containerNumbers, setContainerNumbers] = useState('1*20GP');
  
  // 三列布局区域
  const [marks, setMarks] = useState('');
  const [goodsDescription, setGoodsDescription] = useState('');
  const [portRequirements, setPortRequirements] = useState('装箱单要求:\n原产地证明:');
  
  // 设备信息
  const [eqSize, setEqSize] = useState('20GP');
  const [eqNo, setEqNo] = useState('');
  const [sealNo, setSealNo] = useState('');
  const [eqPackageCount, setEqPackageCount] = useState('0');
  const [eqGrossWeight, setEqGrossWeight] = useState('0.000');
  const [eqMeasurement, setEqMeasurement] = useState('0.000');
  
  // B/L方式
  const [blWay, setBlWay] = useState('surrendered');
  const [originalCount, setOriginalCount] = useState('ONE');
  
  // 提单类型
  const [blType, setBlType] = useState('Master BL');
  
  const handleBack = () => {
    navigate(-1);
  };
 // 提交补料处理函数
  const handleSubmit = () => {
    console.log('提交补料数据');
    // 这里可以添加提交逻辑
  };

  // AI识别处理函数
  const handleAIRecognition = () => {
    console.log('AI识别');
    // 这里可以添加AI识别逻辑
  };

  // 规则提示处理函数
  const handleRulePrompt = () => {
    console.log('规则提示');
    // 这里可以添加规则提示逻辑
  };

  // 保函生成处理函数
  const handleLetterGeneration = () => {
    console.log('保函生成');
    // 这里可以添加保函生成逻辑
  };

  // 上传附件处理函数
  const handleUploadAttachment = () => {
    console.log('上传附件');
    // 这里可以添加上传附件逻辑
  };

  // 暂存草稿处理函数
  const handleSaveDraft = () => {
    console.log('暂存草稿');
    // 这里可以添加暂存草稿逻辑
  };

  return (
    <div className="bl-addition-page" style={{ padding: '20px', backgroundColor: '#f5f5f5', minHeight: '100vh' }}>
      {/* 顶部导航 */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <Button 
            type="text" 
            icon={<IconLeft />} 
            onClick={handleBack}
            className="mr-3"
          >
            返回
          </Button>
          <Title heading={4} style={{ margin: 0 }}>提交补料 - {orderId}</Title>
        </div>
        <Space>
          <Button type="primary" icon={<IconRobot />} onClick={handleAIRecognition}>
            AI识别
          </Button>
          <Button type="primary" icon={<IconBulb />} onClick={handleRulePrompt}>
            规则提示
          </Button>
          <Button type="primary" icon={<IconFile />} onClick={handleLetterGeneration}>
            保函生成
          </Button>
          <Button type="primary" icon={<IconUpload />} onClick={handleUploadAttachment}>
            上传附件
          </Button>
          <Button type="outline" icon={<IconSave />} onClick={handleSaveDraft}>
            暂存草稿
          </Button>
          <Button type="primary" icon={<IconSend />} onClick={handleSubmit}>
            提交补料
          </Button>
        </Space>
      </div>

      {/* Master B/L 表单 */}
      <Card className="bl-form-card" style={{ backgroundColor: 'white' }}>


        {/* Master B/L 主要信息区域 */}
        <div className="bg-white border mb-4">
          <div className="grid grid-cols-2 gap-0">
            {/* 左侧：发货人、收货人、通知方 */}
            <div className="border-r">
              {/* 发货人 */}
              <div className="border-b p-3">
                <div className="text-gray-600 mb-2 text-xs">发货人(Shipper)</div>
                <TextArea 
                  value={shipper}
                  onChange={setShipper}
                  autoSize={{ minRows: 3, maxRows: 5 }}
                  style={{ fontSize: '11px', border: 'none', padding: 0, resize: 'none' }}
                  className="text-xs leading-relaxed"
                />
              </div>
              
              {/* 收货人 */}
              <div className="border-b p-3">
                <div className="text-gray-600 mb-2 text-xs">收货人(Consignee)</div>
                <TextArea 
                  value={consignee}
                  onChange={setConsignee}
                  autoSize={{ minRows: 2, maxRows: 4 }}
                  style={{ fontSize: '11px', border: 'none', padding: 0, resize: 'none' }}
                  className="text-xs"
                />
              </div>
              
              {/* 通知方 */}
              <div className="p-3">
                <div className="text-gray-600 mb-2 text-xs">通知方(Notify Party)</div>
                <TextArea 
                  value={notifyParty}
                  onChange={setNotifyParty}
                  autoSize={{ minRows: 2, maxRows: 4 }}
                  style={{ fontSize: '11px', border: 'none', padding: 0, resize: 'none' }}
                  className="text-xs"
                />
              </div>
            </div>
            
            {/* 右侧：Master B/L 信息 */}
            <div>
              <div className="text-center p-4 border-b">
                <div className="text-gray-600 mb-2 text-xs">提单类型：</div>
                <div className="flex justify-center space-x-4">
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="radio"
                      name="blType"
                      value="Master BL"
                      checked={blType === 'Master BL'}
                      onChange={(e) => setBlType(e.target.value)}
                      className="mr-1"
                    />
                    <span className="text-xs text-gray-700">Master BL</span>
                  </label>
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="radio"
                      name="blType"
                      value="House BL"
                      checked={blType === 'House BL'}
                      onChange={(e) => setBlType(e.target.value)}
                      className="mr-1"
                    />
                    <span className="text-xs text-gray-700">House BL</span>
                  </label>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-0">
                <div className="border-r border-b p-3">
                  <div className="text-gray-600 mb-1 text-xs">提单号(B/L NO.)</div>
                  <Input 
                    value={orderId || ''}
                    size="small" 
                    style={{ fontSize: '11px', border: 'none', padding: 0 }}
                    className="text-xs"
                  />
                </div>
                <div className="border-b p-3">
                  <div className="text-gray-600 mb-1 text-xs">订舱代理(B/L Agent)</div>
                  <Input 
                    value="ONE"
                    size="small" 
                    style={{ fontSize: '11px', border: 'none', padding: 0 }}
                    className="text-xs"
                  />
                </div>
                <div className="border-r border-b p-3">
                  <div className="text-gray-600 mb-1 text-xs">代理商(Forwarding Agent)</div>
                  <Input 
                    value={forwardingAgent}
                    onChange={setForwardingAgent}
                    size="small" 
                    className="mt-1" 
                    style={{ fontSize: '11px', border: 'none', padding: 0 }} 
                  />
                </div>
                <div className="border-b p-3">
                  <div className="text-gray-600 mb-1 text-xs">主提单号(Master B/L NO.)</div>
                  <Input 
                    value={masterBlNumber}
                    onChange={setMasterBlNumber}
                    size="small" 
                    className="mt-1" 
                    style={{ fontSize: '11px', border: 'none', padding: 0 }} 
                  />
                </div>
                <div className="border-r border-b p-3">
                  <div className="text-gray-600 mb-1 text-xs">装运地(Place of Loading)</div>
                  <Input 
                    value={placeOfShipment}
                    onChange={setPlaceOfShipment}
                    size="small" 
                    style={{ fontSize: '11px', border: 'none', padding: 0 }}
                    className="text-xs mt-1"
                  />
                </div>
                <div className="border-b p-3">
                  <div className="text-gray-600 mb-1 text-xs">签发地点(Place of Issue)</div>
                  <Input 
                    value={placeOfIssue}
                    onChange={setPlaceOfIssue}
                    size="small" 
                    style={{ fontSize: '11px', border: 'none', padding: 0 }}
                    className="text-xs mt-1"
                  />
                </div>
                <div className="border-r border-b p-3">
                  <div className="text-gray-600 mb-1 text-xs">原产地(Country of Origin)</div>
                  <Input 
                    value={countryOfOrigin}
                    onChange={setCountryOfOrigin}
                    size="small" 
                    style={{ fontSize: '11px', border: 'none', padding: 0 }}
                    className="text-xs mt-1"
                  />
                </div>
                <div className="border-b p-3">
                  <div className="text-gray-600 mb-1 text-xs">提单备注(Remark)</div>
                  <TextArea 
                    value={blRemarks}
                    onChange={setBlRemarks}
                    autoSize={{ minRows: 2, maxRows: 3 }}
                    style={{ fontSize: '11px', border: 'none', padding: 0, resize: 'none' }}
                    className="text-xs"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 船舶信息表格 */}
        <div className="bg-white border mb-4">
          <div className="grid grid-cols-6 gap-0 text-xs">
            <div className="border-r border-b p-2">
              <div className="text-gray-600 mb-1">船名</div>
              <div className="text-gray-600">(Vessel)</div>
              <Input 
                value={vessel}
                onChange={setVessel}
                size="small" 
                className="mt-1" 
                style={{ fontSize: '11px', border: 'none', padding: 0 }} 
              />
            </div>
            <div className="border-r border-b p-2">
              <div className="text-gray-600 mb-1">航次</div>
              <div className="text-gray-600">(Voyage)</div>
              <Input 
                value={voyage}
                onChange={setVoyage}
                size="small" 
                className="mt-1" 
                style={{ fontSize: '11px', border: 'none', padding: 0 }} 
              />
            </div>
            <div className="border-r border-b p-2">
              <div className="text-gray-600 mb-1">运输条款</div>
              <div className="text-gray-600">(Trade Term)</div>
              <Input 
                value={transTerm}
                onChange={setTransTerm}
                size="small" 
                className="mt-1" 
                style={{ fontSize: '11px', border: 'none', padding: 0 }} 
              />
            </div>
            <div className="border-r border-b p-2">
              <div className="text-gray-600 mb-1">装货地</div>
              <div className="text-gray-600">(Port of Loading)</div>
              <Input 
                value={portOfLoading}
                onChange={setPortOfLoading}
                size="small" 
                className="mt-1" 
                style={{ fontSize: '11px', border: 'none', padding: 0 }} 
              />
            </div>
            <div className="border-r border-b p-2">
              <div className="text-gray-600 mb-1">签发日期</div>
              <div className="text-gray-600">(Date of Issue)</div>
              <Input 
                value={dateOfIssue}
                onChange={setDateOfIssue}
                size="small" 
                className="mt-1" 
                style={{ fontSize: '11px', border: 'none', padding: 0 }} 
              />
            </div>
            <div className="border-b p-2">
              <div className="text-gray-600 mb-1">集装箱号</div>
              <div className="text-gray-600">(Container No.)</div>
              <Input 
                value={containerNo}
                onChange={setContainerNo}
                size="small" 
                className="mt-1" 
                style={{ fontSize: '11px', border: 'none', padding: 0 }} 
              />
            </div>
          </div>
        </div>
        
        {/* 货物信息表格 */}
        <div className="bg-white border mb-4">
          <div className="grid grid-cols-6 gap-0 text-xs">
            <div className="border-r p-2">
              <div className="text-gray-600 mb-1">收货地</div>
              <div className="text-gray-600">(Place of Receipt)</div>
              <Input 
                value={placeOfReceipt}
                onChange={setPlaceOfReceipt}
                size="small" 
                className="mt-1" 
                style={{ fontSize: '11px', border: 'none', padding: 0 }} 
              />
            </div>
            <div className="border-r p-2">
              <div className="text-gray-600 mb-1">起运港</div>
              <div className="text-gray-600">(Port of Loading)</div>
              <Input 
                value={portOfLoading}
                onChange={setPortOfLoading}
                size="small" 
                className="mt-1" 
                style={{ fontSize: '11px', border: 'none', padding: 0 }} 
              />
            </div>
            <div className="border-r p-2">
              <div className="text-gray-600 mb-1">卸货港</div>
              <div className="text-gray-600">(Port of Discharge)</div>
              <Input 
                value={portOfDischarge}
                onChange={setPortOfDischarge}
                size="small" 
                className="mt-1" 
                style={{ fontSize: '11px', border: 'none', padding: 0 }} 
              />
            </div>
            <div className="border-r p-2">
              <div className="text-gray-600 mb-1">交货地</div>
              <div className="text-gray-600">(Place of Delivery)</div>
              <Input 
                value={placeOfDelivery}
                onChange={setPlaceOfDelivery}
                size="small" 
                className="mt-1" 
                style={{ fontSize: '11px', border: 'none', padding: 0 }} 
              />
            </div>
            <div className="border-r p-2">
              <div className="text-gray-600 mb-1">HS编号</div>
              <div className="text-gray-600">(HS Code)</div>
              <Input 
                value={hsCode}
                onChange={setHsCode}
                size="small" 
                className="mt-1" 
                style={{ fontSize: '11px', border: 'none', padding: 0 }} 
              />
            </div>
            <div className="p-2">
              <div className="text-gray-600 mb-1">件数类型</div>
              <div className="text-gray-600">(Pieces Type)</div>
              <Input 
                value={piecesType}
                onChange={setPiecesType}
                size="small" 
                className="mt-1" 
                style={{ fontSize: '11px', border: 'none', padding: 0 }} 
              />
            </div>
          </div>
        </div>
        
        {/* 卸货港信息表格 */}
        <div className="bg-white border mb-4">
          <div className="grid grid-cols-5 gap-0 text-xs">
            <div className="border-r p-2">
              <div className="text-gray-600 mb-1">卸货港</div>
              <div className="text-gray-600">(Final Destination)</div>
              <Input 
                value={finalDestination}
                onChange={setFinalDestination}
                size="small" 
                className="mt-1" 
                style={{ fontSize: '11px', border: 'none', padding: 0 }} 
              />
            </div>
            <div className="border-r p-2">
              <div className="text-gray-600 mb-1">毛重</div>
              <div className="text-gray-600">(Gross Weight)</div>
              <Input 
                value={grossWeight}
                onChange={setGrossWeight}
                size="small" 
                className="mt-1" 
                style={{ fontSize: '11px', border: 'none', padding: 0 }} 
              />
              <div className="text-xs">KGS</div>
            </div>
            <div className="border-r p-2">
              <div className="text-gray-600 mb-1">尺寸</div>
              <div className="text-gray-600">(Measurement)</div>
              <Input 
                value={measurement}
                onChange={setMeasurement}
                size="small" 
                className="mt-1" 
                style={{ fontSize: '11px', border: 'none', padding: 0 }} 
              />
              <div className="text-xs">CBM</div>
            </div>
            <div className="border-r p-2">
              <div className="text-gray-600 mb-1">件数</div>
              <div className="text-gray-600">(No.of Pkgs)</div>
              <Input 
                value={packageCount}
                onChange={setPackageCount}
                size="small" 
                className="mt-1" 
                style={{ fontSize: '11px', border: 'none', padding: 0 }} 
              />
            </div>
            <div className="p-2">
              <div className="text-gray-600 mb-1">集装箱号</div>
              <div className="text-gray-600">(Container Numbers)</div>
              <Input 
                value={containerNumbers}
                onChange={setContainerNumbers}
                size="small" 
                className="mt-1" 
                style={{ fontSize: '11px', border: 'none', padding: 0 }} 
              />
            </div>
          </div>
        </div>
        
        {/* 三列布局区域 */}
        <div className="bg-white border mb-4">
          <div className="grid grid-cols-3 gap-0">
            <div className="border-r p-3">
              <div className="text-gray-600 mb-2 text-xs">唛头(Marks)</div>
              <TextArea 
                value={marks}
                onChange={setMarks}
                autoSize={{ minRows: 8, maxRows: 12 }}
                style={{ fontSize: '11px', border: 'none', padding: 0, resize: 'none' }}
                className="text-xs"
              />
            </div>
            <div className="border-r p-3">
              <div className="text-gray-600 mb-2 text-xs">货物描述(Description of Goods)</div>
              <TextArea 
                value={goodsDescription}
                onChange={setGoodsDescription}
                autoSize={{ minRows: 8, maxRows: 12 }}
                style={{ fontSize: '11px', border: 'none', padding: 0, resize: 'none' }}
                className="text-xs"
              />
            </div>
            <div className="p-3">
              <div className="text-gray-600 mb-2 text-xs">港口要求(Port requirements)</div>
              <TextArea 
                value={portRequirements}
                onChange={setPortRequirements}
                autoSize={{ minRows: 8, maxRows: 12 }}
                style={{ fontSize: '11px', border: 'none', padding: 0, resize: 'none' }}
                className="text-xs"
                placeholder="装箱单要求:\n原产地证明:"
              />
            </div>
          </div>
        </div>
        
        {/* 装箱信息表格 */}
        <div className="bg-white border mb-4">
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2 text-gray-600 border-r">箱型(EQ type)</th>
                  <th className="text-left p-2 text-gray-600 border-r">箱号(EQ No.)</th>
                  <th className="text-left p-2 text-gray-600 border-r">封号(Seal No.)</th>
                  <th className="text-left p-2 text-gray-600 border-r">件数(No.of Pkgs)</th>
                  <th className="text-left p-2 text-gray-600 border-r">毛重(Gross Weight)</th>
                  <th className="text-left p-2 text-gray-600">体积(Measurement)</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="p-2 border-r">
                    <Input 
                      value={eqSize}
                      onChange={setEqSize}
                      size="small" 
                      style={{ fontSize: '11px', border: 'none', padding: 0, width: '100%' }} 
                    />
                  </td>
                  <td className="p-2 border-r">
                    <Input 
                      value={eqNo}
                      onChange={setEqNo}
                      size="small" 
                      style={{ fontSize: '11px', border: 'none', padding: 0, width: '100%' }} 
                    />
                  </td>
                  <td className="p-2 border-r">
                    <Input 
                      value={sealNo}
                      onChange={setSealNo}
                      size="small" 
                      style={{ fontSize: '11px', border: 'none', padding: 0, width: '100%' }} 
                    />
                  </td>
                  <td className="p-2 border-r">
                    <Input 
                      value={eqPackageCount}
                      onChange={setEqPackageCount}
                      size="small" 
                      style={{ fontSize: '11px', border: 'none', padding: 0, width: '100%' }} 
                    />
                  </td>
                  <td className="p-2 border-r">
                    <Input 
                      value={eqGrossWeight}
                      onChange={setEqGrossWeight}
                      size="small" 
                      style={{ fontSize: '11px', border: 'none', padding: 0, width: '100%' }} 
                    />
                  </td>
                  <td className="p-2">
                    <Input 
                      value={eqMeasurement}
                      onChange={setEqMeasurement}
                      size="small" 
                      style={{ fontSize: '11px', border: 'none', padding: 0, width: '100%' }} 
                    />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* 提单数量和方式 */}
        <div className="bg-white border mb-4">
          <div className="grid grid-cols-2 gap-0">
            <div className="border-r p-3">
              <div className="text-gray-600 mb-2 text-xs">提单数量(Quantity of B/L)</div>
              <Input 
                value={originalCount}
                onChange={setOriginalCount}
                size="small" 
                style={{ fontSize: '11px' }}
                className="text-xs"
              />
            </div>
            <div className="p-3">
              <div className="text-gray-600 mb-2 text-xs">提单方式(Way of B/L)</div>
              <div className="flex gap-4">
                <label className="flex items-center text-xs">
                  <input 
                    type="checkbox" 
                    checked={blWay === 'surrendered'}
                    onChange={() => setBlWay('surrendered')}
                    className="mr-1" 
                  />
                  Surrendered
                </label>
                <label className="flex items-center text-xs">
                  <input 
                    type="checkbox" 
                    checked={blWay === 'original'}
                    onChange={() => setBlWay('original')}
                    className="mr-1" 
                  />
                  Original
                </label>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default BLAddition;