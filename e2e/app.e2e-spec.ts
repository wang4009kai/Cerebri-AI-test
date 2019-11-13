import { AppPage } from './app.po';
import { AppHelper} from './app.helper';
import {browser} from 'protractor';

describe('angular-demo-app App', () => {
  let page: AppPage;
  let helper: AppHelper;

  beforeEach(() => {
    page = new AppPage();
    helper = new AppHelper();
  });

  // Verifying the welcome message is properly displayed.
  it('should display welcome message', () => {
    page.navigateTo();
    expect(helper.getText(page.getHeading())).toEqual('Welcome to Cerebri AI');
  });

  // Verifying the first name label is properly displayed.
  it('should display first name label', () => {
    page.navigateTo();
    expect(helper.getText(page.getFirstNameLabel())).toEqual('First Name');
  });

  // Verifying the last name label is properly displayed.
  it('should display last name label', () => {
    page.navigateTo();
    expect(helper.getText(page.getLastNameLabel())).toEqual('Last Name');
  });

  // Verifying the gender label is properly displayed.
  it('should display gender label', () => {
    page.navigateTo();
    expect(helper.getText(page.getGenderLabel())).toEqual('Gender');
  });

  // Verifying the male radio button label is properly displayed.
  it('should display male radio button label', () => {
    page.navigateTo();
    expect(helper.getText(page.getMaleRadioBtnLabel())).toEqual('Male');
  });

  // Verifying the female radio button label is properly displayed.
  it('should display female radio button label', () => {
    page.navigateTo();
    expect(helper.getText(page.getFemaleRadioBtnLabel())).toEqual('Female');
  });

  // Verifying the email label is properly displayed.
  it('should display email label', () => {
    page.navigateTo();
    expect(helper.getText(page.getEmailLabel())).toEqual('Email');
  });

  // Verifying the phone number label is properly displayed.
  it('should display phone number label', () => {
    page.navigateTo();
    expect(helper.getText(page.getPhoneNumberLabel())).toEqual('Phone Number');
  });

  // Verifying the qualification label is properly displayed.
  it('should display qualification label', () => {
    page.navigateTo();
    expect(helper.getText(page.getQualificationLabel())).toEqual('Qualification');
  });

  // Verifying the qualification option master degree label is properly displayed.
  it('should display qualification option master degree label', () => {
    page.navigateTo();
    expect(helper.getText(page.getQualificationOptionMaster())).toContain('Masters degree');
  });

  // Verifying the qualification option bachelor degree label is properly displayed.
  it('should display qualification option bachelor degree label', () => {
    page.navigateTo();
    expect(helper.getText(page.getQualificationOptionBachelors())).toContain('Bachelors degree');
  });

  // Verifying the qualification option doctoral degree label is properly displayed.
  it('should display qualification option doctoral degree label', () => {
    page.navigateTo();
    expect(helper.getText(page.getQualificationOptionDoctoral())).toContain('Doctoral degree');
  });

  // Verifying the qualification option associate degree label is properly displayed.
  it('should display qualification option associate degree label', () => {
    page.navigateTo();
    expect(helper.getText(page.getQualificationOptionAssociate())).toContain('Associate degree');
  });

  // Verifying the city label is properly displayed.
  it('should display city label', () => {
    page.navigateTo();
    expect(helper.getText(page.getCityLabel())).toEqual('City');
  });

  // Verifying the state label is properly displayed.
  it('should display state label', () => {
    page.navigateTo();
    expect(helper.getText(page.getStateLabel())).toEqual('State');
  });

  // Verifying the zipcode label is properly displayed.
  it('should display zipcode label', () => {
    page.navigateTo();
    expect(helper.getText(page.getZipcodeLabel())).toEqual('Zipcode');
  });

  // Verifying the submit button label is properly displayed.
  it('should display submit button label', () => {
    page.navigateTo();
    expect(helper.getText(page.getSubmitBtn())).toEqual('Submit');
  });

  // Verifying the reset form button label is properly displayed.
  it('should display reset form button label', () => {
    page.navigateTo();
    expect(helper.getText(page.getResetBtn())).toEqual('Reset Form');
  });

  // Verifying the reset form button is enabled and clickable.
  it('reset form button should be enabled', () => {
    page.navigateTo();
    expect(page.getResetBtn().isEnabled()).toBe(true);
  });

  // Verifying the submit form button is disabled at the beginning.
  it('submit form button should be disabled at the beginning', () => {
    page.navigateTo();
    expect(page.getSubmitBtn().isEnabled()).toBe(false);
  });

  // Verifying the male radio button is not checked by default.
  it('male radio button is not checked by default', () => {
    page.navigateTo();
    expect(page.getMaleRadioBtn().isSelected()).toBe(false);
  });

  // Verifying the female radio button is not checked by default.
  it('female radio button is not checked by default', () => {
    page.navigateTo();
    expect(page.getFemaleRadioBtn().isSelected()).toBe(false);
  });

  // Verifying the male radio button is checked after click.
  it('male radio button is checked after click', () => {
    page.navigateTo();
    helper.click(page.getMaleRadioBtn());
    expect(page.getMaleRadioBtn().isSelected()).toBe(true);
  });

  // Verifying the female radio button is checked after click.
  it('female radio button is checked after click', () => {
    page.navigateTo();
    helper.click(page.getFemaleRadioBtn());
    expect(page.getFemaleRadioBtn().isSelected()).toBe(true);
  });

  // Verifying the male ratio button is unchecked after female radio button is checked.
  it('male radio button is unchecked after female radio button is click', () => {
    page.navigateTo();
    helper.click(page.getMaleRadioBtn());
    helper.click(page.getFemaleRadioBtn());
    expect(page.getMaleRadioBtn().isSelected()).toBe(false);
  });

  // Verifying the female ratio button is unchecked after male radio button is checked.
  it('female radio button is unchecked after male radio button is click', () => {
    page.navigateTo();
    helper.click(page.getFemaleRadioBtn());
    helper.click(page.getMaleRadioBtn());
    expect(page.getFemaleRadioBtn().isSelected()).toBe(false);
  });

  // Verifying the master qualification dropdown option is not selected by default.
  it('master qualification dropdown option is not selected by default', () => {
    page.navigateTo();
    expect(page.getQualificationOptionMaster().isSelected()).toBe(false);
  });

  // Verifying the bachelor qualification dropdown option is not selected by default.
  it('bachelor qualification dropdown option is not selected by default', () => {
    page.navigateTo();
    expect(page.getQualificationOptionBachelors().isSelected()).toBe(false);
  });

  // Verifying the doctoral qualification dropdown option is not selected by default.
  it('doctoral qualification dropdown option is not selected by default', () => {
    page.navigateTo();
    expect(page.getQualificationOptionDoctoral().isSelected()).toBe(false);
  });

  // Verifying the associate qualification dropdown option is not selected by default.
  it('associate qualification dropdown option is not selected by default', () => {
    page.navigateTo();
    expect(page.getQualificationOptionAssociate().isSelected()).toBe(false);
  });

  // Verifying the master qualification dropdown option is selected after click.
  it('master qualification dropdown option is not selected by default', () => {
    page.navigateTo();
    helper.click(page.getQualificationOptionMaster());
    expect(page.getQualificationOptionMaster().isSelected()).toBe(true);
  });

  // Verifying the bachelor qualification dropdown option is selected after click.
  it('bachelor qualification dropdown option is not selected by default', () => {
    page.navigateTo();
    helper.click(page.getQualificationOptionBachelors());
    expect(page.getQualificationOptionBachelors().isSelected()).toBe(true);
  });

  // Verifying the doctoral qualification dropdown option is selected after click.
  it('doctoral qualification dropdown option is not selected by default', () => {
    page.navigateTo();
    helper.click(page.getQualificationOptionDoctoral());
    expect(page.getQualificationOptionDoctoral().isSelected()).toBe(true);
  });

  // Verifying the associate qualification dropdown option is selected after click.
  it('associate qualification dropdown option is not selected by default', () => {
    page.navigateTo();
    helper.click(page.getQualificationOptionAssociate());
    expect(page.getQualificationOptionAssociate().isSelected()).toBe(true);
  });

  // Verifying the master qualification dropdown option is deselected after other options are clicked.
  it('master qualification dropdown option is not selected by default', () => {
    page.navigateTo();
    helper.click(page.getQualificationOptionMaster());
    helper.click(page.getQualificationOptionAssociate());
    expect(page.getQualificationOptionMaster().isSelected()).toBe(false);
  });

  // Verifying the bachelor qualification dropdown option is deselected after other options are clicked.
  it('bachelor qualification dropdown option is not selected by default', () => {
    page.navigateTo();
    helper.click(page.getQualificationOptionBachelors());
    helper.click(page.getQualificationOptionMaster());
    expect(page.getQualificationOptionBachelors().isSelected()).toBe(false);
  });

  // Verifying the doctoral qualification dropdown option is deselected after other options are clicked.
  it('doctoral qualification dropdown option is not selected by default', () => {
    page.navigateTo();
    helper.click(page.getQualificationOptionDoctoral());
    helper.click(page.getQualificationOptionMaster());
    expect(page.getQualificationOptionDoctoral().isSelected()).toBe(false);
  });

  // Verifying the associate qualification dropdown option is deselected after other options are clicked.
  it('associate qualification dropdown option is not selected by default', () => {
    page.navigateTo();
    helper.click(page.getQualificationOptionAssociate());
    helper.click(page.getQualificationOptionMaster());
    expect(page.getQualificationOptionAssociate().isSelected()).toBe(false);
  });

  // Verifying the first name empty warning message is not shown when the page is loaded.
  it('first name is required warning message should not be shown right after the page is loaded', () => {
    page.navigateTo();
    expect(page.getFirstNameEmptyWarningMessage().isPresent()).toBe(false);
  });

  // Verifying the last name empty warning message is not shown when the page is loaded.
  it('last name is required warning message should not be shown right after the page is loaded', () => {
    page.navigateTo();
    expect(page.getLastNameEmptyWarningMessage().isPresent()).toBe(false);
  });

  // Verifying the email empty warning message is not shown when the page is loaded.
  it('email is required warning message should not be shown right after the page is loaded', () => {
    page.navigateTo();
    expect(page.getEmailEmptyWarningMessage().isPresent()).toBe(false);
  });

  // Verifying the phone number empty warning message is not shown when the page is loaded.
  it('phone number is required warning message should not be shown right after the page is loaded', () => {
    page.navigateTo();
    expect(page.getPhoneEmptyWarningMessage().isPresent()).toBe(false);
  });

  // Verifying the city empty warning message is not shown when the page is loaded.
  it('city is required warning message should not be shown right after the page is loaded', () => {
    page.navigateTo();
    expect(page.getCityEmptyWarningMessage().isPresent()).toBe(false);
  });

  // Verifying the state empty warning message is not shown when the page is loaded.
  it('state is required warning message should not be shown right after the page is loaded', () => {
    page.navigateTo();
    expect(page.getStateEmptyWarningMessage().isPresent()).toBe(false);
  });

  // Verifying the zipcode empty warning message is not shown when the page is loaded.
  it('zipcode is required warning message should not be shown right after the page is loaded', () => {
    page.navigateTo();
    expect(page.getZipcodeEmptyWarningMessage().isPresent()).toBe(false);
  });

  // Verifying the first name empty warning message is shown when first name input was focused but still empty.
  // This action is simulated by clicking on designated field first and then click on a unrelated field to move the focus away.
  it('first name is required warning message should be shown if the input is left empty', () => {
    page.navigateTo();
    helper.focusThenUnfocus(page.getFirstNameField(), page.getLastNameField());
    expect(page.getFirstNameEmptyWarningMessage().isPresent()).toBe(true);
  });

  // Verifying the first name empty warning message is same as expected.
  // This action is simulated by clicking on designated field first and then click on a unrelated field to move the focus away.
  it('first name empty warning message is same as expected', () => {
    page.navigateTo();
    helper.focusThenUnfocus(page.getFirstNameField(), page.getLastNameField());
    expect(helper.getText(page.getFirstNameEmptyWarningMessage())).toEqual('First Name is required');
  });

  // Verifying the last name empty warning message is shown when last name input was focused but still empty.
  // This action is simulated by clicking on designated field first and then click on a unrelated field to move the focus away.
  it('last name is required warning message should be shown if the input is left empty', () => {
    page.navigateTo();
    helper.focusThenUnfocus(page.getLastNameField(), page.getFirstNameField());
    expect(page.getLastNameEmptyWarningMessage().isPresent()).toBe(true);
  });

  // Verifying the last name empty warning message is same as expected.
  // This action is simulated by clicking on designated field first and then click on a unrelated field to move the focus away.
  it('last name empty warning message is same as expected', () => {
    page.navigateTo();
    helper.focusThenUnfocus(page.getLastNameField(), page.getFirstNameField());
    expect(helper.getText(page.getLastNameEmptyWarningMessage())).toEqual('Last Name is required');
  });

  // Verifying the email empty warning message is shown when email input was focused but still empty.
  // This action is simulated by clicking on designated field first and then click on a unrelated field to move the focus away.
  it('email is required warning message should be shown if the input is left empty', () => {
    page.navigateTo();
    helper.focusThenUnfocus(page.getEmailField(), page.getLastNameField());
    expect(page.getEmailEmptyWarningMessage().isPresent()).toBe(true);
  });

  // Verifying the email empty warning message is same as expected.
  // This action is simulated by clicking on designated field first and then click on a unrelated field to move the focus away.
  it('email empty warning message is same as expected', () => {
    page.navigateTo();
    helper.focusThenUnfocus(page.getEmailField(), page.getFirstNameField());
    expect(helper.getText(page.getEmailEmptyWarningMessage())).toEqual('Email is required');
  });

  // Verifying the phone number empty warning message is shown when phone input was focused but still empty.
  // This action is simulated by clicking on designated field first and then click on a unrelated field to move the focus away.
  it('phone number is required warning message should be shown if the input is left empty', () => {
    page.navigateTo();
    helper.focusThenUnfocus(page.getPhoneField(), page.getLastNameField());
    expect(page.getPhoneEmptyWarningMessage().isPresent()).toBe(true);
  });

  // Verifying the phone number empty warning message is same as expected.
  // This action is simulated by clicking on designated field first and then click on a unrelated field to move the focus away.
  it('phone number empty warning message is same as expected', () => {
    page.navigateTo();
    helper.focusThenUnfocus(page.getPhoneField(), page.getFirstNameField());
    expect(helper.getText(page.getPhoneEmptyWarningMessage())).toEqual('Phone number is required');
  });

  // Verifying the city empty warning message is shown when city input was focused but still empty.
  // This action is simulated by clicking on designated field first and then click on a unrelated field to move the focus away.
  it('city is required warning message should be shown if the input is left empty', () => {
    page.navigateTo();
    helper.focusThenUnfocus(page.getCityField(), page.getLastNameField());
    expect(page.getCityEmptyWarningMessage().isPresent()).toBe(true);
  });

  // Verifying the city empty warning message is same as expected.
  // This action is simulated by clicking on designated field first and then click on a unrelated field to move the focus away.
  it('city empty warning message is same as expected', () => {
    page.navigateTo();
    helper.focusThenUnfocus(page.getCityField(), page.getFirstNameField());
    expect(helper.getText(page.getCityEmptyWarningMessage())).toEqual('City is required');
  });

  // Verifying the state empty warning message is shown when state input was focused but still empty.
  // This action is simulated by clicking on designated field first and then click on a unrelated field to move the focus away.
  it('state is required warning message should be shown if the input is left empty', () => {
    page.navigateTo();
    helper.focusThenUnfocus(page.getStateField(), page.getLastNameField());
    expect(page.getStateEmptyWarningMessage().isPresent()).toBe(true);
  });

  // Verifying the state empty warning message is same as expected.
  // This action is simulated by clicking on designated field first and then click on a unrelated field to move the focus away.
  it('state empty warning message is same as expected', () => {
    page.navigateTo();
    helper.focusThenUnfocus(page.getStateField(), page.getFirstNameField());
    expect(helper.getText(page.getStateEmptyWarningMessage())).toEqual('State is required');
  });

  // Verifying the zipcode empty warning message is shown when zipcode input was focused but still empty.
  // This action is simulated by clicking on designated field first and then click on a unrelated field to move the focus away.
  it('zipcode is required warning message should be shown if the input is left empty', () => {
    page.navigateTo();
    helper.focusThenUnfocus(page.getZipcodeField(), page.getLastNameField());
    expect(page.getZipcodeEmptyWarningMessage().isPresent()).toBe(true);
  });

  // Verifying the zipcode empty warning message is same as expected.
  // This action is simulated by clicking on designated field first and then click on a unrelated field to move the focus away.
  it('zipcode empty warning message is same as expected', () => {
    page.navigateTo();
    helper.focusThenUnfocus(page.getZipcodeField(), page.getFirstNameField());
    expect(helper.getText(page.getZipcodeEmptyWarningMessage())).toEqual('Zipcode is required');
  });

  // Verifying the first name min length warning message is not shown by default.
  it('first name is too short warning message should not shown by default', () => {
    page.navigateTo();
    expect(page.getFirstNameTooShortWarningMessage().isPresent()).toBe(false);
  });

  // Verifying the first name min length warning message is shown when input is less than 3 chars.
  // This action is simulated by clicking on designated field first and then click on a unrelated field to move the focus away.
  it('first name is too short warning message should be shown when input is less than 3 chars', () => {
    page.navigateTo();
    helper.sendKeys(page.getFirstNameField(), helper.randomString(2));
    helper.focusThenUnfocus(page.getFirstNameField(), page.getLastNameField());
    expect(page.getFirstNameTooShortWarningMessage().isPresent()).toBe(true);
  });

  // Verifying the first name too short warning message is same as expected.
  // This action is simulated by clicking on designated field first and then click on a unrelated field to move the focus away.
  it('first name too short warning message is same as expected', () => {
    page.navigateTo();
    helper.sendKeys(page.getFirstNameField(), helper.randomString(2));
    helper.focusThenUnfocus(page.getFirstNameField(), page.getLastNameField());
    expect(helper.getText(page.getFirstNameTooShortWarningMessage())).toEqual('First Name must be at least 3 characters');
  });

  // Verifying the first name min length warning message is not shown when input is more than 3 chars.
  // This action is simulated by clicking on designated field first and then click on a unrelated field to move the focus away.
  it('first name is too short warning message should not be shown when input is more than 3 chars', () => {
    page.navigateTo();
    helper.sendKeys(page.getFirstNameField(), helper.randomString(3));
    helper.focusThenUnfocus(page.getFirstNameField(), page.getLastNameField());
    expect(page.getFirstNameTooShortWarningMessage().isPresent()).toBe(false);
  });

  // Verifying the last name min length warning message is not shown by default.
  it('last name is too short warning message should not shown by default', () => {
    page.navigateTo();
    expect(page.getLastNameTooShortWarningMessage().isPresent()).toBe(false);
  });

  // Verifying the last name min length warning message is shown when input is less than 3 chars.
  // This action is simulated by clicking on designated field first and then click on a unrelated field to move the focus away.
  it('last name is too short warning message should be shown when input is less than 3 chars', () => {
    page.navigateTo();
    helper.sendKeys(page.getLastNameField(), helper.randomString(2));
    helper.focusThenUnfocus(page.getLastNameField(), page.getFirstNameField());
    expect(page.getLastNameTooShortWarningMessage().isPresent()).toBe(true);
  });

  // Verifying the last name too short warning message is same as expected.
  // This action is simulated by clicking on designated field first and then click on a unrelated field to move the focus away.
  it('last name too short warning message is same as expected', () => {
    page.navigateTo();
    helper.sendKeys(page.getLastNameField(), helper.randomString(2));
    helper.focusThenUnfocus(page.getLastNameField(), page.getFirstNameField());
    expect(helper.getText(page.getLastNameTooShortWarningMessage())).toEqual('Last Name must be at least 3 characters');
  });

  // Verifying the last name min length warning message is not shown when input is more than 3 chars.
  // This action is simulated by clicking on designated field first and then click on a unrelated field to move the focus away.
  it('last name is too short warning message should not be shown when input is more than 3 chars', () => {
    page.navigateTo();
    helper.sendKeys(page.getLastNameField(), helper.randomString(3));
    helper.focusThenUnfocus(page.getLastNameField(), page.getFirstNameField());
    expect(page.getLastNameTooShortWarningMessage().isPresent()).toBe(false);
  });

  // Verifying the city min length warning message is not shown by default.
  it('city is too short warning message should not shown by default', () => {
    page.navigateTo();
    expect(page.getCityTooShortWarningMessage().isPresent()).toBe(false);
  });

  // Verifying the city min length warning message is shown when input is less than 3 chars.
  // This action is simulated by clicking on designated field first and then click on a unrelated field to move the focus away.
  it('city is too short warning message should be shown when input is less than 3 chars', () => {
    page.navigateTo();
    helper.sendKeys(page.getCityField(), helper.randomString(2));
    helper.focusThenUnfocus(page.getCityField(), page.getFirstNameField());
    expect(page.getCityTooShortWarningMessage().isPresent()).toBe(true);
  });

  // Verifying the city too short warning message is same as expected.
  // This action is simulated by clicking on designated field first and then click on a unrelated field to move the focus away.
  it('city too short warning message is same as expected', () => {
    page.navigateTo();
    helper.sendKeys(page.getCityField(), helper.randomString(2));
    helper.focusThenUnfocus(page.getCityField(), page.getFirstNameField());
    expect(helper.getText(page.getCityTooShortWarningMessage())).toEqual('City should have at least 3 letters');
  });

  // Verifying the city min length warning message is not shown when input is more than 3 chars.
  // This action is simulated by clicking on designated field first and then click on a unrelated field to move the focus away.
  it('city is too short warning message should not be shown when input is more than 3 chars', () => {
    page.navigateTo();
    helper.sendKeys(page.getCityField(), helper.randomString(3));
    helper.focusThenUnfocus(page.getCityField(), page.getFirstNameField());
    expect(page.getCityTooShortWarningMessage().isPresent()).toBe(false);
  });

  // Verifying the state min length warning message is not shown by default.
  it('state is too short warning message should not shown by default', () => {
    page.navigateTo();
    expect(page.getStateTooShortWarningMessage().isPresent()).toBe(false);
  });

  // Verifying the state min length warning message is shown when input is less than 3 chars.
  // This action is simulated by clicking on designated field first and then click on a unrelated field to move the focus away.
  it('state is too short warning message should be shown when input is less than 3 chars', () => {
    page.navigateTo();
    helper.sendKeys(page.getStateField(), helper.randomString(2));
    helper.focusThenUnfocus(page.getStateField(), page.getFirstNameField());
    expect(page.getStateTooShortWarningMessage().isPresent()).toBe(true);
  });

  // Verifying the state too short warning message is same as expected.
  // This action is simulated by clicking on designated field first and then click on a unrelated field to move the focus away.
  it('state too short warning message is same as expected', () => {
    page.navigateTo();
    helper.sendKeys(page.getStateField(), helper.randomString(2));
    helper.focusThenUnfocus(page.getStateField(), page.getFirstNameField());
    expect(helper.getText(page.getStateTooShortWarningMessage())).toEqual('State should have at least 3 letters');
  });

  // Verifying the state min length warning message is not shown when input is more than 3 chars.
  // This action is simulated by clicking on designated field first and then click on a unrelated field to move the focus away.
  it('state is too short warning message should not be shown when input is more than 3 chars', () => {
    page.navigateTo();
    helper.sendKeys(page.getStateField(), helper.randomString(3));
    helper.focusThenUnfocus(page.getStateField(), page.getFirstNameField());
    expect(page.getStateTooShortWarningMessage().isPresent()).toBe(false);
  });

  // Verifying the zipcode min length warning message is not shown by default.
  it('zipcode is too short warning message should not shown by default', () => {
    page.navigateTo();
    expect(page.getZipcodeTooShortWarningMessage().isPresent()).toBe(false);
  });

  // Verifying the zipcode min length warning message is shown when input is less than 5 chars.
  // This action is simulated by clicking on designated field first and then click on a unrelated field to move the focus away.
  it('zipcode is too short warning message should be shown when input is less than 5 chars', () => {
    page.navigateTo();
    helper.sendKeys(page.getZipcodeField(), helper.randomString(4));
    helper.focusThenUnfocus(page.getZipcodeField(), page.getFirstNameField());
    expect(page.getZipcodeTooShortWarningMessage().isPresent()).toBe(true);
  });

  // Verifying the zipcode too short warning message is same as expected.
  // This action is simulated by clicking on designated field first and then click on a unrelated field to move the focus away.
  it('zipcode too short warning message is same as expected', () => {
    page.navigateTo();
    helper.sendKeys(page.getZipcodeField(), helper.randomString(4));
    helper.focusThenUnfocus(page.getZipcodeField(), page.getFirstNameField());
    expect(helper.getText(page.getZipcodeTooShortWarningMessage())).toEqual('Zipcode should have at least 5 digits');
  });

  // Verifying the zipcode min length warning message is not shown when input is exactly 5 chars.
  // This action is simulated by clicking on designated field first and then click on a unrelated field to move the focus away.
  it('zipcode is too short warning message should not be shown when input is exactly 5 chars', () => {
    page.navigateTo();
    helper.sendKeys(page.getZipcodeField(), helper.randomString(5));
    helper.focusThenUnfocus(page.getZipcodeField(), page.getFirstNameField());
    expect(page.getZipcodeTooShortWarningMessage().isPresent()).toBe(false);
  });

  // Verifying the first name max length warning message is not shown by default.
  it('first name is too long warning message should not shown by default', () => {
    page.navigateTo();
    expect(page.getFirstNameTooLongWarningMessage().isPresent()).toBe(false);
  });

  // Verifying the first name max length warning message is shown when input is more than 20 chars.
  // This action is simulated by clicking on designated field first and then click on a unrelated field to move the focus away.
  it('first name is too long warning message should be shown when input is more than 20 chars', () => {
    page.navigateTo();
    helper.sendKeys(page.getFirstNameField(), helper.randomString(21));
    helper.focusThenUnfocus(page.getFirstNameField(), page.getLastNameField());
    expect(page.getFirstNameTooLongWarningMessage().isPresent()).toBe(true);
  });

  // Verifying the first name too long warning message is same as expected.
  // This action is simulated by clicking on designated field first and then click on a unrelated field to move the focus away.
  it('first name too long warning message is same as expected', () => {
    page.navigateTo();
    helper.sendKeys(page.getFirstNameField(), helper.randomString(21));
    helper.focusThenUnfocus(page.getFirstNameField(), page.getLastNameField());
    expect(helper.getText(page.getFirstNameTooLongWarningMessage())).toEqual('First Name should not be more than 20 characters');
  });

  // Verifying the first name max length warning message is not shown when input is less than 20 chars.
  // This action is simulated by clicking on designated field first and then click on a unrelated field to move the focus away.
  it('first name is too long warning message should not be shown when input is less than 20 chars', () => {
    page.navigateTo();
    helper.sendKeys(page.getFirstNameField(), helper.randomString(19));
    helper.focusThenUnfocus(page.getFirstNameField(), page.getLastNameField());
    expect(page.getFirstNameTooLongWarningMessage().isPresent()).toBe(false);
  });

  // Verifying the last name max length warning message is not shown by default.
  it('last name is too long warning message should not shown by default', () => {
    page.navigateTo();
    expect(page.getLastNameTooLongWarningMessage().isPresent()).toBe(false);
  });

  // Verifying the last name max length warning message is shown when input is more than 20 chars.
  // This action is simulated by clicking on designated field first and then click on a unrelated field to move the focus away.
  it('last name is too long warning message should be shown when input is more than 20 chars', () => {
    page.navigateTo();
    helper.sendKeys(page.getLastNameField(), helper.randomString(21));
    helper.focusThenUnfocus(page.getLastNameField(), page.getFirstNameField());
    expect(page.getLastNameTooLongWarningMessage().isPresent()).toBe(true);
  });

  // Verifying the last name too long warning message is same as expected.
  // This action is simulated by clicking on designated field first and then click on a unrelated field to move the focus away.
  it('last name too long warning message is same as expected', () => {
    page.navigateTo();
    helper.sendKeys(page.getLastNameField(), helper.randomString(21));
    helper.focusThenUnfocus(page.getLastNameField(), page.getFirstNameField());
    expect(helper.getText(page.getLastNameTooLongWarningMessage())).toEqual('Last Name should not be more than 20 characters');
  });

  // Verifying the last name max length warning message is not shown when input is less than 20 chars.
  // This action is simulated by clicking on designated field first and then click on a unrelated field to move the focus away.
  it('last name is too long warning message should not be shown when input is less than 20 chars', () => {
    page.navigateTo();
    helper.sendKeys(page.getLastNameField(), helper.randomString(19));
    helper.focusThenUnfocus(page.getLastNameField(), page.getFirstNameField());
    expect(page.getLastNameTooLongWarningMessage().isPresent()).toBe(false);
  });

  // Verifying the city max length warning message is not shown by default.
  it('city is too long warning message should not shown by default', () => {
    page.navigateTo();
    expect(page.getCityTooLongWarningMessage().isPresent()).toBe(false);
  });

  // Verifying the city max length warning message is shown when input is more than 20 chars.
  // This action is simulated by clicking on designated field first and then click on a unrelated field to move the focus away.
  it('city is too long warning message should be shown when input is more than 20 chars', () => {
    page.navigateTo();
    helper.sendKeys(page.getCityField(), helper.randomString(21));
    helper.focusThenUnfocus(page.getCityField(), page.getFirstNameField());
    expect(page.getCityTooLongWarningMessage().isPresent()).toBe(true);
  });

  // Verifying the city too long warning message is same as expected.
  // This action is simulated by clicking on designated field first and then click on a unrelated field to move the focus away.
  it('city too long warning message is same as expected', () => {
    page.navigateTo();
    helper.sendKeys(page.getCityField(), helper.randomString(21));
    helper.focusThenUnfocus(page.getCityField(), page.getFirstNameField());
    expect(helper.getText(page.getCityTooLongWarningMessage())).toEqual('City should not exceed 20 characters length');
  });

  // Verifying the city max length warning message is not shown when input is less than 20 chars.
  // This action is simulated by clicking on designated field first and then click on a unrelated field to move the focus away.
  it('city is too long warning message should not be shown when input is less than 20 chars', () => {
    page.navigateTo();
    helper.sendKeys(page.getCityField(), helper.randomString(19));
    helper.focusThenUnfocus(page.getCityField(), page.getFirstNameField());
    expect(page.getCityTooLongWarningMessage().isPresent()).toBe(false);
  });

  // Verifying the state max length warning message is not shown by default.
  it('state is too long warning message should not shown by default', () => {
    page.navigateTo();
    expect(page.getStateTooLongWarningMessage().isPresent()).toBe(false);
  });

  // Verifying the state max length warning message is shown when input is more than 20 chars.
  // This action is simulated by clicking on designated field first and then click on a unrelated field to move the focus away.
  it('state is too long warning message should be shown when input is more than 20 chars', () => {
    page.navigateTo();
    helper.sendKeys(page.getStateField(), helper.randomString(21));
    helper.focusThenUnfocus(page.getStateField(), page.getFirstNameField());
    expect(page.getStateTooLongWarningMessage().isPresent()).toBe(true);
  });

  // Verifying the state too long warning message is same as expected.
  // This action is simulated by clicking on designated field first and then click on a unrelated field to move the focus away.
  it('state too long warning message is same as expected', () => {
    page.navigateTo();
    helper.sendKeys(page.getStateField(), helper.randomString(21));
    helper.focusThenUnfocus(page.getStateField(), page.getFirstNameField());
    expect(helper.getText(page.getStateTooLongWarningMessage())).toEqual('State should not exceed 20 characters length');
  });

  // Verifying the state max length warning message is not shown when input is less than 20 chars.
  // This action is simulated by clicking on designated field first and then click on a unrelated field to move the focus away.
  it('state is too long warning message should not be shown when input is less than 20 chars', () => {
    page.navigateTo();
    helper.sendKeys(page.getStateField(), helper.randomString(19));
    helper.focusThenUnfocus(page.getStateField(), page.getFirstNameField());
    expect(page.getStateTooLongWarningMessage().isPresent()).toBe(false);
  });

  // Verifying the zipcode max length warning message is not shown by default.
  it('zipcode is too long warning message should not shown by default', () => {
    page.navigateTo();
    expect(page.getZipcodeTooLongWarningMessage().isPresent()).toBe(false);
  });

  // Verifying the zipcode max length warning message is shown when input is more than 5 chars.
  // This action is simulated by clicking on designated field first and then click on a unrelated field to move the focus away.
  it('zipcode is too long warning message should be shown when input is more than 5 chars', () => {
    page.navigateTo();
    helper.sendKeys(page.getZipcodeField(), helper.randomString(6));
    helper.focusThenUnfocus(page.getZipcodeField(), page.getFirstNameField());
    expect(page.getZipcodeTooLongWarningMessage().isPresent()).toBe(true);
  });

  // Verifying the zipcode too long warning message is same as expected.
  // This action is simulated by clicking on designated field first and then click on a unrelated field to move the focus away.
  it('zipcode too long warning message is same as expected', () => {
    page.navigateTo();
    helper.sendKeys(page.getZipcodeField(), helper.randomString(6));
    helper.focusThenUnfocus(page.getZipcodeField(), page.getFirstNameField());
    expect(helper.getText(page.getZipcodeTooLongWarningMessage())).toEqual('Zipcode should not have more than 5 digits');
  });

  // Verifying the zipcode max length warning message is not shown when input is less than 20 chars.
  // This action is simulated by clicking on designated field first and then click on a unrelated field to move the focus away.
  it('zipcode is too long warning message should not be shown when input is exactly 5 chars', () => {
    page.navigateTo();
    helper.sendKeys(page.getZipcodeField(), helper.randomString(5));
    helper.focusThenUnfocus(page.getZipcodeField(), page.getFirstNameField());
    expect(page.getZipcodeTooLongWarningMessage().isPresent()).toBe(false);
  });

  // Verifying the email format warning message is not shown by default.
  it('email is not in correct format warning message should not shown by default', () => {
    page.navigateTo();
    expect(page.getEmailWrongFormatWarningMessage().isPresent()).toBe(false);
  });

  // Verifying the email format warning message is shown when email is not in '^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$' pattern.
  // This action is simulated by clicking on designated field first and then click on a unrelated field to move the focus away.
  it('email is in wrong format warning message should be shown when input has non comma symbol(s)', () => {
    page.navigateTo();
    helper.sendKeys(page.getEmailField(), '*');
    helper.focusThenUnfocus(page.getEmailField(), page.getFirstNameField());
    expect(page.getEmailWrongFormatWarningMessage().isPresent()).toBe(true);
  });

  // Verifying the email format warning message is shown when email is not in '^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$' pattern.
  // This action is simulated by clicking on designated field first and then click on a unrelated field to move the focus away.
  it('email is in wrong format warning message should be shown when input doesnt have @', () => {
    page.navigateTo();
    helper.sendKeys(page.getEmailField(), 'test.com');
    helper.focusThenUnfocus(page.getEmailField(), page.getFirstNameField());
    expect(page.getEmailWrongFormatWarningMessage().isPresent()).toBe(true);
  });

  // Verifying the email format warning message is shown when email is not in '^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$' pattern.
  // This action is simulated by clicking on designated field first and then click on a unrelated field to move the focus away.
  it('email is in wrong format warning message should be shown when nothing before @', () => {
    page.navigateTo();
    helper.sendKeys(page.getEmailField(), '@test.com');
    helper.focusThenUnfocus(page.getEmailField(), page.getFirstNameField());
    expect(page.getEmailWrongFormatWarningMessage().isPresent()).toBe(true);
  });

  // Verifying the email format warning message is shown when email is not in '^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$' pattern.
  // This action is simulated by clicking on designated field first and then click on a unrelated field to move the focus away.
  it('email is in wrong format warning message should be shown when nothing after @', () => {
    page.navigateTo();
    helper.sendKeys(page.getEmailField(), 'test@');
    helper.focusThenUnfocus(page.getEmailField(), page.getFirstNameField());
    expect(page.getEmailWrongFormatWarningMessage().isPresent()).toBe(true);
  });

  // Verifying the email format warning message is shown when email is not in '^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$' pattern.
  // This action is simulated by clicking on designated field first and then click on a unrelated field to move the focus away.
  // Important: this is an error scenario where the email shouldn't be accepted but is accepted.
  // The regex is probably mean to be '^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$' note the \ before .
  it('email is in wrong format warning message should be shown when input doesnt have .', () => {
    page.navigateTo();
    helper.sendKeys(page.getEmailField(), 'test@test');
    helper.focusThenUnfocus(page.getEmailField(), page.getFirstNameField());
    expect(page.getEmailWrongFormatWarningMessage().isPresent()).toBe(true);
  });

  // Verifying the email format warning message is shown when email is not in '^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$' pattern.
  // This action is simulated by clicking on designated field first and then click on a unrelated field to move the focus away.
  // Important: this is an error scenario where the email shouldn't be accepted but is accepted.
  it('email is in wrong format warning message should be shown when input have nothing after .', () => {
    page.navigateTo();
    helper.sendKeys(page.getEmailField(), 'test@test.');
    helper.focusThenUnfocus(page.getEmailField(), page.getFirstNameField());
    expect(page.getEmailWrongFormatWarningMessage().isPresent()).toBe(true);
  });

  // Verifying the email format warning message is shown when email is not in '^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$' pattern.
  // This action is simulated by clicking on designated field first and then click on a unrelated field to move the focus away.
  // Important: this is an error scenario where the email shouldn't be accepted but is accepted.
  it('email is in wrong format warning message should be shown when input have nothing before .', () => {
    page.navigateTo();
    helper.sendKeys(page.getEmailField(), '.test@test');
    helper.focusThenUnfocus(page.getEmailField(), page.getFirstNameField());
    expect(page.getEmailWrongFormatWarningMessage().isPresent()).toBe(true);
  });

  // Verifying the email format warning message is shown when email is not in '^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$' pattern.
  // This action is simulated by clicking on designated field first and then click on a unrelated field to move the focus away.
  // Important: this is an error scenario where the email shouldn't be accepted but is accepted.
  it('email is in wrong format warning message should be shown when input have . before @', () => {
    page.navigateTo();
    helper.sendKeys(page.getEmailField(), 'test.com@test');
    helper.focusThenUnfocus(page.getEmailField(), page.getFirstNameField());
    expect(page.getEmailWrongFormatWarningMessage().isPresent()).toBe(true);
  });

  // Verifying the email format warning message is shown when email is not in '^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$' pattern.
  // This action is simulated by clicking on designated field first and then click on a unrelated field to move the focus away.
  it('email is in wrong format warning message should be shown when nothing between @ and .', () => {
    page.navigateTo();
    helper.sendKeys(page.getEmailField(), 'test@.com');
    helper.focusThenUnfocus(page.getEmailField(), page.getFirstNameField());
    expect(page.getEmailWrongFormatWarningMessage().isPresent()).toBe(true);
  });

  // Verifying the email format warning message is same as expected.
  // This action is simulated by clicking on designated field first and then click on a unrelated field to move the focus away.
  it('email format warning message is same as expected', () => {
    page.navigateTo();
    helper.sendKeys(page.getEmailField(), '*');
    helper.focusThenUnfocus(page.getEmailField(), page.getFirstNameField());
    expect(helper.getText(page.getEmailWrongFormatWarningMessage())).toEqual('Email must match the email format');
  });

  // Verifying the email format warning message is not shown when the email is in proper format.
  // This action is simulated by clicking on designated field first and then click on a unrelated field to move the focus away.
  it('email is in wrong format warning message should not be shown when having proper format', () => {
    page.navigateTo();
    helper.sendKeys(page.getEmailField(), 'test@test.com');
    helper.focusThenUnfocus(page.getEmailField(), page.getFirstNameField());
    expect(page.getEmailWrongFormatWarningMessage().isPresent()).toBe(false);
  });

  // Verifying the phone format warning message is not shown by default.
  it('phone is not in correct format warning message should not shown by default', () => {
    page.navigateTo();
    expect(page.getPhoneWrongFormatWarningMessage().isPresent()).toBe(false);
  });

  // Verifying the phone format warning message is shown when email is not in '^[0-9]{1}[0-9]{2}-[0-9]{3}-[0-9]{4}$' pattern.
  // This action is simulated by clicking on designated field first and then click on a unrelated field to move the focus away.
  it('phone is in wrong format warning message should be shown when input has non digit char(s)', () => {
    page.navigateTo();
    helper.sendKeys(page.getPhoneField(), '123-456-789a');
    helper.focusThenUnfocus(page.getPhoneField(), page.getFirstNameField());
    expect(page.getPhoneWrongFormatWarningMessage().isPresent()).toBe(true);
  });

  // Verifying the phone format warning message is shown when email is not in '^[0-9]{1}[0-9]{2}-[0-9]{3}-[0-9]{4}$' pattern.
  // This action is simulated by clicking on designated field first and then click on a unrelated field to move the focus away.
  it('phone is in wrong format warning message should be shown when input does not have enough char in first part', () => {
    page.navigateTo();
    helper.sendKeys(page.getPhoneField(), '12-456-7890');
    helper.focusThenUnfocus(page.getPhoneField(), page.getFirstNameField());
    expect(page.getPhoneWrongFormatWarningMessage().isPresent()).toBe(true);
  });

  // Verifying the phone format warning message is shown when email is not in '^[0-9]{1}[0-9]{2}-[0-9]{3}-[0-9]{4}$' pattern.
  // This action is simulated by clicking on designated field first and then click on a unrelated field to move the focus away.
  it('phone is in wrong format warning message should be shown when input have more than 3 char in first part', () => {
    page.navigateTo();
    helper.sendKeys(page.getPhoneField(), '1223-456-7890');
    helper.focusThenUnfocus(page.getPhoneField(), page.getFirstNameField());
    expect(page.getPhoneWrongFormatWarningMessage().isPresent()).toBe(true);
  });

  // Verifying the phone format warning message is shown when email is not in '^[0-9]{1}[0-9]{2}-[0-9]{3}-[0-9]{4}$' pattern.
  // This action is simulated by clicking on designated field first and then click on a unrelated field to move the focus away.
  it('phone is in wrong format warning message should be shown when input does not have enough char in second part', () => {
    page.navigateTo();
    helper.sendKeys(page.getPhoneField(), '123-45-7890');
    helper.focusThenUnfocus(page.getPhoneField(), page.getFirstNameField());
    expect(page.getPhoneWrongFormatWarningMessage().isPresent()).toBe(true);
  });

  // Verifying the phone format warning message is shown when email is not in '^[0-9]{1}[0-9]{2}-[0-9]{3}-[0-9]{4}$' pattern.
  // This action is simulated by clicking on designated field first and then click on a unrelated field to move the focus away.
  it('phone is in wrong format warning message should be shown when input have more than 3 char in second part', () => {
    page.navigateTo();
    helper.sendKeys(page.getPhoneField(), '123-4565-7890');
    helper.focusThenUnfocus(page.getPhoneField(), page.getFirstNameField());
    expect(page.getPhoneWrongFormatWarningMessage().isPresent()).toBe(true);
  });

  // Verifying the phone format warning message is shown when email is not in '^[0-9]{1}[0-9]{2}-[0-9]{3}-[0-9]{4}$' pattern.
  // This action is simulated by clicking on designated field first and then click on a unrelated field to move the focus away.
  it('phone is in wrong format warning message should be shown when input does not have enough char in third part', () => {
    page.navigateTo();
    helper.sendKeys(page.getPhoneField(), '123-456-789');
    helper.focusThenUnfocus(page.getPhoneField(), page.getFirstNameField());
    expect(page.getPhoneWrongFormatWarningMessage().isPresent()).toBe(true);
  });

  // Verifying the phone format warning message is shown when email is not in '^[0-9]{1}[0-9]{2}-[0-9]{3}-[0-9]{4}$' pattern.
  // This action is simulated by clicking on designated field first and then click on a unrelated field to move the focus away.
  it('phone is in wrong format warning message should be shown when input have more than 4 char in thrid part', () => {
    page.navigateTo();
    helper.sendKeys(page.getPhoneField(), '123-456-78900');
    helper.focusThenUnfocus(page.getPhoneField(), page.getFirstNameField());
    expect(page.getPhoneWrongFormatWarningMessage().isPresent()).toBe(true);
  });

  // Verifying the phone format warning message is shown when email is not in '^[0-9]{1}[0-9]{2}-[0-9]{3}-[0-9]{4}$' pattern.
  // This action is simulated by clicking on designated field first and then click on a unrelated field to move the focus away.
  it('phone is in wrong format warning message should be shown when input does not have -', () => {
    page.navigateTo();
    helper.sendKeys(page.getPhoneField(), '1234567890');
    helper.focusThenUnfocus(page.getPhoneField(), page.getFirstNameField());
    expect(page.getPhoneWrongFormatWarningMessage().isPresent()).toBe(true);
  });

  // Verifying the phone format warning message is same as expected.
  // This action is simulated by clicking on designated field first and then click on a unrelated field to move the focus away.
  it('phone format warning message is same as expected', () => {
    page.navigateTo();
    helper.sendKeys(page.getPhoneField(), '123-456-789a');
    helper.focusThenUnfocus(page.getPhoneField(), page.getFirstNameField());
    expect(helper.getText(page.getPhoneWrongFormatWarningMessage())).toEqual('Phone number must match the pattern ie. 123-456-7890');
  });

  // Verifying the phone format warning message is not shown when the email is in proper format.
  // This action is simulated by clicking on designated field first and then click on a unrelated field to move the focus away.
  it('phone is in wrong format warning message should not be shown when having proper format', () => {
    page.navigateTo();
    helper.sendKeys(page.getPhoneField(), '123-456-7890');
    helper.focusThenUnfocus(page.getPhoneField(), page.getFirstNameField());
    expect(page.getPhoneWrongFormatWarningMessage().isPresent()).toBe(false);
  });

  // Verifying the city format warning message is not shown by default.
  it('city is not in correct format warning message should not shown by default', () => {
    page.navigateTo();
    expect(page.getCityWrongFormatWarningMessage().isPresent()).toBe(false);
  });

  // Verifying the city format warning message is shown when email is not in '^[a-zA-Z]+(?:\.(?!-))?(?:[\s-]?[a-zA-Z]+)' pattern.
  // This action is simulated by clicking on designated field first and then click on a unrelated field to move the focus away.
  // Important: this is an error scenario where the email shouldn't be accepted but is accepted.
  it('city is in wrong format warning message should be shown when input have digits in middle', () => {
    page.navigateTo();
    helper.sendKeys(page.getCityField(), 'l0ndon');
    helper.focusThenUnfocus(page.getCityField(), page.getFirstNameField());
    expect(page.getCityWrongFormatWarningMessage().isPresent()).toBe(true);
  });

  // Verifying the city format warning message is shown when email is not in '^[a-zA-Z]+(?:\.(?!-))?(?:[\s-]?[a-zA-Z]+)' pattern.
  // This action is simulated by clicking on designated field first and then click on a unrelated field to move the focus away.
  it('city is in wrong format warning message should be shown when input have digits at the beginning', () => {
    page.navigateTo();
    helper.sendKeys(page.getCityField(), '0london');
    helper.focusThenUnfocus(page.getCityField(), page.getFirstNameField());
    expect(page.getCityWrongFormatWarningMessage().isPresent()).toBe(true);
  });

  // Verifying the city format warning message is shown when email is not in '^[a-zA-Z]+(?:\.(?!-))?(?:[\s-]?[a-zA-Z]+)' pattern.
  // This action is simulated by clicking on designated field first and then click on a unrelated field to move the focus away.
  it('city is in wrong format warning message should be shown when input have digits at the end', () => {
    page.navigateTo();
    helper.sendKeys(page.getCityField(), 'london0');
    helper.focusThenUnfocus(page.getCityField(), page.getFirstNameField());
    expect(page.getCityWrongFormatWarningMessage().isPresent()).toBe(true);
  });

  // Verifying the city format warning message is same as expected.
  // This action is simulated by clicking on designated field first and then click on a unrelated field to move the focus away.
  it('city format warning message is same as expected', () => {
    page.navigateTo();
    helper.sendKeys(page.getCityField(), '1234567890');
    helper.focusThenUnfocus(page.getCityField(), page.getFirstNameField());
    expect(helper.getText(page.getCityWrongFormatWarningMessage())).toEqual('City should not contain numeric digits');
  });

  // Verifying the city format warning message is not shown when the email is in proper format.
  // This action is simulated by clicking on designated field first and then click on a unrelated field to move the focus away.
  it('city is in wrong format warning message should not be shown when having proper format', () => {
    page.navigateTo();
    helper.sendKeys(page.getCityField(), 'london');
    helper.focusThenUnfocus(page.getCityField(), page.getFirstNameField());
    expect(page.getCityWrongFormatWarningMessage().isPresent()).toBe(false);
  });

  // Verifying the city format warning message is not shown when the email is in proper format.
  // This action is simulated by clicking on designated field first and then click on a unrelated field to move the focus away.
  it('city is in wrong format warning message should not be shown when having proper format with caps', () => {
    page.navigateTo();
    helper.sendKeys(page.getCityField(), 'lONdoN');
    helper.focusThenUnfocus(page.getCityField(), page.getFirstNameField());
    expect(page.getCityWrongFormatWarningMessage().isPresent()).toBe(false);
  });

  // Verifying the state format warning message is not shown by default.
  it('state is not in correct format warning message should not shown by default', () => {
    page.navigateTo();
    expect(page.getStateWrongFormatWarningMessage().isPresent()).toBe(false);
  });

  // Verifying the state format warning message is shown when email is not in '^[a-zA-Z]+(?:\.(?!-))?(?:[\s-]?[a-zA-Z]+)' pattern.
  // This action is simulated by clicking on designated field first and then click on a unrelated field to move the focus away.
  it('state is in wrong format warning message should be shown when input have digits at the end', () => {
    page.navigateTo();
    helper.sendKeys(page.getStateField(), '0ntario');
    helper.focusThenUnfocus(page.getStateField(), page.getFirstNameField());
    expect(page.getStateWrongFormatWarningMessage().isPresent()).toBe(true);
  });

  // Verifying the state format warning message is same as expected.
  // This action is simulated by clicking on designated field first and then click on a unrelated field to move the focus away.
  it('state format warning message is same as expected', () => {
    page.navigateTo();
    helper.sendKeys(page.getStateField(), '0ntario');
    helper.focusThenUnfocus(page.getStateField(), page.getFirstNameField());
    expect(helper.getText(page.getStateWrongFormatWarningMessage())).toEqual('State should not contain numeric digits');
  });

  // Verifying the state format warning message is not shown when the email is in proper format.
  // This action is simulated by clicking on designated field first and then click on a unrelated field to move the focus away.
  it('state is in wrong format warning message should not be shown when having proper format', () => {
    page.navigateTo();
    helper.sendKeys(page.getStateField(), 'ontario');
    helper.focusThenUnfocus(page.getStateField(), page.getFirstNameField());
    expect(page.getStateWrongFormatWarningMessage().isPresent()).toBe(false);
  });

  // Verifying the state format warning message is not shown when the email is in proper format.
  // This action is simulated by clicking on designated field first and then click on a unrelated field to move the focus away.
  it('state is in wrong format warning message should not be shown when having proper format with Caps', () => {
    page.navigateTo();
    helper.sendKeys(page.getStateField(), 'OntArio');
    helper.focusThenUnfocus(page.getStateField(), page.getFirstNameField());
    expect(page.getStateWrongFormatWarningMessage().isPresent()).toBe(false);
  });

  // Verifying the zipcode format warning message is not shown by default.
  it('zipcode is not in correct format warning message should not shown by default', () => {
    page.navigateTo();
    expect(page.getZipcodeWrongFormatWarningMessage().isPresent()).toBe(false);
  });

  // Verifying the zipcode format warning message is shown when email is not in '^[0-9]{5}$' pattern.
  // This action is simulated by clicking on designated field first and then click on a unrelated field to move the focus away.
  it('zipcode is in wrong format warning message should be shown when input have letter(s)', () => {
    page.navigateTo();
    helper.sendKeys(page.getZipcodeField(), '002a1');
    helper.focusThenUnfocus(page.getZipcodeField(), page.getFirstNameField());
    expect(page.getZipcodeWrongFormatWarningMessage().isPresent()).toBe(true);
  });

  // Verifying the zipcode format warning message is shown when email is not in '^[0-9]{5}$' pattern.
  // This action is simulated by clicking on designated field first and then click on a unrelated field to move the focus away.
  it('zipcode is in wrong format warning message should be shown when input have symbol(s)', () => {
    page.navigateTo();
    helper.sendKeys(page.getZipcodeField(), '00?21');
    helper.focusThenUnfocus(page.getZipcodeField(), page.getFirstNameField());
    expect(page.getZipcodeWrongFormatWarningMessage().isPresent()).toBe(true);
  });

  // Verifying the zipcode format warning message is same as expected.
  // This action is simulated by clicking on designated field first and then click on a unrelated field to move the focus away.
  it('zipcode format warning message is same as expected', () => {
    page.navigateTo();
    helper.sendKeys(page.getZipcodeField(), '002a1');
    helper.focusThenUnfocus(page.getZipcodeField(), page.getFirstNameField());
    expect(helper.getText(page.getZipcodeWrongFormatWarningMessage())).toEqual('ZipCode should have digits only ie. 12345');
  });

  // Verifying the zipcode format warning message is not shown when the email is in proper format.
  // This action is simulated by clicking on designated field first and then click on a unrelated field to move the focus away.
  it('zipcode is in wrong format warning message should not be shown when having proper format', () => {
    page.navigateTo();
    helper.sendKeys(page.getZipcodeField(), '00221');
    helper.focusThenUnfocus(page.getZipcodeField(), page.getFirstNameField());
    expect(page.getZipcodeWrongFormatWarningMessage().isPresent()).toBe(false);
  });

  // Verifying the reset form button can empty first name input field after click.
  it('reset form button should able to clean first name input field in form', () => {
    page.navigateTo();
    helper.sendKeys(page.getFirstNameField(), 'john');
    helper.click(page.getResetBtn());
    expect(page.getFirstNameField().getAttribute('value')).toEqual('');
  });

  // Verifying the reset form button can empty last name input field after click.
  it('reset form button should able to clean last name input field in form', () => {
    page.navigateTo();
    helper.sendKeys(page.getLastNameField(), 'smith');
    helper.click(page.getResetBtn());
    expect(page.getLastNameField().getAttribute('value')).toEqual('');
  });

  // Verifying the reset form button can reset male radio button after click.
  it('reset form button should able to reset male radio buttons in form', () => {
    page.navigateTo();
    helper.click(page.getMaleRadioBtn());
    helper.click(page.getResetBtn());
    expect(page.getMaleRadioBtn().isSelected()).toBe(false);
  });

  // Verifying the reset form button can reset female radio button after click.
  it('reset form button should able to reset female radio buttons in form', () => {
    page.navigateTo();
    helper.click(page.getFemaleRadioBtn());
    helper.click(page.getResetBtn());
    expect(page.getFemaleRadioBtn().isSelected()).toBe(false);
  });

  // Verifying the reset form button can empty email input field after click.
  it('reset form button should able to clean email input field in form', () => {
    page.navigateTo();
    helper.sendKeys(page.getEmailField(), 'test@test.com');
    helper.click(page.getResetBtn());
    expect(page.getEmailField().getAttribute('value')).toEqual('');
  });

  // Verifying the reset form button can empty phone input field after click.
  it('reset form button should able to clean email input field in form', () => {
    page.navigateTo();
    helper.sendKeys(page.getPhoneField(), '123-456-7890');
    helper.click(page.getResetBtn());
    expect(page.getPhoneField().getAttribute('value')).toEqual('');
  });

  // Verifying the reset form button can reset master qualification option after click.
  // Important: reset button won't reset this back to null like the very beginning, the value on UI is default first option (master)
  it('reset form button should able to reset master qualification option in form', () => {
    page.navigateTo();
    helper.click(page.getQualificationOptionMaster());
    helper.click(page.getResetBtn());
    expect(page.getQualificationOptionMaster().isSelected()).toBe(false);
  });

  // Verifying the reset form button can reset bachelor qualification option after click.
  it('reset form button should able to reset bachelor qualification option in form', () => {
    page.navigateTo();
    helper.click(page.getQualificationOptionBachelors());
    helper.click(page.getResetBtn());
    expect(page.getQualificationOptionBachelors().isSelected()).toBe(false);
  });

  // Verifying the reset form button can reset doctoral qualification option after click.
  it('reset form button should able to reset doctoral qualification option in form', () => {
    page.navigateTo();
    helper.click(page.getQualificationOptionDoctoral());
    helper.click(page.getResetBtn());
    expect(page.getQualificationOptionDoctoral().isSelected()).toBe(false);
  });

  // Verifying the reset form button can reset associate qualification option after click.
  it('reset form button should able to reset associate qualification option in form', () => {
    page.navigateTo();
    helper.click(page.getQualificationOptionAssociate());
    helper.click(page.getResetBtn());
    expect(page.getQualificationOptionAssociate().isSelected()).toBe(false);
  });

  // Verifying the reset form button can empty city input field after click.
  it('reset form button should able to clean city input field in form', () => {
    page.navigateTo();
    helper.sendKeys(page.getCityField(), 'london');
    helper.click(page.getResetBtn());
    expect(page.getCityField().getAttribute('value')).toEqual('');
  });

  // Verifying the reset form button can empty state input field after click.
  it('reset form button should able to clean state input field in form', () => {
    page.navigateTo();
    helper.sendKeys(page.getStateField(), 'ontario');
    helper.click(page.getResetBtn());
    expect(page.getStateField().getAttribute('value')).toEqual('');
  });

  // Verifying the reset form button can empty zipcode input field after click.
  it('reset form button should able to clean zipcode input field in form', () => {
    page.navigateTo();
    helper.sendKeys(page.getZipcodeField(), '09878');
    helper.click(page.getResetBtn());
    expect(page.getZipcodeField().getAttribute('value')).toEqual('');
  });




  // Verifying the reset form button can empty first name empty warning message after click.
  it('reset form button should able to clean first name empty warning message', () => {
    page.navigateTo();
    helper.focusThenUnfocus(page.getFirstNameField(), page.getLastNameField());
    helper.smartWait(page.getFirstNameEmptyWarningMessage());
    helper.doubleClick(page.getResetBtn());
    expect(page.getFirstNameEmptyWarningMessage().isPresent()).toBe(false);
  });

  // Verifying the reset form button can reset first name too short warning message after click.
  it('reset form button should able to clean first name too short warning message', () => {
    page.navigateTo();
    helper.sendKeys(page.getFirstNameField(), helper.randomString(2));
    helper.focusThenUnfocus(page.getFirstNameField(), page.getLastNameField());
    helper.smartWait(page.getFirstNameTooShortWarningMessage());
    helper.doubleClick(page.getResetBtn());
    expect(page.getFirstNameTooShortWarningMessage().isPresent()).toBe(false);
  });

  // Verifying the reset form button can reset first name too long warning message after click.
  it('reset form button should able to clean first name too long warning message', () => {
      page.navigateTo();
      helper.sendKeys(page.getFirstNameField(), helper.randomString(21));
      helper.focusThenUnfocus(page.getFirstNameField(), page.getLastNameField());
      helper.smartWait(page.getFirstNameTooLongWarningMessage());
      helper.doubleClick(page.getResetBtn());
      expect(page.getFirstNameTooLongWarningMessage().isPresent()).toBe(false);
  });

  // Verifying the reset form button can empty last name empty warning message after click.
  it('reset form button should able to clean last name empty warning message', () => {
    page.navigateTo();
    helper.focusThenUnfocus(page.getLastNameField(), page.getFirstNameField());
    helper.smartWait(page.getLastNameEmptyWarningMessage());
    helper.doubleClick(page.getResetBtn());
    expect(page.getLastNameEmptyWarningMessage().isPresent()).toBe(false);
  });

  // Verifying the reset form button can reset last name too short warning message after click.
  it('reset form button should able to clean last name too short warning message', () => {
    page.navigateTo();
    helper.sendKeys(page.getLastNameField(), helper.randomString(2));
    helper.focusThenUnfocus(page.getLastNameField(), page.getFirstNameField());
    helper.smartWait(page.getLastNameTooShortWarningMessage());
    helper.doubleClick(page.getResetBtn());
    expect(page.getLastNameTooShortWarningMessage().isPresent()).toBe(false);
  });

  // Verifying the reset form button can reset last name too long warning message after click.
  it('reset form button should able to clean last name too long warning message', () => {
    page.navigateTo();
    helper.sendKeys(page.getLastNameField(), helper.randomString(21));
    helper.focusThenUnfocus(page.getLastNameField(), page.getFirstNameField());
    helper.smartWait(page.getLastNameTooLongWarningMessage());
    helper.doubleClick(page.getResetBtn());
    expect(page.getLastNameTooLongWarningMessage().isPresent()).toBe(false);
  });

  // Verifying the reset form button can empty email empty warning message after click.
  it('reset form button should able to clean email empty warning message', () => {
    page.navigateTo();
    helper.focusThenUnfocus(page.getEmailField(), page.getFirstNameField());
    helper.smartWait(page.getEmailEmptyWarningMessage());
    helper.doubleClick(page.getResetBtn());
    expect(page.getEmailEmptyWarningMessage().isPresent()).toBe(false);
  });

  // Verifying the reset form button can reset email wrong format warning message after click.
  it('reset form button should able to clean email wrong format warning message', () => {
    page.navigateTo();
    helper.sendKeys(page.getEmailField(), 'abc@');
    helper.focusThenUnfocus(page.getEmailField(), page.getFirstNameField());
    helper.smartWait(page.getEmailWrongFormatWarningMessage());
    helper.doubleClick(page.getResetBtn());
    expect(page.getEmailWrongFormatWarningMessage().isPresent()).toBe(false);
  });

  // Verifying the reset form button can empty phone empty warning message after click.
  it('reset form button should able to clean phone empty warning message', () => {
    page.navigateTo();
    helper.focusThenUnfocus(page.getPhoneField(), page.getFirstNameField());
    helper.smartWait(page.getPhoneEmptyWarningMessage());
    helper.doubleClick(page.getResetBtn());
    expect(page.getPhoneEmptyWarningMessage().isPresent()).toBe(false);
  });

  // Verifying the reset form button can reset phone wrong format warning message after click.
  it('reset form button should able to clean email wrong format warning message', () => {
    page.navigateTo();
    helper.sendKeys(page.getPhoneField(), '123456789');
    helper.focusThenUnfocus(page.getPhoneField(), page.getFirstNameField());
    helper.smartWait(page.getPhoneWrongFormatWarningMessage());
    helper.doubleClick(page.getResetBtn());
    expect(page.getPhoneWrongFormatWarningMessage().isPresent()).toBe(false);
  });

  // Verifying the reset form button can empty city empty warning message after click.
  it('reset form button should able to clean city empty warning message', () => {
    page.navigateTo();
    helper.focusThenUnfocus(page.getCityField(), page.getFirstNameField());
    helper.smartWait(page.getCityEmptyWarningMessage());
    helper.doubleClick(page.getResetBtn());
    expect(page.getCityEmptyWarningMessage().isPresent()).toBe(false);
  });

  // Verifying the reset form button can reset city wrong format warning message after click.
  it('reset form button should able to clean city wrong format warning message', () => {
    page.navigateTo();
    helper.sendKeys(page.getCityField(), '0london');
    helper.focusThenUnfocus(page.getCityField(), page.getFirstNameField());
    helper.smartWait(page.getCityWrongFormatWarningMessage());
    helper.doubleClick(page.getResetBtn());
    expect(page.getCityWrongFormatWarningMessage().isPresent()).toBe(false);
  });

  // Verifying the reset form button can reset city too short warning message after click.
  it('reset form button should able to clean city too short warning message', () => {
    page.navigateTo();
    helper.sendKeys(page.getCityField(), helper.randomString(2));
    helper.focusThenUnfocus(page.getCityField(), page.getFirstNameField());
    helper.smartWait(page.getCityTooShortWarningMessage());
    helper.doubleClick(page.getResetBtn());
    expect(page.getCityTooShortWarningMessage().isPresent()).toBe(false);
  });

  // Verifying the reset form button can reset city too long warning message after click.
  it('reset form button should able to clean city too long warning message', () => {
    page.navigateTo();
    helper.sendKeys(page.getCityField(), helper.randomString(21));
    helper.focusThenUnfocus(page.getCityField(), page.getFirstNameField());
    helper.smartWait(page.getCityTooLongWarningMessage());
    helper.doubleClick(page.getResetBtn());
    expect(page.getCityTooLongWarningMessage().isPresent()).toBe(false);
  });

  // Verifying the reset form button can empty state empty warning message after click.
  it('reset form button should able to clean state empty warning message', () => {
    page.navigateTo();
    helper.focusThenUnfocus(page.getStateField(), page.getFirstNameField());
    helper.smartWait(page.getStateEmptyWarningMessage());
    helper.doubleClick(page.getResetBtn());
    expect(page.getStateEmptyWarningMessage().isPresent()).toBe(false);
  });

  // Verifying the reset form button can reset state wrong format warning message after click.
  it('reset form button should able to clean state wrong format warning message', () => {
    page.navigateTo();
    helper.sendKeys(page.getStateField(), '0ntario');
    helper.focusThenUnfocus(page.getStateField(), page.getFirstNameField());
    helper.smartWait(page.getStateWrongFormatWarningMessage());
    helper.doubleClick(page.getResetBtn());
    expect(page.getStateWrongFormatWarningMessage().isPresent()).toBe(false);
  });

  // Verifying the reset form button can reset state too short warning message after click.
  it('reset form button should able to clean state too short warning message', () => {
    page.navigateTo();
    helper.sendKeys(page.getStateField(), helper.randomString(2));
    helper.focusThenUnfocus(page.getStateField(), page.getFirstNameField());
    helper.smartWait(page.getStateTooShortWarningMessage());
    helper.doubleClick(page.getResetBtn());
    expect(page.getStateTooShortWarningMessage().isPresent()).toBe(false);
  });

  // Verifying the reset form button can reset state too long warning message after click.
  it('reset form button should able to clean state too long warning message', () => {
    page.navigateTo();
    helper.sendKeys(page.getStateField(), helper.randomString(21));
    helper.focusThenUnfocus(page.getStateField(), page.getFirstNameField());
    helper.smartWait(page.getStateTooLongWarningMessage());
    helper.doubleClick(page.getResetBtn());
    expect(page.getStateTooLongWarningMessage().isPresent()).toBe(false);
  });

  // Verifying the reset form button can empty city zipcode warning message after click.
  it('reset form button should able to clean zipcode empty warning message', () => {
    page.navigateTo();
    helper.focusThenUnfocus(page.getZipcodeField(), page.getFirstNameField());
    helper.smartWait(page.getZipcodeEmptyWarningMessage());
    helper.doubleClick(page.getResetBtn());
    expect(page.getZipcodeEmptyWarningMessage().isPresent()).toBe(false);
  });

  // Verifying the reset form button can reset zipcode wrong format warning message after click.
  it('reset form button should able to clean zipcode wrong format warning message', () => {
    page.navigateTo();
    helper.sendKeys(page.getZipcodeField(), '12b34');
    helper.focusThenUnfocus(page.getZipcodeField(), page.getFirstNameField());
    helper.smartWait(page.getZipcodeWrongFormatWarningMessage());
    helper.doubleClick(page.getResetBtn());
    expect(page.getZipcodeWrongFormatWarningMessage().isPresent()).toBe(false);
  });

  // Verifying the reset form button can reset zipcode too short warning message after click.
  it('reset form button should able to clean zipcode too short warning message', () => {
    page.navigateTo();
    helper.sendKeys(page.getZipcodeField(), helper.randomString(4));
    helper.focusThenUnfocus(page.getZipcodeField(), page.getFirstNameField());
    helper.smartWait(page.getZipcodeTooShortWarningMessage());
    helper.doubleClick(page.getResetBtn());
    expect(page.getZipcodeTooShortWarningMessage().isPresent()).toBe(false);
  });

  // Verifying the reset form button can reset zipcode too long warning message after click.
  it('reset form button should able to clean zipcode too long warning message', () => {
    page.navigateTo();
    helper.sendKeys(page.getZipcodeField(), helper.randomString(6));
    helper.focusThenUnfocus(page.getZipcodeField(), page.getFirstNameField());
    helper.smartWait(page.getZipcodeTooLongWarningMessage());
    helper.doubleClick(page.getResetBtn());
    expect(page.getZipcodeTooLongWarningMessage().isPresent()).toBe(false);
  });

  // Verifying the submit button is not enabled if all but first name is empty.
  it('submit button should not be enabled if all but first name is empty', () => {
    page.navigateTo();
    helper.sendKeys(page.getLastNameField(), 'smith');
    helper.click(page.getMaleRadioBtn());
    helper.sendKeys(page.getEmailField(), 'test@test.com');
    helper.sendKeys(page.getPhoneField(), '123-456-7890');
    helper.click(page.getQualificationOptionMaster());
    helper.sendKeys(page.getCityField(), 'london');
    helper.sendKeys(page.getStateField(), 'ontario');
    helper.sendKeys(page.getZipcodeField(), '12345');
    helper.focusThenUnfocus(page.getFirstNameField(), page.getLastNameField());
    helper.smartWait(page.getFirstNameEmptyWarningMessage());
    expect(page.getSubmitBtn().isEnabled()).toBe(false);
  });

  // Verifying the submit button is not enabled if all but first name is too short.
  it('submit button should not be enabled if all but first name is too short', () => {
    page.navigateTo();
    helper.sendKeys(page.getFirstNameField(), helper.randomString(2));
    helper.sendKeys(page.getLastNameField(), 'smith');
    helper.click(page.getMaleRadioBtn());
    helper.sendKeys(page.getEmailField(), 'test@test.com');
    helper.sendKeys(page.getPhoneField(), '123-456-7890');
    helper.click(page.getQualificationOptionMaster());
    helper.sendKeys(page.getCityField(), 'london');
    helper.sendKeys(page.getStateField(), 'ontario');
    helper.sendKeys(page.getZipcodeField(), '12345');
    helper.focusThenUnfocus(page.getFirstNameField(), page.getLastNameField());
    helper.smartWait(page.getFirstNameTooShortWarningMessage());
    expect(page.getSubmitBtn().isEnabled()).toBe(false);
  });

  // Verifying the submit button is not enabled if all but first name is too long.
  it('submit button should not be enabled if all but first name is too long', () => {
    page.navigateTo();
    helper.sendKeys(page.getFirstNameField(), helper.randomString(21));
    helper.sendKeys(page.getLastNameField(), 'smith');
    helper.click(page.getMaleRadioBtn());
    helper.sendKeys(page.getEmailField(), 'test@test.com');
    helper.sendKeys(page.getPhoneField(), '123-456-7890');
    helper.click(page.getQualificationOptionMaster());
    helper.sendKeys(page.getCityField(), 'london');
    helper.sendKeys(page.getStateField(), 'ontario');
    helper.sendKeys(page.getZipcodeField(), '12345');
    helper.focusThenUnfocus(page.getFirstNameField(), page.getLastNameField());
    helper.smartWait(page.getFirstNameTooLongWarningMessage());
    expect(page.getSubmitBtn().isEnabled()).toBe(false);
  });

  // Verifying the submit button is not enabled if all but last name is empty.
  it('submit button should not be enabled if all but last name is empty', () => {
    page.navigateTo();
    helper.sendKeys(page.getFirstNameField(), 'john');
    helper.click(page.getMaleRadioBtn());
    helper.sendKeys(page.getEmailField(), 'test@test.com');
    helper.sendKeys(page.getPhoneField(), '123-456-7890');
    helper.click(page.getQualificationOptionMaster());
    helper.sendKeys(page.getCityField(), 'london');
    helper.sendKeys(page.getStateField(), 'ontario');
    helper.sendKeys(page.getZipcodeField(), '12345');
    helper.focusThenUnfocus(page.getLastNameField(), page.getFirstNameField());
    helper.smartWait(page.getLastNameEmptyWarningMessage());
    expect(page.getSubmitBtn().isEnabled()).toBe(false);
  });

  // Verifying the submit button is not enabled if all but last name is too short.
  it('submit button should not be enabled if all but last name is too short', () => {
    page.navigateTo();
    helper.sendKeys(page.getFirstNameField(), 'john');
    helper.sendKeys(page.getLastNameField(), helper.randomString(2));
    helper.click(page.getMaleRadioBtn());
    helper.sendKeys(page.getEmailField(), 'test@test.com');
    helper.sendKeys(page.getPhoneField(), '123-456-7890');
    helper.click(page.getQualificationOptionMaster());
    helper.sendKeys(page.getCityField(), 'london');
    helper.sendKeys(page.getStateField(), 'ontario');
    helper.sendKeys(page.getZipcodeField(), '12345');
    helper.focusThenUnfocus(page.getLastNameField(), page.getFirstNameField());
    helper.smartWait(page.getLastNameTooShortWarningMessage());
    expect(page.getSubmitBtn().isEnabled()).toBe(false);
  });

  // Verifying the submit button is not enabled if all but last name is too long.
  it('submit button should not be enabled if all but last name is too long', () => {
    page.navigateTo();
    helper.sendKeys(page.getFirstNameField(), 'john');
    helper.sendKeys(page.getLastNameField(), helper.randomString(21));
    helper.click(page.getMaleRadioBtn());
    helper.sendKeys(page.getEmailField(), 'test@test.com');
    helper.sendKeys(page.getPhoneField(), '123-456-7890');
    helper.click(page.getQualificationOptionMaster());
    helper.sendKeys(page.getCityField(), 'london');
    helper.sendKeys(page.getStateField(), 'ontario');
    helper.sendKeys(page.getZipcodeField(), '12345');
    helper.focusThenUnfocus(page.getLastNameField(), page.getFirstNameField());
    helper.smartWait(page.getLastNameTooLongWarningMessage());
    expect(page.getSubmitBtn().isEnabled()).toBe(false);
  });

  // Verifying the submit button is not enabled if all but gender is empty.
  it('submit button should not be enabled if all but gender is empty', () => {
    page.navigateTo();
    helper.sendKeys(page.getFirstNameField(), 'john');
    helper.sendKeys(page.getLastNameField(), 'smith');
    helper.sendKeys(page.getEmailField(), 'test@test.com');
    helper.sendKeys(page.getPhoneField(), '123-456-7890');
    helper.click(page.getQualificationOptionMaster());
    helper.sendKeys(page.getCityField(), 'london');
    helper.sendKeys(page.getStateField(), 'ontario');
    helper.sendKeys(page.getZipcodeField(), '12345');
    expect(page.getSubmitBtn().isEnabled()).toBe(false);
  });

  // Verifying the submit button is not enabled if all but qualification is empty.
  it('submit button should not be enabled if all but qualification is empty', () => {
    page.navigateTo();
    helper.sendKeys(page.getFirstNameField(), 'john');
    helper.sendKeys(page.getLastNameField(), 'smith');
    helper.click(page.getMaleRadioBtn());
    helper.sendKeys(page.getEmailField(), 'test@test.com');
    helper.sendKeys(page.getPhoneField(), '123-456-7890');
    helper.sendKeys(page.getCityField(), 'london');
    helper.sendKeys(page.getStateField(), 'ontario');
    helper.sendKeys(page.getZipcodeField(), '12345');
    expect(page.getSubmitBtn().isEnabled()).toBe(false);
  });

  // Verifying the submit button is not enabled if all but email is empty.
  it('submit button should not be enabled if all but email is empty', () => {
    page.navigateTo();
    helper.sendKeys(page.getFirstNameField(), 'john');
    helper.sendKeys(page.getLastNameField(), 'smith');
    helper.click(page.getMaleRadioBtn());
    helper.sendKeys(page.getPhoneField(), '123-456-7890');
    helper.click(page.getQualificationOptionMaster());
    helper.sendKeys(page.getCityField(), 'london');
    helper.sendKeys(page.getStateField(), 'ontario');
    helper.sendKeys(page.getZipcodeField(), '12345');
    helper.focusThenUnfocus(page.getEmailField(), page.getFirstNameField());
    helper.smartWait(page.getEmailEmptyWarningMessage());
    expect(page.getSubmitBtn().isEnabled()).toBe(false);
  });

  // Verifying the submit button is not enabled if all but email is in wrong format.
  it('submit button should not be enabled if all but email is in wrong format', () => {
    page.navigateTo();
    helper.sendKeys(page.getFirstNameField(), 'john');
    helper.sendKeys(page.getLastNameField(), 'smith');
    helper.click(page.getMaleRadioBtn());
    helper.sendKeys(page.getEmailField(), 'testtest.com');
    helper.sendKeys(page.getPhoneField(), '123-456-7890');
    helper.click(page.getQualificationOptionMaster());
    helper.sendKeys(page.getCityField(), 'london');
    helper.sendKeys(page.getStateField(), 'ontario');
    helper.sendKeys(page.getZipcodeField(), '12345');
    helper.focusThenUnfocus(page.getEmailField(), page.getFirstNameField());
    helper.smartWait(page.getEmailWrongFormatWarningMessage());
    expect(page.getSubmitBtn().isEnabled()).toBe(false);
  });

  // Verifying the submit button is not enabled if all but phone is empty.
  it('submit button should not be enabled if all but phone is empty', () => {
    page.navigateTo();
    helper.sendKeys(page.getFirstNameField(), 'john');
    helper.sendKeys(page.getLastNameField(), 'smith');
    helper.click(page.getMaleRadioBtn());
    helper.sendKeys(page.getEmailField(), 'test@test.com');
    helper.click(page.getQualificationOptionMaster());
    helper.sendKeys(page.getCityField(), 'london');
    helper.sendKeys(page.getStateField(), 'ontario');
    helper.sendKeys(page.getZipcodeField(), '12345');
    helper.focusThenUnfocus(page.getPhoneField(), page.getFirstNameField());
    helper.smartWait(page.getPhoneEmptyWarningMessage());
    expect(page.getSubmitBtn().isEnabled()).toBe(false);
  });

  // Verifying the submit button is not enabled if all but phone is in wrong format.
  it('submit button should not be enabled if all but phone is in wrong format', () => {
    page.navigateTo();
    helper.sendKeys(page.getFirstNameField(), 'john');
    helper.sendKeys(page.getLastNameField(), 'smith');
    helper.click(page.getMaleRadioBtn());
    helper.sendKeys(page.getEmailField(), 'test@test.com');
    helper.sendKeys(page.getPhoneField(), '123-4567890');
    helper.click(page.getQualificationOptionMaster());
    helper.sendKeys(page.getCityField(), 'london');
    helper.sendKeys(page.getStateField(), 'ontario');
    helper.sendKeys(page.getZipcodeField(), '12345');
    helper.focusThenUnfocus(page.getPhoneField(), page.getFirstNameField());
    helper.smartWait(page.getPhoneWrongFormatWarningMessage());
    expect(page.getSubmitBtn().isEnabled()).toBe(false);
  });

  // Verifying the submit button is not enabled if all but city is empty.
  it('submit button should not be enabled if all but city is empty', () => {
    page.navigateTo();
    helper.sendKeys(page.getFirstNameField(), 'john');
    helper.sendKeys(page.getLastNameField(), 'smith');
    helper.click(page.getMaleRadioBtn());
    helper.sendKeys(page.getEmailField(), 'test@test.com');
    helper.sendKeys(page.getPhoneField(), '123-456-7890');
    helper.click(page.getQualificationOptionMaster());
    helper.sendKeys(page.getStateField(), 'ontario');
    helper.sendKeys(page.getZipcodeField(), '12345');
    helper.focusThenUnfocus(page.getCityField(), page.getFirstNameField());
    helper.smartWait(page.getCityEmptyWarningMessage());
    expect(page.getSubmitBtn().isEnabled()).toBe(false);
  });

  // Verifying the submit button is not enabled if all but city is too short.
  it('submit button should not be enabled if all but city is too short', () => {
    page.navigateTo();
    helper.sendKeys(page.getFirstNameField(), 'john');
    helper.sendKeys(page.getLastNameField(), 'smith');
    helper.click(page.getMaleRadioBtn());
    helper.sendKeys(page.getEmailField(), 'test@test.com');
    helper.sendKeys(page.getPhoneField(), '123-456-7890');
    helper.click(page.getQualificationOptionMaster());
    helper.sendKeys(page.getCityField(), helper.randomString(2));
    helper.sendKeys(page.getStateField(), 'ontario');
    helper.sendKeys(page.getZipcodeField(), '12345');
    helper.focusThenUnfocus(page.getCityField(), page.getFirstNameField());
    helper.smartWait(page.getCityTooShortWarningMessage());
    expect(page.getSubmitBtn().isEnabled()).toBe(false);
  });

  // Verifying the submit button is not enabled if all but city is too long.
  it('submit button should not be enabled if all but city is too long', () => {
    page.navigateTo();
    helper.sendKeys(page.getFirstNameField(), 'john');
    helper.sendKeys(page.getLastNameField(), 'smith');
    helper.click(page.getMaleRadioBtn());
    helper.sendKeys(page.getEmailField(), 'test@test.com');
    helper.sendKeys(page.getPhoneField(), '123-456-7890');
    helper.click(page.getQualificationOptionMaster());
    helper.sendKeys(page.getCityField(), helper.randomString(21));
    helper.sendKeys(page.getStateField(), 'ontario');
    helper.sendKeys(page.getZipcodeField(), '12345');
    helper.focusThenUnfocus(page.getCityField(), page.getFirstNameField());
    helper.smartWait(page.getCityTooLongWarningMessage());
    expect(page.getSubmitBtn().isEnabled()).toBe(false);
  });

  // Verifying the submit button is not enabled if all but city is in wrong format.
  it('submit button should not be enabled if all but city is in wrong format', () => {
    page.navigateTo();
    helper.sendKeys(page.getFirstNameField(), 'john');
    helper.sendKeys(page.getLastNameField(), 'smith');
    helper.click(page.getMaleRadioBtn());
    helper.sendKeys(page.getEmailField(), 'test@test.com');
    helper.sendKeys(page.getPhoneField(), '123-456-7890');
    helper.click(page.getQualificationOptionMaster());
    helper.sendKeys(page.getCityField(), '0london');
    helper.sendKeys(page.getStateField(), 'ontario');
    helper.sendKeys(page.getZipcodeField(), '12345');
    helper.focusThenUnfocus(page.getCityField(), page.getFirstNameField());
    helper.smartWait(page.getCityWrongFormatWarningMessage());
    expect(page.getSubmitBtn().isEnabled()).toBe(false);
  });

  // Verifying the submit button is not enabled if all but state is empty.
  it('submit button should not be enabled if all but state is empty', () => {
    page.navigateTo();
    helper.sendKeys(page.getFirstNameField(), 'john');
    helper.sendKeys(page.getLastNameField(), 'smith');
    helper.click(page.getMaleRadioBtn());
    helper.sendKeys(page.getEmailField(), 'test@test.com');
    helper.sendKeys(page.getPhoneField(), '123-456-7890');
    helper.click(page.getQualificationOptionMaster());
    helper.sendKeys(page.getCityField(), 'london');
    helper.sendKeys(page.getZipcodeField(), '12345');
    helper.focusThenUnfocus(page.getStateField(), page.getFirstNameField());
    helper.smartWait(page.getStateEmptyWarningMessage());
    expect(page.getSubmitBtn().isEnabled()).toBe(false);
  });

  // Verifying the submit button is not enabled if all but state is too short.
  it('submit button should not be enabled if all but state is too short', () => {
    page.navigateTo();
    helper.sendKeys(page.getFirstNameField(), 'john');
    helper.sendKeys(page.getLastNameField(), 'smith');
    helper.click(page.getMaleRadioBtn());
    helper.sendKeys(page.getEmailField(), 'test@test.com');
    helper.sendKeys(page.getPhoneField(), '123-456-7890');
    helper.click(page.getQualificationOptionMaster());
    helper.sendKeys(page.getCityField(), 'london');
    helper.sendKeys(page.getStateField(), helper.randomString(2));
    helper.sendKeys(page.getZipcodeField(), '12345');
    helper.focusThenUnfocus(page.getStateField(), page.getFirstNameField());
    helper.smartWait(page.getStateTooShortWarningMessage());
    expect(page.getSubmitBtn().isEnabled()).toBe(false);
  });

  // Verifying the submit button is not enabled if all but state is too long.
  it('submit button should not be enabled if all but state is too long', () => {
    page.navigateTo();
    helper.sendKeys(page.getFirstNameField(), 'john');
    helper.sendKeys(page.getLastNameField(), 'smith');
    helper.click(page.getMaleRadioBtn());
    helper.sendKeys(page.getEmailField(), 'test@test.com');
    helper.sendKeys(page.getPhoneField(), '123-456-7890');
    helper.click(page.getQualificationOptionMaster());
    helper.sendKeys(page.getCityField(), 'london');
    helper.sendKeys(page.getStateField(), helper.randomString(21));
    helper.sendKeys(page.getZipcodeField(), '12345');
    helper.focusThenUnfocus(page.getStateField(), page.getFirstNameField());
    helper.smartWait(page.getStateTooLongWarningMessage());
    expect(page.getSubmitBtn().isEnabled()).toBe(false);
  });

  // Verifying the submit button is not enabled if all but state is in wrong format.
  it('submit button should not be enabled if all but state is in wrong format', () => {
    page.navigateTo();
    helper.sendKeys(page.getFirstNameField(), 'john');
    helper.sendKeys(page.getLastNameField(), 'smith');
    helper.click(page.getMaleRadioBtn());
    helper.sendKeys(page.getEmailField(), 'test@test.com');
    helper.sendKeys(page.getPhoneField(), '123-456-7890');
    helper.click(page.getQualificationOptionMaster());
    helper.sendKeys(page.getCityField(), 'london');
    helper.sendKeys(page.getStateField(), '0ontario');
    helper.sendKeys(page.getZipcodeField(), '12345');
    helper.focusThenUnfocus(page.getStateField(), page.getFirstNameField());
    helper.smartWait(page.getStateWrongFormatWarningMessage());
    expect(page.getSubmitBtn().isEnabled()).toBe(false);
  });

  // Verifying the submit button is not enabled if all but zipcode is empty.
  it('submit button should not be enabled if all but zipcode is empty', () => {
    page.navigateTo();
    helper.sendKeys(page.getFirstNameField(), 'john');
    helper.sendKeys(page.getLastNameField(), 'smith');
    helper.click(page.getMaleRadioBtn());
    helper.sendKeys(page.getEmailField(), 'test@test.com');
    helper.sendKeys(page.getPhoneField(), '123-456-7890');
    helper.click(page.getQualificationOptionMaster());
    helper.sendKeys(page.getCityField(), 'london');
    helper.sendKeys(page.getStateField(), 'ontario');
    helper.focusThenUnfocus(page.getZipcodeField(), page.getFirstNameField());
    helper.smartWait(page.getZipcodeEmptyWarningMessage());
    expect(page.getSubmitBtn().isEnabled()).toBe(false);
  });

  // Verifying the submit button is not enabled if all but zipcode is too short.
  it('submit button should not be enabled if all but zipcode is too short', () => {
    page.navigateTo();
    helper.sendKeys(page.getFirstNameField(), 'john');
    helper.sendKeys(page.getLastNameField(), 'smith');
    helper.click(page.getMaleRadioBtn());
    helper.sendKeys(page.getEmailField(), 'test@test.com');
    helper.sendKeys(page.getPhoneField(), '123-456-7890');
    helper.click(page.getQualificationOptionMaster());
    helper.sendKeys(page.getCityField(), 'london');
    helper.sendKeys(page.getStateField(), 'ontario');
    helper.sendKeys(page.getZipcodeField(), helper.randomString(4));
    helper.focusThenUnfocus(page.getZipcodeField(), page.getFirstNameField());
    helper.smartWait(page.getZipcodeTooShortWarningMessage());
    expect(page.getSubmitBtn().isEnabled()).toBe(false);
  });

  // Verifying the submit button is not enabled if all but zipcode is too long.
  it('submit button should not be enabled if all but zipcode is too long', () => {
    page.navigateTo();
    helper.sendKeys(page.getFirstNameField(), 'john');
    helper.sendKeys(page.getLastNameField(), 'smith');
    helper.click(page.getMaleRadioBtn());
    helper.sendKeys(page.getEmailField(), 'test@test.com');
    helper.sendKeys(page.getPhoneField(), '123-456-7890');
    helper.click(page.getQualificationOptionMaster());
    helper.sendKeys(page.getCityField(), 'london');
    helper.sendKeys(page.getStateField(), 'ontario');
    helper.sendKeys(page.getZipcodeField(), helper.randomString(6));
    helper.focusThenUnfocus(page.getZipcodeField(), page.getFirstNameField());
    helper.smartWait(page.getZipcodeTooLongWarningMessage());
    expect(page.getSubmitBtn().isEnabled()).toBe(false);
  });

  // Verifying the submit button is not enabled if all but zipcode is in wrong format.
  it('submit button should not be enabled if all but zipcode is in wrong format', () => {
    page.navigateTo();
    helper.sendKeys(page.getFirstNameField(), 'john');
    helper.sendKeys(page.getLastNameField(), 'smith');
    helper.click(page.getMaleRadioBtn());
    helper.sendKeys(page.getEmailField(), 'test@test.com');
    helper.sendKeys(page.getPhoneField(), '123-456-7890');
    helper.click(page.getQualificationOptionMaster());
    helper.sendKeys(page.getCityField(), 'london');
    helper.sendKeys(page.getStateField(), 'ontario');
    helper.sendKeys(page.getZipcodeField(), '12a45');
    helper.focusThenUnfocus(page.getZipcodeField(), page.getFirstNameField());
    helper.smartWait(page.getZipcodeWrongFormatWarningMessage());
    expect(page.getSubmitBtn().isEnabled()).toBe(false);
  });

  // Verifying the submit button is enabled if all fields are filled without error.
  it('submit button should be enabled if all fields are filled without error', () => {
    page.navigateTo();
    helper.sendKeys(page.getFirstNameField(), 'john');
    helper.sendKeys(page.getLastNameField(), 'smith');
    helper.click(page.getMaleRadioBtn());
    helper.sendKeys(page.getEmailField(), 'test@test.com');
    helper.sendKeys(page.getPhoneField(), '123-456-7890');
    helper.click(page.getQualificationOptionMaster());
    helper.sendKeys(page.getCityField(), 'london');
    helper.sendKeys(page.getStateField(), 'ontario');
    helper.sendKeys(page.getZipcodeField(), '12345');
    expect(page.getSubmitBtn().isEnabled()).toBe(true);
  });
});
