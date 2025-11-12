import React, { useState, useCallback, useEffect } from 'react';
import { Card, Tabs, Button, Space, Typography, Divider, Form, Input } from '@arco-design/web-react';
import { IconLeft, IconDragDotVertical, IconSettings, IconPlus } from '@arco-design/web-react/icon';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import './PageDesigner.css';

const { TabPane } = Tabs;
const { Title, Text } = Typography;

/**
 * 控件类型定义
 */
interface WidgetType {
  id: string;
  name: string;
  type: string;
  icon: React.ReactNode;
  defaultProps: Record<string, any>;
}

/**
 * 画布中的控件实例
 */
interface WidgetInstance {
  id: string;
  type: string;
  name: string;
  position: { row: number; col: number };
  size: { width: number; height: number };
  props: Record<string, any>;
}

/**
 * 页面设计器属性
 */
interface PageDesignerProps {
  pageId?: string;
  mode?: 'create' | 'edit';
}

/**
 * 页面参数配置数据
 */
interface PageParamsData {
  pageId: string;
  pageName: string;
  relatedPage: string;
  pageRoute: string;
  isReviewPage: boolean;
}

/**
 * 可拖拽控件组件
 */
const DraggableWidget: React.FC<{ widget: WidgetType }> = ({ widget }) => {
  const [{ isDragging }, drag] = useDrag({
    type: 'widget',
    item: { widget },
    collect: (monitor: any) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  return (
    <div
      ref={drag as any}
      className={`draggable-widget ${isDragging ? 'dragging' : ''}`}
    >
      <div className="widget-icon">{widget.icon}</div>
      <span className="widget-name">{widget.name}</span>
    </div>
  );
};

/**
 * 画布网格单元格组件
 */
const GridCell: React.FC<{
  row: number;
  col: number;
  widget?: WidgetInstance;
  onDrop: (widget: WidgetType, row: number, col: number) => void;
  onSelect: (widget: WidgetInstance | null) => void;
  isSelected: boolean;
}> = ({ row, col, widget, onDrop, onSelect, isSelected }) => {
  const [{ isOver }, drop] = useDrop({
    accept: 'widget',
    drop: (item: { widget: WidgetType }) => {
      onDrop(item.widget, row, col);
    },
    collect: (monitor: any) => ({
      isOver: monitor.isOver(),
    }),
  });

  const handleClick = () => {
    onSelect(widget || null);
  };

  return (
    <div
      ref={drop as any}
      className={`grid-cell ${
        isOver ? 'drop-target' : ''
      } ${
        isSelected ? 'selected' : ''
      } ${
        widget ? 'has-widget' : ''
      }`}
      onClick={handleClick}
    >
      {widget && (
        <div className="widget-instance">
          <div className="widget-content">
            {widget.name}
          </div>
        </div>
      )}
    </div>
  );
};

/**
 * 页面设计器主组件
 */
const PageDesigner: React.FC<PageDesignerProps> = ({ pageId, mode = 'create' }) => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState('design');
  const [widgets, setWidgets] = useState<WidgetInstance[]>([]);
  const [selectedWidget, setSelectedWidget] = useState<WidgetInstance | null>(null);
  const [nextWidgetId, setNextWidgetId] = useState(1);
  const [pageParams, setPageParams] = useState<PageParamsData>({
    pageId: '',
    pageName: '',
    relatedPage: '',
    pageRoute: '',
    isReviewPage: false
  });
  const [form] = Form.useForm();

  /**
   * 初始化页面参数
   */
  useEffect(() => {
    const isReviewPage = searchParams.get('isReview') === 'true';
    const currentPageId = pageId || searchParams.get('pageId') || `page_${Date.now()}`;
    const currentPageName = mode === 'edit' ? '示例页面' : '';
    const currentRelatedPage = mode === 'edit' && !isReviewPage ? '主页面示例' : '';
    const currentPageRoute = `/custom/${currentPageId.replace('page_', '')}`;

    const initialParams = {
      pageId: currentPageId,
      pageName: currentPageName,
      relatedPage: currentRelatedPage,
      pageRoute: currentPageRoute,
      isReviewPage
    };

    setPageParams(initialParams);
    form.setFieldsValue(initialParams);
  }, [pageId, mode, searchParams, form]);

  // 可用控件列表
  const availableWidgets: WidgetType[] = [
    {
      id: 'input',
      name: '输入框',
      type: 'input',
      icon: <IconPlus />,
      defaultProps: {
        placeholder: '请输入内容',
        label: '输入框',
        required: false,
      },
    },
    {
      id: 'select',
      name: '下拉选择',
      type: 'select',
      icon: <IconSettings />,
      defaultProps: {
        placeholder: '请选择',
        label: '下拉选择',
        options: [],
      },
    },
    {
      id: 'button',
      name: '按钮',
      type: 'button',
      icon: <IconPlus />,
      defaultProps: {
        text: '按钮',
        type: 'primary',
      },
    },
    {
      id: 'text',
      name: '文本',
      type: 'text',
      icon: <IconDragDotVertical />,
      defaultProps: {
        content: '文本内容',
        fontSize: 14,
      },
    },
  ];

  /**
   * 处理控件拖拽到画布
   */
  const handleWidgetDrop = useCallback((widget: WidgetType, row: number, col: number) => {
    // 检查该位置是否已有控件
    const existingWidget = widgets.find(w => w.position.row === row && w.position.col === col);
    if (existingWidget) {
      return;
    }

    const newWidget: WidgetInstance = {
      id: `widget_${nextWidgetId}`,
      type: widget.type,
      name: widget.name,
      position: { row, col },
      size: { width: 1, height: 1 }, // 默认占用1个网格单元
      props: { ...widget.defaultProps },
    };

    setWidgets(prev => [...prev, newWidget]);
    setNextWidgetId(prev => prev + 1);
    setSelectedWidget(newWidget);
  }, [widgets, nextWidgetId]);

  /**
   * 处理控件选择
   */
  const handleWidgetSelect = useCallback((widget: WidgetInstance | null) => {
    setSelectedWidget(widget);
  }, []);

  /**
   * 返回页面列表
   */
  const handleBack = () => {
    navigate('/controltower/page-customization');
  };

  /**
   * 保存页面设计
   */
  const handleSave = () => {
    // TODO: 实现保存逻辑
    console.log('保存页面设计:', { widgets });
  };

  /**
   * 预览页面
   */
  const handlePreview = () => {
    // TODO: 实现预览逻辑
    console.log('预览页面:', { widgets });
  };

  /**
   * 处理页面参数变更
   */
  const handleParamsChange = (changedValues: Partial<PageParamsData>) => {
    const newParams = { ...pageParams, ...changedValues };
    setPageParams(newParams);
    
    // 如果页面名称变更，自动更新路由
    if (changedValues.pageName) {
      const newRoute = `/custom/${changedValues.pageName.toLowerCase().replace(/\s+/g, '-')}`;
      form.setFieldValue('pageRoute', newRoute);
      setPageParams(prev => ({ ...prev, pageRoute: newRoute }));
    }
  };

  /**
   * 添加审核确认页面
   */
  const handleAddReviewPage = () => {
    const reviewPageParams = new URLSearchParams({
      mode: 'create',
      isReview: 'true',
      parentPageId: pageParams.pageId
    });
    navigate(`/controltower/page-designer?${reviewPageParams.toString()}`);
  };

  /**
   * 渲染画布网格
   */
  const renderCanvas = () => {
    const grid = [];
    for (let row = 0; row < 8; row++) { // 8行
      for (let col = 0; col < 4; col++) { // 4列
        const widget = widgets.find(w => w.position.row === row && w.position.col === col);
        const isSelected = selectedWidget?.id === widget?.id;
        
        grid.push(
          <GridCell
            key={`${row}-${col}`}
            row={row}
            col={col}
            widget={widget}
            onDrop={handleWidgetDrop}
            onSelect={handleWidgetSelect}
            isSelected={isSelected}
          />
        );
      }
    }
    return grid;
  };

  /**
   * 渲染属性编辑面板
   */
  const renderPropertyPanel = () => {
    if (!selectedWidget) {
      return (
        <div className="property-panel-empty">
          <Text type="secondary">请选择一个控件来编辑属性</Text>
        </div>
      );
    }

    return (
      <div className="property-panel">
        <Title heading={6}>控件属性</Title>
        <Divider />
        <div className="property-item">
          <Text>控件名称: {selectedWidget.name}</Text>
        </div>
        <div className="property-item">
          <Text>控件类型: {selectedWidget.type}</Text>
        </div>
        <div className="property-item">
          <Text>位置: 行{selectedWidget.position.row + 1}, 列{selectedWidget.position.col + 1}</Text>
        </div>
        {/* TODO: 根据控件类型渲染不同的属性编辑器 */}
      </div>
    );
  };

  /**
   * 渲染页面参数配置
   */
  const renderPageParams = () => {
    return (
      <div className="params-layout" style={{ padding: '24px', maxWidth: '800px', margin: '0 auto' }}>
        <Card title="基础参数配置" size="default">
          <Form
            form={form}
            layout="vertical"
            onValuesChange={handleParamsChange}
            style={{ maxWidth: '600px' }}
          >
            <Form.Item
              label="页面ID"
              field="pageId"
              tooltip="系统自动生成的唯一标识符"
            >
              <Input
                value={pageParams.pageId}
                disabled
                style={{ backgroundColor: '#f7f8fa', color: '#86909c' }}
              />
            </Form.Item>

            <Form.Item
              label="页面名称"
              field="pageName"
              rules={[{ required: true, message: '请输入页面名称' }]}
            >
              <Input
                placeholder="请输入页面名称"
                value={pageParams.pageName}
              />
            </Form.Item>

            <Form.Item
              label="关联页面"
              field="relatedPage"
              tooltip={mode === 'create' ? '新增页面时此字段为空' : '显示当前页面关联的主页面'}
            >
              <Input
                placeholder={mode === 'create' ? '新增时为空' : '关联页面名称'}
                value={pageParams.relatedPage}
                disabled={mode === 'create' || pageParams.isReviewPage}
                style={mode === 'create' || pageParams.isReviewPage ? { backgroundColor: '#f7f8fa', color: '#86909c' } : {}}
              />
            </Form.Item>

            <Form.Item
              label="页面路由"
              field="pageRoute"
              tooltip="根据页面名称自动生成的访问路径"
            >
              <Input
                value={pageParams.pageRoute}
                disabled
                style={{ backgroundColor: '#f7f8fa', color: '#86909c' }}
              />
            </Form.Item>

            {!pageParams.isReviewPage && (
              <Form.Item>
                <Button
                  type="primary"
                  icon={<IconPlus />}
                  onClick={handleAddReviewPage}
                  style={{ marginTop: '16px' }}
                >
                  添加审核确认页面
                </Button>
              </Form.Item>
            )}
          </Form>
        </Card>
      </div>
    );
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="page-designer">
        {/* 顶部导航栏 */}
        <div className="designer-header">
          <div className="header-left">
            <Button
              type="text"
              icon={<IconLeft />}
              onClick={handleBack}
            >
              返回
            </Button>
            <Title heading={5} style={{ margin: 0 }}>
              {mode === 'create' ? '创建页面' : '编辑页面'}
            </Title>
          </div>
          <div className="header-right">
            <Space>
              <Button onClick={handlePreview}>预览</Button>
              <Button type="primary" onClick={handleSave}>保存</Button>
            </Space>
          </div>
        </div>

        {/* 标签页导航 */}
        <div className="designer-tabs">
          <Tabs
            activeTab={activeTab}
            onChange={setActiveTab}
            type="line"
          >
            {!pageParams.isReviewPage && <TabPane key="design" title="页面设计" />}
            <TabPane key="params" title="页面参数" />
            {!pageParams.isReviewPage && <TabPane key="data" title="数据设置" disabled />}
          </Tabs>
        </div>

        {/* 主要内容区域 */}
        <div className="designer-content">
          {activeTab === 'design' && (
            <div className="design-layout">
              {/* 左侧控件选择区 */}
              <div className="widget-panel">
                <Card title="控件库" size="small">
                  <div className="widget-list">
                    {availableWidgets.map(widget => (
                      <DraggableWidget key={widget.id} widget={widget} />
                    ))}
                  </div>
                </Card>
              </div>

              {/* 中部画布编辑区 */}
              <div className="canvas-panel">
                <Card title="画布" size="small">
                  <div className="canvas-container">
                    <div className="canvas-grid">
                      {renderCanvas()}
                    </div>
                  </div>
                </Card>
              </div>

              {/* 右侧属性编辑面板 */}
              <div className="property-panel-container">
                <Card title="属性设置" size="small">
                  {renderPropertyPanel()}
                </Card>
              </div>
            </div>
          )}

          {activeTab === 'params' && renderPageParams()}

          {activeTab === 'data' && (
            <div className="data-layout">
              <Text>数据设置功能开发中...</Text>
            </div>
          )}
        </div>
      </div>
    </DndProvider>
  );
};

export default PageDesigner;