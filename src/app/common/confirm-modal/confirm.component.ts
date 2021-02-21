import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { NgxSmartModalService } from 'ngx-smart-modal';

@Component({
  selector: 'app-modal-confirm',
  templateUrl: './confirm.component.html',
  styleUrls: ['./confirm.component.css'],
})
export class ConfirmModalComponent implements OnInit {
  @Output() changed = new EventEmitter<any>();

  modalTitle = 'Подтвердить действие';
  modalActionTitle = 'подтвердить';
  modalBtnActionColor = 'gray';
  modalAction: any = null;

  constructor(private ngxSmartModalService: NgxSmartModalService) {}

  ngOnInit() {}

  async onOpen() {
    const transferred = this.ngxSmartModalService.getModalData('confirmModal');
    if (transferred) {
      const { title, btnAction, btnActionName, btnActionColor } = transferred;
      this.modalTitle = title;
      this.modalAction = async () => {
        await btnAction();
        this.close();
      };
      this.modalActionTitle = btnActionName;
      this.modalBtnActionColor = btnActionColor;
    }
  }
  close() {
    this.ngxSmartModalService.close('confirmModal');
  }
  onClose() {
    this.changed.emit();
  }
}
