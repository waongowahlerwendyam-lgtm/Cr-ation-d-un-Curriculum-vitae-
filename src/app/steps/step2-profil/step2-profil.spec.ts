import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Step2ProfilComponent } from './step2-profil';

describe('Step2ProfilComponent', () => {  // ← Correction 2
  let component: Step2ProfilComponent;    // ← Correction 3
  let fixture: ComponentFixture<Step2ProfilComponent>;  // ← Correction 4

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Step2ProfilComponent]  // ← Correction 5
    })
    .compileComponents();

    fixture = TestBed.createComponent(Step2ProfilComponent);  // ← Correction 6
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});