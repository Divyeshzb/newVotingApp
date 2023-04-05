const { Builder, By, until } = require('selenium-webdriver');

(async function example() {
  let driver = await new Builder().usingServer(`${SELENIUM_SERVER}`).forBrowser('chrome').build();
  try {
    await driver.get(`${ROOST_SVC_URL}`);
    let cardContents = await driver.findElements(By.className('cardContent'));
    for (let i = 0; i < cardContents.length; i++) {
      await cardContents[i].click();
      await driver.wait(until.urlContains('/ballot'));
      let logs = await driver.manage().logs().get('performance');
      let ballotApiCalls = logs.filter(log => log.message.includes('ballot'));
      console.log(ballotApiCalls);
    }
    let showResultsButton = await driver.findElement(By.id('showResultsButton'));
    let isDisplayed = await showResultsButton.isDisplayed();
    if (isDisplayed) {
      await showResultsButton.click();
      await driver.wait(until.urlContains('/voter/result'));
      let currentUrl = await driver.getCurrentUrl();
      console.log(currentUrl);
    }
  } finally {
    await driver.quit();
  }
})();