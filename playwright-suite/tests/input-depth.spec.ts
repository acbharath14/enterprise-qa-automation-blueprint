import { test, expect } from '../fixtures/test';
import { join } from 'node:path';

declare const __dirname: string;

/**
 * Input depth: native select, drag-and-drop, and file upload.
 *
 * These cover the input types beyond click/fill/type:
 * - selectOption for native <select> dropdowns
 * - dragTo for HTML5 drag-and-drop
 * - setInputFiles for <input type="file">
 */
test.describe('input depth', () => {
  test('selectOption chooses a native dropdown value', async ({ page }) => {
    await page.goto('/');
    const sortSelect = page.getByTestId('sort-select');

    // Select by value…
    await sortSelect.selectOption('price_asc');
    await expect(sortSelect).toHaveValue('price_asc');

    // …or by visible label.
    await sortSelect.selectOption({ label: 'Price: high to low' });
    await expect(sortSelect).toHaveValue('price_desc');
  });

  test('dragTo moves the draggable onto the drop target', async ({ page }) => {
    await page.goto('/');
    // Open the demos section via JS (it's hidden to preserve the visual baseline).
    await page.evaluate(() => {
      document.querySelector('[data-testid="input-demos"]')?.removeAttribute('hidden');
    });

    const source = page.getByTestId('drag-source');
    const target = page.getByTestId('drop-target');

    // Manual drag via mouse events — more reliable than dragTo() for HTML5 DnD.
    const sourceBox = await source.boundingBox();
    const targetBox = await target.boundingBox();
    if (!sourceBox || !targetBox) throw new Error('missing bounding box');

    await page.mouse.move(
      sourceBox.x + sourceBox.width / 2,
      sourceBox.y + sourceBox.height / 2,
    );
    await page.mouse.down();
    await page.mouse.move(
      targetBox.x + targetBox.width / 2,
      targetBox.y + targetBox.height / 2,
      { steps: 10 },
    );
    await page.mouse.up();

    await expect(page.getByTestId('drop-result')).toBeVisible();
    await expect(page.getByTestId('drop-result')).toHaveText('Dropped!');
  });

  test('setInputFiles uploads a file via the file input', async ({ page }) => {
    await page.goto('/');
    // Open the demos section via JS (hidden to preserve the visual baseline).
    await page.evaluate(() => {
      document.querySelector('[data-testid="input-demos"]')?.removeAttribute('hidden');
    });

    // Create a real file on disk for the upload.
    const filePath = join(__dirname, 'helpers', 'upload-fixture.txt');
    await page.getByTestId('demo-file-input').setInputFiles(filePath);

    await expect(page.getByTestId('file-name')).toBeVisible();
    await expect(page.getByTestId('file-name')).toHaveText('upload-fixture.txt');
  });
});
