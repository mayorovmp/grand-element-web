import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { NgxSmartModalService } from 'ngx-smart-modal';
import { HttpService } from '../http.service';

@Component({
  selector: 'app-car-category-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.css']
})
export class CarCategoryAddComponent implements OnInit {
  static MODAL_NAME = 'carCategoryAddModal';

  constructor(public ngxSmartModalService: NgxSmartModalService, private httpService: HttpService) { }

  @Output() changed = new EventEmitter<any>();

  ngOnInit() {
  }

  async add(categoryName: string) {
    await this.httpService.addCarCategory(categoryName).toPromise();
    this.changed.emit();
    this.ngxSmartModalService.getModal(CarCategoryAddComponent.MODAL_NAME).close();
  }

  onOpen(): void {
  }

}
