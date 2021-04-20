import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { NgxSmartModalService } from 'ngx-smart-modal';
import { ToastrService } from 'ngx-toastr';
import { HttpService as CarCategoryHttp } from 'src/app/catalogs/car-category/http.service';
import { CarEditorComponent } from 'src/app/catalogs/car/editor/editor.component';
import { HttpService as CarHttp } from 'src/app/catalogs/car/http.service';
import { ClientEditorComponent } from 'src/app/catalogs/clients/editor/editor.component';
import { HttpService as ClientHttp } from 'src/app/catalogs/clients/http.service';
import { EditProductComponent } from 'src/app/catalogs/product/editor-product/edit-product.component';
import { HttpService as ProductHttp } from 'src/app/catalogs/product/http.service';
import { SupplierEditorComponent } from 'src/app/catalogs/suppliers/editor/editor.component';
import { HttpService as SupplierHttp } from 'src/app/catalogs/suppliers/http.service';
import { Car } from '@models/Car';
import { CarCategory } from '@models/CarCategory';
import { Client } from '@models/Client';
import { Product } from '@models/Product';
import { Request } from '@models/Request';
import { Supplier } from '@models/Supplier';
import { Status } from '@models/Status';
import { HttpService as ReqService } from 'src/app/requests/http.service';
import { Address } from '@models/Address';
import { Goal } from './Goal';
import { ClientsGoal } from 'src/app/catalogs/clients/Goal';

@Component({
  selector: 'app-request-editor',
  templateUrl: './request-editor.component.html',
  styleUrls: ['./request-editor.component.css'],
})
export class RequestEditorComponent implements OnInit {
  static readonly MODAL_NAME = 'requestEditorModal';
  readonly ndsConst = 20 / 120; // value added tax

  goal: Goal; // Цель открытия формы(редактирование и тд).

  request: Request = new Request();

  clientsGoal: ClientsGoal;

  clients: Client[] = [];

  cars: Car[] = [];

  products: Product[] = [];

  suppliers: Supplier[] = [];

  carCategories: CarCategory[] = [];

  isLong = false;

  hasParent = false;

  curDate = new Date();

  parentRequestId = 0;

  clientNameText: string | undefined = '';
  clientListVisible = false;

  additionalCarOwners: Car[] = [];

  statuses: Status[] = [];

  constructor(
    private ngxSmartModalService: NgxSmartModalService,
    private toastr: ToastrService,
    private clientHttp: ClientHttp,
    private productHttp: ProductHttp,
    private reqService: ReqService,
    private supplierHttp: SupplierHttp,
    private carCategoryHttp: CarCategoryHttp,
    private carHttp: CarHttp
  ) {}

  @Output() changed = new EventEmitter<any>();

  ngOnInit() {
    // По умолчанию заявка на завтра.
    this.curDate.setDate(this.curDate.getDate() + 1);
    // Если завтра воскресенье, то заявка на понедельник.
    if (!this.curDate.getDay()) {
      this.curDate.setDate(this.curDate.getDate() + 1);
    }
  }

  resetDate(dateType: string) {
    if (dateType === 'start') {
      this.request.deliveryStart = new Date();
    } else {
      this.request.deliveryEnd = new Date();
    }
  }

  async getCatalogs(): Promise<any[]> {
    const promises: Promise<any>[] = [];
    promises.push(
      this.clientHttp
        .getClients()
        .toPromise()
        .then((x) => (this.clients = x))
    );

    promises.push(
      this.productHttp
        .getProducts()
        .toPromise()
        .then((x) => (this.products = x))
    );

    promises.push(
      this.supplierHttp
        .getSuppliers()
        .toPromise()
        .then((x) => (this.suppliers = x))
    );

    promises.push(
      this.carCategoryHttp
        .getCarCategories()
        .toPromise()
        .then((x) => (this.carCategories = x))
    );

    promises.push(
      this.carHttp
        .getCars()
        .toPromise()
        .then((x) => (this.cars = x))
    );

    promises.push(
      this.reqService
        .getStatuses()
        .toPromise()
        .then((statuses) => (this.statuses = statuses))
    );

    return Promise.all(promises);
  }

