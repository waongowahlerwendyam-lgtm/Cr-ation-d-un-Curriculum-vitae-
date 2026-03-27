import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Step3Experiences } from './step3-experiences';

describe('Step3Experiences', () => {
  let component: Step3Experiences;
  let fixture: ComponentFixture<Step3Experiences>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Step3Experiences]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Step3Experiences);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
