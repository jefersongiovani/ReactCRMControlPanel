/**
 * Project Name: CRM Control Panel
 * Project Type: React TypeScript Control Panel Application
 * Intended Hosting Type: Static Hosting (Netlify, Vercel, AWS S3)
 * Author: J. Schneider - j.g@live.com
 */

import React, { useState, useRef, useCallback } from 'react';
import {
  Box,
  Typography,
  Button,
  LinearProgress,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Paper,
  Alert,
  Chip,
} from '@mui/material';
import {
  CloudUpload as CloudUploadIcon,
  Delete as DeleteIcon,
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
  InsertDriveFile as FileIcon,
} from '@mui/icons-material';
import { FileUpload as FileUploadType } from '../../types';

interface FileUploadProps {
  accept?: string;
  maxFiles?: number;
  maxSize?: number;
  multiple?: boolean;
  onFilesChange?: (files: FileUploadType[]) => void;
  onUpload?: (files: File[]) => Promise<void>;
  disabled?: boolean;
}

export const FileUpload: React.FC<FileUploadProps> = ({
  accept = 'image/*,.pdf,.csv,.xlsx',
  maxFiles = 10,
  maxSize = 10 * 1024 * 1024, // 10MB
  multiple = true,
  onFilesChange,
  onUpload,
  disabled = false,
}) => {
  const [files, setFiles] = useState<FileUploadType[]>([]);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string>('');
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateFile = (file: File): string | null => {
    if (file.size > maxSize) {
      return `File size exceeds ${formatFileSize(maxSize)}`;
    }
    return null;
  };

  const handleFileSelect = useCallback(
    (selectedFiles: FileList | null) => {
      if (!selectedFiles) return;

      setError('');
      const newFiles: FileUploadType[] = [];
      const errors: string[] = [];

      Array.from(selectedFiles).forEach(file => {
        if (files.length + newFiles.length >= maxFiles) {
          errors.push(`Maximum ${maxFiles} files allowed`);
          return;
        }

        const validationError = validateFile(file);
        if (validationError) {
          errors.push(`${file.name}: ${validationError}`);
          return;
        }

        newFiles.push({
          id: Math.random().toString(36).substr(2, 9),
          file,
          progress: 0,
          status: 'pending',
        });
      });

      if (errors.length > 0) {
        setError(errors.join('; '));
      }

      if (newFiles.length > 0) {
        const updatedFiles = [...files, ...newFiles];
        setFiles(updatedFiles);
        onFilesChange?.(updatedFiles);
      }
    },
    [files, maxFiles, maxSize, onFilesChange]
  );

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    if (!disabled && !uploading) {
      setDragOver(true);
    }
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    if (!disabled && !uploading) {
      handleFileSelect(e.dataTransfer.files);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFileSelect(e.target.files);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const removeFile = (id: string) => {
    const updatedFiles = files.filter(file => file.id !== id);
    setFiles(updatedFiles);
    onFilesChange?.(updatedFiles);
  };

  const handleUpload = async () => {
    if (!onUpload || files.length === 0) return;

    setUploading(true);
    setError('');

    try {
      const filesToUpload = files
        .filter(f => f.status === 'pending')
        .map(f => f.file);

      if (filesToUpload.length === 0) {
        setUploading(false);
        return;
      }

      // Update status to uploading
      setFiles(prev =>
        prev.map(f =>
          f.status === 'pending'
            ? { ...f, status: 'uploading', progress: 0 }
            : f
        )
      );

      // Simulate upload progress
      for (let i = 0; i <= 100; i += 10) {
        await new Promise(resolve => setTimeout(resolve, 100));
        setFiles(prev =>
          prev.map(f => (f.status === 'uploading' ? { ...f, progress: i } : f))
        );
      }

      await onUpload(filesToUpload);

      // Mark as completed
      setFiles(prev =>
        prev.map(f =>
          f.status === 'uploading'
            ? { ...f, status: 'completed', progress: 100 }
            : f
        )
      );
    } catch (err: any) {
      setError(err.message || 'Upload failed');
      setFiles(prev =>
        prev.map(f =>
          f.status === 'uploading'
            ? { ...f, status: 'error', error: err.message }
            : f
        )
      );
    } finally {
      setUploading(false);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getStatusIcon = (status: FileUploadType['status']) => {
    switch (status) {
      case 'completed':
        return <CheckCircleIcon color="success" />;
      case 'error':
        return <ErrorIcon color="error" />;
      default:
        return <FileIcon />;
    }
  };

  const getStatusColor = (status: FileUploadType['status']) => {
    switch (status) {
      case 'completed':
        return 'success';
      case 'error':
        return 'error';
      case 'uploading':
        return 'primary';
      default:
        return 'default';
    }
  };

  return (
    <Box>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Paper
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => !disabled && !uploading && fileInputRef.current?.click()}
        sx={{
          p: 3,
          border: '2px dashed',
          borderColor: dragOver ? 'primary.main' : 'grey.300',
          backgroundColor: dragOver ? 'action.hover' : 'background.paper',
          cursor: disabled || uploading ? 'not-allowed' : 'pointer',
          textAlign: 'center',
          transition: 'all 0.2s ease',
          opacity: disabled || uploading ? 0.6 : 1,
        }}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={handleFileInputChange}
          style={{ display: 'none' }}
          disabled={disabled || uploading}
        />
        <CloudUploadIcon
          sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }}
        />
        <Typography variant="h6" gutterBottom>
          {dragOver
            ? 'Drop files here'
            : 'Drag & drop files here, or click to select'}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Max {maxFiles} files, up to {formatFileSize(maxSize)} each
        </Typography>
        <Typography
          variant="caption"
          color="text.secondary"
          display="block"
          sx={{ mt: 1 }}
        >
          Supported formats: {accept}
        </Typography>
      </Paper>

      {files.length > 0 && (
        <Box sx={{ mt: 3 }}>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              mb: 2,
            }}
          >
            <Typography variant="h6">Files ({files.length})</Typography>
            <Button
              variant="contained"
              onClick={handleUpload}
              disabled={uploading || files.every(f => f.status !== 'pending')}
              startIcon={<CloudUploadIcon />}
            >
              {uploading ? 'Uploading...' : 'Upload Files'}
            </Button>
          </Box>

          <List>
            {files.map(fileUpload => (
              <ListItem key={fileUpload.id} divider>
                <ListItemIcon>{getStatusIcon(fileUpload.status)}</ListItemIcon>
                <ListItemText
                  primary={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography variant="body2">
                        {fileUpload.file.name}
                      </Typography>
                      <Chip
                        label={fileUpload.status}
                        size="small"
                        color={getStatusColor(fileUpload.status) as any}
                      />
                    </Box>
                  }
                  secondary={
                    <Box>
                      <Typography variant="caption" color="text.secondary">
                        {formatFileSize(fileUpload.file.size)}
                      </Typography>
                      {fileUpload.status === 'uploading' && (
                        <LinearProgress
                          variant="determinate"
                          value={fileUpload.progress}
                          sx={{ mt: 1 }}
                        />
                      )}
                      {fileUpload.error && (
                        <Typography
                          variant="caption"
                          color="error"
                          display="block"
                        >
                          {fileUpload.error}
                        </Typography>
                      )}
                    </Box>
                  }
                />
                <ListItemSecondaryAction>
                  <IconButton
                    edge="end"
                    onClick={() => removeFile(fileUpload.id)}
                    disabled={uploading}
                  >
                    <DeleteIcon />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
            ))}
          </List>
        </Box>
      )}
    </Box>
  );
};
