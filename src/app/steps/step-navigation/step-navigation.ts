import { Component, EventEmitter, Input, Output } from '@angular/core';
import { StepProgress, StepValidation } from '../../models/cv-data.model';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  selector: 'app-step-navigation',
  templateUrl: './step-navigation.html',
  styleUrls: ['./step-navigation.scss']
})
export class StepNavigationComponent {
  @Input() currentStep = 1;
  @Input() stepProgress!: StepProgress;
  @Input() stepValidation!: StepValidation;
  @Output() stepChange = new EventEmitter<number>();

  steps = [
    { number: 1, name: 'Informations', icon: '👤' },
    { number: 2, name: 'Profil', icon: '📝' },
    { number: 3, name: 'Expériences', icon: '💼' },
    { number: 4, name: 'Compétences', icon: '⚡' },
    { number: 5, name: 'Finalisation', icon: '✅' }
  ];

  getProgress(step: number): number {
    return this.stepProgress[`step${step}` as keyof StepProgress] || 0;
  }

  isValid(step: number): boolean {
    return this.stepValidation[`step${step}` as keyof StepValidation] || false;
  }

  canAccess(step: number): boolean {
    if (step <= this.currentStep) return true;
    for (let i = 1; i < step; i++) {
      if (!this.isValid(i)) return false;
    }
    return true;
  }

  onClick(step: number): void {
    if (this.canAccess(step)) {
      this.stepChange.emit(step);
    }
  }
}