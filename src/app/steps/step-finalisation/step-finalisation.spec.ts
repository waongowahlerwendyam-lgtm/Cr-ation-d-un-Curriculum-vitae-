import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StepFinalisationComponent } from './step-finalisation';

describe('StepFinalisation', () => {
  let component: StepFinalisationComponent;
  let fixture: ComponentFixture<StepFinalisationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StepFinalisationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StepFinalisationComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
