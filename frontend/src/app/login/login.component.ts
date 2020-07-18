import { Component, OnInit } from '@angular/core';
import { UserService } from '../user.service';
import { Router } from '@angular/router';
import { User } from '../models/user';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  username: string;
  password: string;

  usernameCheck = 0;
  passwordCheck = 0;

  constructor(private userService: UserService, private router: Router) {}

  ngOnInit(): void {
    this.resetAllFields();
  }

  login() {
    let success = true;

    this.usernameCheck = this.isValidField(this.username) ? 1 : 2;

    this.passwordCheck = this.isValidField(this.password) ? 1 : 2;

    success = this.usernameCheck == 1 && this.passwordCheck == 1;

    if (success) { // all data seems valid, check if username and password are valid
      this.userService.login(this.username, this.password).subscribe((user: User) => {
        if (user != null) {
          if (user.type == 'poljoprivrednik') {
            this.router.navigate(['/poljoprivrednik']);
          } else if (user.type == 'preduzece') {
            this.router.navigate(['/preduzece']);
          } else if (user.type == 'admin') {
            this.router.navigate(['/admin']);
          } else {
            console.log('wrong user type');
          }
        } else {
          console.log('login error');
          this.usernameCheck = 3;
          this.passwordCheck = 3;
        }
      });
    }
  }

  resetAllFields() {
    this.usernameCheck = 0;
    this.passwordCheck = 0;
  }

  isValidField(s: string): boolean {
    return s != null && s != '';
  }

}
