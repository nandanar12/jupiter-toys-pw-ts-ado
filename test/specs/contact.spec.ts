import { test, expect } from '../../business/fixtures/pageObjectFixture';
import contactTestDataJson from '../data/uat/contact.data.json';
import type { ContactTestData } from '../data/model/contact.model';

const contactTestData = contactTestDataJson as ContactTestData;

test.describe('Contact Form Tests', () => {
  test('TC-001: Contact form validation - empty form submission and error resolution', {
    tag: ['@smoke', '@regression', '@contact'],
  }, async ({ contactActions, contactPage }) => {
    
    await contactActions.navigateToContactPage();
    await contactActions.submitEmptyContactForm();

    // Assert - Verify required field errors are displayed by text
    expect(await contactPage.getRequiredErrorText('forename')).toContain('Forename is required');
    expect(await contactPage.getRequiredErrorText('email')).toContain('Email is required');
    expect(await contactPage.getRequiredErrorText('message')).toContain('Message is required');

    await contactActions.fillContactFormWithData(
      contactTestData.validSubmission1
    );

    // Assert - Verify errors are gone and submission succeeds
    expect(await contactPage.getRequiredErrorText('forename')).not.toContain('Forename is required');
    expect(await contactPage.getRequiredErrorText('email')).not.toContain('Email is required');
    expect(await contactPage.getRequiredErrorText('message')).not.toContain('Message is required');
  });

  test('TC-002: Contact form successful submission performs 5 repeated runs', {
    tag: ['@regression', '@contact'],
  }, async ({ contactActions, contactPage }) => {
    const validSubmissions = [
      contactTestData.validSubmission1,
      contactTestData.validSubmission2,
      contactTestData.validSubmission3,
      contactTestData.validSubmission4,
      contactTestData.validSubmission5,
    ];

    for (const submission of validSubmissions) {
      await contactActions.navigateToContactPage();
      await contactActions.submitContactFormWithData(submission);

      await expect(contactPage.successMessage).toHaveText(
        `Thanks ${submission.forename}, we appreciate your feedback.`
      );
      
      // Click back button to return to contact form
      await contactPage.clickBack();
    }
  });
});
