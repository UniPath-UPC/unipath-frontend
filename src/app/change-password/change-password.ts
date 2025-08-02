import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NgIf } from '@angular/common';
import { NgClass } from '@angular/common';



@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.html',
  imports: [FormsModule, NgIf, NgClass],
  styleUrl: './change-password.css',
})
export class ChangePasswordComponent {
  etapa = 1;
  correo = '';
  codigo = '';
  nuevaContrasena = '';
  confirmarContrasena = '';
  mensaje = '';
  codigoArray: string[] = ['', '', '', '', '', ''];

  verPassword: boolean = false;
  verConfirmacion: boolean = false;

  userId: number = 0;
  idRequest: number = 0;

  constructor(private http: HttpClient, private router: Router) {}

  enviarCorreo() {
  const url = `http://localhost:8080/api/v1/request/code-validation?email=${encodeURIComponent(this.correo)}`;
  console.log('Enviando petición a:', url);
  this.mensaje = '';

  this.http.post<any>(url,null).subscribe({
    next: (res) => {
      console.log('Respuesta de code-validation:', res);
      this.userId = res.user_id;
      this.idRequest = res.id_request;
      this.etapa = 2;
    },
    error: (err) => {
      console.error('Error al enviar correo:', err);
       this.mensaje = 'Correo no válido o no registrado.';
    }
  });
}

onInputChange(event: Event, index: number): void {
  const input = event.target as HTMLInputElement;
  const value = input.value;

  // Validar que solo se ingresen números del 0 al 9
  if (/^\d$/.test(value)) {
    this.codigoArray[index] = value;

    // Mover foco al siguiente input si existe
    if (index < 5) {
      const nextInput = document.getElementById(`otp${index + 1}`) as HTMLInputElement;
      if (nextInput) nextInput.focus();
    }
  } else {
    // Si el input no es válido, limpiarlo
    input.value = '';
  }
}

onKeyDown(event: KeyboardEvent, index: number): void {
  const input = event.target as HTMLInputElement;

  if (event.key === 'Backspace') {
    event.preventDefault(); // evita doble acción de borrar
    this.codigoArray[index] = '';
    input.value = '';

    // Mover foco al anterior input si existe
    if (index > 0) {
      const prevInput = document.getElementById(`otp${index - 1}`) as HTMLInputElement;
      if (prevInput) prevInput.focus();
    }
  }
}


validarCodigo() {
  const code = this.codigoArray.join('');
  console.log('Código ingresado:', code);

  if (code.length !== 6) {
    this.mensaje = 'Por favor ingresa los 6 dígitos.';
    return;
  }

  const payload = {
    id_request: this.idRequest,
    code: code,
  };

  this.http.post('http://localhost:8080/api/v1/request/match-code', payload).subscribe({
    next: (res) => {
      console.log('Respuesta verificación:', res);
      if (res === 1) {
        this.etapa = 3;
      } else {
        this.mensaje = 'Código incorrecto o expirado.';
      }
    },
    error: (err) => {
      this.mensaje = 'Error al verificar el código.';
      console.error(err);
    },
  });
}


  cambiarContrasena() {
    this.mensaje = '';
    if (this.nuevaContrasena !== this.confirmarContrasena) {
      this.mensaje = 'Las contraseñas no coinciden.';
      return;
    }

    this.http.put<any>('http://localhost:8080/api/v1/authentication/setPassword', {
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

