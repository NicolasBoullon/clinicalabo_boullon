import { Component, ComponentRef, OnDestroy, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';
import { MatDialog } from '@angular/material/dialog';
import { SpinnerComponent } from '../../shared/spinner/spinner.component';
import { FormsModule } from '@angular/forms';
import { CommonModule, formatDate } from '@angular/common';
import { EspecialistasService } from '../../core/services/especialistas.service';
import { FirestoreService } from '../../core/services/firestore.service';
import { Subscription } from 'rxjs';
import { jsPDF} from 'jspdf';
import { StyleButtonDirective } from '../../core/directives/style-button.directive';
import { ObjectKeyValuePipe } from '../../core/pipes/object-key-value.pipe';
import { PdfHistoriaClinicaComponent } from '../../shared/pdf-historia-clinica/pdf-historia-clinica.component';
import { TurnosService } from '../../core/services/turnos.service';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-mi-perfil',
  standalone: true,
  imports: [SpinnerComponent,CommonModule,StyleButtonDirective,ObjectKeyValuePipe,PdfHistoriaClinicaComponent,FormsModule],
  templateUrl: './mi-perfil.component.html',
  styleUrl: './mi-perfil.component.css'
})
export class MiPerfilComponent implements OnInit,OnDestroy{
[x: string]: any;

  @ViewChild('pdfContainer', { read: ViewContainerRef }) pdfContainer!: ViewContainerRef;
  private pdfComponentRef!: ComponentRef<PdfHistoriaClinicaComponent>;

  showSpinner:boolean = true;
  perfil!:any;
  horariosRef:any;
  turnos30 = ['08:00','08:30','09:00','09:30','10:00','10:30','11:00','11:30','12:00','12:30',
    '13:00','13:30','14:00','14:30','15:00','15:30','16:00','16:30','17:00','17:30','18:00','18:30','19:00'];
  turnos60 = ['08:00','09:00','10:00','11:00','12:00','13:00','14:00','15:00','16:00','17:00','18:00','19:00'];
  turnos30sabado =['08:00','08:30','09:00','09:30','10:00','10:30','11:00','11:30','12:00','12:30',
    '13:00','13:30','14:00'];
  turnos60sabado = ['08:00','09:00','10:00','11:00','12:00','13:00','14:00']
  turnosLunes!:any;
  turnosMartes!:any;
  turnosMiercoles!:any;
  turnosJueves!:any;
  turnosViernes!:any;
  turnosSabado!:any;

  turnosHastaLunes!:any;
  turnosHastaMartes!:any;
  turnosHastaMiercoles!:any;
  turnosHastaJueves!:any;
  turnosHastaViernes!:any;
  turnosHastaSabado!:any;

  lunesActivado:boolean = false;
  martesActivado:boolean = false;
  miercolesActivado:boolean = false;
  juevesActivado:boolean = false;
  viernesActivado:boolean = false;
  sabadoActivado:boolean = false;

  huboCambios:boolean = false;

  sub!:Subscription;
  subTurnos!:Subscription;
  turnos:any[] =[];
  turnosFiltradosPaciente:any[]=[];
  especialistasAtendieronPaciente:any[]=[];
  wait!:Promise<boolean>;
  especialistaSeleccionado!:any;
  turnosConEspecialistaSeleccionado:any[] = [];
    // turno60sabado = ['08:00','09:00','10:00','11:00','12:00','13:00','14:00'];
    // turnos30sabado = ['08:00','08:30','09:00','09:30','10:00','10:30','11:00','11:30','12:00','12:30',
    //   '13:00','13:30','14:00'];
  constructor(private authService:AuthService,private _matDialog:MatDialog,private especialistaService:EspecialistasService,
    private firestoreService:FirestoreService,private turnosService:TurnosService,private firestore:FirestoreService){}
  ngOnInit(): void {
    setTimeout(() => {
      // this.abrirSpinner();
      this.GetUser();
    }, 1000);
  }

  GenerarPdf(){
    const doc = new jsPDF();
    const fecha = new Date().toDateString();
    const imgLogo = 'assets/imperiologodor.png';
    doc.text('Clinica Boullon',20,50);
    // doc.addImage(imgLogo,'JPEG',)
    doc.save('historial_clinica.pdf');
  }

