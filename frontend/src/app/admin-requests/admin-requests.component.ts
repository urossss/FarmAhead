import { Component, OnInit } from '@angular/core';
import { User } from '../models/user';
import { UserService } from '../user.service';

@Component({
  selector: 'app-admin-requests',
  templateUrl: './admin-requests.component.html',
  styleUrls: ['./admin-requests.component.css']
})
export class AdminRequestsComponent implements OnInit {

  users: User[];

  constructor(private userService: UserService) { }

  ngOnInit(): void {
    this.users = null;
    this.userService.getUnapprovedRegistrationRequests().subscribe((res: User[]) => {
      this.users = res;
    });
  }

  accept(username: string) {
    this.userService.acceptUser(username);
    this.removeUserFromList(username);
  }

  reject(username: string) {
    this.userService.rejectUser(username);
    this.removeUserFromList(username);
  }

  removeUserFromList(username: string) {
    this.users = this.users.filter(user => user.username != username);
  }

}
