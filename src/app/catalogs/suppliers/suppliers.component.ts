import { Component, OnInit } from '@angular/core';
import { Title } from "@angular/platform-browser";
import { Supplier } from '../../models/Supplier';
import { NgxSmartModalService } from 'ngx-smart-modal';
import { HttpService } from './http.service';
import { EditorComponent } from './editor/editor.component';
import { ConfirmModalComponent } from '../../common/confirm-modal/confirm.component'

@Component({
  selector: 'app-suppliers',
  templateUrl: './suppliers.component.html',
  styleUrls: ['../catalogs.component.css', './suppliers.component.css']
})
export class SuppliersComponent implements OnInit {

  suppliers: Supplier[] = [];
  nameSorting: string = 'none';
  legalEntitySorting: string = 'none';
  addressSorting: string = 'none';
  constructor(
    public ngxSmartModalService: NgxSmartModalService, 
    private httpSrv: HttpService,
    private title: Title) {
      title.setTitle("Поставщики");
  }

  ngOnInit() {
    this.getData();
  }

  add() {
    this.ngxSmartModalService.toggle(EditorComponent.MODAL_NAME);
  }

  confirm(id: number) {
    this.ngxSmartModalService.setModalData(
      {
        title: 'Подтвердите действие',
        btnAction: () => this.deleteSupplier(id),
        btnActionColor: 'red',
        btnActionName: 'Удалить'
      }, 
      'confirmModal', 
      true
    );
    this.ngxSmartModalService.toggle('confirmModal');
  }

  async getData() {
    this.nameSorting = 'none';
    this.legalEntitySorting = 'none';
    this.addressSorting = 'none';
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
    this.legalEntitySorting = 'none';
    this.addressSorting = 'none';
    if (this.nameSorting === 'none' || this.nameSorting === 'reverse'){
      this.suppliers.sort((a, b) => {
        if (!a.name) { a.name = ''}
        if (!b.name) { b.name = ''}
        return a.name.localeCompare(b.name);
      });
      this.nameSorting = 'direct';
    } else if (this.nameSorting === 'direct'){
      this.suppliers.sort((a, b) => {
        if (!a.name) { a.name = ''}
        if (!b.name) { b.name = ''}
        return b.name.localeCompare(a.name);
      });
      this.nameSorting = 'reverse';
    }
  }

  sortedBylegalEntity = () => {
    this.nameSorting = 'none';
    this.addressSorting = 'none';
    if (this.legalEntitySorting === 'none' || this.legalEntitySorting === 'reverse'){
      this.suppliers.sort((a, b) => {
        if (!a.legalEntity) { a.legalEntity = ''}
        if (!b.legalEntity) { b.legalEntity = ''}
        return a.legalEntity.localeCompare(b.legalEntity);
      });
      this.legalEntitySorting = 'direct';
    } else if (this.legalEntitySorting === 'direct'){
      this.suppliers.sort((a, b) => {
        if (!a.legalEntity) { a.legalEntity = ''}
        if (!b.legalEntity) { b.legalEntity = ''}
        return b.legalEntity.localeCompare(a.legalEntity);
      });
      this.legalEntitySorting = 'reverse';
    }
  }

  sortedByAddress = () => {
    this.nameSorting = 'none';
    this.legalEntitySorting = 'none';
    if (this.addressSorting === 'none' || this.addressSorting === 'reverse'){
      this.suppliers.sort((a, b) => {
        if (!a.address) { a.address = ''}
        if (!b.address) { b.address = ''}
        return a.address.localeCompare(b.address);
      });
      this.addressSorting = 'direct';
    } else if (this.addressSorting === 'direct'){
      this.suppliers.sort((a, b) => {
        if (!a.address) { a.address = ''}
        if (!b.address) { b.address = ''}
        return b.address.localeCompare(a.address);
      });
      this.addressSorting = 'reverse';
    }
  }

}
