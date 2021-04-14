import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { HttpService } from './http.service';
import { CarCategory } from '@models/CarCategory';
import { ToastrService } from 'ngx-toastr';
import { NgxSmartModalService } from 'ngx-smart-modal';
import { EditCarCategoryComponent } from './editor/edit.component';

@Component({
  selector: 'app-car-category',
  templateUrl: './car-category.component.html',
  styleUrls: ['../catalogs.component.css'],
})
export class CarCategoryComponent implements OnInit {
  nameSorting = 'none';
  categories: CarCategory[] = [];

  constructor(
    private httpSrv: HttpService,
    private toastr: ToastrService,
    public ngxSmartModalService: NgxSmartModalService,
    private title: Title
  ) {
    title.setTitle('Категории машин');
  }
  ngOnInit() {
    this.getData();
  }

  async getData() {
    this.nameSorting = 'none';
    this.httpSrv.getCarCategories().subscribe((x) => (this.categories = x));
  }

  add() {
    this.ngxSmartModalService.toggle(EditCarCategoryComponent.MODAL_NAME);
  }

  confirm(category: CarCategory) {
    this.ngxSmartModalService.setModalData(
      {
        title: 'Подтвердите действие',
        btnAction: () => this.delete(category),
        btnActionColor: 'red',
        btnActionName: 'Удалить категорию',
      },
      'confirmModal',
      true
    );
    this.ngxSmartModalService.toggle('confirmModal');
  }

  async delete(category: CarCategory) {
    await this.httpSrv.deleteCarCategory(category.id).toPromise();
    this.getData();
  }

  async edit(item: CarCategory) {
    this.ngxSmartModalService.setModalData(
      item,
      EditCarCategoryComponent.MODAL_NAME,
      true
    );
    this.ngxSmartModalService.toggle(EditCarCategoryComponent.MODAL_NAME);
  }

  private handleDetailedErr(mess: string) {
    this.toastr.error(mess);
  }

  private handleError() {
    this.toastr.error('При загрузке данных произошла ошибка');
  }

  sortedByName = () => {
    if (this.nameSorting === 'none' || this.nameSorting === 'reverse') {
      this.categories.sort((a, b) => {
        if (!a.name) {
          a.name = '';
        }
        if (!b.name) {
          b.name = '';
        }
        return a.name.localeCompare(b.name);
      });
      this.nameSorting = 'direct';
    } else if (this.nameSorting === 'direct') {
      this.categories.sort((a, b) => {
        if (!a.name) {
          a.name = '';
        }
        if (!b.name) {
          b.name = '';
        }
        return b.name.localeCompare(a.name);
      });
      this.nameSorting = 'reverse';
    }
  };
}
