import {
  Component,
  OnInit,
  ViewChild,
  TemplateRef,
  ViewContainerRef
} from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Request } from '../models/Request';
import { Status } from '../models/Status';
import { alphaBeticalSorting, numeralSorting } from '../helpers/sortingHelper';
import { alphabeticalCols, numeralCols } from '../helpers/consts';
import {
  Subject,
  fromEvent,
  Subscription
} from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/internal/operators';
import { NgxSmartModalService } from 'ngx-smart-modal';
import { HttpService } from './http.service';
import { ToastrService } from 'ngx-toastr';
import { RequestEditorComponent } from './editor/request-editor.component';
import { Goal } from './editor/Goal';
import { TemplatePortal } from '@angular/cdk/portal';
import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { take, filter } from 'rxjs/operators';

@Component({
  selector: 'app-requests',
  templateUrl: './requests.component.html',
  styleUrls: ['./requests.component.css']
})
export class RequestsComponent implements OnInit {
  pickedDay = new Date(Date.now());

  actualRequests: Request[] = [];
  completedRequests: Request[] = [];
  incidentRequests: Request[] = [];
  longTermRequests: Request[] = [];
  statuses: Status[] = [];
  datePeriods: any[] = [];

  sub: Subscription;
  @ViewChild('reqMenu') reqMenu: TemplateRef<any>;
  overlayRef: OverlayRef | null;

  curDate = new Date();
  nextDay = new Date();

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

  dateArray: any[] = [];

  complitedRequestslimit = 20;
  complitedRequestsOffset = 0;

  actualRequestslimit = 15;
  actualRequestsOffset = 0;

  throttle = 300;
  scrollDistance = 0.1;

  constructor(
    public http: HttpService,
    private toastr: ToastrService,
    public ngxSmartModalService: NgxSmartModalService,
    private title: Title,
    public overlay: Overlay,
    public viewContainerRef: ViewContainerRef
    ) {
    title.setTitle('Заказы');
  }

  add() {
    this.ngxSmartModalService.setModalData({ type: Goal.Add }, RequestEditorComponent.MODAL_NAME, true);
    this.ngxSmartModalService.getModal(RequestEditorComponent.MODAL_NAME).open();
  }
  edit(request: Request) {
    this.ngxSmartModalService.setModalData({ type: Goal.Edit, request }, RequestEditorComponent.MODAL_NAME, true);
    this.ngxSmartModalService.toggle(RequestEditorComponent.MODAL_NAME);
  }
  copy(request: Request ) {
    this.ngxSmartModalService.setModalData({ type: Goal.Copy, request }, RequestEditorComponent.MODAL_NAME, true);
    this.ngxSmartModalService.getModal(RequestEditorComponent.MODAL_NAME).open();
  }
  addShortRequest(dt: Date, parent: Request) {
    this.ngxSmartModalService.setModalData({ type: Goal.AddChildRequest, date: dt, parent }, RequestEditorComponent.MODAL_NAME, true);
    this.ngxSmartModalService.getModal(RequestEditorComponent.MODAL_NAME).open();
  }

  private async del(req: Request) {
    await this.http.del(req).toPromise();
    await this.reset('all');
    this.getCompletedRequests(this.complitedRequestslimit, this.complitedRequestsOffset);
    this.getActualRequests(this.actualRequestslimit, this.actualRequestsOffset);
  }

  onScrollActualRequests() {
    this.actualRequestsOffset += this.actualRequestslimit;
    this.getActualRequests(this.actualRequestslimit, this.actualRequestsOffset);
  }

  onScrollComplitedRequests() {
    this.complitedRequestsOffset += this.complitedRequestslimit;
    this.getCompletedRequests(this.complitedRequestslimit, this.complitedRequestsOffset);
  }

  handleComplitedRequests(newVals: Request[]) {
    newVals.forEach(req => this.completedRequests.push(req));
    this.completedRequests.sort((a, b): any => {
      if (!a.deliveryStart && b.deliveryStart) {
        return 1;
      } else if (a.deliveryStart && !b.deliveryStart) {
        return -1;
      } else if (a.deliveryStart && b.deliveryStart) {
        return new Date(b.deliveryStart).getTime() - new Date(a.deliveryStart).getTime();
      }
    });
  }

  handleActualRequests(newVals: Request[]) {
    newVals.forEach(req => this.actualRequests.push(req));
    this.actualRequests.forEach(req => {
      if (req.deliveryStart && !this.dateArray.includes(req.deliveryStart) && !(req.requestStatus?.id === 5)) {
        this.datePeriods.push({date: req.deliveryStart});
        this.dateArray.push(req.deliveryStart);
      }
    });
    this.datePeriods.forEach(period => {
      period.requests = [];
      this.actualRequests.forEach(req => {
        if (period.date === req.deliveryStart) {
          period.requests.push(req);
        }
      });
      const newRequests = period.requests.filter(r => r.requestStatus?.id === 1);
      const onGoingRequests = period.requests.filter(r => r.requestStatus?.id === 3);
      const complitingRequests = period.requests.filter(r => r.requestStatus?.id === 4);
      period.requests = [...newRequests, ...onGoingRequests, ...complitingRequests];
    });
    this.longTermRequests = this.actualRequests.filter(req => req.isLong);
    this.incidentRequests = this.actualRequests.filter(r => r.requestStatus?.id === 5);
    this.datePeriods.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }

  async getActualRequests(limit: number, offset: number) {
    this.http.getActualRequests(limit, offset).subscribe(
      allRequests => this.handleActualRequests(allRequests),
      error => this.toastr.error(error.message)
    );
  }

