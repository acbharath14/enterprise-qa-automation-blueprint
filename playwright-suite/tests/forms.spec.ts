import { test, expect } from '../fixtures/test';

/**
 * Form validation: inline errors for bad input, and proof that a valid
 * submission sends exactly the expected payload to the backend.
 */
test.describe('feedback form', () => {
  test('shows inline errors for empty submit', async ({ galleryPage }) => {
    await galleryPage.feedbackSubmit.click();
    await expect(galleryPage.nameError).toHaveText('Name is required.');
    await expect(galleryPage.emailError).toHaveText('Enter a valid email address.');
    await expect(galleryPage.feedbackSuccess).toBeEmpty();
  });

  test('rejects an invalid email', async ({ galleryPage }) => {
    await galleryPage.submitFeedback({ name: 'Ada', email: 'not-an-email' });
    await expect(galleryPage.emailError).toHaveText('Enter a valid email address.');
    await expect(galleryPage.feedbackSuccess).toBeEmpty();
  });

  test('submits valid feedback and sends the right payload', async ({ galleryPage, page }) => {
    const [request] = await Promise.all([
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
