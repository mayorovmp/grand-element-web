import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditCarCategoryComponent } from './edit.component';

describe('EditComponent', () => {
  let component: EditCarCategoryComponent;
  let fixture: ComponentFixture<EditCarCategoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [EditCarCategoryComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditCarCategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
