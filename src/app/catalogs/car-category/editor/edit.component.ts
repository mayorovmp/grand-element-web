import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { CarCategory } from 'src/app/models/CarCategory';
import { NgxSmartModalService } from 'ngx-smart-modal';
import { HttpService } from '../http.service';

@Component({
  selector: 'app-edit-car-category',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css']
})
export class EditCarCategoryComponent implements OnInit {
  static MODAL_NAME = 'editCarCategoryModal';

  constructor(private httpSrv: HttpService, private ngxSmartModalService: NgxSmartModalService) { }

  carCategory: CarCategory = new CarCategory();

  @Output() changed = new EventEmitter<any>();

  ngOnInit() {
  }

  onOpen() {
    this.carCategory = this.ngxSmartModalService.getModalData(EditCarCategoryComponent.MODAL_NAME);
  }

  onClose() {
    this.changed.emit();
  }

  async createOrUpdate(item: CarCategory) {
    if (item.id) {
      await this.httpSrv.editCarCategory(item).toPromise();
    } else {
      await this.httpSrv.addCarCategory(item).toPromise();
    }

    this.ngxSmartModalService.toggle(EditCarCategoryComponent.MODAL_NAME);
  }

}
