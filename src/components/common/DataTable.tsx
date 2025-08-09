/**
 * Project Name: CRM Control Panel
 * Project Type: React TypeScript Control Panel Application
 * Intended Hosting Type: Static Hosting (Netlify, Vercel, AWS S3)
 * Author: J. Schneider - j.g@live.com
 */

import React, { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  TableSortLabel,
  Checkbox,
  Paper,
  Box,
  IconButton,
  Menu,
  MenuItem,
  Typography,
  Toolbar,
  alpha,
} from '@mui/material';
import {
  MoreVert as MoreVertIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';
import { TableColumn, TableSort } from '@/types';

interface DataTableProps<T> {
  data: T[];
  columns: TableColumn<T>[];
  totalCount: number;
  page: number;
  rowsPerPage: number;
  loading?: boolean;
  selectable?: boolean;
  sortable?: boolean;
  onPageChange: (page: number) => void;
  onRowsPerPageChange: (rowsPerPage: number) => void;
  onSortChange?: (sort: TableSort) => void;
  onSelectionChange?: (selectedIds: string[]) => void;
  onRowAction?: (action: string, row: T) => void;
  getRowId: (row: T) => string;
  rowActions?: Array<{
    label: string;
    action: string;
    icon?: React.ReactNode;
    color?: 'primary' | 'secondary' | 'error' | 'warning';
  }>;
}

export const DataTable = <T extends Record<string, any>>({
  data,
  columns,
  totalCount,
  page,
  rowsPerPage,
  loading: _loading = false,
  selectable = false,
  sortable = true,
  onPageChange,
  onRowsPerPageChange,
  onSortChange,
  onSelectionChange,
  onRowAction,
  getRowId,
  rowActions = [],
}: DataTableProps<T>) => {
  const [selected, setSelected] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<string>('');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [menuRowId, setMenuRowId] = useState<string>('');

  const handleSelectAll = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const newSelected = data.map(getRowId);
      setSelected(newSelected);
      onSelectionChange?.(newSelected);
    } else {
      setSelected([]);
      onSelectionChange?.([]);
    }
  };

  const handleSelectRow = (id: string) => {
    const selectedIndex = selected.indexOf(id);
    let newSelected: string[] = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }

    setSelected(newSelected);
    onSelectionChange?.(newSelected);
  };

  const handleSort = (columnId: string) => {
    if (!sortable || !onSortChange) return;

    const isAsc = sortBy === columnId && sortOrder === 'asc';
    const newOrder = isAsc ? 'desc' : 'asc';
    setSortBy(columnId);
    setSortOrder(newOrder);
    onSortChange({ field: columnId, direction: newOrder });
  };

  const handleMenuOpen = (
    event: React.MouseEvent<HTMLElement>,
    rowId: string
  ) => {
    setAnchorEl(event.currentTarget);
    setMenuRowId(rowId);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setMenuRowId('');
  };

  const handleAction = (action: string) => {
    const row = data.find(item => getRowId(item) === menuRowId);
    if (row && onRowAction) {
      onRowAction(action, row);
    }
    handleMenuClose();
  };

  const isSelected = (id: string) => selected.indexOf(id) !== -1;
  const numSelected = selected.length;
  const rowCount = data.length;

  return (
    <Paper sx={{ width: '100%', mb: 2 }}>
      {selectable && numSelected > 0 && (
        <Toolbar
          sx={{
            pl: { sm: 2 },
            pr: { xs: 1, sm: 1 },
            ...(numSelected > 0 && {
              bgcolor: theme =>
                alpha(
                  theme.palette.primary.main,
                  theme.palette.action.activatedOpacity
                ),
            }),
          }}
        >
          <Typography
            sx={{ flex: '1 1 100%' }}
            color="inherit"
            variant="subtitle1"
            component="div"
          >
            {numSelected} selected
          </Typography>
          <IconButton onClick={() => onRowAction?.('delete', selected as any)}>
            <DeleteIcon />
          </IconButton>
        </Toolbar>
      )}

      <TableContainer>
        <Table sx={{ minWidth: 750 }} aria-labelledby="tableTitle">
          <TableHead>
            <TableRow>
              {selectable && (
                <TableCell padding="checkbox">
                  <Checkbox
                    color="primary"
                    indeterminate={numSelected > 0 && numSelected < rowCount}
                    checked={rowCount > 0 && numSelected === rowCount}
                    onChange={handleSelectAll}
                    inputProps={{
                      'aria-label': 'select all items',
                    }}
                  />
                </TableCell>
              )}
              {columns.map(column => (
                <TableCell
                  key={String(column.id)}
                  sortDirection={sortBy === column.id ? sortOrder : false}
                  sx={{ width: column.width }}
                >
                  {sortable && column.sortable !== false ? (
                    <TableSortLabel
                      active={sortBy === column.id}
                      direction={sortBy === column.id ? sortOrder : 'asc'}
                      onClick={() => handleSort(String(column.id))}
                    >
                      {column.label}
                    </TableSortLabel>
                  ) : (
                    column.label
                  )}
                </TableCell>
              ))}
              {rowActions.length > 0 && (
                <TableCell align="right">Actions</TableCell>
              )}
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map(row => {
              const rowId = getRowId(row);
              const isItemSelected = isSelected(rowId);

              return (
                <TableRow
                  hover
                  role="checkbox"
                  aria-checked={isItemSelected}
                  tabIndex={-1}
                  key={rowId}
                  selected={isItemSelected}
                >
                  {selectable && (
                    <TableCell padding="checkbox">
                      <Checkbox
                        color="primary"
                        checked={isItemSelected}
                        onChange={() => handleSelectRow(rowId)}
                        inputProps={{
                          'aria-labelledby': `enhanced-table-checkbox-${rowId}`,
                        }}
                      />
                    </TableCell>
                  )}
                  {columns.map(column => (
                    <TableCell key={String(column.id)}>
                      {column.render
                        ? column.render(row[column.id], row)
                        : row[column.id]}
                    </TableCell>
                  ))}
                  {rowActions.length > 0 && (
                    <TableCell align="right">
                      <IconButton
                        onClick={event => handleMenuOpen(event, rowId)}
                        size="small"
                      >
                        <MoreVertIcon />
                      </IconButton>
                    </TableCell>
                  )}
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        rowsPerPageOptions={[5, 10, 25, 50]}
        component="div"
        count={totalCount}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={(_, newPage) => onPageChange(newPage)}
        onRowsPerPageChange={event =>
          onRowsPerPageChange(parseInt(event.target.value, 10))
        }
      />

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        {rowActions.map(action => (
          <MenuItem
            key={action.action}
            onClick={() => handleAction(action.action)}
          >
            {action.icon && <Box sx={{ mr: 1 }}>{action.icon}</Box>}
            {action.label}
          </MenuItem>
        ))}
      </Menu>
    </Paper>
  );
};
