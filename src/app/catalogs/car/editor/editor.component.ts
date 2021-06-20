import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { NgxSmartModalService } from 'ngx-smart-modal';
import { ToastrService } from 'ngx-toastr';
import { HttpService } from '../http.service';
import { Car } from '@models/Car';
import { CarNumber } from '@models/CarNumber';

@Component({
  selector: 'app-car-editor',
  templateUrl: './editor.component.html',
})
export class CarEditorComponent implements OnInit {
  static MODAL_NAME = 'editCarModal';
  @Output() changed = new EventEmitter<Car>();

  car: Car = new Car();
  carNumbers: CarNumber[] = [];

  constructor(
    private httpSrv: HttpService,
    private toastr: ToastrService,
    private ngxSmartModalService: NgxSmartModalService
  ) {}

  ngOnInit() {}

  async onOpen() {
    const transferred = this.ngxSmartModalService.getModalData(
      CarEditorComponent.MODAL_NAME
    );
    this.ngxSmartModalService.resetModalData(CarEditorComponent.MODAL_NAME);
    if (transferred) {
      this.car = transferred;
    } else {
      this.car = new Car();
    }
  }

  onClose() {}

  byId(a: Car, b: Car) {
    return a && b ? a.id === b.id : a === b;
  }

  addCarNumber() {
    const newCarNumber = new CarNumber();
    this.car.carNumbers.push(newCarNumber);
  }

  delCarNumber(carNumberId: number) {
    const delId = this.car.carNumbers.findIndex((x) => x.id === carNumberId);
    this.car.carNumbers.splice(delId, 1);
  }

  async createOrUpdate(item: Car) {
    let car = new Car();
    if (item.id) {
      car = await this.httpSrv.edit(item).toPromise();
      this.toastr.info('Перевозчик изменен');
    } else {
      car = await this.httpSrv.add(item).toPromise();
      this.toastr.info('Перевозчик создан');
    }
    this.changed.emit(car);
    this.ngxSmartModalService.toggle(CarEditorComponent.MODAL_NAME);
  }
}
