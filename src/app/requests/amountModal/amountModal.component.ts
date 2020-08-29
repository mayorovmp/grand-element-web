import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { NgxSmartModalService } from 'ngx-smart-modal';
import { Request } from 'src/app/models/Request';
import { Car } from 'src/app/models/Car';
import { HttpService as CarHttp } from 'src/app/catalogs/car/http.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-modal-amount',
  templateUrl: './amountModal.component.html',
  styleUrls: ['./amountModal.component.css']
})
export class AmountModalComponent implements OnInit {

  @Output() changed = new EventEmitter<any>();

  request: Request = new Request();
  cars: Car[] = [];
  parentCarOwner: Car;
  carOwnerText = '';
  carListVisible = false;
  parentAmount = 0;

  constructor(
    private ngxSmartModalService: NgxSmartModalService,
    private carHttp: CarHttp,
    private toastr: ToastrService
  ) { }

  ngOnInit() { }

  async onOpen() {
    this.reset();
    this.carHttp.getCars().toPromise().then(cars => this.cars = cars);
    const transferred = this.ngxSmartModalService.getModalData('amountModal');
    if (transferred) {
      const { req } = transferred;
      this.request = req;
      this.parentAmount = req.amount;
      this.parentCarOwner = req.car;
    }
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
    this.changed.emit();
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
        transferred.setStatus();
        this.ngxSmartModalService.close('amountModal');
      }
    }
  }
}
