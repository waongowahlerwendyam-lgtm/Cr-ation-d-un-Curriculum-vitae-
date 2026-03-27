import { Routes } from '@angular/router';
import { CvBuilderComponent } from './cv-builder/cv-builder';


export const routes: Routes = [
  { path: '', component: CvBuilderComponent },
  { path: '**', redirectTo: '' }
];