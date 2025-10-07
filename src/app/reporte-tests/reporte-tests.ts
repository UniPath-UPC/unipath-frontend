import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';

import { NgApexchartsModule } from 'ng-apexcharts';
import {
  ApexAxisChartSeries,
  ApexNonAxisChartSeries,
  ApexChart,
  ApexXAxis,
  ApexDataLabels,
  ApexTooltip,
  ApexYAxis,
  ApexLegend,
  ApexStroke,
  ApexAnnotations
} from 'ng-apexcharts';

type BarChartOpts = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  dataLabels: ApexDataLabels;
  tooltip: ApexTooltip;
  yaxis: ApexYAxis;
};

type DonutChartOpts = {
  series: ApexNonAxisChartSeries;
  chart: ApexChart;
  labels: string[];
  legend: ApexLegend;
  dataLabels: ApexDataLabels;
  tooltip: ApexTooltip;
};

type LineChartOpts = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  stroke: ApexStroke;
  dataLabels: ApexDataLabels;
  tooltip: ApexTooltip;
  yaxis: ApexYAxis;
  annotations: ApexAnnotations;
};

@Component({
  selector: 'app-reporte-tests',
  standalone: true,
  imports: [CommonModule, FormsModule, NgApexchartsModule],
  templateUrl: './reporte-tests.html',
  styleUrls: ['./reporte-tests.css']
})
export class ReporteTestsComponent implements OnInit {

  tests: any[] = [];
  testsFiltrados: any[] = [];
  fechaDesde: string = '';
  fechaHasta: string = '';
  vista: 'lista' | 'graficos' | 'impacto' = 'lista';

  totalEstudiantesPrediccion = 0;
  chartAreasImpacto!: BarChartOpts;
  chartPercentiles!: LineChartOpts;

  reportsInfo: any[] = [];
  topRecs: any[] = [];
  infouser: any[] = [];
  isDirector = false;
  kpiHitRateAlto = 0;

  chartCarreras?: BarChartOpts;
  chartAreas?: DonutChartOpts;
  chartAvgHitRate?: BarChartOpts;
  chartEvolucion?: LineChartOpts;

  constructor(private http: HttpClient, private router: Router) {}

  /* ========= MODAL AYUDA ========= */
  mostrarAyuda = false;
  modalClosing = false; // animación salida
  ayudaContenido = { titulo: '', descripcion: '' };

  private textosAyuda: Record<string, { titulo: string; descripcion: string }> = {
    carreras: {
      titulo: 'Carreras más recomendadas',
      descripcion:
        'Muestra cuántas veces cada carrera fue la principal recomendación (Top 1) para los estudiantes. Sirve para ver cuáles carreras son más frecuentes entre las mejores coincidencias.'
    },
    areas: {
      titulo: 'Áreas de interés principales',
      descripcion:
        'Distribución de las áreas de interés asociadas a la mejor recomendación por test. Te permite identificar qué áreas vocacionales predominan en los resultados.'
    },
    avgHit: {
      titulo: 'HitRate promedio por carrera',
      descripcion:
        'Promedio del porcentaje de acierto de la mejor recomendación por test, agrupado por carrera. Ayuda a comparar la “fuerza” de recomendación media entre distintas carreras.'
    },
    evolucion: {
      titulo: 'Evolución temporal de recomendaciones',
      descripcion:
        'Cantidad de mejores recomendaciones (Top 1) por día. Útil para observar la tendencia de uso en el tiempo y detectar picos de actividad.'
    },
    areasImpacto: {
      titulo: 'Recomendaciones por área de interés',
      descripcion:
        'Cuenta de recomendaciones principales por área de interés considerando una por test. Resume el impacto del sistema sobre las áreas vocacionales más sugeridas.'
    },
    percentiles: {
      titulo: 'Nivel de precisión por percentil de alumnos',
      descripcion:
        'Curva ECDF: para cada valor de hitRate en el eje X, muestra el % de alumnos con hitRate menor o igual a ese valor. Permite leer percentiles (P25, P50, P75) y entender la distribución de precisión.'
    }
  };

  abrirAyuda(clave: keyof typeof this.textosAyuda) {
    this.ayudaContenido = this.textosAyuda[clave];
    this.modalClosing = false;
    this.mostrarAyuda = true;
  }

  cerrarAyuda() {
    this.modalClosing = true;
    setTimeout(() => {
      this.mostrarAyuda = false;
      this.modalClosing = false;
    }, 200);
  }
  /* ========= FIN MODAL AYUDA ========= */

