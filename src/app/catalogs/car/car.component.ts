import { Component, OnInit } from '@angular/core';
import { Car } from '../models/Car';
import { HttpService } from './http.service';
import { NgxSmartModalService } from 'ngx-smart-modal';
import { CarAddComponent } from './car-add/car-add.component';

@Component({
  selector: 'app-car',
  templateUrl: './car.component.html',
  styleUrls: ['./car.component.css']
})
export class CarComponent implements OnInit {

  cars: Car[] = [];
  newCar: Car;

  constructor(public http: HttpService, public ngxSmartModalService: NgxSmartModalService) { }


  ngOnInit() {
    this.http.getCars().subscribe(e =>
      this.cars = e.result
    );
  }

  addCar() {
    this.ngxSmartModalService.getModal(CarAddComponent.MODAL_NAME).open();
  }

}
