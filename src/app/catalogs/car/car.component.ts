import { Component, OnInit } from '@angular/core';
import { Car } from '../../models/Car';
import { HttpService } from './http.service';
import { NgxSmartModalService } from 'ngx-smart-modal';
import { AddCarComponent } from './add-car/add-car.component';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-car',
  templateUrl: './car.component.html',
  styleUrls: ['./car.component.css']
})
export class CarComponent implements OnInit {

  cars: Car[] = [];
  newCar: Car;

  constructor(public http: HttpService, private toastr: ToastrService, public ngxSmartModalService: NgxSmartModalService) { }


  ngOnInit() {
    this.getData();
  }

  getData() {
    this.http.getCars().subscribe(
      m =>
        this.cars = m.data,
      e => {
        this.toastr.error(e.message);
      }
    );
  }

  addCar() {
    this.ngxSmartModalService.getModal(AddCarComponent.MODAL_NAME).open();
  }

  deleteCar(carId: number) {
    this.http.deleteCar(carId).subscribe(
      _ => this.toastr.info('Успешно удалено'),
      e => this.toastr.error('При удалении произошла ошибка'),
      () => this.getData());
  }

  onAdd() {
    this.getData();
  }
}
