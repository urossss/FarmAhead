import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { User } from './models/user';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  uri = 'http://localhost:4000';

  user: User;

  constructor(private http: HttpClient) {
    this.init();
  }

  init(): void {
    this.user = null;
    
    let userInfo = JSON.parse(localStorage.getItem('user'));
    if (userInfo != null) {
      this.user = {
        type: userInfo.type,
        username: userInfo.username,
        email: userInfo.email,
        fullName: userInfo.fullName,
        place: userInfo.place,
        transporters: userInfo.transporters
      } as User;
    }
  }

  getUserType(): string {
    return this.user == null ? null : this.user.type;
  }

  getUsername(): string {
    return this.user == null ? null : this.user.username;
  }

  getEmail(): string {
    return this.user == null ? null : this.user.email;
  }

  getFullName(): string {
    return this.user == null ? null : this.user.fullName;
  }

  getPlace(): string {
    return this.user == null ? null : this.user.place;
  }

  getTransporters(): string[] {
    return this.user == null ? null : this.user.transporters;
  }

  login(username: string, password: string) {
    const data = {
      username: username,
      password: password
    };

    return this.http.post(`${this.uri}/login`, data).pipe(
      map((user: User[]) => {
        if (user[0]) {
          this.user = user[0];

          let userInfo = {
            type: user[0].type,
            username: user[0].username,
            email: user[0].email,
            fullName: user[0].fullName,
            place: user[0].place,
            transporters: user[0].transporters
          };
          localStorage.setItem('user', JSON.stringify(userInfo));
        } else {
          this.user = null;
        }
        return this.user;
      })
    );
  }

  logout() {
    localStorage.removeItem('user');
    this.user = null;
  }

  changePassword(oldPassword: string, newPassword: string) {
    const data = {
      username: this.user.username,
      oldPassword: oldPassword,
      newPassword: newPassword
    };

    return this.http.post(`${this.uri}/change-password`, data);
  }

  register(user: User) {
    let data = user;
    data['approved'] = false;

    return this.http.post(`${this.uri}/registration`, data);
  }

  validateCaptcha(captcha: string) {
    const token = {
      captcha: captcha
    }

    return this.http.post(`${this.uri}/validate-captcha`, token);
  }

  getUnapprovedRegistrationRequests() {
    return this.http.get(`${this.uri}/admin/requests`);
  }

  getApprovedUsers() {
    return this.http.get(`${this.uri}/admin/users`);
  }

  acceptUser(username: string) {
    const data = {
      username: username
    };

    this.http.post(`${this.uri}/admin/accept-user`, data).subscribe();
  }

  rejectUser(username: string) {
    this.deleteUser(username);
  }

  updateUser(user: User) {
    this.http.post(`${this.uri}/admin/update-user`, user).subscribe();
  }

  deleteUser(username: string) {
    const data = {
      username: username
    };
    
    this.http.post(`${this.uri}/admin/delete-user`, data).subscribe();
  }

  addUser(user: User) {
    let data = user;
    data['approved'] = true;

    return this.http.post(`${this.uri}/registration`, data);
  }

  updateTransporterValues() {
    console.log(this.user.transporters);
    let data = {
      username: this.user.username,
      transporters: this.user.transporters
    };
    localStorage.setItem('user', JSON.stringify(this.user));

    this.http.post(`${this.uri}/company/update-transporters`, data).subscribe();
  }
}
