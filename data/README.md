# Data Folder - Testing Database

This folder contains the SQLite database and related files for testing the CRM Control Panel locally without requiring an external API.

## 🚨 IMPORTANT - PRODUCTION NOTE

**This entire folder is for TESTING PURPOSES ONLY and should be removed in production.**

For production deployment:
1. Remove this entire `data/` folder
2. Set `REACT_APP_USE_MOCK_API=false` in your environment
3. Configure your production database and API endpoints
4. Remove all mock API imports from the services

## 📁 Files in this folder

### `database.js`
- SQLite database initialization script
- Creates tables for users, files, sessions, activity logs, settings, and reports
- Inserts default test data including default users
- **REMOVE IN PRODUCTION**

### `crm_control_panel.db` (auto-generated)
- SQLite database file created automatically when the app runs
- Contains all test data for local development
- **DO NOT COMMIT TO VERSION CONTROL**

## 🔐 Default Test Users

The database is pre-populated with the following test users:

| Email | Password | Role | Status |
|-------|----------|------|--------|
| admin@example.com | password123 | admin | Active |
| manager@example.com | password123 | manager | Active |
| user@example.com | password123 | user | Active |
| john.doe@example.com | password123 | user | Active |
| jane.smith@example.com | password123 | manager | Inactive |

## 🛠️ How it works

1. **Mock API Service** (`src/services/mockApiService.ts`)
   - Simulates all backend API endpoints
   - Uses the SQLite database for data persistence
   - Provides realistic response times and error handling

2. **API Client Integration**
   - Automatically detects if `REACT_APP_USE_MOCK_API=true`
   - Routes API calls to mock service instead of real backend
   - Maintains the same interface as production API

3. **Database Operations**
   - All CRUD operations work with the local SQLite database
   - Data persists between application restarts
   - Supports pagination, filtering, and sorting

## 🚀 Getting Started

1. **Enable Mock API** (already configured in `.env`):
   ```bash
   REACT_APP_USE_MOCK_API=true
   ```

2. **Start the application**:
   ```bash
   npm start
   ```

3. **Login with test credentials**:
   - Email: `admin@example.com`
   - Password: `password123`

4. **Test all features**:
   - User management (create, edit, delete users)
   - File upload and management
   - Dashboard analytics
   - Settings and profile management

## 🔄 Switching to Production API

To switch from mock API to production API:

1. **Update environment variables**:
   ```bash
   REACT_APP_USE_MOCK_API=false
   REACT_APP_API_BASE_URL=https://your-production-api.com/api
   ```

2. **Remove mock API code**:
   - Delete `src/services/mockApiService.ts`
   - Remove mock API imports from all service files
   - Remove mock API logic from `apiClient.ts`

3. **Remove this data folder**:
   ```bash
   rm -rf data/
   ```

4. **Configure production database**:
   - Set up your production database (PostgreSQL, MySQL, etc.)
   - Configure authentication and authorization
   - Implement proper API endpoints

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

### Sessions Table
```sql
CREATE TABLE sessions (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  token TEXT NOT NULL,
  refresh_token TEXT NOT NULL,
  expires_at DATETIME NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
);
```

## 🧪 Testing Features

### Authentication
- ✅ Login with different user roles
- ✅ JWT token simulation
- ✅ Session management
- ✅ Role-based access control

### User Management
- ✅ List users with pagination
- ✅ Search and filter users
- ✅ Create new users
- ✅ Edit existing users
- ✅ Delete users
- ✅ Bulk operations

### File Management
- ✅ File upload simulation
- ✅ File listing and metadata
- ✅ File sharing and permissions
- ✅ File download simulation

### Dashboard & Reports
- ✅ Metrics and KPIs
- ✅ Chart data
- ✅ Activity logs
- ✅ Performance indicators

## 🔒 Security Notes

- Passwords are stored as hashed values (simulated)
- JWT tokens are properly formatted (mock implementation)
- Role-based access control is enforced
- Input validation and sanitization
- Session management and timeout handling

## 📝 Development Notes

- The database is automatically created on first run
- Default data is inserted only once
- All operations are logged to console in debug mode
- Error handling simulates real API responses
- Network delays are simulated for realistic testing

## ⚠️ Limitations

- File uploads are simulated (files are not actually stored)
- Email functionality is not implemented
- Real-time notifications are not supported
- Advanced analytics are simplified
- No actual file storage or CDN integration

## 🚀 Next Steps

1. Test all application features thoroughly
2. Verify role-based access control
3. Test error scenarios and edge cases
4. Validate UI/UX with realistic data
5. Prepare for production API integration

---

**Remember: This is a testing setup only. Remove all mock API code and this data folder before deploying to production.**
