import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CarAddComponent } from './add.component';

describe('AddComponent', () => {
  let component: CarAddComponent;
  let fixture: ComponentFixture<CarAddComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CarAddComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CarAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
