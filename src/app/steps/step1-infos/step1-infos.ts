import { Component, EventEmitter, Input, Output, OnInit, OnDestroy, HostListener, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { PersonalInfo } from '../../models/cv-data.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

interface Country {
  name: string;
  code: string;
  dialCode: string;
  flag: string;
  phoneLength: number;
  example: string;
}

@Component({
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, HttpClientModule],
  selector: 'app-step1-infos',
  templateUrl: './step1-infos.html',
  styleUrls: ['./step1-infos.scss']
})
export class Step1InfosComponent implements OnInit, OnDestroy {
  @Input() personalInfo!: PersonalInfo;
  @Output() personalInfoUpdate = new EventEmitter<PersonalInfo>();
  @Output() validityChange = new EventEmitter<boolean>();

  form: FormGroup;
  showErrors = false;
  
  countries: Country[] = [];
  filteredCountries: Country[] = [];
  selectedCountry: Country = {
    name: 'Burkina Faso',
    code: 'bf',
    dialCode: '+226',
    flag: 'https://flagcdn.com/bf.svg',
    phoneLength: 8,
    example: '70 12 34 56'
  };
  showCountryDropdown = false;
  countrySearchTerm = '';
  isLoadingCountries = false;
  
  private destroy$ = new Subject<void>();

  constructor(
    private fb: FormBuilder, 
    private http: HttpClient,
    private cdr: ChangeDetectorRef
  ) {
    this.form = this.fb.group({
      nom: ['', [Validators.required, Validators.minLength(2)]],
      prenom: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      telephone: ['', [Validators.required, this.telephoneValidator.bind(this)]],
      adresse: [''],
      ville: [''],
      codePostal: [''],
      pays: ['Burkina Faso'],
      dateNaissance: [''],
      permis: ['']
    });
  }

  telephoneValidator(control: AbstractControl): ValidationErrors | null {
    const value = control.value;
    if (!value) return null;
    
    // Supprimer tous les espaces
    let cleanNumber = value.toString().replace(/\s/g, '');
    
    if (cleanNumber.length === 0) return null;
    
    // Vérifier que ce sont des chiffres
    if (!/^\d+$/.test(cleanNumber)) {
      return { invalidPhone: true };
    }
    
    // Obtenir la longueur requise (8 pour BF, 9 pour France, etc.)
    const requiredLength = this.selectedCountry.phoneLength;
    const countryName = this.selectedCountry.name;
    const dialCode = this.selectedCountry.dialCode;
    const example = this.selectedCountry.example;
    
    if (cleanNumber.length !== requiredLength) {
      return { 
        wrongLength: {
          required: requiredLength,
          actual: cleanNumber.length,
          countryName: countryName,
          dialCode: dialCode,
          example: example
        }
      };
    }
    
    return null;
  }

  ngOnInit(): void {
    this.loadCountries();
    
    this.form.valueChanges.subscribe((values) => {
      const fullPhone = this.getFullPhoneNumber(values.telephone);
      this.personalInfoUpdate.emit({
        ...values,
        telephone: fullPhone
      });
      this.validityChange.emit(this.form.valid);
    });
    
    if (this.personalInfo) {
      this.loadPersonalInfo();
    }
    
    this.validityChange.emit(this.form.valid);
  }

