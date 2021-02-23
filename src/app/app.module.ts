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
import { LoginModule } from './login/login.module';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { AuthInterceptor } from './auth/http-interceptor';

// Зарегистрируем русский, для возможности отображения дат и прочего.
import { registerLocaleData } from '@angular/common';
import localeRu from '@angular/common/locales/ru';

registerLocaleData(localeRu);

import {
  NgxUiLoaderModule,
  NgxUiLoaderHttpModule,
  NgxUiLoaderConfig,
  SPINNER,
} from 'ngx-ui-loader';
import { LoggerComponent } from './logger/logger.component';
import { CatalogsComponent } from './catalogs/catalogs.component';
import { CarCategoryComponent } from './catalogs/car-category/car-category.component';
import { CarComponent } from './catalogs/car/car.component';
import { EditCarCategoryComponent } from './catalogs/car-category/editor/edit.component';
import { ClientsComponent } from './catalogs/clients/clients.component';
import { SuppliersComponent } from './catalogs/suppliers/suppliers.component';
import { SupplierEditorComponent } from './catalogs/suppliers/editor/editor.component';
import { ClientEditorComponent } from './catalogs/clients/editor/editor.component';
import { ProductComponent } from './catalogs/product/product.component';
import { EditProductComponent } from './catalogs/product/editor-product/edit-product.component';
import { CarEditorComponent } from './catalogs/car/editor/editor.component';
import { CarEditorAmountComponent } from './catalogs/car/editor-amount/editor.component';
import { ConfirmModalComponent } from './common/confirm-modal/confirm.component';
import { RequestEditorComponent } from './requests/editor/request-editor.component';
import { RequestsComponent } from './requests/requests.component';
import { FilterPipe, CarOwnerPipe } from './core/pipes/filter.pipe';
import { OverlayModule } from '@angular/cdk/overlay';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { AmountModalComponent } from './requests/amountModal/amountModal.component';
import { ConfirmCompleteReqModalComponent } from './requests/confirmCompleteReqModal/amountModal/confirm-complete-req-modal.component';
const ngxUiLoaderConfig: NgxUiLoaderConfig = {
  fgsType: SPINNER.ballScaleMultiple,
  minTime: 100,
  fgsSize: 0,
  overlayColor: 'rgba(255,255,255,0)',
};

@NgModule({
  declarations: [
    ClientEditorComponent,
    SupplierEditorComponent,
    AppComponent,
    LoggerComponent,
    CatalogsComponent,
    CarCategoryComponent,
    CarComponent,
    EditCarCategoryComponent,
    RequestsComponent,
    RequestEditorComponent,
    ClientsComponent,
    SuppliersComponent,
    ProductComponent,
    EditProductComponent,
    CarEditorComponent,
    CarEditorAmountComponent,
    ConfirmModalComponent,
    FilterPipe,
    CarOwnerPipe,
    AmountModalComponent,
    ConfirmCompleteReqModalComponent,
  ],
  imports: [
    NgxSmartModalModule.forRoot(),
    HttpClientModule,
    LoginModule,
    NavbarModule,
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    BrowserAnimationsModule,
    NgxUiLoaderModule.forRoot(ngxUiLoaderConfig),
    NgxUiLoaderHttpModule.forRoot({ showForeground: true }), // Показывать лоадер на все http запросы
    FooterModule,
    OverlayModule,
    ToastrModule.forRoot({
      positionClass: 'toast-bottom-right',
      closeButton: true,
      timeOut: 50000,
    }),
    InfiniteScrollModule,
    DragDropModule,
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
