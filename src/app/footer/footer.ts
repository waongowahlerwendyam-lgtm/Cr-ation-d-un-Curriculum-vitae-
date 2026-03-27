import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.html',
  styleUrls: ['./footer.scss'],
  standalone: true,
  imports: [CommonModule]
})
export class FooterComponent {
  currentYear = new Date().getFullYear();
  
  socialLinks = [
    { name: 'GitHub', icon: '💻', url: 'https://github.com', color: '#333' },
    { name: 'LinkedIn', icon: '🔗', url: 'https://linkedin.com', color: '#0077b5' },
    { name: 'Twitter', icon: '🐦', url: 'https://twitter.com', color: '#1da1f2' },
    { name: 'Email', icon: '📧', url: 'mailto:contact@cvbuilder.com', color: '#ea4335' }
  ];

  quickLinks = [
    { name: 'Accueil', route: '/' },
    { name: 'Créer un CV', route: '/builder' },
    { name: 'Templates', route: '/templates' },
    { name: 'Contact', route: '/contact' }
  ];

  features = [
    { name: 'Sauvegarde automatique', icon: '💾' },
    { name: 'Export PDF/JSON', icon: '📄' },
    { name: 'Templates modernes', icon: '🎨' },
    { name: 'Aperçu en temps réel', icon: '👁️' }
  ];
}