  /* ========= MAPA CHASIDE (código -> nombre) ========= */
  private readonly AREA_CHASIDE: Record<string, string> = {
    C: 'Administrativa',
    H: 'Humanidades',
    A: 'Artística',
    S: 'Ciencias de la Salud',
    I: 'Enseñanzas Técnicas',
    D: 'Defensa y Seguridad',
    E: 'Ciencias Experimentales'
  };

  /** Devuelve el nombre completo de un código de área (o el propio valor si no coincide). */
  nombreArea(area: any): string {
    const k = String(area ?? '').trim().toUpperCase();
    if (!k) return 'N/A';
    return this.AREA_CHASIDE[k] ?? k;
  }
  /* ========= FIN MAPA CHASIDE ========= */

  ngOnInit() {
    const token = localStorage.getItem('accessToken');
    const userId = localStorage.getItem('userId');
    if (!token || !userId) {
      console.error('Usuario no autenticado');
      return;
    }
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    // 1) Datos de la tabla
    this.http.get<any[]>(`https://unipath-backend-1073d69ce58b.herokuapp.com/api/v1/test/list_test_docente/${userId}`, { headers })
      .subscribe({
        next: (data) => {
          this.tests = data;
          this.testsFiltrados = [...this.tests];
        },
        error: (err) => console.error('Error al obtener reporte de tests:', err)
      });

    // 2) Datos para los gráficos
    this.http.get<any[]>(`https://unipath-backend-1073d69ce58b.herokuapp.com/api/v1/test/reports_info/${userId}`, { headers })
      .subscribe({
        next: (data) => {
          this.reportsInfo = data || [];
          this.procesarTopRecomendaciones();
          this.construirGraficos();
        },
        error: (err) => console.error('Error al obtener reports_info:', err)
      });
      // 3) Datos del usuario en sesión
    this.http.get<any>(`https://unipath-backend-1073d69ce58b.herokuapp.com/api/v1/user/${userId}`, { headers })
      .subscribe({
        next: (user) => {
          this.isDirector = user?.role?.id === 4;
        },
        error: (err) => console.error('Error al obtener usuario:', err)
      });
  }

  cambiarVista(v: 'lista' | 'graficos' | 'impacto') {
    if (v === 'impacto' && !this.isDirector) return; // bloquear acceso
    this.vista = v;
  }
  // -------------------------------
  // LÓGICA DE TABLA
  // -------------------------------
  formatearFecha(fechaTexto: string): string {
    const meses: { [key: string]: string } = {
      enero: '01', febrero: '02', marzo: '03', abril: '04',
      mayo: '05', junio: '06', julio: '07', agosto: '08',
      septiembre: '09', octubre: '10', noviembre: '11', diciembre: '12',
    };
    const partes = fechaTexto.split(' ');
    if (partes.length !== 6) return fechaTexto;
    const dia = partes[0].padStart(2, '0');
    const mesTexto = partes[2].toLowerCase();
    const mes = meses[mesTexto] || '00';
    const anio = partes[4];
    const hora = partes[5];
    return `${dia}/${mes}/${anio} ${hora}`;
  }

  obtenerNumeroMes(mesTexto: string): string {
    const meses: { [key: string]: string } = {
      enero: '01', febrero: '02', marzo: '03', abril: '04',
      mayo: '05', junio: '06', julio: '07', agosto: '08',
      septiembre: '09', octubre: '10', noviembre: '11', diciembre: '12',
    };
    return meses[mesTexto] || '00';
  }

