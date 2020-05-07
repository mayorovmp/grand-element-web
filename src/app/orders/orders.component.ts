import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Client } from '../models/Client';
import { Request } from '../models/Request';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/internal/operators';
import { OrderAddComponent } from './order-add/order-add.component';
import { NgxSmartModalService } from 'ngx-smart-modal';
import { HttpService } from './http.service';
import { ToastrService } from 'ngx-toastr';
import { NONE_TYPE } from '@angular/compiler/src/output/output_ast';

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

  hidingColumns: string[] = [];

  hidingColumnsLongTerm: string[] = [];

  sortingValue: {
    column: string
    type: string,
  } = {
    column: 'none',
    type: 'none',
  };

  sortingValueLongTerm: {
    column: string
    type: string,
  } = {
    column: 'none',
    type: 'none',
  };

  constructor(
    public http: HttpService,
    private toastr: ToastrService,
    public ngxSmartModalService: NgxSmartModalService,
    private title: Title) {
      title.setTitle('Заказы');
  }
  getRand(): number {
    return Math.floor((Math.random() * 3)) + 0;
  }

  add(dt: Date) {
    this.ngxSmartModalService.setModalData({type: 'add', date: dt}, OrderAddComponent.MODAL_NAME, true);
    this.ngxSmartModalService.getModal(OrderAddComponent.MODAL_NAME).open();
  }
  edit(request: Request) {
    this.ngxSmartModalService.setModalData({type: 'edit', request}, OrderAddComponent.MODAL_NAME, true);
    this.ngxSmartModalService.toggle(OrderAddComponent.MODAL_NAME);
  }
  addShortRequest(dt: Date, parentId: number) {
    this.ngxSmartModalService.setModalData({type: 'addShortReq', date: dt, parentId}, OrderAddComponent.MODAL_NAME, true);
    this.ngxSmartModalService.getModal(OrderAddComponent.MODAL_NAME).open();
  }
  sortingLongTerm(sortingCol: string, nested: number) {
    const alphabeticalCols = [
      'status',
      'client.name',
      'deliveryAddress.name',
      'product.name',
      'supplier.name',
      'car.owner',
      'carCategory.name',
      'comment',
      'unit'
    ];
    const numeralCols = [
      'amount',
      'purchasePrice',
      'freightPrice',
      'amountIn',
      'amountOut',
      'sellingPrice',
      'profit',
      'reward'
    ];
    const dateCols = [
      'deliveryStart',
      'deliveryEnd'
    ];
    if (this.sortingValueLongTerm.column !== sortingCol) {
      this.sortingValueLongTerm.column = sortingCol;
      this.sortingValueLongTerm.type = 'direct';
    } else {
      if (this.sortingValueLongTerm.type === 'direct') {
        this.sortingValueLongTerm.type = 'reverse';
      } else {
        this.sortingValueLongTerm.type = 'direct';
      }
    }
    if (alphabeticalCols.includes(sortingCol)) {
        this.longRequests.sort((a, b) => {
          let aValue = a[sortingCol];
          let bValue = b[sortingCol];
          if (nested === 1) {
            const splitedCol = sortingCol.split('.');
            aValue = a[splitedCol[0]];
            bValue = b[splitedCol[0]];
            aValue = aValue[splitedCol[1]];
            bValue = bValue[splitedCol[1]];
          }
          if (!aValue) { aValue = ''; }
          if (!bValue ) { bValue  = ''; }
          if (this.sortingValueLongTerm.type === 'direct') {
            return aValue.localeCompare(bValue);
          } else if (this.sortingValueLongTerm.type === 'reverse') {
            return bValue.localeCompare(aValue);
          }
        });
    }

    if (numeralCols.includes(sortingCol)) {
      this.longRequests.sort((a, b): any => {
        let aValue = a[sortingCol];
        let bValue = b[sortingCol];
        if (nested === 1) {
          const splitedCol = sortingCol.split('.');
          aValue = a[splitedCol[0]];
          bValue = b[splitedCol[0]];
          aValue = aValue[splitedCol[1]];
          bValue = bValue[splitedCol[1]];
        }
        if (!aValue) { aValue = 0; }
        if (!bValue ) { bValue  = 0; }
        if (this.sortingValueLongTerm.type === 'direct') {
          return aValue - bValue;
        } else if (this.sortingValueLongTerm.type === 'reverse') {
          return bValue - aValue;
        }
      });
    }
    if (dateCols.includes(sortingCol)) {
      this.longRequests.sort((a, b): any => {
        let aValue = 0;
        let bValue = 0;
        if (a[sortingCol]) { aValue = Date.parse(a[sortingCol]); }
        if (b[sortingCol]) { bValue  = Date.parse(b[sortingCol]); }

        if (this.sortingValueLongTerm.type === 'direct') {
          return aValue - bValue;
        } else if (this.sortingValueLongTerm.type === 'reverse') {
          return bValue - aValue;
        }
      });
    }
    if (sortingCol === 'progress') {
      this.longRequests.sort((a, b): any => {
        let aValue = 0;
        let bValue = 0;
        if (a.amountComplete && a.amount) { aValue = a.amountComplete / a.amount; }
        if (b.amountComplete && b.amount) { bValue  = b.amountComplete / b.amount; }

        if (this.sortingValueLongTerm.type === 'direct') {
          return aValue - bValue;
        } else if (this.sortingValueLongTerm.type === 'reverse') {
          return bValue - aValue;
        }
      });
    }
  }
  sorting(sortingCol: string, nested: number) {
    const alphabeticalCols = [
      'status',
      'client.name',
      'deliveryAddress.name',
      'product.name',
      'supplier.name',
      'car.owner',
      'carCategory.name',
      'comment',
      'unit'
    ];
    const numeralCols = [
      'amount',
      'purchasePrice',
      'freightPrice',
      'amountIn',
      'amountOut',
      'sellingPrice',
      'reward',
      'sellingCost',
      'freightCost',
      'profit'
    ];
    if (this.sortingValue.column !== sortingCol) {
      this.sortingValue.column = sortingCol;
      this.sortingValue.type = 'direct';
    } else {
      if (this.sortingValue.type === 'direct') {
        this.sortingValue.type = 'reverse';
      } else {
        this.sortingValue.type = 'direct';
      }
    }
    if (alphabeticalCols.includes(sortingCol)) {
      this.requests.sort((a, b) => {
        let aValue = a[sortingCol];
        let bValue = b[sortingCol];
        if (nested === 1) {
          const splitedCol = sortingCol.split('.');
          aValue = a[splitedCol[0]];
          bValue = b[splitedCol[0]];
          aValue = aValue[splitedCol[1]];
          bValue = bValue[splitedCol[1]];
        }
        if (!aValue) { aValue = ''; }
        if (!bValue ) { bValue  = ''; }
        if (this.sortingValue.type === 'direct') {
          return aValue.localeCompare(bValue);
        } else if (this.sortingValue.type === 'reverse') {
          return bValue.localeCompare(aValue);
        }
      });
    }

    if (numeralCols.includes(sortingCol)) {
      this.requests.sort((a, b): any => {
        let aValue = a[sortingCol];
        let bValue = b[sortingCol];
        if (nested === 1) {
          const splitedCol = sortingCol.split('.');
          aValue = a[splitedCol[0]];
          bValue = b[splitedCol[0]];
          aValue = aValue[splitedCol[1]];
          bValue = bValue[splitedCol[1]];
        }
        if (!aValue) { aValue = 0; }
        if (!bValue ) { bValue  = 0; }
        if (this.sortingValue.type === 'direct') {
          return aValue - bValue;
        } else if (this.sortingValue.type === 'reverse') {
          return bValue - aValue;
        }
      });
    }
  }
  ngOnInit() {
    this.getData(this.pickedDay);


    this.DateChanged.pipe(debounceTime(1000), distinctUntilChanged())
      .subscribe(dt => {
        this.pickedDay = dt;
        this.getData(dt);
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

  async finishRequest(orderId: number) {
    await this.http.finishRequest(orderId).toPromise();
    this.getData(this.pickedDay);
  }
  onChangeDate($event: number) {
    this.curDate = new Date($event);
    this.DateChanged.next(this.curDate);
  }

  confirm(req: Request) {
    this.ngxSmartModalService.setModalData(
      {
        title: 'Подтвердите действие',
        btnAction: () => this.del(req),
        btnActionColor: 'red',
        btnActionName: 'Удалить заказ'
      },
      'confirmModal',
      true
    );
    this.ngxSmartModalService.toggle('confirmModal');
  }

  async del(req: Request) {
    await this.http.del(req).toPromise();
    this.getData(this.pickedDay);
  }

  async getData(dt: Date) {
    this.http.getRequestsByDate(dt).subscribe(
      allRequests => {
        console.log('allRequests', allRequests);
        this.requests = allRequests.filter(req => !req.isLong);
        this.longRequests = allRequests.filter(req => req.isLong);
      },
      error => this.toastr.error(error.message)
    );

  }

  hideColumn(column: string) {
    this.hidingColumns.push(column);
  }

  showColumn(column: string) {
    this.hidingColumns = this.hidingColumns.filter(item => item !== column);
  }

  showAllColumns() {
    this.hidingColumns = [];
  }

  hideColumnLongTerm(column: string) {
    this.hidingColumnsLongTerm.push(column);
  }

  showColumnLongTerm(column: string) {
    this.hidingColumnsLongTerm = this.hidingColumnsLongTerm.filter(item => item !== column);
  }

  showAllColumnsLongTerm() {
    this.hidingColumnsLongTerm = [];
  }
}
