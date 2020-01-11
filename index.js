const puppeteer = require("puppeteer");

async function scrape(link, converter) {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  await page.goto(converter);
  page.setDefaultTimeout(0);
  page.on("dialog", async dialog => {
    await dialog.accept(link);
  });
  await page.waitForSelector("#open_link");
  await (await page.$("#open_link")).click();

  await page.waitForSelector(".file_details");
  await (await page.$("#preset_dropdown")).click();
  const [element] = await page.$x(`//*[@id="480p"]`);
  await element.click();

  await (await page.$(".button_1.button_1_smaller")).click();
  await page.waitForSelector(`#download_file_link[href*=".mp4"]`);
  await (await page.$("#download_file_link")).click();
}
