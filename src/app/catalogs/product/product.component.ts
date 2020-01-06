import { Component, OnInit } from '@angular/core';
import { Product } from 'src/app/models/Product';
import { HttpService } from './http.service';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})
export class ProductComponent implements OnInit {

  products: Product[] = [];
  constructor(private httpSrv: HttpService) { }

  async ngOnInit() {
    this.getData();
  }
  async getData() {
    this.httpSrv.getProducts().subscribe(e => { this.products = e.data; console.log(e); });
  }

}
