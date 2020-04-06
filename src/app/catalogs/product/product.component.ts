import { Component, OnInit } from '@angular/core';
import { Product } from 'src/app/models/Product';
import { HttpService } from './http.service';
import { NgxSmartModalService } from 'ngx-smart-modal';
import { EditProductComponent } from './editor-product/edit-product.component';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['../catalogs.component.css', './product.component.css']
})
export class ProductComponent implements OnInit {
  products: Product[] = [];
  nameSorting: string = 'none';
  constructor(private httpSrv: HttpService, private toastr: ToastrService, private ngxSmartModalService: NgxSmartModalService) { }

  async ngOnInit() {
    this.getData();
  }
  async getData() {
    this.httpSrv.getProducts().subscribe(e => { this.products = e; });
  }
  async delete(product: Product) {
    this.httpSrv.deleteProduct(product.id).subscribe(
      _ => this.toastr.info('Успешно удалено'),
      e => this.toastr.error('При удалении произошла ошибка'),
      () => this.getData());
  }

  add() {
    this.ngxSmartModalService.toggle(EditProductComponent.MODAL_NAME);
  }

  edit(item: Product) {
    this.ngxSmartModalService.setModalData(item, EditProductComponent.MODAL_NAME, true);
    this.ngxSmartModalService.toggle(EditProductComponent.MODAL_NAME);
  }

  sortedByName = () => {
    if (this.nameSorting === 'none' || this.nameSorting === 'reverse'){
      this.products.sort((a, b) => {
        if (!a.name) { a.name = ''}
        if (!b.name) { b.name = ''}
        return a.name.localeCompare(b.name);
      });
      this.nameSorting = 'direct';
    } else if (this.nameSorting === 'direct'){
      this.products.sort((a, b) => {
        if (!a.name) { a.name = ''}
        if (!b.name) { b.name = ''}
        return b.name.localeCompare(a.name);
      });
      this.nameSorting = 'reverse';
    }
  }

}
