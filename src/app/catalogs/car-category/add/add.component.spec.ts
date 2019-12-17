import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CarCategoryAddComponent } from './add.component';

describe('AddComponent', () => {
  let component: CarCategoryAddComponent;
  let fixture: ComponentFixture<CarCategoryAddComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CarCategoryAddComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CarCategoryAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
