const { Builder, By, Key, until } = require('selenium-webdriver');
const fetch = require('node-fetch');

(async function example() {
  let driver = await new Builder()
    .usingServer(process.env.SELENIUM_SERVER)
    .forBrowser('chrome')
    .build();
  try {
    await driver.get(process.env.ROOST_SVC_URL);
    const cardContents = await driver.findElements(By.className('cardContent'));
    for (const cardContent of cardContents) {
      await cardContent.click();
      await driver.wait(until.urlContains('/ballot'));
      const interceptedRequest = await driver.executeScript(`
        const fetch = window.fetch;
        window.fetch = function (url, options) {
          if (url.includes('/ballot') && options.method === 'POST') {
            return fetch(url, options).then((response) => {
              window.interceptedRequest = {
                url,
                options,
                response: {
                  status: response.status,
                  body: response.json(),
                },
              };
              return response;
            });
          }
          return fetch(url, options);
        };
      `);
      const interceptedRequestBody = await driver.executeScript('return window.interceptedRequest.options.body;');
      const response = await fetch(interceptedRequest.url, interceptedRequest.options);
      const responseBody = await response.json();
      console.log(interceptedRequestBody, responseBody);
    }
    const showResultsButton = await driver.findElement(By.id('show-results-button'));
    const isShowResultsButtonVisible = await showResultsButton.isDisplayed();
    if (isShowResultsButtonVisible) {
      await showResultsButton.click();
      await driver.wait(until.urlContains('/voter/result'));
      const currentUrl = await driver.getCurrentUrl();
      console.log(currentUrl);
    }
  } finally {
    await driver.quit();
  }
})();