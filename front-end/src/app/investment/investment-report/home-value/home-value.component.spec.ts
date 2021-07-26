import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeValueComponent } from './home-value.component';

describe('HomeValueComponent', () => {
  let component: HomeValueComponent;
  let fixture: ComponentFixture<HomeValueComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HomeValueComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HomeValueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
