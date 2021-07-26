import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogPropertyComponent } from './dialog-property.component';

describe('DialogPropertyComponent', () => {
  let component: DialogPropertyComponent;
  let fixture: ComponentFixture<DialogPropertyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DialogPropertyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogPropertyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
