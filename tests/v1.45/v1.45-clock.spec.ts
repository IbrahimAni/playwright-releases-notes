import { test, expect } from "playwright/test";

const url = "html/v1.45/clock.html";

test('current time', async ({ page }) => {
    await page.goto(`/${url}`);
    await expect(page.getByTestId('current-time')).toBeVisible();
});

test('set fixied time', async ({ page }) => {
    await page.clock.setFixedTime(new Date('2024-02-02T10:00:00'));
    await page.goto(`/${url}`);
    await expect(page.getByTestId('current-time')).toHaveText('10:00:00 AM');

    await page.clock.setFixedTime(new Date('2024-02-02T10:30:00'));
    await expect(page.getByTestId('current-time')).toHaveText('10:30:00 AM');
});

test("fast forward time", async ({ page }) => {
    await page.clock.install({ time: new Date('2024-02-02T08:00:00') });
    await page.goto(`/${url}`);

    await page.clock.pauseAt(new Date('2024-02-02T10:00:00'));
    await expect(page.getByTestId('current-time')).toHaveText('10:00:00 AM');

    await page.clock.fastForward('30:00');
    await expect(page.getByTestId('current-time')).toHaveText('10:30:00 AM');
});

test("inactivity monitoring", async ({ page }) => {
    await page.clock.install();
    await page.goto(`/${url}`);

    await page.getByRole('button', { name: "Start" }).click();
    await page.clock.fastForward("05:00");

    await expect(page.getByTestId('end-message')).toBeVisible();
});

test("tick through time", async ({ page }) => {
    await page.clock.install({ time: new Date('2024-02-02T08:00:00') });
    await page.goto(`/${url}`);

    await page.clock.pauseAt(new Date('2024-02-02T10:00:00'));
    await expect(page.getByTestId('current-time')).toHaveText('10:00:00 AM');

    await page.clock.runFor(2000);
    await expect(page.getByTestId('current-time')).toHaveText('10:00:02 AM');
});