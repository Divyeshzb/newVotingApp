const webdriver = require('selenium-webdriver');
const assert = require('assert');

const roostSvcUrl = process.env.ROOST_SVC_URL;
const seleniumServer = process.env.SELENIUM_SERVER;

const driver = new webdriver.Builder()
    .usingServer(seleniumServer)
    .withCapabilities(webdriver.Capabilities.chrome())
    .build();

driver.get(roostSvcUrl);

driver.findElements(webdriver.By.className('cardContent'))
    .then(elements => {
        elements.forEach(element => {
            element.click();
            driver.wait(webdriver.until.elementLocated(webdriver.By.css('post-api-call[endpoint="ballot"]')), 5000);
        });
    });

driver.findElements(webdriver.By.css('button.show-results'))
    .then(elements => {
        if (elements.length > 0) {
            elements[0].click();
            driver.wait(webdriver.until.urlContains('/voter/result'), 5000);
            assert.ok(driver.getCurrentUrl().includes('/voter/result'));
        }
    });

driver.quit();