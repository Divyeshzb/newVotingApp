const { Builder, By, Key, until } = require('selenium-webdriver');
const assert = require('assert');

(async function example() {
  let driver = await new Builder().forBrowser("chrome")
        .usingServer(`${SELENIUM_SERVER}`)
        .build();
  try {
    await driver.get(`${ROOST_SVC_URL}`);
    
    const cardContents = await driver.findElements(By.className('cardContent'));
    for (const cardContent of cardContents) {
      await cardContent.click();
      await driver.executeScript('window.stop();'); // stop page from loading to intercept post api call
      const networkLogs = await driver.manage().logs().get('performance');
      const ballotEndpointCalls = networkLogs.filter(log => log.message.includes('/ballot'));
      assert(ballotEndpointCalls.length > 0, 'No post api call with ballot endpoint found.');
    }
    
    const showResultsButton = await driver.findElement(By.xpath('//button[contains(text(), "Show Results")]'));
    assert(await showResultsButton.isDisplayed(), 'Show Results button is not visible.');
    
    await showResultsButton.click();
    const currentUrl = await driver.getCurrentUrl();
    assert(currentUrl.includes('/voter/result'), 'Redirect url does not contain /voter/result.');
  } finally {
    await driver.quit();
  }
})()
