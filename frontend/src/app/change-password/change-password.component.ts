import { Component, OnInit } from '@angular/core';
import { UserService } from '../user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css']
})
export class ChangePasswordComponent implements OnInit {

  oldPassword: string;
  password: string;
  passwordConfirmation: string;

  oldPasswordCheck = 0;
  passwordCheck = 0;
  passwordConfirmationCheck = 0;

  constructor(private userService: UserService, private router: Router) { }

  ngOnInit(): void {
    this.resetAllFields();
  }

  changePassword() {
    let success = true;

    this.oldPasswordCheck = this.isValidField(this.oldPassword) ? 1 : 2;

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

    if (this.passwordCheck == 1 && this.passwordConfirmationCheck == 1 && this.password == this.oldPassword) {
      this.passwordCheck = this.passwordConfirmationCheck = 5;
    }

    success =
      this.oldPasswordCheck == 1 &&
      this.passwordCheck == 1 &&
      this.passwordConfirmationCheck == 1;

    if (success) { // all data seems valid, check if password is correct
      // change password if old password is correct
      this.userService.changePassword(this.oldPassword, this.password).subscribe(res => {
        if (res['success'] == true) {
          // logout and redirect to login page
          this.userService.logout();
          this.router.navigate(['/prijava']);

        } else {
          this.oldPasswordCheck = 3;
        }
      });
    }
  }

  resetAllFields() {
    this.oldPasswordCheck = 0;
    this.passwordCheck = 0;
    this.passwordConfirmationCheck = 0;
  }

  isValidField(s: string): boolean {
    return s != null && s != '';
  }

}
