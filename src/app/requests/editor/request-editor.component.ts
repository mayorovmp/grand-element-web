import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { NgxSmartModalService } from 'ngx-smart-modal';
import { HttpService as CarCategoryHttp } from 'src/app/catalogs/car-category/http.service';
import { HttpService as CarHttp } from 'src/app/catalogs/car/http.service';
import { ClientEditorComponent } from 'src/app/catalogs/clients/editor/editor.component';
import { HttpService as ClientHttp } from 'src/app/catalogs/clients/http.service';
import { HttpService as ProductHttp } from 'src/app/catalogs/product/http.service';
import { EditorComponent } from 'src/app/catalogs/suppliers/editor/editor.component';
import { HttpService as SupplierHttp } from 'src/app/catalogs/suppliers/http.service';
import { Car } from 'src/app/models/Car';
import { CarCategory } from 'src/app/models/CarCategory';
import { Client } from 'src/app/models/Client';
import { Product } from 'src/app/models/Product';
import { Request } from 'src/app/models/Request';
import { Supplier } from 'src/app/models/Supplier';
import { HttpService as ReqService } from 'src/app/requests/http.service';
import { Address } from 'src/app/models/Address';
import { Goal } from './Goal';

@Component({
  selector: 'app-request-editor',
  templateUrl: './request-editor.component.html',
  styleUrls: ['./request-editor.component.css']
})
export class RequestEditorComponent implements OnInit {
  static readonly MODAL_NAME = 'requestEditorModal';
  readonly ndsConst = 0.1525; // value added tax

  goal: Goal; // Цель открытия формы(редактирование и тд).

  request: Request = new Request();

  clients: Client[] = [];

  cars: Car[] = [];

  products: Product[] = [];

  suppliers: Supplier[] = [];

  carCategories: CarCategory[] = [];

  isLong = false;

  hasParent = false;

  curDate = new Date();

  parentRequestId = 0;

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

  async getCatalogs(): Promise<any[]> {
    const promises: Promise<any>[] = [];
    promises.push(this.clientHttp.getClients().toPromise().then(x => this.clients = x));

    promises.push(this.productHttp.getProducts().toPromise().then(x => this.products = x));

    promises.push(this.supplierHttp.getSuppliers().toPromise().then(
      x => this.suppliers = x));

    promises.push(this.carCategoryHttp.getCarCategories().toPromise().then(
      x => this.carCategories = x));

    promises.push(this.carHttp.getCars().toPromise().then(
      x => this.cars = x));

    return Promise.all(promises);
  }

  async onOpen() {
    this.reset();
    const transferred = this.ngxSmartModalService.getModalData(RequestEditorComponent.MODAL_NAME);
    this.ngxSmartModalService.resetModalData(RequestEditorComponent.MODAL_NAME);

    await this.getCatalogs();

    this.curDate = transferred.date;

    this.goal = transferred.type;

    switch (this.goal) {
      case Goal.Add: {
        break;
      }
      case Goal.AddChildRequest: {
        this.request = new Request();
        this.parentRequestId = transferred.parent.id;
        this.request.product = transferred.parent.product;
        this.request.client = transferred.parent.client;
        this.request.sellingPrice = transferred.parent.sellingPrice;
        this.request.deliveryAddress = transferred.parent.deliveryAddress;
        await this.getSuppliersByProd(this.request.product?.id);
        this.request.deliveryEnd = new Date(transferred.date);
        this.request.deliveryStart = new Date(transferred.date);
        this.request.isLong = false;
        this.hasParent = true;
        break;
      }
      case Goal.Edit: {
        this.request = transferred.request;
        break;
      }
      default: {
        console.error('Не найден метод.');
        break;
      }
    }
  }

  reset() {
    this.request = new Request();
    this.isLong = false;
    this.hasParent = false;

    this.clients = [];
    this.cars = [];
    this.products = [];
    this.suppliers = [];
    this.carCategories = [];
  }

