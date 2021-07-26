import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OmpPropertiesUploadComponent } from './omp-properties-upload.component';

describe('PropertiesUploadComponent', () => {
  let component: OmpPropertiesUploadComponent;
  let fixture: ComponentFixture<OmpPropertiesUploadComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OmpPropertiesUploadComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OmpPropertiesUploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
