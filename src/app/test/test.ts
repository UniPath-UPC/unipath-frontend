import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { OnInit, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-test',
  imports: [FormsModule, CommonModule],
  templateUrl: './test.html',
  styleUrl: './test.css',
})
export class TestComponent implements OnInit {
  //Listas de variables
  constructor(private http: HttpClient, private router: Router) {}
  ngOnInit() {
    window.addEventListener('beforeunload', this.confirmarSalida);
  }
  ngOnDestroy() {
    window.removeEventListener('beforeunload', this.confirmarSalida);
  }
  confirmarSalida = (event: BeforeUnloadEvent) => {
  event.preventDefault();
  event.returnValue = '¿Estas seguro de que deseas abandonar el test? Tus respuestas no se guardarán'; // Para que algunos navegadores muestren el mensaje por defecto
};
  questions: string[] = [
    '¿Aceptarías trabajar escribiendo artículos en la sección económica de un diario?',
    '¿Te ofrecerías para organizar la despedida de soltero de uno de tus amigos?',
    '¿Te gustaría dirigir un proyecto de urbanización en tu ciudad?',
    '¿A una frustración siempre opones un pensamiento positivo?',
    '¿Te dedicarías a socorrer a personas accidentadas o atacadas por asaltantes?',
    '¿Cuando eras niño/a, te interesaba saber cómo estaban construidos tus juguetes?',
    '¿Te interesan más los misterios de la naturaleza que los secretos de la tecnología?',
    '¿Escuchás atentamente los problemas que te plantean tus amigos?',
    '¿Se ofrecería para explicar algo a alguien?',
    '¿Eres exigente y crítico con tu equipo de trabajo?',
    '¿Te atrae armar rompecabezas o puzzles?',
    '¿Podés establecer la diferencia conceptual entre macroeconomía y microeconomía?',
    '¿Usar un uniforme lo/a haría sentirse distinto/a e importante?',
    '¿Participarías como profesional en un espectáculo de acrobacia aérea?',
    '¿Organiza su dinero de manera que siempre alcance hasta volver a cobrar?',
    '¿Convences fácilmente a otras personas sobre la validez de tus argumentos?',
    '¿Estás informado sobre los nuevos descubrimientos que se están realizando sobre la Teoría del Big-Bang?',
    '¿Ante una situación de emergencia, actuás rápidamente?',
    '¿Cuando tenés que resolver un problema matemático, es perseverante hasta encontrar la solución?',
    '¿Si fuera convocado/a para planificar, organizar y/o dirigir un campo de deportes, aceptaría?',
    '¿Es Ud. él/la que pone un toque de alegría en las fiestas familiares?',
    '¿Crees que los detalles son tan importantes como el todo?',
    '¿Se sentiría a gusto trabajando en un Hospital?',
    '¿Te gustaría participar para mantener el orden ante grandes desórdenes y cataclismos?',
    '¿Pasarías varias horas leyendo algún libro de tu interés?',
    '¿Planificás detalladamente tus trabajos antes de empezar?',
    '¿Entablas una relación casi personal con tu computadora?',
    '¿Disfrutas modelando con arcilla?',
    '¿Ayudas habitualmente a los no videntes a cruzar la calle?',
    '¿Consideras importante que desde la escuela primaria se fomente la actitud crítica y la participación activa?',
    '¿Aceptarías que las mujeres formaran parte de las fuerzas armadas bajo las mismas normas que los hombres?',
    '¿Te gustaría crear nuevas técnicas para descubrir las patologías de algunas enfermedades a través del microscopio?',
    '¿Participarías en una campaña de prevención contra la enfermedad de Chagas?',
    '¿Te interesan los temas relacionados al pasado y a la evolución del hombre?',
    '¿Te incluirías en un proyecto de investigación de los movimientos sísmicos y sus consecuencias?',
    '¿Dedica algunas horas de la semana a la realización de actividad física?',
    '¿Te interesan las actividades de mucha acción y de reacción rápida en situaciones imprevistas y de peligro?',
    '¿Te ofrecerías para colaborar como voluntario en los gabinetes espaciales de la NASA?',
    '¿Te gusta más el trabajo manual que el trabajo intelectual?',
    '¿Estarías dispuesto a renunciar a un momento placentero para ofrecer tu servicio como profesional?',
    '¿Participaría de un trabajo de investigación sobre la violencia social?',
    '¿Te gustaría trabajar en un laboratorio mientras estudias?',
    '¿Arriesgarías tu vida para salvar la vida de otro que no conoces?',
    '¿Te agradaría hacer un curso de primeros auxilios?',
    '¿Tolerarías empezar tantas veces como fuere necesario hasta obtener el logro deseado?',
    '¿Distribuyes tu horarios del día adecuadamente para poder hacer todo lo planeado?',
    '¿Haría un curso para aprender a fabricar las piezas de máquinas o aparatos?',
    '¿Elegiría una profesión que lo/a obligara a estar alejado de su familia por algún tiempo?',
    '¿Te radicarías en una zona agrícola-ganadera para desarrollar tus actividades como profesional?',
    '¿Cuando estás en un grupo trabajando, te entusiasma producir ideas originales y que sean tenidas en cuenta?',
    '¿Te resulta fácil coordinar un grupo de trabajo?',
    '¿Te resultó interesante el estudio de las ciencias biológicas?',
    '¿Si una gran empresa solicita un profesional como gerente de comercialización, te sentirías a gusto desempeñando ese rol?',
    '¿Te incluirías en un proyecto nacional de desarrollo de la principal fuente de recursos de tu provincia?',
    '¿Tienes interés por saber cuales son las causas que determinan ciertos fenómenos, aunque saberlo no altere tu vida?',
    '¿Descubriste algún filósofo o escritor que haya expresado tus mismas ideas con antelación?',
    '¿Desearía que le regalen algún instrumento musical?',
    '¿Aceptarías colaborar con el cumplimiento de las normas en lugares públicos?',
    '¿Crees que tus ideas son importantes, y haces todo lo posible para ponerlas en práctica?',
    '¿Cuando se descompone un artefacto en tu casa, te disponés prontamente a repararlo?',
    '¿Formarías parte de un equipo de trabajo orientado a la preservación de la flora y la fauna en extinción?',
    '¿Acostumbras leer revistas relacionadas con los últimos avances científicos y tecnológicos en el área de la salud?',
    '¿Preservar las raíces culturales de nuestro país, te parece importante y necesario?',
    '¿Te gustaría realizar una investigación que contribuyera a hacer más justa la distribución de la riqueza?',
    '¿Te gustaría realizar tareas auxiliares en una nave, como por ejemplo izado y arriado de velas, pintura y conservación del casco, arreglo de averías, conservación de motores, etc?',
    '¿Crees que un país debe poseer la más alta tecnología armamentista, a cualquier precio?',
    '¿La libertad y la justicia son valores fundamentales en tu vida?',
    '¿Aceptarías hacer una práctica rentada en una industria de productos alimenticios en el sector de control de calidad?',
    '¿Consideras que la salud pública debe ser prioritaria, gratuita y eficiente para todos?',
    '¿Te interesaría investigar sobre alguna nueva vacuna?',
    '¿En un equipo de trabajo, preferís el rol de coordinador?',
    '¿En una discusión entre amigos, te ofrecés como mediador?',
    '¿Estás de acuerdo con la formación de un cuerpo de soldados profesionales?',
    '¿Lucharías por una causa justa hasta las últimas consecuencias?',
    '¿Te gustaría investigar científicamente sobre cultivos agrícolas?',
    '¿Harías un nuevo diseño de una prenda pasada de moda, ante una reunión imprevista?',
    '¿Visitaría un observatorio astronómico para conocerlo en acción?',
    '¿Dirigirías el área de importación y exportación de una empresa?',
    '¿Te inhibes al entrar a un lugar nuevo con gente desconocida?',
    '¿Te gratificaría el trabajar con niños?',
    '¿Harías el diseño de un afiche para una campaña contra el sida?',
    '¿Dirigirías un grupo de teatro independiente?',
    '¿Enviarías tu curriculum a una empresa automotriz que solicita gerente para su área de producción?',
    '¿Participarías en un grupo de defensa internacional dentro de alguna fuerza armada?',
    '¿Se costearía sus estudios trabajando?',
    '¿Suele defender las llamadas «causas perdidas»?',
    '¿Ante una emergencia, participaría brindando su ayuda?',
    '¿Sabrías responder que significa ADN y ARN?',
    '¿Elegirías una carrera cuyo instrumento de trabajo fuere la utilización de un idioma extranjero?',
    '¿Trabajar con objetos te resulta más gratificante que trabajar con personas?',
    '¿Te resultaría gratificante ser asesor contable en una empresa reconocida?',
    '¿Ante un llamado solidario, te ofrecerías para cuidar a un enfermo?',
    '¿Te atrae investigar sobre los misterios del universo, por ejemplo los agujeros negros?',
    '¿El trabajo individual te resulta más rápido y efectivo que el trabajo grupal?',
    '¿Dedicarías parte de tu tiempo a ayudar a personas de zonas carenciadas?',
    '¿Cuando elegís tu ropa o decorás un ambiente, tenés en cuenta la combinación de los colores, las telas o el estilo de los muebles?',
    '¿Te gustaría trabajar como profesional dirigiendo la construcción de una empresa hidroeléctrica?',
    '¿Sabés qué es el PBI?',
  ];
  generos: string[] = ['Masculino', 'Femenino'];
  distritos: string[] = [
    'Ancón',
    'Ate',
    'Barranco',
    'Breña',
    'Carabayllo',
    'Cercado de Lima',
    'Chaclacayo',
    'Chorrillos',
    'Cieneguilla',
    'Comas',
    'El Agustino',
    'Independencia',
    'Jesús María',
    'La Molina',
    'La Victoria',
    'Lince',
    'Los Olivos',
    'Lurigancho',
    'Lurín',
    'Magdalena del Mar',
    'Miraflores',
    'Pachacámac',
    'Pucusana',
    'Pueblo Libre',
    'Puente Piedra',
    'Punta Hermosa',
    'Punta Negra',
    'Rímac',
    'San Bartolo',
    'San Borja',
    'San Isidro',
    'San Juan de Lurigancho',
    'San Juan de Miraflores',
    'San Luis',
    'San Martin de Porres',
    'San Miguel',
    'Santa Anita',
    'Santa María del Mar',
    'Santa Rosa',
    'Santiago de Surco',
    'Surquillo',
    'Villa el Salvador',
    'Villa Maria del Triunfo',
  ];
  tiposEscuela: string[] = ['Privada', 'Pública'];
  cursos: string[] = [
    'Computación',
    'Ciencias',
    'Geografía',
    'Economía',
    'Historia',
    'Educación física',
    'Comunicación',
    'Arte y cultura',
    'Idiomas',
    'Matemática',
  ];
  respuestasExtra: any = {
    genero: '',
    distrito: '',
    tipoEscuela: '',
    curso1: '',
    curso2: '',
    curso3: '',
    empatia: 5,
    escucha: 5,
    resolucion: 5,
    asertividad: 5,
    trabajoEquipo: 5,
    pagoMensual: '',
  };
  respuestasChaside: { id: number; score: number; questionId: number }[] = [];

