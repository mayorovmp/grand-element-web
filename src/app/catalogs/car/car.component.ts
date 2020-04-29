import { Component, OnInit } from '@angular/core';
import { Title } from "@angular/platform-browser";
import { Car } from '../../models/Car';
import { HttpService } from './http.service';
import { NgxSmartModalService } from 'ngx-smart-modal';
import { ToastrService } from 'ngx-toastr';
import { EditorComponent } from './editor/editor.component';

@Component({
  selector: 'app-car',
  templateUrl: './car.component.html',
  styleUrls: ['../catalogs.component.css', './car.component.css']
})
export class CarComponent implements OnInit {

  cars: Car[] = [];
  ownerCarSorting: string = 'none';
  categoryCarSorting: string = 'none';
  priceSorting: string = 'none';

  constructor(
    public http: HttpService, 
    private toastr: ToastrService, 
    public ngxSmartModalService: NgxSmartModalService,
    private title: Title) { 
      title.setTitle("Перевозчики");
    }

  ngOnInit() {
    this.getData();
  }

  getData() {
    this.ownerCarSorting = 'none';
    this.categoryCarSorting = 'none';
    this.priceSorting = 'none';
    this.http.getCars().subscribe(
      m =>
        this.cars = m,
      e => {
        this.toastr.error(e.message);
      }
    );
  }

  add() {
    this.ngxSmartModalService.toggle(EditorComponent.MODAL_NAME);
  }

  async edit(item: Car) {
    this.ngxSmartModalService.setModalData(item, EditorComponent.MODAL_NAME, true);
    this.ngxSmartModalService.toggle(EditorComponent.MODAL_NAME);
  }

  confirm(item: Car) {
    this.ngxSmartModalService.setModalData(
      {
        title: 'Подтвердите действие',
        btnAction: () => this.delete(item),
        btnActionColor: 'red',
        btnActionName: 'Удалить перевозчика'
      }, 
      'confirmModal', 
      true
    );
    this.ngxSmartModalService.toggle('confirmModal');
  }

  delete(item: Car) {
    if (item.id) {
      this.http.delete(item.id).subscribe(
        _ => this.toastr.info('Успешно удалено'),
        e => this.toastr.error('При удалении произошла ошибка'),
        () => this.getData());
    }
  }

  onAdd() {
    this.getData();
  }

  sortedByOwnerName = () => {
    this.priceSorting = 'none';
    if (this.ownerCarSorting === 'none' || this.ownerCarSorting === 'reverse'){
      this.cars.sort((a, b) => {
        if (!a.owner) { a.owner = ''}
        if (!b.owner) { b.owner = ''}
        return a.owner.localeCompare(b.owner);
      });
      this.ownerCarSorting = 'direct';
    } else if (this.ownerCarSorting === 'direct'){
      this.cars.sort((a, b) => {
        if (!a.owner) { a.owner = ''}
        if (!b.owner) { b.owner = ''}
        return b.owner.localeCompare(a.owner);
      });
      this.ownerCarSorting = 'reverse';
    }
  }

  sortedByPrice = () => {
    this.ownerCarSorting = 'none';
    if (this.priceSorting === 'none' || this.priceSorting === 'reverse'){
      this.cars.sort((a, b) => {
        if (!a.freightPrice) { a.freightPrice = 0}
        if (!b.freightPrice) { b.freightPrice = 0}
        return a.freightPrice - b.freightPrice
      });
      this.priceSorting = 'direct';
    } else if (this.priceSorting === 'direct'){
      this.cars.sort((a, b) => {
        if (!a.freightPrice) { a.freightPrice = 0}
        if (!b.freightPrice) { b.freightPrice = 0}
        return b.freightPrice - a.freightPrice
      });
      this.priceSorting = 'reverse';
    }
  }

}
