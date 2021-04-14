import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Product } from '@models/Product';
import { HttpService } from './http.service';
import { NgxSmartModalService } from 'ngx-smart-modal';
import { EditProductComponent } from './editor-product/edit-product.component';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['../catalogs.component.css'],
})
export class ProductComponent implements OnInit {
  products: Product[] = [];
  nameSorting = 'none';
  constructor(
    private httpSrv: HttpService,
    private toastr: ToastrService,
    private ngxSmartModalService: NgxSmartModalService,
    private title: Title
  ) {
    title.setTitle('Товары');
  }

  async ngOnInit() {
    this.getData();
  }
  async getData() {
    this.nameSorting = 'none';
    this.httpSrv.getProducts().subscribe((e) => {
      this.products = e;
    });
  }

  add() {
    this.ngxSmartModalService.toggle(EditProductComponent.MODAL_NAME);
  }

  confirm(product: Product) {
    this.ngxSmartModalService.setModalData(
      {
        title: 'Подтвердите действие',
        btnAction: () => this.delete(product),
        btnActionColor: 'red',
        btnActionName: 'Удалить товар',
      },
      'confirmModal',
      true
    );
    this.ngxSmartModalService.toggle('confirmModal');
  }

  async delete(product: Product) {
    this.httpSrv.deleteProduct(product.id).subscribe(
      (_) => this.toastr.info('Успешно удалено'),
      (e) => this.toastr.error('При удалении произошла ошибка'),
      () => this.getData()
    );
  }

  edit(item: Product) {
    this.ngxSmartModalService.setModalData(
      item,
      EditProductComponent.MODAL_NAME,
      true
    );
    this.ngxSmartModalService.toggle(EditProductComponent.MODAL_NAME);
  }

  sortedByName = () => {
    if (this.nameSorting === 'none' || this.nameSorting === 'reverse') {
      this.products.sort((a, b) => {
        if (!a.name) {
          a.name = '';
        }
        if (!b.name) {
          b.name = '';
        }
        return a.name.localeCompare(b.name);
      });
      this.nameSorting = 'direct';
    } else if (this.nameSorting === 'direct') {
      this.products.sort((a, b) => {
        if (!a.name) {
          a.name = '';
        }
        if (!b.name) {
          b.name = '';
        }
        return b.name.localeCompare(a.name);
      });
      this.nameSorting = 'reverse';
    }
  };
}
