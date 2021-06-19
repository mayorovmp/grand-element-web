import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { NgxSmartModalService } from 'ngx-smart-modal';
import { ToastrService } from 'ngx-toastr';
import { HttpService } from '../http.service';
import { Car } from '@models/Car';

@Component({
  selector: 'app-car-editor-amount',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.css'],
})
export class CarEditorAmountComponent implements OnInit {
  static MODAL_NAME = 'editCarAmountModal';
  @Output() changed = new EventEmitter<Car>();

  car: Car = new Car();

  constructor(
    private httpSrv: HttpService,
    private toastr: ToastrService,
    private ngxSmartModalService: NgxSmartModalService
  ) {}

  ngOnInit() {}

  async onOpen() {
    const transferred = this.ngxSmartModalService.getModalData(
      CarEditorAmountComponent.MODAL_NAME
    );
    this.ngxSmartModalService.resetModalData(
      CarEditorAmountComponent.MODAL_NAME
    );
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
    this.ngxSmartModalService.toggle(CarEditorAmountComponent.MODAL_NAME);
  }
}
