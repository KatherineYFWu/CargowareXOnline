# 项目开发规则文档

## 项目概述

本项目是一个基于 React + TypeScript + Vite 的现代化前端应用，集成了 Vue3 组件支持，使用 Arco Design 作为主要 UI 框架，TailwindCSS 作为样式解决方案。项目采用模块化架构，支持多个业务模块的独立开发和维护。

## 技术栈

- **前端框架**: React 19.0.0 + Vue 3.5.17
- **开发语言**: TypeScript
- **构建工具**: Vite 5.x
- **UI 框架**: Arco Design Web React 2.66.4
- **样式方案**: TailwindCSS 4.1.4
- **路由管理**: React Router DOM 7.6.0
- **动画库**: Framer Motion 12.7.4
- **图表库**: ECharts 5.6.0, Ant Design Charts 2.2.7
- **地图组件**: React Leaflet 5.0.0
- **代码规范**: ESLint 9.22.0 + TypeScript ESLint

## 1. 目录结构规范

### 1.1 根目录结构

```
项目根目录/
├── .kiro/                    # 项目文档和规范
│   └── steering/
│       ├── language.md       # 语言规范
│       ├── product.md        # 产品文档
│       ├── structure.md      # 结构文档
│       └── tech.md          # 技术文档
├── public/                   # 静态资源
│   ├── assets/              # 图片、图标等资源
│   └── manifest.json        # PWA 配置
├── src/                     # 源代码目录
│   ├── assets/              # 项目资源文件
│   ├── components/          # 组件目录
│   ├── contexts/            # React Context
│   ├── containersaas/       # 容器SaaS模块
│   ├── index.css           # 全局样式
│   ├── main.tsx            # 应用入口
│   └── App.tsx             # 根组件
├── package.json            # 依赖配置
├── tsconfig.json           # TypeScript配置
├── vite.config.ts          # Vite配置
├── eslint.config.js        # ESLint配置
└── postcss.config.js       # PostCSS配置
```

### 1.2 组件目录结构

```
src/components/
├── common/                  # 通用组件
│   ├── LoadingSpinner.tsx   # 加载组件
│   ├── ConfirmModal.tsx     # 确认弹窗
│   ├── Tooltip.tsx          # 工具提示
│   └── *.css               # 组件样式文件
├── layout/                  # 布局组件
│   ├── Header.tsx
│   └── Footer.tsx
├── home/                    # 首页模块
├── pages/                   # 页面组件
├── controltower/            # 控制塔模块
├── controltower-client/     # 客户端控制塔模块
├── platformadmin/           # 平台管理模块
├── portalhome/              # 门户首页模块
└── walltechhome/           # WallTech首页模块
```

### 1.3 业务模块结构

每个业务模块应遵循以下结构：

```
模块名/
├── index.tsx               # 模块入口文件
├── routes.tsx              # 路由配置
├── layout/                 # 布局组件
│   └── layout.tsx
├── pages/                  # 页面组件
├── common/                 # 模块内通用组件
├── saas/                   # SaaS相关组件
└── *.css                   # 模块样式文件
```

## 2. 代码规范

### 2.1 命名规范

#### 文件命名
- **组件文件**: 使用 PascalCase，如 `UserProfile.tsx`
- **样式文件**: 使用 PascalCase + 后缀，如 `ControlTowerStyles.css`
- **工具文件**: 使用 camelCase，如 `apiUtils.ts`
- **常量文件**: 使用 camelCase，如 `constants.ts`

#### 组件命名
- **React组件**: 使用 PascalCase，如 `const UserProfile: React.FC = () => {}`
- **函数组件**: 必须使用 `React.FC` 类型注解
- **组件Props**: 使用 PascalCase + Props 后缀，如 `interface UserProfileProps {}`

#### 变量命名
- **普通变量**: 使用 camelCase，如 `const userName = 'admin'`
- **常量**: 使用 UPPER_SNAKE_CASE，如 `const API_BASE_URL = 'https://api.example.com'`
- **布尔值**: 使用 is/has/can 前缀，如 `const isLoading = false`

#### 函数命名
- **事件处理函数**: 使用 handle 前缀，如 `const handleClick = () => {}`
- **工具函数**: 使用动词开头，如 `const formatDate = (date: Date) => {}`
- **获取数据函数**: 使用 get/fetch 前缀，如 `const getUserData = async () => {}`

