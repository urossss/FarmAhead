import { Component, OnInit } from '@angular/core';
import { ProductWithDetails } from '../models/product';
import { ProductService } from '../product.service';

@Component({
  selector: 'app-shop-overview',
  templateUrl: './shop-overview.component.html',
  styleUrls: ['./shop-overview.component.css']
})
export class ShopOverviewComponent implements OnInit {

  products: ProductWithDetails[];
  indMap: Map<string, number>;

  nameSortDir: string = '';
  companySortDir: string = '';
  rotate: {[key: string]: string} = { 'asc': 'desc', 'desc': '', '': 'asc' };

  searchTerm: string = '';

  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    this.indMap = new Map();

    this.products = this.productService.getCachedProducts();
    if (this.products == null) {
      this.productService.getProductsFromServer().subscribe(res => {
        console.log(res);
        this.products = res;
        this.fillInd();
      });
    } else {
      this.fillInd();
    }
  }

  fillInd() {
    this.products.forEach((product, index) => {
      this.indMap.set(product._id, index);
    });
  }

  compare(v1, v2) {
    return v1 < v2 ? -1 : v1 > v2 ? 1 : 0;
  }

  sort(column: string, direction: string) {
    if (direction == '') {
      this.products.sort((p1, p2) => {
        return this.compare(this.indMap.get(p1._id), this.indMap.get(p2._id));
      });
      return;
    } else {
      this.products.sort((p1, p2) => {
        let res = this.compare(p1[column], p2[column]);
        return direction == 'asc' ? res : -res;
      });
    }
  }

  sortByName() {
    this.nameSortDir = this.rotate[this.nameSortDir];
    this.companySortDir = '';
    this.sort('name', this.nameSortDir);
  }

  sortByCompanyName() {
    this.companySortDir = this.rotate[this.companySortDir];
    this.nameSortDir = '';
    this.sort('companyName', this.companySortDir);
  }

}
