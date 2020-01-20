import { Component, OnInit } from '@angular/core';
import { Supplier } from '../../models/Supplier';
import { NgxSmartModalService } from 'ngx-smart-modal';
import { AddSupplierComponent } from './add-supplier/add-supplier.component';
import { HttpService } from './http.service';

@Component({
  selector: 'app-suppliers',
  templateUrl: './suppliers.component.html',
  styleUrls: ['./suppliers.component.css']
})
export class SuppliersComponent implements OnInit {

  suppliers: Supplier[] = [];

  newSupplier: Supplier;

  constructor(public ngxSmartModalService: NgxSmartModalService, private httpSrv: HttpService) { }

  ngOnInit() {
    this.getData();
  }

  add() {
  }

  async getData() {
    this.suppliers = (await this.httpSrv.getSuppliers().toPromise()).data;
  }

  async deleteSupplier(id: number) {
    await this.httpSrv.deleteSupplier(id).toPromise();
    this.getData();
  }
}
