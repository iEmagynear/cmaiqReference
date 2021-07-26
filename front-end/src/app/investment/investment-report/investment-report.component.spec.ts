import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InvestmentReportComponent } from './investment-report.component';

describe('InvestmentReportComponent', () => {
  let component: InvestmentReportComponent;
  let fixture: ComponentFixture<InvestmentReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InvestmentReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InvestmentReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
