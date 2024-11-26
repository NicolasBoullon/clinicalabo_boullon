import { Component, OnInit ,ChangeDetectionStrategy, OnDestroy} from '@angular/core';
import Chart from 'chart.js/auto';
import { TurnosService } from '../../core/services/turnos.service';
import { EspecialidadesService } from '../../core/services/especialidades.service';
import jsPDF from 'jspdf';
import { CommonModule, formatDate } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FirestoreService } from '../../core/services/firestore.service';
import { StyleButtonDirective } from '../../core/directives/style-button.directive';
import * as XLSX from 'xlsx';
import { PacientesService } from '../../core/services/pacientes.service';
import {} from '@angular/core';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatIconModule} from '@angular/material/icon';
import {MatInputModule} from '@angular/material/input';
import {provideNativeDateAdapter} from '@angular/material/core';
import { Subscription } from 'rxjs';
@Component({
  selector: 'app-estadisticas',
  standalone: true,
  imports: [CommonModule,FormsModule,StyleButtonDirective,MatFormFieldModule, MatInputModule, MatDatepickerModule, MatIconModule],
  providers:[provideNativeDateAdapter()],
  templateUrl: './estadisticas.component.html',
  styleUrl: './estadisticas.component.css'
})
export class EstadisticasComponent implements OnInit,OnDestroy{

  constructor(private turnosService:TurnosService,private especialidadesService:EspecialidadesService, private firestoreService:FirestoreService,private pacientesService:PacientesService){}

  turnos:any [] = [];
  especialidades:any = [];
  pacientes:any = [];
  administradores:any = [];
  especialistas:any = [];
  logs:any[]=[];
  cantidadDeTurnosPorEspecialidad:Record<string, number> = {};
  cantidadDeTurnosPorDia:Record<string, number> = {};
  cantidadDeTurnosPorMedico:Record<string, number> = {};
  cantidadDeTurnosFinalizadosPorMedico:Record<string, number> = {};
  barChart: Chart | undefined;
  lineChart: Chart | undefined;
  tortaChart: Chart | undefined | any;
  polarAreaChart: Chart | undefined | any;
  wait!:Promise<boolean>;
  seleccionoCantidadTurnosPorEspecialidad:boolean =  true;
  optionSelected:string = 'cantidadDeTurnosPorEspecialidad';

  FechaDesde!:any;
  FechaHasta!:any;
  turnosPorFecha: any[] = [];
  FechaDesdeFin!:any;
  FechaHastaFin!:any;
  turnosPorFechaFin: any[] = [];

  subPacientes!:Subscription;
  subEspecialistas!:Subscription;
  subTurnos!:Subscription;
  subAdministradores!:Subscription;
  subLogs!:Subscription;
  subEspecialidades!:Subscription;
  ngOnInit(): void {
    this.GetTurnos();  
    this.GetEspecialidades();
    this.GetPacientes();
    this.GetEspecialistas();
    this.GetAdmins();
    this.GetLogs();
  }

  async GetPacientes(){
    this.subPacientes =  this.pacientesService.GetTodosPacientes().subscribe({
      next:((value)=>{
        this.pacientes = value;
      })
    })
  }

  async GetEspecialistas(){
    this.subEspecialistas=  this.firestoreService.getCollection('especialistas').subscribe({
      next:((value)=>{
        this.especialistas = value;
      })
    })
  }

  async GetAdmins(){
    this.subAdministradores= this.firestoreService.getCollection('administradores').subscribe({
      next:((value)=>{
        this.administradores = value;
      })
    })
  }

  async GetLogs(){
    this.subLogs= this.firestoreService.getCollectionOrderedByDate('logInicioSesion','fecha').subscribe({
      next:((value)=>{
        this.logs = value;
      })
    })
  }

  async GetTurnos(){
    this.subTurnos= this.firestoreService.getCollectionOrderedByDate('turnos','dia').subscribe({
      next:((value)=>{
        this.turnos = value;
        console.log(this.turnos);
        this.CalcularCantidadDeTurnosPorEspecialidad(value)
        this.CalcularCantidadDeTurnosPorDia(value);
      })
    })
  }

  async GetEspecialidades(){
    this.subEspecialidades=this.especialidadesService.GetEspecialidades().subscribe({
      next:((value)=>{
        this.especialidades = value.map((esp: { Especialidad: string }) => esp.Especialidad);        
      })
    })
    
  }

