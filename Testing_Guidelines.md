# Testing Guidelines

This document outlines the standards and best practices for writing tests in this Playwright TypeScript framework.

## Test Structure

### Arrange, Act, Assert (AAA) Pattern

All tests should follow the AAA pattern:

```typescript
test('user can login successfully', { tag: '@smoke' }, async ({ page }) => {
  // Arrange - Set up test data and initial state
  const testUser = { username: 'testuser', password: 'password123' };
  
  // Act - Perform the action being tested
  await loginPage.goto();
  await loginPage.fillUsername(testUser.username);
  await loginPage.fillPassword(testUser.password);
  await loginPage.clickLoginButton();
  
  // Assert - Verify the results
  await expect(dashboardPage.welcomeMessage).toContainText(testUser.username);
});
```

## Test Tags

Each test **must** have 1 to 3 metadata tags for categorization:

```typescript
{ tag: ['@smoke', '@regression'] }
```

### Common Tags

- `@smoke` - Critical path tests that verify core functionality
- `@regression` - Tests that verify existing functionality still works
- `@sanity` - Quick sanity checks
- `@ui` - UI-specific tests
- `@api` - API integration tests
- `@slow` - Tests that take longer to execute
- `@wip` - Work in progress, not ready for CI

## Page Object Model (POM)

### Page Class Guidelines

1. **Locators Only** - Define all UI locators as properties
   ```typescript
   export class LoginPage extends BasePage {
     readonly usernameInput = this.page.getByLabel('Username');
     readonly passwordInput = this.page.getByLabel('Password');
     readonly loginButton = this.page.getByRole('button', { name: 'Login' });
   }
   ```

2. **No Assertions** - Page objects should not contain assertions
   ```typescript
   // ❌ Bad
   async clickLoginButton(): Promise<void> {
     await this.loginButton.click();
     expect(this.page).toHaveURL('/dashboard');
   }

   // ✓ Good
   async clickLoginButton(): Promise<void> {
     await this.loginButton.click();
   }
   ```

3. **Use getByRole()** - Prefer semantic locators
   ```typescript
   // ✓ Good - Accessible and semantic
   const button = this.page.getByRole('button', { name: 'Submit' });
   
   // ❌ Avoid - Hard to maintain
   const button = this.page.locator('#submit-btn-123');
   ```

4. **Page-Level Operations Only**
   ```typescript
   async fillLoginForm(username: string, password: string): Promise<void> {
     await this.usernameInput.fill(username);
     await this.passwordInput.fill(password);
   }
   ```

## Action Classes

### Action Class Guidelines

1. **Business Workflows** - Actions encapsulate multi-step business processes
   ```typescript
   export class UserActions {
     async loginAsValidUser(credentials: User): Promise<void> {
       const loginPage = new LoginPage(this.page);
       await loginPage.goto();
       await loginPage.fillLoginForm(credentials.username, credentials.password);
       await loginPage.clickLoginButton();
       // Additional steps as needed
     }
   }
   ```

2. **Use Page Objects** - Delegate UI interactions to page objects
   ```typescript
   // ✓ Good - Action uses page objects
   async checkout(items: Product[]): Promise<void> {
     for (const item of items) {
       await cartPage.addItem(item.id);
     }
     await cartPage.clickCheckout();
     await checkoutPage.fillShippingInfo(this.shippingData);
   }
   ```

3. **Meaningful Names** - Action names should describe the business process
   ```typescript
   // ✓ Good
   async completeUserRegistration(): Promise<void>
   
   // ❌ Avoid
   async click_and_fill(): Promise<void>
   ```

## Test Data

### Data Organization

1. **Models/DTOs** in `test/data/model/`
   ```typescript
   export interface User {
     id: string;
     username: string;
     email: string;
     password: string;
   }
   ```

