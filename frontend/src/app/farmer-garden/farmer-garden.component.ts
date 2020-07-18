import { Component, OnInit, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { Garden } from '../models/garden';
import { FarmerService } from '../farmer.service';
import { ActivatedRoute } from '@angular/router';
import { Plant } from '../models/plant';

@Component({
  selector: 'app-farmer-garden',
  templateUrl: './farmer-garden.component.html',
  styleUrls: ['./farmer-garden.component.css']
})
export class FarmerGardenComponent implements OnInit, OnDestroy {

  @ViewChild('preparationModal') prepModal: ElementRef;
  @ViewChild('newplantModal') newplantModal: ElementRef;
  @ViewChild('takeoutModal') takeoutModal: ElementRef;

  garden: Garden;
  id: number;
  plants: Plant[][];

  selectedOrderId: number;

  water: number;
  temperature: number;

  indMap: Map<string, number>;
  nameSortDir: string = '';
  companySortDir: string = '';
  amountSortDir: string = '';
  rotate: { [key: string]: string } = { 'asc': 'desc', 'desc': '', '': 'asc' };
  searchTerm: string = '';

  intervalId: any = null;
  timeoutId: any = null;
  updateInterval: number = 60 * 60 * 1000; // 1 hour

  constructor(private farmerService: FarmerService, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.id = Number(this.route.snapshot.paramMap.get('id'));
    this.garden = this.farmerService.getGardenById(this.id);
    this.plants = [];
    this.indMap = new Map();

    this.water = this.garden.water;
    this.temperature = this.garden.temperature;

    this.garden.plants = this.farmerService.getCachedGardenPlants(this.id);
    this.garden.products = this.farmerService.getCachedGardenProducts(this.id);
    if (this.garden.plants == null || this.garden.products == null) {
      console.log('getDataFromServer');
      this.farmerService.getGardenDataFromServer(this.id).subscribe((res) => {
        this.garden.plants = res[0].plants;
        this.garden.products = res[0].products;
        this.fillPlants();
        this.fillInd();
      });
    } else {
      console.log('getDataCached');
      this.fillPlants();
      this.fillInd();
    }

    this.mySetTimeout();
  }

  ngOnDestroy(): void {
    if (this.intervalId != null) {
      clearInterval(this.intervalId);
    }
  }


  mySetTimeout() {
    let curDate = new Date();
    let lastDate = new Date(this.garden.lastUpdate);
    let diff = this.updateInterval - (curDate.getTime() - lastDate.getTime());
    if (diff < 0) {
      diff = this.updateInterval;
    }
    setTimeout(this.tick, diff, this);
  }

  tick(context) {
    context.intervalId = setInterval(function (context) {
      context.water--;
      context.temperature--;
    }, context.updateInterval, context);

    context.water--;
    context.temperature--;
  }


  // sorting

  fillInd() {
    this.garden.products.forEach((product, index) => {
      this.indMap.set(product.id, index);
    });
  }

  compare(v1, v2) {
    return v1 < v2 ? -1 : v1 > v2 ? 1 : 0;
  }

  sort(column: string, direction: string) {
    if (direction == '') {
      this.garden.products.sort((p1, p2) => {
        return this.compare(this.indMap.get(p1.id), this.indMap.get(p2.id));
      });
      return;
    } else {
      this.garden.products.sort((p1, p2) => {
        let res = this.compare(p1[column], p2[column]);
        return direction == 'asc' ? res : -res;
      });
    }
  }

  sortByName() {
    this.nameSortDir = this.rotate[this.nameSortDir];
    this.companySortDir = this.amountSortDir = '';
    this.sort('name', this.nameSortDir);
  }

  sortByCompanyName() {
    this.companySortDir = this.rotate[this.companySortDir];
    this.nameSortDir = this.amountSortDir = '';
    this.sort('companyName', this.companySortDir);
  }

  sortByAmount() {
    this.amountSortDir = this.rotate[this.amountSortDir];
    this.nameSortDir = this.companySortDir = '';
    this.sort('amount', this.amountSortDir);
  }

  getProductState(product) {
    if (product.deliveryDate == null) {
      return 'Na čekanju'; // waiting
    }
    let curDate = new Date();
    let delDate = new Date(product.deliveryDate);
    if (delDate.getTime() > curDate.getTime()) {
      return 'Na dostavi'; // on delivery
    } else {
      return product.amount; // delivered
    }
  }


  // plants

  fillPlants() {
    let rows = this.garden.rows;
    let cols = this.garden.cols;

    for (let r = 0; r < rows; r++) {
      this.plants[r] = [];

      for (let c = 0; c < cols; c++) {
        this.plants[r][c] = null;
      }
    }

    this.garden.plants.forEach(p => {
      this.plants[p.row][p.col] = {
        name: p.plant == null ? null : p.plant.name,
        companyName: p.plant == null ? null : p.plant.companyName,
        companyUsername: p.plant == null ? null : p.plant.companyUsername,
        startDate: p.startDate,
        finishDate: p.finishDate,
        progress: p.progress
      };
    });

    //console.log(this.plants);
  }

  getPlantState(plant: Plant): number {
    if (plant == null) { // no plant here, this place is free
      return 1;
    }
    let curDate = new Date();
    if (plant.name != null) {
      curDate.setDate(curDate.getDate() + plant.progress);
    }
    let finishDate = new Date(plant.finishDate);
    if (finishDate.getTime() < curDate.getTime()) {
      if (plant.name == null) { // plant is taken out, this place is free
        return 1;
      } else { // plant is fully grown, it can be taken out
        return 3;
      }
    } else {
      if (plant.name == null) { // plant is taken out, but place still isn't free
        return 4;
      } else { // plant is still growing
        return 2;
      }
    }
  }

  getPlantProgress(plant: Plant): number {
    let curDate = new Date();
    curDate.setDate(curDate.getDate() + plant.progress);
    let startDate = new Date(plant.startDate);
    let finishDate = new Date(plant.finishDate);
    let total = finishDate.getTime() / 1000 - startDate.getTime() / 1000;
    let done = curDate.getTime() / 1000 - startDate.getTime() / 1000;
    let percentage = Math.round(100 * done / total);
    return percentage;
  }

  addPreparation(preparation) {
    let row = this.prepModal.nativeElement.dataset.row;
    let col = this.prepModal.nativeElement.dataset.col;

    this.plants[row][col].progress += preparation.time;

    let data = {
      row: row,
      col: col,
      plant: {
        name: this.plants[row][col].name,
        companyName: this.plants[row][col].companyName,
        companyUsername: this.plants[row][col].companyUsername
      },
      startDate: this.plants[row][col].startDate,
      finishDate: this.plants[row][col].finishDate,
      progress: this.plants[row][col].progress
    };

    let ind1 = this.garden.products.findIndex(p => p.id == preparation.id);

    let product = {
      id: this.garden.products[ind1].id,
      name: this.garden.products[ind1].name,
      type: this.garden.products[ind1].type,
      companyName: this.garden.products[ind1].companyName,
      companyUsername: this.garden.products[ind1].companyUsername,
      amount: this.garden.products[ind1].amount - 1,
      time: this.garden.products[ind1].time,
      deliveryDate: this.garden.products[ind1].deliveryDate
    };

    if (ind1 >= 0) {
      if (this.garden.products[ind1].amount > 1) {
        this.garden.products[ind1].amount--;
      } else {
        this.garden.products.splice(ind1, 1);
      }
    }

    this.farmerService.addNewPlantAddPreparation(this.id, preparation.id, data, product);
  }

  addNewPlant(plant) {
    let row = Number(this.newplantModal.nativeElement.dataset.row);
    let col = Number(this.newplantModal.nativeElement.dataset.col);

    let curDate = new Date();
    let curDateStr = curDate.toISOString();
    let finishDate = new Date(curDate.getTime() + plant.time * 24 * 60 * 60 * 1000);
    let finishDateStr = finishDate.toISOString();

    let data = {
      row: row,
      col: col,
      plant: {
        name: plant.name,
        companyName: plant.companyName,
        companyUsername: plant.companyUsername
      },
      startDate: curDateStr,
      finishDate: finishDateStr,
      progress: 0
    };

    this.plants[row][col] = {
      name: plant.name,
      companyName: plant.companyName,
      companyUsername: plant.companyUsername,
      startDate: curDateStr,
      finishDate: finishDateStr,
      progress: 0
    };

    let ind1 = this.garden.products.findIndex(p => p.id == plant.id);

    let product = {
      id: this.garden.products[ind1].id,
      name: this.garden.products[ind1].name,
      type: this.garden.products[ind1].type,
      companyName: this.garden.products[ind1].companyName,
      companyUsername: this.garden.products[ind1].companyUsername,
      amount: this.garden.products[ind1].amount - 1,
      time: this.garden.products[ind1].time,
      deliveryDate: this.garden.products[ind1].deliveryDate
    };

    if (ind1 >= 0) {
      if (this.garden.products[ind1].amount > 1) {
        this.garden.products[ind1].amount--;
      } else {
        this.garden.products.splice(ind1, 1);
      }
    }

    this.garden.free--;

    this.farmerService.addNewPlantAddPreparation(this.id, plant.id, data, product);
  }

  takeoutPlant() {
    let row = this.takeoutModal.nativeElement.dataset.row;
    let col = this.takeoutModal.nativeElement.dataset.col;

    let curDate = new Date();
    let curDateStr = curDate.toISOString();
    let finishDate = new Date(curDate.getTime() + 24 * 60 * 60 * 1000); // place becomes free after 1 day
    let finishDateStr = finishDate.toISOString();

    let data = {
      row: row,
      col: col,
      plant: null,
      startDate: curDateStr,
      finishDate: finishDateStr,
      progress: 0
    };

    this.plants[row][col] = {
      name: null,
      companyName: null,
      companyUsername: null,
      startDate: curDateStr,
      finishDate: finishDateStr,
      progress: 0
    };

    this.garden.free++;

    this.farmerService.takeoutPlant(this.id, data);
  }

  hasValidStoragePlants() {
    if (this.garden.products) {
      return this.garden.products.filter(p => p.type == 'sadnica' && this.getProductState(p) == p.amount).length > 0;
    } else {
      return false;
    }
  }

  hasValidStoragePreparations() {
    if (this.garden.products) {
      return this.garden.products.filter(p => p.type == 'preparat' && this.getProductState(p) == p.amount).length > 0;
    } else {
      return false;
    }
  }


  // dashboard

  updateWater(delta) {
    this.water += delta;
  }

  updateTemperature(delta) {
    this.temperature += delta;
  }

  saveChanges() {
    this.garden.water = this.water;
    this.garden.temperature = this.temperature;

    this.farmerService.updateWaterAndTemperature(this.garden._id, this.water, this.temperature);
  }

  discardChanges() {
    this.water = this.garden.water;
    this.temperature = this.garden.temperature;
  }


  // orders

  selectOrderId(id) {
    this.selectedOrderId = id;
  }

  cancelOrder() {
    this.garden.products = this.garden.products.filter(p => p.orderId != this.selectedOrderId);
    this.farmerService.saveGarden(this.garden._id, this.selectedOrderId);
    this.farmerService.cancelOrder(this.selectedOrderId);
  }

}