  MostrarFecha(){
    let fechaDesde!: string;
    let fechaHasta!: string;

    if(this.FechaDesde && this.FechaHasta){
      fechaDesde= this.formatearFecha(this.FechaDesde)
      fechaHasta = this.formatearFecha(this.FechaHasta);
    }

    if(fechaDesde != '' && fechaHasta != ''){
     this.turnosPorFecha = this.turnos.filter(
       (turno) =>
        this.formatDate(turno.dia) >= fechaDesde && this.formatDate(turno.dia) <= fechaHasta
      );
      
      console.log(this.turnosPorFecha);
      this.CalcularCantidadDeTurnosPorMedico(this.turnosPorFecha);
      setTimeout(() => {
        this.crearGraficoTorta();
      }, 200);
    }
  }

  MostrarFechaFin(){
    let fechaDesde!: string ;
    let fechaHasta!: string ;
    if(this.FechaDesdeFin && this.FechaHastaFin){
       fechaDesde= this.formatearFecha(this.FechaDesdeFin)
       fechaHasta = this.formatearFecha(this.FechaHastaFin);
    }
    console.log(fechaDesde);
    console.log(fechaHasta);
    
    
    
    if(fechaDesde != '' && fechaHasta != ''){
      this.turnosPorFechaFin = this.turnos.filter(
        (turno) =>
          this.formatDate(turno.dia) >= fechaDesde && this.formatDate(turno.dia) <= fechaHasta && turno.estado == 'finalizado'
      );

      console.log(this.turnosPorFechaFin);
      this.CalcularCantidadDeFinalizadosPorMedico(this.turnosPorFechaFin);
      setTimeout(() => {
        this.crearGraficoPolarArea();
      }, 200);
    }
  }

  formatearFecha(fecha: Date): string {
    const dia = fecha.getDate().toString().padStart(2, '0'); // Asegura dos dígitos
    const mes = (fecha.getMonth() + 1).toString().padStart(2, '0'); // Meses empiezan en 0
    const anio = fecha.getFullYear();
  
    return `${dia}/${mes}/${anio}`; // Retorna la fecha en formato dd/MM/yyyy
  }
  

