import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Step5PhotoUpload } from './step5-photo-upload';

describe('Step5PhotoUpload', () => {
  let component: Step5PhotoUpload;
  let fixture: ComponentFixture<Step5PhotoUpload>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Step5PhotoUpload]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Step5PhotoUpload);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
