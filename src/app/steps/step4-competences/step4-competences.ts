import { Component, EventEmitter, Input, Output, OnInit, OnDestroy } from '@angular/core';
import { Competence, Langue, ReseauSocial } from '../../models/cv-data.model';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, takeUntil } from 'rxjs/operators';

interface LanguageAPI {
  name: string;
  flag: string;
  code?: string;
  isLocal?: boolean;
  isImportant?: boolean;
}

@Component({
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, HttpClientModule],
  selector: 'app-step4-competences',
  templateUrl: './step4-competences.html',
  styleUrls: ['./step4-competences.scss']
})
export class Step4CompetencesComponent implements OnInit, OnDestroy {
  @Input() competences: Competence[] = [];
  @Input() langues: Langue[] = [];
  @Input() centresInteret: string[] = [];
  @Input() reseauxSociaux: ReseauSocial[] = [];
  
  @Output() competencesUpdate = new EventEmitter<Competence[]>();
  @Output() languesUpdate = new EventEmitter<Langue[]>();
  @Output() centresInteretUpdate = new EventEmitter<string[]>();
  @Output() reseauxSociauxUpdate = new EventEmitter<ReseauSocial[]>();

  newCompetence = '';
  newCompetenceNiveau: 'Débutant' | 'Intermédiaire' | 'Avancé' | 'Expert' = 'Intermédiaire';
  
  newLangue = '';
  newLangueNiveau: 'Débutant' | 'Intermédiaire' | 'Courant' | 'Langue maternelle' = 'Intermédiaire';
  
  newCentreInteret = '';
  
  newReseauNom = '';
  newReseauUrl = '';

  niveauxComp = ['Débutant', 'Intermédiaire', 'Avancé', 'Expert'];
  niveauxLangue = ['Débutant', 'Intermédiaire', 'Courant', 'Langue maternelle'];
  reseauxTypes = ['LinkedIn', 'GitHub', 'Twitter', 'Portfolio', 'Autre'];

  availableLanguages: LanguageAPI[] = [];
  filteredLanguages: LanguageAPI[] = [];
  isLoadingLanguages = false;
  languageSearchTerm = '';
  showLanguageDropdown = false;
  
  // Liste des langues importantes qui doivent avoir le bon drapeau
  private importantLanguages: { [key: string]: { flag: string, name: string } } = {
    'français': { flag: 'https://flagcdn.com/fr.svg', name: 'Français' },
    'french': { flag: 'https://flagcdn.com/fr.svg', name: 'Français' },
    'anglais': { flag: 'https://flagcdn.com/gb.svg', name: 'Anglais' },
    'english': { flag: 'https://flagcdn.com/gb.svg', name: 'Anglais' },
    'espagnol': { flag: 'https://flagcdn.com/es.svg', name: 'Espagnol' },
    'spanish': { flag: 'https://flagcdn.com/es.svg', name: 'Espagnol' },
    'allemand': { flag: 'https://flagcdn.com/de.svg', name: 'Allemand' },
    'german': { flag: 'https://flagcdn.com/de.svg', name: 'Allemand' },
    'italien': { flag: 'https://flagcdn.com/it.svg', name: 'Italien' },
    'italian': { flag: 'https://flagcdn.com/it.svg', name: 'Italien' },
    'portugais': { flag: 'https://flagcdn.com/pt.svg', name: 'Portugais' },
    'portuguese': { flag: 'https://flagcdn.com/pt.svg', name: 'Portugais' },
    'russe': { flag: 'https://flagcdn.com/ru.svg', name: 'Russe' },
    'russian': { flag: 'https://flagcdn.com/ru.svg', name: 'Russe' },
    'chinois': { flag: 'https://flagcdn.com/cn.svg', name: 'Chinois' },
    'chinese': { flag: 'https://flagcdn.com/cn.svg', name: 'Chinois' },
    'japonais': { flag: 'https://flagcdn.com/jp.svg', name: 'Japonais' },
    'japanese': { flag: 'https://flagcdn.com/jp.svg', name: 'Japonais' },
    'arabe': { flag: 'https://flagcdn.com/sa.svg', name: 'Arabe' },
    'arabic': { flag: 'https://flagcdn.com/sa.svg', name: 'Arabe' }
  };
  