  async GetUser(){
    // this.perfil = this.authService.usuarioConectado;
    this.authService.GetUserPerfilCompleto()
    .then(resp=>{
      if(resp){
        this.perfil = resp;

        console.log(this.perfil);
        if(this.perfil.usuario.rol == 'Especialista'){
         this.sub =  this.especialistaService.GetEspecialista(this.perfil.uid)
          .subscribe({
            next:(resp:any)=>{
              console.log(resp);
              this.perfil = resp;
              this.SetHorarios(resp);
              this.wait = Promise.resolve(true);

            }
          })
          
        }else if(this.perfil.usuario.rol == 'Paciente'){
        
          this.GetTurnos();
          this.wait = Promise.resolve(true);

        }
        
        console.log('nice');
        this.showSpinner = false;
      }else{
        console.log(resp);
      }
      // this.cerrarSpinner();
    })
    .catch(err=>{
      console.log(err);
      
    })

    // this.cerrarSpinner();
  }

  async GetTurnos(){
    this.subTurnos = this.firestore.getCollectionOrderedByDate('turnos','dia').subscribe({
      next:((value)=>{
        this.turnos = value;
        this.FiltrarTurnosConPaciente(value);
      })
    })
  }
  FiltrarTurnosConPaciente(turnos:any){ 
    const especialistas:any[] = [];
    turnos.forEach((turno:any) => {
      if(turno.paciente.correo == this.perfil.usuario.correo){
        this.turnosFiltradosPaciente.push(turno);
        if(!especialistas.includes(`${turno.especialista.nombre} ${turno.especialista.apellido}`)){
          this.especialistasAtendieronPaciente.push(turno.especialista);
          especialistas.push(`${turno.especialista.nombre} ${turno.especialista.apellido}`);
        }
      }
    });

    console.log(this.especialistasAtendieronPaciente);
  }

  SeleccionoEspecialista(){
    console.log(this.especialistaSeleccionado);
    this.turnosConEspecialistaSeleccionado = this.turnosFiltradosPaciente.filter((turno:any)=> turno.especialista.correo == this.especialistaSeleccionado.correo);
  }

  DescargarAtenciones(){
    this.turnosConEspecialistaSeleccionado
    
    const data: any[] = [];

    data.push([`Atenciones de: ${this.turnosConEspecialistaSeleccionado[0].especialista.nombre} ${this.turnosConEspecialistaSeleccionado[0].especialista.apellido}`]);

    let flagPend:boolean = false;
    this.turnosConEspecialistaSeleccionado.forEach((turno:any) => {
        if(turno.estado == 'pendiente'){
          if(!flagPend){
            data.push([]);
            data.push(['Pendientes'])
            data.push([
              'Especialidad', 'Dia', 'Horario',
            ]);
          }
          data.push([
            turno.especialidad,this.formatDate(turno.dia),turno.horario
          ])
        }
    });
    
    let flagAcep:boolean = false;
    this.turnosConEspecialistaSeleccionado.forEach((turno:any) => {
      if(turno.estado == 'aceptado'){
        if(!flagAcep){
          data.push([]);
          data.push(['Aceptados'])
          data.push([
            'Especialidad', 'Dia', 'Horario',
          ]);
        }
        data.push([
          turno.especialidad,this.formatDate(turno.dia),turno.horario
        ])
      }
    });

    let flagCanc:boolean= false;
    this.turnosConEspecialistaSeleccionado.forEach((turno:any) => {
      if(turno.estado == 'cancelado'){
        if(!flagCanc){
          data.push([]);
          data.push(['Cancelados'])
          data.push([
            'Especialidad', 'Dia', 'Horario','Razon Cancelado'
          ]);
        }
        flagCanc = true;
          data.push([
            turno.especialidad,this.formatDate(turno.dia),turno.horario,turno.comentarioCancelarTurno
          ])
        }
    });


    let flagRech:boolean = false;
    this.turnosConEspecialistaSeleccionado.forEach((turno:any) => {
      if(turno.estado == 'rechazado'){
        if(!flagRech){
          data.push([]);
          data.push(['Rechazados'])
          data.push([
            'Especialidad', 'Dia', 'Horario','Razon Rechazado'
          ]);
        }
        flagRech = true;
        data.push([
          turno.especialidad,this.formatDate(turno.dia),turno.horario,turno.comentarioCancelado
        ])
      }
    });

    let flagFin:boolean = false;
    this.turnosConEspecialistaSeleccionado.forEach((turno:any) => {
      if(turno.estado == 'finalizado'){
        if(!flagFin){
          data.push([]);
          data.push(['Finalizados'])
          data.push([
            'Especialidad', 'Dia', 'Horario','Diagnostico'
          ]);
        }
        flagFin = true;
        data.push([
          turno.especialidad,this.formatDate(turno.dia),turno.horario,turno.diagnostico
        ])
      }
    });



    const ws = XLSX.utils.aoa_to_sheet(data); 
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Turnos');
    XLSX.writeFile(wb, `TurnosDe${this.perfil.usuario.nombre}${this.perfil.usuario.apellido}Especialista${this.especialistaSeleccionado.apellido}.xlsx`);

  }



