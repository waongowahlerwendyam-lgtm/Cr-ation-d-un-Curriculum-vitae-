import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Step1InfosComponent } from './step1-infos';

describe('Step1Infos', () => {
  let component: Step1InfosComponent;
  let fixture: ComponentFixture<Step1InfosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Step1InfosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Step1InfosComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
