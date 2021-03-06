import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { NgxSmartModalService } from 'ngx-smart-modal';
import { ToastrService } from 'ngx-toastr';
import { HttpService } from '../http.service';
import { CarCategory } from 'src/app/models/CarCategory';
import { Car } from 'src/app/models/Car';

@Component({
  selector: 'app-car-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.css']
})
export class CarEditorComponent implements OnInit {
  static MODAL_NAME = 'editCarModal';
  @Output() changed = new EventEmitter<Car>();

  car: Car = new Car();

  carCategories: CarCategory[] = [];

  constructor(
    private httpSrv: HttpService,
    private toastr: ToastrService,
    private ngxSmartModalService: NgxSmartModalService) { }

  ngOnInit() {
  }

  async onOpen() {
    const transferred = this.ngxSmartModalService.getModalData(CarEditorComponent.MODAL_NAME);
    this.ngxSmartModalService.resetModalData(CarEditorComponent.MODAL_NAME);
    if (transferred) {
      this.car = transferred;
    } else {
      this.car = new Car();
    }
    this.carCategories = await this.httpSrv.getCarCategories().toPromise();
    this.addDeletedCategory(this.car);
  }

  addDeletedCategory(car: Car) {
    const carCat = car.carCategory;
    if (carCat) {
      const item = this.carCategories.find(x => x.id === carCat.id);
      if (!item) {
        this.carCategories.push(carCat);
      }
    }
  }

  onClose() {
  }

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
    this.ngxSmartModalService.toggle(CarEditorComponent.MODAL_NAME);
  }
}
