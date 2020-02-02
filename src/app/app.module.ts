import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { HTTP_INTERCEPTORS } from '@angular/common/http';

import { ToastrModule } from 'ngx-toastr';

import { NgxSmartModalModule } from 'ngx-smart-modal';

import { FooterModule } from './footer/footer.module';
import { NavbarModule } from './header/header.module';
import { WelcomeModule } from './welcome/welcome.module';
import { LoginModule } from './login/login.module';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { AuthInterceptor } from './auth/http-interceptor';

// Зарегистрируем русский, для возможности отображения дат и прочего.
import { registerLocaleData } from '@angular/common';
import localeRu from '@angular/common/locales/ru';

registerLocaleData(localeRu);

import { NgxUiLoaderModule, NgxUiLoaderHttpModule, NgxUiLoaderConfig, SPINNER } from 'ngx-ui-loader';
import { LoggerComponent } from './logger/logger.component';
import { CatalogsComponent } from './catalogs/catalogs.component';
import { CarCategoryComponent } from './catalogs/car-category/car-category.component';
import { CarComponent } from './catalogs/car/car.component';
import { EditCarCategoryComponent } from './catalogs/car-category/editor/edit.component';
import { OrdersComponent } from './orders/orders.component';
import { OrderAddComponent } from './orders/order-add/order-add.component';
import { ClientsComponent } from './catalogs/clients/clients.component';
import { ClientAddComponent } from './catalogs/clients/client-add/client-add.component';
import { SuppliersComponent } from './catalogs/suppliers/suppliers.component';
import { EditorComponent as SupplierEditorComponent } from './catalogs/suppliers/editor/editor.component';
import { AddSupplierComponent } from './catalogs/suppliers/add-supplier/add-supplier.component';
import { ProductComponent } from './catalogs/product/product.component';
import { EditProductComponent } from './catalogs/product/editor-product/edit-product.component';
import { EditorComponent } from './catalogs/car/editor/editor.component';
const ngxUiLoaderConfig: NgxUiLoaderConfig = {
  fgsType: SPINNER.ballScaleMultiple,
  // threshold: 1
};

@NgModule({
  declarations: [
    SupplierEditorComponent,
    AppComponent,
    LoggerComponent,
    CatalogsComponent,
    CarCategoryComponent,
    CarComponent,
    EditCarCategoryComponent,
    OrdersComponent,
    OrderAddComponent,
    ClientsComponent,
    ClientAddComponent,
    SuppliersComponent,
    AddSupplierComponent,
    ProductComponent,
    EditProductComponent,
    EditorComponent,
  ],
  imports: [
    NgxSmartModalModule.forRoot(),
    HttpClientModule,
    WelcomeModule,
    LoginModule,
    NavbarModule,
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    BrowserAnimationsModule,
    NgxUiLoaderModule.forRoot(ngxUiLoaderConfig),
    NgxUiLoaderHttpModule.forRoot({ showForeground: true }), // Показывать лоадер на все http запросы
    FooterModule,
    ToastrModule.forRoot({
      positionClass: 'toast-bottom-right',
      closeButton: true,
    }),
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
