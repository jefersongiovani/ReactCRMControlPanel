# CRM Control Panel - Testing Setup Guide

This document provides a comprehensive guide for testing the CRM Control Panel using the built-in SQLite database and mock API system.

## 🚨 IMPORTANT - Production vs Testing

### Testing Mode (Current Setup)
- **Environment**: `REACT_APP_USE_MOCK_API=true`
- **Database**: Local SQLite database (`data/crm_control_panel.db`)
- **API**: Mock API service simulating backend responses
- **Purpose**: Local development and testing without external dependencies

### Production Mode
- **Environment**: `REACT_APP_USE_MOCK_API=false`
- **Database**: Your production database (PostgreSQL, MySQL, etc.)
- **API**: Real backend API endpoints
- **Purpose**: Live application with actual backend services

## 🏗️ Testing Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    React Frontend                           │
├─────────────────────────────────────────────────────────────┤
│  ┌─────────────────┐    ┌─────────────────────────────────┐ │
│  │   API Client    │────│     Mock API Service           │ │
│  │                 │    │  (mockApiService.ts)           │ │
│  └─────────────────┘    └─────────────────────────────────┘ │
├─────────────────────────────────────────────────────────────┤
│                    SQLite Database                          │
│                (data/crm_control_panel.db)                  │
└─────────────────────────────────────────────────────────────┘
```

## 🔐 Default Test Users

The system comes pre-configured with test users for different roles:

| Email | Password | Role | Status | Description |
|-------|----------|------|--------|-------------|
| admin@example.com | password123 | Admin | Active | Full system access |
| manager@example.com | password123 | Manager | Active | Reports and user management |
| user@example.com | password123 | User | Active | Basic dashboard access |
| john.doe@example.com | password123 | User | Active | Additional test user |
| jane.smith@example.com | password123 | Manager | Inactive | Disabled account testing |

## 🚀 Quick Start Testing

### 1. Start the Application
```bash
cd crm-control-panel
npm start
```

### 2. Login with Test Credentials
- Navigate to `http://localhost:3000`
- Use any of the test user credentials above
- Example: `admin@example.com` / `password123`

### 3. Test Features by Role

#### Admin User Testing
- ✅ **Dashboard**: View all metrics and charts
- ✅ **User Management**: Create, edit, delete users
- ✅ **File Manager**: Upload, download, manage files
- ✅ **Reports**: View analytics and export data
- ✅ **Settings**: Manage profile and preferences

#### Manager User Testing
- ✅ **Dashboard**: View metrics and charts
- ✅ **User Management**: Limited user management
- ✅ **File Manager**: Upload and manage files
- ✅ **Reports**: View analytics and export data
- ✅ **Settings**: Manage profile and preferences

#### Regular User Testing
- ✅ **Dashboard**: View basic metrics
- ❌ **User Management**: No access (should show access denied)
- ✅ **File Manager**: Upload and manage own files
- ❌ **Reports**: No access (should show access denied)
- ✅ **Settings**: Manage profile and preferences

## 🧪 Feature Testing Checklist

### Authentication & Authorization
- [ ] Login with valid credentials
- [ ] Login with invalid credentials (should fail)
- [ ] Login with inactive account (should fail)
- [ ] Logout functionality
- [ ] Session persistence (refresh page)
- [ ] Role-based page access
- [ ] Protected route redirection

### User Management (Admin/Manager only)
- [ ] View user list with pagination
- [ ] Search users by name/email
- [ ] Filter users by role and status
- [ ] Sort users by different columns
- [ ] Create new user
- [ ] Edit existing user
- [ ] Delete user
- [ ] Bulk delete users
- [ ] Export user data

### File Management
- [ ] Upload single file
- [ ] Upload multiple files
- [ ] View file list
- [ ] Download files
- [ ] Delete files
- [ ] File sharing functionality
- [ ] File type validation
- [ ] File size validation

