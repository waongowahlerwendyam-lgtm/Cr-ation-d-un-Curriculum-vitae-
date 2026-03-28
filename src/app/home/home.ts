import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.html',
  styleUrls: ['./home.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class HomeComponent implements OnInit {
  activeTab: 'login' | 'register' = 'login';
  isLoading = false;
  
  // Données de connexion
  loginData = {
    email: '',
    password: ''
  };
  
  // Données d'inscription
  registerData = {
    nom: '',
    prenom: '',
    email: '',
    telephone: '',
    password: '',
    confirmPassword: '',
    acceptTerms: false
  };
  
  constructor(private router: Router) {}
  
  ngOnInit() {
    // Créer un utilisateur admin par défaut
    this.createDefaultUsers();
  }
  
  // Créer les utilisateurs par défaut
  createDefaultUsers() {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    
    // Vérifier si l'admin existe déjà
    const adminExists = users.some((u: any) => u.email === 'admin@cvbuilder.com');
    
    if (!adminExists) {
      users.push({
        nom: 'Admin',
        prenom: 'System',
        email: 'admin@cvbuilder.com',
        telephone: '000000000',
        password: 'admin123',
        role: 'admin'
      });
    }
    
    // Vérifier si le compte démo existe déjà
    const demoExists = users.some((u: any) => u.email === 'demo@cvbuilder.com');
    
    if (!demoExists) {
      users.push({
        nom: 'Demo',
        prenom: 'User',
        email: 'demo@cvbuilder.com',
        telephone: '123456789',
        password: 'password123',
        role: 'user'
      });
    }
    
    localStorage.setItem('users', JSON.stringify(users));
  }
  
  onLogin() {
    if (!this.loginData.email || !this.loginData.password) {
      this.showNotification('Veuillez remplir tous les champs', 'error');
      return;
    }
    
    this.isLoading = true;
    
    // Vérifier dans la base de données locale
    setTimeout(() => {
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      const user = users.find((u: any) => 
        u.email === this.loginData.email && u.password === this.loginData.password
      );
      
      if (user) {
        // Sauvegarder l'utilisateur connecté
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('userEmail', user.email);
        localStorage.setItem('userRole', user.role || 'user');
        localStorage.setItem('userName', `${user.prenom} ${user.nom}`);
        
        this.showNotification(`Bienvenue ${user.prenom} !`, 'success');
        this.router.navigate(['/cv-builder']);
      } else {
        this.showNotification('Email ou mot de passe incorrect', 'error');
      }
      this.isLoading = false;
    }, 800);
  }
  
  onRegister() {
    // Validation
    if (!this.registerData.nom || !this.registerData.prenom || !this.registerData.email || 
        !this.registerData.telephone || !this.registerData.password) {
      this.showNotification('Veuillez remplir tous les champs', 'error');
      return;
    }
    
    if (this.registerData.password !== this.registerData.confirmPassword) {
      this.showNotification('Les mots de passe ne correspondent pas', 'error');
      return;
    }
    
    if (this.registerData.password.length < 6) {
      this.showNotification('Le mot de passe doit contenir au moins 6 caractères', 'error');
      return;
    }
    
    // Vérifier le format de l'email
    const emailRegex = /^[^\s@]+@([^\s@]+\.)+[^\s@]+$/;
    if (!emailRegex.test(this.registerData.email)) {
      this.showNotification('Email invalide', 'error');
      return;
    }
    
    // Vérifier le téléphone
    const cleanPhone = this.registerData.telephone.replace(/[\s\-\.]/g, '');
    if (cleanPhone.length < 9 || !/^\d+$/.test(cleanPhone)) {
      this.showNotification('Téléphone invalide (minimum 9 chiffres)', 'error');
      return;
    }
    
    this.isLoading = true;
    
    setTimeout(() => {
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      const userExists = users.some((u: any) => u.email === this.registerData.email);
      
      if (userExists) {
        this.showNotification('Cet email est déjà utilisé', 'error');
        this.isLoading = false;
        return;
      }
      
      const newUser = {
        nom: this.registerData.nom,
        prenom: this.registerData.prenom,
        email: this.registerData.email,
        telephone: this.registerData.telephone,
        password: this.registerData.password,
        role: 'user',
        dateInscription: new Date().toISOString()
      };
      
      users.push(newUser);
      localStorage.setItem('users', JSON.stringify(users));
      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('userEmail', this.registerData.email);
      localStorage.setItem('userRole', 'user');
      localStorage.setItem('userName', `${this.registerData.prenom} ${this.registerData.nom}`);
      
      this.showNotification(`Bienvenue ${this.registerData.prenom} ! Votre compte a été créé avec succès.`, 'success');
      this.router.navigate(['/cv-builder']);
      this.isLoading = false;
    }, 800);
  }
  
  showNotification(message: string, type: 'success' | 'error') {
    const notification = document.createElement('div');
    notification.textContent = message;
    notification.style.position = 'fixed';
    notification.style.bottom = '20px';
    notification.style.right = '20px';
    notification.style.padding = '12px 24px';
    notification.style.borderRadius = '10px';
    notification.style.color = 'white';
    notification.style.fontWeight = 'bold';
    notification.style.zIndex = '10000';
    notification.style.animation = 'slideInRight 0.3s ease';
    
    if (type === 'success') {
      notification.style.backgroundColor = '#48bb78';
    } else {
      notification.style.backgroundColor = '#e53e3e';
    }
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
      notification.style.animation = 'slideOutRight 0.3s ease';
      setTimeout(() => notification.remove(), 300);
    }, 3000);
  }
}