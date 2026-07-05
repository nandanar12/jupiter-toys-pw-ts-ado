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

  async navigateToContactPage() {
    await this.homePage.gotoHome();
    await this.homePage.navigateToContact();
    await this.contactPage.forenameInput.waitFor({ state: 'visible' });
  }

  async fillContactFormWithData(data: ContactFormData) {
    await this.contactPage.fillForename(data.forename);
    await this.contactPage.fillEmail(data.email);
    await this.contactPage.fillMessage(data.message);
  }

  async submitContactForm() {
    await this.contactPage.clickSubmit();
  }

  async submitContactFormWithMandatoryData(data: ContactFormData) {
    await this.fillContactFormWithData(data);
    await this.submitContactForm();
  }

  async submitEmptyContactForm() {
    await this.contactPage.clickSubmit();
  }
}
