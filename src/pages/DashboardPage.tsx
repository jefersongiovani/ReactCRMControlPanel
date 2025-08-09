/**
 * Project Name: CRM Control Panel
 * Project Type: React TypeScript Control Panel Application
 * Intended Hosting Type: Static Hosting (Netlify, Vercel, AWS S3)
 * Author: J. Schneider - j.g@live.com
 */

import React from 'react';
import {
  Box,
  Grid,
  Paper,
  Typography,
  Card,
  CardContent,
  Avatar,
  Chip,
} from '@mui/material';
import {
  TrendingUp,
  People,
  Assessment,
  Notifications,
} from '@mui/icons-material';
import { useAuth } from '@/store/AuthContext';
import { DashboardMetric } from '@/types';

const mockMetrics: DashboardMetric[] = [
  {
    id: 'users',
    title: 'Total Users',
    value: '1,234',
    change: 12,
    changeType: 'increase',
    icon: People,
  },
  {
    id: 'revenue',
    title: 'Monthly Revenue',
    value: '$45,678',
    change: 8,
    changeType: 'increase',
    icon: TrendingUp,
  },
  {
    id: 'reports',
    title: 'Reports Generated',
    value: '89',
    change: -3,
    changeType: 'decrease',
    icon: Assessment,
  },
  {
    id: 'notifications',
    title: 'Active Notifications',
    value: '23',
    change: 5,
    changeType: 'increase',
    icon: Notifications,
  },
];

export const DashboardPage: React.FC = () => {
  const { user } = useAuth();

  return (
    <Box>
      {/* Welcome Section */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          Welcome back, {user?.firstName}!
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Here's what's happening with your business today.
        </Typography>
      </Box>

      {/* Metrics Grid */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {mockMetrics.map((metric) => (
          <Grid item xs={12} sm={6} md={3} key={metric.id}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Avatar
                    sx={{
                      backgroundColor: 'primary.main',
                      mr: 2,
                      width: 48,
                      height: 48,
                    }}
                  >
                    <metric.icon />
                  </Avatar>
                  <Box>
                    <Typography variant="h4" component="div">
                      {metric.value}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {metric.title}
                    </Typography>
                  </Box>
                </Box>
                {metric.change !== undefined && (
                  <Chip
                    label={`${metric.change > 0 ? '+' : ''}${metric.change}%`}
                    color={metric.changeType === 'increase' ? 'success' : 'error'}
                    size="small"
                  />
                )}
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Recent Activity */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Recent Activity
            </Typography>
            <Box sx={{ mt: 2 }}>
              <Typography variant="body2" color="text.secondary">
                No recent activity to display.
              </Typography>
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Quick Actions
            </Typography>
            <Box sx={{ mt: 2 }}>
              <Typography variant="body2" color="text.secondary">
                Quick action buttons will be available here.
              </Typography>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};
