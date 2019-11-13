import { browser, by, element } from 'protractor';

// This class stores all PageObjects in Welcome page.
export class AppPage {
  navigateTo() {
    return browser.get('/');
  }

  getHeading() {
    return element(by.css('app-root h4'));
  }

  getFirstNameLabel() {
    return element(by.css('.firstname-label'));
  }

  getFirstNameField() {
    return element(by.css('.first-name-input'));
  }

  getFirstNameEmptyWarningMessage() {
    return element(by.css('.firstname-required'));
  }

  getFirstNameTooShortWarningMessage() {
    return element(by.css('.firstname-min-length'));
  }

  getFirstNameTooLongWarningMessage() {
    return element(by.css('.firstname-max-length'));
  }

  getLastNameLabel() {
    return element(by.css('.lastname-label'));
  }

  getLastNameField() {
    return element(by.css('.last-name-input'));
  }

  getLastNameEmptyWarningMessage() {
    return element(by.css('.lastname-required'));
  }

  getLastNameTooShortWarningMessage() {
    return element(by.css('.lastname-min-length'));
  }

  getLastNameTooLongWarningMessage() {
    return element(by.css('.lastname-max-length'));
  }

  getGenderLabel() {
    return element(by.css('.gender-label'));
  }

  getMaleRadioBtnLabel() {
    return element(by.css('label[class = "custom-control-label"][for = "male"]'));
  }

  getMaleRadioBtn() {
    return element(by.css('input[name = "gender"][type = "radio"][value = "male"]'));
  }

  getFemaleRadioBtnLabel() {
    return element(by.css('label[class = "custom-control-label"][for = "female"]'));
  }

  getFemaleRadioBtn() {
    return element(by.css('input[name = "gender"][type = "radio"][value = "female"]'));
  }

  getEmailLabel() {
    return element(by.css('.email-label'));
  }

  getEmailField() {
    return element(by.css('.email-input'));
  }

  getEmailEmptyWarningMessage() {
    return element(by.css('.email-required'));
  }

  getEmailWrongFormatWarningMessage() {
    return element(by.css('.email-format'));
  }

  getPhoneNumberLabel() {
    return element(by.css('.phone-number-label'));
  }

  getPhoneField() {
    return element(by.css('.phone-input'));
  }

  getPhoneEmptyWarningMessage() {
    return element(by.css('.phone-required'));
  }

  getPhoneWrongFormatWarningMessage() {
    return element(by.css('.phone-pattern'));
  }

  getQualificationLabel() {
    return element(by.css('.qualification-label'));
  }

  getQualificationOptionMaster() {
    return element(by.css('#qualifications')).element(by.css('option[value = "Masters degree"]'));
  }

  getQualificationOptionBachelors() {
    return element(by.css('#qualifications')).element(by.css('option[value = "Bachelors degree"]'));
  }

  getQualificationOptionDoctoral() {
    return element(by.css('#qualifications')).element(by.css('option[value = "Doctoral degree"]'));
  }

  getQualificationOptionAssociate() {
    return element(by.css('#qualifications')).element(by.css('option[value = "Associate degree"]'));
  }

  getCityLabel() {
    return element(by.css('.city-label'));
  }

  getCityField() {
    return element(by.css('.city-input'));
  }

  getCityEmptyWarningMessage() {
    return element(by.css('.city-required'));
  }

  getCityTooShortWarningMessage() {
    return element(by.css('.city-min-length'));
  }

  getCityTooLongWarningMessage() {
    return element(by.css('.city-max-length'));
  }

  getCityWrongFormatWarningMessage() {
    return element(by.css('.city-pattern'));
  }

  getStateLabel() {
    return element(by.css('.state-label'));
  }

  getStateField() {
    return element(by.css('.state-input'));
  }

  getStateEmptyWarningMessage() {
    return element(by.css('.state-required'));
  }

  getStateTooShortWarningMessage() {
    return element(by.css('.state-min-length'));
  }

  getStateTooLongWarningMessage() {
    return element(by.css('.state-max-length'));
  }

  getStateWrongFormatWarningMessage() {
    return element(by.css('.state-format'));
  }

  getZipcodeLabel() {
    return element(by.css('.zipcode-label'));
  }

  getZipcodeField() {
    return element(by.css('.zipcode-input'));
  }

  getZipcodeEmptyWarningMessage() {
    return element(by.css('.zipcode-required'));
  }

  getZipcodeTooShortWarningMessage() {
    return element(by.css('.zipcode-min-length'));
  }

  getZipcodeTooLongWarningMessage() {
    return element(by.css('.zipcode-max-length'));
  }

  getZipcodeWrongFormatWarningMessage() {
    return element(by.css('.zipcode-pattern'));
  }

  getSubmitBtn() {
    return element(by.css('.form-submit'));
  }

  getResetBtn() {
    return element(by.css('.form-cancel'));
  }
}
