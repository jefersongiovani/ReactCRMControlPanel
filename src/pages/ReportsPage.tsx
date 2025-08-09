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
  Grid,
  Card,
  CardContent,
  CardHeader,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  LinearProgress,
} from '@mui/material';
import {
  Download as DownloadIcon,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  Assessment as AssessmentIcon,
} from '@mui/icons-material';
import { usePermissions } from '@/components/common/ProtectedRoute';

interface ReportData {
  id: string;
  name: string;
  value: number;
  change: number;
  changeType: 'increase' | 'decrease';
  period: string;
}

interface ChartDataPoint {
  label: string;
  value: number;
  color?: string;
}

const mockReportData: ReportData[] = [
  {
    id: 'users',
    name: 'Total Users',
    value: 1234,
    change: 12.5,
    changeType: 'increase',
    period: 'vs last month',
  },
  {
    id: 'revenue',
    name: 'Monthly Revenue',
    value: 45678,
    change: 8.3,
    changeType: 'increase',
    period: 'vs last month',
  },
  {
    id: 'orders',
    name: 'Total Orders',
    value: 892,
    change: -3.2,
    changeType: 'decrease',
    period: 'vs last month',
  },
  {
    id: 'conversion',
    name: 'Conversion Rate',
    value: 3.45,
    change: 0.8,
    changeType: 'increase',
    period: 'vs last month',
  },
];

const mockChartData: ChartDataPoint[] = [
  { label: 'Jan', value: 65, color: '#1976d2' },
  { label: 'Feb', value: 78, color: '#1976d2' },
  { label: 'Mar', value: 52, color: '#1976d2' },
  { label: 'Apr', value: 91, color: '#1976d2' },
  { label: 'May', value: 87, color: '#1976d2' },
  { label: 'Jun', value: 95, color: '#1976d2' },
];

const mockTopPerformers = [
  { id: 1, name: 'Product A', sales: 1250, growth: 15.2 },
  { id: 2, name: 'Product B', sales: 980, growth: 8.7 },
  { id: 3, name: 'Product C', sales: 756, growth: -2.1 },
  { id: 4, name: 'Product D', sales: 642, growth: 12.4 },
  { id: 5, name: 'Product E', sales: 534, growth: 5.8 },
];

export const ReportsPage: React.FC = () => {
  const { canViewReports } = usePermissions();
  const [dateRange, setDateRange] = useState('30d');
  const [reportType, setReportType] = useState('overview');

  if (!canViewReports()) {
    return (
      <Box sx={{ textAlign: 'center', py: 8 }}>
        <AssessmentIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
        <Typography variant="h5" gutterBottom>
          Access Denied
        </Typography>
        <Typography variant="body1" color="text.secondary">
          You don&apos;t have permission to view reports.
        </Typography>
      </Box>
    );
  }

  const formatValue = (value: number, type: string) => {
    switch (type) {
      case 'revenue':
        return `$${value.toLocaleString()}`;
      case 'conversion':
        return `${value}%`;
      default:
        return value.toLocaleString();
    }
  };

  const SimpleBarChart: React.FC<{ data: ChartDataPoint[] }> = ({ data }) => {
    const maxValue = Math.max(...data.map(d => d.value));

    return (
      <Box sx={{ p: 2 }}>
        {data.map((point, index) => (
          <Box key={index} sx={{ mb: 2 }}>
            <Box
              sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}
            >
              <Typography variant="body2">{point.label}</Typography>
              <Typography variant="body2" fontWeight="bold">
                {point.value}
              </Typography>
            </Box>
            <LinearProgress
              variant="determinate"
              value={(point.value / maxValue) * 100}
              sx={{
                height: 8,
                borderRadius: 4,
                backgroundColor: 'grey.200',
                '& .MuiLinearProgress-bar': {
                  backgroundColor: point.color || 'primary.main',
                  borderRadius: 4,
                },
              }}
            />
          </Box>
        ))}
      </Box>
    );
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
        <Typography variant="h4">Reports & Analytics</Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel>Date Range</InputLabel>
            <Select
              value={dateRange}
              label="Date Range"
              onChange={e => setDateRange(e.target.value)}
            >
              <MenuItem value="7d">Last 7 days</MenuItem>
              <MenuItem value="30d">Last 30 days</MenuItem>
              <MenuItem value="90d">Last 90 days</MenuItem>
              <MenuItem value="1y">Last year</MenuItem>
            </Select>
          </FormControl>
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel>Report Type</InputLabel>
            <Select
              value={reportType}
              label="Report Type"
              onChange={e => setReportType(e.target.value)}
            >
              <MenuItem value="overview">Overview</MenuItem>
              <MenuItem value="sales">Sales</MenuItem>
              <MenuItem value="users">Users</MenuItem>
              <MenuItem value="performance">Performance</MenuItem>
            </Select>
          </FormControl>
          <Button variant="outlined" startIcon={<DownloadIcon />}>
            Export
          </Button>
        </Box>
      </Box>

      {/* Key Metrics */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {mockReportData.map(metric => (
          <Grid size={{ xs: 12, sm: 6, md: 3 }} key={metric.id}>
            <Card>
              <CardContent>
                <Typography variant="h4" component="div" gutterBottom>
                  {formatValue(metric.value, metric.id)}
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  {metric.name}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  {metric.changeType === 'increase' ? (
                    <TrendingUpIcon color="success" fontSize="small" />
                  ) : (
                    <TrendingDownIcon color="error" fontSize="small" />
                  )}
                  <Chip
                    label={`${metric.change > 0 ? '+' : ''}${metric.change}%`}
                    size="small"
                    color={
                      metric.changeType === 'increase' ? 'success' : 'error'
                    }
                  />
                  <Typography variant="caption" color="text.secondary">
                    {metric.period}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={3}>
        {/* Chart */}
        <Grid size={{ xs: 12, md: 8 }}>
          <Card>
            <CardHeader title="Monthly Trends" />
            <CardContent>
              <SimpleBarChart data={mockChartData} />
            </CardContent>
          </Card>
        </Grid>

        {/* Top Performers */}
        <Grid size={{ xs: 12, md: 4 }}>
          <Card>
            <CardHeader title="Top Performers" />
            <CardContent sx={{ p: 0 }}>
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Product</TableCell>
                      <TableCell align="right">Sales</TableCell>
                      <TableCell align="right">Growth</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {mockTopPerformers.map(item => (
                      <TableRow key={item.id}>
                        <TableCell>{item.name}</TableCell>
                        <TableCell align="right">
                          {item.sales.toLocaleString()}
                        </TableCell>
                        <TableCell align="right">
                          <Chip
                            label={`${item.growth > 0 ? '+' : ''}${
                              item.growth
                            }%`}
                            size="small"
                            color={item.growth > 0 ? 'success' : 'error'}
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* Recent Activity */}
        <Grid size={{ xs: 12 }}>
          <Card>
            <CardHeader title="Recent Activity" />
            <CardContent>
              <Typography variant="body2" color="text.secondary">
                Activity data will be displayed here when connected to the
                backend.
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};
