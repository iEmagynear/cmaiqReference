import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditGroupMlsComponent } from './edit-group-mls.component';

describe('EditGroupMlsComponent', () => {
  let component: EditGroupMlsComponent;
  let fixture: ComponentFixture<EditGroupMlsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditGroupMlsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditGroupMlsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
