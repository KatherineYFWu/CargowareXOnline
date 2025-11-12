import React, { useState, useMemo } from 'react';
import { Modal, Input, Card, Typography, Grid } from '@arco-design/web-react';
import { IconSearch, IconFile, IconCode, IconDesktop, IconDriveFile } from '@arco-design/web-react/icon';
import './TemplateSelectModal.css';

const { Title, Text } = Typography;
const { Row, Col } = Grid;

/**
 * 模板数据接口
 */
interface Template {
  id: string;
  name: string;
  category: string;
  icon: React.ReactNode;
  description?: string;
}

/**
 * 模板选择弹窗组件属性
 */
interface TemplateSelectModalProps {
  /** 是否显示弹窗 */
  visible: boolean;
  /** 关闭弹窗回调 */
  onClose: () => void;
  /** 选择模板回调 */
  onSelect: (template: Template) => void;
}

/**
 * 模板选择弹窗组件
 * @description 提供模板分类浏览和搜索功能，支持选择不同类型的EDI报文模板
 */
const TemplateSelectModal: React.FC<TemplateSelectModalProps> = ({
  visible,
  onClose,
  onSelect
}) => {
  const [selectedCategory, setSelectedCategory] = useState('全部');
  const [searchKeyword, setSearchKeyword] = useState('');

  /**
   * 模板分类列表
   */
  const categories = [
    '全部',
    '交通部平报文',
    'EDIFACT报文',
    'ANSI X12报文',
    'IATA Cargo报文'
  ];

  /**
   * 模板数据
   */
  const templates: Template[] = [
    // 空白模板（在所有分类中都显示）
    {
      id: 'blank',
      name: '空白模板',
      category: '全部',
      icon: <IconFile />,
      description: '从空白模板开始创建'
    },
    // 交通部平报文
    {
      id: 'iftmbf-moc',
      name: 'IFTMBF订舱报文',
      category: '交通部平报文',
      icon: <IconCode />,
      description: '交通部平台订舱报文模板'
    },
    {
      id: 'iftmin-moc',
      name: 'IFTMIN提单报文',
      category: '交通部平报文',
      icon: <IconCode />,
      description: '交通部平台提单报文模板'
    },
    {
      id: 'iftcps-moc',
      name: 'IFTCPS舱单报文',
      category: '交通部平报文',
      icon: <IconCode />,
      description: '交通部平台舱单报文模板'
    },
    {
      id: 'iftvgm-moc',
      name: 'IFTVGMVGM报文',
      category: '交通部平报文',
      icon: <IconCode />,
      description: '交通部平台VGM报文模板'
    },
    // EDIFACT报文
    {
      id: 'iftmbf-edifact',
      name: 'IFTMBF订舱报文',
      category: 'EDIFACT报文',
      icon: <IconDesktop />,
      description: 'EDIFACT标准订舱报文模板'
    },
    {
      id: 'iftmbc-edifact',
      name: 'IFTMBC订舱确认报文',
      category: 'EDIFACT报文',
      icon: <IconDesktop />,
      description: 'EDIFACT标准订舱确认报文模板'
    },
    {
      id: 'iftmin-edifact',
      name: 'IFTMIN提单报文',
      category: 'EDIFACT报文',
      icon: <IconDesktop />,
      description: 'EDIFACT标准提单报文模板'
    },
    {
      id: 'iftmcs-edifact',
      name: 'IFTMCS提单确认报文',
      category: 'EDIFACT报文',
      icon: <IconDesktop />,
      description: 'EDIFACT标准提单确认报文模板'
    },
    {
      id: 'iftsta-edifact',
      name: 'IFTSTA集装箱状态报文',
      category: 'EDIFACT报文',
      icon: <IconDesktop />,
      description: 'EDIFACT标准集装箱状态报文模板'
    },
    {
      id: 'iftsai-edifact',
      name: 'IFTSAI船期报文',
      category: 'EDIFACT报文',
      icon: <IconDesktop />,
      description: 'EDIFACT标准船期报文模板'
    },
    {
      id: 'aperak-edifact',
      name: 'APERAKEDI确认回执报文',
      category: 'EDIFACT报文',
      icon: <IconDesktop />,
      description: 'EDIFACT标准确认回执报文模板'
    },
    // ANSI X12报文
    {
      id: '300-ansix12',
      name: '300订舱报文',
      category: 'ANSI X12报文',
      icon: <IconCode />,
      description: 'ANSI X12标准300订舱报文模板'
    },
    {
      id: '301-ansix12',
      name: '301订舱确认报文',
      category: 'ANSI X12报文',
      icon: <IconCode />,
      description: 'ANSI X12标准301订舱确认报文模板'
    },
    {
      id: '303-ansix12',
      name: '303订舱取消报文',
      category: 'ANSI X12报文',
      icon: <IconCode />,
      description: 'ANSI X12标准303订舱取消报文模板'
    },
    {
      id: '304-ansix12',
      name: '304提单报文',
      category: 'ANSI X12报文',
      icon: <IconCode />,
      description: 'ANSI X12标准304提单报文模板'
    },
    {
      id: '310-ansix12',
      name: '310提单确认报文',
      category: 'ANSI X12报文',
      icon: <IconCode />,
      description: 'ANSI X12标准310提单确认报文模板'
    },
    {
      id: '312-ansix12',
      name: '312到港确认报文',
      category: 'ANSI X12报文',
      icon: <IconCode />,
      description: 'ANSI X12标准312到港确认报文模板'
    },
    {
      id: '315-ansix12',
      name: '315集装箱状态报文',
      category: 'ANSI X12报文',
      icon: <IconCode />,
      description: 'ANSI X12标准315集装箱状态报文模板'
    },
    {
      id: '323-ansix12',
      name: '323船期报文',
      category: 'ANSI X12报文',
      icon: <IconCode />,
      description: 'ANSI X12标准323船期报文模板'
    },
    {
      id: '997-ansix12',
      name: '997EDI确认回执报文',
      category: 'ANSI X12报文',
      icon: <IconCode />,
      description: 'ANSI X12标准997确认回执报文模板'
    },
    // IATA Cargo报文
    {
      id: 'ffm-iata',
      name: 'FFM空运舱单报文',
      category: 'IATA Cargo报文',
      icon: <IconDriveFile />,
      description: 'IATA Cargo标准FFM空运舱单报文模板'
    }
  ];

  /**
   * 过滤后的模板列表
   */
  const filteredTemplates = useMemo(() => {
    let filtered = templates;

    // 分类过滤
    if (selectedCategory !== '全部') {
      filtered = filtered.filter(template => 
        template.category === selectedCategory || template.category === '全部'
      );
    }

    // 搜索过滤
    if (searchKeyword) {
      filtered = filtered.filter(template =>
        template.name.toLowerCase().includes(searchKeyword.toLowerCase())
      );
    }

    // 确保空白模板始终在第一位
    const blankTemplate = filtered.find(t => t.id === 'blank');
    const otherTemplates = filtered.filter(t => t.id !== 'blank');
    
    return blankTemplate ? [blankTemplate, ...otherTemplates] : otherTemplates;
  }, [selectedCategory, searchKeyword]);

  /**
   * 处理模板选择
   * @param template 选中的模板
   */
  const handleTemplateSelect = (template: Template) => {
    onSelect(template);
    onClose();
  };

  /**
   * 处理搜索
   * @param value 搜索关键词
   */
  const handleSearch = (value: string) => {
    setSearchKeyword(value);
  };

  return (
    <Modal
      title="选择模板"
      visible={visible}
      onCancel={onClose}
      footer={null}
      style={{ width: 1000 }}
      className="template-select-modal"
    >
      <div className="template-modal-content">
        {/* 顶部搜索框 */}
        <div className="template-search-section">
          <Input
            placeholder="搜索模板名称..."
            prefix={<IconSearch />}
            value={searchKeyword}
            onChange={handleSearch}
            allowClear
          />
        </div>

        <div className="template-main-content">
          {/* 左侧分类列表 */}
          <div className="template-categories">
            <Title heading={6} style={{ marginBottom: 16 }}>分类</Title>
            <div className="category-list">
              {categories.map(category => (
                <div
                  key={category}
                  className={`category-item ${selectedCategory === category ? 'active' : ''}`}
                  onClick={() => setSelectedCategory(category)}
                >
                  {category}
                </div>
              ))}
            </div>
          </div>

          {/* 右侧模板列表 */}
          <div className="template-list">
            <Row gutter={[16, 16]}>
              {filteredTemplates.map(template => (
                <Col span={8} key={template.id}>
                  <Card
                    className={`template-card ${template.id === 'blank' ? 'blank-template' : ''}`}
                    hoverable
                    onClick={() => handleTemplateSelect(template)}
                  >
                    <div className="template-card-content">
                      <div className="template-icon">
                        {template.icon}
                      </div>
                      <div className="template-info">
                        <Text className="template-name">{template.name}</Text>
                      </div>
                    </div>
                  </Card>
                </Col>
              ))}
            </Row>
            
            {filteredTemplates.length === 0 && (
              <div className="no-templates">
                <Text type="secondary">没有找到匹配的模板</Text>
              </div>
            )}
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default TemplateSelectModal;