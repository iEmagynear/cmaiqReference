import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EULAComponent } from './eula.component';

describe('EULAComponent', () => {
  let component: EULAComponent;
  let fixture: ComponentFixture<EULAComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EULAComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EULAComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
