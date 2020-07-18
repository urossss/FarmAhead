import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductWithDetails } from '../models/product';
import { ProductService } from '../product.service';
import { UserService } from '../user.service';
import { ShoppingCartService } from '../shopping-cart.service';

@Component({
  selector: 'app-shop-product',
  templateUrl: './shop-product.component.html',
  styleUrls: ['./shop-product.component.css']
})
export class ShopProductComponent implements OnInit {

  product: ProductWithDetails;
  id: number;

  amount: number = 0;

  rating: number = 10;
  comment: string = '';
  ratingCheck: number = 0;
  commentCheck: number = 0;

  username: string;
  userType: string;
  hasBought: boolean = false;
  hasCommented: boolean = false;

  constructor(private productService: ProductService, private userService: UserService, private shoppingCartService: ShoppingCartService, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.id = Number(this.route.snapshot.paramMap.get('id'));
    this.product = this.productService.getProductById(this.id);
    
    this.username = this.userService.getUsername();
    this.userType = this.userService.getUserType();

    if (this.product.buyers == null || this.product.comments == null) {
      this.productService.getProductDetailsFromServer(this.id).subscribe(res => {
        this.product.buyers = res.buyers;
        this.product.comments = res.comments;
        this.hasBought = this.hasBoughtProduct();
        this.hasCommented = this.hasCommentedProduct();
      });
    } else {
      this.hasBought = this.hasBoughtProduct();
      this.hasCommented = this.hasCommentedProduct();
    }
  }

  hasBoughtProduct() {
    if (this.product.buyers == null) return false;
    return this.product.buyers.filter(b => b.farmer == this.username).length > 0;
  }

  hasCommentedProduct() {
    if (this.product.comments == null) return false;
    return this.product.comments.filter(c => c.farmer == this.username).length > 0;
  }

  addComment() {
    if (this.rating == null || this.rating < 1 || this.rating > 10) {
      this.ratingCheck = 2;
    } else {
      if (Number.isInteger(this.rating)) {
        this.ratingCheck = 1;
      } else {
        this.ratingCheck = 3;
      }
    }
    this.comment = this.comment.trim();
    if (this.comment == '') {
      this.commentCheck = 2;
    } else {
      this.commentCheck = 1;
    }

    let success = this.ratingCheck == 1 && this.commentCheck == 1;

    if (success) {
      let comment = {
        farmer: this.username,
        rating: this.rating,
        comment: this.comment
      };

      //this.product.comments.push(comment);
      //this.product.ratingSum += this.rating;
      //this.product.ratingCount++;
      this.productService.addComment(this.id, comment);

      this.rating = 10;
      this.comment = '';
      this.ratingCheck = 0;
      this.commentCheck = 0;

      this.hasCommented = true;
    }
  }

  addToCart() {
    if (this.amount == null || this.amount <= 0 || this.amount > this.product.amount || !Number.isInteger(this.amount)) {
      this.amount = 0;
      return;
    }

    this.product.amount -= this.amount;
    this.productService.saveProducts();
    this.shoppingCartService.addItem(this.product, this.amount);
  }

}
