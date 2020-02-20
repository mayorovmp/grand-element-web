import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { Product } from 'src/app/models/Product';
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
  constructor(private httpSrv: HttpService, private ngxSmartModalService: NgxSmartModalService) { }

  product: Product = new Product();

  ngOnInit() {
  }

  onOpen() {
    this.product = this.ngxSmartModalService.getModalData(EditProductComponent.MODAL_NAME);
  }

  onClose() {
    this.changed.emit();
  }

  async edit(product: Product) {
    if (product.id) {
      await this.httpSrv.editProduct(product).toPromise();
    } else {
      await this.httpSrv.addProduct(product).toPromise();
    }

    this.ngxSmartModalService.toggle(EditProductComponent.MODAL_NAME);
  }

}