### 2.2 TypeScript 规范

#### 类型定义
```typescript
// ✅ 正确：使用 interface 定义对象类型
interface UserInfo {
  id: number;
  name: string;
  email?: string; // 可选属性使用 ?
}

// ✅ 正确：使用 type 定义联合类型
type Status = 'pending' | 'approved' | 'rejected';

// ✅ 正确：泛型命名使用 T, K, V 等
interface ApiResponse<T> {
  data: T;
  message: string;
  code: number;
}
```

#### 组件类型注解
```typescript
// ✅ 正确：完整的组件类型定义
interface ButtonProps {
  /** 按钮文本 */
  children: React.ReactNode;
  /** 按钮类型 */
  type?: 'primary' | 'secondary';
  /** 点击事件 */
  onClick?: () => void;
  /** 是否禁用 */
  disabled?: boolean;
}

const Button: React.FC<ButtonProps> = ({ 
  children, 
  type = 'primary', 
  onClick, 
  disabled = false 
}) => {
  return (
    <button 
      className={`btn btn-${type}`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
};
```

### 2.3 React 组件规范

#### 组件结构
```typescript
// 1. 导入语句
import React, { useState, useEffect } from 'react';
import { Button, Card } from '@arco-design/web-react';
import { useNavigate } from 'react-router-dom';

// 2. 类型定义
interface ComponentProps {
  title: string;
  onSave: (data: any) => void;
}

// 3. 组件实现
const MyComponent: React.FC<ComponentProps> = ({ title, onSave }) => {
  // 4. 状态定义
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);
  
  // 5. Hooks
  const navigate = useNavigate();
  
  // 6. 副作用
  useEffect(() => {
    // 初始化逻辑
  }, []);
  
  // 7. 事件处理函数
  const handleSave = () => {
    setLoading(true);
    // 保存逻辑
    onSave(data);
    setLoading(false);
  };
  
  // 8. 渲染逻辑
  return (
    <Card title={title}>
      <Button onClick={handleSave} loading={loading}>
        保存
      </Button>
    </Card>
  );
};

// 9. 导出
export default MyComponent;
```

#### Hooks 使用规范
```typescript
// ✅ 正确：自定义 Hook 命名以 use 开头
const useUserData = (userId: string) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  
  useEffect(() => {
    // 获取用户数据逻辑
  }, [userId]);
  
  return { user, loading };
};

// ✅ 正确：依赖数组明确列出所有依赖
useEffect(() => {
  fetchData(userId, status);
}, [userId, status]);
```

### 2.4 样式规范

#### TailwindCSS 使用
```typescript
// ✅ 正确：使用 TailwindCSS 类名
const Card = () => (
  <div className="bg-white rounded-lg shadow-md p-6 mb-4">
    <h2 className="text-xl font-bold text-gray-800 mb-2">标题</h2>
    <p className="text-gray-600">内容</p>
  </div>
);

// ✅ 正确：响应式设计
const ResponsiveGrid = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
    {/* 网格内容 */}
  </div>
);
```

#### CSS 模块化
```css
/* ✅ 正确：使用 CSS 变量 */
:root {
  --color-primary: #7466F0;
  --color-secondary: #A891FF;
  --color-accent: #F3F0FF;
  --color-dark: #333333;
}

/* ✅ 正确：BEM 命名规范 */
.card {
  background: white;
  border-radius: 8px;
}

.card__header {
  padding: 16px;
  border-bottom: 1px solid #eee;
}

.card__title {
  font-size: 18px;
  font-weight: bold;
}

.card--highlighted {
  border: 2px solid var(--color-primary);
}
```

### 2.5 注释规范

#### 组件注释
```typescript
/**
 * 用户信息卡片组件
 * @description 展示用户基本信息，支持编辑和删除操作
 * @author 开发者姓名
 * @date 2024-01-15
 */
interface UserCardProps {
  /** 用户ID */
  userId: string;
  /** 是否可编辑 */
  editable?: boolean;
  /** 删除回调函数 */
  onDelete?: (userId: string) => void;
}

const UserCard: React.FC<UserCardProps> = ({ userId, editable = false, onDelete }) => {
  /**
   * 处理删除用户操作
   * @param userId 用户ID
   */
  const handleDelete = (userId: string) => {
    // 确认删除逻辑
    if (window.confirm('确定要删除该用户吗？')) {
      onDelete?.(userId);
    }
  };
  
  return (
    // JSX 内容
  );
};
```

