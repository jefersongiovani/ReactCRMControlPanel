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
  Grid,
  Card,
  CardContent,
  CardActions,
  IconButton,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip,
  Avatar,
  TextField,
  InputAdornment,
} from '@mui/material';
import {
  CloudUpload as CloudUploadIcon,
  MoreVert as MoreVertIcon,
  Download as DownloadIcon,
  Delete as DeleteIcon,
  Share as ShareIcon,
  Search as SearchIcon,
  Folder as FolderIcon,
  InsertDriveFile as FileIcon,
  Image as ImageIcon,
  PictureAsPdf as PdfIcon,
  TableChart as ExcelIcon,
} from '@mui/icons-material';
import { FileUpload } from '@/components/common/FileUpload';
import { useNotification } from '@/store/NotificationContext';

interface FileItem {
  id: string;
  name: string;
  type: 'file' | 'folder';
  size?: number;
  mimeType?: string;
  createdAt: string;
  updatedAt: string;
  owner: string;
  shared: boolean;
  url?: string;
}

const mockFiles: FileItem[] = [
  {
    id: '1',
    name: 'Documents',
    type: 'folder',
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z',
    owner: 'John Doe',
    shared: false,
  },
  {
    id: '2',
    name: 'Images',
    type: 'folder',
    createdAt: '2024-01-14T09:00:00Z',
    updatedAt: '2024-01-14T09:00:00Z',
    owner: 'Jane Smith',
    shared: true,
  },
  {
    id: '3',
    name: 'report.pdf',
    type: 'file',
    size: 2048576,
    mimeType: 'application/pdf',
    createdAt: '2024-01-13T14:30:00Z',
    updatedAt: '2024-01-13T14:30:00Z',
    owner: 'John Doe',
    shared: false,
    url: '/files/report.pdf',
  },
  {
    id: '4',
    name: 'data.xlsx',
    type: 'file',
    size: 1024000,
    mimeType:
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    createdAt: '2024-01-12T11:15:00Z',
    updatedAt: '2024-01-12T11:15:00Z',
    owner: 'Jane Smith',
    shared: true,
    url: '/files/data.xlsx',
  },
  {
    id: '5',
    name: 'presentation.png',
    type: 'file',
    size: 512000,
    mimeType: 'image/png',
    createdAt: '2024-01-11T16:45:00Z',
    updatedAt: '2024-01-11T16:45:00Z',
    owner: 'John Doe',
    shared: false,
    url: '/files/presentation.png',
  },
];

