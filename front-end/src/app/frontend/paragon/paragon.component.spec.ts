import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ParagonComponent } from './paragon.component';

describe('ParagonComponent', () => {
  let component: ParagonComponent;
  let fixture: ComponentFixture<ParagonComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ParagonComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ParagonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
