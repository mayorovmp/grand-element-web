import { Component, OnInit } from '@angular/core';
import { Client } from '../models/Client';
import { Request } from '../models/Request';
import { Car } from '../models/Car';
import { OrderAddComponent } from './order-add/order-add.component';
import { NgxSmartModalService } from 'ngx-smart-modal';
import { HttpService } from './http.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css']
})
export class OrdersComponent implements OnInit {
  today = Date.now();

  requests: Request[] = [];

  longRequests: Request[] = [];

  getRand(): number {
    return Math.floor((Math.random() * 3)) + 0;
  }
  constructor(public http: HttpService, private toastr: ToastrService, public ngxSmartModalService: NgxSmartModalService) { }

  add() {
    this.ngxSmartModalService.getModal(OrderAddComponent.MODAL_NAME).open();
  }

  ngOnInit() {
    this.getData();
  }
  async getData() {
    this.http.getRequests().subscribe(
      x => this.requests = x.data,
      e => this.toastr.error(e.message)
    );
  }

}