#### 函数注释
```typescript
/**
 * 格式化日期字符串
 * @param date 日期对象或时间戳
 * @param format 格式化模板，默认为 'YYYY-MM-DD'
 * @returns 格式化后的日期字符串
 * @example
 * formatDate(new Date(), 'YYYY-MM-DD HH:mm:ss')
 * // => '2024-01-15 14:30:00'
 */
const formatDate = (date: Date | number, format: string = 'YYYY-MM-DD'): string => {
  // 实现逻辑
};
```

## 3. 开发流程和最佳实践

### 3.1 开发环境配置

#### 必需工具
- Node.js 18+ 
- npm 或 yarn
- VS Code (推荐)
- Git

#### VS Code 推荐插件
```json
{
  "recommendations": [
    "bradlc.vscode-tailwindcss",
    "esbenp.prettier-vscode",
    "dbaeumer.vscode-eslint",
    "ms-vscode.vscode-typescript-next",
    "formulahendry.auto-rename-tag",
    "christian-kohler.path-intellisense"
  ]
}
```

### 3.2 Git 工作流

#### 分支命名规范
- `main`: 主分支，用于生产环境
- `develop`: 开发分支，用于集成测试
- `feature/功能名`: 功能开发分支
- `bugfix/问题描述`: 问题修复分支
- `hotfix/紧急修复`: 紧急修复分支

#### 提交信息规范
```bash
# 格式：<type>(<scope>): <subject>

# 类型说明：
feat: 新功能
fix: 修复问题
docs: 文档更新
style: 代码格式调整
refactor: 代码重构
test: 测试相关
chore: 构建过程或辅助工具的变动

# 示例：
feat(user): 添加用户信息编辑功能
fix(api): 修复登录接口返回数据格式问题
docs(readme): 更新项目安装说明
```

### 3.3 代码审查规范

#### 审查清单
- [ ] 代码符合项目编码规范
- [ ] 组件和函数有适当的类型注解
- [ ] 关键逻辑有注释说明
- [ ] 没有硬编码的配置信息
- [ ] 错误处理完善
- [ ] 性能考虑合理
- [ ] 安全性检查通过
- [ ] 测试覆盖充分

### 3.4 性能优化指南

#### 组件优化
```typescript
// ✅ 使用 React.memo 优化组件渲染
const ExpensiveComponent = React.memo<Props>(({ data }) => {
  return <div>{/* 复杂渲染逻辑 */}</div>;
});

// ✅ 使用 useMemo 缓存计算结果
const ProcessedData = ({ rawData }) => {
  const processedData = useMemo(() => {
    return rawData.map(item => ({ ...item, processed: true }));
  }, [rawData]);
  
  return <div>{/* 使用 processedData */}</div>;
};

// ✅ 使用 useCallback 缓存函数
const ParentComponent = () => {
  const handleClick = useCallback((id: string) => {
    // 处理点击逻辑
  }, []);
  
  return <ChildComponent onClick={handleClick} />;
};
```

#### 懒加载
```typescript
// ✅ 路由级别的懒加载
const Dashboard = lazy(() => import('./pages/Dashboard'));
const UserProfile = lazy(() => import('./pages/UserProfile'));

// ✅ 组件级别的懒加载
const HeavyChart = lazy(() => import('./components/HeavyChart'));

const App = () => (
  <Suspense fallback={<LoadingSpinner />}>
    <Routes>
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/profile" element={<UserProfile />} />
    </Routes>
  </Suspense>
);
```

### 3.5 错误处理规范

#### 错误边界
```typescript
class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('组件错误:', error, errorInfo);
    // 发送错误报告到监控服务
  }

  render() {
    if (this.state.hasError) {
      return <div>出现了错误，请刷新页面重试</div>;
    }

    return this.props.children;
  }
}
```

