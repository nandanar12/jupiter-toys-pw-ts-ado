import { HomePage } from '../pages/home.page';
import { ContactPage } from '../pages/contact.page';
import type { ContactFormData } from '../../test/data/model/contact.model';

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
    await this.contactPage.forenameInput.waitFor({ state: 'visible' });
  }

  async fillContactFormWithData(data: ContactFormData): Promise<void> {
    await this.contactPage.fillForename(data.forename);
    await this.contactPage.fillEmail(data.email);
    await this.contactPage.fillMessage(data.message);
  }

  async submitContactForm(): Promise<void> {
    await this.contactPage.clickSubmit();
  }

  async submitContactFormWithMandatoryData(data: ContactFormData): Promise<void> {
    await this.fillContactFormWithData(data);
    await this.submitContactForm();
  }

  async submitEmptyContactForm(): Promise<void> {
    await this.contactPage.clickSubmit();
  }
}