  //Barra de progreso
  get progressPercentage(): number {
    return Math.round(((this.currentPage + 1) / this.totalPages) * 100);
  }

  //Manejo de paginación
  currentPage: number = 0;
  pageSize: number = 7;

  get pagedQuestions(): string[] {
    const start = this.currentPage * this.pageSize;
    return this.questions.slice(start, start + this.pageSize);
  }

  get totalPages(): number {
    return Math.ceil(this.questions.length / this.pageSize) + 1;
  }

  nextPage() {
    if (this.currentPage < this.totalPages - 1) {
      this.currentPage++;
    }
  }

  prevPage() {
    if (this.currentPage > 0) {
      this.currentPage--;
    }
  }

  //Manejo de puntuación
  selectedAnswers: number[] = [];

  rangeLabels = Array.from({ length: 10 }, (_, i) => i + 1);

  setAnswer(index: number, score: number): void {
    const id = index + 1;
    const existing = this.respuestasChaside.find((ans) => ans.id === id);

    this.selectedAnswers[index] = score;

    if (existing) {
      existing.score = score;
    } else {
      this.respuestasChaside.push({ id, score, questionId: id });
    }
  }

  //JSON Final
  generarJSONFinal(): any {
    const data = {
      listAnswers: this.respuestasChaside.sort((a, b) => a.id - b.id),
      genre: this.respuestasExtra.genero,
      preferred_course_1: this.respuestasExtra.curso1,
      preferred_course_2: this.respuestasExtra.curso2,
      preferred_course_3: this.respuestasExtra.curso3,
      district: this.respuestasExtra.distrito,
      type_school: this.respuestasExtra.tipoEscuela,
      empathy_level: this.respuestasExtra.empatia,
      listen_level: this.respuestasExtra.escucha,
      solution_level: this.respuestasExtra.resolucion,
      communication_level: this.respuestasExtra.asertividad,
      teamwork_level: this.respuestasExtra.trabajoEquipo,
      monthly_cost: this.respuestasExtra.pagoMensual,
    };

    console.log('JSON para enviar:', data);
    return data;
  }

