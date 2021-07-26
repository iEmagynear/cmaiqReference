import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AnnualizedReturnComponent } from './annualized-return.component';

describe('AnnualizedReturnComponent', () => {
  let component: AnnualizedReturnComponent;
  let fixture: ComponentFixture<AnnualizedReturnComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AnnualizedReturnComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AnnualizedReturnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
