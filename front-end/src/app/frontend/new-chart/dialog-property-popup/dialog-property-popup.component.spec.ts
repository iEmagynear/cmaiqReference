import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogPropertyPopupComponent } from './dialog-property-popup.component';

describe('DialogPropertyPopupComponent', () => {
  let component: DialogPropertyPopupComponent;
  let fixture: ComponentFixture<DialogPropertyPopupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DialogPropertyPopupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogPropertyPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
