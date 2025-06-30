import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class LoginComponent {
  email: string = '';
  password: string = '';
  mostrarToast: boolean = false;
  toastMessage: string = '✅ Inicio de sesión exitoso';
  constructor(private http: HttpClient, private router: Router) {}

  onLogin() {
    if (!this.email || !this.password) {
      alert('Por favor completa todos los campos');
      return;
    }

    const payload = {
      email: this.email,
      password: this.password,
    };

    this.http
      .post<any>('http://localhost:8080/api/v1/authentication/sign-in', payload)
      .subscribe({
        next: (res) => {
          const token = res.accessToken;
          const userId = res.userId;
          localStorage.setItem('accessToken', token);
  localStorage.setItem('userId', userId.toString());
          
          this.toastMessage = '✅ Inicio de sesión exitoso';
          this.mostrarToast = true;
          
          setTimeout(() => {
            this.mostrarToast = false;
            this.toastMessage = '';
            this.router.navigate(['/home']);
          }, 2000);
        },
        error: (err) => {
          console.error(err);
          this.toastMessage = '❌ Error al iniciar sesión, intenta nuevamente';
          this.mostrarToast = true;
          
          setTimeout(() => {
            this.mostrarToast = false;
            this.toastMessage = '';
          }, 3000);
        },
      });
  }
}
