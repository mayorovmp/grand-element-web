import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { NgxSmartModalService } from 'ngx-smart-modal';

@Component({
  selector: 'app-modal-confirm',
  templateUrl: './confirm.component.html',
  styleUrls: ['./confirm.component.css']
})
export class ConfirmModalComponent implements OnInit {

  @Output() changed = new EventEmitter<any>();

  modalTitle = 'Подтвердить действие';
  modalActionTitle = 'подтвердить';
  modalBtnActionColor = 'gray';

  constructor( private ngxSmartModalService: NgxSmartModalService) { }

  ngOnInit() { }

  async onOpen() {
    const transferred = this.ngxSmartModalService.getModalData('confirmModal');
    if (transferred) {
      const { title, btnActionName, btnActionColor } = transferred;
      this.modalTitle = title;
      this.modalActionTitle = btnActionName;
      this.modalBtnActionColor = btnActionColor;
    }
  }
  onClose() {
    this.ngxSmartModalService.close('confirmModal');
  }

  modalAction() {
    const transferred = this.ngxSmartModalService.getModalData('confirmModal');
    if (transferred) {
      const { btnAction } = transferred;
      btnAction();
      this.changed.emit();
      this.onClose();
    }
  }
}
