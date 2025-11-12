import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Button, Tree, Card, Layout } from '@arco-design/web-react';
import { 
  IconFile, 
  IconFolder, 
  IconStorage, 
  IconCode,
  IconEye,
  IconSave,
  IconSettings
} from '@arco-design/web-react/icon';
import TemplateSelectModal from './TemplateSelectModal';
import MatrixEditor from './MatrixEditor';
import './EdiConfig.css';

const { Sider, Content } = Layout;

/**
 * EDI配置页面组件
 * @description 用于配置EDI对接的模板和数据映射
 */
const EdiConfig: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [selectedKeys, setSelectedKeys] = useState<string[]>([]);
  const [templateContent, setTemplateContent] = useState<string>('');
  const [templateModalVisible, setTemplateModalVisible] = useState<boolean>(false);
  const [currentTemplate, setCurrentTemplate] = useState<any>(null);

  /**
   * 处理预览操作
   */
  const handlePreview = () => {
    console.log('预览配置');
    // TODO: 实现预览逻辑
  };

  /**
   * 处理保存操作
   */
  const handleSave = () => {
    console.log('发布配置', { id, templateContent });
  };

  /**
   * 处理选择模板按钮点击
   */
  const handleSelectTemplate = () => {
    setTemplateModalVisible(true);
  };

  /**
   * 处理模板选择
   * @param template 选中的模板
   */
  const handleTemplateSelect = (template: any) => {
    console.log('选择模板:', template);
    setCurrentTemplate(template);
    setTemplateContent(template.name === '空白模板' ? '' : `// ${template.name} 模板\n// ${template.description}\n\n`);
    setTemplateModalVisible(false);
  };

  /**
   * 关闭模板选择弹窗
   */
  const handleCloseTemplateModal = () => {
    setTemplateModalVisible(false);
  };

  /**
   * 数据源树形数据
   */
  const dataSourceTreeData = [
    {
      title: '数据源',
      key: 'datasource',
      icon: <IconStorage />,
      children: [
        {
          title: '用户管理',
          key: 'user_management',
          icon: <IconFolder />,
          children: [
            {
              title: '用户表',
              key: 'user_table',
              icon: <IconFile />,
              children: [
                { title: 'id', key: 'user_id', icon: <IconFile /> },
                { title: 'username', key: 'user_username', icon: <IconFile /> },
                { title: 'email', key: 'user_email', icon: <IconFile /> },
                { title: 'created_at', key: 'user_created_at', icon: <IconFile /> },
                { title: 'updated_at', key: 'user_updated_at', icon: <IconFile /> }
              ]
            },
            {
              title: '角色表',
              key: 'role_table',
              icon: <IconFile />,
              children: [
                { title: 'id', key: 'role_id', icon: <IconFile /> },
                { title: 'name', key: 'role_name', icon: <IconFile /> },
                { title: 'description', key: 'role_description', icon: <IconFile /> }
              ]
            }
          ]
        },
        {
          title: '订单管理',
          key: 'order_management',
          icon: <IconFolder />,
          children: [
            {
              title: '订单表',
              key: 'order_table',
              icon: <IconFile />,
              children: [
                { title: 'id', key: 'order_id', icon: <IconFile /> },
                { title: 'order_no', key: 'order_no', icon: <IconFile /> },
                { title: 'amount', key: 'order_amount', icon: <IconFile /> },
                { title: 'status', key: 'order_status', icon: <IconFile /> },
                { title: 'created_at', key: 'order_created_at', icon: <IconFile /> }
              ]
            }
          ]
        }
      ]
    }
  ];

  /**
   * 函数菜单树形数据
   */
  const functionTreeData = [
    {
      title: '函数库',
      key: 'functions',
      icon: <IconCode />,
      children: [
        {
          title: '字符串函数',
          key: 'string_functions',
          icon: <IconFolder />,
          children: [
            { title: 'concat', key: 'func_concat', icon: <IconCode /> },
            { title: 'substring', key: 'func_substring', icon: <IconCode /> },
            { title: 'trim', key: 'func_trim', icon: <IconCode /> },
            { title: 'replace', key: 'func_replace', icon: <IconCode /> }
          ]
        },
        {
          title: '日期函数',
          key: 'date_functions',
          icon: <IconFolder />,
          children: [
            { title: 'now', key: 'func_now', icon: <IconCode /> },
            { title: 'format', key: 'func_format', icon: <IconCode /> },
            { title: 'addDays', key: 'func_adddays', icon: <IconCode /> },
            { title: 'diffDays', key: 'func_diffdays', icon: <IconCode /> }
          ]
        },
        {
          title: '数学函数',
          key: 'math_functions',
          icon: <IconFolder />,
          children: [
            { title: 'sum', key: 'func_sum', icon: <IconCode /> },
            { title: 'avg', key: 'func_avg', icon: <IconCode /> },
            { title: 'round', key: 'func_round', icon: <IconCode /> },
            { title: 'abs', key: 'func_abs', icon: <IconCode /> }
          ]
        }
      ]
    }
  ];

  /**
   * 处理树节点选择
   */
  const handleTreeSelect = (selectedKeys: string[]) => {
    setSelectedKeys(selectedKeys);
    console.log('选中的节点:', selectedKeys);
  };

  return (
    <div className="edi-config-container">
      {/* 顶部按钮区 */}
      <div className="edi-config-header">
        <div className="header-buttons">
          <Button 
            type="primary" 
            icon={<IconSettings />}
            onClick={handleSelectTemplate}
          >
            选择模板
          </Button>
          <Button 
            icon={<IconEye />}
            onClick={handlePreview}
          >
            预览
          </Button>
          <Button 
            type="primary" 
            icon={<IconSave />}
            onClick={handleSave}
          >
            发布
          </Button>
        </div>
      </div>

      {/* 主体内容区 */}
      <Layout className="edi-config-layout">
        {/* 左侧字典区 */}
        <Sider width={300} className="edi-config-sider">
          <div className="dictionary-section">
            <Card title="数据字典" className="dictionary-card">
              <div className="tree-section">
                <Tree
                  treeData={dataSourceTreeData}
                  selectedKeys={selectedKeys}
                  onSelect={handleTreeSelect}
                  showLine
                  defaultExpandedKeys={['datasource', 'user_management', 'order_management']}
                />
              </div>
              
              <div className="tree-section">
                <Tree
                  treeData={functionTreeData}
                  selectedKeys={selectedKeys}
                  onSelect={handleTreeSelect}
                  showLine
                  defaultExpandedKeys={['functions', 'string_functions', 'date_functions', 'math_functions']}
                />
              </div>
            </Card>
          </div>
        </Sider>

        {/* 右侧模板编辑区 */}
        <Content className="edi-config-content">
          <Card title="模板编辑器" className="editor-card">
            <div className="template-editor">
              {currentTemplate?.name === 'IFTMBF订舱报文' ? (
                <MatrixEditor templateId={id || 'default'} />
              ) : (
                <div className="editor-canvas">
                  <div className="canvas-placeholder">
                    <IconSettings style={{ fontSize: '48px', color: '#ccc' }} />
                    <p>模板编辑区域</p>
                    <p>请先选择模板或开始创建新模板</p>
                  </div>
                </div>
              )}
            </div>
          </Card>
        </Content>
      </Layout>

      {/* 模板选择弹窗 */}
      <TemplateSelectModal
        visible={templateModalVisible}
        onClose={handleCloseTemplateModal}
        onSelect={handleTemplateSelect}
      />
    </div>
  );
};

export default EdiConfig;