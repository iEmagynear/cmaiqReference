import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfValuesComponent } from './conf-values.component';

describe('ConfValuesComponent', () => {
  let component: ConfValuesComponent;
  let fixture: ComponentFixture<ConfValuesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConfValuesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfValuesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
