import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Step4Competences } from './step4-competences';

describe('Step4Competences', () => {
  let component: Step4Competences;
  let fixture: ComponentFixture<Step4Competences>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Step4Competences]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Step4Competences);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
