import { Component, OnInit } from '@angular/core';
import { UserService } from '../user.service';
import { FarmerService } from '../farmer.service';

@Component({
  selector: 'app-farmer-add-garden',
  templateUrl: './farmer-add-garden.component.html',
  styleUrls: ['./farmer-add-garden.component.css']
})
export class FarmerAddGardenComponent implements OnInit {

  name: string;
  place: string;
  rows: number;
  cols: number;

  nameCheck = 0;
  placeCheck = 0;
  rowsCheck = 0;
  colsCheck = 0;

  successful = false;

  constructor(private userService: UserService, private farmerService: FarmerService) { }

  ngOnInit(): void {
    this.resetAllFields();
  }

  addGarden() {
    this.nameCheck = this.isValidField(this.name) ? 1 : 2;
    this.placeCheck = this.isValidField(this.place) ? 1 : 2;
    this.rowsCheck = this.getNumberState(this.rows);
    this.colsCheck = this.getNumberState(this.cols);

    let success = this.nameCheck == 1 &&
      this.placeCheck == 1 &&
      this.rowsCheck == 1 &&
      this.colsCheck == 1;

    if (success) {
      let garden = {
        owner: this.userService.getUsername(),
        ownerEmail: this.userService.getEmail(),
        name: this.name,
        place: this.place,
        rows: this.rows,
        cols: this.cols,
        free: this.rows * this.cols,
        water: 200,
        temperature: 18,
        lastUpdate: new Date().toISOString(),
        plants: [],
        products: []
      };

      this.farmerService.addNewGarden(garden).subscribe(res => {
        if (res['success'] == true) { // garden added successfully
          console.log(res);
          this.resetAllFields();
          this.successful = true;
          document.body.scrollTop = document.documentElement.scrollTop = 0;
        } else {
          this.successful = false;
        }
      });
    }
  }

  resetAllFields() {
    this.successful = false;

    this.nameCheck = 0;
    this.placeCheck = 0;
    this.rowsCheck = 0;
    this.colsCheck = 0;

    this.name = '';
    this.place = '';
    this.rows = null;
    this.cols = null;
  }

  isValidField(s: string): boolean {
    return s != null && s != '';
  }

  getNumberState(n: number) {
    if (n == null) {
      return 2;
    } else {
      if (n < 1) {
        return 3;
      }
      if (Number.isInteger(n)) {
        return 1;
      } else {
        return 4;
      }
    }
  }

}
