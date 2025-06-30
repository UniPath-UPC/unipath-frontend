import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Location } from '@angular/common'; 

@Component({
  selector: 'app-carrera',
  imports: [ CommonModule],
  templateUrl: './carrera.html',
  styleUrl: './carrera.css'
})
export class CarreraComponent implements OnInit {

  carrera: {
    name: string;
    description: string;
    imageUrl: string;
  } | null = null;

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private router: Router,
  ) {}

 ngOnInit(): void {
  const nombreParam = this.route.snapshot.paramMap.get('nombre');
  const token = localStorage.getItem('accessToken');

  if (!nombreParam || !token) {
    alert('No tienes acceso a esta página.');
    this.router.navigate(['/login']);
    return;
  }

  const headers = { Authorization: `Bearer ${token}` };

  this.http.get<any>(
    `http://localhost:8080/api/v1/career/${nombreParam}`,
    { headers }
  ).subscribe({
    next: (res) => {
      this.carrera = res;
    },
    error: (err) => {
      console.error('Error al obtener detalles de la carrera:', err);
      alert('No se pudo cargar la información de la carrera.');
    }
  });
}

irUniversidades() {
   const nombreFormateado = this.carrera?.name
      .toLowerCase()
      .replace(/\s+/g, '-');
    console.log('NOMBRE FORMATEADO:', nombreFormateado);
  this.router.navigate(['/universidades', nombreFormateado]);
  }
  volver() {
    history.back();
  }
}




























/*
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { Location } from '@angular/common'; 

@Component({
  selector: 'app-carrera',
  imports: [ CommonModule ],
  templateUrl: './carrera.html',
  styleUrl: './carrera.css'
})
export class CarreraComponent implements OnInit {
nombreCarrera: string = '';
  descripcionCarrera: string = '';
  imagenCarrera: string = '';

  constructor(private route: ActivatedRoute, private location: Location) {
    const ruta = this.route.snapshot.paramMap.get('nombre');

    if (ruta) {
      this.nombreCarrera = this.formatearNombreCarrera(ruta);
      //this.descripcionCarrera = this.obtenerDescripcionCarrera(this.nombreCarrera);
      this.imagenCarrera = `assets/img/carreras/${ruta}.jpg`; // puedes adaptar esta ruta
    }
  }
  ngOnInit(): void {
    throw new Error('Method not implemented.');
  }

  formatearNombreCarrera(urlNombre: string): string {
    return urlNombre
      .split('-')
      .map(palabra => palabra.charAt(0).toUpperCase() + palabra.slice(1))
      .join(' ');
  }
   regresar() {
  this.location.back();}
  
}

*/
