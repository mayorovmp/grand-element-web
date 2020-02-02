import { Component, OnInit } from '@angular/core';
import { Client } from '../models/Client';
import { Request } from '../models/Request';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from "rxjs/internal/operators";
import { OrderAddComponent } from './order-add/order-add.component';
import { NgxSmartModalService } from 'ngx-smart-modal';
import { HttpService } from './http.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.html',
  styleUrls: ['./styles.css']
})
export class OrdersComponent implements OnInit {
  pickedDay = new Date(Date.now());
  DateChanged: Subject<Date> = new Subject<Date>();

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


    this.DateChanged.pipe(debounceTime(1000), distinctUntilChanged())
      .subscribe(dt => {
        this.pickedDay = dt;
        this.getDataByDate(dt);
      });
  }

  onChangeDate($event: number) {
    this.DateChanged.next(new Date($event));
  }


  async getDataByDate(dt: Date) {
    this.http.getRequestsByDate(dt).subscribe(
      x => this.requests = x.data,
      e => this.toastr.error(e.message)
    );
  }

  async getData() {
    this.http.getRequests().subscribe(
      x => this.requests = x.data,
      e => this.toastr.error(e.message)
    );
  }

}
