# Implementation Plan - 前端演示版

> 注意：这是一个简化的前端演示版本，只实现UI交互效果，不包含完整的数据持久化和后端集成。

- [x] 1. 准备演示数据

- [x] 1.1 定义操作点三级数据结构
  - 在NotificationSubscriptionSettings.tsx中定义mockOperationPointsData常量
  - 包含3-5个一级菜单示例（如超级运价、报价管理、订单管理）
  - 每个一级菜单包含2-3个二级菜单和若干三级组件
  - _Requirements: 1.2_

- [x] 1.2 定义可用变量列表数据
  - 定义mockAvailableVariables常量，包含10-15个常用变量示例
  - 每个变量包含name和type字段（如：操作人姓名-string、操作时间-datetime）
  - _Requirements: 2.1, 2.6_

- [x] 2. 实现操作来源级联选择器

- [x] 2.1 在操作编辑弹窗中添加Cascader组件
  - 导入Arco Design的Cascader组件
  - 替换原有的"操作来源"Input字段
  - 配置options为mockOperationPointsData
  - 启用showSearch支持模糊搜索
  - 设置placeholder为"请选择操作来源"
  - _Requirements: 1.1, 1.3_

- [x] 2.2 实现级联选择器的值处理
  - 添加cascaderValue状态存储选中的路径数组
  - 在onChange中将选中路径转换为显示字符串（用"-"连接）
  - 在表单中显示转换后的字符串
  - _Requirements: 1.2, 1.5_

- [ ] 3. 实现关联变量多选器

- [x] 3.1 替换关联变量输入为Select多选组件




  - 将当前的Input.TextArea替换为Select组件
  - 设置mode="multiple"启用多选
  - 配置options为mockAvailableVariables
  - 启用showSearch支持模糊搜索
  - 设置placeholder为"请选择关联变量"
  - 添加allowClear支持一键清空
  - _Requirements: 2.1, 2.2, 2.3_


- [x] 3.2 实现变量选择器的值处理




  - 添加selectedVariables状态存储选中的变量名数组
  - 在onChange中更新selectedVariables状态
  - 将变量数组转换为Record格式用于保存（variablesToRecord函数）
  - 在表单回显时将Record格式转换回数组（recordToVariables函数）
  - _Requirements: 2.4, 2.5, 2.6_

- [x] 3.3 配置多选器的显示效果





  - 设置maxTagCount={3}限制显示标签数量
  - 在Option中显示"变量名 (类型)"格式
  - 设置合适的下拉框高度和样式
  - _Requirements: 2.4, 2.5, 2.6_

- [x] 4. 优化弹窗UI布局和交互






- [x] 4.1 优化表单布局和样式


  - 确保Form.Item已正确包裹每个字段（已部分完成）
  - 调整表单项间距保持一致性
  - 统一输入框高度为36px
  - 优化错误提示的显示位置和样式
  - _Requirements: 4.1, 4.2, 4.4_

- [x] 4.2 改进表单验证逻辑


  - 更新validateForm函数以支持新的变量数组格式
  - 验证关联变量是否至少选择一个
  - 在用户修改字段时清除对应的错误提示
  - 提交时显示友好的错误消息
  - _Requirements: 4.3_

- [x] 4.3 优化提交成功反馈


  - 在handleCreateOperation和handleEditOperation中添加更详细的成功提示
  - 提示内容包含操作来源和选中的变量数量
  - 确保弹窗关闭后状态正确重置
  - _Requirements: 1.5, 2.5_

- [x] 5. 完善编辑操作的数据回显






- [x] 5.1 实现编辑时的变量回显

  - 在打开编辑弹窗时，将operation.variables（Record格式）转换为变量名数组
  - 设置selectedVariables状态以回显已选变量
  - 确保级联选择器的回显已正确工作（已实现）
  - _Requirements: 3.3, 3.4_

- [x] 5.2 确保新建和编辑模式的一致性


  - 验证新建和编辑弹窗使用相同的组件和样式
  - 确保两种模式下的表单验证逻辑一致
  - 测试新建和编辑的完整流程
  - _Requirements: 3.1, 3.2_
