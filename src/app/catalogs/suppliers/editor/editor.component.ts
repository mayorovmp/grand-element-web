import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Supplier } from 'src/app/models/Supplier';
import { Product } from 'src/app/models/Product';
import { HttpService } from '../http.service';
import { NgxSmartModalService } from 'ngx-smart-modal';
import { HttpService as ProductHttpService } from 'src/app/catalogs/product/http.service';

@Component({
  selector: 'app-supplier-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.css']
})
export class EditorComponent implements OnInit {

  static MODAL_NAME = 'editSupplierModal';
  @Output() changed = new EventEmitter<any>();

  supplier: Supplier = new Supplier();

  products: Product[] = [];

  constructor(
    private httpSrv: HttpService,
    private productHttpService: ProductHttpService,
    private ngxSmartModalService: NgxSmartModalService) { }

  ngOnInit() {
  }

  async onOpen() {
    this.supplier = this.ngxSmartModalService.getModalData(EditorComponent.MODAL_NAME);
    this.products = (await this.productHttpService.getProducts().toPromise()).data;
  }

  onClose() {
    this.changed.emit();
  }

  byId(a: Product, b: Product) {
    return a && b ? a.id === b.id : a === b;
  }

  async createOrUpdate(item: Supplier) {
    if (item.id) {
      await this.httpSrv.edit(item).toPromise();
    } else {
      await this.httpSrv.add(item).toPromise();
    }
    this.ngxSmartModalService.toggle(EditorComponent.MODAL_NAME);
  }

}
