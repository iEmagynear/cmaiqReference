import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ApcNewsManagerComponent } from './apc-news-manager.component';

describe('ApcNewsManagerComponent', () => {
  let component: ApcNewsManagerComponent;
  let fixture: ComponentFixture<ApcNewsManagerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ApcNewsManagerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ApcNewsManagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
