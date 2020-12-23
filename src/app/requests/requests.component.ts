import {
  Component,
  OnInit,
  ViewChild,
  TemplateRef,
  ViewContainerRef,
} from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Request } from '@models/Request';
import { Status, StatusName } from '@models/Status';
import { fromEvent, Subscription } from 'rxjs';
import { NgxSmartModalService } from 'ngx-smart-modal';
import { HttpService } from './http.service';
import { ToastrService } from 'ngx-toastr';
import { RequestEditorComponent } from './editor/request-editor.component';
import { Goal } from './editor/Goal';
import { TemplatePortal } from '@angular/cdk/portal';
import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { take, filter } from 'rxjs/operators';
import { AmountModalComponent } from './amountModal/amountModal.component';
import { ConfirmCompleteReqModalComponent } from './confirmCompleteReqModal/amountModal/confirm-complete-req-modal.component';
import { CdkDragDrop } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-requests',
  templateUrl: './requests.component.html',
  styleUrls: ['./requests.component.css'],
})
export class RequestsComponent implements OnInit {
  pickedDay = new Date(Date.now());

  actualRequests: Request[] = [];
  completedRequests: Request[] = [];
  incidentRequests: Request[] = [];
  longTermRequests: Request[] = [];
  statuses: Status[] = [];

  sub: Subscription;
  @ViewChild('reqMenu') reqMenu: TemplateRef<any>;
  overlayRef: OverlayRef | null;

  curDate = new Date();
  nextDay = new Date();

  complitedRequestslimit = 20;
  complitedRequestsOffset = 0;

  actualRequestslimit = 50;
  actualRequestsOffset = 0;

  throttle = 300;
  scrollDistance = 0.1;

