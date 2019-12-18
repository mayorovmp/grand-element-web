import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { NgxSmartModalService } from 'ngx-smart-modal';
import { ClientAddComponent } from 'src/app/catalogs/clients/client-add/client-add.component';

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

  addClient() {
    this.ngxSmartModalService.getModal(ClientAddComponent.MODAL_NAME).open();

  }

  add() {
    this.changed.emit();
    this.ngxSmartModalService.getModal(OrderAddComponent.MODAL_NAME).close();
  }

}
