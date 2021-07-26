import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FlexmlsComponent } from './flexmls.component';

describe('FlexmlsComponent', () => {
  let component: FlexmlsComponent;
  let fixture: ComponentFixture<FlexmlsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FlexmlsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FlexmlsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
