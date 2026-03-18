import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react'
import {Stack, Button, Card, Flex, Box, Tooltip, Text, Inline, TextArea} from '@sanity/ui'
import {set, unset, type ObjectInputProps} from 'sanity'
import {
  AddIcon,
  RemoveIcon,
  ChevronUpIcon,
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  TrashIcon,
} from '@sanity/icons'

interface TableRow {
  _key: string
  cells: string[]
}

interface TableValue {
  _type?: string
  rows?: TableRow[]
}

const PICKER_MAX_ROWS = 10
const PICKER_MAX_COLS = 10

const generateKey = () => Math.random().toString(36).substring(2, 9)

export function TableCanvasInput(props: ObjectInputProps<TableValue>) {
  const {value, onChange, readOnly} = props
  const [editingCell, setEditingCell] = useState<{row: number; col: number} | null>(null)
  const [selectedCell, setSelectedCell] = useState<{row: number; col: number} | null>(null)
  const [hoveredRow, setHoveredRow] = useState<number | null>(null)
  const [hoveredCol, setHoveredCol] = useState<number | null>(null)
  const [hoveredSize, setHoveredSize] = useState<{rows: number; cols: number} | null>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  const rows = useMemo(() => value?.rows || [], [value?.rows])
  const colCount = rows.length > 0 ? Math.max(...rows.map((r) => r.cells?.length || 0)) : 0

  useEffect(() => {
    if (editingCell && inputRef.current) {
      inputRef.current.focus()
      inputRef.current.select()
    }
  }, [editingCell])

  // Backward compatibility: add missing _type and _key values for existing content.
  useEffect(() => {
    if (!value?.rows || value.rows.length === 0) return

    const needsMigration = !value._type || value.rows.some((row) => !row._key)
    if (!needsMigration) return

    const migratedRows = value.rows.map((row) => ({
      ...row,
      _key: row._key || generateKey(),
    }))

    onChange(set({_type: 'table', rows: migratedRows}))
  }, [value?._type, value?.rows, onChange])

  const handleInitializeTable = useCallback(
    (rowCount: number, columnCount: number) => {
      const initialRows: TableRow[] = Array.from({length: rowCount}, (_, rowIndex) => ({
        _key: generateKey(),
        cells: Array.from({length: columnCount}, (_, colIndex) =>
          rowIndex === 0 ? `Header ${colIndex + 1}` : '',
        ),
      }))

      onChange(set({_type: 'table', rows: initialRows}))
      setSelectedCell({row: 0, col: 0})
      setEditingCell({row: 0, col: 0})
    },
    [onChange],
  )

  const handleCellChange = useCallback(
    (rowIndex: number, colIndex: number, newValue: string) => {
      const newRows = rows.map((row, rIdx) => {
        if (rIdx !== rowIndex) return row
        const newCells = [...(row.cells || [])]
        newCells[colIndex] = newValue
        return {...row, cells: newCells}
      })
      onChange(set({_type: 'table', rows: newRows}))
    },
    [rows, onChange],
  )

  const handleAddRow = useCallback(
    (afterIndex?: number) => {
      const nextColCount = Math.max(colCount, 1)
      const newRow: TableRow = {
        _key: generateKey(),
        cells: Array(nextColCount).fill(''),
      }
      const insertIndex = afterIndex !== undefined ? afterIndex + 1 : rows.length
      const newRows = [...rows.slice(0, insertIndex), newRow, ...rows.slice(insertIndex)]
      onChange(set({_type: 'table', rows: newRows}))
    },
    [rows, colCount, onChange],
  )

  const handleRemoveRow = useCallback(
    (rowIndex: number) => {
      if (rows.length <= 1) return
      const newRows = rows.filter((_, idx) => idx !== rowIndex)
      onChange(set({_type: 'table', rows: newRows}))
    },
    [rows, onChange],
  )

  const handleAddColumn = useCallback(
    (afterIndex?: number) => {
      const insertIndex = afterIndex !== undefined ? afterIndex + 1 : colCount
      const newRows = rows.map((row) => {
        const cells = [...(row.cells || [])]
        cells.splice(insertIndex, 0, '')
        return {...row, cells}
      })
      onChange(set({_type: 'table', rows: newRows}))
    },
    [rows, colCount, onChange],
  )

  const handleRemoveColumn = useCallback(
    (colIndex: number) => {
      if (colCount <= 1) return
      const newRows = rows.map((row) => ({
        ...row,
        cells: (row.cells || []).filter((_, idx) => idx !== colIndex),
      }))
      onChange(set({_type: 'table', rows: newRows}))
    },
    [rows, colCount, onChange],
  )

  const handleMoveRow = useCallback(
    (rowIndex: number, direction: 'up' | 'down') => {
      if (direction === 'up' && rowIndex === 0) return
      if (direction === 'down' && rowIndex === rows.length - 1) return

      const newIndex = direction === 'up' ? rowIndex - 1 : rowIndex + 1
      const newRows = [...rows]
      const [movedRow] = newRows.splice(rowIndex, 1)
      newRows.splice(newIndex, 0, movedRow)
      onChange(set({_type: 'table', rows: newRows}))
    },
    [rows, onChange],
  )

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
      onChange(set({_type: 'table', rows: newRows}))
    },
    [rows, colCount, onChange],
  )

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent, rowIndex: number, colIndex: number) => {
      if (!editingCell) {
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
            if (e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey) {
              setEditingCell({row: rowIndex, col: colIndex})
            }
        }
        return
      }

      if (e.key === 'Escape') {
        e.preventDefault()
        setEditingCell(null)
        return
      }

      if (e.key === 'Tab') {
        e.preventDefault()

        if (e.shiftKey) {
          if (colIndex > 0) {
            setSelectedCell({row: rowIndex, col: colIndex - 1})
            setEditingCell({row: rowIndex, col: colIndex - 1})
          } else if (rowIndex > 0) {
            setSelectedCell({row: rowIndex - 1, col: colCount - 1})
            setEditingCell({row: rowIndex - 1, col: colCount - 1})
          }
          return
        }

        if (colIndex < colCount - 1) {
          setSelectedCell({row: rowIndex, col: colIndex + 1})
          setEditingCell({row: rowIndex, col: colIndex + 1})
          return
        }

        if (rowIndex < rows.length - 1) {
          setSelectedCell({row: rowIndex + 1, col: 0})
          setEditingCell({row: rowIndex + 1, col: 0})
          return
        }

        const nextRow = rows.length
        handleAddRow()
        setTimeout(() => {
          setSelectedCell({row: nextRow, col: 0})
          setEditingCell({row: nextRow, col: 0})
        }, 0)
        return
      }

      if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
        e.preventDefault()

        if (rowIndex < rows.length - 1) {
          setSelectedCell({row: rowIndex + 1, col: colIndex})
          setEditingCell({row: rowIndex + 1, col: colIndex})
          return
        }

        const nextRow = rows.length
        handleAddRow()
        setTimeout(() => {
          setSelectedCell({row: nextRow, col: colIndex})
          setEditingCell({row: nextRow, col: colIndex})
        }, 0)
      }
    },
    [editingCell, rows.length, colCount, selectedCell, handleCellChange, handleAddRow],
  )

  const clearTable = () => {
    onChange(unset())
    setEditingCell(null)
    setSelectedCell(null)
  }

  if (!value?.rows || rows.length === 0) {
    if (readOnly) {
      return (
        <Card padding={4} radius={2} shadow={1} tone="default">
          <Text size={1} muted>
            No table content
          </Text>
        </Card>
      )
    }

    return (
      <Card padding={4} radius={2} shadow={1} tone="default">
        <Stack space={4}>
          <Text size={1} weight="semibold">
            Insert table
          </Text>
          <Stack space={2}>
            <Text size={1} muted>
              {hoveredSize ? `${hoveredSize.rows} × ${hoveredSize.cols}` : 'Select size'}
            </Text>
            <Box
              style={{
                display: 'grid',
                gridTemplateColumns: `repeat(${PICKER_MAX_COLS}, 20px)`,
                gap: '4px',
                width: 'fit-content',
              }}
              onMouseLeave={() => setHoveredSize(null)}
            >
              {Array.from({length: PICKER_MAX_ROWS * PICKER_MAX_COLS}).map((_, index) => {
                const row = Math.floor(index / PICKER_MAX_COLS) + 1
                const col = (index % PICKER_MAX_COLS) + 1
                const active = Boolean(hoveredSize && row <= hoveredSize.rows && col <= hoveredSize.cols)

                return (
                  <Box
                    key={`size-${row}-${col}`}
                    onMouseEnter={() => setHoveredSize({rows: row, cols: col})}
                    onClick={() => handleInitializeTable(row, col)}
                    style={{
                      width: '20px',
                      height: '20px',
                      border: active ? '1px solid #156dff' : '1px solid #d8d8d8',
                      background: active ? '#dbe9ff' : '#ffffff',
                      cursor: 'pointer',
                    }}
                  />
                )
              })}
            </Box>
          </Stack>
        </Stack>
      </Card>
    )
  }

  return (
    <Card padding={0} radius={2} shadow={1} tone="default" overflow="hidden">
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

      <Box padding={4}>
        <Flex justify="center">
          <Box style={{position: 'relative'}}>
            <Flex style={{marginLeft: '40px', marginBottom: '4px'}}>
              {Array.from({length: colCount}).map((_, colIdx) => (
                <Flex
                  key={`col-control-${colIdx}`}
                  justify="center"
                  align="center"
                  style={{
                    width: '180px',
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
              <Stack space={1} style={{marginRight: '4px', width: '36px'}}>
                {rows.map((_, rowIdx) => (
                  <Flex
                    key={`row-control-${rowIdx}`}
                    justify="center"
                    align="center"
                    style={{
                      minHeight: '56px',
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
                        const isSelected = selectedCell?.row === rowIdx && selectedCell?.col === colIdx
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
                              minWidth: '180px',
                              minHeight: '56px',
                              verticalAlign: 'top',
                            }}
                          >
                            {isEditing ? (
                              <TextArea
                                ref={inputRef}
                                value={cell || ''}
                                onChange={(e) => handleCellChange(rowIdx, colIdx, e.currentTarget.value)}
                                onKeyDown={(e) => handleKeyDown(e, rowIdx, colIdx)}
                                onBlur={() =>
                                  setEditingCell((current) =>
                                    current?.row === rowIdx && current?.col === colIdx ? null : current,
                                  )
                                }
                                style={{
                                  border: 'none',
                                  background: 'transparent',
                                  fontWeight: isHeader ? 600 : 400,
                                  minHeight: '56px',
                                  resize: 'vertical',
                                }}
                                rows={2}
                                fontSize={2}
                              />
                            ) : (
                              <Box
                                padding={3}
                                style={{
                                  minHeight: '56px',
                                  whiteSpace: 'pre-wrap',
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

      <Card padding={3} tone="transparent" borderTop>
        <Flex justify="space-between" align="center">
          <Text size={1} muted>
            {rows.length} rows × {colCount} columns
          </Text>
          <Text size={1} muted>
            Click to edit • Tab to navigate • Enter for newline • Ctrl+Enter moves down
          </Text>
        </Flex>
      </Card>
    </Card>
  )
}
