import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

// Imports des services
import { CvStorageService } from '../Service/cv-storage-service';
import { CvPreviewService } from '../Service/cv-preview.service';

// Imports des composants steps
import { StepNavigationComponent } from '../steps/step-navigation/step-navigation';
import { Step1InfosComponent } from '../steps/step1-infos/step1-infos';
import { Step2ProfilComponent } from '../steps/step2-profil/step2-profil';
import { Step3ExperiencesComponent } from '../steps/step3-experiences/step3-experiences';
import { Step4CompetencesComponent } from '../steps/step4-competences/step4-competences';
import { Step5PhotoUploadComponent } from '../steps/step5-photo-upload/step5-photo-upload';
import { StepFinalisationComponent } from '../steps/step-finalisation/step-finalisation';


// Import du modèle
import { CVData } from '../models/cv-data.model';
import { FooterComponent } from '../footer/footer';

@Component({
  selector: 'app-cv-builder',
  templateUrl: './cv-builder.html',
  styleUrls: ['./cv-builder.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    StepNavigationComponent,
    Step1InfosComponent,
    Step2ProfilComponent,
    Step3ExperiencesComponent,
    Step4CompetencesComponent,
    FooterComponent,
    Step5PhotoUploadComponent,
    StepFinalisationComponent
  ]
})
export class CvBuilderComponent implements OnInit, OnDestroy {
  @ViewChild(Step1InfosComponent) step1Component!: Step1InfosComponent;
  
  currentStep = 1;
  totalSteps = 5;
  cvData: CVData;
  stepProgress: { step1: number; step2: number; step3: number; step4: number; step5: number } = {
    step1: 0, step2: 0, step3: 0, step4: 0, step5: 0
  };
  stepValidation: { step1: boolean; step2: boolean; step3: boolean; step4: boolean; step5: boolean } = {
    step1: false, step2: false, step3: false, step4: false, step5: false
  };
  showPreview = false;
  isLoading = false;
  notification: { type: string; message: string } | null = null;
  private autoSaveInterval: any;

  constructor(
    public previewService: CvPreviewService,
    private storageService: CvStorageService
  ) {
    this.cvData = this.storageService.getCVData();
  }

  ngOnInit() {
    this.loadSavedData();
    this.startAutoSave();
    this.validateAllSteps();
  }

  ngOnDestroy() {
    if (this.autoSaveInterval) {
      clearInterval(this.autoSaveInterval);
    }
  }

  // ==================== CHARGEMENT & SAUVEGARDE ====================
  
  loadSavedData() {
    const savedData = this.storageService.loadCV();
    if (savedData) {
      this.cvData = savedData;
      this.validateAllSteps();
      console.log('📂 Données chargées');
    }
  }

  startAutoSave() {
    this.autoSaveInterval = setInterval(() => {
      this.storageService.saveCV(this.cvData);
      this.showNotification('success', '💾 Sauvegarde automatique effectuée');
    }, 30000);
  }

  // ==================== MISE À JOUR DES DONNÉES ====================
  
  updateData(step: number, data: any) {
    console.log(`📝 Mise à jour Step ${step}:`, data);
    Object.assign(this.cvData, data);
    this.validateStep(step);
    this.updateStepProgress();
    this.storageService.saveCV(this.cvData);
    
    if (step === 3) {
      const hasData = (this.cvData.experiences?.length > 0) || (this.cvData.formations?.length > 0);
      if (hasData) {
        this.showNotification('success', '✅ Expériences/Formations enregistrées');
      }
    }
  }

  onProfileUpdate(profile: string) {
    this.updateData(2, { profile: profile });
  }

  onDataChange() {
    this.validateAllSteps();
    this.storageService.saveCV(this.cvData);
  }

  // ==================== VALIDATION ====================
  
