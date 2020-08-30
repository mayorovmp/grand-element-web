import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { NgxSmartModalService } from 'ngx-smart-modal';
import { Request } from 'src/app/models/Request';
import { HttpService as ReqService } from 'src/app/requests/http.service';

@Component({
  selector: 'app-modal-finis-req',
  templateUrl: './finishReq.component.html',
  styleUrls: ['./finishReq.component.css']
})
export class FinishReqModalComponent implements OnInit {

  @Output() changed = new EventEmitter<any>();

  modalTitle = 'Подтвердить действие';
  modalActionTitle = 'подтвердить';
  modalBtnActionColor = 'gray';
  request: Request = new Request();

  constructor(
    private ngxSmartModalService: NgxSmartModalService,
    private reqService: ReqService
  ) { }

  ngOnInit() { }

  async onOpen() {
    const transferred = this.ngxSmartModalService.getModalData('finishReqModal');
    if (transferred) {
      const { title, btnActionName, btnActionColor, request } = transferred;
      this.modalTitle = title;
      this.modalActionTitle = btnActionName;
      this.modalBtnActionColor = btnActionColor;
      this.request = request;
    }
  }
  onClose() {
    this.changed.emit();
    this.ngxSmartModalService.close('finishReqModal');
  }

  async modalAction() {
    const transferred = this.ngxSmartModalService.getModalData('finishReqModal');
    if (transferred) {
      const { btnAction } = transferred;
      if (this.request.car) {
        this.request.carId = this.request.car.id;
      }
      if (this.request.product) {
        this.request.productId = this.request.product.id;
      }
      if (this.request.deliveryAddress) {
        this.request.deliveryAddressId = this.request.deliveryAddress.id;
      }
      if (this.request.client) {
        this.request.clientId = this.request.client.id;
      }
      if (this.request.carCategory) {
        this.request.carCategoryId = this.request.carCategory.id;
      }
      if (this.request.supplier) {
        this.request.supplierId = this.request.supplier.id;
      }
      await this.reqService.edit(this.request).toPromise();
      btnAction();
      this.changed.emit();
      this.onClose();
    }
  }
}
