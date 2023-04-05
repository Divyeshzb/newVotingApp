const { Builder, By, Key, until } = require('selenium-webdriver');
const assert = require('assert');

async function test() {
  const svcUrl = process.env.ROOST_SVC_URL;
  const seleniumServer = process.env.SELENIUM_SERVER;
  
  const driver = await new Builder()
    .usingServer(seleniumServer)
    .forBrowser('chrome')
    .build();
  
  await driver.get(svcUrl);
  
  const cardContents = await driver.findElements(By.className('cardContent'));
  
  for (let i = 0; i < cardContents.length; i++) {
    await cardContents[i].click();
    const postRequests = await driver.executeScript(`
      return window.performance.getEntries()
        .filter(entry => entry.initiatorType === 'xmlhttprequest' && entry.name.includes('/ballot'))
        .map(entry => entry.name);
    `);
    assert(postRequests.length > 0, 'No post requests with ballot endpoint found');
  }
  
  const showResultsButton = await driver.findElement(By.id('showResultsButton'));
  const isButtonVisible = await showResultsButton.isDisplayed();
  assert(isButtonVisible, 'Show Results button is not visible');
  
  await showResultsButton.click();
  const currentUrl = await driver.getCurrentUrl();
  assert(currentUrl.includes('/voter/result'), 'Current page is not a result page');
  
  await driver.quit();
}

test();