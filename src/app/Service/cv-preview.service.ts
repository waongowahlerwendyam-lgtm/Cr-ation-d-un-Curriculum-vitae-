import { Injectable } from '@angular/core';
import { CVData, Experience, Formation, Competence, Langue } from '../models/cv-data.model';

@Injectable({
  providedIn: 'root'
})
export class CvPreviewService {
  generateHTML(data: CVData): string {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>CV - ${data.personalInfo.prenom} ${data.personalInfo.nom}</title>
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            color: #333;
            background: #f5f5f5;
            padding: 40px;
          }
          .cv-container {
            max-width: 1000px;
            margin: 0 auto;
            background: white;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            border-radius: 8px;
            overflow: hidden;
          }
          .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 40px;
            display: flex;
            gap: 30px;
            align-items: center;
          }
          .photo {
            width: 150px;
            height: 150px;
            border-radius: 50%;
            object-fit: cover;
            border: 4px solid white;
            box-shadow: 0 2px 10px rgba(0,0,0,0.2);
          }
          .header-info h1 {
            font-size: 2.5em;
            margin-bottom: 10px;
          }
          .header-info p {
            margin: 5px 0;
            opacity: 0.9;
          }
          .content {
            padding: 40px;
          }
          .section {
            margin-bottom: 30px;
          }
          .section h2 {
            color: #667eea;
            border-bottom: 2px solid #667eea;
            padding-bottom: 10px;
            margin-bottom: 20px;
          }
          .profile-text {
            background: #f8f9fa;
            padding: 20px;
            border-radius: 8px;
            line-height: 1.8;
          }
          .experience-item, .formation-item {
            margin-bottom: 20px;
            padding-bottom: 20px;
            border-bottom: 1px solid #eee;
          }
          .experience-item h3, .formation-item h3 {
            color: #333;
            margin-bottom: 5px;
          }
          .company, .institution {
            color: #666;
            font-weight: 500;
            margin-bottom: 5px;
          }
          .date {
            color: #999;
            font-size: 0.9em;
            margin-bottom: 10px;
          }
          .skills-grid {
            display: flex;
            flex-wrap: wrap;
            gap: 10px;
          }
          .skill-item {
            background: #667eea;
            color: white;
            padding: 5px 15px;
            border-radius: 20px;
            font-size: 0.9em;
          }
          .languages-grid {
            display: flex;
            flex-wrap: wrap;
            gap: 20px;
          }
          .language-item {
            background: #f8f9fa;
            padding: 10px 20px;
            border-radius: 8px;
          }
          .language-name {
            font-weight: bold;
            color: #667eea;
          }
          .interest-item {
            background: #f8f9fa;
            padding: 5px 15px;
            border-radius: 20px;
            display: inline-block;
            margin: 5px;
          }
          .social-links {
            display: flex;
            gap: 15px;
            flex-wrap: wrap;
          }
          .social-link {
            color: #667eea;
            text-decoration: none;
            padding: 5px 10px;
            border: 1px solid #667eea;
            border-radius: 5px;
            transition: all 0.3s;
          }
          .social-link:hover {
            background: #667eea;
            color: white;
          }
        </style>
      </head>
      <body>
        <div class="cv-container">
          <div class="header">
            ${data.photo ? `<img src="${data.photo}" class="photo" alt="Photo">` : ''}
            <div class="header-info">
              <h1>${data.personalInfo.prenom} ${data.personalInfo.nom}</h1>
              <p>📧 ${data.personalInfo.email}</p>
              <p>📞 ${data.personalInfo.telephone}</p>
              ${data.personalInfo.adresse ? `<p>📍 ${data.personalInfo.adresse}, ${data.personalInfo.ville} ${data.personalInfo.codePostal}</p>` : ''}
            </div>
          </div>
          
          <div class="content">
            ${data.profile ? `
              <div class="section">
                <h2>Profil professionnel</h2>
                <div class="profile-text">${data.profile}</div>
              </div>
            ` : ''}
            
            ${data.experiences.length > 0 ? `
              <div class="section">
                <h2>Expériences professionnelles</h2>
                ${data.experiences.map((exp: Experience) => `
                  <div class="experience-item">
                    <h3>${exp.titre}</h3>
                    <div class="company">${exp.entreprise}</div>
                    <div class="date">${exp.dateDebut} - ${exp.enCours ? 'Présent' : exp.dateFin}</div>
                    <p>${exp.description}</p>
                  </div>
                `).join('')}
              </div>
            ` : ''}
            
            ${data.formations.length > 0 ? `
              <div class="section">
                <h2>Formations</h2>
                ${data.formations.map((formation: Formation) => `
                  <div class="formation-item">
                    <h3>${formation.diplome}</h3>
                    <div class="institution">${formation.etablissement}</div>
                    <div class="date">${formation.anneeDebut} - ${formation.enCours ? 'Présent' : formation.anneeFin}</div>
                    <p>${formation.description}</p>
                  </div>
                `).join('')}
              </div>
            ` : ''}
            
            ${data.competences.length > 0 ? `
              <div class="section">
                <h2>Compétences</h2>
                <div class="skills-grid">
                  ${data.competences.map((comp: Competence) => `<span class="skill-item">${comp.nom} (${comp.niveau})</span>`).join('')}
                </div>
              </div>
            ` : ''}
            
            ${data.langues.length > 0 ? `
              <div class="section">
                <h2>Langues</h2>
                <div class="languages-grid">
                  ${data.langues.map((langue: Langue) => `
                    <div class="language-item">
                      <span class="language-name">${langue.nom}</span>
                      <span> - ${langue.niveau}</span>
                    </div>
                  `).join('')}
                </div>
              </div>
            ` : ''}
            
            ${data.centresInteret.length > 0 ? `
              <div class="section">
                <h2>Centres d'intérêt</h2>
                <div>
                  ${data.centresInteret.map((interet: string) => `<span class="interest-item">${interet}</span>`).join('')}
                </div>
              </div>
            ` : ''}
            
            ${data.reseauxSociaux.length > 0 ? `
              <div class="section">
                <h2>Réseaux sociaux</h2>
                <div class="social-links">
                  ${data.reseauxSociaux.map((rs: any) => `<a href="${rs.url}" class="social-link" target="_blank">${rs.nom}</a>`).join('')}
                </div>
              </div>
            ` : ''}
          </div>
        </div>
      </body>
      </html>
    `;
  }
}