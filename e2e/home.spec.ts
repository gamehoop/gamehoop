import { expect, test } from '@playwright/test';
import { signUp } from './utils';

test('navigates to the home page after sign up', async ({ page }) => {
  await signUp(page);
  await expect(page).toHaveURL('/');
});
