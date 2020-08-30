import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FinishReqModalComponent } from './finishReq.component';

describe('ConfirmModalComponent', () => {
  let component: FinishReqModalComponent;
  let fixture: ComponentFixture<FinishReqModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FinishReqModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FinishReqModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