  formatDate(timestamp: { seconds: number, nanoseconds: number }): string {
    const date = new Date(timestamp.seconds * 1000); 
    
    return formatDate(date, 'dd MMMM yyyy', 'es-AR');
    // return formatDate(date, 'dd MMM yyyy, h:mm a', 'en-US');
  }

  CambiarHorarios(especialidad:string,evento:Event){
    const selectedValue = (evento.target as HTMLSelectElement).value;
    console.log(selectedValue);
    console.log(especialidad);
    console.log(this.perfil);
    let perfilNuevo = this.perfil;
    if(perfilNuevo.usuario.lunes.dias.especialidad == especialidad){
      perfilNuevo.usuario.lunes.dias.hora = selectedValue;
    }
    if(perfilNuevo.usuario.martes.dias.especialidad == especialidad){
      perfilNuevo.usuario.martes.dias.hora = selectedValue;
    }
    if(perfilNuevo.usuario.miercoles.dias.especialidad == especialidad){
      perfilNuevo.usuario.miercoles.dias.hora = selectedValue;
    }
    if(perfilNuevo.usuario.jueves.dias.especialidad == especialidad){
      perfilNuevo.usuario.jueves.dias.hora = selectedValue;
    }
    if(perfilNuevo.usuario.viernes.dias.especialidad == especialidad){
      perfilNuevo.usuario.viernes.dias.hora = selectedValue;
    }
    if(perfilNuevo.usuario.sabado.dias.especialidad == especialidad){
      perfilNuevo.usuario.sabado.dias.hora = selectedValue;
    }
    this.firestoreService.updateDocument('especialistas',this.perfil.uid,this.perfil);
  }

  MostrarHorarios(esp:any){
    const especialidadesElegiedasCabeceras = document.getElementsByClassName('especialidad-seleccionada') as HTMLCollectionOf<HTMLSelectElement>;
    const arrayCabeceras:any = [];
    for (let i = 0; i < especialidadesElegiedasCabeceras.length; i++) {
      arrayCabeceras.push(especialidadesElegiedasCabeceras[i].value);
    }
    if(arrayCabeceras.includes(esp)){
      return true;
    }else{
      return false;
    }
  }

