const webdriver = require('selenium-webdriver');
const By = webdriver.By;
const until = webdriver.until;
const url = process.env.ROOST_SVC_URL;
const server = process.env.SELENIUM_SERVER;

const driver = new webdriver.Builder()
  .usingServer(server)
  .withCapabilities(webdriver.Capabilities.chrome())
  .build();

driver.get(url);

driver.wait(until.titleContains('Election Commission Admin Portal'), 5000);

driver.findElement(By.xpath('//button[text()="Add Candidate"]')).click();

driver.wait(until.titleContains('Add Candidate'), 5000);

driver.wait(until.elementTextContains(driver.findElement(By.tagName('body')), 'Add your candidates for election of K8s distribution here'), 5000);

driver.wait(until.elementTextContains(driver.findElement(By.tagName('body')), "Candidate's Name"), 5000);

driver.wait(until.elementTextContains(driver.findElement(By.tagName('body')), "Candidate's Picture"), 5000);

driver.quit();