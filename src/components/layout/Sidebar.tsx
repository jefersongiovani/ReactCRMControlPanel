/**
 * Project Name: CRM Control Panel
 * Project Type: React TypeScript Control Panel Application
 * Intended Hosting Type: Static Hosting (Netlify, Vercel, AWS S3)
 * Author: J. Schneider - j.g@live.com
 */

import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
  Divider,
  Chip,
} from '@mui/material';
import {
  Dashboard,
  People,
  Settings,
  Assessment,
  CloudUpload,
  Notifications,
  Security,
  Business,
} from '@mui/icons-material';
import { usePermissions } from '../common/ProtectedRoute';
import { UserRole } from '../../types';

interface NavigationItem {
  id: string;
  label: string;
  path: string;
  icon: React.ReactElement;
  requiredRoles?: UserRole[];
  badge?: string;
}

const navigationItems: NavigationItem[] = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    path: '/dashboard',
    icon: <Dashboard />,
  },
  {
    id: 'users',
    label: 'User Management',
    path: '/users',
    icon: <People />,
    requiredRoles: [UserRole.ADMIN, UserRole.MANAGER],
  },
  {
    id: 'reports',
    label: 'Reports',
    path: '/reports',
    icon: <Assessment />,
    requiredRoles: [UserRole.ADMIN, UserRole.MANAGER],
  },
  {
    id: 'files',
    label: 'File Manager',
    path: '/files',
    icon: <CloudUpload />,
  },
  {
    id: 'notifications',
    label: 'Notifications',
    path: '/notifications',
    icon: <Notifications />,
    badge: '3',
  },
  {
    id: 'company',
    label: 'Company Settings',
    path: '/company',
    icon: <Business />,
    requiredRoles: [UserRole.ADMIN],
  },
  {
    id: 'security',
    label: 'Security',
    path: '/security',
    icon: <Security />,
    requiredRoles: [UserRole.ADMIN],
  },
  {
    id: 'settings',
    label: 'Settings',
    path: '/settings',
    icon: <Settings />,
  },
];

interface SidebarProps {
  onItemClick?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ onItemClick }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { hasAnyRole } = usePermissions();

  const handleNavigation = (path: string) => {
    navigate(path);
    onItemClick?.();
  };

  const isActive = (path: string) => {
    return (
      location.pathname === path || location.pathname.startsWith(`${path}/`)
    );
  };

  const filteredItems = navigationItems.filter(item => {
    if (!item.requiredRoles || item.requiredRoles.length === 0) {
      return true;
    }
    return hasAnyRole(item.requiredRoles);
  });

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Logo/Brand */}
      <Toolbar>
        <Typography
          variant="h6"
          noWrap
          component="div"
          sx={{ fontWeight: 'bold' }}
        >
          CRM Panel
        </Typography>
      </Toolbar>

      <Divider />

      {/* Navigation Items */}
      <Box sx={{ flexGrow: 1, overflow: 'auto' }}>
        <List>
          {filteredItems.map(item => (
            <ListItem key={item.id} disablePadding>
              <ListItemButton
                selected={isActive(item.path)}
                onClick={() => handleNavigation(item.path)}
                sx={{
                  mx: 1,
                  borderRadius: 1,
                  '&.Mui-selected': {
                    backgroundColor: 'primary.main',
                    color: 'primary.contrastText',
                    '&:hover': {
                      backgroundColor: 'primary.dark',
                    },
                    '& .MuiListItemIcon-root': {
                      color: 'primary.contrastText',
                    },
                  },
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 40,
                    color: isActive(item.path) ? 'inherit' : 'text.secondary',
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                <ListItemText
                  primary={item.label}
                  primaryTypographyProps={{
                    fontSize: '0.875rem',
                    fontWeight: isActive(item.path) ? 600 : 400,
                  }}
                />
                {item.badge && (
                  <Chip
                    label={item.badge}
                    size="small"
                    color="error"
                    sx={{
                      height: 20,
                      fontSize: '0.75rem',
                      fontWeight: 'bold',
                    }}
                  />
                )}
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Box>

      {/* Footer */}
      <Box sx={{ p: 2, borderTop: 1, borderColor: 'divider' }}>
        <Typography
          variant="caption"
          color="text.secondary"
          align="center"
          display="block"
        >
          Version 1.0.0
        </Typography>
      </Box>
    </Box>
  );
};