  // Langues locales du Burkina Faso
  localLanguages: LanguageAPI[] = [
    { name: 'Mooré', flag: 'https://flagcdn.com/bf.svg', code: 'bf', isLocal: true },
    { name: 'Fulfuldé (Peul)', flag: 'https://flagcdn.com/bf.svg', code: 'bf', isLocal: true },
    { name: 'Dioula', flag: 'https://flagcdn.com/bf.svg', code: 'bf', isLocal: true },
    { name: 'Gulmancéma', flag: 'https://flagcdn.com/bf.svg', code: 'bf', isLocal: true },
    { name: 'Bissa', flag: 'https://flagcdn.com/bf.svg', code: 'bf', isLocal: true },
    { name: 'Dagara', flag: 'https://flagcdn.com/bf.svg', code: 'bf', isLocal: true },
    { name: 'Lyélé (Gourounsi)', flag: 'https://flagcdn.com/bf.svg', code: 'bf', isLocal: true },
    { name: 'Bobo', flag: 'https://flagcdn.com/bf.svg', code: 'bf', isLocal: true },
    { name: 'Bwamu', flag: 'https://flagcdn.com/bf.svg', code: 'bf', isLocal: true },
    { name: 'San', flag: 'https://flagcdn.com/bf.svg', code: 'bf', isLocal: true },
    { name: 'Sénoufo', flag: 'https://flagcdn.com/bf.svg', code: 'bf', isLocal: true },
    { name: 'Samo', flag: 'https://flagcdn.com/bf.svg', code: 'bf', isLocal: true },
    { name: 'Lobi', flag: 'https://flagcdn.com/bf.svg', code: 'bf', isLocal: true },
    { name: 'Koromfé', flag: 'https://flagcdn.com/bf.svg', code: 'bf', isLocal: true },
    { name: 'Kassem', flag: 'https://flagcdn.com/bf.svg', code: 'bf', isLocal: true },
    { name: 'Karaboro', flag: 'https://flagcdn.com/bf.svg', code: 'bf', isLocal: true },
    { name: 'Toussian', flag: 'https://flagcdn.com/bf.svg', code: 'bf', isLocal: true },
    { name: 'Bolon', flag: 'https://flagcdn.com/bf.svg', code: 'bf', isLocal: true },
    { name: 'Marka', flag: 'https://flagcdn.com/bf.svg', code: 'bf', isLocal: true },
    { name: 'Dogon', flag: 'https://flagcdn.com/bf.svg', code: 'bf', isLocal: true }
  ];
  
  // Langues importantes à ajouter automatiquement en début de liste
  private importantLanguagesList: LanguageAPI[] = [
    { name: 'Français', flag: 'https://flagcdn.com/fr.svg', code: 'fr', isImportant: true },
    { name: 'Anglais', flag: 'https://flagcdn.com/gb.svg', code: 'gb', isImportant: true },
    { name: 'Espagnol', flag: 'https://flagcdn.com/es.svg', code: 'es', isImportant: true },
    { name: 'Allemand', flag: 'https://flagcdn.com/de.svg', code: 'de', isImportant: true },
    { name: 'Italien', flag: 'https://flagcdn.com/it.svg', code: 'it', isImportant: true }
  ];
  
  private searchSubject = new Subject<string>();
  private destroy$ = new Subject<void>();

