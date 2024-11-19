import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import {jsPDF} from 'jspdf';
import { ObjectKeyValuePipe } from '../../core/pipes/object-key-value.pipe';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { StyleButtonDirective } from '../../core/directives/style-button.directive';
import html2canvas from "html2canvas";
import autoTable from 'jspdf-autotable'; // Importa el plugin aquí
@Component({
  selector: 'app-pdf-historia-clinica',
  standalone: true,
  imports: [ObjectKeyValuePipe,FormsModule,CommonModule,StyleButtonDirective],
  templateUrl: './pdf-historia-clinica.component.html',
  styleUrl: './pdf-historia-clinica.component.css'
})
export class PdfHistoriaClinicaComponent implements OnChanges{

@Input() paciente:any;


  ngOnChanges(changes: SimpleChanges): void {
    if(changes['paciente']){
      this.paciente = changes['paciente'].currentValue;
    }
  }


  downloadPDF(): void {
    if (!this.paciente) {
      console.error('No se encontró información del paciente.');
      return;
    }

    const doc = new jsPDF();
    const width = doc.internal.pageSize.getWidth();
    const height = doc.internal.pageSize.getHeight();

    const logo = new Image();
    logo.src = '../../../assets/imperiologdor.png';
    
    logo.onload = () => {
      // Calcular posición para centrar la imagen
      const logoWidth = 100;  // Ancho de la imagen
      const logoHeight = 50;  // Alto de la imagen
      const xPos = (width - logoWidth) / 2;  // Posición en X para centrar
      const yPos = 10;  // Espacio desde la parte superior de la página

      // Agregar la imagen centrada en la página
      doc.addImage(logo, 'PNG', xPos, yPos, logoWidth, logoHeight);

      // Título
      const title = 'Historia Clínica';
      doc.setFontSize(18);
      const titleWidth = doc.getTextWidth(title); // Obtén el ancho del título
      const titleXPos = (width - titleWidth) / 2; // Calcular la posición en X para centrar el texto
      const titleYPos = yPos + logoHeight + 10;  // Justo debajo de la imagen
      doc.text(title, titleXPos, titleYPos);

      // Datos del paciente
      doc.setFontSize(12);
      doc.text(`Nombre: ${this.paciente.usuario.nombre} ${this.paciente.usuario.apellido}`, 10, titleYPos + 20);
      doc.text(`Fecha: ${new Date().toLocaleDateString('es-AR')}`, 10, titleYPos + 30);

      // Validar si es paciente
      if (this.paciente.usuario.rol === 'Paciente') {
        doc.setFontSize(16);
        doc.text('Historia Clínica Detallada', 10, titleYPos + 40);

        // Crear una tabla
        const headers = ['Altura (cm)', 'Peso (kg)', 'Presión', 'Temperatura', 'Dato Extra 1', 'Dato Extra 2', 'Dato Extra 3'];
        const rows = this.paciente.usuario.historialClinico.map((historial: any) => [
          historial.altura || 'No tiene',
          historial.peso || 'No tiene',
          historial.presion || 'No tiene',
          historial.temperatura || 'No tiene',
          `${Object.keys(historial.campoDinamicoUno)}:${Object.values(historial.campoDinamicoUno)}` || 'No tiene',
          `${Object.keys(historial.campoDinamicoDos)}:${Object.values(historial.campoDinamicoDos)}` || 'No tiene',
          `${Object.keys(historial.campoDinamicoTres)}:${Object.values(historial.campoDinamicoTres)}` || 'No tiene'
        ]);

        autoTable(doc, {
          head: [headers],
          body: rows,
          startY: titleYPos + 50
        });
      }

      // Guardar el archivo
      doc.save(`historia_clinica_${this.paciente.usuario.nombre}.pdf`);
    };
  }

}