  async getCompletedRequests(limit: number, offset: number) {
    this.http.getCompletedRequests(limit, offset).subscribe(
      allRequests => this.handleComplitedRequests(allRequests),
      error => this.toastr.error(error.message)
    );
  }

  onStatusChange(reqId: number, statusId: string, oldStatus: string) {
    if (oldStatus === 'actual' && Number(statusId) === 2) {
      this.ngxSmartModalService.setModalData(
        {
          title: 'Запланированный тоннаж получен',
          btnAction: () => this.setStatus(reqId, statusId, oldStatus),
          btnActionColor: 'gray',
          btnActionName: 'Подтвердить'
        },
        'confirmModal',
        true
      );
      this.ngxSmartModalService.toggle('confirmModal');
    } else {
      this.setStatus(reqId, statusId, oldStatus);
    }
  }

  setStatus(reqId: number, statusId: string | number, oldStatus: string | number) {
    this.http.setStatus(reqId, Number(statusId)).subscribe(
      result => {
        if (oldStatus === 'completed' || (oldStatus === 'actual' && Number(statusId) === 2)) {
          this.reset('all');
          this.getCompletedRequests(this.complitedRequestslimit, this.complitedRequestsOffset);
          this.getActualRequests(this.actualRequestslimit, this.actualRequestsOffset);
        } else {
          this.reset('actual');
          this.getActualRequests(this.actualRequestslimit, this.actualRequestsOffset);
        }
      },
      err => {
        this.toastr.error(err.message);
      }
    );
  }

  reset(status: string) {
    if (status === 'actual') {
      this.actualRequests = [];
      this.incidentRequests = [];
      this.datePeriods = [];
      this.dateArray = [];
      this.actualRequestslimit = 15;
      this.actualRequestsOffset = 0;
    } else {
      this.actualRequests = [];
      this.completedRequests = [];
      this.incidentRequests = [];
      this.datePeriods = [];
      this.dateArray = [];
      this.complitedRequestslimit = 20;
      this.complitedRequestsOffset = 0;
      this.actualRequestslimit = 15;
      this.actualRequestsOffset = 0;
    }
  }

  divideAmount(req: Request) {
    this.ngxSmartModalService.setModalData(
      {
        req,
        setStatus: () => this.setStatus(req.id || 0, 3, req.requestStatus?.id || 0)
      },
      'amountModal',
      true
    );
    this.ngxSmartModalService.toggle('amountModal');
  }

  // sorting(sortingCol: string, nested: number) {
  //   if (this.sortingValue.column !== sortingCol) {
  //     this.sortingValue.column = sortingCol;
  //     this.sortingValue.type = 'direct';
  //   } else {
  //     if (this.sortingValue.type === 'direct') {
  //       this.sortingValue.type = 'reverse';
  //     } else {
  //       this.sortingValue.type = 'direct';
  //     }
  //   }
  //   if (alphabeticalCols.includes(sortingCol)) {
  //     alphaBeticalSorting(this.completedRequests, sortingCol, nested, this.sortingValue.type);
  //   }
  //   if (numeralCols.includes(sortingCol)) {
  //     numeralSorting(this.completedRequests, sortingCol, nested, this.sortingValue.type);
  //   }
  // }

  ngOnInit() {
    this.getStatuses();
    this.getActualRequests(this.actualRequestslimit, this.actualRequestsOffset);
    this.getCompletedRequests(this.complitedRequestslimit, this.complitedRequestsOffset);
    this.nextDay.setDate(new Date().getDate() + 1);
  }

  async onAmountFuncFinish() {
    this.reset('actual');
    await this.getStatuses();
    await this.getActualRequests(this.actualRequestslimit, this.actualRequestsOffset);
    this.nextDay.setDate(new Date().getDate() + 1);
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

  getStatuses() {
    this.http.getStatuses().subscribe(
      statuses =>
        this.statuses = statuses,
      err => {
        this.toastr.error(err.message);
      }
    );
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

  async onModalChange() {
    this.reset('actual');
    await this.getStatuses();
    await this.getActualRequests(this.actualRequestslimit, this.actualRequestsOffset);
    await this.getCompletedRequests(this.complitedRequestslimit, this.complitedRequestsOffset);
    this.nextDay.setDate(new Date().getDate() + 1);

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

  openContextMenu({ x, y }: MouseEvent, req) {
    this.closeContextMenu();
    const positionStrategy = this.overlay.position().global()
    .centerHorizontally().centerVertically();

    this.overlayRef = this.overlay.create({
      positionStrategy,
      scrollStrategy: this.overlay.scrollStrategies.close()
    });

    this.overlayRef.attach(new TemplatePortal(this.reqMenu, this.viewContainerRef, {
      $implicit: req
    }));
    (document.querySelector('.requestContextMenu') as HTMLElement).style.left =  `${x}px`;
    (document.querySelector('.requestContextMenu') as HTMLElement).style.top =  `${y}px`;
    this.sub = fromEvent<MouseEvent>(document, 'click')
      .pipe(
        filter(event => {
          const clickTarget = event.target as HTMLElement;
          return !!this.overlayRef && !this.overlayRef.overlayElement.contains(clickTarget);
        }),
        take(1)
      ).subscribe(() => this.closeContextMenu());

  }
  closeContextMenu() {
    if (this.sub) {
      this.sub.unsubscribe();
    }
    if (this.overlayRef) {
      this.overlayRef.dispose();
      this.overlayRef = null;
    }
  }
}