  crearGraficoTorta() {
    if (this.turnosPorFecha.length === 0) {
        console.warn("No hay datos para mostrar en el gráfico.");
        return;
    }


    const labels = Object.keys(this.cantidadDeTurnosPorMedico); 
    const data = Object.values(this.cantidadDeTurnosPorMedico); 

    const ctx = document.getElementById('tortaChart') as HTMLCanvasElement;
    if (ctx) {
        if (this.tortaChart) {
            this.tortaChart.destroy(); 
        }

        this.tortaChart = new Chart(ctx, {
            type: 'pie',
            data: {
                labels: labels,
                datasets: [
                    {
                        data: data,
                        backgroundColor: [
                            '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40'
                        ],
                        hoverBackgroundColor: [
                            '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40'
                        ]
                    }
                ]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'top',
                        labels: {
                          font: {
                            size: 18 
                          }
                        }
                    },
                    title: {
                        display: true,
                        text: 'Turnos por Médico',
                        font: {
                          size: 24 
                        }
                    }
                }
            }
        });
    }
}
  CalcularCantidadDeTurnosPorMedico(turnos:any){
    this.cantidadDeTurnosPorMedico = {};
    turnos.forEach((turno:any) => {
      
      if (!this.cantidadDeTurnosPorMedico[turno.especialista.nombre]) {
        this.cantidadDeTurnosPorMedico[turno.especialista.nombre] = 0;
      }
      this.cantidadDeTurnosPorMedico[turno.especialista.nombre]++;
    });

    console.log(this.cantidadDeTurnosPorMedico);
  }

  CalcularCantidadDeFinalizadosPorMedico(turnos:any){
    this.cantidadDeTurnosFinalizadosPorMedico = {};
    turnos.forEach((turno:any) => {
      if(turno.estado == 'finalizado'){
        if (!this.cantidadDeTurnosFinalizadosPorMedico[turno.especialista.nombre]) {
          this.cantidadDeTurnosFinalizadosPorMedico[turno.especialista.nombre] = 0;
        }
        this.cantidadDeTurnosFinalizadosPorMedico[turno.especialista.nombre]++;
      }
    });

    console.log(this.cantidadDeTurnosFinalizadosPorMedico);
  }

  CalcularCantidadDeTurnosPorEspecialidad(turnos:any[]){
    this.cantidadDeTurnosPorEspecialidad = {};

    turnos.forEach((turno) => {
      const especialidad = turno.especialidad.toLowerCase();
      
      if (!this.cantidadDeTurnosPorEspecialidad[especialidad]) {
        this.cantidadDeTurnosPorEspecialidad[especialidad] = 0;
      }
      this.cantidadDeTurnosPorEspecialidad[especialidad]++;
    });

    console.log(this.cantidadDeTurnosPorEspecialidad);
    this.renderBarChart();
  }

  CalcularCantidadDeTurnosPorDia(turnos:any[]){
    
    this.cantidadDeTurnosPorDia = {};

    turnos.forEach((turno) => {
      let dia = this.formatDate(turno.dia);      
      if (!this.cantidadDeTurnosPorDia[dia]) {
        this.cantidadDeTurnosPorDia[dia] = 0;
      }
      this.cantidadDeTurnosPorDia[dia]++;
    });

    console.log(this.cantidadDeTurnosPorDia);
    this.renderLineChart();

  }

  formatDate(timestamp: { seconds: number, nanoseconds: number }): string {
    const date = new Date(timestamp.seconds * 1000); 
    
    return formatDate(date, 'dd MMMM yyyy', 'es-AR');
  }
  formatHora(timestamp: { seconds: number, nanoseconds: number }): string {
    const date = new Date(timestamp.seconds * 1000); 
    
    return formatDate(date, 'HH:mm', 'es-AR');
  }

  renderBarChart() {
    const labels = Object.keys(this.cantidadDeTurnosPorEspecialidad);
    const data = Object.values(this.cantidadDeTurnosPorEspecialidad);
    const colors = ['#D4AF37', '#8B0000', '#0818bd', '#556B2F', '#892dc9']; 
    const backgroundColors = labels.map((_, index) => colors[index % colors.length]);
  
    const ctx = document.getElementById('barChart') as HTMLCanvasElement;
  
    if (this.barChart) {
      this.barChart.destroy(); 
    }
  
    this.barChart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [
          {
            label: 'Cantidad de Turnos por Especialidad',
            data: data,
            backgroundColor: backgroundColors, 
            borderColor: backgroundColors.map(color => color),
            borderWidth: 1
          }
        ]
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'top',
            labels: {
              font: {
                size: 18 
              }
            }
          },
          title: {
            display: true,
            text: 'Cantidad de Turnos por Especialidad',
            font: {
              size: 24
            }
          }
        },
        scales: {
          x: {
            ticks: {
              font: {
                size: 22 
              }
            }
          },
          y: {
            ticks: {
              font: {
                size: 22 
              }
            }
          }
        }
      }
    });
  }
  


  exportarPdf0() {
    const doc = new jsPDF();
    const width = doc.internal.pageSize.getWidth();
    const height = doc.internal.pageSize.getHeight();
  
    const logo = new Image();
    logo.src = '../../../assets/imperiologdor.png';
  
    logo.onload = () => {
      const logoWidth = 100; 
      const logoHeight = 50; 
      const xPos = (width - logoWidth) / 2;  
      const yPos = 10;  
  
      doc.addImage(logo, 'PNG', xPos, yPos, logoWidth, logoHeight);
  
      const title = 'Estadísticas de cantidad de turnos por especialidad';
      doc.setFontSize(18);
      const titleWidth = doc.getTextWidth(title);
      const titleXPos = (width - titleWidth) / 2;
      const titleYPos = yPos + logoHeight + 10;
      doc.text(title, titleXPos, titleYPos);
  
      doc.setFontSize(12);
      const date = `Fecha de emisión: ${new Date().toLocaleDateString('es-AR')}`;
      doc.text(date, 10, titleYPos + 20);
  
      const canvas = document.getElementById('barChart') as HTMLCanvasElement;
      if (canvas) {
        const chartImage = canvas.toDataURL('image/png');
        const chartXPos = 10; 
        const chartYPos = titleYPos + 30; 
        const chartWidth = width - 20;
        const chartHeight = (chartWidth * canvas.height) / canvas.width; 
  
       
        doc.addImage(chartImage, 'PNG', chartXPos, chartYPos, chartWidth, chartHeight);
      }
  
     
      doc.save('Estadisticas_Turnos.pdf');
    };
  }
  
  

  renderLineChart() {
    const labels = Object.keys(this.cantidadDeTurnosPorDia);
    const data = Object.values(this.cantidadDeTurnosPorDia);
    const ctx = document.getElementById('lineChart') as HTMLCanvasElement;
  
    if (this.lineChart) {
      this.lineChart.destroy();
    }
  
    this.lineChart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: labels,
        datasets: [
          {
            label: 'Cantidad de Turnos por Día',
            data: data,
            borderColor: '#0818bd',
            backgroundColor: 'rgba(8, 24, 189, 0.3)',
            borderWidth: 2,
            fill: true,
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'top',
            labels: {
              font: {
                size: 18,
              },
            },
          },
          title: {
            display: true,
            text: 'Cantidad de Turnos por Día',
            font: {
              size: 24,
            },
          },
        },
        scales: {
          x: {
            ticks: {
              font: {
                size: 22,
              },
            },
          },
          y: {
            ticks: {
              font: {
                size: 22,
              },
            },
          },
        },
      },
    });
  }
  
  exportarPdf1() {
    const doc = new jsPDF();
    const width = doc.internal.pageSize.getWidth();
    const height = doc.internal.pageSize.getHeight();
  
    const logo = new Image();
    logo.src = '../../../assets/imperiologdor.png';
  
    logo.onload = () => {
      const logoWidth = 100;
      const logoHeight = 50;
      const xPos = (width - logoWidth) / 2;
      const yPos = 10;
  
      doc.addImage(logo, 'PNG', xPos, yPos, logoWidth, logoHeight);
  
      const title = 'Estadísticas de cantidad de turnos por día';
      doc.setFontSize(18);
      const titleWidth = doc.getTextWidth(title);
      const titleXPos = (width - titleWidth) / 2;
      const titleYPos = yPos + logoHeight + 10;
      doc.text(title, titleXPos, titleYPos);
  
      const date = `Fecha de emisión: ${new Date().toLocaleDateString('es-AR')}`;
      doc.setFontSize(12);
      doc.text(date, 10, titleYPos + 20);
  
      const canvas = document.getElementById('lineChart') as HTMLCanvasElement;
      if (canvas) {
        const chartImage = canvas.toDataURL('image/png');
        const chartXPos = 10;
        const chartYPos = titleYPos + 30;
        const chartWidth = width - 20;
        const chartHeight = (chartWidth * canvas.height) / canvas.width;
  
        doc.addImage(chartImage, 'PNG', chartXPos, chartYPos, chartWidth, chartHeight);
      }
  
      doc.save('Estadisticas_Turnos_Dia.pdf');
    };
  }

  exportarPdf3() {
    const doc = new jsPDF();
    const width = doc.internal.pageSize.getWidth();
    const height = doc.internal.pageSize.getHeight();

    const logo = new Image();
    logo.src = '../../../assets/imperiologdor.png';

    logo.onload = () => {
        const logoWidth = 100;
        const logoHeight = 50;
        const xPos = (width - logoWidth) / 2;
        const yPos = 10;

        doc.addImage(logo, 'PNG', xPos, yPos, logoWidth, logoHeight);

        // Título del documento
        const title = 'Estadísticas de turnos finalizados por médico';
        doc.setFontSize(18);
        const titleWidth = doc.getTextWidth(title);
        const titleXPos = (width - titleWidth) / 2;
        const titleYPos = yPos + logoHeight + 10;
        doc.text(title, titleXPos, titleYPos);

        const date = `Fecha de emisión: ${new Date().toLocaleDateString('es-AR')}`;
        doc.setFontSize(12);
        doc.text(date, 10, titleYPos + 20);

        const canvas = document.getElementById('polarAreaChart') as HTMLCanvasElement;
        if (canvas) {
            const chartImage = canvas.toDataURL('image/png'); 
            const chartXPos = 10;
            const chartYPos = titleYPos + 30;
            const chartWidth = width - 20; 
            const chartHeight = (chartWidth * canvas.height) / canvas.width; 

            doc.addImage(chartImage, 'PNG', chartXPos, chartYPos, chartWidth, chartHeight);
        }

        doc.save('Estadisticas_Turnos_Medico.pdf');
    };
}

  crearGraficoPolarArea() {
    if (this.turnosPorFechaFin.length === 0) {
        console.warn("No hay datos para mostrar en el gráfico.");
        return;
    }
    console.log(this.cantidadDeTurnosFinalizadosPorMedico);
    
    const labels = Object.keys(this.cantidadDeTurnosFinalizadosPorMedico); // Usar la nueva propiedad
    const data = Object.values(this.cantidadDeTurnosFinalizadosPorMedico); // Valores correspondientes

    const ctx = document.getElementById('polarAreaChart') as HTMLCanvasElement; // Cambiar el ID del canvas
    if (ctx) {
        if (this.polarAreaChart) {
            this.polarAreaChart.destroy(); // Destruir gráfico previo si existe
        }

        this.polarAreaChart = new Chart(ctx, {
            type: 'polarArea', // Tipo del gráfico
            data: {
                labels: labels,
                datasets: [
                    {
                        data: data,
                        backgroundColor: [
                            '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40'
                        ],
                        hoverBackgroundColor: [
                            '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40'
                        ]
                    }
                ]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'top',
                        labels: {
                          font: {
                            size: 18 
                          }
                        }
                    },
                    title: {
                        display: true,
                        text: 'Turnos Finalizados por Médico', // Cambiar texto del título
                        font: {
                          size: 24 
                        }
                    }
                }
            }
        });
    }
}


  exportarPdf2() {
    const doc = new jsPDF();
    const width = doc.internal.pageSize.getWidth();
    const height = doc.internal.pageSize.getHeight();

    const logo = new Image();
    logo.src = '../../../assets/imperiologdor.png';

    logo.onload = () => {
        const logoWidth = 100;
        const logoHeight = 50;
        const xPos = (width - logoWidth) / 2;
        const yPos = 10;

        doc.addImage(logo, 'PNG', xPos, yPos, logoWidth, logoHeight);

        // Título del documento
        const title = 'Estadísticas de turnos solicitados por médico';
        doc.setFontSize(18);
        const titleWidth = doc.getTextWidth(title);
        const titleXPos = (width - titleWidth) / 2;
        const titleYPos = yPos + logoHeight + 10;
        doc.text(title, titleXPos, titleYPos);

        const date = `Fecha de emisión: ${new Date().toLocaleDateString('es-AR')}`;
        doc.setFontSize(12);
        doc.text(date, 10, titleYPos + 20);

        const canvas = document.getElementById('tortaChart') as HTMLCanvasElement;
        if (canvas) {
            const chartImage = canvas.toDataURL('image/png'); 
            const chartXPos = 10;
            const chartYPos = titleYPos + 30;
            const chartWidth = width - 20; 
            const chartHeight = (chartWidth * canvas.height) / canvas.width; 

            doc.addImage(chartImage, 'PNG', chartXPos, chartYPos, chartWidth, chartHeight);
        }

        doc.save('Estadisticas_Turnos_Medico.pdf');
    };
}

  
  DescargarLogs(){
    const usuarios = [...new Set([...this.pacientes, ...this.especialistas, ...this.administradores])];


    console.log(usuarios);

    const data:any[] = [];
    data.push(['Usuario','Correo','Rol','Fecha','Hora']);
    this.logs.forEach(log => {
      usuarios.forEach((user)=>{
        console.log(user.usuario.correo);
        if(log.userMail == user.usuario.correo){
          data.push([
            `${user.usuario.nombre} ${user.usuario.apellido}`,
            `${user.usuario.correo}`,
            `${user.usuario.rol}`,
            this.formatDate(log.fecha),
            this.formatHora(log.fecha)
          ])
        }
      })
    });


    const ws = XLSX.utils.aoa_to_sheet(data); 
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'LogsInicioDeSesion');
    XLSX.writeFile(wb, `LogsInicioDeSesion.xlsx`);
  }

  ngOnDestroy(): void {
    this.subAdministradores.unsubscribe();
    this.subEspecialidades.unsubscribe();
    this.subEspecialistas.unsubscribe();
    this.subPacientes.unsubscribe();
    this.subTurnos.unsubscribe();
    this.subLogs.unsubscribe();
  }
}
