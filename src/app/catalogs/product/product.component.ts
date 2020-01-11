import { Component, OnInit } from '@angular/core';
import { Product } from 'src/app/models/Product';
import { HttpService } from './http.service';
import { NgxSmartModalService } from 'ngx-smart-modal';
import { AddProductComponent } from './add-product/add-product.component';
import { EditProductComponent } from './edit-product/edit-product.component';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})
export class ProductComponent implements OnInit {
  selectedProd?: Product = undefined;
  products: Product[] = [];
  constructor(private httpSrv: HttpService, private ngxSmartModalService: NgxSmartModalService) { }

  async ngOnInit() {
    this.getData();
  }
  async getData() {
    this.httpSrv.getProducts().subscribe(e => { this.products = e.data; });
  }
  addProduct() {
    this.ngxSmartModalService.toggle(AddProductComponent.MODAL_NAME);
  }
  async deleteProduct(product: Product) {
    await this.httpSrv.deleteProduct(product.id).toPromise();
    this.getData();
  }
  async editProduct(product: Product) {
    this.ngxSmartModalService.setModalData(product, EditProductComponent.MODAL_NAME, true);
    this.ngxSmartModalService.toggle(EditProductComponent.MODAL_NAME);
  }
}
