import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {NgIf} from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, NgIf],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css'
})
export class NavbarComponent implements OnInit {
    constructor(private http: HttpClient) {}
  estaLogueado: boolean = false;
  nombreUsuario: string = '';
  rolUsuario: string = '';


  ngOnInit() {
    const token = localStorage.getItem('accessToken');
    const userId = localStorage.getItem('userId');
    this.estaLogueado = !!token;

    if (this.estaLogueado && userId) {
      const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
      this.http.get<any>(`http://localhost:8080/api/v1/user/${userId}`, { headers })
        .subscribe({
          next: (data) => {
            this.nombreUsuario = `${data.name} ${data.lastName}`;
            this.rolUsuario = this.formatearRol(data.role.name);
          },
          error: (err) => {
            console.error('Error al obtener usuario:', err);
          }
        });
    }}
    formatearRol(rolBackend: string): string {
    switch (rolBackend) {
      case 'ROLE_ALUMNO': return 'Alumno';
      case 'ROLE_DOCENTE': return 'Docente';
      case 'ROLE_DIRECTOR': return 'Director';
      case 'ROLE_ADMIN': return 'Administrador';
      default: return 'Usuario';
    }
  }
  cerrarSesion() {
    localStorage.clear();
    window.location.href = '/login';
  }
}
