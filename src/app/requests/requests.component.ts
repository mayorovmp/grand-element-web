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
  DateChanged: Subject<Date> = new Subject<Date>();

  actualRequests: Request[] = [];
  completedRequests: Request[] = [];
  statuses: Status[] = [];

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

  add(dt: Date) {
    this.ngxSmartModalService.setModalData({ type: Goal.Add, date: dt }, RequestEditorComponent.MODAL_NAME, true);
    this.ngxSmartModalService.getModal(RequestEditorComponent.MODAL_NAME).open();
  }
  edit(request: Request) {
    this.ngxSmartModalService.setModalData({ type: Goal.Edit, request }, RequestEditorComponent.MODAL_NAME, true);
    this.ngxSmartModalService.toggle(RequestEditorComponent.MODAL_NAME);
  }
  copy(request: Request, dt: Date) {
    this.ngxSmartModalService.setModalData({ type: Goal.Copy, request, date: dt }, RequestEditorComponent.MODAL_NAME, true);
    this.ngxSmartModalService.getModal(RequestEditorComponent.MODAL_NAME).open();
  }
  addShortRequest(dt: Date, parent: Request) {
    this.ngxSmartModalService.setModalData({ type: Goal.AddChildRequest, date: dt, parent }, RequestEditorComponent.MODAL_NAME, true);
    this.ngxSmartModalService.getModal(RequestEditorComponent.MODAL_NAME).open();
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
    this.getActualRequests(this.pickedDay);
    this.getCompletedRequests(this.pickedDay);
    this.nextDay.setDate(new Date().getDate() + 1);
    this.DateChanged.pipe(debounceTime(1000), distinctUntilChanged())
      .subscribe(dt => {
        this.pickedDay = dt;
        this.getActualRequests(dt);
        this.getCompletedRequests(dt);

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

  getStatuses() {
    this.http.getStatuses().subscribe(
      statuses =>
        this.statuses = statuses,
      err => {
        this.toastr.error(err.message);
      }
    );
  }

  async finishRequest(orderId: number) {
    await this.http.finishRequest(orderId).toPromise();
    this.getActualRequests(this.pickedDay);
    this.getCompletedRequests(this.pickedDay);

  }

  onChangeDate($event: string) {
    this.curDate = new Date($event);
    this.DateChanged.next(this.curDate);
  }

  refreshDate() {
    const formatedNewDate = new Date().toISOString();
    const newDateWithOutTime = formatedNewDate.split('T')[0];
    this.onChangeDate(newDateWithOutTime);
    this.pickedDay = new Date();
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

  private async del(req: Request) {
    await this.http.del(req).toPromise();
    this.getCompletedRequests(this.pickedDay);
    this.getActualRequests(this.pickedDay);
  }

  async getActualRequests(dt: Date) {
    this.http.getActualRequests().subscribe(
      allRequests => this.actualRequests = allRequests,
      error => this.toastr.error(error.message)
    );
  }

  async getCompletedRequests(dt: Date) {
    this.http.getCompletedRequests().subscribe(
      allRequests => this.completedRequests = allRequests,
      error => this.toastr.error(error.message)
    );
  }

  onModalChange() {
    this.getActualRequests(this.pickedDay);
    this.getCompletedRequests(this.pickedDay);

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

  open({ x, y }: MouseEvent, req) {
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
