import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

export interface Experience {
  id?: string;
  titre: string;
  entreprise: string;
  dateDebut: string;
  dateFin: string;
  enCours: boolean;
  description: string;
}

export interface Formation {
  id?: string;
  diplome: string;
  etablissement: string;
  anneeDebut: string;
  anneeFin: string;
  enCours: boolean;
  description: string;
}

@Component({
  selector: 'app-step3-experiences',
  templateUrl: './step3-experiences.html',
  styleUrls: ['./step3-experiences.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class Step3ExperiencesComponent implements OnChanges {
  @Input() experiences: Experience[] = [];
  @Input() formations: Formation[] = [];
  @Output() experiencesChange = new EventEmitter<Experience[]>();
  @Output() formationsChange = new EventEmitter<Formation[]>();

  activeTab: 'exp' | 'form' = 'exp';

  newExperience: Experience = {
    titre: '',
    entreprise: '',
    dateDebut: '',
    dateFin: '',
    enCours: false,
    description: ''
  };

  newFormation: Formation = {
    diplome: '',
    etablissement: '',
    anneeDebut: '',
    anneeFin: '',
    enCours: false,
    description: ''
  };

  editingExp: Experience | null = null;
  editingForm: Formation | null = null;
  
  expErrors: { titre?: string; entreprise?: string; dateDebut?: string; dateFin?: string } = {};
  formErrors: { diplome?: string; etablissement?: string; anneeDebut?: string; anneeFin?: string } = {};

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['experiences']) {
      console.log('📥 Experiences reçues du parent:', this.experiences?.length || 0);
    }
    if (changes['formations']) {
      console.log('📥 Formations reçues du parent:', this.formations?.length || 0);
    }
  }

  validateDate(date: string): boolean {
    if (!date) return true;
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(date)) return false;
    const dateObj = new Date(date);
    return !isNaN(dateObj.getTime());
  }

  validateExperience(): boolean {
    this.expErrors = {};
    let isValid = true;
    
    if (!this.newExperience.titre || this.newExperience.titre.trim() === '') {
      this.expErrors.titre = 'Titre requis';
      isValid = false;
    }
    
    if (!this.newExperience.entreprise || this.newExperience.entreprise.trim() === '') {
      this.expErrors.entreprise = 'Entreprise requise';
      isValid = false;
    }
    
    if (this.newExperience.dateDebut && !this.validateDate(this.newExperience.dateDebut)) {
      this.expErrors.dateDebut = 'Format de date invalide (AAAA-MM-JJ)';
      isValid = false;
    }
    
    if (!this.newExperience.enCours && this.newExperience.dateFin) {
      if (!this.validateDate(this.newExperience.dateFin)) {
        this.expErrors.dateFin = 'Format de date invalide (AAAA-MM-JJ)';
        isValid = false;
      } else if (this.newExperience.dateDebut && new Date(this.newExperience.dateFin) < new Date(this.newExperience.dateDebut)) {
        this.expErrors.dateFin = 'La date de fin doit être après la date de début';
        isValid = false;
      }
    }
    
    return isValid;
  }

  validateFormation(): boolean {
    this.formErrors = {};
    let isValid = true;
    
    if (!this.newFormation.diplome || this.newFormation.diplome.trim() === '') {
      this.formErrors.diplome = 'Diplôme requis';
      isValid = false;
    }
    
    if (!this.newFormation.etablissement || this.newFormation.etablissement.trim() === '') {
      this.formErrors.etablissement = 'Établissement requis';
      isValid = false;
    }
    
    if (this.newFormation.anneeDebut && !/^\d{4}$/.test(this.newFormation.anneeDebut)) {
      this.formErrors.anneeDebut = 'Format invalide (AAAA)';
      isValid = false;
    }
    
    if (!this.newFormation.enCours && this.newFormation.anneeFin) {
      if (!/^\d{4}$/.test(this.newFormation.anneeFin)) {
        this.formErrors.anneeFin = 'Format invalide (AAAA)';
        isValid = false;
      } else if (this.newFormation.anneeDebut && parseInt(this.newFormation.anneeFin) < parseInt(this.newFormation.anneeDebut)) {
        this.formErrors.anneeFin = 'L\'année de fin doit être postérieure à l\'année de début';
        isValid = false;
      }
    }
    
    return isValid;
  }

  addExperience() {
    if (this.validateExperience()) {
      const newExp = { 
        ...this.newExperience, 
        id: Date.now().toString()
      };
      const updatedExperiences = [...this.experiences, newExp];
      this.experiences = updatedExperiences;
      this.experiencesChange.emit(updatedExperiences);
      this.resetNewExperience();
      console.log('➕ Expérience ajoutée, total:', updatedExperiences.length);
    }
  }

  editExperience(exp: Experience) {
    this.editingExp = { ...exp };
  }

  saveExperience() {
    if (this.editingExp) {
      const index = this.experiences.findIndex(e => e.id === this.editingExp?.id);
      if (index !== -1) {
        const updatedExperiences = [...this.experiences];
        updatedExperiences[index] = { ...this.editingExp };
        this.experiences = updatedExperiences;
        this.experiencesChange.emit(updatedExperiences);
        console.log('✏️ Expérience modifiée');
      }
      this.cancelEdit();
    }
  }

  deleteExperience(id?: string) {
    if (id) {
      const updatedExperiences = this.experiences.filter(e => e.id !== id);
      this.experiences = updatedExperiences;
      this.experiencesChange.emit(updatedExperiences);
      console.log('🗑️ Expérience supprimée, reste:', updatedExperiences.length);
    }
  }

  addFormation() {
    if (this.validateFormation()) {
      const newForm = { 
        ...this.newFormation, 
        id: Date.now().toString()
      };
      const updatedFormations = [...this.formations, newForm];
      this.formations = updatedFormations;
      this.formationsChange.emit(updatedFormations);
      this.resetNewFormation();
      console.log('➕ Formation ajoutée, total:', updatedFormations.length);
    }
  }

  editFormation(form: Formation) {
    this.editingForm = { ...form };
  }

  saveFormation() {
    if (this.editingForm) {
      const index = this.formations.findIndex(f => f.id === this.editingForm?.id);
      if (index !== -1) {
        const updatedFormations = [...this.formations];
        updatedFormations[index] = { ...this.editingForm };
        this.formations = updatedFormations;
        this.formationsChange.emit(updatedFormations);
        console.log('✏️ Formation modifiée');
      }
      this.cancelEdit();
    }
  }

  deleteFormation(id?: string) {
    if (id) {
      const updatedFormations = this.formations.filter(f => f.id !== id);
      this.formations = updatedFormations;
      this.formationsChange.emit(updatedFormations);
      console.log('🗑️ Formation supprimée, reste:', updatedFormations.length);
    }
  }

  resetNewExperience() {
    this.newExperience = {
      titre: '',
      entreprise: '',
      dateDebut: '',
      dateFin: '',
      enCours: false,
      description: ''
    };
    this.expErrors = {};
  }

  resetNewFormation() {
    this.newFormation = {
      diplome: '',
      etablissement: '',
      anneeDebut: '',
      anneeFin: '',
      enCours: false,
      description: ''
    };
    this.formErrors = {};
  }

  cancelEdit() {
    this.editingExp = null;
    this.editingForm = null;
  }
}