# Contributing to viewport-sense

We love your input! We want to make contributing to viewport-sense as easy and transparent as possible, whether it's:

- Reporting a bug
- Discussing the current state of the code
- Submitting a fix
- Proposing new features
- Becoming a maintainer

## Development Process

We use GitHub to host code, to track issues and feature requests, as well as accept pull requests.

## Pull Requests

Pull requests are the best way to propose changes to the codebase. We actively welcome your pull requests:

1. Fork the repo and create your branch from `main`.
2. If you've added code that should be tested, add tests.
3. If you've changed APIs, update the documentation.
4. Ensure the test suite passes.
5. Make sure your code lints.
6. Issue that pull request!

## Development Setup

```bash
# Clone the repository
git clone https://github.com/yourusername/viewport-sense.git
cd viewport-sense

# Install dependencies
npm install

# Start development mode
npm run dev

# Run tests
npm test

# Run tests in watch mode
npm run test:watch

# Build the project
npm run build

# Lint the code
npm run lint

# Format the code
npm run format

# Type check
npm run type-check
```

## Project Structure

```
src/
├── core/           # Core functionality
├── types/          # TypeScript definitions
├── utils/          # Utility functions
├── breakpoints/    # Breakpoint management
├── integrations/   # Framework integrations
└── __tests__/      # Test files

dist/               # Built files
docs/               # Documentation
examples/           # Example projects
```

## Code Style

We use ESLint and Prettier to maintain code quality:

- Follow the existing code style
- Use TypeScript for all new code
- Write meaningful commit messages
- Add JSDoc comments for public APIs
- Ensure 100% test coverage for new features

### Code Style Guidelines

```typescript
// ✅ Good
export class ViewportCore {
  private readonly config: ViewportConfig;
  
  constructor(config: ViewportConfig = {}) {
    this.config = { ...defaultConfig, ...config };
  }
  
  /**
   * Get current viewport dimensions
   * @returns The current viewport state
   */
  public getState(): ViewportState {
    return this.currentState;
  }
}

// ❌ Bad
export class ViewportCore {
  config: any;
  
  constructor(config) {
    this.config = config;
  }
  
  getState() {
    return this.currentState;
  }
}
```

## Testing

We use Jest for testing. Please ensure:

- All new features have corresponding tests
- Tests are meaningful and cover edge cases
- Mock external dependencies appropriately
- Maintain high test coverage (>90%)

### Test Structure

```typescript
describe('ViewportCore', () => {
  let viewport: ViewportCore;
  
  beforeEach(() => {
    viewport = new ViewportCore();
  });
  
  afterEach(() => {
    viewport.destroy();
  });
  
  it('should detect mobile devices correctly', () => {
    // Arrange
    mockViewport(375, 667);
    
    // Act
    const state = viewport.getState();
    
    // Assert
    expect(state.isMobile).toBe(true);
    expect(state.breakpoint).toBe('sm');
  });
});
```

## Documentation

- Update README.md for significant changes
- Add JSDoc comments for all public APIs
- Include examples in documentation
- Update TypeScript definitions
- Create migration guides for breaking changes

## Performance Considerations

When contributing, please consider:

- Bundle size impact
- Runtime performance
- Memory usage
- Browser compatibility
- Tree-shaking support

## Compatibility

Ensure your changes maintain compatibility with:

- TypeScript 4.5+
- Node.js 14+
- Modern browsers (Chrome 70+, Firefox 65+, Safari 12+, Edge 79+)
- React 16.8+ (for React integration)


## Reporting Issues

We use GitHub issues to track public bugs. Report a bug by opening a new issue.

**Great Bug Reports** tend to have:

- A quick summary and/or background
- Steps to reproduce
  - Be specific!
  - Give sample code if you can
- What you expected would happen
- What actually happens
- Notes (possibly including why you think this might be happening, or stuff you tried that didn't work)

### Bug Report Template

```
**Describe the bug**
A clear and concise description of what the bug is.

**To Reproduce**
Steps to reproduce the behavior:
1. Go to '...'
2. Click on '....'
3. Scroll down to '....'
4. See error

**Expected behavior**
A clear and concise description of what you expected to happen.

**Environment:**
 - OS: [e.g. iOS]
 - Browser [e.g. chrome, safari]
 - Version [e.g. 22]
 - viewport-sense version [e.g. 1.0.0]

**Additional context**
Add any other context about the problem here.
```

## Feature Requests

We welcome feature requests! Please:

1. Check if the feature already exists
2. Consider if it fits the project's scope
3. Provide a clear use case
4. Consider implementation complexity
5. Be willing to contribute code

### Feature Request Template

```
**Is your feature request related to a problem? Please describe.**
A clear and concise description of what the problem is.

**Describe the solution you'd like**
A clear and concise description of what you want to happen.

**Describe alternatives you've considered**
A clear and concise description of any alternative solutions.

**Additional context**
Add any other context or screenshots about the feature request here.
```

## Code of Conduct

This project and everyone participating in it is governed by our [Code of Conduct](CODE_OF_CONDUCT.md). By participating, you are expected to uphold this code. Please report unacceptable behavior to nishadkindre@gmail.com.

### Key Points

- Be respectful and inclusive
- Welcome newcomers and help them learn
- Focus on constructive feedback
- Respect different viewpoints and experiences
- Follow community guidelines for technical discussions

For the full Code of Conduct, please see [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md).

## Release Process

1. Update version in `package.json`
2. Update CHANGELOG.md
3. Create release notes
4. Tag the release
5. Publish to npm
6. Update documentation

## Getting Help

- Check the documentation first
- Search existing issues
- Ask questions in discussions
- Join our community chat

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

## Recognition

Contributors will be recognized in:

- README.md contributors section
- Release notes
- Project documentation
- Annual contributor summary

Thank you for contributing to viewport-sense! 🎉