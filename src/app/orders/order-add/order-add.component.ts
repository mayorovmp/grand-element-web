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
import { HttpErrorResponse } from '@angular/common/http';
import { Subscription } from 'rxjs';

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

  ndsConst = 0.1525; // value added tax

  curDate = new Date();

  parentRequestId = 0;

  isParentOrderLong = false;

  isShort = false;

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

  async onOpen() {
    this.reset();
    const transferred = this.ngxSmartModalService.getModalData(OrderAddComponent.MODAL_NAME);
    const promises: Promise<any>[] = [];
    promises.push(this.clientHttp.getClients().toPromise().then(x => this.clients = x));

    promises.push(this.productHttp.getProducts().toPromise().then(x => this.products = x));

    promises.push(this.supplierHttp.getSuppliers().toPromise().then(
      x => this.suppliers = x));

    promises.push(this.carCategoryHttp.getCarCategories().toPromise().then(
      x => this.carCategories = x));

    promises.push(this.carHttp.getCars().toPromise().then(
      x => this.cars = x));

    await Promise.all(promises);

    this.curDate = transferred.date;
    this.ngxSmartModalService.resetModalData(OrderAddComponent.MODAL_NAME);
    if (transferred.type === 'edit') {
      this.request = transferred.request;
      this.calcFreigthCost();
      this.calcSellingCost();
      this.calcProfit();
      this.isParentOrderLong = false;
    } else if (transferred.type === 'add') {
      this.reqService.getLastRequest('').subscribe(
        lastReq => {
          this.request = lastReq;
          this.request.id = 0;
          this.request.deliveryEnd = new Date(transferred.date);
          this.request.deliveryStart = new Date(transferred.date);
          this.calcFreigthCost();
          this.calcSellingCost();
          this.calcProfit();
          this.isParentOrderLong = false;
        },
        err => {
          console.log(err);
        }
      );
    } else if (transferred.type === 'addShortReq') {
      this.request = new Request();
      this.isShort = true;
      this.parentRequestId = transferred.parent.id;
      this.request.product = transferred.parent.product;
      this.request.client = transferred.parent.client;
      this.request.sellingPrice = transferred.parent.sellingPrice;
      this.request.deliveryAddress = transferred.parent.deliveryAddress;
      if (this.request.product) {
        this.onProductChange(this.request.product.id);
      }
      // this.request.supplier = transferred.parent.supplier;

      // this.request = transferred.parent;
      this.request.deliveryEnd = new Date(transferred.date);
      this.request.deliveryStart = new Date(transferred.date);
      this.request.isLong = false;
      this.calcFreigthCost();
      this.calcSellingCost();
      this.calcProfit();
      this.isParentOrderLong = true;
    }
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

  byId(a: any, b: any) {
    return a && b ? a.id === b.id : a === b;
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
      this.calcFreigthCost();
    } else {
      this.request.freightPrice = undefined;
      this.request.carCategory = undefined;
      this.request.unit = undefined;
      this.request.carVat = undefined;
    }
  }

  async onProductChange(prodId: number | undefined) {
    if (!prodId) {
      return;
    }
    this.suppliers = await this.supplierHttp.getSuppliersByProdId(prodId).toPromise();
  }

  async onReqModelChange() {
    let clientId: number | undefined;
    let addressId: number | undefined;
    if (this && this.request && this.request.client && this.request.client.id) {
      clientId = this.request.client.id;
    }
    if (this && this.request && this.request.deliveryAddress && this.request.deliveryAddress.id) {
      addressId = this.request.deliveryAddress.id;
    }
    let param = '';
    if (clientId && addressId) {
      param = `clientId=${clientId}&addressId=${addressId}`;
    } else {
      param = `clientId=${clientId}`;
    }
    this.reqService.getLastRequest(param).subscribe(
      lastReq => {
        if (!lastReq) {
          return;
        }
        this.request = lastReq;
        this.request.id = 0;
        this.request.deliveryEnd = new Date(this.curDate);
        this.request.deliveryStart = new Date(this.curDate);
        this.calcFreigthCost();
        this.calcSellingCost();
        this.calcProfit();
      }
    );
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

  onAmountChange() {
    this.calcFreigthCost();
    this.calcSellingCost();
    this.calcProfit();
  }

  onFreightPriceChange() {
    this.calcFreigthCost();
    this.calcProfit();
  }

  onFreightCostChange() {
    this.calcProfit();
  }

  onSellingPriceChange() {
    this.calcProfit();
    this.calcSellingCost();
  }

  calcFreigthCost() {
    if (this.request.amountOut && this.request.freightPrice) {
      this.request.freightCost = this.request.amountOut * this.request.freightPrice;
    }
  }
  calcSellingCost() {
    if (this.request.sellingPrice && this.request.purchasePrice && this.request.amountOut) {
      this.request.sellingCost = this.request.sellingPrice * this.request.amountOut;
    }
  }
  calcProfit() {
    console.log(this.request);
    if (this.request.sellingCost !== undefined &&
      this.request.freightCost !== undefined &&
      this.request.reward !== undefined
    ) {
      if (this.request.carVat && this.request.supplierVat) {
        this.request.profit = this.request.sellingCost - this.request.reward - this.request.freightCost;
      } else {
        this.request.profit = this.request.sellingCost - this.request.reward - this.request.freightCost - (this.request.freightCost * this.ndsConst);
      }
    }
  }
  async createOrUpdate(req: Request, parentId: number) {
    if (req.car) {
      req.carId = req.car.id;
    }

    if (req.product) {
      req.productId = req.product.id;
    }

    if (req.deliveryAddress) {
      req.deliveryAddressId = req.deliveryAddress.id;
    }

    if (req.client) {
      req.clientId = req.client.id;
    }

    if (req.carCategory) {
      req.carCategoryId = req.carCategory.id;
    }

    if (req.supplier) {
      req.supplierId = req.supplier.id;
    }
    if (req.id) {
      await this.reqService.edit(req).toPromise();
    } else if (this.parentRequestId) {
      await this.reqService.addShortReq(req, this.parentRequestId).toPromise();
    } else {
      await this.reqService.add(req).toPromise();
    }
    this.changed.emit();
    this.ngxSmartModalService.toggle(OrderAddComponent.MODAL_NAME);
  }
}
