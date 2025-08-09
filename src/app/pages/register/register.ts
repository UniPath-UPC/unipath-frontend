import { Component } from '@angular/core';
import { NgClass } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [NgClass, FormsModule, CommonModule],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class RegisterComponent {
  constructor(private http: HttpClient, private router: Router) {}
  name: string = '';
  lastName: string = '';
  email: string = '';
  password: string = '';
  confirmPassword: string = '';
  birthdate: string = '';
  school: string = '';
  selectedSchoolId: number | null = null;
  selectedRole: string = '';
  schools: any[] = [];

  mostrarToast: boolean = false;

  isLengthValid: boolean = false;
  hasUppercase: boolean = false;
  passwordTouched: boolean = false;

    ngOnInit() {
    this.cargarColegios();
  }

  cargarColegios() {
    this.http.get<any[]>('http://localhost:8080/api/v1/school').subscribe({
      next: (data) => {
        this.schools = data;
      },
      error: (err) => {
        console.error('Error al cargar colegios:', err);
      },
    });
  }

  validatePassword() {
    this.passwordTouched = this.password.length > 0;
    this.isLengthValid = this.password.length >= 8;
    this.hasUppercase = /[A-Z]/.test(this.password);
  }
  getRolBackend(role: string): string {
    switch (role) {
      case 'alumno':
        return 'ROLE_ALUMNO';
      case 'docente':
        return 'ROLE_DOCENTE';
      case 'director':
        return 'ROLE_DIRECTOR';
      case 'admin':
        return 'ROLE_ADMIN';
      default:
        return '';
    }
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
    if (!this.selectedSchoolId) {
      alert('Por favor selecciona un colegio.');
      return;
    }

    const payload = {
      name: this.name,
      lastName: this.lastName,

      birthdate: this.formatDate(this.birthdate),
      email: this.email,
      password: this.password,
      role: this.getRolBackend(this.selectedRole),
      school_id: this.selectedSchoolId,
    };
    console.log('🔼 JSON que se envía al backend:', payload);
    this.http
      .post('http://localhost:8080/api/v1/authentication/sign-up', payload)
      .subscribe({
        next: (res) => {
          this.mostrarToast = true;

          setTimeout(() => {
            this.mostrarToast = false;
            this.router.navigate(['/login']);
          }, 2000); // Mostrar el toast 3s y redirigir
        },

        error: (err) => {
          console.error('Error en el registro:', err);
          alert('Hubo un error al registrarse. Intenta nuevamente.');
        },
      });
  }
}
