import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { HttpService } from 'src/app/catalogs/product/http.service';
import { NgxSmartModalService } from 'ngx-smart-modal';

@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.css']
})
export class AddProductComponent implements OnInit {

  static MODAL_NAME = 'addProductModal';
  newProductName = '';
  @Output() changed = new EventEmitter<any>();

  constructor(private httpSrv: HttpService, private ngxSmartModalService: NgxSmartModalService) { }

  ngOnInit() {
  }

  async addProduct(newName: string) {
    let res = await this.httpSrv.addProduct(newName).toPromise();
    newName = '';
    this.changed.emit();
    this.ngxSmartModalService.toggle(AddProductComponent.MODAL_NAME);
  }

  onOpen() {
    this.newProductName = '';
  }

}