  validateStep(step: number) {
    switch(step) {
      case 1:
        const info = this.cvData.personalInfo;
        const isValid1 = !!(info?.nom && info?.nom.trim() !== '' && 
                            info?.prenom && info?.prenom.trim() !== '' && 
                            info?.email && info?.email.trim() !== '' && 
                            info?.telephone && info?.telephone.toString().trim() !== '');
        this.stepValidation.step1 = isValid1;
        this.stepProgress.step1 = isValid1 ? 100 : 0;
        break;
        
      case 2:
        const isValid2 = !!(this.cvData.profile && this.cvData.profile.trim().length >= 10);
        this.stepValidation.step2 = isValid2;
        this.stepProgress.step2 = isValid2 ? 100 : (this.cvData.profile?.trim().length > 0 ? 50 : 0);
        break;
        
      case 3:
        // ✅ CORRECTION : Step3 est OPTIONNEL
        const hasExperiences = this.cvData.experiences && this.cvData.experiences.length > 0;
        const hasFormations = this.cvData.formations && this.cvData.formations.length > 0;
        const isValid3 = hasExperiences || hasFormations;
        
        // ✅ L'icône ✓ s'affiche UNIQUEMENT si des données existent
        this.stepValidation.step3 = isValid3;
        this.stepProgress.step3 = isValid3 ? 100 : 0;
        break;
        
      case 4:
        const isValid4 = (this.cvData.competences?.length > 0);
        this.stepValidation.step4 = isValid4;
        this.stepProgress.step4 = isValid4 ? 100 : 0;
        break;
        
      case 5:
        const isValid5 = this.hasPhoto();
        this.stepValidation.step5 = isValid5;
        this.stepProgress.step5 = isValid5 ? 100 : 0;
        break;
    }
  }

  updateStepProgress() {
    const info = this.cvData.personalInfo;
    const hasFullPersonalInfo = !!(info?.nom && info?.nom.trim() !== '' && 
                                    info?.prenom && info?.prenom.trim() !== '' && 
                                    info?.email && info?.email.trim() !== '' && 
                                    info?.telephone && info?.telephone.toString().trim() !== '');
    
    this.stepProgress.step1 = hasFullPersonalInfo ? 100 : 0;
    
    const profileLength = this.cvData.profile?.trim().length || 0;
    if (profileLength >= 10) {
      this.stepProgress.step2 = 100;
    } else if (profileLength > 0) {
      this.stepProgress.step2 = 50;
    } else {
      this.stepProgress.step2 = 0;
    }
    
    const hasExperiences = this.cvData.experiences && this.cvData.experiences.length > 0;
    const hasFormations = this.cvData.formations && this.cvData.formations.length > 0;
    this.stepProgress.step3 = (hasExperiences || hasFormations) ? 100 : 0;
    
    this.stepProgress.step4 = (this.cvData.competences?.length > 0) ? 100 : 0;
    this.stepProgress.step5 = this.hasPhoto() ? 100 : 0;
  }

  validateAllSteps() {
    this.updateStepProgress();
    this.stepValidation.step1 = this.validatePersonalInfo();
    this.stepValidation.step2 = this.validateProfile();
    // ✅ CORRECTION : Step3 dépend des données
    this.stepValidation.step3 = this.validateExperiencesOrFormations();
    this.stepValidation.step4 = this.validateCompetences();
    this.stepValidation.step5 = this.hasPhoto();
  }

  // ==================== MÉTHODES DE VÉRIFICATION ====================
  
  validatePersonalInfo(): boolean {
    const info = this.cvData.personalInfo;
    return !!(info?.nom && info?.nom.trim() !== '' && 
              info?.prenom && info?.prenom.trim() !== '' && 
              info?.email && info?.email.trim() !== '' && 
              info?.telephone && info?.telephone.toString().trim() !== '');
  }

  validateProfile(): boolean {
    return !!(this.cvData.profile && this.cvData.profile.trim().length >= 10);
  }

  // ✅ Nouvelle méthode
  validateExperiencesOrFormations(): boolean {
    const hasExperiences = this.cvData.experiences && this.cvData.experiences.length > 0;
    const hasFormations = this.cvData.formations && this.cvData.formations.length > 0;
    return hasExperiences || hasFormations;
  }

  validateCompetences(): boolean {
    return this.cvData.competences?.length > 0;
  }

  hasPhoto(): boolean {
    return !!this.cvData.photo;
  }

  // ==================== NAVIGATION ====================
  
  goToStep(step: number) {
    if (step >= 1 && step <= this.totalSteps) {
      this.currentStep = step;
    }
  }

