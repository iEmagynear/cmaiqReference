import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditAdminMlsComponent } from './edit-admin-mls.component';

describe('EditAdminMlsComponent', () => {
  let component: EditAdminMlsComponent;
  let fixture: ComponentFixture<EditAdminMlsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditAdminMlsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditAdminMlsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
