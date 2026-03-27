import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { CvBuilderComponent } from './cv-builder';
import { StepNavigationComponent } from '../steps/step-navigation/step-navigation';
import { Step1InfosComponent } from '../steps/step1-infos/step1-infos'; 
import { Step2ProfilComponent } from '../steps/step2-profil/step2-profil';
import { Step3ExperiencesComponent } from '../steps/step3-experiences/step3-experiences';
import { Step4CompetencesComponent } from '../steps/step4-competences/step4-competences';
import { Step5PhotoUploadComponent } from '../steps/step5-photo-upload/step5-photo-upload';
import { StepFinalisationComponent } from '../steps/step-finalisation/step-finalisation';

@NgModule({
  declarations: [], // Plus de déclarations car les composants sont standalone
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    // Importez les composants standalone ici
    CvBuilderComponent,
    StepNavigationComponent,
    Step1InfosComponent,
    Step2ProfilComponent,
    Step3ExperiencesComponent,
    Step4CompetencesComponent,
    Step5PhotoUploadComponent,
    StepFinalisationComponent
  ],
  exports: [CvBuilderComponent]
})
export class CvBuilderModule { }