  nextStep() {
    // Validation pour l'étape 1 (Informations Personnelles) - OBLIGATOIRE
    if (this.currentStep === 1) {
      let info = this.cvData.personalInfo;
      
      if (this.step1Component) {
        const formValues = this.step1Component.form.value;
        info = formValues;
        this.cvData.personalInfo = info;
      }
      
      if (!info?.nom || info.nom.toString().trim() === '') {
        this.showNotification('error', '❌ Le nom est requis');
        if (this.step1Component) this.step1Component.showAllErrors();
        return;
      }
      
      if (!info?.prenom || info.prenom.toString().trim() === '') {
        this.showNotification('error', '❌ Le prénom est requis');
        if (this.step1Component) this.step1Component.showAllErrors();
        return;
      }
      
      if (!info?.email || info.email.toString().trim() === '') {
        this.showNotification('error', '❌ L\'email est requis');
        if (this.step1Component) this.step1Component.showAllErrors();
        return;
      }
      
      if (!info?.telephone || info.telephone.toString().trim() === '') {
        this.showNotification('error', '❌ Le téléphone est requis');
        if (this.step1Component) this.step1Component.showAllErrors();
        return;
      }
      
      if (info.nom.toString().trim().length < 2) {
        this.showNotification('error', '❌ Le nom doit contenir au moins 2 caractères');
        if (this.step1Component) this.step1Component.showAllErrors();
        return;
      }
      
      if (info.prenom.toString().trim().length < 2) {
        this.showNotification('error', '❌ Le prénom doit contenir au moins 2 caractères');
        if (this.step1Component) this.step1Component.showAllErrors();
        return;
      }
      
      const emailRegex = /^[^\s@]+@([^\s@]+\.)+[^\s@]+$/;
      if (!emailRegex.test(info.email.toString())) {
        this.showNotification('error', '❌ Email invalide');
        if (this.step1Component) this.step1Component.showAllErrors();
        return;
      }
      
      const cleanPhone = info.telephone.toString().replace(/[\s\-\.]/g, '');
      if (cleanPhone.length < 9) {
        this.showNotification('error', '❌ Téléphone invalide (minimum 9 chiffres)');
        if (this.step1Component) this.step1Component.showAllErrors();
        return;
      }
      
      if (!/^\d+$/.test(cleanPhone)) {
        this.showNotification('error', '❌ Téléphone invalide (uniquement des chiffres)');
        if (this.step1Component) this.step1Component.showAllErrors();
        return;
      }
      
      this.storageService.saveCV(this.cvData);
    }
    
    // Sauvegarde pour Step3 avant de passer
    if (this.currentStep === 3) {
      this.storageService.saveCV(this.cvData);
    }
    
    // Validation pour l'étape 4 (Compétences) - OBLIGATOIRE
    if (this.currentStep === 4) {
      if (!this.cvData.competences || this.cvData.competences.length === 0) {
        this.showNotification('error', '❌ Ajoutez au moins une compétence');
        return;
      }
    }
    
    if (this.currentStep < this.totalSteps) {
      this.currentStep++;
    }
  }

  previousStep() {
    if (this.currentStep > 1) {
      this.currentStep--;
    }
  }

  getTotalProgress(): number {
    const total = (this.stepProgress.step1 + this.stepProgress.step2 + 
                   this.stepProgress.step3 + this.stepProgress.step4 + 
                   this.stepProgress.step5) / 5;
    return Math.floor(total);
  }

  // ==================== ACTIONS ====================
  
  exportJSON() {
    this.storageService.exportToJSON(this.cvData);
    this.showNotification('success', '📄 CV exporté en JSON');
  }

  resetCV() {
    if (confirm('⚠️ Voulez-vous vraiment réinitialiser toutes les données ?')) {
      this.cvData = {
        personalInfo: {
          nom: '',
          prenom: '',
          email: '',
          telephone: '',
          adresse: '',
          ville: '',
          codePostal: '',
          pays: '',
          dateNaissance: '',
          permis: '',
          situationFamiliale: ''
        },
        profile: '',
        experiences: [],
        formations: [],
        competences: [],
        langues: [],
        centresInteret: [],
        reseauxSociaux: [],
        photo: '',
        metadata: {
          version: 1,
          dateCreation: new Date(),
          dateModification: new Date(),
          template: 'default'
        }
      };
      
      this.stepProgress = { step1: 0, step2: 0, step3: 0, step4: 0, step5: 0 };
      this.stepValidation = { step1: false, step2: false, step3: false, step4: false, step5: false };
      this.currentStep = 1;
      
      if (this.step1Component) {
        this.step1Component.form.reset();
        this.step1Component.showErrors = false;
      }
      
      this.storageService.saveCV(this.cvData);
      this.validateAllSteps();
      this.showNotification('success', '✅ CV complètement réinitialisé');
    }
  }

  generatePreview() {
    this.showPreview = true;
  }

  printCV() {
    const printContent = this.previewService.generateHTML(this.cvData);
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(printContent);
      printWindow.document.close();
      printWindow.print();
    }
  }

  showNotification(type: string, message: string) {
    this.notification = { type, message };
    setTimeout(() => {
      this.notification = null;
    }, 3000);
  }
  
}