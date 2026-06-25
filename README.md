# Jupiter Toys Playwright TypeScript Framework

End-to-end UI test automation for Jupiter Toys using Playwright and TypeScript with Page Object Model, fixtures, typed JSON test data, and Azure DevOps pipeline support.

## Project Purpose

This framework is designed for:
- Clean, maintainable test code
- Interview-ready quality and structure
- Scalable test organization
- CI/CD integration with Azure DevOps

## Installation

1. **Prerequisites**
   - Node.js 18+ installed (`node -v`)
   - npm package manager (`npm -v` or `npm.cmd -v`)

2. **Install Dependencies**

   ```bash
   npm ci
   ```

3. **Install Browsers**
   ```bash
   npx playwright install --with-deps chrome msedge
   ```

## Configuration

### Environment Setup

1. Create or update `core/environments/uat.env` with your configuration:
   ```
   BASE_URL=http://jupiter.cloud.planittesting.com
   ```

`core/environments/uat.env` is ignored by Git. Azure DevOps sets `BASE_URL` in `azure-pipelines.yml`.

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
npx playwright test "test/specs/contact.spec.ts" --project=Chrome
```

### List All Tests
```bash
npm run test:list
```

### View HTML Report
```bash
npm run report
```

HTML report file:
```text
playwright-report/index.html
```

JUnit report file:
```text
test-results/results.xml
```

## Project Structure

```text
.
|-- business/
|   |-- actions/             # Business workflow logic
|   |-- fixtures/            # Playwright custom fixtures
|   `-- pages/               # Page Object Model classes
|-- core/
|   `-- environments/        # Local environment files
|-- test/
|   |-- data/
|   |   |-- model/           # TypeScript data models
|   |   `-- uat/             # JSON test data
|   `-- specs/               # Playwright test specs
|-- azure-pipelines.yml
|-- playwright.config.ts
|-- tsconfig.json
`-- package.json
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
- Data models in `test/data/model/`
- JSON UAT test data in `test/data/uat/`
- Separate test data from test logic

### Test Specifications
- Tests in `test/specs/` follow Arrange, Act, Assert pattern
- Each test must have 1-3 metadata tags (e.g., `@smoke`, `@regression`)
- Do not use `page.waitForTimeout()`
- Do not assert static UI text unless part of behavior under test

## Azure DevOps Integration

### Git Remotes

Current remote names:

```text
ado
github
```

Push to both:

```bash
git push ado main
git push github main
```

### Azure Pipeline

The pipeline (defined in `azure-pipelines.yml`) will:
- Run tests on Ubuntu latest
- Run a matrix across Chrome and Edge projects
- Support `smoke`, `regression`, and `all` test type parameters
- Run TypeScript validation before tests
- Generate HTML and JUnit reports
- Publish test results and reports
- Run on triggers to the `main` branch and on the nightly schedule

## Development

### TypeScript Compilation Check
```bash
npx tsc --noEmit
```

## Best Practices

1. **Keep specs thin** - Use actions for business workflows
2. **Use fixtures** - Inject page objects and actions through fixtures
3. **Separate concerns** - Config, page objects, actions, and test data are independent
4. **Meaningful tags** - Use tags like `@smoke`, `@regression`, `@ui`, `@api`
5. **Avoid magic numbers** - Use Playwright's auto-waits instead
6. **Page objects only** - No assertions in page object methods
7. **Reusable test data** - Keep test data in dedicated model files

## Troubleshooting

### Tests fail with BASE_URL not found
- Ensure `core/environments/uat.env` exists locally
- Check that `BASE_URL` is configured locally or in `azure-pipelines.yml`

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
