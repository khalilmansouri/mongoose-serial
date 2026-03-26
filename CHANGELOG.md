# Changelog

All notable changes to this project will be documented in this file.

## [1.1.0] - 2024-12-19

### Added
- **TypeScript Support**: Full TypeScript definitions with comprehensive type safety
- **New InitCounter Options**: Added `NEVER` option for counter that never resets
- **Enhanced Error Handling**: Robust validation with detailed error messages
- **Custom Date Function**: `getCurrentDate` option for testing and custom date logic
- **Improved Documentation**: Comprehensive README with examples and API reference
- **Unit Tests**: Complete test coverage for core functionality
- **Integration Tests**: Plugin validation and configuration tests
- **ESLint Configuration**: Code quality enforcement with TypeScript support
- **Prettier Configuration**: Consistent code formatting
- **Build Scripts**: Enhanced npm scripts for development and testing

### Changed
- **Breaking Change**: Renamed `initCount` to `initCounter` for consistency
- **Breaking Change**: Updated option types to use enum instead of strings
- **Improved Performance**: Optimized database queries and memory usage
- **Better Type Safety**: Replaced `any` types with proper TypeScript interfaces
- **Enhanced Validation**: More comprehensive option validation
- **Updated Dependencies**: Upgraded to latest versions of all dependencies

### Fixed
- **TypeScript Compilation**: Fixed all TypeScript errors and warnings
- **Code Quality**: Resolved ESLint issues and improved code structure
- **Error Handling**: Better error messages and validation
- **Documentation**: Fixed typos and improved examples

### Technical Improvements
- **Modern TypeScript**: Updated to TypeScript 5.4.5 with strict mode
- **ES2020 Target**: Updated compilation target for better performance
- **Strict Type Checking**: Enabled all strict TypeScript options
- **Code Coverage**: Added comprehensive test coverage
- **Linting**: Added ESLint with TypeScript support
- **Formatting**: Added Prettier for consistent code style

### Migration Guide
If upgrading from v1.0.x:

```typescript
// Old (v1.0.x)
schema.plugin(mongooseSerial, {
  initCount: "monthly"  // ❌ Deprecated
});

// New (v1.1.x)
import { InitCounter } from 'mongoose-serial';
schema.plugin(mongooseSerial, {
  initCounter: InitCounter.MONTHLY  // ✅ New
});
```

### New Features
- **Hourly Reset**: Added `InitCounter.HOURLY` for hourly counter resets
- **Never Reset**: Added `InitCounter.NEVER` for counters that never reset
- **Custom Date Function**: Useful for testing and custom date logic
- **Better Validation**: Comprehensive option validation with helpful error messages
- **TypeScript Definitions**: Full type safety and IntelliSense support