  complitedRequestsIsVisible = true;
  lastDraggedReqId: undefined | number = undefined;

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
    this.lastDraggedReqId = undefined;
    this.ngxSmartModalService.setModalData(
      { type: Goal.Add },
      RequestEditorComponent.MODAL_NAME,
      true
    );
    this.ngxSmartModalService
      .getModal(RequestEditorComponent.MODAL_NAME)
      .open();
  }
  edit(request: Request) {
    this.lastDraggedReqId = undefined;
    this.ngxSmartModalService.setModalData(
      { type: Goal.Edit, request },
      RequestEditorComponent.MODAL_NAME,
      true
    );
    this.ngxSmartModalService.toggle(RequestEditorComponent.MODAL_NAME);
  }
  copy(request: Request) {
    this.ngxSmartModalService.setModalData(
      { type: Goal.Copy, request },
      RequestEditorComponent.MODAL_NAME,
      true
    );
    this.ngxSmartModalService
      .getModal(RequestEditorComponent.MODAL_NAME)
      .open();
  }
  addShortRequest(dt: Date, parent: Request) {
    this.ngxSmartModalService.setModalData(
      { type: Goal.AddChildRequest, date: dt, parent },
      RequestEditorComponent.MODAL_NAME,
      true
    );
    this.ngxSmartModalService
      .getModal(RequestEditorComponent.MODAL_NAME)
      .open();
  }

  private async del(req: Request) {
    await this.http.del(req).toPromise();
    this.reset();
  }

  onScrollActualRequests() {
    this.actualRequestsOffset += this.actualRequestslimit;
    this.getActualRequests(this.actualRequestslimit, this.actualRequestsOffset);
  }

  onScrollComplitedRequests() {
    this.complitedRequestsOffset += this.complitedRequestslimit;
    this.getCompletedRequests(
      this.complitedRequestslimit,
      this.complitedRequestsOffset
    );
  }

  handleComplitedRequests(newVals: Request[]) {
    newVals.forEach((r) => this.completedRequests.push(r));
  }

  handleActualRequests(newVals: Request[]) {
    newVals
      .filter((r) => !r.isLong && r.requestStatus.id !== StatusName.Incident)
      .forEach((r) => this.actualRequests.push(r));
    newVals
      .filter((r) => r.requestStatus.id === StatusName.Incident)
      .forEach((r) => this.incidentRequests.push(r));
    newVals
      .filter((r) => r.isLong)
      .forEach((r) => this.longTermRequests.push(r));
  }

  async getActualRequests(limit: number, offset: number) {
    this.http.getActualRequests(limit, offset).subscribe(
      (actualRequests) => this.handleActualRequests(actualRequests),
      (error) => this.toastr.error(error.message)
    );
  }

  async getCompletedRequests(limit: number, offset: number) {
    this.http.getCompletedRequests(limit, offset).subscribe(
      (completedRequests) => this.handleComplitedRequests(completedRequests),
      (error) => this.toastr.error(error.message)
    );
  }

  onActualRequestStatusChange(req: Request, statusIdStr: string) {
    const statusId = Number(statusIdStr);
    if (statusId === StatusName.Executed) {
      this.ngxSmartModalService.setModalData(
        req,
        ConfirmCompleteReqModalComponent.MODAL_NAME,
        true
      );
      this.ngxSmartModalService.toggle(
        ConfirmCompleteReqModalComponent.MODAL_NAME
      );
    } else if (req.id) {
      this.setStatus(req.id, statusId);
    }
  }

  setStatus(reqId: number, statusId: number) {
    this.lastDraggedReqId = undefined;
    this.http.setStatus(reqId, statusId).subscribe(
      (result) => {},
      (err) => {
        this.toastr.error(err.message);
      },
      () => {
        this.reset();
        this.getActualRequests(
          this.actualRequestslimit,
          this.actualRequestsOffset
        );
        this.getCompletedRequests(
          this.complitedRequestslimit,
          this.complitedRequestsOffset
        );
      }
    );
  }

  reset() {
    this.actualRequests = [];
    this.incidentRequests = [];
    this.longTermRequests = [];
    this.completedRequests = [];
    this.actualRequestsOffset = 0;
    this.complitedRequestsOffset = 0;
  }

  divideAmount(req: Request) {
    this.lastDraggedReqId = undefined;
    this.ngxSmartModalService.setModalData(
      req,
      AmountModalComponent.MODAL_NAME,
      true
    );
    this.ngxSmartModalService.toggle(AmountModalComponent.MODAL_NAME);
  }

  ngOnInit() {
    this.getStatuses();
    this.getActualRequests(this.actualRequestslimit, this.actualRequestsOffset);
    this.getCompletedRequests(
      this.complitedRequestslimit,
      this.complitedRequestsOffset
    );
    this.nextDay.setDate(new Date().getDate() + 1);
  }

  DownloadFile(dt: Date): void {
    this.http.getFile(dt).subscribe((fileData) => {
      const downloadURL = window.URL.createObjectURL(fileData.body);
      const link = document.createElement('a');
      link.href = downloadURL;
      link.download = `${dt.toDateString()}.xlsx`;
      link.click();
    });
  }

  getStatuses() {
    this.http.getStatuses().subscribe(
      (statuses) =>
        (this.statuses = statuses.sort((a, b) => a.orderBy - b.orderBy)),
      (err) => {
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
        btnActionName: 'Удалить заказ',
      },
      'confirmModal',
      true
    );
    this.ngxSmartModalService.toggle('confirmModal');
  }

  onModalChange() {
    this.reset();
    this.getActualRequests(this.actualRequestslimit, this.actualRequestsOffset);
    this.getCompletedRequests(
      this.complitedRequestslimit,
      this.complitedRequestsOffset
    );
  }

  openContextMenu({ x, y }: MouseEvent, req) {
    this.lastDraggedReqId = undefined;
    this.closeContextMenu();
    const positionStrategy = this.overlay
      .position()
      .global()
      .centerHorizontally()
      .centerVertically();

    this.overlayRef = this.overlay.create({
      positionStrategy,
      scrollStrategy: this.overlay.scrollStrategies.close(),
    });

    this.overlayRef.attach(
      new TemplatePortal(this.reqMenu, this.viewContainerRef, {
        $implicit: req,
      })
    );
    (document.querySelector(
      '.requestContextMenu'
    ) as HTMLElement).style.left = `${x}px`;
    (document.querySelector(
      '.requestContextMenu'
    ) as HTMLElement).style.top = `${y}px`;
    this.sub = fromEvent<MouseEvent>(document, 'click')
      .pipe(
        filter((event) => {
          const clickTarget = event.target as HTMLElement;
          return (
            !!this.overlayRef &&
            !this.overlayRef.overlayElement.contains(clickTarget)
          );
        }),
        take(1)
      )
      .subscribe(() => this.closeContextMenu());
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

  toggleComplitedRequests() {
    this.complitedRequestsIsVisible = !this.complitedRequestsIsVisible;
  }

  async drop(event: CdkDragDrop<string[]>) {
    const dragItem = event.item.data;
    const prevItem = this.actualRequests[event.currentIndex];
    if (
      event.previousContainer.id === event.container.id &&
      event.previousContainer.id === 'actual'
    ) {
      if (dragItem.deliveryStart !== prevItem.deliveryStart) {
        dragItem.deliveryStart = prevItem.deliveryStart;
        await this.http.edit(dragItem).toPromise();
        this.reset();
        this.getActualRequests(
          this.actualRequestslimit,
          this.actualRequestsOffset
        );
        this.getCompletedRequests(
          this.complitedRequestslimit,
          this.complitedRequestsOffset
        );
      }
    } else {
      event.previousContainer.id === 'incident'
        ? this.onActualRequestStatusChange(dragItem, StatusName.New.toString())
        : this.onActualRequestStatusChange(
            dragItem,
            StatusName.Incident.toString()
          );
      if (dragItem.deliveryStart !== prevItem.deliveryStart) {
        dragItem.deliveryStart = prevItem.deliveryStart;
        await this.http.edit(dragItem).toPromise();
      }
    }
    this.lastDraggedReqId = dragItem.id;
  }
}
