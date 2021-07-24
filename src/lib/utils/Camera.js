const path = require('path');
const puppeteer = require('puppeteer');

const { logger } = require(path.resolve('logger'));

module.exports = class Camera {
  static async caputure(url, filepath) {
    const browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] });
    const page = await browser.newPage();
    await page.setViewport({
      width: 1200,
      height: 800,
    });
    await page.goto(url, { waitUntil: 'networkidle0' });

    // スクリーンショットを保存
    await page.screenshot({
      path: filepath,
      type: 'jpeg', // JPEG形式で保存
      quality: 40, // 品質を0-100で指定
    });
    await browser.close();
    return filepath;
  }
};