  loadPersonalInfo() {
    if (this.personalInfo) {
      const phone = this.personalInfo.telephone || '';
      
      const matchedCountry = this.countries.find(c => phone.startsWith(c.dialCode));
      if (matchedCountry) {
        this.selectedCountry = matchedCountry;
        const phoneWithoutCode = phone.substring(matchedCountry.dialCode.length).trim();
        this.form.patchValue({
          nom: this.personalInfo.nom || '',
          prenom: this.personalInfo.prenom || '',
          email: this.personalInfo.email || '',
          telephone: phoneWithoutCode,
          adresse: this.personalInfo.adresse || '',
          ville: this.personalInfo.ville || '',
          codePostal: this.personalInfo.codePostal || '',
          pays: matchedCountry.name,
          dateNaissance: this.personalInfo.dateNaissance || '',
          permis: this.personalInfo.permis || ''
        });
      } else {
        this.form.patchValue(this.personalInfo);
      }
      this.cdr.detectChanges();
    }
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  @HostListener('document:click', ['$event'])
  onClickOutside(event: Event) {
    const target = event.target as HTMLElement;
    const dropdown = document.querySelector('.country-code-selector');
    if (dropdown && !dropdown.contains(target)) {
      this.showCountryDropdown = false;
    }
  }

  loadCountries() {
    this.isLoadingCountries = true;
    this.http.get<any[]>('https://restcountries.com/v3.1/all?fields=name,flags,cca2,idd')
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data) => {
          this.countries = data
            .filter(country => country.idd && country.idd.root)
            .map(country => {
              let dialCode = country.idd.root;
              if (country.idd.suffixes && country.idd.suffixes.length > 0) {
                dialCode += country.idd.suffixes[0];
              }
              
              const countryCode = country.cca2.toLowerCase();
              
              let phoneLength = 9;
              let example = '12 34 56 789';
              
              switch(countryCode) {
                case 'bf':
                  phoneLength = 8;
                  example = '70 12 34 56';
                  break;
                case 'ci':
                case 'ml':
                case 'ne':
                case 'tg':
                case 'bj':
                case 'tn':
                  phoneLength = 8;
                  example = '12 34 56 78';
                  break;
                case 'sn':
                  phoneLength = 9;
                  example = '77 123 45 67';
                  break;
                case 'ca':
                case 'us':
                  phoneLength = 10;
                  example = '123 456 7890';
                  break;
                default:
                  phoneLength = 9;
                  example = '12 34 56 789';
              }
              
              return {
                name: country.name.common,
                code: countryCode,
                dialCode: dialCode,
                flag: country.flags?.png || country.flags?.svg || `https://flagcdn.com/${countryCode}.svg`,
                phoneLength: phoneLength,
                example: example
              };
            })
            .sort((a, b) => a.name.localeCompare(b.name));
          
          this.filteredCountries = [...this.countries];
          this.isLoadingCountries = false;
          this.setDefaultCountry();
          this.loadPersonalInfo();
          this.cdr.detectChanges();
        },
        error: (err) => {
          console.error('Erreur chargement pays:', err);
          this.isLoadingCountries = false;
          this.countries = [
            { name: 'Burkina Faso', code: 'bf', dialCode: '+226', flag: 'https://flagcdn.com/bf.svg', phoneLength: 8, example: '70 12 34 56' },
            { name: 'France', code: 'fr', dialCode: '+33', flag: 'https://flagcdn.com/fr.svg', phoneLength: 9, example: '12 34 56 789' },
            { name: 'Belgique', code: 'be', dialCode: '+32', flag: 'https://flagcdn.com/be.svg', phoneLength: 9, example: '12 34 56 789' },
            { name: 'Suisse', code: 'ch', dialCode: '+41', flag: 'https://flagcdn.com/ch.svg', phoneLength: 9, example: '12 34 56 789' },
            { name: 'Canada', code: 'ca', dialCode: '+1', flag: 'https://flagcdn.com/ca.svg', phoneLength: 10, example: '123 456 7890' },
            { name: 'Sénégal', code: 'sn', dialCode: '+221', flag: 'https://flagcdn.com/sn.svg', phoneLength: 9, example: '77 123 45 67' },
            { name: 'Côte d\'Ivoire', code: 'ci', dialCode: '+225', flag: 'https://flagcdn.com/ci.svg', phoneLength: 8, example: '01 23 45 67' },
            { name: 'Mali', code: 'ml', dialCode: '+223', flag: 'https://flagcdn.com/ml.svg', phoneLength: 8, example: '12 34 56 78' },
            { name: 'Niger', code: 'ne', dialCode: '+227', flag: 'https://flagcdn.com/ne.svg', phoneLength: 8, example: '12 34 56 78' }
          ];
          this.filteredCountries = [...this.countries];
          this.setDefaultCountry();
          this.loadPersonalInfo();
          this.cdr.detectChanges();
        }
      });
  }

  setDefaultCountry() {
    // Définir Burkina Faso comme pays par défaut
    const defaultCountry = this.countries.find(c => c.code === 'bf');
    if (defaultCountry) {
      this.selectedCountry = defaultCountry;
      this.form.patchValue({ pays: defaultCountry.name });
    } else if (this.countries.length > 0) {
      this.selectedCountry = this.countries[0];
      this.form.patchValue({ pays: this.countries[0].name });
    }
  }

  toggleCountryDropdown(event: Event) {
    event.stopPropagation();
    this.showCountryDropdown = !this.showCountryDropdown;
    if (this.showCountryDropdown) {
      this.countrySearchTerm = '';
      this.filteredCountries = [...this.countries];
    }
  }

  filterCountries() {
    const term = this.countrySearchTerm.toLowerCase().trim();
    if (!term) {
      this.filteredCountries = [...this.countries];
    } else {
      this.filteredCountries = this.countries.filter(country =>
        country.name.toLowerCase().includes(term) ||
        country.dialCode.includes(term)
      );
    }
  }

  selectCountry(country: Country) {
    this.selectedCountry = country;
    this.showCountryDropdown = false;
    this.countrySearchTerm = '';
    
    this.form.patchValue({ pays: country.name });
    
    const phoneControl = this.form.get('telephone');
    if (phoneControl) {
      phoneControl.setValue('', { emitEvent: true });
      phoneControl.updateValueAndValidity();
    }
    
    this.cdr.detectChanges();
  }

  onPhoneInput(event: Event) {
    const input = event.target as HTMLInputElement;
    let value = input.value;
    
    // Supprimer tous les espaces existants et garder seulement les chiffres
    let cleaned = value.replace(/\s/g, '').replace(/\D/g, '');
    
    // Limiter à la longueur requise
    const maxLength = this.selectedCountry?.phoneLength || 8;
    if (cleaned.length > maxLength) {
      cleaned = cleaned.slice(0, maxLength);
    }
    
    // Formater selon le pays
    let formatted = cleaned;
    const code = this.selectedCountry?.code || 'bf';
    const length = cleaned.length;
    
    // Burkina Faso et autres pays africains: format XX XX XX XX
    if (code === 'bf' || code === 'ci' || code === 'ml' || code === 'ne' || code === 'tg' || code === 'bj' || code === 'tn') {
      if (length === 0) {
        formatted = '';
      } else if (length === 1) {
        formatted = cleaned;
      } else if (length === 2) {
        formatted = cleaned;
      } else if (length === 3) {
        formatted = `${cleaned.slice(0, 2)} ${cleaned.slice(2)}`;
      } else if (length === 4) {
        formatted = `${cleaned.slice(0, 2)} ${cleaned.slice(2, 4)}`;
      } else if (length === 5) {
        formatted = `${cleaned.slice(0, 2)} ${cleaned.slice(2, 4)} ${cleaned.slice(4)}`;
      } else if (length === 6) {
        formatted = `${cleaned.slice(0, 2)} ${cleaned.slice(2, 4)} ${cleaned.slice(4, 6)}`;
      } else if (length === 7) {
        formatted = `${cleaned.slice(0, 2)} ${cleaned.slice(2, 4)} ${cleaned.slice(4, 6)} ${cleaned.slice(6)}`;
      } else if (length === 8) {
        formatted = `${cleaned.slice(0, 2)} ${cleaned.slice(2, 4)} ${cleaned.slice(4, 6)} ${cleaned.slice(6, 8)}`;
      }
    } 
    // Sénégal: format XX XXX XX XX
    else if (code === 'sn') {
      if (length === 0) {
        formatted = '';
      } else if (length === 1) {
        formatted = cleaned;
      } else if (length === 2) {
        formatted = cleaned;
      } else if (length === 3) {
        formatted = `${cleaned.slice(0, 2)} ${cleaned.slice(2)}`;
      } else if (length === 4) {
        formatted = `${cleaned.slice(0, 2)} ${cleaned.slice(2, 4)}`;
      } else if (length === 5) {
        formatted = `${cleaned.slice(0, 2)} ${cleaned.slice(2, 5)}`;
      } else if (length === 6) {
        formatted = `${cleaned.slice(0, 2)} ${cleaned.slice(2, 5)} ${cleaned.slice(5)}`;
      } else if (length === 7) {
        formatted = `${cleaned.slice(0, 2)} ${cleaned.slice(2, 5)} ${cleaned.slice(5, 7)}`;
      } else if (length === 8) {
        formatted = `${cleaned.slice(0, 2)} ${cleaned.slice(2, 5)} ${cleaned.slice(5, 7)} ${cleaned.slice(7)}`;
      } else if (length === 9) {
        formatted = `${cleaned.slice(0, 2)} ${cleaned.slice(2, 5)} ${cleaned.slice(5, 7)} ${cleaned.slice(7, 9)}`;
      }
    } 
    // Format par défaut
    else {
      if (length === 0) {
        formatted = '';
      } else if (length <= 2) {
        formatted = cleaned;
      } else if (length <= 5) {
        formatted = `${cleaned.slice(0, 2)} ${cleaned.slice(2)}`;
      } else if (length <= 8) {
        formatted = `${cleaned.slice(0, 2)} ${cleaned.slice(2, 5)} ${cleaned.slice(5)}`;
      } else {
        formatted = `${cleaned.slice(0, 2)} ${cleaned.slice(2, 5)} ${cleaned.slice(5, 8)} ${cleaned.slice(8, 11)}`;
      }
    }
    
    // Mettre à jour le formulaire
    this.form.get('telephone')?.setValue(formatted, { emitEvent: true });
  }

  getFullPhoneNumber(phoneNumber: string): string {
    if (!phoneNumber) return '';
    const cleaned = phoneNumber.replace(/\s/g, '');
    return `${this.selectedCountry?.dialCode || '+226'}${cleaned}`;
  }

  getPlaceholder(): string {
    if (this.selectedCountry && this.selectedCountry.example) {
      return `Ex: ${this.selectedCountry.example}`;
    }
    return 'Ex: 70 12 34 56';
  }

  isFormValid(): boolean {
    return this.form.valid;
  }

  showAllErrors() {
    this.showErrors = true;
  }

  getError(field: string): string {
    const control = this.form.get(field);
    if (!control || !(control.touched || this.showErrors)) return '';
    
    if (control.hasError('required')) return 'Champ requis';
    if (control.hasError('email')) return 'Email invalide';
    if (control.hasError('minlength')) return 'Minimum 2 caractères';
    
    return '';
  }

  getPhoneError(): string {
    const control = this.form.get('telephone');
    if (!control || !(control.touched || this.showErrors)) return '';
    
    if (control.hasError('required')) {
      return 'Numéro de téléphone requis';
    }
    if (control.hasError('invalidPhone')) {
      return 'Numéro invalide (chiffres uniquement)';
    }
    if (control.hasError('wrongLength')) {
      const error = control.errors?.['wrongLength'];
      // Utiliser les valeurs de l'erreur
      const required = error?.required || this.selectedCountry?.phoneLength || 8;
      const actual = error?.actual || 0;
      const countryName = error?.countryName || this.selectedCountry?.name || 'Burkina Faso';
      const dialCode = error?.dialCode || this.selectedCountry?.dialCode || '+226';
      const example = error?.example || this.selectedCountry?.example || '70 12 34 56';
      
      const chiffrePluriel = required > 1 ? 'chiffres' : 'chiffre';
      return `Le numéro pour ${countryName} doit contenir exactement ${required} ${chiffrePluriel} après l'indicatif ${dialCode} (${actual} actuellement). Exemple: ${dialCode} ${example}`;
    }
    
    return '';
  }
}