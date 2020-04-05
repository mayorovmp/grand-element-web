import { Component, OnInit } from '@angular/core';
import { Supplier } from '../../models/Supplier';
import { NgxSmartModalService } from 'ngx-smart-modal';
import { HttpService } from './http.service';
import { EditorComponent } from './editor/editor.component';

@Component({
  selector: 'app-suppliers',
  templateUrl: './suppliers.component.html',
  styleUrls: ['../catalogs.component.css', './suppliers.component.css']
})
export class SuppliersComponent implements OnInit {

  suppliers: Supplier[] = [];
  nameSorting: string = 'none';
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

  sortedByName = () => {
    if (this.nameSorting === 'none' || this.nameSorting === 'reverse'){
      this.suppliers.sort((a, b) => a.name.localeCompare(b.name));
      this.nameSorting = 'direct';
    } else if (this.nameSorting === 'direct'){
      this.suppliers.sort((a, b) => b.name.localeCompare(a.name));
      this.nameSorting = 'reverse';
    }
  }
}
