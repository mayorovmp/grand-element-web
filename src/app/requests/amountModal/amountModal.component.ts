import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { NgxSmartModalService } from 'ngx-smart-modal';
import { Request } from 'src/app/models/Request';
import { Car } from 'src/app/models/Car';
import { HttpService as CarHttp } from 'src/app/catalogs/car/http.service';

@Component({
  selector: 'app-modal-amount',
  templateUrl: './amountModal.component.html',
  styleUrls: ['./amountModal.component.css']
})
export class AmountModalComponent implements OnInit {

  @Output() changed = new EventEmitter<any>();

  request: Request = new Request();
  cars: Car[] = [];
  carOwnerText = '';
  carListVisible = false;
  parentAmount = 0;

  constructor(
    private ngxSmartModalService: NgxSmartModalService,
    private carHttp: CarHttp
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
    }
    console.log('this.req', this.request)
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
    this.carOwnerText = '';
    this.carListVisible = false;
    this.parentAmount = 0;
  }
  onClose() {
    this.changed.emit();
    this.ngxSmartModalService.close('amountModal');
  }
}
