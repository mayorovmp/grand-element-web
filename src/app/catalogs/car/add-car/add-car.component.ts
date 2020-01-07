import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { NgxSmartModalService } from 'ngx-smart-modal';
import { CarCategory } from 'src/app/models/CarCategory';
import { HttpService } from 'src/app/catalogs/car/http.service';
import { Car } from 'src/app/models/Car';

@Component({
  selector: 'app-catalogs-car-add',
  templateUrl: './add-car.component.html',
  styleUrls: ['./add-car.component.css']
})
export class AddCarComponent implements OnInit {
  static MODAL_NAME = 'addCarModal';

  owner?: string;
  stateNumber?: string;
  contacts?: string;
  comments?: string;
  selectedCarCategories?: CarCategory;

  carCategories: CarCategory[] = [];

  @Output() onAdd = new EventEmitter<any>();

  constructor(private httpService: HttpService, private toastr: ToastrService, public ngxSmartModalService: NgxSmartModalService) { }

  ngOnInit() {
    this.getData();
  }

  getData() {
    this.httpService.getCarCategories().subscribe(
      x => this.carCategories = x.data,
      e => this.toastr.error(e.message));
  }

  onOpen() {
    this.owner = undefined;
    this.stateNumber = undefined;
    this.contacts = undefined;
    this.comments = undefined;
    this.selectedCarCategories = undefined;
  }

  onCarCategoryChange(carCat: CarCategory) {
    this.selectedCarCategories = carCat;
  }

  addCar() {
    const car = new Car(undefined, this.owner, this.stateNumber, this.contacts, this.comments, this.selectedCarCategories);
    this.httpService.addCar(car).subscribe(
      env => this.toastr.info('Перевозчик успешно создан'),
      er => this.toastr.error('При создании произошла ошибка'),
      () => this.onAdd.emit()
    );
    this.ngxSmartModalService.toggle(AddCarComponent.MODAL_NAME);
  }

}
