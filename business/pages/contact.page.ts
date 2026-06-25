import { Locator, Page } from '@playwright/test';
import { BasePage } from './base.page';

export class ContactPage extends BasePage {
  readonly forenameInput: Locator;
  readonly emailInput: Locator;
  readonly messageTextarea: Locator;
  readonly submitButton: Locator;
  readonly successMessage: Locator;
  readonly forenameError: Locator;
  readonly emailError: Locator;
  readonly messageError: Locator;
  readonly backButton: Locator;

  constructor(page: Page) {
    super(page);
    this.forenameInput = page.getByRole('textbox', { name: /forename/i });
    this.emailInput = page.getByRole('textbox', { name: /email/i });
    this.messageTextarea = page.getByRole('textbox', { name: /message/i });
    this.submitButton = page.getByRole('link', { name: /submit/i });
    this.successMessage = page.locator('.alert-success');
    this.forenameError = page.getByText('Forename is required');
    this.emailError = page.getByText('Email is required');
    this.messageError = page.getByText('Message is required');
    this.backButton = page.getByRole('link', { name: /back/i });
  }

  async fillForename(forename: string): Promise<void> {
    await this.forenameInput.fill(forename);
  }

  async fillEmail(email: string): Promise<void> {
    await this.emailInput.fill(email);
  }

  async fillMessage(message: string): Promise<void> {
    await this.messageTextarea.fill(message);
  }

  async clickSubmit(): Promise<void> {
    await this.submitButton.click();
  }

  private getRequiredErrorLocator(field: 'forename' | 'email' | 'message'): Locator {
    switch (field) {
      case 'forename':
        return this.forenameError;
      case 'email':
        return this.emailError;
      case 'message':
        return this.messageError;
    }
  }

  async getRequiredErrorText(field: 'forename' | 'email' | 'message'): Promise<string> {
    const errorLocator = this.getRequiredErrorLocator(field);
    if (!(await errorLocator.isVisible({ timeout: 1000 }))) {
      return '';
    }

    return await errorLocator.textContent() || '';
  }

  async clickBack(): Promise<void> {
    await this.backButton.click();
  }
}
