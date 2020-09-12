import { Component, OnInit } from '@angular/core';
import { CommonFormComponent } from '../common-form.component';
import { Examen } from 'src/app/models/examen';
import { ExamenService } from 'src/app/services/examen.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Asignatura } from 'src/app/models/asignatura';
import { Pregunta } from 'src/app/models/pregunta';

@Component({
  selector: 'app-examen-form',
  templateUrl: './examen-form.component.html',
  styleUrls: ['./examen-form.component.css']
})
export class ExamenFormComponent extends CommonFormComponent<Examen, ExamenService> implements OnInit {

  asignaturasPadre: Asignatura[] = [];

  asignaturasHija: Asignatura[] = [];

  errorPreguntas: string;


  constructor(service: ExamenService,
    router: Router,
    route: ActivatedRoute) {
    super(service, router, route);
    this.titulo = 'Crear examen';
    this.model = new Examen();
    this.nombreModel = Examen.name;
    this.redirect = '/examenes';
  }


  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id: number = +params.get('id');
      if (id) {
        this.service.ver(id).subscribe(m => {
          this.model = m;
          this.titulo = 'Editar ' + this.nombreModel.toLowerCase();
          /*
          this.service.findAllAsignatura().subscribe(asignaturas =>
            this.asignaturasHija = asignaturas
            .filter(a => a.padre && a.padre.id === this.model.asignaturaPadre.id));
            */
           // De esta manera se evita ir al backend y es menos costoso
           this.cargarHijos();
        });
      }
    });

    this.service.findAllAsignatura()
    .subscribe(asignaturas => 
      this.asignaturasPadre = asignaturas.filter(a => !a.padre));

  }

  public crear(): void {
    if(this.model.preguntas.length === 0){
      this.errorPreguntas = 'El examen debe contener al menos una pregunta';
      return;
    }
    this.errorPreguntas = undefined;
    this.eliminarPreguntasVacias();
    super.crear();
  }

  public editar(): void {
    if(this.model.preguntas.length === 0){
      this.errorPreguntas = 'El examen debe contener al menos una pregunta';
      return;
    }
    this.errorPreguntas = undefined;
    this.eliminarPreguntasVacias();
    super.editar();
  }

  cargarHijos(): void {
    this.asignaturasHija = this.model.asignaturaPadre? this.model.asignaturaPadre.hijos : [];
  }

  compararAsignatura(a1: Asignatura, a2: Asignatura): boolean {
    // Ya que angular es asincrono puede haber un lapsus de tiempo en el que estos objetos sean indefinidos y mientras no se carguen va a seguir insistiendo 
    // y cuando se carguen va a ir comparando. Esto es para asegurarse que no muestre un error en la consola

    if(a1 === undefined && a2 === undefined) {
      // true para que no de error
      return true;
    }

    return a1 == null || a2 == null? false : a1.id === a2.id;


    // if(a1 === null || a2 === null || a1 === undefined || a2 === undefined) {
    //   return false;
    // }

    // if(a1.id === a2.id) {
    //   return true;
    // }

  }

  agregarPregunta(): void {
    this.model.preguntas.push(new Pregunta());
  }

  asignarTexto(pregunta: Pregunta, event: any): void {
    // event contiene el texto que se escribe en el input. target es el input. value el valor de lo que se escribe
    // Y se lo asigna a la pregunta.texto
    pregunta.texto = event.target.value as string;
    console.log(this.model);
  }


  eliminarPregunta(pregunta): void {
    this.model.preguntas = this.model.preguntas.filter(p => pregunta.id !== p.id);
  }

  eliminarPreguntasVacias(): void {
    this.model.preguntas = this.model.preguntas.filter(p => p.texto != null && p.texto.length > 0);
  }
}
