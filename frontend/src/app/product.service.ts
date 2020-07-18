import { Injectable } from '@angular/core';
import { ProductWithDetails } from './models/product';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  uri = 'http://localhost:4000';

  products: ProductWithDetails[];

  constructor(private http: HttpClient) {
    this.init();
  }

  init() {
    this.products = null;
    this.products = JSON.parse(localStorage.getItem('shop-products'));
    if (this.products == null) {
      this.getProductsFromServer().subscribe(res => {
        console.log(this.products);
      });
    } else {
      console.log(this.products);
    }
  }

  getCachedProducts() {
    return this.products;
  }

  getProductsFromServer() {
    return this.http.get(`${this.uri}/shop/products`).pipe(
      map((products: ProductWithDetails[]) => {
        if (products) {
          this.products = products;
          localStorage.setItem('shop-products', JSON.stringify(this.products));
        } else {
          this.products = null;
        }
        return this.products;
      })
    );
  }

  getNumberOfProducts() {
    return this.products == null ? 0 : this.products.length;
  }

  getProductById(id: number) {
    if (this.products == null) {
      return null;
    }
    let filtered = this.products.filter(p => p.id == id);
    return filtered.length == 0 ? null : filtered[0];
  }

  getCachedProductDetails(id: number) {
    let product = this.getProductById(id);

    // let details = {
    //   buyers: product.buyers,
    //   comments: product.comments
    // }
    // console.log(this.products[id - 1]);
    // console.log(details);
    return {
      buyers: product.buyers,
      comments: product.comments
    };
  }

  getProductDetailsFromServer(id: number) {
    if (this.products == null) {
      return null;
    }
    let ind = this.products.findIndex(p => p.id == id);

    console.log(id + ' ' + ind);
    console.log(this.products);
    console.log(this.products[ind]);

    return this.http.get(`${this.uri}/shop/products/details`, {
      params: {
        id: '' + this.products[ind].id
      }
    }).pipe(
      map((res: any) => {
        if (res) {
          this.products[ind].buyers = res[0].buyers;
          this.products[ind].comments = res[0].comments;

          localStorage.setItem('shop-products', JSON.stringify(this.products));
        } else {
          this.products[ind].buyers = null;
          this.products[ind].comments = null;
        }

        let details = {
          buyers: this.products[ind].buyers,
          comments: this.products[ind].comments
        }
        return details;
      })
    );
  }

  addComment(productId, comment) {
    let ind = this.products.findIndex(p => p.id == productId);

    this.products[ind].comments.push(comment);
    this.products[ind].ratingSum += comment.rating;
    this.products[ind].ratingCount++;
    localStorage.setItem('shop-products', JSON.stringify(this.products));

    let data = {
      id: this.products[ind].id,
      comment: comment
    };

    this.http.post(`${this.uri}/shop/product/comment`, data).subscribe();
  }

  removeProduct(product) {
    this.products = this.products.filter(p => p.id != product.id);
    localStorage.setItem('shop-products', JSON.stringify(this.products));

    let data = {
      id: product.id
    };

    this.http.post(`${this.uri}/company/remove-product`, data).subscribe();
  }

  addAmount(product) {
    this.products.forEach(p => {
      if (p.id == product.id) {
        p.amount = product.amount;
      }
    });
    localStorage.setItem('shop-products', JSON.stringify(this.products));

    let data = {
      id: product.id,
      amount: product.amount
    };

    this.http.post(`${this.uri}/company/set-amount`, data).subscribe();
  }

  getNextProductId() {
    let nextId = 1;
    this.products.forEach(p => {
      if (p.id >= nextId) {
        nextId = p.id + 1;
      }
    });
    return nextId;
  }

  addProduct(product) {
    product.id = this.getNextProductId();
    this.products.push(product);
    localStorage.setItem('shop-products', JSON.stringify(this.products));

    let data = {
      product: product
    };

    return this.http.post(`${this.uri}/company/new-product`, data);
  }

  saveProducts() {
    localStorage.setItem('shop-products', JSON.stringify(this.products));
  }

  returnAmount(product) {
    this.products.forEach(p => {
      if (p.id == product.id) {
        p.amount += product.amount;
      }
    });
    localStorage.setItem('shop-products', JSON.stringify(this.products));
  }

  addBuyer(data) {
    let farmer = data.farmer;
    let productIds = data.productIds;

    this.products.forEach(p => {
      if (productIds.indexOf(p.id) >= 0) {
        p.buyers.push({
          farmer: farmer
        });
      }
    });
    localStorage.setItem('shop-products', JSON.stringify(this.products));
  }
}
