import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { Product } from '@models/Product';
import { ToastrService } from 'ngx-toastr';
import { HttpService } from '../http.service';
import { NgxSmartModalService } from 'ngx-smart-modal';

@Component({
  selector: 'app-edit-product',
  templateUrl: './edit-product.component.html',
})
export class EditProductComponent implements OnInit {
  static MODAL_NAME = 'editProductModal';

  @Output() changed = new EventEmitter<Product>();
  constructor(
    private httpSrv: HttpService,
    private toastr: ToastrService,
    private ngxSmartModalService: NgxSmartModalService
  ) {}

  product: Product = new Product();

  ngOnInit() {}

  onOpen() {
    const transferred = this.ngxSmartModalService.getModalData(
      EditProductComponent.MODAL_NAME
    );
    this.ngxSmartModalService.resetModalData(EditProductComponent.MODAL_NAME);
    if (transferred) {
      this.product = transferred;
    } else {
      this.product = new Product();
    }
  }

  onClose() {}

  async createOrUpdate(item: Product) {
    let product = new Product();
    if (item.id) {
      product = await this.httpSrv.editProduct(item).toPromise();
      this.toastr.info('Товар изменен');
    } else {
      product = await this.httpSrv.addProduct(item).toPromise();
      this.toastr.info('Товар создан');
    }
    this.changed.emit(product);
    this.ngxSmartModalService.toggle(EditProductComponent.MODAL_NAME);
  }
}
