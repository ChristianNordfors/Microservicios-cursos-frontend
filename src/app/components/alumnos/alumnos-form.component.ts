import { Component, OnInit } from '@angular/core';
import { Alumno } from 'src/app/models/alumno';
import { AlumnoService } from 'src/app/services/alumno.service';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonFormComponent } from '../common-form.component';

import Swal from 'sweetalert2';

@Component({
  selector: 'app-alumnos-form',
  templateUrl: './alumnos-form.component.html',
  styleUrls: ['./alumnos-form.component.css']
})
export class AlumnosFormComponent
  extends CommonFormComponent<Alumno, AlumnoService> implements OnInit {

  private fotoSeleccionada: File;

  inputFoto: string = 'Seleccionar foto';


  constructor(service: AlumnoService,
    router: Router,
    route: ActivatedRoute) {
    super(service, router, route);
    this.titulo = 'Crear alumno';
    this.model = new Alumno();
    this.redirect = '/alumnos';
    this.nombreModel = Alumno.name;
  }

  public seleccionarFoto(event): void {
    this.fotoSeleccionada = event.target.files[0];
    this.inputFoto = this.fotoSeleccionada.name;
    console.info(this.fotoSeleccionada);

    if (this.fotoSeleccionada.type.indexOf('image') < 0) {
      this.fotoSeleccionada = null;
      Swal.fire('Error al seleccionar la foto', 'El archivo debe ser una imagen', 'warning');
    }
  }

  public crear(): void {
    if (!this.fotoSeleccionada) {
      // Se invoca el metodo crear del padre que a su vez invoca el metodo crear del service
      super.crear();
    } else {
      this.service.crearConFoto(this.model, this.fotoSeleccionada)
        .subscribe(alumno => {
          console.log(alumno);
          this.inputFoto = 'Seleccionar Foto';
          Swal.fire('Crear', `${this.nombreModel} ${alumno.nombre} ${alumno.apellido} creado con éxito`, 'success');
          this.router.navigate([this.redirect]);
        }, err => {
          if (err.status === 400) {
            this.error = err.error;
            console.log(this.error);
          }
        });
    }

  }

  public editar(): void {
    if (!this.fotoSeleccionada) {
      // Se invoca el metodo editar del padre que a su vez invoca el metodo editar del service
      super.editar();
    } else {
      this.service.editarConFoto(this.model, this.fotoSeleccionada)
        .subscribe(alumno => {
          this.inputFoto = 'Seleccionar Foto';
          console.log(alumno);
          Swal.fire('Modificar', `${this.nombreModel} ${alumno.nombre} ${alumno.apellido} actualizado con éxito`, 'success');
          this.router.navigate([this.redirect]);
        }, err => {
          if (err.status === 400) {
            this.error = err.error;
            console.log(this.error);
          }
        });
    }

  }

}
