import {test, expect} from "playwright/test";
import path from "path";

const url = "html/v1.45/file-upload.html";
const filePath = path.resolve(__dirname, '../../data/v1.45-file.docx');

test('upload file', async ({page}) => {
    await page.goto(`/${url}`);

    await page.getByTestId("file-input").setInputFiles(filePath);
    await expect(page.getByTestId("file-name")).toBeVisible();
    await expect(page.getByTestId("file-name")).toContainText('File uploaded');
});