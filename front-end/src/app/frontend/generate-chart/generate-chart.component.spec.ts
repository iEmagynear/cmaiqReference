import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GenerateChartComponent } from './generate-chart.component';

describe('GenerateChartComponent', () => {
  let component: GenerateChartComponent;
  let fixture: ComponentFixture<GenerateChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GenerateChartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GenerateChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
