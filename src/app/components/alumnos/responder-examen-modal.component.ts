import { Component, Inject, OnInit } from '@angular/core';
import { Alumno } from 'src/app/models/alumno';
import { Curso } from 'src/app/models/curso';
import { Examen } from 'src/app/models/examen';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Pregunta } from 'src/app/models/pregunta';
import { Respuesta } from 'src/app/models/respuesta';

@Component({
  selector: 'app-responder-examen-modal',
  templateUrl: './responder-examen-modal.component.html',
  styleUrls: ['./responder-examen-modal.component.css']
})
export class ResponderExamenModalComponent implements OnInit {

  curso: Curso;
  alumno: Alumno;
  examen: Examen;

  // va a contener el id de la pregunta y la respuesta -> number, Respuesta
  respuestas: Map<number, Respuesta> = new Map<number, Respuesta>();

  // Con @Inject(MAT_DIALOG_DATA) se inyectan los datos del .open de ResponderExamenComponente
  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
              public modalRef: MatDialogRef<ResponderExamenModalComponent>) { }

  ngOnInit(): void {
    this.curso = this.data.curso as Curso;
    this.alumno = this.data.alumno as Alumno;
    this.examen = this.data.examen as Examen;
  }

  cancelar(): void {
    this.modalRef.close();
  }

  responder(pregunta: Pregunta, event): void {
    const texto = event.target.value as string;
    const respuesta = new Respuesta();
    respuesta.alumno = this.alumno;
    respuesta.pregunta = pregunta;

    // Para evitar error de recursividad entre respuesta y examen//////
    const examenS = new Examen();
    examenS.id = this.examen.id;
    examenS.nombre = this.examen.nombre;
    ///////////////////////////////////////////

    respuesta.pregunta.examen = examenS;
    respuesta.texto = texto;

    // Se pasa el id de la pregunta para modificar la respuesta en ese elemento del mapa antes de enviar, se sobreescribe la respuesta anterior pero antes de enviar en ese elemento del mapa
    this.respuestas.set(pregunta.id, respuesta);

    console.log(this.respuestas);
  }

}
