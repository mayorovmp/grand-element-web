import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CarEditorComponent } from './editor.component';

describe('EditorComponent', () => {
  let component: CarEditorComponent;
  let fixture: ComponentFixture<CarEditorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CarEditorComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CarEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
