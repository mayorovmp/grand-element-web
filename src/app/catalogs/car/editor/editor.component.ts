import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { NgxSmartModalService } from 'ngx-smart-modal';
import { HttpService } from '../http.service';
import { CarCategory } from 'src/app/models/CarCategory';
import { Car } from 'src/app/models/Car';

@Component({
  selector: 'app-car-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.css']
})
export class EditorComponent implements OnInit {
  static MODAL_NAME = 'editCarModal';
  @Output() changed = new EventEmitter<any>();

  car: Car = new Car();

  carCategories: CarCategory[] = [];

  constructor(private httpSrv: HttpService, private ngxSmartModalService: NgxSmartModalService) { }

  ngOnInit() {
  }

  async onOpen() {
    const transferred = this.ngxSmartModalService.getModalData(EditorComponent.MODAL_NAME);
    this.ngxSmartModalService.resetModalData(EditorComponent.MODAL_NAME);
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
    this.changed.emit();
  }

  byId(a: Car, b: Car) {
    return a && b ? a.id === b.id : a === b;
  }

  async createOrUpdate(item: Car) {
    if (item.id) {
      await this.httpSrv.edit(item).toPromise();
    } else {
      await this.httpSrv.add(item).toPromise();
    }
    this.changed.emit();
    this.ngxSmartModalService.toggle(EditorComponent.MODAL_NAME);
  }
}
