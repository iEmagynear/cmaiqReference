import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PrincipalPaydownComponent } from './principal-paydown.component';

describe('PrincipalPaydownComponent', () => {
  let component: PrincipalPaydownComponent;
  let fixture: ComponentFixture<PrincipalPaydownComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PrincipalPaydownComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PrincipalPaydownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
