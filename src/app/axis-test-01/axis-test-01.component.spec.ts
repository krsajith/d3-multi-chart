import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AxisTest01Component } from './axis-test-01.component';

describe('AxisTest01Component', () => {
  let component: AxisTest01Component;
  let fixture: ComponentFixture<AxisTest01Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AxisTest01Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AxisTest01Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
