import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { NgxSmartModalService } from 'ngx-smart-modal';

@Component({
  selector: 'app-order-add',
  templateUrl: './order-add.component.html',
  styleUrls: ['./order-add.component.css']
})
export class OrderAddComponent implements OnInit {
  static MODAL_NAME = 'orderAddModal';

  constructor(public ngxSmartModalService: NgxSmartModalService) { }

  @Output() changed = new EventEmitter<any>();

  ngOnInit() {
  }

  onOpen() {

  }

  add() {
    this.changed.emit();
    this.ngxSmartModalService.getModal(OrderAddComponent.MODAL_NAME).close();
  }

}
