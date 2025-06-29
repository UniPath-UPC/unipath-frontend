import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { NgStyle, NgForOf, NgClass } from '@angular/common';


@Component({
  selector: 'app-universidades-carrera',
  templateUrl: './universidades-carrera.html',
  styleUrl: './universidades-carrera.css',
  standalone: true,
  imports: [NgForOf, NgStyle, NgClass]
})
export class UniversidadesCarreraComponent implements OnInit {
  nombreCarrera: string = '';
  universidades: any[] = [];

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private router: Router
  ) {}

  ngOnInit(): void {
    const carreraParam = this.route.snapshot.paramMap.get('career');

    if (!carreraParam) return;

    this.nombreCarrera = carreraParam.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());

    const token = localStorage.getItem('accessToken');
    const headers = { Authorization: `Bearer ${token}` };

    this.http.get<any[]>(`http://localhost:8080/api/v1/universitycareer/${carreraParam}`, { headers })
      .subscribe({
        next: (res) => this.universidades = res,
        error: (err) => console.error('Error al obtener universidades:', err)
      });
  }
  volverAResultados() {
  this.router.navigate(['/resultados']);
}
hexToRGBA(hex: string, alpha: number): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}
activo: number | null = null;


}