  // Enviar respuestas al servidor
  enviarRespuestas() {
    const userId = localStorage.getItem('userId');
    const token = localStorage.getItem('accessToken');

    // Verificar si el usuario está autenticado
    if (!userId || !token) {
      alert('Por favor inicia sesión antes de continuar.');
      this.router.navigate(['/login']);
      return;
    }
    // Validar preguntas CHASIDE
    const primeraNoRespondida = this.selectedAnswers.findIndex(
      (respuesta) => respuesta === undefined || respuesta === null
    );

    if (primeraNoRespondida !== -1) {
      alert(`Te falta responder la pregunta N° ${primeraNoRespondida + 1}`);
      // También puedes llevar al usuario a esa página automáticamente:
      this.currentPage = Math.floor(primeraNoRespondida / this.pageSize);
      return;
    }
    const extra = this.respuestasExtra;
    const camposObligatorios = [
      extra.genero,
      extra.distrito,
      extra.tipoEscuela,
      extra.curso1,
      extra.curso2,
      extra.curso3,
      extra.empatia,
      extra.escucha,
      extra.resolucion,
      extra.asertividad,
      extra.trabajoEquipo,
      extra.pagoMensual,
    ];

    // Validar que los cursos preferidos sean diferentes
    const { curso1, curso2, curso3 } = extra;
    if (new Set([curso1, curso2, curso3]).size < 3) {
      alert(
        'Selecciona cursos preferidos diferentes, según su orden de preferencia.'
      );
      return;
    }

    // Verificar si hay campos incompletos
    const camposIncompletos = camposObligatorios.some(
      (campo) => campo === '' || campo === null || campo === undefined
    );

    // Si hay campos incompletos, mostrar alerta y detener el envío
    if (camposIncompletos) {
      alert(
        'Por favor completa todas las preguntas de la ultima página antes de finalizar.'
      );
      return;
    }

    // Generar el JSON para enviar
    const jsonResultado = this.generarJSONFinal();

    // Enviar el JSON al servidor
    this.http
      .post<any>(`https://unipath-backend-1073d69ce58b.herokuapp.com/api/v1/test/${userId}`, jsonResultado, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .subscribe({
        next: (res) => {
          // Guarda todo el objeto para usarlo en resultados
          localStorage.setItem('resultados', JSON.stringify(res));
          this.router.navigate(['/resultados'], {
            state: { resultados: res },
          });
        },
        error: (err) => {
          console.error('Error al enviar test:', err);
          alert('No se pudo enviar el test.');
        },
      });
  }
}
