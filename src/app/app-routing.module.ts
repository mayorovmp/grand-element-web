import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LoginComponent } from './login/login.component';
import { AuthGuard } from './auth/auth.guard';
import { CarComponent } from './catalogs/car/car.component';
import { ClientsComponent } from './catalogs/clients/clients.component';
import { SuppliersComponent } from './catalogs/suppliers/suppliers.component';
import { ProductComponent } from './catalogs/product/product.component';
import { RequestsComponent } from './requests/requests.component';

// { path: 'plots', loadChildren: () => import('./plot/plot.module').then(mod => mod.PlotModule), canActivate: [AuthGuard] },
const routes: Routes = [
  { path: 'catalog/suppliers', component: SuppliersComponent, canActivate: [AuthGuard] },
  { path: 'catalog/clients', component: ClientsComponent, canActivate: [AuthGuard] },
  { path: 'requests', component: RequestsComponent, canActivate: [AuthGuard] },
  { path: 'login', component: LoginComponent },
  { path: 'catalog/car', component: CarComponent, canActivate: [AuthGuard] },
  { path: '', component: RequestsComponent, canActivate: [AuthGuard] },
  { path: 'catalog/product', component: ProductComponent, canActivate: [AuthGuard] },
  { path: '**', redirectTo: '', canActivate: [AuthGuard] },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  providers: [AuthGuard],
  exports: [RouterModule]
})
export class AppRoutingModule { }
