import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button, Dropdown, Menu, Avatar } from '@arco-design/web-react';
import { IconMenu, IconClose, IconUser, IconSettings, IconPoweroff } from '@arco-design/web-react/icon';
import { useUser } from './UserContext';

const PortalHeader: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { user, isLoggedIn, logout } = useUser();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLogout = () => {
    logout();
    navigate('/portal');
  };

  const handleMenuClick = (key: string) => {
    switch (key) {
      case 'profile':
        // Redirect to personal information page in client control tower
        navigate('/controltower-client#profile');
        break;
      case 'company':
        // Redirect to company information page in client control tower
        navigate('/controltower-client#company');
        break;
      case 'logout':
        handleLogout();
        break;
    }
  };

  // User dropdown menu
  const userDropdownMenu = (
    <Menu onClickMenuItem={handleMenuClick}>
      <Menu.Item key="profile">
        <IconUser className="mr-2" />
        Profile
      </Menu.Item>
      <Menu.Item key="company">
        <IconSettings className="mr-2" />
        Company Info
      </Menu.Item>
      <Menu.Item key="divider" disabled style={{ height: '1px', padding: 0, margin: '4px 0', backgroundColor: '#f0f0f0' }} />
      <Menu.Item key="logout">
        <IconPoweroff className="mr-2" />
        Logout
      </Menu.Item>
    </Menu>
  );

  const navItems = [
    { label: 'Home', href: '/portal' },
    { label: 'Control Tower', href: '/controltower-client' },
    { label: 'Services', href: '/portal/business-services' },
    { label: 'News', href: '/portal/news' },
    { label: 'About Us', href: '/portal/about-us' },
  ];

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link to="/portal" className="flex items-center">
          <div className="flex items-center">
            <div className="bg-gradient-to-r from-blue-600 to-blue-400 text-white w-10 h-10 rounded-lg flex items-center justify-center mr-3 relative overflow-hidden shadow-lg">
              <span className="text-xl font-bold">Y</span>
              <div className="absolute bottom-0 right-0 w-3 h-3 bg-white rounded-tl-lg flex items-center justify-center">
                <span className="text-xs text-blue-600 font-bold">L</span>
              </div>
            </div>
            <div>
              <div className="text-lg font-bold text-gray-800 leading-tight tracking-wide">Your LOGO</div>
            </div>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          {navItems.map((item, index) => (
            <Link 
              key={index}
              to={item.href} 
              className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* User Section (Desktop) */}
        <div className="hidden md:block">
          {isLoggedIn && user ? (
            <Dropdown droplist={userDropdownMenu} trigger="click" position="bottom">
              <div className="flex items-center space-x-2 cursor-pointer px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors">
                <Avatar size={32} style={{ backgroundColor: '#3B82F6' }}>
                  {user.username.charAt(0).toUpperCase()}
                </Avatar>
                <span className="text-gray-700 font-medium">{user.username}</span>
              </div>
            </Dropdown>
          ) : (
          <Button 
            type="primary" 
            className="bg-gradient-to-r from-blue-600 to-blue-400 border-0"
            onClick={() => navigate('/portal/auth')}
          >
            Sign Up / Login
          </Button>
          )}
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <button onClick={toggleMenu} className="text-gray-700">
            {isMenuOpen ? <IconClose /> : <IconMenu />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="block md:hidden bg-white border-t border-gray-100 py-4">
          <div className="container mx-auto px-4 flex flex-col space-y-3">
            {navItems.map((item, index) => (
              <Link 
                key={index}
                to={item.href} 
                className="text-gray-700 hover:text-blue-600 py-2 font-medium"
                onClick={toggleMenu}
              >
                {item.label}
              </Link>
            ))}
            
            {/* Mobile User Section */}
            {isLoggedIn && user ? (
              <div className="pt-4 border-t border-gray-100 space-y-3">
                <div className="flex items-center space-x-3 py-2">
                  <Avatar size={32} style={{ backgroundColor: '#3B82F6' }}>
                    {user.username.charAt(0).toUpperCase()}
                  </Avatar>
                  <span className="text-gray-700 font-medium">{user.username}</span>
                </div>
                <button 
                  className="w-full text-left text-gray-700 hover:text-blue-600 py-2 font-medium flex items-center"
                  onClick={() => {
                    toggleMenu();
                    navigate('/controltower-client#profile');
                  }}
                >
                  <IconUser className="mr-2" />
                  Profile
                </button>
                <button 
                  className="w-full text-left text-gray-700 hover:text-blue-600 py-2 font-medium flex items-center"
                  onClick={() => {
                    toggleMenu();
                    navigate('/controltower-client#company');
                  }}
                >
                  <IconSettings className="mr-2" />
                  Company Info
                </button>
                <button 
                  className="w-full text-left text-red-600 hover:text-red-700 py-2 font-medium flex items-center"
                  onClick={() => {
                    toggleMenu();
                    handleLogout();
                  }}
                >
                  <IconPoweroff className="mr-2" />
                  Logout
                </button>
              </div>
            ) : (
            <Button 
              type="primary" 
              className="bg-gradient-to-r from-blue-600 to-blue-400 border-0 mt-2"
                onClick={() => {
                  toggleMenu();
                  navigate('/portal/auth');
                }}
            >
              Sign Up / Login
            </Button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default PortalHeader;