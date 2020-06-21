import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Car } from '../../models/Car';
import { HttpService } from './http.service';
import { NgxSmartModalService } from 'ngx-smart-modal';
import { ToastrService } from 'ngx-toastr';
import { CarEditorComponent } from './editor/editor.component';

@Component({
  selector: 'app-car',
  templateUrl: './car.component.html',
  styleUrls: ['../catalogs.component.css', './car.component.css']
})
export class CarComponent implements OnInit {

  cars: Car[] = [];
  ownerCarSorting = 'none';
  categoryCarSorting = 'none';

  constructor(
    public http: HttpService,
    private toastr: ToastrService,
    public ngxSmartModalService: NgxSmartModalService,
    private title: Title) {
      title.setTitle('Перевозчики');
    }

  ngOnInit() {
    this.getData();
  }

  getData() {
    this.ownerCarSorting = 'none';
    this.categoryCarSorting = 'none';
    this.http.getCars().subscribe(
      m =>
        this.cars = m,
      e => {
        this.toastr.error(e.message);
      }
    );
  }

  add() {
    this.ngxSmartModalService.toggle(CarEditorComponent.MODAL_NAME);
  }

  async edit(item: Car) {
    this.ngxSmartModalService.setModalData(item, CarEditorComponent.MODAL_NAME, true);
    this.ngxSmartModalService.toggle(CarEditorComponent.MODAL_NAME);
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
    if (this.ownerCarSorting === 'none' || this.ownerCarSorting === 'reverse') {
      this.cars.sort((a, b) => {
        if (!a.owner) { a.owner = ''; }
        if (!b.owner) { b.owner = ''; }
        return a.owner.localeCompare(b.owner);
      });
      this.ownerCarSorting = 'direct';
    } else if (this.ownerCarSorting === 'direct') {
      this.cars.sort((a, b) => {
        if (!a.owner) { a.owner = ''; }
        if (!b.owner) { b.owner = ''; }
        return b.owner.localeCompare(a.owner);
      });
      this.ownerCarSorting = 'reverse';
    }
  }

}
