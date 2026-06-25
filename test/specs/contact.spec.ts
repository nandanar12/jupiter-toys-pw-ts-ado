import { test, expect } from '../../business/fixtures/pageObjectFixture';
import contactTestDataJson from '../data/uat/contact.data.json';
import type { ContactTestData } from '../data/model/contact.model';

const contactTestData = contactTestDataJson as ContactTestData;

test.describe('Contact Form Tests', () => {
    test('TC-001: Contact form validation - empty form submission and error resolution', {
        tag: ['@smoke', '@regression', '@contact'],
    }, async ({ contactActions, contactPage }) => {

        await test.step('Navigate to Contact page', async () => {
            await contactActions.navigateToContactPage();
        });

        await test.step('Submit empty contact form', async () => {
            await contactActions.submitEmptyContactForm();
        });

        await test.step('Verify required field validation messages', async () => {
            await expect(contactPage.getRequiredErrorText('forename'))
                .resolves.toContain('Forename is required');

            await expect(contactPage.getRequiredErrorText('email'))
                .resolves.toContain('Email is required');

            await expect(contactPage.getRequiredErrorText('message'))
                .resolves.toContain('Message is required');
        });

        await contactActions.fillContactFormWithData(
            contactTestData.validSubmission1
        );

        // Assert - Verify errors are gone and submission succeeds
        await test.step('Verify required field errors are cleared', async () => {
            await expect(contactPage.getRequiredErrorText('forename'))
                .resolves.not.toContain('Forename is required');

            await expect(contactPage.getRequiredErrorText('email'))
                .resolves.not.toContain('Email is required');

            await expect(contactPage.getRequiredErrorText('message'))
                .resolves.not.toContain('Message is required');
        });

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
