import { Component, OnInit } from '@angular/core';
import { Car } from '../../models/Car';
import { HttpService } from './http.service';
import { NgxSmartModalService } from 'ngx-smart-modal';
import { ToastrService } from 'ngx-toastr';
import { EditorComponent } from './editor/editor.component';

@Component({
  selector: 'app-car',
  templateUrl: './car.component.html',
  styleUrls: ['./car.component.css']
})
export class CarComponent implements OnInit {

  cars: Car[] = [];
  defaultCar = new Car();

  constructor(public http: HttpService, private toastr: ToastrService, public ngxSmartModalService: NgxSmartModalService) { }

  ngOnInit() {
    this.getData();
  }

  getData() {
    this.http.getCars().subscribe(
      m =>
        this.cars = m,
      e => {
        this.toastr.error(e.message);
      }
    );
    this.defaultCar = new Car();
  }

  async createOrUpdate(item: Car) {
    this.ngxSmartModalService.setModalData(item, EditorComponent.MODAL_NAME, true);
    this.ngxSmartModalService.toggle(EditorComponent.MODAL_NAME);
  }

  delete(item: Car) {
    if (item.id) {
      this.http.delete(item.id).subscribe(
        _ => this.toastr.info('Успешно удалено'),
        e => this.toastr.error('При удалении произошла ошибка'),
        () => this.getData());
    }
  }

  onAdd() {
    this.getData();
  }
}
