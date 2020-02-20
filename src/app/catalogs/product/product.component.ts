import { Component, OnInit } from '@angular/core';
import { Product } from 'src/app/models/Product';
import { HttpService } from './http.service';
import { NgxSmartModalService } from 'ngx-smart-modal';
import { EditProductComponent } from './editor-product/edit-product.component';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})
export class ProductComponent implements OnInit {
  defaultProduct: Product = new Product();
  products: Product[] = [];
  constructor(private httpSrv: HttpService, private toastr: ToastrService, private ngxSmartModalService: NgxSmartModalService) { }

  async ngOnInit() {
    this.getData();
  }
  async getData() {
    this.httpSrv.getProducts().subscribe(e => { this.products = e; });
  }
  async deleteProduct(product: Product) {
    this.httpSrv.deleteProduct(product.id).subscribe(
      _ => this.toastr.info('Успешно удалено'),
      e => this.toastr.error('При удалении произошла ошибка'),
      () => this.getData());
  }
  async editProduct(product: Product) {
    this.ngxSmartModalService.setModalData(product, EditProductComponent.MODAL_NAME, true);
    this.ngxSmartModalService.toggle(EditProductComponent.MODAL_NAME);
  }
}
