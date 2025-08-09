# Contributing to CRM Control Panel

Thank you for your interest in contributing to the CRM Control Panel! This document provides guidelines and information for contributors.

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm 8+ or yarn 1.22+
- Git
- Code editor (VS Code recommended)

### Development Setup

1. **Fork the repository**
   ```bash
   # Fork on GitHub, then clone your fork
   git clone https://github.com/your-username/crm-control-panel.git
   cd crm-control-panel
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. **Start development server**
   ```bash
   npm start
   ```

5. **Run tests**
   ```bash
   npm test
   ```

## 📋 Development Guidelines

### Code Style

We use ESLint and Prettier to maintain consistent code style:

```bash
# Check code style
npm run lint

# Fix auto-fixable issues
npm run lint:fix

# Format code
npm run format
```

### TypeScript Guidelines

- Use strict TypeScript configuration
- Define interfaces for all props and data structures
- Avoid `any` type - use proper typing
- Use generic types where appropriate
- Document complex types with JSDoc comments

```typescript
// Good
interface UserProps {
  user: User;
  onUpdate: (user: User) => void;
  isLoading?: boolean;
}

// Avoid
interface UserProps {
  user: any;
  onUpdate: any;
  isLoading: any;
}
```

### Component Guidelines

#### Functional Components
- Use functional components with hooks
- Implement proper error boundaries
- Use React.memo for performance optimization when needed

```typescript
import React, { memo } from 'react';

interface ComponentProps {
  title: string;
  data: DataType[];
}

export const Component: React.FC<ComponentProps> = memo(({ title, data }) => {
  return (
    <div>
      <h1>{title}</h1>
      {/* Component content */}
    </div>
  );
});

Component.displayName = 'Component';
```

#### Custom Hooks
- Extract reusable logic into custom hooks
- Follow the `use` naming convention
- Include proper TypeScript types

```typescript
interface UseApiResult<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

export const useApi = <T>(url: string): UseApiResult<T> => {
  // Hook implementation
};
```

### State Management

- Use React Context for global state
- Use React Query for server state
- Keep local state minimal and close to where it's used
- Use useReducer for complex state logic

### File Organization

```
src/
├── components/
│   ├── common/          # Reusable components
│   ├── forms/           # Form components
│   └── layout/          # Layout components
├── pages/               # Page components
├── services/            # API services
├── store/               # Context providers
├── types/               # TypeScript definitions
├── utils/               # Utility functions
└── __tests__/           # Test files
```

### Naming Conventions

- **Components**: PascalCase (`UserCard.tsx`)
- **Hooks**: camelCase with `use` prefix (`useAuth.ts`)
- **Utilities**: camelCase (`formatDate.ts`)
- **Constants**: UPPER_SNAKE_CASE (`API_ENDPOINTS.ts`)
- **Types/Interfaces**: PascalCase (`User.ts`)

## 🧪 Testing

### Testing Strategy

- **Unit Tests**: Test individual components and functions
- **Integration Tests**: Test component interactions
- **E2E Tests**: Test complete user workflows

### Writing Tests

```typescript
import { render, screen, fireEvent } from '@testing-library/react';
import { UserCard } from '../UserCard';

describe('UserCard', () => {
  const mockUser = {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
  };

  it('renders user information', () => {
    render(<UserCard user={mockUser} />);
    
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('john@example.com')).toBeInTheDocument();
  });

  it('calls onEdit when edit button is clicked', () => {
    const mockOnEdit = jest.fn();
    render(<UserCard user={mockUser} onEdit={mockOnEdit} />);
    
    fireEvent.click(screen.getByRole('button', { name: /edit/i }));
    expect(mockOnEdit).toHaveBeenCalledWith(mockUser);
  });
});
```

### Test Coverage

- Maintain minimum 80% test coverage
- Focus on critical business logic
- Test error scenarios and edge cases
- Mock external dependencies

## 🔄 Git Workflow

### Branch Naming

- `feature/feature-name` - New features
- `bugfix/bug-description` - Bug fixes
- `hotfix/critical-fix` - Critical fixes
- `refactor/component-name` - Code refactoring
- `docs/update-readme` - Documentation updates

### Commit Messages

Follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

```
type(scope): description

feat(auth): add JWT token refresh functionality
fix(dashboard): resolve chart rendering issue
docs(readme): update installation instructions
refactor(components): extract common button component
test(user): add unit tests for user service
```

### Pull Request Process

1. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```

2. **Make your changes**
   - Follow coding guidelines
   - Add tests for new functionality
   - Update documentation if needed

3. **Run quality checks**
   ```bash
   npm run lint
   npm test
   npm run type-check
   ```

4. **Commit your changes**
   ```bash
   git add .
   git commit -m "feat(feature): add amazing feature"
   ```

5. **Push to your fork**
   ```bash
   git push origin feature/amazing-feature
   ```

6. **Create Pull Request**
   - Use the PR template
   - Provide clear description
   - Link related issues
   - Request review from maintainers

### Pull Request Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
- [ ] Tests pass locally
- [ ] Added tests for new functionality
- [ ] Manual testing completed

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Documentation updated
- [ ] No breaking changes
```

## 🐛 Reporting Issues

### Bug Reports

Include the following information:

- **Environment**: OS, Node.js version, browser
- **Steps to reproduce**: Clear, numbered steps
- **Expected behavior**: What should happen
- **Actual behavior**: What actually happens
- **Screenshots**: If applicable
- **Console errors**: Any error messages

### Feature Requests

- **Problem description**: What problem does this solve?
- **Proposed solution**: How should it work?
- **Alternatives considered**: Other approaches
- **Additional context**: Screenshots, examples

## 📚 Documentation

### Code Documentation

- Use JSDoc for complex functions
- Add README files for major features
- Keep inline comments minimal and meaningful
- Document API interfaces and types

### Documentation Updates

- Update README.md for new features
- Add examples for new components
- Update API documentation
- Keep CHANGELOG.md current

## 🎯 Performance Guidelines

### Optimization Strategies

- Use React.memo for expensive components
- Implement proper key props for lists
- Lazy load components and routes
- Optimize bundle size with code splitting
- Use proper dependency arrays in hooks

### Performance Monitoring

- Monitor bundle size with webpack-bundle-analyzer
- Use React DevTools Profiler
- Implement performance metrics
- Test on various devices and networks

## 🔒 Security Guidelines

- Validate all user inputs
- Sanitize data before rendering
- Use HTTPS for all API calls
- Implement proper authentication
- Follow OWASP security guidelines
- Regular dependency updates

## 📞 Getting Help

- **GitHub Issues**: For bugs and feature requests
- **GitHub Discussions**: For questions and ideas
- **Code Review**: Request review from maintainers
- **Documentation**: Check existing docs first

## 🏆 Recognition

Contributors will be recognized in:
- README.md contributors section
- Release notes
- GitHub contributors page

Thank you for contributing to make this project better! 🚀
