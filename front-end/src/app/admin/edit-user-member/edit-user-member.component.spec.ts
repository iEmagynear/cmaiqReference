import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditUserMemberComponent } from './edit-user-member.component';

describe('EditUserMemberComponent', () => {
  let component: EditUserMemberComponent;
  let fixture: ComponentFixture<EditUserMemberComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditUserMemberComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditUserMemberComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
