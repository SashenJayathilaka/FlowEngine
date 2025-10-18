# Test Suite Documentation

## Overview
This directory contains comprehensive unit tests for the codebase changes in this branch.

## Testing Framework
- **Vitest**: Modern, fast testing framework with native TypeScript support
- **@testing-library/react**: For React component testing
- **happy-dom**: Lightweight DOM implementation for testing

## Running Tests

Run all tests: `npm test`

Run tests in watch mode: `npm test -- --watch`

Run tests with UI: `npm run test:ui`

Run tests with coverage: `npm run test:coverage`

## Test Coverage

### lib/db.ts (27 tests)
- Singleton pattern behavior
- Environment-based behavior (development vs production)
- Global variable handling
- Multiple import scenarios
- Type safety validation
- Edge cases (rapid imports, falsy values)
- Export validation

### prisma/schema.prisma (47 tests)
- Schema file structure
- Generator configuration
- Datasource configuration
- User model validation
- Post model validation
- Relationship definitions
- Data types and constraints
- Migration file validation

## Test Organization

- lib/__tests__/db.test.ts - Database client tests
- prisma/__tests__/schema.test.ts - Schema validation tests
- lib/__tests__/__utils__/test-helpers.ts - Shared utilities

## Best Practices
- All tests use proper mocking to avoid actual database connections
- Tests are isolated and can run in any order
- Environment variables are properly stubbed
- Each test case has clear, descriptive names
- Edge cases and error conditions are thoroughly covered