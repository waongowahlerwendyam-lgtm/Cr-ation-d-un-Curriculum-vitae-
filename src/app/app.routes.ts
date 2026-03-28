import { Routes } from '@angular/router';
import { HomeComponent } from './home/home';
import { CvBuilderComponent } from './cv-builder/cv-builder';
import { AuthGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'cv-builder', component: CvBuilderComponent, canActivate: [AuthGuard] },
  { path: '**', redirectTo: '' }
];