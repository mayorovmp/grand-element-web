import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { NgxSmartModalService } from 'ngx-smart-modal';
import { ClientAddComponent } from 'src/app/catalogs/clients/client-add/client-add.component';
import { Client } from 'src/app/models/Client';
import { HttpService as ClientHttp } from 'src/app/catalogs/clients/http.service';
import { HttpService as ProductHttp } from 'src/app/catalogs/product/http.service';
import { HttpService as SupplierHttp } from 'src/app/catalogs/suppliers/http.service';
import { HttpService as CarCategoryHttp } from 'src/app/catalogs/car-category/http.service';
import { Product } from 'src/app/models/Product';
import { Address } from 'src/app/models/Address';
import { Supplier } from 'src/app/models/Supplier';
import { CarCategory } from 'src/app/models/CarCategory';

@Component({
  selector: 'app-order-add',
  templateUrl: './order-add.component.html',
  styleUrls: ['./order-add.component.css']
})
export class OrderAddComponent implements OnInit {
  static MODAL_NAME = 'orderAddModal';

  selectedClient?: Client = undefined;
  clients: Client[] = [];

  selectedAddress?: Address = undefined;

  selectedProduct?: Product = undefined;
  products: Product[] = [];

  selectedSupplier?: Supplier = undefined;
  suppliers: Supplier[] = [];

  selectedCarCategory?: CarCategory = undefined;
  carCategories: CarCategory[] = [];

  constructor(
    public ngxSmartModalService: NgxSmartModalService,
    public clientHttp: ClientHttp,
    public productHttp: ProductHttp,
    public supplierHttp: SupplierHttp,
    public carCategoryHttp: CarCategoryHttp) { }

  @Output() changed = new EventEmitter<any>();

  ngOnInit() {
  }

  onOpen() {
    this.reset();
    this.clientHttp.getClients().subscribe(
      x => this.clients = x.data);

    this.productHttp.getProducts().subscribe(
      x => this.products = x.data);

    this.supplierHttp.getSuppliers().subscribe(
      x => this.suppliers = x.data);

    this.carCategoryHttp.getCarCategories().subscribe(
      x => this.carCategories = x.data);
  }
  reset() {
    this.selectedClient = undefined;
    this.clients = [];

    this.selectedAddress = undefined;

    this.selectedProduct = undefined;
    this.products = [];

    this.selectedCarCategory = undefined;
    this.carCategories = [];
  }

  addClient() {
    this.ngxSmartModalService.getModal(ClientAddComponent.MODAL_NAME).open();

  }

  add() {
    this.changed.emit();
    this.ngxSmartModalService.getModal(OrderAddComponent.MODAL_NAME).close();
  }

}
