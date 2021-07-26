import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OmpComponent } from './omp.component';

describe('OmpComponent', () => {
  let component: OmpComponent;
  let fixture: ComponentFixture<OmpComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OmpComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OmpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