  async onOpen() {
    this.reset();
    const transferred = this.ngxSmartModalService.getModalData(
      RequestEditorComponent.MODAL_NAME
    );
    this.ngxSmartModalService.resetModalData(RequestEditorComponent.MODAL_NAME);
    await this.getCatalogs();
    this.request.deliveryStart = this.curDate;
    this.request.deliveryEnd = this.curDate;
    this.goal = transferred.type;

    switch (this.goal) {
      case Goal.Add: {
        break;
      }
      case Goal.Copy: {
        this.request = new Request();
        const copyingReq = transferred.request;
        this.request.deliveryStart = this.curDate;
        this.request.deliveryEnd = this.curDate;
        this.request.client = copyingReq.client;
        this.request.deliveryAddress = copyingReq.deliveryAddress;
        this.request.isLong = copyingReq.isLong;
        this.request.amount = copyingReq.amount;
        this.request.sellingPrice = copyingReq.sellingPrice;
        this.request.product = copyingReq.product;
        this.request.supplier = copyingReq.supplier;
        this.request.supplierVat = copyingReq.supplierVat;
        this.request.purchasePrice = copyingReq.purchasePrice;
        this.request.car = copyingReq.car;
        this.request.carVat = copyingReq.carVat;
        this.request.freightPrice = copyingReq.freightPrice;
        this.request.amountIn = copyingReq.amountIn;
        this.request.amountOut = copyingReq.amountOut;
        this.request.freightCost = copyingReq.freightCost;
        this.request.sellingCost = copyingReq.sellingCost;
        this.request.profit = copyingReq.profit;
        this.request.income = copyingReq.income;
        this.request.comment = copyingReq.comment;
        this.request.unit = copyingReq.unit;
        if (copyingReq.client?.name) {
          this.clientNameText = copyingReq.client.name;
        }
        await this.getSuppliersByProd(this.request.product?.id);
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
        if (this.request.client?.name) {
          this.clientNameText = this.request.client.name;
        }
        break;
      }
      default: {
        console.error('Не найден метод.');
        break;
      }
    }

    this.calcProfit();
  }

  reset() {
    this.request = new Request();
    this.additionalCarOwners = [];
    this.isLong = false;
    this.hasParent = false;

    this.clients = [];
    this.cars = [];
    this.products = [];
    this.suppliers = [];
    this.carCategories = [];
    this.clientNameText = '';
  }

  // async processLastReq(client: Client | undefined, addr: Address | undefined) {
  //   const lastReq = await this.reqService
  //     .getLastRequest(client, addr)
  //     .toPromise();

  //   if (lastReq) {
  //     this.request.id = undefined;
  //     this.request.deliveryStart = this.curDate;
  //     this.request.deliveryEnd = this.curDate;
  //     this.request.client = client;
  //     this.request.deliveryAddress = lastReq.deliveryAddress;
  //     this.request.isLong = lastReq.isLong;
  //     this.request.amount = lastReq.amount;
  //     this.request.sellingPrice = lastReq.sellingPrice;
  //     this.request.product = lastReq.product;
  //     this.request.supplier = lastReq.supplier;
  //     this.request.supplierVat = lastReq.supplierVat;
  //     this.request.purchasePrice = lastReq.purchasePrice;
  //     this.request.car = lastReq.car;
  //     this.request.carVat = lastReq.carVat;
  //     this.request.freightPrice = lastReq.freightPrice;
  //     this.request.amountIn = lastReq.amountIn;
  //     this.request.amountOut = lastReq.amountOut;
  //     this.request.freightCost = lastReq.freightCost;
  //     this.request.sellingCost = lastReq.sellingCost;
  //     this.request.profit = lastReq.profit;
  //     this.request.income = lastReq.income;
  //     this.request.comment = lastReq.comment;
  //     this.request.unit = lastReq.unit;
  //   } else {
  //     this.request.client = client;
  //     this.request.deliveryAddress = addr;
  //     this.request.isLong = false;
  //     this.request.amount = undefined;
  //     this.request.sellingPrice = undefined;
  //     this.request.product = undefined;
  //     this.request.supplier = undefined;
  //     this.request.supplierVat = undefined;
  //     this.request.purchasePrice = undefined;
  //     this.request.car = undefined;
  //     this.request.carVat = undefined;
  //     this.request.freightPrice = undefined;
  //     this.request.amountIn = undefined;
  //     this.request.amountOut = undefined;
  //     this.request.freightCost = 0;
  //     this.request.sellingCost = undefined;
  //     this.request.profit = undefined;
  //     this.request.income = undefined;
  //     this.request.comment = undefined;
  //     this.request.unit = undefined;
  //   }
  // }

