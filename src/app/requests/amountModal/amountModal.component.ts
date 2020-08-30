import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { NgxSmartModalService } from 'ngx-smart-modal';
import { Request } from 'src/app/models/Request';
import { Car } from 'src/app/models/Car';
import { HttpService as CarHttp } from 'src/app/catalogs/car/http.service';
import { HttpService as ReqService } from 'src/app/requests/http.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-modal-amount',
  templateUrl: './amountModal.component.html',
  styleUrls: ['./amountModal.component.css']
})
export class AmountModalComponent implements OnInit {

  @Output() changed = new EventEmitter<any>();

  request: Request = new Request();
  parentReq: Request = new Request();
  cars: Car[] = [];
  allCars: Car[];
  favoriteCars: Car[] = [];
  parentCarOwner: Car;
  carOwnerText = '';
  carListVisible = false;
  parentAmount = 0;

  constructor(
    private ngxSmartModalService: NgxSmartModalService,
    private carHttp: CarHttp,
    private reqService: ReqService,
    private toastr: ToastrService
  ) { }

  ngOnInit() { }

  async onOpen() {
    this.reset();
    this.carHttp.getCars().toPromise().then(cars => this.allCars = cars);
    this.carHttp.getFavoriteCars(30, 5).subscribe(
      cars => this.favoriteCars = cars,
      error => this.toastr.error(error.message)
    );
    const transferred = this.ngxSmartModalService.getModalData('amountModal');
    if (transferred) {
      const { req } = transferred;
      this.parentReq = req;
      this.parentAmount = req.amount;
      this.parentCarOwner = req.car;

      this.request = new Request();
      this.request.deliveryStart = new Date();
      if (!this.request.deliveryStart.getDay()) {
        this.request.deliveryStart.setDate(this.request.deliveryStart.getDate() + 1);
        this.request.deliveryStart = this.request.deliveryStart;
        this.request.deliveryEnd = this.request.deliveryStart;
      }
      this.request.client = req.client;
      this.request.deliveryAddress = req.deliveryAddress;
      this.request.isLong = false;
      this.request.amount = req.amount;
      this.request.sellingPrice = req.sellingPrice;
      this.request.product = req.product;
      this.request.supplier = req.supplier;
      this.request.supplierVat = req.supplierVat;
      this.request.purchasePrice = req.purchasePrice;
      this.request.car = req.car;
      this.request.carVat = req.carVat;
      this.request.freightPrice = req.freightPrice;
      this.request.amountIn = req.amountIn;
      this.request.amountOut = req.amountOut;
      this.request.freightCost = req.freightCost;
      this.request.sellingCost = req.sellingCost;
      this.request.profit = req.profit;
      this.request.income = req.income;
      this.request.comment = req.comment;
      this.request.unit = req.unit;
      this.request.requestStatusId = 1;
    }
  }
  setFavoriteCars() {
    this.cars = this.favoriteCars;
    this.carListVisible = true;
  }
  onChangeCarOwner() {
    this.carListVisible = true;
    this.cars = this.allCars;
  }
  selectCarOwner(car: Car) {
    this.carListVisible = false;
    if (car.owner) {
      this.carOwnerText = car.owner;
    }
    this.request.car = car;
  }
  reset() {
    this.request = new Request();
    this.cars = [];
    this.parentCarOwner = {};
    this.carOwnerText = '';
    this.carListVisible = false;
    this.parentAmount = 0;
  }
  onClose() {
    this.ngxSmartModalService.close('amountModal');
  }
  apply() {
    const transferred = this.ngxSmartModalService.getModalData('amountModal');
    if (!this.request.amount || !this.request.car) {
      this.toastr.error('Заполните поля');
    } else {
      if (this.parentAmount < this.request.amount) {
        this.toastr.error('Введенный объем больше объема заказа');
      } else if (this.parentAmount === this.request.amount && this.parentCarOwner.id === this.request.car?.id) {
        this.ngxSmartModalService.close('amountModal');
      } else if (this.parentAmount === this.request.amount && this.parentCarOwner.id !== this.request.car?.id) {
        this.closeOldReq();
        this.ngxSmartModalService.close('amountModal');
      } else {
        this.createReq();
        this.ngxSmartModalService.close('amountModal');
      }
    }
  }
  async closeOldReq() {
    await this.reqService.add(this.request).toPromise();
    await this.reqService.del(this.parentReq).toPromise();
    this.changed.emit();
  }
  async createReq() {
    if (this.parentReq.amount && this.request.amount) {
      this.parentReq.amount = this.parentReq.amount - this.request.amount;
    }
    if (this.parentReq.car) {
      this.parentReq.carId = this.parentReq.car.id;
    }

    if (this.parentReq.product) {
      this.parentReq.productId = this.parentReq.product.id;
    }

    if (this.parentReq.deliveryAddress) {
      this.parentReq.deliveryAddressId = this.parentReq.deliveryAddress.id;
    }

    if (this.parentReq.client) {
      this.parentReq.clientId = this.parentReq.client.id;
    }

    if (this.parentReq.carCategory) {
      this.parentReq.carCategoryId = this.parentReq.carCategory.id;
    }

    if (this.parentReq.supplier) {
      this.parentReq.supplierId = this.parentReq.supplier.id;
    }
    await this.reqService.edit(this.parentReq).toPromise();
    await this.reqService.add(this.request).toPromise();
    this.changed.emit();
  }
}
