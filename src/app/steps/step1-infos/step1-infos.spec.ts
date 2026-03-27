import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Step1Infos } from './step1-infos';

describe('Step1Infos', () => {
  let component: Step1Infos;
  let fixture: ComponentFixture<Step1Infos>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Step1Infos]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Step1Infos);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
