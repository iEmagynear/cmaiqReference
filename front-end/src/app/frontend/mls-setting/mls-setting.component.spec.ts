import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MlsSettingComponent } from './mls-setting.component';

describe('MlsSettingComponent', () => {
  let component: MlsSettingComponent;
  let fixture: ComponentFixture<MlsSettingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MlsSettingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MlsSettingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
