import { HomePage } from '../pages/home.page';
import { ContactPage } from '../pages/contact.page';

export type ContactFormData = {
  forename: string;
  email: string;
  message: string;
};

export class ContactActions {
  private readonly homePage: HomePage;
  private readonly contactPage: ContactPage;

  public constructor(homePage: HomePage, contactPage: ContactPage) {
    this.homePage = homePage;
    this.contactPage = contactPage;
  }

  async navigateToContactPage(): Promise<void> {
    await this.homePage.gotoHome();
    await this.homePage.navigateToContact();
    await this.contactPage.page.waitForLoadState('networkidle');
  }

  async fillContactFormWithData(data: ContactFormData): Promise<void> {
    await this.contactPage.fillForename(data.forename);
    await this.contactPage.fillEmail(data.email);
    await this.contactPage.fillMessage(data.message);
  }

  async submitContactForm(): Promise<void> {
    await this.contactPage.clickSubmit();
  }

  async submitContactFormWithData(data: ContactFormData): Promise<void> {
    await this.fillContactFormWithData(data);
    await this.submitContactForm();
  }

  async submitEmptyContactForm(): Promise<void> {
    await this.contactPage.clickSubmit();
  }
}
