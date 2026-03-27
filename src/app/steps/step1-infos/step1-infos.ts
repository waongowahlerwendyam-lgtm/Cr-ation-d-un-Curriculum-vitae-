import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { PersonalInfo } from '../../models/cv-data.model';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  selector: 'app-step1-infos',
  templateUrl: './step1-infos.html',
  styleUrls: ['./step1-infos.scss']
})
export class Step1InfosComponent implements OnInit {
  @Input() personalInfo!: PersonalInfo;
  @Output() personalInfoUpdate = new EventEmitter<PersonalInfo>();
  @Output() validityChange = new EventEmitter<boolean>();

  form: FormGroup;
  showErrors = false;

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      nom: ['', [Validators.required, Validators.minLength(2)]],
      prenom: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      telephone: ['', [Validators.required, this.telephoneValidator]],
      adresse: [''],
      ville: [''],
      codePostal: [''],
      pays: ['France'],
      dateNaissance: [''],
      permis: ['']
    });
  }

  telephoneValidator(control: AbstractControl): ValidationErrors | null {
    const value = control.value;
    if (!value) return null;
    
    const cleanNumber = value.toString().replace(/[\s\-\.]/g, '');
    
    if (!/^\d+$/.test(cleanNumber)) {
      return { invalidPhone: true };
    }
    
    if (cleanNumber.length < 9) {
      return { minlength: true };
    }
    
    return null;
  }

  ngOnInit(): void {
    if (this.personalInfo) {
      this.form.patchValue(this.personalInfo);
    }
    
    this.form.valueChanges.subscribe((values) => {
      this.personalInfoUpdate.emit(values);
      this.validityChange.emit(this.form.valid);
    });
    
    this.validityChange.emit(this.form.valid);
  }

  isFormValid(): boolean {
    return this.form.valid;
  }

  showAllErrors() {
    this.showErrors = true;
  }

  getError(field: string): string {
    const control = this.form.get(field);
    if (!control || !(control.touched || this.showErrors)) return '';
    
    if (control.hasError('required')) return 'Champ requis';
    if (control.hasError('email')) return 'Email invalide';
    if (control.hasError('minlength')) return 'Minimum 2 caractères';
    if (control.hasError('invalidPhone')) return 'Numéro invalide (9 chiffres minimum)';
    
    return '';
  }
}