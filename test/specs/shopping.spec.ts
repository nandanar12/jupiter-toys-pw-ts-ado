import { test, expect } from '../../business/fixtures/customFixture';
import shoppingTestDataJson from '../data/uat/shopping.data.json';
import type { ShoppingTestData } from '../data/model/shopping.model';

const shoppingTestData = shoppingTestDataJson as ShoppingTestData;

test.describe('Shopping Cart Tests', () => {
    test('TC-003: Verify cart totals and product details', {
        tag: ['@regression', '@shopping'],
    }, async ({ shoppingActions, cartPage }) => {

        const testProducts = shoppingTestData.testProducts;

        await test.step('Buy selected products', async () => {
            await shoppingActions.buyProducts(testProducts);
        });

        await test.step('Navigate to cart page', async () => {
            await shoppingActions.navigateToCart();
        });

        let calculatedTotal = 0;

        for (const product of testProducts) {
            await test.step(
                `Verify ${product.name} pricing and subtotal`,
                async () => {
                    const details = await shoppingActions.getProductDetails(product.name);

                    expect(
                        details.price,
                        `${product.name} ${details.price} to equal ${product.price}`
                    ).toBe(product.price);

                    expect(
                        details.quantity,
                        `${product.name} ${details.quantity} to equal ${product.quantity}`
                    ).toBe(product.quantity);

                    const expectedSubtotal = details.price * details.quantity;

                    expect(
                        details.subtotal,
                        `Subtotal for ${product.name}: got ${details.subtotal}, expected ${expectedSubtotal}`
                    ).toBe(expectedSubtotal);

                    calculatedTotal += details.subtotal;
                }
            );
        }

        // Verify total = sum of subtotals
        const cartTotal = await cartPage.getTotalAmountValue();
        await test.step(`Verify cart total=${cartTotal} equals calculated total=${calculatedTotal}`, async () => {
            expect(
                cartTotal,
                `Cart total: got ${cartTotal}, expected ${calculatedTotal}`
            ).toBe(calculatedTotal);
        });
    });
});
