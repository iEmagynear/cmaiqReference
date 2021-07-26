import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AnnualInestmentAnalysisComponent } from './annual-inestment-analysis.component';

describe('AnnualInestmentAnalysisComponent', () => {
  let component: AnnualInestmentAnalysisComponent;
  let fixture: ComponentFixture<AnnualInestmentAnalysisComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AnnualInestmentAnalysisComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AnnualInestmentAnalysisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
