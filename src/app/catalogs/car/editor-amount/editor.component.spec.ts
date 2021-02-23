import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CarEditorAmountComponent } from './editor.component';

describe('EditorComponent', () => {
  let component: CarEditorAmountComponent;
  let fixture: ComponentFixture<CarEditorAmountComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CarEditorAmountComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CarEditorAmountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
