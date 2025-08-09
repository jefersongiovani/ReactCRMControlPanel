/**
 * Project Name: CRM Control Panel
 * Project Type: React TypeScript Control Panel Application
 * Intended Hosting Type: Static Hosting (Netlify, Vercel, AWS S3)
 * Author: J. Schneider - j.g@live.com
 */

import React from 'react';
import {
  Box,
  CircularProgress,
  Typography,
  Skeleton,
  Card,
  CardContent,
  Grid,
} from '@mui/material';

interface LoadingSpinnerProps {
  size?: number;
  message?: string;
  fullScreen?: boolean;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 40,
  message = 'Loading...',
  fullScreen = false,
}) => {
  const content = (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      gap={2}
    >
      <CircularProgress size={size} />
      {message && (
        <Typography variant="body2" color="text.secondary">
          {message}
        </Typography>
      )}
    </Box>
  );

  if (fullScreen) {
    return (
      <Box
        sx={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: 'rgba(255, 255, 255, 0.8)',
          zIndex: 9999,
        }}
      >
        {content}
      </Box>
    );
  }

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 200,
        width: '100%',
      }}
    >
      {content}
    </Box>
  );
};

// Skeleton loaders for different components
export const TableSkeleton: React.FC<{ rows?: number; columns?: number }> = ({
  rows = 5,
  columns = 4,
}) => (
  <Box>
    {Array.from({ length: rows }).map((_, rowIndex) => (
      <Box key={rowIndex} sx={{ display: 'flex', gap: 2, mb: 1 }}>
        {Array.from({ length: columns }).map((_, colIndex) => (
          <Skeleton
            key={colIndex}
            variant="text"
            width={`${100 / columns}%`}
            height={40}
          />
        ))}
      </Box>
    ))}
  </Box>
);

export const CardSkeleton: React.FC<{ count?: number }> = ({ count = 4 }) => (
  <Grid container spacing={3}>
    {Array.from({ length: count }).map((_, index) => (
      <Grid size={{ xs: 12, sm: 6, md: 3 }} key={index}>
        <Card>
          <CardContent>
            <Skeleton variant="text" width="60%" height={32} />
            <Skeleton variant="text" width="40%" height={24} sx={{ mt: 1 }} />
            <Skeleton
              variant="rectangular"
              width="100%"
              height={60}
              sx={{ mt: 2 }}
            />
          </CardContent>
        </Card>
      </Grid>
    ))}
  </Grid>
);

export const DashboardSkeleton: React.FC = () => (
  <Box>
    {/* Header skeleton */}
    <Box sx={{ mb: 4 }}>
      <Skeleton variant="text" width="40%" height={48} />
      <Skeleton variant="text" width="60%" height={24} sx={{ mt: 1 }} />
    </Box>

    {/* Metrics cards skeleton */}
    <CardSkeleton count={4} />

    {/* Charts skeleton */}
    <Grid container spacing={3} sx={{ mt: 4 }}>
      <Grid size={{ xs: 12, md: 8 }}>
        <Card>
          <CardContent>
            <Skeleton variant="text" width="30%" height={32} />
            <Skeleton
              variant="rectangular"
              width="100%"
              height={300}
              sx={{ mt: 2 }}
            />
          </CardContent>
        </Card>
      </Grid>
      <Grid size={{ xs: 12, md: 4 }}>
        <Card>
          <CardContent>
            <Skeleton variant="text" width="40%" height={32} />
            <TableSkeleton rows={5} columns={2} />
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  </Box>
);

export const UserManagementSkeleton: React.FC = () => (
  <Box>
    {/* Header skeleton */}
    <Box
      sx={{
        mb: 3,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}
    >
      <Skeleton variant="text" width="30%" height={48} />
      <Box sx={{ display: 'flex', gap: 1 }}>
        <Skeleton variant="rectangular" width={100} height={36} />
        <Skeleton variant="rectangular" width={100} height={36} />
        <Skeleton variant="rectangular" width={120} height={36} />
      </Box>
    </Box>

    {/* Filters skeleton */}
    <Box sx={{ mb: 3, display: 'flex', gap: 2 }}>
      <Skeleton variant="rectangular" width={200} height={40} />
      <Skeleton variant="rectangular" width={120} height={40} />
      <Skeleton variant="rectangular" width={120} height={40} />
    </Box>

    {/* Table skeleton */}
    <Card>
      <CardContent sx={{ p: 0 }}>
        <TableSkeleton rows={10} columns={5} />
      </CardContent>
    </Card>
  </Box>
);

export const FileManagerSkeleton: React.FC = () => (
  <Box>
    {/* Header skeleton */}
    <Box
      sx={{
        mb: 3,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}
    >
      <Skeleton variant="text" width="25%" height={48} />
      <Skeleton variant="rectangular" width={140} height={36} />
    </Box>

    {/* Search skeleton */}
    <Skeleton variant="rectangular" width="100%" height={56} sx={{ mb: 3 }} />

    {/* File grid skeleton */}
    <Grid container spacing={2}>
      {Array.from({ length: 8 }).map((_, index) => (
        <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={index}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Skeleton
                variant="circular"
                width={40}
                height={40}
                sx={{ mx: 'auto', mb: 2 }}
              />
              <Skeleton
                variant="text"
                width="80%"
                height={24}
                sx={{ mx: 'auto' }}
              />
              <Skeleton
                variant="text"
                width="60%"
                height={20}
                sx={{ mx: 'auto', mt: 1 }}
              />
              <Skeleton
                variant="text"
                width="40%"
                height={16}
                sx={{ mx: 'auto', mt: 1 }}
              />
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  </Box>
);

// Loading overlay for forms and modals
export const LoadingOverlay: React.FC<{
  loading: boolean;
  children: React.ReactNode;
}> = ({ loading, children }) => (
  <Box sx={{ position: 'relative' }}>
    {children}
    {loading && (
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: 'rgba(255, 255, 255, 0.8)',
          zIndex: 1,
        }}
      >
        <CircularProgress />
      </Box>
    )}
  </Box>
);
