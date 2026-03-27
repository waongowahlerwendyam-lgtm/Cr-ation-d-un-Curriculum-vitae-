export interface PersonalInfo {
  nom: string;
  prenom: string;
  email: string;
  telephone: string;
  adresse: string;
  ville: string;
  codePostal: string;
  pays: string;
  dateNaissance?: string;
  permis?: string;
  situationFamiliale?: string;
}

export interface Experience {
  id: string;
  titre: string;
  entreprise: string;
  dateDebut: string;
  dateFin: string;
  description: string;
  enCours: boolean;
  lieu?: string;
}

export interface Formation {
  id: string;
  diplome: string;
  etablissement: string;
  anneeDebut: string;
  anneeFin: string;
  description: string;
  lieu?: string;
  enCours: boolean;
}

export interface Competence {
  id: string;
  nom: string;
  niveau: 'Débutant' | 'Intermédiaire' | 'Avancé' | 'Expert';
}

export interface Langue {
  id: string;
  nom: string;
  niveau: 'Débutant' | 'Intermédiaire' | 'Courant' | 'Langue maternelle';
}

export interface ReseauSocial {
  id: string;
  nom: string;
  url: string;
}

export interface CVMetadata {
  version: number;
  dateCreation: Date;
  dateModification: Date;
  template: string;
}

export interface CVData {
  id?: string;
  personalInfo: PersonalInfo;
  profile: string;
  experiences: Experience[];
  formations: Formation[];
  competences: Competence[];
  langues: Langue[];
  centresInteret: string[];
  reseauxSociaux: ReseauSocial[];
  photo?: string;
  metadata: CVMetadata;
}

export interface StepProgress {
  step1: number;
  step2: number;
  step3: number;
  step4: number;
  step5: number;
}

export interface StepValidation {
  step1: boolean;
  step2: boolean;
  step3: boolean;
  step4: boolean;
  step5: boolean;
}