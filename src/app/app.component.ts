import { Component } from '@angular/core';
import { FormGroup,  FormBuilder,  Validators, FormControl  } from '@angular/forms';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  get firstName() {
    return this.simpleForm.get('firstName');
  }

  get lastName() {
    return this.simpleForm.get('lastName');
  }

  get email(){
    return this.simpleForm.get('email');
  }

  get phone(){
    return this.simpleForm.get('phone');
  }

  get city(){
    return this.simpleForm.get('address.city');
  }

  get state(){
    return this.simpleForm.get('address.state');
  }

  get zipcode(){
    return this.simpleForm.get('address.zipcode');
  }

  private firstNameValidator = ['', [Validators.required, Validators.minLength(3), Validators.maxLength(20)]];
  private lastNameValidator = ['', [Validators.required, Validators.minLength(3), Validators.maxLength(20)]];
  private genderValidator = ['', Validators.required];
  private emailValidator = [
    '',
    Validators.compose([Validators.required, Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')])
  ];
  private phoneNumberValidator = [
    '',
    Validators.compose([Validators.required, Validators.pattern('^[0-9]{1}[0-9]{2}-[0-9]{3}-[0-9]{4}$')])
  ];

  private qualificationValidator = [
    '',
    Validators.required
  ];
  
  private cityValidator = [
    '',
    Validators.compose([
      Validators.required,
      Validators.minLength(3),
      Validators.maxLength(20),
      Validators.pattern('^[a-zA-Z]+(?:\.(?!-))?(?:[\s-]?[a-zA-Z]+)')
    ])
  ]
  private stateValidator = [
    '',
    Validators.compose([
      Validators.required,
      Validators.minLength(3),
      Validators.maxLength(20),
      Validators.pattern('^[a-zA-Z]+(?:\.(?!-))?(?:[\s-]?[a-zA-Z]+)')
    ])
  ];
  private zipcodeValidator = [
    '',
    Validators.compose([
      Validators.required,
      Validators.minLength(5),
      Validators.maxLength(5),
      Validators.pattern('^[0-9]{5}$')
    ])
  ];
  private addressValidator = this.fb.group({
    city: this.cityValidator,
    state: this.stateValidator,
    zipcode: this.zipcodeValidator
  });

  public simpleForm = this.fb.group({
    firstName: this.firstNameValidator,
    lastName: this.lastNameValidator,
    gender: this.genderValidator,
    email: this.emailValidator,
    phone: this.phoneNumberValidator,
    qualification: this.qualificationValidator,
    address: this.addressValidator
  });

  public qualifications = this.qualificationList();

  constructor(private fb: FormBuilder){ }

  public qualificationList() {    
      return [
        { id: '1', name: 'Masters degree' },
        { id: '2', name: 'Bachelors degree' },
        { id: '3', name: 'Doctoral degree' },
        { id: '4', name: 'Associate degree' }
      ];
    
  }

  public onSubmit() {
    // stop here if form is invalid
    if (this.simpleForm.invalid) {
        return;
    }
    // display form values on success
    alert('SUCCESS!! :-)\n\n' + JSON.stringify(this.simpleForm.value, null, 4));
  }

  public onReset() {
    this.simpleForm.reset();
  }
}
