import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { Product } from 'src/app/models/Product';
import { ToastrService } from 'ngx-toastr';
import { HttpService } from '../http.service';
import { NgxSmartModalService } from 'ngx-smart-modal';

@Component({
  selector: 'app-edit-product',
  templateUrl: './edit-product.component.html',
  styleUrls: ['./edit-product.component.css']
})
export class EditProductComponent implements OnInit {
  static MODAL_NAME = 'editProductModal';

  @Output() changed = new EventEmitter<any>();
  constructor(
      private httpSrv: HttpService,
      private toastr: ToastrService,
      private ngxSmartModalService: NgxSmartModalService) { }

  product: Product = new Product();

  ngOnInit() {
  }

  onOpen() {
    const transferred = this.ngxSmartModalService.getModalData(EditProductComponent.MODAL_NAME);
    this.ngxSmartModalService.resetModalData(EditProductComponent.MODAL_NAME);
    if (transferred) {
      this.product = transferred;
    } else {
      this.product = new Product();
    }
  }

  onClose() {
    this.changed.emit();
  }

  async edit(product: Product) {
    if (product.id) {
      await this.httpSrv.editProduct(product).toPromise();
      this.toastr.info('Товар изменен');
    } else {
      await this.httpSrv.addProduct(product).toPromise();
      this.toastr.info('Товар создан');
    }

    this.ngxSmartModalService.toggle(EditProductComponent.MODAL_NAME);
  }

}
