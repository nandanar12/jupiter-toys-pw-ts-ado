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

    getProductRow(productName: string) {
        return this.cartItems.filter({ hasText: productName });
    }

    async getProductPrice(productName: string) {
        const row = this.getProductRow(productName);
        const priceCell = row.getByRole('cell').nth(1);
        return await priceCell.textContent() || '';
    }

    async getProductQuantity(productName: string) {
        const row = this.getProductRow(productName);
        return await row.getByRole('spinbutton').inputValue();
    }

    async getProductSubtotal(productName: string) {
        const row = this.getProductRow(productName);
        const subtotalCell = row.getByRole('cell').nth(3);
        return await subtotalCell.textContent() || '';
    }

    async getTotalAmount() {
        return await this.totalAmount.textContent() || '';
    }

    async getTotalAmountValue() {
        return this.parsePrice(await this.getTotalAmount());
    }

    parsePrice(priceString: string) {
        return parseFloat(priceString.replace(/[^0-9.-]+/g, ''));
    }
}
