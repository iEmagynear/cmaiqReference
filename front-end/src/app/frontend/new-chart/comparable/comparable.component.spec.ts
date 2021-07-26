import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ComparableComponent } from './comparable.component';

describe('ComparableComponent', () => {
  let component: ComparableComponent;
  let fixture: ComponentFixture<ComparableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ComparableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ComparableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
