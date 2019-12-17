import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { WelcomeComponent } from './welcome/welcome.component';

import { LoginComponent } from './login/login.component';
import { AuthGuard } from './auth/auth.guard';
import { CatalogsComponent } from './catalogs/catalogs.component';
import { CarCategoryComponent } from './catalogs/car-category/car-category.component';
import { CarComponent } from './catalogs/car/car.component';
import { OrdersComponent } from './orders/orders.component';

// { path: 'plots', loadChildren: () => import('./plot/plot.module').then(mod => mod.PlotModule), canActivate: [AuthGuard] },
const routes: Routes = [
  { path: 'orders', component: OrdersComponent },
  { path: 'login', component: LoginComponent },
  { path: 'catalog/car', component: CarComponent },
  { path: '', component: WelcomeComponent },
  { path: 'catalog', component: CatalogsComponent },
  { path: 'catalog/car-category', component: CarCategoryComponent },
  { path: '**', redirectTo: '' },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  providers: [AuthGuard],
  exports: [RouterModule]
})
export class AppRoutingModule { }
