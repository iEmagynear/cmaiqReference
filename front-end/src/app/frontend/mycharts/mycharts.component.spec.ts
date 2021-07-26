import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MychartsComponent } from './mycharts.component';

describe('MychartsComponent', () => {
  let component: MychartsComponent;
  let fixture: ComponentFixture<MychartsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MychartsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MychartsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
