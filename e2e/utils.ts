import { faker } from '@faker-js/faker';
import { Page } from '@playwright/test';

const testUser = {
  email: faker.internet.email(),
  name: faker.person.firstName(),
  password: faker.internet.password(),
};

export async function signIn(page: Page): Promise<void> {
  await page.goto('/sign-in');

  await page.waitForLoadState();
  await page.waitForTimeout(1000);

  const emailInput = page.getByTestId('email-input');
  const passwordInput = page.getByTestId('password-input');

  await emailInput.waitFor();
  await emailInput.fill(testUser.email);

  await passwordInput.waitFor();
  await passwordInput.fill(testUser.password);

  await page.getByRole('button', { name: 'Sign In', exact: true }).click();

  await page.waitForURL('/');
}

export async function signUp(page: Page): Promise<void> {
  await page.goto('/sign-up');

  await page.waitForLoadState();
  await page.waitForTimeout(1000);

  const emailInput = page.getByTestId('email-input');
  const nameInput = page.getByTestId('name-input');
  const passwordInput = page.getByTestId('password-input');
  const passwordConfirmationInput = page.getByTestId(
    'password-confirmation-input',
  );

  await emailInput.waitFor();
  await emailInput.fill(testUser.email);

  await nameInput.waitFor();
  await nameInput.fill(testUser.name);

  await passwordInput.waitFor();
  await passwordInput.fill(testUser.password);

  await passwordConfirmationInput.waitFor();
  await passwordConfirmationInput.fill(testUser.password);

  await page.getByRole('button', { name: 'Sign Up', exact: true }).click();

  await page.waitForURL('/');
}