2. **UAT Data** in `test/data/uat/`
   ```typescript
   export const validUsers = {
     admin: { username: 'admin', password: 'admin123', role: 'admin' },
     user: { username: 'user', password: 'user123', role: 'user' },
   };
   ```

### Best Practices

- Keep test data separate from test logic
- Reuse test data across multiple tests
- Use meaningful data values
- Document special test data scenarios

## Fixtures

### Fixture Setup

Register page objects and actions in `business/fixtures/pageObjectFixture.ts`:

```typescript
export const test = base.extend({
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },
  userActions: async ({ page }, use) => {
    await use(new UserActions(page));
  },
});
```

### Using Fixtures

```typescript
test('login scenario', async ({ loginPage, userActions }) => {
  await userActions.loginAsValidUser(testUser);
  await expect(loginPage.welcomeMessage).toBeVisible();
});
```

## Assertions

### Playwright Assertions

Always use Playwright's `expect()` function for assertions:

```typescript
// ✓ Good
await expect(page).toHaveURL('/dashboard');
await expect(element).toBeVisible();
await expect(input).toHaveValue('expected value');

// ❌ Avoid
if (url !== '/dashboard') throw new Error('URL mismatch');
```

### Assertion Best Practices

1. **Don't Assert Static Text** - Unless it's part of the behavior under test
   ```typescript
   // ❌ Avoid - Brittle, breaks with copy changes
   await expect(button).toContainText('Click Me');
   
   // ✓ Good - Tests meaningful behavior
   await expect(successMessage).toContainText('Login successful');
   ```

2. **Assert Meaningful State** - Verify business logic outcomes
   ```typescript
   // ✓ Good
   await expect(cartCount).toHaveText('3');
   await expect(page).toHaveURL('/checkout');
   ```

3. **Use Soft Assertions** - For multiple assertions
   ```typescript
   await expect.soft(firstName).toHaveValue('John');
   await expect.soft(lastName).toHaveValue('Doe');
   ```

## Wait Strategies

### Auto-Wait

Playwright has built-in auto-wait. **Do not use `page.waitForTimeout()`**:

```typescript
// ✓ Good - Uses auto-wait
await element.click();
await expect(element).toBeVisible();

// ❌ Avoid - Manual waits
await page.waitForTimeout(2000);
```

### Explicit Waits

Use Playwright's explicit waits when needed:

```typescript
// Wait for element to appear
await page.waitForSelector('#modal');

// Wait for URL change
await page.waitForURL('/confirmation');

// Wait for response
await page.waitForResponse(response => response.url().includes('/api/save'));
```

## Code Quality

### TypeScript Strictness

- Maintain `strict: true` in `tsconfig.json`
- No `any` types without good reason
- Use interfaces for data structures

### File Organization

- One page object per file (logical grouping acceptable)
- Clear, descriptive filenames (e.g., `login.page.ts`, `checkout.action.ts`)
- Organize imports at top of file

### Comments

- Use meaningful names instead of comments when possible
- Document complex workflows with inline comments
- Include JSDoc for public methods:

```typescript
/**
 * Completes the user registration flow with provided data
 * @param user - User registration data
 * @returns Promise that resolves when registration is complete
 */
async registerUser(user: User): Promise<void> {
  // Implementation
}
```

## Test Independence

- Tests should not depend on other tests
- Use setup/teardown hooks when needed
- Reset state between tests
- Avoid test data contamination

## Debugging

### Debug Mode

```bash
npx playwright test --debug
```

### UI Mode

```bash
npx playwright test --ui
```

### Verbose Output

```bash
PWDEBUG=1 npx playwright test
```

## CI/CD Considerations

- Tests should be deterministic and reproducible
- Avoid environment-specific hardcoding
- Use environment variables for configuration
- Tag tests appropriately for selective execution
- Monitor flaky tests and investigate root causes

## Performance

- Keep individual tests focused and fast
- Avoid unnecessary page loads or navigation
- Reuse test data when appropriate
- Monitor test execution times in reports
