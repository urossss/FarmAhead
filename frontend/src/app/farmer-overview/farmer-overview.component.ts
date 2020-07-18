import { Component, OnInit } from '@angular/core';
import { FarmerService } from '../farmer.service';
import { Garden } from '../models/garden';

@Component({
  selector: 'app-farmer-overview',
  templateUrl: './farmer-overview.component.html',
  styleUrls: ['./farmer-overview.component.css']
})
export class FarmerOverviewComponent implements OnInit {

  gardens: Garden[];

  constructor(private farmerService: FarmerService) {}

  ngOnInit(): void {
    this.gardens = this.farmerService.getCachedGardens();
    if (this.gardens == null) {
      //console.log('getFromServer');
      this.farmerService.getGardensFromServer().subscribe((res: Garden[]) => {
        this.gardens = res;
        //console.log(this.gardens);
      });
    } else {
      //console.log('getCached');
      //console.log(this.gardens);
    }
  }

}
