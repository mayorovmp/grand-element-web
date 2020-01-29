import { Component, OnInit } from '@angular/core';
import { HttpService } from './http.service';
import { CarCategory } from '../../models/CarCategory';
import { Envelope } from 'src/app/Envelope';
import { ToastrService } from 'ngx-toastr';
import { NgxSmartModalService } from 'ngx-smart-modal';
import { EditCarCategoryComponent } from './editor/edit.component';

@Component({
  selector: 'app-car-category',
  templateUrl: './car-category.component.html',
  styleUrls: ['./car-category.component.css']
})
export class CarCategoryComponent implements OnInit {

  constructor(private httpSrv: HttpService, private toastr: ToastrService, public ngxSmartModalService: NgxSmartModalService) { }
  categories: CarCategory[] = [];
  defaultCategory: CarCategory = new CarCategory();
  ngOnInit() {
    this.getData();
  }

  async getData() {
    this.httpSrv.getCarCategories().subscribe(x => this.categories = x.data);
  }

  async deleteCategory(category: CarCategory) {
    await this.httpSrv.deleteCarCategory(category.id).toPromise();
    this.getData();
  }

  private handleAddCategory(val: Envelope<CarCategory[]>) {
    if (!val.success) {
      this.handleDetailedErr(val.message);
      return;
    }
    // TODO: вернуть запрос новых данных this.getData();
  }

  async edit(item: CarCategory) {
    this.ngxSmartModalService.setModalData(item, EditCarCategoryComponent.MODAL_NAME, true);
    this.ngxSmartModalService.toggle(EditCarCategoryComponent.MODAL_NAME);
  }

  private handleDetailedErr(mess: string) {
    this.toastr.error(mess);
  }

  private handleError() {
    this.toastr.error('При загрузке данных произошла ошибка');
  }
}
