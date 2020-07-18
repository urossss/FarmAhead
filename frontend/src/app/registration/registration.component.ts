import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../user.service';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})
export class RegistrationComponent implements OnInit {

  type: string;
  firstName: string;
  lastName: string;
  fullName: string;
  username: string;
  password: string;
  passwordConfirmation: string;
  date: string;
  place: string;
  phone: string;
  email: string;

  firstNameCheck = 0;
  lastNameCheck = 0;
  fullNameCheck = 0;
  usernameCheck = 0;
  passwordCheck = 0;
  passwordConfirmationCheck = 0;
  dateCheck = 0;
  placeCheck = 0;
  phoneCheck = 0;
  emailCheck = 0;

  captcha: string;
  captchaCheck = 0;

  registrationSuccessful = false;

  constructor(private userService: UserService, private router: Router) {
    this.type = 'poljoprivrednik';
  }

  ngOnInit(): void {
    this.resetAllFields();
  }

  submit() {
    let success = true;

    this.firstNameCheck = this.isValidField(this.firstName) ? 1 : 2;

    this.lastNameCheck = this.isValidField(this.lastName) ? 1 : 2;

    this.fullNameCheck = this.isValidField(this.fullName) ? 1 : 2;

    this.usernameCheck = this.isValidField(this.username) ? 1 : 2;

    this.passwordCheck = this.isValidField(this.password) ? 1 : 2;

    this.passwordConfirmationCheck = this.isValidField(this.passwordConfirmation) ? 1 : 2;

    let passwordRegex1 = /^((?=.*\d)(?=.*[A-Z])(?=.*[!@#$%^&*?]).{7,})$/;
    let passwordRegex2 = /^[A-Za-z].*$/;
    if (this.passwordCheck == 1 && (!passwordRegex1.test(this.password) || !passwordRegex2.test(this.password))) {
      this.passwordCheck = 4;
    }
    if (this.passwordConfirmationCheck == 1 && (!passwordRegex1.test(this.passwordConfirmation) || !passwordRegex2.test(this.passwordConfirmation))) {
      this.passwordConfirmationCheck = 4;
    }
    if (this.passwordCheck == 1 && this.passwordConfirmationCheck == 1 && this.password != this.passwordConfirmation) {
      this.passwordCheck = this.passwordConfirmationCheck = 3;
    }

    this.dateCheck = this.isValidField(this.date) ? 1 : 2;

    if (this.dateCheck == 1 && this.date == 'Invalid Date') {
      this.dateCheck = 3;
    }

    this.placeCheck = this.isValidField(this.place) ? 1 : 2;

    this.phoneCheck = this.isValidField(this.phone) ? 1 : 2;

    let phoneRegex = /^[0-9]*$/;
    if (this.phoneCheck == 1 && !(phoneRegex.test(this.phone) && (this.phone.length == 8 || this.phone.length == 9))) {
      this.phoneCheck = 3;
    }

    this.emailCheck = this.isValidField(this.email) ? 1 : 2;

    let mailRegex = /^\w[\w\.]+\w@\w+\.\w+$/;
    if (this.emailCheck == 1 && !mailRegex.test(this.email)) {
      this.emailCheck = 3;
    }

    this.captchaCheck = this.isValidField(this.captcha) ? 1 : 2;

    success =
      (this.firstNameCheck == 1 || this.type == 'preduzece') &&
      (this.lastNameCheck == 1 || this.type == 'preduzece') &&
      (this.fullNameCheck == 1 || this.type == 'poljoprivrednik') &&
      this.usernameCheck == 1 &&
      this.passwordCheck == 1 &&
      this.passwordConfirmationCheck == 1 &&
      this.dateCheck == 1 &&
      this.placeCheck == 1 &&
      (this.phoneCheck == 1 || this.type == 'preduzece') &&
      this.emailCheck == 1 &&
      this.captchaCheck == 1;

    if (success) { // all data seems valid, validate captcha and check if username exists
      this.userService.validateCaptcha(this.captcha).subscribe(res => {
        if (res['success'] == true) { // captcha validated successfully
          let user = {
            type: this.type,
            firstName: this.firstName,
            lastName: this.lastName,
            fullName: this.fullName,
            username: this.username,
            password: this.password,
            date: this.date,
            place: this.place,
            phone: this.phone,
            email: this.email,
            transporters: null
          };

          this.userService.register(user).subscribe(res => {
            if (res['success'] == true) { // registration successful
              this.resetAllFields();
              this.registrationSuccessful = true;
              document.body.scrollTop = document.documentElement.scrollTop = 0;
            } else { // registration error - username already exists
              this.registrationSuccessful = false;
              this.usernameCheck = 3;
            }
          });
        } else { // captcha validation error
          this.captcha = '';
          this.captchaCheck = 2;
        }
      });
    }
  }

  resetAllFields() {
    this.registrationSuccessful = false;

    this.firstNameCheck = 0;
    this.lastNameCheck = 0;
    this.fullNameCheck = 0;
    this.usernameCheck = 0;
    this.passwordCheck = 0;
    this.passwordConfirmationCheck = 0;
    this.dateCheck = 0;
    this.placeCheck = 0;
    this.phoneCheck = 0;
    this.emailCheck = 0;

    this.firstName = '';
    this.lastName = '';
    this.fullName = '';
    this.username = '';
    this.password = '';
    this.passwordConfirmation = '';
    this.date = '';
    this.place = '';
    this.phone = '';
    this.email = '';
  }

  isValidField(s: string): boolean {
    return s != null && s != '';
  }

}
