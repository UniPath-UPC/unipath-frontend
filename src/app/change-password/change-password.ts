import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NgIf, NgClass } from '@angular/common';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.html',
  imports: [FormsModule, NgIf, NgClass],
  styleUrl: './change-password.css',
})
export class ChangePasswordComponent {
  etapa = 1;

  // Paso 1
  correo = '';
  enviando = false;

  // Paso 2
  codigoArray: string[] = ['', '', '', '', '', ''];

  // Paso 3
  nuevaContrasena = '';
  confirmarContrasena = '';
  verPassword = false;
  verConfirmacion = false;

  // Validaciones de contraseña
  lenOk = false;
  upperOk = false;
  passwordTouched = false;

  // Mensajes / estado global
  mensaje = '';

  // Backend data
  userId: number = 0;
  idRequest: number = 0;

  constructor(private http: HttpClient, private router: Router) {}

  /* ===========================
     PASO 1: Enviar correo
     =========================== */
  enviarCorreo() {
    if (!this.correo) return;

    const url = `https://unipath-backend-1073d69ce58b.herokuapp.com/api/v1/request/code-validation?email=${encodeURIComponent(this.correo)}`;
    this.mensaje = '';
    this.enviando = true;

    this.http.post<any>(url, null).subscribe({
      next: (res) => {
        this.userId = res.user_id;
        this.idRequest = res.id_request;
        this.etapa = 2;
        // Prepara el foco en el primer input del OTP
        setTimeout(() => {
          const first = document.getElementById('otp0') as HTMLInputElement | null;
          first?.focus();
        }, 0);
      },
      error: (err) => {
        console.error('Error al enviar correo:', err);
        this.mensaje = 'Correo no válido o no registrado.';
      },
      complete: () => {
        this.enviando = false;
      }
    });
  }

  /* ===========================
     PASO 2: OTP handlers
     =========================== */
  onInputChange(event: Event, index: number): void {
    this.mensaje = ''; // limpia mensaje al escribir
    const input = event.target as HTMLInputElement;
    const value = input.value;

    if (/^\d$/.test(value)) {
      this.codigoArray[index] = value;
      if (index < 5) {
        const nextInput = document.getElementById(`otp${index + 1}`) as HTMLInputElement;
        nextInput?.focus();
      }
    } else {
      input.value = '';
    }
  }

  onKeyDown(event: KeyboardEvent, index: number): void {
    const input = event.target as HTMLInputElement;

    if (event.key === 'Backspace') {
      event.preventDefault();
      this.codigoArray[index] = '';
      input.value = '';
      if (index > 0) {
        const prevInput = document.getElementById(`otp${index - 1}`) as HTMLInputElement;
        prevInput?.focus();
      }
    }
  }

  private limpiarOTP(): void {
    this.codigoArray = ['', '', '', '', '', ''];
    for (let i = 0; i < 6; i++) {
      const el = document.getElementById(`otp${i}`) as HTMLInputElement | null;
      if (el) el.value = '';
    }
    const first = document.getElementById('otp0') as HTMLInputElement | null;
    first?.focus();
  }

  validarCodigo() {
    const code = this.codigoArray.join('');

    if (code.length !== 6) {
      this.mensaje = 'Por favor ingresa los 6 dígitos.';
      return;
    }

    const payload = {
      id_request: this.idRequest,
      code: code,
    };

    this.http.post<number>('https://unipath-backend-1073d69ce58b.herokuapp.com/api/v1/request/match-code', payload).subscribe({
      next: (res) => {
        if (res === 1) {
          this.mensaje = ''; // limpia el error si lo había
          this.etapa = 3;
          // Limpia OTP por seguridad
          this.limpiarOTP();
        } else {
          this.mensaje = 'Código incorrecto o expirado.';
          this.limpiarOTP();
        }
      },
      error: (err) => {
        console.error(err);
        this.mensaje = 'Error al verificar el código.';
        this.limpiarOTP();
      },
    });
  }

  /* ===========================
     PASO 3: Validación contraseña
     =========================== */
  onPasswordInput() {
    const pwd = this.nuevaContrasena || '';
    this.passwordTouched = pwd.length > 0;
    this.lenOk = pwd.length >= 8;
    this.upperOk = /[A-ZÁÉÍÓÚÜÑ]/.test(pwd);
    this.mensaje = '';
  }

  cambiarContrasena() {
    this.mensaje = '';

    // Validaciones locales
    if (!this.lenOk || !this.upperOk) {
      this.mensaje = 'La contraseña no cumple los requisitos.';
      return;
    }
    if (this.nuevaContrasena !== this.confirmarContrasena) {
      this.mensaje = 'Las contraseñas no coinciden.';
      return;
    }

    this.http.put<any>('https://unipath-backend-1073d69ce58b.herokuapp.com/api/v1/authentication/setPassword', {
      userId: this.userId,
      newPassword: this.nuevaContrasena
    }).subscribe({
      next: () => {
        alert('Contraseña actualizada con éxito.');
        this.router.navigate(['/login']);
      },
      error: () => {
        this.mensaje = 'Error al actualizar la contraseña.';
      },
    });
  }
}
