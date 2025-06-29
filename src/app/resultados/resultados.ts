import { Component, OnInit } from '@angular/core';
import { NgIf, NgClass, NgFor } from '@angular/common';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-resultados',
  imports: [NgIf, NgClass, NgFor],
  templateUrl: './resultados.html',
  styleUrl: './resultados.css',
})
export class ResultadosComponent implements OnInit {
  recomendaciones: { nameCareer: string; hitRate: string }[] = [];
  nombreUsuario: string = '';
  edad: number = 0;
  fecha: string = '';

  ngOnInit() {
    const nav = this.router.getCurrentNavigation();
    const state = nav?.extras.state as { resultados?: any };

    let data = state?.resultados;

    if (!data) {
      const local = localStorage.getItem('resultados');
      if (local) {
        data = JSON.parse(local);
      } else {
        alert('No se encontraron resultados. Redirigiendo...');
        this.router.navigate(['/test']);
        return;
      }
    }

    this.recomendaciones = data.prediction;
    this.nombreUsuario = data.username;
    this.edad = data.age;
    this.fecha = data.fechaRegistro;
  }
  opcionSeleccionada: number | null = null;

  detalleCarrera = {
    titulo: '',
    descripcion: '',
  };

  mostrarDetalle(index: number) {
    this.opcionSeleccionada = index;

    const carrera = this.recomendaciones[index];
    this.detalleCarrera.titulo = carrera.nameCareer;
  }

  constructor(private router: Router) {}

  irACarrera() {
    if (!this.detalleCarrera.titulo) return;

    const nombreFormateado = this.detalleCarrera.titulo
      .toLowerCase()
      .replace(/\s+/g, '-');
    console.log('NOMBRE FORMATEADO:', nombreFormateado);

    this.router.navigate(['/carrera', nombreFormateado]);
  }
  irAUniversidades() {
  if (!this.detalleCarrera.titulo) return;

  const nombreFormateado = this.detalleCarrera.titulo
    .toLowerCase()
    .replace(/\s+/g, '-');

  this.router.navigate(['/universidades', nombreFormateado]);
}

}
