# CRM Control Panel

A modern, enterprise-grade React control panel built with TypeScript, Material-UI, and comprehensive authentication system. This application provides a complete admin dashboard solution with user management, file handling, reporting, and role-based access control.

![React](https://img.shields.io/badge/React-19.0.0-blue.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0.0-blue.svg)
![Material-UI](https://img.shields.io/badge/Material--UI-7.0.0-blue.svg)
![License](https://img.shields.io/badge/License-MIT-green.svg)

## 🚀 Features

### 🔐 Authentication & Security
- **JWT Authentication** with automatic token refresh
- **Role-based access control** (Admin, Manager, User)
- **Protected routes** with granular permissions
- **Session management** with remember me functionality
- **Secure API client** with interceptors and retry logic

### 📊 Dashboard & Analytics
- **Interactive dashboard** with real-time metrics
- **Data visualization** with charts and graphs
- **Performance indicators** with trend analysis
- **Activity monitoring** and notifications
- **Responsive design** for all devices

### 👥 User Management
- **Complete CRUD operations** for user management
- **Advanced data table** with sorting, filtering, and pagination
- **Bulk operations** for efficient management
- **User roles and permissions** management
- **Export functionality** for data analysis

### 📁 File Management
- **Drag & drop file upload** with progress tracking
- **File preview and management** with metadata
- **Sharing and download** functionality
- **File type recognition** with custom icons
- **Storage management** with size limits

### ⚙️ Settings & Configuration
- **Profile management** with avatar upload
- **Appearance settings** with theme customization
- **Notification preferences** management
- **Privacy and security** controls
- **System configuration** options

## 🛠️ Technology Stack

### Frontend
- **React 19** - Latest React with concurrent features
- **TypeScript 5** - Type-safe development
- **Material-UI v7** - Modern component library
- **React Router v6** - Client-side routing
- **React Query** - Server state management
- **React Hook Form** - Form handling with validation
- **Yup** - Schema validation

### Development Tools
- **ESLint** - Code linting and quality
- **Prettier** - Code formatting
- **Husky** - Git hooks for quality gates
- **Jest** - Unit testing framework
- **React Testing Library** - Component testing

### Build & Deployment
- **Create React App** - Build toolchain
- **Webpack** - Module bundling
- **Babel** - JavaScript compilation
- **Environment configuration** - Multi-environment support

## 📦 Installation

### Prerequisites
- Node.js 18+
- npm 8+ or yarn 1.22+
- Git

### Quick Start

```bash
# Clone the repository
git clone <repository-url>
cd crm-control-panel

# Install dependencies
npm install

# Copy environment configuration
cp .env.example .env

# Start development server
npm start
```

The application will be available at `http://localhost:3000`

## 🔧 Development Scripts

```bash
# Development
npm start              # Start development server
npm run dev            # Alternative development command

# Building
npm run build          # Create production build
npm run build:analyze  # Analyze bundle size

# Testing
npm test               # Run tests in watch mode
npm run test:coverage  # Run tests with coverage
npm run test:ci        # Run tests for CI/CD

# Code Quality
npm run lint           # Run ESLint
npm run lint:fix       # Fix ESLint issues
npm run format         # Format code with Prettier
npm run type-check     # TypeScript type checking

# Utilities
npm run clean          # Clean build artifacts
npm run eject          # Eject from Create React App (irreversible)
```

## ⚙️ Configuration

### Environment Variables

Create a `.env` file in the root directory with the following variables:

```bash
# API Configuration
REACT_APP_API_BASE_URL=http://localhost:3001/api

# Application Configuration
REACT_APP_APP_NAME=CRM Control Panel
REACT_APP_VERSION=1.0.0

# Feature Flags
REACT_APP_ENABLE_ANALYTICS=false
REACT_APP_ENABLE_ERROR_TRACKING=false

# Development
REACT_APP_DEBUG=true
```

### API Integration

The application expects the following backend endpoints:

#### Authentication
- `POST /auth/login` - User authentication
- `POST /auth/refresh` - Token refresh
- `GET /auth/me` - Get current user
- `POST /auth/logout` - User logout

#### Users
- `GET /users` - Get users with pagination and filtering
- `POST /users` - Create new user
- `GET /users/:id` - Get user by ID
- `PUT /users/:id` - Update user
- `DELETE /users/:id` - Delete user
- `POST /users/bulk-delete` - Bulk delete users

#### Files
- `POST /files/upload` - Upload files
- `GET /files` - Get files list
- `GET /files/:id/download` - Download file
- `DELETE /files/:id` - Delete file

#### Reports
- `GET /reports/metrics` - Get dashboard metrics
- `GET /reports/analytics` - Get analytics data
- `GET /reports/export` - Export reports

## 🏗️ Project Structure

```
crm-control-panel/
├── public/                 # Static assets
├── src/
│   ├── components/         # Reusable components
│   │   ├── common/         # Common UI components
│   │   ├── forms/          # Form components
│   │   └── layout/         # Layout components
│   ├── pages/              # Page components
│   ├── services/           # API services
│   ├── store/              # State management
│   ├── types/              # TypeScript type definitions
│   ├── utils/              # Utility functions
│   ├── App.tsx             # Main application component
│   └── index.tsx           # Application entry point
├── .env.example            # Environment variables template
├── .eslintrc.js            # ESLint configuration
├── .prettierrc             # Prettier configuration
├── package.json            # Dependencies and scripts
└── tsconfig.json           # TypeScript configuration
```

## 🎨 UI Components

### Layout Components
- **Layout** - Main application layout with sidebar and header
- **Sidebar** - Navigation sidebar with role-based menu items
- **Header** - Application header with user menu and notifications

### Common Components
- **DataTable** - Advanced data table with sorting, filtering, and pagination
- **FileUpload** - Drag & drop file upload with progress tracking
- **LoadingSpinner** - Loading states and skeleton loaders
- **ErrorBoundary** - Error handling and recovery
- **ProtectedRoute** - Route protection with role-based access

### Form Components
- **LoginForm** - User authentication form with validation

## 📱 Pages

### Dashboard (`/dashboard`)
- Overview metrics and KPIs
- Activity feed and recent actions
- Quick action buttons
- Performance charts and graphs

### User Management (`/users`) - *Admin/Manager only*
- User list with advanced filtering
- Create, edit, and delete users
- Role assignment and permissions
- Bulk operations and export

### File Manager (`/files`)
- File upload with drag & drop
- File browser with preview
- File sharing and download
- Storage management

### Reports (`/reports`) - *Admin/Manager only*
- Analytics dashboard
- Performance metrics
- Data visualization
- Export functionality

### Settings (`/settings`)
- Profile management
- Appearance preferences
- Notification settings
- Privacy controls

## 🔐 Authentication & Authorization

### User Roles
- **Admin** - Full system access and user management
- **Manager** - Access to reports and limited user management
- **User** - Basic access to dashboard and personal settings

### Protected Routes
Routes are protected based on user roles and authentication status:

```typescript
// Public routes
/login

// Protected routes (authenticated users)
/dashboard
/files
/settings

// Role-restricted routes
/users        // Admin, Manager only
/reports      // Admin, Manager only
```

### JWT Token Management
- Automatic token refresh on expiration
- Secure token storage in localStorage
- Token validation on route changes
- Logout on token invalidation

## 🧪 Testing

### Running Tests

```bash
# Run all tests
npm test

# Run tests with coverage
npm run test:coverage

# Run tests in CI mode
npm run test:ci
```

### Test Structure
- **Unit tests** for components and utilities
- **Integration tests** for user flows
- **API mocking** for service testing
- **Accessibility testing** for compliance

### Testing Tools
- Jest for test runner
- React Testing Library for component testing
- MSW for API mocking
- Jest DOM for DOM assertions

## 🚀 Deployment

### Build for Production

```bash
# Create optimized production build
npm run build

# The build folder contains the static files ready for deployment
```

### Deployment Options

#### Static Hosting (Recommended)
- **Netlify** - Automatic deployments from Git
- **Vercel** - Zero-configuration deployments
- **AWS S3 + CloudFront** - Scalable static hosting
- **Azure Static Web Apps** - Integrated with Azure services

#### Server Deployment
- **Nginx** - Serve static files with reverse proxy
- **Apache** - Traditional web server setup
- **Docker** - Containerized deployment

### Environment Configuration

For production deployment, update the environment variables:

```bash
REACT_APP_API_BASE_URL=https://your-api-domain.com/api
REACT_APP_ENABLE_ANALYTICS=true
REACT_APP_ENABLE_ERROR_TRACKING=true
REACT_APP_DEBUG=false
```

## 📊 Performance

### Optimization Features
- **Code splitting** with React.lazy()
- **Bundle optimization** with Webpack
- **Image optimization** and lazy loading
- **Caching strategies** for API calls
- **Memoization** for expensive computations

### Performance Monitoring
- Bundle size analysis with webpack-bundle-analyzer
- Core Web Vitals monitoring
- Error tracking integration ready
- Performance metrics collection

## 🔧 Development Guidelines

### Code Style
- TypeScript strict mode enabled
- ESLint with Airbnb configuration
- Prettier for consistent formatting
- Husky for pre-commit hooks

### Component Guidelines
- Functional components with hooks
- TypeScript interfaces for props
- Error boundaries for error handling
- Accessibility considerations (ARIA labels)

### State Management
- React Context for global state
- React Query for server state
- Local state with useState/useReducer
- Custom hooks for reusable logic

## 🐛 Troubleshooting

### Common Issues

#### Build Errors
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install

# Clear build cache
npm run clean
```

#### TypeScript Errors
```bash
# Run type checking
npm run type-check

# Check for missing type definitions
npm install @types/package-name
```

#### ESLint Errors
```bash
# Fix auto-fixable issues
npm run lint:fix

# Check specific files
npx eslint src/path/to/file.tsx
```

### Development Server Issues
```bash
# Port already in use
npx kill-port 3000

# Clear browser cache and restart
npm start
```

## 📚 API Documentation

### Authentication Flow

```typescript
// Login request
POST /auth/login
{
  "email": "user@example.com",
  "password": "password123",
  "rememberMe": true
}

// Login response
{
  "token": "jwt-token-here",
  "refreshToken": "refresh-token-here",
  "user": {
    "id": "user-id",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "role": "admin",
    "avatar": "avatar-url"
  }
}
```

### User Management API

```typescript
// Get users with pagination
GET /users?page=0&limit=10&search=john&role=admin&isActive=true

// Response
{
  "data": [
    {
      "id": "user-id",
      "email": "user@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "role": "admin",
      "isActive": true,
      "createdAt": "2024-01-01T00:00:00Z",
      "updatedAt": "2024-01-01T00:00:00Z"
    }
  ],
  "pagination": {
    "page": 0,
    "limit": 10,
    "total": 100,
    "totalPages": 10
  }
}
```

### File Upload API

```typescript
// Upload file
POST /files/upload
Content-Type: multipart/form-data

// Response
{
  "id": "file-id",
  "name": "document.pdf",
  "size": 1024000,
  "mimeType": "application/pdf",
  "url": "/files/document.pdf",
  "createdAt": "2024-01-01T00:00:00Z"
}
```

## 🤝 Contributing

### Development Setup

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes
4. Run tests: `npm test`
5. Run linting: `npm run lint`
6. Commit changes: `git commit -m 'Add amazing feature'`
7. Push to branch: `git push origin feature/amazing-feature`
8. Open a Pull Request

### Code Review Process

1. All code must pass CI/CD checks
2. Maintain test coverage above 80%
3. Follow TypeScript and ESLint guidelines
4. Update documentation for new features
5. Get approval from maintainers

### Reporting Issues

When reporting issues, please include:
- Operating system and version
- Node.js and npm versions
- Browser and version
- Steps to reproduce
- Expected vs actual behavior
- Screenshots if applicable

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Create React App](https://create-react-app.dev/) for the build toolchain
- [Material-UI](https://mui.com/) for the component library
- [React Query](https://tanstack.com/query) for server state management
- [React Hook Form](https://react-hook-form.com/) for form handling
- [TypeScript](https://www.typescriptlang.org/) for type safety

## 📞 Support

For support and questions:
- Create an issue in the GitHub repository
- Check the documentation and FAQ
- Review existing issues and discussions

## 🗺️ Roadmap

### Upcoming Features
- [ ] Dark mode theme support
- [ ] Advanced analytics dashboard
- [ ] Real-time notifications
- [ ] Multi-language support (i18n)
- [ ] Advanced file management
- [ ] API rate limiting
- [ ] Audit logging
- [ ] Advanced user permissions
- [ ] Mobile app companion
- [ ] Integration with external services

### Version History
- **v1.0.0** - Initial release with core features
- **v1.1.0** - Enhanced file management (planned)
- **v1.2.0** - Advanced analytics (planned)
- **v2.0.0** - Mobile app integration (planned)

---

**Built with ❤️ using React, TypeScript, and Material-UI**