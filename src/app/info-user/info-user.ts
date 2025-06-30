import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-info-user',
  imports: [],
  templateUrl: './info-user.html',
  styleUrl: './info-user.css',
})
export class InfoUserComponent implements OnInit {
  nombre: string = '';
  apellido: string = '';
  email: string = '';
  fechaNacimiento: string = '';
  colegio: string = '';
  rol: string = '';

  constructor(private http: HttpClient) {}

  ngOnInit() {
    const token = localStorage.getItem('accessToken');
    const userId = localStorage.getItem('userId');

    if (token && userId) {
      const headers = new HttpHeaders({
        Authorization: `Bearer ${token}`,
      });

      this.http
        .get<any>(`http://localhost:8080/api/v1/user/${userId}`, { headers })
        .subscribe({
          next: (user) => {
            this.nombre = user.name;
            this.apellido = user.lastName;
            this.email = user.email;
            this.fechaNacimiento = user.birthdate;
            this.colegio = user.school;
            this.rol = this.formatearRol(user.role.name);
          },
          error: (err) => {
            console.error('Error al obtener usuario:', err);
          },
        });
    }
  }
  formatearRol(rolBackend: string): string {
    switch (rolBackend) {
      case 'ROLE_ALUMNO':
        return 'Alumno';
      case 'ROLE_DOCENTE':
        return 'Docente';
      case 'ROLE_DIRECTOR':
        return 'Director';
      case 'ROLE_ADMIN':
        return 'Administrador';
      default:
        return 'Usuario';
    }
  }
}
