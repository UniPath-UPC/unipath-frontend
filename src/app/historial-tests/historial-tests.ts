import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { CommonModule, NgForOf } from '@angular/common';

@Component({
  selector: 'app-historial-tests',
  standalone: true,
  imports: [CommonModule, NgForOf],
  templateUrl: './historial-tests.html',
  styleUrl: './historial-tests.css'
})
export class HistorialTestsComponent implements OnInit {
  historialTests: any[] = [];

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
      .get<any[]>(`http://localhost:8080/api/v1/test/${userId}`, { headers })
      .subscribe({
        next: (data) => (this.historialTests = data),
        error: (err) =>
          console.error('Error al obtener historial de tests:', err)
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

  if (partes.length !== 5) return fechaTexto; // si no es el formato esperado, se devuelve tal cual

  const dia = partes[0].padStart(2, '0');
  const mesTexto = partes[2].toLowerCase();
  const mes = meses[mesTexto] || '00';
  const anio = partes[3];
  const hora = partes[4];

  return `${dia}/${mes}/${anio} ${hora}`;
}


  verResultado(test: any) {
    localStorage.setItem('resultados', JSON.stringify(test));
    this.router.navigate(['/resultados'], { state: { resultados: test } });
  }
}

