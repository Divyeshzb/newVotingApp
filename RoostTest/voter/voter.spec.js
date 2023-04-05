const { Builder, By, Key, until } = require('selenium-webdriver');
const server = '$SELENIUM_SERVER';
const url = '$ROOST_SVC_URL';

async function runTest() {
  let driver = await new Builder().usingServer(server).forBrowser('chrome').build();
  try {
    // Visit webpage
    await driver.get(url);

    // Get all elements with class 'cardContent'
    const elements = await driver.findElements(By.className('cardContent'));

    // For each element click on the component and intercept post api call with ballot endpoint in it.
    for (let i = 0; i < elements.length; i++) {
      await elements[i].click();
      await driver.wait(until.urlContains('/ballot'), 10000);
    }

    // Check if "Show Results" button is visible in the page.
    const showResultsButton = await driver.findElement(By.xpath("//button[contains(text(), 'Show Results')]"));
    const isButtonVisible = await showResultsButton.isDisplayed();

    // On click of "Show Results" button check the redirect url of current page contains '/voter/result'
    if (isButtonVisible) {
      await showResultsButton.click();
      await driver.wait(until.urlContains('/voter/result'), 10000);
    }
  } finally {
    await driver.quit();
  }
}

runTest();