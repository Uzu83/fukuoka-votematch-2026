import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { readFileSync } from "node:fs";
import { electionData } from "../lib/generated-data";

const questions = JSON.parse(readFileSync("fixtures/questions.json", "utf8")) as { text: string }[];
const sample = electionData.source === "fixtures";
test.beforeEach(async ({ page }) => { await page.goto("/"); });

function audit(page: import("@playwright/test").Page) {
  return new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"]).analyze();
}

test("intro and informational pages pass WCAG AA automated checks", async ({ page }) => {
  expect((await audit(page)).violations).toEqual([]);
  for (const route of ["about", "candidates"]) {
    await page.goto(`/${route}/`);
    expect((await audit(page)).violations).toEqual([]);
  }
});

test("all questions, skip, results and every candidate detail work on a narrow screen", async ({ page }) => {
  await page.getByRole("button", { name: "はじめる" }).click();
  for (let i = 0; i < (sample ? 20 : electionData.questions.length); i++) {
    await expect(page.getByRole("heading", { name: sample ? questions[i].text : electionData.questions[i].text, exact: true })).toBeFocused();
    await page.getByRole("radio", { name: "賛成", exact: true }).check();
    if (i === 0) await page.getByRole("checkbox", { name: "この問題を重視する" }).check();
    if (i === 1) await page.getByRole("button", { name: "わからない／この質問をスキップ" }).click();
    else await page.getByRole("button", { name: i === 19 ? "結果を見る" : "次へ", exact: true }).click();
  }
  await expect(page.getByRole("heading", { name: "比較結果", exact: true })).toBeFocused();
  await expect(page.locator("main li").filter({ has: page.getByText("質問ごとの回答・立場・出典を見る") })).toHaveCount(13);
  const firstDetails = page.getByText("質問ごとの回答・立場・出典を見る").first();
  await firstDetails.click();
  await expect(page.getByText("（重視 ×2）", { exact: false }).first()).toBeVisible();
  const dimension = await page.evaluate(() => ({ page: document.documentElement.scrollWidth, viewport: window.innerWidth }));
  expect(dimension.page).toBeLessThanOrEqual(dimension.viewport);
  expect((await audit(page)).violations).toEqual([]);
});

test("skipping every question is graceful and audit-clean", async ({ page }) => {
  await page.getByRole("button", { name: "はじめる" }).click();
  for (let i = 0; i < (sample ? 20 : electionData.questions.length); i++) {
    await page.getByRole("button", { name: "わからない／この質問をスキップ" }).click();
  }
  await expect(page.getByText("比較できる回答がありません。", { exact: false })).toBeVisible();
  expect(await page.getByText("比較対象なし", { exact: true }).count()).toBe(13);
  expect((await audit(page)).violations).toEqual([]);
});

test("keyboard can start and navigate the first answer", async ({ page }) => {
  await page.getByRole("button", { name: "はじめる" }).focus();
  await page.keyboard.press("Enter");
  await page.getByRole("radio", { name: "賛成", exact: true }).focus();
  await page.keyboard.press("ArrowDown");
  await expect(page.getByRole("radio", { name: "どちらかといえば賛成" })).toBeChecked();
  await page.getByRole("button", { name: "次へ", exact: true }).focus();
  await page.keyboard.press("Enter");
  await expect(page.getByText("質問 2 /", { exact: false })).toBeVisible();
});
