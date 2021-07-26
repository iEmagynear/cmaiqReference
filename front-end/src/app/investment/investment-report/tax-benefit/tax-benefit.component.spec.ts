import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TaxBenefitComponent } from './tax-benefit.component';

describe('TaxBenefitComponent', () => {
  let component: TaxBenefitComponent;
  let fixture: ComponentFixture<TaxBenefitComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TaxBenefitComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TaxBenefitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
