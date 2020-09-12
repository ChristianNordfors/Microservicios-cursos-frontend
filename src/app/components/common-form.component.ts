import { OnInit, Directive } from '@angular/core';
// import { Alumno } from 'src/app/models/alumno';
// import { AlumnoService } from 'src/app/services/alumno.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Generic } from '../models/generic';
import { CommonService } from '../services/common.service';

import Swal from 'sweetalert2';

@Directive()
export class CommonFormComponent<E extends Generic, S extends CommonService<E>> implements OnInit {

  public titulo: string;

  model: E;

  // any porque en el back esta como un map
  error: any;

  protected redirect: string;
  protected nombreModel: string;
  

  constructor(protected service: S,
              protected router: Router,
              protected route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id: number = +params.get('id');
      if (id) {
        this.service.ver(id).subscribe(m => {
          this.model = m;
          this.titulo = 'Editar ' + this.nombreModel.toLowerCase();
        });
      }
    });

  }

  public crear(): void{
    this.service.crear(this.model).subscribe(m => {
      console.log(m);
      Swal.fire('Crear', `${this.nombreModel} ${m.nombre} ${m.apellido? m.apellido : ''} creado con éxito`, 'success');
      this.router.navigate([this.redirect]);
    }, err => {
      if(err.status === 400){
        this.error = err.error;
        console.log(this.error);
      }
    });
  }

  public editar(): void{
    this.service.crear(this.model).subscribe(m => {
      console.log(m);
      Swal.fire('Alumno modificado', `${this.nombreModel} ${m.nombre} ${m.apellido? m.apellido : ''} actualizado con éxito.`, 'success');
      this.router.navigate([this.redirect]);
    }, err => {
      if(err.status === 400){
        this.error = err.error;
        console.log(this.error);
      }
    });
  }

}
