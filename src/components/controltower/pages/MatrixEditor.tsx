import React, { useState, useCallback, useRef } from 'react';
import { Button, Input, Switch, Card } from '@arco-design/web-react';
import { IconPlus, IconMinus, IconDragArrow } from '@arco-design/web-react/icon';
import './MatrixEditor.css';

/**
 * 单元格数据接口
 */
interface CellData {
  id: string;
  row: number;
  col: number;
  value: string;
  isRequired: boolean;
  placeholder: string;
  isFirstColumn: boolean;
}

/**
 * 行数据接口
 */
interface RowData {
  id: string;
  cells: CellData[];
}

/**
 * 矩阵编辑器属性接口
 */
interface MatrixEditorProps {
  templateId: string;
}

/**
 * 矩阵编辑器组件
 * @description 用于编辑IFTMBF订舱报文的动态矩阵
 * @param templateId 模板ID
 */
const MatrixEditor: React.FC<MatrixEditorProps> = ({ templateId: _ }) => {
  const dragTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [isDraggingRow, setIsDraggingRow] = useState(false);

  // 初始化矩阵数据 - 默认3行，每行10列
  const initializeMatrix = (): RowData[] => {
    const rows: RowData[] = [];
    for (let rowIndex = 0; rowIndex < 3; rowIndex++) {
      const cells: CellData[] = [];
      for (let colIndex = 0; colIndex < 10; colIndex++) {
        cells.push({
          id: `cell-${rowIndex}-${colIndex}`,
          row: rowIndex,
          col: colIndex,
          value: '',
          isRequired: false,
          placeholder: colIndex === 0 ? '记录序号' : `列${colIndex + 1}`,
          isFirstColumn: colIndex === 0
        });
      }
      rows.push({
        id: `row-${rowIndex}`,
        cells
      });
    }
    return rows;
  };

  const [matrixData, setMatrixData] = useState<RowData[]>(initializeMatrix);
  const [selectedCell, setSelectedCell] = useState<string | null>(null);
  const [draggedRow, setDraggedRow] = useState<string | null>(null);
  const [dragOverRow, setDragOverRow] = useState<string | null>(null);

  /**
   * 处理单元格值变化
   * @param cellId 单元格ID
   * @param value 新值
   */
  const handleCellValueChange = useCallback((cellId: string, value: string) => {
    setMatrixData(prev => {
      return prev.map(row => ({
        ...row,
        cells: row.cells.map(cell => 
          cell.id === cellId ? { ...cell, value } : cell
        )
      }));
    });
  }, []);

  /**
   * 处理单元格点击选择
   * @param cellId 单元格ID
   */
  const handleCellClick = useCallback((cellId: string) => {
    setSelectedCell(cellId);
  }, []);

  /**
   * 添加新行 - 默认1个格子
   */
  const handleAddRow = useCallback(() => {
    setMatrixData(prev => {
      const newRowIndex = prev.length;
      const newCells: CellData[] = [{
        id: `cell-${newRowIndex}-0`,
        row: newRowIndex,
        col: 0,
        value: '',
        isRequired: false,
        placeholder: '记录序号',
        isFirstColumn: true
      }];
      
      const newRow: RowData = {
        id: `row-${newRowIndex}`,
        cells: newCells
      };
      
      return [...prev, newRow];
    });
  }, []);

  /**
   * 删除指定行
   * @param rowId 行ID
   */
  const handleDeleteRow = useCallback((rowId: string) => {
    setMatrixData(prev => {
      const filteredRows = prev.filter(row => row.id !== rowId);
      // 重新计算行索引和ID
      return filteredRows.map((row, newRowIndex) => ({
        id: `row-${newRowIndex}`,
        cells: row.cells.map((cell, colIndex) => ({
          ...cell,
          id: `cell-${newRowIndex}-${colIndex}`,
          row: newRowIndex,
          placeholder: colIndex === 0 ? '记录序号' : `列${colIndex + 1}`
        }))
      }));
    });
  }, []);

  /**
   * 添加列到指定行
   * @param rowId 行ID
   */
  const handleAddColumn = useCallback((rowId: string) => {
    setMatrixData(prev => {
      return prev.map(row => {
        if (row.id === rowId) {
          const newColIndex = row.cells.length;
          const newCell: CellData = {
            id: `cell-${row.cells[0].row}-${newColIndex}`,
            row: row.cells[0].row,
            col: newColIndex,
            value: '',
            isRequired: false,
            placeholder: `列${newColIndex + 1}`,
            isFirstColumn: false
          };
          return {
            ...row,
            cells: [...row.cells, newCell]
          };
        }
        return row;
      });
    });
  }, []);



  /**
   * 检查行是否为空（所有格子都没有值）
   * @param row 行数据
   */
  const isRowEmpty = useCallback((row: RowData): boolean => {
    return row.cells.every(cell => !cell.value.trim());
  }, []);

  /**
   * 自动删除空行
   */
  const handleAutoDeleteEmptyRows = useCallback(() => {
    setMatrixData(prev => {
      const nonEmptyRows = prev.filter(row => !isRowEmpty(row));
      // 重新计算行索引
      return nonEmptyRows.map((row, newRowIndex) => ({
        id: `row-${newRowIndex}`,
        cells: row.cells.map((cell, colIndex) => ({
          ...cell,
          id: `cell-${newRowIndex}-${colIndex}`,
          row: newRowIndex,
          placeholder: colIndex === 0 ? '记录序号' : `列${colIndex + 1}`
        }))
      }));
    });
  }, [isRowEmpty]);

  /**
   * 处理长按开始 - 用于拖拽整行
   * @param rowId 行ID
   */
  const handleMouseDown = useCallback((rowId: string) => {
    dragTimeoutRef.current = setTimeout(() => {
      setIsDraggingRow(true);
      setDraggedRow(rowId);
    }, 500); // 500ms长按
  }, []);

  /**
   * 处理鼠标抬起
   */
  const handleMouseUp = useCallback(() => {
    if (dragTimeoutRef.current) {
      clearTimeout(dragTimeoutRef.current);
      dragTimeoutRef.current = null;
    }
  }, []);

  /**
   * 处理拖拽结束
   */
  const handleDragEnd = useCallback(() => {
    setIsDraggingRow(false);
    setDraggedRow(null);
    setDragOverRow(null);
  }, []);

  /**
   * 处理行拖拽放置
   * @param targetRowId 目标行ID
   */
  const handleRowDrop = useCallback((targetRowId: string) => {
    if (!draggedRow || draggedRow === targetRowId) return;

    setMatrixData(prev => {
      const draggedIndex = prev.findIndex(row => row.id === draggedRow);
      const targetIndex = prev.findIndex(row => row.id === targetRowId);
      
      if (draggedIndex === -1 || targetIndex === -1) return prev;

      const newMatrix = [...prev];
      const [draggedRowData] = newMatrix.splice(draggedIndex, 1);
      newMatrix.splice(targetIndex, 0, draggedRowData);

      // 重新计算所有行的索引
      return newMatrix.map((row, newRowIndex) => ({
        id: `row-${newRowIndex}`,
        cells: row.cells.map((cell, colIndex) => ({
          ...cell,
          id: `cell-${newRowIndex}-${colIndex}`,
          row: newRowIndex,
          placeholder: colIndex === 0 ? '记录序号' : `列${colIndex + 1}`
        }))
      }));
    });
  }, [draggedRow]);

  /**
   * 设置单元格必填状态
   * @param cellId 单元格ID
   * @param isRequired 是否必填
   */
  const handleSetRequired = useCallback((cellId: string, isRequired: boolean) => {
    setMatrixData(prev => {
      return prev.map(row => ({
        ...row,
        cells: row.cells.map(cell => 
          cell.id === cellId ? { ...cell, isRequired } : cell
        )
      }));
    });
  }, []);

  /**
   * 设置单元格占位文字
   * @param cellId 单元格ID
   * @param placeholder 占位文字
   */
  const handleSetPlaceholder = useCallback((cellId: string, placeholder: string) => {
    setMatrixData(prev => {
      return prev.map(row => ({
        ...row,
        cells: row.cells.map(cell => 
          cell.id === cellId ? { ...cell, placeholder } : cell
        )
      }));
    });
  }, []);

  // 获取选中单元格的数据
  const selectedCellData = selectedCell ? 
    matrixData.flatMap(row => row.cells).find(cell => cell.id === selectedCell) : null;

  return (
    <div className="matrix-editor">
      <div className="matrix-container">
        <div className="matrix-grid">
          {matrixData.map((row, rowIndex) => (
            <div
              key={row.id}
              className={`matrix-row ${
                draggedRow === row.id ? 'dragging-row' : ''
              } ${
                dragOverRow === row.id ? 'drag-over-row' : ''
              }`}
              onDragOver={(e) => {
                if (isDraggingRow) {
                  e.preventDefault();
                  setDragOverRow(row.id);
                }
              }}
              onDrop={(e) => {
                if (isDraggingRow) {
                  e.preventDefault();
                  handleRowDrop(row.id);
                }
              }}
            >
              {row.cells.map((cell, _) => (
                <div
                  key={cell.id}
                  className={`matrix-cell ${
                    selectedCell === cell.id ? 'selected' : ''
                  } ${
                    cell.isFirstColumn ? 'first-column' : ''
                  }`}
                  onClick={() => handleCellClick(cell.id)}
                >
                  <Input
                    value={cell.value}
                    placeholder={cell.placeholder}
                    onChange={(value) => {
                      handleCellValueChange(cell.id, value);
                      // 当值变化时检查是否需要自动删除空行
                      setTimeout(handleAutoDeleteEmptyRows, 100);
                    }}
                    className={`cell-input ${cell.isRequired ? 'required' : ''}`}
                  />
                  {cell.isFirstColumn && (
                    <div
                      className="drag-handle"
                      draggable={isDraggingRow}
                      onMouseDown={() => handleMouseDown(row.id)}
                      onMouseUp={handleMouseUp}
                      onDragEnd={handleDragEnd}
                    >
                      <IconDragArrow />
                    </div>
                  )}
                </div>
              ))}
              
              {/* 行操作按钮 */}
              <div className="row-actions">
                <Button
                  type="text"
                  size="small"
                  icon={<IconPlus />}
                  onClick={() => handleAddColumn(row.id)}
                  className="add-column-btn"
                  title="添加列"
                />
                <Button
                  type="text"
                  size="small"
                  icon={<IconMinus />}
                  onClick={() => handleDeleteRow(row.id)}
                  className="delete-row-btn"
                  title="删除行"
                />
              </div>
              
              {/* 最后一行第一列下方的加号 */}
              {rowIndex === matrixData.length - 1 && (
                <div className="add-row-trigger">
                  <Button
                    type="text"
                    size="small"
                    icon={<IconPlus />}
                    onClick={handleAddRow}
                    className="add-row-icon"
                    title="添加新行"
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* 属性设置面板 */}
      {selectedCellData && (
        <Card title="格子属性设置" className="properties-panel">
          <div className="property-item">
            <label>必填字段：</label>
            <Switch
              checked={selectedCellData.isRequired}
              onChange={(checked) => handleSetRequired(selectedCellData.id, checked)}
            />
          </div>
          <div className="property-item">
            <label>占位文字：</label>
            <Input
              value={selectedCellData.placeholder}
              onChange={(value) => handleSetPlaceholder(selectedCellData.id, value)}
              placeholder="请输入占位文字"
            />
          </div>
          <div className="property-item">
            <label>字段名称：</label>
            <Input
              value={selectedCellData.value}
              onChange={(value) => handleCellValueChange(selectedCellData.id, value)}
              placeholder="请输入字段名称"
            />
          </div>
          <div className="property-preview">
            <h4>预览效果：</h4>
            <Input
              value={selectedCellData.value}
              placeholder={selectedCellData.placeholder}
              className={selectedCellData.isRequired ? 'required' : ''}
              disabled
            />
          </div>
        </Card>
      )}
    </div>
  );
};

export default MatrixEditor;