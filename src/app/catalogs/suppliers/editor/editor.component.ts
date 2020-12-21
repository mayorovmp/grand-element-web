import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Supplier } from '@models/Supplier';
import { Product } from '@models/Product';
import { HttpService } from '../http.service';
import { NgxSmartModalService } from 'ngx-smart-modal';
import { HttpService as ProductHttpService } from 'src/app/catalogs/product/http.service';
import { ToastrService } from 'ngx-toastr';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-supplier-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.css'],
})
export class SupplierEditorComponent implements OnInit {
  static MODAL_NAME = 'editSupplierModal';
  @Output() changed = new EventEmitter<Supplier>();

  supplier: Supplier = new Supplier();

  products: Product[] = [];

  constructor(
    private httpSrv: HttpService,
    private productHttpService: ProductHttpService,
    private toastr: ToastrService,
    private ngxSmartModalService: NgxSmartModalService
  ) {}

  ngOnInit() {}

  delProd(supplier: Supplier, prod: Product) {
    const delId = supplier.products.findIndex((x) => x.id === prod.id);
    supplier.products.splice(delId, 1);
  }

  async onOpen() {
    const transferred = this.ngxSmartModalService.getModalData(
      SupplierEditorComponent.MODAL_NAME
    );
    this.ngxSmartModalService.resetModalData(
      SupplierEditorComponent.MODAL_NAME
    );
    if (transferred) {
      this.supplier = transferred;
    } else {
      this.supplier = new Supplier();
    }

    this.products = await this.productHttpService.getProducts().toPromise();
    this.addRemovedProduct();
  }

  addRemovedProduct() {
    this.supplier.products.forEach((p) => {
      if (this.products.find((x) => x.id === p.id) === undefined) {
        this.products.push(p);
      }
    });
  }

  onClose() {}

  byId(a: Product, b: Product) {
    return a && b ? a.id === b.id : a === b;
  }

  addProd() {
    const p = new Product();
    this.supplier.products.push(p);
  }

  async createOrUpdate(item: Supplier) {
    let supplier = new Supplier();
    if (item.id) {
      supplier = await this.httpSrv.edit(item).toPromise();
      this.toastr.info('Поставщик изменен');
    } else {
      supplier = await this.httpSrv.add(item).toPromise();
      this.toastr.info('Поставщик создан');
    }
    this.changed.emit(supplier);
    this.ngxSmartModalService.toggle(SupplierEditorComponent.MODAL_NAME);
  }
}
