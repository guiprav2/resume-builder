let assert = require('assert');
let { test } = require('@playwright/test');

test('can create and input new candidate basic details', async ({ page }) => {
  await page.goto('http://localhost:3000');
  await page.click('.new-candidate-btn');

  await page.fill('input[placeholder="First Name"]', 'Gui');
  await page.fill('input[placeholder="Last Name"]', 'Prá');
  await page.fill('input[placeholder="Headline"]', 'Software Developer');
  await page.fill('input[placeholder="E-mail"]', 'gui@guiprav.com');
  await page.fill('input[placeholder="Phone"]', '+55 51 98902-9275');
  await page.fill('input[placeholder="Location"]', 'Porto Alegre, RS');
  await page.fill('input[placeholder="LinkedIn URL"]', 'https://www.linkedin.com/in/guiprav/');
  await page.fill('textarea[placeholder="Summary"]', 'Proud of my expertise.');
  await page.waitForTimeout(500);

  let frame = await (await page.$('iframe')).contentFrame();
  let content = await frame.content();

  for (let value of [
    'Gui Prá',
    'Software Developer',
    'gui@guiprav.com',
    '+55 51 98902-9275',
    'Porto Alegre, RS',
    'https://www.linkedin.com/in/guiprav/',
    'Proud of my expertise.'
  ]) {
    assert.ok(content.includes(value), `Value not found in iframe: ${value}`);
  }
});