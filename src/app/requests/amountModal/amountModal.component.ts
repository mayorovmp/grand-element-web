import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { NgxSmartModalService } from 'ngx-smart-modal';
import { Request } from '@models/Request';
import { Car } from '@models/Car';
import { HttpService as CarHttp } from 'src/app/catalogs/car/http.service';
import { HttpService as ReqService } from 'src/app/requests/http.service';
import { CarEditorAmountComponent } from 'src/app/catalogs/car/editor-amount/editor.component';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-modal-amount',
  templateUrl: './amountModal.component.html',
  styleUrls: ['./amountModal.component.css'],
})
export class AmountModalComponent implements OnInit {
  static readonly MODAL_NAME = 'amountModal';

  @Output() changed = new EventEmitter<any>();

  request: Request = new Request();
  parentReq: Request = new Request();
  carOwnerText = '';
  cars: Car[] = [];
  allCars: Car[] = [];
  favoriteCars: Car[] = [];
  carListVisible = true;
  amount = 0;

  constructor(
    private ngxSmartModalService: NgxSmartModalService,
    private carHttp: CarHttp,
    private reqService: ReqService,
    private toastr: ToastrService
  ) {}

  ngOnInit() {}

  async onOpen() {
    this.reset();
    this.carHttp
      .getCars()
      .toPromise()
      .then((cars) => (this.allCars = cars));
    this.carHttp.getFavoriteCars(30, 5).subscribe(
      (cars) => (this.favoriteCars = cars),
      (error) => this.toastr.error(error.message)
    );
    const transferred = this.ngxSmartModalService.getModalData('amountModal');
    if (transferred) {
      const req = transferred;
      this.parentReq = req;
      this.request = new Request();
      this.request.deliveryStart = new Date();
      this.request.client = req.client;
      this.request.deliveryAddress = req.deliveryAddress;
      this.request.isLong = false;
      this.request.amount = req.amount.toFixed(2);
      this.request.product = req.product;
      this.request.supplier = req.supplier;
      this.request.car = req.car;
      this.request.amountIn = req.amountIn;
      this.request.amountOut = req.amountOut;
      this.request.comment = req.comment;
      this.request.unit = req.unit;
      this.request.requestStatusId = 3;
      this.request.parentId = req.id;
    }
  }
  onSearch() {
    this.cars = this.allCars;
  }
  setFavoriteCars() {
    this.cars = this.favoriteCars;
    this.carListVisible = true;
  }
  selectCarOwner(car: Car) {
    this.carListVisible = false;
    if (car && car.owner) {
      this.carOwnerText = car.owner;
    }
    this.request.car = car;
  }
  clearAmount() {
    this.request.amount = undefined;
  }
  reset() {
    this.request = new Request();
    this.cars = [];
    this.carOwnerText = '';
    this.carListVisible = false;
  }
  onClose() {
    this.ngxSmartModalService.toggle(AmountModalComponent.MODAL_NAME);
  }
  async apply() {
    if (!this.request.amount || !this.request.car) {
      this.toastr.error('Заполните поля');
    } else {
      if (this.parentReq.amount === this.request.amount) {
        this.parentReq.deliveryStart = new Date();
        this.parentReq.car = this.request.car;
        this.parentReq.isLong = false;
        await this.reqService.edit(this.parentReq).toPromise();
        if (this.parentReq.id) {
          await this.reqService.setStatus(this.parentReq.id, 4).toPromise();
        }
        this.ngxSmartModalService.close(AmountModalComponent.MODAL_NAME);
      } else if (
        this.parentReq.amount &&
        this.parentReq.amount > this.request.amount
      ) {
        this.parentReq.amount -= this.request.amount;
        await this.reqService.edit(this.parentReq).toPromise();
        const newReq = await this.reqService.add(this.request).toPromise();
        if (newReq.id) {
          await this.reqService.setStatus(newReq.id, 4).toPromise();
        }
        this.ngxSmartModalService.close('amountModal');
      } else {
        this.createReq();
        this.ngxSmartModalService.close('amountModal');
      }
      this.changed.emit();
    }
  }
  async closeOldReq() {
    await this.reqService.add(this.request).toPromise();
    await this.reqService.del(this.parentReq).toPromise();
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
  }
  addCarOwner() {
    this.ngxSmartModalService
      .getModal(CarEditorAmountComponent.MODAL_NAME)
      .open();
  }

  onCarOwnerAdd(car: Car) {
    this.cars = [];
    this.carHttp.getCars().subscribe((x) => {
      this.allCars = x;
      this.selectCarOwner(car);
    });
  }
  resetDate(dateType: string) {
    if (dateType === 'start') {
      this.request.deliveryStart = new Date();
    } else {
      this.request.deliveryEnd = new Date();
    }
  }
}
