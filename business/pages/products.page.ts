import { Locator, Page } from '@playwright/test';
import { BasePage } from './base.page';

export class ProductsPage extends BasePage {
    readonly productItems: Locator;
    readonly cartLink: Locator;

    constructor(page: Page) {
        super(page);
        this.productItems = page.getByRole('listitem');
        this.cartLink = page.getByRole('link', { name: /cart/i });
    }

    async gotoShop(): Promise<void> {
        await this.goto('#/shop');
    }

    getBuyButton(productName: string): Locator {
        return this.productItems
            .filter({ has: this.page.getByRole('heading', { name: productName }) })
            .getByRole('link', { name: /buy/i });
    }

    async addProductToCart(productName: string, quantity: number): Promise<void> {
        const buyButton = this.getBuyButton(productName);

        for (let i = 0; i < quantity; i++) {
            await buyButton.click();
        }
    }

    async goToCart(): Promise<void> {
        await this.cartLink.click();
    }
}
