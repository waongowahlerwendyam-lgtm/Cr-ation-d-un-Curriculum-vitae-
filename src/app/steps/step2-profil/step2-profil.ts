import { Component, Input, Output, EventEmitter, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-step2-profil',
  templateUrl: './step2-profil.html',
  styleUrls: ['./step2-profil.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class Step2ProfilComponent implements OnInit, OnChanges {
  @Input() profile: string = '';
  @Output() profileUpdate = new EventEmitter<string>();

  maxChars = 500;
  minChars = 10;
  tempProfile: string = '';
  showError: boolean = false;
  isEditing: boolean = false;
  isSaved: boolean = false;

  ngOnInit(): void {
    this.initTempProfile();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['profile'] && !changes['profile'].firstChange) {
      this.initTempProfile();
    }
  }

  initTempProfile(): void {
    this.tempProfile = this.profile || '';
    this.isEditing = false;
  }

  isValid(): boolean {
    const trimmed = this.tempProfile?.trim() || '';
    return trimmed.length >= this.minChars && trimmed.length <= this.maxChars;
  }

  hasUnsavedChanges(): boolean {
    return this.tempProfile !== this.profile;
  }

  saveProfile() {
    if (this.isValid()) {
      const savedProfile = this.tempProfile.trim();
      console.log('💾 Sauvegarde du profil - longueur:', savedProfile.length);
      
      this.profileUpdate.emit(savedProfile);
      this.showError = false;
      this.isEditing = false;
      this.isSaved = true;
      
      setTimeout(() => {
        this.isSaved = false;
      }, 2000);
    } else {
      this.showError = true;
      console.log('⚠️ Profil invalide - longueur:', this.tempProfile?.trim().length || 0);
    }
  }

  cancelEdit() {
    this.tempProfile = this.profile;
    this.showError = false;
    this.isEditing = false;
  }

  editProfile() {
    this.isEditing = true;
    this.tempProfile = this.profile;
    this.showError = false;
  }

  getCharCount(): number {
    return this.tempProfile?.length || 0;
  }

  getRemainingChars(): number {
    return this.maxChars - this.getCharCount();
  }
}