  SetHorarios(especialista:any){
    const especialidadesElegiedasCabeceras = document.getElementsByClassName('especialidad-seleccionada') as HTMLCollectionOf<HTMLSelectElement>;
    console.log(especialidadesElegiedasCabeceras,'xD');
    
    const selectDesdeElements = document.getElementsByClassName('select-horarios-desde') as HTMLCollectionOf<HTMLSelectElement>;
    const selectHastaElements = document.getElementsByClassName('select-horarios-hasta') as HTMLCollectionOf<HTMLSelectElement>;

    setTimeout(() => {
      console.log(especialidadesElegiedasCabeceras);
      console.log(especialista.usuario.lunes.dias.especialidad);
      especialidadesElegiedasCabeceras[0].value = especialista.usuario.lunes.dias.especialidad;
      especialidadesElegiedasCabeceras[1].value = especialista.usuario.martes.dias.especialidad;
      especialidadesElegiedasCabeceras[2].value = especialista.usuario.miercoles.dias.especialidad;
      especialidadesElegiedasCabeceras[3].value = especialista.usuario.jueves.dias.especialidad;
      especialidadesElegiedasCabeceras[4].value = especialista.usuario.viernes.dias.especialidad;
      especialidadesElegiedasCabeceras[5].value = especialista.usuario.sabado.dias.especialidad;
    }, 2000);

    //Esto setea los turnos dependiendo de si son turnos de 30 o 60 min
    this.turnosLunes = this.generarTurnos(especialista.usuario.lunes);
    this.turnosMartes = this.generarTurnos(especialista.usuario.martes);
    this.turnosMiercoles = this.generarTurnos(especialista.usuario.miercoles);
    this.turnosJueves = this.generarTurnos(especialista.usuario.jueves);    
    this.turnosViernes = this.generarTurnos(especialista.usuario.viernes);
    this.turnosSabado = this.generarTurnosSabado(especialista.usuario.sabado);


    this.turnosHastaLunes = this.turnosLunes;
    this.turnosHastaMartes = this.turnosMartes;
    this.turnosHastaMiercoles = this.turnosMiercoles;
    this.turnosHastaJueves = this.turnosJueves;
    this.turnosHastaViernes = this.turnosViernes;
    this.turnosHastaSabado = this.turnosSabado;
    // console.log(especialista.usuario.lunes.dias);
    // console.log(especialista.usuario.lunes.horarios);



    // console.log(selectDesdeElements);
    
    //Setea si ya tenia los turnos programados.
    setTimeout(() => {

        selectDesdeElements[0].value = especialista.usuario.lunes.horarios.desde;
        selectHastaElements[0].value = especialista.usuario.lunes.horarios.hasta;
 
      selectDesdeElements[1].value = especialista.usuario.martes.horarios.desde;
      selectHastaElements[1].value = especialista.usuario.martes.horarios.hasta;
 
      selectDesdeElements[2].value = especialista.usuario.miercoles.horarios.desde;
      selectHastaElements[2].value = especialista.usuario.miercoles.horarios.hasta;
 
      selectDesdeElements[3].value = especialista.usuario.jueves.horarios.desde;
      selectHastaElements[3].value = especialista.usuario.jueves.horarios.hasta;
 

        selectDesdeElements[4].value = especialista.usuario.viernes.horarios.desde;
        selectHastaElements[4].value = especialista.usuario.viernes.horarios.hasta;
 
      selectDesdeElements[5].value = especialista.usuario.sabado.horarios.desde;
      selectHastaElements[5].value = especialista.usuario.sabado.horarios.hasta;
    }, 1500);

    // console.log(select3060horarios,"horarios3060");

    // select3060horarios.forEach((select: any) => {
    //   console.log(select.id);
    // });

    setTimeout(() => {
      const select3060horarios:any = document.getElementsByClassName('slc-horarios');
      for (let i = 0; i < select3060horarios.length; i++) {
          console.log(select3060horarios[i]);
        
          if(especialista.usuario.lunes.dias.especialidad == select3060horarios[i].id){            
            select3060horarios[i].value = especialista.usuario.lunes.dias.hora;
            console.log(especialista.usuario.lunes.dias.hora);
             
          }
          if(especialista.usuario.martes.dias.especialidad == select3060horarios[i].id){            
            select3060horarios[i].value = especialista.usuario.martes.dias.hora; 
          }
          if(especialista.usuario.miercoles.dias.especialidad == select3060horarios[i].id){            
            select3060horarios[i].value = especialista.usuario.miercoles.dias.hora; 
          }
          if(especialista.usuario.jueves.dias.especialidad == select3060horarios[i].id){            
            select3060horarios[i].value = especialista.usuario.jueves.dias.hora; 
          }
          if(especialista.usuario.viernes.dias.especialidad == select3060horarios[i].id){            
            select3060horarios[i].value = especialista.usuario.viernes.dias.hora; 
          }
          if(especialista.usuario.sabado.dias.especialidad == select3060horarios[i].id){            
            select3060horarios[i].value = especialista.usuario.sabado.dias.hora; 
          }

      }
    }, 2500);
  }

  generarTurnos(dia: any): string[] {
    const intervalo = dia.dias.hora; 
    
    console.log('hola cambiando  turnos?');
    
    return intervalo === '30' ? this.turnos30 : this.turnos60;
  }

  generarTurnosSabado(dia:any):string[]{
    const intervalo = dia.dias.hora; 
    
    
    return intervalo === '30' ? this.turnos30sabado : this.turnos60sabado;
  }

  Cambio(){
    this.huboCambios = true;

  }

