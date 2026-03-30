import { Injectable } from '@angular/core';
import { CVData, Experience, Formation, Competence, Langue } from '../models/cv-data.model';

@Injectable({
  providedIn: 'root'
})
export class CvPreviewService {
  
  generateHTML(data: CVData): string {
    const personalInfo = data.personalInfo;
    const fullName = `${personalInfo.prenom || ''} ${personalInfo.nom || ''}`.trim();
    
    return `
      <!DOCTYPE html>
      <html lang="fr">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>CV - ${this.escapeHtml(fullName)}</title>
        <style>
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          
          body {
            font-family: 'Segoe UI', 'Poppins', 'Roboto', 'Arial', sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            padding: 40px 20px;
            min-height: 100vh;
          }
          
          .cv-container {
            max-width: 1100px;
            margin: 0 auto;
            background: #fff;
            border-radius: 20px;
            box-shadow: 0 20px 60px rgba(0,0,0,0.3);
            overflow: hidden;
            animation: fadeInUp 0.6s ease-out;
          }
          
          @keyframes fadeInUp {
            from {
              opacity: 0;
              transform: translateY(30px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          
          /* En-tête coloré */
          .cv-header {
            background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%);
            padding: 40px;
            color: white;
            position: relative;
          }
          
          .cv-header-content {
            display: flex;
            justify-content: space-between;
            align-items: center;
            flex-wrap: wrap;
            gap: 30px;
          }
          
          .cv-header-info {
            flex: 1;
          }
          
          .cv-header-info h1 {
            font-size: 2.5rem;
            margin-bottom: 10px;
            letter-spacing: 1px;
          }
          
          .cv-header-info .title {
            font-size: 1rem;
            opacity: 0.9;
            margin-bottom: 20px;
            border-left: 3px solid #ffd700;
            padding-left: 15px;
            line-height: 1.5;
          }
          
          .contact-info {
            display: flex;
            flex-wrap: wrap;
            gap: 15px;
            margin-top: 15px;
          }
          
          .contact-item {
            display: flex;
            align-items: center;
            gap: 8px;
            font-size: 0.85rem;
            background: rgba(255,255,255,0.15);
            padding: 5px 12px;
            border-radius: 25px;
          }
          
          .contact-item span:first-child {
            font-size: 1rem;
          }
          
          .cv-photo {
            width: 130px;
            height: 130px;
            border-radius: 50%;
            object-fit: cover;
            border: 4px solid #ffd700;
            box-shadow: 0 5px 15px rgba(0,0,0,0.2);
            background: #f0f0f0;
          }
          
          .no-photo {
            width: 130px;
            height: 130px;
            border-radius: 50%;
            background: rgba(255,255,255,0.2);
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 3rem;
            border: 4px solid #ffd700;
          }
          
          /* Corps du CV */
          .cv-body {
            display: flex;
            flex-wrap: wrap;
          }
          
          /* Colonne de gauche */
          .sidebar {
            width: 33%;
            background: #f8f9fa;
            padding: 30px;
          }
          
          /* Colonne de droite */
          .main-content {
            width: 67%;
            padding: 30px;
          }
          
          /* Sections */
          .section {
            margin-bottom: 30px;
          }
          
          .section-title {
            font-size: 1.2rem;
            font-weight: 600;
            color: #2a5298;
            margin-bottom: 15px;
            padding-bottom: 8px;
            border-bottom: 3px solid #ffd700;
            display: inline-block;
          }
          
          /* Compétences */
          .skills-list {
            display: flex;
            flex-wrap: wrap;
            gap: 10px;
            margin-top: 10px;
          }
          
          .skill-tag {
            background: linear-gradient(135deg, #667eea, #764ba2);
            color: white;
            padding: 6px 14px;
            border-radius: 20px;
            font-size: 0.85rem;
            font-weight: 500;
          }
          
          /* Langues */
          .language-item {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 10px 0;
            border-bottom: 1px solid #e0e0e0;
          }
          
          .language-name {
            font-weight: 500;
            display: flex;
            align-items: center;
            gap: 8px;
          }
          
          .language-level {
            background: #2a5298;
            color: #ffd700;
            padding: 3px 12px;
            border-radius: 20px;
            font-size: 0.75rem;
            font-weight: 500;
          }
          
          /* Expériences et Formations */
          .experience-item, .formation-item {
            margin-bottom: 25px;
          }
          
          .item-title {
            font-weight: 700;
            font-size: 1rem;
            color: #1e3c72;
            margin-bottom: 5px;
          }
          
          .item-date {
            font-size: 0.75rem;
            color: #ffd700;
            background: #2a5298;
            display: inline-block;
            padding: 2px 10px;
            border-radius: 15px;
            margin-bottom: 8px;
          }
          
          .item-company, .item-school {
            font-size: 0.85rem;
            color: #666;
            margin-bottom: 8px;
            font-style: italic;
          }
          
          .item-description {
            font-size: 0.85rem;
            color: #555;
            line-height: 1.5;
          }
          
          /* Centres d'intérêt */
          .interests-list {
            display: flex;
            flex-wrap: wrap;
            gap: 10px;
            margin-top: 10px;
          }
          
          .interest-tag {
            background: #e9ecef;
            padding: 5px 12px;
            border-radius: 20px;
            font-size: 0.8rem;
            color: #2a5298;
          }
          
          /* Réseaux sociaux */
          .social-links {
            margin-top: 10px;
          }
          
          .social-link {
            display: flex;
            align-items: center;
            gap: 10px;
            padding: 8px 0;
            color: #2a5298;
            text-decoration: none;
            font-size: 0.85rem;
          }
          
          .social-link:hover {
            text-decoration: underline;
          }
          
          /* Responsive */
          @media print {
            body {
              background: white;
              padding: 0;
            }
            .cv-container {
              box-shadow: none;
              border-radius: 0;
            }
            .sidebar {
              background: #f8f9fa;
              -webkit-print-color-adjust: exact;
              print-color-adjust: exact;
            }
            .cv-header {
              -webkit-print-color-adjust: exact;
              print-color-adjust: exact;
            }
          }
          
          @media (max-width: 768px) {
            .cv-body {
              flex-direction: column;
            }
            .sidebar, .main-content {
              width: 100%;
            }
            .cv-header-content {
              flex-direction: column;
              text-align: center;
            }
            .contact-info {
              justify-content: center;
            }
          }
        </style>
      </head>
      <body>
        <div class="cv-container">
          <!-- En-tête coloré -->
          <div class="cv-header">
            <div class="cv-header-content">
              <div class="cv-header-info">
                <h1>${this.escapeHtml(fullName)}</h1>
                <div class="title">${this.escapeHtml(data.profile?.substring(0, 120) || 'Développeur / Informaticien')}${data.profile?.length > 120 ? '...' : ''}</div>
                <div class="contact-info">
                  ${personalInfo.email ? `<div class="contact-item"><span>📧</span> ${this.escapeHtml(personalInfo.email)}</div>` : ''}
                  ${personalInfo.telephone ? `<div class="contact-item"><span>📱</span> ${this.escapeHtml(personalInfo.telephone)}</div>` : ''}
                  ${personalInfo.adresse ? `<div class="contact-item"><span>📍</span> ${this.escapeHtml(personalInfo.adresse)}</div>` : ''}
                  ${personalInfo.ville ? `<div class="contact-item"><span>🏙️</span> ${this.escapeHtml(personalInfo.ville)}</div>` : ''}
                  ${personalInfo.dateNaissance ? `<div class="contact-item"><span>🎂</span> ${this.escapeHtml(personalInfo.dateNaissance)}</div>` : ''}
                  ${personalInfo.permis ? `<div class="contact-item"><span>🚗</span> Permis ${this.escapeHtml(personalInfo.permis)}</div>` : ''}
                </div>
              </div>
              ${data.photo ? `<img src="${data.photo}" class="cv-photo" alt="Photo">` : `<div class="no-photo">👤</div>`}
            </div>
          </div>
          
          <div class="cv-body">
            <!-- Colonne de gauche -->
            <div class="sidebar">
              ${this.generateSidebar(data)}
            </div>
            
            <!-- Colonne de droite -->
            <div class="main-content">
              ${this.generateMainContent(data)}
            </div>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  private generateSidebar(data: CVData): string {
    let html = '';
    
    // Compétences
    if (data.competences && data.competences.length > 0) {
      html += `
        <div class="section">
          <h3 class="section-title">⚡ Compétences</h3>
          <div class="skills-list">
            ${data.competences.map((comp: Competence) => `
              <div class="skill-tag">${this.escapeHtml(comp.nom)} ${comp.niveau ? `(${comp.niveau})` : ''}</div>
            `).join('')}
          </div>
        </div>
      `;
    }
    
    // Langues
    if (data.langues && data.langues.length > 0) {
      html += `
        <div class="section">
          <h3 class="section-title">🌍 Langues</h3>
          ${data.langues.map((langue: Langue) => `
            <div class="language-item">
              <div class="language-name">
                <span>📖</span> ${this.escapeHtml(langue.nom)}
              </div>
              <div class="language-level">${this.escapeHtml(langue.niveau)}</div>
            </div>
          `).join('')}
        </div>
      `;
    }
    
    // Centres d'intérêt
    if (data.centresInteret && data.centresInteret.length > 0) {
      html += `
        <div class="section">
          <h3 class="section-title">🎯 Centres d'intérêt</h3>
          <div class="interests-list">
            ${data.centresInteret.map((interet: string) => `
              <div class="interest-tag">${this.escapeHtml(interet)}</div>
            `).join('')}
          </div>
        </div>
      `;
    }
    
    // Réseaux sociaux
    if (data.reseauxSociaux && data.reseauxSociaux.length > 0) {
      html += `
        <div class="section">
          <h3 class="section-title">🔗 Réseaux</h3>
          <div class="social-links">
            ${data.reseauxSociaux.map((rs: any) => `
              <a href="${this.escapeHtml(rs.url)}" class="social-link" target="_blank">
                <span>🔗</span> ${this.escapeHtml(rs.nom)}
              </a>
            `).join('')}
          </div>
        </div>
      `;
    }
    
    return html;
  }

  private generateMainContent(data: CVData): string {
    let html = '';
    
    // Profil professionnel
    if (data.profile) {
      html += `
        <div class="section">
          <h3 class="section-title">👤 Profil professionnel</h3>
          <p style="color: #555; line-height: 1.6;">${this.escapeHtml(data.profile)}</p>
        </div>
      `;
    }
    
    // Expériences professionnelles
    if (data.experiences && data.experiences.length > 0) {
      html += `
        <div class="section">
          <h3 class="section-title">💼 Expériences professionnelles</h3>
          ${data.experiences.map((exp: Experience) => `
            <div class="experience-item">
              <div class="item-title">${this.escapeHtml(exp.titre || 'Expérience ')}</div>
              <div class="item-date">${exp.dateDebut || ''} ${exp.enCours ? '- Présent' : (exp.dateFin ? '- ' + exp.dateFin : '')}</div>
              <div class="item-company">${this.escapeHtml(exp.entreprise || exp.lieu || '')}</div>
              <div class="item-description">${this.escapeHtml(exp.description || '')}</div>
            </div>
          `).join('')}
        </div>
      `;
    }
    
    // Formations
    if (data.formations && data.formations.length > 0) {
      html += `
        <div class="section">
          <h3 class="section-title">🎓 Formations</h3>
          ${data.formations.map((formation: Formation) => `
            <div class="formation-item">
              <div class="item-title">${this.escapeHtml(formation.diplome || 'Formation')}</div>
              <div class="item-date">${formation.anneeDebut || ''} ${formation.enCours ? '- Présent' : (formation.anneeFin ? '- ' + formation.anneeFin : '')}</div>
              <div class="item-school">${this.escapeHtml(formation.etablissement || formation.lieu || '')}</div>
              <div class="item-description">${this.escapeHtml(formation.description || '')}</div>
            </div>
          `).join('')}
        </div>
      `;
    }
    
    return html;
  }

  private escapeHtml(str: string): string {
    if (!str) return '';
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }
}