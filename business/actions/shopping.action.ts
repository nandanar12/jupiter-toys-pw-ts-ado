import { ProductsPage } from '../pages/products.page';
import { CartPage } from '../pages/cart.page';

export class ShoppingActions {
  private readonly productsPage: ProductsPage;
  private readonly cartPage: CartPage;

  public constructor(productsPage: ProductsPage, cartPage: CartPage) {
    this.productsPage = productsPage;
    this.cartPage = cartPage;
  }

  async buyProducts(products: Array<{ name: string; quantity: number }>): Promise<void> {
    await this.productsPage.gotoShop();
    
    for (const product of products) {
      await this.productsPage.addProductToCart(product.name, product.quantity);
    }
  }

  async navigateToCart(): Promise<void> {
    await this.productsPage.goToCart();
  }

  async getProductDetails(productName: string): Promise<{
    price: number;
    quantity: number;
    subtotal: number;
  }> {
    const priceStr = await this.cartPage.getProductPrice(productName);
    const quantityStr = await this.cartPage.getProductQuantity(productName);
    const subtotalStr = await this.cartPage.getProductSubtotal(productName);

    return {
      price: this.cartPage.parsePrice(priceStr),
      quantity: parseInt(quantityStr.trim()),
      subtotal: this.cartPage.parsePrice(subtotalStr),
    };
  }
}