  async CambiarDesde(dia:string,evento:Event){
    const selectedValue = (evento.target as HTMLSelectElement).value;
    this.huboCambios = true;
    if (dia === 'lunes') {
      console.log(selectedValue);
      this.turnosHastaLunes = [...this.turnosLunes];
      const index = this.turnosHastaLunes.indexOf(selectedValue);
      if (index !== -1) {
        this.turnosHastaLunes = this.turnosHastaLunes.slice(index + 1);
      }
      console.log(this.turnosHastaLunes);
      this.lunesActivado = true;
    }
  
    if (dia === 'martes') {
      console.log(selectedValue);
      this.turnosHastaMartes = [...this.turnosMartes];
      const index = this.turnosHastaMartes.indexOf(selectedValue);
      if (index !== -1) {
        this.turnosHastaMartes = this.turnosHastaMartes.slice(index + 1);
      }
      console.log(this.turnosHastaMartes);
      this.martesActivado = true;

    }
  
    if (dia === 'miercoles') {
      console.log(selectedValue);
      this.turnosHastaMiercoles = [...this.turnosMiercoles];
      const index = this.turnosHastaMiercoles.indexOf(selectedValue);
      if (index !== -1) {
        this.turnosHastaMiercoles = this.turnosHastaMiercoles.slice(index + 1);
      }
      this.miercolesActivado = true;

      console.log(this.turnosHastaMiercoles);
    }
  
    if (dia === 'jueves') {
      console.log(selectedValue);
      this.turnosHastaJueves = [...this.turnosJueves];
      const index = this.turnosHastaJueves.indexOf(selectedValue);
      if (index !== -1) {
        this.turnosHastaJueves = this.turnosHastaJueves.slice(index + 1);
      }
      console.log(this.turnosHastaJueves);
      this.juevesActivado = true;

    }
  
    if (dia === 'viernes') {
      console.log(selectedValue);
      this.turnosHastaViernes = [...this.turnosViernes];
      const index = this.turnosHastaViernes.indexOf(selectedValue);
      if (index !== -1) {
        this.turnosHastaViernes = this.turnosHastaViernes.slice(index + 1);
      }
      console.log(this.turnosHastaViernes);
      this.viernesActivado = true;

    }
  
    if (dia === 'sabado') {
      console.log(selectedValue);
      this.turnosHastaSabado = [...this.turnosSabado];
      const index = this.turnosHastaSabado.indexOf(selectedValue);
      if (index !== -1) {
        this.turnosHastaSabado = this.turnosHastaSabado.slice(index + 1);
      }
      console.log(this.turnosHastaSabado);
      this.sabadoActivado = true;
    }
  }

  async GuardarCambios(){
    this.huboCambios = false;
    this.abrirSpinner();
    const horariosPorEspecialidad = this.GetValuesHorarios();
    horariosPorEspecialidad.forEach(async (diaYesp:any)=>{
      await this.firestoreService.updateDocumentField('especialistas',this.perfil.uid,`usuario.${diaYesp.dia}.dias.especialidad`,diaYesp.especialidad);

    })
    
    const diasYhora = this.GetValuesSelect();
    diasYhora.forEach(async (horario:any)=>{
     await this.firestoreService.updateDocumentField('especialistas',this.perfil.uid,`usuario.${horario.dia}.horarios.desde`,horario.desde);
     await this.firestoreService.updateDocumentField('especialistas',this.perfil.uid,`usuario.${horario.dia}.horarios.hasta`,horario.hasta);
    })
    
    setTimeout(() => {
      this.cerrarSpinner();
    }, 2500);

  }

  GetValuesHorarios(){

    const selectHorariosPorEsp = document.getElementsByClassName('especialidad-seleccionada') as HTMLCollectionOf<HTMLSelectElement>;
    
    const diasEspecialidad:any = [];
    console.log(diasEspecialidad);

    for (let i = 0; i < selectHorariosPorEsp.length; i++) {
      const esp = selectHorariosPorEsp[i].value;
  
      diasEspecialidad.push({
        dia:selectHorariosPorEsp[i].name,
        especialidad:esp,
      })
    }
    return diasEspecialidad;
  }


  GetValuesSelect(){
    const selectDesdeElements = document.getElementsByClassName('select-horarios-desde') as HTMLCollectionOf<HTMLSelectElement>;
    const selectHastaElements = document.getElementsByClassName('select-horarios-hasta') as HTMLCollectionOf<HTMLSelectElement>;
    console.log(selectDesdeElements);
    
    const horariosSeleccionados: { dia: string, desde: string, hasta: string }[] = [];
    

    for (let i = 0; i < selectDesdeElements.length; i++) {
        const selectDesdeValue = selectDesdeElements[i].value;
        const selectHastaValue = selectHastaElements[i].value;
      console.log(selectHastaElements[i].name);
      
        horariosSeleccionados.push({
            dia: selectDesdeElements[i].name, 
            desde: selectDesdeValue,
            hasta: selectHastaValue
        });
    }
    console.log(horariosSeleccionados);
    return horariosSeleccionados;
  }


  ngOnDestroy(): void {
    if(this.sub){
      this.sub.unsubscribe();
    }
  } 

  abrirSpinner(){
    this._matDialog.open(SpinnerComponent);
  }
  cerrarSpinner(){
    this._matDialog.closeAll();
  }
}
