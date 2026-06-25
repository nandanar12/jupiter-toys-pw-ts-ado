import { test as base, expect } from '@playwright/test';
import { HomePage } from '../pages/home.page';
import { ContactPage } from '../pages/contact.page';
import { ProductsPage } from '../pages/products.page';
import { CartPage } from '../pages/cart.page';
import { ContactActions } from '../actions/contact.action';
import { ShoppingActions } from '../actions/shopping.action';

export type CustomFixtures = {
    homePage: HomePage;
    contactPage: ContactPage;
    productsPage: ProductsPage;
    cartPage: CartPage;
    contactActions: ContactActions;
    shoppingActions: ShoppingActions;
};

/**
 * Custom test fixture that provides page objects and action classes.
 * Includes global beforeEach/afterEach hooks for test cleanup.
 * Extend this base test instance to register and inject page objects and actions.
 * This ensures dependency injection and clean test setup.
 */
export const test = base.extend<CustomFixtures>({
    // Register page objects
    homePage: async ({ page }, use) => {
        const homePage = new HomePage(page);
        await use(homePage);
    },

    contactPage: async ({ page }, use) => {
        const contactPage = new ContactPage(page);
        await use(contactPage);
    },

    productsPage: async ({ page }, use) => {
        const productsPage = new ProductsPage(page);
        await use(productsPage);
    },

    cartPage: async ({ page }, use) => {
        const cartPage = new CartPage(page);
        await use(cartPage);
    },

    // Register action classes
    contactActions: async ({ homePage, contactPage }, use) => {
        const contactActions = new ContactActions(homePage, contactPage);
        await use(contactActions);
    },

    shoppingActions: async ({ productsPage, cartPage }, use) => {
        const shoppingActions = new ShoppingActions(productsPage, cartPage);
        await use(shoppingActions);
    },
});

// Global beforeEach hook - runs before each test
test.beforeEach(async ({ page }) => {
    // Clean up before each test
    await page.context().clearCookies();
});

// Global afterEach hook - runs after each test
test.afterEach(async ({ page }) => {
    // Clean up after each test
    await page.context().clearCookies();
});

export { expect };