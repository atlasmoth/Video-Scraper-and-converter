const puppeteer = require("puppeteer");
const path = require("path");
const fs = require("fs");
async function scrape(downloadPath, ...links) {
  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: null,
    args: ["--window-size=1366,768", "--window-position=0,0"]
  });
  const processor = async link => {
    const page = await browser.newPage();
    page.setDefaultTimeout(0);
    await page.goto("https://convert-video-online.com/");
    await page._client.send("Page.setDownloadBehavior", {
      behavior: "allow",
      downloadPath: path.resolve(downloadPath)
    });

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
  };
  return Promise.all(links.map(item => processor(item)));
}
