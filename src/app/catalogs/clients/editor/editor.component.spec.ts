import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientEditorComponent } from './editor.component';

describe('EditorComponent', () => {
  let component: ClientEditorComponent;
  let fixture: ComponentFixture<ClientEditorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClientEditorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClientEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
