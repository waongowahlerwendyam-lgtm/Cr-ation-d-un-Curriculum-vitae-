import { Component, EventEmitter, Input, Output, ViewChild, ElementRef, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { CVData } from '../../models/cv-data.model';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

@Component({
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  selector: 'app-step-finalisation',
  templateUrl: './step-finalisation.html',
  styleUrls: ['./step-finalisation.scss']
})
export class StepFinalisationComponent implements AfterViewInit {
  @Input() cvData!: CVData;
  @Output() preview = new EventEmitter<void>();
  @Output() print = new EventEmitter<void>();
  @Output() exportJSON = new EventEmitter<void>();
  @Output() reset = new EventEmitter<void>();
  @Output() stepChange = new EventEmitter<number>();
  @Output() photoAdded = new EventEmitter<string>();

  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;
  @ViewChild('imageCanvas') imageCanvas!: ElementRef<HTMLCanvasElement>;

  showPhotoModal = false;
  photoChoice: 'yes' | 'no' | null = null;
  
  // Variables pour l'édition d'image
  selectedImage: string | null = null;
  originalImage: HTMLImageElement | null = null;
  zoomLevel = 1;
  cropX = 0;
  cropY = 0;
  isDragging = false;
  dragStartX = 0;
  dragStartY = 0;
  croppedImagePreview: string | null = null;
  
  canvasSize = 300;
  targetSize = 150;

  constructor(private cdr: ChangeDetectorRef) {}

  ngAfterViewInit() {
    this.initCanvas();
  }

  initCanvas() {
    if (this.imageCanvas) {
      const canvas = this.imageCanvas.nativeElement;
      canvas.width = this.canvasSize;
      canvas.height = this.canvasSize;
    }
  }

  getCompletionRate(): number {
    let total = 0;
    if (this.cvData.personalInfo?.nom && this.cvData.personalInfo?.prenom && this.cvData.personalInfo?.email) total += 20;
    if (this.cvData.profile && this.cvData.profile.trim().length >= 10) total += 20;
    if (this.cvData.experiences?.length > 0 || this.cvData.formations?.length > 0) total += 20;
    if (this.cvData.competences?.length > 0) total += 20;
    if (this.cvData.photo && this.cvData.photo.trim() !== '') total += 20;
    return Math.min(Math.floor(total), 100);
  }

  isCVComplete(): boolean {
    const hasPersonalInfo = !!(this.cvData.personalInfo?.nom && this.cvData.personalInfo?.prenom && this.cvData.personalInfo?.email);
    const hasProfile = !!(this.cvData.profile && this.cvData.profile.trim().length >= 10);
    const hasExperiencesOrFormations = (this.cvData.experiences?.length > 0) || (this.cvData.formations?.length > 0);
    const hasCompetences = this.cvData.competences?.length > 0;
    const hasPhoto = !!(this.cvData.photo && this.cvData.photo.trim() !== '');
    
    return hasPersonalInfo && hasProfile && hasExperiencesOrFormations && hasCompetences && hasPhoto;
  }

  isCVCompleteWithoutPhoto(): boolean {
    const hasPersonalInfo = !!(this.cvData.personalInfo?.nom && this.cvData.personalInfo?.prenom && this.cvData.personalInfo?.email);
    const hasProfile = !!(this.cvData.profile && this.cvData.profile.trim().length >= 10);
    const hasExperiencesOrFormations = (this.cvData.experiences?.length > 0) || (this.cvData.formations?.length > 0);
    const hasCompetences = this.cvData.competences?.length > 0;
    
    return hasPersonalInfo && hasProfile && hasExperiencesOrFormations && hasCompetences;
  }

  getMissingItems(): string[] {
    const missing = [];
    if (!this.cvData.personalInfo?.nom || !this.cvData.personalInfo?.prenom || !this.cvData.personalInfo?.email) missing.push('Informations personnelles');
    if (!this.cvData.profile || this.cvData.profile.trim().length < 10) missing.push('Profil professionnel');
    if (this.cvData.experiences?.length === 0 && this.cvData.formations?.length === 0) missing.push('Expériences ou formations');
    if (this.cvData.competences?.length === 0) missing.push('Compétences');
    return missing;
  }

  getMissingItemsWithStep(): { name: string; step: number }[] {
    const missing = [];
    if (!this.cvData.personalInfo?.nom || !this.cvData.personalInfo?.prenom || !this.cvData.personalInfo?.email) missing.push({ name: 'Informations personnelles', step: 1 });
    if (!this.cvData.profile || this.cvData.profile.trim().length < 10) missing.push({ name: 'Profil professionnel', step: 2 });
    if (this.cvData.experiences?.length === 0 && this.cvData.formations?.length === 0) missing.push({ name: 'Expériences ou formations', step: 3 });
    if (this.cvData.competences?.length === 0) missing.push({ name: 'Compétences', step: 4 });
    return missing;
  }

  isPhotoMissing(): boolean {
    return !this.cvData.photo || this.cvData.photo.trim() === '';
  }

  suggestPhoto() {
    this.showPhotoModal = true;
  }

  closePhotoModal() {
    this.showPhotoModal = false;
    this.resetImageEditor();
  }

  openFileSelector() {
    this.fileInput?.nativeElement.click();
  }

  onPhotoSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      
      if (file.size > 5 * 1024 * 1024) {
        alert('La photo ne doit pas dépasser 5MB. Veuillez choisir une image plus petite.');
        input.value = '';
        return;
      }
      
      if (!file.type.match('image/jpeg') && !file.type.match('image/png') && !file.type.match('image/jpg')) {
        alert('Seuls les formats JPG, JPEG et PNG sont acceptés.');
        input.value = '';
        return;
      }
      
      const reader = new FileReader();
      reader.onload = (e: ProgressEvent<FileReader>) => {
        this.selectedImage = e.target?.result as string;
        this.loadImageToCanvas();
        this.cdr.detectChanges();
      };
      reader.readAsDataURL(file);
      input.value = '';
    }
  }

  loadImageToCanvas() {
    if (!this.selectedImage) return;
    
    const img = new Image();
    img.onload = () => {
      this.originalImage = img;
      this.autoFit();
      this.updatePreview();
      this.cdr.detectChanges();
    };
    img.src = this.selectedImage;
  }

  drawImageOnCanvas() {
    if (!this.imageCanvas || !this.originalImage) return;
    
    const canvas = this.imageCanvas.nativeElement;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    const imgWidth = this.originalImage.width * this.zoomLevel;
    const imgHeight = this.originalImage.height * this.zoomLevel;
    
    let x = (canvas.width - imgWidth) / 2 + this.cropX;
    let y = (canvas.height - imgHeight) / 2 + this.cropY;
    
    ctx.save();
    ctx.beginPath();
    ctx.arc(canvas.width / 2, canvas.height / 2, canvas.width / 2, 0, Math.PI * 2);
    ctx.clip();
    
    ctx.drawImage(this.originalImage, x, y, imgWidth, imgHeight);
    
    ctx.beginPath();
    ctx.arc(canvas.width / 2, canvas.height / 2, canvas.width / 2, 0, Math.PI * 2);
    ctx.strokeStyle = '#ffd700';
    ctx.lineWidth = 3;
    ctx.stroke();
    
    ctx.restore();
    
    this.updatePreview();
  }

  updateZoom() {
    this.drawImageOnCanvas();
  }

  updatePreview() {
    this.croppedImagePreview = this.generateCroppedImage();
  }

  generateCroppedImage(): string {
    if (!this.imageCanvas || !this.originalImage) return '';
    
    const canvas = this.imageCanvas.nativeElement;
    const tempCanvas = document.createElement('canvas');
    const tempCtx = tempCanvas.getContext('2d');
    if (!tempCtx) return '';
    
    tempCanvas.width = this.targetSize;
    tempCanvas.height = this.targetSize;
    
    tempCtx.drawImage(canvas, 0, 0, canvas.width, canvas.height, 0, 0, this.targetSize, this.targetSize);
    
    return tempCanvas.toDataURL('image/jpeg', 0.9);
  }

  startDrag(event: MouseEvent) {
    if (!this.originalImage) return;
    this.isDragging = true;
    this.dragStartX = event.clientX;
    this.dragStartY = event.clientY;
    event.preventDefault();
  }

  onDrag(event: MouseEvent) {
    if (!this.isDragging || !this.originalImage) return;
    
    const dx = event.clientX - this.dragStartX;
    const dy = event.clientY - this.dragStartY;
    
    this.cropX += dx;
    this.cropY += dy;
    
    this.dragStartX = event.clientX;
    this.dragStartY = event.clientY;
    
    this.drawImageOnCanvas();
  }

  endDrag() {
    this.isDragging = false;
  }

  onZoom(event: WheelEvent) {
    if (!this.originalImage) return;
    event.preventDefault();
    const delta = event.deltaY > 0 ? -0.05 : 0.05;
    this.zoomLevel = Math.min(2.5, Math.max(0.5, this.zoomLevel + delta));
    this.drawImageOnCanvas();
  }

  resetCrop() {
    this.zoomLevel = 1;
    this.cropX = 0;
    this.cropY = 0;
    this.drawImageOnCanvas();
  }

  autoFit() {
    if (!this.originalImage) return;
    
    const scaleX = this.canvasSize / this.originalImage.width;
    const scaleY = this.canvasSize / this.originalImage.height;
    this.zoomLevel = Math.max(scaleX, scaleY);
    this.cropX = 0;
    this.cropY = 0;
    this.drawImageOnCanvas();
  }

  rotateImage() {
    if (!this.originalImage) return;
    
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    canvas.width = this.originalImage.height;
    canvas.height = this.originalImage.width;
    
    ctx.translate(canvas.width / 2, canvas.height / 2);
    ctx.rotate(Math.PI / 2);
    ctx.drawImage(this.originalImage, -this.originalImage.width / 2, -this.originalImage.height / 2);
    
    const rotatedImg = new Image();
    rotatedImg.onload = () => {
      this.originalImage = rotatedImg;
      this.autoFit();
    };
    rotatedImg.src = canvas.toDataURL();
  }

  confirmPhoto() {
    if (this.croppedImagePreview) {
      this.photoAdded.emit(this.croppedImagePreview);
      this.photoChoice = 'yes';
      this.showPhotoModal = false;
      this.resetImageEditor();
    }
  }

  cancelPhoto() {
    this.resetImageEditor();
  }

  resetImageEditor() {
    this.selectedImage = null;
    this.originalImage = null;
    this.zoomLevel = 1;
    this.cropX = 0;
    this.cropY = 0;
    this.croppedImagePreview = null;
    this.cdr.detectChanges();
  }

  resetAndChooseNew() {
    this.selectedImage = null;
    this.originalImage = null;
    this.zoomLevel = 1;
    this.cropX = 0;
    this.cropY = 0;
    this.croppedImagePreview = null;
    this.cdr.detectChanges();
    this.openFileSelector();
  }

  skipPhoto() {
    this.photoChoice = 'no';
    this.showPhotoModal = false;
  }

  goToStep(step: number) {
    this.stepChange.emit(step);
  }

  getSuccessMessage(): string {
    if (this.isCVComplete()) {
      return '✅ Félicitations ! Votre CV est complet et prêt à être exporté.';
    } else if (this.isCVCompleteWithoutPhoto() && this.photoChoice === 'no') {
      return '✅ Votre CV est complet ! Vous pourrez ajouter une photo plus tard si vous le souhaitez.';
    } else if (this.isCVCompleteWithoutPhoto()) {
      return '✅ Votre CV est presque complet !';
    } else {
      return '📝 Complétez les éléments manquants pour un CV plus percutant.';
    }
  }
}