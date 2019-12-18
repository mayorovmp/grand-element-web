import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { NgxSmartModalService } from 'ngx-smart-modal';

@Component({
  selector: 'app-client-add',
  templateUrl: './client-add.component.html',
  styleUrls: ['./client-add.component.css']
})
export class ClientAddComponent implements OnInit {

  static MODAL_NAME = 'clientAddModal';

  constructor(public ngxSmartModalService: NgxSmartModalService) { }

  @Output() changed = new EventEmitter<any>();

  ngOnInit() {
  }

  onOpen() {

  }

  addClient() {
    this.changed.emit();
    this.ngxSmartModalService.getModal(ClientAddComponent.MODAL_NAME).close();
  }

}
