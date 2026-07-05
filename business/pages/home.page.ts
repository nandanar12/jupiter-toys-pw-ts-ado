import { Locator, Page } from '@playwright/test';
import { BasePage } from './base.page';

export class HomePage extends BasePage {
  readonly contactLink: Locator;

  constructor(page: Page) {
    super(page);
    this.contactLink = page.getByRole('link', { name: /Contact/i });
  }

  async gotoHome(){
    await this.goto('/');
  }

  async navigateToContact(){
    await this.contactLink.click();
  }
}
