const {Builder, By, Key, until} = require('selenium-webdriver');
const proxy = require('selenium-webdriver/proxy');

const ROOST_SVC_URL = `${ROOST_SVC_URL}`;
const SELENIUM_SERVER = `${SELENIUM_SERVER}`;
const BALLOT_ENDPOINT = '/api/ballot';
const RESULTS_ENDPOINT = '/voter/result';

(async function example() {
  let driver = await new Builder()
    .forBrowser('chrome')
    .usingServer(SELENIUM_SERVER)
    .setProxy(proxy.manual({http: 'http://my.proxy.com:8080'}))
    .build();
  try {
    await driver.get(ROOST_SVC_URL);
    let cardContents = await driver.findElements(By.className('cardContent'));
    for (let i = 0; i < cardContents.length; i++) {
      await cardContents[i].click();
      await driver.wait(until.elementLocated(By.css('post')), 10000);
      let postRequest = await driver.executeScript('return window.performance.getEntries()[0].name;');
      if (postRequest.includes(BALLOT_ENDPOINT)) {
        console.log('API call intercepted successfully');
      }
    }
    let showResultsButton = await driver.findElement(By.id('showResultsButton'));
    if (await showResultsButton.isDisplayed()) {
      await showResultsButton.click();
      let currentUrl = await driver.getCurrentUrl();
      if (currentUrl.includes(RESULTS_ENDPOINT)) {
        console.log('Redirected to results page successfully');
      }
    }
  } finally {
    await driver.quit();
  }
})();