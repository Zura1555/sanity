import React, {useCallback, useState, useRef, useEffect} from 'react'
import {Stack, Button, Card, TextInput, Grid, Flex, Box, Tooltip, Text, Inline} from '@sanity/ui'
import {set, unset, type ObjectInputProps} from 'sanity'
import {
  AddIcon,
  RemoveIcon,
  ChevronUpIcon,
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  TrashIcon,
  ComposeIcon,
} from '@sanity/icons'

interface TableRow {
  _key: string
  cells: string[]
}

interface TableValue {
  rows?: TableRow[]
}

export function TableCanvasInput(props: ObjectInputProps<TableValue>) {
  const {value, onChange, readOnly} = props
  const [editingCell, setEditingCell] = useState<{row: number; col: number} | null>(null)
  const [selectedCell, setSelectedCell] = useState<{row: number; col: number} | null>(null)
  const [hoveredRow, setHoveredRow] = useState<number | null>(null)
  const [hoveredCol, setHoveredCol] = useState<number | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const rows = value?.rows || []
  const colCount = rows.length > 0 ? Math.max(...rows.map((r) => r.cells?.length || 0)) : 0

  // Focus input when editing starts
  useEffect(() => {
    if (editingCell && inputRef.current) {
      inputRef.current.focus()
      inputRef.current.select()
    }
  }, [editingCell])

  // Generate a unique key
  const generateKey = () => Math.random().toString(36).substring(2, 9)

  // Initialize with empty table if no data
  useEffect(() => {
    if (!value?.rows || value.rows.length === 0) {
      handleInitializeTable()
    }
  }, [])

  const handleInitializeTable = () => {
    const initialRows: TableRow[] = [
      {_key: generateKey(), cells: ['Header 1', 'Header 2', 'Header 3']},
      {_key: generateKey(), cells: ['', '', '']},
      {_key: generateKey(), cells: ['', '', '']},
    ]
    onChange(set({rows: initialRows}))
  }

  // Update a specific cell
  const handleCellChange = useCallback(
    (rowIndex: number, colIndex: number, newValue: string) => {
      const newRows = rows.map((row, rIdx) => {
        if (rIdx !== rowIndex) return row
        const newCells = [...(row.cells || [])]
        newCells[colIndex] = newValue
        return {...row, cells: newCells}
      })
      onChange(set({rows: newRows}))
    },
    [rows, onChange],
  )

  // Add a row
  const handleAddRow = useCallback(
    (afterIndex?: number) => {
      const newRow: TableRow = {
        _key: generateKey(),
        cells: Array(colCount).fill(''),
      }
      const insertIndex = afterIndex !== undefined ? afterIndex + 1 : rows.length
      const newRows = [...rows.slice(0, insertIndex), newRow, ...rows.slice(insertIndex)]
      onChange(set({rows: newRows}))
    },
    [rows, colCount, onChange],
  )

  // Remove a row
  const handleRemoveRow = useCallback(
    (rowIndex: number) => {
      if (rows.length <= 1) return // Keep at least one row
      const newRows = rows.filter((_, idx) => idx !== rowIndex)
      onChange(set({rows: newRows}))
    },
    [rows, onChange],
  )

  // Add a column
  const handleAddColumn = useCallback(
    (afterIndex?: number) => {
      const insertIndex = afterIndex !== undefined ? afterIndex + 1 : colCount
      const newRows = rows.map((row) => {
        const cells = [...(row.cells || [])]
        cells.splice(insertIndex, 0, '')
        return {...row, cells}
      })
      onChange(set({rows: newRows}))
    },
    [rows, colCount, onChange],
  )

  // Remove a column
  const handleRemoveColumn = useCallback(
    (colIndex: number) => {
      if (colCount <= 1) return // Keep at least one column
      const newRows = rows.map((row) => ({
        ...row,
        cells: (row.cells || []).filter((_, idx) => idx !== colIndex),
      }))
      onChange(set({rows: newRows}))
    },
    [rows, colCount, onChange],
  )

  // Move row up/down
  const handleMoveRow = useCallback(
    (rowIndex: number, direction: 'up' | 'down') => {
      if (direction === 'up' && rowIndex === 0) return
      if (direction === 'down' && rowIndex === rows.length - 1) return

      const newIndex = direction === 'up' ? rowIndex - 1 : rowIndex + 1
      const newRows = [...rows]
      const [movedRow] = newRows.splice(rowIndex, 1)
      newRows.splice(newIndex, 0, movedRow)
      onChange(set({rows: newRows}))
    },
    [rows, onChange],
  )

  // Move column left/right
  const handleMoveColumn = useCallback(
    (colIndex: number, direction: 'left' | 'right') => {
      if (direction === 'left' && colIndex === 0) return
      if (direction === 'right' && colIndex === colCount - 1) return

      const newIndex = direction === 'left' ? colIndex - 1 : colIndex + 1
      const newRows = rows.map((row) => {
        const cells = [...(row.cells || [])]
        const [movedCell] = cells.splice(colIndex, 1)
        cells.splice(newIndex, 0, movedCell)
        return {...row, cells}
      })
      onChange(set({rows: newRows}))
    },
    [rows, colCount, onChange],
  )

  // Handle keyboard navigation
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent, rowIndex: number, colIndex: number) => {
      if (!editingCell) {
        // Navigation mode
        switch (e.key) {
          case 'ArrowUp':
            e.preventDefault()
            if (rowIndex > 0) setSelectedCell({row: rowIndex - 1, col: colIndex})
            break
          case 'ArrowDown':
            e.preventDefault()
            if (rowIndex < rows.length - 1) setSelectedCell({row: rowIndex + 1, col: colIndex})
            break
          case 'ArrowLeft':
            e.preventDefault()
            if (colIndex > 0) setSelectedCell({row: rowIndex, col: colIndex - 1})
            break
          case 'ArrowRight':
            e.preventDefault()
            if (colIndex < colCount - 1) setSelectedCell({row: rowIndex, col: colIndex + 1})
            break
          case 'Enter':
            e.preventDefault()
            setEditingCell({row: rowIndex, col: colIndex})
            break
          case 'Delete':
          case 'Backspace':
            if (selectedCell?.row === rowIndex && selectedCell?.col === colIndex) {
              handleCellChange(rowIndex, colIndex, '')
            }
            break
          default:
            // Start editing on any character key
            if (e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey) {
              setEditingCell({row: rowIndex, col: colIndex})
            }
        }
      } else {
        // Editing mode
        if (e.key === 'Enter') {
          e.preventDefault()
          setEditingCell(null)
          // Move to next row
          if (rowIndex < rows.length - 1) {
            setSelectedCell({row: rowIndex + 1, col: colIndex})
          }
        } else if (e.key === 'Escape') {
          e.preventDefault()
          setEditingCell(null)
        } else if (e.key === 'Tab') {
          e.preventDefault()
          setEditingCell(null)
          // Move to next/previous cell
          if (e.shiftKey) {
            if (colIndex > 0) {
              setEditingCell({row: rowIndex, col: colIndex - 1})
            } else if (rowIndex > 0) {
              setEditingCell({row: rowIndex - 1, col: colCount - 1})
            }
          } else {
            if (colIndex < colCount - 1) {
              setEditingCell({row: rowIndex, col: colIndex + 1})
            } else if (rowIndex < rows.length - 1) {
              setEditingCell({row: rowIndex + 1, col: 0})
            }
          }
        }
      }
    },
    [editingCell, rows.length, colCount, selectedCell, handleCellChange],
  )

  const clearTable = () => {
    onChange(unset())
    setEditingCell(null)
    setSelectedCell(null)
  }

  if (!value?.rows || rows.length === 0) {
    return (
      <Card padding={4} radius={2} shadow={1} tone="default">
        <Flex justify="center" align="center" direction="column" gap={3}>
          <Text size={1} muted>
            No table data
          </Text>
          <Button
            text="Create Table"
            tone="primary"
            onClick={handleInitializeTable}
            disabled={readOnly}
            icon={AddIcon}
          />
        </Flex>
      </Card>
    )
  }

  return (
    <Card padding={0} radius={2} shadow={1} tone="default" overflow="hidden">
      {/* Toolbar */}
      <Card padding={3} tone="transparent" borderBottom>
        <Flex justify="space-between" align="center">
          <Inline space={2}>
            <Tooltip content="Add Row">
              <Button
                icon={AddIcon}
                text="Row"
                mode="ghost"
                onClick={() => handleAddRow()}
                disabled={readOnly}
                size={1}
              />
            </Tooltip>
            <Tooltip content="Add Column">
              <Button
                icon={AddIcon}
                text="Column"
                mode="ghost"
                onClick={() => handleAddColumn()}
                disabled={readOnly}
                size={1}
              />
            </Tooltip>
          </Inline>
          <Tooltip content="Clear Table">
            <Button
              icon={TrashIcon}
              mode="ghost"
              tone="critical"
              onClick={clearTable}
              disabled={readOnly}
              size={1}
            />
          </Tooltip>
        </Flex>
      </Card>

      {/* Table Canvas */}
      <Box padding={4}>
        <Flex justify="center">
          <Box style={{position: 'relative'}}>
            {/* Column Controls - Top */}
            <Flex style={{marginLeft: '40px', marginBottom: '4px'}}>
              {Array.from({length: colCount}).map((_, colIdx) => (
                <Flex
                  key={`col-control-${colIdx}`}
                  justify="center"
                  align="center"
                  style={{
                    width: '140px',
                    padding: '4px',
                    borderRadius: '4px',
                    background: hoveredCol === colIdx ? '#f0f0f0' : 'transparent',
                    transition: 'background 0.15s ease',
                  }}
                  onMouseEnter={() => setHoveredCol(colIdx)}
                  onMouseLeave={() => setHoveredCol(null)}
                >
                  {hoveredCol === colIdx && !readOnly && (
                    <Inline space={1}>
                      <Tooltip content="Move Left">
                        <Button
                          icon={ChevronLeftIcon}
                          mode="bleed"
                          size={0}
                          onClick={() => handleMoveColumn(colIdx, 'left')}
                          disabled={colIdx === 0}
                        />
                      </Tooltip>
                      <Tooltip content="Delete Column">
                        <Button
                          icon={RemoveIcon}
                          mode="bleed"
                          tone="critical"
                          size={0}
                          onClick={() => handleRemoveColumn(colIdx)}
                          disabled={colCount <= 1}
                        />
                      </Tooltip>
                      <Tooltip content="Move Right">
                        <Button
                          icon={ChevronRightIcon}
                          mode="bleed"
                          size={0}
                          onClick={() => handleMoveColumn(colIdx, 'right')}
                          disabled={colIdx === colCount - 1}
                        />
                      </Tooltip>
                    </Inline>
                  )}
                </Flex>
              ))}
            </Flex>

            <Flex>
              {/* Row Controls - Left */}
              <Stack space={1} style={{marginRight: '4px', width: '36px'}}>
                {rows.map((_, rowIdx) => (
                  <Flex
                    key={`row-control-${rowIdx}`}
                    justify="center"
                    align="center"
                    style={{
                      height: '44px',
                      borderRadius: '4px',
                      background: hoveredRow === rowIdx ? '#f0f0f0' : 'transparent',
                      transition: 'background 0.15s ease',
                    }}
                    onMouseEnter={() => setHoveredRow(rowIdx)}
                    onMouseLeave={() => setHoveredRow(null)}
                  >
                    {hoveredRow === rowIdx && !readOnly && (
                      <Inline space={1}>
                        <Tooltip content="Move Up">
                          <Button
                            icon={ChevronUpIcon}
                            mode="bleed"
                            size={0}
                            onClick={() => handleMoveRow(rowIdx, 'up')}
                            disabled={rowIdx === 0}
                          />
                        </Tooltip>
                        <Tooltip content="Delete Row">
                          <Button
                            icon={RemoveIcon}
                            mode="bleed"
                            tone="critical"
                            size={0}
                            onClick={() => handleRemoveRow(rowIdx)}
                            disabled={rows.length <= 1}
                          />
                        </Tooltip>
                        <Tooltip content="Move Down">
                          <Button
                            icon={ChevronDownIcon}
                            mode="bleed"
                            size={0}
                            onClick={() => handleMoveRow(rowIdx, 'down')}
                            disabled={rowIdx === rows.length - 1}
                          />
                        </Tooltip>
                      </Inline>
                    )}
                  </Flex>
                ))}
              </Stack>

              {/* Table Grid */}
              <table
                style={{
                  borderCollapse: 'collapse',
                  border: '1px solid #e0e0e0',
                  borderRadius: '4px',
                  overflow: 'hidden',
                }}
              >
                <tbody>
                  {rows.map((row, rowIdx) => (
                    <tr key={row._key || rowIdx}>
                      {(row.cells || []).map((cell, colIdx) => {
                        const isEditing = editingCell?.row === rowIdx && editingCell?.col === colIdx
                        const isSelected =
                          selectedCell?.row === rowIdx && selectedCell?.col === colIdx
                        const isHeader = rowIdx === 0

                        return (
                          <td
                            key={`${row._key}-${colIdx}`}
                            onClick={() => {
                              if (!readOnly) {
                                setSelectedCell({row: rowIdx, col: colIdx})
                                setEditingCell({row: rowIdx, col: colIdx})
                              }
                            }}
                            onKeyDown={(e) => handleKeyDown(e, rowIdx, colIdx)}
                            tabIndex={0}
                            style={{
                              padding: 0,
                              border: '1px solid #e0e0e0',
                              background: isHeader ? '#f8f9fa' : '#ffffff',
                              cursor: readOnly ? 'default' : 'pointer',
                              outline: isSelected ? '2px solid #156dff' : 'none',
                              outlineOffset: '-2px',
                              minWidth: '140px',
                              height: '44px',
                            }}
                          >
                            {isEditing ? (
                              <TextInput
                                ref={inputRef}
                                value={cell || ''}
                                onChange={(e) =>
                                  handleCellChange(rowIdx, colIdx, e.currentTarget.value)
                                }
                                onBlur={() => setEditingCell(null)}
                                style={{
                                  border: 'none',
                                  background: 'transparent',
                                  fontWeight: isHeader ? 600 : 400,
                                }}
                                fontSize={2}
                              />
                            ) : (
                              <Box
                                padding={3}
                                style={{
                                  minHeight: '44px',
                                  display: 'flex',
                                  alignItems: 'center',
                                  fontWeight: isHeader ? 600 : 400,
                                  color: cell ? '#1a1a1a' : '#999',
                                }}
                              >
                                <Text size={2} style={{fontWeight: isHeader ? 600 : 400}}>
                                  {cell || (isHeader ? `Header ${colIdx + 1}` : '')}
                                </Text>
                              </Box>
                            )}
                          </td>
                        )
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </Flex>
          </Box>
        </Flex>
      </Box>

      {/* Footer Info */}
      <Card padding={3} tone="transparent" borderTop>
        <Flex justify="space-between" align="center">
          <Text size={1} muted>
            {rows.length} rows × {colCount} columns
          </Text>
          <Text size={1} muted>
            Click to edit • Tab to navigate • Enter to move down
          </Text>
        </Flex>
      </Card>
    </Card>
  )
}
