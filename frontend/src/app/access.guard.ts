import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { UserService } from './user.service';
import { FarmerService } from './farmer.service';
import { ProductService } from './product.service';

@Injectable({
  providedIn: 'root'
})
export class AccessGuard implements CanActivate {

  constructor(private userService: UserService, private farmerService: FarmerService, private productService: ProductService, private router: Router) { }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

    let urls = next.pathFromRoot;
    let userType = this.userService.getUserType();

    if (urls[1].url.toString() == 'poljoprivrednik') { // check if farmer is logged in
      if (userType != 'poljoprivrednik') {
        this.router.navigate(['/prijava']);
      }
      if (urls.length == 4) { // check if garden id is valid
        let idStr = next.paramMap.get('id');
        let id = Number(idStr);
        if (isNaN(id) || id < 1 || id > this.farmerService.getNumberOfGardens()) { // if id isn't valid, return to farmer main page
          this.router.navigate(['/poljoprivrednik']);
        }
      }
    } else if (urls[1].url.toString() == 'preduzece') { // check if company is logged in
      if (userType != 'preduzece') {
        this.router.navigate(['/prijava']);
      }
    } else if (urls[1].url.toString() == 'admin') { // check if admin is logged in
      if (userType != 'admin') {
        this.router.navigate(['/prijava']);
      }
    } else if (urls[1].url.toString() == 'prodavnica') {
      if (urls.length == 4) { // check if product id is valid if product details are requested
        let idStr = next.paramMap.get('id');
        let id = Number(idStr);
        if (isNaN(id) || id < 1 || this.productService.getProductById(id) == null) { // if id isn't valid, return to shop main page
          this.router.navigate(['/prodavnica']);
        }
      } else if (urls.length == 3 && urls[2].url.toString() == 'korpa') { // only farmer can order products, so only farmer can access shopping cart
        if (userType != 'poljoprivrednik') {
          this.router.navigate(['/prodavnica']);
        }
      }
    } else if (urls[1].url.toString() == 'promena-lozinke') {
      if (userType == null) {
        this.router.navigate(['/prijava']);
      }
    }

    return true;
  }

}
