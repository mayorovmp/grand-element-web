import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { NgxSmartModalService } from 'ngx-smart-modal';
import { CarCategoryAddComponent } from '../../car-category/add/add.component';

@Component({
  selector: 'app-catalogs-car-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.css']
})
export class CarAddComponent implements OnInit {
  static MODAL_NAME = 'carAddModal';

  @Output() changed = new EventEmitter<any>();

  constructor(private toastr: ToastrService, public ngxSmartModalService: NgxSmartModalService) { }

  ngOnInit() {
  }

  onOpen() {

  }

  addCategory() {
    this.ngxSmartModalService.getModal(CarCategoryAddComponent.MODAL_NAME).open();
  }

}
