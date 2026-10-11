import { expect, test } from '@playwright/test'

test('a young person can report, follow their plan, reopen and delete', async ({ page }) => {
  await page.goto('/')
  await page
    .getByRole('link', { name: /Make a private report/ })
    .first()
    .click()

  await page.getByRole('button', { name: 'Continue' }).click()
  await expect(page.getByRole('main').getByRole('alert')).toContainText('Choose the option')

  await page.getByText('Account hacked or privacy').click()
  await page.getByRole('button', { name: 'Continue' }).click()
  await page.getByLabel('What happened, in your own words').fill('Fictional: someone logged into my account.')
  await page.getByRole('button', { name: 'Continue' }).click()
  await page.getByRole('button', { name: 'Continue' }).click()
  await page.getByText(/I understand my report is saved/).click()
  await page.getByRole('button', { name: 'Save my private report' }).click()

  const id = (await page.getByTestId('Report ID').textContent())!
  const key = (await page.getByTestId('Access key').textContent())!
  await expect(page.getByRole('button', { name: 'Show my safety plan' })).toBeDisabled()
  await page.getByText('I have saved my report ID').click()
  await page.getByRole('button', { name: 'Show my safety plan' }).click()

  await page.getByText('Change your passwords').click()
  await expect(page.getByText(/1 of \d+ steps done/)).toBeVisible()
  await page.getByLabel('New note').fill('Fictional: turned on two-step verification.')
  await page.getByRole('button', { name: 'Add note' }).click()
  await expect(page.getByText('Fictional: turned on two-step verification.')).toBeVisible()

  await page.goto('/open')
  await page.getByLabel('Report ID').fill(id)
  await page.getByLabel('Access key', { exact: true }).fill('WRONG-KEY00-00000-00000-00000-00000')
  await page.getByRole('button', { name: /Open my report/ }).click()
  await expect(page.getByRole('main').getByRole('alert')).toContainText('could not open')

  await page.getByLabel('Access key', { exact: true }).fill(key.toLowerCase())
  await page.getByRole('button', { name: /Open my report/ }).click()
  await expect(page.getByText(/1 of \d+ steps done/)).toBeVisible()
  await expect(page.getByText('Fictional: turned on two-step verification.')).toBeVisible()

  await page.getByRole('button', { name: 'Delete permanently' }).click()
  await page.getByRole('dialog').getByRole('button', { name: 'Delete permanently' }).click()
  await expect(page.getByText('Your report has been deleted')).toBeVisible()
})

test('pages ship a strict content security policy', async ({ request }) => {
  const response = await request.get('/')
  const csp = response.headers()['content-security-policy']
  expect(csp).toContain("frame-ancestors 'none'")
  expect(csp).toMatch(/script-src 'self' 'nonce-[^']+' 'strict-dynamic'/)
  expect(response.headers()['referrer-policy']).toBe('no-referrer')
})