  filtrarPorFecha() {
    if (!this.fechaDesde || !this.fechaHasta) {
      this.testsFiltrados = [...this.tests];
      return;
    }
    const desde = new Date(this.fechaDesde);
    const hasta = new Date(this.fechaHasta);
    hasta.setHours(23, 59, 59);

    this.testsFiltrados = this.tests.filter((test) => {
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
    this.testsFiltrados = [...this.tests];
  }

  verResultado(test: any) {
    localStorage.setItem('resultados', JSON.stringify(test));
    this.router.navigate(['/resultados'], { state: { resultados: test } });
  }

  // -------------------------------
  // LÓGICA DE GRÁFICOS
  // -------------------------------
  private procesarTopRecomendaciones() {
    const mapByTest = new Map<number, any>();
    for (const r of this.reportsInfo) {
      const key = Number(r.test_id);
      const curr = mapByTest.get(key);
      if (!curr || Number(r.hitRate) > Number(curr.hitRate)) {
        mapByTest.set(key, r);
      }
    }
    this.topRecs = Array.from(mapByTest.values());

    // KPI: cantidad de tests con hitRate > 50
    this.kpiHitRateAlto = this.topRecs.filter(x => Number(x.hitRate) > 50).length;
  }

  /** Construye las opciones de los gráficos (dashboard y reporte impacto). */
  private construirGraficos() {
    if (!this.topRecs.length) {
      this.chartCarreras = undefined;
      this.chartAreas = undefined;
      this.chartAvgHitRate = undefined;
      this.chartEvolucion = undefined;
      return;
    }

    // 1) Distribución de carreras más recomendadas (conteo por careerName)
    const carrerasCount = this.contarPor(this.topRecs, (x) => x.careerName);
    const carrerasLabels = Object.keys(carrerasCount);
    const carrerasValues = carrerasLabels.map(l => carrerasCount[l]);

    this.chartCarreras = {
      series: [{ name: 'Tests', data: carrerasValues }],
      chart: { type: 'bar', height: 320, toolbar: { show: false } },
      xaxis: { categories: carrerasLabels, labels: { rotate: -35, trim: true, hideOverlappingLabels: true } },
      dataLabels: { enabled: true },
      yaxis: { title: { text: 'Cantidad de tests' } },
      tooltip: { y: { formatter: (val: number) => `${val} test(s)` } }
    };

    // 2) Áreas de interés principales (donut por area1 -> nombre completo)
    const areasCount = this.contarPor(this.topRecs, (x) => this.nombreArea(x.area1));
    const areasLabels = Object.keys(areasCount);
    const areasValues = areasLabels.map(l => areasCount[l]);

    this.chartAreas = {
      series: areasValues as unknown as ApexNonAxisChartSeries,
      chart: { type: 'donut', height: 320, toolbar: { show: false } },
      labels: areasLabels,
      legend: { position: 'bottom' },
      dataLabels: { enabled: true },
      tooltip: { y: { formatter: (val: number) => `${val} test(s)` } }
    };

    // 3) HitRate promedio por carrera recomendada
    const agregadosPorCarrera = this.agruparYReducir(this.topRecs, (x) => x.careerName, (acc, x) => {
      acc.suma += Number(x.hitRate);
      acc.cnt += 1;
      return acc;
    }, () => ({ suma: 0, cnt: 0 }));
    const avgLabels = Object.keys(agregadosPorCarrera);
    const avgValues = avgLabels.map(k => +(agregadosPorCarrera[k].suma / agregadosPorCarrera[k].cnt).toFixed(2));

    this.chartAvgHitRate = {
      series: [{ name: 'HitRate promedio', data: avgValues }],
      chart: { type: 'bar', height: 320, toolbar: { show: false } },
      xaxis: { categories: avgLabels, labels: { rotate: -35, trim: true, hideOverlappingLabels: true } },
      dataLabels: { enabled: true, formatter: (val: number) => `${val}%` },
      yaxis: { title: { text: 'HitRate (%)' }, labels: { formatter: (val) => `${val}%` } },
      tooltip: { y: { formatter: (val: number) => `${val}%` } }
    };

    // 4) Evolución temporal de recomendaciones (conteo por día)
    const porDia = this.contarPor(this.topRecs, (x) => this.toYMD(x.fechaRegistro));
    const fechasOrdenadas = Object.keys(porDia).sort(); // YYYY-MM-DD ordena bien
    const conteos = fechasOrdenadas.map(f => porDia[f]);

    this.chartEvolucion = {
      series: [{ name: 'Tests', data: conteos }],
      chart: { type: 'line', height: 320, toolbar: { show: false } },
      xaxis: { categories: fechasOrdenadas, labels: { rotate: -20 } },
      stroke: { curve: 'smooth', width: 3 },
      dataLabels: { enabled: false },
      yaxis: { title: { text: 'Cantidad de tests' } },
      tooltip: { y: { formatter: (val: number) => `${val} test(s)` } },
      annotations: { xaxis: [], yaxis: [] }
    };

    // KPI impacto: estudiantes únicos
    const estudiantesUnicos = new Set<string | number>();
    for (const r of this.reportsInfo) {
      const key = (r.studentId ?? r.fullName) as string | number;
      estudiantesUnicos.add(key);
    }
    this.totalEstudiantesPrediccion = estudiantesUnicos.size;

    // Barras: recomendaciones por área (area1 -> nombre completo)
    const areasImpactCount = this.contarPor(this.topRecs, (x) => this.nombreArea(x.area1));
    const areasImpactLabels = Object.keys(areasImpactCount);
    const areasImpactValues = areasImpactLabels.map(l => areasImpactCount[l]);

    this.chartAreasImpacto = {
      series: [{ name: 'Tests', data: areasImpactValues }],
      chart: { type: 'bar', height: 320, toolbar: { show: false } },
      xaxis: { categories: areasImpactLabels, labels: { rotate: 0 } },
      dataLabels: { enabled: true },
      yaxis: { title: { text: 'Cantidad de tests' } },
      tooltip: { y: { formatter: (val: number) => `${val} test(s)` } }
    };

    // ==============================
    // ECDF con eje X FIJO 0..90
    // ==============================
    const hits = this.topRecs
      .map(x => Number(x.hitRate))
      .filter(v => !isNaN(v))
      .sort((a, b) => a - b);

    const n = hits.length;

    // función ECDF: % de alumnos con hitRate <= x
    const ecdfAt = (x: number) => {
      if (n === 0) return 0;
      let count = 0;
      for (let i = 0; i < n; i++) {
        if (hits[i] <= x) count++;
        else break;
      }
      return +((count / n) * 100).toFixed(2);
    };

    // puntos fijos del eje X: 0,10,20,...,90
    const fixedXs: number[] = Array.from({ length: 10 }, (_, i) => i * 10);

    // serie {x,y} para Apex (x numérico)
    const seriesFixed = fixedXs.map((x) => ({ x, y: ecdfAt(x) }));

    // Percentiles P25, P50, P75 (Nearest-Rank) para anotaciones
    const nearestRank = (p: number) => {
      if (n === 0) return NaN;
      const rank = Math.ceil((p / 100) * n) - 1;
      return hits[Math.max(0, Math.min(rank, n - 1))];
    };
    const p25 = +nearestRank(25).toFixed(2);
    const p50 = +nearestRank(50).toFixed(2);
    const p75 = +nearestRank(75).toFixed(2);

    this.chartPercentiles = {
      series: [
        { name: '% alumnos ≤ hitRate', data: seriesFixed as any } // {x,y}
      ],
      chart: { type: 'line', height: 320, toolbar: { show: false } },
      xaxis: {
        type: 'numeric',
        min: 0,
        max: 90,
        tickAmount: 9, // 0..90 en pasos de 10 -> 10 ticks
        title: { text: 'HitRate (%)' },
        labels: {
          formatter: (value: string) => `${Math.round(Number(value))}`
        }
      },
      stroke: { curve: 'smooth', width: 3 },
      dataLabels: { enabled: false },
      yaxis: {
        title: { text: '% de alumnos' },
        labels: { formatter: (val) => `${val}%` },
        max: 100
      },
      tooltip: {
        x: { formatter: (val: number) => `HitRate: ${Math.round(val)}%` },
        y: { formatter: (val: number) => `${val}%` }
      },
      annotations: {
        xaxis: [
          ...(isFinite(p25) && p25 >= 0 && p25 <= 90 ? [{
            x: p25,
            borderColor: '#999',
            strokeDashArray: 4,
            label: {
              text: `P25 (${p25}%)`,
              orientation: 'vertical',
              borderColor: '#999',
              style: { color: '#000', background: '#eee', fontWeight: 600 }
            }
          }] : []),
          ...(isFinite(p50) && p50 >= 0 && p50 <= 90 ? [{
            x: p50,
            borderColor: '#666',
            strokeDashArray: 4,
            label: {
              text: `P50 (${p50}%)`,
              orientation: 'vertical',
              borderColor: '#666',
              style: { color: '#000', background: '#eee', fontWeight: 700 }
            }
          }] : []),
          ...(isFinite(p75) && p75 >= 0 && p75 <= 90 ? [{
            x: p75,
            borderColor: '#999',
            strokeDashArray: 4,
            label: {
              text: `P75 (${p75}%)`,
              orientation: 'vertical',
              borderColor: '#999',
              style: { color: '#000', background: '#eee', fontWeight: 600 }
            }
          }] : [])
        ],
        yaxis: []
      }
    };
  }

  // -------------------------------
  // Helpers
  // -------------------------------
  private contarPor<T>(arr: T[], keyFn: (x: T) => string): Record<string, number> {
    return arr.reduce((acc, x) => {
      const key = keyFn(x) ?? 'N/A';
      acc[key] = (acc[key] ?? 0) + 1;
      return acc;
    }, {} as Record<string, number>);
  }

  private agruparYReducir<T, A>(
    arr: T[],
    keyFn: (x: T) => string,
    reduceFn: (acc: A, x: T) => A,
    initFn: () => A
  ): Record<string, A> {
    return arr.reduce((acc, x) => {
      const key = keyFn(x) ?? 'N/A';
      acc[key] = reduceFn(acc[key] ?? initFn(), x);
      return acc;
    }, {} as Record<string, A>);
  }

  private toYMD(fechaISO: string): string {
    const d = new Date(fechaISO);
    if (isNaN(d.getTime())) return 'N/A';
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
  }
}
