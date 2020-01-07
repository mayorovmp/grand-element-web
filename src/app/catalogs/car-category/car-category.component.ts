import { Component, OnInit } from '@angular/core';
import { HttpService } from './http.service';
import { CarCategory } from '../../models/CarCategory';
import { Envelope } from 'src/app/Envelope';
import { ToastrService } from 'ngx-toastr';
import { NgxSmartModalService } from 'ngx-smart-modal';
import { CarCategoryAddComponent } from './add/add.component';

@Component({
  selector: 'app-car-category',
  templateUrl: './car-category.component.html',
  styleUrls: ['./car-category.component.css']
})
export class CarCategoryComponent implements OnInit {

  constructor(private httpSrv: HttpService, private toastr: ToastrService, public ngxSmartModalService: NgxSmartModalService) { }
  categories: CarCategory[] = [];
  newCategory = '';
  ngOnInit() {
    this.getData();
  }

  async getData() {
    this.httpSrv.getCarCategories().subscribe(x => this.categories = x.data);
  }

  test() {
    this.httpSrv.test().subscribe(x => console.log(x));
  }

  async deleteCategory(category: CarCategory) {
    await this.httpSrv.deleteCarCategory(category.id).toPromise();
    this.getData();
  }

  addCarCategory(category: string) {
    this.ngxSmartModalService.getModal(CarCategoryAddComponent.MODAL_NAME).open();
    // this.categories.push(new CarCategory(1, category));
    // this.httpSrv.addCarCategory(category).toPromise().then(
    //   (env) => this.handleAddCategory(env)
    // ).catch(_ => this.handleError());
  }

  private handleAddCategory(val: Envelope<CarCategory[]>) {
    if (!val.success) {
      this.handleDetailedErr(val.message);
      return;
    }
    // TODO: вернуть запрос новых данных this.getData();
  }

  private handleDetailedErr(mess: string) {
    this.toastr.error(mess);
  }

  private handleError() {
    this.toastr.error('При загрузке данных произошла ошибка');
  }
}
