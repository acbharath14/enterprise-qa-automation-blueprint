import { test, expect } from '../fixtures/test';

/**
 * Form validation: inline errors for bad input, and proof that a valid
 * submission sends exactly the expected payload to the backend.
 */
test.describe('feedback form', () => {
  test('shows inline errors for empty submit', async ({ galleryPage }) => {
    await galleryPage.feedbackSubmit.click();
    // Soft assertions: report every validation error in one run.
    await expect.soft(galleryPage.nameError).toHaveText('Name is required.');
    await expect.soft(galleryPage.emailError).toHaveText('Enter a valid email address.');
    await expect(galleryPage.feedbackSuccess).toBeEmpty();
  });

  test('rejects an invalid email', async ({ galleryPage }) => {
    await galleryPage.submitFeedback({ name: 'Ada', email: 'not-an-email' });
    await expect(galleryPage.emailError).toHaveText('Enter a valid email address.');
    await expect(galleryPage.feedbackSuccess).toBeEmpty();
  });

  test('submits valid feedback and sends the right payload', async ({ galleryPage, page }) => {
    let request;
    await test.step('fill and submit the form', async () => {
      [request] = await Promise.all([
        page.waitForRequest(
          (req) => req.url().includes('/api/feedback') && req.method() === 'POST',
        ),
        galleryPage.submitFeedback({
          name: 'Ada',
          email: 'ada@example.com',
          rating: '5',
          message: 'Great release!',
          subscribe: true,
        }),
      ]);
    });

    await test.step('verify the payload and the confirmation', async () => {
      expect(request.postDataJSON()).toMatchObject({
        name: 'Ada',
        email: 'ada@example.com',
        rating: '5',
        message: 'Great release!',
        subscribe: true,
      });
      await expect(galleryPage.feedbackSuccess).toContainText('Thanks, Ada!');
    });
  });
});
