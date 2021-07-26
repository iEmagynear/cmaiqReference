import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PropertiesUploadComponent } from './properties-upload.component';

describe('PropertiesUploadComponent', () => {
  let component: PropertiesUploadComponent;
  let fixture: ComponentFixture<PropertiesUploadComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PropertiesUploadComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PropertiesUploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