  byId(a: any, b: any) {
    return a && b ? a.id === b.id : a === b;
  }

  selectClient(client: Client) {
    this.clientListVisible = false;
    if (client.name) {
      this.clientNameText = client.name;
    }
    this.request.client = client;
    this.onClientChange();

    if (this.request.client.addresses.length === 1) {
      this.request.deliveryAddress = this.request.client.addresses[0];
    }
  }

  addClient() {
    this.ngxSmartModalService.getModal(ClientEditorComponent.MODAL_NAME).open();
  }
  addSupplier() {
    this.ngxSmartModalService
      .getModal(SupplierEditorComponent.MODAL_NAME)
      .open();
  }
  addProduct() {
    this.ngxSmartModalService.getModal(EditProductComponent.MODAL_NAME).open();
  }
  addCarOwner() {
    this.ngxSmartModalService.getModal(CarEditorComponent.MODAL_NAME).open();
  }

  addCarOwnerToReq() {
    const newCarOwner = new Car();
    this.additionalCarOwners.push(newCarOwner);
  }

  addAddress() {
    this.clientsGoal = ClientsGoal.Edit;
    this.ngxSmartModalService.setModalData(
      { type: ClientsGoal.Edit, client: this.request.client },
      ClientEditorComponent.MODAL_NAME,
      true
    );
    this.ngxSmartModalService.getModal(ClientEditorComponent.MODAL_NAME).open();
  }

  delCarOwnerFromReq(index: number) {
    this.additionalCarOwners.splice(index, 1);
  }

  onSupplierChange() {
    // if (this.request.supplier) {
    //   this.request.supplierVat = this.request.supplier.vat;
    //   const prod = this.request.product;
    //   if (prod) {
    //     const newProd = this.request.supplier.products.find(x => x.id === prod.id);
    //     if (newProd) {
    //       this.request.purchasePrice = newProd.price;
    //     }
    //   }
    // } else {
    //   this.request.supplierVat = undefined;
    //   this.request.purchasePrice = undefined;
    // }
  }
  onCarChange() {
    // if (this.request.car) {
    //   const newCar = this.request.car;
    //   this.request.carCategory = newCar.carCategory;
    //   this.request.unit = newCar.unit;
    //   this.request.carVat = newCar.vat;
    //   this.calcFreigthCost();
    // } else {
    //   this.request.carCategory = undefined;
    //   this.request.unit = undefined;
    //   this.request.carVat = undefined;
    // }
  }
  onAdditionalCarChange(event: any, index: number) {
    // let elem = new Car();
    // this.cars.forEach((el) => {
    //   if (event.target.value === el.owner) {
    //     return elem = el;
    //   }
    // });
    // this.additionalCarOwners[index] = elem;
  }

  canAddCarOwner() {
    return !this.goal && this.request.car;
  }

  async onProductChange(prodId: number | undefined) {
    // this.getSuppliersByProd(prodId);
    // this.request.supplierVat = false;
    // this.request.purchasePrice = undefined;
  }

  private async getSuppliersByProd(prodId: number | undefined) {
    if (!prodId) {
      return;
    }
    this.suppliers = await this.supplierHttp
      .getSuppliersByProdId(prodId)
      .toPromise();
  }

  async onClientChange() {
    if (this.request.client) {
      const lastReq = await this.reqService
      .getLastRequest({clientId: this.request.client.id})
      .toPromise();
      if (lastReq) {
        lastReq.deliveryStart = this.curDate
        lastReq.deliveryEnd = this.curDate;
        this.request = JSON.parse(JSON.stringify(lastReq));
      } else {
        this.toastr.info('Последняя заявка не найдена');
      }
    }
  }

