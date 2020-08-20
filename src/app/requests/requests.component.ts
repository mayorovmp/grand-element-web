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
    this.getCompletedRequests();
    this.getActualRequests();
  }

  async getActualRequests() {
    this.http.getActualRequests().subscribe(
      allRequests => {
        const dateArray: any[] = [];
        allRequests.forEach(req => {
          if (req.deliveryStart && !dateArray.includes(req.deliveryStart)) {
            this.datePeriods.push({date: req.deliveryStart});
            dateArray.push(req.deliveryStart);
          }
        });
        this.datePeriods.forEach(period => {
          period.requests = [];
          allRequests.forEach(req => {
            if (period.date === req.deliveryStart) {
              period.requests.push(req);
            }
          });
          const newRequests = period.requests.filter(r => r.requestStatus?.id === 1);
          const onGoingRequests = period.requests.filter(r => r.requestStatus?.id === 3);
          const complitingRequests = period.requests.filter(r => r.requestStatus?.id === 4);
          const incidentRequests = period.requests.filter(r => r.requestStatus?.id === 5);
          period.requests = [...newRequests, ...onGoingRequests, ...complitingRequests, ...incidentRequests];
          console.log('incidentRequests', incidentRequests);
          this.incidentRequests = [...incidentRequests];
        });
      },
      error => this.toastr.error(error.message)
    );
  }

  async getCompletedRequests() {
    this.http.getCompletedRequests().subscribe(
      allRequests => this.completedRequests = allRequests,
      error => this.toastr.error(error.message)
    );
  }

  onStatusChange(reqId: number, statusId: number) {
    this.http.setStatus(reqId, statusId).subscribe(
      result => {
        this.getActualRequests();
        this.getCompletedRequests();
      },
      err => {
        this.toastr.error(err.message);
      }
    );
  }

  sorting(sortingCol: string, nested: number) {
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
      alphaBeticalSorting(this.actualRequests, sortingCol, nested, this.sortingValue.type);
    }
    if (numeralCols.includes(sortingCol)) {
      numeralSorting(this.actualRequests, sortingCol, nested, this.sortingValue.type);
    }
  }

  ngOnInit() {
    this.getStatuses();
    this.getActualRequests();
    this.getCompletedRequests();
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

  onModalChange() {
    this.getActualRequests();
    this.getCompletedRequests();

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
