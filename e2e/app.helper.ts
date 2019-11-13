import { browser, ExpectedConditions } from 'protractor';

// This class stores all helper functions for Welcome page.
export class AppHelper {
  // Smartly wait until the web element is visible in DOM.
  smartWait(elem) {
    browser.wait(ExpectedConditions.presenceOf(elem), 3000, 'Element taking too long to appear in the DOM');
  }

  // Get text and remove extra newlines from given web element after the element is loaded.
  getText(elem) {
    this.smartWait(elem);
    return (elem.getText());
  }

  // Wait until the web element is visible and enabled and then click on it.
  click(elem) {
    this.smartWait(elem);
    browser.wait(ExpectedConditions.elementToBeClickable(elem), 3000);
    elem.click();
  }

  // Click on the first web element to set the focus on it and then click on the second web element to reset the focus on the first element.
  focusThenUnfocus(firstElem, secondElem) {
    browser.actions().
     click(firstElem).
     click(secondElem).
     perform();
  }

  // Wait until the web element is visible in DOM and send input.
  sendKeys(elem, input) {
    this.smartWait(elem);
    elem.sendKeys(input);
  }

  // Generate a random string with given length using Math libriary.
  randomString(len) {
    return Math.random().toString(2).substring(2, 2 + len);
  }

  // Scroll to view, making sure the web element is visible on user screen.
  scrollToView(elem) {
    browser.controlFlow().execute(function() {
      browser.executeScript('arguments[0].scrollIntoView(true)', elem.getWebElement());
    });
  }

  // Perform click twice. This method is used to combat a weird scenario where click() has to be called twice to actually perform the click.
  // In manual only single click is needed, there was a simimar case on github being closed with fixing.
  // My suspection would be performing series of mouse actions focusThenUnfocus() right before the click event.
  // Github link: github: https://github.com/angular/protractor/issues/2360
  doubleClick(elem) {
    this.click(elem);
    this.click(elem);
  }
}
