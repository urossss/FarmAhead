import { Component, OnInit, ElementRef, ViewChildren, QueryList } from '@angular/core';
import { UserService } from '../user.service';
import { User } from '../models/user';

@Component({
  selector: 'app-admin-users',
  templateUrl: './admin-users.component.html',
  styleUrls: ['./admin-users.component.css']
})
export class AdminUsersComponent implements OnInit {

  @ViewChildren('fullName') fullNames: QueryList<any>;
  @ViewChildren('firstName') firstNames: QueryList<any>;
  @ViewChildren('lastName') lastNames: QueryList<any>;
  @ViewChildren('phone') phones: QueryList<any>;
  @ViewChildren('email') emails: QueryList<any>;

  users: User[];

  constructor(private userService: UserService, private elRef: ElementRef) { }

  ngOnInit(): void {
    this.users = null;
    this.userService.getApprovedUsers().subscribe((res: User[]) => {
      this.users = res;
    });
  }

  update(user: User) {
    let success = true;
    let change = false;

    let firstName = '';
    let lastName = '';
    let fullName = '';
    let phone = '';
    let email = '';

    if (user.type == 'poljoprivrednik' || user.type == 'admin') {
      let firstNameElement = this.firstNames.filter(el => el.nativeElement.id == 'firstName_' + user.username)[0].nativeElement;
      firstName = firstNameElement.innerHTML.trim();
      let firstNameStatus = this.updateNativeElement(firstNameElement, user.firstName, firstName);
      success = success && (firstNameStatus >= 0);
      change = change || (firstNameStatus > 0);

      let lastNameElement = this.lastNames.filter(el => el.nativeElement.id == 'lastName_' + user.username)[0].nativeElement;
      lastName = lastNameElement.innerHTML.trim();
      let lastNameStatus = this.updateNativeElement(lastNameElement, user.lastName, lastName);
      success = success && (lastNameStatus >= 0);
      change = change || (lastNameStatus > 0);
    }

    if (user.type == 'poljoprivrednik') {
      let phoneElement = this.phones.filter(el => el.nativeElement.id == 'phone_' + user.username)[0].nativeElement;
      phone = phoneElement.innerHTML.trim();
      let regex = /^\+381 [0-9]*$/;
      if (!regex.test(phone) || phone.length < 13 || phone.length > 14) {
        phone = '';
      }
      let phoneStatus = this.updateNativeElement(phoneElement, '+381 ' + user.phone, phone);
      success = success && (phoneStatus >= 0);
      change = change || (phoneStatus > 0);
    }

    if (user.type == 'preduzece') {
      let fullNameElement = this.fullNames.filter(el => el.nativeElement.id == 'fullName_' + user.username)[0].nativeElement;
      fullName = fullNameElement.innerHTML.trim();
      let fullNameStatus = this.updateNativeElement(fullNameElement, user.fullName, fullName);
      success = success && (fullNameStatus >= 0);
      change = change || (fullNameStatus > 0);
    }

    let emailElement = this.emails.filter(el => el.nativeElement.id == 'email_' + user.username)[0].nativeElement;
    email = emailElement.innerHTML.trim();
    let emailRegex = /^\w[\w\.]+\w@\w+\.\w+$/;
    if (!emailRegex.test(email)) {
      email = '';
    }
    let emailStatus = this.updateNativeElement(emailElement, user.email, email);
    success = success && (emailStatus >= 0);
    change = change || (emailStatus > 0);

    if (success && change) {
      if (user.type == 'poljoprivrednik') {
        user.firstName = firstName;
        user.lastName = lastName;
        user.phone = phone.substr(5);
      } else if (user.type == 'preduzece') {
        user.fullName = fullName;
      } else if (user.type == 'admin') {
        user.firstName = firstName;
        user.lastName = lastName;
      }
      user.email = email;

      this.userService.updateUser(user);
    }
  }

  updateNativeElement(element, oldVal, newVal): number {
    if (newVal == '' || newVal == '<br>') {
      element.classList.add('border');
      element.classList.add('border-danger');
      element.classList.remove('border-primary');
      return -1; // invalid change
    } else if (newVal != oldVal) {
      element.classList.add('border');
      element.classList.add('border-primary');
      element.classList.remove('border-danger');
      return 1; // valid change
    } else {
      element.classList.remove('border');
      element.classList.remove('border-primary');
      element.classList.remove('border-danger');
      return 0; // no change
    }
  }

  delete(user: User) {
    this.users = this.users.filter(u => u.username != user.username);
    this.userService.deleteUser(user.username);
  }

}
