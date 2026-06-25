# Jupiter Toys Playwright TypeScript Framework

End-to-end UI test automation using Playwright and TypeScript following the Page Object Model pattern.

## Project Purpose

This framework is designed for:
- Clean, maintainable test code
- Interview-ready quality and structure
- Scalable test organization
- CI/CD integration with Azure DevOps

## Installation

1. **Prerequisites**
   - Node.js 16+ installed (node -v)
   - npm or yarn package manager (npm -v or npm.cmd -v)

2. **Install Dependencies**
   
   First time setup - generate lock file:
   ```bash
   npm install
   ```
   
   This creates `package-lock.json`. For subsequent installations:
   ```bash
   npm ci
   ```

3. **Install Browsers**
   ```bash
   npx playwright install --with-deps chrome msedge
   ```

## Configuration

### Environment Setup

1. Copy the example environment file:
   ```bash
   cp core/environments/.env.example core/environments/.env
   ```

2. Update `core/environments/.env` with your configuration:
   ```
   BASE_URL=http://localhost:3000
   ```

## Running Tests

### Run All Tests
```bash
npm test
```

### Run Tests in UI Mode
```bash
npm run test:ui
```

### Run Tests in Debug Mode
```bash
npm run test:debug
```

### Run Tests for Specific Project (Browser)
```bash
npm run test:chrome
npm run test:edge
```

### Run a Single Test
```bash
npx playwright test test/specs/example.spec.ts
```

### List All Tests
```bash
npm run test:list
```

### View HTML Report
```bash
npm run report
```

## Project Structure

```
.
├── core/
│   ├── environments/        # Environment configuration
│   │   └── .env.example     # Example environment variables
│   └── utils/               # Utility functions and helpers
├── business/
│   ├── actions/             # Business workflow logic
│   ├── fixtures/            # Playwright fixtures and test setup
│   ├── pages/               # Page Object Model classes
│   │   └── base.page.ts     # Base page class
├── test/
│   ├── specs/               # Test specifications
│   ├── data/
│   │   ├── model/           # Data models and DTOs
│   │   └── uat/             # UAT test data
├── playwright.config.ts     # Playwright configuration
├── tsconfig.json            # TypeScript configuration
└── package.json             # Dependencies and scripts
```

## Architecture

### Page Object Model
- Page classes in `business/pages/` contain locators and page-level operations
- Avoid assertions and explicit waits in page objects
- Use `getByRole()` locators where possible

### Actions
- Business workflow logic in `business/actions/`
- Specs call actions instead of performing long UI workflows directly
- Keep actions focused on specific business processes

### Test Data
- Data models/DTOs in `test/data/model/`
- UAT test data in `test/data/uat/`
- Separate test data from test logic

### Test Specifications
- Tests in `test/specs/` follow Arrange, Act, Assert pattern
- Each test must have 1-3 metadata tags (e.g., `@smoke`, `@regression`)
- Do not use `page.waitForTimeout()`
- Do not assert static UI text unless part of behavior under test

## Azure DevOps Integration

### Push to Azure DevOps

1. Add ADO remote:
   ```bash
   git remote add ado <azure-devops-repo-url>
   ```

2. Push to ADO main:
   ```bash
   git push ado main
   ```

3. Also push to GitHub origin:
   ```bash
   git push origin main
   ```

### Azure Pipeline

The pipeline (defined in `azure-pipelines.yml`) will:
- Run tests on Ubuntu latest
- Execute tests in Chrome and Edge browsers
- Generate HTML and JUnit reports
- Publish test results and reports
- Run on triggers to the `main` branch

## Development

### TypeScript Compilation Check
```bash
npx tsc --noEmit
```

### ESLint (optional, not included by default)
Configure and add ESLint as needed for your team standards.

## Best Practices

1. **Keep specs thin** - Use actions for business workflows
2. **Use fixtures** - Inject page objects and actions through fixtures
3. **Separate concerns** - Config, utils, and test data are independent
4. **Meaningful tags** - Use tags like `@smoke`, `@regression`, `@ui`, `@api`
5. **Avoid magic numbers** - Use Playwright's auto-waits instead
6. **Page objects only** - No assertions in page object methods
7. **Reusable test data** - Keep test data in dedicated model files

## Troubleshooting

### Tests fail with BASE_URL not found
- Ensure `.env` file exists in `core/environments/`
- Check that `BASE_URL` is properly configured

### Browser installation fails
```bash
npx playwright install --with-deps chrome msedge
```

If Chrome is already installed and you need to update it:
```bash
npx playwright install --force chrome
```

Close all running instances of Chrome before using the `--force` flag.

### TypeScript errors
```bash
npx tsc --noEmit
```

## License

ISC

## Support

For issues or questions, please refer to [Playwright Documentation](https://playwright.dev)
