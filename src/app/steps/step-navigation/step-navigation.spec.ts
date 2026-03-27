import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StepNavigation } from './step-navigation';

describe('StepNavigation', () => {
  let component: StepNavigation;
  let fixture: ComponentFixture<StepNavigation>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StepNavigation]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StepNavigation);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