  constructor(private http: HttpClient) {
    this.searchSubject.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      takeUntil(this.destroy$)
    ).subscribe(term => {
      this.filterLanguages(term);
    });
  }

  ngOnInit() {
    this.loadLanguages();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  getFlagForLanguage(languageName: string): string {
    const lowerName = languageName.toLowerCase();
    // Vérifier si c'est une langue importante
    for (const [key, value] of Object.entries(this.importantLanguages)) {
      if (lowerName.includes(key)) {
        return value.flag;
      }
    }
    return 'https://flagcdn.com/bf.svg';
  }

  loadLanguages() {
    const cached = localStorage.getItem('cachedLanguages');
    if (cached) {
      try {
        const cachedData = JSON.parse(cached);
        this.availableLanguages = this.mergeWithLocalLanguages(cachedData);
        this.addImportantLanguages();
        this.filteredLanguages = [...this.availableLanguages];
        return;
      } catch (e) {
        console.error('Erreur cache langues:', e);
      }
    }

    this.isLoadingLanguages = true;
    this.http.get<any[]>('https://restcountries.com/v3.1/all?fields=name,flags,languages,cca2')
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (countries) => {
          const languagesMap = new Map<string, LanguageAPI>();
          
          countries.forEach(country => {
            if (country.languages) {
              Object.entries(country.languages).forEach(([code, name]: [string, any]) => {
                if (!languagesMap.has(name)) {
                  let flagUrl = country.flags?.png || country.flags?.svg || '';
                  // Correction des drapeaux pour les langues importantes
                  const lowerName = name.toLowerCase();
                  if (lowerName === 'french') {
                    flagUrl = 'https://flagcdn.com/fr.svg';
                  } else if (lowerName === 'english') {
                    flagUrl = 'https://flagcdn.com/gb.svg';
                  } else if (lowerName === 'spanish') {
                    flagUrl = 'https://flagcdn.com/es.svg';
                  } else if (lowerName === 'german') {
                    flagUrl = 'https://flagcdn.com/de.svg';
                  } else if (lowerName === 'italian') {
                    flagUrl = 'https://flagcdn.com/it.svg';
                  }
                  
                  languagesMap.set(name, {
                    name: name as string,
                    flag: flagUrl,
                    code: country.cca2
                  });
                }
              });
            }
          });
          
          const apiLanguages = Array.from(languagesMap.values())
            .sort((a, b) => a.name.localeCompare(b.name));
          
          this.availableLanguages = this.mergeWithLocalLanguages(apiLanguages);
          this.addImportantLanguages();
          this.filteredLanguages = [...this.availableLanguages];
          
          localStorage.setItem('cachedLanguages', JSON.stringify(apiLanguages));
          this.isLoadingLanguages = false;
        },
        error: (err) => {
          console.error('Erreur chargement langues:', err);
          this.isLoadingLanguages = false;
          const defaultLanguages = [
            { name: 'Français', flag: 'https://flagcdn.com/fr.svg' },
            { name: 'Anglais', flag: 'https://flagcdn.com/gb.svg' },
            { name: 'Espagnol', flag: 'https://flagcdn.com/es.svg' },
            { name: 'Allemand', flag: 'https://flagcdn.com/de.svg' },
            { name: 'Italien', flag: 'https://flagcdn.com/it.svg' },
            { name: 'Portugais', flag: 'https://flagcdn.com/pt.svg' },
            { name: 'Russe', flag: 'https://flagcdn.com/ru.svg' },
            { name: 'Chinois', flag: 'https://flagcdn.com/cn.svg' },
            { name: 'Japonais', flag: 'https://flagcdn.com/jp.svg' },
            { name: 'Arabe', flag: 'https://flagcdn.com/sa.svg' }
          ];
          this.availableLanguages = this.mergeWithLocalLanguages(defaultLanguages);
          this.addImportantLanguages();
          this.filteredLanguages = [...this.availableLanguages];
        }
      });
  }
  
  addImportantLanguages() {
    // Ajouter les langues importantes si elles ne sont pas déjà présentes
    this.importantLanguagesList.forEach(importantLang => {
      const exists = this.availableLanguages.some(l => 
        l.name.toLowerCase() === importantLang.name.toLowerCase()
      );
      if (!exists) {
        this.availableLanguages.unshift(importantLang);
      } else {
        // Mettre à jour le drapeau si nécessaire
        const existingLang = this.availableLanguages.find(l => 
          l.name.toLowerCase() === importantLang.name.toLowerCase()
        );
        if (existingLang && existingLang.flag !== importantLang.flag) {
          existingLang.flag = importantLang.flag;
        }
      }
    });
    
    // Trier pour que les importantes restent en haut
    this.availableLanguages = [
      ...this.importantLanguagesList,
      ...this.availableLanguages.filter(l => !this.importantLanguagesList.some(imp => imp.name.toLowerCase() === l.name.toLowerCase()))
    ];
  }
  
  mergeWithLocalLanguages(apiLanguages: LanguageAPI[]): LanguageAPI[] {
    const allLanguages = new Map<string, LanguageAPI>();
    
    apiLanguages.forEach(lang => {
      allLanguages.set(lang.name.toLowerCase(), lang);
    });
    
    this.localLanguages.forEach(localLang => {
      const key = localLang.name.toLowerCase();
      if (!allLanguages.has(key)) {
        allLanguages.set(key, localLang);
      }
    });
    
    return Array.from(allLanguages.values());
  }
  
  addCustomLanguage(name: string): void {
    if (name.trim() && !this.availableLanguages.some(l => l.name.toLowerCase() === name.toLowerCase())) {
      const flag = this.getFlagForLanguage(name);
      const newLanguage: LanguageAPI = {
        name: name.trim(),
        flag: flag,
        isLocal: true
      };
      this.availableLanguages.push(newLanguage);
      this.availableLanguages.sort((a, b) => a.name.localeCompare(b.name));
      this.filteredLanguages = [...this.availableLanguages];
      const apiLanguages = this.availableLanguages.filter(l => !l.isLocal);
      localStorage.setItem('cachedLanguages', JSON.stringify(apiLanguages));
    }
  }

  onSearchChange() {
    this.searchSubject.next(this.languageSearchTerm);
  }

  filterLanguages(searchTerm: string) {
    if (!searchTerm.trim()) {
      this.filteredLanguages = [...this.availableLanguages];
      return;
    }
    
    const term = searchTerm.toLowerCase().trim();
    this.filteredLanguages = this.availableLanguages.filter(lang =>
      lang.name.toLowerCase().includes(term)
    );
  }

  selectLanguage(lang: LanguageAPI) {
    this.newLangue = lang.name;
    this.showLanguageDropdown = false;
    this.languageSearchTerm = '';
  }

  closeDropdown() {
    setTimeout(() => {
      this.showLanguageDropdown = false;
    }, 200);
  }

  getLanguageFlagUrl(langue: Langue): string {
    // Correction spécifique pour le français
    if (langue.nom.toLowerCase() === 'français' || langue.nom.toLowerCase() === 'french') {
      return 'https://flagcdn.com/fr.svg';
    }
    // Correction spécifique pour l'anglais
    if (langue.nom.toLowerCase() === 'anglais' || langue.nom.toLowerCase() === 'english') {
      return 'https://flagcdn.com/gb.svg';
    }
    
    const found = this.availableLanguages.find(l => l.name.toLowerCase() === langue.nom.toLowerCase());
    if (found) return found.flag;
    
    // Vérifier dans le dictionnaire des langues importantes
    const lowerName = langue.nom.toLowerCase();
    for (const [key, value] of Object.entries(this.importantLanguages)) {
      if (lowerName.includes(key)) {
        return value.flag;
      }
    }
    
    return 'https://flagcdn.com/bf.svg';
  }

  addCompetence(): void {
    if (this.newCompetence.trim()) {
      const comp: Competence = {
        id: crypto.randomUUID(),
        nom: this.newCompetence.trim(),
        niveau: this.newCompetenceNiveau
      };
      this.competences = [...this.competences, comp];
      this.competencesUpdate.emit(this.competences);
      this.newCompetence = '';
    }
  }

  removeCompetence(id: string): void {
    this.competences = this.competences.filter(c => c.id !== id);
    this.competencesUpdate.emit(this.competences);
  }

  getCompetenceLevelClass(level: string): string {
    if (!level) return '';
    return level.toLowerCase().replace(' ', '-');
  }

  addLangue(): void {
    if (this.newLangue.trim()) {
      if (!this.langues.some(l => l.nom.toLowerCase() === this.newLangue.trim().toLowerCase())) {
        const langue: Langue = {
          id: crypto.randomUUID(),
          nom: this.newLangue.trim(),
          niveau: this.newLangueNiveau
        };
        this.langues = [...this.langues, langue];
        this.languesUpdate.emit(this.langues);
        
        if (!this.availableLanguages.some(l => l.name.toLowerCase() === this.newLangue.trim().toLowerCase())) {
          this.addCustomLanguage(this.newLangue.trim());
        }
      }
      this.newLangue = '';
    }
  }

  removeLangue(id: string): void {
    this.langues = this.langues.filter(l => l.id !== id);
    this.languesUpdate.emit(this.langues);
  }

  getLangueLevelClass(level: string): string {
    if (!level) return '';
    return level.toLowerCase().replace(' ', '-');
  }

  addCentreInteret(): void {
    if (this.newCentreInteret.trim()) {
      this.centresInteret = [...this.centresInteret, this.newCentreInteret.trim()];
      this.centresInteretUpdate.emit(this.centresInteret);
      this.newCentreInteret = '';
    }
  }

  removeCentreInteret(index: number): void {
    this.centresInteret = this.centresInteret.filter((_, i) => i !== index);
    this.centresInteretUpdate.emit(this.centresInteret);
  }

  addReseauSocial(): void {
    if (this.newReseauNom && this.newReseauUrl.trim()) {
      const rs: ReseauSocial = {
        id: crypto.randomUUID(),
        nom: this.newReseauNom,
        url: this.newReseauUrl.trim()
      };
      this.reseauxSociaux = [...this.reseauxSociaux, rs];
      this.reseauxSociauxUpdate.emit(this.reseauxSociaux);
      this.newReseauNom = '';
      this.newReseauUrl = '';
    }
  }

  removeReseauSocial(id: string): void {
    this.reseauxSociaux = this.reseauxSociaux.filter(rs => rs.id !== id);
    this.reseauxSociauxUpdate.emit(this.reseauxSociaux);
  }
}