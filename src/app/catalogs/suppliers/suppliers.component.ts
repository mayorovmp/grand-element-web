import { Component, OnInit } from '@angular/core';
import { Supplier } from '../models/Supplier';
import { NgxSmartModalService } from 'ngx-smart-modal';
import { AddSupplierComponent } from './add-supplier/add-supplier.component';

@Component({
  selector: 'app-suppliers',
  templateUrl: './suppliers.component.html',
  styleUrls: ['./suppliers.component.css']
})
export class SuppliersComponent implements OnInit {

  suppliers: Supplier[] = [
    { address: 'Ленина 48', name: 'Рога', legalEntity: 'ООО Рога и копыта', products: ['песок', 'щебень', 'камни'] },
    { address: 'Копейское шоссе 2', name: 'Топ1', legalEntity: 'ИП Банников', products: ['асбест', 'щебень', 'камни'] },
    { address: 'Энергетиков 418', name: 'Болид', legalEntity: 'ИП Прон', products: ['щебень', 'мрамор'] },
    { address: 'Шорса 48', name: 'ДВР', legalEntity: 'ЗАО ЭЛЕМЕНТ', products: ['гранит', 'известь'] },
    { address: 'Агалакова 38', name: 'НаноМир', legalEntity: 'ООО ЗХ и ХЗ', products: ['песок'] }];

  newSupplier: Supplier;

  constructor(public ngxSmartModalService: NgxSmartModalService) { }

  ngOnInit() {
  }

  add(supplier: Supplier) {
    this.ngxSmartModalService.toggle(AddSupplierComponent.MODAL_NAME);
  }
}
