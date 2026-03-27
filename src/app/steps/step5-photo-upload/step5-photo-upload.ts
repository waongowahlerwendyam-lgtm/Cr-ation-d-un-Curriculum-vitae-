import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  selector: 'app-step5-photo-upload',
  templateUrl: './step5-photo-upload.html',
  styleUrls: ['./step5-photo-upload.scss']
})
export class Step5PhotoUploadComponent implements OnInit {
  @Input() photo: string = '';
  @Output() photoUpdate = new EventEmitter<string>();

  preview: string | null = null;

  ngOnInit(): void {
    if (this.photo) {
      this.preview = this.photo;
    }
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.preview = e.target.result;
        this.photoUpdate.emit(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  }

  removePhoto(): void {
    this.preview = null;
    this.photoUpdate.emit('');
  }
}