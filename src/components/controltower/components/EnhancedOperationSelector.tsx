import React, { useState } from 'react';
import { Select, Input, Space } from '@arco-design/web-react';
import { IconSearch, IconDelete } from '@arco-design/web-react/icon';

interface Operation {
  id: string;
  name: string;
}

interface EnhancedOperationSelectorProps {
  value?: string;
  onChange?: (value: string) => void;
  operations: Operation[];
  placeholder?: string;
  style?: React.CSSProperties;
  dropdownStyle?: React.CSSProperties;
}

const EnhancedOperationSelector: React.FC<EnhancedOperationSelectorProps> = ({
  value,
  onChange,
  operations,
  placeholder = '请选择触发操作',
  style,
  dropdownStyle
}) => {
  const [searchText, setSearchText] = useState('');
  const [filteredOperations, setFilteredOperations] = useState<Operation[]>(operations);

  // Fuzzy search function
  const fuzzySearch = (text: string, operations: Operation[]): Operation[] => {
    if (!text.trim()) {
      return operations;
    }

    const searchLower = text.toLowerCase();
    return operations.filter(op => {
      const nameLower = op.name.toLowerCase();
      
      // Simple fuzzy matching: check if all characters in search text appear in order
      let searchIndex = 0;
      for (let i = 0; i < nameLower.length && searchIndex < searchLower.length; i++) {
        if (nameLower[i] === searchLower[searchIndex]) {
          searchIndex++;
        }
      }
      
      // Also include exact substring matches
      return searchIndex === searchLower.length || nameLower.includes(searchLower);
    });
  };

  // Handle search button click
  const handleSearch = () => {
    const filtered = fuzzySearch(searchText, operations);
    setFilteredOperations(filtered);
  };

  // Handle clear button click
  const handleClear = () => {
    setSearchText('');
    setFilteredOperations(operations);
  };

  // Handle search input change
  const handleSearchInputChange = (value: string) => {
    setSearchText(value);
  };

  // Custom dropdown render with search bar
  const dropdownRender = (menu: React.ReactNode) => {
    return (
      <div>
        <div style={{ padding: '8px', borderBottom: '1px solid #e5e6eb' }}>
          <Input
            placeholder="搜索操作名称"
            value={searchText}
            onChange={handleSearchInputChange}
            onPressEnter={handleSearch}
            style={{ width: '100%' }}
            addAfter={
              <Space size={0}>
                <div
                  onClick={handleSearch}
                  style={{
                    cursor: 'pointer',
                    padding: '0 8px',
                    display: 'flex',
                    alignItems: 'center',
                    borderRight: '1px solid #e5e6eb'
                  }}
                >
                  <IconSearch style={{ fontSize: 14, color: '#4e5969' }} />
                </div>
                <div
                  onClick={handleClear}
                  style={{
                    cursor: 'pointer',
                    padding: '0 8px',
                    display: 'flex',
                    alignItems: 'center'
                  }}
                >
                  <IconDelete style={{ fontSize: 14, color: '#4e5969' }} />
                </div>
              </Space>
            }
          />
        </div>
        {menu}
      </div>
    );
  };

  return (
    <Select
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      style={style}
      dropdownMenuStyle={dropdownStyle}
      dropdownRender={dropdownRender}
      showSearch={false}
      filterOption={false}
    >
      {filteredOperations.map(op => (
        <Select.Option key={op.id} value={op.id}>
          {op.name}
        </Select.Option>
      ))}
    </Select>
  );
};

export default EnhancedOperationSelector;
