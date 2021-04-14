import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { NgxSmartModalService } from 'ngx-smart-modal';
import { ToastrService } from 'ngx-toastr';
import { SupplierEditorComponent } from 'src/app/catalogs/suppliers/editor/editor.component';
import { CarEditorComponent } from 'src/app/catalogs/car/editor/editor.component';
import { HttpService as ReqService } from 'src/app/requests/http.service';
import { HttpService as SupplierHttp } from 'src/app/catalogs/suppliers/http.service';
import { HttpService as CarHttp } from 'src/app/catalogs/car/http.service';
import { Request } from '@models/Request';
import { Supplier } from '@models/Supplier';
import { Car } from '@models/Car';

@Component({
  selector: 'app-confirm-complete-req-modal-amount',
  templateUrl: './confirm-complete-req-modal.component.html',
  styleUrls: ['./confirm-complete-req-modal.component.css'],
})
export class ConfirmCompleteReqModalComponent implements OnInit {
  static readonly MODAL_NAME = 'confirmCompleteReqModal';

  @Output() changed = new EventEmitter<any>();

  constructor(
    private ngxSmartModalService: NgxSmartModalService,
    private reqService: ReqService,
    private toastr: ToastrService,
    private supplierHttp: SupplierHttp,
    private carHttp: CarHttp
  ) {}

  request: Request = new Request();
  cars: Car[] = [];
  suppliers: Supplier[] = [];
  isSupplierEmpty =  false;
  isCarOwnerEmpty = false;


  ngOnInit() {}

  async onOpen() {
    this.reset();
    const transferred = this.ngxSmartModalService.getModalData(
      ConfirmCompleteReqModalComponent.MODAL_NAME
    );
    if (transferred) {
      this.request = transferred;
      if (!this.request.supplier) {
        this.isSupplierEmpty = true;
        this.supplierHttp
        .getSuppliers()
        .toPromise()
        .then((x) => (this.suppliers = x))
      }
      if (!this.request.car) {
        this.isCarOwnerEmpty = true;
        this.carHttp
        .getCars()
        .toPromise()
        .then((x) => (this.cars = x))
      }
    }
  }

  reset() {
    this.request = new Request();
    this.isSupplierEmpty =  false;
    this.isCarOwnerEmpty = false;
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
    } 
    if (!this.request.supplier) {
      this.toastr.error('Выберите перевозчика');
    }
    if (!this.request.car) {
      this.toastr.error('Выберите поставщика');
    }
    if (this.request.amount && this.request.supplier && this.request.car){
      await this.reqService.edit(this.request).toPromise();
      if (this.request.id) {
        await this.reqService.setStatus(this.request.id, 2).toPromise();
      }
      this.ngxSmartModalService.close(
        ConfirmCompleteReqModalComponent.MODAL_NAME
      );
    }
  }
  addSupplier() {
    this.ngxSmartModalService
      .getModal(SupplierEditorComponent.MODAL_NAME)
      .open();
  }
  addCarOwner() {
    this.ngxSmartModalService.getModal(CarEditorComponent.MODAL_NAME).open();
  }
  onCarOwnerAdd(car: Car) {
    this.cars = [];
    this.carHttp.getCars().subscribe((x) => {
      this.cars = x;
      this.request.car = car;
    });
  }
  onSupplierAdd(supplier: Supplier) {
    this.supplierHttp.getSuppliers().subscribe((x) => {
      this.suppliers = x;
      this.request.supplier = supplier;
      if (supplier.products.length) {
        this.request.product = supplier.products[0];
      }
    });
  }
}
