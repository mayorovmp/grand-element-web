import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { NgxSmartModalService } from 'ngx-smart-modal';
import { Request } from '@models/Request';
import { Car } from '@models/Car';
import { HttpService as CarHttp } from 'src/app/catalogs/car/http.service';
import { HttpService as ReqService } from 'src/app/requests/http.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-confirm-complete-req-modal-amount',
  templateUrl: './confirm-complete-req-modal.component.html',
  styleUrls: ['./confirm-complete-req-modal.component.css'],
})
export class ConfirmCompleteReqModalComponent implements OnInit {
  static readonly MODAL_NAME = 'confirmCompleteReqModal';

  @Output() changed = new EventEmitter<any>();

  request: Request = new Request();
  constructor(
    private ngxSmartModalService: NgxSmartModalService,
    private reqService: ReqService,
    private toastr: ToastrService
  ) {}

  ngOnInit() {}

  async onOpen() {
    this.reset();
    const transferred = this.ngxSmartModalService.getModalData(
      ConfirmCompleteReqModalComponent.MODAL_NAME
    );
    if (transferred) {
      this.request = transferred;
    }
  }
  reset() {
    this.request = new Request();
  }
  onClose() {
    this.changed.emit();
  }
  close() {
    this.ngxSmartModalService.toggle(
      ConfirmCompleteReqModalComponent.MODAL_NAME
    );
  }
  async apply() {
    if (!this.request.amount) {
      this.toastr.error('Заполните объем');
    } else {
      await this.reqService.edit(this.request).toPromise();
      if (this.request.id) {
        await this.reqService.setStatus(this.request.id, 2).toPromise();
      }
      this.ngxSmartModalService.close(
        ConfirmCompleteReqModalComponent.MODAL_NAME
      );
    }
  }
}
