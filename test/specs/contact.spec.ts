import { test, expect } from '../../business/fixtures/customFixture';
import contactTestDataJson from '../data/uat/contact.data.json';
import type { ContactTestData } from '../data/model/contact.model';
import { contactRequiredFields } from '../data/model/contactRequiredFields.model';

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
            const requiredFields = contactRequiredFields;

            for (const { field, message } of requiredFields) {
                await expect(contactPage.getRequiredErrorText(field))
                    .resolves.toContain(message);
            }
        });

        await test.step('Fill contact form with valid data', async () => {
            await contactActions.fillContactFormWithData(
                contactTestData.validSubmission1
            );
        });

        // Assert - Verify errors are gone and submission succeeds
        await test.step('Verify required field errors are cleared', async () => {
            for (const { field, message } of contactRequiredFields) {
                await expect(contactPage.getRequiredErrorText(field))
                    .resolves.not.toContain(message);
            }
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
            await test.step(`Submit contact form for ${submission.forename}`, async () => {
                await contactActions.navigateToContactPage();
                await contactActions.submitContactFormWithData(submission);

                await expect(contactPage.successMessage).toHaveText(
                    `Thanks ${submission.forename}, we appreciate your feedback.`
                );

                await contactPage.clickBack();
            });
        }
    });
});
