import { Component } from '@angular/core';
import { NgClass } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    NgClass,
    FormsModule,
    CommonModule
  ],
  templateUrl: './register.html',
  styleUrl: './register.css'
})
export class RegisterComponent {
  constructor(private http: HttpClient, private router: Router) { }
  fullname: string = '';
  email: string = '';
  password: string = '';
  confirmPassword: string = '';
  birthdate: string = '';
  school: string = '';
  selectedRole: string = '';

  isLengthValid: boolean = false;
  hasUppercase: boolean = false;
  passwordTouched: boolean = false;

  validatePassword() {
    this.passwordTouched = this.password.length > 0;
    this.isLengthValid = this.password.length >= 8;
    this.hasUppercase = /[A-Z]/.test(this.password);
  }
  getRolBackend(role: string): string {
    switch (role) {
      case 'alumno': return 'ROLE_ALUMNO';
      case 'docente': return 'ROLE_DOCENTE';
      case 'director': return 'ROLE_DIRECTOR';
      case 'admin': return 'ROLE_ADMIN';
      default: return '';
    }
  }
  getNombre(): string {
    return this.fullname.trim().split(' ')[0] || '';
  }

  getApellido(): string {
    const partes = this.fullname.trim().split(' ');
    return partes.length > 1 ? partes.slice(1).join(' ') : '';
  }

  formatDate(fecha: string): string {
    const dateObj = new Date(fecha);
    const year = dateObj.getFullYear();
    const month = String(dateObj.getMonth() + 1).padStart(2, '0');
    const day = String(dateObj.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  onSubmit(form: any) {
    if (!form.valid) {
      alert('Por favor completa todos los campos obligatorios.');
      return;
    }

    if (this.password !== this.confirmPassword) {
      alert('Las contraseñas no coinciden.');
      return;
    }

    const payload = {
      name: this.getNombre(),
      lastName: this.getApellido(),
      birthdate: this.formatDate(this.birthdate),
      email: this.email,
      password: this.password,
      role: this.getRolBackend(this.selectedRole),
      school: this.school
    };


    this.http.post('http://localhost:8080/api/v1/authentication/sign-up', payload).subscribe({
      next: (res) => {
        alert('🎉 Registro completado con éxito');
        this.router.navigate(['/login']);
      },
      error: (err) => {
        console.error('Error en el registro:', err);
        alert('Hubo un error al registrarse. Intenta nuevamente.');
      }
    });
  }

}