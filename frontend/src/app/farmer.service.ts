import { Injectable, OnDestroy } from '@angular/core';
import { UserService } from './user.service';
import { Garden } from './models/garden';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FarmerService implements OnDestroy {

  uri = 'http://localhost:4000';

  username: string;
  gardens: Garden[];

  showToastSource = new BehaviorSubject<boolean>(false);
  showToast$ = this.showToastSource.asObservable();
  minWater: number = 75;
  minTemperature: number = 12;

  intervalId: any = null;
  timeoutId: any = null;
  updateInterval: number = 60 * 60 * 1000; // 1 hour

  constructor(private userService: UserService, private http: HttpClient) {
    this.init();
  }

  init() {
    //this.gardens = null;
    this.gardens = JSON.parse(localStorage.getItem('farmer-gardens'));
    if (this.gardens != null && this.gardens.length == 0) {
      this.gardens = null;
    }
    console.log(this.gardens);

    if (this.gardens != null && this.gardens.length > 0) {
      console.log('timeout 1');
      this.timeoutId = this.mySetTimeout();
      this.setInitialShowToast();
    }
  }

  ngOnDestroy(): void {
    if (this.timeoutId != null) {
      clearTimeout(this.timeoutId);
    }
    if (this.intervalId != null) {
      clearInterval(this.intervalId);
    }
  }


  mySetTimeout() {
    let curDate = new Date();
    let lastDate = new Date(this.gardens[0].lastUpdate);
    let diff = this.updateInterval - (curDate.getTime() - lastDate.getTime());
    if (diff < 0) {
      diff = this.updateInterval;
    }
    setTimeout(this.tick, diff, this);
  }

  tick(context) {
    context.intervalId = setInterval(function (context) {
      let curDate = new Date();
      let dateStr = curDate.toISOString();
      context.gardens.forEach(garden => {
        garden.temperature--;
        garden.water--;
        garden.lastUpdate = dateStr;
        if (garden.water < context.minWater || garden.temperature < context.minTemperature) {
          context.changeShowToast(true);
        }
      });
      localStorage.setItem('farmer-gardens', JSON.stringify(context.gardens));
      console.log('now');
    }, context.updateInterval, context);

    let curDate = new Date();
    let dateStr = curDate.toISOString();
    context.gardens.forEach(garden => {
      garden.temperature--;
      garden.water--;
      garden.lastUpdate = dateStr;
    });
    localStorage.setItem('farmer-gardens', JSON.stringify(context.gardens));
    console.log('now');
  }


  changeShowToast(value) {
    this.showToastSource.next(value);
  }

  setInitialShowToast() {
    if (this.gardens) {
      let allGood = true;
      this.gardens.forEach(g => {
        if (g.water < this.minWater || g.temperature < this.minTemperature) {
          allGood = false;
        }
      });
      this.changeShowToast(!allGood);
    }
  }


  getCachedGardens() {
    return this.gardens;
  }

  getGardensFromServer() {
    this.username = this.userService.getUsername();

    return this.http.get(`${this.uri}/farmer/gardens`, {
      params: {
        username: this.username
      }
    }).pipe(
      map((gardens: Garden[]) => {
        if (gardens) {
          this.gardens = gardens;
          for (let i = 0; i < gardens.length; i++) {
            this.gardens[i].id = i + 1;
            this.gardens[i].plants = null;
          }

          console.log('timeout 2');
          this.timeoutId = this.mySetTimeout();
          this.setInitialShowToast();

          localStorage.setItem('farmer-gardens', JSON.stringify(this.gardens));
        } else {
          this.gardens = null;
        }
        console.log(this.gardens);
        return this.gardens;
      })
    );
  }

  getNumberOfGardens() {
    return this.gardens == null ? 0 : this.gardens.length;
  }

  logout() {
    if (this.timeoutId != null) {
      clearTimeout(this.timeoutId);
    }
    if (this.intervalId != null) {
      clearInterval(this.intervalId);
    }
    localStorage.removeItem('farmer-gardens');
    this.username = null;
    this.gardens = null;
    this.changeShowToast(false);
  }

  getGardenById(id: number) {
    return this.gardens[id - 1];
  }

  getCachedGardenPlants(id: number) {
    return this.gardens[id - 1].plants;
  }

  getCachedGardenProducts(id: number) {
    return this.gardens[id - 1].products;
  }

  getGardenDataFromServer(id: number) {
    //console.log('get data for garden ' + id);
    return this.http.get(`${this.uri}/farmer/gardens/data`, {
      params: {
        _id: this.gardens[id - 1]._id
      }
    }).pipe(
      map((res: any) => {
        if (res) {
          this.gardens[id - 1].plants = res[0].plants;
          this.gardens[id - 1].products = res[0].products;

          localStorage.setItem('farmer-gardens', JSON.stringify(this.gardens));
        } else {
          this.gardens[id - 1].plants = [];
          this.gardens[id - 1].products = [];
        }
        return res;
      })
    );
  }

  updateWaterAndTemperature(gardenId: string, water: number, temperature: number) {
    const data = {
      _id: gardenId,
      water: water,
      temperature: temperature
    };

    if (water < this.minWater || temperature < this.minTemperature) {
      this.changeShowToast(true);
    } else {
      this.setInitialShowToast();
    }

    let garden = this.gardens.filter(g => g._id == gardenId)[0];
    garden.water = water;
    garden.temperature = temperature;
    localStorage.setItem('farmer-gardens', JSON.stringify(this.gardens));

    this.http.post(`${this.uri}/farmer/gardens/update-water-and-temperature`, data).subscribe();
  }

  addNewPlantAddPreparation(gardenId: number, productId: string, plant, product) {
    let garden = this.gardens[gardenId - 1];
    garden.plants = garden.plants.filter(p => p.row != plant.row || p.col != plant.col);
    garden.plants.push(plant);

    localStorage.setItem('farmer-gardens', JSON.stringify(this.gardens));

    let data = {
      gardenId: this.gardens[gardenId - 1]._id,
      productId: productId,
      plant: plant,
      product: product
    };

    this.http.post(`${this.uri}/farmer/gardens/newplant-addpreparation`, data).subscribe();
  }

  takeoutPlant(gardenId: number, plant) {
    let garden = this.gardens[gardenId - 1];
    garden.plants = garden.plants.filter(p => p.row != plant.row || p.col != plant.col);
    garden.plants.push(plant);

    localStorage.setItem('farmer-gardens', JSON.stringify(this.gardens));

    let data = {
      gardenId: this.gardens[gardenId - 1]._id,
      plant: plant
    };

    this.http.post(`${this.uri}/farmer/gardens/takeout`, data).subscribe();
  }

  addNewGarden(garden) {
    const data = {
      garden: garden
    };

    return this.http.post(`${this.uri}/farmer/new-garden`, data).pipe(
      map((res: any) => {
        if (res) {
          garden._id = res._id;
          garden.id = this.gardens.length + 1;
          this.gardens.push(garden);
          localStorage.setItem('farmer-gardens', JSON.stringify(this.gardens));
        }
        return res;
      })
    );
  }

  getGardensForShoppingCart() {
    let res = [];
    if (this.gardens == null) {
      return res;
    }
    this.gardens.forEach(g => {
      res.push({
        _id: g._id,
        name: g.name,
        place: g.place
      })
    });
    return res;
  }

  addProducts(gardenId, products) {
    let ind = this.gardens.findIndex(g => g._id == gardenId);
    if (ind >= 0 && this.gardens[ind].products) {
      this.gardens[ind].products.push(...products);
    }
    localStorage.setItem('farmer-gardens', JSON.stringify(this.gardens));
  }

  saveGarden(gardenId, orderId) {
    localStorage.setItem('farmer-gardens', JSON.stringify(this.gardens));

    let data = {
      gardenId: gardenId,
      orderId: orderId
    }

    this.http.post(`${this.uri}/company/delete-farmer-products`, data).subscribe();
  }

  cancelOrder(orderId) {
    let data = {
      orderId: orderId
    }

    this.http.post(`${this.uri}/farmer/cancel-order`, data).subscribe();
  }

}
