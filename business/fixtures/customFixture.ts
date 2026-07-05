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

export const test = base.extend<CustomFixtures>({
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

    contactActions: async ({ homePage, contactPage }, use) => {
        const contactActions = new ContactActions(homePage, contactPage);
        await use(contactActions);
    },

    shoppingActions: async ({ productsPage, cartPage }, use) => {
        const shoppingActions = new ShoppingActions(productsPage, cartPage);
        await use(shoppingActions);
    },
});

test.beforeEach(async ({ page }) => {
    await page.context().clearCookies();
});

test.afterEach(async ({ page }) => {
    await page.context().clearCookies();
});

export { expect };