export const FileManagerPage: React.FC = () => {
  const { showSuccess, showError } = useNotification();
  const [files, setFiles] = useState<FileItem[]>(mockFiles);
  const [searchTerm, setSearchTerm] = useState('');
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<FileItem | null>(null);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = (file: FileItem) => {
    if (file.type === 'folder') {
      return <FolderIcon sx={{ fontSize: 40, color: 'primary.main' }} />;
    }

    switch (file.mimeType) {
      case 'application/pdf':
        return <PdfIcon sx={{ fontSize: 40, color: 'error.main' }} />;
      case 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet':
        return <ExcelIcon sx={{ fontSize: 40, color: 'success.main' }} />;
      case 'image/png':
      case 'image/jpg':
      case 'image/jpeg':
        return <ImageIcon sx={{ fontSize: 40, color: 'info.main' }} />;
      default:
        return <FileIcon sx={{ fontSize: 40, color: 'text.secondary' }} />;
    }
  };

  const filteredFiles = files.filter(file =>
    file.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleMenuOpen = (
    event: React.MouseEvent<HTMLElement>,
    file: FileItem
  ) => {
    setAnchorEl(event.currentTarget);
    setSelectedFile(file);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedFile(null);
  };

  const handleDownload = () => {
    if (selectedFile && selectedFile.url) {
      // Simulate download
      showSuccess(`Downloading ${selectedFile.name}`);
    }
    handleMenuClose();
  };

  const handleShare = () => {
    if (selectedFile) {
      // Simulate sharing
      showSuccess(`Shared ${selectedFile.name}`);
    }
    handleMenuClose();
  };

  const handleDeleteClick = () => {
    setDeleteDialogOpen(true);
    handleMenuClose();
  };

  const handleDeleteConfirm = () => {
    if (selectedFile) {
      setFiles(prev => prev.filter(f => f.id !== selectedFile.id));
      showSuccess(`Deleted ${selectedFile.name}`);
      setDeleteDialogOpen(false);
      setSelectedFile(null);
    }
  };

  const handleUpload = async (uploadFiles: File[]) => {
    try {
      // Simulate upload
      await new Promise(resolve => setTimeout(resolve, 2000));

      const newFiles: FileItem[] = uploadFiles.map(file => ({
        id: Math.random().toString(36).substr(2, 9),
        name: file.name,
        type: 'file' as const,
        size: file.size,
        mimeType: file.type,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        owner: 'Current User',
        shared: false,
        url: `/files/${file.name}`,
      }));

      setFiles(prev => [...prev, ...newFiles]);
      showSuccess(`Uploaded ${uploadFiles.length} file(s) successfully`);
      setUploadDialogOpen(false);
    } catch (error) {
      showError('Upload failed');
      throw error;
    }
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
        <Typography variant="h4">File Manager</Typography>
        <Button
          variant="contained"
          startIcon={<CloudUploadIcon />}
          onClick={() => setUploadDialogOpen(true)}
        >
          Upload Files
        </Button>
      </Box>

      {/* Search */}
      <Box sx={{ mb: 3 }}>
        <TextField
          fullWidth
          placeholder="Search files and folders..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
      </Box>

      {/* File Grid */}
      <Grid container spacing={2}>
        {filteredFiles.map(file => (
          <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={file.id}>
            <Card
              sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}
            >
              <CardContent sx={{ flexGrow: 1, textAlign: 'center' }}>
                <Box sx={{ mb: 2 }}>{getFileIcon(file)}</Box>
                <Typography variant="h6" noWrap title={file.name}>
                  {file.name}
                </Typography>
                {file.size && (
                  <Typography variant="body2" color="text.secondary">
                    {formatFileSize(file.size)}
                  </Typography>
                )}
                <Typography
                  variant="caption"
                  color="text.secondary"
                  display="block"
                >
                  {new Date(file.updatedAt).toLocaleDateString()}
                </Typography>
                <Box
                  sx={{
                    mt: 1,
                    display: 'flex',
                    justifyContent: 'center',
                    gap: 1,
                  }}
                >
                  <Chip
                    label={file.owner}
                    size="small"
                    avatar={
                      <Avatar sx={{ width: 20, height: 20 }}>
                        {file.owner[0]}
                      </Avatar>
                    }
                  />
                  {file.shared && (
                    <Chip label="Shared" size="small" color="primary" />
                  )}
                </Box>
              </CardContent>
              <CardActions sx={{ justifyContent: 'space-between' }}>
                <Box>
                  {file.type === 'file' && (
                    <IconButton size="small" onClick={handleDownload}>
                      <DownloadIcon />
                    </IconButton>
                  )}
                  <IconButton size="small" onClick={handleShare}>
                    <ShareIcon />
                  </IconButton>
                </Box>
                <IconButton size="small" onClick={e => handleMenuOpen(e, file)}>
                  <MoreVertIcon />
                </IconButton>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Context Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        {selectedFile?.type === 'file' && (
          <MenuItem onClick={handleDownload}>
            <DownloadIcon sx={{ mr: 1 }} />
            Download
          </MenuItem>
        )}
        <MenuItem onClick={handleShare}>
          <ShareIcon sx={{ mr: 1 }} />
          Share
        </MenuItem>
        <MenuItem onClick={handleDeleteClick} sx={{ color: 'error.main' }}>
          <DeleteIcon sx={{ mr: 1 }} />
          Delete
        </MenuItem>
      </Menu>

      {/* Upload Dialog */}
      <Dialog
        open={uploadDialogOpen}
        onClose={() => setUploadDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Upload Files</DialogTitle>
        <DialogContent>
          <FileUpload
            onUpload={handleUpload}
            maxFiles={10}
            maxSize={50 * 1024 * 1024} // 50MB
            multiple
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setUploadDialogOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete &quot;{selectedFile?.name}&quot;?
            This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button
            onClick={handleDeleteConfirm}
            color="error"
            variant="contained"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};