#### 异步错误处理
```typescript
// ✅ 正确的异步错误处理
const fetchUserData = async (userId: string) => {
  try {
    setLoading(true);
    const response = await api.getUser(userId);
    setUser(response.data);
  } catch (error) {
    console.error('获取用户数据失败:', error);
    setError('获取用户数据失败，请稍后重试');
    // 可选：发送错误报告
  } finally {
    setLoading(false);
  }
};
```

### 3.6 测试规范

#### 单元测试
```typescript
// UserCard.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import UserCard from './UserCard';

describe('UserCard', () => {
  const mockUser = {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com'
  };

  it('应该正确渲染用户信息', () => {
    render(<UserCard user={mockUser} />);
    
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('john@example.com')).toBeInTheDocument();
  });

  it('点击删除按钮应该调用删除回调', () => {
    const mockOnDelete = jest.fn();
    render(<UserCard user={mockUser} onDelete={mockOnDelete} />);
    
    fireEvent.click(screen.getByText('删除'));
    expect(mockOnDelete).toHaveBeenCalledWith('1');
  });
});
```

## 4. 安全规范

### 4.1 数据安全
- 敏感信息不得硬编码在代码中
- 使用环境变量管理配置信息
- API 密钥等敏感信息必须通过安全的方式传递
- 用户输入必须进行验证和清理

### 4.2 XSS 防护
```typescript
// ✅ 正确：使用 React 的自动转义
const SafeComponent = ({ userInput }: { userInput: string }) => (
  <div>{userInput}</div> // React 自动转义
);

// ❌ 错误：直接使用 dangerouslySetInnerHTML
const UnsafeComponent = ({ htmlContent }: { htmlContent: string }) => (
  <div dangerouslySetInnerHTML={{ __html: htmlContent }} />
);

// ✅ 正确：如果必须使用 HTML，先进行清理
import DOMPurify from 'dompurify';

const SafeHTMLComponent = ({ htmlContent }: { htmlContent: string }) => {
  const cleanHTML = DOMPurify.sanitize(htmlContent);
  return <div dangerouslySetInnerHTML={{ __html: cleanHTML }} />;
};
```

## 5. 部署和维护

### 5.1 构建配置
```typescript
// vite.config.ts
export default defineConfig({
  plugins: [react(), vue()],
  build: {
    target: 'es2015',
    outDir: 'dist',
    sourcemap: process.env.NODE_ENV === 'development',
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          ui: ['@arco-design/web-react'],
          utils: ['lodash', 'dayjs']
        }
      }
    }
  }
});
```

### 5.2 环境配置
```bash
# .env.development
VITE_API_BASE_URL=http://localhost:3000/api
VITE_APP_TITLE=开发环境

# .env.production
VITE_API_BASE_URL=https://api.production.com
VITE_APP_TITLE=生产环境
```

### 5.3 监控和日志
```typescript
// 错误监控
const reportError = (error: Error, context?: any) => {
  if (process.env.NODE_ENV === 'production') {
    // 发送到错误监控服务
    console.error('Error reported:', error, context);
  }
};

// 性能监控
const reportPerformance = (metric: string, value: number) => {
  if (process.env.NODE_ENV === 'production') {
    // 发送性能数据
    console.log(`Performance metric: ${metric} = ${value}`);
  }
};
```

## 6. 常见问题和解决方案

### 6.1 性能问题
- **问题**: 组件重复渲染
- **解决**: 使用 React.memo、useMemo、useCallback
- **问题**: 包体积过大
- **解决**: 代码分割、懒加载、Tree Shaking

### 6.2 兼容性问题
- **问题**: 浏览器兼容性
- **解决**: 使用 Babel 转译、Polyfill
- **问题**: 移动端适配
- **解决**: 响应式设计、Touch 事件处理

### 6.3 开发效率
- **问题**: 重复代码
- **解决**: 抽象通用组件、自定义 Hooks
- **问题**: 调试困难
- **解决**: 使用 React DevTools、完善的日志系统

## 7. 更新日志

### 版本 1.0.0 (2024-01-15)
- 初始版本发布
- 建立基础项目结构
- 完成核心开发规范

---

**注意**: 本文档会根据项目发展持续更新，所有开发人员都应该定期查看最新版本。如有疑问或建议，请及时与项目负责人沟通。