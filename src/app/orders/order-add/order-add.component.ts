import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { NgxSmartModalService } from 'ngx-smart-modal';
import { Client } from 'src/app/models/Client';
import { HttpService as ClientHttp } from 'src/app/catalogs/clients/http.service';
import { HttpService as ProductHttp } from 'src/app/catalogs/product/http.service';
import { HttpService as ReqService } from 'src/app/orders/http.service';
import { HttpService as SupplierHttp } from 'src/app/catalogs/suppliers/http.service';
import { HttpService as CarHttp } from 'src/app/catalogs/car/http.service';
import { HttpService as CarCategoryHttp } from 'src/app/catalogs/car-category/http.service';
import { Product } from 'src/app/models/Product';
import { Address } from 'src/app/models/Address';
import { Supplier } from 'src/app/models/Supplier';
import { CarCategory } from 'src/app/models/CarCategory';
import { Request } from 'src/app/models/Request';
import { ClientEditorComponent } from 'src/app/catalogs/clients/editor/editor.component';
import { EditorComponent } from 'src/app/catalogs/suppliers/editor/editor.component';
import { Car } from 'src/app/models/Car';

@Component({
  selector: 'app-order-add',
  templateUrl: './order-add.component.html',
  styleUrls: ['./order-add.component.css']
})
export class OrderAddComponent implements OnInit {
  static MODAL_NAME = 'orderAddModal';

  request: Request = new Request();

  selectedClient?: Client = undefined;
  clients: Client[] = [];

  cars: Car[] = [];

  selectedAddress?: Address = undefined;

  selectedProduct?: Product = undefined;
  products: Product[] = [];

  selectedSupplier?: Supplier = undefined;
  suppliers: Supplier[] = [];

  isLong = false;

  selectedCarCategory?: CarCategory = undefined;
  carCategories: CarCategory[] = [];

  constructor(
    private ngxSmartModalService: NgxSmartModalService,
    private clientHttp: ClientHttp,
    private productHttp: ProductHttp,
    private reqService: ReqService,
    private supplierHttp: SupplierHttp,
    private carCategoryHttp: CarCategoryHttp,
    private carHttp: CarHttp) { }

  @Output() changed = new EventEmitter<any>();

  ngOnInit() {
  }

  onOpen() {
    // this.reset();
    const transferred = this.ngxSmartModalService.getModalData(OrderAddComponent.MODAL_NAME);
    this.ngxSmartModalService.resetModalData(EditorComponent.MODAL_NAME);
    if (transferred) {
      this.request = transferred;
    }
    this.clientHttp.getClients().subscribe(
      x => this.clients = x);

    this.productHttp.getProducts().subscribe(
      x => this.products = x);

    this.supplierHttp.getSuppliers().subscribe(
      x => this.suppliers = x);

    this.carCategoryHttp.getCarCategories().subscribe(
      x => this.carCategories = x);

    this.carHttp.getCars().subscribe(
      x => this.cars = x);
  }

  reset() {
    this.request = new Request();
    this.selectedClient = undefined;
    this.clients = [];

    this.selectedAddress = undefined;

    this.selectedProduct = undefined;
    this.products = [];

    this.selectedCarCategory = undefined;
    this.carCategories = [];
  }

  addClient() {
    this.ngxSmartModalService.getModal(ClientEditorComponent.MODAL_NAME).open();
  }

  onSupplierChange() {
    if (this.request.supplier) {
      this.request.supplierVat = this.request.supplier.vat;
      const prod = this.request.product;
      if (prod) {
        const newProd = this.request.supplier.products.find(x => x.id === prod.id);
        if (newProd) {
          this.request.purchasePrice = newProd.price;
        }
      }
    } else {
      this.request.supplierVat = undefined;
      this.request.purchasePrice = undefined;
    }
  }

  onCarChange() {
    if (this.request.car) {
      const newCar = this.request.car;
      this.request.freightPrice = newCar.freightPrice;
      this.request.carCategory = newCar.carCategory;
      this.request.unit = newCar.unit;
      this.request.carVat = newCar.vat;
    } else {
      this.request.freightPrice = undefined;
      this.request.carCategory = undefined;
      this.request.unit = undefined;
      this.request.carVat = undefined;
    }
  }

  async onProductChange(prodId: number) {
    if (!prodId) {
      return;
    }
    this.suppliers = await this.supplierHttp.getSuppliersByProdId(prodId).toPromise();
  }

  onClientAdd() {
    this.clientHttp.getClients().subscribe(
      x => this.clients = x);
  }

  onSupplierAdd() {

    this.supplierHttp.getSuppliers().subscribe(
      x => this.suppliers = x);

  }

  addSupplier() {
    this.ngxSmartModalService.getModal(EditorComponent.MODAL_NAME).open();
  }

  async createOrUpdate(req: Request) {
    console.log('this.request', this.request);
    console.log('req', req);
    if (req.id) {
      console.log('333', req);
      await this.reqService.edit(req).toPromise();
    } else {
      console.log('222', req);
      await this.reqService.add(req).toPromise();
    }
    this.changed.emit();
    this.ngxSmartModalService.toggle(OrderAddComponent.MODAL_NAME);
  }
}
