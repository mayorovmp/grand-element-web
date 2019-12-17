import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { NgxSmartModalService } from 'ngx-smart-modal';

@Component({
  selector: 'app-car-category-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.css']
})
export class CarCategoryAddComponent implements OnInit {
  static MODAL_NAME = 'carCategoryAddModal';

  constructor(public ngxSmartModalService: NgxSmartModalService) { }

  @Output() changed = new EventEmitter<any>();

  ngOnInit() {
  }

  add() {
    this.changed.emit();
    this.ngxSmartModalService.getModal(CarCategoryAddComponent.MODAL_NAME).close();
  }

  onOpen(): void {
  }

}
