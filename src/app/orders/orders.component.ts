import { Component, OnInit } from '@angular/core';
import { Client } from '../models/Client';
import { Request } from '../models/Request';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/internal/operators';
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
  pickedDay = new Date(Date.now());
  DateChanged: Subject<Date> = new Subject<Date>();

  requests: Request[] = [];

  longRequests: Request[] = [];

  curDate = new Date();

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

  DownloadFile(dt: Date): void {
    this.http.getFile(dt)
      .subscribe(
        fileData => {
          const downloadURL = window.URL.createObjectURL(fileData.body);
          const link = document.createElement('a');
          link.href = downloadURL;
          link.download = `${dt.toDateString()}.xlsx`;
          link.click();
        }
      );
  }

  onChangeDate($event: number) {
    this.curDate = new Date($event);
    this.DateChanged.next(this.curDate);
  }


  async getDataByDate(dt: Date) {
    this.http.getRequestsByDate(dt).subscribe(
      x => this.requests = x,
      e => this.toastr.error(e.message)
    );
  }

  async del(req: Request) {
    await this.http.del(req).toPromise();
    this.getData();
  }

  async getData() {
    this.http.getRequests().subscribe(
      x => { this.requests = x.filter(r => !r.isLong); this.longRequests = x.filter(r => r.isLong); },
      e => this.toastr.error(e.message)
    );
  }

}
