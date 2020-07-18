import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { RegistrationComponent } from './registration/registration.component';
import { FarmerOverviewComponent } from './farmer-overview/farmer-overview.component';
import { FarmerGardenComponent } from './farmer-garden/farmer-garden.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { AccessGuard } from './access.guard';
import { CompanyOrdersComponent } from './company-orders/company-orders.component';
import { CompanyProductsComponent } from './company-products/company-products.component';
import { CompanyStatsComponent } from './company-stats/company-stats.component';
import { AdminRequestsComponent } from './admin-requests/admin-requests.component';
import { AdminUsersComponent } from './admin-users/admin-users.component';
import { AdminAddUserComponent } from './admin-add-user/admin-add-user.component';
import { ShopOverviewComponent } from './shop-overview/shop-overview.component';
import { ShopProductComponent } from './shop-product/shop-product.component';
import { ShopCartComponent } from './shop-cart/shop-cart.component';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { FarmerAddGardenComponent } from './farmer-add-garden/farmer-add-garden.component';
import { CompanyAddProductComponent } from './company-add-product/company-add-product.component';


const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    data: {
      title: 'FarmAhead'
    }
  },
  {
    path: 'prijava',
    component: LoginComponent,
    data: {
      title: 'FarmAhead | Prijava'
    }
  },
  {
    path: 'registracija',
    component: RegistrationComponent,
    data: {
      title: 'FarmAhead | Registracija'
    }
  },
  {
    path: 'poljoprivrednik',
    canActivate: [AccessGuard],
    children: [
      {
        path: '',
        redirectTo: 'rasadnici',
        pathMatch: 'full'
      },
      {
        path: 'rasadnici',
        children: [
          {
            path: '',
            component: FarmerOverviewComponent,
            data: {
              title: 'FarmAhead | Poljoprivrednik | Moji rasadnici'
            }
          },
          {
            path: ':id',
            canActivate: [AccessGuard],
            component: FarmerGardenComponent,
            data: {
              title: 'FarmAhead | Poljoprivrednik | Moj rasadnik'
            }
          }
        ]
      },
      {
        path: 'novi-rasadnik',
        component: FarmerAddGardenComponent,
        data: {
          title: 'FarmAhead | Poljoprivrednik | Novi rasadnik'
        }
      }
    ]
  },
  {
    path: 'preduzece',
    canActivate: [AccessGuard],
    children: [
      {
        path: '',
        redirectTo: 'narudzbine',
        pathMatch: 'full'
      },
      {
        path: 'narudzbine',
        component: CompanyOrdersComponent,
        data: {
          title: 'FarmAhead | Preduzeće | Narudžbine'
        }
      },
      {
        path: 'proizvodi',
        component: CompanyProductsComponent,
        data: {
          title: 'FarmAhead | Preduzeće | Proizvodi'
        }
      },
      {
        path: 'statistika',
        component: CompanyStatsComponent,
        data: {
          title: 'FarmAhead | Preduzeće | Statistika'
        }
      },
      {
        path: 'novi-proizvod',
        component: CompanyAddProductComponent,
        data: {
          title: 'FarmAhead | Preduzeće | Novi proizvod'
        }
      }
    ]
  },
  {
    path: 'admin',
    children: [
      {
        path: '',
        redirectTo: 'zahtevi',
        pathMatch: 'full'
      },
      {
        path: 'zahtevi',
        component: AdminRequestsComponent,
        data: {
          title: 'FarmAhead | Admin | Zahtevi'
        }
      },
      {
        path: 'korisnici',
        children: [
          {
            path: '',
            component: AdminUsersComponent,
            data: {
              title: 'FarmAhead | Admin | Korisnici'
            }
          },
          {
            path: 'dodaj',
            component: AdminAddUserComponent,
            data: {
              title: 'FarmAhead | Admin | Novi korisnik'
            }
          }
        ]
      }
    ]
  },
  {
    path: 'prodavnica',
    children: [
      {
        path: '',
        redirectTo: 'proizvodi',
        pathMatch: 'full'
      },
      {
        path: 'proizvodi',
        children: [
          {
            path: '',
            component: ShopOverviewComponent,
            data: {
              title: 'FarmAhead | Prodavnica | Proizvodi'
            }
          },
          {
            path: ':id',
            canActivate: [AccessGuard],
            component: ShopProductComponent,
            data: {
              title: 'FarmAhead | Prodavnica | Proizvod'
            }
          }
        ]
      },
      {
        path: 'korpa',
        canActivate: [AccessGuard],
        component: ShopCartComponent,
        data: {
          title: 'FarmAhead | Prodavnica | Korpa'
        }
      }
    ]
  },
  {
    path: 'promena-lozinke',
    canActivate: [AccessGuard],
    component: ChangePasswordComponent,
    data: {
      title: 'FarmAhead | Promena lozinke'
    }
  },
  {
    path: '**',
    component: PageNotFoundComponent,
    data: {
      title: 'FarmAhead | 404'
    }
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
