import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { NgxSmartModalService } from 'ngx-smart-modal';

@Component({
  selector: 'app-modal-amount',
  templateUrl: './amountModal.component.html',
  styleUrls: ['./amountModal.component.css']
})
export class AmountModalComponent implements OnInit {

  @Output() changed = new EventEmitter<any>();

  modalTitle = 'Подтвердить действие';
  modalActionTitle = 'подтвердить';
  modalBtnActionColor = 'gray';
  modalAction: any = null;

  constructor( private ngxSmartModalService: NgxSmartModalService) { }

  ngOnInit() { }

  async onOpen() {
    const transferred = this.ngxSmartModalService.getModalData('confirmModal');
    if (transferred) {
      const { title, btnAction, btnActionName, btnActionColor } = transferred;
      this.modalTitle = title;
      this.modalAction = () => {
        btnAction();
        this.onClose();
      };
      this.modalActionTitle = btnActionName;
      this.modalBtnActionColor = btnActionColor;
    }
  }
  onClose() {
    this.changed.emit();
    this.ngxSmartModalService.close('confirmModal');
  }
}
