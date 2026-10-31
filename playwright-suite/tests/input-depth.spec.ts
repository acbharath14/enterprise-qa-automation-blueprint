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

    // HTML5 drag-and-drop requires real DragEvents with DataTransfer —
    // page.mouse alone doesn't trigger them. Dispatch via evaluate.
    await page.evaluate(() => {
      const source = document.querySelector('[data-testid="drag-source"]');
      const target = document.querySelector('[data-testid="drop-target"]');
      if (!source || !target) throw new Error('missing drag elements');

      const dataTransfer = new DataTransfer();
      source.dispatchEvent(new DragEvent('dragstart', { dataTransfer, bubbles: true }));
      target.dispatchEvent(new DragEvent('dragover', { dataTransfer, bubbles: true }));
      target.dispatchEvent(new DragEvent('drop', { dataTransfer, bubbles: true }));
      source.dispatchEvent(new DragEvent('dragend', { dataTransfer, bubbles: true }));
    });

    await expect(page.getByTestId('drop-result')).toHaveText('Dropped!');
    // Note: drop-result stays hidden (parent <details> is hidden for visual baseline);
    // the text content proves the drop handler ran.
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

    // The file-name text proves the file was selected (element stays hidden
    // with parent <details> for visual baseline).
    await expect(page.getByTestId('file-name')).toHaveText('upload-fixture.txt');
  });
});