### Dashboard & Reports
- [ ] View dashboard metrics
- [ ] Interactive charts
- [ ] Performance indicators
- [ ] Activity feed
- [ ] Reports page (Admin/Manager only)
- [ ] Export reports

### Settings & Profile
- [ ] Update profile information
- [ ] Change avatar
- [ ] Update preferences
- [ ] Notification settings
- [ ] Privacy controls

## 🔧 Mock API Endpoints

The mock API service simulates the following endpoints:

### Authentication
- `POST /auth/login` - User login
- `POST /auth/refresh` - Token refresh
- `GET /auth/me` - Get current user
- `POST /auth/logout` - User logout

### Users
- `GET /users` - Get users with pagination/filtering
- `POST /users` - Create new user
- `PUT /users/:id` - Update user
- `DELETE /users/:id` - Delete user
- `POST /users/bulk-delete` - Bulk delete users

### Files
- `POST /files/upload` - Upload files
- `GET /files` - Get files list
- `GET /files/:id/download` - Download file
- `DELETE /files/:id` - Delete file

### Reports
- `GET /reports/metrics` - Get dashboard metrics
- `GET /reports/analytics` - Get analytics data

## 📊 Database Schema

### Users Table
```sql
CREATE TABLE users (
  id TEXT PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('admin', 'manager', 'user')),
  is_active BOOLEAN DEFAULT 1,
  avatar TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

### Files Table
```sql
CREATE TABLE files (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  original_name TEXT NOT NULL,
  mime_type TEXT NOT NULL,
  size INTEGER NOT NULL,
  path TEXT NOT NULL,
  owner_id TEXT NOT NULL,
  is_shared BOOLEAN DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (owner_id) REFERENCES users (id) ON DELETE CASCADE
);
```

## 🐛 Testing Error Scenarios

### Authentication Errors
- Invalid email format
- Wrong password
- Inactive account login
- Expired session handling

### Validation Errors
- Empty form submissions
- Invalid email formats
- Password requirements
- File size/type restrictions

### Permission Errors
- Access denied pages
- Unauthorized API calls
- Role-based restrictions

### Network Errors
- Simulated API timeouts
- Connection failures
- Server errors (500)

## 🔄 Switching to Production

When ready for production deployment:

### 1. Update Environment Variables
```bash
# .env.production
REACT_APP_USE_MOCK_API=false
REACT_APP_API_BASE_URL=https://your-production-api.com/api
```

### 2. Remove Mock API Code
```bash
# Remove these files:
rm src/services/mockApiService.ts
rm -rf data/

# Update these files to remove mock API imports:
# - src/services/apiClient.ts
# - src/services/authService.ts
# - src/services/userService.ts
```

### 3. Configure Production Backend
- Set up production database
- Implement real API endpoints
- Configure authentication system
- Set up file storage (AWS S3, etc.)

## 📝 Development Notes

### Mock API Features
- Realistic response times (500ms delay)
- Proper error handling and status codes
- Data persistence between sessions
- JWT token simulation
- Role-based access control

### Limitations
- File uploads are simulated (not actually stored)
- Email functionality not implemented
- Real-time features not supported
- Advanced analytics simplified

### Debugging
- Console logs show mock API usage
- Network tab shows simulated requests
- React DevTools for component inspection
- Error boundary catches and displays errors

## 🎯 Testing Best Practices

1. **Test all user roles** - Verify different permission levels
2. **Test error scenarios** - Ensure proper error handling
3. **Test responsive design** - Check mobile and desktop views
4. **Test browser compatibility** - Chrome, Firefox, Safari, Edge
5. **Test performance** - Check loading times and responsiveness
6. **Test accessibility** - Keyboard navigation and screen readers

## 📞 Support

If you encounter issues during testing:

1. Check browser console for errors
2. Verify environment variables are set correctly
3. Ensure SQLite database was created successfully
4. Check that mock API is enabled in console logs
5. Review network requests in browser DevTools

---

**Remember**: This testing setup is for development only. Remove all mock API code before production deployment.
