import { Component, OnInit } from '@angular/core';
import { NgIf, NgClass, NgFor, CommonModule } from '@angular/common';
import { Router } from '@angular/router';

type Rec = { nameCareer: string; hitRate: number };
type RecAjustada = { nameCareer: string; original: number; ajustado: number };

@Component({
  selector: 'app-resultados',
  imports: [CommonModule, NgIf, NgClass, NgFor],
  templateUrl: './resultados.html',
  styleUrl: './resultados.css',
})
export class ResultadosComponent implements OnInit {
  recomendaciones: Rec[] = [];
  recomendacionesAjustadas: RecAjustada[] = [];

  nombreUsuario: string = '';
  edad: number = 0;
  fecha: string = '';

  opcionSeleccionada: number | null = null;
  detalleCarrera = { titulo: '', descripcion: '' };

  // --- Modal ---
  mostrarModalModelo = false;

  constructor(private router: Router) {}

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

    this.recomendaciones = (data.prediction || []).map((p: any) => ({
      nameCareer: p.nameCareer,
      hitRate: Number(p.hitRate),
    }));

    // Normaliza al Top 3 para el modal
    this.recomendacionesAjustadas = this.calcularAjusteTop3(this.recomendaciones);

    this.nombreUsuario = data.username;
    this.edad = data.age;
    this.fecha = data.fechaRegistro;
  }

  private calcularAjusteTop3(recs: Rec[]): RecAjustada[] {
    // Tomamos SOLO las 3 primeras (top 3)
    const top3 = recs.slice(0, 3);
    const suma = top3.reduce((acc, r) => acc + (isNaN(r.hitRate) ? 0 : r.hitRate), 0);

    if (suma <= 0) {
      // Si algo raro pasa (suma 0), devolvemos originales y ajustado 0
      return top3.map(r => ({
        nameCareer: r.nameCareer,
        original: this.redondear2(r.hitRate),
        ajustado: 0
      }));
    }

    // Ajuste proporcional + corrección de redondeo para que sumen 100
    const prelim = top3.map(r => ({
      nameCareer: r.nameCareer,
      original: this.redondear2(r.hitRate),
      ajustado: this.redondear2((r.hitRate / suma) * 100)
    }));

    // Corrección de último elemento para cerrar la suma en 100
    const sumaAjustados = prelim.reduce((acc, r) => acc + r.ajustado, 0);
    const diff = this.redondear2(100 - sumaAjustados);
    if (prelim.length > 0) {
      prelim[prelim.length - 1].ajustado = this.redondear2(prelim[prelim.length - 1].ajustado + diff);
    }

    return prelim;
  }

  private redondear2(v: number): number {
    return Math.round((v + Number.EPSILON) * 100) / 100;
  }

  mostrarDetalle(index: number) {
    this.opcionSeleccionada = index;
    const carrera = this.recomendaciones[index];
    this.detalleCarrera.titulo = carrera?.nameCareer ?? '';
  }

  irACarrera() {
    if (!this.detalleCarrera.titulo) return;
    const nombreFormateado = this.detalleCarrera.titulo.toLowerCase().replace(/\s+/g, '-');
    this.router.navigate(['/carrera', nombreFormateado]);
  }

  irAUniversidades() {
    if (!this.detalleCarrera.titulo) return;
    const nombreFormateado = this.detalleCarrera.titulo.toLowerCase().replace(/\s+/g, '-');
    this.router.navigate(['/universidades', nombreFormateado]);
  }

  // --- Modal handlers ---
  abrirModalModelo() {
    this.mostrarModalModelo = true;
  }
  cerrarModalModelo() {
    this.mostrarModalModelo = false;
  }

  // Helpers para mostrar con 2 decimales
  fmt2(n: number): string {
    return (isNaN(n) ? 0 : n).toFixed(2);
  }
}