  async onAddrChange() {
    // await this.processLastReq(this.request.client, this.request.deliveryAddress);
    // if (this.request.deliveryAddress) {
    //   this.request.freightPrice = this.request.deliveryAddress.freightPrice;
    // }
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
    this.clientHttp.getClients().subscribe((x) => {
      this.clients = x;
      this.request.client = client;
      if (this.request.client) {
        this.clientNameText = this.request.client.name;
      }
      if (this.clientsGoal) {
        this.request.deliveryAddress =
          client.addresses[client.addresses.length - 1];
      }
    });
  }

  onProductAdd(product: Product) {
    this.productHttp.getProducts().subscribe((x) => {
      this.products = x;
      this.request.product = product;
    });
  }

  onCarOwnerAdd(car: Car) {
    this.cars = [];
    this.carHttp.getCars().subscribe((x) => {
      this.cars = x;
      this.request.car = car;
    });
  }

  onSupplierAdd(supplier: Supplier) {
    this.supplierHttp.getSuppliers().subscribe((x) => {
      this.suppliers = x;
      this.request.supplier = supplier;
      if (supplier.products.length) {
        this.request.product = supplier.products[0];
      }
    });
  }

  onAmountChange() {
    this.calcFreigthCost();
    this.calcSellingCost();
    this.calcProfit();
  }

  onFreightPriceChange(event) {
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
      const freightCost = this.request.amountOut * this.request.freightPrice;
      this.request.freightCost = Number(freightCost.toFixed(2));
    } else {
      this.request.freightCost = undefined;
    }
  }

  calcSellingCost() {
    if (this.request.sellingPrice && this.request.amountOut) {
      const sellingCost = this.request.sellingPrice * this.request.amountOut;
      this.request.sellingCost = Number(sellingCost.toFixed(2));
    } else {
      this.request.sellingCost = undefined;
    }
  }

  calcProfit() {
    if (
      this.request.sellingCost !== undefined &&
      this.request.freightCost !== undefined &&
      this.request.reward !== undefined &&
      this.request.purchasePrice !== undefined &&
      this.request.amountOut !== undefined
    ) {
      // Для расчета прибыли, посчитаем доход.
      let income =
        this.request.sellingCost -
        this.request.purchasePrice * this.request.amountOut -
        this.request.freightCost;
      const incomeVat = (income + this.request.reward) * this.ndsConst;
      let freightVat = 0; // НДС перевозки
      let purchaseVat = 0; // НДС закупки
      if (!this.request.carVat) {
        // НДС не включен в стоимость перевозки.
        freightVat = this.request.freightCost * this.ndsConst;
      }
      if (!this.request.supplierVat) {
        // НДС не включен в стоимость товара.
        purchaseVat =
          this.request.purchasePrice * this.request.amountOut * this.ndsConst;
      }

      let profit =
        income - incomeVat - freightVat - purchaseVat - this.request.reward;

      profit = Number(profit.toFixed(2));
      income = Number(income.toFixed(2));

      this.request.profit = profit;
      this.request.income = income;
    } else {
      // Не достаточно данных для подсчета прибыли и дохода
      this.request.profit = undefined;
      this.request.income = undefined;
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

    if (req.requestStatus?.id) {
      req.requestStatusId = req.requestStatus.id;
    } else {
      // Если статус не установлен, то по умолчанию статус Новая
      // TODO: Вынести в константу 1.
      req.requestStatusId = 1;
    }

    if (req.supplier) {
      req.supplierId = req.supplier.id;
    }

    if (req.amount) {
      req.amount = Number(req.amount.toFixed(2))
    }
    switch (this.goal) {
      case Goal.Copy:
      case Goal.Add: {
        const isFirstAdded = await this.reqService.add(req).toPromise();
        if (this.additionalCarOwners.length > 0 && isFirstAdded) {
          this.additionalCarOwners.forEach(async (car) => {
            const newReq = JSON.parse(JSON.stringify(this.request));
            newReq.car = car;
            newReq.carId = car.id;
            newReq.carCategoryId = car.carCategory?.id;
            newReq.carCategory = car.carCategory;
            newReq.unit = car.unit;
            newReq.supplierVat = car.vat;
            await this.reqService.add(newReq).toPromise();
            this.changed.emit();
          });
          break;
        } else {
          break;
        }
      }
      case Goal.AddChildRequest: {
        await this.reqService
          .addChildReq(req, this.parentRequestId)
          .toPromise();
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
