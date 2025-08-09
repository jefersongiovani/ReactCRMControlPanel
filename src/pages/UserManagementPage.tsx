/**
 * Project Name: CRM Control Panel
 * Project Type: React TypeScript Control Panel Application
 * Intended Hosting Type: Static Hosting (Netlify, Vercel, AWS S3)
 * Author: J. Schneider - j.g@live.com
 */

import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Avatar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  Snackbar,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Block as BlockIcon,
  CheckCircle as CheckCircleIcon,
  Download as DownloadIcon,
  Upload as UploadIcon,
} from '@mui/icons-material';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { DataTable } from '@/components/common/DataTable';
import { User, UserRole, TableColumn } from '@/types';
import { userService, UserFilters } from '@/services/userService';

export const UserManagementPage: React.FC = () => {
  const queryClient = useQueryClient();
  const [filters, setFilters] = useState<UserFilters>({
    page: 0,
    limit: 10,
    search: '',
    role: undefined,
    isActive: undefined,
    sortBy: 'createdAt',
    sortOrder: 'desc',
  });
  const [, setSelectedUsers] = useState<string[]>([]);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error' | 'warning' | 'info';
  }>({
    open: false,
    message: '',
    severity: 'success',
  });

  // Fetch users query
  const { data: usersData, isLoading } = useQuery({
    queryKey: ['users', filters],
    queryFn: () => userService.getUsers(filters),
  });

  // Delete user mutation
  const deleteUserMutation = useMutation({
    mutationFn: userService.deleteUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      setSnackbar({
        open: true,
        message: 'User deleted successfully',
        severity: 'success',
      });
      setDeleteDialogOpen(false);
      setUserToDelete(null);
    },
    onError: () => {
      setSnackbar({
        open: true,
        message: 'Failed to delete user',
        severity: 'error',
      });
    },
  });

  // Toggle user status mutation
  const toggleStatusMutation = useMutation({
    mutationFn: userService.toggleUserStatus,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      setSnackbar({
        open: true,
        message: 'User status updated successfully',
        severity: 'success',
      });
    },
    onError: () => {
      setSnackbar({
        open: true,
        message: 'Failed to update user status',
        severity: 'error',
      });
    },
  });

  const columns: TableColumn<User>[] = [
    {
      id: 'avatar',
      label: '',
      sortable: false,
      width: 60,
      render: (_, user) => (
        <Avatar
          {...(user.avatar ? { src: user.avatar } : {})}
          sx={{ width: 40, height: 40 }}
        >
          {user.firstName[0]}
          {user.lastName[0]}
        </Avatar>
      ),
    },
    {
      id: 'firstName',
      label: 'Name',
      render: (_, user) => (
        <Box>
          <Typography variant="body2" fontWeight="medium">
            {user.firstName} {user.lastName}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {user.email}
          </Typography>
        </Box>
      ),
    },
    {
      id: 'role',
      label: 'Role',
      render: role => (
        <Chip
          label={role}
          size="small"
          color={
            role === UserRole.ADMIN
              ? 'error'
              : role === UserRole.MANAGER
              ? 'warning'
              : 'default'
          }
        />
      ),
    },
    {
      id: 'isActive',
      label: 'Status',
      render: isActive => (
        <Chip
          label={isActive ? 'Active' : 'Inactive'}
          size="small"
          color={isActive ? 'success' : 'default'}
          icon={isActive ? <CheckCircleIcon /> : <BlockIcon />}
        />
      ),
    },
    {
      id: 'createdAt',
      label: 'Created',
      render: createdAt =>
        createdAt ? new Date(createdAt as string).toLocaleDateString() : '',
    },
  ];

  const rowActions = [
    {
      label: 'Edit',
      action: 'edit',
      icon: <EditIcon fontSize="small" />,
    },
    {
      label: 'Toggle Status',
      action: 'toggle-status',
      icon: <BlockIcon fontSize="small" />,
    },
    {
      label: 'Delete',
      action: 'delete',
      icon: <DeleteIcon fontSize="small" />,
      color: 'error' as const,
    },
  ];

  const handlePageChange = (newPage: number) => {
    setFilters(prev => ({ ...prev, page: newPage }));
  };

  const handleRowsPerPageChange = (newRowsPerPage: number) => {
    setFilters(prev => ({ ...prev, limit: newRowsPerPage, page: 0 }));
  };

  const handleSortChange = (sort: {
    field: string;
    direction: 'asc' | 'desc';
  }) => {
    setFilters(prev => ({
      ...prev,
      sortBy: sort.field,
      sortOrder: sort.direction,
    }));
  };

  const handleRowAction = (action: string, row: User | string[]) => {
    if (Array.isArray(row)) {
      // Bulk action
      return;
    }

    switch (action) {
      case 'edit':
        // TODO: Open edit dialog
        break;
      case 'delete':
        setUserToDelete(row);
        setDeleteDialogOpen(true);
        break;
      case 'toggle-status':
        toggleStatusMutation.mutate(row.id);
        break;
    }
  };

  const handleDeleteConfirm = () => {
    if (userToDelete) {
      deleteUserMutation.mutate(userToDelete.id);
    }
  };

  const handleFilterChange = (field: keyof UserFilters, value: any) => {
    setFilters(prev => ({ ...prev, [field]: value, page: 0 }));
  };

  return (
    <Box>
      {/* Header */}
      <Box
        sx={{
          mb: 3,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Typography variant="h4">User Management</Typography>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button variant="outlined" startIcon={<UploadIcon />} size="small">
            Import
          </Button>
          <Button variant="outlined" startIcon={<DownloadIcon />} size="small">
            Export
          </Button>
          <Button variant="contained" startIcon={<AddIcon />}>
            Add User
          </Button>
        </Box>
      </Box>

      {/* Filters */}
      <Box sx={{ mb: 3, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
        <TextField
          label="Search"
          variant="outlined"
          size="small"
          value={filters.search}
          onChange={e => handleFilterChange('search', e.target.value)}
          sx={{ minWidth: 200 }}
        />
        <FormControl size="small" sx={{ minWidth: 120 }}>
          <InputLabel>Role</InputLabel>
          <Select
            value={filters.role || ''}
            label="Role"
            onChange={e => handleFilterChange('role', e.target.value)}
          >
            <MenuItem value="">All</MenuItem>
            <MenuItem value={UserRole.ADMIN}>Admin</MenuItem>
            <MenuItem value={UserRole.MANAGER}>Manager</MenuItem>
            <MenuItem value={UserRole.USER}>User</MenuItem>
          </Select>
        </FormControl>
        <FormControl size="small" sx={{ minWidth: 120 }}>
          <InputLabel>Status</InputLabel>
          <Select
            value={
              filters.isActive === undefined ? '' : filters.isActive.toString()
            }
            label="Status"
            onChange={e =>
              handleFilterChange(
                'isActive',
                e.target.value === '' ? undefined : e.target.value === 'true'
              )
            }
          >
            <MenuItem value="">All</MenuItem>
            <MenuItem value="true">Active</MenuItem>
            <MenuItem value="false">Inactive</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {/* Data Table */}
      <DataTable
        data={usersData?.data || []}
        columns={columns}
        totalCount={usersData?.pagination.total || 0}
        page={filters.page || 0}
        rowsPerPage={filters.limit || 10}
        loading={isLoading}
        selectable
        onPageChange={handlePageChange}
        onRowsPerPageChange={handleRowsPerPageChange}
        onSortChange={handleSortChange}
        onSelectionChange={setSelectedUsers}
        onRowAction={handleRowAction}
        getRowId={user => user.id}
        rowActions={rowActions}
      />

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete user &quot;{userToDelete?.firstName}{' '}
            {userToDelete?.lastName}&quot;? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button
            onClick={handleDeleteConfirm}
            color="error"
            variant="contained"
            disabled={deleteUserMutation.isPending}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
      >
        <Alert
          onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};
