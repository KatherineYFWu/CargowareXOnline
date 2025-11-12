import { BrowserRouter as Router } from 'react-router-dom'
import { ConfigProvider, Message } from '@arco-design/web-react'
import { ModalProvider } from './contexts/ModalContext'
import './index.css'

// AppContent组件
import AppContent from './components/AppContent'

// 配置Message全局属性
Message.config({
  maxCount: 3,
  duration: 3000,
});

// Stagewise imports removed due to workspace protocol issues

function App() {
  return (
    <ConfigProvider>
      <Router>
        <ModalProvider>
          <AppContent />
          {/* Stagewise Toolbar removed due to workspace protocol issues */}
        </ModalProvider>
      </Router>
    </ConfigProvider>
  )
}

export default App
