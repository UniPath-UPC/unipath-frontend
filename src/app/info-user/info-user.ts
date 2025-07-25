import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
declare var bootstrap: any;

@Component({
  selector: 'app-info-user',
  imports: [CommonModule, FormsModule],
  templateUrl: './info-user.html',
  styleUrl: './info-user.css',
})
export class InfoUserComponent implements OnInit {
  nombre = '';
  apellido = '';
  email = '';
  fechaNacimiento = '';
  colegio = '';
  rol = '';

  // Variables de edición
  modoEdicion = false;
  datosOriginales: any = {};
  passwordUsuario = ''; // Puede ser "" o fijo si el backend lo requiere

  constructor(private http: HttpClient) {}

  ngOnInit() {
    const token = localStorage.getItem('accessToken');
    const userId = localStorage.getItem('userId');

    if (token && userId) {
      const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });

      this.http.get<any>(`http://localhost:8080/api/v1/user/${userId}`, { headers }).subscribe({
        next: (user) => {
          this.nombre = user.name;
          this.apellido = user.lastName;
          this.email = user.email;
          this.fechaNacimiento = user.birthdate;
          this.colegio = user.school;
          this.rol = this.formatearRol(user.role.name);
          this.passwordUsuario = user.password;

          this.datosOriginales = { ...user };
        },
        error: (err) => console.error('Error al obtener usuario:', err),
      });
    }
  }

  formatearRol(rolBackend: string): string {
    switch (rolBackend) {
      case 'ROLE_ALUMNO': return 'Alumno';
      case 'ROLE_DOCENTE': return 'Docente';
      case 'ROLE_DIRECTOR': return 'Director';
      case 'ROLE_ADMIN': return 'Administrador';
      default: return 'Usuario';
    }
  }

  toggleEdicion() {
    if (this.modoEdicion) {
      const modal = new bootstrap.Modal(document.getElementById('modalConfirmarGuardado')!);
      modal.show();
    } else {
      this.modoEdicion = true;
    }
  }

  cancelarEdicion() {
    this.nombre = this.datosOriginales.name;
    this.apellido = this.datosOriginales.lastName;
    this.fechaNacimiento = this.datosOriginales.birthdate;
    this.colegio = this.datosOriginales.school;
    this.modoEdicion = false;
  }

  confirmarGuardado() {
    const token = localStorage.getItem('accessToken');
    const userId = localStorage.getItem('userId');

    if (!token || !userId) return;

    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });

    const payload = {
      name: this.nombre,
      lastName: this.apellido,
      birthdate: this.fechaNacimiento,
      email: this.email,
      //password: this.passwordUsuario,
      school: this.colegio,
    };
    console.log('🔼 JSON que se envía al backend:', payload);

    this.http.put<any>(`http://localhost:8080/api/v1/user/${userId}`, payload, { headers }).subscribe({
      next: (res) => {
        this.modoEdicion = false;
        this.datosOriginales = { ...res };
        this.http.get<any>(`http://localhost:8080/api/v1/user/${userId}`, { headers }).subscribe({
        next: (user) => {
          this.nombre = user.name;
          this.apellido = user.lastName;
          this.email = user.email;
          this.fechaNacimiento = user.birthdate;
          this.colegio = user.school;
          this.rol = this.formatearRol(user.role.name);
          this.passwordUsuario = user.password;

          this.datosOriginales = { ...user };
        },
        error: (err) => console.error('Error al obtener usuario:', err),
      });
        console.log('✅ JSON de respuesta del backend:', res);
        alert('✅ Información actualizada con éxito');
      },
      error: (err) => {
        console.error('Error al actualizar:', err);
        alert('❌ No se pudo actualizar la información');
      },
    });
  }
  

  confirmarEliminacion() {
  const userId = localStorage.getItem('userId');
  const token = localStorage.getItem('accessToken');

  if (!userId || !token) {
    console.error('No se encontró el usuario o token.');
    return;
  }

  const headers = new HttpHeaders({
    Authorization: `Bearer ${token}`,
  });

  this.http
    .delete(`http://localhost:8080/api/v1/user/${userId}`, { headers })
    .subscribe({
      next: () => {
        console.log('Cuenta eliminada correctamente');
        localStorage.clear(); // Limpia todos los datos
        window.location.href = '/'; // Redirige al inicio
      },
      error: (err) => {
        console.error('Error al eliminar la cuenta:', err);
        alert('Ocurrió un error al eliminar tu cuenta.');
      },
    });
}

}
