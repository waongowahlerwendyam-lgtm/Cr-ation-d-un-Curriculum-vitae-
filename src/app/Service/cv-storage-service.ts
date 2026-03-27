import { Injectable } from '@angular/core';
import { CVData, PersonalInfo, Experience, Formation, ReseauSocial, CVMetadata } from '../models/cv-data.model';

@Injectable({
  providedIn: 'root'
})
export class CvStorageService {
  private storageKey = 'cv_data';

  getCVData(): CVData {
    const defaultPersonalInfo: PersonalInfo = {
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
    };

    const defaultMetadata: CVMetadata = {
      version: 1,
      dateCreation: new Date(),
      dateModification: new Date(),
      template: 'default'
    };

    const defaultData: CVData = {
      id: Date.now().toString(),
      personalInfo: defaultPersonalInfo,
      profile: '',
      experiences: [],
      formations: [],
      competences: [],
      langues: [],
      centresInteret: [],
      reseauxSociaux: [],
      photo: '',
      metadata: defaultMetadata
    };

    const saved = localStorage.getItem(this.storageKey);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return { ...defaultData, ...parsed };
      } catch (e) {
        return defaultData;
      }
    }
    return defaultData;
  }

  saveCV(data: CVData): void {
    if (data.metadata) {
      data.metadata.dateModification = new Date();
      data.metadata.version = (data.metadata.version || 0) + 1;
    }
    localStorage.setItem(this.storageKey, JSON.stringify(data));
  }

  loadCV(): CVData | null {
    return this.getCVData();
  }

  exportToJSON(data: CVData): void {
    const dataStr = JSON.stringify(data, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
    const exportFileDefaultName = `cv-${data.id || 'export'}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  }

  resetCV(): CVData {
    const defaultData = this.getCVData();
    this.saveCV(defaultData);
    return defaultData;
  }
}