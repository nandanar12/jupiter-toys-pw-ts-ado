import { Locator, Page } from '@playwright/test';
import { BasePage } from './base.page';

export class CartPage extends BasePage {
    readonly cartItems: Locator;
    readonly totalAmount: Locator;

    constructor(page: Page) {
        super(page);
        this.cartItems = page.getByRole('row');
        this.totalAmount = page.getByText(/Total:/);
    }

    getProductRow(productName: string): Locator {
        return this.cartItems.filter({ hasText: productName });
    }

    async getProductPrice(productName: string): Promise<string> {
        const row = this.getProductRow(productName);
        const priceCell = row.locator('td:nth-child(2)');
        return await priceCell.textContent() || '';
    }

    async getProductQuantity(productName: string): Promise<string> {
        const row = this.getProductRow(productName);
        return await row.getByRole('spinbutton').inputValue();
    }

    async getProductSubtotal(productName: string): Promise<string> {
        const row = this.getProductRow(productName);
        const subtotalCell = row.locator('td:nth-child(4)');
        return await subtotalCell.textContent() || '';
    }

    async getTotalAmount(): Promise<string> {
        return await this.totalAmount.textContent() || '';
    }

    async getTotalAmountValue(): Promise<number> {
        return this.parsePrice(await this.getTotalAmount());
    }

    parsePrice(priceString: string): number {
        return parseFloat(priceString.replace(/[^0-9.-]+/g, ''));
    }
}
