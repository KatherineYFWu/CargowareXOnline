import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Card,
  Typography,
  Form,
  Input,
  DatePicker,
  Table,
  Button,
  Space,
  Message,
  Breadcrumb
} from '@arco-design/web-react';
import { IconLeft, IconSave } from '@arco-design/web-react/icon';

const { Title, Text } = Typography;

// 评估项目接口
interface EvaluationItem {
  id: number;
  project: string;
  standard: string;
  score100: string;
  score80: string;
  score60: string;
  score0: string;
  maxScore: number;
  actualScore?: number;
}

// 供应商评估页面组件
const SupplierEvaluation: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  console.log('Supplier ID:', id); // 使用id参数
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [evaluationData, setEvaluationData] = useState<EvaluationItem[]>([]);
  const [totalScore, setTotalScore] = useState(0);

  // 初始化评估数据
  useEffect(() => {
    const initData: EvaluationItem[] = [
      {
        id: 1,
        project: '服务价格',
        standard: '服务价格有优势',
        score100: '低于市场价格',
        score80: '基本与市场价格持平',
        score60: '略高于市场价格',
        score0: '高于市场价格10%以上',
        maxScore: 15
      },
      {
        id: 2,
        project: '交货质量',
        standard: '准确无误交货、无质量问题，或准确无误提供服务',
        score100: '准确无误',
        score80: '出现问题1次',
        score60: '出现问题3次',
        score0: '出现问题5次',
        maxScore: 15
      },
      {
        id: 3,
        project: '交货准时性',
        standard: '是否及时准确提供服务',
        score100: '100%',
        score80: '90%-99%',
        score60: '80%-89%',
        score0: '<80%',
        maxScore: 10
      },
      {
        id: 4,
        project: '付款期',
        standard: '给予的付款期限',
        score100: '>30天',
        score80: '>15天',
        score60: '>7天',
        score0: '<7',
        maxScore: 7
      },
      {
        id: 5,
        project: '信息反馈速度',
        standard: '信息及时反馈、沟通及时性',
        score100: '1小时内反馈',
        score80: '1天内反馈',
        score60: '3天内反馈',
        score0: '超过3天',
        maxScore: 10
      },
      {
        id: 6,
        project: '账单、资料是否完备',
        standard: '账单清晰准确、资料齐全，如有异常费用均事先确认',
        score100: '账单清晰无错误',
        score80: '3票以内错误，未造成损失',
        score60: '5票以内错误，未造成损失',
        score0: '5票以上错误未造成损失或者账单错误导致我司漏收、少收、错收',
        maxScore: 7
      },
      {
        id: 7,
        project: '人员素质',
        standard: '专业性强、素质高',
        score100: '专业性强、态度好,有求必应',
        score80: '态度尚可，专业性较好，基本满足',
        score60: '专业性和态度一般',
        score0: '专业性和态度差，响应慢',
        maxScore: 9
      },
      {
        id: 8,
        project: '服务安全性',
        standard: '有完整的安全管理规定，安全管控严格，未发生安全事故',
        score100: '无任何安全事故',
        score80: '发生轻微安全事故1次',
        score60: '发生轻微安全事故2次',
        score0: '发生重大安全事故或轻微安全事故3次以上',
        maxScore: 12
      },
      {
        id: 9,
        project: '服务创新性',
        standard: '能够提供创新性服务方案，提升服务效率',
        score100: '提供多项创新服务',
        score80: '提供1-2项创新服务',
        score60: '偶尔提供创新建议',
        score0: '无创新服务',
        maxScore: 8
      },
      {
        id: 10,
        project: '合规性',
        standard: '严格遵守相关法律法规和合同条款',
        score100: '完全合规',
        score80: '基本合规，偶有小问题',
        score60: '合规性一般',
        score0: '存在合规风险',
        maxScore: 7
      }
    ];
    setEvaluationData(initData);

    // 初始化表单数据
    form.setFieldsValue({
      supplierName: '上海科技有限公司',
      date: '2025-08-18',
      evaluationDepartment: '集装箱物流部'
    });
  }, [form]);

  /**
   * 处理评分输入变化
   */
  const handleScoreChange = (itemId: number, score: number) => {
    const updatedData = evaluationData.map(item => {
      if (item.id === itemId) {
        return { ...item, actualScore: score };
      }
      return item;
    });
    setEvaluationData(updatedData);

    // 计算总分
    const total = updatedData.reduce((sum, item) => {
      return sum + (item.actualScore || 0);
    }, 0);
    setTotalScore(total);
  };

  /**
   * 保存评估结果
   */
  const handleSave = async () => {
    try {
      setLoading(true);
      await form.validate();
      
      // 检查是否所有项目都已评分
      const unscored = evaluationData.filter(item => !item.actualScore && item.actualScore !== 0);
      if (unscored.length > 0) {
        Message.warning('请完成所有项目的评分');
        return;
      }

      // 模拟保存API调用
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      Message.success('评估结果保存成功');
      navigate('/controltower/supplier-management');
    } catch (error) {
      Message.error('保存失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  // 表格列定义
  const columns = [
    {
      title: '序号',
      dataIndex: 'id',
      key: 'id',
      width: 60,
      align: 'center' as const
    },
    {
      title: '项目',
      dataIndex: 'project',
      key: 'project',
      width: 120
    },
    {
      title: '标准要求',
      dataIndex: 'standard',
      key: 'standard',
      width: 200
    },
    {
      title: '满分分值*100%',
      dataIndex: 'score100',
      key: 'score100',
      width: 120
    },
    {
      title: '满分分值*80%',
      dataIndex: 'score80',
      key: 'score80',
      width: 120
    },
    {
      title: '满分分值*60%',
      dataIndex: 'score60',
      key: 'score60',
      width: 120
    },
    {
      title: '满分分值*0',
      dataIndex: 'score0',
      key: 'score0',
      width: 120
    },
    {
      title: '标准',
      dataIndex: 'maxScore',
      key: 'maxScore',
      width: 80,
      align: 'center' as const
    },
    {
      title: '评分',
      key: 'actualScore',
      width: 100,
      align: 'center' as const,
      render: (_: any, record: EvaluationItem) => (
        <Input
          type="number"
          max={record.maxScore}
          min={0}
          style={{ width: 80 }}
          value={record.actualScore?.toString()}
          onChange={(value) => handleScoreChange(record.id, Number(value) || 0)}
          placeholder="0"
        />
      )
    }
  ];

  return (
    <div style={{ padding: '24px', backgroundColor: '#f5f5f5', minHeight: '100vh' }}>
      {/* 面包屑导航 */}
      <Breadcrumb style={{ marginBottom: '16px' }}>
        <Breadcrumb.Item onClick={() => navigate('/controltower/supplier-management')} style={{ cursor: 'pointer' }}>
          供应商管理
        </Breadcrumb.Item>
        <Breadcrumb.Item>供应商评估</Breadcrumb.Item>
      </Breadcrumb>

      <Card className="bg-white rounded-lg shadow-lg">
        <div style={{ marginBottom: '24px' }}>
          <Space>
            <Button
              icon={<IconLeft />}
              onClick={() => navigate('/controltower/supplier-management')}
            >
              返回
            </Button>
            <Title heading={2} style={{ margin: 0 }}>
              供应商年度评审表
            </Title>
          </Space>
        </div>

        <Form
          form={form}
          layout="vertical"
          style={{ maxWidth: '1200px' }}
        >
          {/* 基本信息 */}
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: '1fr 1fr 1fr', 
            gap: '24px', 
            marginBottom: '24px' 
          }}>
            <Form.Item label="供应商名称" field="supplierName">
              <Input disabled placeholder="请输入供应商名称" />
            </Form.Item>
            <Form.Item label="日期" field="date">
              <DatePicker disabled style={{ width: '100%' }} placeholder="请选择日期" />
            </Form.Item>
            <Form.Item label="评价部门" field="evaluationDepartment">
              <Input disabled placeholder="请输入评价部门" />
            </Form.Item>
          </div>

          {/* 评估表格 */}
          <Table
            columns={columns}
            data={evaluationData}
            pagination={false}
            border
            stripe
            scroll={{ x: 1200 }}
            style={{ marginBottom: '24px' }}
            rowKey="id"
          />

          {/* 总分显示 */}
          <div style={{ 
            textAlign: 'right', 
            marginBottom: '24px',
            padding: '16px',
            backgroundColor: '#f7f8fa',
            borderRadius: '6px'
          }}>
            <Text style={{ fontSize: '18px', fontWeight: 'bold' }}>
              总分：
              <span style={{ 
                color: totalScore >= 80 ? '#00B42A' : totalScore >= 60 ? '#FF7D00' : '#F53F3F',
                fontSize: '24px'
              }}>
                {totalScore}
              </span>
              <span style={{ fontSize: '16px', color: '#86909C' }}> / 100</span>
            </Text>
          </div>

          {/* 操作按钮 */}
          <div style={{ textAlign: 'center' }}>
            <Space size="large">
              <Button
                size="large"
                onClick={() => navigate('/controltower/supplier-management')}
              >
                取消
              </Button>
              <Button
                type="primary"
                size="large"
                icon={<IconSave />}
                loading={loading}
                onClick={handleSave}
              >
                保存评估结果
              </Button>
            </Space>
          </div>
        </Form>
      </Card>
    </div>
  );
};

export default SupplierEvaluation;