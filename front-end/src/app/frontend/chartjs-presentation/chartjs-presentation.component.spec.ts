import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChartjsPresentationComponent } from './chartjs-presentation.component';

describe('ChartjsPresentationComponent', () => {
  let component: ChartjsPresentationComponent;
  let fixture: ComponentFixture<ChartjsPresentationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChartjsPresentationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChartjsPresentationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
