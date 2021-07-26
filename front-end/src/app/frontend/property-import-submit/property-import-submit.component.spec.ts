import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PropertyImportSubmitComponent } from './property-import-submit.component';

describe('PropertyImportSubmitComponent', () => {
  let component: PropertyImportSubmitComponent;
  let fixture: ComponentFixture<PropertyImportSubmitComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PropertyImportSubmitComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PropertyImportSubmitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