  async processLastReq(client: Client | undefined, addr: Address | undefined) {
    const lastReq = await this.reqService.getLastRequest(client, addr).toPromise();

    if (lastReq) {
          this.request.id = undefined;
          this.request.deliveryStart = this.curDate;
          this.request.deliveryEnd = this.curDate;
          this.request.client = client;
          this.request.deliveryAddress = addr;
          this.request.isLong = lastReq.isLong;
          this.request.amount = lastReq.amount;
          this.request.sellingPrice = lastReq.sellingPrice;
          this.request.product = lastReq.product;
          this.request.supplier = lastReq.supplier;
          this.request.supplierVat = lastReq.supplierVat;
          this.request.purchasePrice = lastReq.purchasePrice;
          this.request.car = lastReq.car;
          this.request.carVat = lastReq.carVat;
          this.request.freightPrice = lastReq.freightPrice;
          this.request.amountIn = lastReq.amountIn;
          this.request.amountOut = lastReq.amountOut;
          this.request.freightCost = lastReq.freightCost;
          this.request.sellingCost = lastReq.sellingCost;
          this.request.profit = lastReq.profit;
          this.request.comment = lastReq.comment;
          this.request.unit = lastReq.unit;
        } else {
          this.request.client = client;
          this.request.deliveryAddress = addr;
          this.request.isLong = false;
          this.request.amount = undefined;
          this.request.sellingPrice = undefined;
          this.request.product = undefined;
          this.request.supplier = undefined;
          this.request.supplierVat = undefined;
          this.request.purchasePrice = undefined;
          this.request.car = undefined;
          this.request.carVat = undefined;
          this.request.freightPrice = undefined;
          this.request.amountIn = undefined;
          this.request.amountOut = undefined;
          this.request.freightCost = 0;
          this.request.sellingCost = undefined;
          this.request.profit = undefined;
          this.request.comment = undefined;
          this.request.unit = undefined;
        }
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
      this.request.carCategory = newCar.carCategory;
      this.request.unit = newCar.unit;
      this.request.carVat = newCar.vat;
      this.calcFreigthCost();
    } else {
      this.request.carCategory = undefined;
      this.request.unit = undefined;
      this.request.carVat = undefined;
    }
  }

  async onProductChange(prodId: number | undefined) {
    this.getSuppliersByProd(prodId);
  }

  private async getSuppliersByProd(prodId: number | undefined) {
    if (!prodId) {
      return;
    }
    this.suppliers = await this.supplierHttp.getSuppliersByProdId(prodId).toPromise();
  }

  onClientChange() {
    this.processLastReq(this.request.client, undefined);
  }

  async onAddrChange() {
    await this.processLastReq(this.request.client, this.request.deliveryAddress);

    if (this.request.deliveryAddress) {
      this.request.freightPrice = this.request.deliveryAddress.freightPrice;
    }
  }

  async onReqModelChange() {
    // this.reqService.getLastRequest(this.request).subscribe(
    //   lastReq => {
    //     if (!lastReq) {
    //       return;
    //     }
    // this.request = lastReq;
    // this.request.id = 0;
    // this.request.deliveryEnd = new Date(this.curDate);
    // this.request.deliveryStart = new Date(this.curDate);
    // this.calcFreigthCost();
    // this.calcSellingCost();
    // this.calcProfit();
    // }
    // );
  }

  onClientAdd(client: Client) {
    this.clientHttp.getClients().subscribe(
      x => {
        this.clients = x;
        this.request.client = client;
      }
    );
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

  onFreightPriceChange(event) {
    console.log('event', parseFloat(event.target.value));
    this.request.freightPrice = parseFloat(event.target.value);
    this.calcFreigthCost();
    this.calcProfit();
  }

  onFreightCostChange() {
    this.calcProfit();
  }

  onSellingPriceChange() {
    this.calcSellingCost();
    this.calcProfit();
  }

  calcFreigthCost() {
    if (this.request.amountOut && this.request.freightPrice) {
      this.request.freightCost = this.request.amountOut * this.request.freightPrice;
    } else {
      this.request.freightCost = undefined;
    }
  }

  calcSellingCost() {
    if (this.request.sellingPrice && this.request.amountOut) {
      this.request.sellingCost = this.request.sellingPrice * this.request.amountOut;
    } else {
      this.request.sellingCost = undefined;
    }
  }

  calcProfit() {
    console.log(this.request);
    if (this.request.sellingCost !== undefined &&
      this.request.freightCost !== undefined &&
      this.request.reward !== undefined &&
      this.request.purchasePrice !== undefined &&
      this.request.amountOut !== undefined
    ) {
      let profit = this.request.sellingCost
                  - this.request.purchasePrice * this.request.amountOut
                  - this.request.reward
                  - this.request.freightCost;
      if (this.request.carVat) {
        profit -= this.request.freightCost * this.ndsConst;
      }
      this.request.profit = profit;
    } else {
      // Не достаточно данных для подсчета
      this.request.profit = undefined;
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

    switch (this.goal) {
      case Goal.Add: {
        await this.reqService.add(req).toPromise();
        break;
      }
      case Goal.AddChildRequest: {
        await this.reqService.addChildReq(req, this.parentRequestId).toPromise();
        break;
      }
      case Goal.Edit: {
        await this.reqService.edit(req).toPromise();
        break;
      }
      default: {
        console.error('Не найден метод.');
        break;
      }
    }

    this.changed.emit();
    this.ngxSmartModalService.toggle(RequestEditorComponent.MODAL_NAME);
  }
}
