import { Component, OnInit } from '@angular/core';
import { Supplier } from '../../models/Supplier';
import { NgxSmartModalService } from 'ngx-smart-modal';
import { HttpService } from './http.service';
import { EditorComponent } from './editor/editor.component';

@Component({
  selector: 'app-suppliers',
  templateUrl: './suppliers.component.html',
  styleUrls: ['./suppliers.component.css']
})
export class SuppliersComponent implements OnInit {

  suppliers: Supplier[] = [];

  constructor(public ngxSmartModalService: NgxSmartModalService, private httpSrv: HttpService) { }

  ngOnInit() {
    this.getData();
  }

  add() {
    this.ngxSmartModalService.toggle(EditorComponent.MODAL_NAME);
  }

  async getData() {
    this.suppliers = await this.httpSrv.getSuppliers().toPromise();
  }

  edit(supplier: Supplier) {
    this.ngxSmartModalService.setModalData(supplier, EditorComponent.MODAL_NAME, true);
    this.ngxSmartModalService.toggle(EditorComponent.MODAL_NAME);
  }

  async deleteSupplier(id: number) {
    await this.httpSrv.deleteSupplier(id).toPromise();
    this.getData();
  }
}
