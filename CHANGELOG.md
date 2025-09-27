# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2024-01-01

### Added
- Initial implementation of viewport-sense
- Core viewport detection and breakpoint management
- Advanced device detection (browser, OS, WebView, PWA)
- Accessibility preferences detection
- Safe area detection for mobile devices
- React hooks integration (Vue integration removed for focus)
- CSS custom properties generation
- Utility classes for responsive design
- Multiple breakpoint system presets (Bootstrap, Tailwind, Material Design, Foundation)
- Scroll position tracking

### Development Setup
- Complete TypeScript build system with Rollup
- Jest testing framework with >80% coverage target
- ESLint + Prettier code quality tools
- Husky pre-commit hooks for code quality
- Multi-format builds (ESM, CJS, UMD)
- Comprehensive documentation and examples

### Dependencies
- Zero runtime dependencies
- React as optional peer dependency
- Comprehensive development toolchain with 20+ packages
- ES2018+ target with modern browser support

## [Unreleased]
- Element visibility detection
- Performance optimizations with RAF and debouncing
- TypeScript-first development with comprehensive type definitions
- Zero dependencies implementation
- Tree-shakeable modular architecture
- SSR (Server-Side Rendering) compatibility
- Comprehensive test suite with >90% coverage
- Complete documentation and examples

### Features
- **ViewportCore**: Core viewport state management with event system
- **DeviceDetector**: Browser, OS, and hardware capability detection
- **AccessibilityDetector**: User preference detection (dark mode, reduced motion, etc.)
- **SafeAreaManager**: Mobile safe area detection and management
- **BreakpointManager**: Flexible breakpoint system with presets
- **ScrollManager**: Advanced scroll position and velocity tracking
- **VisibilityManager**: Intersection Observer-based element visibility
- **EventManager**: Centralized event handling with cleanup
- **React Integration**: 13 custom hooks for responsive development
- **CSS Integration**: Automatic CSS variables and utility classes

### Configuration Options
- Multiple breakpoint systems (Bootstrap, Tailwind, Material Design, Foundation)
- Custom breakpoint definitions
- Performance tuning (debounce delays, RAF usage)
- Feature toggles (touch detection, accessibility, safe area)
- CSS integration settings
- Debug mode support

### Browser Support
- Chrome 70+
- Firefox 65+
- Safari 12+
- Edge 79+
- iOS Safari 12+
- Android Chrome 70+

### Bundle Size
- Core library: ~4KB gzipped
- Full feature set: ~12KB gzipped
- Tree-shakeable for optimal bundle sizes

## [1.0.0] - TBD

### Added
- Initial stable release
- Complete API implementation
- Framework integrations
- Comprehensive documentation
- Production-ready build system

---

## Release Notes Template

### [X.Y.Z] - YYYY-MM-DD

#### Added
- New features and capabilities

#### Changed
- Changes in existing functionality

#### Deprecated
- Soon-to-be removed features

#### Removed
- Now removed features

#### Fixed
- Bug fixes

#### Security
- Vulnerability fixes