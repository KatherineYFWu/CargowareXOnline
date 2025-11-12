import React, { useState } from 'react';
import { Layout, Menu, Button, Avatar, Breadcrumb, Dropdown, Divider, AutoComplete } from '@arco-design/web-react';
import { 
  IconDashboard, 
  IconUser, 
  IconMenuFold, 
  IconMenuUnfold, 
  IconDown, 
  IconPoweroff, 
  IconSettings as IconSettingsOutline, 
  IconLanguage, 
  IconQuestionCircle,
  IconFile,
  IconSend,
  IconInfo,
  IconPlus,
  IconSettings,
  IconNotification
} from '@arco-design/web-react/icon';
import { useNavigate, useLocation } from 'react-router-dom';
import UAEFlag from '../icons/UAEFlag';
import CreateDeclarationModal from '../CreateDeclarationModal';

const { Header, Sider, Content } = Layout;
const MenuItem = Menu.Item;
const SubMenu = Menu.SubMenu;

interface BreadcrumbItem {
  title: string;
  path?: string;
}

interface LayoutProps {
  children: React.ReactNode;
}

const MPCILayout: React.FC<LayoutProps> = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [createModalVisible, setCreateModalVisible] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const toggleCollapse = () => {
    setCollapsed(!collapsed);
  };

  /**
   * 打开新建申报弹窗
   */
  const handleOpenCreateModal = () => {
    setCreateModalVisible(true);
  };

  /**
   * 关闭新建申报弹窗
   */
  const handleCloseCreateModal = () => {
    setCreateModalVisible(false);
  };

  /**
   * 手工录入处理 - 跳转到新建页面
   */
  const handleManualCreate = () => {
    navigate('/mpci/new-filing');
  };

  // 侧边栏菜单数据
  const menuItems = [
    {
      key: 'dashboard',
      title: '仪表盘',
      icon: <IconDashboard />,
      path: '/mpci/dashboard'
    },
    {
      key: 'drafts',
      title: '草稿箱',
      icon: <IconFile />,
      path: '/mpci/drafts'
    },
    {
      key: 'sent',
      title: '已发送',
      icon: <IconSend />,
      path: '/mpci/sent'
    }
  ];

  // 系统设置菜单数据
  const systemMenuItems = [
    {
      key: 'settings',
      title: '系统设置',
      icon: <IconSettings />,
      children: [
        {
          key: 'common-contacts-settings',
          title: '常用收发通',
          icon: <IconInfo />,
          path: '/mpci/settings/common-contacts'
        },
        {
          key: 'notifications',
          title: '预警推送',
          icon: <IconNotification />,
          path: '/mpci/settings/notifications'
        },
        {
          key: 'help',
          title: '帮助中心',
          icon: <IconQuestionCircle />,
          path: '/mpci/settings/help'
        }
      ]
    }
  ];

  // 面包屑生成
  const getBreadcrumbs = (): BreadcrumbItem[] => {
    const pathSegments = location.pathname.split('/').filter(Boolean);
    const breadcrumbs: BreadcrumbItem[] = [{ title: 'MPCI申报系统', path: '/mpci' }];

    if (pathSegments.length > 1) {
      const currentPath = pathSegments[1];
      const menuItem = menuItems.find(item => item.key === currentPath);
      if (menuItem) {
        breadcrumbs.push({ title: menuItem.title });
      }
    }

    return breadcrumbs;
  };

  // 菜单点击处理
  const handleMenuClick = (key: string) => {
    const menuItem = menuItems.find(item => item.key === key);
    if (menuItem && menuItem.path) {
      navigate(menuItem.path);
    }
  };

  // 搜索过滤菜单项
  const filterMenuItems = (searchText: string) => {
    if (!searchText) return [];
    return menuItems
      .filter(item => item.title.toLowerCase().includes(searchText.toLowerCase()))
      .map(item => ({
        value: item.key,
        name: item.title
      }));
  };

  // 搜索选择处理
  const handleSearchSelect = (value: string) => {
    const menuItem = menuItems.find(item => item.key === value);
    if (menuItem && menuItem.path) {
      navigate(menuItem.path);
      setSearchValue('');
    }
  };

  // 获取当前选中的菜单项
  const getSelectedKeys = () => {
    const pathSegments = location.pathname.split('/').filter(Boolean);
    if (pathSegments.length > 1) {
      return [pathSegments[1]];
    }
    return ['dashboard'];
  };

  return (
    <Layout className="h-screen">
      {/* 侧边栏 */}
      <Sider
        collapsed={collapsed}
        width={240}
        collapsedWidth={60}
        className="bg-white border-r border-gray-200"
        trigger={null}
      >
        {/* Logo区域 */}
        <div className="h-16 flex items-center justify-center border-b border-gray-200">
          {!collapsed ? (
            <div className="flex items-center text-xl font-bold text-blue-600">
              <UAEFlag className="mr-2" size={20} />
              MPCI申报
            </div>
          ) : (
            <div className="text-lg font-bold text-blue-600">M</div>
          )}
        </div>

        {/* 新建申报按钮 */}
        <div className="p-4 border-b border-gray-200">
          <Button
            type="primary"
            size="large"
            icon={<IconPlus />}
            className="w-full"
            onClick={handleOpenCreateModal}
          >
            {!collapsed && '新建申报'}
          </Button>
        </div>

        {/* 主菜单 */}
        <div className="flex-1 overflow-auto">
          <Menu
            selectedKeys={getSelectedKeys()}
            onClickMenuItem={handleMenuClick}
            className="border-none"
            style={{ padding: '16px 0' }}
          >
            {menuItems.map(item => (
              <MenuItem key={item.key}>
                {item.icon}
                <span>{item.title}</span>
              </MenuItem>
            ))}
          </Menu>
        </div>

        {/* 系统设置菜单 */}
        <div className="border-t border-gray-200">
          <Menu
            selectedKeys={getSelectedKeys()}
            onClickMenuItem={handleMenuClick}
            className="border-none"
            style={{ padding: '16px 0' }}
          >
            {systemMenuItems.map(item => (
              <SubMenu
                key={item.key}
                title={
                  <div className="flex items-center">
                    {item.icon}
                    {!collapsed && <span>{item.title}</span>}
                  </div>
                }
              >
                {item.children?.map(child => (
                  <MenuItem key={child.key}>
                    {child.icon}
                    <span>{child.title}</span>
                  </MenuItem>
                ))}
              </SubMenu>
            ))}
          </Menu>
        </div>
      </Sider>

      <Layout>
        {/* 顶部导航 */}
        <Header className="bg-white h-16 border-b border-gray-200 px-6 flex items-center justify-between">
          <div className="flex items-center">
            <Button
              type="text"
              icon={collapsed ? <IconMenuUnfold /> : <IconMenuFold />}
              onClick={toggleCollapse}
              className="mr-4"
            />
            <Breadcrumb>
              {getBreadcrumbs().map((item, index) => (
                <Breadcrumb.Item
                  key={index}
                  onClick={() => item.path && navigate(item.path)}
                  className={item.path ? "cursor-pointer hover:text-blue-500" : "text-blue-600 font-medium"}
                >
                  {item.title}
                </Breadcrumb.Item>
              ))}
            </Breadcrumb>
          </div>
          <div className="flex items-center">
            <AutoComplete
              className="mr-4"
              style={{ width: 300 }}
              placeholder="请输入菜单名称搜索"
              data={filterMenuItems(searchValue)}
              value={searchValue}
              onSearch={setSearchValue}
              onSelect={handleSearchSelect}
              allowClear
              filterOption={false}
            />
            <Dropdown
              droplist={
                <Menu>
                  <Menu.Item key="zh-CN">简体中文</Menu.Item>
                  <Menu.Item key="en-US">English</Menu.Item>
                </Menu>
              }
              position="br"
            >
              <Button type="text" icon={<IconLanguage />} style={{ margin: '0 8px' }} />
            </Dropdown>
            <Dropdown
              droplist={
                <Menu>
                  <Menu.Item key="info"><IconUser className="mr-2" />个人信息</Menu.Item>
                  <Menu.Item key="setting"><IconSettingsOutline className="mr-2" />账户设置</Menu.Item>
                  <Menu.Item key="help"><IconQuestionCircle className="mr-2" />帮助中心</Menu.Item>
                  <Divider style={{ margin: '4px 0' }} />
                  <Menu.Item key="logout"><IconPoweroff className="mr-2" />退出登录</Menu.Item>
                </Menu>
              }
              position="br"
            >
              <div className="flex items-center cursor-pointer ml-3">
                <Avatar className="bg-blue-500 mr-2"><IconUser /></Avatar>
                <span className="mr-1">管理员</span>
                <IconDown />
              </div>
            </Dropdown>
          </div>
        </Header>
        <Content className="p-0 bg-gray-50 min-h-[calc(100vh-64px)] overflow-auto">
          {children}
        </Content>
      </Layout>
      
      {/* 新建申报弹窗 */}
      <CreateDeclarationModal
        visible={createModalVisible}
        onClose={handleCloseCreateModal}
        onManualCreate={handleManualCreate}
      />
    </Layout>
  );
};

export default MPCILayout;