import { Component, signal } from '@angular/core';
import { CvBuilderComponent } from './cv-builder/cv-builder';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { Router, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true, 
  imports: [CommonModule,ReactiveFormsModule,RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  title = 'CV Builder Pro';
  backgroundImage = './assets/image_back.jpg';
profileImage = './assets/image_profile.jpg';
}
