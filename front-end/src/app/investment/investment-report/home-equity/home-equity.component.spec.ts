import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeEquityComponent } from './home-equity.component';

describe('HomeEquityComponent', () => {
  let component: HomeEquityComponent;
  let fixture: ComponentFixture<HomeEquityComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HomeEquityComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HomeEquityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
