import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { CommonModule, NgClass, NgForOf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgStyle } from '@angular/common';

@Component({
  selector: 'app-historial-tests',
  standalone: true,
  imports: [CommonModule, NgForOf, NgClass, FormsModule],
  templateUrl: './historial-tests.html',
  styleUrl: './historial-tests.css',
})
export class HistorialTestsComponent implements OnInit {
  historialTests: any[] = [];
  mostrarToast: boolean = false;
  mensaje: String = '';
  fechaDesde: string = '';
  fechaHasta: string = '';
  testsFiltrados: any[] = [];
  colorToast: string = 'var(--green-true-color)';
  
  fechaHoy: string = new Date().toISOString().split('T')[0];


  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit() {
    const userId = localStorage.getItem('userId');
    const token = localStorage.getItem('accessToken');

    if (!userId || !token) {
      console.error('Usuario no autenticado');
      return;
    }

    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });

    this.http
      .get<any[]>(`https://unipath-backend-1073d69ce58b.herokuapp.com/api/v1/test/${userId}`, { headers })
      .subscribe({
        next: (data) => {
          this.historialTests = data;
          this.testsFiltrados = [...data];
        },
        error: (err) =>
          console.error('Error al obtener historial de tests:', err),
      });
  }

  formatearFecha(fechaTexto: string): string {
    const meses: { [key: string]: string } = {
      enero: '01',
      febrero: '02',
      marzo: '03',
      abril: '04',
      mayo: '05',
      junio: '06',
      julio: '07',
      agosto: '08',
      septiembre: '09',
      octubre: '10',
      noviembre: '11',
      diciembre: '12',
    };

    const partes = fechaTexto.split(' ');

    if (partes.length !== 6) return fechaTexto; // si no es el formato esperado, se devuelve tal cual

    const dia = partes[0].padStart(2, '0');
    const mesTexto = partes[2].toLowerCase();
    const mes = meses[mesTexto] || '00';
    const anio = partes[4];
    const hora = partes[5];

    return `${dia}/${mes}/${anio} ${hora}`;
  }
  filtrarPorFecha() {
  if (!this.fechaDesde || !this.fechaHasta) {
    this.testsFiltrados = [...this.historialTests];
    return;
  }

  const desde = new Date(this.fechaDesde);
  const hasta = new Date(this.fechaHasta);
  hasta.setHours(23, 59, 59); // incluir todo el día hasta

  this.testsFiltrados = this.historialTests.filter((test) => {
    const partes = test.fechaRegistro.split(' ');
    if (partes.length !== 6) return false;

    const dia = partes[0].padStart(2, '0');
    const mes = this.obtenerNumeroMes(partes[2].toLowerCase());
    const anio = partes[4];
    const hora = partes[5];

    const fechaCompleta = new Date(`${anio}-${mes}-${dia}T${hora}`);
    return fechaCompleta >= desde && fechaCompleta <= hasta;
  });
}
resetearFiltro() {
  this.fechaDesde = '';
  this.fechaHasta = '';
  this.testsFiltrados = [...this.historialTests];
}


obtenerNumeroMes(mesTexto: string): string {
  const meses: { [key: string]: string } = {
    enero: '01',
    febrero: '02',
    marzo: '03',
    abril: '04',
    mayo: '05',
    junio: '06',
    julio: '07',
    agosto: '08',
    septiembre: '09',
    octubre: '10',
    noviembre: '11',
    diciembre: '12',
  };
  return meses[mesTexto] || '00';
}


  marcarFavorito(test: any) {
    const token = localStorage.getItem('accessToken');
    if (!token) return;

    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });
    const testId = test.id_test;

    const esFavorito = test.favorite === 1;

    this.http
      .put(`https://unipath-backend-1073d69ce58b.herokuapp.com/api/v1/test/${testId}`, null, { headers })
      .subscribe({
        next: () => {
          test.favorite = esFavorito ? 0 : 1;
          this.colorToast = esFavorito ? 'var(--red-false-color)' : 'var(--green-true-color)'; 
          this.mensaje = esFavorito
            ? '☆ Test eliminado de favoritos'
            : '★ Test marcado como favorito';
          this.mostrarToast = true;

          setTimeout(() => {
            this.mostrarToast = false;
          }, 3000);
        },
        error: (err) => {
          console.error('Error al cambiar estado de favorito:', err);
        },
      });
  }

  verResultado(test: any) {
    localStorage.setItem('resultados', JSON.stringify(test));
    this.router.navigate(['/resultados'], { state: { resultados: test } });
  }
}
